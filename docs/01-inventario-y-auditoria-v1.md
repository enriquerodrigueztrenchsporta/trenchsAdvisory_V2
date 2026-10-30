# Fase 1 · Inventario y auditoría de la web v1.0

- Fecha: 2026-10-30
- Origen: repositorio `enriquerodrigueztrenchsporta/Trenchs-Advisory`, rama `main`, commit `cbbf95b` (Astro 7).
- Publicación actual: `https://enriquerodrigueztrenchsporta.github.io/Trenchs-Advisory/` (GitHub Pages, subruta).
- Sector: consultoría de estrategia, finanzas, datos, tecnología e IA para empresas y administraciones públicas.
- La v1 no se ha modificado. Este documento se ha elaborado leyendo su código fuente completo (12 páginas generadas).

Cada bloque de contenido lleva un identificador (`H-03`, `S2-T4`…) que reutilizará la tabla de correspondencia v1 → v2.

---

## 1. URLs existentes

| # | Ruta | Título `<title>` | Metadescripción |
|---|---|---|---|
| U1 | `/` | Trenchs Advisory · Consultoría de estrategia, finanzas, datos e IA | Integramos estrategia, finanzas, datos, tecnología e inteligencia artificial para que empresas y administraciones públicas tomen mejores decisiones. |
| U2 | `/servicios/inteligencia-de-negocio/` | Inteligencia de negocio · Trenchs Advisory | (intro del servicio) |
| U3 | `/servicios/analitica-avanzada/` | Analítica avanzada · Trenchs Advisory | (intro del servicio) |
| U4 | `/servicios/consultoria-financiera/` | Consultoría financiera · Trenchs Advisory | (intro del servicio) |
| U5 | `/servicios/transformacion-digital/` | Transformación digital · Trenchs Advisory | (intro del servicio) |
| U6 | `/servicios/inteligencia-artificial-aplicada/` | Inteligencia artificial aplicada · Trenchs Advisory | (intro del servicio) |
| U7 | `/firma/quienes-somos/` | Quiénes somos · Trenchs Advisory | Integramos estrategia, finanzas, datos, tecnología e inteligencia artificial bajo un único responsable y una sola lógica económica. |
| U8 | `/firma/metodo/` | Método · Trenchs Advisory | Diagnóstico, diseño, construcción, adopción y mejora continua: el método común a todos nuestros proyectos. |
| U9 | `/firma/mision-vision-principios/` | Misión, visión y principios · Trenchs Advisory | Transformar la incertidumbre en estrategia, los datos en oportunidades y la tecnología en una ventaja competitiva real y sostenible. |
| U10 | `/legal/aviso-legal/` | Aviso legal y condiciones de uso · Trenchs Advisory | Datos identificativos del titular… y condiciones de uso del sitio. |
| U11 | `/legal/privacidad/` | Política de privacidad · Trenchs Advisory | Cómo trata Trenchs Advisory los datos personales… |
| U12 | `/legal/cookies/` | Política de cookies · Trenchs Advisory | La web no utiliza cookies ni herramientas de seguimiento. |

Anclas internas usadas: `#contenido`, `#enfoque`, `#servicios`, `#metodo`, `#a-la-medida`, `#por-que`.
No hay página 404 propia, `sitemap.xml` ni `robots.txt`.

---

## 2. Inventario de contenido

### 2.1 Datos de negocio y contacto

| ID | Dato | Valor en la v1 | Dónde aparece |
|---|---|---|---|
| D1 | Nombre comercial | Trenchs Advisory | Todo el sitio |
| D2 | Titular | Enrique Rodríguez-Trenchs Porta (autónomo) | Aviso legal, privacidad, © del pie, cierre |
| D3 | Correo | enriquetrenchsporta@gmail.com | Cabecera (vía botón), cierre, pie, legales |
| D4 | Acción principal | «Solicitar diagnóstico» → `mailto:` con asunto «Solicitud de diagnóstico – sesión inicial» y cuerpo (Organización / Qué nos gustaría resolver) | Cabecera, hero de portada, cierre de cada página |
| D5 | Lema | «Decisiones más inteligentes. Organizaciones más competitivas.» | Hero de portada (h1), pie |
| D6 | Público | Empresas y administraciones públicas; pymes, empresas familiares, cooperativas, ayuntamientos, entidades locales | Portada, quiénes somos, misión |
| D7 | Modalidades | Proyecto cerrado · Servicio recurrente · Formación (sin precios) | Portada (A la medida) |
| D8 | Modo de trabajo | En remoto («cercanía sin estructura física») | Quiénes somos (Por qué ahora) |
| D9 | Alojamiento / proveedores | GitHub Pages; Gmail | Privacidad, cookies |
| — | Teléfono, NIF, domicilio, horario, precios | **No existen** (NIF y domicilio vacíos a propósito en `legal.ts`) | — |

