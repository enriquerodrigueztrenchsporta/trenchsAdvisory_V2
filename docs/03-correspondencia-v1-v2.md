# Correspondencia de contenidos v1.0 → v2.0

Cada bloque del inventario (`01-inventario-y-auditoria-v1.md`) y dónde aparece en la v2.

**Comprobación automática:** `npm run verify` extrae cada fragmento de texto visible de la v1 compilada y comprueba
que aparece en la v2. Resultado del 2026-10-30: **431 de 431 textos presentes**, más 3 reformulaciones documentadas
(apartado 7).

Leyenda: **Igual** = mismo texto; **Reubicado** = mismo texto en otro sitio; **Reformulado** = la información se
conserva con otra redacción; **Ampliado** = mismo texto con un formato que muestra más (p. ej. ya no hace falta pasar
el cursor).

## 1. Rutas

Las 12 rutas de la v1 se conservan idénticas, con barra final. No hacen falta redirecciones 301.

| v1 | v2 | Nota |
|---|---|---|
| `/` | `/` | Igual |
| `/servicios/<área>/` (×5) | `/servicios/<área>/` (×5) | Igual |
| `/firma/quienes-somos/`, `/firma/metodo/`, `/firma/mision-vision-principios/` | Igual | Igual |
| `/legal/aviso-legal/`, `/legal/privacidad/`, `/legal/cookies/` | Igual | Igual |
| — | `/404.html`, `/sitemap.xml`, `/robots.txt`, `/og.png` | Nuevos (técnicos, sin contenido de negocio) |

Con `BASE_PATH=/Trenchs-Advisory` la v2 reproduce también la subruta de GitHub Pages de la v1.

## 2. Datos de negocio

| ID | Dato | Dónde en la v2 | Estado |
|---|---|---|---|
| D1 | Nombre comercial | Todo el sitio, datos estructurados | Igual |
| D2 | Titular | Aviso legal, privacidad, © del pie, nota de protección de datos del cierre, JSON-LD (`founder`) | Igual |
| D3 | Correo | Cierre de cada página (enlace + **Copiar correo**), pie, legales | Igual, más visible |
| D4 | «Solicitar diagnóstico» (mismo asunto y cuerpo del correo) | Cabecera, hero, tras el método, cierre, barra fija en móvil, hero de cada servicio | Igual, repetido en más puntos |
| D5 | Lema | Pie (igual que la v1), imagen para redes, JSON-LD (`slogan`) | Reubicado: deja de ser el H1 (ver 7) |
| D6 | Público | Hero de portada, Quiénes somos | Igual |
| D7 | Modalidades | Portada, «A la medida» | Igual |
| D8 | Trabajo en remoto | Quiénes somos, «Por qué ahora» | Igual |
| D9 | Proveedores (GitHub Pages, Gmail) | Privacidad, cookies | Igual |

## 3. Portada

| ID | Bloque v1 | v2 | Estado |
|---|---|---|---|
| H-01 | Hero: kicker, H1 (lema), entradilla, CTA, diagrama | Hero: kicker igual; H1 nuevo a partir de la entradilla; entradilla a partir de las descripciones de la v1; CTA; diagrama redibujado; franja con las cinco áreas | Reformulado (ver 7) |
| H-02 | 01 · Negocio primero | Sección 2 «Negocio primero»: titular, entradilla que se ilumina al leer, diagrama «Una visión» | Igual |
| H-03 | 02 · Cómo pensamos (pestañas automáticas) | Sección 3: las cinco preguntas en un recorrido ligado al scroll, con disciplina, entregable y enlace a las áreas que responden a cada una | Igual; interacción nueva (corrige WCAG 2.2.2) |
| H-04 | 03 · Capacidades | Sección 4 «Capacidades»: titular, entradilla, diagrama «Mejores decisiones», tarjeta por área (nombre, subtítulo, claim, n.º de servicios) | Igual; añade el claim de cada área (de la v1) |
| H-05 | 04 · Método | Sección 5 «Método»: titular, entradilla, cinco fases con su objetivo, enlace «Ver el método completo» + CTA | Igual |
| H-06 | 05 · A la medida | Sección 6 «A la medida»: cuatro puntos, modalidades y enlaces a Quiénes somos y Método | Igual |
| H-07 | Cierre «Primer paso» | Cierre | Igual + Copiar correo |
| Q1–Q5 | Preguntas, disciplina, entregable | Portada (sección 3), hero de cada servicio | Igual |

## 4. Servicios (S1–S5)

| Bloque v1 | v2 | Estado |
|---|---|---|
| Cabecera: «Servicios · 0N», nombre, intro | Hero oscuro con migas de pan | Igual |
| «La pregunta que responde» + claim | Tarjeta en el hero | Igual |
| Mapa de las cinco preguntas | Tarjeta en el hero, con las preguntas activas resaltadas | Igual |
| «Qué hacemos» + tabla Servicio / Entregable / Beneficio (23 filas) | Misma sección, como `<table>` real (en móvil, fichas con etiqueta) | Igual |
| Nota «Los beneficios indicados describen el objetivo…» | Bajo la tabla | Igual |
| «Cómo lo abordamos» + 5 fases + enlace | Igual | Igual |
| «Otras capacidades» | Igual | Igual |
| Cierre personalizado | Igual | Igual |

