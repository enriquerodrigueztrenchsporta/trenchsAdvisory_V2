'use client';

import { useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Arrow } from '@/components/ui/primitives';
import { emptyContact, LIMITS, mailtoHref, validateContact, type ContactField, type LeadContact } from '@/lib/contact/contact';
import { buildPymeMessage } from '@/lib/pyme-check/message';
import { pitchText, type Result } from '@/lib/pyme-check/scoring';
import { asset, EMAIL } from '@/lib/site';

type View = 'pitch' | 'form' | 'mailto';

const SHARE_TEXT = 'Autorizo a compartir con Trenchs Advisory los resultados de mi autodiagnóstico empresarial para recibir una propuesta personalizada.';

function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between text-[0.92rem] font-medium">
        {label}
        {optional && <span className="text-[0.78rem] font-normal text-ink-mute">Opcional</span>}
      </label>
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.82rem] text-loss">
          {error}
        </p>
      )}
    </div>
  );
}

const input = (error?: string) =>
  `w-full rounded-xl border bg-cream-50 px-4 py-3 text-[1rem] text-ink focus:outline-none focus:ring-2 ${
    error ? 'border-loss focus:ring-loss/20' : 'border-line focus:border-forest-900 focus:ring-forest-900/15'
  }`;

function Title({ kicker, children }: { kicker: string; children: ReactNode }) {
  return (
    <div className="pr-10">
      <p className="eyebrow">{kicker}</p>
      <h2 id="pc-modal-title" tabIndex={-1} data-autofocus className="mt-4 font-serif text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.08] tracking-tight outline-none">
        {children}
      </h2>
    </div>
  );
}

/**
 * Pop-up comercial de PYME Check: propuesta según el resultado y, si la persona quiere, formulario de contacto.
 * El envío reutiliza el sistema de la web (correo prellenado): no se da por enviado hasta que la persona lo envía.
 * Se monta una vez: lo escrito se conserva aunque se cierre.
 */
