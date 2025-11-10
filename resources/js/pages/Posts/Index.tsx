import { Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';

interface Post {
    id: number;
    username: string;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
}

interface Props {
    posts: {
        data: Post[];
    };
    appName: string;
}

export default function Index({ posts, appName }: Props) {
    return (
        <GuestLayout>
            <Head title={appName} />
            <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    {appName}
                </div>

                <PostForm />

                <hr style={{ margin: '2rem 0' }} />

                {posts.data.length === 0 ? (
                    <div style={{ fontSize: '15px', fontStyle: 'italic' }}>
                        No posts yet.
                    </div>
                ) : (
                    <>
                        <hr style={{ marginBottom: '1rem' }} />
                        {posts.data.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </>
                )}
            </div>
        </GuestLayout>
    );
}
