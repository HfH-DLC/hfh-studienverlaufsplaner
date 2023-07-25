<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFocusModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {

        Schema::create('focus_module', function (Blueprint $table) {
            $table->string('module_id');
            $table->string('focus_id');
            $table->unique(['focus_id', 'module_id']);
            $table->boolean('required');
        });

        Schema::table('focus_module', function (Blueprint $table) {
            $table->foreign('focus_id', 'focus_module_focus_constraint')->references('id')->on('foci');
            $table->foreign('module_id', 'focus_module_module_constraint')->references('id')->on('modules');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('focus_module');
    }
}
