import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  if (mode === 'production') {
    return {
      build: {
        outDir: 'docs',
      },
      base: '/Pixijs-Space-Shooter/',
    };
  } else {
    return {};
  }
});
