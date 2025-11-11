import { Head, router, usePage, Link } from '@inertiajs/react';
import { FormEvent, useState, useEffect } from 'react';

interface Theme {
    key: string;
    name: string;
}

interface Props {
    themes: Theme[];
    currentTheme: string;
}

export default function Index({ themes, currentTheme }: Props) {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);
    const [displayCount, setDisplayCount] = useState(40);
    const [autolink, setAutolink] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem('bbsFormData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setDisplayCount(parsed.d || 40);
                setAutolink(parsed.autolink !== undefined ? parsed.autolink : true);
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        // Save display count and autolink to localStorage
        const saved = localStorage.getItem('bbsFormData');
        let formData = {};
        if (saved) {
            try {
                formData = JSON.parse(saved);
            } catch (e) {
                // Ignore
            }
        }
        
        localStorage.setItem('bbsFormData', JSON.stringify({
            ...formData,
            d: displayCount,
            autolink: autolink,
        }));
        
        window.location.href = `/theme/${selectedTheme}`;
    };

    return (
        <>
            <Head title="Settings" />

            <div className="nw">
                <div className="pagetitle">Settings</div>
                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="m">
                        <div className="ms">Theme</div>
                        <div className="post-contents">
                            <select
                                value={selectedTheme}
                                onChange={(e) => setSelectedTheme(e.target.value)}
                                className="p-2"
                                style={{
                                    background: 'var(--theme-input-bg)',
                                    color: 'var(--theme-input-text)',
                                    border: '1px solid var(--theme-input-border)',
                                }}
                            >
                                {themes.map((theme) => (
                                    <option key={theme.key} value={theme.key}>
                                        {theme.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="m">
                        <div className="ms">Display Count</div>
                        <div className="post-contents">
                            <input
                                type="number"
                                min="1"
                                max="200"
                                value={displayCount}
                                onChange={(e) => setDisplayCount(parseInt(e.target.value) || 40)}
                                className="p-2"
                                style={{
                                    background: 'var(--theme-input-bg)',
                                    color: 'var(--theme-input-text)',
                                    border: '1px solid var(--theme-input-border)',
                                    width: '100px',
                                }}
                            />
                            <span style={{ marginLeft: '0.5rem', fontSize: '13px' }}>
                                (1-200)
                            </span>
                        </div>
                    </div>

                    <div className="m">
                        <div className="ms">URL Auto-linking</div>
                        <div className="post-contents">
                            <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={autolink}
                                    onChange={(e) => setAutolink(e.target.checked)}
                                    style={{ marginRight: '0.5rem' }}
                                />
                                Automatically convert URLs to links
                            </label>
                        </div>
                    </div>

                    <div className="m">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => router.visit('/')}>
                            Back
                        </button>
                    </div>

                    <div className="m">
                        <Link href="/settings/custom-theme">
                            <button type="button">Custom Theme Settings</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
