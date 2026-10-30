'use client';

import type { Metrics } from '@/lib/profitability/engine';
import { formatEUR, formatPct } from '@/lib/profitability/money';
import type { FinancialInputs } from '@/lib/profitability/types';
import { breakEvenText } from '@/lib/contact/lead';
import { BreakEvenChart } from './charts/BreakEvenChart';
import { CostBreakdownChart } from './charts/CostBreakdownChart';
import { IncomeCostChart } from './charts/IncomeCostChart';
import { Note } from './fields';

export const DISCLAIMER =
  'Este análisis es orientativo y no sustituye una cuenta de resultados contable completa. Puede no incorporar amortizaciones, impuestos, intereses, variación de existencias u otros ajustes.';

const NA = 'No disponible';
type Tone = 'neutral' | 'positive' | 'negative';
type Kpi = { label: string; value: string; detail?: string; tone?: Tone; featured?: boolean };

const toneOf = (v: number | null): Tone => (v === null || v === 0 ? 'neutral' : v > 0 ? 'positive' : 'negative');

function KpiCard({ k, className = '' }: { k: Kpi; className?: string }) {
  return (
    <div
      className={`${className} flex min-w-0 flex-col rounded-[1.1rem] border p-4 sm:p-5 ${
        k.featured ? (k.tone === 'negative' ? 'border-loss/40 bg-loss/[0.06]' : 'on-dark border-forest-900 bg-forest-900 text-cream-50') : 'border-line bg-cream-50'
      }`}
    >
      <dt className={`text-[0.8rem] font-medium ${k.featured && k.tone !== 'negative' ? 'text-cream-50/80' : 'text-ink-mute'}`}>{k.label}</dt>
      <dd
        className={`mt-3 break-words font-serif text-[clamp(1.25rem,2.2vw,1.9rem)] leading-none tracking-tight tabular-nums ${
          k.tone === 'negative' ? 'text-loss' : ''
        } ${k.value === NA || k.value.startsWith('No ') ? 'text-[1.05rem] text-ink-mute' : ''}`}
      >
        {k.tone === 'negative' && <span className="sr-only">Negativo: </span>}
        {k.value}
      </dd>
      {k.detail && <dd className={`mt-2 text-[0.8rem] leading-snug ${k.featured && k.tone !== 'negative' ? 'text-cream-50/75' : 'text-ink-mute'}`}>{k.detail}</dd>}
    </div>
  );
}

/** Paso 3 · Diagnóstico financiero: indicadores y gráficos. */
export function Dashboard({ inputs, metrics: mt }: { inputs: FinancialInputs; metrics: Metrics }) {
  const pct = (r: number | null) => (r === null ? NA : formatPct(r));
  const kpis: Kpi[] = [
    { label: 'Resultado operativo simplificado', value: formatEUR(mt.result), detail: 'Ventas − costes variables − costes fijos', tone: toneOf(mt.result), featured: true },
    { label: 'Margen de resultado', value: pct(mt.resultMargin), detail: 'Resultado sobre ventas', tone: toneOf(mt.resultMargin) },
    { label: 'Facturación mensual', value: formatEUR(mt.revenue) },
    { label: 'Costes variables', value: formatEUR(mt.variableCosts), detail: mt.variableWeight === null ? undefined : `${formatPct(mt.variableWeight)} de las ventas` },
    { label: 'Costes fijos totales', value: formatEUR(mt.totalFixed), detail: `Gastos fijos ${formatEUR(mt.fixedCosts)} + personal ${formatEUR(mt.staffCosts)}` },
    { label: 'Margen de contribución', value: formatEUR(mt.contribution), detail: 'Lo que queda de las ventas para cubrir los costes fijos', tone: mt.contribution < 0 ? 'negative' : 'neutral' },
    { label: 'Margen de contribución (%)', value: pct(mt.contributionRatio), tone: mt.contributionRatio !== null && mt.contributionRatio < 0 ? 'negative' : 'neutral' },
    { label: 'Punto de equilibrio', value: breakEvenText(mt), detail: mt.breakEven.status === 'ok' ? 'Facturación mensual que iguala ingresos y costes' : undefined },
    {
      label: 'Margen de seguridad',
      value: mt.safetyMargin === null ? NA : formatEUR(mt.safetyMargin),
      detail: mt.safetyMarginRatio === null ? 'Requiere un punto de equilibrio calculable' : `${formatPct(mt.safetyMarginRatio)} de las ventas actuales`,
      tone: toneOf(mt.safetyMargin),
    },
    { label: 'Peso del personal', value: pct(mt.staffWeight), detail: mt.staffWeight === null ? undefined : 'Costes de personal sobre ventas' },
  ];

  return (
    <div className="space-y-8">
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Indicadores principales">
        {kpis.map((k, i) => (
          <KpiCard key={k.label} k={k} className={i === 0 || i === kpis.length - 1 ? 'col-span-2' : ''} />
        ))}
      </dl>
      <Note>{DISCLAIMER}</Note>
      <div className="grid gap-6 lg:grid-cols-2 [&>*]:min-w-0">
        <IncomeCostChart metrics={mt} />
        <CostBreakdownChart inputs={inputs} metrics={mt} />
        <BreakEvenChart metrics={mt} />
        <div className="rounded-[1.25rem] border border-line bg-cream-100 p-5 md:p-7 lg:self-start">
          <h3 className="font-serif text-[1.45rem] leading-tight tracking-tight">Cómo leer estos indicadores</h3>
          <dl className="mt-4 space-y-3 text-[0.9rem] text-ink-soft">
            <div>
              <dt className="font-medium text-ink">Margen de contribución</dt>
              <dd>Ventas menos costes variables. Es lo que aporta la actividad para pagar los costes fijos.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Punto de equilibrio</dt>
              <dd>Facturación con la que el resultado es cero: costes fijos ÷ margen de contribución en porcentaje.</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Margen de seguridad</dt>
              <dd>Cuánto pueden caer las ventas antes de entrar en pérdidas. Si es negativo, falta esa facturación para cubrir costes.</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
