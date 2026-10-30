import type { ReactNode } from 'react';
import { PageHero } from '@/components/layout/PageHero';
import { LEGAL_UPDATED, OWNER } from '@/content/legal';

export type LegalSection = { id: string; title: string; body: ReactNode };

const updated = new Date(`${LEGAL_UPDATED}T12:00:00`).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

/** Páginas de información legal: cabecera sencilla, índice lateral y texto continuo, sin cierre comercial (como la v1). */
export function LegalDoc({ title, path, intro, sections }: { title: string; path: string; intro?: ReactNode; sections: LegalSection[] }) {
  return (
    <>
      <PageHero
        compact
        kicker="Información legal"
        title={title}
        lead={`Última actualización: ${updated}.`}
        crumbs={[{ name: 'Información legal' }, { name: title, href: path }]}
      />
      <div className="wrap grid gap-12 py-20 lg:grid-cols-12 lg:py-28">
        <nav aria-label="Índice" className="lg:col-span-3">
          <div className="lg:sticky lg:top-28">
            <p className="eyebrow">Índice</p>
            <ol className="mt-5 space-y-2 text-[0.88rem]">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-ink-soft transition-colors hover:text-forest-900">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>
        <article className="legal max-w-[46rem] lg:col-span-8 lg:col-start-5">
          {intro}
          {sections.map((s) => (
            <section key={s.id} aria-labelledby={s.id}>
              <h2 id={s.id}>{s.title}</h2>
              {s.body}
            </section>
          ))}
        </article>
      </div>
    </>
  );
}

/** Ficha del titular. Solo muestra los datos rellenos en src/content/legal.ts (como la v1). */
export function OwnerData() {
  const rows = (
    [
      ['Titular', OWNER.name],
      ['Nombre comercial', OWNER.tradeName],
      ['NIF', OWNER.taxId],
      ['Domicilio', OWNER.address],
      ['Datos registrales', OWNER.type === 'sociedad' ? OWNER.registry : ''],
    ] as [string, string][]
  ).filter(([, value]) => value.trim());
  return (
    <dl>
      {rows.map(([label, value]) => (
        <div key={label} className="contents">
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
      <dt>Correo electrónico</dt>
      <dd>
        <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a>
      </dd>
      {OWNER.phone.trim() && (
        <>
          <dt>Teléfono</dt>
          <dd>
            <a href={`tel:${OWNER.phone.replace(/\s/g, '')}`}>{OWNER.phone}</a>
          </dd>
        </>
      )}
    </dl>
  );
}
