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
        Schema::create('day_times', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->string('day');
            $table->string('time');
            $table->integer('sort_index');
            $table->boolean('default')->default(false);
            $table->unique(['day', 'time']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('day_times');
    }
};
