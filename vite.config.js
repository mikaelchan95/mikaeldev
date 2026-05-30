import { defineConfig } from 'vite';

// Relative base so the same build works at a domain root
// (mikaelchan95.github.io / a custom domain) AND under a project
// subpath (mikaelchan95.github.io/mikaeldev) with no reconfiguration.
export default defineConfig({
  base: './',
  server: { open: true, port: 5173 },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
