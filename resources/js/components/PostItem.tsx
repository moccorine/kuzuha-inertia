import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Post {
    id: number;
    parent_id: number | null;
    parent?: {
        id: number;
        created_at: string;
    };
    username: string;
    tripcode: string | null;
    email: string | null;
    title: string | null;
    body: string;
    created_at: string;
}

interface PostItemProps {
    post: Post;
    lastPostId?: number;
    canUndo?: boolean;
}

export default function PostItem({ post, lastPostId, canUndo }: PostItemProps) {
    const [open, setOpen] = useState(false);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        // Convert to JST (UTC+9)
        const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        const year = jstDate.getUTCFullYear();
        const month = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(jstDate.getUTCDate()).padStart(2, '0');
        const weekday = ['日', '月', '火', '水', '木', '金', '土'][
            jstDate.getUTCDay()
        ];
        const hours = String(jstDate.getUTCHours()).padStart(2, '0');
        const minutes = String(jstDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(jstDate.getUTCSeconds()).padStart(2, '0');
        return `${year}/${month}/${day}(${weekday}) ${hours}:${minutes}:${seconds}`;
    };

    // Check if username is valid (not empty, not Anonymous, not just whitespace)
    const hasValidUsername =
        post.username &&
        post.username !== 'Anonymous' &&
        post.username.trim() !== '' &&
        post.username.trim() !== '　'; // Full-width space

    const handleUndo = () => {
        router.delete(`/posts/${post.id}/undo`, {
            preserveScroll: true,
            onSuccess: () => setOpen(false),
        });
    };

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
                                {post.tripcode && (
                                    <span className="muh"> {post.tripcode}</span>
                                )}
                                &nbsp;&nbsp;
                            </>
                        )}
                        <span className="md">
                            Posted: {formatDate(post.created_at)}
                            <a id={`a${post.id}`}>&nbsp;</a>
                            <span className="nb">
                                &nbsp;&nbsp;&nbsp;
                                <Link
                                    href={`/posts/${post.id}`}
                                    className="internal"
                                >
                                    ■
                                </Link>
                                {hasValidUsername && (
                                    <>
                                        &nbsp;
                                        <Link
                                            href={`/users/${encodeURIComponent(post.username)}/posts`}
                                            className="internal"
                                        >
                                            ★
                                        </Link>
                                    </>
                                )}
                                &nbsp;
                                <Link
                                    href={`/threads/${post.thread_id || post.id}`}
                                    className="internal"
                                >
                                    ◆
                                </Link>
                                &nbsp;
                                <Link
                                    href={`/tree/${post.thread_id || post.id}`}
                                    className="internal"
                                >
                                    木
                                </Link>
                                {canUndo && lastPostId === post.id && (
                                    <>
                                        &nbsp;
                                        <Dialog
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <DialogTrigger asChild>
                                                <button
                                                    type="button"
                                                    style={{
                                                        background: 'none',
                                                        border: 'none',
                                                        color: '#efe',
                                                        cursor: 'pointer',
                                                        textDecoration:
                                                            'underline',
                                                        padding: 0,
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent 
                                                className="bg-[var(--theme-background)] border-[var(--theme-hr)]"
                                                style={{
                                                    position: 'fixed',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                }}
                                            >
                                                <DialogHeader>
                                                    <DialogTitle>
                                                        Delete Post
                                                    </DialogTitle>
                                                    <DialogDescription>
                                                        Are you sure you want to
                                                        delete this post? This
                                                        action cannot be undone.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <DialogFooter style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', justifyContent: 'center' }}>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() =>
                                                            setOpen(false)
                                                        }
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        onClick={handleUndo}
                                                    >
                                                        Delete
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                )}
                            </span>
                        </span>
                    </span>
                    <div className="post-contents">
                        <pre
                            className="msgnormal"
                            dangerouslySetInnerHTML={{
                                __html:
                                    post.body +
                                    (post.parent_id
                                        ? `\n\n<a href="/posts/${post.parent_id}">Reference: ${post.parent ? formatDate(post.parent.created_at) : '#' + post.parent_id}</a>`
                                        : ''),
                            }}
                        />
                    </div>
                </div>
                <hr />
            </span>
        </>
    );
}
