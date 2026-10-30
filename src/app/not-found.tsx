import type { Metadata } from 'next';
import Link from 'next/link';
import { LogoMark } from '@/components/brand/Logo';
import { Arrow } from '@/components/ui/primitives';
import { SERVICES } from '@/content/services';

export const metadata: Metadata = { title: 'Página no encontrada', robots: { index: false } };

export default function NotFound() {
  return (
    <section className="on-dark grain relative flex min-h-[100svh] items-center overflow-hidden bg-forest-950 text-cream-50">
      <LogoMark mono className="pointer-events-none absolute -right-[10%] top-1/2 w-[48rem] max-w-[120vw] -translate-y-1/2 text-cream-50/[0.04]" />
      <div className="wrap relative py-36">
        <p className="eyebrow">Error 404</p>
        <h1 className="display-xl mt-7 max-w-[14ch]">
          <span className="hero-line">Esta página no existe.</span>
        </h1>
        <p className="lead mt-8">Puede volver a la portada o ir directamente a una de nuestras áreas de servicio.</p>
        <Link href="/" className="btn btn--light mt-10">
          Volver a la portada
          <span className="btn__icon">
            <Arrow />
          </span>
        </Link>
        <ul className="mt-16 flex flex-wrap gap-2">
          {SERVICES.map((s) => (
            <li key={s.slug}>
              <Link href={`/servicios/${s.slug}`} className="inline-flex rounded-full border border-cream-50/20 px-4 py-2 text-[0.88rem] transition-colors hover:border-gold-300 hover:text-gold-300">
                {s.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
