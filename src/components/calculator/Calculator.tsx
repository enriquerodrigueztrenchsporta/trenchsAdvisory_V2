'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Arrow } from '@/components/ui/primitives';
import { diagnose } from '@/lib/profitability/diagnosis';
import { computeMetrics } from '@/lib/profitability/engine';
import { NEUTRAL, type Adjustments } from '@/lib/profitability/scenarios';
import { proposalFor } from '@/lib/profitability/solutions';
import type { Analysis, FinancialKey } from '@/lib/profitability/types';
import { emptyCompany, emptyFinancials, validateCompany, validateFinancials, type CompanyDraft, type Errors, type FinancialDraft } from '@/lib/profitability/validation';
import { Dashboard } from './Dashboard';
import { DiagnosisPanel } from './DiagnosisPanel';
import { LeadModal } from './LeadModal';
import { Simulator } from './Simulator';
import { StepCompany, type CompanyErrors } from './StepCompany';
import { StepFinancials } from './StepFinancials';

const STEPS = [
  { title: 'Información de la empresa', lead: 'Unos datos de contexto. Ninguno te identifica y el nombre es opcional.' },
  { title: 'Información financiera', lead: 'Importes mensuales sin IVA. Pensado para responder sin formación financiera.' },
  { title: 'Diagnóstico financiero', lead: 'Tus indicadores principales y cómo se reparten ingresos y costes.' },
  { title: 'Simulador de escenarios', lead: 'Cambia volumen, costes o personal y mira el efecto al momento. Tus datos originales no cambian.' },
  { title: 'Interpretación y soluciones', lead: 'Qué dicen tus cifras y qué podríamos hacer juntos.' },
];
const ease = [0.16, 1, 0.3, 1] as const;

/**
 * Calculadora de Rentabilidad Empresarial: formulario guiado en cinco pasos.
 * Todo el estado vive en memoria (sin localStorage, sin URL, sin analítica): al cerrar la pestaña desaparece.
 * Los cálculos se hacen en el navegador; solo se envía algo si la persona lo pide desde el pop-up de contacto.
 */
