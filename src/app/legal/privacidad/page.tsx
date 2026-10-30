import type { Metadata } from 'next';
import { pageMetadata } from '@/lib/seo';
import Link from 'next/link';
import { LegalDoc, OwnerData } from '@/components/legal/LegalDoc';
import { OWNER } from '@/content/legal';

// Texto migrado sin cambios de la v1 (src/pages/legal/privacidad.astro).
const description = 'Cómo trata Trenchs Advisory los datos personales de quienes contactan con la firma, y cómo ejercer sus derechos.';

export const metadata: Metadata = pageMetadata({ title: 'Política de privacidad', description, path: '/legal/privacidad' });

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Política de privacidad"
      path="/legal/privacidad"
      intro={
        <p>
          Esta política explica cómo tratamos los datos personales relacionados con esta web, conforme al Reglamento (UE)
          2016/679 (RGPD) y a la Ley Orgánica 3/2018 de protección de datos personales y garantía de los derechos
          digitales (LOPDGDD).
        </p>
      }
      sections={[
        { id: 'responsable', title: '1. Responsable del tratamiento', body: <OwnerData /> },
        {
          id: 'datos',
          title: '2. Qué datos tratamos',
          body: (
            <>
              <h3>Datos que usted nos envía</h3>
              <p>
                La web no tiene formularios. Si nos escribe por correo electrónico, por ejemplo con el botón «Solicitar
                diagnóstico», tratamos los datos que usted decida incluir: normalmente su nombre, su dirección de correo, la
                organización a la que pertenece, su cargo y el contenido de su consulta. Le pedimos que no nos envíe datos
                especialmente protegidos (como datos de salud) ni datos de terceros que no sean necesarios.
              </p>
              <h3>Herramientas gratuitas</h3>
              <p>
                La <Link href="/herramientas/calculadora-rentabilidad">Calculadora de Rentabilidad Empresarial</Link> hace
                todos los cálculos en su navegador: no guardamos las cifras que introduce ni las enviamos a ningún servidor, y
                desaparecen al cerrar la página. El botón «Copiar resumen» solo las copia a su portapapeles.
              </p>
              <h3>Datos de navegación</h3>
              <p>
                La web no utiliza cookies, herramientas de analítica, publicidad ni contenidos de terceros incrustados, por
                lo que nosotros no recogemos datos sobre su navegación. Puede consultar la{' '}
                <Link href="/legal/cookies">política de cookies</Link>.
              </p>
              <p>
                La web está alojada en GitHub Pages, un servicio de GitHub, Inc. (Estados Unidos). Según su documentación,
                GitHub registra la dirección IP de quienes visitan las páginas que aloja, por motivos de seguridad. Ese
                registro lo realiza GitHub conforme a su propia{' '}
                <a href="https://docs.github.com/es/site-policy/privacy-policies/github-general-privacy-statement" rel="noopener">
                  declaración de privacidad
                </a>
                ; nosotros no tenemos acceso a esos datos.
              </p>
            </>
          ),
        },
        {
          id: 'finalidad',
          title: '3. Para qué los tratamos y con qué base legal',
          body: (
            <>
              <ul>
                <li>
                  <strong>Responder a su consulta o a su solicitud de una sesión inicial.</strong> Base legal: la aplicación,
                  a petición suya, de medidas precontractuales (art. 6.1.b RGPD) cuando nos pide información sobre nuestros
                  servicios, y nuestro interés legítimo en atender las demás consultas que recibimos (art. 6.1.f RGPD).
                </li>
                <li>
                  <strong>Preparar y ejecutar el contrato</strong> si llega a contratar nuestros servicios. Base legal: la
                  ejecución del contrato (art. 6.1.b RGPD).
                </li>
                <li>
                  <strong>Cumplir obligaciones legales</strong>, como las fiscales y contables, si existe relación comercial.
                  Base legal: obligación legal (art. 6.1.c RGPD).
                </li>
              </ul>
              <p>
                No enviamos comunicaciones comerciales por correo electrónico sin su consentimiento previo, conforme al
                artículo 21 de la LSSI-CE. No tomamos decisiones automatizadas ni elaboramos perfiles con sus datos.
              </p>
            </>
          ),
        },
        {
          id: 'conservacion',
          title: '4. Cuánto tiempo los conservamos',
          body: (
            <ul>
              <li>
                Consultas que no dan lugar a una relación comercial: el tiempo necesario para responderlas y, como máximo,
                un año desde el último contacto.
              </li>
              <li>
                Clientes: mientras dure la relación y, después, durante los plazos que exige la ley (por ejemplo, seis años
                para la documentación contable, según el artículo 30 del Código de Comercio) o los de prescripción de las
                posibles responsabilidades.
              </li>
            </ul>
          ),
        },
        {
          id: 'destinatarios',
          title: '5. A quién se comunican',
          body: (
            <>
              <p>No cedemos sus datos a terceros, salvo obligación legal. Para prestar el servicio utilizamos estos proveedores:</p>
              <ul>
                <li>
                  <strong>Google</strong> (servicio de correo Gmail), donde se reciben y guardan los correos que nos envía.
                </li>
                <li>
                  <strong>GitHub</strong> (alojamiento de la web), en los términos indicados en el apartado 2.
                </li>
              </ul>
              <p>
                Ambas empresas tienen sede en Estados Unidos, por lo que puede haber transferencias internacionales de datos.
                Ambas declaran adherirse al Marco de Privacidad de Datos UE-EE. UU., que cuenta con una decisión de adecuación
                de la Comisión Europea, y utilizan también cláusulas contractuales tipo aprobadas por la Comisión.
              </p>
            </>
          ),
        },
        {
          id: 'derechos',
          title: '6. Sus derechos',
          body: (
            <>
              <p>
                Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y
                portabilidad escribiendo a <a href={`mailto:${OWNER.email}`}>{OWNER.email}</a>, indicando el derecho que
                desea ejercer. Si tenemos dudas razonables sobre su identidad, podremos pedirle información adicional para
                confirmarla. Le responderemos en el plazo de un mes.
              </p>
              <p>
                Si considera que no hemos atendido correctamente su solicitud, puede presentar una reclamación ante la
                Agencia Española de Protección de Datos (
                <a href="https://www.aepd.es" rel="noopener">
                  www.aepd.es
                </a>
                ).
              </p>
            </>
          ),
        },
        {
          id: 'menores',
          title: '7. Menores de edad',
          body: (
            <p>
              Nuestros servicios se dirigen a empresas, profesionales y administraciones. No tratamos conscientemente datos
              de menores de 14 años.
            </p>
          ),
        },
        {
          id: 'seguridad',
          title: '8. Seguridad',
          body: (
            <p>
              Aplicamos medidas técnicas y organizativas adecuadas para proteger sus datos frente a pérdida, uso indebido o
              acceso no autorizado. La web se sirve siempre mediante conexión cifrada (HTTPS).
            </p>
          ),
        },
        {
          id: 'cambios',
          title: '9. Cambios en esta política',
          body: <p>Si cambia la forma en que tratamos los datos, actualizaremos esta política y su fecha de actualización.</p>,
        },
      ]}
    />
  );
}
