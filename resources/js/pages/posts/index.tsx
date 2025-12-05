import PostForm from '@/components/post-form';
import { useAutoLink } from '@/hooks/use-auto-link';
import { useLang } from '@/hooks/useLang';
import PublicLayout from '@/layouts/public-layout';
import { Link } from '@inertiajs/react';

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

export default function Index({ posts }: { posts: PaginatedPosts }) {
    const { autoLinkUrls } = useAutoLink();
    const { __ } = useLang('bbs');

    function renderMessage(post: Post): { __html: string } {
        let content = post.message;

        if (post.metadata?.auto_link) {
            content = autoLinkUrls(content);
        }

        if (post.metadata?.url) {
            content += `\n\n<a href="${post.metadata.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${post.metadata.url}</a>`;
        }

        return { __html: content };
    }

    return (
        <PublicLayout title="Posts">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <PostForm />
                    {posts.data.map((post) => (
                        <div
                            key={post.id}
                            className="rounded-lg border bg-white p-4 shadow"
                        >
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-semibold">
                                    {post.username || ' '}
                                </span>
                                <span className="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleString()}
                                </span>
                            </div>
                            {post.title && (
                                <h2 className="mb-2 font-medium">
                                    {post.title}
                                </h2>
                            )}
                            <div
                                className="whitespace-pre-wrap text-gray-700"
                                dangerouslySetInnerHTML={renderMessage(post)}
                            />
                        </div>
                    ))}

                    {posts.from && posts.to && (
                        <div className="text-sm text-gray-600">
                            {__('Pagination info')
                                .replace(':from', posts.from.toString())
                                .replace(':to', posts.to.toString())}
                        </div>
                    )}

                    <div className="flex gap-1">
                        {posts.links
                            .filter((link, index) => index === 0 || index === posts.links.length - 1)
                            .map((link, index) => (
                            <Link
                                key={index}
                                href={link.url || '#'}
                                className={`px-3 py-1 border rounded ${
                                    link.url
                                        ? 'bg-white hover:bg-gray-100'
                                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
