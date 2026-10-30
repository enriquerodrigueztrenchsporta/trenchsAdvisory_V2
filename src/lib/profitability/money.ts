// Importes monetarios en céntimos enteros: sumas y restas exactas, sin errores de coma flotante.
// Solo los cocientes (ratios, punto de equilibrio) usan decimales, y su resultado monetario se redondea a céntimos.

/** Importe en céntimos de euro (entero). */
export type Cents = number;

/** Tope de cualquier importe introducido: 1.000 millones de euros al mes, muy por debajo de Number.MAX_SAFE_INTEGER. */
export const MAX_CENTS: Cents = 100_000_000_000;

/** Redondeo «half away from zero» a céntimos, el habitual en importes monetarios. */
export const roundCents = (value: number): Cents => {
  if (!Number.isFinite(value)) throw new RangeError('Importe no finito');
  const r = Math.sign(value) * Math.round(Math.abs(value));
  return r === 0 ? 0 : r; // evita -0
};

/** a × num / den redondeado a céntimos (para variaciones porcentuales enteras). */
export const scale = (cents: Cents, num: number, den: number): Cents => roundCents((cents * num) / den);

export type ParseResult = { ok: true; value: Cents | null } | { ok: false; error: string };

/**
 * Interpreta un importe escrito por una persona, en formato español o internacional sencillo:
 * «25000», «25.000», «25.000,50», «25000,5», «1234.56». Devuelve null si el campo está vacío.
 * Nunca convierte en cero un texto erróneo: devuelve un mensaje de error.
 */
export function parseAmount(raw: string): ParseResult {
  const text = raw.replace(/[\s €]/g, '');
  if (text === '') return { ok: true, value: null };
  if (/^[-−]/.test(text)) return { ok: false, error: 'Introduce un importe positivo o cero.' };

  let intPart: string;
  let decPart = '';
  if (text.includes(',')) {
    // Coma decimal; los puntos solo pueden ser separadores de miles bien agrupados.
    const [int, dec, extra] = text.split(',');
    if (extra !== undefined) return { ok: false, error: 'El importe tiene más de una coma decimal.' };
    if (!/^\d{1,3}(\.\d{3})*$/.test(int) && !/^\d+$/.test(int)) return { ok: false, error: 'Revisa el formato del importe (p. ej. 25.000,50).' };
    intPart = int.replace(/\./g, '');
    decPart = dec;
  } else if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
    intPart = text.replace(/\./g, ''); // «25.000»: separador de miles
  } else if (/^\d+\.\d{1,2}$/.test(text)) {
    [intPart, decPart] = text.split('.'); // «1234.5»: punto decimal
  } else if (/^\d+$/.test(text)) {
    intPart = text;
  } else {
    return { ok: false, error: 'Introduce solo cifras (p. ej. 25.000,50).' };
  }

  if (!/^\d*$/.test(decPart)) return { ok: false, error: 'Revisa los decimales del importe.' };
  if (decPart.length > 2) return { ok: false, error: 'Usa como máximo dos decimales.' };
  if (intPart === '' && decPart === '') return { ok: false, error: 'Introduce un importe válido.' };

  const cents = Number(intPart || '0') * 100 + Number(decPart.padEnd(2, '0') || '0');
  if (!Number.isSafeInteger(cents) || cents > MAX_CENTS) return { ok: false, error: 'El importe es demasiado alto para un periodo mensual.' };
  return { ok: true, value: cents };
}

const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2, useGrouping: 'always' } as Intl.NumberFormatOptions);
const eurShort = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, useGrouping: 'always' } as Intl.NumberFormatOptions);
const pct = new Intl.NumberFormat('es-ES', { style: 'percent', minimumFractionDigits: 1, maximumFractionDigits: 1 });
const pctShort = new Intl.NumberFormat('es-ES', { style: 'percent', minimumFractionDigits: 0, maximumFractionDigits: 1 });
const nbsp = (s: string) => s.replace(/ /g, ' ');

/** 2500000 → «25.000,00 €». */
export const formatEUR = (cents: Cents): string => nbsp(eur.format((cents === 0 ? 0 : cents) / 100));
/** 2500000 → «25.000 €» (ejes y etiquetas de gráficos). */
export const formatEURShort = (cents: Cents): string => nbsp(eurShort.format(Math.round(cents / 100) || 0));
/** 0.1234 → «12,3 %». */
export const formatPct = (ratio: number): string => nbsp(pct.format(Math.abs(ratio) < 0.0005 ? 0 : ratio));
/** 0.66 → «66 %», 0.123 → «12,3 %» (tablas del dashboard). */
export const formatPctShort = (ratio: number): string => nbsp(pctShort.format(Math.abs(ratio) < 0.0005 ? 0 : ratio));
/** Céntimos → texto editable en un campo («25000,5» → «25.000,50»). */
export const centsToInput = (cents: Cents): string => formatEUR(cents).replace(/\s?€$/, '');