export function ContactModal({ open, onClose, result }: { open: boolean; onClose: () => void; result: Result }) {
  const [view, setView] = useState<View>('pitch');
  const [contact, setContact] = useState<LeadContact>(emptyContact);
  const [share, setShare] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [copied, setCopied] = useState(false);

  // El mensaje se genera con la misma función para la vista previa y el envío.
  const checked = validateContact(contact, true);
  const shown = checked.ok ? checked.value : { ...contact, name: contact.name.trim() || '[tu nombre]', email: contact.email.trim() || '[tu correo]' };
  const message = buildPymeMessage(shown, share ? result : null);
  const offers = result.opportunities.length ? result.opportunities.map((o) => o.offer) : ['Revisión periódica de indicadores y procesos.'];

  const update = (patch: Partial<LeadContact>) => {
    setContact((c) => ({ ...c, ...patch }));
    setErrors((e) => {
      const n = { ...e };
      for (const k of Object.keys(patch)) delete n[k as ContactField];
      return n;
    });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateContact(contact, privacy);
    if (!v.ok) {
      setErrors(v.errors);
      const first = (['name', 'email', 'phone', 'company', 'message', 'privacyAccepted'] as const).find((k) => v.errors[k]);
      window.setTimeout(() => document.getElementById(`pc-${first === 'privacyAccepted' ? 'privacy' : first}`)?.focus(), 0);
      return;
    }
    const final = buildPymeMessage(v.value, share ? result : null);
    setView('mailto');
    window.location.href = mailtoHref(final.subject, final.body);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${message.subject}\n\n${message.body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const described = (id: string, error?: string) => (error ? `${id}-error` : undefined);

  return (
    <Modal open={open} onClose={onClose} labelledBy="pc-modal-title" focusKey={view}>
      {view === 'pitch' && (
        <div>
          <Title kicker="PYME Check">Podemos ayudarte a mejorar tu negocio.</Title>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft">{pitchText(result)}</p>
          <p className="mt-6 text-[0.75rem] font-medium uppercase tracking-[0.14em] text-ink-mute">Soluciones que podemos desarrollar para tu empresa</p>
          <ul className="mt-3 grid gap-2">
            {offers.map((s) => (
              <li key={s} className="flex gap-2.5 rounded-xl bg-cream-100 px-4 py-3 text-[0.92rem] text-ink">
                <svg className="mt-[0.2rem] h-4 w-4 shrink-0 text-forest-600" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" className="btn justify-between" onClick={() => setView('form')}>
              Quiero mejorar mi empresa
              <span className="btn__icon">
                <Arrow />
              </span>
            </button>
            <button type="button" className="btn btn--ghost justify-center" onClick={onClose}>
              Seguir explorando resultados
            </button>
          </div>
        </div>
      )}

      {view === 'form' && (
        <form noValidate onSubmit={submit} className="space-y-5">
          <Title kicker="Solicitud de contacto">Cuéntanos cómo contactarte</Title>
          <p className="text-[0.92rem] text-ink-soft">No hace falta que expliques qué necesitas: si lo autorizas, adjuntamos tu diagnóstico y las soluciones propuestas.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="pc-name" label="Nombre" error={errors.name}>
              <input id="pc-name" autoComplete="name" maxLength={LIMITS.name} value={contact.name} aria-invalid={!!errors.name || undefined} aria-describedby={described('pc-name', errors.name)} onChange={(e) => update({ name: e.target.value })} className={input(errors.name)} />
            </Field>
            <Field id="pc-company" label="Empresa" optional error={errors.company}>
              <input id="pc-company" autoComplete="organization" maxLength={LIMITS.company} value={contact.company} aria-invalid={!!errors.company || undefined} aria-describedby={described('pc-company', errors.company)} onChange={(e) => update({ company: e.target.value })} className={input(errors.company)} />
            </Field>
            <Field id="pc-email" label="Email" error={errors.email}>
              <input id="pc-email" type="email" inputMode="email" autoComplete="email" maxLength={LIMITS.email} value={contact.email} aria-invalid={!!errors.email || undefined} aria-describedby={described('pc-email', errors.email)} onChange={(e) => update({ email: e.target.value })} className={input(errors.email)} />
            </Field>
            <Field id="pc-phone" label="Teléfono" optional error={errors.phone}>
              <input id="pc-phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={LIMITS.phone} value={contact.phone} aria-invalid={!!errors.phone || undefined} aria-describedby={described('pc-phone', errors.phone)} onChange={(e) => update({ phone: e.target.value })} className={input(errors.phone)} />
            </Field>
          </div>
          <Field id="pc-message" label="Mensaje adicional" optional error={errors.message}>
            <textarea id="pc-message" rows={3} maxLength={LIMITS.message} value={contact.message} aria-invalid={!!errors.message || undefined} aria-describedby={described('pc-message', errors.message)} onChange={(e) => update({ message: e.target.value })} className={input(errors.message)} />
          </Field>

          <div className="space-y-4 rounded-xl border border-line p-4 text-[0.9rem] leading-snug text-ink-soft">
            <label className="flex cursor-pointer items-start gap-3">
              <input id="pc-share" type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="mt-[0.15rem] h-5 w-5 shrink-0 accent-forest-900" />
              {SHARE_TEXT}
            </label>
            <div>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  id="pc-privacy"
                  type="checkbox"
                  checked={privacy}
                  aria-invalid={!!errors.privacyAccepted || undefined}
                  aria-describedby={described('pc-privacy', errors.privacyAccepted)}
                  onChange={(e) => {
                    setPrivacy(e.target.checked);
                    if (e.target.checked) setErrors((x) => ({ ...x, privacyAccepted: undefined }));
                  }}
                  className="mt-[0.15rem] h-5 w-5 shrink-0 accent-forest-900"
                />
                <span>
                  He leído la{' '}
                  <a href={asset('/legal/privacidad/')} target="_blank" rel="noopener" className="underline underline-offset-2">
                    política de privacidad
                    <span className="sr-only"> (se abre en una pestaña nueva)</span>
                  </a>{' '}
                  y acepto que Trenchs Advisory trate mis datos de contacto para responder a esta solicitud.
                </span>
              </label>
              {errors.privacyAccepted && (
                <p id="pc-privacy-error" className="mt-1.5 pl-8 text-[0.82rem] text-loss">
                  {errors.privacyAccepted}
                </p>
              )}
            </div>
          </div>

          <details className="group rounded-xl bg-cream-100 p-4 text-[0.88rem]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
              <span>
                Ver qué información se compartirá
                <span className="mt-0.5 block text-[0.8rem] font-normal text-ink-mute">
                  {share ? 'Tus datos de contacto, tu puntuación, la clasificación, las oportunidades, las soluciones y tu mensaje.' : 'Solo tus datos de contacto y tu mensaje. Nada de tu diagnóstico.'}
                </span>
              </span>
              <svg className="h-3 w-3 shrink-0 transition-transform group-open:rotate-90" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
            </summary>
            <div className="mt-3 max-h-64 overflow-auto rounded-lg border border-line bg-cream-50 p-3">
              <p className="text-[0.78rem] text-ink-mute">Asunto: {message.subject}</p>
              <pre className="mt-2 whitespace-pre-wrap break-words font-sans text-[0.8rem] leading-relaxed text-ink">{message.body}</pre>
            </div>
          </details>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="text-[0.9rem] font-medium text-ink-soft underline-offset-4 hover:underline" onClick={() => setView('pitch')}>
              Volver
            </button>
            <button type="submit" className="btn justify-between">
              Preparar y enviar por correo
              <span className="btn__icon">
                <Arrow />
              </span>
            </button>
          </div>
          <p className="text-[0.78rem] leading-relaxed text-ink-mute">
            Se abrirá tu programa de correo con la solicitud preparada para {EMAIL}; nos llegará cuando la envíes desde allí. Responsable: Trenchs Advisory.
            Finalidad: responder a tu solicitud.
          </p>
        </form>
      )}

      {view === 'mailto' && (
        <div>
          <Title kicker="Último paso">Envía la solicitud desde tu correo</Title>
          <p className="mt-4 text-[0.95rem] text-ink-soft">
            Hemos abierto tu programa de correo con la solicitud preparada para <strong className="font-medium text-ink">{EMAIL}</strong>. Nos llegará cuando
            pulses «Enviar» en él: hasta entonces no hemos recibido nada.
          </p>
          <p className="mt-3 text-[0.9rem] text-ink-soft">Si no se ha abierto, copia el mensaje y envíalo desde tu correo habitual.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a className="btn" href={mailtoHref(message.subject, message.body)}>
              Abrir de nuevo el correo
              <span className="btn__icon">
                <Arrow />
              </span>
            </a>
            <button type="button" className="btn btn--ghost" onClick={copy}>
              {copied ? 'Mensaje copiado' : 'Copiar mensaje'}
            </button>
          </div>
          <span className="sr-only" role="status">
            {copied ? 'Mensaje copiado al portapapeles' : ''}
          </span>
          <div className="mt-6 flex flex-wrap gap-5 text-[0.9rem]">
            <button type="button" className="font-medium text-ink-soft underline-offset-4 hover:underline" onClick={() => setView('form')}>
              Revisar mis datos
            </button>
            <button type="button" className="font-medium text-ink-soft underline-offset-4 hover:underline" onClick={onClose}>
              Seguir explorando resultados
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}
