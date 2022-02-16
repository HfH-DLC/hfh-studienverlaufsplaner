<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class LocationImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{

    private $locations;

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $this->locations = [];
        foreach ($rows as $row) {
            $this->locations[] = $row['Name'];
        }
    }

    public function getLocations()
    {
        return $this->locations;
    }
}
