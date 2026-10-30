import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Closing } from '@/components/layout/Closing';
import { PageHero } from '@/components/layout/PageHero';
import { JsonLd } from '@/components/seo/JsonLd';
import { Arrow, DiagnosisButton, SectionHead, TextLink, delay, pad } from '@/components/ui/primitives';
import { CLOSINGS, PHASES } from '@/content/firm';
import { QUESTIONS, SERVICES } from '@/content/services';
import { pageMetadata } from '@/lib/seo';
import { SITE_NAME, SITE_URL, absolute } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return {};
  return pageMetadata({ title: service.name, description: service.intro, path: `/servicios/${service.slug}` });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const index = SERVICES.findIndex((s) => s.slug === slug);
  if (index < 0) notFound();
  const service = SERVICES[index];
  const others = SERVICES.filter((s) => s.slug !== slug);
  const path = `/servicios/${slug}`;

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: service.name,
          serviceType: service.name,
          description: service.intro,
          url: absolute(path),
          provider: { '@type': 'ProfessionalService', '@id': `${SITE_URL}/#organizacion`, name: SITE_NAME, url: absolute('/') },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: service.name,
            itemListElement: service.rows.map(([name, deliverable]) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name, description: deliverable },
            })),
          },
        }}
      />

      <PageHero
        kicker={`Servicios · ${pad(index + 1)}`}
        title={service.name}
        lead={service.intro}
        crumbs={[{ name: 'Servicios', href: '/#servicios' }, { name: service.name, href: path }]}
        aside={
          <div className="rounded-[1.5rem] border border-cream-50/15 bg-cream-50/[0.04] p-7 md:p-9">
            <p className="eyebrow">{service.questions.length > 1 ? 'Las preguntas que responde' : 'La pregunta que responde'}</p>
            <p className="mt-6 font-serif text-[clamp(1.75rem,2.6vw,2.4rem)] leading-[1.1] tracking-tight">
              {service.questions.map((qi) => (
                <span key={qi} className="block">
                  {QUESTIONS[qi].q}
                </span>
              ))}
            </p>
            <p className="mt-4 font-serif text-[1.25rem] italic text-gold-300">{service.claim}</p>
            <ol className="mt-8 space-y-2 border-t border-cream-50/10 pt-6" aria-label="Las cinco preguntas">
              {QUESTIONS.map((q, i) => {
                const on = service.questions.includes(i);
                return (
                  <li key={q.q} className={`flex items-center gap-3 text-[0.9rem] ${on ? 'text-cream-50' : 'text-forest-300'}`}>
                    <span aria-hidden="true" className={`h-2 w-2 rounded-full ${on ? 'bg-gold-300' : 'border border-forest-300'}`} />
                    <span className="num w-6">{pad(i + 1)}</span>
                    {q.q}
                    {on && <span className="sr-only">(responde a esta pregunta)</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        }
      >
        <DiagnosisButton variant="light" />
      </PageHero>

      <section aria-labelledby="que-hacemos" className="section">
        <div className="wrap">
          <SectionHead
            className="max-w-4xl"
            eyebrow="Qué hacemos"
            title={<span id="que-hacemos">Servicios, entregables y beneficio para su organización.</span>}
          />
          <table className="svc-table mt-16 w-full border-t border-ink text-left">
            <caption className="sr-only">Servicios de {service.name}</caption>
            <thead className="max-lg:sr-only">
              <tr className="text-[0.72rem] uppercase tracking-[0.16em] text-ink-mute">
                <th scope="col" className="w-[36%] py-4 pr-6 font-medium">
                  Servicio
                </th>
                <th scope="col" className="w-[34%] py-4 pr-6 font-medium">
                  Entregable
                </th>
                <th scope="col" className="py-4 font-medium">
                  Beneficio
                </th>
              </tr>
            </thead>
            <tbody>
              {service.rows.map(([name, deliverable, benefit], i) => (
                <tr key={name} className="group border-t border-line max-lg:grid max-lg:gap-3 max-lg:py-8" data-reveal style={delay(i)}>
                  <th scope="row" className="py-8 pr-6 align-top font-normal max-lg:p-0">
                    <span className="flex items-baseline gap-4">
                      <span className="num">{pad(i + 1)}</span>
                      <span className="font-serif text-[clamp(1.4rem,2vw,1.75rem)] leading-tight tracking-tight transition-colors duration-500 group-hover:text-forest-600">
                        {name}
                      </span>
                    </span>
                  </th>
                  <td className="py-8 pr-6 align-top text-ink-soft max-lg:p-0 max-lg:pl-10" data-label="Entregable">
                    {deliverable}
                  </td>
                  <td className="py-8 align-top font-medium text-forest-900 max-lg:p-0 max-lg:pl-10" data-label="Beneficio">
                    <span className="inline-flex items-start gap-3">
                      <span aria-hidden="true" className="mt-[0.6rem] h-px w-5 shrink-0 bg-gold-500 transition-[width] duration-500 group-hover:w-8" />
                      {benefit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-8 max-w-2xl border-t border-line pt-6 text-[0.88rem] text-ink-soft">
            Los beneficios indicados describen el objetivo de cada servicio. El resultado concreto depende de cada
            organización y se concreta en la propuesta de trabajo.
          </p>
        </div>
      </section>

      <section aria-labelledby="como" className="section bg-cream-100">
        <div className="wrap grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-5">
            <p className="eyebrow" data-reveal>
              Cómo lo abordamos
            </p>
            <h2 id="como" className="title mt-6 text-[clamp(1.9rem,3.4vw,2.9rem)]" data-reveal style={delay(1)}>
              Primero entendemos la decisión. Después construimos.
            </h2>
            <TextLink href="/firma/metodo" className="mt-8">
              Conocer el método completo
            </TextLink>
          </div>
          <ol className="flex flex-wrap gap-3 lg:col-span-7">
            {PHASES.map((p, i) => (
              <li
                key={p.name}
                className="inline-flex items-center gap-3 rounded-full border border-forest-900 px-5 py-3 font-serif text-[1.2rem] transition-colors duration-500 hover:bg-forest-900 hover:text-cream-50"
                data-reveal
                style={delay(i)}
              >
                <span className="num">{pad(i + 1)}</span>
                {p.name}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="otras" className="section">
        <div className="wrap">
          <p className="eyebrow" id="otras" data-reveal>
            Otras capacidades
          </p>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o, i) => (
              <li key={o.slug} data-reveal style={delay(i)}>
                <Link
                  href={`/servicios/${o.slug}`}
                  className="group flex h-full flex-col justify-between gap-10 rounded-[1.25rem] border border-line bg-cream-100 p-6 transition-[transform,border-color,box-shadow] duration-500 hover:-translate-y-1 hover:border-forest-900 hover:shadow-[0_30px_50px_-36px_rgb(20_38_31/0.5)]"
                >
                  <span>
                    <span className="block font-serif text-[1.45rem] leading-tight">{o.name}</span>
                    <span className="mt-2 block text-[0.9rem] text-ink-soft">{o.subtitle}</span>
                  </span>
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-line transition-all duration-500 group-hover:border-forest-900 group-hover:bg-forest-900 group-hover:text-cream-50">
                    <Arrow />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Closing {...CLOSINGS.service(service.name)} />
    </>
  );
}
