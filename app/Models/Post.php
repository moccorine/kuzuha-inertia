<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'parent_id',
        'thread_id',
        'username',
        'email',
        'title',
        'message',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    public function getQuotedMessage(): string
    {
        // 既存の二重引用を削除（> > で始まる行）
        $quoted = preg_replace('/^> > .+$/m', '', $this->message);
        // リンクをテキスト化
        $quoted = preg_replace('/<a href="[^"]+">([^<]+)<\/a>/i', '$1', $quoted);
        // 空行を削除
        $quoted = preg_replace("/\n\n+/", "\n", $quoted);
        $quoted = trim($quoted);
        // 各行の先頭に > を追加
        $lines = explode("\n", $quoted);
        $quoted = implode("\n", array_map(fn ($line) => '> '.$line, $lines));
        // 空の引用行を削除
        $quoted = preg_replace("/\n>\s+\n/", "\n", $quoted);
        $quoted = preg_replace("/\n>\s+$/", "\n", $quoted);

        return $quoted."\n\n";
    }

    public function generateFollowTitle(): string
    {
        $title = $this->title ?? '';

        // 既に＞で始まっている場合は追加しない
        if (! str_starts_with($title, '＞')) {
            $title = '＞'.$title;
        }

        return $title;
    }

    public static function resolveThreadId(?int $parentId): ?int
    {
        if (! $parentId) {
            return null;
        }

        $parent = self::find($parentId);

        if (! $parent) {
            return null;
        }

        // 親がスレッドの一部なら同じthread_id、そうでなければ親自身がthread_id
        return $parent->thread_id ?? $parent->id;
    }

    public static function createAsFollowUp(array $data, Post $parent): self
    {
        $metadata = $data['metadata'] ?? [];

        // 参考情報をmetadataに保存
        $metadata['reference'] = [
            'post_id' => $parent->id,
            'created_at' => $parent->created_at->toISOString(),
        ];

        return self::create([
            ...$data,
            'parent_id' => $parent->id,
            'thread_id' => self::resolveThreadId($parent->id),
            'metadata' => $metadata,
        ]);
    }
}
