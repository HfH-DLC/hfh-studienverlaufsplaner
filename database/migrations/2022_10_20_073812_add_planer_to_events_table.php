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
        Schema::table('events', function (Blueprint $table) {
            $table->text('planer');
            $table->dropForeign(['module_id']);
            $table->dropUnique('events_date_location_module_unique');
            $table->unique(['module_id', 'year', 'semester', 'time_window', 'day', 'time', 'location', 'planer'], 'event_unique');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique('event_unique');
            $table->dropColumn('planer');
            $table->unique(['module_id', 'year', 'semester', 'time_window', 'day', 'time', 'location'], 'events_date_location_module_unique');
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
        });
    }
};
