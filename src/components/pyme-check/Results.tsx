'use client';

import { m } from 'framer-motion';
import { Arrow } from '@/components/ui/primitives';
import type { Result } from '@/lib/pyme-check/scoring';

const STATUS = {
  10: { label: 'Bien encaminada', bar: 'bg-forest-300', text: 'text-forest-300' },
  5: { label: 'Mejorable', bar: 'bg-gold-300', text: 'text-gold-300' },
  0: { label: 'Prioritaria', bar: 'bg-loss-soft', text: 'text-loss-soft' },
} as const;

const R = 54;
const ease = [0.16, 1, 0.3, 1] as const;

/** Panel de resultados: puntuación global, clasificación, cinco áreas y principales oportunidades. */
export function Results({ result, onContact, onRestart }: { result: Result; onContact: () => void; onRestart: () => void }) {
  return (
    <div className="space-y-6">
      <section aria-labelledby="pc-result" className="on-dark grain relative overflow-hidden rounded-[1.5rem] bg-forest-950 text-cream-50">
        <div className="relative flex items-center justify-between gap-3 border-b border-cream-50/10 px-5 py-3.5 md:px-7">
          <span className="flex items-center gap-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-cream-50/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream-50/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-cream-50/20" />
          </span>
          <p className="text-[0.72rem] font-medium uppercase tracking-[0.18em] text-cream-50/70">PYME Check</p>
          <span className="w-12" />
        </div>

        <div className="relative grid gap-8 p-6 md:grid-cols-12 md:p-8">
          {/* Puntuación global */}
          <div className="flex items-center gap-6 md:col-span-5 md:flex-col md:items-start">
            <div className="relative h-36 w-36 shrink-0 md:h-44 md:w-44">
              <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90" aria-hidden="true">
                <circle cx="64" cy="64" r={R} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" />
                <m.circle
                  cx="64"
                  cy="64"
                  r={R}
                  fill="none"
                  stroke="var(--color-gold-300)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: result.score / 100 }}
                  transition={{ duration: 1.2, ease }}
                />
              </svg>
              <p className="absolute inset-0 grid place-items-center text-center">
                <span>
                  <span className="block font-serif text-[2.6rem] leading-none tabular-nums md:text-[3.2rem]">{result.score}</span>
                  <span className="mt-1 block text-[0.78rem] text-cream-50/70">sobre 100</span>
                </span>
              </p>
            </div>
            <div>
              <p className="text-[0.82rem] text-cream-50/70">Resultado orientativo</p>
              <h2 id="pc-result" tabIndex={-1} className="mt-2 font-serif text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.12] tracking-tight outline-none">
                {result.classification}
              </h2>
            </div>
          </div>

          {/* Evaluación por áreas */}
          <div className="md:col-span-7">
            <h3 className="font-sans text-[0.72rem] font-medium uppercase tracking-[0.14em] text-cream-50/60">Evaluación por áreas</h3>
            <ul className="mt-4 space-y-4">
              {result.areas.map((a, i) => {
                const s = STATUS[a.points];
                return (
                  <li key={a.area}>
                    <div className="flex items-baseline justify-between gap-3 text-[0.9rem]">
                      <span className="text-cream-50/90">{a.areaName}</span>
                      <span className={`text-[0.8rem] font-medium ${s.text}`}>
                        {s.label} · {a.points}/10
                      </span>
                    </div>
                    <span className="mt-2 block h-2 rounded-full bg-cream-50/[0.08]" aria-hidden="true">
                      <m.span
                        className={`block h-full rounded-full ${s.bar}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.max(a.points * 10, 3)}%` }}
                        transition={{ duration: 0.8, delay: 0.2 + i * 0.07, ease }}
                      />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <p className="relative border-t border-cream-50/10 px-6 py-4 text-[0.75rem] text-cream-50/55 md:px-8">
          Basado únicamente en tus cinco respuestas. No es una auditoría de tu empresa.
        </p>
      </section>

      {/* Principales oportunidades y recomendaciones */}
      <section aria-labelledby="pc-ops" className="rounded-[1.5rem] border border-line bg-cream-50 p-6 md:p-8">
        <h3 id="pc-ops" className="font-serif text-[1.6rem] leading-tight tracking-tight">
          {result.opportunities.length ? 'Principales oportunidades' : 'Revisión y mejora continua'}
        </h3>
        {result.opportunities.length ? (
          <ol className="mt-6 grid gap-4 lg:grid-cols-3">
            {result.opportunities.map((o, i) => (
              <li key={o.area} className="flex flex-col rounded-2xl border border-line bg-cream-100 p-5">
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-2 font-medium text-ink">{o.areaName}</p>
                <p className="mt-1 text-[0.9rem] text-ink-soft">{o.problem}</p>
                <p className="mt-4 border-t border-line pt-4 text-[0.92rem] text-ink">{o.solution}</p>
                <p className="mt-auto pt-4 text-[0.8rem] text-forest-600">{o.service}</p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 max-w-2xl text-ink-soft">
            Tus respuestas reflejan una buena base en las cinco áreas. Revisar periódicamente tus indicadores y procesos te ayudará a mantenerla y a
            detectar nuevas mejoras a tiempo.
          </p>
        )}
        <p className="mt-5 text-[0.8rem] text-ink-mute">Propuestas preliminares basadas en tus respuestas, sin resultados garantizados.</p>
      </section>

      <div className="flex flex-col items-start gap-4 rounded-[1.5rem] border border-forest-900/20 bg-cream-100 p-6 sm:flex-row sm:items-center sm:justify-between md:p-8">
        <button type="button" onClick={onRestart} className="order-2 text-[0.9rem] font-medium text-ink-soft underline-offset-4 hover:underline sm:order-1">
          Repetir el diagnóstico
        </button>
        <button type="button" onClick={onContact} className="btn order-1 sm:order-2" aria-haspopup="dialog">
          Descubre cómo Trenchs Advisory puede ayudarte
          <span className="btn__icon">
            <Arrow />
          </span>
        </button>
      </div>
    </div>
  );
}
