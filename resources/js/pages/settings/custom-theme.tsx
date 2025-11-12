import { Head, router } from '@inertiajs/react';
import { FormEvent, useEffect, useState } from 'react';

interface Theme {
    key: string;
    name: string;
}

interface Props {
    themes: Theme[];
    themesData: Record<string, unknown>;
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

export default function CustomTheme({
    themes,
    themesData,
    currentTheme,
}: Props) {
    const [baseTheme, setBaseTheme] = useState(() => {
        const saved = localStorage.getItem('customTheme');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return parsed.base || currentTheme;
            } catch {
                return currentTheme;
            }
        }
        return currentTheme;
    });
    const [colors, setColors] = useState<CustomColors>(() => {
        const saved = localStorage.getItem('customTheme');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                return { ...defaultColors, ...parsed.colors };
            } catch {
                return defaultColors;
            }
        }
        return defaultColors;
    });

    const handleLoadBaseTheme = () => {
        // If custom is selected, load from localStorage
        if (baseTheme === 'custom') {
            const customTheme = localStorage.getItem('customTheme');
            if (customTheme) {
                try {
                    const { colors: savedColors } = JSON.parse(customTheme);
                    setColors({ ...defaultColors, ...savedColors });
                    return;
                } catch {
                    // Fall through to default
                }
            }
        }

        // Load colors from the selected base theme
        const selectedTheme = themesData[baseTheme];
        if (selectedTheme) {
            const themeColors: CustomColors = {
                text: selectedTheme.text || defaultColors.text,
                background:
                    selectedTheme.background || defaultColors.background,
                link: selectedTheme.link || defaultColors.link,
                link_visited:
                    selectedTheme.link_visited || defaultColors.link_visited,
                link_active:
                    selectedTheme.link_active || defaultColors.link_active,
                link_hover:
                    selectedTheme.link_hover || defaultColors.link_hover,
                title: selectedTheme.title || defaultColors.title,
                quote: selectedTheme.quote || defaultColors.quote,
            };
            setColors(themeColors);
        }
    };

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
            <Head title="Custom Theme Settings" />

            <div className="nw">
                <div className="pagetitle">Custom Theme Settings</div>
                <hr />

                <form onSubmit={handleSubmit}>
                    <div className="m">
                        <div className="ms">Base Theme</div>
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
                            </select>{' '}
                            <button type="button" onClick={handleLoadBaseTheme}>
                                Set
                            </button>
                        </div>
                    </div>

                    <div className="m">
                        <div className="ms">Display Colors (Hex)</div>
                        <div className="post-contents">
                            <table style={{ fontSize: '14px' }}>
                                <tbody>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Text Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.text.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        text:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Background Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.background.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        background:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Link Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.link.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        link:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Visited Link Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.link_visited.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        link_visited:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Active Link Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.link_active.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        link_active:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Hover Link Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.link_hover.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        link_hover:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Title Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.title.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        title:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
                                                maxLength={6}
                                                style={{ width: '80px' }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style={{ padding: '0.3rem' }}>
                                            Quote Color
                                        </td>
                                        <td style={{ padding: '0.3rem' }}>
                                            #
                                            <input
                                                type="text"
                                                value={colors.quote.replace(
                                                    '#',
                                                    '',
                                                )}
                                                onChange={(e) =>
                                                    setColors({
                                                        ...colors,
                                                        quote:
                                                            '#' +
                                                            e.target.value,
                                                    })
                                                }
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
                        <button type="submit">Save</button>
                        <button type="button" onClick={handleReset}>
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit('/settings')}
                        >
                            Back
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
