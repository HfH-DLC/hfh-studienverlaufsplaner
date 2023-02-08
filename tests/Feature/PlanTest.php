<?php

namespace Tests\Feature;

use App\Models\Plan;
use App\Models\Planer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Inertia\Testing\AssertableInertia as Assert;

class PlanTest extends TestCase
{
    use RefreshDatabase;
    use WithFaker;

    /**
     * @test
     */
    public function can_show_schedule_page()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->slug/$plan->slug/zeitplan";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Schedule')
                ->where('planerName', $planer->name)
                ->where('planerSlug', $planer->slug)
                ->has('planResource')
                ->has('categoriesResource')
                ->has('focusSelectionEnabled')
                ->has('fociResource')
                ->has('rulesResource')
                ->has('todosResource')
                ->has('locationsResource')
                ->has('requiredECTS')
                ->has('tourData')
                ->has('brochureUrl')
                ->has('moduleDirectoryUrl')
        );
    }

    /**
     * @test
     */
    public function can_show_credit_page()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->slug/$plan->slug/anrechnung";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Credit')
                ->where('planerName', $planer->name)
                ->where('planerSlug', $planer->slug)
                ->has('planResource')
                ->has('creditableModulesResource')
                ->has('rulesResource')
                ->has('todosResource')
                ->has('tourData')
                ->has('brochureUrl')
                ->has('moduleDirectoryUrl')
        );
    }

    /** @test */
    public function store_plan()
    {
        $planer = Planer::factory()->create();
        $url = "/$planer->slug/plans";
        $params = ['startYear' => 2022, 'email' => 'jane.doe@example.com'];
        $response = $this->post($url, $params);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseCount('plans', 1);
        $plan = $planer->plans()->first();
        $response->assertRedirect("/$planer->slug/$plan->slug");
    }

    /** @test */
    public function cannot_store_plan_without_start_year()
    {
        $planer = Planer::factory()->create();
        $url = "/$planer->slug/plans";
        $params = ['email' => 'jane.doe@example.com'];

        $response = $this->post($url, $params);

        $response->assertSessionHasErrors("startYear");
        $this->assertDatabaseCount('plans', 0);
    }

    /** @test */
    public function cannot_store_plan_without_email()
    {
        $planer = Planer::factory()->create();
        $url = "/$planer->slug/plans";
        $params = ['startYear' => '2020'];

        $response = $this->post($url, $params);

        $response->assertSessionHasErrors("email");
        $this->assertDatabaseCount('plans', 0);
    }

    /** @test */
    public function can_update_schedule()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->slug/$plan->slug/zeitplan";
        $params = ['placements' => [], 'focusSelections' => [], 'tourCompleted' => false, 'valid' => false, 'locations' => []];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
    }

    /** @test */
    public function tour_completed_is_required_to_update_schedule()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->slug/$plan->slug/zeitplan";
        $params = ['valid' => false];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors("tourCompleted");
    }

    /** @test */
    public function valid_is_required_to_update_schedule()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->slug/$plan->slug/zeitplan";
        $params = ['tourCompleted' => false];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors("valid");
    }

    /** @test */
    public function can_update_schedule_tourCompleted()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create(['schedule_tour_completed' => false]);
        $url = "/$planer->slug/$plan->slug/zeitplan";
        $params = ['valid' => false, 'tourCompleted' => true];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertTrue($plan->schedule_tour_completed);
    }

    /** @test */
    public function can_update_schedule_valid()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create(['schedule_valid' => false]);
        $url = "/$planer->slug/$plan->slug/zeitplan";
        $params = ['valid' => true, 'tourCompleted' => false];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertTrue($plan->schedule_valid);
    }
}
