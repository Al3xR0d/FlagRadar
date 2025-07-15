import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  optimizeDeps: {
    include: ['antd'],
  },
  server: {
    proxy: {
      '/sbcsm_flagradar/api/v1': {
        target: process.env.VITE_BACKEND_API,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sbcsm_flagradar\/api\/v1/, ''),
      },
    },
  },
});
