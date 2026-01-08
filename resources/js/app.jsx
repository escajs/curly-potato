import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import Layout from './Pages/Layout';
import '../css/app.css';

createInertiaApp({
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        
        let page = pages[`./Pages/${name}.jsx`];

        if (!page) {
            console.error(`Inertia could not find: ./Pages/${name}.jsx`);
            // Fallback for subfolders just in case
            page = pages[`./Pages/${name}/index.jsx`];
        }

        page.default.layout = page.default.layout || ((page) => <Layout children={page} />);
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});