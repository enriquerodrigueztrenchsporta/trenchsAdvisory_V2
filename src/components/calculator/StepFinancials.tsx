'use client';

import type { ReactNode } from 'react';
import { formatEUR, parseAmount } from '@/lib/profitability/money';
import type { FinancialKey } from '@/lib/profitability/types';
import type { Errors, FinancialDraft } from '@/lib/profitability/validation';
import { Checkbox, MoneyField, Note } from './fields';

type Field = { key: FinancialKey; label: string; hint?: string };

const GROUPS: { id: string; title: string; note?: ReactNode; fields: Field[] }[] = [
  {
    id: 'ingresos',
    title: 'Ingresos',
    fields: [{ key: 'revenue', label: 'Facturación mensual', hint: 'Ventas del mes sin IVA. Obligatorio: si no hubo ventas, indica 0.' }],
  },
  {
    id: 'variables',
    title: 'Costes variables',
    note: 'Los costes variables son aquellos que cambian en función del volumen de actividad.',
    fields: [
      { key: 'purchases', label: 'Compras y materias primas', hint: 'Mercancía, ingredientes, materiales…' },
      { key: 'salesCosts', label: 'Costes directamente asociados a ventas', hint: 'Comisiones, envíos, comisiones de pago, embalajes…' },
      { key: 'otherVariable', label: 'Otros costes variables' },
    ],
  },
  {
    id: 'fijos',
    title: 'Gastos fijos',
    note: 'Los gastos fijos permanecen relativamente estables dentro del volumen de actividad analizado.',
    fields: [
      { key: 'rent', label: 'Alquiler' },
      { key: 'utilities', label: 'Suministros fijos', hint: 'Luz, agua, telefonía e internet.' },
      { key: 'software', label: 'Software y suscripciones' },
      { key: 'insurance', label: 'Seguros', hint: 'Si pagas una prima anual, indica su parte mensual.' },
      { key: 'marketing', label: 'Marketing fijo' },
      { key: 'otherFixed', label: 'Otros gastos fijos', hint: 'Gestoría, mantenimiento, cuotas…' },
    ],
  },
  {
    id: 'personal',
    title: 'Personal',
    note: (
      <>
        En esta versión, los costes de personal se consideran <strong className="font-semibold text-ink">fijos</strong>: no cambian con el volumen de
        ventas a corto plazo.
      </>
    ),
    fields: [
      { key: 'salaries', label: 'Salarios brutos', hint: 'Suma mensual de los salarios brutos de la plantilla.' },
      { key: 'socialSecurity', label: 'Seguridad Social a cargo de la empresa' },
      { key: 'otherStaff', label: 'Otros costes fijos de personal', hint: 'Formación, dietas fijas, seguros del personal…' },
    ],
  },
];

const sum = (draft: FinancialDraft, keys: FinancialKey[]) => {
  let total = 0;
  for (const k of keys) {
    const r = parseAmount(draft[k]);
    if (!r.ok) return null;
    total += r.value ?? 0;
  }
  return total;
};

/** Paso 2 · Información financiera (importes mensuales sin IVA). */
export function StepFinancials({
  draft,
  errors,
  onChange,
  onError,
}: {
  draft: FinancialDraft;
  errors: Errors<FinancialKey>;
  onChange: (patch: Partial<FinancialDraft>) => void;
  onError: (key: FinancialKey, error: string | undefined) => void;
}) {
  const ssIncluded = draft.salariesIncludeSocialSecurity;
  return (
    <div className="space-y-10">
      <Note>Todos los importes en euros, sin IVA y referidos al periodo mensual elegido. Los campos vacíos cuentan como 0.</Note>
      {GROUPS.map((g) => {
        const keys = g.fields.map((f) => f.key).filter((k) => !(k === 'socialSecurity' && ssIncluded));
        const subtotal = g.id === 'ingresos' ? null : sum(draft, keys);
        return (
          <fieldset key={g.id} className="rounded-[1.25rem] border border-line p-5 md:p-7">
            <legend className="px-2 font-serif text-[1.5rem] leading-none tracking-tight">{g.title}</legend>
            {g.note && <p className="mt-1 max-w-2xl text-[0.9rem] text-ink-soft">{g.note}</p>}
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {g.fields.map((f) => (
                <MoneyField
                  key={f.key}
                  id={f.key}
                  label={f.label}
                  hint={f.key === 'socialSecurity' && ssIncluded ? 'No se suma: ya está incluida en los salarios.' : f.hint}
                  optional={f.key !== 'revenue'}
                  disabled={f.key === 'socialSecurity' && ssIncluded}
                  value={draft[f.key]}
                  error={errors[f.key]}
                  onChange={(v) => onChange({ [f.key]: v })}
                  onError={(e) => onError(f.key, e)}
                />
              ))}
            </div>
            {g.id === 'personal' && (
              <div className="mt-6 space-y-3">
                <Checkbox id="ssIncluded" checked={ssIncluded} onChange={(v) => onChange({ salariesIncludeSocialSecurity: v })}>
                  El importe de salarios ya incluye la Seguridad Social a cargo de la empresa (por ejemplo, si usas el «coste empresa» de tus
                  nóminas).
                </Checkbox>
                <Note tone="warn">
                  Para no contar dos veces las cotizaciones: si tu cifra de salarios es el coste total para la empresa, marca la casilla; si es
                  el salario bruto, indica la Seguridad Social a cargo de la empresa por separado.
                </Note>
              </div>
            )}
            {subtotal !== null && (
              <p className="mt-6 flex items-center justify-between border-t border-line pt-4 text-[0.9rem] text-ink-soft">
                <span>Total {g.title.toLowerCase()}</span>
                <span className="font-medium tabular-nums text-ink">{formatEUR(subtotal)}</span>
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
