// Lógica de servidor para recibir una solicitud de la calculadora, independiente del proveedor donde se despliegue
// (ver server/contact-worker.ts). No confía en nada de lo que llega: valida el contacto, exige la aceptación de la
// privacidad, descarta el análisis si no hay autorización y recalcula todas las cifras con el mismo motor.
// Nunca registra importes: los errores solo describen el tipo de problema.

import { parseAnalysis } from '../profitability/validation.ts';
import { buildLeadMessage, validateContact, type LeadContact } from './lead.ts';

export const MAX_BODY_BYTES = 16 * 1024;
/** Un envío humano tarda más que esto desde que se abre el formulario. */
export const MIN_ELAPSED_MS = 3000;

export type LeadResult =
  | { ok: true; subject: string; body: string; replyTo: string; includesAnalysis: boolean }
  | { ok: false; status: 400 | 413 | 422; error: string }
  /** Bot detectado: se responde como si todo fuera bien, pero no se envía nada. */
  | { ok: false; status: 200; error: 'spam' };

export function processLead(rawBody: string, now = new Date()): LeadResult {
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) return { ok: false, status: 413, error: 'Solicitud demasiado grande.' };
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error();
    data = parsed as Record<string, unknown>;
  } catch {
    return { ok: false, status: 400, error: 'Formato no válido.' };
  }

  if (typeof data.website === 'string' && data.website.trim() !== '') return { ok: false, status: 200, error: 'spam' };
  if (typeof data.elapsedMs !== 'number' || data.elapsedMs < MIN_ELAPSED_MS) return { ok: false, status: 200, error: 'spam' };

  const c = (data.contact ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const contact: LeadContact = { name: str(c.name), company: str(c.company), email: str(c.email), phone: str(c.phone), message: str(c.message) };
  const checked = validateContact(contact, data.privacyAccepted === true);
  if (!checked.ok) return { ok: false, status: 422, error: 'Datos de contacto no válidos.' };

  // Sin autorización expresa, el análisis se descarta aunque haya llegado.
  const share = data.shareAnalysis === true;
  const analysis = share ? parseAnalysis(data.analysis, now) : null;
  if (share && !analysis) return { ok: false, status: 422, error: 'Análisis no válido.' };

  const { subject, body } = buildLeadMessage(checked.value, analysis);
  return { ok: true, subject, body, replyTo: checked.value.email, includesAnalysis: analysis !== null };
}
