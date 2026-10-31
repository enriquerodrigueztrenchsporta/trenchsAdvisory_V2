# Changelog

Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/). Versionado semántico.

## [2.1.0] - 2026-10-31

### Añadido

- **Herramientas gratuitas** (`/herramientas/`): nuevo menú desplegable en la cabecera (escritorio y móvil, como «Servicios» y «La firma»)
  con las herramientas disponibles, y página propia con el título
  «Entiende y mejora tu negocio» y un catálogo preparado para crecer (una sola tarjeta por ahora).
- **Calculadora de Rentabilidad Empresarial · Trenchs Financial Lab**
  (`/herramientas/calculadora-rentabilidad/`): cuatro datos y un panel tipo dashboard que se actualiza al escribir,
  con resultado mensual estimado, margen de contribución, punto de equilibrio, margen de seguridad, distribución de
  la facturación, simulación de escenarios, diagnóstico automático y resumen copiable. Nada sale del navegador.
- **PYME Check — ¿Dónde puede mejorar tu empresa?** (`/herramientas/pyme-check/`): autodiagnóstico de cinco
  preguntas con puntuación sobre 100, evaluación por áreas, hasta tres oportunidades con soluciones y servicios, y
  pop-up con formulario de contacto que, con autorización, adjunta el diagnóstico (envío por correo prellenado).
- `npm test` (node:test) y su ejecución en el flujo de publicación.

### Cambiado

- Privacidad: subapartado «Herramientas gratuitas» (la calculadora no envía nada; PYME Check solo comparte el
  diagnóstico con autorización) y se retira «La web no tiene formularios». Aviso legal, apartado 5: igual.
- La barra fija «Solicitar diagnóstico» de móvil no aparece en las herramientas.

## [2.0.0] - 2026-10-30

Rediseño completo sobre el contenido de la v1.0 (repositorio `Trenchs-Advisory`, commit `cbbf95b`). Todo el texto de
la v1 se conserva; las tres reformulaciones están en `docs/03-correspondencia-v1-v2.md`.

### Cambiado

- **Stack:** de Astro 7 a Next.js 15 (exportación estática), React 19, TypeScript, Tailwind CSS 4, Framer Motion 12 y anime.js 4.
- **Dirección artística:** composición editorial con dos planos de color (crema y verde profundo `#14261F`, nuevo tono
  dentro de la paleta de la v1), Newsreader a gran escala, el corte del logotipo como motivo gráfico y grano sutil en
  los planos oscuros.
- **Portada:**
  - el H1 pasa a decir qué hace la firma («Decisiones con evidencia, anticipación y criterio económico.»); el lema
    se mantiene en el pie;
  - las cinco áreas quedan a la vista desde el primer pantallazo;
  - nuevo orden: método → negocio primero → cinco preguntas → capacidades → a la medida → cierre;
  - el método se cuenta con el scroll, al estilo de animejs.com: una línea de tiempo de anime.js avanza y retrocede con
    el scroll y pasa por las cinco fases (lupa sobre la información, modelo conectado, logotipo que se ensambla, órbita
    de adopción y ciclo de mejora). Textos de la v1 para la portada (fase y objetivo).
- **Cinco preguntas:** las pestañas con avance automático pasan a ser un recorrido ligado al scroll, con disciplina,
  entregable y enlace a las áreas que responden a cada pregunta.
- **Quiénes somos:** los cinco problemas de fondo muestran síntoma, causa y consecuencia sin necesidad de voltear
  tarjetas.
- **Método:** carril de fases que se rellena con el scroll; la relación en cuatro etapas, como una escalera.
- **Misión:** la cita se ilumina palabra a palabra al leerla.
- **Servicios:** tabla real (`<table>`) con fichas legibles en móvil; la pregunta que responde cada área, en el hero.
- **Menús:** desplegables a ancho completo y menú móvil a pantalla completa. Los paneles están siempre en el HTML.
- **Textos legales:** mismo contenido, con índice lateral.

### Añadido

- «Del dato a la decisión»: campo de 60 puntos de datos animado con anime.js 4 en «Cómo pensamos» (escritorio). Con
  cada pregunta los puntos se reorganizan: cuadro de mando, causas, previsión con incertidumbre, alternativas y
  ejecución. Decorativo; anime.js solo se descarga en escritorio, y con «Pausar animaciones» o movimiento reducido los
  puntos se colocan sin animar.
- Acción principal «Solicitar diagnóstico» en más puntos: barra fija en móvil, tras el método y en el hero de cada
  servicio.
- Botón «Copiar correo» junto al enlace de correo, para quien no tiene un programa de correo configurado.
- Migas de pan en las páginas interiores.
- SEO: URL canónica, Open Graph y Twitter con imagen (`og.png`, generada al compilar), datos estructurados
  `ProfessionalService`, `Service` y `BreadcrumbList`, `sitemap.xml`, `robots.txt` y página 404.
- Fuentes de reserva ajustadas a las métricas de Newsreader e Inter.
- `npm run verify`: además de las comprobaciones de la v1, las 12 rutas de la v1 y la fidelidad de cada texto de la v1.
- `scripts/serve.mjs`: servidor estático con gzip para revisar y medir.
- Publicación en GitHub Pages solo manual (`workflow_dispatch`).
- Documentación: auditoría, plan, correspondencia, Lighthouse y pendientes (`docs/`).

### Corregido

- WCAG 2.2.2: el avance automático de «Cómo pensamos» no se podía detener con «Pausar animaciones». En la v2 nada
  avanza solo, y «Pausar animaciones» detiene también el movimiento ligado al scroll.
- Contraste insuficiente en la página Método (auditoría `color-contrast` de la v1).
- Nombre accesible del logotipo distinto del texto visible (`label-content-name-mismatch` de la v1).

### Sin cambios

- Las 12 rutas, con barra final (no hacen falta redirecciones).
- Correo, asunto y cuerpo del mensaje de «Solicitar diagnóstico».
- Sin cookies, sin analítica y sin recursos de terceros; único almacenamiento local: `localStorage.motion`.
- Datos del titular y fecha de los textos legales (20 de octubre de 2026).
