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
            ['title' => 'おじや(あぷろだ)', 'url' => 'https://example.com/ojiya', 'order' => 1],
            ['title' => '能登川(猫)', 'url' => 'https://example.com/notogawa', 'order' => 2],
            ['title' => '蛭ヶ岳', 'url' => 'https://example.com/hirugatake', 'order' => 3],
            ['title' => '暫wiki', 'url' => 'https://example.com/wiki', 'order' => 4],
            ['title' => '読暫', 'url' => 'https://example.com/yomizan', 'order' => 5],
            ['title' => 'ｍｌ', 'url' => 'https://example.com/ml', 'order' => 6],
            ['title' => 'みさお', 'url' => 'https://example.com/misao', 'order' => 7],
            ['title' => '本店', 'url' => 'https://example.com/honten', 'order' => 8],
            ['title' => 'Links', 'url' => 'https://example.com/links', 'order' => 9],
            ['title' => 'おこめ（さくら）', 'url' => 'https://example.com/okome', 'order' => 10],
        ];

        foreach ($links as $link) {
            CustomLink::create($link);
        }
    }
}
