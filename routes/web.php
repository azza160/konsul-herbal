<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\AhliController;
use App\Http\Controllers\AdminController;

// Guest only
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'LoginShow'])->name('login');
    Route::get('/register', [AuthController::class, 'RegisterShow'])->name('register');
    Route::post('/register', [AuthController::class, 'Register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

// Authenticated (semua)
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Pengguna
Route::middleware(['auth', 'check.role:pengguna'])->group(function () {
    Route::get('/', [PenggunaController::class, "BerandaShow"])->name('beranda');
    Route::get('/list-artikel', [PenggunaController::class, "ListArtikelShow"])->name('list-artikel');
    Route::get('/artikel/{id}', [PenggunaController::class, "DetailArtikelShow"])->name('detail-artikel');
    Route::get('/list-ahli-herbal', [PenggunaController::class, "AhliHerbalShow"])->name('list-ahli-herbal');
    Route::get('/pesan', [PenggunaController::class, "PesanShow"])->name('pesan');
    Route::post('/komentar', [PenggunaController::class, 'KomentarStore'])->name('komentar.store');
    Route::get('/profile', [PenggunaController::class, "Profile"])->name('profile');
    Route::get('/profile/edit-profile', [PenggunaController::class, "EditProfileShow"])->name('edit-profile');
    Route::post('/profile/update', [PenggunaController::class, "UpdateProfile"])->name('update-profile');
    Route::get('/profile/edit-password', [PenggunaController::class, "EditPasswordProfile"])->name('edit-password-profile');
    Route::post('/profile/update-password', [PenggunaController::class, "UpdatePassword"])->name('update-password');

});

// Ahli
Route::middleware(['auth', 'check.role:ahli'])->group(function () {
    Route::get('/ahli/dashboard', [AhliController::class, "AhliDashboardShow"])->name('ahli-dashboard-acount');
    Route::get('/ahli/konfirmasi', [AhliController::class, "KonfirmasiShow"])->name('ahli-konfirmasi');

    Route::get('/ahli/dashboard/profile', [AhliController::class, "Profile"])->name('ahli-profile');
    Route::get('/ahli/dashboard/profile/edit-profile', [AhliController::class, "EditProfile"])->name('ahli-profile-edit-acount');
    Route::post('/ahli/dashboard/profile/edit-profile', [AhliController::class, "UpdateProfile"])->name('ahli-profile-update-acount');

});

// Admin
Route::middleware(['auth', 'check.role:admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, "DashboardShow"])->name('admin-dashboard');

    Route::get('/admin/list-artikel', [AdminController::class, "ArtikelAdminShow"])->name('artikel-dashboard');
    Route::get('/admin/create-artikel', [AdminController::class, "ArtikelCreateAdminShow"])->name('create-artikel-dashboard');
    Route::post('/admin/artikel/store', [AdminController::class, "ArtikelStore"])->name('create-artikel-store');
    Route::delete('/admin/artikel/{id}', [AdminController::class, "ArtikelDestroy"])->name('create-artikel-destroy');
    Route::get('/admin/artikel/{id}/edit', [AdminController::class, 'ArtikelEdit'])->name('artikel.edit');
    Route::put('/admin/artikel/{id}', [AdminController::class, 'ArtikelUpdate'])->name('artikel.update');

    Route::get('/admin/list-ahli', [AdminController::class, "AhliAdminShow"])->name('ahli-dashboard');
    Route::get('/admin/create-ahli', [AdminController::class, "AhliCreateAdminShow"])->name('create-ahli-dashboard');
    Route::post('/admin/ahli/store', [AdminController::class, "AhliStore"])->name('create-ahli-store');
    Route::delete('/admin/ahli/{id}', [AdminController::class, "AhliDestroy"])->name('create-ahli-destroy');
    Route::get('/admin/ahli/{id}/edit', [AdminController::class, 'AhliEdit'])->name('ahli.edit');
    Route::put('/admin/ahli/{id}', [AdminController::class, 'AhliUpdate'])->name('ahli.update');

    Route::get('/admin/list-ahli-herbal', [AdminController::class, "AhliHerbalAdminShow"])->name('ahli-herbal-dashboard');
    Route::get('/admin/create-ahli-herbal', [AdminController::class, "AhliHerbalCreateAdminShow"])->name('create-ahli-herbal-dashboard');
    Route::post('/admin/ahli-herbal/store', [AdminController::class, "AhliHerbalStore"])->name('create-ahli-herbal-store');
    Route::delete('/admin/ahli-herbal/{id}', [AdminController::class, "AhliHerbalDestroy"])->name('create-ahli-herbal-destroy');

    Route::get('/admin/list-pengguna', [AdminController::class, "PenggunaAdminShow"])->name('pengguna-dashboard');
    Route::delete('/admin/list-pengguna/{id}', [AdminController::class, "PenggunaDestroy"])->name('create-pengguna-destroy');


});
