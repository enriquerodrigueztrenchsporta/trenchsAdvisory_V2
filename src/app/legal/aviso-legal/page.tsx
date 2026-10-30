import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { LegalDoc, OwnerData } from '@/components/legal/LegalDoc';
import { holder } from '@/content/legal';
import { absolute } from '@/lib/site';

// Texto migrado sin cambios de la v1 (src/pages/legal/aviso-legal.astro).
const description = 'Datos identificativos del titular de la web de Trenchs Advisory y condiciones de uso del sitio.';

export const metadata: Metadata = pageMetadata({ title: 'Aviso legal y condiciones de uso', description, path: '/legal/aviso-legal' });

export default function LegalNoticePage() {
  const site = absolute('/');
  return (
    <LegalDoc
      title="Aviso legal y condiciones de uso"
      path="/legal/aviso-legal"
      sections={[
        {
          id: 'titular',
          title: '1. Titular del sitio web',
          body: (
            <>
              <p>
                En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de
                comercio electrónico (LSSI-CE), se informa de los datos del titular de este sitio web:
              </p>
              <OwnerData />
            </>
          ),
        },
        {
          id: 'objeto',
          title: '2. Objeto y aceptación',
          body: (
            <p>
              Estas condiciones regulan el acceso y el uso del sitio web <a href={site}>{site}</a> (en adelante, «la
              web»). Navegar por la web implica aceptarlas. Si no está de acuerdo con ellas, le rogamos que no la utilice.
            </p>
          ),
        },
        {
          id: 'condiciones',
          title: '3. Condiciones de uso',
          body: (
            <>
              <p>Usted se compromete a utilizar la web conforme a la ley, a la buena fe y a estas condiciones, y en particular a no:</p>
              <ul>
                <li>Emplearla con fines ilícitos o que puedan dañar los derechos o intereses de terceros.</li>
                <li>Intentar acceder a áreas restringidas de los sistemas que la alojan, ni introducir virus o código dañino.</li>
                <li>Reproducir, distribuir o transformar sus contenidos fuera de lo permitido en el apartado 6.</li>
              </ul>
            </>
          ),
        },
        {
          id: 'informacion',
          title: '4. Carácter de la información',
          body: (
            <>
              <p>
                Los contenidos de la web tienen carácter general e informativo. No constituyen asesoramiento profesional
                sobre ningún caso concreto ni una oferta contractual vinculante.
              </p>
              <p>
                Los beneficios que se describen para cada servicio expresan su objetivo, no un resultado garantizado: el
                resultado de cada encargo depende de la organización y de su punto de partida. El alcance, el plazo, las
                condiciones económicas y los compromisos de cada servicio se fijan por escrito en la propuesta o el
                contrato correspondiente.
              </p>
            </>
          ),
        },
        {
          id: 'contratacion',
          title: '5. Contratación, pagos y reembolsos',
          body: (
            <p>
              La web no permite contratar servicios ni realizar pagos en línea, y no contiene formularios. El contacto se
              realiza por correo electrónico. Por ese motivo la web no incluye una política de devoluciones o reembolsos:
              las condiciones de cancelación, facturación y, en su caso, reembolso de cada encargo se recogen en su
              contrato, junto con los derechos que la normativa de consumidores reconozca cuando el cliente tenga la
              condición de consumidor.
            </p>
          ),
        },
        {
          id: 'propiedad',
          title: '6. Propiedad intelectual e industrial',
          body: (
            <>
              <p>
                Los textos, el diseño, el logotipo, los gráficos y el código de la web pertenecen a {holder()} o se usan con
                licencia. Queda prohibida su reproducción, distribución, comunicación pública o transformación sin
                autorización previa, salvo para uso personal y privado o en los casos que permita la ley, como el derecho
                de cita.
              </p>
              <p>
                La web utiliza las tipografías Inter y Newsreader, distribuidas bajo la licencia SIL Open Font License 1.1
                y alojadas en la propia web. Las marcas de terceros que se mencionan, como Power BI (de Microsoft), se citan
                solo para describir los servicios y pertenecen a sus respectivos titulares, sin que su mención implique
                relación o patrocinio.
              </p>
            </>
          ),
        },
        {
          id: 'responsabilidad',
          title: '7. Responsabilidad',
          body: (
            <>
              <p>
                Procuramos que la información de la web sea correcta y esté actualizada, pero no podemos garantizar la
                ausencia de errores ni la disponibilidad ininterrumpida de la web. No respondemos de los daños derivados
                de interrupciones técnicas ajenas a nuestro control ni del uso de la web contrario a estas condiciones.
              </p>
              <p>
                Si la web enlaza con sitios de terceros, lo hace a título informativo: no controlamos sus contenidos ni
                respondemos de ellos. Si tiene conocimiento de un contenido ilícito enlazado, le agradeceremos que nos lo
                comunique para retirarlo.
              </p>
            </>
          ),
        },
        {
          id: 'datos',
          title: '8. Protección de datos y cookies',
          body: (
            <p>
              El tratamiento de sus datos personales se explica en la <Link href="/legal/privacidad">política de privacidad</Link>. La web no
              utiliza cookies; los detalles están en la <Link href="/legal/cookies">política de cookies</Link>.
            </p>
          ),
        },
        {
          id: 'legislacion',
          title: '9. Legislación aplicable y jurisdicción',
          body: (
            <p>
              Estas condiciones se rigen por la legislación española. Para cualquier controversia serán competentes los
              juzgados y tribunales que correspondan conforme a la ley. Cuando el usuario tenga la condición de
              consumidor, lo serán los de su domicilio.
            </p>
          ),
        },
        {
          id: 'cambios',
          title: '10. Cambios',
          body: (
            <p>
              Podemos actualizar estas condiciones para adaptarlas a cambios legales o de la web. La fecha de la última
              actualización figura al principio de la página.
            </p>
          ),
        },
      ]}
    />
  );
}
