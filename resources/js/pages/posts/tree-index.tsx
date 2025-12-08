import React from 'react';
import { useLang } from '@/hooks/useLang';
import PublicLayout from '@/layouts/public-layout';
import { useDateFormat } from '@/hooks/use-date-format';
import { follow, index, thread } from '@/routes/posts';
import { Link } from '@inertiajs/react';

interface Post {
    id: number;
    username: string | null;
    email: string | null;
    title: string | null;
    message: string;
    parent_id: number | null;
    thread_id: number | null;
    metadata: {
        url?: string;
        auto_link?: boolean;
        reference?: {
            post_id: number;
            created_at: string;
        };
    } | null;
    created_at: string;
}

interface TreeNode {
    post: Post;
    children: TreeNode[];
}

export default function TreeIndex({
    posts,
    lastViewedId,
}: {
    posts: Post[];
    lastViewedId: number;
}) {
    const { __ } = useLang('bbs');
    const { formatDate } = useDateFormat();

    // ツリー構造を構築
    function buildTree(posts: Post[]): TreeNode[] {
        const postMap = new Map<number, TreeNode>();
        const roots: TreeNode[] = [];

        // 全投稿をマップに追加
        posts.forEach((post) => {
            postMap.set(post.id, { post, children: [] });
        });

        // 親子関係を構築
        posts.forEach((post) => {
            const node = postMap.get(post.id)!;
            if (post.parent_id && postMap.has(post.parent_id)) {
                const parent = postMap.get(post.parent_id)!;
                parent.children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    }

    // スレッドごとにグループ化
    function groupByThread(posts: Post[]): Map<number, Post[]> {
        const threads = new Map<number, Post[]>();

        posts.forEach((post) => {
            const threadId = post.thread_id ?? post.id;
            if (!threads.has(threadId)) {
                threads.set(threadId, []);
            }
            threads.get(threadId)!.push(post);
        });

        return threads;
    }

    // ツリーノードをレンダリング
    function renderTreeNode(
        node: TreeNode,
        depth: number = 0,
        isLast: boolean = false,
    ): JSX.Element {
        const isUnread = node.post.id > lastViewedId;

        // メッセージから引用と参考を削除
        let cleanMessage = node.post.message;
        cleanMessage = cleanMessage.replace(/^>.*$/gm, '').trim();

        // インデント用の全角スペース
        const indent = '　'.repeat(depth);
        const branch = depth > 0 ? (isLast ? '└' : '├') : '';

        // メッセージの各行にインデントを追加
        const hasChildren = node.children.length > 0;

        // 親からの継承：この投稿が最後の子かどうか
        const parentLinePrefix = depth > 0 ? (isLast ? '　' : '│') : '';

        // この投稿自身の縦線：子供がいるかどうか
        const ownLinePrefix = hasChildren ? '│' : '　';

        const messageLines = cleanMessage.split('\n');
        const indentedMessage = messageLines
            .map((line, index) => {
                if (index === 0) {
                    // 1行目はそのまま
                    return line;
                }
                // 2行目以降はインデント + 親の縦線 + 自分の縦線 + 内容
                // depth = 0 の場合だけ基本インデント '　' を追加
                const baseIndent = depth === 0 ? '　' : '';
                return baseIndent + indent + parentLinePrefix + ownLinePrefix + line;
            })
            .join('\n');

        return (
            <React.Fragment key={node.post.id}>
                {indent}
                {branch}
                <Link
                    href={follow({ post: node.post.id })}
                    className="text-blue-600 hover:underline"
                >
                    ■
                </Link>
                {node.post.username && node.post.username !== ' ' && (
                    <>
                        {__('Author prefix')}
                        {node.post.username}
                    </>
                )}
                {'\n'}
                {depth === 0 && '　'}
                {indent}
                {parentLinePrefix}
                <span className={isUnread ? 'bg-cyan-100' : ''}>
                    {indentedMessage}
                </span>
                {'\n'}
                {node.children.map((child, index) =>
                    renderTreeNode(
                        child,
                        depth + 1,
                        index === node.children.length - 1,
                    ),
                )}
            </React.Fragment>
        );
    }

    const threadMap = groupByThread(posts);
    const threadArray = Array.from(threadMap.entries())
        .map(([threadId, threadPosts]) => {
            // スレッドの最新投稿を取得
            const latestPost = threadPosts[0];
            const tree = buildTree(threadPosts);
            return {
                threadId,
                latestPost,
                tree,
            };
        })
        .sort((a, b) => {
            // 最新投稿の日時で降順ソート
            return (
                new Date(b.latestPost.created_at).getTime() -
                new Date(a.latestPost.created_at).getTime()
            );
        });

    return (
        <PublicLayout title={__('Tree view')}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <h1 className="mb-4 text-2xl font-bold">{__('Tree view')}</h1>
                <hr className="mb-4" />

                {threadArray.map(({ threadId, latestPost, tree }) => (
                    <div key={threadId} className="mb-8">
                        <pre className="whitespace-pre-wrap break-words font-mono text-sm">
                            <Link
                                href={thread(
                                    { post: threadId },
                                    { query: { last_id: lastViewedId } },
                                )}
                                className="text-blue-600 hover:underline"
                            >
                                ◆
                            </Link>
                            <span className="text-gray-500">
                                {' '}
                                [{__('Update date prefix')}
                                {formatDate(latestPost.created_at)}]
                            </span>
                            {'\n　'}
                            {tree.map((node, index) =>
                                renderTreeNode(
                                    node,
                                    0,
                                    index === tree.length - 1,
                                ),
                            )}
                        </pre>
                        <hr className="my-4" />
                    </div>
                ))}

                <div className="mt-4">
                    <Link
                        href={index()}
                        className="text-blue-600 hover:underline"
                    >
                        {__('Back')}
                    </Link>
                </div>
            </div>
        </PublicLayout>
    );
}
