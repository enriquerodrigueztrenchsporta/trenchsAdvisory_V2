'use client';

import { m, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useStill } from '@/components/motion/MotionProvider';
import { delay, pad } from '@/components/ui/primitives';
import { QUESTIONS_INTRO } from '@/content/firm';
import { QUESTIONS, SERVICES } from '@/content/services';
import { DataField } from './DataField';

// Áreas que responden a cada pregunta (services.ts: campo `questions`).
const AREAS = QUESTIONS.map((_, qi) => SERVICES.filter((s) => s.questions.includes(qi)));

/**
 * H-03 + H-04 · Cinco preguntas. Sustituye a las pestañas con avance automático de la v1 (no cumplían WCAG 2.2.2):
 * ahora el recorrido lo marca el scroll del usuario. Todo el contenido está siempre en el DOM y visible.
 */
export function QuestionsStory() {
  const list = useRef<HTMLOListElement>(null);
  const still = useStill();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: list, offset: ['start 0.6', 'end 0.6'] });
  const rail = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    setActive(Math.min(QUESTIONS.length - 1, Math.max(0, Math.floor(p * QUESTIONS.length))));
  });

  return (
    <section aria-labelledby="preguntas-titulo" className="on-dark grain relative bg-forest-900 text-cream-50">
      <div className="wrap section grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <p className="eyebrow" data-reveal>
              {QUESTIONS_INTRO.eyebrow}
            </p>
            <h2 id="preguntas-titulo" className="display mt-6" data-reveal style={delay(1)}>
              {QUESTIONS_INTRO.title}
            </h2>
            <p className="lead mt-6" data-reveal style={delay(2)}>
              {QUESTIONS_INTRO.lead}
            </p>

            {/* «Del dato a la decisión» (anime.js) y avance del recorrido. Decorativos: la información está en la lista. */}
            <DataField step={active} />
            <div aria-hidden="true" className="relative mt-4 hidden h-px w-[400px] bg-cream-50/15 lg:block">
              <m.span className="absolute inset-0 origin-left bg-gold-300" style={{ scaleX: still ? 1 : rail }} />
            </div>
          </div>
        </div>

        <ol ref={list} className="lg:col-span-7">
          {QUESTIONS.map((q, i) => {
            const on = still || i === active;
            return (
              <li
                key={q.q}
                className="border-t border-cream-50/15 py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[62vh] lg:flex-col lg:justify-center lg:py-16"
              >
                <div className="flex items-baseline gap-5">
                  <span className="num">{pad(i + 1)}</span>
                  <h3
                    className={`font-serif text-[clamp(2rem,4.4vw,3.75rem)] leading-[1.05] tracking-[-0.03em] transition-colors duration-700 ${
                      on ? 'text-cream-50' : 'text-cream-50 lg:text-forest-300'
                    }`}
                  >
                    {q.q}
                  </h3>
                </div>
                <dl
                  className={`mt-8 grid gap-6 pl-10 transition-transform duration-700 sm:grid-cols-2 ${
                    on ? 'translate-y-0' : 'lg:translate-y-2'
                  }`}
                >
                  <div>
                    <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-forest-300">Disciplina</dt>
                    <dd className="mt-2 text-[1.05rem] text-cream-50">{q.discipline}</dd>
                  </div>
                  <div>
                    <dt className="text-[0.72rem] font-medium uppercase tracking-[0.16em] text-forest-300">Entregable típico</dt>
                    <dd className="mt-2 text-[1.05rem] text-cream-50">{q.deliverable}</dd>
                  </div>
                </dl>
                <ul className="mt-7 flex flex-wrap gap-2 pl-10">
                  {AREAS[i].map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/servicios/${s.slug}`}
                        className="inline-flex items-center gap-2 rounded-full border border-cream-50/20 px-4 py-2 text-[0.85rem] text-cream-50/90 transition-colors hover:border-gold-300 hover:text-gold-300"
                      >
                        {s.name}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
