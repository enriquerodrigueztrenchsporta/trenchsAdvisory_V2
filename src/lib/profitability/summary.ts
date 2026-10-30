// Textos del dashboard y del resumen copiable. Solo incluyen indicadores calculables; el resto, «No disponible».

import { diagnose } from './diagnosis.ts';
import type { BreakEven, Metrics } from './engine.ts';
import { formatEURShort, formatPctShort } from './money.ts';
import { isNeutral, type Adjustments } from './scenarios.ts';

export const NA = 'No disponible';

export function breakEvenText(b: BreakEven): string {
  if (b.status === 'ok') return formatEURShort(b.value);
  return b.status === 'unreachable' ? 'No alcanzable' : NA;
}

export type Row = { label: string; value: (m: Metrics) => string; tone?: (m: Metrics) => number };

/** Filas de la tabla del dashboard, en el orden en que se muestran. */
export const ROWS: Row[] = [
  { label: 'Facturación mensual', value: (m) => formatEURShort(m.revenue) },
  { label: 'Costes totales', value: (m) => formatEURShort(m.totalCosts) },
  { label: 'Resultado mensual estimado', value: (m) => formatEURShort(m.result), tone: (m) => m.result },
  { label: 'Margen de contribución', value: (m) => (m.contributionRatio === null ? NA : formatPctShort(m.contributionRatio)), tone: (m) => m.contributionRatio ?? 0 },
  { label: 'Punto de equilibrio', value: (m) => breakEvenText(m.breakEven) },
  { label: 'Margen de seguridad', value: (m) => (m.safetyMargin === null ? NA : formatEURShort(m.safetyMargin)), tone: (m) => m.safetyMargin ?? 0 },
];

const signed = (n: number) => `${n > 0 ? '+' : ''}${n} %`;
export const scenarioLabel = (a: Adjustments) => `ventas ${signed(a.volume)}, coste variable unitario ${signed(a.unitCost)}, gastos fijos y personal ${signed(a.fixed)}`;

/** Resumen en texto plano para copiar al portapapeles. */
export function summaryText(m: Metrics, scenario: Metrics | null, adjustments: Adjustments): string {
  const lines = [
    'Calculadora de Rentabilidad Empresarial · Trenchs Advisory',
    '',
    `Costes variables: ${formatEURShort(m.variableCosts)}`,
    `Gastos fijos: ${formatEURShort(m.fixedCosts)}`,
    `Costes de personal: ${formatEURShort(m.staffCosts)}`,
    ...ROWS.map((r) => `${r.label}: ${r.value(m)}`),
    `Diagnóstico: ${diagnose(m).message}`,
  ];
  if (scenario && !isNeutral(adjustments)) {
    lines.push('', `Escenario simulado (${scenarioLabel(adjustments)}):`, ...ROWS.map((r) => `${r.label}: ${r.value(scenario)}`));
  }
  lines.push('', 'Resultados orientativos: no sustituyen un análisis contable completo.');
  return lines.join('\n');
}
