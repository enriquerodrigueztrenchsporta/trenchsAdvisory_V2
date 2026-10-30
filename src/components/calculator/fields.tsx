'use client';

import type { ReactNode } from 'react';
import { centsToInput, parseAmount } from '@/lib/profitability/money';

const control =
  'w-full rounded-xl border bg-cream-50 px-4 py-3 text-[1rem] text-ink transition-[border-color,box-shadow] duration-300 placeholder:text-ink-mute/70 hover:border-forest-600 focus:border-forest-900 focus:outline-none focus:ring-2 focus:ring-forest-900/15';
const border = (error?: string) => (error ? 'border-loss' : 'border-line');

export const fieldIds = (id: string, hint?: ReactNode, error?: string) =>
  [hint ? `${id}-hint` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

export function FieldShell({ id, label, hint, error, optional, children }: { id: string; label: string; hint?: ReactNode; error?: string; optional?: boolean; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-[0.92rem] font-medium text-ink">
        {label}
        {optional && <span className="text-[0.78rem] font-normal text-ink-mute">Opcional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-[0.82rem] leading-snug text-ink-mute">
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

export function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-1.5 text-[0.84rem] text-loss">
      <svg className="mt-[0.2rem] h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 4.5v4M8 10.8v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

/** Importe en euros: acepta «25.000,50»; al salir del campo se normaliza el formato si es válido. */
export function MoneyField({
  id,
  label,
  value,
  onChange,
  onError,
  hint,
  error,
  optional = true,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onError: (e: string | undefined) => void;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  disabled?: boolean;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <div className="relative">
        <input
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0,00"
          disabled={disabled}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-required={!optional || undefined}
          aria-describedby={fieldIds(id, hint, error)}
          onChange={(e) => {
            onChange(e.target.value);
            if (error) onError(undefined);
          }}
          onBlur={() => {
            const r = parseAmount(value);
            if (!r.ok) onError(r.error);
            else if (r.value !== null) onChange(centsToInput(r.value));
          }}
          className={`${control} ${border(error)} pr-10 text-right tabular-nums disabled:cursor-not-allowed disabled:opacity-50`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true">
          €
        </span>
      </div>
    </FieldShell>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  optional,
  type = 'text',
  autoComplete,
  inputMode,
  maxLength,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  hint?: ReactNode;
  optional?: boolean;
  type?: 'text' | 'email' | 'tel';
  autoComplete?: string;
  inputMode?: 'numeric' | 'text' | 'email' | 'tel';
  maxLength?: number;
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error} optional={optional}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        aria-invalid={error ? true : undefined}
        aria-required={!optional || undefined}
        aria-describedby={fieldIds(id, hint, error)}
        onChange={(e) => onChange(e.target.value)}
        className={`${control} ${border(error)}`}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Selecciona…',
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  placeholder?: string;
}) {
  return (
    <FieldShell id={id} label={label} error={error}>
      <div className="relative">
        <select
          id={id}
          name={id}
          value={value}
          aria-invalid={error ? true : undefined}
          aria-required
          aria-describedby={fieldIds(id, undefined, error)}
          onChange={(e) => onChange(e.target.value)}
          className={`${control} ${border(error)} appearance-none pr-10 ${value ? '' : 'text-ink-mute'}`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-ink-mute" viewBox="0 0 12 12" aria-hidden="true">
          <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      </div>
    </FieldShell>
  );
}

export function Checkbox({
  id,
  checked,
  onChange,
  children,
  error,
  describedBy,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: ReactNode;
  error?: string;
  describedBy?: string;
}) {
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          aria-invalid={error ? true : undefined}
          aria-describedby={[error ? `${id}-error` : '', describedBy ?? ''].filter(Boolean).join(' ') || undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-[0.2rem] h-5 w-5 shrink-0 cursor-pointer rounded accent-forest-900"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9rem] leading-snug text-ink-soft">
          {children}
        </label>
      </div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

/** Nota explicativa dentro del formulario. */
export function Note({ children, tone = 'info', id }: { children: ReactNode; tone?: 'info' | 'warn'; id?: string }) {
  return (
    <p
      id={id}
      className={`flex gap-3 rounded-xl px-4 py-3 text-[0.86rem] leading-snug ${
        tone === 'warn' ? 'bg-gold-300/25 text-ink' : 'bg-cream-100 text-ink-soft'
      }`}
    >
      <svg className="mt-[0.15rem] h-4 w-4 shrink-0 text-forest-600" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 7.2v4M8 4.8v.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span>{children}</span>
    </p>
  );
}
