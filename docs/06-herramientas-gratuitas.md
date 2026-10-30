# Herramientas gratuitas · Calculadora de Rentabilidad Empresarial

Sección nueva (`/herramientas/`) con una única herramienta publicada: la Calculadora de Rentabilidad Empresarial
(`/herramientas/calculadora-rentabilidad/`). Gratis, sin registro y con todos los resultados visibles sin dar datos
personales. Termina, si la persona quiere, en una solicitud de contacto que adjunta el diagnóstico.

## Decisiones técnicas

| Decisión | Motivo |
|---|---|
| Sin dependencias nuevas | Gráficos en SVG propio y animación con Framer Motion, ya presente. |
| Cálculo en el navegador, en céntimos enteros | Sumas exactas; solo los cocientes usan decimales y se redondean a céntimos. |
| Estado solo en memoria | Sin `localStorage`, sin URL, sin analítica: las cifras desaparecen al cerrar la pestaña. |
| Envío por `mailto:` por defecto | Es el sistema de contacto que ya usa la web (estática en GitHub Pages, sin backend). No añade terceros que traten datos ni requiere cambiar los encargados del tratamiento. |
| Endpoint opcional (`NEXT_PUBLIC_CONTACT_ENDPOINT`) | Envío directo con confirmación real cuando el propietario apruebe un servicio. Código de servidor listo en `server/` y `src/lib/contact/server.ts`. |
| Un único generador del mensaje (`buildLeadMessage`) | La vista previa, el `mailto:` y el servidor usan la misma función: lo que se ve es lo que se envía. |
| Textos en «tú» | Son los textos exactos del encargo. El resto de la web habla de «usted»: conviene que el propietario decida si unificar. |

## Módulos

| Módulo | Archivo |
|---|---|
| Catálogo de herramientas | `src/content/tools.ts`, `src/components/tools/ToolCard.tsx`, `src/app/herramientas/page.tsx` |
| Formulario financiero (pasos 1 y 2) | `src/components/calculator/StepCompany.tsx`, `StepFinancials.tsx`, `fields.tsx` |
| Validaciones | `src/lib/profitability/validation.ts`, `money.ts` (`parseAmount`) |
| Motor de cálculo | `src/lib/profitability/engine.ts` |
| Dashboard | `src/components/calculator/Dashboard.tsx` |
| Gráficos | `src/components/calculator/charts/` |
| Simulador | `src/lib/profitability/scenarios.ts`, `src/components/calculator/Simulator.tsx` |
| Diagnóstico | `src/lib/profitability/diagnosis.ts`, `src/components/calculator/DiagnosisPanel.tsx` |
| Motor de soluciones | `src/lib/profitability/solutions.ts` |
| Pop-up y formulario de contacto | `src/components/calculator/LeadModal.tsx` |
| Mensaje comercial y validación del contacto | `src/lib/contact/lead.ts` |
| Integración de envío | `src/lib/contact/transport.ts` (cliente), `src/lib/contact/server.ts` + `server/contact-worker.ts` (servidor) |
| Orquestación de pasos | `src/components/calculator/Calculator.tsx` |

Para añadir otra herramienta: una entrada en `TOOLS` (`src/content/tools.ts`) y su página en
`src/app/herramientas/<slug>/page.tsx`. La tarjeta, el sitemap y la navegación se generan solos.

## Fórmulas

V = ventas · CV = costes variables (compras + costes asociados a ventas + otros variables) · GF = gastos fijos sin
personal · CP = personal (salarios + Seguridad Social de empresa, salvo que ya esté incluida + otros) · CF = GF + CP.

| Indicador | Fórmula | Si no es calculable |
|---|---|---|
| Margen de contribución | MC = V − CV | — |
| Tasa de margen | TMC = MC / V | V = 0 → «No disponible» |
| Resultado operativo simplificado | R = MC − CF | — (los negativos se muestran) |
| Margen de resultado | MR = R / V | V = 0 → «No disponible» |
| Punto de equilibrio | PE = CF / TMC | V = 0 → sin ventas; TMC ≤ 0 y CF > 0 → «no alcanzable»; TMC ≤ 0 y CF = 0 → sin margen positivo; CF = 0 y TMC > 0 → 0 |
| Margen de seguridad | MS = V − PE; MS% = MS / V | sin PE válido → «No disponible» |
| Peso del personal / variables | CP / V; CV / V | V = 0 → «No disponible» |

**Simulador** (precio y mezcla constantes): V2 = V·(1+Δvol) · CV2 = CV·(1+Δvol)·(1+Δcoste unitario) ·
GF2 = GF·(1+Δfijos) · CP2 = CP·(1+Δpersonal) · R2 = V2 − CV2 − GF2 − CP2. Ventas para un objetivo O:
V* = (GF2 + CP2 + O) / TMC2, con TMC2 = 1 − (CV/V)·(1+Δcoste unitario); si TMC2 ≤ 0, «no alcanzable».

