<?php

namespace App\Services;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PostSubmissionService
{
    public function shouldBlock(Request $request): bool
    {
        if ($this->violatesMinInterval($request)) {
            return true;
        }

        if ($this->isIpRateLimited($request->ip())) {
            return true;
        }

        if ($this->isDuplicateMessage($request->input('message'))) {
            return true;
        }

        return false;
    }

    public function markPosted(Request $request): void
    {
        $request->session()->put('last_post_attempt_at', now()->timestamp);

        $interval = (int) config('bbs.ip_post_interval', 0);
        $ip = $request->ip();

        if ($interval > 0 && $ip) {
            Cache::put($this->ipCacheKey($ip), now()->timestamp, $interval * 2);
        }
    }

    private function violatesMinInterval(Request $request): bool
    {
        $minInterval = (int) config('bbs.min_post_interval', 0);

        if ($minInterval <= 0) {
            return false;
        }

        $lastAttempt = (int) $request->session()->get('last_post_attempt_at', 0);

        if ($lastAttempt === 0) {
            return false;
        }

        return now()->timestamp - $lastAttempt < $minInterval;
    }

    private function isIpRateLimited(?string $ip): bool
    {
        $interval = (int) config('bbs.ip_post_interval', 0);

        if ($interval <= 0 || ! $ip) {
            return false;
        }

        $key = $this->ipCacheKey($ip);
        $lastPostTimestamp = Cache::get($key);

        if (! $lastPostTimestamp) {
            return false;
        }

        return now()->timestamp - $lastPostTimestamp < $interval;
    }

    private function isDuplicateMessage(?string $message): bool
    {
        if ($message === null) {
            return false;
        }

        $duplicateWindow = (int) config('bbs.duplicate_check_count', 0);

        if ($duplicateWindow <= 0) {
            return false;
        }

        return Post::orderByDesc('id')
            ->limit($duplicateWindow)
            ->pluck('message')
            ->contains($message);
    }

    private function ipCacheKey(string $ip): string
    {
        return 'posts:last_ip_post:'.sha1($ip);
    }
}
