<?php

namespace App\Models;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Konsultasi extends Model
{
    public $incrementing = false; // non-auto increment
    protected $keyType = 'string'; // tipe primary key string

    protected $fillable = [
        'id', 'pengguna_id', 'ahli_id', 'keluhan', 'status',
    ];

    protected static function boot()
    {
        parent::boot();

        // Generate UUID saat membuat record baru
        static::creating(function ($model) {
            if (empty($model->id)) {
                $model->id = (string) Str::uuid(); // pakai UUID
            }
        });
    }

    // relasi
    public function pengguna()
    {
        return $this->belongsTo(User::class, 'pengguna_id');
    }

    public function ahli()
    {
        return $this->belongsTo(User::class, 'ahli_id');
    }

    public function messages()
{
    return $this->hasMany(Message::class);
}
}

