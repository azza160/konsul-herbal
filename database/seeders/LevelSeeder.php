<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LevelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $levels = [
            ['level' => 1, 'total_exp' => 0],
            ['level' => 2, 'total_exp' => 500],
            ['level' => 3, 'total_exp' => 1000],
            ['level' => 4, 'total_exp' => 3000],
            ['level' => 5, 'total_exp' => 5500],
            ['level' => 6, 'total_exp' => 8500],
            ['level' => 7, 'total_exp' => 12000],
            ['level' => 8, 'total_exp' => 16000],
            ['level' => 9, 'total_exp' => 20500],
            ['level' => 10, 'total_exp' => 25000],
        ];
    
        foreach ($levels as $level) {
            Level::create($level);
        }
    }
}
