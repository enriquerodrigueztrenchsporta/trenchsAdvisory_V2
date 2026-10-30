import Link from 'next/link';

// Símbolo de Trenchs Advisory, vectorizado del logo original (migrado de la v1 sin cambios de trazado).
export function LogoMark({ className, mono = false }: { className?: string; mono?: boolean }) {
  const dark = mono ? 'currentColor' : 'var(--logo-dark, #1F3A33)';
  const light = mono ? 'currentColor' : 'var(--logo-light, #3E6B5E)';
  return (
    <svg className={className} viewBox="0 0 648 648" aria-hidden="true" focusable="false">
      <path fill={dark} d="M0 0H247C247 60 262 110 290 210C310 290 318 340 322 387H0Z" />
      <path fill={dark} d="M345 0H648V387H419C412 330 400 280 385 210C360 110 345 60 345 0Z" />
      <path fill={dark} d="M0 432H327V485H0Z" />
      <path fill={dark} d="M424 432H648V485H424Z" />
      <path fill={light} opacity={mono ? 0.6 : 1} d="M0 529H325L315 648H0Z" />
      <path fill={light} opacity={mono ? 0.6 : 1} d="M422 529H648V648H412Z" />
    </svg>
  );
}

/**
 * Logotipo completo con enlace a la portada. Sin aria-label: el nombre accesible es el texto visible
 * («Trenchs Advisory»), lo que corrige el aviso label-content-name-mismatch de la v1.
 */
export function Logo({ inverse = false, className = '' }: { inverse?: boolean; className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 no-underline ${className}`}>
      <LogoMark
        mono={inverse}
        className="h-8 w-8 shrink-0 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[0.94]"
      />
      <span className="flex flex-col leading-none">
        <span className="text-[0.95rem] font-light uppercase tracking-[0.32em]">Trenchs</span>
        <span className={`mt-1 text-[0.6rem] uppercase tracking-[0.42em] ${inverse ? 'opacity-75' : 'text-forest-600'}`}>
          Advisory
        </span>
      </span>
    </Link>
  );
}
