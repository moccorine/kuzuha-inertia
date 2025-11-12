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

        // Seed custom links
        $this->call(CustomLinkSeeder::class);

        // Import legacy BBS posts from cache (local only)
        // 
        // How to prepare cache (first time only):
        // 1. Cache all logs:
        //    ./vendor/bin/sail artisan bbs:cache-logs-all logs storage/cache
        // 2. Run seeder (this will import from cache):
        //    ./vendor/bin/sail artisan db:seed
        // 
        // Note: This takes time but only needs to be done once per fresh database
        if (app()->environment('local')) {
            $cacheDir = storage_path('cache');
            if (is_dir($cacheDir)) {
                $jsonFiles = glob($cacheDir . '/*.json');
                if (!empty($jsonFiles)) {
                    $this->command->info('Importing cached legacy BBS posts...');
                    $this->command->info('This may take several minutes...');
                    
                    foreach ($jsonFiles as $jsonFile) {
                        $basename = basename($jsonFile);
                        $this->command->info("Importing {$basename}...");
                        $this->command->call('bbs:import-cache', ['input' => $jsonFile]);
                    }
                }
            }
        }
    }
}
