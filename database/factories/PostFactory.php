<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PostFactory extends Factory
{
    public function definition(): array
    {
        return [
            'username' => fake()->optional(0.7)->name(),
            'email' => fake()->optional()->email(),
            'title' => fake()->optional()->realText(10),
            'message' => fake()->realText(),
        ];
    }
}
