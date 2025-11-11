import { Head, router, usePage, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

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

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        window.location.href = `/theme/${selectedTheme}`;
    };

    return (
        <>
            <Head title="設定" />

            <div className="nw">
                <div className="pagetitle">設定</div>
                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="m">
                        <div className="ms">テーマ</div>
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
                        <button type="submit">保存</button>
                        <button type="button" onClick={() => router.visit('/')}>
                            戻る
                        </button>
                    </div>

                    <div className="m">
                        <Link href="/settings/custom-theme">
                            <button type="button">カスタムテーマ設定</button>
                        </Link>
                    </div>
                </form>
            </div>
        </>
    );
}
