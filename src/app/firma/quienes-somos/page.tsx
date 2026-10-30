import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/layout/PageHero';
import { SectionHead, delay, pad } from '@/components/ui/primitives';
import { ABOUT_HERO, CLOSINGS, DISCIPLINES, SYMPTOMS, WHY, WHY_NOW } from '@/content/firm';

const description =
  'Integramos estrategia, finanzas, datos, tecnología e inteligencia artificial bajo un único responsable y una sola lógica económica.';

export const metadata: Metadata = pageMetadata({ title: 'Quiénes somos', description, path: '/firma/quienes-somos' });

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker={ABOUT_HERO.kicker}
        title={ABOUT_HERO.title}
        lead={ABOUT_HERO.lead}
        crumbs={[{ name: 'La firma' }, { name: 'Quiénes somos', href: '/firma/quienes-somos' }]}
      />

      {/* F-02 · Cinco disciplinas que convergen en un resultado */}
      <section aria-labelledby="disciplinas" className="section">
        <div className="wrap">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <SectionHead className="lg:col-span-7" eyebrow={DISCIPLINES.eyebrow} title={<span id="disciplinas">{DISCIPLINES.title}</span>} />
            <p className="lead lg:col-span-5" data-reveal style={delay(2)}>
              {DISCIPLINES.lead}
            </p>
          </div>
          <div data-draw>
            <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
              {DISCIPLINES.items.map((d, i) => (
                <li key={d.t} className="bg-cream-50 p-7" data-reveal style={delay(i)}>
                  <span className="num">{pad(i + 1)}</span>
                  <h3 className="mt-4 font-serif text-[1.6rem] leading-tight">{d.t}</h3>
                  <ul className="mt-5 space-y-3 text-[0.92rem] text-ink-soft">
                    {d.items.map((it) => (
                      <li key={it} className="flex gap-3">
                        <span aria-hidden="true" className="mt-[0.65rem] h-px w-3 shrink-0 bg-gold-500" />
                        {it}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
            <svg className="mx-auto hidden h-28 w-full lg:block" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true">
              {[100, 300, 500, 700, 900].map((x, i) => (
                <path
                  key={x}
                  className="draw"
                  style={delay(i + 2)}
                  d={`M${x} 0 C${x} 60 500 50 500 120`}
                  fill="none"
                  stroke="var(--color-gold-500)"
                  pathLength={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
            <p
              className="mx-auto mt-8 flex w-fit items-center gap-3 rounded-full bg-forest-900 px-6 py-3 font-serif text-[1.35rem] text-cream-50 lg:mt-0"
              data-reveal
              style={delay(6)}
            >
              <span aria-hidden="true" className="h-2 w-2 bg-gold-300" />
              {DISCIPLINES.result}
            </p>
          </div>
        </div>
      </section>

      {/* F-03 · El punto de partida: todo el contenido visible (en la v1 había que voltear cada tarjeta). */}
      <section aria-labelledby="punto-partida" className="section bg-cream-100">
        <div className="wrap">
          <SectionHead className="max-w-4xl" eyebrow={SYMPTOMS.eyebrow} title={<span id="punto-partida">{SYMPTOMS.title}</span>} lead={SYMPTOMS.lead} />
          <ol className="mt-16 border-t border-ink">
            {SYMPTOMS.items.map((x, i) => (
              <li key={x.s} className="grid gap-4 border-b border-line py-8 md:grid-cols-12 md:gap-8" data-reveal style={delay(i % 3)}>
                <div className="flex items-baseline gap-4 md:col-span-5">
                  <span className="num">{pad(i + 1)}</span>
                  <h3 className="font-serif text-[clamp(1.5rem,2.2vw,1.9rem)] leading-tight">{x.s}</h3>
                </div>
                <dl className="grid gap-5 pl-9 sm:grid-cols-2 md:col-span-7 md:pl-0">
                  <div>
                    <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-ink-mute">Causa</dt>
                    <dd className="mt-1.5 text-ink-soft">{x.c}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-gold-700">Consecuencia</dt>
                    <dd className="mt-1.5 text-ink">{x.q}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* F-04 · Por qué ahora */}
      <section aria-labelledby="por-que-ahora" className="section">
        <div className="wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHead eyebrow={WHY_NOW.eyebrow} title={<span id="por-que-ahora">{WHY_NOW.title}</span>} />
            </div>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {WHY_NOW.items.map((r, i) => (
              <li key={r.k} className="grid grid-cols-[5.5rem_1fr] gap-6 border-t border-line py-9 first:border-t-0 first:pt-0" data-reveal style={delay(i)}>
                <span className="font-serif text-[1.35rem] italic text-gold-700">{r.k}</span>
                <div>
                  <h3 className="font-serif text-[1.5rem] leading-tight">{r.t}</h3>
                  <p className="mt-3 text-ink-soft">{r.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* F-05 · Por qué nosotros */}
      <section id="por-que" aria-labelledby="por-que-titulo" className="on-dark grain relative bg-forest-900 text-cream-50">
        <div className="wrap section">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <SectionHead className="lg:col-span-7" eyebrow={WHY.eyebrow} title={<span id="por-que-titulo">{WHY.title}</span>} />
            <p className="lead lg:col-span-5" data-reveal style={delay(2)}>
              {WHY.lead}
            </p>
          </div>
          <div className="mt-16 grid gap-4 lg:grid-cols-3">
            <div className="flex flex-col justify-between rounded-[1.5rem] bg-cream-50 p-8 text-ink lg:row-span-2 md:p-10" data-reveal>
              <span className="num">01</span>
              <div className="mt-16">
                <h3 className="font-serif text-[clamp(1.9rem,2.8vw,2.6rem)] leading-[1.05]">{WHY.featured.t}</h3>
                <p className="mt-5 text-ink-soft">{WHY.featured.d}</p>
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
              {WHY.reasons.map((r, i) => (
                <li key={r.t} className="rounded-[1.25rem] border border-cream-50/15 p-7 transition-colors duration-500 hover:border-gold-300/60" data-reveal style={delay(i % 2)}>
                  <span className="num">{pad(i + 2)}</span>
                  <h3 className="mt-4 font-serif text-[1.45rem] leading-tight">{r.t}</h3>
                  <p className="mt-3 text-[0.95rem] text-cream-50/80">{r.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Closing {...CLOSINGS.about} />
    </>
  );
}
