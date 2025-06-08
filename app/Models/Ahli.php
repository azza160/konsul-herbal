<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ahli extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_spesialisasi',
        'deskripsi_spesialisasi',
    ];

    public function users()
    {
        return $this->hasMany(User::class, 'id_ahli');
    }
}
