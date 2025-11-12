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
        total: number;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    keyword: string;
    targetUsername: boolean;
    targetTitle: boolean;
    targetBody: boolean;
    ignoreCase: boolean;
    dates: string[];
    perPage: number;
}

export default function ArchiveSearch({
    posts,
    keyword,
    targetUsername,
    targetTitle,
    targetBody,
    ignoreCase,
    dates,
}: Props) {
    const { props } = usePage<{ appName: string }>();

    const targets = [];
    if (targetUsername) targets.push('投稿者');
    if (targetTitle) targets.push('タイトル');
    if (targetBody) targets.push('本文');

    return (
        <GuestLayout>
            <Head title={`検索結果: ${keyword}`} />

            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link
                        href="/"
                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                    >
                        {props.appName}
                    </Link>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <span style={{ fontSize: '18px' }}>検索結果</span>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '14px' }}>
                    <Link href="/archive">
                        <button type="button">Back to Archive</button>
                    </Link>
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '14px' }}>
                    {keyword && (
                        <>
                            キーワード: <strong>{keyword}</strong>
                            {' | '}
                            検索対象: {targets.join(', ')}
                            {' | '}
                            {ignoreCase
                                ? '大文字小文字を区別しない'
                                : '大文字小文字を区別する'}
                            <br />
                        </>
                    )}
                    {dates && dates.length > 0 && (
                        <>
                            対象日付: <strong>{dates.join(', ')}</strong>
                            <br />
                        </>
                    )}
                    結果: {posts.total} 件
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                {posts.data.map((post) => (
                    <PostItem
                        key={post.id}
                        post={post}
                        highlightKeyword={keyword}
                        highlightCaseSensitive={!ignoreCase}
                    />
                ))}

                <div style={{ marginTop: '1rem' }}>
                    {posts.links.map((link, index) => (
                        <span key={index}>
                            {link.url ? (
                                <Link
                                    href={link.url}
                                    style={{
                                        padding: '0.25rem 0.5rem',
                                        textDecoration: link.active
                                            ? 'underline'
                                            : 'none',
                                    }}
                                >
                                    {link.label
                                        .replace('&laquo;', '«')
                                        .replace('&raquo;', '»')}
                                </Link>
                            ) : (
                                <span style={{ padding: '0.25rem 0.5rem' }}>
                                    {link.label
                                        .replace('&laquo;', '«')
                                        .replace('&raquo;', '»')}
                                </span>
                            )}
                        </span>
                    ))}
                </div>
            </div>
        </GuestLayout>
    );
}
