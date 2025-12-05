import { useLang } from '@/hooks/useLang';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function ExecutionTime() {
    const { executionTime, version, repository } = usePage<{
        props: SharedData;
    }>().props;
    const { __ } = useLang();

    if (!executionTime) return null;

    const seconds = (executionTime / 1000).toFixed(6);

    return (
        <div className="space-y-1 px-4 py-2 text-xs text-muted-foreground">
            <div className="text-right">
                <a
                    href={repository}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                >
                    kuzuha-inertia {version}
                </a>
            </div>
            <div className="text-left">
                {__('Execution time')} : {seconds}
                {__('seconds')}
            </div>
        </div>
    );
}
