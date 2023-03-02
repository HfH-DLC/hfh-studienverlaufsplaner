<?php

namespace Tests\Feature;

use App\Models\Planer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class OverviewTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function can_show_overview_page()
    {
        $planer = Planer::factory()->create();
        $url = "/$planer->slug/angebot";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component("Overview"));
    }
}
