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

            $table->string('email');
            $table->year('start_year');
            $table->string('slug')->nullable()->unique();
            $table->boolean('tour_completed')->default(false);
            $table->foreignId('planer_id')->constrained();
            $table->string('first_focus')->nullable();
            $table->string('second_focus')->nullable();
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->foreign('first_focus')->references('id')->on('foci');
            $table->foreign('second_focus')->references('id')->on('foci');
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
