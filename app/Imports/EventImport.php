<?php

namespace App\Imports;

use App\Models\Module;
use App\Models\Event;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class EventImport implements ToCollection, WithHeadingRow, SkipsEmptyRows
{

    const NUMBER_OF_YEARS = 8;

    private $year;
    private $locations;
    private $times;
    private $moduleCache;

    public function __construct($year, $locations, $times)
    {
        $this->year = $year;
        $this->locations = $locations;
        $this->times = $times;
    }

    /**
     * @param Collection $rows
     */
    public function collection(Collection $rows)
    {
        $this->moduleCache = [];
        Event::where('year', '>=', $this->year)->delete();

        foreach ($rows as $row) {
            $moduleId = $row['Modulnummer'];
            if (!array_key_exists($moduleId, $this->moduleCache)) {
                $module =  $module = Module::findOrFail($moduleId);
                $this->moduleCache[$moduleId] = $module;
            } else {
                $module = $this->moduleCache[$moduleId];
            }
            $this->parseRow($row, $module);
        }
    }

    private function parseRow($row, $module)
    {
        $ids = [];

        $semesters = [];
        if ($this->isTrue($row['HS'])) {
            $semesters[] = 'HS';
        }
        if ($this->isTrue($row['FS'])) {
            $semesters[] = 'FS';
        }
        $week = $row['Zeitfenster'];

        $locations = [];
        foreach ($this->locations as $location) {
            if ($this->isTrue($row[$location])) {
                $locations[] = $location;
            };
        }
        $timeLetters = [];
        foreach ($this->times as $letter => $time) {
            if ($this->isTrue($row[$letter])) {
                $timeLetters[] = $letter;
            }
        }

        foreach ($locations as $location) {
            foreach ($semesters as $semester) {
                foreach ($timeLetters as $timeLetter) {
                    $day = $this->times[$timeLetter]['day'];
                    $time = $this->times[$timeLetter]['time'];
                    for ($i = 0; $i < self::NUMBER_OF_YEARS; $i++) {
                        $year = $this->year + $i;
                        $event = $this->createEvent($module, $year, $semester, $week, $day, $time, $location);
                    }
                    $ids[] = $event->id;
                }
            }
        }

        return $ids;
    }

    private function isTrue($field)
    {
        return $field === 'Ja';
    }

    private function createEvent($module, $year, $semester, $week, $day, $time, $location)
    {

        $event = new Event();
        $event->year = $year;
        $event->semester = $semester;
        $event->week = $week;
        $event->day = $day;
        $event->time = $time;
        $event->location = $location;
        $event->module()->associate($module->id);
        $event->save();
        return $event;
    }
}
