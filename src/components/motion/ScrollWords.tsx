'use client';

import { m, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useRef } from 'react';
import { useStill } from './MotionProvider';

type Part = { text: string; em?: boolean };

/**
 * Texto que se ilumina palabra a palabra al hacer scroll: cada palabra pasa del color `from` al color `to`.
 * `from` debe mantener contraste AA sobre el fondo, para que el texto sea legible en cualquier punto.
 * Sin movimiento (sistema o «Pausar animaciones»): texto normal en el color `to`.
 */
export function ScrollWords({
  parts,
  as: Tag = 'p',
  className = '',
  from = '#666a66',
  to = '#1a1c1b',
  emClass = 'italic',
}: {
  parts: Part[] | string;
  as?: 'p' | 'h2' | 'blockquote';
  className?: string;
  from?: string;
  to?: string;
  emClass?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const still = useStill();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });

  const list: Part[] = typeof parts === 'string' ? [{ text: parts }] : parts;
  const words = list.flatMap((p) => p.text.split(/(\s+)/).map((w) => ({ w, em: p.em })));
  const total = words.filter((x) => x.w.trim()).length;
  let n = 0;

  const MotionTag = m[Tag];
  return (
    <MotionTag ref={ref as never} className={className} style={{ color: to }}>
      {words.map((x, k) => {
        if (!x.w.trim()) return x.w;
        const index = n++;
        const cls = x.em ? emClass : undefined;
        if (still) return <span key={k} className={cls}>{x.w}</span>;
        return <Word key={k} word={x.w} className={cls} progress={scrollYProgress} range={[index / total, (index + 1) / total]} colors={[from, to]} />;
      })}
    </MotionTag>
  );
}

function Word({
  word,
  className,
  progress,
  range,
  colors,
}: {
  word: string;
  className?: string;
  progress: MotionValue<number>;
  range: [number, number];
  colors: [string, string];
}) {
  const color = useTransform(progress, range, colors);
  return (
    <m.span className={className} style={{ color }}>
      {word}
    </m.span>
  );
}
