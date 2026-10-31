'use client';

import type { Question } from '@/lib/pyme-check/questions';

const LETTERS = ['A', 'B', 'C'] as const;

/** Una pregunta con sus tres opciones (radios nativos: se recorren con las flechas del teclado). */
export function QuestionStep({ question, value, error, onChange }: { question: Question; value: 0 | 1 | 2 | null; error?: string; onChange: (v: 0 | 1 | 2) => void }) {
  const name = `q-${question.area}`;
  return (
    <fieldset aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="block w-full">
        <span className="num">
          {question.areaName}
        </span>
        <span id="pc-question" tabIndex={-1} className="mt-3 block font-serif text-[clamp(1.7rem,3.4vw,2.6rem)] leading-[1.1] tracking-tight outline-none">
          {question.question}
        </span>
      </legend>
      <div className="mt-8 grid gap-3">
        {question.options.map((label, i) => {
          const checked = value === i;
          return (
            <label
              key={label}
              className={`group flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-[border-color,background-color,transform] duration-300 ease-[var(--ease-out-expo)] has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest-900 has-[:focus-visible]:ring-offset-2 sm:p-5 ${
                checked ? 'border-forest-900 bg-forest-900 text-cream-50' : 'border-line bg-cream-50 hover:-translate-y-0.5 hover:border-forest-600'
              }`}
            >
              <input
                type="radio"
                name={name}
                id={`${name}-${i}`}
                value={i}
                checked={checked}
                onChange={() => onChange(i as 0 | 1 | 2)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[0.85rem] font-medium transition-colors ${
                  checked ? 'bg-gold-300 text-forest-950' : 'border border-line text-ink-soft group-hover:border-forest-600'
                }`}
              >
                {LETTERS[i]}
              </span>
              <span className="text-[1rem] leading-snug sm:text-[1.05rem]">{label}</span>
              {checked && (
                <svg className="ml-auto h-5 w-5 shrink-0 text-gold-300" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </label>
          );
        })}
      </div>
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-4 text-[0.9rem] text-loss">
          {error}
        </p>
      )}
    </fieldset>
  );
}
