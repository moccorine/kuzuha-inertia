import PostForm from '@/components/post-form';
import PostItem from '@/components/post-item';
import { useLang } from '@/hooks/useLang';
import PublicLayout from '@/layouts/public-layout';

interface Post {
    id: number;
    username: string | null;
    email: string | null;
    title: string | null;
    message: string;
    metadata: {
        url?: string;
        auto_link?: boolean;
    } | null;
    created_at: string;
}

interface Props {
    post: Post;
    quotedMessage: string;
    defaultTitle: string;
}

export default function Follow({ post, quotedMessage, defaultTitle }: Props) {
    const { __ } = useLang('bbs');

    return (
        <PublicLayout title="Follow Post">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="space-y-4">
                    <div className="rounded border bg-gray-50 p-4">
                        <PostItem post={post} />
                    </div>

                    <PostForm
                        defaultTitle={defaultTitle}
                        defaultMessage={quotedMessage}
                        followId={post.id}
                        hideLinks={true}
                    />
                </div>
            </div>
        </PublicLayout>
    );
}
