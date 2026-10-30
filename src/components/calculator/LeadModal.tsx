'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Arrow } from '@/components/ui/primitives';
import { buildLeadMessage, emptyContact, LIMITS, validateContact, type ContactField, type LeadContact } from '@/lib/contact/lead';
import { mailtoHref, postLead, TRANSPORT } from '@/lib/contact/transport';
import type { Proposal } from '@/lib/profitability/solutions';
import type { Analysis } from '@/lib/profitability/types';
import { asset, EMAIL } from '@/lib/site';
import { Checkbox, FieldError, TextField } from './fields';

type View = 'pitch' | 'form' | 'sent' | 'mailto';
type Status = 'idle' | 'sending' | 'error';

const SHARE_TEXT =
  'Autorizo a compartir con Trenchs Advisory los resultados de mi análisis financiero para recibir una propuesta de mejora adaptada a mi empresa.';

const ease = [0.16, 1, 0.3, 1] as const;
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]):not([tabindex="-1"]),select,textarea,summary,[tabindex]:not([tabindex="-1"])';

/**
 * Pop-up comercial: presenta la propuesta según el diagnóstico y, si la persona quiere, se transforma en un
 * formulario de contacto. Se monta una vez y conserva lo escrito aunque se cierre o falle el envío.
 */
export function LeadModal({ open, onClose, proposal, analysis }: { open: boolean; onClose: () => void; proposal: Proposal; analysis: Analysis }) {
  const [view, setView] = useState<View>('pitch');
  const [contact, setContact] = useState<LeadContact>(() => ({ ...emptyContact(), company: analysis.company.name }));
  const [privacy, setPrivacy] = useState(false);
  const [share, setShare] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const [honeypot, setHoneypot] = useState('');
  const formOpenedAt = useRef(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  // El mensaje se genera con la misma función que se usa al enviar: la vista previa es exactamente lo enviado.
  // Con datos válidos se muestran ya normalizados, tal y como saldrán; mientras tanto, con marcadores.
  const checkedNow = validateContact(contact, true);
  const shown = checkedNow.ok ? checkedNow.value : { ...contact, name: contact.name.trim() || '[tu nombre]', email: contact.email.trim() || '[tu correo]' };
  const message = buildLeadMessage(shown, share ? analysis : null);

  // Al abrir: guarda el foco, bloquea el scroll del fondo y lleva el foco al diálogo. Al cerrar, lo devuelve.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus(), 30);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
      returnFocus.current?.focus();
    };
  }, [open]);

  // Escape cierra; Tab no sale del diálogo.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
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
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Cada cambio de vista lleva el foco a su título.
  useEffect(() => {
    if (open) dialogRef.current?.querySelector<HTMLElement>('[data-autofocus]')?.focus();
    if (view === 'form' && !formOpenedAt.current) formOpenedAt.current = Date.now();
  }, [view, open]);

  const update = (patch: Partial<LeadContact>) => {
    setContact((c) => ({ ...c, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      for (const k of Object.keys(patch)) delete next[k as ContactField];
      return next;
    });
    if (status === 'error') setStatus('idle');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    const checked = validateContact(contact, privacy);
    if (!checked.ok) {
      setErrors(checked.errors);
      const first = (['name', 'email', 'phone', 'company', 'message', 'privacyAccepted'] as const).find((k) => checked.errors[k]);
      window.setTimeout(() => document.getElementById(first === 'privacyAccepted' ? 'lead-privacy' : `lead-${first}`)?.focus(), 0);
      return;
    }
    const finalMessage = buildLeadMessage(checked.value, share ? analysis : null);

    if (TRANSPORT === 'mailto') {
      // Sistema de contacto actual de la web: correo prellenado. No sabemos si se envía, así que no se confirma.
      setView('mailto');
      window.location.href = mailtoHref(finalMessage.subject, finalMessage.body);
      return;
    }

    setStatus('sending');
    const ok = await postLead({
      contact: checked.value,
      privacyAccepted: true,
      shareAnalysis: share,
      ...(share ? { analysis } : {}),
      website: honeypot,
      elapsedMs: Date.now() - formOpenedAt.current,
    });
    if (ok) {
      setStatus('idle');
      setView('sent');
    } else {
      setStatus('error');
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(`${message.subject}\n\n${message.body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  if (typeof document === 'undefined') return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 bg-forest-950/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
          <m.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-title"
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.5rem] bg-cream-50 text-ink shadow-[0_40px_80px_-30px_rgb(20_38_31/0.6)] sm:rounded-[1.5rem]"
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease }}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-cream-100 text-ink transition-colors hover:bg-cream-200"
            >
              <span className="sr-only">Cerrar</span>
              <svg className="h-4 w-4" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="overflow-y-auto overscroll-contain p-6 pt-8 sm:p-10">
              <AnimatePresence mode="wait" initial={false}>
                <m.div key={view} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease }}>
                  {view === 'pitch' && (
                    <Pitch proposal={proposal} onStart={() => setView('form')} onClose={onClose} />
                  )}
                  {view === 'form' && (
                    <form noValidate onSubmit={submit} className="space-y-5">
                      <Title kicker="Solicitud de contacto">Cuéntanos cómo contactarte</Title>
                      <p className="text-[0.92rem] text-ink-soft">No hace falta que expliques tu situación: si lo autorizas, adjuntamos el diagnóstico que acabas de obtener.</p>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <TextField id="lead-name" label="Nombre" autoComplete="name" maxLength={LIMITS.name} value={contact.name} error={errors.name} onChange={(name) => update({ name })} />
                        <TextField id="lead-company" label="Empresa" optional autoComplete="organization" maxLength={LIMITS.company} value={contact.company} error={errors.company} onChange={(company) => update({ company })} />
                        <TextField id="lead-email" label="Correo electrónico" type="email" autoComplete="email" inputMode="email" maxLength={LIMITS.email} value={contact.email} error={errors.email} onChange={(email) => update({ email })} />
                        <TextField id="lead-phone" label="Teléfono" optional type="tel" autoComplete="tel" inputMode="tel" maxLength={LIMITS.phone} value={contact.phone} error={errors.phone} onChange={(phone) => update({ phone })} />
                      </div>
                      <div>
                        <label htmlFor="lead-message" className="flex items-baseline justify-between text-[0.92rem] font-medium">
                          Mensaje adicional <span className="text-[0.78rem] font-normal text-ink-mute">Opcional</span>
                        </label>
                        <textarea
                          id="lead-message"
                          rows={3}
                          maxLength={LIMITS.message}
                          value={contact.message}
                          aria-invalid={errors.message ? true : undefined}
                          aria-describedby={errors.message ? 'lead-message-error' : undefined}
                          onChange={(e) => update({ message: e.target.value })}
                          className="mt-2 w-full rounded-xl border border-line bg-cream-50 px-4 py-3 text-[1rem] focus:border-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-900/15"
                        />
                        {errors.message && <FieldError id="lead-message-error">{errors.message}</FieldError>}
                      </div>
                      {/* Trampa para bots: invisible para personas y fuera del orden de tabulación. */}
                      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
                        <label htmlFor="lead-website">No rellenes este campo</label>
                        <input id="lead-website" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
                      </div>

                      <div className="space-y-4 rounded-xl border border-line p-4">
                        <Checkbox id="lead-share" checked={share} onChange={setShare}>
                          {SHARE_TEXT}
                        </Checkbox>
                        <Checkbox
                          id="lead-privacy"
                          checked={privacy}
                          error={errors.privacyAccepted}
                          onChange={(v) => {
                            setPrivacy(v);
                            if (v) setErrors((e) => ({ ...e, privacyAccepted: undefined }));
                          }}
                        >
                          He leído la{' '}
                          <a href={asset('/legal/privacidad/')} target="_blank" rel="noopener" className="underline underline-offset-2">
                            política de privacidad
                            <span className="sr-only"> (se abre en una pestaña nueva)</span>
                          </a>{' '}
                          y acepto que Trenchs Advisory trate mis datos de contacto para responder a esta solicitud.
                        </Checkbox>
                      </div>

                      <SharePreview share={share} subject={message.subject} body={message.body} />

                      {status === 'error' && (
                        <p role="alert" className="rounded-xl bg-loss/10 px-4 py-3 text-[0.9rem] text-loss">
                          Ha ocurrido un problema al enviar tu solicitud. Puedes volver a intentarlo.
                        </p>
                      )}

                      <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                        <button type="button" className="text-[0.9rem] font-medium text-ink-soft underline-offset-4 hover:underline" onClick={() => setView('pitch')}>
                          Volver
                        </button>
                        <button type="submit" className="btn justify-between" disabled={status === 'sending'} aria-busy={status === 'sending'}>
                          {status === 'sending' ? 'Enviando…' : TRANSPORT === 'mailto' ? 'Preparar y enviar por correo' : 'Enviar solicitud'}
                          <span className="btn__icon">
                            {status === 'sending' ? <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" /> : <Arrow />}
                          </span>
                        </button>
                      </div>
                      <p className="text-[0.78rem] leading-relaxed text-ink-mute">
                        Responsable: Trenchs Advisory. Finalidad: responder a tu solicitud. No cedemos tus datos a terceros salvo obligación legal. Puedes ejercer tus
                        derechos escribiendo a {EMAIL}.
                        {TRANSPORT === 'mailto' && ' Al enviar se abrirá tu programa de correo con la solicitud preparada; nos llegará cuando la envíes desde allí.'}
                      </p>
                    </form>
                  )}
                  {view === 'sent' && (
                    <Done title="¡Solicitud enviada correctamente!" onClose={onClose}>
                      Hemos recibido tu mensaje y la información que has autorizado compartir. Contactaremos contigo para estudiar cómo podemos ayudarte.
                    </Done>
                  )}
                  {view === 'mailto' && (
                    <div>
                      <Title kicker="Último paso">Envía la solicitud desde tu correo</Title>
                      <p className="mt-4 text-[0.95rem] text-ink-soft">
                        Hemos abierto tu programa de correo con la solicitud preparada para <strong className="font-medium text-ink">{EMAIL}</strong>. Nos llegará
                        cuando pulses «Enviar» en él: hasta entonces no hemos recibido nada.
                      </p>
                      <p className="mt-3 text-[0.9rem] text-ink-soft">Si no se ha abierto, copia el mensaje y envíalo desde tu correo habitual.</p>
                      <div className="mt-6 flex flex-wrap gap-3">
                        <a className="btn" href={mailtoHref(message.subject, message.body)}>
                          Abrir de nuevo el correo
                          <span className="btn__icon">
                            <Arrow />
                          </span>
                        </a>
                        <button type="button" className="btn btn--ghost" onClick={copyMessage}>
                          {copied ? 'Mensaje copiado' : 'Copiar mensaje'}
                        </button>
                      </div>
                      <span className="sr-only" role="status">
                        {copied ? 'Mensaje copiado al portapapeles' : ''}
                      </span>
                      <div className="mt-6 flex gap-5 text-[0.9rem]">
                        <button type="button" className="font-medium text-ink-soft underline-offset-4 hover:underline" onClick={() => setView('form')}>
                          Revisar mis datos
                        </button>
                        <button type="button" className="font-medium text-ink-soft underline-offset-4 hover:underline" onClick={onClose}>
                          Seguir explorando mis resultados
                        </button>
                      </div>
                    </div>
                  )}
                </m.div>
              </AnimatePresence>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Title({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div className="pr-10">
      <p className="eyebrow">{kicker}</p>
      <h2 id="lead-title" tabIndex={-1} data-autofocus className="mt-4 font-serif text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.08] tracking-tight outline-none">
        {children}
      </h2>
    </div>
  );
}

function Pitch({ proposal: p, onStart, onClose }: { proposal: Proposal; onStart: () => void; onClose: () => void }) {
  return (
    <div>
      <Title kicker={p.service}>{p.pitch.title}</Title>
      <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft">{p.pitch.text}</p>
      <ul className="mt-6 grid gap-2 sm:grid-cols-2">
        {p.solutions.slice(0, 4).map((s) => (
          <li key={s} className="flex gap-2.5 rounded-xl bg-cream-100 px-3.5 py-3 text-[0.88rem] text-ink-soft">
            <svg className="mt-[0.2rem] h-4 w-4 shrink-0 text-forest-600" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {s}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="button" className="btn justify-between" onClick={onStart}>
          {p.pitch.cta}
          <span className="btn__icon">
            <Arrow />
          </span>
        </button>
        <button type="button" className="btn btn--ghost justify-center" onClick={onClose}>
          Seguir explorando
        </button>
      </div>
    </div>
  );
}

function SharePreview({ share, subject, body }: { share: boolean; subject: string; body: string }) {
  return (
    <details className="group rounded-xl bg-cream-100 p-4 text-[0.88rem]">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
        <span>
          Ver qué información se compartirá
          <span className="mt-0.5 block text-[0.8rem] font-normal text-ink-mute">
            {share ? 'Contacto, diagnóstico, problemas detectados, soluciones propuestas, servicio recomendado y tu mensaje.' : 'Solo tus datos de contacto y tu mensaje. Ninguna cifra de tu análisis.'}
          </span>
        </span>
        <svg className="h-3 w-3 shrink-0 transition-transform group-open:rotate-90" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </summary>
      <div className="mt-3 max-h-72 overflow-auto rounded-lg border border-line bg-cream-50 p-3">
        <p className="text-[0.78rem] text-ink-mute">Asunto: {subject}</p>
        <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-[0.8rem] leading-relaxed text-ink">{body}</pre>
      </div>
    </details>
  );
}

function Done({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="text-center sm:py-4">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-900 text-gold-300">
        <svg className="h-6 w-6" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 id="lead-title" tabIndex={-1} data-autofocus className="mt-6 font-serif text-[2rem] leading-tight tracking-tight outline-none">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-[0.98rem] text-ink-soft">{children}</p>
      <button type="button" className="btn btn--ghost mt-8" onClick={onClose}>
        Seguir explorando mis resultados
      </button>
    </div>
  );
}
