import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useForm, usePage } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';

interface PostFormProps {
    perPage: number;
}

export default function PostForm({ perPage }: PostFormProps) {
    const { auth } = usePage().props as { auth: { user?: { username?: string; email?: string } } };

    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        title: '',
        body: '',
        url: '',
        d: perPage,
        autolink: true,
        latitude: null as number | null,
        longitude: null as number | null,
    });

    const [enableLocation, setEnableLocation] = useState(false);
    const [gettingLocation, setGettingLocation] = useState(false);
    const [locationError, setLocationError] = useState('');

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bbsFormData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({
                    username: parsed.username || auth?.user?.username || '',
                    email: parsed.email || auth?.user?.email || '',
                    title: '',
                    body: '',
                    url: '',
                    d: parsed.d || perPage,
                    autolink:
                        parsed.autolink !== undefined ? parsed.autolink : true,
                    latitude: null,
                    longitude: null,
                });
            } catch {
                // Ignore parse errors
            }
        } else if (auth?.user) {
            // If no saved data but user is logged in, use user data
            setData({
                ...data,
                username: auth.user.username || '',
                email: auth.user.email || '',
            });
        }
    }, []);

    const getLocation = () => {
        if (!navigator.geolocation) {
            setLocationError('お使いのブラウザは位置情報に対応していません');
            return;
        }

        setGettingLocation(true);
        setLocationError('');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setData({
                    ...data,
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                });
                setGettingLocation(false);
            },
            (error) => {
                setGettingLocation(false);
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError('位置情報の取得が拒否されました');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        setLocationError('位置情報を取得できませんでした');
                        break;
                    case error.TIMEOUT:
                        setLocationError(
                            '位置情報の取得がタイムアウトしました',
                        );
                        break;
                    default:
                        setLocationError('位置情報の取得に失敗しました');
                }
            },
        );
    };

    const clearLocation = () => {
        setData({ ...data, latitude: null, longitude: null });
        setLocationError('');
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Save to localStorage
        localStorage.setItem(
            'bbsFormData',
            JSON.stringify({
                username: data.username,
                email: data.email,
                d: data.d,
                autolink: data.autolink,
            }),
        );

        post('/posts', {
            onSuccess: () => reset('body', 'title', 'url'),
        });
    };

    return (
        <form method="post" action="/posts" onSubmit={submit} id="post-form">
            {/* Honeypot fields */}
            <input
                type="text"
                name="my_name"
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
            />
            <input
                type="text"
                name="my_time"
                value={Date.now()}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
                readOnly
            />

            <div className="form" style={{ marginBottom: '1rem' }}>
                <div style={{ marginBottom: '0.5rem' }}>
                    Name{' '}
                    <Input
                        type="text"
                        name="username"
                        maxLength={30}
                        value={data.username}
                        onChange={(e) => setData('username', e.target.value)}
                        style={{ display: 'inline-block', width: '200px' }}
                    />
                    <span
                        style={{
                            marginLeft: '0.5rem',
                            fontSize: '12px',
                            color: 'var(--theme-text)',
                            opacity: 0.7,
                        }}
                    >
                        (Use Name#password for tripcode)
                    </span>
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    E-mail{' '}
                    <Input
                        type="text"
                        name="email"
                        maxLength={255}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        style={{ display: 'inline-block', width: '300px' }}
                    />
                </div>

                <div style={{ marginBottom: '0.5rem' }}>
                    Subject{' '}
                    <Input
                        type="text"
                        name="title"
                        maxLength={40}
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        style={{
                            display: 'inline-block',
                            width: '300px',
                            marginRight: '0.5rem',
                        }}
                    />
                    <Button type="submit" disabled={processing}>
                        {processing && <Spinner className="mr-1" />}
                        Post / Reload
                    </Button>{' '}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        Clear
                    </Button>
                    <span style={{ marginLeft: '1rem' }}>
                        Display count{' '}
                        <Input
                            type="text"
                            name="d"
                            value={data.d}
                            onChange={(e) =>
                                setData(
                                    'd',
                                    parseInt(e.target.value) || perPage,
                                )
                            }
                            size={3}
                            style={{
                                display: 'inline-block',
                                width: '50px',
                            }}
                        />
                    </span>
                </div>

                <div style={{ marginTop: '1rem' }}>
                    Message
                    <span className="pfhelp">
                        (Please insert line breaks. HTML tags are not allowed.)
                    </span>
                    <br />
                    <Textarea
                        rows={5}
                        name="body"
                        value={data.body}
                        onChange={(e) => setData('body', e.target.value)}
                        style={{ width: '100%', maxWidth: '700px' }}
                    />
                    {errors.body && (
                        <div
                            className="error"
                            style={{ fontSize: '13px', marginTop: '0.3rem' }}
                        >
                            {errors.body}
                        </div>
                    )}
                </div>

                <div style={{ marginTop: '1rem' }}>
                    URL
                    <span className="pfhelp">
                        (Optional: Enter URL if you want to add a link)
                    </span>
                    <br />
                    <Input
                        type="text"
                        name="url"
                        maxLength={255}
                        value={data.url}
                        onChange={(e) => setData('url', e.target.value)}
                        style={{ width: '100%', maxWidth: '700px' }}
                    />
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <input
                            type="checkbox"
                            name="autolink"
                            checked={data.autolink}
                            onChange={(e) =>
                                setData('autolink', e.target.checked)
                            }
                            style={{ marginRight: '0.3rem' }}
                        />
                        URL自動リンク
                    </label>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={enableLocation}
                            onChange={(e) => {
                                setEnableLocation(e.target.checked);
                                if (!e.target.checked) {
                                    clearLocation();
                                }
                            }}
                            style={{ marginRight: '0.3rem' }}
                        />
                        位置情報を付与する
                    </label>
                    {enableLocation && (
                        <div
                            style={{
                                marginTop: '0.5rem',
                                marginLeft: '1.5rem',
                            }}
                        >
                            {data.latitude && data.longitude ? (
                                <div style={{ fontSize: '13px' }}>
                                    ✓ 位置情報取得済み (
                                    {data.latitude.toFixed(6)},{' '}
                                    {data.longitude.toFixed(6)}){' '}
                                    <button
                                        type="button"
                                        onClick={clearLocation}
                                        style={{
                                            fontSize: '12px',
                                            padding: '0.2rem 0.5rem',
                                        }}
                                    >
                                        クリア
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={getLocation}
                                    disabled={gettingLocation}
                                    size="sm"
                                >
                                    {gettingLocation && (
                                        <Spinner className="mr-1" />
                                    )}
                                    位置情報を取得
                                </Button>
                            )}
                            {locationError && (
                                <div
                                    style={{
                                        fontSize: '12px',
                                        color: '#ff6b6b',
                                        marginTop: '0.3rem',
                                    }}
                                >
                                    {locationError}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
}
