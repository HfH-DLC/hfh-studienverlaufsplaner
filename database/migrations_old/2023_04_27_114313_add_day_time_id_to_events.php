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
            $table->string('day_time_id');
            $table->string('day')->default('')->change();
            $table->string('time')->default('')->change();
            $table->unique(['module_id', 'year', 'semester', 'time_window', 'day_time_id', 'location_id', 'planer'], 'event_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropUnique('event_unique');
            $table->dropColumn('day_time_id');
            $table->string('day')->default(null)->change();
            $table->string('time')->default(null)->change();
            $table->unique(['module_id', 'year', 'semester', 'time_window', 'day', 'time', 'location_id', 'planer'], 'event_unique');
        });
    }
};
