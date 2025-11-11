<?php

namespace Database\Seeders;

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
                'username' => 'admin',
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Seed information page
        $this->call(InformationPageSeeder::class);

        // Import legacy BBS posts
        $this->command->info('Importing legacy BBS posts...');
        $this->command->call('bbs:import', ['date' => '20251110', '--file' => true]);
    }
}
