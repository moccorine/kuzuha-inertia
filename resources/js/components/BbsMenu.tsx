import { Link } from '@inertiajs/react';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';

interface BbsMenuProps {
    counter: number;
    installedAt: string;
    perPage: number;
}

export default function BbsMenu({
    counter,
    installedAt,
    perPage,
}: BbsMenuProps) {
    const [processing, setProcessing] = useState(false);
    const installedDate = new Date(installedAt);
    const formattedDate = `${installedDate.getFullYear()}/${String(installedDate.getMonth() + 1).padStart(2, '0')}/${String(installedDate.getDate()).padStart(2, '0')}`;

    return (
        <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                <Link href="/settings">
                    <button type="button">Settings</button>
                </Link>
            </div>

            <div style={{ fontSize: '13px', marginBottom: '0.5rem' }}>
                {counter} since {formattedDate} (Durability Level: ∞)
            </div>

            <hr style={{ marginBottom: '1rem' }} />

            <div style={{ fontSize: '13px' }}>
                <a href="#">Info</a> | <a href="#">Archive</a>
            </div>

            <hr style={{ marginTop: '1rem', marginBottom: '0.5rem' }} />

            <div style={{ fontSize: '13px', marginBottom: '1rem' }}>
                ■: Follow Post (Reply)　★: User Posts　◆: Thread Display　木:
                Tree View　×: Undo (Delete own post)
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <button
                    type="button"
                    disabled={processing}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.5rem 1rem' }}
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
                    <button type="button" style={{ padding: '0.5rem 1rem' }}>Unread</button>
                </Link>
            </div>

            <hr />
        </>
    );
}
