<?php

namespace Tests\Unit;

use App\Models\Import;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class ImportTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function it_returns_the_newest_import_year(): void
    {
        Import::factory()->create(['year' => 2021]);
        Import::factory()->create(['year' => 2025]);
        Import::factory()->create(['year' => 2023]);

        $this->assertEquals(2025, Import::getNewestImportedYear());
    }

    /** @test */
    public function it_returns_the_oldest_import_year(): void
    {
        Import::factory()->create(['year' => 2021]);
        Import::factory()->create(['year' => 2025]);
        Import::factory()->create(['year' => 2023]);

        $this->assertEquals(2021, Import::getOldestImportYear());
    }
}
