'use client';

import { useId } from 'react';
import type { Metrics } from '@/lib/profitability/engine';
import { formatEUR, formatPct, parseAmount } from '@/lib/profitability/money';
import { LIMITS, NEUTRAL, PRESETS, salesForTarget, simulate, type Adjustments, type Scenario } from '@/lib/profitability/scenarios';
import type { FinancialInputs } from '@/lib/profitability/types';
import { MoneyField, Note } from './fields';

const SLIDERS: { key: keyof Adjustments; label: string; hint: string }[] = [
  { key: 'volume', label: 'Volumen de ventas', hint: 'Precio y mezcla de productos constantes: las ventas y los costes variables se mueven con el volumen.' },
  { key: 'unitCost', label: 'Coste variable unitario', hint: 'Lo que cuesta cada unidad vendida (compras, comisiones…).' },
  { key: 'fixed', label: 'Gastos fijos', hint: 'Alquiler, suministros, software, seguros, marketing y otros.' },
  { key: 'staff', label: 'Coste fijo de personal', hint: 'Salarios, Seguridad Social y otros costes de personal.' },
];

const signed = (n: number) => (n > 0 ? `+${n}` : String(n));
const signedEUR = (c: number) => (c > 0 ? `+${formatEUR(c)}` : formatEUR(c));
const same = (a: Adjustments, b: Adjustments) => SLIDERS.every(({ key }) => a[key] === b[key]);

