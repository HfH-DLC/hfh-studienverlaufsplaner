<?php

namespace App\Console\Commands;

use App\Models\DayTime;
use App\Models\FocusSelection;
use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Console\Command;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ImportOldPlans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:plans {path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports plans from old stvpl version';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $path = $this->argument('path');
        $json = file_get_contents($path);
        $data = json_decode($json);
        $count = 0;
        DB::transaction(function () use ($data, &$count) {
            $dayTimes = DayTime::all();
            foreach ($data->plans as $planData) {
                $this->createPlan($planData, $dayTimes);
                $count++;
            }
        });
        $this->info("Import finished");
        $this->info("{$count} Plans imported");
    }

    private function createPlan($planData, $dayTimes)
    {
        $plan = new Plan();
        $plan->id = $planData->id;
        $plan->created_at = $planData->created_at;
        $plan->planer_id = $planData->planer_slug;
        $plan->email = $planData->email;
        $plan->start_year = $planData->start_year;
        $plan->schedule_tour_completed = $planData->schedule_tour_completed;
        $plan->credit_tour_completed = $planData->credit_tour_completed;
        $plan->schedule_valid = $planData->schedule_valid;
        $plan->read_only = $planData->read_only;
        $plan->save();

        $plan->slug = $planData->slug;
        $plan->save();

        foreach ($planData->placements as $placementData) {
            $placement = new Placement();
            $placement->id = $placementData->id;
            $placement->created_at = $placementData->created_at;
            $placement->module_id = $placementData->module_id;
            $placement->year = $placementData->year;
            $placement->semester = $placementData->semester;
            $placement->time_window = $placementData->time_window;
            $placement->location_id = $placementData->location_id;
            $placement->day_time_id = $this->getDateTimeId($dayTimes, $placementData->day, $placementData->time);
            $plan->placements()->save($placement);
        }

        foreach ($planData->focusSelections as $focusSelectionData) {
            $focusSelection = new FocusSelection();
            $focusSelection->id = $focusSelectionData->id;
            $focusSelection->created_at = $focusSelectionData->created_at;
            $focusSelection->focus_id = $focusSelectionData->focus_id;
            $focusSelection->position = $focusSelectionData->position;
            $focusSelection->save();

            $focusSelection->creditedModules()->sync($focusSelectionData->creditedModules);
        }

        $plan->locations()->sync($planData->location_ids);
    }

    private function getDateTimeId(Collection $dayTimes, string $day, string $time)
    {
        $dayTime = $dayTimes->where('day', $day)->where('time', $time)->firstOrFail();

        return $dayTime->id;
    }
}
