<?php

namespace App\SpamResponders;

use App\Models\SpamLog;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Spatie\Honeypot\SpamResponder\SpamResponder;
use Symfony\Component\HttpFoundation\Response;

class LoggingSpamResponder implements SpamResponder
{
    public function respond(Request $request, Closure $next): Response
    {
        $data = [
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'input' => $request->except(['password', 'password_confirmation']),
        ];

        // Log to file
        Log::warning('Honeypot spam detected', $data);

        // Save to database
        SpamLog::create($data);

        return response('', 403);
    }
}
