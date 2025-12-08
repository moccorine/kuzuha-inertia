import { ExecutionTime } from '@/components/execution-time';
import { useLang } from '@/hooks/useLang';
import { info } from '@/routes';
import { index as postsIndex } from '@/routes/posts';
import { index as treeIndex } from '@/routes/posts/tree';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

type PageProps = SharedData & {
    lastViewedId?: number;
};

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const page = usePage<{ props: PageProps }>();
    const { name, lastViewedId } = page.props;
    const { __ } = useLang('bbs');
    const isTreeView =
        page.component === 'posts/tree-index' ||
        page.component === 'posts/tree';
    const treeLinkOptions =
        !isTreeView && lastViewedId
            ? { query: { last_id: lastViewedId } }
            : undefined;

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col bg-background">
                <header className="border-b py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold">
                                <Link href={postsIndex().url}>{name}</Link>
                            </h1>
                            <Link
                                href={info().url}
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                {__('Info Page')}
                            </Link>
                            <Link
                                href="/archive"
                                className="text-sm text-muted-foreground hover:text-foreground"
                            >
                                {__('Archive')}
                            </Link>
                            {isTreeView && (
                                <Link
                                    href={postsIndex().url}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {__('Standard view')}
                                </Link>
                            )}
                            {!isTreeView && (
                                <Link
                                    href={treeIndex(treeLinkOptions).url}
                                    className="text-sm text-muted-foreground hover:text-foreground"
                                >
                                    {__('Tree view')}
                                </Link>
                            )}
                        </div>
                    </div>
                </header>
                <div className="flex-1">{children}</div>
                <footer className="relative z-10 py-4 text-center">
                    <ExecutionTime />
                </footer>
            </div>
        </>
    );
}
