<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class MeasureExecutionTime
{
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);

        $response = $next($request);

        $executionTime = round((microtime(true) - $startTime) * 1000, 2);

        // Inertiaリクエストの場合のみ共有
        if ($request->header('X-Inertia')) {
            Inertia::share('executionTime', $executionTime);
        }

        return $response;
    }
}
