<?php

namespace App\Http\Controllers;

use App\Models\Ahli;
use App\Models\Article;
use App\Models\Komentar;
use App\Models\Konsultasi;
use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;
use App\Models\Notification;

class PenggunaController extends Controller
{


    public function BerandaShow()
    {
        $user = Auth::user();
    
        $experts = User::with('ahli')
            ->where('role', 'ahli')
            ->latest()
            ->take(3)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->nama,
                    'image' => $user->foto, // pastikan URL valid
                    'specialty' => $user->ahli?->nama_spesialisasi ?? '-',
                    'specialty_description' => $user->ahli?->deskripsi_spesialisasi ?? 'Deskripsi belum tersedia.',
                    'email' => $user->email,
                    'jk' => $user->jk,
                    'telp' => $user->telp,
                    'tgl_lahir' => $user->tgl_lahir,
                    'pengalaman' => $user->pengalaman,
                ];
            });
    
        $artikels = Article::latest()->take(3)->get()->map(function ($artikel) {
            return [
                'id' => $artikel->id,
                'title' => $artikel->judul,
                'image' => $artikel->foto,
                'date' => $artikel->created_at->toDateString(),
                'excerpt' => Str::limit(strip_tags($artikel->deskripsi), 100, '...'),
            ];
        });
    
        return Inertia::render('pengguna/Landing', [
            'user' => $user,
            'articles' => $artikels,
            'experts' => $experts,
        ]);
    }
    

    public function ListArtikelShow()
    {
        $user = Auth::user();
        $artikels = Article::latest()->get()->map(function ($artikel) {
            return [
                'id' => $artikel->id,
                'title' => $artikel->judul,
                'image' => $artikel->foto, // pastikan file foto disimpan di storage
                'date' => $artikel->created_at->toDateString(),
                'excerpt' => Str::limit(strip_tags($artikel->deskripsi), 100, '...'),
            ];
        });

        return Inertia::render('pengguna/Articles',[
            'user' => $user,
            'articles' => $artikels,
        ]);
    }

    
    
    public function DetailArtikelShow($id)
    {
        $user = Auth::user();
    
        $artikel = Article::findOrFail($id);
    
        $article = [
            'id' => $artikel->id,
            'title' => $artikel->judul,
            'image' => $artikel->foto,
            'date' => $artikel->created_at->toDateString(),
            'content' => $artikel->deskripsi,
        ];
    
        // Ambil komentar terkait artikel beserta user-nya
        $komentars = $artikel->komentars()->with('user')->latest()->get()->map(function ($komentar) {
            return [
                'id' => $komentar->id,
                'user' => $komentar->user->nama ?? 'Anonim',
                'avatar' => '/placeholder.svg?height=40&width=40', // ganti kalau kamu punya avatar beneran
                'content' => $komentar->komentar,
                'date' => $komentar->created_at->toDateString(),
            ];
        });
    
        return Inertia::render('pengguna/Articles-Detail', [
            'user' => $user,
            'article' => $article,
            'comments' => $komentars,
        ]);
    }
    

    public function AhliHerbalShow()
    {
        $user = Auth::user();
        $experts = User::with('ahli')
            ->where('role', 'ahli')
            ->latest()
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->nama,
                    'image' => $user->foto, // pastikan URL valid
                    'specialty' => $user->ahli?->nama_spesialisasi ?? '-',
                    'specialty_description' => $user->ahli?->deskripsi_spesialisasi ?? 'Deskripsi belum tersedia.',
                    'email' => $user->email,
                    'jk' => $user->jk,
                    'telp' => $user->telp,
                    'tgl_lahir' => $user->tgl_lahir,
                    'pengalaman' => $user->pengalaman,
                ];
            });

            $spesialisasiList = Ahli::select('id', 'nama_spesialisasi')->get();
           

        return Inertia::render('pengguna/List-Ahli-Herbal',[
            'user' => $user,
            'experts' => $experts,
            'spesialisasiList' => $spesialisasiList,

        ]);
    }


    public function PesanShow()
{
    $user = Auth::user();


    $konsultasis = $user->role === 'pengguna'
        ? $user->konsultasiSebagaiPengguna()->where('status', 'diterima')->with(['ahli', 'messages.sender'])->get()
        : $user->konsultasiSebagaiAhli()->where('status', 'diterima')->with(['pengguna', 'messages.sender'])->get();

    $chatList = $konsultasis->map(function ($k) use ($user) {
        $other = $user->role === 'pengguna' ? $k->ahli : $k->pengguna;

        return [
            'id' => $k->id,
            'expertName' => $other->nama,
            'avatar' => $other->foto ? $other->foto : '/placeholder.svg',
            'lastMessage' => $k->keluhan,
        ];
    });


    // Ambil pesan2 per konsultasi
    $chatMessages = [];
    foreach ($konsultasis as $k) {
        $chatMessages[$k->id] = $k->messages->map(function ($msg) use ($user) {
            return [
                'id' => $msg->id,
                'sender' => $msg->sender_id === $user->id ? 'user' : 'expert',
                'sender_id' => $msg->sender_id,
                'content' => $msg->message,
                'image' => $msg->image,
                'time' => $msg->created_at->format('H:i'),
            ];
        });
    }

    return Inertia::render('pengguna/Pesan', [
        'chatList' => $chatList,
        'chatMessages' => $chatMessages,
        'user' => $user,

    ]);
}

