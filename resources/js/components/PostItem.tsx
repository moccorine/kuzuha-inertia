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
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][date.getDay()];
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
    };

    return (
        <>
            <span className="ngline">
                <div className="m" id={`m${post.id}`}>
                    <span className="nw">
                        <span className="ms">{post.title || ' '}</span>
                        &nbsp;&nbsp;
                        {post.username && post.username !== 'Anonymous' && (
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
