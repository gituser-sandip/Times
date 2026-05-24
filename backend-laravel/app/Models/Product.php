<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'name',
        'brand',
        'category',
        'price',
        'oldPrice',
        'rating',
        'image',
        'tag',
        'caseSize',
        'movement',
        'stock',
        'waterResistance',
        'warranty',
        'delivery',
    ];

    protected $casts = [
        'price' => 'float',
        'oldPrice' => 'float',
        'rating' => 'float',
        'stock' => 'integer',
    ];

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
