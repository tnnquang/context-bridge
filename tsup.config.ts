import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'server': 'lib/bridge.server.tsx',
    'client': 'lib/bridge.client.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
