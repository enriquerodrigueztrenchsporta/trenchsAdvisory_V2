'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

/** Ancho real del contenedor, para dibujar los SVG en píxeles y que el texto no encoja en móvil. */
export function useWidth<T extends HTMLElement>(fallback = 320) {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // clientWidth en cada medición (y no solo en el primer aviso): durante la transición entre pasos el primer
    // valor puede no ser el definitivo.
    const measure = () => setWidth(Math.max(240, el.clientWidth));
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    const raf = requestAnimationFrame(measure);
    const late = window.setTimeout(measure, 600);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(late);
    };
  }, []);
  return [ref, width] as const;
}

/** Escala lineal. */
export const linear = (d0: number, d1: number, r0: number, r1: number) => (v: number) => (d1 === d0 ? r0 : r0 + ((v - d0) / (d1 - d0)) * (r1 - r0));

/** Marcas «bonitas» del eje (1, 2, 2,5 o 5 × 10ⁿ). */
export function niceTicks(min: number, max: number, count = 4): number[] {
  const span = max - min || Math.abs(max) || 1;
  const raw = span / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * pow).find((s) => s >= raw) ?? raw;
  // De la marca inferior a la superior que contienen todo el intervalo.
  const first = Math.floor(min / step);
  const last = Math.ceil(max / step);
  return Array.from({ length: last - first + 1 }, (_, i) => (first + i) * step);
}

/** Tarjeta de gráfico: título, descripción, el gráfico y su tabla de datos (alternativa textual). */
export function ChartCard({ id, title, summary, children, table, className = '' }: { id: string; title: string; summary: ReactNode; children: ReactNode; table?: ReactNode; className?: string }) {
  return (
    <figure aria-labelledby={`${id}-title`} className={`min-w-0 rounded-[1.25rem] border border-line bg-cream-50 p-5 md:p-7 ${className}`}>
      <h3 id={`${id}-title`} className="font-serif text-[1.45rem] leading-tight tracking-tight">
        {title}
      </h3>
      <figcaption className="mt-1 text-[0.88rem] text-ink-soft">{summary}</figcaption>
      <div className="mt-6">{children}</div>
      {table && (
        <details className="group mt-5 border-t border-line pt-4 text-[0.88rem]">
          <summary className="cursor-pointer list-none font-medium text-forest-900 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-2">
              <svg className="h-3 w-3 transition-transform group-open:rotate-90" viewBox="0 0 12 12" aria-hidden="true">
                <path d="M4.5 2.5 8 6l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
              </svg>
              Ver los datos en una tabla
            </span>
          </summary>
          <div className="mt-3 overflow-x-auto">{table}</div>
        </details>
      )}
    </figure>
  );
}

export function DataTable({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <table className="w-full min-w-[18rem] text-left tabular-nums">
      <thead>
        <tr className="border-b border-line text-ink-mute">
          {head.map((h, i) => (
            <th key={h} scope="col" className={`py-2 pr-3 font-medium ${i > 0 ? 'text-right' : ''}`}>
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={String(r[0])} className="border-b border-line/60">
            {r.map((c, i) =>
              i === 0 ? (
                <th key={i} scope="row" className="py-2 pr-3 font-normal text-ink">
                  {c}
                </th>
              ) : (
                <td key={i} className="py-2 pr-3 text-right text-ink">
                  {c}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Globo con el detalle del elemento señalado. */
export function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: ReactNode }) {
  const left = Math.min(Math.max(x, 90), width - 90);
  return (
    <div
      role="presentation"
      className="pointer-events-none absolute z-10 w-max max-w-[15rem] -translate-x-1/2 -translate-y-full rounded-lg bg-forest-950 px-3 py-2 text-[0.8rem] leading-snug text-cream-50 shadow-[0_12px_30px_-12px_rgb(20_38_31/0.6)]"
      style={{ left, top: y - 10 }}
    >
      {children}
    </div>
  );
}
