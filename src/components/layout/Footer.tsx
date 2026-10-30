import Link from 'next/link';
import { Logo, LogoMark } from '@/components/brand/Logo';
import { MotionToggle } from '@/components/layout/MotionToggle';
import { TAGLINE } from '@/content/firm';
import { holder } from '@/content/legal';
import { FIRMA_NAV, SERVICES } from '@/content/services';
import { EMAIL } from '@/lib/site';

const LEGAL = [
  { name: 'Aviso legal y condiciones de uso', href: '/legal/aviso-legal' },
  { name: 'Política de privacidad', href: '/legal/privacidad' },
  { name: 'Política de cookies', href: '/legal/cookies' },
];

export function Footer() {
  return (
    <footer className="on-dark grain relative overflow-hidden bg-forest-950 text-cream-50">
      <LogoMark mono className="pointer-events-none absolute -bottom-[18%] -right-[8%] w-[46rem] max-w-[90vw] text-cream-50/[0.035]" />
      <div className="wrap relative grid gap-12 pb-14 pt-20 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo inverse />
          <p className="mt-8 max-w-sm font-serif text-[1.75rem] leading-[1.15] tracking-tight text-cream-50/90">
            {TAGLINE[0]}
            <br />
            {TAGLINE[1]}
          </p>
        </div>
        <nav aria-label="Servicios" className="md:col-span-3">
          <p className="eyebrow">Servicios</p>
          <ul className="mt-5 space-y-2.5">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link className="text-[0.95rem] text-cream-50/80 transition-colors hover:text-gold-300" href={`/servicios/${s.slug}`}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="La firma" className="md:col-span-2">
          <p className="eyebrow">La firma</p>
          <ul className="mt-5 space-y-2.5">
            {FIRMA_NAV.map((f) => (
              <li key={f.path}>
                <Link className="text-[0.95rem] text-cream-50/80 transition-colors hover:text-gold-300" href={f.path}>
                  {f.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <p className="eyebrow">Contacto</p>
          <a className="mt-5 block break-all text-[0.95rem] text-cream-50/80 transition-colors hover:text-gold-300" href={`mailto:${EMAIL}`}>
            {EMAIL}
          </a>
        </div>
      </div>
      <div className="wrap relative flex flex-col gap-4 border-t border-cream-50/10 py-7 text-[0.82rem] text-cream-50/70 lg:flex-row lg:items-center lg:justify-between">
        <span>
          © {new Date().getFullYear()} {holder()}
        </span>
        <nav aria-label="Información legal">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL.map((l) => (
              <li key={l.href}>
                <Link className="transition-colors hover:text-cream-50" href={l.href}>
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <MotionToggle />
      </div>
    </footer>
  );
}
