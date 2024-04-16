import path from 'node:path';
import { createRequire } from 'node:module';
import react from '@vitejs/plugin-react'
import { defineConfig, normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const require = createRequire(import.meta.url);
const cMapsDir = normalizePath(
  path.join(path.dirname(require.resolve('pdfjs-dist/package.json')), 'cmaps')
);

export default defineConfig({
  plugins: [react(),
   viteStaticCopy({
     targets: [
      {
        src: cMapsDir,
         dest: '',
    },
    ],
   }),
  ]
});


