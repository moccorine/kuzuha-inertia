<?php

namespace App\Http\Middleware;

use App\Models\Setting;
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

        // 未インストール判定
        if (! Setting::get('admin_password')) {
            return redirect()->route('install.index');
        }

        return $next($request);
    }
}
