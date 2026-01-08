<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use DB;
use App\Jobs\SendLowStockEmail;

class CartController extends Controller
{
    public function store(Request $request)
    {
        $product = Product::findOrFail($request->product_id);

        // Stock check
        $existing = Cart::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->where('status', 'pending')
            ->first();

        $currentQty = $existing ? $existing->quantity : 0;
        
        if ($product->stock_quantity < ($currentQty + $request->quantity)) {
            return back()->withErrors(['message' => 'Not enough stock.']);
        }

        Cart::updateOrCreate(
            ['user_id' => auth()->id(), 'product_id' => $product->id, 'status' => 'pending'],
            ['quantity' => \DB::raw("quantity + {$request->quantity}")]
        );

        return back(); // Triggers Inertia prop refresh
    }

    public function update(Request $request, Cart $cart)
    {
        $newQty = $cart->quantity + (int)$request->amount;

        if ($newQty > $cart->product->stock_quantity) {
            return back()->withErrors(['message' => 'Stock limit reached.']);
        }

        if ($newQty <= 0) {
            $cart->delete();
        } else {
            $cart->update(['quantity' => $newQty]);
        }

        return back(); // Triggers Inertia prop refresh
    }

    public function destroy(Cart $cart)
    {
        $cart->delete();
        return back();
    }

public function processCheckout()
{
    $user = auth()->user();
    
    $cartItems = Cart::where('user_id', $user->id)
        ->where('status', 'pending')
        ->with('product')
        ->get();

    if ($cartItems->isEmpty()) {
        return back()->withErrors(['message' => 'Your cart is empty.']);
    }

    try {
        DB::transaction(function () use ($cartItems) {
            foreach ($cartItems as $item) {
                $product = $item->product;

                if ($product->stock_quantity < $item->quantity) {
                    throw new \Exception("Not enough stock for {$product->name}");
                }

                // 2. Subtract from Product Stock
                $product->decrement('stock_quantity', $item->quantity);

                // 3. Update Cart Status to Paid
                $item->update(['status' => 'paid']);

                // 4. LOW STOCK CHECK
                // Get fresh data from DB to check the new stock level
                $updatedProduct = $product->fresh();
                if ($updatedProduct->stock_quantity <= 5) {
                    // Dispatch the job to the queue
                    SendLowStockEmail::dispatch($updatedProduct);
                }
            }
        });

        return back()->with('success', 'Purchase successful!');
        
    } catch (\Exception $e) {
        return back()->withErrors(['message' => $e->getMessage()]);
    }
}

}