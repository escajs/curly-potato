import { useForm, Head, usePage, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Header from "@/Components/Header";
import CartDrawer from "@/Components/CartDrawer";

export default function Login() {
    const { auth, cart = [] } = usePage().props;
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({ 
        email: "", 
        password: "" 
    });

    // 1. Client-side protection: If user is already auth, bounce them to home
    useEffect(() => {
        if (auth.user) {
            router.visit('/');
        }
    }, [auth.user]);

    const submit = (e) => { 
        e.preventDefault(); 
        
        // 2. Standard post with success handling
        post("/login", {
            onSuccess: () => {
                // This will trigger if the server returns a 200/redirect
                router.visit('/');
            }
        }); 
    };

    return (
        <Layout>
            <Head title="Login" />
            
            {/* showSearch is false by default */}
            <Header 
                auth={auth} 
                cartCount={cart.length} 
                onCartOpen={() => setIsCartOpen(true)} 
            />
            
            <div className="flex justify-center mt-20 px-6">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
                    <h3 className="text-3xl font-black dark:text-white mb-8">Sign In</h3>
                    
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <input 
                                type="email" 
                                placeholder="Email" 
                                value={data.email} 
                                onChange={e => setData("email", e.target.value)} 
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                            />
                            {errors.email && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.email}</p>}
                        </div>

                        <div>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={data.password} 
                                onChange={e => setData("password", e.target.value)} 
                                className="w-full p-4 rounded-2xl border border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                            />
                            {errors.password && <p className="text-red-500 text-xs font-bold mt-1 ml-2">{errors.password}</p>}
                        </div>

                        <button 
                            disabled={processing} 
                            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-indigo-700 transition active:scale-95 disabled:opacity-50"
                        >
                            {processing ? "Checking..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>
            
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} />
        </Layout>
    );
}