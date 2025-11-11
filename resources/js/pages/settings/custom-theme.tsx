import { Head, router } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

interface Theme {
    key: string;
    name: string;
}

interface Props {
    themes: Theme[];
    currentTheme: string;
}

interface CustomColors {
    text: string;
    background: string;
    link: string;
    link_visited: string;
    link_active: string;
    link_hover: string;
    title: string;
    quote: string;
}

const defaultColors: CustomColors = {
    text: '#efefef',
    background: '#004040',
    link: '#ccffee',
    link_visited: '#dddddd',
    link_active: '#ff0000',
    link_hover: '#11eeee',
    title: '#fffffe',
    quote: '#cccccc',
};

export default function CustomTheme({ themes, currentTheme }: Props) {
    const [baseTheme, setBaseTheme] = useState(currentTheme);
    const [colors, setColors] = useState<CustomColors>(defaultColors);

    useEffect(() => {
        const saved = localStorage.getItem('customTheme');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBaseTheme(parsed.base || currentTheme);
                setColors({ ...defaultColors, ...parsed.colors });
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        
        const themeData = {
            base: baseTheme,
            colors: colors,
        };
        
        localStorage.setItem('customTheme', JSON.stringify(themeData));

        // Set custom theme cookie via direct navigation
        window.location.href = '/theme/custom';
    };

    const handleReset = () => {
        setColors(defaultColors);
    };

    return (
        <>
            <Head title="カスタムテーマ設定" />

            <div className="nw">
                <div className="pagetitle">カスタムテーマ設定</div>
                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="m">
                        <div className="ms">ベーステーマ</div>
                        <div className="post-contents">
                            <select
                                value={baseTheme}
                                onChange={(e) => setBaseTheme(e.target.value)}
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
                        <div className="ms">表示色（16進数）</div>
                        <div className="post-contents">
                            <table style={{ fontSize: '14px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>文字色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.text.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, text: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>背景色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.background.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, background: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>リンク色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.link.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, link: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>訪問済みリンク色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.link_visited.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, link_visited: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>アクティブリンク色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.link_active.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, link_active: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>マウスオーバーリンク色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.link_hover.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, link_hover: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>題名色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.title.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, title: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>引用色</td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #<input
                                                type="text"
                                                value={colors.quote.replace('#', '')}
                                                onChange={(e) => setColors({ ...colors, quote: '#' + e.target.value })}
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="m">
                        <button type="submit">保存</button>
                        <button type="button" onClick={handleReset}>
                            リセット
                        </button>
                        <button type="button" onClick={() => router.visit('/settings')}>
                            戻る
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
