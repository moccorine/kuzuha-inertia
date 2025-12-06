<?php

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('search page displays posts by specific author', function () {
    Post::factory()->create(['username' => '太郎', 'message' => 'First post']);
    Post::factory()->create(['username' => '太郎', 'message' => 'Second post']);
    Post::factory()->create(['username' => '花子', 'message' => 'Other post']);

    $this->get(route('posts.search', ['user' => '太郎']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/search')
            ->where('username', '太郎')
            ->has('posts', 2)
            ->where('posts.0.username', '太郎')
            ->where('posts.1.username', '太郎')
        );
});

test('search page shows no posts when author not found', function () {
    Post::factory()->create(['username' => '太郎']);

    $this->get(route('posts.search', ['user' => '存在しない']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/search')
            ->where('username', '存在しない')
            ->has('posts', 0)
        );
});

test('search page displays posts in latest order', function () {
    $first = Post::factory()->create(['username' => '太郎', 'message' => 'First']);
    sleep(1);
    $second = Post::factory()->create(['username' => '太郎', 'message' => 'Second']);

    $this->get(route('posts.search', ['user' => '太郎']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/search')
            ->has('posts', 2)
            ->where('posts.0.id', $second->id)
            ->where('posts.1.id', $first->id)
        );
});
