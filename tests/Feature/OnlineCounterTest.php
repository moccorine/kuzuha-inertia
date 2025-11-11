<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class OnlineCounterTest extends TestCase
{
    use RefreshDatabase;

    public function test_online_counter_tracks_new_user(): void
    {
        $count = online_counter();
        
        $this->assertEquals(1, $count);
        $this->assertDatabaseCount('online_users', 1);
    }

    public function test_online_counter_updates_existing_user(): void
    {
        // First access
        online_counter();
        $firstTime = DB::table('online_users')->first()->last_seen_at;
        
        sleep(1);
        
        // Second access from same IP
        online_counter();
        $secondTime = DB::table('online_users')->first()->last_seen_at;
        
        $this->assertDatabaseCount('online_users', 1);
        $this->assertNotEquals($firstTime, $secondTime);
    }

    public function test_online_counter_cleans_up_old_entries(): void
    {
        // Insert old entry (6 minutes ago)
        DB::table('online_users')->insert([
            'ip_hash' => hash('sha256', '10.0.0.1'),
            'last_seen_at' => now()->subMinutes(6),
        ]);
        
        // Insert recent entry (2 minutes ago)
        DB::table('online_users')->insert([
            'ip_hash' => hash('sha256', '10.0.0.2'),
            'last_seen_at' => now()->subMinutes(2),
        ]);
        
        $this->assertDatabaseCount('online_users', 2);
        
        // Trigger cleanup
        $count = online_counter();
        
        // Should have 2 users: the recent one + current request
        $this->assertEquals(2, $count);
        $this->assertDatabaseCount('online_users', 2);
    }

    public function test_online_counter_counts_multiple_users(): void
    {
        // Insert multiple recent users
        for ($i = 1; $i <= 5; $i++) {
            DB::table('online_users')->insert([
                'ip_hash' => hash('sha256', "192.168.1.$i"),
                'last_seen_at' => now(),
            ]);
        }
        
        $count = online_counter();
        
        // Should count 5 existing + 1 current = 6
        $this->assertEquals(6, $count);
    }

    public function test_online_counter_uses_ip_hash(): void
    {
        online_counter();
        
        $entry = DB::table('online_users')->first();
        
        // Should be a SHA256 hash (64 characters)
        $this->assertEquals(64, strlen($entry->ip_hash));
    }
}
