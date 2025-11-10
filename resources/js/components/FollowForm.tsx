import { FormEventHandler } from 'react';
import { useForm } from '@inertiajs/react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface FollowFormProps {
    parentId: number;
    quotedBody: string;
}

export default function FollowForm({ parentId, quotedBody }: FollowFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        title: '',
        body: quotedBody,
        url: '',
        parent_id: parentId,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
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
                        style={{ display: 'inline-block', width: '300px', marginRight: '0.5rem' }}
                    />
                    <Button type="submit" disabled={processing}>Post / Reload</Button>
                    {' '}
                    <Button type="button" variant="outline" onClick={() => reset()}>Clear</Button>
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
                    {errors.body && <div className="error" style={{ fontSize: '13px', marginTop: '0.3rem' }}>{errors.body}</div>}
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
