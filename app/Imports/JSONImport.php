<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\DayTime;
use App\Models\Event;
use App\Models\Focus;
use App\Models\Import;
use App\Models\Module;
use App\Models\Planer;
use App\Models\Rule;
use App\Models\Todo;
use App\Models\Location;
use Illuminate\Support\Facades\DB;

class JSONImport
{
    const NUMBER_OF_YEARS = 8;

    private $file;
    private $modulesCache = [];
    private $year;
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
            $this->importDayTimes($data);
            $this->getTimeWindows($data);
            $this->importModules($data);
            $this->importPlaners($data);
            $this->importEvents($data);
            $this->importLocations($data);
            $this->saveImport($data);
        });
    }

    private function importDayTimes($data)
    {
        foreach ($data->dayTimes as $row) {
            $default = false;
            if (isset($row->default)) {
                $default = $row->default;
            }
            var_dump($row->day);
            $dayTime = DayTime::firstOrCreate(['id' => $row->id, 'day' => $row->day, 'time' => $row->time, 'sort_index' => $row->sortIndex]);
            $dayTime->default = $default;
            $dayTime->save();
        }
    }

    private function getTimeWindows($data)
    {
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
        $module->ects = $moduleData->ects;
        $module->creditable = $moduleData->creditable;
        if (isset($moduleData->modifiers)) {
            $module->modifiers = $moduleData->modifiers;
        }
        $module->save();
        $this->modulesCache[$id] = $module;
    }

    private function setPrerequisites($moduleData)
    {
        $prerequisites = [];
        if (isset($moduleData->prerequisites)) {
            $module = $this->getModule($moduleData->id);
            foreach ($moduleData->prerequisites as $prerequisiteId) {
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
            $planer->required_ects = $planerData->requiredECTS;
            $planer->focus_selection_enabled = $planerData->focusSelectionEnabled;
            $planer->tour = $planerData->tour;
            $planer->meta = $planerData->meta;
            $planer->save();

            $this->importCategories($planerData, $planer);
            $this->importFoci($planerData, $planer);
            $this->importRules($planerData, $planer);
            $this->importTodos($planerData, $planer);
        }
    }

    private function importCategories($planerData, $planer)
    {
        $planer->categories()->delete();
        foreach ($planerData->categories as $index => $categoryData) {

            $category = new Category();
            $category->name = $categoryData->name;
            $category->position = $index;
            if (isset($categoryData->required)) {
                $category->required = $categoryData->required;
            }
            if (isset($categoryData->minECTS)) {
                $category->min_ects = $categoryData->minECTS;
            }
            if (isset($categoryData->maxECTS)) {
                $category->max_ects = $categoryData->maxECTS;
            }
            $category->required = isset($category->required) && $category->required == true;
            $planer->categories()->save($category);
            $category->modules()->sync($categoryData->modules);
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
            $modules = [];
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

    private function importRules($planerData, $planer)
    {
        if (!isset($planerData->rules)) {
            return;
        }
        $planer->rules()->delete();
        foreach ($planerData->rules as $ruleData) {
            $rule = new Rule();
            $rule->name = $ruleData->name;
            $rule->type = $ruleData->type;
            if (isset($ruleData->params)) {
                $rule->params = $ruleData->params;
            }
            $planer->rules()->save($rule);
        }
    }

    private function importTodos($planerData, $planer)
    {
        if (!isset($planerData->todos)) {
            return;
        }
        $planer->todos()->delete();
        foreach ($planerData->todos as $todoData) {
            $todo = new Todo();
            $todo->name = $todoData->name;
            $todo->type = $todoData->type;
            if (isset($todoData->params)) {
                $todo->params = $todoData->params;
            }
            $planer->todos()->save($todo);
        }
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
            'module_id' => $moduleID, 'year' => $year, 'semester' => $semester, 'time_window' => $timeWindow, 'day_time_id' => $dayTime, 'location_id' => $location, 'planer' => $planer
        ]);
    }

    private function importLocations($data)
    {
        foreach ($data->locations as $location) {
            $default = false;
            if (isset($location->default)) {
                $default = $location->default;
            }
            $location = Location::firstOrCreate(['id' => $location->id, 'name' => $location->name]);
            $location->default = $default;
            $location->save();
        }
    }

    private function saveImport($data)
    {
        $import = new Import();
        $import->year = $data->year;
        $import->version = $data->version;
        $import->save();
    }
}
