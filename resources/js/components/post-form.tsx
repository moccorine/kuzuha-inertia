import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/useLang';
import { store } from '@/routes/posts';
import { Form } from '@inertiajs/react';

export default function PostForm() {
    const { __ } = useLang('bbs');

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
                                defaultChecked
                            />
                            <span className="text-sm">
                                {__('Auto-link URLs')}
                            </span>
                        </label>
                    </div>
                </>
            )}
        </Form>
    );
}
