import BbsMenu from '@/components/BbsMenu';
import PostForm from '@/components/PostForm';
import PostItem from '@/components/PostItem';
import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, usePage } from '@inertiajs/react';

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
    onlineCount: number;
    installedAt: string;
    hideForm?: boolean;
    customLinks: Array<{
        id: number;
        title: string;
        url: string;
    }>;
    informationPage: {
        url: string;
        hasContent: boolean;
    } | null;
}

export default function Index({
    posts,
    perPage,
    appName,
    counter,
    onlineCount,
    installedAt,
    hideForm,
    customLinks,
    informationPage,
}: Props) {
    const { lastPostId, lastPostTime } = usePage().props as any;

    // Check if undo is available (within 5 minutes)
    const canUndo =
        lastPostTime &&
        new Date().getTime() - new Date(lastPostTime).getTime() < 5 * 60 * 1000;

    return (
        <GuestLayout>
            <Head title={appName} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>{appName}</Link>
                    {informationPage && (
                        <>
                            <span style={{ margin: '0 0.5rem' }}>|</span>
                            {informationPage.url ? (
                                <a href={informationPage.url} style={{ fontSize: '14px' }}>Information</a>
                            ) : informationPage.hasContent ? (
                                <Link href="/information" style={{ fontSize: '14px' }}>Information</Link>
                            ) : null}
                        </>
                    )}
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <a href="#" style={{ fontSize: '14px' }}>Contact</a>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <a href="#" style={{ fontSize: '14px' }}>Archive</a>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <Link href="/tree" style={{ fontSize: '14px' }}>Tree View</Link>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <a 
                        href={hideForm ? "/" : `/?hide=1&d=${perPage}`}
                        style={{ fontSize: '14px', cursor: 'pointer' }}
                    >
                        {hideForm ? 'Show Form' : 'Log Read'}
                    </a>
                </div>

                {!hideForm && <PostForm perPage={perPage} />}

                {!hideForm && (
                    <BbsMenu
                        counter={counter}
                        installedAt={installedAt}
                        perPage={perPage}
                        onlineCount={onlineCount}
                        customLinks={customLinks}
                        informationPage={informationPage}
                    />
                )}

                {posts.data.length === 0 ? (
                    <div style={{ fontSize: '15px', fontStyle: 'italic' }}>
                        No posts yet.
                    </div>
                ) : (
                    <>
                        {posts.data.map((post) => (
                            <PostItem
                                key={post.id}
                                post={post}
                                lastPostId={lastPostId}
                                canUndo={canUndo}
                            />
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