### 2.2 Portada (U1)

| ID | Bloque | Contenido |
|---|---|---|
| H-01 | Hero | Kicker «Consultoría de estrategia, finanzas, datos e IA». H1 = lema D5. Entradilla «Integramos estrategia, finanzas, datos y tecnología para que empresas y administraciones decidan con evidencia, anticipación y criterio económico.» CTA D4. Diagrama: Datos, Finanzas, Operaciones, Mercado → Decisión. |
| H-02 | 01 · Negocio primero | «Más herramientas no significan mejores decisiones.» + «La tecnología solo aporta valor cuando responde a una pregunta de negocio. Sin esa pregunta, invertir más no garantiza decidir mejor.» Diagrama: Finanzas/Ventas/Operaciones/Mercado → «Una visión». |
| H-03 | 02 · Cómo pensamos | «Cinco preguntas, de la información a la decisión.» + entradilla. Pestañas con avance automático: 5 preguntas × (disciplina, entregable típico) — ver Q1–Q5. |
| H-04 | 03 · Capacidades | «Cinco capacidades. Un mismo objetivo.» + entradilla. Lista de las 5 áreas (nombre + subtítulo) y diagrama radial «Mejores decisiones». |
| H-05 | 04 · Método (resumen) | «Ningún proyecto termina en un informe.» + «Termina en una decisión tomada y un proceso funcionando…». 5 fases con objetivo (M1–M5). Enlace «Ver el método completo». |
| H-06 | 05 · A la medida | «Cada organización es distinta. Nuestro trabajo, también.» + 4 puntos: tamaño y presupuesto; forma de colaborar (D7); sector y contexto; herramientas que ya tiene. |
| H-07 | Cierre | Kicker «Primer paso». «Hablemos de la decisión que hoy le quita más tiempo.» + texto + CTA D4 + correo D3 + aviso de protección de datos. |

**Cinco preguntas (Q1–Q5)**, compartidas con las páginas de servicio:

| ID | Pregunta | Disciplina | Entregable típico |
|---|---|---|---|
| Q1 | ¿Qué está ocurriendo? | Inteligencia de negocio | Cuadro de mando con indicadores fiables y una única versión de la verdad. |
| Q2 | ¿Por qué está ocurriendo? | Analítica y diagnóstico financiero | Análisis de causas, desviaciones y rentabilidad real. |
| Q3 | ¿Qué ocurrirá probablemente? | Analítica avanzada y forecast | Modelos predictivos y simulación de escenarios. |
| Q4 | ¿Qué decisión tomar? | Estrategia y finanzas | Recomendación priorizada con impacto cuantificado. |
| Q5 | ¿Cómo ejecutarla? | Tecnología e IA aplicada | Automatización, hoja de ruta y acompañamiento hasta el resultado. |

### 2.3 Servicios (U2–U6)

Cada página: cabecera (nombre + intro), «La pregunta que responde» (+ claim), mapa de las 5 preguntas, tabla
Servicio / Entregable / Beneficio, nota «Los beneficios indicados describen el objetivo…», «Cómo lo abordamos»
(5 fases + enlace al método), «Otras capacidades» y cierre personalizado.

| ID | Área | Subtítulo | Claim | Preguntas | Filas de la tabla |
|---|---|---|---|---|---|
| S1 | Inteligencia de negocio | Una visión fiable de la información. | Una única versión de la verdad. | Q1 | 4: Dashboards ejecutivos · Cuadros de mando Power BI · Definición de KPIs estratégicos · Reporting automatizado |
| S2 | Analítica avanzada | Anticipar demanda, resultados y escenarios. | Anticipar en lugar de reaccionar. | Q3 | 4: Modelos predictivos · Forecast financiero · Forecast operativo · Simulación de escenarios |
| S3 | Consultoría financiera | Entender rentabilidad, caja y decisiones de inversión. | Rentabilidad real, decisiones sólidas. | Q2, Q4 | 5: Modelización financiera · Planificación presupuestaria · Rentabilidad por línea de negocio · Tesorería · Análisis de inversiones |
| S4 | Transformación digital | Procesos y tecnología con criterio de negocio. | Invertir con orden y sin sesgo de fabricante. | Q5 | 5: Diagnóstico digital · Roadmap tecnológico · Selección de herramientas · Gobierno del dato · Digitalización de procesos |
| S5 | Inteligencia artificial aplicada | Casos de uso con utilidad y retorno identificable. | IA con criterio, no por moda. | Q5 | 5: Identificación de casos de uso · Automatización documental · Asistentes internos · IA para soporte a la decisión · Formación ejecutiva |

