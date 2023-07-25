<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlansTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('planer_id');
            $table->string('email');
            $table->year('start_year');
            $table->string('slug')->nullable()->unique();
            $table->boolean('schedule_tour_completed')->default(false);
            $table->boolean('credit_tour_completed')->default(false);
            $table->boolean('schedule_valid')->default(false);
            $table->boolean('read_only')->default(false);
        });


        Schema::table('plans', function (Blueprint $table) {
            $table->foreign('planer_id')->references('id')->on('planers');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plans');
    }
}
