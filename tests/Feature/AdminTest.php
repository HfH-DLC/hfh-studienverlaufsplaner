<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Planer;
use App\Models\Event;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\Assert;
use App\Models\User;
use Tests\TestCase;

class AdminTest extends TestCase
{
    use RefreshDatabase;

    /**
     * @test
     */
    public function show_login_page()
    {
        $response = $this->get('/admin/login');
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page->component('Admin/Login'));
    }

    /**
     * @test
     */
    public function login_with_valid_credentials()
    {
        $credentials = ['email' => 'test@example.com', 'password' => 'test1234'];
        $user = User::factory()->create($credentials);
        $response = $this->post('/admin/login', $credentials);
        $response->assertSessionHasNoErrors();
        $response->assertRedirect('/admin/planers');
        $this->assertAuthenticatedAs($user);
    }

    /**
     * @test
     */
    public function login_with_invalid_credentials()
    {
        User::factory()->create();
        $credentials = ['email' => 'test@example.com', 'password' => 'test1234'];
        $response = $this->post('/admin/login', $credentials);
        $response->assertSessionHasErrors();
        $response->assertRedirect('/');
        $this->assertGuest();
    }

    /**
     * @test
     */
    public function logout()
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        $this->assertAuthenticatedAs($user);
        $response = $this->post('/admin/logout');
        $response->assertRedirect('/admin/login');
        $this->assertGuest();
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_logout_to_login()
    {
        $response = $this->post('/admin/logout');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_admin_to_login()
    {
        $response = $this->get('/admin');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function redirect_authenticated_users_from_admin_to_planers()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('/admin');
        $response->assertRedirect('/admin/planers');
    }

    /**
     * @test
     */
    public function show_planers_page()
    {
        $user = User::factory()->create();
        $response = $this->actingAs($user)->get('admin/planers');
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Planers')
            ->has('planersResource', 1));
    }


    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_planers_to_login()
    {
        $response = $this->get('/admin/planers');
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function redirect_planer_to_categories()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $response = $this->actingAs($user)->get("/admin/planers/$planer->slug");
        $response->assertRedirect("/admin/planers/$planer->slug/categories");
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_planer_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->get("/admin/planers/$planer->slug");
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function show_categories_page()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $response = $this->actingAs($user)->get("/admin/categories");
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Categories')
            ->has('categoriesResource')
            ->has('planerName')
            ->has('planerSlug'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_categories_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->get("/admin/planers/$planer->slug/categories");
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function store_category()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $data = [
            'name' => 'Wahlpflichtmodule HFE',
            'requiredNumber' => 3
        ];
        $response = $this->actingAs($user)->post("/admin/planers/$planer->slug/categories", $data);
        $response->assertRedirect("/admin/planers/$planer->slug/categories");

        $this->assertEquals(1, $planer->categories()->count());
        $category = $planer->categories()->first();
        $this->assertNotNull($category);
        $this->assertEquals($data['name'], $category->name);
        $this->assertEquals($data['requiredNumber'], $category->required_number);
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_store_category_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->get("/admin/planers/$planer->slug/categories", []);
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function update_category()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $category = Category::factory()->for($planer)->create([
            'name' => 'Wahlpflichtmodule HFE',
            'required_number' => 3
        ]);
        $otherCategory = Category::factory()->for($planer)->create([
            'name' => 'Plfichtmodule HFE',
            'required_number' => 0
        ]);
        $data = [
            'name' => 'Masterarbeit HFE',
            'requiredNumber' => 1
        ];
        $response = $this->actingAs($user)->put("/admin/planers/$planer->slug/categories/$category->id", $data);
        $response->assertRedirect("/admin/planers/$planer->slug/categories");

        $updatedCategory = $planer->categories()->find($category->id);
        $this->assertNotNull($updatedCategory);
        $this->assertEquals($data['name'], $updatedCategory->name);
        $this->assertEquals($data['requiredNumber'], $updatedCategory->required_number);

        //Make sure other category has not been updated
        $otherCategory = $planer->categories()->find($otherCategory->id);
        $this->assertNotNull($otherCategory);
        $this->assertEquals('Plfichtmodule HFE', $otherCategory->name);
        $this->assertEquals(0, $otherCategory->required_number);
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_update_category_to_login()
    {
        $planer = Planer::factory()->create();
        $category = Category::factory()->for($planer)->create();
        $response = $this->put("/admin/planers/$planer->slug/categories/$category->id", []);
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function delete_category()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $category = Category::factory()->for($planer)->create([
            'name' => 'Wahlpflichtmodule HFE',
            'required_number' => 3
        ]);
        $otherCategory = Category::factory()->for($planer)->create([
            'name' => 'Plfichtmodule HFE',
            'required_number' => 0
        ]);
        $response = $this->actingAs($user)->delete("/admin/planers/$planer->slug/categories/$category->id");
        $response->assertRedirect("/admin/planers/$planer->slug/categories");

        $this->assertEquals(1, $planer->categories()->count());

        $deletedCategory = $planer->categories()->find($category->id);
        $this->assertNull($deletedCategory);

        //Make sure other category has not been deleted
        $otherCategory = $planer->categories()->find($otherCategory->id);
        $this->assertNotNull($otherCategory);
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_delete_category_to_login()
    {
        $planer = Planer::factory()->create();
        $category = Category::factory()->for($planer)->create([
            'name' => 'Wahlpflichtmodule HFE',
            'required_number' => 3
        ]);
        $response = $this->delete("/admin/planers/$planer->slug/categories/$category->id");
        $response->assertRedirect('/admin/login');
    }


    /**
     * @test
     */
    public function show_timeslots_page()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $response = $this->actingAs($user)->get("/admin/planers/$planer->slug/timeslots");
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Events')
            ->has('eventsResource')
            ->has('planerName')
            ->has('planerSlug')
            ->has('planerOptionsWeek')
            ->has('planerOptionsDay')
            ->has('planerOptionsTime'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_timeslots_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->get("/admin/planers/$planer->slug/timeslots");
        $response->assertRedirect('/admin/login');
    }

    /** @test */
    public function store_timeslots()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create(
            [
                'options_week' => ['Wo 1,2,3'],
                'options_day' => ['Montag'],
                'options_time' => ['Nachmittag']
            ]
        );
        $data = [
            'year' => '2022',
            'semester' => 'HS',
            'week' => $planer->options_week[0],
            'day' => $planer->options_day[0],
            'time' => $planer->options_time[0],
        ];
        $response = $this->actingAs($user)->post("/admin/planers/$planer->slug/timeslots", $data);
        $response->assertRedirect("/admin/planers/$planer->slug/timeslots");
        $this->assertEquals(1, $planer->events()->count());
        $createdEvent = $planer->events()->first();
        $this->assertEquals($data, $createdEvent->only('year', 'semester', 'week', 'day', 'time'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_store_timeslot_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->post("/admin/planers/$planer->slug/timeslots", []);
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function update_timeslots()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create(
            [
                'options_week' => ['Wo 1,2,3', 'Wo 4,5,6'],
                'options_day' => ['Montag', 'Donnerstag'],
                'options_time' => ['Vormittag', 'Nachmittag']
            ]
        );
        $event = Event::factory()->create(
            [
                'planer_id' => $planer->id,
                'year' => '2022',
                'semester' => 'HS',
                'week' => $planer->options_week[0],
                'day' => $planer->options_day[0],
                'time' => $planer->options_time[0],
            ]
        );
        $otherOriginalData = [
            'year' => '2023',
            'semester' => 'HS',
            'week' => $planer->options_week[0],
            'day' => $planer->options_day[0],
            'time' => $planer->options_time[0]
        ];

        $otherEvent = Event::factory()->create(
            array_merge($otherOriginalData, ['planer_id' => $planer->id])
        );
        $data = [
            'year' => '2023',
            'semester' => 'FS',
            'week' => $planer->options_week[1],
            'day' => $planer->options_day[1],
            'time' => $planer->options_time[1],
        ];
        $response = $this->actingAs($user)->put("/admin/planers/$planer->slug/timeslots/$event->id", $data);
        $response->assertRedirect("/admin/planers/$planer->slug/timeslots");
        $this->assertEquals(2, $planer->events()->count());
        $updatedEvent = $planer->events()->find($event->id);
        $this->assertEquals($data, $updatedEvent->only('year', 'semester', 'week', 'day', 'time'));

        //Make sure other event was not updated
        $otherEvent = $planer->events()->find($otherEvent->id);
        $this->assertEquals($otherOriginalData, $otherEvent->only('year', 'semester', 'week', 'day', 'time'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_update_timeslot_to_login()
    {
        $planer = Planer::factory()->create(
            [
                'options_week' => ['Wo 1,2,3', 'Wo 4,5,6'],
                'options_day' => ['Montag', 'Donnerstag'],
                'options_time' => ['Vormittag', 'Nachmittag']
            ]
        );
        $event = Event::factory()->create(
            [
                'planer_id' => $planer->id,
                'year' => '2022',
                'semester' => 'HS',
                'week' => $planer->options_week[0],
                'day' => $planer->options_day[0],
                'time' => $planer->options_time[0],
            ]
        );
        $response = $this->put("/admin/planers/$planer->slug/timeslots/$event->id", []);
        $response->assertRedirect('/admin/login');
    }

    /**
     * @test
     */
    public function delete_timeslot()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create(
            [
                'options_week' => ['Wo 1,2,3', 'Wo 4,5,6'],
                'options_day' => ['Montag', 'Donnerstag'],
                'options_time' => ['Vormittag', 'Nachmittag']
            ]
        );
        $event = Event::factory()->for($planer)->create(
            [
                'year' => '2022',
                'semester' => 'HS',
                'week' => $planer->options_week[0],
                'day' => $planer->options_day[0],
                'time' => $planer->options_time[0]
            ]
        );
        $otherEvent = Event::factory()->for($planer)->create(
            [
                'year' => '2023',
                'semester' => 'HS',
                'week' => $planer->options_week[0],
                'day' => $planer->options_day[0],
                'time' => $planer->options_time[0]
            ]
        );
        $response = $this->actingAs($user)->delete("/admin/planers/$planer->slug/timeslots/$event->id");
        $response->assertRedirect("/admin/planers/$planer->slug/timeslots");

        $this->assertEquals(1, $planer->events()->count());

        $deletedEvent = $planer->events()->find($event->id);
        $this->assertNull($deletedEvent);

        //Make sure other category has not been deleted
        $otherEvent = $planer->events()->find($otherEvent->id);
        $this->assertNotNull($otherEvent);
    }

    /**
     * @test
     */
    public function redirect_unautheticated_user_from_delete_timeslot_to_login()
    {
        $planer = Planer::factory()->create(
            [
                'options_week' => ['Wo 1,2,3'],
                'options_day' => ['Montag'],
                'options_time' => ['Vormittag']
            ]
        );
        $event = Event::factory()->for($planer)->create(
            [
                'year' => '2022',
                'semester' => 'HS',
                'week' => $planer->options_week[0],
                'day' => $planer->options_day[0],
                'time' => $planer->options_time[0]
            ]
        );
        $response = $this->delete("/admin/planers/$planer->slug/timeslots/$event->id");
        $response->assertRedirect("/admin/login");
    }

    /**
     * @test
     */
    public function show_modules_page()
    {
        $user = User::factory()->create();
        $planer = Planer::factory()->create();
        $response = $this->actingAs($user)->get("/admin/planers/$planer->slug/modules");
        $response->assertSuccessful();
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Admin/Modules')
            ->has('modulesResource')
            ->has('categoriesResource')
            ->has('eventsResource')
            ->has('planerName')
            ->has('planerSlug'));
    }

    /**
     * @test
     */
    public function redirect_unauthenticated_users_from_modules_to_login()
    {
        $planer = Planer::factory()->create();
        $response = $this->get("/admin/planers/$planer->slug/modules");
        $response->assertRedirect('/admin/login');
    }
}
