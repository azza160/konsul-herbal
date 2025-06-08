<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;


class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'users';

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'id_ahli',
        'nama',
        'email',
        'telp',
        'password',
        'role',
        'foto',
        'tgl_lahir',
        'jk',
        'pengalaman',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'tgl_lahir' => 'date',
    ];

    public function komentars()
{
    return $this->hasMany(Komentar::class);
}

    public function ahli()
    {
        return $this->belongsTo(Ahli::class, 'id_ahli');
    }

      // relasi ke konsultasi sebagai pengguna
      public function konsultasiSebagaiPengguna()
      {
          return $this->hasMany(Konsultasi::class, 'pengguna_id');
      }
  
      // relasi ke konsultasi sebagai ahli
      public function konsultasiSebagaiAhli()
      {
          return $this->hasMany(Konsultasi::class, 'ahli_id');
      }
    
}
