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
        Schema::dropIfExists('module_prerequisite');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('module_prerequisite', function (Blueprint $table) {
            $table->string('module_id');
            $table->string('prerequisite_id');
        });

        Schema::table('module_prerequisite', function (Blueprint $table) {
            $table->foreign('prerequisite_id', 'prerequisite_constraint')->references('id')->on('modules');
            $table->foreign('module_id', 'module_constraint')->references('id')->on('modules');
        });
    }
};
