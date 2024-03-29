<?php

namespace Tests\Feature;

use App\Models\DayTime;
use App\Models\Focus;
use App\Models\FocusSelection;
use App\Models\Location;
use App\Models\Module;
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
        $url = "/$planer->id/$plan->slug/zeitplan";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Schedule')
                ->where('planerName', $planer->name)
                ->where('planerSlug', $planer->id)
                ->has('planResource')
                ->has('categoriesResource')
                ->has('focusSelectionEnabled')
                ->has('fociResource')
                ->has('rulesResource')
                ->has('todosResource')
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
        $planer = Planer::factory()->create(['focus_selection_enabled' => true]);
        $plan = Plan::factory()->for($planer)->create(['start_year' => 2023]);
        $url = "/$planer->id/$plan->slug/anrechnung";

        $response = $this->get($url);

        $response->assertSuccessful();
        $response->assertInertia(
            fn (Assert $page) => $page
                ->component('Credit')
                ->where('planerName', $planer->name)
                ->where('planerSlug', $planer->id)
                ->has('planResource')
                ->has('creditableModulesResource')
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
        $url = "/$planer->id/plans";
        $params = ['startYear' => 2022, 'email' => 'jane.doe@example.com'];
        $response = $this->post($url, $params);

        $response->assertSessionHasNoErrors();

        $this->assertDatabaseCount('plans', 1);
        $plan = $planer->plans()->first();
        $response->assertRedirect("/$planer->id/$plan->slug");
    }

    /** @test */
    public function cannot_store_plan_without_start_year()
    {
        $planer = Planer::factory()->create();
        $url = "/$planer->id/plans";
        $params = ['email' => 'jane.doe@example.com'];

        $response = $this->post($url, $params);

        $response->assertSessionHasErrors("startYear");
        $this->assertDatabaseCount('plans', 0);
    }

    /** @test */
    public function cannot_store_plan_without_email()
    {
        $planer = Planer::factory()->create();
        $url = "/$planer->id/plans";
        $params = ['startYear' => '2020'];

        $response = $this->post($url, $params);

        $response->assertSessionHasErrors("email");
        $this->assertDatabaseCount('plans', 0);
    }

    /** @test */
    public function tour_completed_is_required_to_update_schedule()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/zeitplan";
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
        $url = "/$planer->id/$plan->slug/zeitplan";
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
        $url = "/$planer->id/$plan->slug/zeitplan";
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
        $url = "/$planer->id/$plan->slug/zeitplan";
        $params = ['valid' => true, 'tourCompleted' => false];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertTrue($plan->schedule_valid);
    }

    /** @test */
    public function can_update_schedule_focus_selection()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        Focus::factory()->create(['id' => 'SSP_A', 'name' => 'Studienschwerpunkt A', 'planer_id' => $planer->id]);
        Focus::factory()->create(['id' => 'SSP_B',  'name' => 'Studienschwerpunkt B', 'planer_id' => $planer->id]);
        Focus::factory()->create(['id' => 'SSP_C',  'name' => 'Studienschwerpunkt C', 'planer_id' => $planer->id]);
        $this->assertTrue($plan->focusSelections->isEmpty());
        $url = "/$planer->id/$plan->slug/zeitplan";
        $params = [
            'valid' => true,
            'tourCompleted' => false,
            'focusSelections' => [
                ['focusId' => 'SSP_A', 'position' => 0], ['focusId' => 'SSP_C', 'position' => 1]
            ]
        ];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->focusSelections->where('focus_id', 'SSP_A')->where('position', 0)->count());
        $this->assertEquals(1, $plan->focusSelections->where('focus_id', 'SSP_C')->where('position', 1)->count());
    }

    /** @test */
    public function can_update_schedule_placements()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $dayTime = DayTime::factory()->create(['id' => 'a', 'day' => 'Montag', 'time' => 'Morgen', 'sort_index' => 0, 'default' => false]);
        $location = Location::factory()->create(['id' => 'ZH', 'name' => 'Zürich', 'default' => true]);
        $module = Module::factory()->create();
        $this->assertTrue($plan->placements->isEmpty());
        $url = "/$planer->id/$plan->slug/zeitplan";
        $params = [
            'valid' => true,
            'tourCompleted' => false,
            'placements' => [
                [
                    'year' => 1999,
                    'semester' => 'XY',
                    'timeWindow' => 'Zeitfenster YZ',
                    'dayTimeId' => $dayTime->id,
                    'locationId' => $location->id,
                    'moduleId' => $module->id
                ],
                [
                    'year' => 2023,
                    'semester' => 'AB',
                    'timeWindow' => 'Zeitfenster UV',
                    'dayTimeId' => $dayTime->id,
                    'locationId' => $location->id,
                    'moduleId' => $module->id
                ]
            ]
        ];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->placements
            ->where('year', '1999')
            ->where('semester', 'XY')
            ->where('time_window', 'Zeitfenster YZ')
            ->where('day_time_id', $dayTime->id)
            ->where('location_id', $location->id)
            ->where('module_id', $module->id)
            ->count());
        $this->assertEquals(1, $plan->placements
            ->where('year', '2023')
            ->where('semester', 'AB')
            ->where('time_window', 'Zeitfenster UV')
            ->where('day_time_id', $dayTime->id)
            ->where('location_id', $location->id)
            ->where('module_id', $module->id)
            ->count());
    }

    public function can_update_credit_focus_credits()
    {
        $planer = Planer::factory()->create(['focus_selection_enabled' => true]);
        $plan = Plan::factory()->for($planer)->create(['start_year' => 2023]);
        $focus =  Focus::factory()->create(['planer_id' => $planer->id]);
        $focusSelection =  FocusSelection::factory()->for($plan)->for($focus)->create(['position' => 0]);
        $module1 = Module::factory()->create([
            'id' => 'P_AB'
        ]);
        $module2 = Module::factory()->create([
            'id' => 'P_CD'
        ]);
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = [
            'focusCredits' => [
                [
                    'focusSelectionId' => $focusSelection->id,
                    'moduleIds' => [$module1->id, $module2->id]
                ]
            ],
            'tourCompleted' => false,
            'valid' => false
        ];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $focusSelection = $focusSelection->fresh();
        $this->assertCount(2, $focusSelection->creditedModules);
        $this->assertEqualsCanonicalizing(['P_AB', 'P_CD'], $focusSelection->creditedModules->pluck('id')->all());
    }


    /** @test */
    public function cannot_update_credit_if_focus_selection_disabled()
    {
        $planer = Planer::factory()->create(['focus_selection_enabled' => false]);
        $plan = Plan::factory()->for($planer)->create();
        $focus =  Focus::factory()->create(['planer_id' => $planer->id]);
        $focusSelection =  FocusSelection::factory()->for($plan)->for($focus)->create(['position' => 0]);
        $module1 = Module::factory()->create([
            'id' => 'P_AB'
        ]);
        $module2 = Module::factory()->create([
            'id' => 'P_CD'
        ]);
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = [
            'focusCredits' => [
                [
                    'focusSelectionId' => $focusSelection->id,
                    'moduleIds' => [$module1->id, $module2->id]
                ]
            ],
            'tourCompleted' => false,
            'valid' => false
        ];

        $response = $this->put($url, $params);

        $response->assertNotFound();
        $focusSelection = $focusSelection->fresh();
        $this->assertCount(0, $focusSelection->creditedModules);
    }

    /** @test */
    public function cannot_update_credit_if_start_year_after_2023()
    {
        $planer = Planer::factory()->create(['focus_selection_enabled' => true]);
        $plan = Plan::factory()->for($planer)->create(['start_year' => 2024]);
        $focus =  Focus::factory()->create(['planer_id' => $planer->id]);
        $focusSelection =  FocusSelection::factory()->for($plan)->for($focus)->create(['position' => 0]);
        $module1 = Module::factory()->create([
            'id' => 'P_AB'
        ]);
        $module2 = Module::factory()->create([
            'id' => 'P_CD'
        ]);
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = [
            'focusCredits' => [
                [
                    'focusSelectionId' => $focusSelection->id,
                    'moduleIds' => [$module1->id, $module2->id]
                ]
            ],
            'tourCompleted' => false,
            'valid' => false
        ];

        $response = $this->put($url, $params);

        $response->assertNotFound();
        $focusSelection = $focusSelection->fresh();
        $this->assertCount(0, $focusSelection->creditedModules);
    }

    /** @test */
    public function can_update_credits_tourCompleted()
    {
        $planer = Planer::factory()->create(['focus_selection_enabled' => true]);
        $plan = Plan::factory()->for($planer)->create(['credit_tour_completed' => false, 'start_year' => 2023]);
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = ['focusCredits' => [], 'valid' => false, 'tourCompleted' => true];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertTrue($plan->credit_tour_completed);
    }

    /** @test */
    public function cannot_update_credits_tourCompleted()
    {
        $planer = Planer::factory()->create(['focus_selection_enabled' => true]);
        $plan = Plan::factory()->for($planer)->create(['credit_tour_completed' => false, 'start_year' => 2023]);
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = ['focusCredits' => [], 'valid' => false, 'tourCompleted' => true];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertTrue($plan->credit_tour_completed);
    }

    /** @test */
    public function tour_completed_is_required_to_update_credits()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = ['focusCredits' => [], 'valid' => false];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors("tourCompleted");
    }

    /** @test */
    public function valid_is_required_to_update_credits()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/anrechnung";
        $params = ['focusCredits' => [], 'tourCompleted' => false];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors("valid");
    }
}
