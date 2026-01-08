import { useState, useEffect } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import Layout from "./Layout";
import Header from "@/Components/Header";
import ProductCard from "@/Components/ProductCard";
import CartDrawer from "@/Components/CartDrawer";

export default function Home({ products, filters }) {
    const { auth, cart = [] } = usePage().props;
    const [search, setSearch] = useState(filters.search || "");
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            router.get('/', { search }, { preserveState: true, replace: true, preserveScroll: true });
        }, 400);
        return () => clearTimeout(delay);
    }, [search]);

    const addToCart = (product, quantity) => {
        if (!auth.user) return router.get('/login');
        router.post('/cart', { product_id: product.id, quantity }, { 
            preserveScroll: true, 
            onSuccess: () => setIsCartOpen(true) 
        });
    };

    return (
        <Layout>
            <Head title="Home" />
            <Header showSearch={true} auth={auth} cartCount={cart.length} onCartOpen={() => setIsCartOpen(true)} search={search} setSearch={setSearch} />
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {products.map(p => <ProductCard key={p.id} product={p} onAdd={addToCart} />)}
                </div>
            </main>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} />
        </Layout>
    );
}