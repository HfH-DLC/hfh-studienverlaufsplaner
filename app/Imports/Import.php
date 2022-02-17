<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

class Import implements WithMultipleSheets
{
    private $year;
    private $locations;
    private $times;

    public function __construct($year, $locations, $times)
    {
        $this->year = $year;
        $this->locations = $locations;
        $this->times = $times;
        HeadingRowFormatter::default('none');
    }

    public function sheets(): array
    {
        return [
            'Studiengänge' => new PlanerImport($this->year),
            'Kategorien' => new CategoryImport(),
            'Module' => new ModuleImport(),
            'Durchführungen' => new EventImport($this->year, $this->locations, $this->times),
            'Studiengänge_Kategorien_Meta' => new CategoryPlanerMetaImport()
        ];
    }
}
