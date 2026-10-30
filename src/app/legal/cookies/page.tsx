import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { LegalDoc } from '@/components/legal/LegalDoc';

// Texto migrado sin cambios de la v1 (src/pages/legal/cookies.astro).
const description = 'La web de Trenchs Advisory no utiliza cookies ni herramientas de seguimiento.';

export const metadata: Metadata = pageMetadata({ title: 'Política de cookies', description, path: '/legal/cookies' });

export default function CookiesPage() {
  return (
    <LegalDoc
      title="Política de cookies"
      path="/legal/cookies"
      sections={[
        {
          id: 'que-son',
          title: '1. Qué son las cookies',
          body: (
            <p>
              Las cookies y tecnologías similares (como el almacenamiento local del navegador) son pequeños archivos o datos
              que una web guarda en su dispositivo para recordar información sobre su visita.
            </p>
          ),
        },
        {
          id: 'sin-cookies',
          title: '2. Esta web no utiliza cookies',
          body: (
            <>
              <p>
                La web no instala cookies propias ni de terceros. No usa herramientas de analítica, publicidad ni redes
                sociales, ni contenidos incrustados de terceros como vídeos, mapas o chats. Las tipografías se sirven desde la
                propia web, sin conectar con servicios externos.
              </p>
              <p>
                Por eso no le mostramos un aviso de cookies ni le pedimos consentimiento: el artículo 22.2 de la LSSI-CE solo
                lo exige cuando se utilizan cookies que no son estrictamente necesarias.
              </p>
            </>
          ),
        },
        {
          id: 'almacenamiento',
          title: '3. Almacenamiento local: preferencia de animaciones',
          body: (
            <>
              <p>
                Solo si usted pulsa el botón «Pausar animaciones» del pie de página, la web guarda en su navegador
                (localStorage) el dato <code>motion = paused</code> para recordar su preferencia en las demás páginas. Ese dato
                no le identifica, no se envía a ningún servidor y no caduca hasta que usted lo borra.
              </p>
              <p>
                Al ser necesario para prestar una función que usted solicita expresamente, está exento de consentimiento según
                el artículo 22.2 de la LSSI-CE. Puede eliminarlo pulsando «Reanudar animaciones» o borrando los datos del sitio
                en la configuración de su navegador.
              </p>
            </>
          ),
        },
        {
          id: 'alojamiento',
          title: '4. Alojamiento',
          body: (
            <p>
              La web está alojada en GitHub Pages. El servicio no instala cookies al visitarla, pero GitHub registra la
              dirección IP de los visitantes por motivos de seguridad, como se explica en la{' '}
              <Link href="/legal/privacidad">política de privacidad</Link>.
            </p>
          ),
        },
        {
          id: 'cambios',
          title: '5. Cambios',
          body: (
            <p>
              Si en el futuro incorporamos cookies que requieran su consentimiento, como las de analítica, se lo pediremos
              antes de instalarlas, le permitiremos rechazarlas con la misma facilidad y actualizaremos esta política.
            </p>
          ),
        },
      ]}
    />
  );
}
