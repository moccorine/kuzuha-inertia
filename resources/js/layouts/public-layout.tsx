import { ExecutionTime } from '@/components/execution-time';
import { Head, Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';
import { type SharedData } from '@/types';
import { index } from '@/routes/posts';

interface PublicLayoutProps {
    children: ReactNode;
    title?: string;
}

export default function PublicLayout({ children, title }: PublicLayoutProps) {
    const { name } = usePage<{ props: SharedData }>().props;

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-background flex flex-col">
                <header className="border-b py-4">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h1 className="text-2xl font-bold">
                            <Link href={index().url}>{name}</Link>
                        </h1>
                    </div>
                </header>
                <div className="flex-1">{children}</div>
                <footer className="py-4 text-center relative z-10">
                    <ExecutionTime />
                </footer>
            </div>
        </>
    );
}
