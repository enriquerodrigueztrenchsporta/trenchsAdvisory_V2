// Pruebas de la solicitud comercial y de su validación en servidor. Ejecutar con: npm test
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Analysis } from '../profitability/types.ts';
import { buildLeadMessage, validateContact, type LeadPayload } from './lead.ts';
import { MAX_BODY_BYTES, processLead } from './server.ts';

const analysis: Analysis = {
  company: { sector: 'Restauración', employees: 6, period: { kind: 'month', month: 9, year: 2026 }, name: 'Casa Prueba' },
  inputs: {
    revenue: 2500000, purchases: 800000, salesCosts: 0, otherVariable: 200000, rent: 200000, utilities: 0, software: 100000,
    insurance: 0, marketing: 0, otherFixed: 0, salaries: 550000, socialSecurity: 150000, otherStaff: 0, salariesIncludeSocialSecurity: false,
  },
};
const contact = { name: 'Ana Prueba', company: 'Casa Prueba', email: 'ana@example.com', phone: '', message: 'Hola' };
const payload = (o: Partial<LeadPayload> = {}): string =>
  JSON.stringify({ contact, privacyAccepted: true, shareAnalysis: true, analysis, website: '', elapsedMs: 20000, ...o });

describe('mensaje comercial', () => {
  it('con autorización incluye diagnóstico, problemas, soluciones y servicio', () => {
    const { subject, body } = buildLeadMessage(contact, analysis);
    assert.equal(subject, 'Nueva oportunidad comercial — Rentabilidad Empresarial — Casa Prueba');
    for (const s of [
      'NUEVA SOLICITUD — CALCULADORA DE RENTABILIDAD EMPRESARIAL',
      'Periodo analizado: Septiembre de 2026',
      'Facturación mensual: 25.000,00 €',
      'Margen de contribución: 15.000,00 € (60,0 %)',
      'Resultado operativo simplificado: 5.000,00 €',
      'Punto de equilibrio: 16.666,67 €',
      'PROBLEMAS Y OPORTUNIDADES DETECTADAS',
      'Propuestas preliminares, sujetas a revisión',
      'Business Intelligence y automatización financiera',
      'MENSAJE ADICIONAL DEL CLIENTE\nHola',
    ]) assert.ok(body.includes(s), s);
  });
  it('sin autorización no contiene ninguna cifra, clasificación ni solución', () => {
    const { body } = buildLeadMessage(contact, null);
    assert.ok(!/€|%|Facturación|Restauración|Business Intelligence|DIAGNÓSTICO|SOLUCIONES|SERVICIO RECOMENDADO/.test(body));
    assert.ok(body.includes('Calculadora de Rentabilidad Empresarial'));
    assert.ok(body.includes('Hola'));
  });
  it('sin empresa, el asunto usa el nombre de contacto', () => {
    assert.ok(buildLeadMessage({ ...contact, company: '' }, null).subject.endsWith('— Ana Prueba'));
  });
  it('valida contacto y privacidad', () => {
    assert.equal(validateContact({ ...contact, email: 'no-es-correo' }, true).ok, false);
    assert.equal(validateContact({ ...contact, name: '  ' }, true).ok, false);
    assert.equal(validateContact(contact, false).ok, false);
    const ok = validateContact({ ...contact, email: ' ANA@Example.com ', name: 'Ana\u0007 Prueba' }, true);
    assert.ok(ok.ok && ok.value.email === 'ana@example.com' && ok.value.name === 'Ana Prueba');
  });
});

describe('servidor', () => {
  it('acepta una solicitud válida y recalcula las cifras', () => {
    const r = processLead(payload());
    assert.ok(r.ok && r.includesAnalysis && r.body.includes('5.000,00'));
  });
  it('sin autorización descarta el análisis aunque llegue', () => {
    const r = processLead(payload({ shareAnalysis: false }));
    assert.ok(r.ok && !r.includesAnalysis && !r.body.includes('€'));
  });
  it('exige la aceptación de la privacidad', () => {
    assert.equal(processLead(payload({ privacyAccepted: false as true })).ok, false);
  });
  it('rechaza envíos maliciosos', () => {
    assert.deepEqual(processLead(payload({ website: 'http://spam' })), { ok: false, status: 200, error: 'spam' });
    assert.deepEqual(processLead(payload({ elapsedMs: 200 })), { ok: false, status: 200, error: 'spam' });
    assert.equal((processLead('no json') as { status: number }).status, 400);
    assert.equal((processLead('[]') as { status: number }).status, 400);
    assert.equal((processLead('x'.repeat(MAX_BODY_BYTES + 1)) as { status: number }).status, 413);
    const tampered = { ...analysis, inputs: { ...analysis.inputs, revenue: -5 } };
    assert.equal((processLead(payload({ analysis: tampered })) as { status: number }).status, 422);
    assert.equal(processLead(payload({ contact: { ...contact, email: 'x' } })).ok, false);
  });
  it('trata el contenido como texto: sin saltos de cabecera en el asunto', () => {
    const r = processLead(payload({ contact: { ...contact, company: 'ACME\r\nBcc: otro@example.com' } }));
    assert.ok(r.ok && !/[\r\n]/.test(r.subject));
  });
});
