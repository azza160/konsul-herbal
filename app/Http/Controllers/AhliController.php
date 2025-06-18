<?php

namespace App\Http\Controllers;

use App\Models\Ahli;
use App\Models\Konsultasi;
use App\Models\Message;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AhliController extends Controller
{
    public function AhliDashboardShow()
    {
        $user = Auth::user();
        $jumlahKonsulPending = Konsultasi::where('ahli_id', $user->id)
        ->where('status', 'menunggu')
        ->count();
        $jumlahKonsulAcc =  Konsultasi::where('ahli_id', $user->id)
        ->where('status', 'diterima')
        ->count();
        $jumlahKonsulTolak = Konsultasi::where('ahli_id', $user->id)
        ->where('status', 'ditolak')
        ->count();

        return Inertia::render('ahli/Dashboard',[
            'user' => $user,
            'jumlahKonsulPending' => $jumlahKonsulPending,
            'jumlahKonsulAcc' => $jumlahKonsulAcc,
            'jumlahKonsulTolak' => $jumlahKonsulTolak

        ]);
    }

    public function KonfirmasiShow()
    {
        $user = Auth::user();

        $consultations = Konsultasi::with('pengguna')
            ->where('ahli_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'patientName' => $item->pengguna->nama,
                    'topic' => $item->keluhan,
                    'status' => $item->status,
                    'requestTime' => $item->created_at->format('Y-m-d H:i'),
                ];
            });

          ;

        return Inertia::render('ahli/Konfirmasi', [
            'consultations' => $consultations,
            'user' => $user
        ]);
    }

    public function Profile()
    {
        $user = Auth::user();
        return Inertia::render('ahli/ahli-profile', [
            'user' => $user,
        ]);
    }

    public function EditProfile()
    {
        $user = Auth::user();
        $spesialisasi = Ahli::all(); // Ambil semua spesialisasi untuk dropdown

        return Inertia::render('ahli/edit-profile', [
            'user' => $user,
            'spesialisasi' => $spesialisasi,
        ]);
    }

    public function UpdateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'telp' => 'nullable|string|max:20',
            'tgl_lahir' => 'nullable|date',
            'jk' => 'nullable|in:laki-laki,perempuan',
            'pengalaman' => 'nullable|string',
            'id_ahli' => 'nullable|exists:ahlis,id',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        // Jika ada file baru, hapus foto lama dan simpan yang baru
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada dan file-nya masih ada di storage
            if ($user->foto && Storage::disk('public')->exists(str_replace('/storage/', '', $user->foto))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $user->foto));
            }

            // Simpan foto baru
            $fotoPath = $request->file('foto')->store('foto-profil', 'public');
            $validated['foto'] = '/storage/' . $fotoPath;
        }

        // Update data user
        $user->update($validated);

        return redirect()->back()->with('success', 'Profil berhasil diperbarui.');
    }

    public function EditPasswordProfile(){
        $user = Auth::user();
        return Inertia::render('ahli/edit-password',[
            'user' => $user,
        ]);
    }

    public function UpdatePassword(Request $request)
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

    public function Accept($id){
        $konsultasi = Konsultasi::findOrFail($id);
        $konsultasi->status = 'diterima';
        $konsultasi->save();
        
        // Create notification for user
        Notification::create([
            'user_id' => $konsultasi->pengguna_id,
            'type' => 'consultation_accepted',
            'title' => 'Permintaan Konsultasi Diterima',
            'message' => 'Permintaan konsultasi Anda telah diterima oleh ahli.',
            'related_id' => $konsultasi->id,
            'is_read' => false,
        ]);

        // Send bot welcome message
        $botMessage = "Selamat datang di konsultasi herbal! 🌿\n\n" .
                     "Saya adalah bot asisten yang akan membantu Anda selama proses konsultasi.\n\n" .
                     "📋 Langkah-langkah konsultasi:\n" .
                     "1. Jelaskan keluhan Anda secara detail\n" .
                     "2. Ahli akan menganalisis dan memberikan saran\n" .
                     "3. Anda dapat bertanya lebih lanjut jika diperlukan\n" .
                     "4. Konsultasi akan berlangsung hingga masalah teratasi\n\n" .
                     "💡 Tips: Berikan informasi yang lengkap agar ahli dapat memberikan saran yang tepat.\n\n" .
                     "Selamat berkonsultasi! 🙏";

        Message::create([
            'konsultasi_id' => $konsultasi->id,
            'sender_id' => $konsultasi->ahli_id, // Bot message appears as from ahli
            'message' => $botMessage,
        ]);

        return back()->with('success', 'Konsultasi berhasil diterima.');
    }

    public function Reject($id)
{
    $konsultasi = Konsultasi::findOrFail($id);
    $konsultasi->status = 'ditolak';
    $konsultasi->save();

    // Create notification for user
    Notification::create([
        'user_id' => $konsultasi->pengguna_id,
        'type' => 'consultation_rejected',
        'title' => 'Permintaan Konsultasi Ditolak',
        'message' => 'Permintaan konsultasi Anda ditolak oleh ahli.',
        'related_id' => $konsultasi->id,
    ]);

    return back()->with('success', 'Konsultasi berhasil ditolak.');
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
                'image' => $msg->image ? asset($msg->image) : null,
                'time' => $msg->created_at->format('H:i'),
            ];
        });
    }

    return Inertia::render('ahli/Pesan', [
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
            'image' => $msg->image ? asset($msg->image) : null,
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
