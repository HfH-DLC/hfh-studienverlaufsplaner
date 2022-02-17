<?php

namespace App\Imports;

use App\Models\Category;
use App\Models\Planer;
use Exception;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class CategoryPlanerMetaImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $planerName = $row['Studiengang'];
            $categoryName = $row['Kategorie'];
            $requiredNumber = $row['Benötigte Anzahl'];
            $planer = Planer::where('name', $planerName)->firstOrFail();
            $category = $planer->categories()->where('name', $categoryName)->firstOrFail();
            if ($requiredNumber) {
                if (!$planer->categories()->updateExistingPivot($category->id, [
                    'required_number' => $requiredNumber
                ])) {
                    throw new Exception("CategoryPlanerMetaImport: Error updating required_number");
                }
            }
        }
    }
}
