// Datos de contacto y de publicación. Correo y mensaje de «Solicitar diagnóstico» migrados sin cambios de la v1.

export const EMAIL = 'enriquetrenchsporta@gmail.com';

const subject = 'Solicitud de diagnóstico – sesión inicial';
const body = [
  'Hola,',
  '',
  'Me gustaría solicitar una sesión inicial.',
  '',
  'Organización:',
  'Qué nos gustaría resolver:',
  '',
  'Gracias.',
].join('\n');

export const DIAGNOSIS_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const SITE_NAME = 'Trenchs Advisory';

/** Prefijo de publicación (vacío con dominio propio; p. ej. /Trenchs-Advisory en GitHub Pages). */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** URL pública sin barra final. Por defecto, la de la v1 en GitHub Pages. */
export const SITE_URL = (process.env.SITE_URL ?? `https://enriquerodrigueztrenchsporta.github.io${BASE_PATH}`).replace(/\/$/, '');

/** Ruta de un recurso de /public con el prefijo de publicación (los <Link> de Next ya lo añaden solos). */
export const asset = (path: string) => `${BASE_PATH}${path}`;

/** URL absoluta de una ruta interna, con barra final como en la v1. */
export const absolute = (path = '/') => `${SITE_URL}${path === '/' ? '/' : `${path.replace(/\/$/, '')}/`}`;
