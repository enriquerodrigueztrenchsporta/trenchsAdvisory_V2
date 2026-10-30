// Envío de la solicitud. Dos modos, según la configuración de compilación:
//
// - NEXT_PUBLIC_CONTACT_ENDPOINT definido: POST JSON a ese endpoint (p. ej. server/contact-worker.ts desplegado).
//   Solo se confirma el envío si el servidor responde 2xx con { ok: true }.
// - Sin endpoint (situación actual, web estática en GitHub Pages): se reutiliza el sistema de contacto existente,
//   un correo prellenado (mailto:) al buzón de la firma. La persona lo envía desde su programa de correo, así que la
//   web no puede saber si se envió y nunca lo da por hecho.

import { EMAIL } from '../site.ts';
import type { LeadPayload } from './lead.ts';

export const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT ?? '';
export const TRANSPORT: 'endpoint' | 'mailto' = CONTACT_ENDPOINT ? 'endpoint' : 'mailto';

export const mailtoHref = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export async function postLead(payload: LeadPayload, endpoint = CONTACT_ENDPOINT, timeoutMs = 15000): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
      credentials: 'omit',
    });
    if (!res.ok) return false;
    const json = (await res.json().catch(() => null)) as { ok?: unknown } | null;
    return json?.ok === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
