<?php

namespace App\Imports;

use App\Models\Planer;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class PlanerImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{
    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $name = $row['Name'];
            $planer = Planer::where('name', $name)->first();
            if (!$planer) {
                $planer = new Planer();
                $planer->name = $name;
                $planer->slug = $row['Slug'];
                $planer->required_credits = $row['Benötigte Kreditpunkte'];
                $planer->save();
            }
        }
    }
}
