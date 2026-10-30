import type { Metadata } from 'next';
import { Hero } from '@/components/home/Hero';
import { MethodStory } from '@/components/home/MethodStory';
import { Problem } from '@/components/home/Problem';
import { QuestionsStory } from '@/components/home/QuestionsStory';
import { Services } from '@/components/home/Services';
import { Tailored } from '@/components/home/Tailored';
import { Closing } from '@/components/layout/Closing';
import { JsonLd } from '@/components/seo/JsonLd';
import { pageMetadata } from '@/lib/seo';
import { holder } from '@/content/legal';
import { SERVICES } from '@/content/services';
import { EMAIL, SITE_NAME, SITE_URL, absolute } from '@/lib/site';

// Título y descripción de la v1, sin cambios.
const description =
  'Integramos estrategia, finanzas, datos, tecnología e inteligencia artificial para que empresas y administraciones públicas tomen mejores decisiones.';

export const metadata: Metadata = pageMetadata({
  title: 'Trenchs Advisory · Consultoría de estrategia, finanzas, datos e IA',
  description,
  path: '/',
  absoluteTitle: true,
});

export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${SITE_URL}/#organizacion`,
          name: SITE_NAME,
          url: absolute('/'),
          logo: `${SITE_URL}/logo-trenchs-advisory.svg`,
          description,
          email: `mailto:${EMAIL}`,
          founder: { '@type': 'Person', name: holder() },
          slogan: 'Decisiones más inteligentes. Organizaciones más competitivas.',
          knowsAbout: ['Estrategia', 'Finanzas', 'Datos', 'Tecnología', 'Inteligencia artificial'],
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Servicios',
            itemListElement: SERVICES.map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: s.name, url: absolute(`/servicios/${s.slug}`) },
            })),
          },
        }}
      />
      <Hero />
      <MethodStory />
      <Problem />
      <QuestionsStory />
      <Services />
      <Tailored />
      <Closing />
    </>
  );
}
