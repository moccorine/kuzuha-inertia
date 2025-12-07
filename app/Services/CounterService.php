<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

class CounterService
{
    /**
     * Increment the counter and return the new count.
     * Uses a single record with increment for efficiency.
     */
    public function increment(): int
    {
        $now = now();
        DB::table('counter')->upsert(
            ['id' => 1, 'count' => 1, 'created_at' => $now, 'updated_at' => $now],
            ['id'],
            ['count' => DB::raw('count + 1'), 'updated_at' => $now]
        );

        return DB::table('counter')->where('id', 1)->value('count');
    }

    /**
     * Get the current counter value without incrementing.
     */
    public function getCurrentCount(): int
    {
        return DB::table('counter')->where('id', 1)->value('count') ?? 0;
    }

    /**
     * Get the counter start date.
     */
    public function getStartDate(): ?string
    {
        return DB::table('counter')->where('id', 1)->value('created_at');
    }
}
