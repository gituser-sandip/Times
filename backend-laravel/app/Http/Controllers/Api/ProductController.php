<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index()
    {
        return response()->json([
            'products' => Product::with('reviews')->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:180'],
            'brand' => ['required', 'string', 'max:120'],
            'category' => ['required', 'string', 'max:80'],
            'price' => ['required', 'numeric', 'min:0'],
            'oldPrice' => ['nullable', 'numeric', 'min:0'],
            'rating' => ['nullable', 'numeric', 'min:0', 'max:5'],
            'image' => ['nullable', 'string'],
            'tag' => ['nullable', 'string', 'max:80'],
            'caseSize' => ['nullable', 'string', 'max:80'],
            'movement' => ['nullable', 'string', 'max:120'],
            'stock' => ['required', 'integer', 'min:0'],
            'waterResistance' => ['nullable', 'string', 'max:80'],
            'warranty' => ['nullable', 'string', 'max:80'],
            'delivery' => ['nullable', 'string', 'max:120'],
        ]);

        $product = Product::create($validated);

        return response()->json(['product' => $product], 201);
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json(['message' => 'Product deleted.']);
    }
}
