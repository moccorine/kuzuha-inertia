<?php

use App\Models\Post;
use Illuminate\Support\Facades\Crypt;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('can delete own post with valid token', function () {
    $post = Post::create([
        'username' => 'Test User',
        'message' => 'Test message',
    ]);

    $deleteToken = Crypt::encryptString(json_encode([
        'post_id' => $post->id,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => hash_hmac('sha256', $post->id, config('app.key')),
    ]));

    $this->withCookie('post_delete_token', $deleteToken)
        ->delete(route('posts.destroy', $post))
        ->assertRedirect(route('posts.index'));

    $this->assertDatabaseMissing('posts', ['id' => $post->id]);
});

test('cannot delete post without token', function () {
    $post = Post::create([
        'username' => 'Test User',
        'message' => 'Test message',
    ]);

    $this->delete(route('posts.destroy', $post))
        ->assertForbidden();

    $this->assertDatabaseHas('posts', ['id' => $post->id]);
});

test('cannot delete post with wrong post id', function () {
    $post1 = Post::create(['username' => 'User 1', 'message' => 'Message 1']);
    $post2 = Post::create(['username' => 'User 2', 'message' => 'Message 2']);

    $deleteToken = Crypt::encryptString(json_encode([
        'post_id' => $post1->id,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => hash_hmac('sha256', $post1->id, config('app.key')),
    ]));

    $this->withCookie('post_delete_token', $deleteToken)
        ->delete(route('posts.destroy', $post2))
        ->assertForbidden();

    $this->assertDatabaseHas('posts', ['id' => $post2->id]);
});

test('cannot delete post with expired token', function () {
    $post = Post::create([
        'username' => 'Test User',
        'message' => 'Test message',
    ]);

    $deleteToken = Crypt::encryptString(json_encode([
        'post_id' => $post->id,
        'expires_at' => now()->subDay()->timestamp,
        'signature' => hash_hmac('sha256', $post->id, config('app.key')),
    ]));

    $this->withCookie('post_delete_token', $deleteToken)
        ->delete(route('posts.destroy', $post))
        ->assertForbidden();

    $this->assertDatabaseHas('posts', ['id' => $post->id]);
});

test('cannot delete post with invalid signature', function () {
    $post = Post::create([
        'username' => 'Test User',
        'message' => 'Test message',
    ]);

    $deleteToken = Crypt::encryptString(json_encode([
        'post_id' => $post->id,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => 'invalid_signature',
    ]));

    $this->withCookie('post_delete_token', $deleteToken)
        ->delete(route('posts.destroy', $post))
        ->assertForbidden();

    $this->assertDatabaseHas('posts', ['id' => $post->id]);
});

test('cannot delete post with invalid token format', function () {
    $post = Post::create([
        'username' => 'Test User',
        'message' => 'Test message',
    ]);

    $this->withCookie('post_delete_token', 'invalid_token')
        ->delete(route('posts.destroy', $post))
        ->assertForbidden();

    $this->assertDatabaseHas('posts', ['id' => $post->id]);
});

test('post creation sets delete token cookie', function () {
    $this->post(route('posts.store'), [
        'username' => 'Test User',
        'message' => 'Test message',
    ])
        ->assertRedirect(route('posts.index'))
        ->assertCookie('post_delete_token');
});

test('can delete flag is set for own post', function () {
    $post = Post::create([
        'username' => 'Test User',
        'message' => 'Test message',
    ]);

    $deleteToken = Crypt::encryptString(json_encode([
        'post_id' => $post->id,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => hash_hmac('sha256', $post->id, config('app.key')),
    ]));

    $this->withCookie('post_delete_token', $deleteToken)
        ->get(route('posts.index'))
        ->assertInertia(fn ($page) => $page
            ->has('posts.data.0.can_delete')
            ->where('posts.data.0.can_delete', true)
        );
});

test('can delete flag is false for other posts', function () {
    $post1 = Post::create(['username' => 'User 1', 'message' => 'Message 1']);
    $post2 = Post::create(['username' => 'User 2', 'message' => 'Message 2']);

    $deleteToken = Crypt::encryptString(json_encode([
        'post_id' => $post2->id,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => hash_hmac('sha256', $post2->id, config('app.key')),
    ]));

    $response = $this->withCookie('post_delete_token', $deleteToken)
        ->get(route('posts.index'));

    $posts = $response->viewData('page')['props']['posts']['data'];

    $deletablePost = collect($posts)->firstWhere('can_delete', true);
    $nonDeletablePost = collect($posts)->firstWhere('can_delete', false);

    expect($deletablePost)->not->toBeNull();
    expect($nonDeletablePost)->not->toBeNull();
    expect($deletablePost['id'])->toBe($post2->id);
    expect($nonDeletablePost['id'])->toBe($post1->id);
});
