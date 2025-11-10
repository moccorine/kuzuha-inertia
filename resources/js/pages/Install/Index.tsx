import { store } from '@/routes/install';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Index() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(store.url());
    };

    return (
        <>
            <Head title="Initial Setup" />
            <div
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                }}
            >
                <div
                    style={{
                        background: 'rgba(0, 64, 64, 0.8)',
                        border: '2px solid #c0c0c0',
                        borderRadius: '4px',
                        padding: '2rem',
                        maxWidth: '500px',
                        width: '100%',
                    }}
                >
                    <div
                        className="pagetitle"
                        style={{ marginBottom: '0.5rem' }}
                    >
                        Initial Setup
                    </div>
                    <div
                        style={{
                            fontSize: '14px',
                            color: '#ccc',
                            marginBottom: '1.5rem',
                        }}
                    >
                        Please set the administrator password
                    </div>

                    <form onSubmit={submit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label
                                htmlFor="password"
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    marginBottom: '0.3rem',
                                }}
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    fontSize: '14px',
                                }}
                            />
                            {errors.password && (
                                <div
                                    className="error"
                                    style={{
                                        fontSize: '13px',
                                        marginTop: '0.3rem',
                                    }}
                                >
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <label
                                htmlFor="password_confirmation"
                                style={{
                                    display: 'block',
                                    fontSize: '14px',
                                    marginBottom: '0.3rem',
                                }}
                            >
                                Password (Confirm)
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData(
                                        'password_confirmation',
                                        e.target.value,
                                    )
                                }
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.5rem',
                                    fontSize: '14px',
                                }}
                            />
                            {errors.password_confirmation && (
                                <div
                                    className="error"
                                    style={{
                                        fontSize: '13px',
                                        marginTop: '0.3rem',
                                    }}
                                >
                                    {errors.password_confirmation}
                                </div>
                            )}
                        </div>

                        <input
                            type="submit"
                            value="Complete Setup"
                            disabled={processing}
                            style={{
                                width: '100%',
                                padding: '0.7rem',
                                fontSize: '15px',
                                marginTop: '1rem',
                                cursor: processing ? 'not-allowed' : 'pointer',
                            }}
                        />
                    </form>
                </div>
            </div>
        </>
    );
}
