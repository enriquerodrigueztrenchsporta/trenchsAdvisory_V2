// Solicitud del chatbot demostrativo. La propuesta es genérica: el chatbot no usa IA ni analiza lo que se escribe,
// y el mensaje que la persona escribió en el chat NO forma parte de la solicitud.

import type { LeadContact } from '../contact/contact.ts';

export const SECTORS = ['Restauración', 'Hoteles y turismo', 'Comercio', 'Despachos profesionales', 'Clínicas', 'Inmobiliarias', 'Servicios', 'Otros'] as const;
export type Sector = (typeof SECTORS)[number];

export const SERVICE = 'Desarrollo de chatbot y asistente de IA personalizado.';

export const FEATURES = [
  { title: 'Atención automatizada al cliente', text: 'Asistentes capaces de responder preguntas frecuentes utilizando la información proporcionada por la empresa.' },
  { title: 'Integración en páginas web', text: 'Chatbots integrados directamente en la web corporativa.' },
  { title: 'Gestión de consultas y solicitudes', text: 'Agentes capaces de recopilar datos, clasificar solicitudes y preparar respuestas.' },
  {
    title: 'Integración con herramientas empresariales',
    text: 'Posibilidad de conectar el asistente a CRM, sistemas de reservas, bases de datos u otras herramientas compatibles.',
  },
  { title: 'Automatización de procesos', text: 'Asistentes que puedan ayudar a ejecutar tareas repetitivas bajo las reglas y autorizaciones establecidas.' },
] as const;

export const isSector = (s: string): s is Sector => (SECTORS as readonly string[]).includes(s);

export function buildAssistantMessage(contact: LeadContact, sector: Sector | ''): { subject: string; body: string } {
  const dash = (s: string) => s || '—';
  const body = [
    'NUEVA SOLICITUD — INTELIGENCIA ARTIFICIAL APLICADA',
    '',
    'DATOS DEL CLIENTE',
    `Nombre: ${contact.name}`,
    `Empresa: ${dash(contact.company)}`,
    `Correo electrónico: ${contact.email}`,
    `Teléfono: ${dash(contact.phone)}`,
    `Sector: ${dash(sector)}`,
    '',
    'SERVICIO SOLICITADO',
    SERVICE,
    '',
    'DESCRIPCIÓN DEL SERVICIO PROPUESTO',
    'Desarrollo de un asistente virtual adaptado a la empresa, con funcionalidades potenciales como:',
    '- Respuestas a preguntas frecuentes.',
    '- Atención automatizada.',
    '- Integración en la página web.',
    '- Gestión de solicitudes.',
    '- Integraciones empresariales, si son viables.',
    '- Automatización de procesos.',
    '',
    'MENSAJE ADICIONAL DEL CLIENTE',
    dash(contact.message),
    '',
    'ORIGEN DEL CONTACTO',
    'Chatbot demostrativo global de Trenchs Advisory.',
  ].join('\n');
  return { subject: `Nueva oportunidad comercial — Asistente de IA — ${contact.company || contact.name}`, body };
}
