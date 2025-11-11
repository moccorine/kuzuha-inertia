import AppLayout from '@/layouts/app-layout';
import { Link } from '@inertiajs/react';
import { FileText, Link as LinkIcon } from 'lucide-react';

export default function SystemIndex() {
    const menuItems = [
        {
            title: 'Information Page',
            description: 'Edit information page content',
            href: '/admin/system/information',
            icon: FileText,
        },
        {
            title: 'Link Management',
            description: 'Manage custom links',
            href: '/admin/system/links',
            icon: LinkIcon,
        },
    ];

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">システム</h1>
                
                <div className="grid gap-4 md:grid-cols-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="block rounded-lg border p-6 hover:bg-accent transition-colors"
                        >
                            <div className="flex items-start gap-4">
                                <item.icon className="h-6 w-6 mt-1" />
                                <div>
                                    <h2 className="text-lg font-semibold mb-1">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
