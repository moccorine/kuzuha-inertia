import GuestLayout from '@/layouts/guest-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { Spinner } from '@/components/ui/spinner';

interface Count {
    period: string;
    count: number;
    topic_count: number;
}

interface Props {
    counts: {
        data: Count[];
        links?: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    } | Count[];
    view: string;
    appName: string;
}

export default function Archive({ counts, view, appName }: Props) {
    const isMonthly = view === 'monthly';
    const isPaginated = !Array.isArray(counts);
    const data = isPaginated ? (counts as any).data : counts;
    const links = isPaginated ? (counts as any).links : null;

    const [selectedDates, setSelectedDates] = useState<string[]>([]);

    const { data: formData, setData, get, processing } = useForm({
        keyword: '',
        target_username: true,
        target_title: true,
        target_body: true,
        ignore_case: true,
        dates: [] as string[],
    });

    const handleDateToggle = (period: string) => {
        setSelectedDates((prev) => {
            if (prev.includes(period)) {
                return prev.filter((d) => d !== period);
            } else {
                return [...prev, period];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectedDates.length === data.length) {
            setSelectedDates([]);
        } else {
            setSelectedDates(data.map((item: Count) => item.period));
        }
    };

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        setData('dates', selectedDates);
        get('/archive/search', {
            preserveState: true,
            onSuccess: () => {
                // Keep form state
            },
        });
    };
    
    return (
        <GuestLayout>
            <Head title={`${appName} - Archive`} />
            <div style={{ padding: '1rem 0.5rem 0 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold' }}>{appName}</Link>
                    <span style={{ margin: '0 0.5rem' }}>|</span>
                    <span style={{ fontSize: '18px' }}>Archive ({isMonthly ? 'Monthly' : 'Daily'})</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/">
                        <button type="button">Back to Home</button>
                    </Link>{' '}
                    <Link href={`/archive?view=${isMonthly ? 'daily' : 'monthly'}`}>
                        <button type="button">
                            Switch to {isMonthly ? 'Daily' : 'Monthly'}
                        </button>
                    </Link>
                </div>

                <hr style={{ marginBottom: '1rem' }} />

                <form onSubmit={handleSearch} style={{ marginBottom: '1rem', fontSize: '14px' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                        <input
                            type="text"
                            value={formData.keyword}
                            onChange={(e) => setData('keyword', e.target.value)}
                            placeholder="キーワード検索"
                            style={{ padding: '0.3rem', width: '300px', maxWidth: '100%' }}
                        />
                        {' '}
                        <button type="submit" disabled={processing} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                            {processing && <Spinner />}
                            検索
                        </button>
                        {selectedDates.length > 0 && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '13px' }}>
                                ({selectedDates.length}日選択中)
                            </span>
                        )}
                    </div>
                    <div>
                        <label style={{ marginRight: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.target_username}
                                onChange={(e) => setData('target_username', e.target.checked)}
                            />
                            {' '}投稿者
                        </label>
                        <label style={{ marginRight: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.target_title}
                                onChange={(e) => setData('target_title', e.target.checked)}
                            />
                            {' '}タイトル
                        </label>
                        <label style={{ marginRight: '1rem' }}>
                            <input
                                type="checkbox"
                                checked={formData.target_body}
                                onChange={(e) => setData('target_body', e.target.checked)}
                            />
                            {' '}本文
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                checked={formData.ignore_case}
                                onChange={(e) => setData('ignore_case', e.target.checked)}
                            />
                            {' '}大文字小文字を区別しない
                        </label>
                    </div>
                </form>

                <hr style={{ marginBottom: '1rem' }} />

                {data.length === 0 ? (
                    <div style={{ fontSize: '15px', fontStyle: 'italic' }}>
                        No posts yet.
                    </div>
                ) : (
                    <>
                        <div style={{ marginBottom: '0.5rem', fontSize: '14px' }}>
                            <label style={{ cursor: 'pointer', fontWeight: 'bold' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedDates.length === data.length && data.length > 0}
                                    onChange={handleSelectAll}
                                    style={{ marginRight: '0.3rem' }}
                                />
                                全選択/解除
                            </label>
                        </div>
                        <div style={{ fontSize: '14px' }}>
                            {data.map((item: Count) => (
                                <div key={item.period} style={{ marginBottom: '0.5rem' }}>
                                    <label style={{ cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedDates.includes(item.period)}
                                            onChange={() => handleDateToggle(item.period)}
                                            style={{ marginRight: '0.3rem' }}
                                        />
                                        <Link href={`/archive/${item.period}`} style={{ color: 'var(--theme-link)' }}>
                                            {item.period}
                                        </Link>
                                        {' '}
                                        ({item.count} posts)
                                        {' | '}
                                        <Link href={`/topics/${item.period}`} style={{ color: 'var(--theme-link)' }}>
                                            トピック一覧
                                        </Link>
                                        {' '}
                                        ({item.topic_count} topics)
                                    </label>
                                </div>
                            ))}
                        </div>

                        {links && (
                            <div style={{ marginTop: '1rem' }}>
                                {links.map((link: any, index: number) => (
                                    <span key={index}>
                                        {link.url ? (
                                            <Link
                                                href={link.url}
                                                style={{
                                                    padding: '0.25rem 0.5rem',
                                                    textDecoration: link.active ? 'underline' : 'none',
                                                }}
                                            >
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </Link>
                                        ) : (
                                            <span style={{ padding: '0.25rem 0.5rem' }}>
                                                {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                                            </span>
                                        )}
                                    </span>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </GuestLayout>
    );
}
