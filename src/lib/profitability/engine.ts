// Motor de cálculo: funciones puras y deterministas, sin dependencias de la interfaz ni de servicios externos.
//
// V = ventas, CV = costes variables, GF = gastos fijos sin personal, CP = personal, CF = GF + CP,
// MC = V − CV, TMC = MC / V, R = MC − CF, MR = R / V, PE = CF / TMC, MS = V − PE, MS% = MS / V,
// PP = CP / V, PCV = CV / V.
// Los valores que no pueden calcularse son null: la interfaz muestra «No disponible» con su motivo.

import { roundCents, type Cents } from './money.ts';
import type { FinancialInputs } from './types.ts';

export type BreakEven =
  /** PE calculable (puede ser 0 si no hay costes fijos). */
  | { status: 'ok'; value: Cents }
  /** V = 0: no se conoce la tasa de margen de contribución. */
  | { status: 'no-sales' }
  /** TMC ≤ 0 con costes fijos positivos: ningún volumen de ventas los cubre. */
  | { status: 'unreachable' }
  /** TMC ≤ 0 y CF = 0: no hay margen positivo y presentar un PE sería engañoso. */
  | { status: 'no-margin' };

export type Metrics = {
  revenue: Cents;
  variableCosts: Cents;
  fixedCosts: Cents; // GF
  staffCosts: Cents; // CP
  totalFixed: Cents; // CF
  totalCosts: Cents; // CV + CF
  contribution: Cents; // MC
  contributionRatio: number | null; // TMC
  result: Cents; // R
  resultMargin: number | null; // MR
  breakEven: BreakEven;
  safetyMargin: Cents | null; // MS
  safetyMarginRatio: number | null; // MS%
  staffWeight: number | null; // PP
  variableWeight: number | null; // PCV
};

export const variableCostsOf = (i: FinancialInputs): Cents => i.purchases + i.salesCosts + i.otherVariable;
export const fixedCostsOf = (i: FinancialInputs): Cents => i.rent + i.utilities + i.software + i.insurance + i.marketing + i.otherFixed;
export const staffCostsOf = (i: FinancialInputs): Cents =>
  i.salaries + (i.salariesIncludeSocialSecurity ? 0 : i.socialSecurity) + i.otherStaff;

/** Punto de equilibrio a partir de V, CV y CF, con las condiciones especiales del modelo. */
export function breakEvenOf(revenue: Cents, variableCosts: Cents, totalFixed: Cents): BreakEven {
  if (revenue <= 0) return { status: 'no-sales' };
  const tmc = (revenue - variableCosts) / revenue;
  if (tmc <= 0) return totalFixed > 0 ? { status: 'unreachable' } : { status: 'no-margin' };
  return { status: 'ok', value: totalFixed === 0 ? 0 : roundCents(totalFixed / tmc) };
}

export function computeMetrics(i: FinancialInputs): Metrics {
  const revenue = i.revenue;
  const variableCosts = variableCostsOf(i);
  const fixedCosts = fixedCostsOf(i);
  const staffCosts = staffCostsOf(i);
  const totalFixed = fixedCosts + staffCosts;
  const contribution = revenue - variableCosts;
  const result = contribution - totalFixed;
  const hasSales = revenue > 0;
  const ratio = (x: number) => (hasSales ? x / revenue : null);
  const breakEven = breakEvenOf(revenue, variableCosts, totalFixed);
  const safetyMargin = breakEven.status === 'ok' ? revenue - breakEven.value : null;

  return {
    revenue,
    variableCosts,
    fixedCosts,
    staffCosts,
    totalFixed,
    totalCosts: variableCosts + totalFixed,
    contribution,
    contributionRatio: ratio(contribution),
    result,
    resultMargin: ratio(result),
    breakEven,
    safetyMargin,
    safetyMarginRatio: safetyMargin === null ? null : ratio(safetyMargin),
    staffWeight: ratio(staffCosts),
    variableWeight: ratio(variableCosts),
  };
}

/** Partidas de coste para el gráfico de distribución (las de importe 0 se omiten en la interfaz). */
export function costBreakdown(i: FinancialInputs): { key: string; label: string; group: 'variable' | 'fixed' | 'staff'; value: Cents }[] {
  return [
    { key: 'purchases', label: 'Compras y materias primas', group: 'variable' as const, value: i.purchases },
    { key: 'salesCosts', label: 'Costes asociados a ventas', group: 'variable' as const, value: i.salesCosts },
    { key: 'otherVariable', label: 'Otros costes variables', group: 'variable' as const, value: i.otherVariable },
    { key: 'rent', label: 'Alquiler', group: 'fixed' as const, value: i.rent },
    { key: 'utilities', label: 'Suministros', group: 'fixed' as const, value: i.utilities },
    { key: 'staff', label: 'Personal', group: 'staff' as const, value: staffCostsOf(i) },
    { key: 'software', label: 'Software', group: 'fixed' as const, value: i.software },
    { key: 'insurance', label: 'Seguros', group: 'fixed' as const, value: i.insurance },
    { key: 'marketing', label: 'Marketing', group: 'fixed' as const, value: i.marketing },
    { key: 'otherFixed', label: 'Otros gastos fijos', group: 'fixed' as const, value: i.otherFixed },
  ];
}
