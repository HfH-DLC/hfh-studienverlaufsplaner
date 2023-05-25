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
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique('event_unique');
            $table->renameColumn('location', 'location_id');
            $table->unique(['module_id', 'year', 'semester', 'time_window', 'day', 'time', 'location_id'], 'event_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique('event_unique');
            $table->renameColumn('location_id', 'location');
            $table->unique(['module_id', 'year', 'semester', 'time_window', 'day', 'time', 'location'], 'event_unique');
        });
    }
};
