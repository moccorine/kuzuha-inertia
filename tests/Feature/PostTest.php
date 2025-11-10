<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class PostTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Set admin password to skip install middleware
        Setting::set('admin_password', bcrypt('password'));
        Setting::set('installed_at', now()->toDateTimeString());
    }

    public function test_index_page_displays_posts(): void
    {
        Post::factory()->create([
            'id' => 1,
            'thread_id' => 1,
            'username' => 'Test User',
            'title' => 'Test Title',
            'body' => 'Test Body',
        ]);

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Posts/Index')
            ->has('posts.data', 1)
            ->where('posts.data.0.username', 'Test User')
            ->where('posts.data.0.title', 'Test Title')
            ->where('posts.data.0.body', 'Test Body')
        );
    }

    public function test_can_create_post(): void
    {
        $response = $this->post('/posts', [
            'username' => 'New User',
            'email' => 'test@example.com',
            'title' => 'New Post',
            'body' => 'New post content',
            'd' => 40,
        ]);

        $response->assertRedirect('/?d=40');
        $this->assertDatabaseHas('posts', [
            'username' => 'New User',
            'title' => 'New Post',
            'body' => 'New post content',
        ]);
    }

    public function test_empty_body_redirects_without_creating_post(): void
    {
        $response = $this->post('/posts', [
            'username' => 'Test',
            'body' => '',
            'd' => 40,
        ]);

        $response->assertRedirect('/?d=40');
        $this->assertDatabaseCount('posts', 0);
    }

    public function test_follow_page_displays_post(): void
    {
        $post = Post::factory()->create([
            'id' => 1,
            'thread_id' => 1,
            'username' => 'Original User',
            'body' => 'Original content',
        ]);

        $response = $this->get("/posts/{$post->id}");

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Posts/Follow')
            ->where('post.id', $post->id)
            ->where('post.username', 'Original User')
            ->has('quotedBody')
            ->has('defaultTitle')
        );
    }

    public function test_can_create_follow_up_post(): void
    {
        $parent = Post::factory()->create([
            'id' => 1,
            'thread_id' => 1,
            'username' => 'Parent User',
            'body' => 'Parent content',
        ]);

        $response = $this->post('/posts', [
            'username' => 'Reply User',
            'email' => '',
            'title' => '＞Parent User',
            'body' => '> Parent content'."\n\n".'Reply content',
            'parent_id' => $parent->id,
            'd' => 40,
        ]);

        $response->assertRedirect('/?d=40');
        $this->assertDatabaseHas('posts', [
            'username' => 'Reply User',
            'parent_id' => $parent->id,
            'thread_id' => 1,
        ]);
    }

    public function test_per_page_parameter_works(): void
    {
        Post::factory()->count(50)->create();

        $response = $this->get('/?d=10');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Posts/Index')
            ->has('posts.data', 10)
            ->where('perPage', 10)
        );
    }

    public function test_pagination_links_are_displayed(): void
    {
        // Create enough posts to have multiple pages
        Post::factory()->count(100)->create();

        $response = $this->get('/?d=10');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Posts/Index')
            ->has('posts.links')
            ->where('posts.links.0.url', null) // First page, no previous
            ->has('posts.links.1.url') // Has next page
        );
    }

    public function test_next_page_link_works(): void
    {
        Post::factory()->count(100)->create();

        $response = $this->get('/?d=10&page=2');

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Posts/Index')
            ->has('posts.data', 10)
            ->has('posts.links')
        );
    }
}