23 servicios en total, cada uno con entregable y beneficio (texto íntegro en `src/data/services.ts` de la v1; se migra
sin cambios).

### 2.4 La firma

| ID | Página | Bloque | Contenido |
|---|---|---|---|
| F-01 | Quiénes somos | Cabecera | «Integramos lo que otros ofrecen por separado.» + «…No vendemos tecnología ni informes: vendemos capacidad de decisión.» |
| F-02 | Quiénes somos | 01 · Qué hacemos | «Estrategia, finanzas, datos, tecnología e IA en la misma mesa.» 5 disciplinas × 3 puntos → «Capacidad de decisión». |
| F-03 | Quiénes somos | 02 · El punto de partida | «Cinco problemas de fondo que abordamos.» 5 tarjetas (síntoma, causa, consecuencia). |
| F-04 | Quiénes somos | 03 · Por qué ahora | «El ritmo de cambio ya no permite gestionar mirando por el retrovisor.» 4 razones: IA, Fondos, Reporting, Remoto. |
| F-05 | Quiénes somos | 04 · Por qué nosotros | «El diferencial no es la herramienta. Es el criterio.» 7 razones: A la medida (destacada), Interlocución única, Bilingüismo negocio–tecnología, Estructura ligera, Rapidez de decisión, Conocimiento del contexto, Impacto medible. |
| F-06 | Quiénes somos | Cierre | «Conózcanos» · «La mejor forma de saber cómo trabajamos es una primera conversación.» |
| F-07 | Método | Cabecera | «Del problema a una solución funcionando.» + entradilla. |
| F-08 | Método | 01 · Las cinco fases | «Cada fase termina con algo tangible.» Regla 01 y Regla 02. Fases M1–M5 con objetivo y resultado. |
| F-09 | Método | 02 · La relación | «Empezamos pequeño. Crecemos cuando el valor está demostrado.» Entrada → Ampliación → Recurrencia → Socio estratégico. |
| F-10 | Método | Cierre | «Fase 1» · «Todo empieza entendiendo bien el problema.» |
| F-11 | Misión… | 01 · Misión | Cita completa (incertidumbre → estrategia, datos → oportunidades, tecnología → ventaja competitiva). |
| F-12 | Misión… | 02 · Visión | «El socio estratégico en las decisiones que importan.» + texto + 5 confluencias. |
| F-13 | Misión… | 03 · Principios | «Seis principios, sin excepciones.» Negocio primero · Independencia tecnológica · Rigor analítico · Transferencia de capacidad · Pragmatismo · Confidencialidad y gobierno del dato. |
| F-14 | Misión… | Cierre | «Trabajemos juntos» · «Si comparte estos principios, tenemos mucho de qué hablar.» |

**Fases del método (M1–M5)**: Diagnóstico, Diseño, Construcción, Adopción, Mejora continua, cada una con objetivo y
resultado.

### 2.5 Navegación, pie y legales

| ID | Bloque | Contenido |
|---|---|---|
| N-01 | Menú «Servicios» | Destacado «Cinco áreas, una lógica» · «El producto no es la herramienta. El producto es la capacidad de decisión.» + 5 áreas. |
| N-02 | Menú «La firma» | Destacado «Trenchs Advisory» · «Estrategia, finanzas, datos y tecnología, integrados para decidir mejor.» + 3 páginas con subtítulo. |
| N-03 | Pie | Logo, lema D5, columnas Servicios / La firma / Contacto, ©, enlaces legales, botón «Pausar animaciones». |
| L-01 | Aviso legal (U10) | 10 apartados. Afirma: «La web… no contiene formularios. El contacto se realiza por correo electrónico.» |
| L-02 | Privacidad (U11) | 9 apartados (RGPD/LOPDGDD; Gmail y GitHub como proveedores). |
| L-03 | Cookies (U12) | 5 apartados. Sin cookies; único almacenamiento: `localStorage.motion`. |

