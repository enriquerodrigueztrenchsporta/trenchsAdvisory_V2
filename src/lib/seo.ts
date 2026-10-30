import type { Metadata } from 'next';
import { SITE_NAME } from './site';

export const OG_IMAGE = {
  url: '/og.png',
  width: 1200,
  height: 630,
  alt: 'Trenchs Advisory · Decisiones más inteligentes. Organizaciones más competitivas.',
};

/** Metadatos de una página: título, descripción, URL canónica (con barra final, como la v1) y Open Graph. */
export function pageMetadata({ title, description, path, absoluteTitle = false }: { title: string; description: string; path: string; absoluteTitle?: boolean }): Metadata {
  const canonical = path === '/' ? '/' : `${path.replace(/\/$/, '')}/`;
  const fullTitle = absoluteTitle ? title : `${title} · ${SITE_NAME}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical },
    openGraph: { type: 'website', locale: 'es_ES', siteName: SITE_NAME, title: fullTitle, description, url: canonical, images: [OG_IMAGE] },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images: [OG_IMAGE.url] },
  };
}
