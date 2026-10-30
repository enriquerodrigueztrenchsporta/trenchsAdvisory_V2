// Simulador de escenarios. Nunca modifica los datos originales: devuelve cifras nuevas a partir de ellos.
//
// Hipótesis: precio y mezcla de productos constantes, así que las ventas varían con el volumen.
//   V2  = V  × (1 + Δventas)
//   CV2 = CV × (1 + Δventas) × (1 + Δcoste variable unitario)
//   GF2 = GF × (1 + Δfijos)    CP2 = CP × (1 + Δfijos)
//   R2  = V2 − CV2 − GF2 − CP2

import { computeMetrics, type Metrics } from './engine.ts';
import { scale } from './money.ts';

/** Variaciones en puntos porcentuales enteros (−50 = −50 %). */
export type Adjustments = { volume: number; unitCost: number; fixed: number };

export const LIMITS: Record<keyof Adjustments, { min: number; max: number }> = {
  volume: { min: -50, max: 100 },
  unitCost: { min: -30, max: 30 },
  fixed: { min: -30, max: 50 },
};

export const NEUTRAL: Adjustments = { volume: 0, unitCost: 0, fixed: 0 };

export const isNeutral = (a: Adjustments) => a.volume === 0 && a.unitCost === 0 && a.fixed === 0;

export function clampAdjustments(a: Adjustments): Adjustments {
  const c = (k: keyof Adjustments) => {
    const v = Number.isFinite(a[k]) ? Math.round(a[k]) : 0;
    return Math.min(LIMITS[k].max, Math.max(LIMITS[k].min, v));
  };
  return { volume: c('volume'), unitCost: c('unitCost'), fixed: c('fixed') };
}

/** Indicadores completos del escenario, calculados con el mismo motor que la situación actual. */
export function simulate(base: Metrics, adjustments: Adjustments): Metrics {
  const a = clampAdjustments(adjustments);
  return computeMetrics({
    revenue: scale(base.revenue, 100 + a.volume, 100),
    // Un único redondeo para el producto de las dos variaciones.
    variableCosts: scale(base.variableCosts, (100 + a.volume) * (100 + a.unitCost), 10_000),
    fixedCosts: scale(base.fixedCosts, 100 + a.fixed, 100),
    staffCosts: scale(base.staffCosts, 100 + a.fixed, 100),
  });
}
