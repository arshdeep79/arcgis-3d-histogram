import { defineConfig } from 'vite';
import { getOcularConfig } from 'ocular-dev-tools';
import { join } from 'path';

const rootDir = join(__dirname, '..');

/** https://vitejs.dev/config/ */
export default defineConfig(async () => {
  // const {aliases} = await getOcularConfig({root: rootDir});
  return {
    server: {
      open: true,
      port: 8080
    },
    optimizeDeps: {
      esbuildOptions: { target: 'es2020' }
    }
  };
});
