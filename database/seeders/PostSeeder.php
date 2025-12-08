<?php

namespace Database\Seeders;

use App\Models\Post;
use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        // スレッド1: 深いネスト構造
        $thread1Root = Post::create([
            'username' => '太郎',
            'title' => 'Laravelについて',
            'message' => 'Laravel 11の新機能について教えてください',
        ]);

        $thread1Reply1 = Post::createAsFollowUp([
            'username' => '花子',
            'title' => '＞Laravelについて',
            'message' => '> Laravel 11の新機能について教えてください'."\n\n".'Slim Skeletonが追加されましたよ',
        ], $thread1Root);

        $thread1Reply2 = Post::createAsFollowUp([
            'username' => '太郎', // 重複
            'title' => '＞Laravelについて',
            'message' => '> > Laravel 11の新機能について教えてください'."\n".'> Slim Skeletonが追加されましたよ'."\n\n".'Per-second rate limitingも便利です',
        ], $thread1Reply1);

        Post::createAsFollowUp([
            'username' => '花子', // 重複
            'title' => '＞Laravelについて',
            'message' => '> > > Laravel 11の新機能について教えてください'."\n".'> > Slim Skeletonが追加されましたよ'."\n".'> Per-second rate limitingも便利です'."\n\n".'Health routing機能も追加されましたね',
        ], $thread1Reply2);

        // スレッド2: 複数の枝分かれ
        $thread2Root = Post::create([
            'username' => 'Alice',
            'title' => 'React vs Vue',
            'message' => 'どちらがおすすめですか？',
        ]);

        $thread2Branch1 = Post::createAsFollowUp([
            'username' => 'Bob',
            'title' => '＞React vs Vue',
            'message' => 'Reactの方がエコシステムが充実しています',
        ], $thread2Root);

        Post::createAsFollowUp([
            'username' => 'Alice', // 重複
            'title' => '＞React vs Vue',
            'message' => 'TypeScriptとの相性も良いですね',
        ], $thread2Branch1);

        $thread2Branch2 = Post::createAsFollowUp([
            'username' => null, // 名前なし
            'title' => '＞React vs Vue',
            'message' => 'Vueの方が学習コストが低いです',
        ], $thread2Root);

        Post::createAsFollowUp([
            'username' => 'Alice', // 重複
            'title' => '＞React vs Vue',
            'message' => 'Composition APIは素晴らしいです',
        ], $thread2Branch2);

        // スレッド3: 浅いが広い構造
        $thread3Root = Post::create([
            'username' => 'けんた',
            'title' => 'おすすめのエディタ',
            'message' => 'みなさんは何を使っていますか？',
        ]);

        Post::createAsFollowUp([
            'username' => null, // 名前なし
            'message' => 'VS Codeが一番使いやすいです',
        ], $thread3Root);

        Post::createAsFollowUp([
            'username' => 'けんた', // 重複
            'message' => 'PhpStormも良いですよ',
        ], $thread3Root);

        Post::createAsFollowUp([
            'username' => 'さくら', // 重複
            'message' => 'Vimを使っています',
        ], $thread3Root);

        Post::createAsFollowUp([
            'username' => null, // 名前なし
            'message' => 'Neovimに移行しました',
        ], $thread3Root);

        // 独立した投稿（スレッドなし）
        Post::create([
            'username' => null, // 名前なし
            'title' => 'テスト投稿',
            'message' => 'これはテスト投稿です',
        ]);

        Post::create([
            'username' => '匿名', // 重複
            'title' => 'Hello World',
            'message' => 'First post!',
            'metadata' => [
                'url' => 'https://example.com',
                'auto_link' => true,
            ],
        ]);

        // スレッド4: 非常に深いネスト
        $thread4Root = Post::create([
            'username' => 'Developer',
            'title' => 'デバッグ方法',
            'message' => '効率的なデバッグ方法を教えてください',
        ]);

        $current = $thread4Root;
        $usernames = ['太郎', '花子', 'Alice', 'Bob', 'Developer']; // 既存の名前を再利用
        for ($i = 0; $i < 5; $i++) {
            $current = Post::createAsFollowUp([
                'username' => $usernames[$i],
                'message' => '返信レベル'.($i + 1).'です',
            ], $current);
            sleep(1);
        }
    }
}
