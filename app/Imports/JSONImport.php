<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Event;
use App\Models\Focus;
use App\Models\Module;
use App\Models\Planer;
use Illuminate\Support\Facades\DB;

class JSONImport
{
    const NUMBER_OF_YEARS = 8;

    private $file;
    private $modulesCache = [];
    private $year;
    private $times = [];
    private $timeWindows = [];

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
            $this->importFoci($planerData, $planer);
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
            if (isset($categoryData->requiredNumber)) {
                $category->required_number = $categoryData->requiredNumber;
            }
            if (isset($categoryData->moduleSelection)) {
                $category->module_selection_enabled = true;
                if (isset($categoryData->moduleSelection->minCredits)) {
                    $category->min_credits = $categoryData->moduleSelection->minCredits;
                }
                if (isset($categoryData->moduleSelection->maxCredits)) {
                    $category->max_credits = $categoryData->moduleSelection->maxCredits;
                }
            }
            $planer->categories()->save($category);
            $category->modules()->syncWithoutDetaching($categoryData->modules);
            $category->save();
        }
    }

    private function importFoci($planerData, $planer)
    {
        if (!isset($planerData->foci)) {
            return;
        }
        foreach ($planerData->foci as $focusData) {
            $focus = $planer->foci->where('id', $focusData->id)->first();
            if (!$focus) {
                $focus = new Focus();
                $focus->id = $focusData->id;
                $focus->name = $focusData->name;
                $planer->foci()->save($focus);
            } else {
                $focus->name = $focusData->name;
            }
            $modules = array();
            foreach ($focusData->requiredModules as $module) {
                $modules[$module] = ['required' => true];
            }
            if (isset($focusData->optionalModules)) {
                foreach ($focusData->optionalModules as $module) {
                    $modules[$module] = ['required' => false];
                }
            }
            if (isset($focusData->requiredNumberOfOptionalModules)) {
                $focus->required_number_of_optional_modules = $focusData->requiredNumberOfOptionalModules;
            }
            $focus->modules()->sync($modules);
            $focus->save();
        }
    }

    private function importEvents($data)
    {
        Event::where('year', '>=', $this->year)->delete();
        foreach ($data->events as $eventData) {
            $module = $this->getModule($eventData->module);

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
                            $this->createEvent($module, $year, $semester, $timeWindow, $day, $time, $location);
                        }
                    }
                }
            }
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
    }
}
