<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class TimeImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{

    private $times = [];

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $this->times = [];
        foreach ($rows as $row) {
            $name = $row['Name'];
            $day = $row['Tag'];
            $time = $row['Zeit'];
            $this->times[$name] = ['day' => $day, 'time' => $time];
        }
    }

    public function getTimes()
    {
        return $this->times;
    }
}
