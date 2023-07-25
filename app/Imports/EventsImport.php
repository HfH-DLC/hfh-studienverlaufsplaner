<?php

namespace App\Imports;

use App\Models\Event;
use Illuminate\Support\Facades\DB;
use App\Models\EventsImportRecord;

class EventsImport
{
    const NUMBER_OF_YEARS = 8;

    private $file;
    private $year;
    private $timeWindows = [
        1 => [
            "name" => "Pflichtmodule & Wahlpflichtmodule"
        ],
        2 => [
            "name" => "Berufspraxis, Portfolio & Masterarbeit"
        ]
    ];

    public function __construct($file)
    {
        $this->file = $file;
    }

    public function run()
    {
        //todo validate json
        DB::transaction(function () {
            $json = file_get_contents($this->file);
            $data = json_decode($json);
            $this->year = $data->year;
            $this->importEvents($data);
            $this->saveImport($data);
        });
    }

    private function importEvents($data)
    {
        $eventIds = [];
        foreach ($data->events as $eventData) {
            $planers = $eventData->planers;

            $semesters = $eventData->semesters;
            $timeWindow = $this->timeWindows[$eventData->timeWindow]['name'];

            $locations = $eventData->locations;
            $dayTimes = $eventData->dayTimes;

            $moduleID = $eventData->module;

            foreach ($planers as $planer) {
                foreach ($locations as $location) {
                    foreach ($semesters as $semester) {
                        foreach ($dayTimes as $dayTime) {
                            for ($i = 0; $i < self::NUMBER_OF_YEARS; $i++) {
                                $year = $this->year + $i;
                                $event =  $this->createEvent($moduleID, $year, $semester, $timeWindow, $dayTime, $location, $planer);
                                $eventIds[] = $event->id;
                            }
                        }
                    }
                }
            }
        }
        Event::where('year', '>=', $this->year)->whereNotIn('id', $eventIds)->delete();
    }

    private function createEvent($moduleID, $year, $semester, $timeWindow, $dayTime, $location, $planer)
    {
        return Event::firstOrCreate([
            'module_id' => $moduleID, 'year' => $year, 'semester' => $semester, 'time_window' => $timeWindow, 'day_time_id' => $dayTime, 'location_id' => $location, 'planer_id' => $planer
        ]);
    }

    private function saveImport($data)
    {
        $importRecord = new EventsImportRecord();
        $importRecord->year = $data->year;
        $importRecord->version = $data->version;
        $importRecord->save();
    }
}
