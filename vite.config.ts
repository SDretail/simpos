import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensure relative paths for Android WebView
  build: {
    target: 'es2015',
  },
  server: {
    allowedHosts: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
});
