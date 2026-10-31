// Catálogo de Herramientas gratuitas. Para publicar una herramienta nueva basta con añadir una entrada aquí y crear
// su página en src/app/herramientas/<slug>/; la sección y la tarjeta se generan a partir de esta lista.

export type Tool = {
  slug: string;
  name: string;
  /** Pregunta o frase corta bajo el nombre (opcional). */
  subtitle?: string;
  description: string;
  cta: string;
  /** Icono e ilustración de la tarjeta (ver components/tools/ToolCard.tsx). */
  icon: 'profitability' | 'pyme-check';
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
  {
    slug: 'pyme-check',
    name: 'PYME Check',
    subtitle: '¿Dónde puede mejorar tu empresa?',
    description: 'Descubre en menos de un minuto qué áreas de tu negocio podrías mejorar y qué soluciones pueden ayudarte a crecer.',
    cta: 'Analizar mi empresa',
    icon: 'pyme-check',
    facts: ['Gratis y sin registro', 'Cinco preguntas', 'Menos de un minuto'],
  },
];

export const toolPath = (t: Tool) => `/herramientas/${t.slug}`;
