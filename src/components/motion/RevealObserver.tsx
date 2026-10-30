'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Añade `.is-in` a los elementos `[data-reveal]` y `[data-draw]` cuando entran en pantalla. Un solo observador para
 * toda la página, en lugar de un componente animado por bloque: las apariciones cuestan cero JavaScript por sección.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]:not(.is-in), [data-draw]:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  return null;
}
