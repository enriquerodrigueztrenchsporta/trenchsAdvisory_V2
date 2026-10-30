'use client';

import { useMotionValueEvent, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { useStill } from '@/components/motion/MotionProvider';
import { DiagnosisButton, SectionHead, TextLink, pad } from '@/components/ui/primitives';
import { METHOD_INTRO, PHASES } from '@/content/firm';

/**
 * H-05 · Método contado con el scroll (al estilo de animejs.com): una línea de tiempo de anime.js que avanza y
 * retrocede con el scroll. Textos de la v1 para la portada: fase y objetivo (el resultado de cada fase está en
 * /firma/metodo, para no repetir contenido entre páginas).
 *   1 Diagnóstico      una lupa recorre la información dispersa y marca los puntos críticos
 *   2 Diseño           los puntos se ordenan en un modelo y se conectan
 *   3 Construcción     las seis piezas del logotipo se ensamblan
 *   4 Adopción         los puntos orbitan alrededor de la solución
 *   5 Mejora continua  la órbita gira y se cierra un ciclo
 * El texto está siempre en el HTML. anime.js se descarga cuando la sección se acerca. Sin movimiento (sistema o
 * «Pausar animaciones»): lista estática y la ilustración en su estado final.
 */

const S = 480;
const CX = S / 2;
const N = 24;
const CRITICAL = [3, 8, 14, 19];

let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const SCATTER = Array.from({ length: N }, () => ({ x: 50 + rand() * (S - 100), y: 50 + rand() * (S - 100) }));
const GRID = Array.from({ length: N }, (_, i) => ({ x: 90 + (i % 6) * 60, y: 150 + Math.floor(i / 6) * 60 }));
const ORBIT = Array.from({ length: N }, (_, i) => {
  const a = (i / N) * Math.PI * 2 - Math.PI / 2;
  return { x: CX + 172 * Math.cos(a), y: CX + 172 * Math.sin(a) };
});
const EDGES: [number, number][] = [];
for (let i = 0; i < N; i++) {
  if (i % 6 < 5) EDGES.push([i, i + 1]);
  if (i + 6 < N) EDGES.push([i, i + 6]);
}
// Recorrido de la lupa por los puntos críticos.
const LENS_PATH = CRITICAL.map((i) => SCATTER[i]);

// Piezas del logotipo (trazado original) y desde dónde llegan al ensamblarse.
const LOGO = [
  { d: 'M0 0H247C247 60 262 110 290 210C310 290 318 340 322 387H0Z', dx: -260, dy: -200, light: false },
  { d: 'M345 0H648V387H419C412 330 400 280 385 210C360 110 345 60 345 0Z', dx: 260, dy: -220, light: false },
  { d: 'M0 432H327V485H0Z', dx: -300, dy: 40, light: false },
  { d: 'M424 432H648V485H424Z', dx: 300, dy: 60, light: false },
  { d: 'M0 529H325L315 648H0Z', dx: -220, dy: 260, light: true },
  { d: 'M422 529H648V648H412Z', dx: 240, dy: 240, light: true },
];
const LOGO_SIZE = 168;

const COLORS = { ink: '#1f3a33', mid: '#7a9e91', gold: '#b08a3e', light: '#3e6b5e' };
const SEG = 1000; // duración de cada fase en la línea de tiempo
// Cada tramo de scroll corresponde a SEG ms de la línea de tiempo (su duración real puede ser menor).
const at = (p: number, t: Timeline) => t.seek(Math.min(p * SEG * PHASES.length, t.duration));

type Timeline = ReturnType<typeof import('animejs').createTimeline>;

export function MethodStory() {
  const track = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const tl = useRef<Timeline | null>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);
  const still = useStill();
  const stillRef = useRef(still);

  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    progress.current = p;
    setActive(Math.min(PHASES.length - 1, Math.floor(p * PHASES.length)));
    if (tl.current) at(p, tl.current);
  });

  // Carga anime.js cuando la sección se acerca y construye la línea de tiempo (en pausa: la mueve el scroll).
  useEffect(() => {
    const root = track.current;
    if (!root) return;
    let cancelled = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import('animejs').then(({ createTimeline, stagger }) => {
          if (cancelled || !svg.current) return;
          const q = (sel: string) => svg.current!.querySelectorAll(sel);
          const dots = q('[data-dot]');
          const t = createTimeline({ autoplay: false, defaults: { ease: 'inOutQuad', duration: SEG * 0.8 } });

          // Cada escena se completa en la primera mitad de su tramo: a mitad de fase se ve ya formada.
          // 1 · Diagnóstico
          t.add(q('[data-lens]'), { opacity: [0, 1], duration: SEG * 0.1 }, 0)
            .add(q('[data-lens]'), { cx: LENS_PATH.map((p) => ({ to: p.x })), cy: LENS_PATH.map((p) => ({ to: p.y })), duration: SEG * 0.55 }, 0)
            .add(q('[data-critical]'), { fill: COLORS.gold, r: 7, delay: stagger(SEG * 0.12), duration: SEG * 0.12 }, SEG * 0.1)
            // 2 · Diseño
            .add(q('[data-lens]'), { opacity: 0, duration: SEG * 0.1 }, SEG)
            .add(dots, { cx: (_?: unknown, i = 0) => GRID[i].x, cy: (_?: unknown, i = 0) => GRID[i].y, duration: SEG * 0.35, delay: stagger(3, { grid: [6, 4], from: 'center' }) }, SEG)
            .add(q('[data-edge]'), { strokeDashoffset: [1, 0], duration: SEG * 0.2, delay: stagger(2) }, SEG * 1.3)
            // 3 · Construcción
            .add(q('[data-edge]'), { opacity: 0, duration: SEG * 0.15 }, SEG * 2)
            .add(dots, { cx: CX, cy: CX, r: 2, opacity: 0, duration: SEG * 0.25, delay: stagger(2, { from: 'center' }) }, SEG * 2)
            .add(
              q('[data-piece]'),
              { x: (_?: unknown, i = 0) => [LOGO[i].dx, 0], y: (_?: unknown, i = 0) => [LOGO[i].dy, 0], opacity: [0, 1], duration: SEG * 0.3, ease: 'outCubic', delay: stagger(25) },
              SEG * 2.1,
            )
            // 4 · Adopción
            .add(q('[data-ring]'), { strokeDashoffset: [1, 0], duration: SEG * 0.4 }, SEG * 3)
            .add(
              dots,
              { cx: (_?: unknown, i = 0) => ORBIT[i].x, cy: (_?: unknown, i = 0) => ORBIT[i].y, r: 5, opacity: 1, fill: (_?: unknown, i = 0) => (i % 4 === 0 ? COLORS.gold : COLORS.mid), duration: SEG * 0.3, delay: stagger(6) },
              SEG * 3.05,
            )
            // 5 · Mejora continua
            .add(q('[data-orbit]'), { rotate: 90, duration: SEG * 0.6 }, SEG * 4)
            .add(q('[data-loop]'), { strokeDashoffset: [1, 0], opacity: [0, 1], duration: SEG * 0.45 }, SEG * 4.05)
            .add(q('[data-logo]'), { scale: [1, 1.06], duration: SEG * 0.3 }, SEG * 4.2);

          tl.current = t;
          at(stillRef.current ? 1 : progress.current, t);
        });
      },
      { rootMargin: '-10% 0px' },
    );
    io.observe(root);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, []);

  // Sin movimiento: ilustración en su estado final.
  useEffect(() => {
    stillRef.current = still;
    if (still) tl.current?.seek(tl.current.duration);
    else if (tl.current) at(progress.current, tl.current);
  }, [still]);

  const goTo = (k: number) => {
    const el = track.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((k + 0.5) / PHASES.length), behavior: still ? 'auto' : 'smooth' });
  };

  return (
    <section id="metodo" aria-labelledby="metodo-titulo" className="relative bg-cream-50">
      <div className="wrap pt-[clamp(5rem,11vw,9rem)]">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHead className="lg:col-span-7" eyebrow={METHOD_INTRO.eyebrow} title={<span id="metodo-titulo">{METHOD_INTRO.title}</span>} />
          <p className="lead lg:col-span-5" data-reveal>
            {METHOD_INTRO.lead}
          </p>
        </div>
      </div>

      {/* Recorrido: alto de 5 tramos de scroll; el escenario queda fijo mientras se recorre. */}
      <div ref={track} className="relative" style={{ height: still ? 'auto' : `calc(100svh + ${PHASES.length} * 75svh)` }}>
        <div className={still ? 'wrap py-16' : 'sticky top-0 flex h-[100svh] items-center pt-[4.5rem]'}>
          <div className={`grid w-full items-center gap-6 lg:grid-cols-12 lg:gap-10 ${still ? '' : 'wrap'}`}>
            <div className="order-2 lg:order-1 lg:col-span-5">
              {/* Navegación por fases (también salta a cada una). */}
              <ol className={`grid ${still ? 'gap-10' : 'relative min-h-[13rem] sm:min-h-[12rem]'}`}>
                {PHASES.map((p, i) => {
                  const on = still || i === active;
                  return (
                    <li
                      key={p.name}
                      className={
                        still
                          ? ''
                          : `col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] ${
                              on ? 'translate-y-0 opacity-100' : i < active ? 'pointer-events-none -translate-y-6 opacity-0' : 'pointer-events-none translate-y-6 opacity-0'
                            }`
                      }
                    >
                      <p className="num">Fase {pad(i + 1)} / {pad(PHASES.length)}</p>
                      <h3 className="mt-3 font-serif text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.03em]">{p.name}</h3>
                      <p className="mt-4 max-w-[26rem] text-[1.05rem] text-ink-soft">{p.goal}</p>
                    </li>
                  );
                })}
              </ol>

              {!still && (
                <nav aria-label="Fases del método" className="mt-8 hidden sm:block">
                  <ul className="flex flex-wrap gap-2">
                    {PHASES.map((p, i) => (
                      <li key={p.name}>
                        <button
                          type="button"
                          onClick={() => goTo(i)}
                          aria-current={i === active ? 'step' : undefined}
                          className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[0.82rem] transition-colors duration-500 ${
                            i === active ? 'border-forest-900 bg-forest-900 text-cream-50' : i < active ? 'border-forest-900/40 text-forest-900' : 'border-line text-ink-soft hover:border-forest-900'
                          }`}
                        >
                          <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${i <= active ? 'bg-gold-500' : 'bg-line'}`} />
                          {p.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>

            <div className="order-1 lg:order-2 lg:col-span-6 lg:col-start-7">
              <svg ref={svg} viewBox={`0 0 ${S} ${S}`} className="mx-auto block h-auto w-full max-w-[min(30rem,44svh)] overflow-visible lg:max-w-[min(34rem,70svh)]" aria-hidden="true">
                <rect x="1" y="1" width={S - 2} height={S - 2} rx="28" fill="var(--color-cream-100)" stroke="var(--color-line)" />
                {/* Diseño: conexiones del modelo */}
                <g stroke={COLORS.light} strokeOpacity="0.45" strokeWidth="1.2">
                  {EDGES.map(([a, b], k) => (
                    <line key={k} data-edge x1={GRID[a].x} y1={GRID[a].y} x2={GRID[b].x} y2={GRID[b].y} pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                  ))}
                </g>
                {/* Adopción y mejora continua: órbita, anillo y ciclo */}
                <circle data-ring cx={CX} cy={CX} r="172" fill="none" stroke={COLORS.mid} strokeOpacity="0.5" pathLength={1} strokeDasharray="1" strokeDashoffset="1" />
                <path
                  data-loop
                  d={`M ${CX + 205} ${CX} A 205 205 0 1 1 ${CX + 145} ${CX - 145}`}
                  fill="none"
                  stroke={COLORS.gold}
                  strokeWidth="2"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset="1"
                  opacity="0"
                />
                {/* Construcción: el logotipo se ensambla */}
                <g data-logo style={{ transformOrigin: `${CX}px ${CX}px`, transformBox: 'view-box' }}>
                  <g transform={`translate(${CX - LOGO_SIZE / 2} ${CX - LOGO_SIZE / 2}) scale(${LOGO_SIZE / 648})`}>
                    {LOGO.map((p, k) => (
                      <path key={k} data-piece d={p.d} fill={p.light ? COLORS.light : COLORS.ink} opacity="0" style={{ transform: `translate(${p.dx}px, ${p.dy}px)` }} />
                    ))}
                  </g>
                </g>
                {/* Puntos de información */}
                <g data-orbit style={{ transformOrigin: `${CX}px ${CX}px`, transformBox: 'view-box' }}>
                  {SCATTER.map((p, i) => (
                    <circle
                      key={i}
                      data-dot
                      {...(CRITICAL.includes(i) ? { 'data-critical': true } : {})}
                      cx={p.x}
                      cy={p.y}
                      r="5"
                      fill={COLORS.mid}
                    />
                  ))}
                </g>
                {/* Diagnóstico: lupa */}
                <circle data-lens cx={LENS_PATH[0].x} cy={LENS_PATH[0].y} r="40" fill="none" stroke={COLORS.gold} strokeWidth="2" opacity="0" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap flex flex-wrap items-center gap-6 pb-[clamp(5rem,11vw,9rem)] pt-10">
        <TextLink href="/firma/metodo">{METHOD_INTRO.more}</TextLink>
        <DiagnosisButton />
      </div>
    </section>
  );
}
