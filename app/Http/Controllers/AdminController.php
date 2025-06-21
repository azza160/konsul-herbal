<?php

namespace App\Http\Controllers;

use App\Models\Ahli;
use App\Models\Article;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class AdminController extends Controller
{
    public function DashboardShow()
    {
        $user = Auth::user();
        $JumlahArtikel = Article::count();
        $JumlahAhliHerbal = User::where('role','ahli')->count();
        $JumlahPengguna = User::where('role','pengguna')->count();
        return Inertia::render('admin/Dashboard',[
            'user' => $user,
            'jumlahArtikel' => $JumlahArtikel,
            'JumlahAhliHerbal' => $JumlahAhliHerbal,
            'JumlahPengguna' => $JumlahPengguna

        ]);
    }

    /* BAGIAN ARTIKEL */

    public function ArtikelAdminShow()
    {
        $user = Auth::user();

        // Ambil semua data artikel dari DB, diurutkan dari yang terbaru
        $articles = Article::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($article) {
                return [
                    'id' => $article->id,
                    'title' => $article->judul, // map 'judul' ke 'title'
                    'description' => $article->deskripsi, // map 'deskripsi' ke 'description'
                    'photo' => $article->foto, // langsung foto
                    'date' => $article->created_at->format('Y-m-d'), // format tanggal
                    'author' => 'Admin', // author fix
                ];
            });

        return Inertia::render('admin/Artikel', [
            'articles' => $articles,
            'user' => $user
        ]);
    }

    public function ArtikelCreateAdminShow()
    {
        $user = Auth::user();

        return Inertia::render('admin/create-artikel',[
            'user' => $user
        ]);
    }

    public function ArtikelStore(Request $request)
    {
        $request->validate([
            'judul' => 'required|string|max:500',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|mimes:jpeg,png,jpg,gif', // tanpa max size jika mau bebas
        ]);

        // Handle upload foto jika ada
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('articles', 'public');
            $fotoPath = asset('storage/' . $path);
        }

        Article::create([
            'id' => (string) Str::uuid(),
            'judul' => $request->judul,
            'deskripsi' => $request->deskripsi,
            'foto' => $fotoPath,
        ]);

        return redirect()->route('artikel-dashboard')->with('success', 'Data Berhasil ditambahkan!');
    }

    public function ArtikelDestroy($id)
    {
        $article = Article::findOrFail($id);

        // Hapus foto dari storage jika ada
        if ($article->foto && Storage::disk('public')->exists(str_replace('storage/', '', $article->foto))) {
            Storage::disk('public')->delete(str_replace('storage/', '', $article->foto));
        }

        $article->delete();

        return redirect()->back()->with('success', 'Artikel berhasil dihapus.');
    }

    public function ArtikelEdit($id)
    {
        $user = Auth::user();
        $article = Article::findOrFail($id);
        return Inertia::render('admin/edit-artikel', [
            'article' => $article,
            'user' => $user
        ]);
    }

    public function ArtikelUpdate(Request $request, $id)
    {
        $request->validate([
            'judul' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'foto' => 'nullable|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $article = Article::findOrFail($id);

        // Jika ada file baru, hapus foto lama dan simpan yang baru
        if ($request->hasFile('foto')) {
            // Hapus foto lama jika ada
            if ($article->foto && Storage::disk('public')->exists(str_replace('/storage/', '', $article->foto))) {
                Storage::disk('public')->delete(str_replace('/storage/', '', $article->foto));
            }

            // Simpan foto baru
            $fotoPath = $request->file('foto')->store('articles', 'public');
            $article->foto = '/storage/' . $fotoPath;
        }

        // Update data lainnya
        $article->judul = $request->judul;
        $article->deskripsi = $request->deskripsi;
        $article->save();

        return redirect()->route('artikel-dashboard')->with('success', 'Artikel berhasil diperbarui!');
    }

    /* BAGIAN AHLI */

    public function AhliAdminShow()
    {
        $user = Auth::user();

        // Ambil semua data artikel dari DB, diurutkan dari yang terbaru
        $ahlis = Ahli::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($ahli) {
                return [
                    'id' => $ahli->id,
                    'nama' => $ahli->nama_spesialisasi,
                    'deskripsi' => $ahli->deskripsi_spesialisasi,
                ];
            });

        return Inertia::render('admin/Ahli', [
            'ahlis' => $ahlis,
            'user' => $user
        ]);
    }

    public function AhliCreateAdminShow()
    {
        $user = Auth::user();

        return Inertia::render('admin/create-ahli',[
            'user' => $user
        ]);
    }

    public function AhliStore(Request $request)
    {
        $request->validate([
            'nama_spesialisasi' => 'required|string|max:500',
            'deskripsi_spesialisasi' => 'required|string',
        ]);
        Ahli::create([
            'nama_spesialisasi' => $request->nama_spesialisasi, // simpan 'nama' ke field 'judul'
            'deskripsi_spesialisasi' => $request->deskripsi_spesialisasi,
        ]);

        return redirect()->route('ahli-dashboard')->with('success', 'Data Berhasil ditambahkan!');
    }

    public function AhliDestroy($id)
    {
        $ahli = Ahli::findOrFail($id);
        $ahli->delete();

        return redirect()->back()->with('success', 'Ahli berhasil dihapus.');
    }

    public function AhliEdit($id)
    {
        $user = Auth::user();
        $ahli = Ahli::findOrFail($id);
        return Inertia::render('admin/edit-ahli', [
            'ahli' => $ahli,
            'user' => $user
        ]);
    }

    public function AhliUpdate(Request $request, $id)
    {
        $request->validate([
            'nama_spesialisasi' => 'required|string|max:500',
            'deskripsi_spesialisasi' => 'required|string',
        ]);

        $ahli = Ahli::findOrFail($id);

        // Update data lainnya
        $ahli->nama_spesialisasi = $request->nama_spesialisasi;
        $ahli->deskripsi_spesialisasi = $request->deskripsi_spesialisasi;
        $ahli->save();

        return redirect()->route('ahli-dashboard')->with('success', 'Ahli berhasil diperbarui!');
    }

    /* BAGIAN AHLI HERBAL */

    public function AhliHerbalAdminShow()
    {
        // Ambil user dengan role 'ahli' beserta data spesialisasi dari relasi 'ahli'
        $user = Auth::user();

        $usersAhli = User::with('ahli', 'lokasi')
            ->where('role', 'ahli')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'nama' => $user->nama,
                    'email' => $user->email,
                    'pengalaman' => $user->pengalaman,
                    'telp' => $user->telp,
                    'foto' => $user->foto,
                    'spesialisasi' => $user->ahli ? $user->ahli->nama_spesialisasi : null,
                    'id_spesialisasi' => $user->ahli ? $user->ahli->id : null,
                    'jk' => $user->jk,
                    'tgl_lahir' => $user->tgl_lahir,
                    'lokasi' => $user->lokasi,
                ];
            });

        return Inertia::render('admin/ahli-herbal', [
            'usersAhlis' => $usersAhli,
            'user' => $user
        ]);
    }

    public function AhliHerbalCreateAdminShow()
    {
        $user = Auth::user();

        // Ambil semua spesialisasi ahli untuk dropdown
        $spesialisasis = Ahli::orderBy('nama_spesialisasi')
            ->get()
            ->map(function ($ahli) {
                return [
                    'id' => $ahli->id,
                    'nama' => $ahli->nama_spesialisasi,
                ];
            });

        return Inertia::render('admin/create-ahli-herbal', [
            'spesialisasis' => $spesialisasis,
            'user' => $user
        ]);
    }

   

    public function AhliHerbalStore(Request $request)
    {
        

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png,gif|max:2048',
            'id_ahli' => 'required|exists:ahlis,id',
            'jk' => 'nullable|in:laki-laki,perempuan',
            'tgl_lahir' => 'nullable|date',
            'telp' => 'nullable|string|max:20',
            'pengalaman' => 'nullable|string',
            'alamat' => 'required|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
        ]);


        // Handle upload foto jika ada
        $fotoPath = null;
        if ($request->hasFile('foto')) {
            $path = $request->file('foto')->store('foto_ahli', 'public');
            $fotoPath = asset('storage/' . $path); // ✅ full URL
        }


        

        // Buat user baru dengan UUID
        $user = User::create([
            'id' => Str::uuid()->toString(),
            'id_ahli' => $validated['id_ahli'],
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'foto' => $fotoPath, // ✅ URL lengkap
            'role' => 'ahli',
            'jk' => $validated['jk'] ?? null,
            'tgl_lahir' => $validated['tgl_lahir'] ?? null,
            'telp' => $validated['telp'] ?? null,
            'pengalaman' => $validated['pengalaman'] ?? null,
        ]);

        // Simpan lokasi
        $user->lokasi()->create([
            'alamat' => $validated['alamat'],
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);

        return redirect()->route('ahli-herbal-dashboard')->with('success', 'Ahli Herbal berhasil ditambahkan.');
    }

    public function AhliHerbalDestroy($id)
    {
        $ahli = User::findOrFail($id);
        $ahli->delete();

        return redirect()->back()->with('success', 'Ahli Herbal berhasil dihapus.');
    }

    /* Bagian Pengguna */

    public function PenggunaAdminShow(){
        $user = Auth::user();

            // Ambil user dengan role 'pengguna' beserta data spesialisasi dari relasi 'ahli'
            $pengguna = User::where('role', 'pengguna')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'nama' => $user->nama,
                    'email' => $user->email,
                    'telp' => $user->telp,
                    'foto' => $user->foto,
                    'jk' => $user->jk,
                    'tgl_lahir' => $user->tgl_lahir
                ];
            });

            return Inertia::render('admin/Pengguna', [
                'usersAhlis' => $pengguna,
                'user' => $user
            ]);
    }

    public function PenggunaDestroy($id){
        $ahli = User::findOrFail($id);
        $ahli->delete();

        return redirect()->back()->with('success', 'Pengguna berhasil dihapus.');
    }

}
