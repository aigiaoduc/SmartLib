import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1000, // Tăng giới hạn cảnh báo lên 1000kB (1MB)
    rollupOptions: {
      output: {
        manualChunks: {
          // Tách các thư viện lớn ra các file riêng biệt (Code Splitting) để tải trang nhanh hơn
          vendor: ['react', 'react-dom'],
          icons: ['lucide-react'],
          gemini: ['@google/genai']
        }
      }
    }
  }
});