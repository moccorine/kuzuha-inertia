<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpamLog extends Model
{
    protected $fillable = [
        'ip_address',
        'user_agent',
        'url',
        'method',
        'input',
    ];

    protected $casts = [
        'input' => 'array',
    ];
}
