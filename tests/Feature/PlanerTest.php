<?php

namespace Tests\Feature;

use App\Models\Placement;
use App\Models\Plan;
use App\Models\Planer;
use Database\Seeders\PlanerSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Inertia\Testing\Assert;
use Tests\TestCase;

class PlanerTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * @test
     */
    public function show_planer_page()
    {
        $planer = Planer::factory()->create();
        $url = "/planers/$planer->slug";
        $response = $this->get($url);
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Planer')
            ->where('slug', $planer->slug));
    }

    /**
     * @test
     */
    public function show_plan_page()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/planers/$planer->slug/plans/$plan->slug";
        $response = $this->get($url);
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Plan')
            ->where('planerName', $planer->name)
            ->where('planerSlug', $planer->slug)
            ->has('plan')
            ->has('categories')
            ->has('events')
            ->has('modules')
            ->has('rules')
            ->has('requiredCredits')
            ->has('optionsTimeWindow')
            ->has('optionsDay')
            ->has('optionsTime'));
    }

    /** @test */
    public function store_plan()
    {
        $planer = Planer::factory()->create();
        $url = "/planers/$planer->slug/plans";
        $params = array('startYear' => 2022);
        $response = $this->post($url, $params);
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseCount('plans', 1);
        $plan = $planer->plans()->first();
        $response->assertRedirect("/planers/$planer->slug/plans/$plan->slug");
    }

    /** @test */
    public function cannot_store_plan_without_start_year()
    {
        $planer = Planer::factory()->create();
        $url = "/planers/$planer->slug/plans";
        $params = array();
        $response = $this->post($url, $params);
        $response->assertSessionHasErrors("startYear");
        $this->assertDatabaseCount('plans', 0);
    }

    /** @test */
    public function update_plan()
    {
        $this->seed(PlanerSeeder::class);
        $planer = Planer::first();

        $plan = Plan::factory()->for($planer)->create();
        $url = "/planers/$planer->slug/plans/$plan->slug";
        $placements = [];
        foreach ($this->validPlacements() as $placement) {
            $placements[] = [
                'moduleId' => $placement[0],
                'eventId' => $placement[1]
            ];
        }
        $data = array('placements' => $placements);

        $response = $this->json('put', $url, $data);
        $response->assertSuccessful();
        $response->assertJsonStructure(['data' => [
            'slug',
            'placements'
        ]]);
        $response->assertJsonFragment(['slug' => $plan->slug]);
        foreach ($placements as $placement) {
            $response->assertJsonFragment($placement);
        }
        $plan = $plan->fresh();
        $this->assertEquals(4, $plan->placements()->count());
    }

    public function validPlacements()
    {
        return [
            [3, 109],
            [4, 116],
            [5, 108],
            [6, 133]
        ];
    }

    /** @test */
    public function cannot_update_plan_with_invalid_placements()
    {
        $this->seed(PlanerSeeder::class);
        $planer = Planer::first();

        $plan = Plan::factory()->for($planer)->create();
        $url = "/planers/$planer->slug/plans/$plan->slug";
        $placements = [];
        foreach ($this->invalidPlacements() as $placement) {
            $placements[] = [
                'moduleId' => $placement[0],
                'eventId' => $placement[1]
            ];
        }
        $data = array('placements' => $placements);

        $response = $this->json('put', $url, $data);
        $response->assertUnprocessable();
        $response->assertJsonValidationErrors(array('placements.0.eventId', 'placements.0.moduleId'));
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->placements()->count());
    }

    /** @test */
    public function cannot_update_plan_without_placements()
    {
        $this->seed(PlanerSeeder::class);
        $planer = Planer::first();

        $plan = Plan::factory()->for($planer)->create();
        $url = "/planers/$planer->slug/plans/$plan->slug";
        $data = array();

        $response = $this->json('put', $url, $data);
        $response->assertJsonValidationErrors('placements');
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->placements()->count());
    }

    public function invalidPlacements()
    {
        return [
            [999, 999],
        ];
    }
}
