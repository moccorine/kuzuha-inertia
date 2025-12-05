<?php

namespace App\Http\Controllers;

use App\Models\CustomLink;
use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', config('bbs.messages_per_page'));

        $posts = Post::latest()->paginate($perPage);

        // 削除可能な投稿IDを取得
        $canDeletePostId = $this->getCanDeletePostId($request);

        // 各投稿に削除可能フラグを追加
        $posts->getCollection()->transform(function ($post) use ($canDeletePostId) {
            $post->can_delete = $post->id === $canDeletePostId;

            return $post;
        });

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'customLinks' => CustomLink::orderBy('order')->get(),
        ]);
    }

    private function getCanDeletePostId(Request $request): ?int
    {
        $token = $request->cookie('post_delete_token');

        if (! $token) {
            return null;
        }

        try {
            $data = json_decode(Crypt::decryptString($token), true);

            if ($data['expires_at'] < now()->timestamp) {
                return null;
            }

            $expectedSignature = hash_hmac('sha256', $data['post_id'], config('app.key'));
            if ($data['signature'] !== $expectedSignature) {
                return null;
            }

            return $data['post_id'];

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            return null;
        }
    }

    public function store(Request $request)
    {
        if (empty($request->message)) {
            return redirect()->route('posts.index', ['per_page' => $request->per_page]);
        }

        $metadata = null;
        if ($request->filled('url')) {
            $metadata = [
                'url' => $request->url,
                'auto_link' => $request->boolean('auto_link'),
            ];
        }

        $post = Post::create([
            ...$request->only(['username', 'email', 'title', 'message']),
            'metadata' => $metadata,
        ]);

        // 削除トークン生成
        $deleteToken = Crypt::encryptString(json_encode([
            'post_id' => $post->id,
            'expires_at' => now()->addDay()->timestamp,
            'signature' => hash_hmac('sha256', $post->id, config('app.key')),
        ]));

        Cookie::queue('post_delete_token', $deleteToken, 60 * 24);

        return redirect()->route('posts.index', ['per_page' => $request->per_page]);
    }

    public function destroy(Request $request, Post $post)
    {
        $token = $request->cookie('post_delete_token');

        if (! $token) {
            abort(403, 'No delete permission');
        }

        try {
            $data = json_decode(Crypt::decryptString($token), true);

            if ($data['post_id'] !== $post->id) {
                abort(403, 'Invalid token');
            }

            if ($data['expires_at'] < now()->timestamp) {
                abort(403, 'Token expired');
            }

            $expectedSignature = hash_hmac('sha256', $post->id, config('app.key'));
            if ($data['signature'] !== $expectedSignature) {
                abort(403, 'Invalid signature');
            }

            $post->delete();

            Cookie::queue(Cookie::forget('post_delete_token'));

            return redirect()->route('posts.index', ['per_page' => $request->per_page]);

        } catch (\Illuminate\Contracts\Encryption\DecryptException $e) {
            abort(403, 'Invalid token');
        }
    }
}
