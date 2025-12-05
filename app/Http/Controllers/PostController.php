<?php

namespace App\Http\Controllers;

use App\Models\CustomLink;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', config('bbs.messages_per_page'));
        
        return Inertia::render('posts/index', [
            'posts' => Post::latest()->paginate($perPage),
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

        Post::create([
            ...$request->only(['username', 'email', 'title', 'message']),
            'metadata' => $metadata,
        ]);

        return redirect()->route('posts.index', ['per_page' => $request->per_page]);
    }
}
