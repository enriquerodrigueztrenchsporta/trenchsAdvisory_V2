'use client';

import { m } from 'framer-motion';
import { useId, useState } from 'react';
import { diagnose, type DiagnosisKind } from '@/lib/profitability/diagnosis';
import type { Metrics } from '@/lib/profitability/engine';
import { formatEURShort, formatPctShort } from '@/lib/profitability/money';
import { isNeutral, LIMITS, NEUTRAL, type Adjustments } from '@/lib/profitability/scenarios';
import { ROWS, summaryText } from '@/lib/profitability/summary';

const STATUS: Record<DiagnosisKind, string> = {
  profitable: 'bg-gold-300 text-forest-950',
  'low-margin': 'bg-gold-300/25 text-gold-300',
  breakeven: 'bg-gold-300/25 text-gold-300',
  losses: 'bg-loss-soft/20 text-loss-soft',
  insufficient: 'bg-cream-50/10 text-cream-50/80',
};

const SLIDERS: { key: keyof Adjustments; label: string }[] = [
  { key: 'volume', label: 'Ventas' },
  { key: 'unitCost', label: 'Coste variable unitario' },
  { key: 'fixed', label: 'Gastos fijos y personal' },
];

const signed = (n: number) => `${n > 0 ? '+' : ''}${n} %`;
const toneClass = (v: number | undefined) => (v !== undefined && v < 0 ? 'text-loss-soft' : '');

function Slider({ label, k, value, onChange }: { label: string; k: keyof Adjustments; value: number; onChange: (v: number) => void }) {
  const id = useId();
  const { min, max } = LIMITS[k];
  const pos = ((value - min) / (max - min)) * 100;
  const zero = (-min / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 text-[0.82rem]">
        <label htmlFor={id} className="text-cream-50/80">
          {label}
        </label>
        <output htmlFor={id} className={`tabular-nums font-medium ${value === 0 ? 'text-cream-50/60' : 'text-gold-300'}`}>
          {signed(value)}
        </output>
      </div>
      <div className="relative mt-1">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-cream-50/15" aria-hidden="true">
          <div className="absolute inset-y-0 rounded-full bg-gold-300" style={{ left: `${Math.min(pos, zero)}%`, width: `${Math.abs(pos - zero)}%` }} />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          aria-valuetext={signed(value)}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sim-range relative w-full"
        />
      </div>
    </div>
  );
}

