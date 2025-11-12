import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';
import Markdown from 'react-markdown';

interface Props {
    content: string;
    appName: string;
}

export default function Information({ content, appName }: Props) {
    return (
        <GuestLayout>
            <Head title={`Information - ${appName}`} />
            <div style={{ padding: '1rem 0.5rem' }}>
                <div className="pagetitle" style={{ marginBottom: '1rem' }}>
                    <Link
                        href="/"
                        style={{ fontSize: '24px', fontWeight: 'bold' }}
                    >
                        {appName}
                    </Link>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <Link href="/">← Back to Home</Link>
                </div>

                <div
                    style={{ lineHeight: '1.6' }}
                    className="prose prose-invert max-w-none"
                >
                    <Markdown
                        components={{
                            h1: ({ children }) => (
                                <h1
                                    style={{
                                        fontSize: '2em',
                                        fontWeight: 'bold',
                                        marginTop: '1em',
                                        marginBottom: '0.5em',
                                    }}
                                >
                                    {children}
                                </h1>
                            ),
                            h2: ({ children }) => (
                                <h2
                                    style={{
                                        fontSize: '1.5em',
                                        fontWeight: 'bold',
                                        marginTop: '1em',
                                        marginBottom: '0.5em',
                                    }}
                                >
                                    {children}
                                </h2>
                            ),
                            h3: ({ children }) => (
                                <h3
                                    style={{
                                        fontSize: '1.25em',
                                        fontWeight: 'bold',
                                        marginTop: '0.8em',
                                        marginBottom: '0.4em',
                                    }}
                                >
                                    {children}
                                </h3>
                            ),
                            p: ({ children }) => (
                                <p style={{ marginBottom: '1em' }}>
                                    {children}
                                </p>
                            ),
                            ul: ({ children }) => (
                                <ul
                                    style={{
                                        marginLeft: '2em',
                                        marginBottom: '1em',
                                        listStyleType: 'disc',
                                    }}
                                >
                                    {children}
                                </ul>
                            ),
                            ol: ({ children }) => (
                                <ol
                                    style={{
                                        marginLeft: '2em',
                                        marginBottom: '1em',
                                        listStyleType: 'decimal',
                                    }}
                                >
                                    {children}
                                </ol>
                            ),
                            li: ({ children }) => (
                                <li style={{ marginBottom: '0.5em' }}>
                                    {children}
                                </li>
                            ),
                            strong: ({ children }) => (
                                <strong style={{ fontWeight: 'bold' }}>
                                    {children}
                                </strong>
                            ),
                            em: ({ children }) => (
                                <em style={{ fontStyle: 'italic' }}>
                                    {children}
                                </em>
                            ),
                            hr: () => (
                                <hr
                                    style={{
                                        margin: '2em 0',
                                        borderTop: '1px solid var(--theme-hr)',
                                    }}
                                />
                            ),
                        }}
                    >
                        {content}
                    </Markdown>
                </div>
            </div>
        </GuestLayout>
    );
}
