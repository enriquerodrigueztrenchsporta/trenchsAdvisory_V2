// Mensaje comercial de PYME Check. La vista previa y el correo usan esta misma función: lo que se ve es lo que se
// envía. Sin autorización (result = null) no incluye respuestas, puntuación, clasificación ni recomendaciones.

import type { LeadContact } from '../contact/contact.ts';
import type { Result } from './scoring.ts';

export const TOOL_NAME = 'PYME Check — Autodiagnóstico Empresarial';

export function buildPymeMessage(contact: LeadContact, result: Result | null): { subject: string; body: string } {
  const dash = (s: string) => s || '—';
  const L = [
    'NUEVA SOLICITUD — PYME CHECK',
    '',
    'DATOS DEL CLIENTE',
    `Nombre: ${contact.name}`,
    `Empresa: ${dash(contact.company)}`,
    `Email: ${contact.email}`,
    `Teléfono: ${dash(contact.phone)}`,
    '',
    'HERRAMIENTA UTILIZADA',
    `${TOOL_NAME}.`,
    '',
  ];

  if (result) {
    const ops = result.opportunities;
    L.push('RESULTADO', `Puntuación: ${result.score}/100`, `Clasificación: ${result.classification}`, '');
    L.push('PRINCIPALES OPORTUNIDADES');
    L.push(...(ops.length ? ops.map((o, i) => `${i + 1}. ${o.areaName}: ${o.problem}`) : ['Ninguna destacada: todas las respuestas obtienen la puntuación máxima.']), '');
    L.push('SOLUCIONES PROPUESTAS POR TRENCHS ADVISORY', '(Propuestas preliminares, sujetas a revisión.)');
    L.push(...(ops.length ? ops.map((o, i) => `${i + 1}. ${o.solution}`) : ['1. Revisión periódica de indicadores y procesos para la mejora continua.']), '');
    L.push('SERVICIOS RECOMENDADOS', ...(ops.length ? [...new Set(ops.map((o) => o.service))].map((s) => `- ${s}.`) : ['- A concretar en una primera conversación.']), '');
  } else {
    L.push('RESULTADO', 'No autorizado: la solicitud no incluye los resultados del autodiagnóstico.', '');
  }

  L.push('MENSAJE ADICIONAL', dash(contact.message));
  return { subject: `Nueva solicitud — PYME Check — ${contact.company || contact.name}`, body: L.join('\n') };
}
