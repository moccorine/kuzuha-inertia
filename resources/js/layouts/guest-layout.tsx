import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    const { appCredit, appVersion } = usePage().props as { appCredit: string; appVersion: string };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
                {children}
            </div>
            <footer style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                <hr style={{ marginBottom: '1rem' }} />
                <div className="copyright" style={{ textAlign: 'right', fontSize: '13px' }}>
                    {appCredit} {appVersion}
                </div>
            </footer>
        </div>
    );
}
