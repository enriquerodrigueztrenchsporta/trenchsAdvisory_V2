// Pruebas de la solicitud del chatbot demostrativo. Ejecutar con: npm test
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mailtoHref } from '../contact/contact.ts';
import { buildAssistantMessage, isSector, SECTORS, SERVICE } from './message.ts';

const contact = { name: 'Ana Prueba', company: 'Hotel Prueba', email: 'ana@example.com', phone: '600 000 000', message: 'Tenemos 20 habitaciones.' };

describe('chatbot demostrativo', () => {
  it('genera la solicitud con el servicio automático y el origen', () => {
    const { subject, body } = buildAssistantMessage(contact, 'Hoteles y turismo');
    assert.equal(subject, 'Nueva oportunidad comercial — Asistente de IA — Hotel Prueba');
    for (const s of [
      'NUEVA SOLICITUD — INTELIGENCIA ARTIFICIAL APLICADA',
      'Sector: Hoteles y turismo',
      `SERVICIO SOLICITADO\n${SERVICE}`,
      '- Integraciones empresariales, si son viables.',
      'MENSAJE ADICIONAL DEL CLIENTE\nTenemos 20 habitaciones.',
      'ORIGEN DEL CONTACTO\nChatbot demostrativo global de Trenchs Advisory.',
    ]) assert.ok(body.includes(s), s);
  });
  it('campos opcionales vacíos y asunto con el nombre si no hay empresa', () => {
    const { subject, body } = buildAssistantMessage({ ...contact, company: '', phone: '', message: '' }, '');
    assert.ok(subject.endsWith('— Ana Prueba'));
    assert.ok(body.includes('Empresa: —') && body.includes('Sector: —') && body.includes('Teléfono: —'));
  });
  it('nunca incluye lo escrito en el chat: la función ni siquiera lo recibe', () => {
    assert.equal(buildAssistantMessage.length, 2);
    assert.ok(!buildAssistantMessage(contact, '').body.includes('¿Tenéis habitaciones'));
  });
  it('sectores válidos y enlace de correo codificado', () => {
    assert.equal(SECTORS.length, 8);
    assert.ok(isSector('Clínicas') && !isSector('Inventado'));
    const href = mailtoHref('Asunto & más', 'Línea 1\nLínea 2');
    assert.ok(href.includes('subject=Asunto%20%26%20m%C3%A1s') && href.includes('body=L%C3%ADnea%201%0AL%C3%ADnea%202'));
  });
});
