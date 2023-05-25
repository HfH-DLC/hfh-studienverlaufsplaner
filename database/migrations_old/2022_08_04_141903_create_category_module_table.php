<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCategoryModuleTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('category_module', function (Blueprint $table) {
            $table->string('module_id');
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->unique(['category_id', 'module_id']);
        });

        Schema::table('category_module', function (Blueprint $table) {
            $table->foreign('module_id', 'category_module_module_constraint')->references('id')->on('modules')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('category_module');
    }
}
