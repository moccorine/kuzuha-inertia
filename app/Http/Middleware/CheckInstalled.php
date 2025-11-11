<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckInstalled
{
    public function handle(Request $request, Closure $next): Response
    {
        // インストーラールートは除外
        if ($request->is('install*')) {
            return $next($request);
        }

        // 未インストール判定: ユーザーが1人もいない場合
        if (User::count() === 0) {
            return redirect()->route('install.index');
        }

        return $next($request);
    }
}
