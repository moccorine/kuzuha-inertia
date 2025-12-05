<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InfoPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('info_pages')->insert([
            'content' => <<<'MARKDOWN'
## Rules

Please follow these guidelines when posting:

- No harassment or personal attacks
- No spam or advertising
- Respect others' privacy

## How to Use

1. Enter your name and message
2. Click the post button
3. You can reply to existing posts

## Contact

If you have questions, please contact the administrator.
MARKDOWN,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
