import PostForm from '@/components/post-form';
import PostItem from '@/components/post-item';
import { useLang } from '@/hooks/useLang';
import PublicLayout from '@/layouts/public-layout';
import { Link, usePage } from '@inertiajs/react';

interface Post {
    id: number;
    username: string | null;
    email: string | null;
    title: string | null;
    message: string;
    metadata: {
        url?: string;
        auto_link?: boolean;
    } | null;
    created_at: string;
    can_delete?: boolean;
}

interface PaginatedPosts {
    data: Post[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    from: number | null;
    to: number | null;
    total: number;
}

export default function Index({
    posts,
    counter,
    counterStartDate,
    activeVisitors,
    activeVisitorTimeout,
    unreadCount,
    lastViewedId,
    isReadnewMode,
}: {
    posts: PaginatedPosts;
    counter?: number | null;
    counterStartDate?: string | null;
    activeVisitors?: number | null;
    activeVisitorTimeout?: number | null;
    unreadCount?: number;
    lastViewedId?: number;
    isReadnewMode?: boolean;
}) {
    const { __ } = useLang('bbs');

    return (
        <PublicLayout title="Posts">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <PostForm
                        counter={counter}
                        counterStartDate={counterStartDate}
                        activeVisitors={activeVisitors}
                        activeVisitorTimeout={activeVisitorTimeout}
                        unreadCount={unreadCount}
                        lastViewedId={lastViewedId}
                    />
                    {posts.data.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}

                    {isReadnewMode && posts.data.length === 0 ? (
                        <div className="text-sm text-gray-600">
                            {__('No unread messages')}
                        </div>
                    ) : (
                        posts.from &&
                        posts.to && (
                            <div className="text-sm text-gray-600">
                                {__('Pagination info')
                                    .replace(':from', posts.from.toString())
                                    .replace(':to', posts.to.toString())}
                            </div>
                        )
                    )}

                    <div className="flex gap-1">
                        {posts.links
                            .filter(
                                (link, index) =>
                                    index === 0 ||
                                    index === posts.links.length - 1,
                            )
                            .map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`rounded border px-3 py-1 ${
                                        link.url
                                            ? 'bg-white hover:bg-gray-100'
                                            : 'cursor-not-allowed bg-gray-100 text-gray-400'
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
