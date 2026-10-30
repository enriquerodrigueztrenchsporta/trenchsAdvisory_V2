// Pruebas del motor financiero. Ejecutar con: npm test
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classify, diagnose } from './diagnosis.ts';
import { computeMetrics } from './engine.ts';
import { formatEUR, formatPct, parseAmount } from './money.ts';
import { PRESETS, NEUTRAL, salesForTarget, simulate } from './scenarios.ts';
import { proposalFor } from './solutions.ts';
import type { FinancialInputs } from './types.ts';
import { emptyCompany, emptyFinancials, parseAnalysis, validateCompany, validateFinancials } from './validation.ts';

const eur = (n: number) => Math.round(n * 100);
const zero: FinancialInputs = {
  revenue: 0, purchases: 0, salesCosts: 0, otherVariable: 0, rent: 0, utilities: 0, software: 0, insurance: 0,
  marketing: 0, otherFixed: 0, salaries: 0, socialSecurity: 0, otherStaff: 0, salariesIncludeSocialSecurity: false,
};
const make = (o: Partial<FinancialInputs>): FinancialInputs => ({ ...zero, ...o });

// V = 25.000, CV = 10.000, GF = 3.000, CP = 7.000 → MC = 15.000, R = 5.000
const profitable = make({ revenue: eur(25000), purchases: eur(8000), otherVariable: eur(2000), rent: eur(2000), software: eur(1000), salaries: eur(5500), socialSecurity: eur(1500) });

describe('importes', () => {
  it('interpreta formatos españoles e internacionales sencillos', () => {
    assert.deepEqual(parseAmount('25.000,50'), { ok: true, value: 2500050 });
    assert.deepEqual(parseAmount('25000'), { ok: true, value: 2500000 });
    assert.deepEqual(parseAmount('25.000'), { ok: true, value: 2500000 });
    assert.deepEqual(parseAmount('1234.5'), { ok: true, value: 123450 });
    assert.deepEqual(parseAmount('0,1'), { ok: true, value: 10 });
    assert.deepEqual(parseAmount(' 1 500 € '), { ok: true, value: 150000 });
    assert.deepEqual(parseAmount(''), { ok: true, value: null });
  });
  it('rechaza textos erróneos sin convertirlos en cero', () => {
    for (const bad of ['abc', '-5', '1,2,3', '1,234', '12.3456', '1e5', 'Infinity', 'NaN', '10,999', '1.23.4']) {
      const r = parseAmount(bad);
      assert.equal(r.ok, false, bad);
    }
    assert.equal(parseAmount('99999999999').ok, false);
  });
  it('formatea en euros y porcentajes españoles', () => {
    assert.equal(formatEUR(2500000), '25.000,00 €');
    assert.equal(formatEUR(-150), '-1,50 €');
    assert.equal(formatPct(0.6), '60,0 %');
  });
});

