import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { MethodSteps } from '@/components/firm/MethodSteps';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHead, delay, pad } from '@/components/ui/primitives';
import { CLOSINGS, JOURNEY, METHOD_DETAIL, METHOD_HERO } from '@/content/firm';

const description = 'Diagnóstico, diseño, construcción, adopción y mejora continua: el método común a todos nuestros proyectos.';

export const metadata: Metadata = pageMetadata({ title: 'Método', description, path: '/firma/metodo' });

export default function MethodPage() {
  return (
    <>
      <PageHero
        kicker={METHOD_HERO.kicker}
        title={METHOD_HERO.title}
        lead={METHOD_HERO.lead}
        crumbs={[{ name: 'La firma' }, { name: 'Método', href: '/firma/metodo' }]}
      />

      <section aria-labelledby="fases" className="section">
        <div className="wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHead eyebrow={METHOD_DETAIL.eyebrow} title={<span id="fases">{METHOD_DETAIL.title}</span>} />
              <div className="mt-12 space-y-4">
                {METHOD_DETAIL.rules.map((rule, i) => (
                  <p key={rule} className="rounded-[1.25rem] border border-line p-6 text-ink-soft" data-reveal style={delay(i + 2)}>
                    <span className="mb-2 block text-[0.7rem] font-medium uppercase tracking-[0.16em] text-gold-700">Regla {pad(i + 1)}</span>
                    {rule}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <MethodSteps />
          </div>
        </div>
      </section>

      {/* F-09 · La relación: escalera de cuatro etapas */}
      <section id="relacion" aria-labelledby="relacion-titulo" className="on-dark grain relative overflow-hidden bg-forest-900 text-cream-50">
        <div className="wrap section">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <SectionHead className="lg:col-span-7" eyebrow={JOURNEY.eyebrow} title={<span id="relacion-titulo">{JOURNEY.title}</span>} />
            <p className="lead lg:col-span-5" data-reveal style={delay(2)}>
              {JOURNEY.lead}
            </p>
          </div>
          <ol className="mt-20 grid items-end gap-4 md:grid-cols-4">
            {JOURNEY.stages.map((s, i) => (
              <li
                key={s.t}
                className="flex flex-col justify-end rounded-t-[1.25rem] border border-b-0 border-cream-50/15 bg-cream-50/[0.03] p-6 md:min-h-[var(--h)]"
                style={{ ...delay(i), '--h': `${14 + i * 5}rem` } as React.CSSProperties}
                data-reveal
              >
                <span className="num">{pad(i + 1)}</span>
                <h3 className="mt-3 font-serif text-[1.6rem] leading-tight">{s.t}</h3>
                <p className="mt-3 text-[0.95rem] text-cream-50/80">{s.d}</p>
              </li>
            ))}
          </ol>
          <div aria-hidden="true" className="h-px bg-cream-50/30" />
        </div>
      </section>

      <Closing {...CLOSINGS.method} />
    </>
  );
}
