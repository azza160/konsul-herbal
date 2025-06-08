<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Article;
use App\Models\Artikel;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        
         // Admin
         User::create([
            'id' => Str::uuid()->toString(),
            'nama' => 'Admin Utama',
            'email' => 'admin@example.com',
            'telp' => '081234567890',
            'password' => Hash::make('passwordadmin'),
            'role' => 'admin',
            'jk' => 'laki-laki',
            'tgl_lahir' => '1990-01-01',
        ]);

        // Ahli
        User::create([
            'id' => Str::uuid()->toString(),
            'nama' => 'Ahli Herbal',
            'email' => 'ahli@example.com',
            'telp' => '081298765432',
            'password' => Hash::make('passwordahli'),
            'role' => 'ahli',
            'jk' => 'perempuan',
            'tgl_lahir' => '1985-05-05',
        ]);

    


    
      
    }
}
