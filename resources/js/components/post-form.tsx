import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/useLang';
import { store } from '@/routes/posts';
import { Form } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import LinkRow from './link-row';

export default function PostForm() {
    const { __ } = useLang('bbs');
    const [isLinkRowOpen, setIsLinkRowOpen] = useState(() => {
        const saved = localStorage.getItem('linkRowOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [autoLink, setAutoLink] = useState(() => {
        const saved = localStorage.getItem('autoLink');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('linkRowOpen', JSON.stringify(isLinkRowOpen));
    }, [isLinkRowOpen]);

    useEffect(() => {
        localStorage.setItem('autoLink', JSON.stringify(autoLink));
    }, [autoLink]);

    return (
        <Form action={store()} resetOnSuccess className="space-y-3">
            {({ processing }) => (
                <>
                    <div className="flex items-center gap-2">
                        <span className="w-20">{__('Author')}</span>
                        <Input type="text" name="username" className="w-48" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20">{__('Mail')}</span>
                        <Input type="email" name="email" className="w-64" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20">{__('Subject')}</span>
                        <Input type="text" name="title" className="flex-1" />
                        <Button type="submit" disabled={processing}>
                            {__('Post')}
                        </Button>
                        <Button type="reset" variant="outline">
                            {__('Clear')}
                        </Button>
                    </div>
                    <div>
                        <div className="mb-1 text-sm">{__('Content note')}</div>
                        <Textarea name="message" rows={5} maxLength={350} />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20">URL</span>
                        <Input
                            type="url"
                            name="url"
                            className="flex-1"
                            placeholder="https://example.com"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <label className="flex cursor-pointer items-center gap-2">
                            <Checkbox
                                name="auto_link"
                                value="1"
                                checked={autoLink}
                                onCheckedChange={(checked) =>
                                    setAutoLink(!!checked)
                                }
                            />
                            <span className="text-sm">
                                {__('Auto-link URLs')}
                            </span>
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsLinkRowOpen(!isLinkRowOpen)}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                        >
                            {isLinkRowOpen ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                            {isLinkRowOpen
                                ? __('Link Row OFF')
                                : __('Link Row ON')}
                        </button>
                    </div>
                    {isLinkRowOpen && (
                        <>
                            <hr />
                            <LinkRow />
                            <hr />
                        </>
                    )}
                </>
            )}
        </Form>
    );
}
