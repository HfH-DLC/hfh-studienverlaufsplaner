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
            $table->foreignId('plan_id')->constrained();
            $table->foreignId('module_id')->constrained(); //todo maybe use module_number instead so we dont care about reimporting modules
            $table->year('year');
            $table->string('semester', 2);
            $table->string('week', 50);
            $table->string('day', 20);
            $table->string('time', 20);
            $table->string('location', 50);
            $table->unique(['plan_id', 'year', 'semester', 'week', 'day', 'time']);
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
