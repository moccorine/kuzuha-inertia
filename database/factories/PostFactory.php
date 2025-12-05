<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        $hasUrl = fake()->boolean(30);
        $hasAutoLink = fake()->boolean(50);

        $message = fake()->realText();
        if ($hasAutoLink && fake()->boolean(70)) {
            $message .= "\n\nCheck out ".fake()->url();
        }

        return [
            'username' => fake()->optional(0.7)->name(),
            'email' => fake()->optional()->email(),
            'title' => fake()->optional()->realText(10),
            'message' => $message,
            'metadata' => $hasUrl ? [
                'url' => fake()->url(),
                'auto_link' => $hasAutoLink,
            ] : null,
        ];
    }
}
