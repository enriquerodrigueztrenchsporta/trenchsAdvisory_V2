'use client';

import { useEffect, useRef, useState } from 'react';
import { useStill } from '@/components/motion/MotionProvider';

/**
 * «Del dato a la decisión»: 60 puntos de datos que se reorganizan con anime.js según la pregunta activa.
 *   1 ¿Qué está ocurriendo?   → se ordenan en barras (cuadro de mando)
 *   2 ¿Por qué está ocurriendo? → se resaltan las barras que explican la desviación
 *   3 ¿Qué ocurrirá?           → trazan una tendencia que se prolonga con un margen de incertidumbre
 *   4 ¿Qué decisión tomar?     → se agrupan en dos alternativas y se elige una
 *   5 ¿Cómo ejecutarla?        → fluyen por la curva del logotipo hasta el objetivo
 * Decorativo (aria-hidden): la información está en la lista de preguntas. anime.js solo se descarga en escritorio y
 * con movimiento permitido; sin movimiento, los puntos se colocan sin animación.
 */

const W = 400;
const H = 250;
const N = 60;
const GRID = [10, 6];
const C = { base: '#9db5ac', gold: '#d4b778', cream: '#f5f3ee' };

type Dot = { x: number; y: number; color: string; opacity: number; scale: number };

// Pseudoaleatorio con semilla: mismas posiciones en servidor y cliente.
let seed = 11;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const SCATTER: Dot[] = Array.from({ length: N }, () => ({
  x: 20 + rand() * (W - 40),
  y: 20 + rand() * (H - 40),
  color: C.base,
  opacity: 0,
  scale: 0.4,
}));

const BARS = [6, 10, 8, 12, 10, 14];
const barLayout = (highlight: number[] = []): Dot[] => {
  const dots: Dot[] = [];
  BARS.forEach((count, b) => {
    for (let j = 0; j < count; j++) {
      const on = highlight.includes(b);
      dots.push({
        x: 48 + b * 61 + (j % 2 ? 7 : -7),
        y: H - 22 - Math.floor(j / 2) * 15,
        color: on ? C.gold : C.base,
        opacity: highlight.length && !on ? 0.3 : 1,
        scale: on ? 1.15 : 1,
      });
    }
  });
  return dots;
};

// Deja libre la franja superior (etiqueta y contador).
const trend = (t: number) => H - 36 - t * 118 + Math.sin(t * 11) * 10;
const forecastLayout = (): Dot[] =>
  Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const future = i >= 40;
    const spread = future ? (i - 39) * 1.5 * (i % 2 ? 1 : -1) : 0;
    return { x: 24 + t * (W - 48), y: trend(t) + spread, color: future ? C.gold : C.base, opacity: future ? 0.75 : 1, scale: future ? 0.8 : 1 };
  });

// Dos grupos en espiral (girasol); se elige el segundo.
const decisionLayout = (): Dot[] =>
  Array.from({ length: N }, (_, i) => {
    const second = i % 2 === 1;
    const k = Math.floor(i / 2);
    const r = 6.2 * Math.sqrt(k + 0.5);
    const a = k * 2.39996;
    return {
      x: (second ? 292 : 108) + r * Math.cos(a),
      y: H / 2 + r * Math.sin(a),
      color: second ? C.gold : C.base,
      opacity: second ? 1 : 0.3,
      scale: second ? 1.1 : 0.9,
    };
  });

// Curva del corte del logotipo, de arriba a la izquierda al objetivo abajo a la derecha.
const bezier = (t: number, p0: number, p1: number, p2: number, p3: number) =>
  (1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3;
const executionLayout = (): Dot[] =>
  Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    return {
      x: bezier(t, 24, 230, 150, 360),
      y: bezier(t, 62, 62, 220, 205),
      color: t > 0.82 ? C.gold : t > 0.5 ? C.cream : C.base,
      opacity: 0.45 + t * 0.55,
      scale: i === N - 1 ? 2.2 : 0.75 + t * 0.4,
    };
  });

