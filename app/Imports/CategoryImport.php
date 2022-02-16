<?php

namespace App\Imports;

use App\Models\Category;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class CategoryImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $name = $row['Name'];
            $category = Category::where('Name', $name)->first();
            if (!$category) {
                $category = new Category();
                $category->name = $name;
                $category->save();
            }
        }
    }
}
