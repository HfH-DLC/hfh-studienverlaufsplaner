<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->integer('position');
            $table->string('planer_id');
            $table->boolean('required');
            $table->integer('min_ects')->nullable();
            $table->integer('max_ects')->nullable();
            $table->unique(['position', 'planer_id']);
        });


        Schema::table('categories', function (Blueprint $table) {
            $table->foreign('planer_id')->references('id')->on('planers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('categories');
    }
}
