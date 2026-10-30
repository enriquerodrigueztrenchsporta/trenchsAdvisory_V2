'use client';

import { useMemo, useState } from 'react';
import { DiagnosisButton } from '@/components/ui/primitives';
import { computeMetrics, type FinancialInputs } from '@/lib/profitability/engine';
import { centsToInput, parseAmount } from '@/lib/profitability/money';
import { NEUTRAL, simulate, type Adjustments } from '@/lib/profitability/scenarios';
import { MoneyField } from './fields';
import { ProfitDashboard } from './ProfitDashboard';

type Key = keyof FinancialInputs;

const FIELDS: { key: Key; label: string; hint: string }[] = [
  { key: 'revenue', label: 'Facturación mensual', hint: 'Ventas del mes, sin IVA.' },
  { key: 'variableCosts', label: 'Costes variables', hint: 'Cambian con las ventas: compras, materias primas, comisiones…' },
  { key: 'fixedCosts', label: 'Gastos fijos', hint: 'Alquiler, suministros, software, seguros, gestoría…' },
  { key: 'staffCosts', label: 'Costes de personal', hint: 'Salarios brutos más Seguridad Social a cargo de la empresa.' },
];

/** Ejemplo de referencia: 25.000 € de facturación → 5.000 € de resultado. */
const EXAMPLE: FinancialInputs = { revenue: 2500000, variableCosts: 850000, fixedCosts: 450000, staffCosts: 700000 };
const EMPTY: Record<Key, string> = { revenue: '', variableCosts: '', fixedCosts: '', staffCosts: '' };

/**
 * Calculadora de Rentabilidad Empresarial: cuatro datos y un panel que se actualiza al escribir.
 * Todo el estado vive en memoria (sin localStorage, sin URL, sin analítica) y nada sale del navegador.
 */
export function Calculator() {
  const [draft, setDraft] = useState<Record<Key, string>>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<Key, string>>>({});
  const [adjustments, setAdjustments] = useState<Adjustments>(NEUTRAL);

  // Hace falta la facturación (puede ser 0) y ningún campo con errores; los vacíos cuentan como 0.
  const metrics = useMemo(() => {
    const values = {} as FinancialInputs;
    for (const { key } of FIELDS) {
      const r = parseAmount(draft[key]);
      if (!r.ok) return null;
      if (r.value === null && key === 'revenue') return null;
      values[key] = r.value ?? 0;
    }
    return computeMetrics(values);
  }, [draft]);
  const scenario = useMemo(() => (metrics ? simulate(metrics, adjustments) : null), [metrics, adjustments]);

  const fill = (v: FinancialInputs | null) => {
    setDraft(v ? (Object.fromEntries(FIELDS.map(({ key }) => [key, centsToInput(v[key])])) as Record<Key, string>) : EMPTY);
    setErrors({});
    setAdjustments(NEUTRAL);
  };

  return (
    <section aria-label="Calculadora" className="section !pt-12 md:!pt-16">
      <div className="wrap grid gap-6 lg:grid-cols-12 lg:items-start">
        <form className="rounded-[1.5rem] border border-line bg-cream-100 p-6 md:p-7 lg:sticky lg:top-24 lg:col-span-4" onSubmit={(e) => e.preventDefault()} noValidate>
          <div className="flex items-baseline justify-between gap-3">
            <p className="eyebrow">Datos del mes</p>
            <button type="button" className="text-[0.82rem] font-medium text-forest-900 underline-offset-4 hover:underline" onClick={() => fill(Object.values(draft).some(Boolean) ? null : EXAMPLE)}>
              {Object.values(draft).some(Boolean) ? 'Borrar' : 'Ver un ejemplo'}
            </button>
          </div>
          <div className="mt-6 space-y-5">
            {FIELDS.map((f) => (
              <MoneyField
                key={f.key}
                id={f.key}
                label={f.label}
                hint={f.hint}
                value={draft[f.key]}
                error={errors[f.key]}
                onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
                onError={(e) => setErrors((prev) => ({ ...prev, [f.key]: e }))}
              />
            ))}
          </div>
          <p className="mt-6 flex items-start gap-2 text-[0.78rem] leading-snug text-ink-mute">
            <svg className="mt-[0.1rem] h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" stroke="currentColor" strokeWidth="1.3" />
            </svg>
            Se calcula en tu navegador. No guardamos ni enviamos tus cifras.
          </p>
        </form>

        <div className="min-w-0 lg:col-span-8">
          <ProfitDashboard metrics={metrics} scenario={scenario} adjustments={adjustments} onAdjust={setAdjustments} />
          <div className="mt-6 flex flex-col items-start gap-4 rounded-[1.5rem] border border-line p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-serif text-[1.35rem] leading-tight tracking-tight">¿Quieres mejorar estos números?</p>
            <DiagnosisButton />
          </div>
        </div>
      </div>
    </section>
  );
}
