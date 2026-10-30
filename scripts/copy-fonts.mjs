// Copia a public/fonts las fuentes autoalojadas (solo subconjunto latino). Ejecutar tras actualizar @fontsource.
import { copyFileSync, mkdirSync } from 'node:fs';

const files = [
  ['@fontsource/newsreader/files/newsreader-latin-300-normal.woff2', 'newsreader-300.woff2'],
  ['@fontsource/newsreader/files/newsreader-latin-300-italic.woff2', 'newsreader-300-italic.woff2'],
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-var.woff2'],
  ['@fontsource/newsreader/LICENSE', 'LICENSE-newsreader.txt'],
  ['@fontsource-variable/inter/LICENSE', 'LICENSE-inter.txt'],
];
mkdirSync('public/fonts', { recursive: true });
for (const [from, to] of files) copyFileSync(`node_modules/${from}`, `public/fonts/${to}`);
console.log(`Copiadas ${files.length} fuentes y licencias a public/fonts`);