export function Calculator() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [company, setCompany] = useState<CompanyDraft>(emptyCompany);
  const [financials, setFinancials] = useState<FinancialDraft>(emptyFinancials);
  const [companyErrors, setCompanyErrors] = useState<CompanyErrors>({});
  const [financialErrors, setFinancialErrors] = useState<Errors<FinancialKey>>({});
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [adjustments, setAdjustments] = useState<Adjustments>(NEUTRAL);
  const [target, setTarget] = useState('');
  const [targetError, setTargetError] = useState<string | undefined>();
  const [modal, setModal] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const metrics = useMemo(() => (analysis ? computeMetrics(analysis.inputs) : null), [analysis]);
  const diagnosis = useMemo(() => (analysis && metrics ? diagnose(analysis.inputs, metrics) : null), [analysis, metrics]);
  const proposal = diagnosis ? proposalFor(diagnosis.kind) : null;

  // Al cambiar de paso: el foco va al título del paso y la vista vuelve al inicio de la calculadora.
  useEffect(() => {
    if (!moved.current) return;
    headingRef.current?.focus({ preventScroll: true });
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.4) topRef.current?.scrollIntoView({ block: 'start' });
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setDir(next > step ? 1 : -1);
    setStep(next);
  };

  // Cualquier cambio en los datos invalida el análisis hasta volver a validarlos.
  const editCompany = (patch: Partial<CompanyDraft>) => {
    setCompany((c) => ({ ...c, ...patch }));
    setCompanyErrors((e) => {
      const n = { ...e };
      for (const k of Object.keys(patch)) delete n[k as keyof CompanyDraft];
      if ('periodKind' in patch) delete n.month, delete n.year;
      return n;
    });
    setAnalysis(null);
  };
  const editFinancials = (patch: Partial<FinancialDraft>) => {
    setFinancials((f) => ({ ...f, ...patch }));
    setAnalysis(null);
  };

  const focusFirstError = (ids: string[]) => window.setTimeout(() => document.getElementById(ids[0])?.focus(), 0);

  const next = () => {
    if (step === 0) {
      const r = validateCompany(company);
      if (!r.ok) {
        setCompanyErrors(r.errors);
        const order = ['sector', 'employees', 'periodKind', 'month', 'year', 'name'] as const;
        const first = order.find((k) => r.errors[k]);
        if (first) focusFirstError([first === 'periodKind' ? 'period-month' : first === 'name' ? 'companyName' : first]);
        return;
      }
      go(1);
    } else if (step === 1) {
      const c = validateCompany(company);
      const f = validateFinancials(financials);
      if (!f.ok) {
        setFinancialErrors(f.errors);
        focusFirstError(Object.keys(f.errors));
        return;
      }
      if (!c.ok) return go(0);
      setAnalysis({ company: c.value, inputs: f.value });
      go(2);
    } else if (step < STEPS.length - 1) {
      go(step + 1);
    }
  };

  const openModal = useCallback(() => setModal(true), []);
  const closeModal = useCallback(() => setModal(false), []);
  const unlocked = (i: number) => i <= 1 || analysis !== null;
  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <section aria-labelledby="calc-step-title" className="section !pt-12 md:!pt-16">
      <div ref={topRef} className="wrap scroll-mt-24">
        <p className="lead !max-w-3xl">Introduce los datos básicos de tu negocio y obtén un diagnóstico orientativo de tu situación económica.</p>

        {/* Progreso */}
        <nav aria-label="Pasos de la calculadora" className="mt-10">
          <div className="flex items-center justify-between text-[0.8rem] text-ink-mute">
            <span>
              Paso {step + 1} de {STEPS.length}
            </span>
            <span className="tabular-nums">{Math.round(progress)} %</span>
          </div>
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-cream-200" role="progressbar" aria-label="Avance" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-valuetext={`Paso ${step + 1} de ${STEPS.length}`}>
            <m.div className="h-full rounded-full bg-forest-900" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease }} />
          </div>
          <ol className="mt-4 grid grid-cols-5 gap-2">
            {STEPS.map((s, i) => {
              const current = i === step;
              const done = i < step || (i <= 1 && analysis !== null && i !== step);
              return (
                <li key={s.title}>
                  <button
                    type="button"
                    disabled={!unlocked(i)}
                    aria-current={current ? 'step' : undefined}
                    onClick={() => go(i)}
                    className={`group flex w-full flex-col items-start gap-2 rounded-xl p-2 text-left transition-colors enabled:hover:bg-cream-100 disabled:cursor-not-allowed ${current ? 'bg-cream-100' : ''}`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-[0.75rem] font-medium tabular-nums transition-colors ${
                        current ? 'bg-forest-900 text-cream-50' : done ? 'bg-gold-300 text-forest-950' : unlocked(i) ? 'border border-line text-ink-soft' : 'border border-line text-ink-mute/60'
                      }`}
                    >
                      {done && !current ? (
                        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </span>
                    <span className={`hidden text-[0.8rem] leading-tight md:block ${current ? 'font-medium text-ink' : unlocked(i) ? 'text-ink-soft' : 'text-ink-mute/70'}`}>{s.title}</span>
                    <span className="sr-only md:hidden">{s.title}</span>
                    {!unlocked(i) && <span className="sr-only"> (disponible tras completar la información financiera)</span>}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="mt-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <m.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -32 }}
              transition={{ duration: 0.35, ease }}
            >
              <header className="mb-8 max-w-3xl">
                <p className="num">{String(step + 1).padStart(2, '0')}</p>
                <h2 id="calc-step-title" ref={headingRef} tabIndex={-1} className="title mt-3 outline-none">
                  {STEPS[step].title}
                </h2>
                <p className="mt-2 text-[0.98rem] text-ink-soft">{STEPS[step].lead}</p>
              </header>

              {step === 0 && <StepCompany draft={company} errors={companyErrors} onChange={editCompany} />}
              {step === 1 && (
                <StepFinancials
                  draft={financials}
                  errors={financialErrors}
                  onChange={editFinancials}
                  onError={(k, e) => setFinancialErrors((prev) => ({ ...prev, [k]: e }))}
                />
              )}
              {step === 2 && analysis && metrics && <Dashboard inputs={analysis.inputs} metrics={metrics} />}
              {step === 3 && analysis && metrics && (
                <Simulator
                  inputs={analysis.inputs}
                  metrics={metrics}
                  adjustments={adjustments}
                  onAdjust={setAdjustments}
                  target={target}
                  onTarget={(v) => {
                    setTarget(v);
                    setTargetError(undefined);
                  }}
                  targetError={targetError}
                  onTargetError={setTargetError}
                />
              )}
              {step === 4 && diagnosis && proposal && <DiagnosisPanel diagnosis={diagnosis} proposal={proposal} onContact={openModal} />}
            </m.div>
          </AnimatePresence>
        </div>

        {/* Navegación entre pasos */}
        <div className="mt-12 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          {step > 0 ? (
            <button type="button" onClick={() => go(step - 1)} className="btn btn--ghost justify-center">
              <Arrow className="h-3.5 w-3.5 rotate-180" />
              Anterior
            </button>
          ) : (
            <span />
          )}
          {step < STEPS.length - 1 && (
            <button type="button" onClick={next} className="btn justify-between">
              {step === 1 ? 'Ver mi diagnóstico' : `Siguiente: ${STEPS[step + 1].title.toLowerCase()}`}
              <span className="btn__icon">
                <Arrow />
              </span>
            </button>
          )}
        </div>

        <p className="mt-6 flex items-start gap-2 text-[0.8rem] text-ink-mute">
          <svg className="mt-[0.15rem] h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" />
          </svg>
          Los cálculos se hacen en tu navegador. No guardamos ni enviamos tus cifras: solo nos llegan si decides compartirlas al contactar con nosotros.
        </p>
      </div>

      {analysis && proposal && <LeadModal open={modal} onClose={closeModal} proposal={proposal} analysis={analysis} />}
    </section>
  );
}
