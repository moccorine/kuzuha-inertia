import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

interface FollowFormProps {
    parentId: number;
    quotedBody: string;
    defaultTitle: string;
}

export default function FollowForm({
    parentId,
    quotedBody,
    defaultTitle,
}: FollowFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        title: defaultTitle,
        body: quotedBody,
        url: '',
        parent_id: parentId,
    });

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('bbsFormData');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setData({
                    username: parsed.username || '',
                    email: parsed.email || '',
                    title: defaultTitle,
                    body: quotedBody,
                    url: '',
                    parent_id: parentId,
                });
            } catch (e) {
                // Ignore parse errors
            }
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Save to localStorage
        localStorage.setItem(
            'bbsFormData',
            JSON.stringify({
                username: data.username,
                email: data.email,
            }),
        );

        post('/posts', {
            onSuccess: () => reset('body', 'title', 'url'),
        });
    };

    return (
        <form method="post" action="/posts" onSubmit={submit}>
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
                    <span style={{ marginLeft: '0.5rem', fontSize: '12px', color: 'var(--theme-text)', opacity: 0.7 }}>
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
                        Post / Reload
                    </Button>{' '}
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => reset()}
                    >
                        Clear
                    </Button>
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
            </div>
        </form>
    );
}
