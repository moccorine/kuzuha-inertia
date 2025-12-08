<?php

namespace App\Services;

class TripcodeService
{
    /**
     * @return array{name: string|null, trip: string|null}
     */
    public function resolve(?string $username): array
    {
        if ($username === null) {
            return ['name' => null, 'trip' => null];
        }

        if (! str_contains($username, '#')) {
            return ['name' => trim($username) !== '' ? $username : null, 'trip' => null];
        }

        [$name, $secret] = explode('#', $username, 2);
        $name = trim($name);
        $secret = trim($secret);

        if ($secret === '') {
            return ['name' => $name !== '' ? $name : null, 'trip' => null];
        }

        $hash = hash_hmac('sha256', $secret, config('app.key'));
        $trip = substr($hash, 0, 10);

        return [
            'name' => $name !== '' ? $name : null,
            'trip' => $trip,
        ];
    }
}
