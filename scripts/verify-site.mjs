// Comprobaciones sobre la web compilada (out/). Uso: npm run build && npm run verify
//
// 1. Las de la v1: lang, un h1, «Saltar al contenido», enlaces legales en el pie, SVG decorativos ocultos, enlaces
//    internos rotos, recursos externos, rastreo y marcadores [PENDIENTE].
// 2. Las 12 rutas de la v1 existen (no hacen falta redirecciones 301).
// 3. Fidelidad de contenido: cada fragmento de texto visible de la v1 compilada (V1_DIST, por defecto
//    ../Trenchs-Advisory/dist) aparece en la v2, salvo las reformulaciones documentadas en REFORMULATED.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const OUT = 'out';
const V1_DIST = process.env.V1_DIST ?? '../Trenchs-Advisory/dist';
const BASE = process.env.BASE_PATH ?? '';

const V1_ROUTES = [
  '',
  'servicios/inteligencia-de-negocio',
  'servicios/analitica-avanzada',
  'servicios/consultoria-financiera',
  'servicios/transformacion-digital',
  'servicios/inteligencia-artificial-aplicada',
  'firma/quienes-somos',
  'firma/metodo',
  'firma/mision-vision-principios',
  'legal/aviso-legal',
  'legal/privacidad',
  'legal/cookies',
];
const LEGAL = ['legal/aviso-legal', 'legal/privacidad', 'legal/cookies'];
// Enlaces externos permitidos (simples enlaces, nunca recursos que se carguen solos).
const EXTERNAL_LINKS = ['https://enriquerodrigueztrenchsporta.github.io/', 'https://docs.github.com/', 'https://www.aepd.es', 'https://schema.org'];

// Textos de la v1 que no aparecen literalmente en la v2, con dónde está ahora su información.
// Ver también docs/03-correspondencia-v1-v2.md.
const REFORMULATED = new Map([
  [
    'Integramos estrategia, finanzas, datos y tecnología para que empresas y administraciones decidan con evidencia, anticipación y criterio económico.',
    'Portada, hero: titular «Decisiones con evidencia, anticipación y criterio económico» y entradilla (amplía la frase con la descripción de la v1).',
  ],
  [
    'Ninguno se resuelve comprando una herramienta. Pase el cursor o toque cada tarjeta para ver su causa y su coste real.',
    'Quiénes somos, «El punto de partida»: se conserva la primera frase; la segunda era la instrucción de la tarjeta volteable de la v1 (en la v2 causa y consecuencia están siempre visibles).',
  ],
  ['Causa y consecuencia ↻', 'Pista de la tarjeta volteable de la v1 (ya no hace falta voltear).'],
]);

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

const errors = [];
const fail = (where, msg) => errors.push(`${where}: ${msg}`);

const decode = (s) =>
  s
    .replace(/&nbsp;|&#x?a0;/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const clean = (html) =>
  html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|template)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<head[\s\S]*?<\/head>/i, ' ');
const norm = (s) => s.replace(/\s+/g, ' ').trim().toLowerCase();

