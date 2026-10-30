import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/layout/PageHero';
import { ScrollWords } from '@/components/motion/ScrollWords';
import { SectionHead, delay, pad } from '@/components/ui/primitives';
import { CLOSINGS, PURPOSE } from '@/content/firm';

const description =
  'Transformar la incertidumbre en estrategia, los datos en oportunidades y la tecnología en una ventaja competitiva real y sostenible.';

export const metadata: Metadata = pageMetadata({ title: 'Misión, visión y principios', description, path: '/firma/mision-vision-principios' });

export default function PurposePage() {
  const { hero, mission, vision, principles } = PURPOSE;
  return (
    <>
      <PageHero
        kicker={hero.kicker}
        title={hero.title}
        compact
        crumbs={[{ name: 'La firma' }, { name: 'Misión, visión y principios', href: '/firma/mision-vision-principios' }]}
      />

      {/* F-11 · Misión: se ilumina al leerla */}
      <section aria-labelledby="mision" className="section">
        <div className="wrap">
          <h2 id="mision" className="eyebrow font-sans" data-reveal>
            {mission.eyebrow}
          </h2>
          <ScrollWords
            as="blockquote"
            parts={mission.parts}
            emClass="italic"
            className="mt-12 max-w-[11.5em] font-serif text-[clamp(2.1rem,4.6vw,4.4rem)] leading-[1.08] tracking-[-0.025em]"
          />
        </div>
      </section>

      {/* F-12 · Visión */}
      <section aria-labelledby="vision" className="section bg-cream-100">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:items-center">
          <SectionHead className="lg:col-span-6" eyebrow={vision.eyebrow} title={<span id="vision">{vision.title}</span>} lead={vision.lead} />
          <div className="on-dark rounded-[1.5rem] bg-forest-900 p-8 text-cream-50 md:p-10 lg:col-span-5 lg:col-start-8" data-reveal style={delay(2)}>
            <p className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-gold-300">{vision.label}</p>
            <ul className="mt-6">
              {vision.confluences.map((c) => (
                <li key={c} className="flex items-center gap-4 border-t border-cream-50/15 py-4 font-serif text-[1.3rem]">
                  <span aria-hidden="true" className="h-2 w-2 shrink-0 bg-gold-500" />
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* F-13 · Principios */}
      <section aria-labelledby="principios" className="section">
        <div className="wrap">
          <SectionHead className="max-w-3xl" eyebrow={principles.eyebrow} title={<span id="principios">{principles.title}</span>} />
          <ol className="mt-16 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-3">
            {principles.items.map((p, i) => (
              <li key={p.t} className="group border-b border-line py-9 pr-8" data-reveal style={delay(i % 3)}>
                <span className="font-serif text-[3rem] leading-none text-gold-700 transition-transform duration-700 group-hover:-translate-y-1">
                  {pad(i + 1)}
                </span>
                <h3 className="mt-6 font-serif text-[1.6rem] leading-tight">{p.t}</h3>
                <p className="mt-3 text-[0.95rem] text-ink-soft">{p.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Closing {...CLOSINGS.purpose} />
    </>
  );
}
