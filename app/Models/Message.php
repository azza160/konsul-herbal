<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'konsultasi_id',
        'sender_id',
        'message',
    ];

    public function consultation()
{
    return $this->belongsTo(Konsultasi::class);
}

public function sender()
{
    return $this->belongsTo(User::class, 'sender_id');
}

}
