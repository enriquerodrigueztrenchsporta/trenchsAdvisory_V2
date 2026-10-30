# Comparativa Lighthouse: v1.0 frente a v2.0

## Condiciones

- Lighthouse 12.6.1, Microsoft Edge (Chromium) sin interfaz, en el mismo equipo y la misma sesión para las dos
  versiones.
- Las dos versiones servidas en local con el mismo servidor con gzip (`scripts/serve.mjs`), como GitHub Pages:
  v1 desde su `dist/` (commit `cbbf95b`, bajo `/Trenchs-Advisory/`); v2 desde `out/`.
- Móvil: perfil por defecto (red lenta simulada y CPU ×4), **mediana de 3 pasadas** (entre paréntesis, las tres).
  Escritorio: perfil de escritorio, 1 pasada.
- Script: `scripts/lighthouse.mjs`.

## Medición A: completa (2026-10-30)

Tomada con la v2 en el commit `01121b4`, antes de los dos ajustes de rendimiento posteriores (fuentes de reserva
ajustadas y anchos en `em`). Esos ajustes no añaden JavaScript ni peso.

### Móvil

| Página | v1 Rend. | v1 Acc. | v1 BP | v1 SEO | v1 LCP | v1 CLS | v1 TBT | v1 Peso | v2 Rend. | v2 Acc. | v2 BP | v2 SEO | v2 LCP | v2 CLS | v2 TBT | v2 Peso |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Portada | 97 (97/97/98) | 100 | 100 | 100 | 2,1 s | 0,007 | 0 ms | 196 KiB | 95 (94/95/95) | 100 | 100 | 100 | 2,8 s | 0,000 | 102 ms | 323 KiB |
| Servicio (inteligencia de negocio) | 97 (97/97/97) | 100 | 100 | 100 | 2,1 s | 0,023 | 0 ms | 190 KiB | 96 (96/96/97) | 100 | 100 | 100 | 2,6 s | 0,000 | 102 ms | 289 KiB |
| Quiénes somos | 97 (97/97/99) | 100 | 100 | 100 | 2,1 s | 0,023 | 0 ms | 192 KiB | 94 (91/94/96) | 100 | 100 | 100 | 2,7 s | 0,000 | 164 ms | 291 KiB |
| Método | 97 (97/97/97) | **95** | 100 | 100 | 2,1 s | 0,034 | 0 ms | 190 KiB | 97 (96/97/97) | 100 | 100 | 100 | 2,5 s | 0,000 | 68 ms | 263 KiB |
| Misión, visión y principios | 98 (98/98/98) | 100 | 100 | 100 | 2,0 s | 0,000 | 0 ms | 189 KiB | 96 (96/96/96) | 100 | 100 | 100 | 2,5 s | 0,073 | 80 ms | 288 KiB |
| Privacidad | 98 (98/98/98) | 100 | 100 | 100 | 2,0 s | 0,000 | 0 ms | 188 KiB | 97 (97/97/98) | 100 | 100 | 100 | 2,4 s | 0,000 | 90 ms | 262 KiB |

### Escritorio

| Página | v1 Rend. | v1 Acc. | v1 BP | v1 SEO | v1 LCP | v2 Rend. | v2 Acc. | v2 BP | v2 SEO | v2 LCP | v2 CLS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Portada | 100 | 100 | 100 | 100 | 0,4 s | 100 | 100 | 100 | 100 | 0,6 s | 0,001 |
| Servicio (inteligencia de negocio) | 100 | 100 | 100 | 100 | 0,5 s | 100 | 100 | 100 | 100 | 0,5 s | 0,000 |
| Quiénes somos | 100 | 100 | 100 | 100 | 0,4 s | 100 | 100 | 100 | 100 | 0,6 s | 0,000 |
| Método | 100 | **95** | 100 | 100 | 0,5 s | 100 | 100 | 100 | 100 | 0,5 s | 0,000 |
| Misión, visión y principios | 100 | 100 | 100 | 100 | 0,4 s | 99 | 100 | 100 | 100 | 0,5 s | 0,065 |
| Privacidad | 100 | 100 | 100 | 100 | 0,4 s | 100 | 100 | 100 | 100 | 0,5 s | 0,000 |

Avisos de la v1 en todas las páginas: `label-content-name-mismatch` (logotipo). En Método, además, `color-contrast`.
La v2 no tiene ninguno.

## Medición B: incompleta, no concluyente

Repetición con la versión final de la v2. El sistema se quedó sin memoria durante la medición y Claude Code detuvo
los procesos tras 4 de las 6 páginas. Resultados obtenidos (móvil, mediana de 3):

| Página | v1 | v2 |
|---|---|---|
| Portada | 97 | 88 |
| Servicio (inteligencia de negocio) | 97 | 92 |
| Quiénes somos | 97 | 94 |
| Método | 97 | 91 |

Escritorio: v1 y v2, 100 en todas. Accesibilidad, buenas prácticas y SEO de la v2: 100 en todas.

**Por qué no es concluyente.** Lighthouse calcula la puntuación móvil simulando una CPU 4 veces más lenta a partir de
los tiempos que observa. Con el equipo bajo presión de memoria, esos tiempos se inflan. Eso afecta a la v2, que
ejecuta JavaScript, y apenas a la v1, que no lo ejecuta (la v1 dio las mismas cifras en A y en B). Los cambios entre A
y B no añaden JavaScript. **Hay que repetir la medición con el equipo descargado** antes de dar por cumplido el
objetivo.

## Lectura

- **Accesibilidad, buenas prácticas y SEO:** 100 en todas las páginas de la v2. La v1 tenía 95 en Método.
- **Escritorio:** 99–100 en ambas versiones.
- **Móvil:** la v2 queda entre 1 y 3 puntos por debajo de la v1 en la medición A (94–97). Objetivo aprobado: ≥ 95.
  Quiénes somos (94) queda un punto por debajo, con mucha variación entre pasadas (91–96).
- **Causa de la diferencia:** el JavaScript de React y Next (~103 KB comprimidos, comunes a todas las páginas). La v1
  no envía JavaScript de interfaz. En un navegador real con red y CPU limitadas, el LCP de la v2 coincide con el
  primer pintado (1,26 s en Quiénes somos, una sola entrada LCP). El LCP más alto de Lighthouse sale de su simulación,
  que cuenta como dependencia del LCP la evaluación del JavaScript que en la traza real ocurre antes de pintar.
- **CLS de 0,07 en Misión:** al cargar Newsreader, la cita grande cambia algún salto de línea, aun con la fuente de
  reserva ajustada a sus métricas. Está dentro del umbral «bueno» de Core Web Vitals (< 0,1). Solo se eliminaría con
  `font-display: optional`, que en una primera visita lenta mostraría los titulares en Georgia; se prefiere conservar
  la tipografía de marca.

## Cómo repetir la medición

```sh
# En el repositorio de la v1: npm run build (genera dist/)
# En este repositorio:
npm run build
npm i --no-save lighthouse@12.6.1
MSYS_NO_PATHCONV=1 node scripts/serve.mjs ../Trenchs-Advisory/dist 4402 /Trenchs-Advisory &
node scripts/serve.mjs out 4400 &
CHROME_PATH="<ruta de Chrome o Edge>" node scripts/lighthouse.mjs lighthouse.json
```