/** Panel tipo dashboard: resultado, tabla de indicadores, distribución, escenarios y resumen copiable. */
export function ProfitDashboard({ metrics, scenario, adjustments, onAdjust }: { metrics: Metrics | null; scenario: Metrics | null; adjustments: Adjustments; onAdjust: (a: Adjustments) => void }) {
  const [copied, setCopied] = useState(false);
  const d = metrics ? diagnose(metrics) : null;
  const showScenario = metrics !== null && scenario !== null && !isNeutral(adjustments);

  const copy = async () => {
    if (!metrics) return;
    try {
      await navigator.clipboard.writeText(summaryText(metrics, scenario, adjustments));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  // Distribución de la facturación: cada partida sobre el mayor de ventas o costes, % sobre ventas.
  const parts = metrics
    ? [
        { label: 'Costes variables', value: metrics.variableCosts, color: 'bg-gold-500' },
        { label: 'Gastos fijos', value: metrics.fixedCosts, color: 'bg-forest-400' },
        { label: 'Personal', value: metrics.staffCosts, color: 'bg-forest-300' },
        { label: metrics.result < 0 ? 'Pérdida' : 'Resultado', value: metrics.result, color: metrics.result < 0 ? 'bg-loss-soft' : 'bg-cream-50' },
      ]
    : [];
  const scaleMax = metrics ? Math.max(metrics.revenue, metrics.totalCosts, 1) : 1;

  return (
    <section aria-labelledby="dash-title" className="on-dark grain relative overflow-hidden rounded-[1.5rem] bg-forest-950 text-cream-50 shadow-[0_50px_80px_-50px_rgb(20_38_31/0.7)]">
      {/* Barra del panel */}
      <div className="relative flex items-center justify-between gap-3 border-b border-cream-50/10 px-5 py-3.5 md:px-7">
        <span className="flex items-center gap-2" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-cream-50/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream-50/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-cream-50/20" />
        </span>
        <h2 id="dash-title" className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream-50/70">
          Trenchs Financial Lab
        </h2>
        {d ? <span className={`rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium ${STATUS[d.kind]}`}>{d.headline}</span> : <span className="w-16" />}
      </div>

      <div className="relative p-5 md:p-7">
        {/* Resultado principal y diagnóstico */}
        <div aria-live="polite">
          <p className="text-[0.82rem] text-cream-50/70">Resultado mensual estimado</p>
          <p className={`mt-2 font-serif text-[clamp(2.6rem,6vw,4rem)] leading-none tracking-tight tabular-nums ${metrics && metrics.result < 0 ? 'text-loss-soft' : ''}`}>
            {metrics ? formatEURShort(metrics.result) : '—'}
          </p>
          <p className="mt-3 max-w-xl text-[0.92rem] leading-relaxed text-cream-50/80">{d ? d.message : 'Introduce tu facturación para ver los resultados.'}</p>
        </div>

        {/* Tabla de indicadores */}
        <div className="mt-7 overflow-x-auto">
          <table className="w-full text-[0.9rem] tabular-nums">
            <caption className="sr-only">Indicadores de rentabilidad{showScenario ? ', situación actual y escenario simulado' : ''}</caption>
            <thead>
              <tr className="border-b border-cream-50/15 text-[0.72rem] uppercase tracking-[0.14em] text-cream-50/60">
                <th scope="col" className="py-2 pr-3 text-left font-medium">
                  Indicador
                </th>
                <th scope="col" className="py-2 pl-3 text-right font-medium">
                  Actual
                </th>
                {showScenario && (
                  <th scope="col" className="py-2 pl-3 text-right font-medium text-gold-300">
                    Escenario
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-cream-50/[0.08]">
                  <th scope="row" className="py-2.5 pr-3 text-left font-normal text-cream-50/80">
                    {r.label}
                  </th>
                  <td className={`py-2.5 pl-3 text-right font-medium ${metrics ? toneClass(r.tone?.(metrics)) : ''}`}>{metrics ? r.value(metrics) : '—'}</td>
                  {showScenario && <td className={`py-2.5 pl-3 text-right font-medium ${toneClass(r.tone?.(scenario!))}`}>{r.value(scenario!)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Distribución de la facturación */}
        <div className="mt-8">
          <h3 className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-cream-50/60">Distribución de la facturación</h3>
          {metrics && metrics.revenue > 0 ? (
            <ul className="mt-4 space-y-3">
              {parts.map((p, i) => (
                <li key={p.label} className="grid grid-cols-[7.5rem_1fr_auto] items-center gap-3 text-[0.82rem] sm:grid-cols-[9rem_1fr_auto]">
                  <span className="text-cream-50/80">{p.label}</span>
                  <span className="h-2 rounded-full bg-cream-50/[0.06]">
                    <m.span
                      className={`block h-full rounded-full ${p.color}`}
                      initial={false}
                      animate={{ width: `${Math.min(100, (Math.abs(p.value) / scaleMax) * 100)}%` }}
                      transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </span>
                  <span className={`w-14 text-right tabular-nums ${p.value < 0 ? 'text-loss-soft' : 'text-cream-50'}`}>{formatPctShort(p.value / metrics.revenue)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.85rem] text-cream-50/60">Aparecerá al indicar la facturación.</p>
          )}
          {metrics && metrics.revenue > 0 && <p className="mt-2 text-[0.75rem] text-cream-50/50">Porcentajes sobre la facturación.</p>}
        </div>

        {/* Simulación de escenarios */}
        <div className="mt-8 rounded-2xl border border-cream-50/10 bg-cream-50/[0.03] p-4 md:p-5">
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-cream-50/60">Simular un escenario</h3>
            <button
              type="button"
              onClick={() => onAdjust(NEUTRAL)}
              disabled={isNeutral(adjustments)}
              className="text-[0.8rem] font-medium text-gold-300 underline-offset-4 hover:underline disabled:cursor-default disabled:text-cream-50/40 disabled:no-underline"
            >
              Restablecer
            </button>
          </div>
          <div className="mt-4 grid gap-5 sm:grid-cols-3">
            {SLIDERS.map((s) => (
              <Slider key={s.key} label={s.label} k={s.key} value={adjustments[s.key]} onChange={(v) => onAdjust({ ...adjustments, [s.key]: v })} />
            ))}
          </div>
          <p className="mt-3 text-[0.75rem] text-cream-50/50">Supone precios constantes. Muestra el efecto bajo las hipótesis del modelo, no una previsión.</p>
        </div>

        {/* Resumen */}
        <div className="mt-7 flex flex-col gap-4 border-t border-cream-50/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] leading-relaxed text-cream-50/55 sm:max-w-sm">Resultados orientativos: no sustituyen un análisis contable completo.</p>
          <button type="button" className="btn btn--light btn--sm shrink-0 disabled:opacity-50" onClick={copy} disabled={!metrics}>
            {copied ? 'Resumen copiado' : 'Copiar resumen'}
            <span className="btn__icon">
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                {copied ? (
                  <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <>
                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M3 10.5V4a1 1 0 0 1 1-1h6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </span>
          </button>
          <span className="sr-only" role="status">
            {copied ? 'Resumen copiado al portapapeles' : ''}
          </span>
        </div>
      </div>
    </section>
  );
}
