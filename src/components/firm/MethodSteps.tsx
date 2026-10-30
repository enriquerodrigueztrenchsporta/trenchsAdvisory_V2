'use client';

import { m, useMotionValueEvent, useScroll, useSpring } from 'framer-motion';
import { useRef, useState } from 'react';
import { useStill } from '@/components/motion/MotionProvider';
import { pad } from '@/components/ui/primitives';
import { PHASES } from '@/content/firm';

/** F-08 · Las cinco fases en vertical; el carril se rellena con el scroll y marca las fases recorridas. */
export function MethodSteps() {
  const ref = useRef<HTMLOListElement>(null);
  const still = useStill();
  const [reached, setReached] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.65', 'end 0.65'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  useMotionValueEvent(scrollYProgress, 'change', (p) => setReached(Math.ceil(p * PHASES.length)));

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden="true" className="absolute bottom-6 left-[1.375rem] top-6 w-px bg-line">
        <m.span className="absolute inset-0 origin-top bg-forest-900" style={{ scaleY: still ? 1 : fill }} />
      </span>
      {PHASES.map((p, i) => {
        const on = still || i < reached || i === 0;
        return (
          <li key={p.name} className="relative grid grid-cols-[2.75rem_1fr] gap-6 pb-14 last:pb-0">
            <span
              className={`relative z-10 grid h-11 w-11 place-items-center rounded-full border font-serif text-[1.1rem] transition-colors duration-500 ${
                on ? 'border-forest-900 bg-forest-900 text-cream-50' : 'border-line bg-cream-50 text-ink-soft'
              }`}
            >
              {pad(i + 1)}
            </span>
            <div className="pt-1.5">
              <h3 className="font-serif text-[clamp(1.75rem,2.6vw,2.4rem)] leading-tight tracking-tight">{p.name}</h3>
              <p className="mt-3 max-w-[46ch] text-ink-soft">{p.goal}</p>
              <p className="mt-5 inline-flex items-center gap-3 rounded-full bg-cream-100 px-4 py-2 text-[0.92rem] font-medium text-forest-900">
                <span className="text-[0.68rem] uppercase tracking-[0.16em] text-gold-700">Resultado</span>
                {p.result}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
