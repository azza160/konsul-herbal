<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Article extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'judul',
        'deskripsi',
        'foto',
    ];

    public function komentars()
{
    return $this->hasMany(Komentar::class);
}
}
