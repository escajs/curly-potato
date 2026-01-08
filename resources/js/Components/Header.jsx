import { Link, router } from "@inertiajs/react";

export default function Header({ auth, cartCount, onCartOpen, search, setSearch, showSearch = false }) {
    return (
        <nav className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b dark:border-slate-700 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link href="/" className="font-black text-indigo-600 text-xl tracking-tighter uppercase">
                    ProdHub
                </Link>
                
                {/* Conditional Search: Only shows if showSearch prop is true */}
                <div className="flex-1 max-w-sm mx-4">
                    {showSearch && (
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-full border-slate-200 dark:bg-slate-900 dark:border-slate-700 dark:text-white px-4 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                    )}
                </div>

                <div className="flex items-center gap-6">
                    {/* Conditional Cart: Only shows if user is authenticated */}
                    {auth.user && (
                        <button onClick={onCartOpen} className="relative p-2 group">
                            <svg className="w-6 h-6 text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            <span className="absolute top-0 right-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-600 text-white ring-2 ring-white dark:ring-slate-800">
                                {cartCount}
                            </span>
                        </button>
                    )}

                    {/* Auth Links */}
                    <div className="hidden md:flex gap-4 text-sm font-bold">
                        {auth.user ? (
                            <button onClick={() => router.post('/logout')} className="text-red-500 hover:underline">
                                Logout
                            </button>
                        ) : (
                            <>
                                <Link href="/login" className="text-slate-600 dark:text-slate-400 hover:text-indigo-600">Login</Link>
                                <Link href="/register" className="text-indigo-600 hover:text-indigo-700">Join</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}