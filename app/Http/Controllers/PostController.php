<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('d', 40);
        $perPage = max(1, min((int) $perPage, 200)); // 1-200の範囲に制限

        // ログ読みモード（フォーム非表示）
        $hideForm = $request->query('hide');
        
        $query = Post::with(['parent', 'thread'])->latest();

        // 未読モード
        $readnew = $request->query('readnew');
        $lastSeenId = $request->cookie('last_seen_post_id');

        if ($readnew && $lastSeenId) {
            $query->where('id', '>', $lastSeenId);
        }

        $posts = $query->paginate($perPage)
            ->onEachSide(1)
            ->appends(['d' => $perPage, 'hide' => $hideForm]);

        $counter = increment_counter();
        $onlineCount = online_counter();

        // 最新のpost IDをCookieに保存
        $latestPostId = Post::max('id');
        cookie()->queue('last_seen_post_id', $latestPostId, 60 * 24 * 365); // 1年間保存

        $informationPage = \App\Models\InformationPage::first();
        $customLinks = \App\Models\CustomLink::where('is_active', true)
            ->orderBy('order')
            ->get();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'perPage' => $perPage,
            'appName' => config('app.name'),
            'counter' => $counter,
            'onlineCount' => $onlineCount,
            'installedAt' => \App\Models\Setting::get('installed_at', now()->toDateTimeString()),
            'latestPostId' => $latestPostId,
            'hideForm' => $hideForm,
            'customLinks' => $customLinks,
            'informationPage' => $informationPage ? [
                'url' => $informationPage->url,
                'hasContent' => !empty($informationPage->content),
            ] : null,
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

            return redirect('/?d='.$perPage);
        }

        $validated = $request->validate([
            'username' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'title' => 'nullable|string|max:40',
            'body' => 'required|string|max:10000',
            'url' => 'nullable|url|max:255',
            'parent_id' => 'nullable|exists:posts,id',
            'autolink' => 'nullable|boolean',
        ]);

        // デフォルト値設定
        $username = $validated['username'] ?: 'Anonymous';

        // Process tripcode
        $processed = process_username_with_tripcode($username);
        $username = $processed['name'];
        $tripcode = $processed['tripcode'];

        // 本文処理
        $body = $validated['body'];

        // URL追加
        if (! empty($validated['url'])) {
            $body .= "\n\n".$validated['url'];
        }

        // Apply autolink if enabled
        if (!empty($validated['autolink'])) {
            \Log::info('Before autolink: ' . $body);
            $body = autolink($body);
            \Log::info('After autolink: ' . $body);
        }

        // Calculate thread_id
        $threadId = null;
        if (! empty($validated['parent_id'])) {
            $parent = Post::find($validated['parent_id']);
            if ($parent) {
                $threadId = $parent->thread_id ?: $parent->id;
            }
        }

        // 投稿作成
        $post = Post::create([
            'username' => $username,
            'tripcode' => $tripcode,
            'email' => $validated['email'],
            'title' => $validated['title'] ?? null,
            'body' => $body,
            'parent_id' => $validated['parent_id'] ?? null,
            'thread_id' => $threadId,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Set thread_id to self if it's a new thread
        if (! $threadId) {
            $post->thread_id = $post->id;
            $post->save();
        }

        // Store post ID and time in session for undo functionality
        $request->session()->put('last_post_id', $post->id);
        $request->session()->put('last_post_time', now());

        // Generate undo token (encrypted post ID + random key)
        $undoToken = \Illuminate\Support\Str::random(32);
        $undoData = [
            'post_id' => $post->id,
            'token' => $undoToken,
            'created_at' => now()->timestamp,
        ];

        // Store token in database
        \DB::table('posts')->where('id', $post->id)->update([
            'undo_token' => $undoToken,
        ]);

        // Set encrypted cookie (24 hours)
        cookie()->queue('undo_token', encrypt($undoData), 60 * 24);

        // Redirect with display count parameter
        $perPage = $request->input('d', 40);

        return redirect('/?d='.$perPage);
    }

    /**
     * Delete user's own recent post (undo).
     */
    public function undo(Request $request, string $id)
    {
        // Get undo token from cookie
        $undoCookie = $request->cookie('undo_token');
        if (! $undoCookie) {
            return back()->withErrors(['error' => 'No undo token found.']);
        }

        try {
            $undoData = decrypt($undoCookie);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Invalid undo token.']);
        }

        // Verify post ID matches
        if ($undoData['post_id'] != $id) {
            return back()->withErrors(['error' => 'You can only delete your most recent post.']);
        }

        // Check time limit (5 minutes)
        if (now()->timestamp - $undoData['created_at'] > 300) {
            return back()->withErrors(['error' => 'Time limit exceeded. You can only delete posts within 5 minutes.']);
        }

        // Get post and verify token
        $post = Post::findOrFail($id);
        if ($post->undo_token !== $undoData['token']) {
            return back()->withErrors(['error' => 'Invalid undo token.']);
        }

        // Delete post
        $post->delete();

        // Clear cookie
        cookie()->queue(cookie()->forget('undo_token'));

        // Clear session
        session()->forget(['last_post_id', 'last_post_time']);

        return redirect('/')->with('success', 'Post deleted successfully.');
    }

    public function information()
    {
        $page = \App\Models\InformationPage::first();

        if (!$page || empty($page->content)) {
            abort(404);
        }

        return Inertia::render('posts/information', [
            'content' => $page->content,
            'appName' => config('app.name'),
        ]);
    }

    public function informationByUrl($url)
    {
        $page = \App\Models\InformationPage::where('url', $url)->first();

        if (!$page || empty($page->content)) {
            abort(404);
        }

        return Inertia::render('posts/information', [
            'content' => $page->content,
            'appName' => config('app.name'),
        ]);
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

        return Inertia::render('posts/follow', [
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
        $perPage = max(1, min(200, (int) $perPage));

        $posts = Post::with('parent')
            ->where('thread_id', $id)
            ->orWhere('id', $id)
            ->orderBy('id', 'asc')
            ->paginate($perPage)
            ->appends(['d' => $perPage])
            ->onEachSide(1);

        return Inertia::render('posts/thread', [
            'posts' => $posts,
            'threadId' => $id,
            'appName' => config('app.name'),
        ]);
    }

    /**
     * Display posts by specific user.
     */
    public function userPosts(string $username)
    {
        $perPage = request()->input('d', 40);
        $perPage = max(1, min(200, (int) $perPage));

        $posts = Post::with('parent')
            ->where('username', $username)
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->appends(['d' => $perPage])
            ->onEachSide(1);

        return Inertia::render('posts/user-posts', [
            'posts' => $posts,
            'username' => $username,
            'appName' => config('app.name'),
        ]);
    }

    /**
     * Display all threads in tree view.
     */
    public function treeIndex(Request $request)
    {
        $perPage = $request->query('d', 10);
        $perPage = max(1, min((int) $perPage, 50));

        $readnew = $request->query('readnew');
        $lastSeenId = $request->cookie('last_seen_post_id');

        // Get latest threads (posts where id = thread_id or thread_id is null)
        $threadsQuery = Post::whereRaw('id = thread_id OR thread_id IS NULL')
            ->latest();

        // If readnew mode, filter threads with new posts
        if ($readnew && $lastSeenId) {
            $threadsQuery->whereHas('thread', function ($query) use ($lastSeenId) {
                $query->where('id', '>', $lastSeenId);
            });
        }

        $threads = $threadsQuery->paginate($perPage)
            ->onEachSide(1)
            ->appends(['d' => $perPage, 'readnew' => $readnew]);

        // For each thread, get all posts and build tree
        $trees = [];
        foreach ($threads as $thread) {
            $posts = Post::where('thread_id', $thread->id)
                ->orWhere('id', $thread->id)
                ->orderBy('id', 'asc')
                ->get();

            // Check if thread has new posts
            $hasNewPosts = $readnew && $lastSeenId && $posts->where('id', '>', $lastSeenId)->count() > 0;

            // Skip thread if in readnew mode and no new posts
            if ($readnew && $lastSeenId && !$hasNewPosts) {
                continue;
            }

            $trees[] = [
                'thread' => $thread,
                'tree' => $this->buildTree($posts),
                'updated_at' => $posts->max('created_at'),
            ];
        }

        return Inertia::render('posts/tree-index', [
            'trees' => $trees,
            'pagination' => $threads,
            'perPage' => $perPage,
            'appName' => config('app.name'),
            'lastSeenId' => $lastSeenId,
        ]);
    }

    /**
     * Display thread in tree view.
     */
    public function tree(string $id)
    {
        // Get all posts in the thread
        $posts = Post::where('thread_id', $id)
            ->orWhere('id', $id)
            ->orderBy('id', 'asc')
            ->get();

        // Build tree structure
        $tree = $this->buildTree($posts);

        return Inertia::render('posts/tree', [
            'tree' => $tree,
            'threadId' => $id,
            'appName' => config('app.name'),
        ]);
    }

    /**
     * Build tree structure from posts.
     */
    private function buildTree($posts, $parentId = null, $level = 0)
    {
        $branch = [];

        foreach ($posts as $post) {
            if ($post->parent_id == $parentId) {
                $node = [
                    'post' => $post,
                    'level' => $level,
                    'children' => $this->buildTree($posts, $post->id, $level + 1),
                ];
                $branch[] = $node;
            }
        }

        return $branch;
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
