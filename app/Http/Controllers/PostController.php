<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index()
    {
        $posts = Post::with(['parent', 'thread'])
            ->latest()
            ->paginate(50);

        return Inertia::render('Posts/Index', [
            'posts' => $posts,
            'appName' => config('app.name'),
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
            return redirect('/');
        }

        $validated = $request->validate([
            'username' => 'nullable|string|max:30',
            'email' => 'nullable|email|max:255',
            'title' => 'nullable|string|max:40',
            'body' => 'required|string|max:10000',
            'url' => 'nullable|url|max:255',
        ]);

        // デフォルト値設定
        $username = $validated['username'] ?: 'Anonymous';
        
        // 本文処理
        $body = $validated['body'];
        
        // URL追加
        if (!empty($validated['url'])) {
            $body .= "\n\n" . $validated['url'];
        }

        // 投稿作成
        Post::create([
            'username' => $username,
            'email' => $validated['email'],
            'title' => $validated['title'],
            'body' => $body,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        return redirect('/');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
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
