<?php

namespace Database\Seeders;

use App\Models\InformationPage;
use Illuminate\Database\Seeder;

class InformationPageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InformationPage::create([
            'url' => 'info',
            'content' => <<<'MARKDOWN'
# Welcome to Kuzuha BBS

This is a legacy-style bulletin board system reimplemented with modern technologies.

## Features

- **Anonymous Posting**: No registration required for posting
- **Simple Interface**: Classic BBS design with modern functionality
- **Thread System**: Reply to posts and create discussion threads
- **User Posts**: View all posts by a specific user

## How to Use

### Posting
1. Enter your name (optional)
2. Enter your email (optional)
3. Write your message title
4. Write your message content
5. Click "Post" button

### Reading
- Latest posts are shown on the homepage
- Click on a post title to view the full thread
- Use "Follow" to see replies to a specific post
- Use "Tree" to see the entire discussion tree

## Rules

1. Be respectful to other users
2. No spam or advertising
3. Keep discussions on-topic
4. No illegal content

## Contact

For questions or issues, please contact the administrator.

---

*Last updated: 2025-11-11*
MARKDOWN
        ]);
    }
}
