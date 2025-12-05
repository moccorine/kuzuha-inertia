import { ExecutionTime } from '@/components/execution-time';
import { index } from '@/routes/posts';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const { name } = usePage<{ props: SharedData }>().props;

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen flex-col bg-background">
                <header className="border-b py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold">
                            <Link href={index().url}>{name}</Link>
                        </h1>
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
