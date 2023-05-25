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
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
            $table->string('module_id');
            $table->year('year');
            $table->string('semester', 2);
            $table->string('time_window', 50);
            $table->string('day_time_id');
            $table->string('location_id');
            $table->unique(['plan_id', 'year', 'semester', 'time_window', 'day_time_id', 'location_id'], 'placement_unique');
        });

        Schema::table('placements', function (Blueprint $table) {
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            $table->foreign('day_time_id')->references('id')->on('day_times')->onDelete('cascade');
            $table->foreign('location_id')->references('id')->on('locations')->onDelete('cascade');
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
