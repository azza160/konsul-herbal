import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './resources/js'),
        },
    },
    server: {
        hmr: {
            host: 'localhost',
        },
        cors: true,
        origin: 'http://localhost:5173',
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
    optimizeDeps: {
        include: ['@hello-pangea/dnd', 'lucide-react'],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom', '@inertiajs/react'],
                },
            },
        },
    },
});
