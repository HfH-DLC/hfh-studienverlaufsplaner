<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFociTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('foci', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->string('name')->unique();
            $table->timestamps();
            $table->string('planer_id');
            $table->integer('required_number_of_optional_modules')->default(0);
        });


        Schema::table('foci', function (Blueprint $table) {
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
        Schema::dropIfExists('foci');
    }
}
