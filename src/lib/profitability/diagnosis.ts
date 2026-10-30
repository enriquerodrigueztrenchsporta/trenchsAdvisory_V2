// Diagnóstico automático: reglas transparentes sobre las cifras calculadas. Sin benchmarks sectoriales ni IA.

import type { Metrics } from './engine.ts';

/**
 * Umbral orientativo de margen de resultado por debajo del cual un resultado positivo se considera «reducido».
 * Es una regla de producto de esta herramienta, no un estándar universal ni una comparación sectorial.
 */
export const LOW_MARGIN_THRESHOLD = 0.1;

export type DiagnosisKind = 'losses' | 'breakeven' | 'low-margin' | 'profitable' | 'insufficient';
export type Diagnosis = { kind: DiagnosisKind; headline: string; message: string };

const MESSAGES: Record<DiagnosisKind, Omit<Diagnosis, 'kind'>> = {
  losses: {
    headline: 'Pérdidas',
    message: 'Los costes superan a los ingresos. Conviene revisar la estructura de costes y simular alternativas para recuperar rentabilidad.',
  },
  breakeven: {
    headline: 'En equilibrio',
    message: 'Los ingresos cubren exactamente los costes. Cualquier variación de ventas o costes inclinará el resultado hacia un lado u otro.',
  },
  'low-margin': {
    headline: 'Margen reducido',
    message: 'El resultado es positivo, aunque el margen deja poco colchón. Hay espacio para estudiar mejoras en costes o precios.',
  },
  profitable: {
    headline: 'Rentable',
    message: 'El resultado es positivo. El siguiente paso puede ser controlar mejor los resultados y anticipar posibles cambios.',
  },
  insufficient: {
    headline: 'Datos insuficientes',
    message: 'Indica la facturación y al menos un coste del mes para obtener un diagnóstico.',
  },
};

export function classify(m: Metrics): DiagnosisKind {
  // Sin ventas o sin ningún coste, las cifras no describen la actividad de una empresa.
  if (m.revenue <= 0 || m.totalCosts <= 0) return 'insufficient';
  if (m.result < 0) return 'losses';
  if (m.result === 0) return 'breakeven';
  return (m.resultMargin ?? 0) < LOW_MARGIN_THRESHOLD ? 'low-margin' : 'profitable';
}

export function diagnose(m: Metrics): Diagnosis {
  const kind = classify(m);
  return { kind, ...MESSAGES[kind] };
}
