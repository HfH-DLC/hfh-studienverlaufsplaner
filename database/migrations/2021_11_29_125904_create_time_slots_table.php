<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTimeSlotsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('time_slots', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->year('year');
            $table->string('semester');
            $table->string('week');
            $table->string('day');
            $table->string('time');
            $table->foreignId('planer_id')->constrained();

            $table->unique(['year', 'semester', 'week', 'day', 'time', 'planer_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('time_slots');
    }
}
