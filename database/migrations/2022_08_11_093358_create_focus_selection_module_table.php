<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFocusSelectionModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('focus_selection_module', function (Blueprint $table) {
            $table->foreignId('focus_selection_id')->constrained()->onDelete('cascade');
            $table->string('module_id');
            $table->unique(['focus_selection_id', 'module_id']);
        });

        Schema::table('focus_selection_module', function (Blueprint $table) {
            $table->foreign('module_id', 'focus_selection_module_module_constraint')->references('id')->on('modules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('focus_selection_module');
    }
}
