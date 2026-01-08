<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Models\Product;

use Illuminate\Http\Request;
use Inertia\Inertia;



/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/



Route::get('/', function (Request $request) {
    // 1. Query the database instead of using a static array
    $products = Product::query()
        // 2. Real-time search logic using Eloquent
        ->when($request->input('search'), function ($query, $search) {
            $query->where('name', 'like', "%{$search}%");
        })
        // 3. Optional: Only show products that have stock (or show all)
        // ->where('stock_quantity', '>', 0) 
        ->latest()
        ->get();

    // 4. Return the Inertia view with the real database results
    return Inertia::render('Home', [
        'products' => $products,
        'filters' => $request->only(['search'])
    ]);
});

Route::middleware(['auth'])->group(function () {
    // Add item to cart (or increment quantity if exists)
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');

    // Update quantity (increment/decrement)
    // We use PATCH because we are partially updating the cart row
    Route::patch('/cart/{cart}', [CartController::class, 'update'])->name('cart.update');

    // Remove a single item from the cart
    Route::delete('/cart/{cart}', [CartController::class, 'destroy'])->name('cart.destroy');

    Route::post('/checkout/process', [CartController::class, 'processCheckout'])->name('checkout.process');
});

