<?php

namespace App\Http\Controllers;

use App\Models\CustomLink;
use App\Models\Post;
use App\Services\PostDeleteTokenService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(
        private PostDeleteTokenService $tokenService
    ) {}

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', config('bbs.messages_per_page'));

        $posts = Post::latest()->paginate($perPage);

        // 削除可能な投稿IDを取得
        $token = $request->cookie('post_delete_token');
        $canDeletePostId = $token ? $this->tokenService->getPostIdFromToken($token) : null;

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

        $parentId = $request->input('follow_id');

        if ($parentId && $parent = Post::find($parentId)) {
            $post = Post::createAsFollowUp([
                ...$request->only(['username', 'email', 'title', 'message']),
                'metadata' => $metadata,
            ], $parent);
        } else {
            $post = Post::create([
                ...$request->only(['username', 'email', 'title', 'message']),
                'metadata' => $metadata,
            ]);
        }

        // 削除トークン生成
        $deleteToken = $this->tokenService->generateToken($post);
        Cookie::queue('post_delete_token', $deleteToken, 60 * 24);

        return redirect()->route('posts.index', ['per_page' => $request->per_page]);
    }

    public function follow(Request $request, Post $post)
    {
        return Inertia::render('posts/follow', [
            'post' => $post,
            'quotedMessage' => $post->getQuotedMessage(),
            'defaultTitle' => $post->generateFollowTitle(),
            'customLinks' => CustomLink::orderBy('order')->get(),
        ]);
    }

    public function destroy(Request $request, Post $post)
    {
        $token = $request->cookie('post_delete_token');

        if (! $token || ! $this->tokenService->validateToken($token, $post->id)) {
            abort(403, 'No delete permission');
        }

        $post->delete();

        Cookie::queue(Cookie::forget('post_delete_token'));

        return redirect()->route('posts.index', ['per_page' => $request->per_page]);
    }
}
