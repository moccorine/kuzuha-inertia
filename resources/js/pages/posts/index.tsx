import PostForm from '@/components/post-form';
import { useAutoLink } from '@/hooks/use-auto-link';
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

export default function Index({ posts }: { posts: Post[] }) {
    const { autoLinkUrls } = useAutoLink();

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
                    {posts.map((post) => (
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
                </div>
            </div>
        </PublicLayout>
    );
}
