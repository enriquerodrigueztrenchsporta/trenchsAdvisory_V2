# Chatbot demostrativo global

Botón flotante «Asistente virtual · Demo interactiva» en la esquina inferior derecha de todas las páginas. Es una
herramienta comercial, no un chatbot real: **no usa IA, no llama a ninguna API y no responde**. Cualquier mensaje
válido abre la propuesta de asistentes de IA de Trenchs Advisory.

## Integración

- Una sola instancia, en el layout raíz (`src/app/layout.tsx`): aparece en todas las rutas (portada, servicios,
  firma, herramientas, legales y 404) y en las futuras que usen ese layout. Comprobado en las 17 páginas compiladas:
  exactamente un chatbot por página.
- No existen en este proyecto una página «Contacto» (el contacto es el cierre de cada página y «Solicitar
  diagnóstico») ni «Web Check».
- Capas: botón y ventana `z-40` (como la barra móvil), por debajo de la cabecera y su menú móvil (`z-50`) y de los
  pop-ups (`z-[70]`).
- En móvil, cuando aparece la barra fija «Solicitar diagnóstico», el botón sube por encima: `MobileCta` marca
  `html[data-mobile-cta]` y `globals.css` (`.chat-dock`) recoloca el chatbot.

## Archivos

| Pieza | Archivo |
|---|---|
| Botón flotante, ventana de chat y estado de la demo | `src/components/chatbot/ChatbotDemo.tsx` |
| Pop-up comercial y formulario | `src/components/chatbot/AssistantModal.tsx` |
| Sectores, funcionalidades, servicio y mensaje comercial | `src/lib/chatbot/message.ts` (+ `chatbot.test.ts`) |
| Formulario de contacto compartido con PYME Check | `src/components/contact/LeadForm.tsx` |
| Diálogo accesible | `src/components/ui/Modal.tsx` |

## Comportamiento

1. El botón abre la ventana (sin cambiar de página ni bloquear el scroll) y pone el foco en el campo.
2. Enviar (botón o Enter) recorta espacios; si queda vacío, avisa y no hace nada más.
3. Con texto: se muestra como burbuja del visitante y se abre al instante el pop-up. Sin «escribiendo…», sin
   respuestas simuladas y sin red.
4. Cerrar el pop-up (Escape, la X, el fondo o «Seguir explorando la web») cierra también la demo, **borra lo escrito**
   y devuelve el foco al botón flotante. Al reabrir, la demo empieza de cero.
5. «Quiero un asistente para mi empresa» transforma el pop-up en el formulario: nombre y correo obligatorios;
   empresa, teléfono, sector y mensaje opcionales; servicio solicitado fijo («Desarrollo de chatbot y asistente de IA
   personalizado»); casilla de privacidad obligatoria; vista previa exacta del mensaje.

Lo escrito en el chat **nunca** forma parte de la solicitud: `buildAssistantMessage` ni siquiera lo recibe.

## Envío

Igual que PYME Check: sistema de contacto actual de la web, correo prellenado (`mailto:`) al buzón de la firma. La
web no puede saber si la persona lo envía y nunca lo da por enviado («Último paso: envía la solicitud desde tu
correo», con opción de reabrirlo o copiar el mensaje). Para envío directo con confirmación haría falta un endpoint
(ver la configuración pendiente descrita en el historial, commit `414b160`).

## Pruebas

- `npm test`: 4 pruebas del chatbot (mensaje, opcionales vacíos, ausencia del texto del chat, sectores y codificación
  del enlace de correo); 32 en total.
- Revisión en Chrome (escritorio y 390 px): apertura y cierre, foco, envío vacío, envío válido con apertura del
  pop-up, Escape, repetición, validación del formulario, sector, vista previa sin el texto del chat, convivencia con
  la barra móvil y con el pop-up de PYME Check, sin errores en consola. No se pulsó el envío final para no abrir el
  programa de correo del equipo.
