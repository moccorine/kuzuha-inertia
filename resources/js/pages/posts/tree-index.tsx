import { useDateFormat } from '@/hooks/use-date-format';
import { useLang } from '@/hooks/useLang';
import PublicLayout from '@/layouts/public-layout';
import { follow, index, thread } from '@/routes/posts';
import {
    FULL_WIDTH_SPACE,
    Post,
    buildTree,
    renderTreeNode,
} from '@/utils/tree-renderer';
import { Link } from '@inertiajs/react';

export default function TreeIndex({
    posts,
    lastViewedId,
}: {
    posts: Post[];
    lastViewedId: number;
}) {
    const { __ } = useLang('bbs');
    const { formatDate } = useDateFormat();

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

    const renderOptions = {
        __,
        followUrl: (postId: number) => follow({ post: postId }),
        lastViewedId,
    };

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
                        <pre className="font-mono text-sm break-words whitespace-pre-wrap">
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
                            {'\n' + FULL_WIDTH_SPACE}
                            {tree.map((node, index) =>
                                renderTreeNode(
                                    node,
                                    renderOptions,
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
