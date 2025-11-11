import { Link } from '@inertiajs/react';

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
    const installedDate = new Date(installedAt);
    const formattedDate = `${installedDate.getFullYear()}/${String(installedDate.getMonth() + 1).padStart(2, '0')}/${String(installedDate.getDate()).padStart(2, '0')}`;

    return (
        <>
            <div style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>
                <button type="button" onClick={() => alert('Settings')}>
                    Settings
                </button>
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
                    onClick={() => {
                        const form = document.getElementById(
                            'post-form',
                        ) as HTMLFormElement;
                        if (form) {
                            form.requestSubmit();
                        }
                    }}
                >
                    Post / Reload
                </button>{' '}
                <Link href={`/?readnew=1&d=${perPage}`}>
                    <button type="button">Unread</button>
                </Link>
            </div>

            <hr />
        </>
    );
}
