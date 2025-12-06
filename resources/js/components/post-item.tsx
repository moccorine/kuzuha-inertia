import { useAutoLink } from '@/hooks/use-auto-link';
import { useDateFormat } from '@/hooks/use-date-format';
import { useLang } from '@/hooks/useLang';
import { destroy, follow, search, thread } from '@/routes/posts';
import { Link, router } from '@inertiajs/react';

interface Post {
    id: number;
    username: string | null;
    email: string | null;
    title: string | null;
    message: string;
    metadata: {
        url?: string;
        auto_link?: boolean;
        reference?: {
            post_id: number;
            created_at: string;
        };
    } | null;
    created_at: string;
    can_delete?: boolean;
}

export default function PostItem({ post }: { post: Post }) {
    const { autoLinkUrls } = useAutoLink();
    const { formatDate } = useDateFormat();
    const { __ } = useLang('bbs');

    function renderMessage(): { __html: string } {
        let content = post.message;

        if (post.metadata?.auto_link) {
            content = autoLinkUrls(content);
        }

        if (post.metadata?.url) {
            content += `\n\n<a href="${post.metadata.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${post.metadata.url}</a>`;
        }

        if (post.metadata?.reference) {
            const refDate = formatDate(post.metadata.reference.created_at);
            const refUrl = follow({
                post: post.metadata.reference.post_id,
            }).url;
            content += `\n\n<a href="${refUrl}" class="text-blue-600 hover:underline">参考：${refDate}</a>`;
        }

        return { __html: content };
    }

    function handleDelete(e: React.MouseEvent) {
        e.preventDefault();
        if (confirm('この投稿を削除しますか？')) {
            router.delete(destroy({ post: post.id }));
        }
    }

    return (
        <div className="pb-4">
            <div className="mb-2">
                <span className="font-semibold">
                    {post.title && (
                        <span className="text-lg">
                            {post.title}&nbsp;&nbsp;
                        </span>
                    )}
                    {__('Posted by')} {post.username || ' '}
                </span>
                <span className="text-sm text-gray-500">
                    &nbsp;&nbsp;{__('Posted date')}
                    {formatDate(post.created_at)}
                </span>
                <span className="ml-4 text-sm">
                    &nbsp;&nbsp;&nbsp;
                    <Link
                        href={follow({ post: post.id })}
                        className="hover:underline"
                    >
                        ■
                    </Link>
                    {post.username && post.username !== ' ' && (
                        <>
                            &nbsp;&nbsp;&nbsp;
                            <Link
                                href={search({ user: post.username })}
                                className="hover:underline"
                            >
                                ★
                            </Link>
                        </>
                    )}
                    &nbsp;&nbsp;&nbsp;
                    <Link
                        href={thread({ post: post.id })}
                        className="hover:underline"
                    >
                        ◆
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <a href="#" className="hover:underline">
                        木
                    </a>
                    {post.can_delete && (
                        <>
                            &nbsp;&nbsp;&nbsp;
                            <a
                                href="#"
                                onClick={handleDelete}
                                className="hover:underline"
                            >
                                ×
                            </a>
                        </>
                    )}
                </span>
            </div>
            <div
                className="whitespace-pre-wrap text-gray-700"
                dangerouslySetInnerHTML={renderMessage()}
            />
            <hr className="mt-4" />
        </div>
    );
}
