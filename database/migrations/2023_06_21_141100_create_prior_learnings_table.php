<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('prior_learnings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_id')->constrained();
            $table->string('name');
            $table->integer('ects')->nullable();
            $table->unsignedBigInteger('counts_as_category_id')->nullable();
            $table->string('counts_as_module_id')->nullable();
            $table->timestamps();
        });


        Schema::table('prior_learnings', function (Blueprint $table) {
            $table->foreign('counts_as_category_id')->references('id')->on('categories');
            $table->foreign('counts_as_module_id')->references('id')->on('modules');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prior_learnings');
    }
};
