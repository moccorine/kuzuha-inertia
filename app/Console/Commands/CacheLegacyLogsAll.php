<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CacheLegacyLogsAll extends Command
{
    protected $signature = 'bbs:cache-logs-all {input-dir : Input directory path} {output-dir : Output directory path} {--days= : Limit to most recent N days}';

    protected $description = 'Parse all legacy BBS logs in directory and cache as JSON';

    public function handle()
    {
        $inputDir = $this->argument('input-dir');
        $outputDir = $this->argument('output-dir');
        $daysLimit = $this->option('days');

        if (! is_dir($inputDir)) {
            $this->error("Directory not found: {$inputDir}");

            return 1;
        }

        if (! is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $files = glob($inputDir.'/*.html');

        if (empty($files)) {
            $this->error("No .html files found in: {$inputDir}");

            return 1;
        }

        // Sort files by date (newest first)
        rsort($files);

        // Limit to recent days if specified
        if ($daysLimit) {
            $files = array_slice($files, 0, (int) $daysLimit);
            $this->info("Limited to most recent {$daysLimit} days");
        }

        $this->info('Found '.count($files).' files');
        $bar = $this->output->createProgressBar(count($files));

        foreach ($files as $file) {
            $basename = basename($file, '.html');
            $outputFile = $outputDir.'/'.$basename.'.json';

            $html = file_get_contents($file);
            $posts = $this->parsePosts($html);
            file_put_contents($outputFile, json_encode($posts, JSON_UNESCAPED_UNICODE));

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("All files cached to: {$outputDir}");

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
