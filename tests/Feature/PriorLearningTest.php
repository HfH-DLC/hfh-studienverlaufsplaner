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
        $params = ['priorLearnings' => [$priorLearning]];

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
        $params = ['priorLearnings' => [$priorLearning]];

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
        $params = ['priorLearnings' => [$priorLearning]];

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
        $params = ['priorLearnings' => [$priorLearning]];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.ects']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function can_create_prior_learning_with_just_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $url = "/$planer->id/$plan->slug/vorleistungen";
        $priorLearning =  array('name' => 'my_prior_learing_1', 'ects' => 4);
        $params = ['priorLearnings' => [$priorLearning]];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('name', $priorLearning['name'])
                ->where('ects',  $priorLearning['ects'])
                ->where('counts_as_category_id', null)
                ->where('counts_as_module_id', null)
                ->count()
        );
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
        $params = ['priorLearnings' => [$priorLearning]];

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
        $params = ['priorLearnings' => [$priorLearning]];

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
        $params = ['priorLearnings' => [$priorLearning]];

        $response = $this->put($url, $params);

        $response->assertRedirect('/');
        $response->assertSessionHasErrors(['priorLearnings.0.ects', 'priorLearnings.0.countsAsCategoryId', 'priorLearnings.0.countsAsModuleId']);
        $plan = $plan->fresh();
        $this->assertEquals(0, $plan->priorLearnings->count());
    }

    /**
     * @test
     */
    public function can_update_name()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $priorLearning = PriorLearning::factory()->create([
            'name' => 'some_name', 'ects' => 3, 'plan_id' => $plan->id
        ]);
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $params = ['priorLearnings' => [
            array('id' => $priorLearning->id, 'name' => 'test2', 'ects' => $priorLearning->ects)
        ]];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(1, $plan->priorLearnings->where('id', $priorLearning->id)->where('name', 'test2')->where('ects', $priorLearning->ects)->count());
    }

    /**
     * @test
     */
    public function can_update_ects()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $priorLearning = PriorLearning::factory()->create([
            'name' => 'some_name', 'ects' => 3, 'plan_id' => $plan->id
        ]);
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $params = ['priorLearnings' => [
            array('id' => $priorLearning->id, 'name' => $priorLearning->name, 'ects' => 6)
        ]];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(1, $plan->priorLearnings->where('id', $priorLearning->id)->where('name', $priorLearning->name)->where('ects', 6)->count());
    }

    /**
     * @test
     */
    public function can_update_category()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $category1 = Category::factory()->create(['id' => 1, 'planer_id' => $planer, 'position' => 0]);
        $category2 = Category::factory()->create(['id' => 2, 'planer_id' => $planer,  'position' => 1]);
        $priorLearning = PriorLearning::factory()->create([
            'name' => 'some_name', 'ects' => 3, 'plan_id' => $plan->id, 'counts_as_category_id' => $category1->id
        ]);
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $params = ['priorLearnings' => [
            array('id' => $priorLearning->id, 'name' => $priorLearning->name, 'ects' => $priorLearning->ects, 'countsAsCategoryId' => $category2->id)
        ]];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('id', $priorLearning->id)
                ->where('name', $priorLearning->name)
                ->where('ects', $priorLearning->ects)
                ->where('counts_as_category_id', $category2->id)
                ->count()
        );
    }

    /**
     * @test
     */
    public function can_update_module()
    {
        $planer = Planer::factory()->create();
        $plan = Plan::factory()->for($planer)->create();
        $module1 = Module::factory()->create(['id' => 1,]);
        $module2 = Module::factory()->create(['id' => 2]);
        $priorLearning = PriorLearning::factory()->create([
            'name' => 'some_name', 'plan_id' => $plan->id, 'counts_as_module_id' => $module1->id
        ]);
        $url = "/$planer->id/$plan->slug/vorleistungen";

        $params = ['priorLearnings' => [
            array('id' => $priorLearning->id, 'name' => $priorLearning->name, 'countsAsModuleId' => $module2->id)
        ]];

        $response = $this->put($url, $params);

        $response->assertSuccessful();
        $plan = $plan->fresh();
        $this->assertEquals(1, $plan->priorLearnings->count());
        $this->assertEquals(
            1,
            $plan->priorLearnings
                ->where('id', $priorLearning->id)
                ->where('name', $priorLearning->name)
                ->where('counts_as_module_id', $module2->id)
                ->count()
        );
    }
}
