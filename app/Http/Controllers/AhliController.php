<?php

namespace App\Http\Controllers;

use App\Models\Ahli;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AhliController extends Controller
{
    public function AhliDashboardShow(){
        return Inertia::render('ahli/Dashboard');
    }

    public function KonfirmasiShow(){
        return Inertia::render('ahli/Konfirmasi');
    }

    public function Profile(){

        $user = Auth::user();
        return Inertia::render('ahli/ahli-profile',[
            'user' => $user
        ]);
    }

    public function EditProfile(){
        $user = Auth::user();
        $spesialisasi = Ahli::all(); // Ambil semua spesialisasi untuk dropdown

        return Inertia::render('ahli/edit-profile',[
            'user' => $user,
            'spesialisasi' => $spesialisasi,

        ]);
    }

    public function UpdateProfile(Request $request){
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


    
}
