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
            $table->string('semester', 2);
            $table->string('week', 50);
            $table->string('day', 20);
            $table->string('time',20);
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
