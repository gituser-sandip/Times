<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer.fullName' => ['required', 'string', 'max:160'],
            'customer.email' => ['required', 'email', 'max:180'],
            'customer.address' => ['required', 'string', 'max:240'],
            'customer.city' => ['required', 'string', 'max:120'],
            'customer.payment' => ['required', 'string', 'max:80'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ]);

        $order = DB::transaction(function () use ($validated, $request) {
            $total = 0;
            $lineItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);
                $quantity = min($item['quantity'], $product->stock);
                $total += $product->price * $quantity;
                $product->decrement('stock', $quantity);

                $lineItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'quantity' => $quantity,
                ];
            }

            return Order::create([
                'user_id' => optional($request->user())->id,
                'customer' => $validated['customer'],
                'items' => $lineItems,
                'total' => $total,
                'status' => 'confirmed',
            ]);
        });

        return response()->json(['order' => $order], 201);
    }
}
