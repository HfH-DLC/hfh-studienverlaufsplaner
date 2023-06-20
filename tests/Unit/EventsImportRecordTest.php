<?php

namespace Tests\Unit;

use App\Models\EventsImportRecord;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

class EventsImportRecordTest extends TestCase
{
    use DatabaseMigrations;

    /** @test */
    public function it_returns_the_newest_import_year(): void
    {
        EventsImportRecord::factory()->create(['year' => 2021]);
        EventsImportRecord::factory()->create(['year' => 2025]);
        EventsImportRecord::factory()->create(['year' => 2023]);

        $this->assertEquals(2025, EventsImportRecord::getNewestImportedYear());
    }

    /** @test */
    public function it_returns_the_oldest_import_year(): void
    {
        EventsImportRecord::factory()->create(['year' => 2021]);
        EventsImportRecord::factory()->create(['year' => 2025]);
        EventsImportRecord::factory()->create(['year' => 2023]);

        $this->assertEquals(2021, EventsImportRecord::getOldestImportYear());
    }
}
