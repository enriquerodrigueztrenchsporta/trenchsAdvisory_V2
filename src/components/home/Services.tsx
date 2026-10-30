import Link from 'next/link';
import { Arrow, SectionHead, delay, pad } from '@/components/ui/primitives';
import { CAPABILITIES_INTRO } from '@/content/firm';
import { SERVICES } from '@/content/services';

// Diagrama radial de la v1: cinco capacidades alrededor de «Mejores decisiones».
const C = 160;
const R = 120;
const NODES = SERVICES.map((_, i) => {
  const a = (-90 + i * 72) * (Math.PI / 180);
  return { x: C + R * Math.cos(a), y: C + R * Math.sin(a) };
});

/** H-04 · Las cinco áreas de servicio. */
export function Services() {
  return (
    <section id="servicios" aria-labelledby="servicios-titulo" className="section">
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-end">
          <SectionHead
            className="lg:col-span-7"
            eyebrow={CAPABILITIES_INTRO.eyebrow}
            title={<span id="servicios-titulo">{CAPABILITIES_INTRO.title}</span>}
            lead={CAPABILITIES_INTRO.lead}
          />
          <figure className="relative mx-auto w-full max-w-[18rem] lg:col-span-4 lg:col-start-9" aria-hidden="true">
            <svg viewBox="0 0 320 320" className="w-full" aria-hidden="true" data-draw>
              <circle cx={C} cy={C} r={R} fill="none" stroke="var(--color-line)" />
              {NODES.map((n, i) => (
                <line key={i} className="draw" style={delay(i)} x1={n.x} y1={n.y} x2={C} y2={C} pathLength={1} stroke="var(--color-gold-500)" />
              ))}
              <circle cx={C} cy={C} r="54" fill="var(--color-forest-900)" />
              {NODES.map((n, i) => (
                <rect key={i} x={n.x - 5} y={n.y - 5} width="10" height="10" fill="var(--color-forest-900)" />
              ))}
            </svg>
            <span className="absolute inset-0 grid place-items-center text-center font-serif text-[1rem] leading-tight text-cream-50">
              {CAPABILITIES_INTRO.center.split(' ').map((w) => (
                <span key={w} className="block">
                  {w}
                </span>
              ))}
            </span>
          </figure>
        </div>

        <ul className="mt-20 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {SERVICES.map((s, i) => (
            <li key={s.slug} className={i < 2 ? 'lg:col-span-3' : 'lg:col-span-2'} data-reveal style={delay(i)}>
              <Link
                href={`/servicios/${s.slug}`}
                className="group relative flex h-full min-h-[22rem] flex-col overflow-hidden rounded-[1.5rem] border border-line bg-cream-100 p-7 transition-[border-color,box-shadow,transform] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-forest-900 hover:shadow-[0_40px_60px_-40px_rgb(20_38_31/0.45)] md:p-9"
              >
                {/* Plano verde que sube al pasar el cursor. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 origin-bottom scale-y-0 bg-forest-900 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
                />
                <span className="relative flex items-start justify-between">
                  <span className="num transition-colors duration-500 group-hover:text-gold-300">{pad(i + 1)}</span>
                  <span className="grid h-10 w-10 place-items-center rounded-full border border-line transition-all duration-500 group-hover:rotate-[-45deg] group-hover:border-gold-300 group-hover:bg-gold-300 group-hover:text-forest-950">
                    <Arrow />
                  </span>
                </span>
                <span className="relative mt-auto block pt-16">
                  <span className="block font-serif text-[clamp(1.75rem,2.6vw,2.4rem)] leading-[1.05] tracking-[-0.025em] transition-colors duration-500 group-hover:text-cream-50">
                    {s.name}
                  </span>
                  <span className="mt-3 block max-w-[30ch] text-[0.95rem] text-ink-soft transition-colors duration-500 group-hover:text-cream-50/80">
                    {s.subtitle}
                  </span>
                  <span className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[0.8rem] transition-colors duration-500 group-hover:border-cream-50/15">
                    <em className="font-serif text-[1.05rem] text-forest-600 transition-colors duration-500 group-hover:text-gold-300">{s.claim}</em>
                    <span className="shrink-0 pl-3 text-ink-mute transition-colors duration-500 group-hover:text-cream-50/75">
                      {s.rows.length} servicios
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
