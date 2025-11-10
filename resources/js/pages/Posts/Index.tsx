import BbsMenu from '@/components/BbsMenu';
import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';
import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';

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
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    perPage: number;
    appName: string;
    counter: number;
    installedAt: string;
}

export default function Index({
    posts,
    perPage,
    appName,
    counter,
    installedAt,
}: Props) {
    return (
        <GuestLayout>
            <Head title={appName} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/">{appName}</Link>
                </div>

                <PostForm perPage={perPage} />

                <BbsMenu
                    counter={counter}
                    installedAt={installedAt}
                    perPage={perPage}
                />

                {posts.data.length === 0 ? (
                    <div style={{ fontSize: '15px', fontStyle: 'italic' }}>
                        No posts yet.
                    </div>
                ) : (
                    <>
                        {posts.data.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}

                        {posts.links && (
                            <div
                                style={{
                                    marginTop: '1rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                {posts.links.map((link, index) => {
                                    if (!link.url) return null;

                                    // Only show Previous and Next (check for Japanese labels)
                                    if (
                                        !link.label.includes('前へ') &&
                                        !link.label.includes('次へ')
                                    ) {
                                        return null;
                                    }

                                    let label = link.label;

                                    // Convert to English
                                    if (label.includes('前へ')) {
                                        label = 'Previous';
                                    } else if (label.includes('次へ')) {
                                        label = 'Next';
                                    }

                                    return (
                                        <span key={index}>
                                            <Link href={link.url}>
                                                <button type="button">
                                                    {label}
                                                </button>
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
