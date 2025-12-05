import PublicLayout from '@/layouts/public-layout';
import PostForm from '@/components/post-form';

interface Post {
    id: number;
    username: string | null;
    email: string | null;
    title: string | null;
    message: string;
    created_at: string;
}

export default function Index({ posts }: { posts: Post[] }) {
    return (
        <PublicLayout title="Posts">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <PostForm />
                    {posts.map((post) => (
                        <div key={post.id} className="rounded-lg border bg-white p-4 shadow">
                            <div className="mb-2 flex items-center justify-between">
                                <span className="font-semibold">{post.username || ' '}</span>
                                <span className="text-sm text-gray-500">
                                    {new Date(post.created_at).toLocaleString()}
                                </span>
                            </div>
                            {post.title && <h2 className="mb-2 font-medium">{post.title}</h2>}
                            <p className="whitespace-pre-wrap text-gray-700">{post.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