describe('indicadores', () => {
  it('empresa rentable', () => {
    const m = computeMetrics(profitable);
    assert.equal(m.variableCosts, eur(10000));
    assert.equal(m.fixedCosts, eur(3000));
    assert.equal(m.staffCosts, eur(7000));
    assert.equal(m.totalFixed, eur(10000));
    assert.equal(m.contribution, eur(15000));
    assert.equal(m.contributionRatio, 0.6);
    assert.equal(m.result, eur(5000));
    assert.equal(m.resultMargin, 0.2);
    assert.deepEqual(m.breakEven, { status: 'ok', value: eur(16666.67) });
    assert.equal(m.safetyMargin, eur(8333.33));
    assert.equal(m.staffWeight, 0.28);
    assert.equal(m.variableWeight, 0.4);
  });
  it('empresa con pérdidas: no oculta el resultado negativo', () => {
    const m = computeMetrics(make({ revenue: eur(10000), purchases: eur(4000), rent: eur(3000), salaries: eur(5000) }));
    assert.equal(m.result, eur(-2000));
    assert.equal(m.resultMargin, -0.2);
    assert.deepEqual(m.breakEven, { status: 'ok', value: eur(13333.33) });
    assert.equal(m.safetyMargin, eur(-3333.33));
  });
  it('facturación cero: sin ratios ni punto de equilibrio', () => {
    const m = computeMetrics(make({ rent: eur(1000) }));
    assert.equal(m.contributionRatio, null);
    assert.equal(m.resultMargin, null);
    assert.equal(m.staffWeight, null);
    assert.deepEqual(m.breakEven, { status: 'no-sales' });
    assert.equal(m.safetyMargin, null);
    assert.equal(m.result, eur(-1000));
  });
  it('costes variables iguales a la facturación', () => {
    const m = computeMetrics(make({ revenue: eur(1000), purchases: eur(1000), rent: eur(100) }));
    assert.equal(m.contributionRatio, 0);
    assert.deepEqual(m.breakEven, { status: 'unreachable' });
  });
  it('costes variables superiores a la facturación', () => {
    const m = computeMetrics(make({ revenue: eur(1000), purchases: eur(1500), rent: eur(100) }));
    assert.equal(m.contributionRatio, -0.5);
    assert.deepEqual(m.breakEven, { status: 'unreachable' });
    assert.equal(m.safetyMargin, null);
  });
  it('costes fijos cero', () => {
    assert.deepEqual(computeMetrics(make({ revenue: eur(1000), purchases: eur(400) })).breakEven, { status: 'ok', value: 0 });
    assert.deepEqual(computeMetrics(make({ revenue: eur(1000), purchases: eur(1000) })).breakEven, { status: 'no-margin' });
  });
  it('todos los valores cero: nada infinito ni NaN', () => {
    const m = computeMetrics(zero);
    for (const v of Object.values(m)) if (typeof v === 'number') assert.ok(Number.isFinite(v));
    assert.equal(m.result, 0);
  });
  it('Seguridad Social incluida en salarios: no se cuenta dos veces', () => {
    const base = { revenue: eur(10000), salaries: eur(4000), socialSecurity: eur(1200), otherStaff: eur(100) };
    assert.equal(computeMetrics(make(base)).staffCosts, eur(5300));
    assert.equal(computeMetrics(make({ ...base, salariesIncludeSocialSecurity: true })).staffCosts, eur(4100));
  });
  it('decimales sin errores de redondeo visibles', () => {
    const m = computeMetrics(make({ revenue: 10, purchases: 1, otherVariable: 2 })); // 0,10 − 0,01 − 0,02
    assert.equal(m.result, 7);
    assert.equal(formatEUR(make({ revenue: 30 }).revenue + 0), '0,30 €');
    const n = computeMetrics(make({ revenue: eur(3), rent: eur(1) , purchases: eur(1)}));
    assert.deepEqual(n.breakEven, { status: 'ok', value: 150 }); // 1 / (2/3) = 1,50
  });
});

describe('simulador', () => {
  it('sin variaciones reproduce la situación actual', () => {
    const s = simulate(profitable, NEUTRAL);
    assert.equal(s.result, eur(5000));
    assert.equal(s.resultDelta, 0);
  });
  it('variaciones positivas y negativas de ventas', () => {
    const up = simulate(profitable, { ...NEUTRAL, volume: 20 });
    assert.equal(up.revenue, eur(30000));
    assert.equal(up.variableCosts, eur(12000));
    assert.equal(up.result, eur(8000));
    assert.equal(up.resultDelta, eur(3000));
    const down = simulate(profitable, { ...NEUTRAL, volume: -50 });
    assert.equal(down.revenue, eur(12500));
    assert.equal(down.result, eur(-2500));
  });
  it('variaciones de costes y de personal', () => {
    const s = simulate(profitable, { volume: 10, unitCost: 10, fixed: -10, staff: 50 });
    assert.equal(s.variableCosts, eur(12100)); // 10.000 × 1,1 × 1,1
    assert.equal(s.fixedCosts, eur(2700));
    assert.equal(s.staffCosts, eur(10500));
    assert.equal(s.result, eur(27500 - 12100 - 2700 - 10500));
  });
  it('no modifica los datos originales y limita las variaciones al rango', () => {
    const copy = structuredClone(profitable);
    const s = simulate(profitable, { volume: 500, unitCost: -99, fixed: 0, staff: 0 });
    assert.deepEqual(profitable, copy);
    assert.equal(s.revenue, eur(50000)); // +100 % como máximo
  });
  it('escenarios predefinidos', () => {
    assert.ok(simulate(profitable, PRESETS.conservative.adjustments).result < eur(5000));
    assert.ok(simulate(profitable, PRESETS.optimistic.adjustments).result > eur(5000));
  });
  it('objetivo de resultado alcanzable', () => {
    const t = salesForTarget(profitable, NEUTRAL, eur(8000));
    assert.equal(t.status, 'ok');
    if (t.status === 'ok') {
      assert.equal(t.value, eur(30000)); // (10.000 + 8.000) / 0,6
      assert.ok(Math.abs(t.change - 0.2) < 1e-12);
    }
  });
  it('objetivo con costes ajustados', () => {
    const t = salesForTarget(profitable, { volume: 0, unitCost: 25, fixed: 0, staff: 0 }, 0);
    // TMC2 = 1 − 0,4 × 1,25 = 0,5 → 10.000 / 0,5
    assert.deepEqual(t.status === 'ok' && t.value, eur(20000));
  });
  it('objetivo no alcanzable o sin ventas', () => {
    assert.deepEqual(salesForTarget(make({ revenue: eur(100), purchases: eur(100), rent: 1 }), NEUTRAL, eur(10)), { status: 'unreachable' });
    assert.deepEqual(salesForTarget(make({ rent: eur(100) }), NEUTRAL, eur(10)), { status: 'no-sales' });
  });
});

