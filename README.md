# Trenchs Advisory · web v2.0

Rediseño de la web de Trenchs Advisory (consultoría de estrategia, finanzas, datos, tecnología e IA). La v1.0 (Astro,
repositorio `Trenchs-Advisory`, commit `cbbf95b`) sigue intacta como versión de referencia.

## Objetivo del rediseño

Que más visitas terminen en una **solicitud de diagnóstico**, la acción principal del negocio, conservando el 100 %
del contenido de la v1 y sin inventar datos.

- Una portada que explica en 3 segundos qué es la firma, para quién trabaja y qué hacer.
- La acción principal siempre a mano: cabecera fija, barra en móvil, cierre de cada página y botón «Copiar correo»
  para quien no usa un programa de correo.
- Dirección artística editorial: el corte del logotipo como motivo, dos planos de color (crema y verde profundo),
  tipografía Newsreader a gran escala y movimiento sobrio.
- Accesibilidad WCAG 2.1 AA, SEO ampliado y rendimiento ≥ 95 en móvil.

Documentación del proceso en `docs/`:

| Documento | Contenido |
|---|---|
| [`01-inventario-y-auditoria-v1.md`](docs/01-inventario-y-auditoria-v1.md) | Inventario de contenido, URLs y diagnóstico de la v1 |
| [`02-plan-de-rediseno.md`](docs/02-plan-de-rediseno.md) | Plan priorizado y decisiones |
| [`03-correspondencia-v1-v2.md`](docs/03-correspondencia-v1-v2.md) | Dónde está cada contenido de la v1 en la v2 |
| [`04-lighthouse.md`](docs/04-lighthouse.md) | Comparativa Lighthouse antes/después |
| [`05-pendientes.md`](docs/05-pendientes.md) | Lo que debe aportar el negocio |

## Stack

- Next.js 15 (App Router) con exportación estática (`output: 'export'`): HTML estático servible desde cualquier hosting.
- React 19, TypeScript estricto, Tailwind CSS 4.
- Framer Motion 12 con `LazyMotion` (las funciones de animación se cargan aparte).
- anime.js 4 para el campo de datos de «Cómo pensamos» (carga diferida, solo en escritorio).
- Fuentes Newsreader e Inter autoalojadas (sin peticiones a terceros, sin cookies), con fuentes de reserva ajustadas a
  sus métricas.

## Instalación y desarrollo

Requiere Node.js 20 o superior.

```sh
npm install
npm run dev        # http://localhost:3000
npm run build      # genera out/
npm run verify     # comprueba out/ (ver más abajo)
npm run typecheck
```

`npm run verify` revisa la web compilada:

- un `h1` por página, «Saltar al contenido», título, metadescripción y canonical;
- enlaces del pie a las páginas legales, SVG decorativos ocultos a lectores de pantalla y enlaces internos rotos;
- ausencia de recursos externos, código de rastreo o cookies y marcadores `[PENDIENTE]`;
- que existan las 12 rutas de la v1;
- **fidelidad de contenido:** que cada texto visible de la v1 compilada (`V1_DIST`, por defecto
  `../Trenchs-Advisory/dist`) aparezca en la v2. Las reformulaciones aceptadas están en el propio script.

Para revisar la web compilada como en producción (con gzip):

```sh
node scripts/serve.mjs out 4400
```

En Windows con Git Bash, al pasar rutas que empiezan por `/` (p. ej. `BASE_PATH=/Trenchs-Advisory`), antepón
`MSYS_NO_PATHCONV=1` para que Git Bash no las convierta en rutas de Windows.

## Estructura

```
src/
  app/                 páginas (mismas rutas que la v1), sitemap, robots, og.png
  components/
    home/              secciones de la portada
    firm/              piezas de las páginas de la firma
    layout/            cabecera, pie, cierre, cabecera de página, barra móvil
    legal/             plantilla de los textos legales y ficha del titular
    motion/            proveedor de movimiento, apariciones, texto que se ilumina
    seo/               datos estructurados y migas de pan
    ui/                botones, enlaces, cabeceras de sección, copiar correo
  content/             contenido migrado de la v1 (servicios, firma, titular)
  lib/                 datos de contacto, URLs y metadatos
scripts/               verificación, servidor estático y copia de fuentes
docs/                  auditoría, plan, correspondencia, Lighthouse, pendientes
```

El contenido vive en `src/content/` separado de la presentación: para cambiar un texto no hace falta tocar componentes.

## Despliegue

`npm run build` genera en `out/` una web estática.

| Variable | Uso | Ejemplo |
|---|---|---|
| `BASE_PATH` | Subruta de publicación. Vacía con dominio propio. | `/Trenchs-Advisory` (GitHub Pages, como la v1) |
| `SITE_URL` | URL pública sin barra final, para canonical, sitemap y Open Graph. Por defecto, `https://enriquerodrigueztrenchsporta.github.io` + `BASE_PATH`. | `https://www.trenchsadvisory.com` |

- **Dominio propio (recomendado):** `SITE_URL=https://… npm run build` y subir `out/` a cualquier hosting estático.
- **GitHub Pages en la misma URL que la v1:** `BASE_PATH=/Trenchs-Advisory npm run build`. El flujo
  `.github/workflows/deploy.yml` lo hace, pero **solo se ejecuta a mano** (`workflow_dispatch`): publicar requiere
  autorización expresa del propietario.

Las rutas son las mismas que en la v1, así que no hacen falta redirecciones 301. Si en el futuro cambia alguna ruta,
habrá que usar un hosting que admita redirecciones (GitHub Pages no las admite).

## Diferencias principales respecto a la v1.0

| | v1.0 | v2.0 |
|---|---|---|
| Stack | Astro 7, sin JavaScript de interfaz | Next.js 15 + React 19 + Framer Motion 12, exportación estática |
| Portada | El H1 era el lema | El H1 dice qué hace la firma; las cinco áreas a la vista desde el primer pantallazo |
| Acción principal | Botón `mailto:` en cabecera, hero y cierre | Además: barra fija en móvil, tras el método, en el hero de cada servicio y «Copiar correo» |
| Cinco preguntas | Pestañas con avance automático (incumplían WCAG 2.2.2) | Recorrido ligado al scroll, todo visible y enlazado a las áreas |
| Problemas de fondo | Tarjetas que había que voltear | Síntoma, causa y consecuencia siempre visibles |
| Tablas de servicio | `div` con roles ARIA | `<table>` real; fichas legibles en móvil |
| Menús | Desplegables | Desplegables a ancho completo; menú móvil a pantalla completa |
| SEO | Título y descripción | + canonical, Open Graph con imagen, JSON-LD (`ProfessionalService`, `Service`, `BreadcrumbList`), sitemap, robots, 404 |
| Accesibilidad | 95–100 (contraste en Método, nombre del logotipo) | 100 en todas las páginas |
| Verificación | Comprobaciones de HTML | + 12 rutas y fidelidad de contenido frente a la v1 |

El detalle está en [`CHANGELOG.md`](CHANGELOG.md).
