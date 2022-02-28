<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->year('year');
            $table->string('semester', 2);
            $table->string('week', 50);
            $table->string('day', 20);
            $table->string('time', 20);
            $table->string('location', 50);
            $table->string('module_id');
            $table->unique(['module_id', 'year', 'semester', 'week', 'day', 'time', 'location']);
        });

        Schema::table('events', function (Blueprint $table) {
            $table->foreign('module_id')->constrained()->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('events');
    }
}
