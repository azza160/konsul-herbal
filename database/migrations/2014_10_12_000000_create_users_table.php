<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('id')->primary(); //36 untuk UUID string, atau bisa sesuaikan panjangnya
            $table->foreignId('id_ahli')->nullable()->constrained('ahlis')->onDelete('set null');
            $table->string('nama');
            $table->string('email')->unique();
            $table->string('telp')->nullable();
            $table->string('password');
            $table->enum('role', ['pengguna', 'ahli', 'admin'])->default('pengguna');
            $table->string('foto')->nullable();
            $table->date('tgl_lahir')->nullable();
            $table->enum('jk', ['laki-laki', 'perempuan'])->nullable();
            $table->text('pengalaman')->nullable();
            $table->string('verification_token')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
