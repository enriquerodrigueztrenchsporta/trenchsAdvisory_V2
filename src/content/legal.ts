// Datos del titular de la web (art. 10 LSSI-CE y art. 13 RGPD). Migrado sin cambios de la v1.
// Los campos vacíos no se muestran; al rellenarlos aparecen en el aviso legal y la política de privacidad.

import { EMAIL } from '@/lib/site';

export const OWNER = {
  /** 'autonomo' (persona física) o 'sociedad' (S.L., S.A., etc.). */
  type: 'autonomo' as '' | 'autonomo' | 'sociedad',
  /** Nombre y apellidos del autónomo o razón social completa de la sociedad. */
  name: 'Enrique Rodríguez-Trenchs Porta',
  /** NIF (autónomo) o NIF de la sociedad. */
  taxId: '', // Pendiente de obtener: al rellenarlo se muestra en el aviso legal y la privacidad.
  /** Domicilio completo: calle, número, código postal, municipio y provincia. */
  address: '', // Pendiente: dirección del coworking o servicio de domiciliación.
  /** Solo sociedades: Registro Mercantil de ..., tomo, folio, hoja e inscripción. */
  registry: '',
  /** Opcional: teléfono de contacto. */
  phone: '',
  tradeName: 'Trenchs Advisory',
  email: EMAIL,
};

/** Fecha de la última revisión de los textos legales (AAAA-MM-DD). */
export const LEGAL_UPDATED = '2026-10-30';

/** Titular para el copyright y los textos: razón social o, si no está, el nombre comercial. */
export const holder = () => OWNER.name.trim() || OWNER.tradeName;
