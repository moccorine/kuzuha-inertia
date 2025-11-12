import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import { formatBbsDateTime } from '@/utils/datetime';

interface Post {
    id: number;
    username: string;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
    replies_count?: number;
}

interface Props {
    threads: {
        data: Post[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    date?: string;
    usernameCounts: Array<{
        username: string;
        count: number;
    }>;
}

export default function Topics({ threads, date, usernameCounts }: Props) {
    const title = date ? `トピック一覧 - ${date}` : 'トピック一覧';

    return (
        <GuestLayout>
            <Head title={title} />

            <div style={{ padding: '0.5rem' }}>
                <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '20px' }}>
                    <Link href="/archive">{title}</Link>
                </h1>

                {date && usernameCounts.length > 0 && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '13px', lineHeight: '1.5' }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '0.3rem' }}>投稿者別トピック数:</div>
                        {usernameCounts.map((item, index) => (
                            <span key={index}>
                                {item.username} ({item.count})
                                {index < usernameCounts.length - 1 && ' | '}
                            </span>
                        ))}
                        <hr style={{ marginTop: '0.5rem' }} />
                    </div>
                )}

                <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    {threads.data.map((post) => {
                        const replyCount = String(post.replies_count || 0).padStart(2, '0');
                        const datetime = formatBbsDateTime(post.created_at);
                        const bodyPreview = post.body.replace(/<[^>]*>/g, '').substring(0, 100);
                        
                        return (
                            <div key={post.id} style={{ marginBottom: '0.3rem' }}>
                                <Link href={`/threads/${post.id}`}>◆</Link>
                                {' '}
                                <Link href={`/tree/${post.id}`}>木</Link>
                                {' '}
                                {replyCount}
                                {' '}
                                [{datetime}]
                                {' '}
                                {bodyPreview}
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '1rem' }}>
                    {threads.links.map((link, index) => (
                        <span key={index}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        textDecoration: link.active ? 'underline' : 'none',
                                    }}
                                >
                                    {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                </Link>
                            ) : (
                                <span style={{ padding: '0.25rem 0.5rem' }}>
                                    {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </GuestLayout>
    );
}
