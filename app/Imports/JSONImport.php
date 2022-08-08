<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Event;
use App\Models\Module;
use App\Models\Planer;
use App\Models\Rule;
use Illuminate\Support\Facades\DB;

class JSONImport
{
    const NUMBER_OF_YEARS = 8;

    private $file;
    private $modulesCache = [];
    private $year;
    private $times = [];
    private $timeWindows = [];

    public function __construct($year, $file)
    {
        $this->year = $year;
        $this->file = $file;
    }

    public function run()
    {
        //todo validate json
        DB::transaction(function () {
            $json = file_get_contents($this->file);
            $data = json_decode($json);
            $this->getTimes($data);
            $this->importModules($data);
            $this->importPlaners($data);
            $this->importEvents($data);
        });
    }

    private function getTimes($data)
    {
        foreach ($data->times as $row) {
            $id = $row->id;
            $day = $row->day;
            $time = $row->time;
            $this->times[$id] = ['day' => $day, 'time' => $time];
        }

        foreach ($data->timeWindows as $row) {
            $id = $row->id;
            $name = $row->name;
            $this->timeWindows[$id] = ['name' => $name];
        }
    }

    private function importModules($data)
    {
        foreach ($data->modules as $moduleData) {
            $this->upsertModule($moduleData);
        }
        foreach ($data->modules as $moduleData) {
            $this->setPrerequisites($moduleData);
        }
    }

    private function upsertModule($moduleData)
    {
        $id = $moduleData->id;
        $existingModule = Module::find($id);
        if ($existingModule) {
            $module = $existingModule;
        } else {
            $module = new Module();
            $module->id = $id;
        }
        $module->name = $moduleData->name;
        $module->credits = $moduleData->credits;
        $module->save();
        $this->modulesCache[$id] = $module;
    }

    private function setPrerequisites($moduleData)
    {
        $prerequisites = [];
        if (isset($moduleData->prerequisites)) {
            $module = $this->getModule($moduleData->id);
            $prerequisiteIds = explode(',', $moduleData->prerequisites);
            foreach ($prerequisiteIds as $prerequisiteId) {
                $prerequisites[] = $this->getModule($prerequisiteId)->id;
            }
            $module->prerequisites()->sync($prerequisites);
        }
    }

    private function getModule($id)
    {
        if (array_key_exists($id, $this->modulesCache)) {
            $module = $this->modulesCache[$id];
        } else {
            $module = Module::findOrFail($id);
            $this->modulesCache[$id] = $module;
        }
        return $module;
    }

    private function importPlaners($data)
    {
        foreach ($data->planers as $planerData) {
            $planerName = $planerData->name;
            $planer = Planer::where('name', $planerName)->first();
            if (!$planer) {
                $planer = new Planer();
                $planer->name = $planerName;
            }

            $planer->slug = $planerData->slug;
            $planer->required_credits = $planerData->requiredCredits;
            $planer->module_selection_enabled = $planerData->moduleSelectionEnabled;
            $planer->save();

            $this->importCategories($planerData, $planer);
        }
    }

    private function importCategories($planerData, $planer)
    {
        foreach ($planerData->categories as $categoryData) {
            $categoryName = $categoryData->name;
            $category = $planer->categories->where('name', $categoryName)->first();
            if (!$category) {
                $category = new Category();
                $category->name = $categoryName;
            }
            //todo min/max credits, min/max modules
            $planer->categories()->save($category);
            $category->modules()->attach($categoryData->modules);
            $category->save();
        }
    }

    private function importEvents($data)
    {
        Event::where('year', '>=', $this->year)->delete();
        foreach ($data->events as $eventData) {
            $module = $this->getModule($eventData->module);
            $ids = [];

            $semesters = $eventData->semesters;
            $timeWindow = $this->timeWindows[$eventData->timeWindow];

            $locations = $eventData->locations;
            $timeLetters = $eventData->times;

            foreach ($locations as $location) {
                foreach ($semesters as $semester) {
                    foreach ($timeLetters as $timeLetter) {
                        $day = $this->times[$timeLetter]['day'];
                        $time = $this->times[$timeLetter]['time'];
                        for ($i = 0; $i < self::NUMBER_OF_YEARS; $i++) {
                            $year = $this->year + $i;
                            $event = $this->createEvent($module, $year, $semester, $timeWindow, $day, $time, $location);
                        }
                        $ids[] = $event->id;
                    }
                }
            }

            return $ids;
        }
    }

    private function createEvent($module, $year, $semester, $timeWindow, $day, $time, $location)
    {

        $event = new Event();
        $event->year = $year;
        $event->semester = $semester;
        $event->week = $timeWindow['name']; //todo rename week
        $event->day = $day;
        $event->time = $time;
        $event->location = $location;
        $event->module()->associate($module->id);
        $event->save();
        return $event;
    }
}
