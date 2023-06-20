<?php

namespace Tests\Feature;

use App\Models\EventsImportRecord;
use App\Models\Planer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PlanerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * @test
     */
    public function show_planer_page()
    {
        EventsImportRecord::factory()->create();
        $planer = Planer::factory()->create();
        $url = "/$planer->id";
        $response = $this->get($url);
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Planer')
            ->where('slug', $planer->id));
    }
}
