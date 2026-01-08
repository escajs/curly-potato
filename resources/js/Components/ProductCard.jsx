import { useState } from "react";

export default function ProductCard({ product, onAdd }) {
    const [qty, setQty] = useState(1);

    // --- LOGIC: Validate stock before incrementing ---
    const handleIncrement = () => {
        if (qty >= product.stock_quantity) {
            alert(`Sorry, we only have ${product.stock_quantity} units of this product.`);
            return;
        }
        setQty(qty + 1);
    };

    const handleDecrement = () => {
        setQty(Math.max(1, qty - 1));
    };

    return (
        <div className="group bg-white dark:bg-slate-800 p-3 rounded-[2rem] shadow-sm hover:shadow-xl transition-all ring-1 ring-slate-100 dark:ring-slate-700">
            {/* Product Image Placeholder */}
            <div className="aspect-square w-full rounded-[1.5rem] bg-slate-100 dark:bg-slate-700 mb-4 flex items-center justify-center text-slate-300 font-bold text-2xl">
                {product.name.charAt(0)}
            </div>

            <div className="px-2 pb-2">
                <h4 className="font-bold text-slate-900 dark:text-white truncate">{product.name}</h4>
                
                <div className="flex justify-between items-center mt-1">
                    <p className="text-indigo-600 font-black">${product.price}</p>
                    <span className={`text-[10px] font-bold uppercase ${product.stock_quantity < 5 ? 'text-red-500' : 'text-slate-400'}`}>
                        Stock: {product.stock_quantity}
                    </span>
                </div>

                <div className="mt-4 flex items-center gap-2">
                    {/* Quantity Selector */}
                    <div className="flex items-center border dark:border-slate-600 rounded-xl px-2 bg-slate-50 dark:bg-slate-700">
                        <button 
                            onClick={handleDecrement} 
                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition"
                        >
                            -
                        </button>
                        
                        <input 
                            readOnly 
                            value={qty} 
                            className="w-8 text-center bg-transparent text-sm font-bold dark:text-white outline-none" 
                        />
                        
                        <button 
                            onClick={handleIncrement} 
                            className="p-1 text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition"
                        >
                            +
                        </button>
                    </div>

                    {/* Add to Cart Button */}
                    <button 
                        onClick={() => { onAdd(product, qty); setQty(1); }}
                        disabled={product.stock_quantity === 0}
                        className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold uppercase hover:bg-indigo-700 active:scale-95 transition-all disabled:bg-slate-300 dark:disabled:bg-slate-700"
                    >
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
}