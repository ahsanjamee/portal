import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        mkcert({
            hosts: ['*.jameeportal.dev', '*.local.jameeportal.dev'],
            autoUpgrade: true,
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        open: 'http://local.jameeportal.dev',
        host: '0.0.0.0',
        port: 443,
        strictPort: true,
    },
});
