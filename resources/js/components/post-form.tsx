import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLang } from '@/hooks/useLang';
import { index, store } from '@/routes/posts';
import { Form } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import LinkRow from './link-row';

interface PostFormProps {
    defaultTitle?: string;
    defaultMessage?: string;
    followId?: number;
    hideLinks?: boolean;
    counter?: number | null;
    counterStartDate?: string | null;
    activeVisitors?: number | null;
    activeVisitorTimeout?: number | null;
    unreadCount?: number;
    lastViewedId?: number;
}

export default function PostForm({
    defaultTitle = '',
    defaultMessage = '',
    followId,
    hideLinks = false,
    counter,
    counterStartDate,
    activeVisitors,
    activeVisitorTimeout,
    unreadCount = 0,
    lastViewedId = 0,
}: PostFormProps = {}) {
    const { __ } = useLang('bbs');
    const formRef = useRef<HTMLFormElement>(null);
    const skipResetRef = useRef(false);
    const getStoredBoolean = (key: string, fallback: boolean) => {
        if (typeof window === 'undefined') {
            return fallback;
        }

        const saved = localStorage.getItem(key);

        return saved !== null ? JSON.parse(saved) : fallback;
    };
    const getStoredNumber = (key: string, fallback: number) => {
        if (typeof window === 'undefined') {
            return fallback;
        }

        const saved = localStorage.getItem(key);

        return saved !== null ? parseInt(saved) : fallback;
    };
    const getStoredString = (key: string, fallback = '') => {
        if (typeof window === 'undefined') {
            return fallback;
        }

        return localStorage.getItem(key) ?? fallback;
    };

    const identifier = followId ? `postForm.follow.${followId}` : 'postForm';
    const [isLinkRowOpen, setIsLinkRowOpen] = useState(true);
    const [autoLink, setAutoLink] = useState(true);
    const [perPage, setPerPage] = useState(10);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        setIsLinkRowOpen(getStoredBoolean('linkRowOpen', true));
        setAutoLink(getStoredBoolean('postForm.autoLink', true));
        setPerPage(getStoredNumber('perPage', 10));
        setUsername(getStoredString(`${identifier}.username`));
        setEmail(getStoredString(`${identifier}.email`));
        setHydrated(true);
    }, [identifier]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        localStorage.setItem('linkRowOpen', JSON.stringify(isLinkRowOpen));
    }, [isLinkRowOpen, hydrated]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        localStorage.setItem('postForm.autoLink', JSON.stringify(autoLink));
    }, [autoLink, hydrated]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        localStorage.setItem('perPage', perPage.toString());
    }, [perPage, hydrated]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        if (username) {
            localStorage.setItem(`${identifier}.username`, username);
        } else {
            localStorage.removeItem(`${identifier}.username`);
        }
    }, [username, identifier, hydrated]);

    useEffect(() => {
        if (!hydrated) {
            return;
        }
        if (email) {
            localStorage.setItem(`${identifier}.email`, email);
        } else {
            localStorage.removeItem(`${identifier}.email`);
        }
    }, [email, identifier, hydrated]);

    const handleFormReset = () => {
        if (skipResetRef.current) {
            skipResetRef.current = false;
            return;
        }

        setIsLinkRowOpen(getStoredBoolean('linkRowOpen', true));
        setAutoLink(getStoredBoolean('postForm.autoLink', true));
        setPerPage(getStoredNumber('perPage', 10));
        setUsername(getStoredString(`${identifier}.username`));
        setEmail(getStoredString(`${identifier}.email`));
    };

    const handleClear = () => {
        skipResetRef.current = true;
        formRef.current?.reset();
        setUsername('');
        setEmail('');
        setAutoLink(true);
    };

    return (
        <Form
            action={store()}
            resetOnSuccess
            className="space-y-3"
            ref={formRef}
            onReset={handleFormReset}
        >
            {({ processing }) => (
                <>
                    {followId && (
                        <input
                            type="hidden"
                            name="follow_id"
                            value={followId}
                        />
                    )}
                    <div className="flex items-center gap-2">
                        <span className="w-20">{__('Author')}</span>
                        <Input
                            type="text"
                            name="username"
                            className="w-48"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20">{__('Mail')}</span>
                        <Input
                            type="email"
                            name="email"
                            className="w-64"
                            placeholder="mail@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20">{__('Subject')}</span>
                        <Input
                            type="text"
                            name="title"
                            className="flex-1"
                            defaultValue={defaultTitle}
                        />
                        <Button type="submit" disabled={processing}>
                            {__('Post')}
                        </Button>
                        {!followId && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    window.location.href = index.url({
                                        query: {
                                            readnew: 'true',
                                            per_page: perPage.toString(),
                                            last_id: lastViewedId.toString(),
                                        },
                                    });
                                }}
                            >
                                {__('Unread')}
                            </Button>
                        )}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClear}
                        >
                            {__('Clear')}
                        </Button>
                    </div>
                    <div>
                        <div className="mb-1 text-sm">{__('Content note')}</div>
                        <Textarea
                            name="message"
                            rows={5}
                            maxLength={350}
                            defaultValue={defaultMessage}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-20">URL</span>
                        <Input
                            type="url"
                            name="url"
                            className="flex-1"
                            placeholder="http://"
                        />
                    </div>
                    {!hideLinks && (
                        <>
                            <input
                                type="hidden"
                                name="auto_link"
                                value={autoLink ? '1' : '0'}
                                key={
                                    autoLink ? 'auto-link-on' : 'auto-link-off'
                                }
                            />
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                        {__('Display count')}
                                    </span>
                                    <Input
                                        type="number"
                                        name="per_page"
                                        value={perPage}
                                        onChange={(e) =>
                                            setPerPage(
                                                parseInt(e.target.value) || 10,
                                            )
                                        }
                                        className="w-16"
                                        min={1}
                                    />
                                </div>
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
                                    onClick={() =>
                                        setIsLinkRowOpen(!isLinkRowOpen)
                                    }
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
                            {isLinkRowOpen ? (
                                <>
                                    {counter !== null &&
                                        counter !== undefined &&
                                        counterStartDate && (
                                            <div className="text-sm text-gray-600">
                                                {__('Counter format')
                                                    .replace(
                                                        ':date',
                                                        (() => {
                                                            const d = new Date(
                                                                counterStartDate,
                                                            );
                                                            return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
                                                        })(),
                                                    )
                                                    .replace(
                                                        ':count',
                                                        counter.toLocaleString(),
                                                    )
                                                    .replace(':level', '∞')}
                                                {activeVisitors !== null &&
                                                    activeVisitors !==
                                                        undefined &&
                                                    activeVisitorTimeout !==
                                                        null &&
                                                    activeVisitorTimeout !==
                                                        undefined &&
                                                    `　${__('Active visitors')
                                                        .replace(
                                                            ':count',
                                                            activeVisitors.toString(),
                                                        )
                                                        .replace(
                                                            ':timeout',
                                                            activeVisitorTimeout.toString(),
                                                        )}`}
                                            </div>
                                        )}
                                    <hr />
                                    <LinkRow />
                                    <hr />
                                    <div className="text-xs text-gray-600">
                                        {__('Button legend')}
                                    </div>
                                    <hr />
                                </>
                            ) : (
                                <>
                                    {counter !== null &&
                                        counter !== undefined &&
                                        counterStartDate && (
                                            <div className="text-sm text-gray-600">
                                                {__('Counter format')
                                                    .replace(
                                                        ':date',
                                                        (() => {
                                                            const d = new Date(
                                                                counterStartDate,
                                                            );
                                                            return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
                                                        })(),
                                                    )
                                                    .replace(
                                                        ':count',
                                                        counter.toLocaleString(),
                                                    )
                                                    .replace(':level', '∞')}
                                                {activeVisitors !== null &&
                                                    activeVisitors !==
                                                        undefined &&
                                                    activeVisitorTimeout !==
                                                        null &&
                                                    activeVisitorTimeout !==
                                                        undefined &&
                                                    `　${__('Active visitors')
                                                        .replace(
                                                            ':count',
                                                            activeVisitors.toString(),
                                                        )
                                                        .replace(
                                                            ':timeout',
                                                            activeVisitorTimeout.toString(),
                                                        )}`}
                                            </div>
                                        )}
                                    <hr />
                                    <div className="text-xs text-gray-600">
                                        {__('Button legend')}
                                    </div>
                                    <hr />
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </Form>
    );
}
