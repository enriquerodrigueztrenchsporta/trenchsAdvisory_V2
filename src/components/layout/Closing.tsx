import Link from 'next/link';
import { CopyEmail } from '@/components/ui/CopyEmail';
import { DiagnosisButton, delay } from '@/components/ui/primitives';
import { CLOSINGS } from '@/content/firm';
import { holder } from '@/content/legal';

type Props = { kicker?: string; title?: string; text?: string };

/** Cierre con la acción principal. Textos por página (v1); por defecto, los de la portada. */
export function Closing({ kicker, title, text }: Props) {
  const c = { ...CLOSINGS.default, ...Object.fromEntries(Object.entries({ kicker, title, text }).filter(([, v]) => v)) };
  return (
    <section id="contacto" aria-labelledby="contacto-titulo" className="on-dark grain relative overflow-hidden bg-forest-900 text-cream-50">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        aria-hidden="true"
        data-draw
      >
        {Array.from({ length: 11 }, (_, i) => (
          <path
            key={i}
            className="draw"
            style={delay(i)}
            d={`M-20 ${30 + i * 52} C420 ${30 + i * 52} 640 330 1220 330`}
            pathLength={1}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.09}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
      <div className="wrap relative py-28 md:py-40">
        <p className="eyebrow" data-reveal>
          {c.kicker}
        </p>
        <h2 id="contacto-titulo" className="display-xl mt-8 max-w-[15ch]" data-reveal style={delay(1)}>
          {c.title}
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="lead md:col-span-6" data-reveal style={delay(2)}>
            {c.text}
          </p>
          <div className="flex flex-col gap-5 md:col-span-6 md:items-end" data-reveal style={delay(3)}>
            <DiagnosisButton variant="light" />
            <CopyEmail />
          </div>
        </div>
        <p className="mt-20 max-w-3xl border-t border-cream-50/10 pt-6 text-[0.82rem] leading-relaxed text-cream-50/70" data-reveal style={delay(4)}>
          Protección de datos: {holder()} tratará los datos que nos envíe solo para responder a su solicitud. Puede ejercer
          sus derechos de acceso, rectificación, supresión y demás escribiendo a ese mismo correo. Más información en la{' '}
          <Link className="underline underline-offset-2 hover:text-cream-50" href="/legal/privacidad">
            política de privacidad
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
