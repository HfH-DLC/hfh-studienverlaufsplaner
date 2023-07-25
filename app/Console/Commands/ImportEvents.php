<?php

namespace App\Console\Commands;

use App\Imports\EventsImport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ImportEvents extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:events {path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports events';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $path = $this->argument('path');
        $import = new EventsImport($path);
        $import->run();
        Cache::flush();
    }
}
