export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
            {children}
        </div>
    );
}