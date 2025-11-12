import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
    },
];

interface SpamLog {
    id: number;
    ip_address: string;
    user_agent: string;
    url: string;
    method: string;
    created_at: string;
}

interface TopSpamIp {
    ip_address: string;
    count: number;
}

interface Props {
    recentSpam: SpamLog[];
    spamCount24h: number;
    topSpamIps: TopSpamIp[];
}

export default function Dashboard({
    recentSpam,
    spamCount24h,
    topSpamIps,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Admin Dashboard" />

            <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                Admin Dashboard
            </div>

            <div style={{ fontSize: '14px', marginBottom: '2rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>
                    Spam Statistics (24h)
                </h3>
                <p>
                    Total spam attempts: <strong>{spamCount24h}</strong>
                </p>
            </div>

            {topSpamIps.length > 0 && (
                <div style={{ fontSize: '14px', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Top Spam IPs</h3>
                    <table
                        style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.5rem',
                                    }}
                                >
                                    IP Address
                                </th>
                                <th
                                    style={{
                                        textAlign: 'right',
                                        padding: '0.5rem',
                                    }}
                                >
                                    Count
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {topSpamIps.map((item) => (
                                <tr
                                    key={item.ip_address}
                                    style={{ borderBottom: '1px solid #eee' }}
                                >
                                    <td style={{ padding: '0.5rem' }}>
                                        {item.ip_address}
                                    </td>
                                    <td
                                        style={{
                                            textAlign: 'right',
                                            padding: '0.5rem',
                                        }}
                                    >
                                        {item.count}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {recentSpam.length > 0 && (
                <div style={{ fontSize: '14px' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>
                        Recent Spam Attempts
                    </h3>
                    <table
                        style={{ width: '100%', borderCollapse: 'collapse' }}
                    >
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.5rem',
                                    }}
                                >
                                    Time
                                </th>
                                <th
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.5rem',
                                    }}
                                >
                                    IP
                                </th>
                                <th
                                    style={{
                                        textAlign: 'left',
                                        padding: '0.5rem',
                                    }}
                                >
                                    URL
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentSpam.map((log) => (
                                <tr
                                    key={log.id}
                                    style={{ borderBottom: '1px solid #eee' }}
                                >
                                    <td
                                        style={{
                                            padding: '0.5rem',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {new Date(
                                            log.created_at,
                                        ).toLocaleString()}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        {log.ip_address}
                                    </td>
                                    <td
                                        style={{
                                            padding: '0.5rem',
                                            fontSize: '12px',
                                        }}
                                    >
                                        {log.url}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AppLayout>
    );
}
