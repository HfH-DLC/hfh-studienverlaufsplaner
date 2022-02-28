<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulePrerequisiteTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('module_prerequisite', function (Blueprint $table) {
            $table->string('module_id');
            $table->string('prerequisite_id');
        });

        Schema::table('module_prerequisite', function (Blueprint $table) {
            $table->foreign('prerequisite_id')->references('id')->on('modules')->onDelete('cascade');
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('module_prerequisite');
    }
}
