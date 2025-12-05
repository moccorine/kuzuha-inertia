import { useLang } from '@/hooks/useLang';
import { CustomLink } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function LinkRow() {
    const { __ } = useLang('bbs');
    const { customLinks } = usePage().props as { customLinks: CustomLink[] };

    return (
        <div className="text-sm text-muted-foreground">
            |{' '}
            <Link href="/info" className="hover:text-foreground">
                {__('Info Page')}
            </Link>{' '}
            |
            {customLinks?.map((link) => (
                <>
                    {' '}
                    <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                    >
                        {link.name}
                    </a>{' '}
                    |
                </>
            ))}
        </div>
    );
}
