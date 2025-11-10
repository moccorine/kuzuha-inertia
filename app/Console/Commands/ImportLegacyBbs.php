<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class ImportLegacyBbs extends Command
{
    protected $signature = 'bbs:import {date? : Date in YYYYMMDD format} {--file : Use local file instead of URL}';
    
    protected $description = 'Import posts from legacy BBS log file';

    public function handle()
    {
        $date = $this->argument('date') ?? date('Ymd');
        
        if ($this->option('file')) {
            $filePath = database_path("logs/{$date}.dat");
            
            if (!file_exists($filePath)) {
                $this->error("File not found: {$filePath}");
                return 1;
            }
            
            $this->info("Importing from: {$filePath}");
            $html = file_get_contents($filePath);
        } else {
            $baseUrl = config('app.legacy_bbs_url');
            
            if (!$baseUrl) {
                $this->error('LEGACY_BBS_URL not configured');
                return 1;
            }

            $url = "{$baseUrl}?m=g&f={$date}.dat";
            $this->info("Importing from: {$url}");
            
            $response = Http::withHeaders([
                'Referer' => $baseUrl,
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            ])->get($url);
            
            if (!$response->successful()) {
                $this->error("Failed to fetch URL: {$response->status()}");
                return 1;
            }
            
            $html = $response->body();
        }
        
        try {
            
            $this->info("Fetched " . strlen($html) . " bytes");
            
            // Parse posts
            $posts = $this->parsePosts($html);
            
            $this->info("Found " . count($posts) . " posts");
            
            // Calculate thread_id and import to database
            $imported = 0;
            $skipped = 0;
            
            foreach ($posts as $post) {
                // Check if already exists
                if (\App\Models\Post::where('id', $post['id'])->exists()) {
                    $skipped++;
                    continue;
                }
                
                // Calculate thread_id
                $threadId = $post['id'];
                if ($post['parent_id']) {
                    $parent = \App\Models\Post::find($post['parent_id']);
                    if ($parent) {
                        $threadId = $parent->thread_id ?: $parent->id;
                    }
                }
                
                // Parse date
                $createdAt = $this->parseDate($post['date']);
                
                // Insert post
                \App\Models\Post::create([
                    'id' => $post['id'],
                    'thread_id' => $threadId,
                    'parent_id' => $post['parent_id'],
                    'username' => $post['username'],
                    'title' => $post['title'],
                    'body' => $post['body'],
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);
                
                $imported++;
            }
            
            $this->info("Import completed: {$imported} imported, {$skipped} skipped");
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error("Error: {$e->getMessage()}");
            return 1;
        }
    }

    private function parsePosts(string $html): array
    {
        $posts = [];
        
        // Extract each post block
        preg_match_all('/<div class="m" id="m(\d+)">(.+?)<\/div>\s*<hr>/s', $html, $matches, PREG_SET_ORDER);
        
        foreach ($matches as $match) {
            $postId = $match[1];
            $postHtml = $match[2];
            
            // Extract title
            preg_match('/<span class="ms">(.+?)<\/span>/', $postHtml, $titleMatch);
            $title = isset($titleMatch[1]) ? trim(strip_tags($titleMatch[1])) : '';
            
            // Extract username
            preg_match('/<span class="mun">(.+?)<\/span>/', $postHtml, $usernameMatch);
            $username = isset($usernameMatch[1]) ? trim(strip_tags($usernameMatch[1])) : '';
            
            // Extract date
            preg_match('/投稿日時：(.+?)<a/', $postHtml, $dateMatch);
            $date = isset($dateMatch[1]) ? trim(strip_tags($dateMatch[1])) : '';
            
            // Extract body
            preg_match('/<pre class="msgnormal">(.+?)<\/pre>/s', $postHtml, $bodyMatch);
            $body = isset($bodyMatch[1]) ? $bodyMatch[1] : '';
            
            // Extract parent_id from reference link
            preg_match('/<a href="#a(\d+)">参考：/', $body, $parentMatch);
            $parentId = isset($parentMatch[1]) ? $parentMatch[1] : null;
            
            // Remove reference link
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
    
    private function parseDate(string $dateStr): string
    {
        // Format: 2025/11/09(日) 23:58:40
        if (preg_match('/(\d{4})\/(\d{2})\/(\d{2})\([^)]+\)\s+(\d{2}):(\d{2}):(\d{2})/', $dateStr, $m)) {
            return "{$m[1]}-{$m[2]}-{$m[3]} {$m[4]}:{$m[5]}:{$m[6]}";
        }
        return now();
    }
}
