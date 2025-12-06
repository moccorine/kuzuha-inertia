<?php

use App\Models\Post;
use App\Services\PostDeleteTokenService;
use Illuminate\Support\Facades\Crypt;

uses(\Tests\TestCase::class);

beforeEach(function () {
    $this->service = new PostDeleteTokenService;
});

test('generate token creates valid encrypted token', function () {
    $post = Post::factory()->make(['id' => 123]);

    $token = $this->service->generateToken($post);

    expect($token)->toBeString();
    expect($token)->not->toBeEmpty();

    // トークンが復号化可能
    $decrypted = json_decode(Crypt::decryptString($token), true);
    expect($decrypted)->toHaveKey('post_id');
    expect($decrypted)->toHaveKey('expires_at');
    expect($decrypted)->toHaveKey('signature');
});

test('generate token includes correct post id', function () {
    $post = Post::factory()->make(['id' => 456]);

    $token = $this->service->generateToken($post);
    $decrypted = json_decode(Crypt::decryptString($token), true);

    expect($decrypted['post_id'])->toBe(456);
});

test('validate token returns true for valid token', function () {
    $post = Post::factory()->make(['id' => 789]);
    $token = $this->service->generateToken($post);

    $isValid = $this->service->validateToken($token, 789);

    expect($isValid)->toBeTrue();
});

test('validate token returns false for wrong post id', function () {
    $post = Post::factory()->make(['id' => 100]);
    $token = $this->service->generateToken($post);

    $isValid = $this->service->validateToken($token, 999);

    expect($isValid)->toBeFalse();
});

test('validate token returns false for expired token', function () {
    $expiredToken = Crypt::encryptString(json_encode([
        'post_id' => 123,
        'expires_at' => now()->subDay()->timestamp,
        'signature' => hash_hmac('sha256', 123, config('app.key')),
    ]));

    $isValid = $this->service->validateToken($expiredToken, 123);

    expect($isValid)->toBeFalse();
});

test('validate token returns false for invalid signature', function () {
    $invalidToken = Crypt::encryptString(json_encode([
        'post_id' => 123,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => 'invalid_signature',
    ]));

    $isValid = $this->service->validateToken($invalidToken, 123);

    expect($isValid)->toBeFalse();
});

test('validate token returns false for malformed token', function () {
    $isValid = $this->service->validateToken('invalid_token', 123);

    expect($isValid)->toBeFalse();
});

test('get post id from token returns correct id', function () {
    $post = Post::factory()->make(['id' => 555]);
    $token = $this->service->generateToken($post);

    $postId = $this->service->getPostIdFromToken($token);

    expect($postId)->toBe(555);
});

test('get post id from token returns null for expired token', function () {
    $expiredToken = Crypt::encryptString(json_encode([
        'post_id' => 123,
        'expires_at' => now()->subDay()->timestamp,
        'signature' => hash_hmac('sha256', 123, config('app.key')),
    ]));

    $postId = $this->service->getPostIdFromToken($expiredToken);

    expect($postId)->toBeNull();
});

test('get post id from token returns null for invalid signature', function () {
    $invalidToken = Crypt::encryptString(json_encode([
        'post_id' => 123,
        'expires_at' => now()->addDay()->timestamp,
        'signature' => 'wrong_signature',
    ]));

    $postId = $this->service->getPostIdFromToken($invalidToken);

    expect($postId)->toBeNull();
});

test('get post id from token returns null for malformed token', function () {
    $postId = $this->service->getPostIdFromToken('malformed_token');

    expect($postId)->toBeNull();
});

test('tokens expire after 24 hours', function () {
    $post = Post::factory()->make(['id' => 999]);
    $token = $this->service->generateToken($post);
    $decrypted = json_decode(Crypt::decryptString($token), true);

    $expiresAt = $decrypted['expires_at'];
    $expectedExpiry = now()->addDay()->timestamp;

    // 1秒の誤差を許容
    expect($expiresAt)->toBeGreaterThanOrEqual($expectedExpiry - 1);
    expect($expiresAt)->toBeLessThanOrEqual($expectedExpiry + 1);
});
