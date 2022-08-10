<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlacementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('placements', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('module_id');
            $table->year('year');
            $table->string('semester', 2);
            $table->string('week', 50);
            $table->string('day', 20);
            $table->string('time', 20);
            $table->string('location', 50);
            $table->unique(['plan_id', 'year', 'semester', 'week', 'day', 'time']);
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
        });

        Schema::table('placements', function (Blueprint $table) {
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('placements');
    }
}
