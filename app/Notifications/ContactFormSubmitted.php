<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\SlackMessage;

class ContactFormSubmitted extends Notification
{
    use Queueable;

    public function __construct(
        public string $name,
        public string $email,
        public string $subject,
        public string $message
    ) {}

    public function via(object $notifiable): array
    {
        return ['slack'];
    }

    public function toSlack(object $notifiable): SlackMessage
    {
        return (new SlackMessage)
            ->content('新しい問合せが届きました')
            ->attachment(function ($attachment) {
                $attachment->title('問合せ内容')
                    ->fields([
                        '名前' => $this->name,
                        'メール' => $this->email,
                        '件名' => $this->subject,
                        '本文' => $this->message,
                    ]);
            });
    }
}
