'use client';

import { AnimatePresence, m } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Arrow } from '@/components/ui/primitives';
import { QUESTIONS } from '@/lib/pyme-check/questions';
import { emptyAnswers, evaluate, isComplete, type Answers } from '@/lib/pyme-check/scoring';
import { ContactModal } from './ContactModal';
import { QuestionStep } from './QuestionStep';
import { Results } from './Results';

const ease = [0.16, 1, 0.3, 1] as const;
const TOTAL = QUESTIONS.length;

/**
 * PYME Check: cinco preguntas, una cada vez, y el panel de resultados. Todo en memoria (sin localStorage ni URL);
 * nada sale del navegador salvo que la persona envíe la solicitud de contacto.
 */
export function PymeCheck() {
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [step, setStep] = useState(0); // 0..4 preguntas; TOTAL = resultados
  const [dir, setDir] = useState(1);
  const [error, setError] = useState<string>();
  const [modal, setModal] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const moved = useRef(false);

  const result = useMemo(() => (isComplete(answers) && step === TOTAL ? evaluate(answers) : null), [answers, step]);

  // Al cambiar de paso: foco al título nuevo y la vista vuelve al inicio del cuestionario si se había desplazado.
  useEffect(() => {
    if (!moved.current) return;
    // El paso nuevo aparece tras la transición de salida del anterior: se espera a que exista para enfocarlo.
    const id = step === TOTAL ? 'pc-result' : 'pc-question';
    let tries = 0;
    const t = window.setInterval(() => {
      const el = document.getElementById(id);
      if (el?.closest('[data-step]')?.getAttribute('data-step') === String(step)) el.focus({ preventScroll: true });
      if (document.activeElement === el || ++tries > 20) window.clearInterval(t);
    }, 60);
    const top = topRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0 || top > window.innerHeight * 0.5) topRef.current?.scrollIntoView({ block: 'start' });
    return () => window.clearInterval(t);
  }, [step]);

  const go = (next: number) => {
    moved.current = true;
    setDir(next > step ? 1 : -1);
    setError(undefined);
    setStep(next);
  };

  const next = () => {
    if (answers[step] === null) {
      setError('Elige una respuesta para continuar.');
      return;
    }
    go(step + 1);
  };

  const restart = () => {
    setAnswers(emptyAnswers());
    go(0);
  };

  const openModal = useCallback(() => setModal(true), []);
  const closeModal = useCallback(() => setModal(false), []);
  const answered = answers.filter((a) => a !== null).length;
  const progress = step === TOTAL ? 100 : (step / TOTAL) * 100;

  return (
    <section id="cuestionario" aria-label="Cuestionario PYME Check" className="section !pt-12 md:!pt-16">
      <div ref={topRef} className="wrap max-w-5xl scroll-mt-24">
        {/* Progreso */}
        <div>
          <div className="flex items-center justify-between text-[0.82rem] text-ink-mute">
            <span>{step === TOTAL ? 'Diagnóstico completado' : `Pregunta ${step + 1} de ${TOTAL}`}</span>
            <span className="tabular-nums">
              {answered}/{TOTAL} respondidas
            </span>
          </div>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-cream-200"
            role="progressbar"
            aria-label="Avance del cuestionario"
            aria-valuemin={0}
            aria-valuemax={TOTAL}
            aria-valuenow={step === TOTAL ? TOTAL : step}
            aria-valuetext={step === TOTAL ? 'Completado' : `Pregunta ${step + 1} de ${TOTAL}`}
          >
            <m.div className="h-full rounded-full bg-forest-900" initial={false} animate={{ width: `${progress}%` }} transition={{ duration: 0.6, ease }} />
          </div>
          <ol className="mt-3 flex gap-1.5" aria-hidden="true">
            {QUESTIONS.map((q, i) => (
              <li key={q.area} className={`h-1 flex-1 rounded-full transition-colors duration-500 ${answers[i] !== null ? 'bg-gold-500' : 'bg-cream-200'}`} />
            ))}
          </ol>
        </div>

        <div className="mt-10 overflow-hidden">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <m.div key={step} data-step={step} initial={{ opacity: 0, x: dir * 32 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: dir * -32 }} transition={{ duration: 0.35, ease }}>
              {step < TOTAL ? (
                <div className="rounded-[1.5rem] border border-line bg-cream-100 p-6 md:p-10">
                  <QuestionStep
                    question={QUESTIONS[step]}
                    value={answers[step]}
                    error={error}
                    onChange={(v) => {
                      setAnswers((a) => a.map((x, i) => (i === step ? v : x)) as Answers);
                      setError(undefined);
                    }}
                  />
                  <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
                    {step > 0 ? (
                      <button type="button" onClick={() => go(step - 1)} className="btn btn--ghost justify-center">
                        <Arrow className="h-3.5 w-3.5 rotate-180" />
                        Anterior
                      </button>
                    ) : (
                      <span />
                    )}
                    <button type="button" onClick={next} className="btn justify-between">
                      {step === TOTAL - 1 ? 'Ver mi diagnóstico' : 'Siguiente'}
                      <span className="btn__icon">
                        <Arrow />
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                result && <Results result={result} onContact={openModal} onRestart={restart} />
              )}
            </m.div>
          </AnimatePresence>
        </div>
      </div>
      {result && <ContactModal open={modal} onClose={closeModal} result={result} />}
    </section>
  );
}
