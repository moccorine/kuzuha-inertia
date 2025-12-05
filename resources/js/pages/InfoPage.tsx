import PublicLayout from '@/layouts/public-layout';
import ReactMarkdown from 'react-markdown';

export default function InfoPage({ content }: { content: string }) {
    return (
        <PublicLayout>
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <ReactMarkdown
                    components={{
                        h1: ({ children }) => (
                            <h1 className="mb-4 text-3xl font-bold">
                                {children}
                            </h1>
                        ),
                        h2: ({ children }) => (
                            <h2 className="mt-6 mb-3 text-2xl font-bold">
                                {children}
                            </h2>
                        ),
                        p: ({ children }) => <p className="mb-4">{children}</p>,
                        ul: ({ children }) => (
                            <ul className="mb-4 ml-6 list-disc">{children}</ul>
                        ),
                        ol: ({ children }) => (
                            <ol className="mb-4 ml-6 list-decimal">
                                {children}
                            </ol>
                        ),
                        li: ({ children }) => (
                            <li className="mb-1">{children}</li>
                        ),
                    }}
                >
                    {content}
                </ReactMarkdown>
            </div>
        </PublicLayout>
    );
}
