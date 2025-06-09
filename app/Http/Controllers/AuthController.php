<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function LoginShow(){
        return Inertia::render('auth/Login');
    }

    public function RegisterShow(){
        return Inertia::render('auth/Register');
    }

    public function Register(Request $request)
    {
     
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'telp' => 'required|string|max:20',
            'password' => ['required', Password::min(6)],
            'jk' => 'required|in:laki-laki,perempuan',
            'tgl_lahir' => 'nullable|date|before:today|after:1900-01-01',
        ]);


        $user = User::create([
            'id' => Str::random(26),  // contoh random string 40 karakter
            'nama' => $validated['nama'],
            'email' => $validated['email'],
            'telp' => $validated['telp'],
            'password' => Hash::make($validated['password']),
            'jk' => $validated['jk'],
            'tgl_lahir' => $validated['tgl_lahir'],
            'role' => 'pengguna', // default role
        ]);


        return redirect()->back()->with('success', 'Berhasil register! Silakan login.');
    }

    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:6',
    ]);

    $user = \App\Models\User::where('email', $credentials['email'])->first();

    if (!$user || !Hash::check($credentials['password'], $user->password)) {
        return back()->withErrors(['email' => 'Email atau password salah.'])->onlyInput('email');
    }

    Auth::login($user);

    // Redirect sesuai role
    $redirectRoute = match ($user->role) {
        'pengguna' => 'beranda',
        'ahli' => 'ahli-dashboard-acount',
        'admin' => 'admin-dashboard',
        default => '/',
    };

    return redirect()->route($redirectRoute)->with('success', 'Berhasil login!');
}

public function logout(){
    Auth::logout();
    return redirect()->route('login')->with('success', 'Berhasil logout!');

}
}
