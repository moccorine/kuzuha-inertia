<?php

namespace Database\Seeders;

use App\Models\CustomLink;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // Create admin role
        $adminRole = Role::firstOrCreate(['name' => 'admin']);

        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        // Assign admin role to test user
        if (! $user->hasRole('admin')) {
            $user->assignRole('admin');
        }

        CustomLink::create([
            'name' => '暫wiki',
            'url' => 'https://web.archive.org/web/20250206171542/http://hayate.ws/zanwiki/',
            'order' => 1,
        ]);

        $this->call([
            PostSeeder::class,
            InfoPageSeeder::class,
        ]);
    }
}