const LAYOUTS: Dot[][] = [barLayout(), barLayout([2, 5]), forecastLayout(), decisionLayout(), executionLayout()];
const FROM = ['center', 'center', 'first', 'center', 'first'] as const;
const LABELS = ['Cuadro de mando', 'Causas', 'Previsión', 'Alternativas', 'Ejecución'];

type Anime = typeof import('animejs');

export function DataField({ step }: { step: number }) {
  const stage = useRef<HTMLDivElement>(null);
  const anime = useRef<Anime | null>(null);
  const shown = useRef(false);
  const [ready, setReady] = useState(false);
  const still = useStill();

  // Carga anime.js solo en escritorio.
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1024px)').matches) return;
    let cancelled = false;
    import('animejs').then((mod) => {
      if (cancelled) return;
      anime.current = mod;
      setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const root = stage.current;
    const a = anime.current;
    if (!ready || !root || !a) return;
    const dots = root.querySelectorAll<HTMLElement>('[data-dot]');
    const L = LAYOUTS[step] ?? LAYOUTS[0];
    const first = !shown.current;
    shown.current = true;
    const params = {
      x: (_?: unknown, i = 0) => L[i].x,
      y: (_?: unknown, i = 0) => L[i].y,
      scale: (_?: unknown, i = 0) => L[i].scale,
      opacity: (_?: unknown, i = 0) => L[i].opacity,
      backgroundColor: (_?: unknown, i = 0) => L[i].color,
    };
    if (still) {
      a.utils.set(dots, params);
      return;
    }
    a.animate(dots, {
      ...params,
      duration: first ? 1400 : 1100,
      ease: 'outExpo',
      delay: a.stagger(first ? 22 : 14, { grid: GRID, from: FROM[step] ?? 'center' }),
    });
  }, [step, ready, still]);

  return (
    <div aria-hidden="true" className="relative mt-8 hidden lg:block">
      <div ref={stage} className="relative overflow-hidden rounded-[1.25rem] border border-cream-50/10 bg-forest-950/40" style={{ width: W, height: H }}>
        {/* Guías de cada escena (solo trazos, sin datos). */}
        <svg className="absolute inset-0" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" aria-hidden="true">
          <line x1="20" x2={W - 20} y1={H - 12} y2={H - 12} stroke={C.base} strokeOpacity={step <= 1 ? 0.3 : 0} className="transition-[stroke-opacity] duration-700" />
          <line
            x1={24 + (40 / (N - 1)) * (W - 48)}
            x2={24 + (40 / (N - 1)) * (W - 48)}
            y1="16"
            y2={H - 16}
            stroke={C.gold}
            strokeDasharray="3 5"
            strokeOpacity={step === 2 ? 0.6 : 0}
            className="transition-[stroke-opacity] duration-700"
          />
          <circle cx="292" cy={H / 2} r="64" stroke={C.gold} strokeOpacity={step === 3 ? 0.5 : 0} className="transition-[stroke-opacity] duration-700" />
          <circle cx="360" cy="205" r="16" stroke={C.gold} strokeOpacity={step === 4 ? 0.6 : 0} className="transition-[stroke-opacity] duration-700" />
        </svg>
        {SCATTER.map((d, i) => (
          <span
            key={i}
            data-dot
            className="absolute left-0 top-0 -ml-[3.5px] -mt-[3.5px] h-[7px] w-[7px] rounded-full"
            style={{ transform: `translate(${d.x}px, ${d.y}px) scale(${d.scale})`, opacity: d.opacity, backgroundColor: d.color }}
          />
        ))}
        <span className="absolute left-4 top-3 text-[0.68rem] font-medium uppercase tracking-[0.16em] text-forest-300">{LABELS[step]}</span>
        <span className="absolute right-4 top-2.5 font-serif text-[1.1rem] text-gold-300">
          {String(step + 1).padStart(2, '0')}
          <span className="text-[0.8rem] text-cream-50/60"> / 05</span>
        </span>
      </div>
    </div>
  );
}
