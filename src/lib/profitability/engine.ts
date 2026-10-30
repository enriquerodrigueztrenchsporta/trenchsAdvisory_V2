// Motor de cálculo: funciones puras y deterministas, sin dependencias de la interfaz ni de servicios externos.
//
// V = ventas, CV = costes variables, GF = gastos fijos, CP = personal, CF = GF + CP,
// MC = V − CV, TMC = MC / V, R = MC − CF, MR = R / V, PE = CF / TMC, MS = V − PE.
// Los valores que no pueden calcularse son null o un estado explícito: la interfaz muestra «No disponible».

import { roundCents, type Cents } from './money.ts';

/** Los cuatro datos mensuales, en céntimos y sin IVA. */
export type FinancialInputs = { revenue: Cents; variableCosts: Cents; fixedCosts: Cents; staffCosts: Cents };

export type BreakEven =
  /** PE calculable (puede ser 0 si no hay costes fijos). */
  | { status: 'ok'; value: Cents }
  /** V = 0: no se conoce la tasa de margen de contribución. */
  | { status: 'no-sales' }
  /** TMC ≤ 0 con costes fijos positivos: ningún volumen de ventas los cubre. */
  | { status: 'unreachable' }
  /** TMC ≤ 0 y CF = 0: no hay margen positivo y presentar un PE sería engañoso. */
  | { status: 'no-margin' };

export type Metrics = FinancialInputs & {
  totalFixed: Cents; // CF
  totalCosts: Cents; // CV + CF
  contribution: Cents; // MC
  contributionRatio: number | null; // TMC
  result: Cents; // R
  resultMargin: number | null; // MR
  breakEven: BreakEven;
  safetyMargin: Cents | null; // MS
  safetyMarginRatio: number | null; // MS / V
};

/** Punto de equilibrio a partir de V, CV y CF, con las condiciones especiales del modelo. */
export function breakEvenOf(revenue: Cents, variableCosts: Cents, totalFixed: Cents): BreakEven {
  if (revenue <= 0) return { status: 'no-sales' };
  const tmc = (revenue - variableCosts) / revenue;
  if (tmc <= 0) return totalFixed > 0 ? { status: 'unreachable' } : { status: 'no-margin' };
  return { status: 'ok', value: totalFixed === 0 ? 0 : roundCents(totalFixed / tmc) };
}

export function computeMetrics(i: FinancialInputs): Metrics {
  const totalFixed = i.fixedCosts + i.staffCosts;
  const contribution = i.revenue - i.variableCosts;
  const result = contribution - totalFixed;
  const ratio = (x: number) => (i.revenue > 0 ? x / i.revenue : null);
  const breakEven = breakEvenOf(i.revenue, i.variableCosts, totalFixed);
  const safetyMargin = breakEven.status === 'ok' ? i.revenue - breakEven.value : null;

  return {
    ...i,
    totalFixed,
    totalCosts: i.variableCosts + totalFixed,
    contribution,
    contributionRatio: ratio(contribution),
    result,
    resultMargin: ratio(result),
    breakEven,
    safetyMargin,
    safetyMarginRatio: safetyMargin === null ? null : ratio(safetyMargin),
  };
}
