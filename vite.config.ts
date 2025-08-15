import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  const serverConfig =
    mode === 'development'
      ? {
          server: {
            proxy: {
              '/sbcsm_flagradar': {
                target: env.VITE_API_URL,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/sbcsm_flagradar/, '/sbcsm_flagradar/api/v2'),
              },
            },
          },
        }
      : {};

  return {
    plugins: [react(), tsconfigPaths()],
    optimizeDeps: {
      include: ['antd'],
    },
    assetsInclude: ['**/*.gif'],
    build: {
      assetsDir: 'assets',
      manifest: true,
      sourcemap: mode === 'development',
    },
    ...serverConfig,
  };
});
