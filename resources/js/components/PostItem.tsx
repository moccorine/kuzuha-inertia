interface Post {
    id: number;
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
    return (
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid #c0c0c0', paddingBottom: '1rem' }}>
            <div style={{ fontSize: '14px', marginBottom: '0.5rem' }}>
                {post.title && (
                    <>
                        <span className="ms">{post.title}</span>
                        {' '}
                    </>
                )}
                {post.username && post.username !== 'Anonymous' && (
                    <>
                        <span style={{ fontWeight: 'bold' }}>
                            {post.username}
                        </span>
                        {' - '}
                    </>
                )}
                <span>{new Date(post.created_at).toLocaleString('ja-JP')}</span>
                {' '}
                <a href="#" style={{ fontSize: '15px' }}>■</a>
            </div>
            <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', marginLeft: '27px' }}>
                {post.body}
            </div>
        </div>
    );
}
