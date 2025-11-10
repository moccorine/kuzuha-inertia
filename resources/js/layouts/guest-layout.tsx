import { usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface GuestLayoutProps {
    children: ReactNode;
}

export default function GuestLayout({ children }: GuestLayoutProps) {
    const page = usePage();
    const { appCredit, appVersion, executionTime } = page.props as { 
        appCredit: string; 
        appVersion: string;
        executionTime?: string;
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
                {children}
            </div>
            <footer>
                <hr style={{ marginBottom: '1rem' }} />
                <div className="copyright" style={{ textAlign: 'right', fontSize: '13px' }}>
                    {appCredit} {appVersion}
                    {executionTime && (
                        <span style={{ marginLeft: '1rem', fontStyle: 'italic' }}>
                            ({executionTime}sec)
                        </span>
                    )}
                </div>
            </footer>
        </div>
    );
}
