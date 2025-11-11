import AppLayout from '@/layouts/app-layout';
import { router } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

interface Theme {
    key: string;
    name: string;
}

interface Props {
    themes: Theme[];
    currentTheme: string;
}

export default function SettingsIndex({ themes, currentTheme }: Props) {
    const [selectedTheme, setSelectedTheme] = useState(currentTheme);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        window.location.href = `/theme/${selectedTheme}`;
    };

    return (
        <AppLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold">設定</h1>
                
                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="mb-4">
                        <label className="mb-2 block font-medium">テーマ</label>
                        <select
                            value={selectedTheme}
                            onChange={(e) => setSelectedTheme(e.target.value)}
                            className="rounded border p-2"
                        >
                            {themes.map((theme) => (
                                <option key={theme.key} value={theme.key}>
                                    {theme.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-2">
                        <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                            保存
                        </button>
                        <button
                            type="button"
                            onClick={() => router.visit('/admin')}
                            className="rounded border px-4 py-2 hover:bg-gray-100"
                        >
                            戻る
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
