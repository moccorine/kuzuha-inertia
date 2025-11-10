import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/layouts/guest-layout';
import FollowForm from '@/components/FollowForm';
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
    post: Post;
    quotedBody: string;
    defaultTitle: string;
    appName: string;
}

export default function Follow({ post, quotedBody, defaultTitle, appName }: Props) {
    return (
        <GuestLayout>
            <Head title={`Follow - ${appName}`} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/">{appName}</Link>
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                <PostItem post={post} />

                <div style={{ marginTop: '1rem', marginBottom: '1rem', fontSize: '14px' }}>
                    Follow Post　<Link href="/">←Back</Link>
                </div>

                <FollowForm parentId={post.id} quotedBody={quotedBody} defaultTitle={defaultTitle} />
            </div>
        </GuestLayout>
    );
}
