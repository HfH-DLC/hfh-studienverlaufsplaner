<?php

namespace App\Console\Commands;

use App\Imports\ConfigImport;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Cache;

class ImportConfig extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'import:config {path}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Imports config';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        $path = $this->argument('path');
        $import = new ConfigImport($path);
        $import->run();
        Cache::flush();
    }
}
