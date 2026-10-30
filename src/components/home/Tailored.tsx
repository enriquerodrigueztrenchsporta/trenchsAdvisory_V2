import Link from 'next/link';
import { Arrow, SectionHead, delay, pad } from '@/components/ui/primitives';
import { TAILORED } from '@/content/firm';
import { FIRMA_NAV } from '@/content/services';

// Las dos páginas de la firma que amplían esta sección (sin repetir su contenido aquí).
const MORE = [FIRMA_NAV[0], FIRMA_NAV[1]];

/** H-06 · A la medida: cómo se adapta y cómo se empieza (encargo acotado, modalidades). */
export function Tailored() {
  return (
    <section id="a-la-medida" aria-labelledby="medida-titulo" className="section">
      <div className="wrap">
        <SectionHead
          className="max-w-4xl"
          eyebrow={TAILORED.eyebrow}
          title={<span id="medida-titulo">{TAILORED.title}</span>}
          lead={TAILORED.lead}
        />

        <ol className="mt-20 grid border-t border-ink md:grid-cols-2">
          {TAILORED.points.map((p, i) => (
            <li
              key={p.t}
              className={`border-b border-line py-10 md:py-12 ${i % 2 === 0 ? 'md:border-r md:pr-12' : 'md:pl-12'}`}
              data-reveal
              style={delay(i % 2)}
            >
              <span className="num">{pad(i + 1)}</span>
              <h3 className="title mt-5">{p.t}</h3>
              <p className="mt-4 max-w-[46ch] text-ink-soft">{p.d}</p>
              {p.modes && (
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Modalidades de colaboración">
                  {p.modes.map((mode) => (
                    <li key={mode} className="rounded-full bg-forest-900 px-4 py-2 text-[0.85rem] text-cream-50">
                      {mode}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {MORE.map((f, i) => (
            <li key={f.path} data-reveal style={delay(i)}>
              <Link
                href={f.path}
                className="group flex items-center justify-between gap-6 rounded-[1.25rem] border border-line p-6 transition-colors duration-500 hover:border-forest-900 hover:bg-cream-100 md:p-8"
              >
                <span>
                  <span className="block font-serif text-[1.5rem] leading-tight">{f.name}</span>
                  <span className="mt-1 block text-[0.92rem] text-ink-soft">{f.subtitle}</span>
                </span>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50 transition-transform duration-500 group-hover:translate-x-1">
                  <Arrow />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
