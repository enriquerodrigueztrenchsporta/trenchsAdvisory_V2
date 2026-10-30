import Link from 'next/link';
import { Arrow, delay } from '@/components/ui/primitives';
import { toolPath, type Tool } from '@/content/tools';

/** Icono financiero de cada herramienta (trazo fino, como el resto de la web). */
export function ToolIcon({ className = 'h-7 w-7' }: { icon: Tool['icon']; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 27h24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 23v-6M14 23v-10M20 23v-7M26 23V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5 15 13 9l6 4 8-8" stroke="var(--color-gold-500)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * Vista de muestra de la herramienta: ingresos y costes que se cruzan en el punto de equilibrio. Es una ilustración
 * (sin datos), por eso queda oculta a lectores de pantalla; al pasar el cursor se dibujan las rectas.
 */
function BreakEvenSketch() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" aria-hidden="true" data-draw>
      {[40, 95, 150, 205].map((y) => (
        <line key={y} x1="20" x2="300" y1={y} y2={y} stroke="currentColor" strokeOpacity="0.08" />
      ))}
      {/* Zona de pérdidas y de resultado positivo */}
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

/** Tarjeta de una herramienta del catálogo. */
export function ToolCard({ tool }: { tool: Tool }) {
  const href = toolPath(tool);
  return (
    <article
      className="group relative grid overflow-hidden rounded-[1.75rem] border border-line bg-cream-100 transition-[border-color,box-shadow,transform] duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1 hover:border-forest-900 hover:shadow-[0_50px_80px_-50px_rgb(20_38_31/0.55)] lg:grid-cols-12"
      data-reveal
    >
      {/* Toda la tarjeta es clicable. Enlace duplicado fuera del orden de tabulación y oculto a lectores de pantalla:
          el enlace accesible es el botón «Analizar mi rentabilidad». */}
      <Link href={href} tabIndex={-1} aria-hidden="true" className="absolute inset-0 z-0" />
      <div className="pointer-events-none relative flex flex-col p-7 sm:p-10 lg:col-span-7 lg:p-14">
        <div className="flex flex-wrap items-center gap-4">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-forest-900 text-cream-50 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-rotate-6">
            <ToolIcon icon={tool.icon} />
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-forest-600/30 bg-cream-50 px-3 py-1 text-[0.78rem] font-medium text-forest-900">
            <span className="h-1.5 w-1.5 rounded-full bg-forest-600" aria-hidden="true" />
            Disponible
          </span>
        </div>
        <h3 className="mt-10 font-serif text-[clamp(2rem,3.6vw,3.1rem)] leading-[1.04] tracking-[-0.03em]">
          {tool.name}
        </h3>
        <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-ink-soft">{tool.description}</p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.88rem] text-ink-soft">
          {tool.facts.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <svg className="h-4 w-4 text-forest-600" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>
        <div className="mt-10 pt-2 lg:mt-auto">
          <Link href={href} className="btn pointer-events-auto">
            {tool.cta}
            <span className="btn__icon">
              <Arrow />
            </span>
          </Link>
        </div>
      </div>
      <div className="on-dark pointer-events-none relative min-h-[15rem] overflow-hidden bg-forest-950 p-8 text-cream-50 lg:col-span-5 lg:min-h-0">
        <div className="absolute inset-0 grain" aria-hidden="true" />
        <div className="relative grid grid-cols-2 gap-4 text-[0.78rem]" aria-hidden="true">
          {['Margen de contribución', 'Punto de equilibrio'].map((k) => (
            <div key={k} className="rounded-xl border border-cream-50/10 bg-cream-50/[0.04] p-3">
              <span className="block text-cream-50/70">{k}</span>
              <span className="mt-2 block h-2 w-16 rounded-full bg-cream-50/15 transition-[width] duration-700 ease-[var(--ease-out-expo)] group-hover:w-24" />
            </div>
          ))}
        </div>
        <div className="relative mt-6 aspect-[16/11] w-full">
          <BreakEvenSketch />
        </div>
      </div>
    </article>
  );
}
