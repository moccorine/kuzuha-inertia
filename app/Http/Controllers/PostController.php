<?php

namespace App\Http\Controllers;

use App\Models\CustomLink;
use App\Models\Post;
use App\Services\ActiveVisitorService;
use App\Services\CounterService;
use App\Services\PostDeleteTokenService;
use App\Services\PosterIdService;
use App\Services\PostSubmissionService;
use App\Services\TripcodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Inertia\Inertia;

class PostController extends Controller
{
    public function __construct(
        private PostDeleteTokenService $tokenService,
        private CounterService $counterService,
        private ActiveVisitorService $activeVisitorService,
        private PostSubmissionService $submissionService,
        private TripcodeService $tripcodeService,
        private PosterIdService $posterIdService
    ) {}

    public function index(Request $request)
    {
        $perPage = $request->input('per_page', config('bbs.messages_per_page'));

        // セッションから最終閲覧IDを取得
        $lastViewedId = session('last_viewed_post_id', 0);
        $latestId = Post::max('id') ?? 0;

        // 未読のみ表示モード
        $isReadnewMode = $request->boolean('readnew');

        if ($isReadnewMode) {
            // パラメータで送られたlast_idを使用（未指定の場合はセッションの値）
            $searchFromId = $request->input('last_id', $lastViewedId);

            $posts = Post::where('id', '>', $searchFromId)
                ->latest()
                ->paginate($perPage)
                ->appends(['per_page' => $perPage, 'readnew' => true]);

            \Log::info('Readnew mode', [
                'query' => "id > {$searchFromId}",
                'count' => $posts->total(),
            ]);

            // 未読モードでも最新IDをセッションに保存
            session(['last_viewed_post_id' => $latestId]);
        } else {
            $posts = Post::latest()->paginate($perPage)->appends(['per_page' => $perPage]);
            // 通常表示時に最新IDをセッションに保存
            session(['last_viewed_post_id' => $latestId]);
            \Log::info('Normal mode - saved to session', ['saved_id' => $latestId]);
        }

        // 未読件数を計算
        $unreadCount = Post::where('id', '>', $lastViewedId)->count();

        // 削除可能な投稿IDを取得
        $token = $request->cookie('post_delete_token');
        $canDeletePostId = $token ? $this->tokenService->getPostIdFromToken($token) : null;

        // 各投稿に削除可能フラグを追加
        $posts->getCollection()->transform(function ($post) use ($canDeletePostId) {
            $post->can_delete = $post->id === $canDeletePostId;

            return $post;
        });

        // カウンターをインクリメント
        $counter = $this->counterService->increment();
        $counterStartDate = $this->counterService->getStartDate();

        // アクティブ訪問者を記録
        $activeVisitors = $this->activeVisitorService->recordVisit($request->ip());
        $activeVisitorTimeout = $this->activeVisitorService->getTimeout();

        return Inertia::render('posts/index', [
            'posts' => $posts,
            'customLinks' => CustomLink::orderBy('order')->get(),
            'counter' => $counter,
            'counterStartDate' => $counterStartDate,
            'activeVisitors' => $activeVisitors,
            'activeVisitorTimeout' => $activeVisitorTimeout,
            'unreadCount' => $unreadCount,
            'lastViewedId' => $lastViewedId,
            'isReadnewMode' => $isReadnewMode,
        ]);
    }

    public function store(Request $request)
    {
        if (empty($request->message)) {
            return redirect()->route('posts.index', ['per_page' => $request->per_page]);
        }

        if ($this->submissionService->shouldBlock($request)) {
            return redirect()->route('posts.index', ['per_page' => $request->per_page]);
        }

        $usernameData = $this->tripcodeService->resolve($request->input('username'));
        $metadata = [];

        if ($request->filled('url')) {
            $metadata['url'] = $request->url;
        }

        $metadata['auto_link'] = $request->boolean('auto_link');

        if ($usernameData['trip']) {
            $metadata['trip'] = $usernameData['trip'];
        }

        if ($metadata === []) {
            $metadata = null;
        }

        $parentId = $request->input('follow_id');
        $postData = [
            'username' => $usernameData['name'],
            'email' => $request->input('email'),
            'title' => $request->input('title'),
            'message' => $request->input('message'),
            'metadata' => $metadata,
            'poster_id' => $this->posterIdService->generate($request->ip()),
        ];

        if ($parentId && $parent = Post::find($parentId)) {
            $post = Post::createAsFollowUp($postData, $parent);
        } else {
            $post = Post::create($postData);
        }

        $this->submissionService->markPosted($request);

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

    public function search(Request $request, string $user)
    {
        $posts = Post::where('username', $user)->latest()->get();

        return Inertia::render('posts/search', [
            'posts' => $posts,
            'username' => $user,
            'customLinks' => CustomLink::orderBy('order')->get(),
        ]);
    }

    public function thread(Request $request, Post $post)
    {
        $threadId = $post->thread_id ?? $post->id;
        $posts = Post::where('thread_id', $threadId)
            ->orWhere('id', $threadId)
            ->latest()
            ->get();

        // クエリパラメーターの last_id を優先、なければセッションから取得
        $lastViewedId = $request->input('last_id', session('last_viewed_post_id', 0));

        return Inertia::render('posts/thread', [
            'posts' => $posts,
            'threadId' => $threadId,
            'lastViewedId' => (int) $lastViewedId,
            'customLinks' => CustomLink::orderBy('order')->get(),
        ]);
    }

    public function treeIndex(Request $request)
    {
        // 全投稿を取得
        $posts = Post::latest()->get();

        // クエリパラメーターの last_id を優先、なければセッションから取得
        $lastViewedId = $request->input('last_id', session('last_viewed_post_id', 0));

        return Inertia::render('posts/tree-index', [
            'posts' => $posts,
            'lastViewedId' => (int) $lastViewedId,
            'customLinks' => CustomLink::orderBy('order')->get(),
        ]);
    }

    public function tree(Request $request, Post $post)
    {
        $threadId = $post->thread_id ?? $post->id;
        $posts = Post::where('thread_id', $threadId)
            ->orWhere('id', $threadId)
            ->latest()
            ->get();

        // クエリパラメーターの last_id を優先、なければセッションから取得
        $lastViewedId = $request->input('last_id', session('last_viewed_post_id', 0));

        return Inertia::render('posts/tree', [
            'posts' => $posts,
            'threadId' => $threadId,
            'lastViewedId' => (int) $lastViewedId,
            'customLinks' => CustomLink::orderBy('order')->get(),
        ]);
    }
}
