import type { Metadata } from 'next';
import { PageHero } from '@/components/layout/PageHero';
import { PymeCheck } from '@/components/pyme-check/PymeCheck';
import { Arrow } from '@/components/ui/primitives';
import { TOOLS, TOOLS_INTRO, toolPath } from '@/content/tools';
import { pageMetadata } from '@/lib/seo';

const tool = TOOLS.find((t) => t.slug === 'pyme-check')!;

export const metadata: Metadata = pageMetadata({ title: `${tool.name} · ${tool.subtitle}`, description: tool.description, path: toolPath(tool) });

export default function PymeCheckPage() {
  return (
    <>
      <PageHero
        compact
        kicker={tool.name}
        title="¿Dónde puede mejorar tu empresa?"
        lead="Descubre las principales oportunidades de mejora de tu negocio respondiendo cinco preguntas. Gratis, sin registro y en menos de un minuto."
        crumbs={[{ name: TOOLS_INTRO.kicker, href: '/herramientas' }, { name: tool.name, href: toolPath(tool) }]}
      >
        <p className="max-w-xl text-[0.98rem] leading-relaxed text-cream-50/75">
          Evaluamos cómo gestionas tus ventas, costes, clientes, procesos y planificación para mostrarte posibles áreas de mejora.
        </p>
        <a href="#cuestionario" className="btn btn--light mt-8">
          Comenzar diagnóstico
          <span className="btn__icon">
            <Arrow />
          </span>
        </a>
      </PageHero>
      <PymeCheck />
    </>
  );
}
