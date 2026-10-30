// Endpoint de contacto de referencia para la Calculadora de Rentabilidad (Cloudflare Workers + Resend).
// NO está desplegado: la web actual es estática y usa mailto:. Para activarlo, ver docs/06-herramientas-gratuitas.md
// («Activar el envío directo»). Requiere aprobación previa del propietario y actualizar la política de privacidad
// (Cloudflare y Resend pasarían a tratar los datos de contacto como encargados del tratamiento).
//
// Variables (secretos de Wrangler, nunca en el repositorio):
//   RESEND_API_KEY   clave de la API de Resend
//   LEAD_TO          buzón que recibe las solicitudes
//   LEAD_FROM        remitente verificado en Resend (p. ej. «Web Trenchs <web@dominio-verificado>»)
//   ALLOWED_ORIGIN   origen de la web (p. ej. https://enriquerodrigueztrenchsporta.github.io)

import { processLead } from '../src/lib/contact/server.ts';

type Env = { RESEND_API_KEY: string; LEAD_TO: string; LEAD_FROM: string; ALLOWED_ORIGIN: string };

const json = (status: number, data: unknown, origin: string) =>
  new Response(status === 204 ? null : JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      Vary: 'Origin',
    },
  });

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = env.ALLOWED_ORIGIN;
    if (request.method === 'OPTIONS') return json(204, null, origin);
    if (request.method !== 'POST') return json(405, { ok: false }, origin);
    if (request.headers.get('Origin') !== origin) return json(403, { ok: false }, origin);
    if (!request.headers.get('Content-Type')?.startsWith('application/json')) return json(415, { ok: false }, origin);

    const result = processLead(await request.text());
    if (!result.ok) {
      // Sin datos personales ni importes en el registro: solo el tipo de error.
      console.warn('lead rechazado', result.status, result.error);
      return json(result.status, { ok: result.status === 200 }, origin);
    }

    const sent = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      // Solo texto plano: el contenido de la persona nunca se interpreta como HTML.
      body: JSON.stringify({ from: env.LEAD_FROM, to: [env.LEAD_TO], reply_to: result.replyTo, subject: result.subject, text: result.body }),
    });
    if (!sent.ok) {
      console.error('fallo del proveedor de correo', sent.status);
      return json(502, { ok: false }, origin);
    }
    return json(200, { ok: true }, origin);
  },
};
