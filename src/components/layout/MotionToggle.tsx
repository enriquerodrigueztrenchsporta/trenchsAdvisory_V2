'use client';

import { useMotionPrefs } from '@/components/motion/MotionProvider';

/** «Pausar animaciones» (v1): detiene todo el movimiento de la web, también el ligado al scroll (WCAG 2.2.2). */
export function MotionToggle() {
  const { paused, setPaused } = useMotionPrefs();
  return (
    <button
      type="button"
      aria-pressed={paused}
      onClick={() => setPaused(!paused)}
      className="inline-flex items-center gap-2 self-start rounded-full border border-cream-50/20 px-3.5 py-1.5 transition-colors hover:border-cream-50/50 hover:text-cream-50"
    >
      <span aria-hidden="true" className="flex h-2.5 w-2.5 items-center justify-center gap-[2px]">
        {paused ? (
          <span className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-current" />
        ) : (
          <>
            <span className="h-2.5 w-[3px] bg-current" />
            <span className="h-2.5 w-[3px] bg-current" />
          </>
        )}
      </span>
      {paused ? 'Reanudar animaciones' : 'Pausar animaciones'}
    </button>
  );
}
