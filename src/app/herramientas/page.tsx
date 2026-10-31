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
  { t: 'Elige una herramienta', d: 'Sin registro y sin dar datos personales para ver los resultados.' },
  { t: 'Responde y entiende', d: 'Todo se calcula en tu navegador y obtienes el resultado al momento.' },
  { t: 'Decide si hablamos', d: 'Tus resultados no salen de tu navegador salvo que tú decidas enviárnoslos.' },
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
          {/* Las tarjetas se reparten solas: una por fila en móvil, dos o tres según el ancho disponible. */}
          <ul className="grid gap-6 md:grid-cols-[repeat(auto-fit,minmax(22rem,1fr))]">
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
