<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InformationPage extends Model
{
    protected $table = 'information_page';

    protected $fillable = [
        'url',
        'content',
    ];
}
