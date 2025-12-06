<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Support\Facades\Crypt;

class PostDeleteTokenService
{
    public function generateToken(Post $post): string
    {
        return Crypt::encryptString(json_encode([
            'post_id' => $post->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => $this->generateSignature($post->id),
        ]));
    }

    public function validateToken(string $token, int $postId): bool
    {
        try {
            $data = json_decode(Crypt::decryptString($token), true);

            if ($data['post_id'] !== $postId) {
                return false;
            }

            if ($data['expires_at'] < now()->timestamp) {
                return false;
            }

            $expectedSignature = $this->generateSignature($postId);
            if ($data['signature'] !== $expectedSignature) {
                return false;
            }

            return true;

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return false;
        }
    }

    public function getPostIdFromToken(string $token): ?int
    {
        try {
            $data = json_decode(Crypt::decryptString($token), true);

            if ($data['expires_at'] < now()->timestamp) {
                return null;
            }

            $expectedSignature = $this->generateSignature($data['post_id']);
            if ($data['signature'] !== $expectedSignature) {
                return null;
            }

            return $data['post_id'];

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return null;
        }
    }

    private function generateSignature(int $postId): string
    {
        return hash_hmac('sha256', $postId, config('app.key'));
    }
}
