import type { Metadata } from 'next';
import { Calculator } from '@/components/calculator/Calculator';
import { PageHero } from '@/components/layout/PageHero';
import { TOOLS, TOOLS_INTRO, toolPath } from '@/content/tools';
import { pageMetadata } from '@/lib/seo';

const tool = TOOLS[0];

export const metadata: Metadata = pageMetadata({ title: tool.name, description: tool.description, path: toolPath(tool) });

export default function ProfitabilityCalculatorPage() {
  return (
    <>
      <PageHero
        compact
        kicker={tool.name}
        title="¿Sabes cuánto gana realmente tu empresa?"
        lead="Descubre tus márgenes, comprende tus costes y simula cómo mejorar tu rentabilidad. Gratis y sin registro."
        crumbs={[{ name: TOOLS_INTRO.kicker, href: '/herramientas' }, { name: tool.name, href: toolPath(tool) }]}
      />
      <Calculator />
    </>
  );
}
