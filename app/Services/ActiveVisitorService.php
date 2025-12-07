<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class ActiveVisitorService
{
    /**
     * Record a visitor and return the active visitor count.
     */
    public function recordVisit(string $ipAddress): int
    {
        $visitorKey = $this->generateVisitorKey($ipAddress);
        $timeout = config('bbs.active_visitor_timeout', 300);
        $now = now();
        $cutoffTime = $now->copy()->subSeconds($timeout);

        DB::beginTransaction();
        try {
            // Upsert the current visitor
            DB::table('active_visitors')->upsert(
                [
                    'visitor_key' => $visitorKey,
                    'last_seen_at' => $now,
                    'updated_at' => $now,
                ],
                ['visitor_key'],
                ['last_seen_at' => $now, 'updated_at' => $now]
            );

            // Delete expired visitors
            DB::table('active_visitors')
                ->where('last_seen_at', '<', $cutoffTime)
                ->delete();

            // Count active visitors
            $count = DB::table('active_visitors')->count();

            DB::commit();

            return $count;
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Get the current active visitor count without recording.
     */
    public function getActiveCount(): int
    {
        $timeout = config('bbs.active_visitor_timeout', 300);
        $cutoffTime = now()->subSeconds($timeout);

        return DB::table('active_visitors')
            ->where('last_seen_at', '>=', $cutoffTime)
            ->count();
    }

    /**
     * Get the timeout value in seconds.
     */
    public function getTimeout(): int
    {
        return config('bbs.active_visitor_timeout', 300);
    }

    /**
     * Generate a unique visitor key from IP address.
     */
    private function generateVisitorKey(string $ipAddress): string
    {
        return hash('sha256', $ipAddress);
    }
}