// ── 1. Comprobaciones de cada página ──
if (!existsSync(OUT)) {
  console.error('No existe out/. Ejecuta antes npm run build.');
  process.exit(1);
}
const pages = walk(OUT).filter((p) => !p.includes(`${join(OUT, '404')}`));
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const at = relative(OUT, page);

  if (!/<html lang="es"/.test(html)) fail(at, 'falta lang="es"');
  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 !== 1) fail(at, `${h1} encabezados h1 (debe haber 1)`);
  if (!html.includes('href="#contenido"') || !/<main id="contenido"/.test(html)) fail(at, 'falta el enlace «Saltar al contenido»');
  if (!/<title>[^<]+<\/title>/.test(html)) fail(at, 'falta <title>');
  if (!/<meta name="description" content="[^"]{50,}"/.test(html) && !at.startsWith('404')) fail(at, 'falta una metadescripción útil');
  if (!/<link rel="canonical"/.test(html) && !at.startsWith('404')) fail(at, 'falta la URL canónica');
  for (const l of LEGAL) if (!html.includes(`href="${BASE}/${l}/"`)) fail(at, `el pie no enlaza a ${l}`);

  for (const [svg] of html.matchAll(/<svg\b[^>]*>/g)) {
    if (!/aria-hidden="true"/.test(svg) && !/role="img"/.test(svg)) fail(at, `SVG sin aria-hidden ni role="img": ${svg.slice(0, 80)}`);
  }
  for (const [tag, url] of html.matchAll(/<(?:script|img|iframe|link)\b[^>]*(?:src|href)="(https?:[^"]+)"[^>]*>/g)) {
    if (!/rel="canonical"/.test(tag)) fail(at, `recurso externo: ${url}`);
  }
  for (const [, url] of html.matchAll(/<a\b[^>]*href="(https?:[^"]+)"/g)) {
    if (!EXTERNAL_LINKS.some((ok) => url.startsWith(ok))) fail(at, `enlace externo no revisado: ${url}`);
  }
  if (/googletagmanager|google-analytics|gtag\(|fbq\(|hotjar|plausible|matomo|document\.cookie/i.test(html)) fail(at, 'código de rastreo o cookies');
  if (html.includes('[PENDIENTE]')) fail(at, 'marcador [PENDIENTE] publicado');

  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)/g)) {
    if (BASE && !href.startsWith(BASE)) continue;
    const path = href.slice(BASE.length).replace(/^\//, '');
    const target = join(OUT, path);
    const ok = path === '' || existsSync(target) && (statSync(target).isFile() || existsSync(join(target, 'index.html')));
    if (!ok) fail(at, `enlace interno roto: ${href}`);
  }
}

// ── 2. Rutas de la v1 ──
for (const route of V1_ROUTES) {
  if (!existsSync(join(OUT, route, 'index.html'))) fail('rutas', `falta /${route}${route ? '/' : ''} (ruta de la v1)`);
}
for (const extra of ['sitemap.xml', 'robots.txt', '404.html', 'og.png']) {
  if (!existsSync(join(OUT, extra))) fail('seo', `falta ${extra}`);
}

// ── 3. Fidelidad de contenido frente a la v1 ──
let checked = 0;
if (!existsSync(V1_DIST)) {
  fail('contenido', `no se encuentra la v1 compilada en ${V1_DIST} (variable V1_DIST)`);
} else {
  const v2Text = norm(decode(pages.map((p) => clean(readFileSync(p, 'utf8')).replace(/<[^>]+>/g, '')).join(' ')));
  const seen = new Set();
  for (const page of walk(V1_DIST)) {
    const html = clean(readFileSync(page, 'utf8'));
    for (const [, raw] of html.matchAll(/>([^<>]+)</g)) {
      const text = decode(raw).replace(/\s+/g, ' ').trim();
      if ((text.match(/\p{L}/gu)?.length ?? 0) < 2 || seen.has(text)) continue;
      // La URL del sitio depende de dónde se publique (BASE_PATH / SITE_URL), no es contenido.
      if (/^https:\/\/enriquerodrigueztrenchsporta\.github\.io/.test(text)) continue;
      seen.add(text);
      if (REFORMULATED.has(text)) continue;
      checked++;
      // El año del © cambia con la fecha de compilación.
      if (!v2Text.includes(norm(text).replace(/© \d{4}/, '©').replace(/^©/, '©')) && !v2Text.includes(norm(text).replace(/© \d{4} /, ''))) {
        fail(`contenido (${relative(V1_DIST, page)})`, `texto de la v1 sin equivalente en la v2: «${text}»`);
      }
    }
  }
}

if (errors.length) {
  console.error(`✗ ${errors.length} problemas:\n  ${errors.join('\n  ')}`);
  process.exit(1);
}
console.log(
  `✓ ${pages.length} páginas revisadas, ${V1_ROUTES.length} rutas de la v1 presentes, ` +
    `${checked} textos de la v1 encontrados en la v2 (${REFORMULATED.size} reformulaciones documentadas).`,
);
