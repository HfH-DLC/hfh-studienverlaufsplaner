<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Event;
use App\Models\Focus;
use App\Models\Module;
use App\Models\Planer;
use App\Models\Rule;
use App\Models\Todo;
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
            $planer->save();

            $this->importCategories($planerData, $planer);
            $this->importFoci($planerData, $planer);
            $this->importRules($planerData, $planer);
            $this->importTodos($planerData, $planer);
        }
    }

    private function importCategories($planerData, $planer)
    {
        foreach ($planerData->categories as $index => $categoryData) {
            $categoryName = $categoryData->name;
            $category = $planer->categories->where('name', $categoryName)->first();
            if (!$category) {
                $category = new Category();
                $category->name = $categoryName;
            }
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
        if (!isset($planerData->rules)) {
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
        $eventIds = array();
        foreach ($data->events as $eventData) {

            $semesters = $eventData->semesters;
            $timeWindow = $this->timeWindows[$eventData->timeWindow]['name'];

            $locations = $eventData->locations;
            $timeLetters = $eventData->times;

            $moduleID = $eventData->module;
            foreach ($locations as $location) {
                foreach ($semesters as $semester) {
                    foreach ($timeLetters as $timeLetter) {
                        $day = $this->times[$timeLetter]['day'];
                        $time = $this->times[$timeLetter]['time'];
                        for ($i = 0; $i < self::NUMBER_OF_YEARS; $i++) {
                            $year = $this->year + $i;
                            $event =  $this->createEvent($moduleID, $year, $semester, $timeWindow, $day, $time, $location);
                            $eventIds[] = $event->id;
                        }
                    }
                }
            }
        }
        Event::where('year', '>=', $this->year)->whereNotIn('id', $eventIds)->delete();
    }

    private function createEvent($moduleID, $year, $semester, $timeWindow, $day, $time, $location)
    {
        return Event::firstOrCreate([
            'module_id' => $moduleID, 'year' => $year, 'semester' => $semester, 'time_window' => $timeWindow, 'day' => $day, 'time' => $time, 'location' => $location
        ]);
    }
}
