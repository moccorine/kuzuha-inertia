import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Spinner } from '@/components/ui/spinner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import GuestLayout from '@/layouts/guest-layout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Contact() {
    const num1 = useMemo(() => Math.floor(Math.random() * 10) + 1, []);
    const num2 = useMemo(() => Math.floor(Math.random() * 10) + 1, []);
    
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        captcha_answer: '',
        captcha_question: `${num1}+${num2}`,
    });

    const [showPreview, setShowPreview] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowPreview(true);
    };

    const confirmSubmit = () => {
        console.log('Sending data:', data);
        setShowPreview(false);
        post('/contact', {
            onError: (errors) => {
                console.log('Validation errors:', errors);
            }
        });
    };

    return (
        <GuestLayout>
            <Head title="Contact" />

            <div style={{ maxWidth: '700px', margin: '2rem auto', padding: '0 1rem' }}>
                <h1 style={{ fontSize: '24px', marginBottom: '1rem' }}>Contact</h1>

                {Object.keys(errors).length > 0 && (
                    <div style={{ 
                        padding: '1rem', 
                        marginBottom: '1rem', 
                        backgroundColor: '#fee', 
                        border: '1px solid #fcc',
                        borderRadius: '4px'
                    }}>
                        <strong style={{ color: '#c00' }}>Please fix the following errors:</strong>
                        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                            {Object.entries(errors).map(([key, message]) => (
                                <li key={key} style={{ color: '#c00' }}>{message}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Honeypot fields */}
                    <input type="text" name="my_name" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />
                    <input type="text" name="my_time" value={Date.now()} style={{ display: 'none' }} tabIndex={-1} autoComplete="off" readOnly />

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Name <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            maxLength={100}
                            required
                        />
                        {errors.name && <div style={{ color: 'red', fontSize: '13px', marginTop: '0.3rem' }}>{errors.name}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Email <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            maxLength={255}
                            required
                        />
                        {errors.email && <div style={{ color: 'red', fontSize: '13px', marginTop: '0.3rem' }}>{errors.email}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Subject <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            value={data.subject}
                            onChange={(e) => setData('subject', e.target.value)}
                            maxLength={200}
                            required
                        />
                        {errors.subject && <div style={{ color: 'red', fontSize: '13px', marginTop: '0.3rem' }}>{errors.subject}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Message <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Textarea
                            rows={10}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            maxLength={5000}
                            required
                        />
                        {errors.message && <div style={{ color: 'red', fontSize: '13px', marginTop: '0.3rem' }}>{errors.message}</div>}
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            What is {num1} + {num2}? <span style={{ color: 'red' }}>*</span>
                        </label>
                        <Input
                            type="text"
                            value={data.captcha_answer}
                            onChange={(e) => setData('captcha_answer', e.target.value)}
                            maxLength={3}
                            required
                            style={{ width: '100px' }}
                        />
                        {errors.captcha_answer && <div style={{ color: 'red', fontSize: '13px', marginTop: '0.3rem' }}>{errors.captcha_answer}</div>}
                    </div>

                    <Button type="submit" disabled={processing}>
                        Preview
                    </Button>
                </form>

                <Dialog open={showPreview} onOpenChange={setShowPreview}>
                    <DialogContent className="bg-[var(--theme-background)] border-[var(--theme-hr)]">
                        <DialogHeader>
                            <DialogTitle>Confirm Submission</DialogTitle>
                            <DialogDescription>
                                Please review your message before sending.
                            </DialogDescription>
                        </DialogHeader>
                        <div style={{ fontSize: '14px' }}>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Name:</strong> {data.name}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Email:</strong> {data.email}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Subject:</strong> {data.subject}
                            </div>
                            <div style={{ marginBottom: '1rem' }}>
                                <strong>Message:</strong>
                                <div style={{ whiteSpace: 'pre-wrap', marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(0,0,0,0.05)', borderRadius: '4px' }}>
                                    {data.message}
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setShowPreview(false)}>
                                Cancel
                            </Button>
                            <Button onClick={confirmSubmit} disabled={processing}>
                                {processing && <Spinner className="mr-1" />}
                                Send
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </GuestLayout>
    );
}
