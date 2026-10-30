'use client';

import Link from 'next/link';
import { Arrow } from '@/components/ui/primitives';
import { LOW_MARGIN_THRESHOLD, type Diagnosis } from '@/lib/profitability/diagnosis';
import { formatPct } from '@/lib/profitability/money';
import type { Proposal } from '@/lib/profitability/solutions';
import { SERVICES } from '@/content/services';
import { DISCLAIMER } from './Dashboard';
import { Note } from './fields';

const BADGE: Record<Diagnosis['kind'], { tone: string; icon: string }> = {
  losses: { tone: 'bg-loss/10 text-loss', icon: 'M8 3v7M8 12.5v.5' },
  breakeven: { tone: 'bg-gold-300/40 text-gold-700', icon: 'M3 8h10' },
  'low-margin': { tone: 'bg-gold-300/40 text-gold-700', icon: 'M3 11l4-4 2 2 4-4' },
  profitable: { tone: 'bg-forest-600/15 text-forest-900', icon: 'M3.5 8.5l3 3 6-7' },
  insufficient: { tone: 'bg-cream-200 text-ink-soft', icon: 'M6 6a2 2 0 1 1 2.5 2c-.5.2-.5.7-.5 1.2M8 12v.3' },
};

/** Paso 5 · Interpretación (diagnóstico automático) y soluciones de Trenchs Advisory. */
export function DiagnosisPanel({ diagnosis: d, proposal: p, onContact }: { diagnosis: Diagnosis; proposal: Proposal; onContact: () => void }) {
  const area = SERVICES.find((s) => s.slug === p.area);
  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-12">
        <section aria-labelledby="diag-title" className="rounded-[1.25rem] border border-line bg-cream-50 p-6 md:p-8 lg:col-span-7">
          <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[0.8rem] font-medium ${BADGE[d.kind].tone}`}>
            <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d={BADGE[d.kind].icon} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {d.headline}
          </span>
          <h3 id="diag-title" className="mt-5 font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.1] tracking-tight">
            {d.message}
          </h3>
          {d.kind === 'low-margin' && (
            <p className="mt-3 text-[0.82rem] text-ink-mute">
              Criterio orientativo de esta herramienta: margen de resultado inferior al {formatPct(LOW_MARGIN_THRESHOLD)}. No es un estándar ni una comparación con tu
              sector.
            </p>
          )}
          {d.findings.length > 0 && (
            <>
              <h4 className="mt-8 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink-mute">Problemas y oportunidades detectados</h4>
              <ul className="mt-3 space-y-2.5">
                {d.findings.map((f) => (
                  <li key={f} className="flex gap-3 text-[0.95rem] text-ink-soft">
                    <span className="mt-[0.6rem] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
          <h4 className="mt-8 text-[0.75rem] font-medium uppercase tracking-[0.16em] text-ink-mute">Recomendaciones</h4>
          <ol className="mt-3 space-y-2.5">
            {d.recommendations.map((r, i) => (
              <li key={r} className="flex gap-3 text-[0.95rem] text-ink-soft">
                <span className="num mt-[0.2rem] w-5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                {r}
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="sol-title" className="on-dark grain relative overflow-hidden rounded-[1.25rem] bg-forest-950 p-6 text-cream-50 md:p-8 lg:col-span-5 lg:self-start">
          <p className="eyebrow">Cómo podemos ayudarte</p>
          <h3 id="sol-title" className="mt-5 font-serif text-[1.7rem] leading-[1.1] tracking-tight">
            {p.service}
          </h3>
          <p className="mt-3 text-[0.9rem] text-cream-50/75">{p.problem}</p>
          <ul className="mt-6 space-y-2.5 border-t border-cream-50/10 pt-5">
            {p.solutions.map((s) => (
              <li key={s} className="flex gap-3 text-[0.95rem] text-cream-50/90">
                <svg className="mt-[0.3rem] h-4 w-4 shrink-0 text-gold-300" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[0.8rem] text-cream-50/70">Propuestas preliminares, sujetas a revisión con los datos completos de tu empresa.</p>
          {area && (
            <Link href={`/servicios/${area.slug}`} className="mt-5 inline-flex items-center gap-2 text-[0.88rem] font-medium text-gold-300 hover:text-cream-50">
              Área de servicio: {area.name}
              <Arrow className="h-3 w-3" />
            </Link>
          )}
        </section>
      </div>

      <div className="flex flex-col items-start gap-5 rounded-[1.25rem] border border-forest-900/20 bg-cream-100 p-6 md:flex-row md:items-center md:justify-between md:p-8">
        <div>
          <p className="font-serif text-[1.5rem] leading-tight tracking-tight">¿Quieres pasar del diagnóstico a un plan?</p>
          <p className="mt-1 text-[0.9rem] text-ink-soft">Tus resultados siguen disponibles aquí: hablar con nosotros es opcional.</p>
        </div>
        <button type="button" onClick={onContact} className="btn shrink-0" aria-haspopup="dialog">
          Descubre cómo mejorar tu rentabilidad con Trenchs Advisory
          <span className="btn__icon">
            <Arrow />
          </span>
        </button>
      </div>

      <Note>{DISCLAIMER}</Note>
    </div>
  );
}
