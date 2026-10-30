'use client';

import { SECTORS } from '@/lib/profitability/types';
import { MIN_YEAR, maxYear, type CompanyDraft, type Errors } from '@/lib/profitability/validation';
import { Note, SelectField, TextField } from './fields';

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

export type CompanyErrors = Errors<keyof CompanyDraft>;

/** Paso 1 · Información de la empresa. */
export function StepCompany({ draft, errors, onChange }: { draft: CompanyDraft; errors: CompanyErrors; onChange: (patch: Partial<CompanyDraft>) => void }) {
  const years = Array.from({ length: maxYear() - MIN_YEAR + 1 }, (_, i) => String(maxYear() - i));
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <SelectField id="sector" label="Sector de actividad" value={draft.sector} error={errors.sector} onChange={(sector) => onChange({ sector })} options={SECTORS.map((s) => ({ value: s, label: s }))} />
      <TextField
        id="employees"
        label="Número de empleados"
        inputMode="numeric"
        value={draft.employees}
        error={errors.employees}
        hint="Personas en plantilla. Indica 0 si trabajas por tu cuenta sin empleados."
        onChange={(employees) => onChange({ employees })}
      />
      <fieldset className="md:col-span-2" aria-describedby={['period-hint', errors.periodKind ? 'periodKind-error' : ''].join(' ').trim()}>
        <legend className="text-[0.92rem] font-medium text-ink">Periodo analizado</legend>
        <p id="period-hint" className="mt-1 text-[0.82rem] text-ink-mute">
          Todos los importes se refieren a un mes. No mezcles cifras anuales y mensuales.
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {(
            [
              ['month', 'Mes concreto', 'Las cifras de un mes determinado.'],
              ['average', 'Promedio mensual', 'La media de varios meses representativos.'],
            ] as const
          ).map(([value, label, desc]) => (
            <label
              key={value}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                draft.periodKind === value ? 'border-forest-900 bg-cream-100' : errors.periodKind ? 'border-loss' : 'border-line hover:border-forest-600'
              }`}
            >
              <input
                id={`period-${value}`}
                type="radio"
                name="periodKind"
                value={value}
                checked={draft.periodKind === value}
                onChange={() => onChange({ periodKind: value })}
                className="mt-1 h-4 w-4 accent-forest-900"
              />
              <span>
                <span className="block text-[0.95rem] font-medium">{label}</span>
                <span className="block text-[0.82rem] text-ink-mute">{desc}</span>
              </span>
            </label>
          ))}
        </div>
        {errors.periodKind && (
          <p id="periodKind-error" className="mt-2 text-[0.84rem] text-loss">
            {errors.periodKind}
          </p>
        )}
        {draft.periodKind === 'month' && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <SelectField id="month" label="Mes" value={draft.month} error={errors.month} onChange={(month) => onChange({ month })} options={MONTHS.map((m, i) => ({ value: String(i + 1), label: m }))} />
            <SelectField id="year" label="Año" value={draft.year} error={errors.year} onChange={(year) => onChange({ year })} options={years.map((y) => ({ value: y, label: y }))} />
          </div>
        )}
      </fieldset>
      <div className="md:col-span-2">
        <TextField
          id="companyName"
          label="Nombre de la empresa"
          optional
          autoComplete="organization"
          maxLength={120}
          value={draft.name}
          error={errors.name}
          hint="No es necesario para el diagnóstico."
          onChange={(name) => onChange({ name })}
        />
      </div>
      <div className="md:col-span-2">
        <Note>No comparamos tu empresa con medias sectoriales: el sector solo sirve para contextualizar el análisis si decides compartirlo.</Note>
      </div>
    </div>
  );
}
