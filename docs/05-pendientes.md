# Elementos [PENDIENTE] que debe aportar el negocio

La v2 no inventa ninguno de estos datos: donde faltan, la web funciona sin ellos y no muestra marcadores. Ordenados
por impacto en la conversión.

| # | Pendiente | Por qué importa | Qué hay que aportar | Dónde se integra |
|---|---|---|---|---|
| P1 | **Casos o testimonios reales y autorizados** | Es la única prueba de calidad que falta. En consultoría pesa más que cualquier otro elemento | 2–3 casos (problema, qué se hizo, resultado medido) o testimonios con nombre, cargo y permiso por escrito | Nueva sección entre «Capacidades» y «Método» de la portada, y en cada servicio |
| P2 | **Fotografía propia** | La confianza en consultoría se deposita en personas; ahora la web no muestra a nadie | Retrato profesional del titular (fondo neutro, luz natural, plano medio y primer plano); 3–5 imágenes de trabajo real (sesión de trabajo, pizarra, revisión de un cuadro de mando), en horizontal, ≥ 2400 px, tonos fríos o neutros que encajen con el verde de marca | Quiénes somos (Por qué nosotros: «Interlocución única»), cierre, imagen para redes |
| P3 | **Presentación de la persona responsable** | «Quien vende es quien ejecuta» es un argumento de la v1 que gana fuerza con nombre y trayectoria | Decisión del propietario: la v1 habla en «nosotros» sin nombrar personas (CONTEXT.md). Si se cambia, aportar bio breve y trayectoria verificable | Quiénes somos |
| P4 | **Dominio propio y correo corporativo** | `@gmail.com` y `github.io` restan credibilidad; un dominio propio mejora el SEO | Dominio (p. ej. trenchsadvisory.com) y buzón en ese dominio | `SITE_URL` en el despliegue y `EMAIL` en `src/lib/site.ts`; actualizar la privacidad si cambia el proveedor de correo |
| P5 | **Agenda en línea** (Cal.com, Calendly…) | Reduce la fricción del primer contacto frente al correo | Herramienta elegida. Requiere aprobación previa y actualizar las políticas de privacidad y cookies (tercero que trata datos) | Botón secundario junto a «Solicitar diagnóstico» |
| P6 | **Teléfono o WhatsApp** | Canal alternativo para quien no escribe correos | Número | `OWNER.phone` en `src/content/legal.ts` (ya se muestra en los legales si se rellena) y cierre |
| P7 | **NIF y domicilio** | Obligación legal (art. 10 LSSI-CE) en una web de actividad económica | NIF y domicilio (o servicio de domiciliación) | `src/content/legal.ts`: al rellenarlos aparecen en el aviso legal y la privacidad |
| P8 | **Clientes o sectores atendidos** | Credibilidad por referencia | Lista con permiso para publicarla | Franja bajo el hero |
| P9 | **Validación de textos nuevos** | La v2 reformula el hero y añade microtextos de interfaz | Revisar `docs/03-correspondencia-v1-v2.md`, apartados 7 y 8 | — |
| P10 | **Autorización de publicación** | Las normas del espacio de trabajo exigen autorización expresa | Decidir hosting y dominio | `README.md`, apartado «Despliegue» |
| P11 | **Envío directo de la calculadora** | Hoy la solicitud se prepara en el correo de la persona y la web no puede confirmar que se envíe | Aprobar proveedor (referencia: Cloudflare Workers + Resend), cuentas y dominio verificado; revisar privacidad | `docs/06-herramientas-gratuitas.md`, «Activar el envío directo» |
| P12 | **Revisión jurídica de los textos de la calculadora** | Nuevo tratamiento con consentimiento para compartir el análisis | Validar privacidad (apartado 2) y aviso legal (apartado 5) | `src/app/legal/` |