## 5. La firma

| ID | Bloque v1 | v2 | Estado |
|---|---|---|---|
| F-01 | Quiénes somos · cabecera | Hero | Igual |
| F-02 | Qué hacemos (5 disciplinas × 3 puntos → Capacidad de decisión) | Rejilla de cinco columnas con líneas que convergen | Igual |
| F-03 | El punto de partida (tarjetas que se voltean) | Lista con síntoma, causa y consecuencia siempre visibles | Ampliado (ver 7) |
| F-04 | Por qué ahora | Titular fijo + cuatro razones | Igual |
| F-05 | Por qué nosotros (7 razones) | Razón destacada + seis tarjetas, en plano oscuro (`#por-que`) | Igual |
| F-06 | Cierre «Conózcanos» | Cierre | Igual |
| F-07 | Método · cabecera | Hero | Igual |
| F-08 | Las cinco fases + reglas | Reglas en columna fija; fases con objetivo y resultado, carril que se rellena con el scroll | Igual |
| F-09 | La relación (4 etapas) | Escalera de cuatro peldaños (`#relacion`) | Igual |
| F-10 | Cierre «Fase 1» | Cierre | Igual |
| F-11 | Misión | Cita grande que se ilumina al leerla | Igual |
| F-12 | Visión + 5 confluencias | Igual | Igual |
| F-13 | Seis principios | Rejilla con numeración grande | Igual |
| F-14 | Cierre «Trabajemos juntos» | Cierre | Igual |

## 6. Navegación, pie y legales

| ID | Bloque v1 | v2 | Estado |
|---|---|---|---|
| N-01, N-02 | Menús «Servicios» y «La firma» con texto destacado | Menús desplegables de ancho completo; menú móvil a pantalla completa | Igual |
| N-03 | Pie | Pie: logo, lema, Servicios, La firma, Contacto, ©, legales, «Pausar animaciones» | Igual |
| L-01 | Aviso legal (10 apartados) | Igual, con índice lateral | Igual |
| L-02 | Privacidad (9 apartados) | Igual, con índice lateral | Igual |
| L-03 | Cookies (5 apartados) | Igual, con índice lateral | Igual |
| — | Fecha de los textos legales: 20-10-2026 | Igual | Igual: los textos legales no cambian. La v2 sigue sin cookies, sin formularios y sin recursos de terceros; «Copiar correo» solo usa el portapapeles. |

## 7. Textos reformulados o retirados

| Texto v1 | Qué ha pasado | Dónde está la información en la v2 |
|---|---|---|
| H1 de portada: «Decisiones más inteligentes. Organizaciones más competitivas.» | Pasa a ser lema (pie, imagen para redes). El H1 debe decir en 3 s qué hace la firma. | Pie; nuevo H1 «Decisiones con evidencia, anticipación y criterio económico.» (de la entradilla de la v1) |
| «Integramos estrategia, finanzas, datos y tecnología para que empresas y administraciones decidan con evidencia, anticipación y criterio económico.» | Se divide entre H1 y entradilla; la entradilla une esta frase con la descripción de la portada y la de Quiénes somos («bajo un único responsable y una sola lógica económica»). | Hero de portada |
| «Pase el cursor o toque cada tarjeta para ver su causa y su coste real.» | Instrucción de una interacción que desaparece: causa y consecuencia se muestran siempre. Se conserva la frase anterior, «Ninguno se resuelve comprando una herramienta.» | Quiénes somos, «El punto de partida» |
| «Causa y consecuencia ↻» | Pista de la tarjeta volteable. | Las etiquetas «Causa» y «Consecuencia» siguen junto a cada texto |

No se ha añadido ningún dato, servicio, precio, cifra, testimonio, cliente ni promesa que no estuviera en la v1.

## 8. Textos de interfaz nuevos (para validar por el propietario)

Microtextos de navegación sin datos de negocio:

- Botón secundario del hero: «Ver los cinco servicios».
- Contacto: «Copiar correo» / «Copiado».
- Migas de pan: «Inicio», «Servicios», «La firma», «Información legal».
- Etiqueta «Resultado» en cada fase del método (el texto del resultado es el de la v1).
- Índice de las páginas legales: «Índice».
- Etiquetas del campo de datos animado (decorativo, oculto a lectores de pantalla): «Cuadro de mando», «Causas»,
  «Previsión», «Alternativas», «Ejecución».
- Página 404: «Error 404», «Esta página no existe.», «Puede volver a la portada o ir directamente a una de nuestras
  áreas de servicio.», «Volver a la portada».
