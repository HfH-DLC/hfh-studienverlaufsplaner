<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('planer_id');
            $table->string('module_id');
            $table->year('year');
            $table->string('semester', 2);
            $table->string('time_window', 50);
            $table->string('day_time_id');
            $table->string('location_id');
            $table->unique(['year', 'semester', 'time_window', 'day_time_id', 'location_id', 'planer_id', 'module_id',], 'event_unique');
        });


        Schema::table('events', function (Blueprint $table) {
            $table->foreign('planer_id')->references('id')->on('planers');
            $table->foreign('module_id')->references('id')->on('modules');
            $table->foreign('day_time_id')->references('id')->on('day_times');
            $table->foreign('location_id')->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
