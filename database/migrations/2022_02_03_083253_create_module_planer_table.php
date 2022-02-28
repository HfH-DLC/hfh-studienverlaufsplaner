<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateModulePlanerTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('module_planer', function (Blueprint $table) {
            $table->string('module_id');
        });

        Schema::table('module_prerequisite', function (Blueprint $table) {
            $table->foreign('module_id')->constrained()->onDelete('cascade');
            $table->foreignId('planer_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('module_planer');
    }
}
