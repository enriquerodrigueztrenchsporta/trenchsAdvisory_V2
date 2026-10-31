'use client';

import { useState, type ReactNode } from 'react';
import { Arrow } from '@/components/ui/primitives';
import { emptyContact, LIMITS, mailtoHref, validateContact, type ContactField, type LeadContact } from '@/lib/contact/contact';
import { asset, EMAIL } from '@/lib/site';

// Piezas comunes de los formularios de contacto de las herramientas (PYME Check, chatbot demostrativo).
// Envío: el sistema de contacto de la web, un correo prellenado (mailto:). La web no puede saber si se envía, así
// que nunca lo da por enviado.

export type Message = { subject: string; body: string };

/** Estado del formulario. Vive en el componente que lo usa para conservar lo escrito aunque se cierre el pop-up. */
export function useLeadForm() {
  const [contact, setContact] = useState<LeadContact>(emptyContact);
  const [privacy, setPrivacy] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});

  const update = (patch: Partial<LeadContact>) => {
    setContact((c) => ({ ...c, ...patch }));
    setErrors((e) => {
      const n = { ...e };
      for (const k of Object.keys(patch)) delete n[k as ContactField];
      return n;
    });
  };
  const acceptPrivacy = (v: boolean) => {
    setPrivacy(v);
    if (v) setErrors((e) => ({ ...e, privacyAccepted: undefined }));
  };
  /** Contacto normalizado si es válido; si no, el texto con marcadores, para la vista previa. */
  const preview = (): LeadContact => {
    const v = validateContact(contact, true);
    return v.ok ? v.value : { ...contact, name: contact.name.trim() || '[tu nombre]', email: contact.email.trim() || '[tu correo]' };
  };
  /** Valida todo; si hay errores los muestra y lleva el foco al primero. */
  const submit = (): LeadContact | null => {
    const v = validateContact(contact, privacy);
    if (v.ok) return v.value;
    setErrors(v.errors);
    const first = (['name', 'email', 'phone', 'company', 'message', 'privacyAccepted'] as const).find((k) => v.errors[k]);
    window.setTimeout(() => document.getElementById(`lead-${first === 'privacyAccepted' ? 'privacy' : first}`)?.focus(), 0);
    return null;
  };
  return { contact, update, privacy, acceptPrivacy, errors, preview, submit };
}
export type LeadFormState = ReturnType<typeof useLeadForm>;

const inputClass = (error?: string) =>
  `w-full rounded-xl border bg-cream-50 px-4 py-3 text-[1rem] text-ink focus:outline-none focus:ring-2 ${
    error ? 'border-loss focus:ring-loss/20' : 'border-line focus:border-forest-900 focus:ring-forest-900/15'
  }`;

