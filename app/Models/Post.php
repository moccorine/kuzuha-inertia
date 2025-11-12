<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'user_id',
        'thread_id',
        'parent_id',
        'username',
        'tripcode',
        'email',
        'title',
        'body',
        'ip_address',
        'user_agent',
        'protect_code',
        'undo_token',
        'latitude',
        'longitude',
        'location_name',
    ];

    public function thread(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'thread_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'parent_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(Post::class, 'parent_id');
    }

    public function threadPosts(): HasMany
    {
        return $this->hasMany(Post::class, 'thread_id');
    }
}