Fecha de los textos legales: 20 de octubre de 2026.

### 2.6 Marca y recursos gráficos

- **Logotipo**: símbolo de seis piezas (bloque partido por una curva) + «TRENCHS / ADVISORY» en Inter Light con
  espaciado amplio. Archivos: `public/logo-trenchs-advisory.svg`, `public/favicon.svg`, componente `LogoMark`.
- **Paleta**: verde `#1F3A33` (principal), `#274840`, `#3E6B5E`, `#7A9E91`, `#9DB5AC`; oro `#7A5C25` (texto),
  `#B08A3E`, `#D4B778`; crema `#F5F3EE`, `#EDEAE2`, `#E2DDD1`; tinta `#1A1C1B`, `#4D524F`, `#666A66`.
  Contrastes AA documentados.
- **Tipografía**: Newsreader (serifa, titulares) + Inter (texto), autoalojadas.
- **Imágenes propias**: **ninguna**. Toda la parte visual son diagramas SVG generados en código.
- **Testimonios, casos, clientes, equipo, premios, cifras de resultados**: **ninguno**.
- **Formularios**: ninguno (contacto solo por `mailto:`).

---

## 3. Diagnóstico

### 3.1 Lo que funciona y se conserva

- Texto riguroso, sin exageraciones, con glosario de marca (`CONTEXT.md`) y distinciones cuidadas (sesión inicial ≠
  fase de Diagnóstico ≠ servicio Diagnóstico digital).
- Arquitectura de contenido sólida: cinco preguntas → cinco áreas → un método.
- Cumplimiento: sin cookies, sin analítica, sin recursos de terceros, páginas legales completas.
- Rendimiento y accesibilidad casi máximos (ver 3.5).
- Identidad reconocible: verde profundo, oro y crema, serifa editorial.

### 3.2 Diseño y dirección artística

1. **Ritmo monótono.** Casi todas las secciones repiten la misma fórmula: eyebrow numerado «01…05» + titular en
   serifa + entradilla + rejilla. A partir de la tercera sección la página «suena» a plantilla.
2. **El hero no explica el negocio en 3 segundos.** El H1 es el lema («Decisiones más inteligentes…»), que es una
   aspiración, no una oferta. Lo que la firma hace está en el kicker, en cuerpo pequeño.
3. **Sin imagen humana.** Una consultoría vende confianza en personas; la web no muestra a nadie ni nada real. Los
   diagramas son buenos pero son la única capa visual.
4. **Profundidad visual plana.** Todo es crema con alguna banda verde; falta contraste de escala (tipografía muy
   grande vs. muy pequeña), cambios de plano y momentos de pausa.

### 3.3 Estructura y conversión

1. **Acción principal**: «Solicitar diagnóstico» (correo). Es correcta para el sector, pero:
   - un `mailto:` falla en silencio si el visitante no tiene programa de correo configurado (habitual con webmail);
   - no hay alternativa visible (copiar el correo, teléfono, agenda);
   - en portada aparece solo dos veces (hero y cierre), separadas por cinco secciones.
2. **Prueba de calidad inexistente.** No hay casos, testimonios ni clientes. No se puede inventar: se suple con lo
   que sí existe (método con entregables concretos, principios verificables, 23 servicios con entregable) y se marca
   como [PENDIENTE].
3. **Contenido repartido y algo duplicado.** «A la medida» aparece en portada (H-06) y como razón destacada en
   Quiénes somos (F-05). El método aparece resumido en portada y completo en su página. Las disciplinas (F-02) y las
   capacidades (H-04) cuentan casi lo mismo desde dos ángulos.
4. **Información práctica dispersa.** Modalidades, trabajo en remoto y forma de empezar están en tres páginas
   distintas; un cliente no encuentra en un solo sitio «cómo se empieza a trabajar con ustedes».
5. **Credibilidad**: correo `@gmail.com` y dominio `github.io` restan percepción de firma establecida.

### 3.4 Accesibilidad

- Base buena: un `h1` por página, enlace «Saltar al contenido», foco visible, contrastes AA, `prefers-reduced-motion`.
- **Fallo WCAG 2.2.2 (Pausar, detener, ocultar):** las pestañas de «Cómo pensamos» avanzan solas cada 4,2 s y el
  botón «Pausar animaciones» del pie **no las detiene** (solo se paran con `prefers-reduced-motion`).
- Aviso `label-content-name-mismatch` en el logotipo (nombre accesible «Trenchs Advisory, inicio» frente al texto
  visible).