describe('diagnóstico y soluciones', () => {
  it('clasifica cada situación', () => {
    assert.equal(classify(computeMetrics(profitable)), 'profitable');
    assert.equal(classify(computeMetrics(make({ revenue: eur(10000), rent: eur(9500) }))), 'low-margin');
    assert.equal(classify(computeMetrics(make({ revenue: eur(10000), rent: eur(10000) }))), 'breakeven');
    assert.equal(classify(computeMetrics(make({ revenue: eur(10000), rent: eur(12000) }))), 'losses');
    assert.equal(classify(computeMetrics(make({ rent: eur(1000) }))), 'insufficient');
    assert.equal(classify(computeMetrics(make({ revenue: eur(1000) }))), 'insufficient');
    assert.equal(classify(computeMetrics(zero)), 'insufficient');
  });
  it('recomendaciones cuantificadas coherentes con las cifras', () => {
    const d = diagnose(make({ revenue: eur(10000), purchases: eur(4000), rent: eur(3000), salaries: eur(5000) }), computeMetrics(make({ revenue: eur(10000), purchases: eur(4000), rent: eur(3000), salaries: eur(5000) })));
    assert.equal(d.kind, 'losses');
    assert.ok(d.recommendations.some((r) => r.includes('3.333,33')));
    assert.ok(d.recommendations.some((r) => r.includes('2.000,00') && r.includes('25,0')));
  });
  it('cada diagnóstico tiene servicio y mensaje comercial', () => {
    assert.equal(proposalFor('losses').service, 'Consultoría de rentabilidad y optimización de costes');
    assert.equal(proposalFor('low-margin').pitch.cta, 'Quiero optimizar mis márgenes');
    assert.equal(proposalFor('profitable').service, 'Business Intelligence y automatización financiera');
    assert.equal(proposalFor('insufficient').pitch.cta, 'Solicitar asesoramiento');
  });
});

describe('validación', () => {
  const now = new Date(2026, 9, 30);
  it('datos de empresa', () => {
    assert.equal(validateCompany(emptyCompany(), now).ok, false);
    const ok = validateCompany({ sector: 'Comercio', employees: '4', periodKind: 'month', month: '9', year: '2026', name: ' ' }, now);
    assert.deepEqual(ok, { ok: true, value: { sector: 'Comercio', employees: 4, period: { kind: 'month', month: 9, year: 2026 }, name: '' } });
    const r = validateCompany({ sector: 'Inventado', employees: '2,5', periodKind: 'month', month: '12', year: '2026', name: '' }, now);
    assert.equal(r.ok, false);
    if (!r.ok) assert.deepEqual(Object.keys(r.errors).sort(), ['employees', 'month', 'sector']);
  });
  it('datos financieros: facturación obligatoria, opcionales vacíos = 0, errores explicados', () => {
    const d = emptyFinancials();
    const r = validateFinancials(d);
    assert.equal(r.ok, false);
    if (!r.ok) assert.deepEqual(Object.keys(r.errors), ['revenue']);
    const ok = validateFinancials({ ...d, revenue: '0' });
    assert.equal(ok.ok && ok.value.rent, 0);
    const bad = validateFinancials({ ...d, revenue: '100', rent: 'mucho' });
    assert.equal(!bad.ok && typeof bad.errors.rent, 'string');
  });
  it('el servidor rechaza análisis manipulados', () => {
    const company = { sector: 'Comercio', employees: 3, period: { kind: 'average' }, name: '' };
    assert.ok(parseAnalysis({ company, inputs: profitable }, now));
    assert.equal(parseAnalysis({ company, inputs: { ...profitable, rent: -1 } }, now), null);
    assert.equal(parseAnalysis({ company, inputs: { ...profitable, rent: 1.5 } }, now), null);
    assert.equal(parseAnalysis({ company, inputs: { ...profitable, rent: '100' } }, now), null);
    assert.equal(parseAnalysis({ company: { ...company, sector: '<script>' }, inputs: profitable }, now), null);
    assert.equal(parseAnalysis(null, now), null);
  });
});
