'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useState } from 'react';
import { EMAIL } from '@/lib/site';

/**
 * Correo visible con botón «Copiar». Alternativa al enlace mailto: para quien no tiene un programa de correo
 * configurado (webmail). Solo usa el portapapeles: no guarda ni envía nada.
 */
export function CopyEmail({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Sin acceso al portapapeles: el correo sigue visible y seleccionable.
    }
  };

  const muted = tone === 'dark' ? 'text-cream-50/75' : 'text-ink-soft';
  return (
    <div className={`flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.95rem] ${muted}`}>
      <span>o escríbanos a</span>
      <a href={`mailto:${EMAIL}`} className={`underline decoration-1 underline-offset-4 ${tone === 'dark' ? 'text-cream-50' : 'text-ink'}`}>
        {EMAIL}
      </a>
      <button
        type="button"
        onClick={copy}
        className={`relative inline-flex h-8 min-w-[6.5rem] items-center justify-center overflow-hidden rounded-full px-3 text-[0.8rem] font-medium transition-colors ${
          tone === 'dark' ? 'bg-cream-50/10 text-cream-50 hover:bg-cream-50/20' : 'bg-ink/5 text-ink hover:bg-ink/10'
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={copied ? 'ok' : 'copy'}
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {copied ? 'Copiado' : 'Copiar correo'}
          </m.span>
        </AnimatePresence>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {copied ? 'Correo copiado al portapapeles' : ''}
      </span>
    </div>
  );
}
