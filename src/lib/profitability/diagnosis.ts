// Diagnóstico automático: reglas transparentes sobre las cifras calculadas. Sin benchmarks sectoriales ni IA.

import { costBreakdown, type Metrics } from './engine.ts';
import { formatEUR, formatPct, roundCents } from './money.ts';
import type { FinancialInputs } from './types.ts';

/**
 * Umbral orientativo de margen de resultado por debajo del cual un resultado positivo se considera «reducido».
 * Es una regla de producto de esta herramienta, no un estándar universal ni una comparación sectorial.
 */
export const LOW_MARGIN_THRESHOLD = 0.1;

export type DiagnosisKind = 'losses' | 'breakeven' | 'low-margin' | 'profitable' | 'insufficient';

export type Diagnosis = {
  kind: DiagnosisKind;
  headline: string;
  message: string;
  /** Problemas y oportunidades detectados, en frases basadas solo en las cifras. */
  findings: string[];
  /** Recomendaciones; las cuantificadas son estimaciones bajo las hipótesis del modelo. */
  recommendations: string[];
};

const MESSAGES: Record<DiagnosisKind, { headline: string; message: string }> = {
  losses: {
    headline: 'Empresa con pérdidas',
    message:
      'Según los datos introducidos, los costes de tu empresa superan los ingresos. Conviene revisar la estructura de costes y estudiar distintas alternativas para recuperar rentabilidad.',
  },
  breakeven: {
    headline: 'Empresa en su punto de equilibrio',
    message:
      'Según los datos introducidos, los ingresos cubren exactamente los costes: el resultado operativo simplificado es cero. Cualquier variación de ventas o costes inclinará el resultado hacia un lado u otro.',
  },
  'low-margin': {
    headline: 'Empresa rentable con margen reducido',
    message: 'Tu empresa presenta un resultado positivo, aunque el margen calculado ofrece espacio para estudiar posibles mejoras.',
  },
  profitable: {
    headline: 'Empresa rentable',
    message:
      'Tu empresa presenta un resultado operativo simplificado positivo. El siguiente paso puede ser mejorar el control de resultados y anticipar posibles cambios.',
  },
  insufficient: {
    headline: 'Datos insuficientes',
    message:
      'Con los datos introducidos no es posible realizar un diagnóstico fiable. Revisa que hayas indicado la facturación y los costes del periodo.',
  },
};

export function classify(m: Metrics): DiagnosisKind {
  // Sin ventas o sin ningún coste, las cifras no describen la actividad de una empresa.
  if (m.revenue <= 0 || m.totalCosts <= 0) return 'insufficient';
  if (m.result < 0) return 'losses';
  if (m.result === 0) return 'breakeven';
  return (m.resultMargin ?? 0) < LOW_MARGIN_THRESHOLD ? 'low-margin' : 'profitable';
}

export function diagnose(inputs: FinancialInputs, m: Metrics): Diagnosis {
  const kind = classify(m);
  const findings: string[] = [];
  const recommendations: string[] = [];

  if (kind === 'insufficient') {
    if (m.revenue <= 0) findings.push('No se ha indicado facturación en el periodo, así que no pueden calcularse márgenes ni ratios sobre ventas.');
    if (m.totalCosts <= 0) findings.push('No se ha indicado ningún coste, así que el resultado calculado no reflejaría la actividad real.');
    recommendations.push('Reúne la facturación y los principales costes de un mes representativo y repite el análisis.');
    return { kind, ...MESSAGES[kind], findings, recommendations };
  }

  const ratio = m.contributionRatio ?? 0;

  // Margen de contribución
  if (ratio <= 0) {
    findings.push(
      `Los costes variables (${formatEUR(m.variableCosts)}) igualan o superan la facturación: cada venta no cubre ni su propio coste variable.`,
    );
    recommendations.push('Revisar precios y costes variables es prioritario: con la estructura actual, vender más no mejora el resultado.');
  } else {
    findings.push(`Cada 100 € de ventas dejan ${formatEUR(roundCents(ratio * 10_000))} para cubrir los costes fijos (margen de contribución del ${formatPct(ratio)}).`);
  }

  // Punto de equilibrio y margen de seguridad
  if (m.breakEven.status === 'unreachable') {
    findings.push('El punto de equilibrio no es alcanzable bajo las hipótesis del modelo: ningún volumen de ventas cubre los costes fijos.');
  } else if (m.breakEven.status === 'ok' && m.safetyMargin !== null && m.safetyMarginRatio !== null) {
    if (m.safetyMargin < 0) {
      const gap = -m.safetyMargin;
      findings.push(`La facturación está ${formatEUR(gap)} por debajo del punto de equilibrio (${formatEUR(m.breakEven.value)}).`);
      recommendations.push(
        `Con el margen de contribución actual, cubrir los costes exigiría facturar ${formatEUR(gap)} más al mes (+${formatPct(gap / m.revenue)}). Estimación bajo las hipótesis del modelo, no un resultado garantizado.`,
      );
    } else if (m.safetyMargin > 0) {
      findings.push(`Las ventas podrían caer un ${formatPct(m.safetyMarginRatio)} antes de entrar en pérdidas (margen de seguridad de ${formatEUR(m.safetyMargin)}).`);
    }
  }

  // Pérdidas: alternativa por el lado de los costes fijos
  if (m.result < 0 && m.totalFixed > 0) {
    const loss = -m.result;
    if (loss <= m.totalFixed) {
      recommendations.push(
        `Alternativamente, reducir los costes fijos en ${formatEUR(loss)} al mes (${formatPct(loss / m.totalFixed)} del total) igualaría ingresos y costes. Estimación orientativa.`,
      );
    }
  }

  // Partida de mayor peso
  const parts = costBreakdown(inputs).filter((p) => p.value > 0).sort((a, b) => b.value - a.value);
  if (parts.length > 0) {
    const top = parts[0];
    findings.push(`La partida de mayor peso es «${top.label}»: ${formatEUR(top.value)}, el ${formatPct(top.value / m.totalCosts)} de los costes totales.`);
  }
  if (m.staffWeight !== null && m.staffCosts > 0) {
    findings.push(`Los costes de personal equivalen al ${formatPct(m.staffWeight)} de la facturación.`);
  }

  // Sensibilidad a los costes variables (cuantificable siempre que existan)
  if (m.variableCosts > 0 && kind !== 'profitable') {
    recommendations.push(
      `Cada 1 % de ahorro en costes variables mejoraría el resultado en unos ${formatEUR(roundCents(m.variableCosts / 100))} al mes, con el mismo volumen de ventas.`,
    );
  }

  if (kind === 'losses') recommendations.push('Usa el simulador para comparar medidas de recuperación antes de decidir.');
  if (kind === 'breakeven' || kind === 'low-margin') recommendations.push('Revisa en el simulador qué combinación de volumen, costes variables y fijos amplía el margen.');
  if (kind === 'profitable') {
    recommendations.push('Hacer un seguimiento mensual de estos indicadores permite detectar a tiempo cambios en márgenes y costes.');
    recommendations.push('Simula escenarios desfavorables para conocer cuánto margen de maniobra tienes.');
  }

  return { kind, ...MESSAGES[kind], findings, recommendations };
}
