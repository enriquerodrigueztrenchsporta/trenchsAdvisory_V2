// Servidor estático con gzip, como GitHub Pages. Sirve para revisar out/ y para medir con Lighthouse en igualdad
// de condiciones la v1 (dist/) y la v2 (out/).
// Uso: node scripts/serve.mjs <carpeta> <puerto> [prefijo]   p. ej. node scripts/serve.mjs ../Trenchs-Advisory/dist 4401 /Trenchs-Advisory

import { createServer } from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { createGzip } from 'node:zlib';

const [dir = 'out', port = '4400', prefix = ''] = process.argv.slice(2);
const root = resolve(dir);
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml',
};
const COMPRESS = new Set(['.html', '.js', '.css', '.svg', '.json', '.txt', '.xml']);

createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (prefix && path.startsWith(prefix)) path = path.slice(prefix.length) || '/';
  let file = normalize(join(root, path));
  if (!file.startsWith(root)) return res.writeHead(403).end();
  if (existsSync(file) && statSync(file).isDirectory()) {
    if (!path.endsWith('/')) return res.writeHead(301, { Location: `${prefix}${path}/` }).end();
    file = join(file, 'index.html');
  }
  let status = 200;
  if (!existsSync(file)) {
    status = 404;
    file = join(root, '404.html');
    if (!existsSync(file)) return res.writeHead(404).end('404');
  }
  const ext = extname(file);
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream', 'Cache-Control': 'max-age=600' };
  const gzip = COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '');
  if (gzip) headers['Content-Encoding'] = 'gzip';
  res.writeHead(status, headers);
  const stream = createReadStream(file);
  (gzip ? stream.pipe(createGzip()) : stream).pipe(res);
}).listen(Number(port), () => console.log(`Sirviendo ${root} en http://localhost:${port}${prefix}/`));
