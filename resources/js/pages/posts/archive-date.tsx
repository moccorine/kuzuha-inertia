import GuestLayout from '@/layouts/guest-layout';
import PostItem from '@/components/PostItem';
import { Head, Link } from '@inertiajs/react';

interface Post {
    id: number;
    username: string;
    tripcode: string | null;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
    parent_id: number | null;
}

interface Props {
    posts: {
        data: Post[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    date: string;
    perPage: number;
    appName: string;
}

export default function ArchiveDate({ posts, date, perPage, appName }: Props) {
    return (
        <GuestLayout>
            <Head title={`${appName} - Archive ${date}`} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>{appName}</Link>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <Link href="/archive" style={{ fontSize: '18px' }}>Archive</Link>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <span style={{ fontSize: '18px' }}>{date}</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/archive">
                        <button type="button">Back to Archive</button>
                    </Link>
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                {posts.data.length === 0 ? (
                    <div style={{ fontSize: '15px', fontStyle: 'italic' }}>
                        No posts on this date.
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '1rem', fontSize: '14px' }}>
                            {posts.data.length} posts on {date}
                        </div>
                        {posts.data.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                canUndo={false}
                            />
                        ))}

                        {posts.links && (
                            <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                                {posts.links.map((link, index) => {
                                    if (!link.url) return null;

                                    if (
                                        !link.label.includes('前へ') &&
                                        !link.label.includes('次へ')
                                    ) {
                                        return null;
                                    }

                                    let label = link.label;
                                    if (label.includes('前へ')) {
                                        label = 'Previous';
                                    } else if (label.includes('次へ')) {
                                        label = 'Next';
                                    }

                                    return (
                                        <span key={index}>
                                            <Link href={link.url}>
                                                <button type="button">{label}</button>
                                            </Link>{' '}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </div>
        </GuestLayout>
    );
}
