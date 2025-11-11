<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomLink extends Model
{
    protected $fillable = [
        'title',
        'url',
        'order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
