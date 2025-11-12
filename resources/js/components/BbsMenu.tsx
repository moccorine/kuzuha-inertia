import { Spinner } from '@/components/ui/spinner';
import { humanizeDiff } from '@/utils/datetime';
import { Link } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BbsMenuProps {
    counter: number;
    installedAt: string;
    perPage: number;
    onlineCount?: number;
    customLinks?: Array<{
        id: number;
        title: string;
        url: string;
    }>;
    informationPage?: {
        url: string;
        hasContent: boolean;
    } | null;
}

export default function BbsMenu({
    counter,
    installedAt,
    perPage,
    onlineCount,
    customLinks = [],
    informationPage,
}: BbsMenuProps) {
    const [processing, setProcessing] = useState(false);
    const [customBgColor] = useState(() => {
        const customTheme = localStorage.getItem('customTheme');
        if (customTheme) {
            try {
                const { colors } = JSON.parse(customTheme);
                return colors?.background || '#004040';
            } catch {
                return '#004040';
            }
        }
        return '#004040';
    });

    const installedDate = new Date(installedAt);
    const formattedDate = `${installedDate.getFullYear()}/${String(installedDate.getMonth() + 1).padStart(2, '0')}/${String(installedDate.getDate()).padStart(2, '0')}`;
    const installedDiff = humanizeDiff(installedAt);
    return (
        <>
            <div
                style={{
                    marginTop: '1rem',
                    marginBottom: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                }}
            >
                <Link href="/settings" style={{ textDecoration: 'none' }}>
                    <button
                        type="button"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: '0.5rem 1rem',
                        }}
                    >
                        <Settings size={16} />
                        Settings
                    </button>
                </Link>

                <div style={{ fontSize: '13px' }}>
                    <a href="/theme/default">
                        <span
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#004040',
                                border: '1px solid #fff',
                                marginRight: '3px',
                                verticalAlign: 'middle',
                            }}
                        ></span>
                        Legacy
                    </a>
                    {' | '}
                    <a href="/theme/dark">
                        <span
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: '#1a1a1a',
                                border: '1px solid #fff',
                                marginRight: '3px',
                                verticalAlign: 'middle',
                            }}
                        ></span>
                        Dark
                    </a>
                    {' | '}
                    <a href="/theme/custom">
                        <span
                            style={{
                                display: 'inline-block',
                                width: '12px',
                                height: '12px',
                                backgroundColor: customBgColor,
                                border: '1px solid #fff',
                                marginRight: '3px',
                                verticalAlign: 'middle',
                            }}
                        ></span>
                        Custom
                    </a>
                </div>
            </div>

            <div style={{ fontSize: '13px', marginBottom: '0.5rem' }}>
                {counter} since {formattedDate} ({installedDiff}) (Durability
                Level: ∞)
                {onlineCount !== undefined && (
                    <> | Online: {onlineCount} (within 5 min)</>
                )}
            </div>

            <hr style={{ marginBottom: '1rem' }} />

            <div style={{ fontSize: '13px' }}>
                {informationPage && (
                    <>
                        {informationPage.url ? (
                            <a href={informationPage.url}>Information</a>
                        ) : informationPage.hasContent ? (
                            <Link href="/information">Information</Link>
                        ) : null}
                        {(informationPage.url || informationPage.hasContent) &&
                            ' | '}
                    </>
                )}
                <Link href="/archive">Archive</Link>
                {customLinks.length > 0 && (
                    <>
                        {customLinks.map((link) => (
                            <span key={link.id}>
                                {' | '}
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.title}
                                </a>
                            </span>
                        ))}
                    </>
                )}
            </div>

            <hr style={{ marginTop: '1rem', marginBottom: '0.5rem' }} />

            <div style={{ fontSize: '13px', marginBottom: '1rem' }}>
                ■: Follow Post (Reply) ★: User Posts ◆: Thread Display 木:
                Tree View ×: Undo (Delete own post)
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <button
                    type="button"
                    disabled={processing}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.5rem 1rem',
                    }}
                    onClick={() => {
                        const form = document.getElementById(
                            'post-form',
                        ) as HTMLFormElement;
                        if (form) {
                            setProcessing(true);
                            form.requestSubmit();
                            // Reset after a short delay to allow form submission
                            setTimeout(() => setProcessing(false), 1000);
                        }
                    }}
                >
                    {processing && <Spinner />}
                    Post / Reload
                </button>{' '}
                <Link href={`/?readnew=1&d=${perPage}`}>
                    <button type="button" style={{ padding: '0.5rem 1rem' }}>
                        Unread
                    </button>
                </Link>
            </div>

            <hr />
        </>
    );
}
