<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Module;
use App\Models\Planer;
use App\Models\TimeSlot;
use Illuminate\Database\Seeder;

class PlanerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Planer::factory()->create([
            'name' => 'HFE',
            'required_credits' => 90,
            'options_day' => '["Montag","Donnerstag"]'
        ]);
        $this->import_records(Category::class);
        $this->import_records(TimeSlot::class);
        $this->import_records(Module::class);
        $this->import_module_timeslots();
        $this->import_module_prerequisites();
    }

    private function import_records($class)
    {
        $table = (new $class())->getTable();
        $file = public_path("/seeders/$table".".csv");
        $records = $this->read_CSV($file);
        foreach ($records as $key => $record) {
            $class::create($record);
        }
    }

    private function import_module_timeslots()
    {
        $file = public_path("/seeders/module_time_slot.csv");
        $records = $this->read_CSV($file);
        foreach ($records as $key => $record) {
            $module = Module::find($record['module_id']);
            $module->timeSlots()->attach($record['time_slot_id']);
            $module->save();
        }
    }

    private function import_module_prerequisites()
    {
        $file = public_path("/seeders/module_prerequisite.csv");
        $records = $this->read_CSV($file);
        foreach ($records as $key => $record) {
            $module = Module::find($record['module_id']);
            $module->prerequisites()->attach($record['prerequisite_id']);
            $module->save();
        }
    }

    private function read_CSV($filename, $delimiter = ',')
    {
        if (!file_exists($filename) || !is_readable($filename)) {
            return false;
        }
        $header = null;
        $data = array();
        if (($handle = fopen($filename, 'r')) !== false) {
            while (($row = fgetcsv($handle, 1000, $delimiter)) !== false) {
                if (!$header) {
                    $header = $row;
                } else {
                    $data[] = array_combine($header, $row);
                }
            }
            fclose($handle);
        }
        return $data;
    }
}
