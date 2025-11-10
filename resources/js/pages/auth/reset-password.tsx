import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthLayout from '@/layouts/auth-layout';
import { useTranslation } from '@/lib/i18n';
import { update } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { t } = useTranslation();

    return (
        <AuthLayout title={t('auth.reset_password.title')}>
            <Head title={t('auth.reset_password.title')} />

            <Form
                {...update.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <input type="hidden" name="token" value={token} />
                        <input type="hidden" name="email" value={email} />

                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email">
                                    {t('auth.reset_password.email')}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    defaultValue={email}
                                    required
                                    autoFocus
                                    autoComplete="email"
                                    readOnly
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password">
                                    {t('auth.reset_password.password')}
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation">
                                    {t(
                                        'auth.reset_password.password_confirmation',
                                    )}
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing && <Spinner />}
                                {t('auth.reset_password.submit')}
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
