<?php

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('author search button is shown when username is provided', function () {
    Post::factory()->create(['username' => 'TestUser']);

    $this->get(route('posts.index'))
        ->assertInertia(fn ($page) => $page
            ->component('posts/index')
            ->has('posts.data', 1)
            ->where('posts.data.0.username', 'TestUser')
        );
});

test('author search button is hidden when username is anonymous', function () {
    Post::factory()->create(['username' => ' ']);

    $this->get(route('posts.index'))
        ->assertInertia(fn ($page) => $page
            ->component('posts/index')
            ->has('posts.data', 1)
            ->where('posts.data.0.username', ' ')
        );
});

test('author search button is hidden when username is null', function () {
    Post::factory()->create(['username' => null]);

    $this->get(route('posts.index'))
        ->assertInertia(fn ($page) => $page
            ->component('posts/index')
            ->has('posts.data', 1)
            ->where('posts.data.0.username', null)
        );
});
