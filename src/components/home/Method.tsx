import { DiagnosisButton, SectionHead, TextLink, delay } from '@/components/ui/primitives';
import { METHOD_INTRO, PHASES } from '@/content/firm';

/** H-05 · Método (resumen de la portada: fase y objetivo; el resultado de cada fase está en /firma/metodo). */
export function Method() {
  return (
    <section id="metodo" aria-labelledby="metodo-titulo" className="section relative overflow-hidden bg-cream-100">
      <div className="wrap">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHead
            className="lg:col-span-7"
            eyebrow={METHOD_INTRO.eyebrow}
            title={<span id="metodo-titulo">{METHOD_INTRO.title}</span>}
          />
          <div className="lg:col-span-5" data-reveal style={delay(2)}>
            <p className="lead">{METHOD_INTRO.lead}</p>
            <TextLink href="/firma/metodo" className="mt-6">
              {METHOD_INTRO.more}
            </TextLink>
          </div>
        </div>

        <ol className="relative mt-20 grid gap-y-10 md:grid-cols-5 md:gap-x-6" data-draw>
          {/* Línea que se dibuja de la primera a la última fase. */}
          <svg className="absolute left-0 top-[1.375rem] hidden h-px w-full overflow-visible md:block" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 1">
            <line className="draw" x1="0" y1="0.5" x2="100" y2="0.5" stroke="var(--color-forest-900)" strokeOpacity="0.35" pathLength={1} vectorEffect="non-scaling-stroke" />
          </svg>
          {PHASES.map((p, i) => (
            <li key={p.name} className="relative grid grid-cols-[2.75rem_1fr] gap-5 md:block" data-reveal style={delay(i + 1)}>
              <span className="relative z-10 grid h-11 w-11 place-items-center rounded-full border border-forest-900 bg-cream-100 font-serif text-[1.15rem] text-forest-900">
                {i + 1}
              </span>
              <div className="md:mt-8">
                <h3 className="font-serif text-[1.6rem] leading-tight tracking-tight">{p.name}</h3>
                <p className="mt-3 text-[0.95rem] text-ink-soft">{p.goal}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 flex flex-wrap items-center gap-6" data-reveal>
          <DiagnosisButton />
        </div>
      </div>
    </section>
  );
}
