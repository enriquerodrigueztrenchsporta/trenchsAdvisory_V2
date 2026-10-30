import Link from 'next/link';
import { DiagnosisButton, pad } from '@/components/ui/primitives';
import { SERVICES } from '@/content/services';
import { FlowDiagram } from './FlowDiagram';

const i = (n: number) => ({ '--i': n }) as React.CSSProperties;

/**
 * Portada. En 3 segundos: qué es (consultoría de estrategia, finanzas, datos e IA), para quién (empresas y
 * administraciones públicas), qué ofrece (las cinco áreas, abajo) y qué hacer (Solicitar diagnóstico).
 * Textos: kicker de la v1; titular y entradilla a partir de la entradilla de la v1 y de la descripción de la portada y
 * de Quiénes somos. Sin JavaScript: todo el movimiento es CSS.
 */
export function Hero() {
  return (
    <section className="on-dark grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-950 text-cream-50">
      {/* Luz de fondo: degradados radiales (sin filtros, baratos de pintar). */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 55% at 78% 45%, rgb(62 107 94 / 0.38), transparent 70%), radial-gradient(40% 40% at 10% 100%, rgb(176 138 62 / 0.12), transparent 70%)',
        }}
      />

      <div className="wrap grid flex-1 items-center gap-12 pb-10 pt-28 lg:grid-cols-12 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="eyebrow hero-in" style={i(0)}>
            Consultoría de estrategia, finanzas, datos e IA
          </p>
          <h1 className="mt-7 font-serif text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[1] tracking-[-0.035em]">
            <span className="hero-line" style={i(0)}>
              Decisiones con evidencia,
            </span>
            <span className="hero-line" style={i(1)}>
              anticipación y
            </span>
            <span className="hero-line" style={i(2)}>
              <em className="text-gold-300">criterio económico.</em>
            </span>
          </h1>
          <p className="lead hero-in mt-8 max-w-[34rem]" style={i(2)}>
            Integramos estrategia, finanzas, datos, tecnología e inteligencia artificial bajo un único responsable y una
            sola lógica económica, para que empresas y administraciones públicas tomen mejores decisiones.
          </p>
          <div className="hero-in mt-10 flex flex-wrap items-center gap-4" style={i(3)}>
            <DiagnosisButton variant="light" />
            <Link href="/#servicios" className="btn btn--ghost text-cream-50">
              Ver los cinco servicios
            </Link>
          </div>
        </div>
        <div className="hidden lg:col-span-5 lg:block">
          <FlowDiagram />
        </div>
      </div>

      {/* Qué ofrece: las cinco áreas, a la vista desde el primer pantallazo. */}
      <nav aria-label="Áreas de servicio" className="hero-in border-t border-cream-50/10" style={i(5)}>
        <ul className="wrap grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map((s, k) => (
            <li key={s.slug} className="border-cream-50/10 max-lg:border-b lg:border-l lg:first:border-l-0">
              <Link
                href={`/servicios/${s.slug}`}
                className="group flex h-full flex-col gap-1.5 py-5 pr-4 transition-colors lg:px-6 lg:first:pl-0"
              >
                <span className="num">{pad(k + 1)}</span>
                <span className="text-[0.92rem] font-medium leading-snug text-cream-50/90 transition-colors group-hover:text-gold-300">
                  {s.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
