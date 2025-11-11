import { Spinner } from '@/components/ui/spinner';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    const { data, setData, post, processing, errors } = useForm({
        username: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <>
            <Head title="Login" />
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div style={{ background: 'rgba(0, 64, 64, 0.8)', border: '2px solid #c0c0c0', borderRadius: '4px', padding: '2rem', maxWidth: '500px', width: '100%' }}>
                    <div className="pagetitle" style={{ marginBottom: '0.5rem' }}>Admin Login</div>
                    <div style={{ fontSize: '14px', color: '#ccc', marginBottom: '1.5rem' }}>Please enter your credentials</div>

                    {status && <div style={{ fontSize: '14px', color: '#0f0', marginBottom: '1rem' }}>{status}</div>}
                    {errors.username && <div className="error" style={{ fontSize: '14px', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(255, 0, 0, 0.1)', border: '1px solid #f00', borderRadius: '4px' }}>{errors.username}</div>}

                    <form onSubmit={submit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="username" style={{ display: 'block', fontSize: '14px', marginBottom: '0.3rem' }}>Username</label>
                            <input id="username" type="text" name="username" autoComplete="username" value={data.username} onChange={(e) => setData('username', e.target.value)} required autoFocus style={{ width: '100%', padding: '0.5rem', fontSize: '14px' }} />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="password" style={{ display: 'block', fontSize: '14px', marginBottom: '0.3rem' }}>Password</label>
                            <input id="password" type="password" name="password" autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} required style={{ width: '100%', padding: '0.5rem', fontSize: '14px' }} />
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ fontSize: '14px' }}>
                                <input type="checkbox" name="remember" checked={data.remember} onChange={(e) => setData('remember', e.target.checked)} style={{ marginRight: '0.5rem' }} />
                                Remember me
                            </label>
                        </div>

                        <button type="submit" disabled={processing} style={{ width: '100%', padding: '0.7rem', fontSize: '15px', marginTop: '1rem', cursor: processing ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            {processing && <Spinner />}
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
