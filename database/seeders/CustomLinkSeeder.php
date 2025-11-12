<?php

namespace Database\Seeders;

use App\Models\CustomLink;
use Illuminate\Database\Seeder;

class CustomLinkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $links = [
            ['title' => 'kuzuha-inertia', 'url' => 'https://github.com/moccorine/kuzuha-inertia', 'order' => 1],
        ];

        foreach ($links as $link) {
            CustomLink::create($link);
        }
    }
}