public function KirimPesan(Request $request)
{
    try {
        $request->validate([
            'consultation_id' => 'required|exists:konsultasis,id',
            'message' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $user = Auth::user();
        $konsultasi = Konsultasi::with(['pengguna', 'ahli'])->findOrFail($request->consultation_id);
        
        // Verify user is part of this consultation
        if ($user->id !== $konsultasi->pengguna_id && $user->id !== $konsultasi->ahli_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $data = [
            'konsultasi_id' => $request->consultation_id,
            'sender_id' => $user->id,
        ];

        if ($request->filled('message')) {
            $data['message'] = $request->message;
        }

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('chat-images', 'public');
            $data['image'] = '/storage/' . $imagePath;
        }

        Message::create($data);

        // Create notification for the other user
        $recipientId = $user->id === $konsultasi->pengguna_id ? $konsultasi->ahli_id : $konsultasi->pengguna_id;
        $recipient = User::find($recipientId);
        $senderName = $user->nama;

        Notification::create([
            'user_id' => $recipientId,
            'type' => 'new_message',
            'title' => 'Pesan Baru',
            'message' => "Pesan baru di konsultasi dengan {$senderName}",
            'related_id' => $konsultasi->id,
            'is_read' => false,
        ]);

        return redirect()->back()
            ->with('success', 'Pesan berhasil dikirim.')
            ->with('selected_chat', $request->consultation_id);
    } catch (\Exception $e) {
        \Log::error('Error sending message: ' . $e->getMessage());
        return redirect()->back()
            ->with('error', 'Gagal mengirim pesan. Silakan coba lagi.');
    }
}







    public function KomentarStore(Request $request)
{
    $request->validate([
        'article_id' => 'required|string|exists:articles,id',
        'komentar' => 'required|string|max:1000',
    ]);

    $user = Auth::user();

    Komentar::create([
        'user_id' => $user->id,
        'article_id' => $request->article_id,
        'komentar' => $request->komentar,
    ]);

    // Redirect agar Inertia bisa re-render halaman
    return redirect()->route('detail-artikel', $request->article_id);
}

public function Profile(){
    $user = Auth::user();
    $userMe = [
        'name' => $user->nama,
        'email' => $user->email,
        'phone' => $user->telp,
        'photo' => $user->foto,
        'birthDate' => $user->tgl_lahir,
        'gender' => $user->jk
    ];
    
    return Inertia::render('pengguna/Profile',[
        'user' => $user,
        'userMe' => $userMe
    ]);
}

public function EditProfileShow(){
    $user = Auth::user();
    return Inertia::render('pengguna/Edit-Profile',[
        'user' => $user,
    ]);
}

public function updateProfile(Request $request)
{
    $user = Auth::user();

    $validated = $request->validate([
        'nama'       => 'required|string|max:255',
        'email'      => 'required|email|max:255|unique:users,email,' . $user->id,
        'telp'       => 'nullable|string|max:20',
        'tgl_lahir'  => 'nullable|date',
        'jk'         => 'nullable|in:laki-laki,perempuan',
        'foto'       => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
    ]);

    // Jika ada file baru, hapus foto lama dan simpan yang baru
    if ($request->hasFile('foto')) {
        // Hapus foto lama jika ada
        if ($user->foto && Storage::disk('public')->exists(str_replace('/storage/', '', $user->foto))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $user->foto));
        }

        // Simpan foto baru
        $fotoPath = $request->file('foto')->store('foto-profil', 'public');
        $validated['foto'] = '/storage/' . $fotoPath;
    }

    $user->update($validated);

    return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
}

