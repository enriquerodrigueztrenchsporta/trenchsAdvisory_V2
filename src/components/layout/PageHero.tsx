import type { ReactNode } from 'react';
import { LogoMark } from '@/components/brand/Logo';
import { Breadcrumbs, type Crumb } from '@/components/seo/Breadcrumbs';

/**
 * Cabecera oscura de las páginas interiores. El titular (LCP) se anima solo con CSS y es visible desde el primer
 * fotograma. `aside` ocupa la columna derecha en escritorio.
 */
export function PageHero({
  kicker,
  title,
  lead,
  crumbs,
  aside,
  children,
  compact = false,
}: {
  kicker: string;
  title: string;
  lead?: string;
  crumbs: Crumb[];
  aside?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <section className="on-dark grain relative overflow-hidden bg-forest-950 text-cream-50">
      <LogoMark
        mono
        className="pointer-events-none absolute -right-[12%] top-1/2 w-[52rem] max-w-[120vw] -translate-y-1/2 text-cream-50/[0.04] md:-right-[6%]"
      />
      <div className={`wrap relative ${compact ? 'pb-16 pt-36 md:pb-20 md:pt-44' : 'pb-20 pt-36 md:pb-28 md:pt-48'}`}>
        <Breadcrumbs items={crumbs} />
        <div className={`mt-10 grid gap-14 ${aside ? 'lg:grid-cols-12 lg:items-end' : ''}`}>
          <div className={aside ? 'lg:col-span-7' : 'max-w-5xl'}>
            <p className="eyebrow hero-in" style={{ '--i': 0 } as React.CSSProperties}>
              {kicker}
            </p>
            <h1 className={`mt-7 ${compact ? 'display' : 'display-xl'}`}>
              <span className="hero-line">{title}</span>
            </h1>
            {lead && (
              <p className="lead hero-in mt-8 max-w-2xl" style={{ '--i': 2 } as React.CSSProperties}>
                {lead}
              </p>
            )}
            {children && (
              <div className="hero-in mt-10" style={{ '--i': 3 } as React.CSSProperties}>
                {children}
              </div>
            )}
          </div>
          {aside && (
            <div className="hero-in lg:col-span-5" style={{ '--i': 4 } as React.CSSProperties}>
              {aside}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
