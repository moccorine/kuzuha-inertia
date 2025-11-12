import GuestLayout from '@/layouts/guest-layout';
import { Head, Link } from '@inertiajs/react';

export default function Thanks() {
    return (
        <GuestLayout>
            <Head title="Thank you for contacting us" />

            <div
                style={{
                    maxWidth: '700px',
                    margin: '2rem auto',
                    padding: '0 1rem',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>
                    Thank you for contacting us
                </h1>

                <p style={{ marginBottom: '2rem' }}>
                    We have received your message.
                    <br />
                    We will get back to you as soon as possible.
                </p>

                <Link href="/">
                    <button type="button">Back to BBS</button>
                </Link>
            </div>
        </GuestLayout>
    );
}
