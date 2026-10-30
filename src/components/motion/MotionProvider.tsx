'use client';

import { LazyMotion, MotionConfig } from 'framer-motion';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

// Funciones de animación cargadas aparte: no bloquean la primera pintura.
const loadFeatures = () => import('./features').then((m) => m.default);

type MotionState = { paused: boolean; reduced: boolean; setPaused: (paused: boolean) => void };

const MotionContext = createContext<MotionState>({ paused: false, reduced: false, setPaused: () => {} });

/**
 * Estado global del movimiento: preferencia del sistema (`prefers-reduced-motion`) y botón «Pausar animaciones»
 * del pie, que se guarda en localStorage.motion como en la v1. La clase `motion-paused` del <html> la pone ya el
 * script en línea del layout antes de pintar.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [paused, setPausedState] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setPausedState(document.documentElement.classList.contains('motion-paused'));
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const setPaused = (next: boolean) => {
    document.documentElement.classList.toggle('motion-paused', next);
    try {
      if (next) localStorage.setItem('motion', 'paused');
      else localStorage.removeItem('motion');
    } catch {}
    setPausedState(next);
  };

  return (
    <MotionContext.Provider value={{ paused, reduced, setPaused }}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion={paused ? 'always' : 'user'}>{children}</MotionConfig>
      </LazyMotion>
    </MotionContext.Provider>
  );
}

export const useMotionPrefs = () => useContext(MotionContext);

/** true si no debe haber movimiento (sistema o botón «Pausar animaciones»). */
export const useStill = () => {
  const { paused, reduced } = useMotionPrefs();
  return paused || reduced;
};
