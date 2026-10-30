// Diagrama de la v1, redibujado: cuatro fuentes que convergen, se ordenan y terminan en una decisión.
// Solo SVG y CSS (clases flow-* en globals.css).

const W = 560;
const H = 460;
const SOURCES = ['Datos', 'Finanzas', 'Operaciones', 'Mercado'];
const SOURCE_Y = [80, 180, 280, 380];
const BUNDLE_X0 = 250;
const BUNDLE_X1 = 390;
const DECISION = { x: 500, y: 230 };

const lines: { d: string; delay: number }[] = [];
let idx = 0;
SOURCE_Y.forEach((sy, k) => {
  for (let j = 0; j < 3; j++) {
    const y0 = sy + (j - 1) * 8;
    const by = 178 + idx * (104 / 11);
    const d = `M0 ${y0} C${110 + j * 12} ${y0} ${140 - j * 10} ${by.toFixed(1)} ${BUNDLE_X0} ${by.toFixed(1)} H${BUNDLE_X1} L${DECISION.x} ${DECISION.y}`;
    lines.push({ d, delay: k * 0.12 + j * 0.05 });
    idx++;
  }
});

export function FlowDiagram() {
  return (
    <figure className="relative mx-auto aspect-[560/460] w-full max-w-[34rem]" aria-label="Datos, finanzas, operaciones y mercado convergen en una decisión">
      <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <g stroke="currentColor" strokeOpacity="0.08">
          {[BUNDLE_X0, BUNDLE_X0 + 46, BUNDLE_X0 + 93, BUNDLE_X1].map((x) => (
            <line key={x} x1={x} x2={x} y1="150" y2="310" />
          ))}
        </g>
        <g fill="none" stroke="var(--color-forest-300)" strokeOpacity="0.55" strokeWidth="1">
          {lines.map((l, k) => (
            <path key={k} className="flow-line" d={l.d} pathLength={1} style={{ '--delay': `${l.delay}s` } as React.CSSProperties} />
          ))}
        </g>
        <g className="loop" fill="none" stroke="var(--color-gold-300)" strokeWidth="1.6" strokeLinecap="round">
          {lines.map((l, k) => (
            <path
              key={k}
              className="flow-pulse"
              d={l.d}
              pathLength={1}
              style={{ '--delay': `${((k * 7) % 12) * 0.42}s` } as React.CSSProperties}
            />
          ))}
        </g>
        <line
          className="flow-line"
          x1={DECISION.x}
          y1={DECISION.y}
          x2={W + 40}
          y2={DECISION.y}
          stroke="var(--color-gold-300)"
          pathLength={1}
          style={{ '--delay': '1.4s' } as React.CSSProperties}
        />
        <circle className="flow-ring loop" cx={DECISION.x} cy={DECISION.y} r="8" fill="none" stroke="var(--color-gold-300)" />
        <rect className="flow-fade" style={{ '--i': 6 } as React.CSSProperties} x={DECISION.x - 7} y={DECISION.y - 7} width="14" height="14" fill="var(--color-gold-300)" />
      </svg>
      {SOURCES.map((s, k) => (
        <span
          key={s}
          aria-hidden="true"
          className="flow-fade absolute -translate-x-[calc(100%+0.9rem)] -translate-y-1/2 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-forest-300"
          style={{ top: `${(SOURCE_Y[k] / H) * 100}%`, left: 0, '--i': k } as React.CSSProperties}
        >
          {s}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="flow-fade absolute -translate-x-1/2 font-serif text-[1.35rem] italic text-gold-300"
        style={{ left: `${(DECISION.x / W) * 100}%`, top: `${((DECISION.y + 26) / H) * 100}%`, '--i': 7 } as React.CSSProperties}
      >
        Decisión
      </span>
    </figure>
  );
}
