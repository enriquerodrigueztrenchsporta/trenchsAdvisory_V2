// Simulador de escenarios. Nunca modifica los datos originales: devuelve cifras nuevas a partir de ellos.
//
// Hipótesis del MVP: precio y mezcla de productos constantes, así que las ventas varían con el volumen.
//   V2  = V  × (1 + Δvolumen)
//   CV2 = CV × (1 + Δvolumen) × (1 + Δcoste unitario)
//   GF2 = GF × (1 + Δgastos fijos)
//   CP2 = CP × (1 + Δpersonal)
//   R2  = V2 − CV2 − GF2 − CP2
// Ventas necesarias para un resultado objetivo O: V* = (GF2 + CP2 + O) / TMC2, con TMC2 = 1 − CV2 / V2.

import { breakEvenOf, computeMetrics, type BreakEven, type Metrics } from './engine.ts';
import { roundCents, scale, type Cents } from './money.ts';
import type { FinancialInputs } from './types.ts';

/** Variaciones en puntos porcentuales enteros (−50 = −50 %). */
export type Adjustments = { volume: number; unitCost: number; fixed: number; staff: number };

export const LIMITS: Record<keyof Adjustments, { min: number; max: number }> = {
  volume: { min: -50, max: 100 },
  unitCost: { min: -30, max: 30 },
  fixed: { min: -30, max: 50 },
  staff: { min: -30, max: 50 },
};

export const NEUTRAL: Adjustments = { volume: 0, unitCost: 0, fixed: 0, staff: 0 };

/**
 * Escenarios predefinidos. Son supuestos ilustrativos para explorar la sensibilidad del resultado, no previsiones:
 * - Conservador: el volumen cae un 10 %, el coste unitario sube un 5 %, los gastos fijos un 3 % y el personal un 3 %.
 * - Optimista: el volumen sube un 10 % y el coste unitario baja un 3 %, con gastos fijos y personal sin cambios.
 */
export const PRESETS = {
  conservative: { label: 'Conservador', adjustments: { volume: -10, unitCost: 5, fixed: 3, staff: 3 } },
  optimistic: { label: 'Optimista', adjustments: { volume: 10, unitCost: -3, fixed: 0, staff: 0 } },
} as const satisfies Record<string, { label: string; adjustments: Adjustments }>;

export type TargetSales =
  | { status: 'ok'; value: Cents; change: number }
  | { status: 'no-sales' }
  | { status: 'unreachable' };

export type Scenario = {
  revenue: Cents;
  variableCosts: Cents;
  fixedCosts: Cents;
  staffCosts: Cents;
  result: Cents;
  resultMargin: number | null;
  /** Diferencia de resultado frente a la situación actual. */
  resultDelta: Cents;
  breakEven: BreakEven;
};

export function clampAdjustments(a: Adjustments): Adjustments {
  const c = (k: keyof Adjustments) => {
    const v = Number.isFinite(a[k]) ? Math.round(a[k]) : 0;
    return Math.min(LIMITS[k].max, Math.max(LIMITS[k].min, v));
  };
  return { volume: c('volume'), unitCost: c('unitCost'), fixed: c('fixed'), staff: c('staff') };
}

export function simulate(inputs: FinancialInputs, adjustments: Adjustments, base: Metrics = computeMetrics(inputs)): Scenario {
  const a = clampAdjustments(adjustments);
  const revenue = scale(base.revenue, 100 + a.volume, 100);
  // Un único redondeo para el producto de las dos variaciones.
  const variableCosts = scale(base.variableCosts, (100 + a.volume) * (100 + a.unitCost), 10_000);
  const fixedCosts = scale(base.fixedCosts, 100 + a.fixed, 100);
  const staffCosts = scale(base.staffCosts, 100 + a.staff, 100);
  const result = revenue - variableCosts - fixedCosts - staffCosts;
  return {
    revenue,
    variableCosts,
    fixedCosts,
    staffCosts,
    result,
    resultMargin: revenue > 0 ? result / revenue : null,
    resultDelta: result - base.result,
    breakEven: breakEvenOf(revenue, variableCosts, fixedCosts + staffCosts),
  };
}

/**
 * Facturación necesaria para alcanzar `target` con la tasa de margen y los costes fijos del escenario.
 * `change` es la variación de ventas frente a la situación actual. Sin ventas actuales no se conoce la tasa de margen.
 */
export function salesForTarget(inputs: FinancialInputs, adjustments: Adjustments, target: Cents, base: Metrics = computeMetrics(inputs)): TargetSales {
  if (base.revenue <= 0) return { status: 'no-sales' };
  const a = clampAdjustments(adjustments);
  // TMC2 no depende del volumen: 1 − (CV/V) × (1 + Δcoste unitario).
  const ratio = 1 - (base.variableCosts / base.revenue) * ((100 + a.unitCost) / 100);
  const fixed = scale(base.fixedCosts, 100 + a.fixed, 100) + scale(base.staffCosts, 100 + a.staff, 100);
  const needed = fixed + target;
  if (needed <= 0) return { status: 'ok', value: 0, change: -1 };
  if (ratio <= 0) return { status: 'unreachable' };
  const value = roundCents(needed / ratio);
  return { status: 'ok', value, change: value / base.revenue - 1 };
}
