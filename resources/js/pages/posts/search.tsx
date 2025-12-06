import PostItem from '@/components/post-item';
import { useLang } from '@/hooks/useLang';
import PublicLayout from '@/layouts/public-layout';

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
}

export default function Search({
    posts,
    username,
}: {
    posts: Post[];
    username: string;
}) {
    const { __ } = useLang('bbs');

    return (
        <PublicLayout title={`${__('Author search')}: ${username}`}>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">
                        {__('Author search')}: {username}
                        <span className="ml-4 text-sm font-normal text-gray-600">
                            {posts.length} {__('posts found')}
                        </span>
                    </h1>
                    <hr className="mt-4" />
                </div>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
