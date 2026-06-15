<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'url',
        'title',
        'rating',
        'ratings_count',
        'reviews_count',
        'last_parsed_at',
        'status',
        'last_error'
    ];

    protected $casts = [
        'last_parsed_at' => 'datetime',
        'rating' => 'float',
    ];

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