export function Field({ id, label, optional, error, children }: { id: string; label: string; optional?: boolean; error?: string; children: ReactNode }) {
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

export const selectClass = `${inputClass()} appearance-none`;

/** Título de cada vista de un pop-up (recibe el foco al cambiar de vista). */
export function ModalTitle({ id, kicker, children }: { id: string; kicker: string; children: ReactNode }) {
  return (
    <div className="pr-10">
      <p className="eyebrow">{kicker}</p>
      <h2 id={id} tabIndex={-1} data-autofocus className="mt-4 font-serif text-[clamp(1.7rem,3.4vw,2.4rem)] leading-[1.08] tracking-tight outline-none">
        {children}
      </h2>
    </div>
  );
}

/**
 * Campos de contacto, casillas, vista previa exacta y botón de envío. `extra` va tras los datos de contacto (p. ej. un
 * selector) y `consents` antes de la casilla de privacidad (p. ej. una autorización para compartir resultados).
 */
export function LeadFormFields({
  form,
  message,
  previewNote,
  extra,
  consents,
  onSubmit,
  onBack,
}: {
  form: LeadFormState;
  message: Message;
  previewNote: string;
  extra?: ReactNode;
  consents?: ReactNode;
  onSubmit: () => void;
  onBack: () => void;
}) {
  const { contact, update, errors, privacy, acceptPrivacy } = form;
  const described = (id: string, error?: string) => (error ? `${id}-error` : undefined);
  const text = (id: keyof LeadContact, label: string, opts: { optional?: boolean; type?: string; autoComplete: string; inputMode?: 'email' | 'tel' }) => (
    <Field id={`lead-${id}`} label={label} optional={opts.optional} error={errors[id]}>
      <input
        id={`lead-${id}`}
        type={opts.type ?? 'text'}
        inputMode={opts.inputMode}
        autoComplete={opts.autoComplete}
        maxLength={LIMITS[id]}
        value={contact[id]}
        aria-invalid={!!errors[id] || undefined}
        aria-describedby={described(`lead-${id}`, errors[id])}
        onChange={(e) => update({ [id]: e.target.value })}
        className={inputClass(errors[id])}
      />
    </Field>
  );

  return (
    <form
      noValidate
      className="mt-6 space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {text('name', 'Nombre', { autoComplete: 'name' })}
        {text('company', 'Empresa', { optional: true, autoComplete: 'organization' })}
        {text('email', 'Correo electrónico', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
        {text('phone', 'Teléfono', { optional: true, type: 'tel', autoComplete: 'tel', inputMode: 'tel' })}
      </div>
      {extra}
      <Field id="lead-message" label="Mensaje adicional" optional error={errors.message}>
        <textarea
          id="lead-message"
          rows={3}
          maxLength={LIMITS.message}
          value={contact.message}
          aria-invalid={!!errors.message || undefined}
          aria-describedby={described('lead-message', errors.message)}
          onChange={(e) => update({ message: e.target.value })}
          className={inputClass(errors.message)}
        />
      </Field>

      <div className="space-y-4 rounded-xl border border-line p-4 text-[0.9rem] leading-snug text-ink-soft">
        {consents}
        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              id="lead-privacy"
              type="checkbox"
              checked={privacy}
              aria-invalid={!!errors.privacyAccepted || undefined}
              aria-describedby={described('lead-privacy', errors.privacyAccepted)}
              onChange={(e) => acceptPrivacy(e.target.checked)}
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
            <p id="lead-privacy-error" className="mt-1.5 pl-8 text-[0.82rem] text-loss">
              {errors.privacyAccepted}
            </p>
          )}
        </div>
      </div>

      <details className="group rounded-xl bg-cream-100 p-4 text-[0.88rem]">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium [&::-webkit-details-marker]:hidden">
          <span>
            Ver qué información se compartirá
            <span className="mt-0.5 block text-[0.8rem] font-normal text-ink-mute">{previewNote}</span>
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
        <button type="button" className="text-[0.9rem] font-medium text-ink-soft underline-offset-4 hover:underline" onClick={onBack}>
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
        Finalidad: responder a tu solicitud. Puedes ejercer tus derechos escribiendo a ese mismo correo.
      </p>
    </form>
  );
}

/** Abre el correo prellenado en el programa de correo de la persona. */
export const openMail = (m: Message) => {
  window.location.href = mailtoHref(m.subject, m.body);
};

/** Vista tras abrir el correo: no se da por enviado; se puede reabrir o copiar el mensaje. */
export function MailtoStep({ titleId, message, onEdit, onClose, closeLabel }: { titleId: string; message: Message; onEdit: () => void; onClose: () => void; closeLabel: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${message.subject}\n\n${message.body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div>
      <ModalTitle id={titleId} kicker="Último paso">
        Envía la solicitud desde tu correo
      </ModalTitle>
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
        <button type="button" className="font-medium text-ink-soft underline-offset-4 hover:underline" onClick={onEdit}>
          Revisar mis datos
        </button>
        <button type="button" className="font-medium text-ink-soft underline-offset-4 hover:underline" onClick={onClose}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
