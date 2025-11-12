<?php

namespace App\Console\Commands;

use App\Models\Post;
use Illuminate\Console\Command;

class ImportFromCache extends Command
{
    protected $signature = 'bbs:import-cache {input : Input .json file path}';

    protected $description = 'Import posts from cached JSON file';

    public function handle()
    {
        $inputPath = $this->argument('input');

        if (! file_exists($inputPath)) {
            $this->error("File not found: {$inputPath}");

            return 1;
        }

        $this->info("Loading: {$inputPath}");
        $posts = json_decode(file_get_contents($inputPath), true);

        if (! $posts) {
            $this->error('Failed to parse JSON');

            return 1;
        }

        $this->info('Importing '.count($posts).' posts...');
        $bar = $this->output->createProgressBar(count($posts));
        $imported = 0;
        $skipped = 0;

        foreach ($posts as $postData) {
            if (Post::where('id', $postData['id'])->exists()) {
                $skipped++;
                $bar->advance();

                continue;
            }

            $threadId = $postData['id'];
            if ($postData['parent_id']) {
                $parent = Post::find($postData['parent_id']);
                if ($parent) {
                    $threadId = $parent->thread_id ?: $parent->id;
                }
            }

            $createdAt = $this->parseDate($postData['date']);

            Post::create([
                'id' => $postData['id'],
                'thread_id' => $threadId,
                'parent_id' => $postData['parent_id'],
                'username' => $postData['username'],
                'title' => $postData['title'],
                'body' => $postData['body'],
                'created_at' => $createdAt,
                'updated_at' => $createdAt,
            ]);

            $imported++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Import completed: {$imported} imported, {$skipped} skipped");

        return 0;
    }

    private function parseDate(string $dateStr): string
    {
        if (preg_match('/(\d{4})\/(\d{2})\/(\d{2})\([^)]+\)\s+(\d{2}):(\d{2}):(\d{2})/', $dateStr, $m)) {
            return "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$m[6]}";
        }

        return now();
    }
}
