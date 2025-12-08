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

export default function Tree({
    posts,
    threadId,
    lastViewedId,
}: {
    posts: Post[];
    threadId: number;
    lastViewedId: number;
}) {
    const { __ } = useLang('bbs');
    const { formatDate } = useDateFormat();

    const tree = buildTree(posts);
    const rootPost = posts.find((p) => p.id === threadId);

    const renderOptions = {
        __,
        followUrl: (postId: number) => follow({ post: postId }),
        lastViewedId,
    };

    return (
        <PublicLayout title={__('Tree view')}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
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
                        {rootPost && formatDate(rootPost.created_at)}]
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
