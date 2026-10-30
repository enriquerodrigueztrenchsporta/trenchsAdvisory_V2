// Solicitud comercial de la Calculadora de Rentabilidad: validación del contacto y redacción del mensaje.
//
// El mensaje se genera SIEMPRE con buildLeadMessage, tanto para la vista previa como para el envío, de modo que lo
// que la persona ve es exactamente lo que se envía. Sin autorización (shareAnalysis = false) el mensaje no contiene
// ni cifras, ni clasificación, ni problemas inferidos, ni soluciones derivadas de los datos financieros.

import { diagnose } from '../profitability/diagnosis.ts';
import { computeMetrics, type Metrics } from '../profitability/engine.ts';
import { formatEUR, formatPct } from '../profitability/money.ts';
import { proposalFor } from '../profitability/solutions.ts';
import type { Analysis, Period } from '../profitability/types.ts';

export const TOOL_NAME = 'Calculadora de Rentabilidad Empresarial';

export type LeadContact = { name: string; company: string; email: string; phone: string; message: string };
export type ContactField = keyof LeadContact | 'privacyAccepted';

export const LIMITS = { name: 100, company: 120, email: 254, phone: 30, message: 2000 } as const;

export const emptyContact = (): LeadContact => ({ name: '', company: '', email: '', phone: '', message: '' });

/** Quita caracteres de control (salvo saltos de línea en el mensaje) y espacios sobrantes. */
export const cleanText = (s: string, multiline = false): string =>
  (multiline ? s.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0009\u000b-\u001f\u007f]/g, '') : s.replace(/[\u0000-\u001f\u007f]/g, ' '))
    .replace(/[ \t]+/g, ' ')
    .trim();

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;
const PHONE_RE = /^\+?[\d\s().-]{6,30}$/;

export function validateContact(c: LeadContact, privacyAccepted: boolean): { ok: true; value: LeadContact } | { ok: false; errors: Partial<Record<ContactField, string>> } {
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

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
export const periodLabel = (p: Period) => (p.kind === 'average' ? 'Promedio mensual' : `${MONTHS[p.month - 1]} de ${p.year}`.replace(/^./, (c) => c.toUpperCase()));

export function breakEvenText(m: Metrics): string {
  switch (m.breakEven.status) {
    case 'ok':
      return formatEUR(m.breakEven.value);
    case 'no-sales':
      return 'No calculable (sin facturación)';
    case 'unreachable':
      return 'No alcanzable bajo las hipótesis del modelo';
    case 'no-margin':
      return 'No calculable (sin margen de contribución positivo)';
  }
}

export function leadSubject(contact: LeadContact): string {
  return `Nueva oportunidad comercial — Rentabilidad Empresarial — ${contact.company || contact.name}`;
}

/**
 * Cuerpo en texto plano. Con `analysis` = null (sin autorización) solo lleva contacto, herramienta y mensaje.
 * Solo se incluyen indicadores calculables; el resto se indica como no calculable.
 */
export function buildLeadMessage(contact: LeadContact, analysis: Analysis | null): { subject: string; body: string } {
  const L: string[] = [];
  const dash = (s: string) => s || '—';
  L.push('NUEVA SOLICITUD — CALCULADORA DE RENTABILIDAD EMPRESARIAL', '');
  L.push('DATOS DEL CLIENTE');
  L.push(`Nombre: ${contact.name}`, `Empresa: ${dash(contact.company)}`, `Correo electrónico: ${contact.email}`, `Teléfono: ${dash(contact.phone)}`, '');
  L.push('HERRAMIENTA UTILIZADA', `${TOOL_NAME}.`, '');

  if (analysis) {
    const m = computeMetrics(analysis.inputs);
    const d = diagnose(analysis.inputs, m);
    const p = proposalFor(d.kind);
    const pctOr = (r: number | null) => (r === null ? 'No calculable (sin facturación)' : formatPct(r));

    L.push('DIAGNÓSTICO FINANCIERO');
    L.push(`Sector: ${analysis.company.sector}`);
    L.push(`Empleados: ${analysis.company.employees}`);
    L.push(`Periodo analizado: ${periodLabel(analysis.company.period)}`);
    L.push(`Facturación mensual: ${formatEUR(m.revenue)}`);
    L.push(`Costes variables: ${formatEUR(m.variableCosts)}`);
    L.push(`Gastos fijos: ${formatEUR(m.fixedCosts)}`);
    L.push(`Costes de personal: ${formatEUR(m.staffCosts)}`);
    L.push(`Margen de contribución: ${formatEUR(m.contribution)} (${pctOr(m.contributionRatio)})`);
    L.push(`Resultado operativo simplificado: ${formatEUR(m.result)}`);
    L.push(`Margen de resultado: ${pctOr(m.resultMargin)}`);
    L.push(`Punto de equilibrio: ${breakEvenText(m)}`);
    L.push(`Margen de seguridad: ${m.safetyMargin === null ? 'No calculable' : `${formatEUR(m.safetyMargin)} (${pctOr(m.safetyMarginRatio)})`}`);
    L.push(`Clasificación: ${d.headline}`, '');

    L.push('PROBLEMAS Y OPORTUNIDADES DETECTADAS', d.message, ...d.findings.map((f) => `- ${f}`), '');
    L.push('SOLUCIONES PROPUESTAS POR TRENCHS ADVISORY', '(Propuestas preliminares, sujetas a revisión.)', ...p.solutions.map((s) => `- ${s}`), '');
    L.push('SERVICIO RECOMENDADO', `${p.service}.`, '');
  } else {
    L.push('ANÁLISIS FINANCIERO', 'No autorizado: la solicitud no incluye resultados económicos.', '');
  }

  L.push('MENSAJE ADICIONAL DEL CLIENTE', dash(contact.message));
  return { subject: leadSubject(contact), body: L.join('\n') };
}

/** Lo que viaja a un endpoint de contacto. El servidor vuelve a validarlo y recalcula todo. */
export type LeadPayload = {
  contact: LeadContact;
  privacyAccepted: true;
  shareAnalysis: boolean;
  analysis?: Analysis;
  /** Trampa para bots: debe llegar vacío. */
  website: string;
  /** Milisegundos entre que se abrió el formulario y se envió. */
  elapsedMs: number;
};
