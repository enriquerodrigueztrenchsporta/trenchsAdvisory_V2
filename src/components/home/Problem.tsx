import { ScrollWords } from '@/components/motion/ScrollWords';
import { delay } from '@/components/ui/primitives';
import { PROBLEM } from '@/content/firm';

// Posición inicial (dispersa) de cada fuente; al entrar en pantalla se alinean bajo «Una visión».
const SCATTER = [
  { sx: '-1.5rem', sy: '-4.5rem', r: '-9deg' },
  { sx: '7rem', sy: '-2rem', r: '7deg' },
  { sx: '-0.5rem', sy: '1.5rem', r: '-4deg' },
  { sx: '9rem', sy: '3.5rem', r: '11deg' },
];

/** H-02 · Negocio primero */
export function Problem() {
  return (
    <section id="enfoque" aria-labelledby="enfoque-titulo" className="section relative overflow-hidden">
      <div className="wrap grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <p className="eyebrow" data-reveal>
            {PROBLEM.eyebrow}
          </p>
          <h2 id="enfoque-titulo" className="display mt-8 max-w-[14ch]" data-reveal style={delay(1)}>
            {PROBLEM.title}
          </h2>
          <ScrollWords
            parts={PROBLEM.lead}
            className="mt-12 max-w-[30ch] font-serif text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.25] tracking-tight"
          />
        </div>

        <figure className="relative lg:col-span-5 lg:pt-24" aria-label="Información dispersa que se ordena en una única visión">
          <div className="relative rounded-[1.75rem] border border-line bg-cream-100 p-8 md:p-10">
            <p className="eyebrow">{PROBLEM.ordered}</p>
            <ul className="scatter mt-8 space-y-3" data-draw>
              {PROBLEM.scattered.map((label, k) => (
                <li
                  key={label}
                  style={{ '--sx': SCATTER[k].sx, '--sy': SCATTER[k].sy, '--r': SCATTER[k].r, '--i': k } as React.CSSProperties}
                  className="flex items-center justify-between rounded-full border border-line bg-cream-50 px-5 py-3 text-[0.8rem] font-medium uppercase tracking-[0.16em] text-ink-soft"
                >
                  {label}
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                </li>
              ))}
            </ul>
            <div aria-hidden="true" className="mt-8 h-px bg-line" />
            <svg viewBox="0 0 300 60" className="mt-6 w-full" aria-hidden="true" data-draw>
              <path
                className="draw"
                d="M0 50 C60 50 80 20 140 22 S240 8 300 6"
                fill="none"
                stroke="var(--color-forest-600)"
                strokeWidth="1.5"
                pathLength={1}
                style={delay(6)}
              />
            </svg>
          </div>
        </figure>
      </div>
    </section>
  );
}
