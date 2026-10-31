// Datos de contacto de las herramientas: validación y envío por correo (mailto:), el sistema de contacto de la web.
// La web es estática: el mensaje se abre en el programa de correo de la persona y llega cuando ella lo envía.

import { EMAIL } from '../site.ts';

export type LeadContact = { name: string; company: string; email: string; phone: string; message: string };
export type ContactField = keyof LeadContact | 'privacyAccepted';

export const LIMITS = { name: 100, company: 120, email: 254, phone: 30, message: 1500 } as const;

export const emptyContact = (): LeadContact => ({ name: '', company: '', email: '', phone: '', message: '' });

/** Quita caracteres de control (salvo saltos de línea en el mensaje) y espacios sobrantes. */
export const cleanText = (s: string, multiline = false): string =>
  (multiline ? s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '') : s.replace(/[\u0000-\u001f\u007f]/g, ' '))
    .replace(/[ \t]+/g, ' ')
    .trim();

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{6,30}$/;

export function validateContact(
  c: LeadContact,
  privacyAccepted: boolean,
): { ok: true; value: LeadContact } | { ok: false; errors: Partial<Record<ContactField, string>> } {
  const v: LeadContact = {
    name: cleanText(c.name),
    company: cleanText(c.company),
    email: cleanText(c.email).toLowerCase(),
    phone: cleanText(c.phone),
    message: cleanText(c.message, true),
  };
  const errors: Partial<Record<ContactField, string>> = {};
  if (!v.name) errors.name = 'Indica tu nombre.';
  else if (v.name.length > LIMITS.name) errors.name = `Usa como máximo ${LIMITS.name} caracteres.`;
  if (v.company.length > LIMITS.company) errors.company = `Usa como máximo ${LIMITS.company} caracteres.`;
  if (!v.email) errors.email = 'Indica tu correo electrónico.';
  else if (v.email.length > LIMITS.email || !EMAIL_RE.test(v.email)) errors.email = 'Revisa el correo electrónico (p. ej. nombre@empresa.com).';
  if (v.phone && !PHONE_RE.test(v.phone)) errors.phone = 'Revisa el teléfono: solo cifras, espacios y el prefijo +.';
  if (v.message.length > LIMITS.message) errors.message = `Usa como máximo ${LIMITS.message} caracteres.`;
  if (!privacyAccepted) errors.privacyAccepted = 'Debes leer y aceptar la política de privacidad para enviar la solicitud.';
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, value: v };
}

export const mailtoHref = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
