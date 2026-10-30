import type { MetadataRoute } from 'next';
import { FIRMA_NAV, SERVICES } from '@/content/services';
import { absolute } from '@/lib/site';

export const dynamic = 'force-static';

// Las mismas 12 rutas que la v1.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/',
    ...SERVICES.map((s) => `/servicios/${s.slug}`),
    ...FIRMA_NAV.map((f) => f.path),
    '/legal/aviso-legal',
    '/legal/privacidad',
    '/legal/cookies',
  ];
  return paths.map((p) => ({
    url: absolute(p),
    changeFrequency: 'monthly',
    priority: p === '/' ? 1 : p.startsWith('/legal') ? 0.2 : p.startsWith('/servicios') ? 0.8 : 0.6,
  }));
}
