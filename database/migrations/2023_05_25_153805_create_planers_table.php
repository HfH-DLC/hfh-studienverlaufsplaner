<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlanersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('planers', function (Blueprint $table) {
            $table->string('id')->unique();
            $table->timestamps();
            $table->string('name')->unique();
            $table->integer('required_ects');
            $table->boolean('focus_selection_enabled');
            $table->text('tour');
            $table->text('meta')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('planers');
    }
}
