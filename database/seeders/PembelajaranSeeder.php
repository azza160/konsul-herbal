<?php

namespace Database\Seeders;

use App\Models\Pembelajaran;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PembelajaranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Pembelajaran::insert([
            // Hiragana Categories
            [
                'id' => 'belajar-hiragana',
                'nama' => 'Hiragana',
                'desk' => 'Mulai mengenal huruf Hiragana dasar, digunakan untuk kata sehari hari dalam bahasa Jepang.',
                'max' => 6,
                'tipe' => 'huruf',
                'route_name' => 'kategori-huruf-hiragana',
                'route_params' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-hiragana-gojuon',
                'nama' => 'Hiragana Gojuon',
                'desk' => 'Pelajari 46 huruf utama hiragana dalam sistem gojuon.',
                'max' => 46,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'hiragana', 'kategori' => 'gojuon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-hiragana-dakuten',
                'nama' => 'Hiragana Dakuten',
                'desk' => 'Pelajari huruf hiragana dengan tanda dakuten (tanda titik dua) yang mengubah bunyi konsonan.',
                'max' => 20,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'hiragana', 'kategori' => 'dakuten']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-hiragana-handakuten',
                'nama' => 'Hiragana Handakuten',
                'desk' => 'Pelajari huruf hiragana dengan tanda handakuten (tanda lingkaran) yang mengubah bunyi konsonan.',
                'max' => 5,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'hiragana', 'kategori' => 'handakuten']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-hiragana-youon',
                'nama' => 'Hiragana Youon',
                'desk' => 'Pelajari kombinasi huruf hiragana yang membentuk bunyi konsonan + y + vokal.',
                'max' => 36,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'hiragana', 'kategori' => 'youon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-hiragana-sokuon',
                'nama' => 'Hiragana Sokuon',
                'desk' => 'Pelajari penggunaan huruf kecil tsu (っ) untuk menandakan konsonan ganda.',
                'max' => 1,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'hiragana', 'kategori' => 'sokuon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-hiragana-choon',
                'nama' => 'Hiragana Choon',
                'desk' => 'Pelajari penggunaan tanda panjang vokal dalam hiragana.',
                'max' => 5,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'hiragana', 'kategori' => 'choon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Katakana Categories
            [
                'id' => 'belajar-katakana',
                'nama' => 'Katakana Dasar',
                'desk' => 'Mulai mengenal huruf katakana dasar, digunakan untuk kata serapan asing dalam bahasa Jepang.',
                'max' => 6,
                'tipe' => 'huruf',
                'route_name' => 'kategori-huruf-katakana',
                'route_params' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-katakana-gojuon',
                'nama' => 'Katakana Gojuon',
                'desk' => 'Pelajari 46 huruf utama katakana dalam sistem gojuon.',
                'max' => 46,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'katakana', 'kategori' => 'gojuon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-katakana-dakuten',
                'nama' => 'Katakana Dakuten',
                'desk' => 'Pelajari huruf katakana dengan tanda dakuten (tanda titik dua) yang mengubah bunyi konsonan.',
                'max' => 20,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'katakana', 'kategori' => 'dakuten']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-katakana-handakuten',
                'nama' => 'Katakana Handakuten',
                'desk' => 'Pelajari huruf katakana dengan tanda handakuten (tanda lingkaran) yang mengubah bunyi konsonan.',
                'max' => 5,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'katakana', 'kategori' => 'handakuten']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-katakana-youon',
                'nama' => 'Katakana Youon',
                'desk' => 'Pelajari kombinasi huruf katakana yang membentuk bunyi konsonan + y + vokal.',
                'max' => 33,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'katakana', 'kategori' => 'youon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-katakana-sokuon',
                'nama' => 'Katakana Sokuon',
                'desk' => 'Pelajari penggunaan huruf kecil tsu (ッ) untuk menandakan konsonan ganda.',
                'max' => 1,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'katakana', 'kategori' => 'sokuon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'id' => 'belajar-katakana-choon',
                'nama' => 'Katakana Choon',
                'desk' => 'Pelajari penggunaan tanda panjang vokal (ー) dalam katakana.',
                'max' => 1,
                'tipe' => 'huruf',
                'route_name' => 'huruf-list',
                'route_params' => json_encode(['jenis' => 'katakana', 'kategori' => 'choon']),
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Kosakata
            [
                'id' => 'belajar-kosakata',
                'nama' => 'Kosakata Dasar',
                'desk' => 'Pelajari kosakata dasar yang umum digunakan dalam kehidupan sehari-hari dalam bahasa Jepang.',
                'max' => 300,
                'tipe' => 'kosakata',
                'route_name' => 'list-kosakta',
                'route_params' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
