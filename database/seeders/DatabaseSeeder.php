<?php

namespace Database\Seeders;

use App\Models\CustomLink;
use App\Models\Post;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );
        Post::factory(50)->create();

        CustomLink::create([
            'name' => '暫wiki',
            'url' => 'https://web.archive.org/web/20250206171542/http://hayate.ws/zanwiki/',
            'order' => 1,
        ]);

        $this->call(InfoPageSeeder::class);
    }
}
