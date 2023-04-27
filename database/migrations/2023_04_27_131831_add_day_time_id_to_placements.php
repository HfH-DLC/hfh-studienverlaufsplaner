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
        Schema::table('placements', function (Blueprint $table) {
            if (env('DB_CONNECTION') !== 'sqlite') {
                $table->dropForeign(['plan_id']);
            }
            $table->dropUnique(['plan_id', 'year', 'semester', 'time_window', 'day', 'time']);
            $table->string('day_time_id');
            $table->string('day')->default('')->change();
            $table->string('time')->default('')->change();
            $table->unique(['plan_id', 'year', 'semester', 'time_window', 'day_time_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('placements', function (Blueprint $table) {
            $table->dropUnique(['plan_id', 'year', 'semester', 'time_window', 'day_time_id']);
            $table->dropColumn('day_time_id');
            $table->string('day')->default(null)->change();
            $table->string('time')->default(null)->change();
            $table->unique(['plan_id', 'year', 'semester', 'time_window', 'day', 'time']);
        });
    }
};
