<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Module;
use App\Models\Plan;
use App\Models\Planer;
use App\Models\PriorLearning;
use Database\Factories\CategoryFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia;
use Tests\TestCase;

class PriorLearningTest extends TestCase
{
    use RefreshDatabase;
    /**
     * @test
     */
    public function can_show_prior_learning_page()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $response = $this->get($url);
        $response->assertSuccessful();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component("PriorLearning"));
    }

    /**
     * @test
     */
    public function can_create_prior_learning_with_just_module_id()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $module = Module::factory()->create(['id' => 'module1Id', 'ects' => 4,]);
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1',  'countsAsModuleId' => $module->id);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('name', $priorLearning['name'])
                ->where('ects',  null)
                ->where('counts_as_category_id', null)
                ->where('counts_as_module_id', $module->id)
                ->count()
        );
    }


    /**
     * @test
     */
    public function cannot_create_prior_learning_with_just_a_name()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1');
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.ects']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function can_create_prior_learning_with_category_id_and_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $category = Category::factory()->create(['planer_id' =>  $planer->id]);
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1',  'countsAsCategoryId' => $category->id, 'ects' => 4);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('name', $priorLearning['name'])
                ->where('ects',  $priorLearning['ects'])
                ->where('counts_as_category_id', $category->id)
                ->where('counts_as_module_id', null)
                ->count()
        );
    }

    /**
     * @test
     */
    public function cannot_create_prior_learning_with_category_id_without_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $category = Category::factory()->create(['planer_id' =>  $planer->id]);
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1',  'countsAsCategoryId' => $category->id);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.ects']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function cannot_create_prior_learning_with_just_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1', 'ects' => 4);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.countsAsCategoryId']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function cannot_create_prior_learning_with_both_module_id_and_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $module = Module::factory()->create(['id' => 'module1Id', 'ects' => 4,]);
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1',  'countsAsModuleId' => $module->id, 'ects' => 5);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.ects', 'priorLearnings.0.countsAsModuleId']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function cannot_create_prior_learning_with_both_module_id_and_category_id()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $module = Module::factory()->create(['id' => 'module1Id', 'ects' => 4,]);
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1',  'countsAsModuleId' => $module->id, 'countsAsCategoryId' => $module->id,);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.countsAsCategoryId', 'priorLearnings.0.countsAsModuleId']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function cannot_create_prior_learning_with_module_id_and_category_id_and_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $module = Module::factory()->create(['id' => 'module1Id', 'ects' => 4,]);
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1',  'countsAsModuleId' => $module->id, 'countsAsCategoryId' => $module->id, 'ects' => 5);
        $params = ['priorLearnings' => [$priorLearning], 'isScheduleValid' => true];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.ects', 'priorLearnings.0.countsAsCategoryId', 'priorLearnings.0.countsAsModuleId']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function can_remove_prior_learning()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $category = Category::factory()->create(['planer_id' =>  $planer->id]);
        $priorLearning1 = PriorLearning::factory()->create([
            'name' => 'my_first_prior_learning', 'ects' => 3, 'counts_as_category_id' => $category->id, 'plan_id' => $plan->id
        ]);
        $priorLearning2 = PriorLearning::factory()->create([
            'name' => 'my_second_prior_learning', 'ects' => 3,  'counts_as_category_id' => $category->id,  'plan_id' => $plan->id
        ]);
        $priorLearning3 = PriorLearning::factory()->create([
            'name' => 'my_third_prior_learning', 'ects' => 3,  'counts_as_category_id' => $category->id,  'plan_id' => $plan->id
        ]);
        $this->assertEquals(3, $plan->priorLearnings->count());

        $url = "/$planer->id/$plan->slug/vorleistungen";
        $params = ['priorLearnings' => [
            array('id' => $priorLearning1->id, 'name' => $priorLearning1->name, 'ects' => $priorLearning1->ects, 'countsAsCategoryId' => $priorLearning1->counts_as_category_id),
            array('id' => $priorLearning3->id, 'name' => $priorLearning3->name, 'ects' => $priorLearning3->ects, 'countsAsCategoryId' => $priorLearning3->counts_as_category_id),
        ], 'isScheduleValid' => true];
        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(2, $plan->priorLearnings->count());
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('name', $priorLearning1['name'])
                ->where('ects',  $priorLearning1['ects'])
                ->where('counts_as_category_id', $priorLearning1['counts_as_category_id'])
                ->where('counts_as_module_id', null)
                ->count()
        );
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('name', $priorLearning3['name'])
                ->where('ects',  $priorLearning3['ects'])
                ->where('counts_as_category_id', $priorLearning3['counts_as_category_id'])
                ->where('counts_as_module_id', null)
                ->count()
        );
    }
}
