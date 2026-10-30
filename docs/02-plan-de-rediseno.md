# Fase 2 · Plan de rediseño

Decisiones del propietario (2026-10-30): proyecto nuevo e independiente de `trenchs-advisory-web-v2`; objetivo de
rendimiento Lighthouse móvil ≥ 95 (accesibilidad, buenas prácticas y SEO = 100); nombre `trenchsAdvisory_V2`.

## 1. Idea de dirección artística

**«De la información a la decisión».** La v1 ya tiene la mejor idea de su propio relato: cinco preguntas que llevan
de los datos a una decisión ejecutada. La v2 convierte esa idea en el hilo visual de toda la web:

- **El corte del logotipo como firma visual.** El símbolo es un bloque atravesado por una curva. Esa curva se usa
  como línea guía que recorre las secciones, separa planos y se dibuja con el scroll.
- **Contraste editorial.** Titulares muy grandes en Newsreader ligera frente a etiquetas pequeñas en Inter
  mayúscula; grandes márgenes; retícula de 12 columnas.
- **Dos planos de color.** Crema (lectura, servicios, legales) y verde profundo `#1F3A33` (momentos de pausa: hero,
  preguntas, cierre). Oro solo para acentos y estados activos.
- **Movimiento sobrio, propio de un despacho**: apariciones por capas, texto que se ilumina al leer, una sección
  fija («sticky») para las cinco preguntas, microinteracciones en enlaces y botones. Nada que rebote ni que gire.
- **Tratamiento de usted**, como en la v1.

## 2. Acción principal

«Solicitar diagnóstico» (correo con asunto y cuerpo prellenados), igual que la v1. Mejoras:

1. Visible siempre: botón en la cabecera fija y barra inferior en móvil a partir del primer scroll.
2. Repetida en los puntos de decisión: hero, tras los servicios, tras el método y en el cierre de cada página.
3. Sin callejones sin salida: junto al botón, el correo visible y un botón «Copiar correo» para quien no usa un
   programa de correo.
4. Sin coletillas «sin coste» (retiradas por el propietario).

## 3. Nueva estructura de la portada

| # | Sección | Por qué existe | Contenido v1 |
|---|---|---|---|
| 1 | Hero | Qué es, para quién y qué hacer, en 3 s | H-01, D5 |
| 2 | Negocio primero | El problema que resuelven | H-02 |
| 3 | Cinco preguntas (sticky) | Cómo piensan; une preguntas y áreas | H-03 + H-04 (fusionadas) |
| 4 | Servicios | Qué compran | H-04, S1–S5 |
| 5 | Método | Cómo trabajan y qué entregan en cada fase | H-05 + resultados M1–M5 |
| 6 | Por qué nosotros + A la medida | Prueba de calidad disponible (sin testimonios) | H-06, F-05 resumido |
| 7 | Cómo empezar | Información práctica: primera conversación, encargo acotado, modalidades, remoto | H-06, F-09, D7, D8 |
| 8 | Cierre | Acción principal | H-07 |

Los testimonios no se publican hasta que existan (ver [PENDIENTE] P2).

## 4. Páginas interiores

Mismas 12 rutas que la v1 (sin redirecciones necesarias). Mismo contenido, nueva composición:

- **Servicios**: cabecera con la pregunta que responde; los servicios como filas editoriales desplegables
  (servicio → entregable → beneficio); nota de beneficios; método en cinco pasos; otras áreas; cierre propio.
- **Quiénes somos**: disciplinas que convergen, cinco problemas (tarjetas accesibles), por qué ahora, por qué nosotros.
- **Método**: línea de fases que se rellena con el scroll, reglas, relación por etapas.
- **Misión, visión y principios**: misión a pantalla completa con texto que se ilumina, visión, seis principios.
- **Legales**: texto íntegro, lectura cómoda, índice lateral.
- **Nuevo**: página 404 (no añade contenido de negocio).

## 5. Prioridades

| Prioridad | Trabajo |
|---|---|
| P0 | Contenido migrado al 100 %, rutas idénticas, acción principal, accesibilidad AA, legales |
| P0 | Corrección WCAG 2.2.2: nada avanza solo; el control «Pausar animaciones» detiene todo el movimiento |
| P1 | Hero, cinco preguntas, servicios, método, cierre |
| P1 | SEO: canonical, Open Graph con imagen, JSON-LD (`ProfessionalService`, `Service`, `BreadcrumbList`), sitemap, robots |
| P2 | Páginas de la firma y legales con la nueva dirección artística |
| P2 | Lighthouse antes/después, tabla de correspondencia, README, CHANGELOG, etiqueta v2.0.0 |

## 6. Ingeniería

- Next.js 15 (App Router) con exportación estática (`output: 'export'`, `trailingSlash: true`): mismas rutas que la
  v1 y alojable en GitHub Pages o en cualquier hosting estático. `BASE_PATH` configurable.
- TypeScript estricto, Tailwind CSS 4, Framer Motion 12 con `LazyMotion` (solo en los componentes que animan).
- Componentes de servidor por defecto; JavaScript de cliente solo para cabecera, animaciones y copiar correo.
- Contenido en `src/content/` (datos tipados, migrados de la v1), separado de la presentación.
- Fuentes autoalojadas (sin peticiones a terceros, sin cookies), igual que la v1.
- `npm run verify`: comprobaciones de la v1 (un `h1`, saltar al contenido, enlaces legales, enlaces rotos, rastreo,
  `[PENDIENTE]`) más la existencia de las 12 rutas y la presencia de textos clave de la v1.
- No se publica ni se crea repositorio remoto sin autorización.
