import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: { https: true },
    plugins: [
        laravel({
            input: ['resources/js/admin.jsx', 'resources/js/user.jsx','resources/css/users.css'],
            refresh: true,
        }),
    ],

});
