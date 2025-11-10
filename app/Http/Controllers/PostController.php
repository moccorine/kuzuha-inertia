<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\QuoteService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('d', 40);
        $perPage = max(1, min((int)$perPage, 200)); // 1-200の範囲に制限
        
        $query = Post::with(['parent', 'thread'])->latest();
        
        // 未読モード
        $readnew = $request->query('readnew');
        $lastSeenId = $request->cookie('last_seen_post_id');
        
        if ($readnew && $lastSeenId) {
            $query->where('id', '>', $lastSeenId);
        }
        
        $posts = $query->paginate($perPage)
            ->onEachSide(1)
            ->appends(['d' => $perPage]);

        $counter = increment_counter();
        
        // 最新のpost IDをCookieに保存
        $latestPostId = Post::max('id');
        cookie()->queue('last_seen_post_id', $latestPostId, 60 * 24 * 365); // 1年間保存

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'perPage' => $perPage,
            'appName' => config('app.name'),
            'counter' => $counter,
            'installedAt' => \App\Models\Setting::get('installed_at', now()->toDateTimeString()),
            'latestPostId' => $latestPostId,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // 空の投稿はリロード扱い
        if (empty(trim($request->body))) {
            $perPage = $request->input('d', 40);
            return redirect('/?d=' . $perPage);
        }

        $validated = $request->validate([
            'username' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'title' => 'nullable|string|max:40',
            'body' => 'required|string|max:10000',
            'url' => 'nullable|url|max:255',
            'parent_id' => 'nullable|exists:posts,id',
        ]);

        // デフォルト値設定
        $username = $validated['username'] ?: 'Anonymous';
        
        // 本文処理
        $body = $validated['body'];
        
        // URL追加
        if (!empty($validated['url'])) {
            $body .= "\n\n" . $validated['url'];
        }

        // Calculate thread_id
        $threadId = null;
        if (!empty($validated['parent_id'])) {
            $parent = Post::find($validated['parent_id']);
            if ($parent) {
                $threadId = $parent->thread_id ?: $parent->id;
            }
        }

        // 投稿作成
        $post = Post::create([
            'username' => $username,
            'email' => $validated['email'],
            'title' => $validated['title'],
            'body' => $body,
            'parent_id' => $validated['parent_id'] ?? null,
            'thread_id' => $threadId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
        
        // Set thread_id to self if it's a new thread
        if (!$threadId) {
            $post->thread_id = $post->id;
            $post->save();
        }

        // Redirect with display count parameter
        $perPage = $request->input('d', 40);
        return redirect('/?d=' . $perPage);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $post = Post::with('parent')->findOrFail($id);
        
        // Generate default title for follow-up
        $defaultTitle = '＞';
        if ($post->username && $post->username !== 'Anonymous') {
            $defaultTitle .= $post->username;
        } else {
            $defaultTitle .= '　';
        }

        return Inertia::render('Posts/Follow', [
            'post' => $post,
            'quotedBody' => quote_post($post->body),
            'defaultTitle' => $defaultTitle,
            'appName' => config('app.name'),
        ]);
    }

    /**
     * Display thread posts.
     */
    public function thread(string $id)
    {
        $perPage = request()->input('d', 40);
        $perPage = max(1, min(200, (int)$perPage));

        $posts = Post::with('parent')
            ->where('thread_id', $id)
            ->orWhere('id', $id)
            ->orderBy('id', 'asc')
            ->paginate($perPage)
            ->appends(['d' => $perPage])
            ->onEachSide(1);

        return Inertia::render('Posts/Thread', [
            'posts' => $posts,
            'threadId' => $id,
            'appName' => config('app.name'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