Escenarios predefinidos (ilustrativos, no previsiones): **conservador** volumen −10 %, coste unitario +5 %, fijos
+3 %, personal +3 %; **optimista** volumen +10 %, coste unitario −3 %.

## Reglas del diagnóstico y soluciones

| Condición | Diagnóstico | Servicio recomendado |
|---|---|---|
| V = 0 o ningún coste | Datos insuficientes | Diagnóstico financiero personalizado |
| R < 0 | Empresa con pérdidas | Consultoría de rentabilidad y optimización de costes |
| R = 0 | Punto de equilibrio (mismas soluciones que margen reducido) | Análisis financiero y mejora de márgenes |
| R > 0 y MR < 10 % | Rentable con margen reducido | Análisis financiero y mejora de márgenes |
| R > 0 y MR ≥ 10 % | Rentable | Business Intelligence y automatización financiera |

El 10 % (`LOW_MARGIN_THRESHOLD`) es un **criterio orientativo de producto**, no un estándar ni una comparación
sectorial, y así se indica en pantalla. Los hallazgos y recomendaciones se redactan solo con cifras calculadas
(margen por cada 100 €, distancia al punto de equilibrio, partida de mayor peso, ahorro por cada 1 % de costes
variables…); las cuantificadas se presentan como estimaciones, nunca como resultados garantizados.

## Contacto y consentimiento

1. El CTA «Descubre cómo mejorar tu rentabilidad con Trenchs Advisory» abre el pop-up (nunca se abre solo).
2. El pop-up muestra título, texto y botón según el diagnóstico; «Seguir explorando» lo cierra sin perder nada.
3. El formulario pide nombre y correo (obligatorios), empresa, teléfono y mensaje (opcionales).
4. Dos casillas desmarcadas: la autorización para compartir el análisis (opcional) y la lectura de la política de
   privacidad (obligatoria para enviar). Son independientes.
5. «Ver qué información se compartirá» muestra el asunto y el texto exactos.
6. Sin autorización, el mensaje solo lleva contacto, herramienta y mensaje adicional: ninguna cifra, clasificación,
   problema ni solución.

### Envío actual (`mailto:`)

Al enviar se abre el programa de correo de la persona con el asunto y el cuerpo preparados para el buzón de la firma.
La web **no puede saber si el correo se envió**, así que no muestra «Solicitud enviada correctamente»: indica que
falta pulsar «Enviar» en el correo y ofrece reabrirlo o copiar el mensaje (útil con webmail o con programas que
recortan enlaces `mailto:` largos; el mensaje con análisis ocupa unos 2,4 KB codificado).

### Activar el envío directo (configuración externa pendiente)

Requiere decisión y aprobación del propietario (normas 7 y 12 del espacio de trabajo):

1. Elegir proveedor. El código de referencia usa **Cloudflare Workers** (alojamiento del endpoint) y **Resend**
   (envío del correo). Permisos necesarios: una cuenta en cada servicio, un dominio verificado en Resend para el
   remitente y una clave de API de Resend con permiso solo de envío.
2. Desplegar `server/contact-worker.ts` con los secretos `RESEND_API_KEY`, `LEAD_TO`, `LEAD_FROM` y
   `ALLOWED_ORIGIN` (nunca en el repositorio).
3. Compilar la web con `NEXT_PUBLIC_CONTACT_ENDPOINT=https://…` (variable del flujo de GitHub Actions).
4. Actualizar la política de privacidad: Cloudflare y Resend pasan a ser encargados del tratamiento.

El servidor (`processLead`) valida tamaño (16 KB), JSON, trampa anti-bots y tiempo mínimo de rellenado, exige la
casilla de privacidad, **descarta el análisis si no hay autorización**, vuelve a validar y recalcular todas las cifras
con el mismo motor, envía solo texto plano y no registra importes ni datos personales. Pendiente si se activa:
limitación de frecuencia por IP (p. ej. reglas de Cloudflare).

## Pruebas

- `npm test`: 35 pruebas del motor, el simulador, el diagnóstico, las soluciones, la validación, el mensaje y el
  servidor (incluye ausencia de cifras sin autorización y envíos manipulados).
- `npm run typecheck`, `npm run build`, `npm run verify`.
- Revisión manual en Chrome (escritorio y 390 px): pasos, validaciones con foco en el primer error, conservación de
  datos, gráficos con tooltip, simulador por teclado, pop-up (Escape, foco devuelto, hoja inferior en móvil), vista
  previa con y sin autorización. No se ha pulsado el envío final por correo para no abrir el programa de correo del
  equipo; el texto enviado es el de la vista previa, cubierto por pruebas.

## Pendiente de revisión por el negocio

- Textos legales: privacidad (nuevo subapartado «Herramientas gratuitas», base legal del consentimiento para el
  análisis) y aviso legal (apartado 5). Conviene revisión jurídica antes de publicar.
- Tratamiento «tú» de la herramienta frente al «usted» del resto de la web.
- Umbral orientativo del 10 % y escenarios predefinidos.
