import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDateFormat } from '@/hooks/use-date-format';
import { useLang } from '@/hooks/useLang';
import AppLayout from '@/layouts/app-layout';
import { index as infoManagementRoute } from '@/routes/admin/info';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { type FormEvent, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

type InfoManagementProps = {
    content: string;
    defaultContent: string;
    lastUpdated: string | null;
};

export default function InfoManagementPage({
    content,
    defaultContent,
    lastUpdated,
}: InfoManagementProps) {
    const { __ } = useLang();
    const { formatDate } = useDateFormat();
    const [isEditMode, setIsEditMode] = useState(false);
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: __('Info Page Management'),
            href: infoManagementRoute().url,
        },
    ];
    const initialContent = content?.length ? content : defaultContent;
    const form = useForm({
        content: initialContent,
    });
    const { setData } = form;

    useEffect(() => {
        setData('content', initialContent);
    }, [initialContent, setData]);

    const formattedUpdatedAt =
        lastUpdated && lastUpdated.length ? formatDate(lastUpdated) : undefined;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.put(infoManagementRoute().url, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditMode(false);
            },
        });
    };

    const handleLoadTemplate = () => {
        setData('content', defaultContent);
    };

    const handleEdit = () => {
        setIsEditMode(true);
    };

    const handleCancel = () => {
        setData('content', initialContent);
        setIsEditMode(false);
    };

    if (!isEditMode) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={__('Info Page Management')} />
                <div className="px-6 md:px-4">
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div>
                                    <CardTitle>{__('Info Page')}</CardTitle>
                                    <CardDescription>
                                        {__(
                                            'Preview of the public info page content.',
                                        )}
                                    </CardDescription>
                                    {formattedUpdatedAt && (
                                        <p className="mt-2 text-xs text-muted-foreground">
                                            {__('Last updated at {date}', {
                                                date: formattedUpdatedAt,
                                            })}
                                        </p>
                                    )}
                                </div>
                                <Button onClick={handleEdit}>
                                    {__('Edit')}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none">
                                {form.data.content.trim().length ? (
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
                                            p: ({ children }) => (
                                                <p className="mb-4">{children}</p>
                                            ),
                                            ul: ({ children }) => (
                                                <ul className="mb-4 ml-6 list-disc">
                                                    {children}
                                                </ul>
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
                                        {form.data.content}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        {__(
                                            'The info page is currently empty. Click Edit to add content.',
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={__('Info Page Management')} />
            <div className="grid gap-6 lg:grid-cols-2 px-6 md:px-4">
                <Card>
                    <CardContent>
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="content">{__('Content')}</Label>
                                <Textarea
                                    id="content"
                                    value={form.data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    placeholder={__('Start typing...')}
                                    className="min-h-[500px] font-mono text-sm"
                                />
                                <InputError
                                    message={form.errors.content}
                                    className="text-sm"
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleLoadTemplate}
                                >
                                    {__('Load template')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleCancel}
                                >
                                    {__('Cancel')}
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.processing}
                                >
                                    {__('Save')}
                                </Button>
                                {form.recentlySuccessful && (
                                    <span className="text-sm text-emerald-600">
                                        {__('Saved')}
                                    </span>
                                )}
                            </div>
                            {formattedUpdatedAt && (
                                <p className="text-xs text-muted-foreground">
                                    {__('Last updated at {date}', {
                                        date: formattedUpdatedAt,
                                    })}
                                </p>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden">
                    <CardContent>
                        <div className="max-h-[70vh] overflow-auto rounded-lg border border-dashed border-sidebar-border/60 p-4">
                            {form.data.content.trim().length ? (
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
                                        p: ({ children }) => (
                                            <p className="mb-4">{children}</p>
                                        ),
                                        ul: ({ children }) => (
                                            <ul className="mb-4 ml-6 list-disc">
                                                {children}
                                            </ul>
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
                                    {form.data.content}
                                </ReactMarkdown>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    {__(
                                        'The info page is currently empty. Load the template to get started.',
                                    )}
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
