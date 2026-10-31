'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea,summary,[tabindex]:not([tabindex="-1"])';
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Diálogo modal accesible: fondo oscurecido, Escape y clic fuera para cerrar, foco atrapado dentro y devuelto al
 * cerrar, scroll del fondo bloqueado. En móvil se muestra como hoja inferior. El contenido debe tener un título con
 * id `labelledBy` y un elemento con `data-autofocus` (normalmente ese título, con tabIndex={-1}).
 */
export function Modal({ open, onClose, labelledBy, focusKey, children }: { open: boolean; onClose: () => void; labelledBy: string; focusKey?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab' && ref.current) {
        const items = [...ref.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      returnFocus.current?.focus();
    };
  }, [open, onClose]);

  // Al abrir y al cambiar de vista (focusKey), el foco va al elemento marcado con data-autofocus.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => ref.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 40);
    return () => window.clearTimeout(t);
  }, [open, focusKey]);

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
          <div className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <m.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.5rem] bg-cream-50 text-ink shadow-[0_40px_80px_-30px_rgb(20_38_31/0.6)] sm:rounded-[1.5rem]"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
          >
            <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream-100 text-ink transition-colors hover:bg-cream-200">
              <span className="sr-only">Cerrar</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="overflow-y-auto overscroll-contain p-6 pt-8 sm:p-10">{children}</div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
