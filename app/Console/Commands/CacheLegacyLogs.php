<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CacheLegacyLogs extends Command
{
    protected $signature = 'bbs:cache-logs {date : Date in YYYYMMDD format} {--output= : Output path (default: storage/cache/{date}.json)}';

    protected $description = 'Parse legacy BBS logs and cache as JSON';

    public function handle()
    {
        $date = $this->argument('date');
        $inputPath = base_path("logs/{$date}.html");
        $outputPath = $this->option('output') ?: storage_path("cache/{$date}.json");

        if (! file_exists($inputPath)) {
            $this->error("File not found: {$inputPath}");

            return 1;
        }

        $this->info("Parsing: {$inputPath}");
        $html = file_get_contents($inputPath);
        $posts = $this->parsePosts($html);
        $this->info('Parsed '.count($posts).' posts');

        $outputDir = dirname($outputPath);
        if (! is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        file_put_contents($outputPath, json_encode($posts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        $this->info("Cached to: {$outputPath}");

        return 0;
    }

    private function parsePosts(string $html): array
    {
        $posts = [];
        preg_match_all('/<div class="m" id="m(\d+)">(.+?)<\/div>\s*<hr>/s', $html, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $postId = $match[1];
            $postHtml = $match[2];

            preg_match('/<span class="ms">(.+?)<\/span>/', $postHtml, $titleMatch);
            $title = isset($titleMatch[1]) ? trim(strip_tags($titleMatch[1])) : '';

            preg_match('/<span class="mun">(.+?)<\/span>/', $postHtml, $usernameMatch);
            $username = isset($usernameMatch[1]) ? trim(strip_tags($usernameMatch[1])) : '';

            preg_match('/投稿日時：(.+?)<a/', $postHtml, $dateMatch);
            $date = isset($dateMatch[1]) ? trim(strip_tags($dateMatch[1])) : '';

            preg_match('/<pre class="msgnormal">(.+?)<\/pre>/s', $postHtml, $bodyMatch);
            $body = isset($bodyMatch[1]) ? $bodyMatch[1] : '';

            preg_match('/<a href="#a(\d+)">参考：/', $body, $parentMatch);
            $parentId = isset($parentMatch[1]) ? $parentMatch[1] : null;

            $body = preg_replace('/<a href="#a\d+">参考：[^<]+<\/a>/', '', $body);
            $body = strip_tags($body, '<a><span>');
            $body = html_entity_decode($body, ENT_QUOTES | ENT_HTML5, 'UTF-8');
            $body = str_replace("\r", "\n", $body);
            $body = trim($body);

            $posts[] = [
                'id' => $postId,
                'title' => $title,
                'username' => $username,
                'date' => $date,
                'body' => $body,
                'parent_id' => $parentId,
            ];
        }

        return $posts;
    }
}
