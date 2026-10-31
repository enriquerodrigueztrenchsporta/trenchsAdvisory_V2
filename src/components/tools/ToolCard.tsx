import Link from 'next/link';
import { Arrow, delay } from '@/components/ui/primitives';
import { toolPath, type Tool } from '@/content/tools';

/** Icono de cada herramienta (trazo fino, como el resto de la web). */
export function ToolIcon({ icon, className = 'h-7 w-7' }: { icon: Tool['icon']; className?: string }) {
  if (icon === 'pyme-check') {
    return (
      <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="11" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45" />
        <path d="M16 5a11 11 0 0 1 10.5 14.3" stroke="var(--color-gold-500)" strokeWidth="1.8" strokeLinecap="round" />
        <path d="m11.5 16.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 27h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 23v-6M14 23v-10M20 23v-7M26 23V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 15 13 9l6 4 8-8" stroke="var(--color-gold-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Ilustraciones de muestra (sin datos), ocultas a lectores de pantalla; al pasar el cursor se animan.
 * Calculadora: ingresos y costes que se cruzan en el punto de equilibrio.
 */
function BreakEvenSketch() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true" data-draw>
      {[40, 95, 150, 205].map((y) => (
        <line key={y} x1="20" x2="300" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" />
      ))}
      <path d="M20 200 L160 120 L20 140 Z" fill="var(--color-loss)" fillOpacity="0.14" />
      <path d="M160 120 L300 40 L300 100 Z" fill="var(--color-gold-300)" fillOpacity="0.28" />
      <path className="draw" style={delay(0)} pathLength={1} d="M20 140 L300 100" stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.5" strokeDasharray="1" />
      <path className="draw" style={delay(2)} pathLength={1} d="M20 200 L300 40" stroke="var(--color-gold-300)" strokeWidth="2" />
      <circle cx="160" cy="120" r="5" fill="var(--color-gold-300)" />
      <circle cx="160" cy="120" r="12" fill="none" stroke="var(--color-gold-300)" strokeOpacity="0.5" className="origin-center transition-transform duration-700 [transform-box:fill-box] group-hover:scale-125" />
      <line x1="160" x2="160" y1="120" y2="206" stroke="var(--color-gold-300)" strokeOpacity="0.6" strokeDasharray="3 4" />
    </svg>
  );
}

/** PYME Check: indicador circular de puntuación y las cinco áreas evaluadas. */
function ScoreSketch() {
  const bars = [0.9, 0.55, 0.3, 0.7, 0.45];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true">
      <circle cx="82" cy="110" r="58" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="10" />
      <circle
        pathLength={100}
        cx="82"
        cy="110"
        r="58"
        fill="none"
        stroke="var(--color-gold-300)"
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray="60 100"
        transform="rotate(-90 82 110)"
      />
      <text x="82" y="119" textAnchor="middle" fill="currentColor" fontSize="28" fontFamily="var(--font-serif)">
        60
      </text>
      {bars.map((b, i) => (
        <g key={i}>
          <rect x="172" y={52 + i * 26} width="128" height="6" rx="3" fill="currentColor" fillOpacity="0.1" />
          <rect
            x="172"
            y={52 + i * 26}
            width={128 * b}
            height="6"
            rx="3"
            fill={b < 0.5 ? 'var(--color-gold-300)' : 'var(--color-forest-300)'}
            className="origin-left transition-transform duration-700 [transform-box:fill-box] group-hover:scale-x-110"
          />
        </g>
      ))}
    </svg>
  );
}

const SKETCHES: Record<Tool['icon'], () => React.JSX.Element> = { profitability: BreakEvenSketch, 'pyme-check': ScoreSketch };

/** Tarjeta de una herramienta del catálogo: ilustración arriba y contenido debajo, igual para todas. */
export function ToolCard({ tool }: { tool: Tool }) {
  const href = toolPath(tool);
  const Sketch = SKETCHES[tool.icon];
  return (
    <article
      className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-cream-100 transition-[border-color,box-shadow,transform] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-forest-900 hover:shadow-[0_50px_80px_-50px_rgb(20_38_31/0.55)]"
      data-reveal
    >
      {/* Toda la tarjeta es clicable. Enlace duplicado fuera del orden de tabulación y oculto a lectores de pantalla:
          el enlace accesible es el botón de la tarjeta. */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-0" />
      <div className="on-dark pointer-events-none relative overflow-hidden bg-forest-950 px-8 py-6 text-cream-50">
        <div className="absolute inset-0 grain" aria-hidden="true" />
        <div className="relative mx-auto aspect-[16/10] w-full max-w-md">
          <Sketch />
        </div>
      </div>
      <div className="pointer-events-none relative flex flex-1 flex-col p-7 sm:p-10">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-900 text-cream-50 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6">
            <ToolIcon icon={tool.icon} />
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-forest-600/30 bg-cream-50 px-3 py-1 text-[0.78rem] font-medium text-forest-900">
            <span className="h-1.5 w-1.5 rounded-full bg-forest-600" aria-hidden="true" />
            Disponible
          </span>
        </div>
        <h3 className="mt-8 font-serif text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.04] tracking-[-0.03em]">{tool.name}</h3>
        {tool.subtitle && <p className="mt-2 font-serif text-[1.25rem] italic leading-snug text-forest-600">{tool.subtitle}</p>}
        <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-ink-soft">{tool.description}</p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[0.88rem] text-ink-soft">
          {tool.facts.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-forest-600" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-8">
          <Link href={href} className="btn pointer-events-auto">
            {tool.cta}
            <span className="btn__icon">
              <Arrow />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
