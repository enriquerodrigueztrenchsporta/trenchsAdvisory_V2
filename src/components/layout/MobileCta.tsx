'use client';

import { AnimatePresence, m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DiagnosisButton } from '@/components/ui/primitives';

/**
 * Acción principal siempre a mano en móvil: aparece tras el primer pantallazo y se oculta cuando el cierre
 * (#contacto, que ya tiene el botón) está en pantalla. No aparece en las páginas legales.
 */
export function MobileCta() {
  const pathname = usePathname();
  const [past, setPast] = useState(false);
  const [atClosing, setAtClosing] = useState(false);
  const legal = pathname.startsWith('/legal');

  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const closing = document.getElementById('contacto');
    const io = closing ? new IntersectionObserver(([e]) => setAtClosing(e.isIntersecting)) : null;
    if (closing) io?.observe(closing);
    else setAtClosing(false);
    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
    };
  }, [pathname]);

  const show = past && !atClosing && !legal;
  return (
    <AnimatePresence>
      {show && (
        <m.div
          initial={{ y: '120%' }}
          animate={{ y: 0 }}
          exit={{ y: '120%' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="flex justify-center">
            <DiagnosisButton className="w-full justify-between shadow-[0_20px_40px_-12px_rgb(20_38_31/0.5)] sm:w-auto" />
          </div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
