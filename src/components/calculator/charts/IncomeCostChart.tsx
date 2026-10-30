'use client';

import { m } from 'framer-motion';
import { useState } from 'react';
import type { Metrics } from '@/lib/profitability/engine';
import { formatEUR, formatEURShort } from '@/lib/profitability/money';
import { ChartCard, DataTable, Tooltip, linear, niceTicks, useWidth } from './shared';

type Step = { key: string; label: string; short: string; value: number; kind: 'income' | 'cost' | 'result' };

/**
 * Cascada de ingresos a resultado: las ventas se reducen con cada bloque de costes hasta el resultado.
 * Las pérdidas quedan por debajo de la línea de cero y en otro color: nunca parecen un resultado positivo.
 */
export function IncomeCostChart({ metrics: mt }: { metrics: Metrics }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const steps: Step[] = [
    { key: 'v', label: 'Ventas', short: 'Ventas', value: mt.revenue, kind: 'income' },
    { key: 'cv', label: 'Costes variables', short: 'Variables', value: -mt.variableCosts, kind: 'cost' },
    { key: 'gf', label: 'Gastos fijos', short: 'Fijos', value: -mt.fixedCosts, kind: 'cost' },
    { key: 'cp', label: 'Personal', short: 'Personal', value: -mt.staffCosts, kind: 'cost' },
    { key: 'r', label: 'Resultado', short: 'Resultado', value: mt.result, kind: 'result' },
  ];
  // Tramos [desde, hasta] de cada barra.
  let run = 0;
  const spans = steps.map((s) => {
    if (s.kind === 'income') return ((run = s.value), [0, s.value]);
    if (s.kind === 'result') return [0, s.value];
    const from = run;
    run += s.value;
    return [from, run];
  });

  const all = spans.flat();
  const lo = Math.min(0, ...all);
  const hi = Math.max(0, ...all);
  const ticks = niceTicks(lo, hi === lo ? 1 : hi, 4);
  const height = 280;
  const narrow = width < 480;
  const pad = { t: 24, r: 4, b: 44, l: narrow ? 50 : 72 };
  const y = linear(ticks[0], ticks[ticks.length - 1], height - pad.b, pad.t);
  const band = (width - pad.l - pad.r) / steps.length;
  const barW = Math.min(64, band * 0.62);

  const color = (s: Step) =>
    s.kind === 'income' ? 'var(--color-forest-900)' : s.kind === 'cost' ? 'var(--color-gold-500)' : s.value < 0 ? 'var(--color-loss)' : 'var(--color-forest-600)';

  return (
    <ChartCard
      id="chart-cascada"
      title="De las ventas al resultado"
      summary={`Ventas de ${formatEUR(mt.revenue)} menos costes de ${formatEUR(mt.totalCosts)}: resultado ${mt.result < 0 ? 'negativo' : 'de'} ${formatEUR(mt.result)}.`}
      table={<DataTable head={['Concepto', 'Importe']} rows={steps.map((s) => [s.label, formatEUR(s.value)])} />}
    >
      <div ref={ref} className="relative w-full min-w-0">
        <svg width={width} height={height} role="img" aria-label="Gráfico en cascada de ventas, costes y resultado. Los datos están en la tabla." className="block overflow-visible">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeDasharray={t === 0 ? undefined : '2 4'} strokeWidth={t === 0 ? 1.5 : 1} />
              <text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className={`fill-ink-mute tabular-nums ${narrow ? 'text-[10px]' : 'text-[11px]'}`}>
                {formatEURShort(t)}
              </text>
            </g>
          ))}
          {steps.map((s, i) => {
            const [a, b] = spans[i];
            const top = y(Math.max(a, b));
            const h = Math.max(1, Math.abs(y(a) - y(b)));
            const x = pad.l + band * i + (band - barW) / 2;
            return (
              <g key={s.key} onPointerEnter={() => setHover(i)} onPointerLeave={() => setHover(null)} className={`transition-opacity ${hover !== null && hover !== i ? 'opacity-50' : ''}`}>
                <rect x={pad.l + band * i} y={pad.t} width={band} height={height - pad.t - pad.b} fill="transparent" />
                <m.rect
                  x={x}
                  width={barW}
                  rx={4}
                  fill={color(s)}
                  initial={{ y: y(0), height: 0 }}
                  animate={{ y: top, height: h }}
                  transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                />
                {i < steps.length - 1 && (
                  <line x1={x + barW} x2={x + band} y1={y(spans[i][1])} y2={y(spans[i][1])} stroke="var(--color-ink-mute)" strokeDasharray="2 3" strokeOpacity={0.6} />
                )}
                <text x={x + barW / 2} y={height - pad.b + 18} textAnchor="middle" className={`fill-ink-soft ${narrow ? 'text-[10px]' : 'text-[11px]'}`}>
                  {narrow ? s.short : s.label}
                </text>
                {s.kind === 'result' && (
                  <text x={x + barW / 2} y={s.value < 0 ? top + h + 14 : top - 6} textAnchor="middle" className={`text-[11px] font-semibold ${s.value < 0 ? 'fill-loss' : 'fill-ink'}`}>
                    {formatEURShort(s.value)}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
        {hover !== null && (
          <Tooltip x={pad.l + band * hover + band / 2} y={y(Math.max(...spans[hover]))} width={width}>
            <strong className="block font-medium">{steps[hover].label}</strong>
            {formatEUR(steps[hover].value)}
          </Tooltip>
        )}
      </div>
    </ChartCard>
  );
}
