<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Times Watch Store Laravel API is running successfully!',
        'status' => 'connected',
        'endpoints' => [
            'get_products' => '/api/products',
            'post_reviews' => '/api/products/{id}/reviews',
            'post_orders' => '/api/orders',
            'health_check' => '/up'
        ]
    ]);
});
