import Link from 'next/link';
import type { ReactNode } from 'react';
import { DIAGNOSIS_MAILTO } from '@/lib/site';

export function Arrow({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Acción principal de la web: abre un correo con asunto y cuerpo prellenados (igual que la v1). */
export function DiagnosisButton({
  variant = 'dark',
  size = 'md',
  className = '',
  label = 'Solicitar diagnóstico',
}: {
  variant?: 'dark' | 'light';
  size?: 'md' | 'sm';
  className?: string;
  label?: string;
}) {
  return (
    <a
      href={DIAGNOSIS_MAILTO}
      className={`btn ${variant === 'light' ? 'btn--light' : ''} ${size === 'sm' ? 'btn--sm' : ''} ${className}`}
    >
      {label}
      <span className="sr-only"> (abre su programa de correo)</span>
      <span className="btn__icon">
        <Arrow />
      </span>
    </a>
  );
}

export function TextLink({ href, children, className = '' }: { href: string; children: ReactNode; className?: string }) {
  return (
    <Link href={href} className={`ulink ${className}`}>
      {children}
      <Arrow className="arrow h-3.5 w-3.5" />
    </Link>
  );
}

/** Etiqueta + titular + entradilla, con aparición escalonada. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  as: Tag = 'h2',
  className = '',
  titleClassName = 'display',
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  as?: 'h1' | 'h2';
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
}) {
  return (
    <div className={className}>
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          {eyebrow}
        </p>
      )}
      <Tag className={`mt-6 ${titleClassName}`} data-reveal style={{ '--d': 1 } as React.CSSProperties}>
        {title}
      </Tag>
      {lead && (
        <p className="lead mt-6" data-reveal style={{ '--d': 2 } as React.CSSProperties}>
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}

/** Retraso escalonado para [data-reveal] (variable CSS --d). */
export const delay = (d: number) => ({ '--d': d }) as React.CSSProperties;

/** Número con dos cifras: 1 → «01». */
export const pad = (n: number) => String(n).padStart(2, '0');
