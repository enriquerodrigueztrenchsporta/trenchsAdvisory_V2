// Mide v1 y v2 con Lighthouse 12.6.1 en las mismas condiciones (servidor gzip de scripts/serve.mjs).
// Requisitos: npm i --no-save lighthouse@12.6.1; v1 en :4402/Trenchs-Advisory/ y v2 en :4400/ (ver docs/04-lighthouse.md).
// Uso: CHROME_PATH=<ruta de Chrome o Edge> node scripts/lighthouse.mjs <salida.json>
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFileSync } from 'node:fs';

const PAGES = [
  ['Portada', ''],
  ['Servicio (inteligencia de negocio)', 'servicios/inteligencia-de-negocio/'],
  ['Quiénes somos', 'firma/quienes-somos/'],
  ['Método', 'firma/metodo/'],
  ['Misión, visión y principios', 'firma/mision-vision-principios/'],
  ['Privacidad', 'legal/privacidad/'],
];
const SITES = { v1: 'http://localhost:4402/Trenchs-Advisory/', v2: 'http://localhost:4400/' };
const RUNS = { mobile: 3, desktop: 1 };

const chrome = await chromeLauncher.launch({ chromePath: process.env.CHROME_PATH, chromeFlags: ['--headless=new'] });
const results = [];
for (const [name, path] of PAGES) for (const mode of ['mobile', 'desktop']) for (const [ver, base] of Object.entries(SITES)) {
  const runs = [];
  for (let r = 0; r < RUNS[mode]; r++) {
    const config = mode === 'desktop' ? (await import('lighthouse/core/config/desktop-config.js')).default : undefined;
    const { lhr } = await lighthouse(base + path, { port: chrome.port, output: 'json', logLevel: 'error' }, config);
    const a = lhr.audits;
    runs.push({
      perf: Math.round(lhr.categories.performance.score * 100),
      a11y: Math.round(lhr.categories.accessibility.score * 100),
      bp: Math.round(lhr.categories['best-practices'].score * 100),
      seo: Math.round(lhr.categories.seo.score * 100),
      lcp: a['largest-contentful-paint'].numericValue,
      cls: a['cumulative-layout-shift'].numericValue,
      tbt: a['total-blocking-time'].numericValue,
      kib: a['total-byte-weight'].numericValue / 1024,
      fails: Object.values(lhr.audits).filter((x) => x.score === 0 && x.scoreDisplayMode === 'binary').map((x) => x.id),
    });
  }
  runs.sort((x, y) => x.perf - y.perf);
  const med = runs[Math.floor(runs.length / 2)];
  results.push({ page: name, mode, ver, ...med, perfRuns: runs.map((x) => x.perf) });
  console.log(ver, mode, name, med.perf, med.a11y, med.bp, med.seo, Math.round(med.lcp), med.fails.join(','));
}
await chrome.kill();
writeFileSync(process.argv[2], JSON.stringify(results, null, 2));
