import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: { https: false },
    plugins: [
        laravel({
            input: ['resources/js/admin.jsx', 'resources/js/user.jsx'],
            refresh: true,
        }),
    ],

});
