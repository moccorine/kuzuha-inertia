import PostItem from '@/components/PostItem';
import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';

interface Post {
    id: number;
    parent_id: number | null;
    parent?: {
        id: number;
        created_at: string;
    };
    username: string;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
    thread_id: number | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    posts: {
        data: Post[];
        links: PaginationLink[];
        total: number;
    };
    username: string;
    appName: string;
}

export default function UserPosts({ posts, username, appName }: Props) {
    const filteredLinks = posts.links.filter(
        (link) =>
            link.label === '&laquo; Previous' || link.label === 'Next &raquo;',
    );

    const translatedLinks = filteredLinks.map((link) => ({
        ...link,
        label: link.label === '&laquo; Previous' ? 'Previous' : 'Next',
    }));

    return (
        <GuestLayout>
            <Head title={`Posts by ${username} - ${appName}`} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/">{appName}</Link> - Posts by {username}
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                {posts.data.length === 0 ? (
                    <div
                        style={{
                            fontSize: '15px',
                            fontStyle: 'italic',
                            marginBottom: '1rem',
                        }}
                    >
                        No posts found by this user.
                    </div>
                ) : (
                    posts.data.map((post) => (
                        <PostItem key={post.id} post={post} />
                    ))
                )}

                {translatedLinks.length > 0 && (
                    <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        {translatedLinks.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    style={{ marginRight: '0.5rem' }}
                                >
                                    {link.label}
                                </Link>
                            ) : (
                                <span
                                    key={index}
                                    style={{
                                        marginRight: '0.5rem',
                                        color: '#888',
                                    }}
                                >
                                    {link.label}
                                </span>
                            ),
                        )}
                    </div>
                )}

                <div
                    style={{
                        fontSize: '14px',
                        marginTop: '1rem',
                        marginBottom: '1rem',
                    }}
                >
                    {posts.total} post{posts.total !== 1 ? 's' : ''} found.
                </div>

                <div style={{ marginTop: '1rem' }}>
                    <Link href="/">←Back to Main</Link>
                </div>
            </div>
        </GuestLayout>
    );
}