public function EditPasswordProfile(){
    $user = Auth::user();
    return Inertia::render('pengguna/edit-password',[
        'user' => $user,
    ]);
}

public function updatePassword(Request $request)
{
    $user = Auth::user();

    // Validasi input
    $request->validate([
        'oldPassword' => 'required',
        'newPassword' => 'required|min:6|confirmed', // pakai confirmed untuk mencocokkan dengan confirmPassword
    ]);

    // Cek apakah password lama cocok
    if (!Hash::check($request->oldPassword, $user->password)) {
        return back()->withErrors(['oldPassword' => 'Password lama salah.']);
    }

    // Update password
    $user->password = Hash::make($request->newPassword);
    $user->save();

    return back()->with('success', 'Password berhasil diperbarui.');
}

public function BuatKonsultasi(Request $request){
    $request->validate([
        'ahli_id' => ['required', 'exists:users,id'],
        'keluhan' => ['required', 'string', 'min:10'],
    ]);

    $konsultasi = Konsultasi::create([
        'id' => (string) Str::uuid(),
        'pengguna_id' => Auth::id(),
        'ahli_id' => $request->ahli_id,
        'keluhan' => $request->keluhan,
        'status' => 'menunggu',
    ]);

    // Create notification for expert
    Notification::create([
        'user_id' => $request->ahli_id,
        'type' => 'consultation_request',
        'title' => 'Permintaan Konsultasi Baru',
        'message' => Auth::user()->nama . ' mengirim permintaan konsultasi baru.',
        'related_id' => $konsultasi->id,
    ]);

    // Create notification for user
    Notification::create([
        'user_id' => Auth::id(),
        'type' => 'consultation_request',
        'title' => 'Permintaan Konsultasi Terkirim',
        'message' => 'Permintaan konsultasi berhasil dikirim. Menunggu konfirmasi dari ahli.',
        'related_id' => $konsultasi->id,
    ]);

    return redirect()->back()->with('success', 'Konsultasi berhasil dikirim.');
}

public function getLatestMessages(Request $request)
{
    $request->validate([
        'consultation_id' => 'required|exists:konsultasis,id',
    ]);

    $user = Auth::user();
    $konsultasi = Konsultasi::with(['messages.sender'])->findOrFail($request->consultation_id);

    $messages = $konsultasi->messages->map(function ($msg) use ($user) {
        return [
            'id' => $msg->id,
            'sender' => $msg->sender_id === $user->id ? 'user' : 'expert',
            'sender_id' => $msg->sender_id,
            'content' => $msg->message,
            'image' => $msg->image,
            'time' => $msg->created_at->format('H:i'),
        ];
    });

    return response()->json(['messages' => $messages]);
}

public function editMessage(Request $request)
{
    try {
        $request->validate([
            'message_id' => 'required|exists:messages,id',
            'message' => 'required|string|max:1000',
        ]);

        $user = Auth::user();
        $message = Message::findOrFail($request->message_id);
        
        // Verify user owns this message
        if ($message->sender_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $message->update([
            'message' => $request->message,
        ]);

        return response()->json(['success' => true, 'message' => $message]);
    } catch (\Exception $e) {
        \Log::error('Error editing message: ' . $e->getMessage());
        return response()->json(['error' => 'Gagal mengedit pesan. Silakan coba lagi.'], 500);
    }
}

public function deleteMessage(Request $request)
{
    try {
        $request->validate([
            'message_id' => 'required|exists:messages,id',
        ]);

        $user = Auth::user();
        $message = Message::findOrFail($request->message_id);
        
        // Verify user owns this message
        if ($message->sender_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Delete image if exists
        if ($message->image && Storage::disk('public')->exists(str_replace('/storage/', '', $message->image))) {
            Storage::disk('public')->delete(str_replace('/storage/', '', $message->image));
        }

        $message->delete();

        return response()->json(['success' => true]);
    } catch (\Exception $e) {
        \Log::error('Error deleting message: ' . $e->getMessage());
        return response()->json(['error' => 'Gagal menghapus pesan. Silakan coba lagi.'], 500);
    }
}

}
