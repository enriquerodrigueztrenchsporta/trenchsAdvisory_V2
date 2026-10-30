import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { absolute } from '@/lib/site';

export type Crumb = { name: string; href?: string };

/** Migas de pan visibles + datos estructurados BreadcrumbList. El último elemento es la página actual. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: 'Inicio', href: '/' }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación" className="hero-in text-[0.8rem] text-cream-50/70">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((c, i) => (
            <li key={c.name} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {c.href && i < all.length - 1 ? (
                <Link href={c.href} className="transition-colors hover:text-cream-50">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={i === all.length - 1 ? 'page' : undefined}>
                  {c.name}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: all
            .filter((c) => c.href)
            .map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: absolute(c.href) })),
        }}
      />
    </>
  );
}
