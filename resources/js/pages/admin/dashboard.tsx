import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { useLang } from '@/hooks/useLang';
import AppLayout from '@/layouts/app-layout';
import { dashboard as dashboardRoute } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const { __ } = useLang();
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('Dashboard'),
            href: dashboardRoute().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Dashboard')} />
            <div className="relative flex h-full flex-1 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-sidebar-border/70 bg-muted/50 p-8 text-center dark:border-sidebar-border">
                <PlaceholderPattern className="absolute inset-0 size-full stroke-muted-foreground/20" />
                <div className="relative flex max-w-2xl flex-col items-center gap-4">
                    <p className="text-sm font-semibold tracking-[0.3em] text-muted-foreground uppercase">
                        {__('Work in progress')}
                    </p>
                    <h1 className="text-4xl font-semibold">
                        {__('Dashboard')}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {__(
                            'This section is still being built. Please check back later.',
                        )}
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}
