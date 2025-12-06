<?php

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('thread page displays all posts in the same thread', function () {
    $root = Post::factory()->create(['message' => 'Root post']);
    $child1 = Post::factory()->create([
        'parent_id' => $root->id,
        'thread_id' => $root->id,
        'message' => 'Child 1',
    ]);
    $child2 = Post::factory()->create([
        'parent_id' => $root->id,
        'thread_id' => $root->id,
        'message' => 'Child 2',
    ]);
    Post::factory()->create(['message' => 'Other thread']);

    $this->get(route('posts.thread', ['post' => $root->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/thread')
            ->where('threadId', $root->id)
            ->has('posts', 3)
        );
});

test('thread page works when accessing via child post', function () {
    $root = Post::factory()->create(['message' => 'Root post']);
    $child = Post::factory()->create([
        'parent_id' => $root->id,
        'thread_id' => $root->id,
        'message' => 'Child post',
    ]);

    $this->get(route('posts.thread', ['post' => $child->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/thread')
            ->where('threadId', $root->id)
            ->has('posts', 2)
        );
});

test('thread page shows only root post when no children exist', function () {
    $root = Post::factory()->create(['message' => 'Root post']);

    $this->get(route('posts.thread', ['post' => $root->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('posts/thread')
            ->where('threadId', $root->id)
            ->has('posts', 1)
        );
});
