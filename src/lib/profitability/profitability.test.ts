// Pruebas del motor financiero. Ejecutar con: npm test
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classify, diagnose } from './diagnosis.ts';
import { computeMetrics, type FinancialInputs } from './engine.ts';
import { formatEUR, formatEURShort, formatPct, formatPctShort, parseAmount } from './money.ts';
import { NEUTRAL, simulate } from './scenarios.ts';
import { breakEvenText, summaryText } from './summary.ts';

const eur = (n: number) => Math.round(n * 100);
const make = (revenue: number, variableCosts: number, fixedCosts: number, staffCosts: number): FinancialInputs => ({
  revenue: eur(revenue),
  variableCosts: eur(variableCosts),
  fixedCosts: eur(fixedCosts),
  staffCosts: eur(staffCosts),
});

// Ejemplo de referencia del encargo: 25.000 / 8.500 / 4.500 / 7.000.
const example = make(25000, 8500, 4500, 7000);

describe('importes', () => {
  it('interpreta formatos españoles e internacionales sencillos', () => {
    assert.deepEqual(parseAmount('25.000,50'), { ok: true, value: 2500050 });
    assert.deepEqual(parseAmount('25000'), { ok: true, value: 2500000 });
    assert.deepEqual(parseAmount('25.000'), { ok: true, value: 2500000 });
    assert.deepEqual(parseAmount('1234.5'), { ok: true, value: 123450 });
    assert.deepEqual(parseAmount(' 1 500 € '), { ok: true, value: 150000 });
    assert.deepEqual(parseAmount(''), { ok: true, value: null });
  });
  it('rechaza textos erróneos sin convertirlos en cero', () => {
    for (const bad of ['abc', '-5', '1,2,3', '1,234', '12.3456', '1e5', 'Infinity', 'NaN', '1.23.4']) assert.equal(parseAmount(bad).ok, false, bad);
    assert.equal(parseAmount('99999999999').ok, false);
  });
  it('formatea en euros y porcentajes españoles', () => {
    assert.equal(formatEUR(2500000), '25.000,00 €');
    assert.equal(formatEURShort(1742424), '17.424 €');
    assert.equal(formatEUR(-150), '-1,50 €');
    assert.equal(formatPct(0.6), '60,0 %');
    assert.equal(formatPctShort(0.66), '66 %');
  });
});

describe('indicadores', () => {
  it('reproduce el ejemplo de referencia', () => {
    const m = computeMetrics(example);
    assert.equal(m.totalCosts, eur(20000));
    assert.equal(m.result, eur(5000));
    assert.equal(m.contributionRatio, 0.66);
    assert.deepEqual(m.breakEven, { status: 'ok', value: eur(17424.24) });
    assert.equal(m.safetyMargin, eur(7575.76));
    assert.equal(breakEvenText(m.breakEven), '17.424 €');
  });
  it('pérdidas: no oculta el resultado negativo', () => {
    const m = computeMetrics(make(10000, 4000, 3000, 5000));
    assert.equal(m.result, eur(-2000));
    assert.equal(m.resultMargin, -0.2);
    assert.equal(m.safetyMargin, eur(-3333.33));
  });
  it('facturación cero: sin ratios ni punto de equilibrio', () => {
    const m = computeMetrics(make(0, 0, 1000, 0));
    assert.equal(m.contributionRatio, null);
    assert.equal(m.resultMargin, null);
    assert.deepEqual(m.breakEven, { status: 'no-sales' });
    assert.equal(m.safetyMargin, null);
    assert.equal(m.result, eur(-1000));
  });
  it('costes variables iguales o superiores a la facturación', () => {
    assert.deepEqual(computeMetrics(make(1000, 1000, 100, 0)).breakEven, { status: 'unreachable' });
    const m = computeMetrics(make(1000, 1500, 100, 0));
    assert.equal(m.contributionRatio, -0.5);
    assert.deepEqual(m.breakEven, { status: 'unreachable' });
    assert.equal(breakEvenText(m.breakEven), 'No alcanzable');
  });
  it('costes fijos cero', () => {
    assert.deepEqual(computeMetrics(make(1000, 400, 0, 0)).breakEven, { status: 'ok', value: 0 });
    assert.deepEqual(computeMetrics(make(1000, 1000, 0, 0)).breakEven, { status: 'no-margin' });
  });
  it('todos los valores cero: nada infinito ni NaN', () => {
    const m = computeMetrics(make(0, 0, 0, 0));
    for (const v of Object.values(m)) if (typeof v === 'number') assert.ok(Number.isFinite(v));
  });
  it('decimales sin errores de redondeo visibles', () => {
    assert.equal(computeMetrics({ revenue: 10, variableCosts: 1, fixedCosts: 2, staffCosts: 0 }).result, 7);
    assert.deepEqual(computeMetrics(make(3, 1, 1, 0)).breakEven, { status: 'ok', value: 150 }); // 1 / (2/3) = 1,50
  });
});

describe('simulador', () => {
  const base = computeMetrics(example);
  it('sin variaciones reproduce la situación actual', () => {
    assert.equal(simulate(base, NEUTRAL).result, base.result);
  });
  it('variaciones de ventas', () => {
    const up = simulate(base, { ...NEUTRAL, volume: 20 });
    assert.equal(up.revenue, eur(30000));
    assert.equal(up.variableCosts, eur(10200));
    assert.equal(up.result, eur(8300));
    assert.equal(simulate(base, { ...NEUTRAL, volume: -50 }).result, eur(12500 - 4250 - 11500));
  });
  it('variaciones de costes (unitario y fijos con personal)', () => {
    const s = simulate(base, { volume: 10, unitCost: 10, fixed: -10 });
    assert.equal(s.variableCosts, eur(10285)); // 8.500 × 1,1 × 1,1
    assert.equal(s.fixedCosts, eur(4050));
    assert.equal(s.staffCosts, eur(6300));
    assert.equal(s.result, eur(27500 - 10285 - 4050 - 6300));
  });
  it('no modifica los datos originales y limita las variaciones al rango', () => {
    const copy = structuredClone(base);
    assert.equal(simulate(base, { volume: 500, unitCost: -99, fixed: 0 }).revenue, eur(50000));
    assert.deepEqual(base, copy);
  });
});

describe('diagnóstico y resumen', () => {
  it('clasifica cada situación', () => {
    assert.equal(classify(computeMetrics(example)), 'profitable');
    assert.equal(classify(computeMetrics(make(10000, 0, 9500, 0))), 'low-margin');
    assert.equal(classify(computeMetrics(make(10000, 0, 10000, 0))), 'breakeven');
    assert.equal(classify(computeMetrics(make(10000, 0, 12000, 0))), 'losses');
    assert.equal(classify(computeMetrics(make(0, 0, 1000, 0))), 'insufficient');
    assert.equal(classify(computeMetrics(make(1000, 0, 0, 0))), 'insufficient');
  });
  it('el resumen incluye indicadores y, si lo hay, el escenario', () => {
    const m = computeMetrics(example);
    const plain = summaryText(m, simulate(m, NEUTRAL), NEUTRAL);
    assert.ok(plain.includes('Resultado mensual estimado: 5.000 €'));
    assert.ok(plain.includes('Punto de equilibrio: 17.424 €'));
    assert.ok(plain.includes(diagnose(m).message));
    assert.ok(!plain.includes('Escenario simulado'));
    const adj = { volume: 10, unitCost: 0, fixed: 0 };
    assert.ok(summaryText(m, simulate(m, adj), adj).includes('Escenario simulado (ventas +10 %'));
  });
});
