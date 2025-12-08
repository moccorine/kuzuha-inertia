<?php

namespace App\Services;

class PosterIdService
{
    /**
     * Generate a poster ID based on IP address and date
     *
     * @return string 8-character poster ID
     */
    public function generate(string $ipAddress): string
    {
        // 日付 (YYYY-MM-DD形式)
        $date = date('Y-m-d');

        // アプリケーションキーをソルトとして使用
        $salt = config('app.key');

        // IPアドレス + 日付 + ソルトをハッシュ化
        $hash = hash('sha256', $ipAddress.$date.$salt);

        // 最初の8文字を使用
        return substr($hash, 0, 8);
    }
}
