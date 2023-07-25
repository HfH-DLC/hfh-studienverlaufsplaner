<?php

namespace App\Console\Commands;

use App\Models\DayTime;
use App\Models\Plan;
use Illuminate\Console\Command;

class SetDefaults extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'set:defaults';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sets defaults';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $plans = Plan::all();
        $defaultDayTimes = DayTime::where('default', true)->get();
        foreach ($plans as $plan) {
            $plan->dayTimes()->sync($defaultDayTimes);

            if ($plan->locations->count() === 0) {
                $plan->locations()->sync(['ZH']);
            }
        }
    }
}
