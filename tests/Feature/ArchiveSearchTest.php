<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ArchiveSearchTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create a user to mark installation as complete
        User::factory()->create(['username' => 'testuser']);
    }

    public function test_search_with_case_insensitive(): void
    {
        Post::factory()->create(['body' => 'This is HTTP test']);
        Post::factory()->create(['body' => 'This is http test']);

        $response = $this->get('/archive/search?keyword=HTTP&target_body=true&ignore_case=true');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('posts/archive-search')
                ->has('posts.data', 2)
        );
    }

    public function test_search_with_case_sensitive(): void
    {
        Post::factory()->create(['body' => 'This is HTTP test']);
        Post::factory()->create(['body' => 'This is http test']);

        $response = $this->get('/archive/search?keyword=HTTP&target_body=true&ignore_case=false');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('posts/archive-search')
                ->has('posts.data', 1)
        );
    }

    public function test_search_by_username(): void
    {
        Post::factory()->create(['username' => 'TestUser', 'body' => 'test']);
        Post::factory()->create(['username' => 'OtherUser', 'body' => 'test']);

        $response = $this->get('/archive/search?keyword=TestUser&target_username=true&ignore_case=true');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('posts/archive-search')
                ->has('posts.data', 1)
        );
    }

    public function test_search_by_date(): void
    {
        Post::factory()->create(['body' => 'test', 'created_at' => '2025-11-10 10:00:00']);
        Post::factory()->create(['body' => 'test', 'created_at' => '2025-11-11 10:00:00']);

        $response = $this->get('/archive/search?keyword=test&target_body=true&dates[]=2025-11-10');

        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('posts/archive-search')
                ->has('posts.data', 1)
        );
    }

    public function test_search_redirects_without_keyword_and_dates(): void
    {
        $response = $this->get('/archive/search');

        $response->assertRedirect('/archive');
    }
}
