'use client';

import { centsToInput, parseAmount } from '@/lib/profitability/money';

/** Importe en euros: acepta «25.000,50»; al salir del campo se normaliza el formato si es válido. */
export function MoneyField({
  id,
  label,
  hint,
  value,
  error,
  onChange,
  onError,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChange: (v: string) => void;
  onError: (e: string | undefined) => void;
}) {
  const describedBy = [`${id}-hint`, error ? `${id}-error` : ''].filter(Boolean).join(' ');
  return (
    <div>
      <label htmlFor={id} className="block text-[0.92rem] font-medium text-ink">
        {label}
      </label>
      <p id={`${id}-hint`} className="mt-0.5 text-[0.8rem] text-ink-mute">
        {hint}
      </p>
      <div className="relative mt-2">
        <input
          id={id}
          name={id}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={value}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={(e) => {
            onChange(e.target.value);
            const r = parseAmount(e.target.value);
            onError(r.ok ? undefined : r.error);
          }}
          onBlur={() => {
            const r = parseAmount(value);
            if (r.ok && r.value !== null) onChange(centsToInput(r.value));
          }}
          className={`w-full rounded-xl border bg-cream-50 py-3 pl-4 pr-10 text-right text-[1.05rem] tabular-nums text-ink transition-[border-color,box-shadow] duration-300 placeholder:text-ink-mute/60 hover:border-forest-600 focus:outline-none focus:ring-2 ${
            error ? 'border-loss focus:ring-loss/20' : 'border-line focus:border-forest-900 focus:ring-forest-900/15'
          }`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-mute" aria-hidden="true">
          €
        </span>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[0.82rem] text-loss">
          {error}
        </p>
      )}
    </div>
  );
}
