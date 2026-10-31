'use client';

import { useState } from 'react';
import { LeadFormFields, MailtoStep, ModalTitle, openMail, useLeadForm } from '@/components/contact/LeadForm';
import { Modal } from '@/components/ui/Modal';
import { Arrow } from '@/components/ui/primitives';
import { buildPymeMessage } from '@/lib/pyme-check/message';
import { pitchText, type Result } from '@/lib/pyme-check/scoring';

type View = 'pitch' | 'form' | 'mailto';

const TITLE = 'pc-modal-title';
const SHARE_TEXT = 'Autorizo a compartir con Trenchs Advisory los resultados de mi autodiagnóstico empresarial para recibir una propuesta personalizada.';

/**
 * Pop-up comercial de PYME Check: propuesta según el resultado y, si la persona quiere, formulario de contacto.
 * Se monta una vez: lo escrito se conserva aunque se cierre.
 */
export function ContactModal({ open, onClose, result }: { open: boolean; onClose: () => void; result: Result }) {
  const [view, setView] = useState<View>('pitch');
  const [share, setShare] = useState(false);
  const form = useLeadForm();
  // El mensaje se genera con la misma función para la vista previa y el envío.
  const message = buildPymeMessage(form.preview(), share ? result : null);
  const offers = result.opportunities.length ? result.opportunities.map((o) => o.offer) : ['Revisión periódica de indicadores y procesos.'];

  const submit = () => {
    const contact = form.submit();
    if (!contact) return;
    setView('mailto');
    openMail(buildPymeMessage(contact, share ? result : null));
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy={TITLE} focusKey={view}>
      {view === 'pitch' && (
        <div>
          <ModalTitle id={TITLE} kicker="PYME Check">
            Podemos ayudarte a mejorar tu negocio.
          </ModalTitle>
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
        <div>
          <ModalTitle id={TITLE} kicker="Solicitud de contacto">
            Cuéntanos cómo contactarte
          </ModalTitle>
          <p className="mt-4 text-[0.92rem] text-ink-soft">No hace falta que expliques qué necesitas: si lo autorizas, adjuntamos tu diagnóstico y las soluciones propuestas.</p>
          <LeadFormFields
            form={form}
            message={message}
            previewNote={share ? 'Tus datos de contacto, tu puntuación, la clasificación, las oportunidades, las soluciones y tu mensaje.' : 'Solo tus datos de contacto y tu mensaje. Nada de tu diagnóstico.'}
            consents={
              <label className="flex cursor-pointer items-start gap-3">
                <input id="lead-share" type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} className="mt-[0.15rem] h-5 w-5 shrink-0 accent-forest-900" />
                {SHARE_TEXT}
              </label>
            }
            onSubmit={submit}
            onBack={() => setView('pitch')}
          />
        </div>
      )}

      {view === 'mailto' && <MailtoStep titleId={TITLE} message={message} onEdit={() => setView('form')} onClose={onClose} closeLabel="Seguir explorando resultados" />}
    </Modal>
  );
}
