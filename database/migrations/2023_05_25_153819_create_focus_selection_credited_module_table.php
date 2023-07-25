<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFocusSelectionCreditedModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('focus_selection_credited_module', function (Blueprint $table) {
            $table->foreignId('focus_selection_id')->constrained();
            $table->string('module_id');
            $table->unique(['focus_selection_id', 'module_id'], 'focus_selection_cmodule_unique');
        });

        Schema::table('focus_selection_credited_module', function (Blueprint $table) {
            $table->foreign('module_id', 'focus_selection_credited_module')->references('id')->on('modules');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('focus_selection_credited_module');
    }
}
