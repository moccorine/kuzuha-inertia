import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';
import { logout } from '@/routes';
import { send } from '@/routes/verification';
import { Form, Head } from '@inertiajs/react';

interface VerifyEmailProps {
    status?: string;
}

export default function VerifyEmail({ status }: VerifyEmailProps) {
    const { t } = useTranslation();

    return (
        <AuthLayout
            title={t('auth.verify_email.title')}
            description={t('auth.verify_email.description')}
        >
            <Head title={t('auth.verify_email.title')} />

            <div className="flex flex-col gap-6">
                <Form {...send.form()}>
                    {({ processing }) => (
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            {t('auth.verify_email.resend')}
                        </Button>
                    )}
                </Form>

                <Form {...logout.form()}>
                    {({ processing }) => (
                        <Button
                            type="submit"
                            variant="outline"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing && <Spinner />}
                            {t('auth.verify_email.logout')}
                        </Button>
                    )}
                </Form>
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    A new verification link has been sent to your email address.
                </div>
            )}
        </AuthLayout>
    );
}
