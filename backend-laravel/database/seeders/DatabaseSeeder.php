<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'demo@times.test'],
            [
                'name' => 'Times Demo',
                'password' => Hash::make('password'),
            ],
        );

        $products = [
            [
                'name' => 'Rolex GMT Master II',
                'brand' => 'Rolex',
                'category' => 'Men',
                'price' => 31000,
                'oldPrice' => 34500,
                'rating' => 4.9,
                'image' => '/images/GMT MASTER II.png',
                'tag' => 'Best Seller',
                'caseSize' => '40 mm',
                'movement' => 'Automatic',
                'stock' => 6,
                'waterResistance' => '100 m',
                'warranty' => '24 months',
                'delivery' => '2-4 business days',
            ],
            [
                'name' => 'Patek Philippe Aquanaut',
                'brand' => 'Patek Philippe',
                'category' => 'Men',
                'price' => 15400,
                'oldPrice' => 16850,
                'rating' => 4.8,
                'image' => '/pages/product/images/patek-philipe/aquanaut.webp',
                'tag' => 'Collector Pick',
                'caseSize' => '41 mm',
                'movement' => 'Automatic',
                'stock' => 4,
                'waterResistance' => '120 m',
                'warranty' => '18 months',
                'delivery' => '3-5 business days',
            ],
            [
                'name' => 'Cartier Crash',
                'brand' => 'Cartier',
                'category' => 'Women',
                'price' => 21000,
                'oldPrice' => 23900,
                'rating' => 4.7,
                'image' => '/pages/product/images/cartier/crash.webp',
                'tag' => 'Rare',
                'caseSize' => '38 mm',
                'movement' => 'Manual',
                'stock' => 2,
                'waterResistance' => '30 m',
                'warranty' => '12 months',
                'delivery' => '2-4 business days',
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(['name' => $product['name']], $product);
        }

        Product::first()->reviews()->firstOrCreate([
            'name' => 'Aarav',
            'rating' => 5,
            'text' => 'Arrived beautifully packed and exactly as described.',
        ]);
    }
}
