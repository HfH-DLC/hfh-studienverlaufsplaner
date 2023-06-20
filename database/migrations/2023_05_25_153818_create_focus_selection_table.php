<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFocusSelectionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('focus_selections', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('focus_id');
            $table->foreignId('plan_id')->constrained();
            $table->integer('position');
            $table->unique(['focus_id', 'plan_id']);
            $table->unique(['plan_id', 'position']);
        });

        Schema::table('focus_selections', function (Blueprint $table) {
            $table->foreign('focus_id', 'focus_selections_focus_constraint')->references('id')->on('foci');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('focus_selections');
    }
}
