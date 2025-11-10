import { Link } from '@inertiajs/react';

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
}

interface PostItemProps {
    post: Post;
}

export default function PostItem({ post }: PostItemProps) {
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        // Convert to JST (UTC+9)
        const jstDate = new Date(date.getTime() + (9 * 60 * 60 * 1000));
        const year = jstDate.getUTCFullYear();
        const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(jstDate.getUTCDate()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][jstDate.getUTCDay()];
        const hours = String(jstDate.getUTCHours()).padStart(2, '0');
        const minutes = String(jstDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(jstDate.getUTCSeconds()).padStart(2, '0');
        return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
    };

    // Check if username is valid (not empty, not Anonymous, not just whitespace)
    const hasValidUsername = post.username && 
        post.username !== 'Anonymous' && 
        post.username.trim() !== '' &&
        post.username.trim() !== '　'; // Full-width space

    return (
        <>
            <span className="ngline">
                <div className="m" id={`m${post.id}`}>
                    <span className="nw">
                        <span className="ms">{post.title || ' '}</span>
                        &nbsp;&nbsp;
                        {hasValidUsername && (
                            <>
                                <span className="mu">Author: </span>
                                <span className="mun">{post.username}</span>
                                &nbsp;&nbsp;
                            </>
                        )}
                        <span className="md">
                            Posted: {formatDate(post.created_at)}
                            <a id={`a${post.id}`}>&nbsp;</a>
                            <span className="nb">
                                &nbsp;&nbsp;&nbsp;
                                <Link href={`/posts/${post.id}`} className="internal">■</Link>
                                &nbsp;
                                <Link href={`/threads/${post.thread_id || post.id}`} className="internal">◆</Link>
                                &nbsp;
                                <Link href={`/tree/${post.thread_id || post.id}`} className="internal">木</Link>
                                {hasValidUsername && (
                                    <>
                                        &nbsp;
                                        <Link href={`/users/${encodeURIComponent(post.username)}/posts`} className="internal">★</Link>
                                    </>
                                )}
                            </span>
                        </span>
                    </span>
                    <div className="post-contents">
                        <pre 
                            className="msgnormal" 
                            dangerouslySetInnerHTML={{ 
                                __html: post.body + 
                                    (post.parent_id ? 
                                        `\n\n<a href="/posts/${post.parent_id}">Reference: ${post.parent ? formatDate(post.parent.created_at) : '#' + post.parent_id}</a>` 
                                        : ''
                                    )
                            }} 
                        />
                    </div>
                </div>
                <hr />
            </span>
        </>
    );
}
