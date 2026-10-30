import type { Metadata } from 'next';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/layout/PageHero';
import { ToolCard } from '@/components/tools/ToolCard';
import { pad } from '@/components/ui/primitives';
import { TOOLS, TOOLS_INTRO } from '@/content/tools';
import { pageMetadata } from '@/lib/seo';

export const metadata: Metadata = pageMetadata({
  title: TOOLS_INTRO.kicker,
  description: TOOLS_INTRO.lead,
  path: '/herramientas',
});

// Cómo funcionan las herramientas: lo que la persona hace y qué pasa con sus datos.
const HOW = [
  { t: 'Introduce tus cifras', d: 'Datos básicos de un mes, sin IVA. No pedimos registro ni datos personales para ver los resultados.' },
  { t: 'Entiende y simula', d: 'Indicadores, gráficos y un simulador para ver el efecto de cada decisión antes de tomarla.' },
  { t: 'Decide si hablamos', d: 'Si quieres, nos envías tu diagnóstico. Sin tu autorización, tus cifras no salen de tu navegador.' },
];

export default function ToolsPage() {
  return (
    <>
      <PageHero kicker={TOOLS_INTRO.kicker} title={TOOLS_INTRO.title} lead={TOOLS_INTRO.lead} crumbs={[{ name: TOOLS_INTRO.kicker, href: '/herramientas' }]} />

      <section aria-labelledby="catalogo-titulo" className="section">
        <div className="wrap">
          <h2 id="catalogo-titulo" className="sr-only">
            Herramientas disponibles
          </h2>
          <ul className="grid gap-6">
            {TOOLS.map((tool) => (
              <li key={tool.slug}>
                <ToolCard tool={tool} />
              </li>
            ))}
          </ul>

          <ol className="mt-16 grid gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:grid-cols-3" aria-label="Cómo funciona" data-reveal>
            {HOW.map((s, i) => (
              <li key={s.t} className="bg-cream-50 p-7 md:p-9">
                <span className="num">{pad(i + 1)}</span>
                <h3 className="mt-4 font-serif text-[1.5rem] leading-tight">{s.t}</h3>
                <p className="mt-3 text-[0.95rem] text-ink-soft">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Closing />
    </>
  );
}
