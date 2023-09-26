<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\ConfigImportRecord;
use App\Models\DayTime;
use App\Models\Focus;
use App\Models\Module;
use App\Models\Planer;
use App\Models\Rule;
use App\Models\Todo;
use App\Models\Location;
use Illuminate\Support\Facades\DB;

class ConfigImport
{
    private $file;
    private $modulesCache = [];

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
            $this->importDayTimes($data);
            $this->importModules($data);
            $this->importPlaners($data);
            $this->importLocations($data);
            $this->saveImport($data);
        });
    }

    private function importDayTimes($data)
    {
        $dayTimeIds = [];
        foreach ($data->dayTimes as $row) {
            $default = false;
            if (isset($row->default)) {
                $default = $row->default;
            }
            $dayTime = DayTime::firstOrNew(['id' => $row->id]);
            $dayTime->day = $row->day;
            $dayTime->time = $row->time;
            $dayTime->sort_index = $row->sortIndex;
            $dayTime->default = $default;
            $dayTime->save();
            $dayTimeIds[] = $dayTime->id;
        }
        DayTime::whereNotIn('id', $dayTimeIds)->delete();
    }

    private function importModules($data)
    {
        $moduleIds = [];
        foreach ($data->modules as $moduleData) {
            $id = $this->insertModule($moduleData);
            $moduleIds[] = $id;
        }
        Module::whereNotIn('id', $moduleIds)->delete();
        foreach ($data->modules as $moduleData) {
            $this->setPrerequisites($moduleData);
        }
    }

    private function insertModule($moduleData)
    {

        $module = Module::firstOrNew(['id' => $moduleData->id]);
        $module->name = $moduleData->name;
        $module->ects = $moduleData->ects;
        $module->creditable = $moduleData->creditable;
        if (isset($moduleData->modifiers)) {
            $module->modifiers = $moduleData->modifiers;
        }
        $module->save();
        $this->modulesCache[$module->id] = $module;
        return $module->id;
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
        $planerIds = [];
        foreach ($data->planers as $planerData) {
            $planer = Planer::firstOrNew(['id' => $planerData->slug]);
            $planer->name = $planerData->name;
            $planer->required_ects = $planerData->requiredECTS;
            $planer->focus_selection_enabled = $planerData->focusSelectionEnabled;
            $planer->tour = $planerData->tour;
            $planer->meta = $planerData->meta;
            $planer->save();
            $planerIds[] = $planer->id;

            $this->importCategories($planerData, $planer);
            $this->importFoci($planerData, $planer);
            $this->importRules($planerData, $planer);
            $this->importTodos($planerData, $planer);
        }
        Planer::whereNotIn('id', $planerIds)->delete();
    }

    private function importCategories($planerData, $planer)
    {
        $categoryIds = [];
        foreach ($planerData->categories as $index => $categoryData) {
            $category = Category::firstOrNew(['position' => $index, 'planer_id' => $planer->id]);
            $category->name = $categoryData->name;
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
            $category->selectable_for_prior_learning = $categoryData->selectableForPriorLearning;
            $planer->categories()->save($category);
            $category->modules()->sync($categoryData->modules);
            $category->save();
            $categoryIds[] = $category->id;
        }
        Category::where('planer_id', $planer->id)->whereNotIn('id', $categoryIds)->delete();
    }

    private function importFoci($planerData, $planer)
    {
        if (!isset($planerData->foci)) {
            return;
        }
        $focusIds = [];
        foreach ($planerData->foci as $focusData) {
            $focus = Focus::firstOrNew(['id' => $focusData->id]);
            $focus->name = $focusData->name;
            $planer->foci()->save($focus);
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
            $focusIds[] = $focus->id;
        }
        Focus::whereNotIn('id', $focusIds)->delete();
    }

    private function importRules($planerData, $planer)
    {
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

    private function importLocations($data)
    {
        $locationIds = [];
        foreach ($data->locations as $locationData) {
            $default = false;
            if (isset($locationData->default)) {
                $default = $locationData->default;
            }
            $location = Location::firstOrNew(['id' => $locationData->id]);
            $location->name = $locationData->name;
            $location->default = $default;
            $location->save();
            $locationIds[] = $location->id;
        }
        Location::whereNotIn('id', $locationIds)->delete();
    }

    private function saveImport($data)
    {
        $importRecord = new ConfigImportRecord();
        $importRecord->version = $data->version;
        $importRecord->save();
    }
}
