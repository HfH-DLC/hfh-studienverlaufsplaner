<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;
use Maatwebsite\Excel\Imports\HeadingRowFormatter;

class TempImport implements WithMultipleSheets
{

    private $locationImport;
    private $timeImport;

    public function __construct()
    {
        HeadingRowFormatter::default('none');
    }

    public function sheets(): array
    {
        $this->locationImport = new LocationImport();
        $this->timeImport = new TimeImport();

        return [
            'Standorte' => $this->locationImport,
            'Zeiten' => $this->timeImport
        ];
    }

    public function getLocations()
    {
        return $this->locationImport->getLocations();
    }

    public function getTimes()
    {
        return $this->timeImport->getTimes();
    }
}
