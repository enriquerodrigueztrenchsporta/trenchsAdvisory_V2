'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AssistantModal } from './AssistantModal';

const ease = [0.16, 1, 0.3, 1] as const;

function BotIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 3.5V17A2.5 2.5 0 0 1 4 14.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="9" cy="10.5" r="1" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1" fill="currentColor" />
      <circle cx="18.5" cy="5.5" r="2.5" fill="var(--color-gold-500)" stroke="var(--color-forest-900)" strokeWidth="1.2" />
    </svg>
  );
}

/**
 * Chatbot demostrativo global (una sola instancia, en el layout). No usa IA ni ninguna API: cualquier mensaje válido
 * abre la propuesta comercial de asistentes de IA. Lo escrito solo vive en memoria y se borra al cerrar la demo;
 * nunca se envía ni se guarda.
 */
export function ChatbotDemo() {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState(false);
  const [seen, setSeen] = useState(false); // la etiqueta «Prueba nuestro asistente» desaparece tras la primera apertura
  const fabRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Borra la conversación: al cerrar la demo no queda nada de lo escrito.
  const reset = () => {
    setDraft('');
    setSent(null);
    setError(false);
  };

  const close = useCallback(() => {
    setOpen(false);
    reset();
    window.setTimeout(() => fabRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    if (!open || modal) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 120);
    // Escape cierra la ventana (si el pop-up está abierto, lo gestiona el pop-up).
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, modal, close]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) {
      setError(true);
      inputRef.current?.focus();
      return;
    }
    // Sin respuestas simuladas ni llamadas a ningún servicio: directamente la propuesta comercial.
    setSent(text);
    setDraft('');
    setModal(true);
  };

  const closeModal = useCallback(() => {
    setModal(false);
    close();
  }, [close]);

  return (
    <>
      <div className="chat-dock fixed bottom-4 right-4 z-40 flex flex-col items-end sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {open && (
            <m.section
              id="chat-demo"
              aria-labelledby="chat-demo-title"
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.35, ease }}
              style={{ transformOrigin: 'bottom right' }}
              className="mb-3 flex max-h-[min(34rem,calc(100dvh-7rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-[1.5rem] border border-line bg-cream-50 text-ink shadow-[0_30px_70px_-25px_rgb(20_38_31/0.55)]"
            >
              <header className="on-dark flex items-center gap-3 bg-forest-950 px-4 py-3.5 text-cream-50">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-cream-50/10 text-cream-50">
                  <BotIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <h2 id="chat-demo-title" className="font-sans text-[0.95rem] font-medium leading-tight tracking-normal">
                    Asistente virtual
                  </h2>
                  <span className="mt-0.5 flex items-center gap-1.5 text-[0.75rem] text-cream-50/70">
                    <span className="h-1.5 w-1.5 rounded-full bg-gold-300" aria-hidden="true" />
                    Demo interactiva
                  </span>
                </span>
                <button type="button" onClick={close} className="grid h-9 w-9 place-items-center rounded-full text-cream-50/80 transition-colors hover:bg-cream-50/10 hover:text-cream-50">
                  <span className="sr-only">Cerrar el asistente</span>
                  <svg className="h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto bg-cream-100/60 p-4" aria-live="polite">
                <div className="flex items-end gap-2">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50">
                    <BotIcon className="h-4 w-4" />
                  </span>
                  <p className="max-w-[85%] rounded-2xl rounded-bl-md bg-cream-50 px-3.5 py-2.5 text-[0.92rem] leading-snug shadow-[0_1px_0_var(--color-line)]">
                    ¡Hola! 👋 Escribe una pregunta y descubre cómo podría funcionar un asistente de inteligencia artificial en tu empresa.
                  </p>
                </div>
                {sent && (
                  <p className="ml-auto max-w-[85%] break-words rounded-2xl rounded-br-md bg-forest-900 px-3.5 py-2.5 text-[0.92rem] leading-snug text-cream-50">
                    <span className="sr-only">Tu mensaje: </span>
                    {sent}
                  </p>
                )}
                <p className="pt-1 text-center text-[0.72rem] leading-snug text-ink-mute">Esta es una demostración comercial. No estás hablando con una IA real.</p>
              </div>

              <form onSubmit={submit} className="border-t border-line bg-cream-50 p-3" noValidate>
                <div className="flex items-center gap-2">
                  <label htmlFor="chat-demo-input" className="sr-only">
                    Tu pregunta
                  </label>
                  <input
                    ref={inputRef}
                    id="chat-demo-input"
                    type="text"
                    autoComplete="off"
                    maxLength={500}
                    placeholder="Escribe aquí tu pregunta..."
                    value={draft}
                    aria-invalid={error || undefined}
                    aria-describedby={error ? 'chat-demo-error' : undefined}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      if (error) setError(false);
                    }}
                    className="min-w-0 flex-1 rounded-full border border-line bg-cream-100 px-4 py-2.5 text-[0.95rem] text-ink placeholder:text-ink-mute/80 focus:border-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-900/15"
                  />
                  <button
                    type="submit"
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50 transition-[transform,background-color] duration-300 hover:bg-forest-800 active:scale-95"
                  >
                    <span className="sr-only">Enviar</span>
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {error && (
                  <p id="chat-demo-error" className="mt-2 px-2 text-[0.8rem] text-loss">
                    Escribe una pregunta para probar la demo.
                  </p>
                )}
              </form>
            </m.section>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3">
          <AnimatePresence>
            {!open && !seen && (
              <m.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.4, ease, delay: 0.6 }}
                className="pointer-events-none hidden rounded-full border border-line bg-cream-50/95 px-3.5 py-1.5 text-[0.82rem] font-medium text-ink shadow-[0_10px_30px_-15px_rgb(20_38_31/0.5)] backdrop-blur sm:block"
                aria-hidden="true"
              >
                Prueba nuestro asistente
              </m.span>
            )}
          </AnimatePresence>
          <button
            ref={fabRef}
            type="button"
            aria-expanded={open}
            aria-controls="chat-demo"
            onClick={() => {
              if (open) close();
              else {
                setOpen(true);
                setSeen(true);
              }
            }}
            className="group grid h-14 w-14 place-items-center rounded-full bg-forest-900 text-cream-50 shadow-[0_18px_40px_-14px_rgb(20_38_31/0.7)] ring-[1.5px] ring-gold-500/80 transition-[transform,background-color,box-shadow] duration-500 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 hover:bg-forest-800 hover:shadow-[0_24px_50px_-16px_rgb(20_38_31/0.75)] active:scale-95"
          >
            <span className="sr-only">{open ? 'Cerrar el asistente virtual' : 'Abrir el asistente virtual (demostración)'}</span>
            <span className="relative grid h-6 w-6 place-items-center">
              <span className={`absolute transition-all duration-300 ${open ? 'rotate-90 scale-50 opacity-0' : 'opacity-100'}`}>
                <BotIcon />
              </span>
              <svg className={`absolute h-5 w-5 transition-all duration-300 ${open ? 'opacity-100' : '-rotate-90 scale-50 opacity-0'}`} viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </button>
        </div>
      </div>

      <AssistantModal open={modal} onClose={closeModal} />
    </>
  );
}
