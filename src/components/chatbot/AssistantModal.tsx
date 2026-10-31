'use client';

import { useState } from 'react';
import { Field, LeadFormFields, MailtoStep, ModalTitle, openMail, selectClass, useLeadForm } from '@/components/contact/LeadForm';
import { Modal } from '@/components/ui/Modal';
import { Arrow } from '@/components/ui/primitives';
import { buildAssistantMessage, FEATURES, isSector, SECTORS, SERVICE, type Sector } from '@/lib/chatbot/message';

type View = 'pitch' | 'form' | 'mailto';
const TITLE = 'ai-modal-title';

// Iconos de las cinco funcionalidades (trazo fino, como el resto de la web).
const ICONS = [
  'M4 5h12v8H9l-4 3v-3H4z M7 9h6', // atención: bocadillo
  'M3 5h14v10H3z M3 8h14 M6 6.5h.01', // web: ventana
  'M5 4h10v12H5z M8 8h4 M8 11h4', // solicitudes: documento
  'M6 7a2 2 0 1 0 0-.01 M14 13a2 2 0 1 0 0-.01 M7.5 8.5l5 3', // integraciones: nodos
  'M10 3v3 M10 14v3 M3 10h3 M14 10h3 M10 7a3 3 0 1 0 0 6a3 3 0 1 0 0-6', // automatización: engranaje
];

/**
 * Pop-up comercial del chatbot demostrativo: propuesta de asistentes de IA y formulario de contacto.
 * El mensaje escrito en el chat no llega aquí: la solicitud solo contiene lo que la persona rellena en el formulario.
 */
export function AssistantModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [view, setView] = useState<View>('pitch');
  const [sector, setSector] = useState<Sector | ''>('');
  const form = useLeadForm();
  const message = buildAssistantMessage(form.preview(), sector);

  const close = () => {
    onClose();
    // La siguiente demostración empieza otra vez por la propuesta; los datos del formulario se conservan.
    window.setTimeout(() => setView('pitch'), 400);
  };

  const submit = () => {
    const contact = form.submit();
    if (!contact) return;
    setView('mailto');
    openMail(buildAssistantMessage(contact, sector));
  };

  return (
    <Modal open={open} onClose={close} labelledBy={TITLE} focusKey={view}>
      {view === 'pitch' && (
        <div>
          <ModalTitle id={TITLE} kicker="Inteligencia artificial aplicada">
            ¿Imaginas este asistente trabajando para tu empresa?
          </ModalTitle>
          <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft">
            En Trenchs Advisory desarrollamos asistentes virtuales personalizados que pueden responder consultas de clientes, automatizar tareas y mejorar la
            atención de tu negocio.
          </p>
          <p className="mt-7 font-serif text-[1.3rem] leading-tight tracking-tight">Un asistente diseñado para las necesidades de tu empresa.</p>
          <ol className="mt-4 grid gap-2.5">
            {FEATURES.map((f, i) => (
              <li key={f.title} className="flex gap-4 rounded-2xl bg-cream-100 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest-900 text-gold-300">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d={ICONS[i]} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[0.95rem] font-medium text-ink">
                    {i + 1}. {f.title}
                  </span>
                  <span className="mt-0.5 block text-[0.88rem] leading-snug text-ink-soft">{f.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button type="button" className="btn justify-between" onClick={() => setView('form')}>
              Quiero un asistente para mi empresa
              <span className="btn__icon">
                <Arrow />
              </span>
            </button>
            <button type="button" className="btn btn--ghost justify-center" onClick={close}>
              Seguir explorando la web
            </button>
          </div>
        </div>
      )}

      {view === 'form' && (
        <div>
          <ModalTitle id={TITLE} kicker="Asistente de IA">
            Hablemos del asistente de IA para tu empresa
          </ModalTitle>
          <p className="mt-4 text-[0.95rem] text-ink-soft">Cuéntanos un poco sobre tu negocio y estudiaremos cómo desarrollar un asistente adaptado a tus necesidades.</p>
          <p className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full bg-forest-900/[0.07] px-3.5 py-1.5 text-[0.82rem] text-forest-900">
            <span className="font-medium">Servicio solicitado:</span> {SERVICE.replace(/\.$/, '')}
          </p>
          <LeadFormFields
            form={form}
            message={message}
            previewNote="Tus datos de contacto, el sector, el servicio solicitado y tu mensaje. Nada de lo que escribiste en el chat."
            extra={
              <Field id="lead-sector" label="Sector de actividad" optional>
                <div className="relative">
                  <select id="lead-sector" value={sector} onChange={(e) => setSector(isSector(e.target.value) ? e.target.value : '')} className={`${selectClass} pr-10 ${sector ? '' : 'text-ink-mute'}`}>
                    <option value="">Selecciona…</option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-mute" viewBox="0 0 12 12" aria-hidden="true">
                    <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </div>
              </Field>
            }
            onSubmit={submit}
            onBack={() => setView('pitch')}
          />
        </div>
      )}

      {view === 'mailto' && <MailtoStep titleId={TITLE} message={message} onEdit={() => setView('form')} onClose={close} closeLabel="Seguir explorando la web" />}
    </Modal>
  );
}
