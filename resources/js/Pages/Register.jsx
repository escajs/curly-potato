import { useForm, Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import Layout from "./Layout";
import Header from "@/Components/Header";
import CartDrawer from "@/Components/CartDrawer";

export default function Register() {
    const { auth, cart = [] } = usePage().props;
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { data, setData, post, processing, errors } = useForm({ name: "", email: "", password: "", password_confirmation: "" });

    const submit = (e) => { e.preventDefault(); post("/register"); };

    return (
        <Layout>
            <Head title="Register" />
            <Header auth={auth} cartCount={cart.length} onCartOpen={() => setIsCartOpen(true)} search="" setSearch={() => {}} />
            <div className="flex justify-center mt-20 px-6">
                <div className="w-full max-w-md bg-white dark:bg-slate-800 p-10 rounded-[2.5rem] shadow-xl ring-1 ring-slate-200 dark:ring-slate-700">
                    <h3 className="text-3xl font-black dark:text-white mb-8">Join ProdHub</h3>
                    <form onSubmit={submit} className="space-y-4">
                        <input type="text" placeholder="Full Name" value={data.name} onChange={e => setData("name", e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                        <input type="email" placeholder="Email" value={data.email} onChange={e => setData("email", e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                        <input type="password" placeholder="Password" value={data.password} onChange={e => setData("password", e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                        <input type="password" placeholder="Confirm" value={data.password_confirmation} onChange={e => setData("password_confirmation", e.target.value)} className="w-full p-4 rounded-2xl border dark:bg-slate-900 dark:border-slate-700 dark:text-white" />
                        <button disabled={processing} className="w-full mt-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest">Create Account</button>
                    </form>
                </div>
            </div>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} />
        </Layout>
    );
}