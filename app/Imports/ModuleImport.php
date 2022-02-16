<?php

namespace App\Imports;

use App\Models\Module;
use App\Models\Category;
use App\Models\Planer;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class ModuleImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{
    private array $categoriesCache;
    private array $modulesCache;

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $this->categoriesCache = [];
        $this->modulesCache = [];
        $this->planersCache = [];
        $planers = Planer::all();

        foreach ($rows as $row) {
            $module = $this->upsertModule($row);
            $this->setPlaners($row, $module, $planers);
        }

        foreach ($rows as $row) {
            $this->setPrerequisites($row);
        }
    }

    private function getCategory($name)
    {
        if (array_key_exists($name, $this->categoriesCache)) {
            $category = $this->categoriesCache[$name];
        } else {
            $category = Category::where('name', $name)->firstOrFail();
            $categoriesCache[$name] = $category;
        }
        return $category;
    }

    private function upsertModule($row)
    {
        $number = $row['Nummer'];
        $name = $row['Name'];
        $credits = $row['Kreditpunkte'];
        $existingModule = Module::where('number', $number)->first();
        if ($existingModule) {
            $module = $existingModule;
        } else {
            $module = new Module();
            $module->number = $number;
        }
        $module->name = $name;
        $module->credits = $credits;
        $category = $this->getCategory($row['Kategorie']);
        $module->category()->associate($category);
        $module->save();
        $modules[$number] = $module;
        return $module;
    }

    private function setPlaners($row, $module, $planers)
    {
        $ids = [];
        foreach ($planers as $planer) {
            if ($row[$planer->name] && $row[$planer->name] === 'Ja') {
                $ids[] = $planer->id;
            }
        }
        $module->category->planers()->syncWithoutDetaching($ids);
        $module->planers()->sync($ids);
    }


    private function setPrerequisites($row)
    {
        $prerequisites = [];
        $prerequisiteNumbers = $row['Voraussetzungen'];
        if ($prerequisiteNumbers) {
            $number = $row['Nummer'];
            $module = $this->getModule($number);
            $prerequisiteNumbers = explode(',', $prerequisiteNumbers);
            foreach ($prerequisiteNumbers as $prerequisiteNumber) {
                $prerequisites[] = $this->getModule($prerequisiteNumber)->id;
            }
            $module->prerequisites()->sync($prerequisites);
        }
    }

    private function getModule($number)
    {
        if (array_key_exists($number, $this->modulesCache)) {
            $module = $this->modulesCache[$number];
        } else {
            $module = Module::where('number', $number)->firstOrFail();
            $this->modulesCache[$number] = $module;
        }
        return $module;
    }
}
