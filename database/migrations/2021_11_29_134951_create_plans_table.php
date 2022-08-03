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
            $table->string('focus_1_id')->nullable();
            $table->string('focus_2_id')->nullable();
        });

        Schema::table('plans', function (Blueprint $table) {
            $table->foreign('focus_1_id')->references('id')->on('foci');
            $table->foreign('focus_2_id')->references('id')->on('foci');
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