- Tablas de servicio con `role="table"` sobre `div`: funcionan, pero una `<table>` real o una lista de definición
  sería más robusta.

### 3.5 Rendimiento (Lighthouse)

Medición realizada el 2026-10-30 sobre este mismo commit (`cbbf95b`), Lighthouse 12.6.1, Chrome sin interfaz,
servidor con gzip. Fuente: `trenchs-advisory-web-v2/docs/auditoria-v1.md`. Se repetirá en la misma sesión que la
medición de la v2 para la comparativa final.

| Página | Modo | Rend. | Acces. | Buenas pr. | SEO | LCP | Peso |
|---|---|---|---|---|---|---|---|
| Portada | móvil | 97 | 100 | 100 | 100 | 2,1 s | 196 KiB |
| Portada | escritorio | 100 | 100 | 100 | 100 | 0,5 s | 196 KiB |
| Servicio | móvil | 98 | 100 | 100 | 100 | 2,0 s | 191 KiB |
| Quiénes somos | móvil | 97 | 100 | 100 | 100 | 2,1 s | 193 KiB |
| Misión… | móvil | 98 | 100 | 100 | 100 | 2,0 s | 189 KiB |
| Privacidad | móvil | 98 | 100 | 100 | 100 | 2,0 s | 189 KiB |

**Lectura honesta:** la v1 está en el techo. Next.js + React + Framer Motion añaden ~100 KB de JavaScript que Astro
no envía; la otra v2 ya existente quedó entre 89 y 96 en móvil. El objetivo realista es **≥ 95 en móvil en todas las
páginas** (componentes de servidor por defecto, Motion solo donde aporta, carga diferida) y 100 en accesibilidad,
buenas prácticas y SEO. Superar a la v1 en rendimiento no es alcanzable con el stack pedido.

### 3.6 SEO

- Correcto: títulos y descripciones únicos, `lang="es"`, HTML semántico, Open Graph básico.
- Falta: `<link rel="canonical">`, `og:url`, `og:image` (sin imagen al compartir en LinkedIn), datos estructurados
  (`ProfessionalService` / `Organization`, `Service`, `BreadcrumbList`), `sitemap.xml`, `robots.txt`, página 404.
- Dominio `github.io` en subruta: limita la autoridad del dominio.

---

## 4. Observación sobre el proyecto `trenchs-advisory-web-v2` existente

En `proyectos/trenchs-advisory-web-v2` hay otra v2 (12 commits del 2026-10-30, Next.js 15, sin publicar) con un
enfoque distinto: añade una línea nueva de **Presencia digital** para pymes, que protagoniza la portada, y cinco
maquetas de negocios ficticios. Ese enfoque añade servicios y contenido que no están en la v1, lo que choca con las
reglas de este encargo («conservar el 100 %, no inventar servicios»). `trenchsAdvisory_V2` parte de cero sobre el
contenido de la v1. El proyecto existente no se ha modificado.

---

## 5. Elementos [PENDIENTE] detectados

| # | Elemento | Por qué importa en consultoría | Qué hace la v2 mientras tanto |
|---|---|---|---|
| P1 | Fotografía propia (retrato profesional del titular, entorno de trabajo, sesión con cliente) | La confianza se compra a personas | Composición tipográfica y diagramática, sin fotos de banco |
| P2 | Casos o testimonios reales y autorizados | Única prueba de calidad que falta | Sección no publicada; se apoya en método, entregables y principios |
| P3 | Clientes o sectores atendidos (con permiso) | Credibilidad | No se muestra |
| P4 | Presentación de la persona responsable («Interlocución única»: quien vende ejecuta) | La v1 habla en «nosotros» sin nombrar a nadie por decisión de marca | Se mantiene el «nosotros»; se propone como mejora |
| P5 | Dominio propio y correo corporativo | Credibilidad; SEO | Rutas preparadas para cualquier dominio |
| P6 | Agenda de reuniones (p. ej. Cal.com, Calendly) | Reduce la fricción del primer contacto | `mailto:` + copiar correo; integrarla requiere aprobación y actualizar privacidad |
| P7 | Teléfono / WhatsApp de contacto | Canal alternativo | No se muestra |
| P8 | NIF y domicilio (LSSI-CE art. 10) | Obligación legal en web de actividad económica | Campos vacíos, como en la v1 |
| P9 | Imagen para redes (`og:image`) | Previsualización en LinkedIn | Se genera con logo y lema (sin datos nuevos) |
