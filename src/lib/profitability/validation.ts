// Validación de los datos de la calculadora. Las mismas reglas sirven en el navegador (textos del formulario)
// y en el servidor (valores ya numéricos de una solicitud).

import { MAX_CENTS, parseAmount } from './money.ts';
import { FINANCIAL_KEYS, SECTORS, type Analysis, type CompanyInfo, type FinancialInputs, type FinancialKey, type Sector } from './types.ts';

export type Errors<K extends string> = Partial<Record<K, string>>;
export type Validated<T, K extends string> = { ok: true; value: T } | { ok: false; errors: Errors<K> };

/** Campos del formulario tal y como los escribe la persona. */
export type CompanyDraft = { sector: string; employees: string; periodKind: '' | 'month' | 'average'; month: string; year: string; name: string };
export type FinancialDraft = Record<FinancialKey, string> & { salariesIncludeSocialSecurity: boolean };

export const emptyCompany = (): CompanyDraft => ({ sector: '', employees: '', periodKind: '', month: '', year: '', name: '' });
export const emptyFinancials = (): FinancialDraft =>
  ({ ...Object.fromEntries(FINANCIAL_KEYS.map((k) => [k, ''])), salariesIncludeSocialSecurity: false }) as FinancialDraft;

export const MIN_YEAR = 2000;
export const maxYear = (now = new Date()) => now.getFullYear();
const MAX_EMPLOYEES = 1_000_000;
const MAX_NAME = 120;

/** Campos financieros obligatorios (el resto, vacíos, valen 0). */
export const REQUIRED_FINANCIAL: readonly FinancialKey[] = ['revenue'];

type CompanyField = 'sector' | 'employees' | 'periodKind' | 'month' | 'year' | 'name';

export function validateCompany(d: CompanyDraft, now = new Date()): Validated<CompanyInfo, CompanyField> {
  const errors: Errors<CompanyField> = {};
  if (!SECTORS.includes(d.sector as Sector)) errors.sector = 'Elige el sector de actividad.';

  const emp = d.employees.trim();
  if (emp === '') errors.employees = 'Indica el número de empleados (0 si no tienes).';
  else if (!/^\d+$/.test(emp)) errors.employees = 'Introduce un número entero sin decimales.';
  else if (Number(emp) > MAX_EMPLOYEES) errors.employees = 'Revisa el número de empleados.';

  if (d.periodKind === '') errors.periodKind = 'Elige el periodo analizado.';
  let month = 0;
  let year = 0;
  if (d.periodKind === 'month') {
    month = Number(d.month);
    year = Number(d.year);
    if (!Number.isInteger(month) || month < 1 || month > 12) errors.month = 'Elige el mes.';
    if (!/^\d{4}$/.test(d.year.trim()) || year < MIN_YEAR || year > maxYear(now)) errors.year = `Indica un año entre ${MIN_YEAR} y ${maxYear(now)}.`;
    else if (year === now.getFullYear() && month > now.getMonth() + 1) errors.month = 'Elige un mes que ya haya empezado.';
  }
  if (d.name.trim().length > MAX_NAME) errors.name = `Usa como máximo ${MAX_NAME} caracteres.`;

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      sector: d.sector as Sector,
      employees: Number(emp),
      period: d.periodKind === 'month' ? { kind: 'month', month, year } : { kind: 'average' },
      name: d.name.trim(),
    },
  };
}

export function validateFinancials(d: FinancialDraft): Validated<FinancialInputs, FinancialKey> {
  const errors: Errors<FinancialKey> = {};
  const values = {} as Record<FinancialKey, number>;
  for (const key of FINANCIAL_KEYS) {
    const parsed = parseAmount(d[key]);
    if (!parsed.ok) errors[key] = parsed.error;
    else if (parsed.value === null && REQUIRED_FINANCIAL.includes(key)) errors[key] = 'Este dato es obligatorio (puede ser 0).';
    else values[key] = parsed.value ?? 0;
  }
  if (Object.keys(errors).length) return { ok: false, errors };
  return { ok: true, value: { ...values, salariesIncludeSocialSecurity: d.salariesIncludeSocialSecurity } };
}

// ── Validación en el servidor de un análisis ya numérico (no confía en nada de lo que llega) ──

const isCents = (v: unknown): v is number => typeof v === 'number' && Number.isSafeInteger(v) && v >= 0 && v <= MAX_CENTS;

export function parseAnalysis(raw: unknown, now = new Date()): Analysis | null {
  if (!raw || typeof raw !== 'object') return null;
  const { company, inputs } = raw as Record<string, unknown>;
  if (!company || typeof company !== 'object' || !inputs || typeof inputs !== 'object') return null;

  const c = company as Record<string, unknown>;
  const p = c.period as Record<string, unknown> | undefined;
  const draft: CompanyDraft = {
    sector: typeof c.sector === 'string' ? c.sector : '',
    employees: typeof c.employees === 'number' && Number.isInteger(c.employees) ? String(c.employees) : '',
    periodKind: p?.kind === 'month' || p?.kind === 'average' ? p.kind : '',
    month: typeof p?.month === 'number' ? String(p.month) : '',
    year: typeof p?.year === 'number' ? String(p.year) : '',
    name: typeof c.name === 'string' ? c.name : '',
  };
  const companyOk = validateCompany(draft, now);
  if (!companyOk.ok) return null;

  const i = inputs as Record<string, unknown>;
  if (!FINANCIAL_KEYS.every((k) => isCents(i[k])) || typeof i.salariesIncludeSocialSecurity !== 'boolean') return null;
  const values = Object.fromEntries(FINANCIAL_KEYS.map((k) => [k, i[k] as number])) as Record<FinancialKey, number>;
  return { company: companyOk.value, inputs: { ...values, salariesIncludeSocialSecurity: i.salariesIncludeSocialSecurity } };
}
