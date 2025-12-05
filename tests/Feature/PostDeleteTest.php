<?php

namespace Tests\Feature;

use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Crypt;
use Tests\TestCase;

class PostDeleteTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_delete_own_post_with_valid_token(): void
    {
        $post = Post::create([
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => hash_hmac('sha256', $post->id, config('app.key')),
        ]));

        $response = $this->withCookie('post_delete_token', $deleteToken)
            ->delete(route('posts.destroy', $post));

        $response->assertRedirect(route('posts.index'));
        $this->assertDatabaseMissing('posts', ['id' => $post->id]);
    }

    public function test_cannot_delete_post_without_token(): void
    {
        $post = Post::create([
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $response = $this->delete(route('posts.destroy', $post));

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_cannot_delete_post_with_wrong_post_id(): void
    {
        $post1 = Post::create(['username' => 'User 1', 'message' => 'Message 1']);
        $post2 = Post::create(['username' => 'User 2', 'message' => 'Message 2']);

        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post1->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => hash_hmac('sha256', $post1->id, config('app.key')),
        ]));

        $response = $this->withCookie('post_delete_token', $deleteToken)
            ->delete(route('posts.destroy', $post2));

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post2->id]);
    }

    public function test_cannot_delete_post_with_expired_token(): void
    {
        $post = Post::create([
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post->id,
            'expires_at' => now()->subDay()->timestamp,
            'signature' => hash_hmac('sha256', $post->id, config('app.key')),
        ]));

        $response = $this->withCookie('post_delete_token', $deleteToken)
            ->delete(route('posts.destroy', $post));

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_cannot_delete_post_with_invalid_signature(): void
    {
        $post = Post::create([
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => 'invalid_signature',
        ]));

        $response = $this->withCookie('post_delete_token', $deleteToken)
            ->delete(route('posts.destroy', $post));

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_cannot_delete_post_with_invalid_token_format(): void
    {
        $post = Post::create([
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $response = $this->withCookie('post_delete_token', 'invalid_token')
            ->delete(route('posts.destroy', $post));

        $response->assertForbidden();
        $this->assertDatabaseHas('posts', ['id' => $post->id]);
    }

    public function test_post_creation_sets_delete_token_cookie(): void
    {
        $response = $this->post(route('posts.store'), [
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $response->assertRedirect(route('posts.index'));
        $response->assertCookie('post_delete_token');
    }

    public function test_can_delete_flag_is_set_for_own_post(): void
    {
        $post = Post::create([
            'username' => 'Test User',
            'message' => 'Test message',
        ]);

        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => hash_hmac('sha256', $post->id, config('app.key')),
        ]));

        $response = $this->withCookie('post_delete_token', $deleteToken)
            ->get(route('posts.index'));

        $response->assertInertia(fn ($page) => $page->has('posts.data.0.can_delete')
            ->where('posts.data.0.can_delete', true)
        );
    }

    public function test_can_delete_flag_is_false_for_other_posts(): void
    {
        $post1 = Post::create(['username' => 'User 1', 'message' => 'Message 1']);
        $post2 = Post::create(['username' => 'User 2', 'message' => 'Message 2']);

        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post1->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => hash_hmac('sha256', $post1->id, config('app.key')),
        ]));

        $response = $this->withCookie('post_delete_token', $deleteToken)
            ->get(route('posts.index'));

        $posts = $response->viewData('page')['props']['posts']['data'];

        // Find which post has can_delete = true
        $deletablePost = collect($posts)->firstWhere('can_delete', true);
        $nonDeletablePost = collect($posts)->firstWhere('can_delete', false);

        $this->assertNotNull($deletablePost);
        $this->assertNotNull($nonDeletablePost);
        $this->assertEquals($post1->id, $deletablePost['id']);
        $this->assertEquals($post2->id, $nonDeletablePost['id']);
    }
}
