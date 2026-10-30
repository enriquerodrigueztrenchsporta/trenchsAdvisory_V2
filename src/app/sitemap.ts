import type { MetadataRoute } from 'next';
import { FIRMA_NAV, SERVICES } from '@/content/services';
import { TOOLS, toolPath } from '@/content/tools';
import { absolute } from '@/lib/site';

export const dynamic = 'force-static';

// Las 12 rutas de la v1 más las Herramientas gratuitas.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    ...SERVICES.map((s) => `/servicios/${s.slug}`),
    ...FIRMA_NAV.map((f) => f.path),
    '/herramientas',
    ...TOOLS.map(toolPath),
    '/legal/aviso-legal',
    '/legal/privacidad',
    '/legal/cookies',
  ];
  return paths.map((p) => ({
    url: absolute(p),
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/legal') ? 0.2 : p.startsWith('/servicios') || p.startsWith('/herramientas') ? 0.8 : 0.6,
  }));
}
