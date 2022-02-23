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
        $id = $row['Nummer'];
        $name = $row['Name'];
        $credits = $row['Kreditpunkte'];
        $existingModule = Module::find($id);
        if ($existingModule) {
            $module = $existingModule;
        } else {
            $module = new Module();
            $module->id = $id;
        }
        $module->name = $name;
        $module->credits = $credits;
        $category = $this->getCategory($row['Kategorie']);
        $module->category()->associate($category);
        $module->save();
        $modules[$id] = $module;
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
        $prerequisiteIds = $row['Voraussetzungen'];
        if ($prerequisiteIds) {
            $id = $row['Nummer'];
            $module = $this->getModule($id);
            $prerequisiteIds = explode(',', $prerequisiteIds);
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
}
