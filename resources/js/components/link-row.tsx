import { useLang } from '@/hooks/useLang';
import { CustomLink } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export default function LinkRow() {
    const { __ } = useLang('bbs');
    const { customLinks } = usePage().props as { customLinks: CustomLink[] };

    return (
        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
            <span>|</span>
            <Link href="/info" className="hover:text-foreground">
                {__('Info Page')}
            </Link>
            <span>|</span>
            <Link href="/archive" className="hover:text-foreground">
                {__('Archive')}
            </Link>
            <span>|</span>
            {customLinks?.map((link) => (
                <span key={link.id} className="flex items-center gap-2">
                    <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                    >
                        {link.name}
                    </a>
                    <span>|</span>
                </span>
            ))}
        </div>
    );
}
