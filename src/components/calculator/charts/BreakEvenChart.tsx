'use client';

import { m } from 'framer-motion';
import { useState } from 'react';
import type { Metrics } from '@/lib/profitability/engine';
import { formatEUR, formatEURShort } from '@/lib/profitability/money';
import { ChartCard, DataTable, Tooltip, linear, niceTicks, useWidth } from './shared';

const REASON = {
  'no-sales': 'Sin facturación no se conoce qué parte de cada venta queda como margen, así que el punto de equilibrio no puede calcularse.',
  unreachable:
    'Los costes variables igualan o superan la facturación: cada venta adicional no aporta margen y ningún volumen de ventas cubre los costes fijos. Bajo las hipótesis del modelo, el punto de equilibrio no es alcanzable.',
  'no-margin':
    'No hay costes fijos, pero tampoco margen de contribución positivo: el modelo no dispone de un punto de equilibrio con sentido y no lo representamos para no inducir a error.',
} as const;

/**
 * Ingresos (recta de 45°) frente a costes totales (CF + coste variable proporcional a las ventas).
 * Hipótesis: coste variable proporcional a las ventas y costes fijos constantes.
 */
export function BreakEvenChart({ metrics: mt }: { metrics: Metrics }) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hoverX, setHoverX] = useState<number | null>(null);

  if (mt.breakEven.status !== 'ok' || mt.contributionRatio === null) {
    const status = mt.breakEven.status as keyof typeof REASON;
    return (
      <ChartCard id="chart-equilibrio" title="Punto de equilibrio" summary="No representable con los datos introducidos.">
        <p className="rounded-xl bg-cream-100 p-4 text-[0.9rem] leading-relaxed text-ink-soft">{REASON[status]}</p>
      </ChartCard>
    );
  }

  const pe = mt.breakEven.value;
  const vcRatio = 1 - mt.contributionRatio;
  const cost = (v: number) => mt.totalFixed + vcRatio * v;
  const xMax = niceTicks(0, Math.max(mt.revenue, pe) * 1.35, 4).at(-1)!;
  const yTicks = niceTicks(0, Math.max(xMax, cost(xMax)), 4);
  const height = 300;
  const pad = { t: 16, r: 12, b: 40, l: width < 480 ? 56 : 72 };
  const x = linear(0, xMax, pad.l, width - pad.r);
  const y = linear(0, yTicks.at(-1)!, height - pad.b, pad.t);
  const xTicks = niceTicks(0, xMax, width < 480 ? 3 : 5);

  const lossZone = `M${x(0)},${y(0)} L${x(pe)},${y(pe)} L${x(0)},${y(cost(0))} Z`;
  const profitZone = `M${x(pe)},${y(pe)} L${x(xMax)},${y(xMax)} L${x(xMax)},${y(cost(xMax))} Z`;
  const hv = hoverX === null ? null : Math.max(0, Math.min(xMax, linear(pad.l, width - pad.r, 0, xMax)(hoverX)));

  return (
    <ChartCard
      id="chart-equilibrio"
      title="Punto de equilibrio"
      summary={`Con tu estructura de costes, ingresos y costes se igualan con una facturación de ${formatEUR(pe)}. Tu facturación actual es ${formatEUR(mt.revenue)}.`}
      table={
        <DataTable
          head={['Facturación', 'Costes totales', 'Resultado']}
          rows={[0, pe / 2, pe, mt.revenue, xMax]
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort((a, b) => a - b)
            .map((v) => [formatEUR(Math.round(v)), formatEUR(Math.round(cost(v))), formatEUR(Math.round(v - cost(v)))])}
        />
      }
    >
      <ul className="flex flex-wrap gap-x-5 gap-y-1 text-[0.78rem] text-ink-soft" aria-label="Leyenda">
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-forest-900" aria-hidden="true" /> Ingresos
        </li>
        <li className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-gold-500" aria-hidden="true" /> Costes totales
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-loss/20" aria-hidden="true" /> Zona de pérdidas
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-forest-600/25" aria-hidden="true" /> Zona de resultado positivo
        </li>
      </ul>
      <div ref={ref} className="relative mt-4 w-full min-w-0 touch-pan-y">
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Gráfico de punto de equilibrio: ${formatEUR(pe)}. Los datos están en la tabla.`}
          className="block overflow-visible"
          onPointerMove={(e) => setHoverX(e.clientX - e.currentTarget.getBoundingClientRect().left)}
          onPointerLeave={() => setHoverX(null)}
        >
          {yTicks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={width - pad.r} y1={y(t)} y2={y(t)} stroke="var(--color-line)" strokeDasharray={t === 0 ? undefined : '2 4'} />
              <text x={pad.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-ink-mute text-[11px] tabular-nums">
                {formatEURShort(t)}
              </text>
            </g>
          ))}
          {xTicks.map((t) => (
            <text key={t} x={x(t)} y={height - pad.b + 18} textAnchor="middle" className="fill-ink-mute text-[11px] tabular-nums">
              {formatEURShort(t)}
            </text>
          ))}
          <text x={width - pad.r} y={height - 4} textAnchor="end" className="fill-ink-mute text-[11px]">
            Facturación mensual
          </text>

          <path d={lossZone} fill="var(--color-loss)" fillOpacity={0.12} />
          <path d={profitZone} fill="var(--color-forest-600)" fillOpacity={0.16} />

          <m.line x1={x(0)} y1={y(cost(0))} x2={x(xMax)} y2={y(cost(xMax))} stroke="var(--color-gold-500)" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
          <m.line x1={x(0)} y1={y(0)} x2={x(xMax)} y2={y(xMax)} stroke="var(--color-forest-900)" strokeWidth={2} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.15 }} />

          {/* Punto de equilibrio */}
          <line x1={x(pe)} x2={x(pe)} y1={y(pe)} y2={height - pad.b} stroke="var(--color-ink-mute)" strokeDasharray="3 3" />
          <circle cx={x(pe)} cy={y(pe)} r={5} fill="var(--color-cream-50)" stroke="var(--color-ink)" strokeWidth={2} />
          {/* Arriba a la izquierda del punto: ahí no pasa ninguna de las dos rectas. Halo crema para legibilidad. */}
          <text x={x(pe) - 10} y={y(pe) - 10} textAnchor={x(pe) < pad.l + 110 ? 'start' : 'end'} stroke="var(--color-cream-50)" strokeWidth={4} paintOrder="stroke" className="fill-ink text-[11px] font-semibold">
            Equilibrio {formatEURShort(pe)}
          </text>

          {/* Facturación actual */}
          <line x1={x(mt.revenue)} x2={x(mt.revenue)} y1={pad.t} y2={height - pad.b} stroke="var(--color-forest-900)" strokeOpacity={0.5} />
          <text x={x(mt.revenue)} y={pad.t - 4} textAnchor={x(mt.revenue) > width - 90 ? 'end' : 'middle'} className="fill-forest-900 text-[11px] font-medium">
            Tu facturación
          </text>

          {hv !== null && (
            <g pointerEvents="none">
              <line x1={x(hv)} x2={x(hv)} y1={pad.t} y2={height - pad.b} stroke="var(--color-ink)" strokeOpacity={0.35} />
              <circle cx={x(hv)} cy={y(hv)} r={4} fill="var(--color-forest-900)" />
              <circle cx={x(hv)} cy={y(cost(hv))} r={4} fill="var(--color-gold-500)" />
            </g>
          )}
        </svg>
        {hv !== null && (
          <Tooltip x={x(hv)} y={Math.min(y(hv), y(cost(hv)))} width={width}>
            <span className="block">Facturación: {formatEUR(Math.round(hv))}</span>
            <span className="block">Costes: {formatEUR(Math.round(cost(hv)))}</span>
            <span className={`block font-medium ${hv - cost(hv) < 0 ? 'text-[#f0a796]' : 'text-gold-300'}`}>Resultado: {formatEUR(Math.round(hv - cost(hv)))}</span>
          </Tooltip>
        )}
      </div>
    </ChartCard>
  );
}
