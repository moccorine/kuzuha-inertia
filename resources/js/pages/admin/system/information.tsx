import { MarkdownEditor } from '@/components/markdown-editor';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Props {
    content: string;
}

export default function InformationPage({ content }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const { data, setData, post, processing } = useForm({
        content: content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/system/information', {
            onSuccess: () => setIsEditing(false),
        });
    };

    return (
        <AppLayout>
            <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Information Page</h1>
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? 'outline' : 'default'}
                    >
                        {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                </div>

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Markdown Content
                            </label>
                            <MarkdownEditor
                                value={data.content}
                                onChange={(value) => setData('content', value)}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setData('content', content);
                                    setIsEditing(false);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="rounded-lg border p-6">
                        {content ? (
                            <pre className="font-mono text-sm whitespace-pre-wrap">
                                {content}
                            </pre>
                        ) : (
                            <p className="text-muted-foreground">
                                No content yet. Click "Edit" to add content.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
