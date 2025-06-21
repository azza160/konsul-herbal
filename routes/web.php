<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PenggunaController;
use App\Http\Controllers\AhliController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MapController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Guest only
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'LoginShow'])->name('login');
    Route::get('/register', [AuthController::class, 'RegisterShow'])->name('register.show');
    Route::post('/register', [AuthController::class, 'Register'])->name('register');
    Route::post('/login', [AuthController::class, 'login'])->name('login');
});

// Authenticated (semua)
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Test notification routes (temporary)
Route::middleware(['auth'])->group(function () {
    Route::get('/pengguna/notifications', [NotificationController::class, 'getNotifications'])->name('pengguna.notifications.get');
    Route::post('/pengguna/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('pengguna.notifications.read');
    Route::post('/pengguna/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('pengguna.notifications.read-all');
    Route::delete('/pengguna/notifications/{id}', [NotificationController::class, 'deleteNotification'])->name('pengguna.notifications.delete');
    Route::delete('/pengguna/notifications', [NotificationController::class, 'deleteAllNotifications'])->name('pengguna.notifications.delete-all');
});

// Pengguna
Route::middleware(['auth', 'check.role:pengguna'])->group(function () {
    Route::get('/', [PenggunaController::class, "BerandaShow"])->name('beranda');
    Route::get('/list-artikel', [PenggunaController::class, "ListArtikelShow"])->name('list-artikel');
    Route::get('/artikel/{id}', [PenggunaController::class, "DetailArtikelShow"])->name('detail-artikel');
    Route::get('/list-ahli-herbal', [PenggunaController::class, "AhliHerbalShow"])->name('list-ahli-herbal');
 
    Route::post('/komentar', [PenggunaController::class, 'KomentarStore'])->name('komentar.store');
    Route::get('/profile', [PenggunaController::class, "Profile"])->name('profile');
    Route::get('/profile/edit-profile', [PenggunaController::class, "EditProfileShow"])->name('edit-profile');
    Route::post('/profile/update', [PenggunaController::class, "UpdateProfile"])->name('update-profile');
    Route::get('/profile/edit-password', [PenggunaController::class, "EditPasswordProfile"])->name('edit-password-profile');
    Route::post('/profile/update-password', [PenggunaController::class, "UpdatePassword"])->name('update-password');

    Route::post('/konsultasi', [PenggunaController::class, 'BuatKonsultasi'])->name('pengguna-konsultasi');

    Route::get('/konsultasi/pesan', [PenggunaController::class, 'PesanShow'])->name('pengguna-pesan');
    Route::post('/konsultasi/pesan/kirim', [PenggunaController::class, 'KirimPesan'])->name('pesan.kirim');
    Route::get('/konsultasi/pesan/latest', [PenggunaController::class, 'getLatestMessages'])->name('pesan.latest');   
    Route::put('/konsultasi/pesan/edit', [PenggunaController::class, 'editMessage'])->name('pesan.edit');
    Route::delete('/konsultasi/pesan/delete', [PenggunaController::class, 'deleteMessage'])->name('pesan.delete');
});


// Ahli
Route::middleware(['auth', 'check.role:ahli'])->group(function () {
    Route::get('/ahli/dashboard', [AhliController::class, "AhliDashboardShow"])->name('ahli-dashboard-acount');
    Route::get('/ahli/konfirmasi', [AhliController::class, "KonfirmasiShow"])->name('ahli-konfirmasi');

    Route::get('/ahli/dashboard/profile', [AhliController::class, "Profile"])->name('ahli-profile');
    Route::get('/ahli/dashboard/profile/edit-profile', [AhliController::class, "EditProfile"])->name('ahli-profile-edit-acount');
    Route::post('/ahli/dashboard/profile/edit-profile', [AhliController::class, "UpdateProfile"])->name('ahli-profile-update-acount');
    Route::get('/ahli/dashboard/profile/edit-password', [AhliController::class, "EditPasswordProfile"])->name('edit-ahli-password-profile');
    Route::post('/ahli/dashboard/profile/update-password', [AhliController::class, "UpdatePassword"])->name('ahli-update-password');

    Route::post('/konsultasi/{id}/accept', [AhliController::class, 'Accept']);
    Route::post('/konsultasi/{id}/reject', [AhliController::class, 'Reject']);

    Route::get('/ahli/pesan', [AhliController::class, 'PesanShow'])->name('ahli-pesan');
    Route::post('/ahli/pesan/kirim', [AhliController::class, 'KirimPesan'])->name('ahli-pesan-kirim');
    Route::get('/ahli/pesan/latest', [AhliController::class, 'getLatestMessages'])->name('ahli-pesan-latest');   
    Route::put('/ahli/pesan/edit', [AhliController::class, 'editMessage'])->name('ahli-pesan-edit');
    Route::delete('/ahli/pesan/delete', [AhliController::class, 'deleteMessage'])->name('ahli-pesan-delete');

    // Notification routes
    Route::get('/notifications', [NotificationController::class, 'getNotifications'])->name('ahli.notifications.get');
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('ahli.notifications.read');
    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('ahli.notifications.read-all');
    Route::delete('/notifications/{id}', [NotificationController::class, 'deleteNotification'])->name('ahli.notifications.delete');
    Route::delete('/notifications', [NotificationController::class, 'deleteAllNotifications'])->name('ahli.notifications.delete-all');
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

Route::get('/', [PenggunaController::class, 'LandingPageShow'])->name('landing-page');


/* Route untuk Geocoding */
Route::get('/geocode/search', [MapController::class, 'search'])->name('geocode.search');
Route::get('/geocode/reverse', [MapController::class, 'reverse'])->name('geocode.reverse');


Route::get('/dashboard', function () {
    if (Auth::check()) {
        $user = Auth::user();
        if ($user->role === 'admin') {
            return redirect()->route('admin-dashboard');
        } elseif ($user->role === 'ahli') {
            return redirect()->route('ahli-dashboard-acount');
        } else {
            return redirect()->route('landing-page');
        }
    }
    return redirect()->route('login'); // fallback jika tidak terautentikasi
})->middleware(['auth'])->name('dashboard');
