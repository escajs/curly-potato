import { router } from "@inertiajs/react";
import { useState } from "react";

export default function CartDrawer({ isOpen, onClose, cart }) {
    const [isProcessing, setIsProcessing] = useState(false);

    if (!isOpen) return null;

    const total = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

    // --- LOGIC: Handle Payment ---
    const handlePayment = () => {
        if (cart.length === 0 || isProcessing) return;

        router.post('/checkout/process', {}, {
            onBefore: () => {
                const proceed = confirm("Are you sure you want to proceed with the payment?");
                if (proceed) setIsProcessing(true);
                return proceed;
            },
            onSuccess: () => {
                onClose();
                alert("Payment successful!");
            },
            onError: (errors) => {
                alert(errors.message || "Payment failed. Please try again.");
            },
            onFinish: () => setIsProcessing(false),
            preserveScroll: true
        });
    };

    // --- LOGIC: Handle Quantity Updates ---
    const updateQty = (item, amount) => {
        // Prevent incrementing past stock
        if (amount > 0 && item.quantity + 1 > item.product.stock_quantity) {
            alert(`Only ${item.product.stock_quantity} available in stock for this product.`);
            return;
        }
        
        // Prevent decrementing below 1
        if (amount < 0 && item.quantity <= 1) return;

        router.patch(`/cart/${item.id}`, { amount }, { preserveScroll: true });
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
            
            {/* Drawer Content */}
            <div className="relative w-screen max-w-md bg-white dark:bg-slate-800 shadow-2xl flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-black dark:text-white uppercase">Cart ({cart.length})</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition">✕</button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <p>Your cart is empty</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className="flex gap-4 border-b dark:border-slate-700 pb-4">
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold dark:text-white leading-tight">{item.product.name}</h4>
                                    <div className="flex items-center gap-3 mt-3">
                                        <button 
                                            onClick={() => updateQty(item, -1)} 
                                            className="w-8 h-8 flex items-center justify-center border rounded-lg dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                        >-</button>
                                        <span className="font-bold dark:text-white">{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQty(item, 1)} 
                                            className="w-8 h-8 flex items-center justify-center border rounded-lg dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                                        >+</button>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-black dark:text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
                                    <button 
                                        onClick={() => router.delete(`/cart/${item.id}`, { preserveScroll: true })} 
                                        className="text-[10px] text-red-500 font-bold uppercase mt-2 hover:underline"
                                    >Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer / Total Section */}
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t dark:border-slate-700">
                    <div className="flex justify-between text-xl font-black dark:text-white mb-6">
                        <span>Total</span>
                        <span className="text-indigo-600">${total.toFixed(2)}</span>
                    </div>
                    
                    <button 
                        onClick={handlePayment}
                        disabled={cart.length === 0 || isProcessing}
                        className={`w-full py-4 text-white rounded-2xl font-bold uppercase tracking-widest text-sm transition active:scale-95 
                            ${isProcessing ? 'bg-slate-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} 
                            disabled:opacity-50`}
                    >
                        {isProcessing ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </span>
                        ) : "Pay Now"}
                    </button>
                </div>
            </div>
        </div>
    );
}