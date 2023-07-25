<?php

namespace Tests\Feature;

use App\Models\DayTime;
use App\Models\Location;
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
        $url = "/$planer->id/$plan->slug/einstellungen";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component("Settings"));
    }

    /** @test */
    public function can_update_locations()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        Location::factory()->create(['id' => 'ZH', 'name' => 'Zürich', 'default' => true]);
        Location::factory()->create(['id' => 'GR', 'name' => 'Chur']);
        $this->assertTrue($plan->locations->isEmpty());

        $url = "/$planer->id/$plan->slug/einstellungen";
        $params = ['locations' => ['ZH', 'GR']];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEqualsCanonicalizing(['ZH', 'GR'], $plan->locations->pluck('id')->all());
    }

    /** @test */
    public function can_update_day_times()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        DayTime::factory()->create(['id' => 'a', 'day' => 'Montag', 'time' => 'Morgen', 'default' => true, 'sort_index' => 0]);
        DayTime::factory()->create(['id' => 'c', 'day' => 'Dienstag', 'time' => 'Nachmittag', 'default' => true, 'sort_index' => 0]);
        $this->assertTrue($plan->dayTimes->isEmpty());

        $url = "/$planer->id/$plan->slug/einstellungen";
        $params = ['dayTimes' => ['a', 'c']];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEqualsCanonicalizing(['a', 'c'], $plan->dayTimes()->pluck('id')->all());
    }
}
