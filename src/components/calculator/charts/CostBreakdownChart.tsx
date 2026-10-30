'use client';

import { m } from 'framer-motion';
import { useState } from 'react';
import { costBreakdown, type Metrics } from '@/lib/profitability/engine';
import { formatEUR, formatPct } from '@/lib/profitability/money';
import type { FinancialInputs } from '@/lib/profitability/types';
import { ChartCard, DataTable } from './shared';

const GROUP = {
  variable: { label: 'Variable', color: 'var(--color-gold-500)', detail: 'Coste variable' },
  fixed: { label: 'Fijo', color: 'var(--color-forest-600)', detail: 'Gasto fijo' },
  staff: { label: 'Personal', color: 'var(--color-forest-900)', detail: 'Coste de personal' },
} as const;

/** Distribución de gastos: barras horizontales ordenadas de mayor a menor peso. */
export function CostBreakdownChart({ inputs, metrics }: { inputs: FinancialInputs; metrics: Metrics }) {
  const [active, setActive] = useState<string | null>(null);
  const parts = costBreakdown(inputs)
    .filter((p) => p.value > 0)
    .sort((a, b) => b.value - a.value);
  const total = metrics.totalCosts;
  const max = parts[0]?.value ?? 0;

  if (total <= 0) {
    return (
      <ChartCard id="chart-costes" title="Distribución de gastos" summary="No se han indicado costes: no hay distribución que mostrar.">
        <p className="rounded-xl bg-cream-100 p-4 text-[0.9rem] text-ink-soft">Introduce al menos una partida de coste para ver su peso.</p>
      </ChartCard>
    );
  }

  return (
    <ChartCard
      id="chart-costes"
      title="Distribución de gastos"
      summary={`Peso de cada partida sobre los costes totales (${formatEUR(total)}). La de mayor peso es «${parts[0].label}».`}
      table={
        <DataTable
          head={['Partida', 'Importe', '% de costes']}
          rows={parts.map((p) => [p.label, formatEUR(p.value), formatPct(p.value / total)])}
        />
      }
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[0.78rem] text-ink-soft" aria-label="Leyenda">
        {Object.values(GROUP).map((g) => (
          <li key={g.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm" style={{ background: g.color }} aria-hidden="true" />
            {g.label}
          </li>
        ))}
      </ul>
      <ul className="mt-5 space-y-3.5">
        {parts.map((p, i) => {
          const share = p.value / total;
          const on = active === p.key;
          return (
            <li
              key={p.key}
              onPointerEnter={() => setActive(p.key)}
              onPointerLeave={() => setActive(null)}
              className={`transition-opacity duration-300 ${active && !on ? 'opacity-45' : ''}`}
            >
              <div className="flex items-baseline justify-between gap-3 text-[0.86rem]">
                <span className="text-ink">{p.label}</span>
                <span className="shrink-0 tabular-nums text-ink-soft">
                  {formatEUR(p.value)} · <span className="font-medium text-ink">{formatPct(share)}</span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 rounded-full bg-cream-100">
                <m.div
                  className="h-full rounded-full"
                  style={{ background: GROUP[p.group].color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(1.5, (p.value / max) * 100)}%` }}
                  transition={{ duration: 0.9, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
              {on && metrics.revenue > 0 && (
                <p className="mt-1 text-[0.78rem] text-ink-mute">
                  {GROUP[p.group].detail} · equivale al {formatPct(p.value / metrics.revenue)} de la facturación
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}
