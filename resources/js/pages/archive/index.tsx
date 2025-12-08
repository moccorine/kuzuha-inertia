import PublicLayout from '@/layouts/public-layout';

export default function ArchivePage({ status, message }: { status: string; message: string }) {
    return (
        <PublicLayout title="Archive">
            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="rounded border border-dashed border-muted-foreground/50 bg-muted/20 p-6 text-center">
                    <p className="text-sm uppercase tracking-widest text-muted-foreground">{status}</p>
                    <h1 className="mt-2 text-2xl font-semibold">Archive Page</h1>
                    <p className="mt-4 text-muted-foreground">{message}</p>
                </div>
            </div>
        </PublicLayout>
    );
}
