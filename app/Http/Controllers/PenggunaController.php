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
                'content' => $msg->message,
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
    $request->validate([
        'consultation_id' => 'required|exists:konsultasis,id',
        'message' => 'required|string',
    ]);

    $user = Auth::user();

    Message::create([
        'konsultasi_id' => $request->consultation_id,
        'sender_id' => $user->id,
        'message' => $request->message,
    ]);

    return redirect()->back()->with('success', 'Pesan berhasil dikirim.')->with('selected_chat', $request->consultation_id);
    ;
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

    Konsultasi::create([
        'id' => (string) Str::uuid(),
        'pengguna_id' => Auth::id(),
        'ahli_id' => $request->ahli_id,
        'keluhan' => $request->keluhan,
        'status' => 'menunggu',
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
            'content' => $msg->message,
            'time' => $msg->created_at->format('H:i'),
        ];
    });

    return response()->json(['messages' => $messages]);
}

}
