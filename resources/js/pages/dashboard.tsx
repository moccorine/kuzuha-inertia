import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />
            
            <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                Admin Dashboard
            </div>

            <div style={{ fontSize: '14px' }}>
                <p>Welcome to the admin dashboard.</p>
            </div>
        </AppLayout>
    );
}
