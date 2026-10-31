// Pruebas de PYME Check. Ejecutar con: npm test
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { validateContact } from '../contact/contact.ts';
import { buildPymeMessage } from './message.ts';
import { MAX_POINTS, QUESTIONS } from './questions.ts';
import { emptyAnswers, evaluate, isComplete, joinEs, levelOf, pitchText, type Answers } from './scoring.ts';

const A = 0 as const;
const B = 1 as const;
const C = 2 as const;
const contact = { name: 'Ana Prueba', company: 'Taller Prueba', email: 'ana@example.com', phone: '', message: 'Hola' };

describe('preguntas', () => {
  it('cinco preguntas con tres opciones y 50 puntos como máximo', () => {
    assert.equal(QUESTIONS.length, 5);
    for (const q of QUESTIONS) assert.equal(q.options.length, 3);
    assert.equal(MAX_POINTS, 50);
    assert.deepEqual(QUESTIONS.map((q) => q.area), ['control', 'profitability', 'automation', 'customers', 'planning']);
  });
  it('no se evalúa con respuestas pendientes', () => {
    const a = emptyAnswers();
    assert.equal(isComplete(a), false);
    assert.throws(() => evaluate(a));
    assert.throws(() => evaluate([A, A, A, A, null]));
  });
});

describe('puntuación y clasificación', () => {
  it('escala de 0 a 100', () => {
    assert.equal(evaluate([A, A, A, A, A]).score, 100);
    assert.equal(evaluate([C, C, C, C, C]).score, 0);
    assert.equal(evaluate([A, B, C, A, B]).points, 30);
    assert.equal(evaluate([A, B, C, A, B]).score, 60);
  });
  it('umbrales 80 y 50', () => {
    assert.equal(levelOf(100), 'good');
    assert.equal(levelOf(80), 'good');
    assert.equal(levelOf(79), 'opportunities');
    assert.equal(levelOf(50), 'opportunities');
    assert.equal(levelOf(49), 'several');
    assert.equal(evaluate([A, A, A, B, B]).classification, 'Tu empresa parece tener una buena base de gestión.');
    assert.equal(evaluate([B, B, B, B, B]).classification, 'Hay oportunidades para mejorar la gestión de tu negocio.');
    assert.equal(evaluate([B, C, C, B, C]).classification, 'Tu empresa podría beneficiarse de mejorar varios procesos.');
  });
});

describe('oportunidades y recomendaciones', () => {
  it('de menor a mayor puntuación, máximo tres, empates en el orden de las preguntas', () => {
    const r = evaluate([B, A, C, B, C]);
    assert.deepEqual(r.opportunities.map((o) => o.area), ['automation', 'planning', 'control']);
  });
  it('las soluciones corresponden a las respuestas: ausencia o mejora', () => {
    const r = evaluate([C, B, A, A, A]);
    assert.equal(r.opportunities[0].solution, 'Implantar un dashboard de ventas, costes y márgenes con indicadores actualizados.');
    assert.equal(r.opportunities[0].service, 'Business Intelligence y dashboards empresariales');
    assert.equal(r.opportunities[1].area, 'profitability');
    assert.equal(r.opportunities[1].problem, 'Los márgenes por producto o servicio se conocen solo de forma aproximada.');
    assert.equal(r.opportunities.length, 2);
  });
  it('sin problemas inventados cuando todo es positivo', () => {
    const r = evaluate([A, A, A, A, A]);
    assert.equal(r.opportunities.length, 0);
    assert.match(pitchText(r), /buena base/);
  });
  it('texto del pop-up según las áreas', () => {
    assert.equal(
      pitchText(evaluate([A, A, C, C, C])),
      'Según tus respuestas, hemos identificado oportunidades de mejora en automatización, analítica de clientes y planificación.',
    );
    assert.equal(joinEs(['a', 'b']), 'a y b');
  });
});

describe('mensaje comercial', () => {
  const result = evaluate([A, A, C, C, B] as Answers);
  it('con autorización incluye puntuación, clasificación, oportunidades, soluciones y servicios', () => {
    const { subject, body } = buildPymeMessage(contact, result);
    assert.equal(subject, 'Nueva solicitud — PYME Check — Taller Prueba');
    for (const s of [
      'NUEVA SOLICITUD — PYME CHECK',
      'Puntuación: 50/100',
      'Clasificación: Hay oportunidades para mejorar la gestión de tu negocio.',
      '1. Automatización: Procesos administrativos manuales.',
      '2. Analítica de clientes:',
      '3. Planificación: Las previsiones se basan en estimaciones aproximadas.',
      '- Analítica Avanzada.',
      'MENSAJE ADICIONAL\nHola',
    ]) assert.ok(body.includes(s), s);
  });
  it('sin autorización no contiene nada derivado del diagnóstico', () => {
    const { body } = buildPymeMessage(contact, null);
    assert.ok(!/Puntuación|Clasificación|OPORTUNIDADES|SOLUCIONES|SERVICIOS|Automatización|\/100/.test(body));
    assert.ok(body.includes('PYME Check — Autodiagnóstico Empresarial.'));
    assert.ok(body.includes('Hola'));
  });
  it('sin empresa, el asunto usa el nombre', () => {
    assert.ok(buildPymeMessage({ ...contact, company: '' }, null).subject.endsWith('— Ana Prueba'));
  });
  it('valida contacto y privacidad', () => {
    assert.equal(validateContact({ ...contact, email: 'x' }, true).ok, false);
    assert.equal(validateContact({ ...contact, name: ' ' }, true).ok, false);
    assert.equal(validateContact(contact, false).ok, false);
    const ok = validateContact({ ...contact, email: ' ANA@Example.com ', company: 'ACME\r\nBcc: x@y.z' }, true);
    assert.ok(ok.ok && ok.value.email === 'ana@example.com' && !/[\r\n]/.test(ok.value.company));
  });
});
