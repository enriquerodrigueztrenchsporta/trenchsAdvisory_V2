// Catálogo de Herramientas gratuitas. Para publicar una herramienta nueva basta con añadir una entrada aquí y crear
// su página en src/app/herramientas/<slug>/; la sección y la tarjeta se generan a partir de esta lista.

export type Tool = {
  slug: string;
  name: string;
  description: string;
  cta: string;
  /** Icono de la tarjeta (ver components/tools/ToolIcon.tsx). */
  icon: 'profitability';
  /** Rasgos breves que aparecen bajo la descripción. */
  facts: string[];
};

export const TOOLS_INTRO = {
  kicker: 'Herramientas gratuitas',
  title: 'Entiende y mejora tu negocio',
  lead: 'Analiza tu empresa, descubre oportunidades de mejora y toma decisiones más inteligentes con nuestras herramientas gratuitas.',
};

export const TOOLS: Tool[] = [
  {
    slug: 'calculadora-rentabilidad',
    name: 'Calculadora de Rentabilidad Empresarial',
    description:
      'Descubre cuánto gana realmente tu empresa, analiza tus costes, calcula tu punto de equilibrio y simula decisiones para mejorar tus resultados.',
    cta: 'Analizar mi rentabilidad',
    icon: 'profitability',
    facts: ['Gratis y sin registro', 'Resultados al instante', 'Cálculo en tu navegador'],
  },
];

export const toolPath = (t: Tool) => `/herramientas/${t.slug}`;
