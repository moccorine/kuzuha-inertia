<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('contact/index');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:200',
            'message' => 'required|string|max:5000',
            'captcha_answer' => 'required|numeric',
            'captcha_question' => 'required|string',
        ]);

        // Verify CAPTCHA
        $question = $validated['captcha_question'];
        $answer = (int) $validated['captcha_answer'];

        if (preg_match('/(\d+)\+(\d+)/', $question, $matches)) {
            $correctAnswer = (int) $matches[1] + (int) $matches[2];
            if ($answer !== $correctAnswer) {
                return back()->withErrors(['captcha_answer' => 'Incorrect answer.'])->withInput();
            }
        } else {
            return back()->withErrors(['captcha_answer' => 'Invalid question.'])->withInput();
        }

        // Send to Slack
        if ($webhookUrl = config('services.slack.contact_webhook_url')) {
            Http::post($webhookUrl, [
                'text' => '新しい問合せが届きました',
                'attachments' => [
                    [
                        'title' => '問合せ内容',
                        'fields' => [
                            [
                                'title' => '名前',
                                'value' => $validated['name'],
                                'short' => true,
                            ],
                            [
                                'title' => 'メール',
                                'value' => $validated['email'],
                                'short' => true,
                            ],
                            [
                                'title' => '件名',
                                'value' => $validated['subject'],
                                'short' => false,
                            ],
                            [
                                'title' => '本文',
                                'value' => $validated['message'],
                                'short' => false,
                            ],
                        ],
                    ],
                ],
            ]);
        }

        return redirect()->route('contact.thanks');
    }

    public function thanks()
    {
        return Inertia::render('contact/thanks');
    }
}
