<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class SettingsTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function can_show_settings_page()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->slug/$plan->slug/einstellungen";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component("Settings"));
    }
}
