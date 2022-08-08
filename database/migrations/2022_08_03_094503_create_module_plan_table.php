<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulePlanTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('module_plan', function (Blueprint $table) {
            $table->string('module_id');
            $table->foreignId('plan_id')->constrained()->onDelete('cascade');
        });

        Schema::table('module_plan', function (Blueprint $table) {
            $table->foreign('module_id', 'module_plan_module_constraint')->references('id')->on('modules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('module_plan');
    }
}