function Slider({ k, value, onChange }: { k: (typeof SLIDERS)[number]; value: number; onChange: (v: number) => void }) {
  const id = useId();
  const { min, max } = LIMITS[k.key];
  const pos = ((value - min) / (max - min)) * 100;
  const zero = ((0 - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[0.92rem] font-medium">
          {k.label}
        </label>
        <output htmlFor={id} className={`font-serif text-[1.35rem] tabular-nums ${value === 0 ? 'text-ink-mute' : 'text-ink'}`}>
          {signed(value)} %
        </output>
      </div>
      <p id={`${id}-hint`} className="mt-0.5 text-[0.8rem] text-ink-mute">
        {k.hint}
      </p>
      <div className="relative mt-3">
        {/* Pista con el tramo desde 0 hasta el valor */}
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-cream-200" aria-hidden="true">
          <div className="absolute inset-y-0 rounded-full bg-forest-900" style={{ left: `${Math.min(pos, zero)}%`, width: `${Math.abs(pos - zero)}%` }} />
          <div className="absolute -top-1 h-3.5 w-px bg-ink-mute" style={{ left: `${zero}%` }} />
        </div>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          aria-describedby={`${id}-hint`}
          aria-valuetext={`${signed(value)} %`}
          onChange={(e) => onChange(Number(e.target.value))}
          className="sim-range relative w-full"
        />
      </div>
      <div className="mt-1 flex justify-between text-[0.72rem] tabular-nums text-ink-mute" aria-hidden="true">
        <span>{min} %</span>
        <span>+{max} %</span>
      </div>
    </div>
  );
}

/** Paso 4 · Simulador de escenarios. Los datos originales no cambian: cada escenario se calcula a partir de ellos. */
export function Simulator({
  inputs,
  metrics,
  adjustments,
  onAdjust,
  target,
  onTarget,
  targetError,
  onTargetError,
}: {
  inputs: FinancialInputs;
  metrics: Metrics;
  adjustments: Adjustments;
  onAdjust: (a: Adjustments) => void;
  target: string;
  onTarget: (v: string) => void;
  targetError?: string;
  onTargetError: (e: string | undefined) => void;
}) {
  const custom = simulate(inputs, adjustments, metrics);
  const columns: { id: string; label: string; s: Scenario; adj: Adjustments }[] = [
    { id: 'actual', label: 'Situación actual', s: simulate(inputs, NEUTRAL, metrics), adj: NEUTRAL },
    { id: 'conservative', label: PRESETS.conservative.label, s: simulate(inputs, PRESETS.conservative.adjustments, metrics), adj: PRESETS.conservative.adjustments },
    { id: 'optimistic', label: PRESETS.optimistic.label, s: simulate(inputs, PRESETS.optimistic.adjustments, metrics), adj: PRESETS.optimistic.adjustments },
    { id: 'custom', label: 'Personalizado', s: custom, adj: adjustments },
  ];
  const parsedTarget = parseAmount(target);
  const targetCents = parsedTarget.ok ? parsedTarget.value : null;
  const needed = targetCents === null ? null : salesForTarget(inputs, adjustments, targetCents, metrics);
  const activePreset = columns.find((c) => c.id !== 'custom' && same(c.adj, adjustments))?.id ?? 'custom';

  const rows: { label: string; get: (s: Scenario) => string; strong?: boolean }[] = [
    { label: 'Facturación', get: (s) => formatEUR(s.revenue) },
    { label: 'Costes variables', get: (s) => formatEUR(s.variableCosts) },
    { label: 'Gastos fijos', get: (s) => formatEUR(s.fixedCosts) },
    { label: 'Personal', get: (s) => formatEUR(s.staffCosts) },
    { label: 'Resultado operativo simplificado', get: (s) => formatEUR(s.result), strong: true },
    { label: 'Margen de resultado', get: (s) => (s.resultMargin === null ? 'No disponible' : formatPct(s.resultMargin)) },
    { label: 'Diferencia frente a la actual', get: (s) => signedEUR(s.resultDelta) },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Escenarios predefinidos">
        {columns
          .filter((c) => c.id !== 'custom')
          .map((c) => (
            <button
              key={c.id}
              type="button"
              aria-pressed={activePreset === c.id}
              onClick={() => onAdjust(c.adj)}
              className={`rounded-full border px-4 py-2 text-[0.88rem] font-medium transition-colors ${
                activePreset === c.id ? 'border-forest-900 bg-forest-900 text-cream-50' : 'border-line hover:border-forest-900'
              }`}
            >
              {c.id === 'actual' ? 'Restablecer' : c.label}
            </button>
          ))}
        <span className={`ml-1 text-[0.82rem] ${activePreset === 'custom' ? 'text-forest-900' : 'text-ink-mute'}`}>
          {activePreset === 'custom' ? 'Escenario personalizado' : 'Mueve los controles para personalizar'}
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="space-y-7 rounded-[1.25rem] border border-line bg-cream-50 p-5 md:p-7 lg:col-span-5">
          {SLIDERS.map((k) => (
            <Slider key={k.key} k={k} value={adjustments[k.key]} onChange={(v) => onAdjust({ ...adjustments, [k.key]: v })} />
          ))}
        </div>

        <div className="space-y-6 lg:col-span-7">
          <div className={`rounded-[1.25rem] p-6 md:p-8 ${custom.result < 0 ? 'bg-loss/[0.07]' : 'on-dark bg-forest-900 text-cream-50'}`} aria-live="polite">
            <p className={`text-[0.82rem] font-medium ${custom.result < 0 ? 'text-ink-mute' : 'text-cream-50/80'}`}>Resultado del escenario personalizado</p>
            <p className={`mt-3 font-serif text-[clamp(2.2rem,4.5vw,3.4rem)] leading-none tracking-tight tabular-nums ${custom.result < 0 ? 'text-loss' : ''}`}>
              {formatEUR(custom.result)}
            </p>
            <p className={`mt-3 text-[0.92rem] ${custom.result < 0 ? 'text-ink-soft' : 'text-cream-50/80'}`}>
              {custom.resultDelta === 0 ? 'Igual que la situación actual.' : `${signedEUR(custom.resultDelta)} frente a la situación actual (${formatEUR(metrics.result)}).`}
            </p>
          </div>

          <div className="overflow-x-auto rounded-[1.25rem] border border-line">
            <table className="w-full min-w-[34rem] text-[0.86rem] tabular-nums">
              <caption className="sr-only">Comparación de escenarios</caption>
              <thead>
                <tr className="bg-cream-100">
                  <th scope="col" className="p-3 text-left font-medium text-ink-mute">
                    Mensual
                  </th>
                  {columns.map((c) => (
                    <th key={c.id} scope="col" className={`p-3 text-right font-medium ${c.id === 'custom' ? 'text-forest-900' : 'text-ink-soft'}`}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-line">
                    <th scope="row" className={`p-3 text-left font-normal ${r.strong ? 'font-medium text-ink' : 'text-ink-soft'}`}>
                      {r.label}
                    </th>
                    {columns.map((c) => {
                      const v = r.get(c.s);
                      return (
                        <td key={c.id} className={`p-3 text-right ${r.strong ? 'font-semibold' : ''} ${v.startsWith('-') ? 'text-loss' : 'text-ink'} ${c.id === 'custom' ? 'bg-cream-100/60' : ''}`}>
                          {v}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[0.8rem] leading-relaxed text-ink-mute">
            Hipótesis de los escenarios predefinidos (ilustrativas, no previsiones): <strong className="font-medium text-ink-soft">conservador</strong>, volumen −10 %,
            coste unitario +5 %, gastos fijos +3 % y personal +3 %; <strong className="font-medium text-ink-soft">optimista</strong>, volumen +10 % y coste unitario −3 %, sin
            cambios en costes fijos.
          </p>
        </div>
      </div>

      <div className="grid gap-6 rounded-[1.25rem] border border-line bg-cream-100 p-5 md:grid-cols-2 md:p-7">
        <div>
          <h3 className="font-serif text-[1.45rem] leading-tight tracking-tight">Objetivo de resultado</h3>
          <p className="mt-1 text-[0.88rem] text-ink-soft">Calculado con el coste unitario, los gastos fijos y el personal del escenario personalizado.</p>
          <div className="mt-5 max-w-xs">
            <MoneyField id="target" label="¿Qué resultado mensual te gustaría conseguir?" value={target} error={targetError} onChange={onTarget} onError={onTargetError} />
          </div>
        </div>
        <div className="self-end" aria-live="polite">
          {needed === null ? (
            <p className="text-[0.9rem] text-ink-mute">Introduce un importe para ver la facturación necesaria.</p>
          ) : needed.status === 'no-sales' ? (
            <p className="text-[0.9rem] text-ink-soft">Sin facturación actual no se conoce el margen de cada venta: no es posible calcularlo.</p>
          ) : needed.status === 'unreachable' ? (
            <p className="text-[0.9rem] text-ink-soft">
              <strong className="font-medium text-loss">Objetivo no alcanzable bajo estas hipótesis.</strong> Con este coste unitario, cada venta no deja margen positivo: vender
              más no mejora el resultado.
            </p>
          ) : (
            <div>
              <p className="text-[0.82rem] font-medium text-ink-mute">Facturación mensual necesaria</p>
              <p className="mt-2 font-serif text-[2.2rem] leading-none tracking-tight tabular-nums">{formatEUR(needed.value)}</p>
              <p className="mt-2 text-[0.88rem] text-ink-soft">
                {needed.change === 0
                  ? 'Igual que tu facturación actual.'
                  : `${needed.change > 0 ? '+' : ''}${formatPct(needed.change)} frente a tu facturación actual (${formatEUR(metrics.revenue)}).`}
              </p>
            </div>
          )}
        </div>
      </div>

      <Note>Las simulaciones muestran el efecto de cada variación bajo las hipótesis del modelo. No garantizan que esos cambios vayan a producirse ni sus resultados.</Note>
    </div>
  );
}
