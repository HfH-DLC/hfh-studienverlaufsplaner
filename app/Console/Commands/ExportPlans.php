<?php

namespace App\Console\Commands;

use App\Models\Plan;
use Illuminate\Console\Command;

class ExportPLans extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'export:plans';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Exports plans to json';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $count = 0;
        $data = ['plans' => []];
        foreach (Plan::all() as $plan) {
            $planData = $this->exportPlan($data, $plan);
            array_push($data['plans'], $planData);
            $count++;
        }
        $json = json_encode($data);

        //write json to file
        if (file_put_contents("plans.json", $json)) {
            $this->info("JSON file created successfully");
            $this->info("Export finished");
            $this->info("{$count} Plans exported");
        } else {
            $this->error("Error creating json file");
        }
    }

    private function exportPlan($data, Plan $plan)
    {
        $planData = [
            'id' => $plan->id,
            'created_at' => $plan->created_at,
            'planer_slug' => $plan->planer->slug,
            'email' => $plan->email,
            'start_year' => $plan->start_year,
            'schedule_tour_completed' => $plan->schedule_tour_completed,
            'credit_tour_completed' => $plan->credit_tour_completed,
            'schedule_valid' => $plan->schedule_valid,
            'read_only' => $plan->read_only,
        ];
        array_push($data['plans'], $planData);

        $planData['placements'] = [];
        foreach ($plan->placements as $placement) {
            $placementData = [
                'id' =>  $placement->id,
                'created_at' => $placement->created_at,
                'module_id' => $placement->module_id,
                'year' =>  $placement->year,
                'semester' => $placement->semester,
                'time_window' =>    $placement->time_window,
                'location_id' =>   $placement->location,
                'day' => $placement->day,
                'time' =>  $placement->time,
            ];
            array_push($planData['placements'], $placementData);
        }
        $planData['location_ids'] = $plan->locations()->pluck('id');

        return $planData;
    }
}
