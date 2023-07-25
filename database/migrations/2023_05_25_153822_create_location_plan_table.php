<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('location_plan', function (Blueprint $table) {
            $table->timestamps();
            $table->foreignId('plan_id')->constrained();
            $table->string('location_id');
            $table->unique(['plan_id', 'location_id']);
        });


        Schema::table('location_plan', function (Blueprint $table) {
            $table->foreign('location_id')->references('id')->on('locations');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('location_plan');
    }
};
