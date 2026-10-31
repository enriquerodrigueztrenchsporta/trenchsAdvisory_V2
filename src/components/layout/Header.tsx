'use client';

import { AnimatePresence, m } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from '@/components/brand/Logo';
import { Arrow, DiagnosisButton, TextLink, pad } from '@/components/ui/primitives';
import { MENU_FEATURES } from '@/content/firm';
import { FIRMA_NAV, SERVICES } from '@/content/services';
import { TOOLS, TOOLS_INTRO, toolPath } from '@/content/tools';

const MENUS = [
  {
    id: 'servicios',
    label: 'Servicios',
    prefix: '/servicios/',
    feature: MENU_FEATURES.servicios,
    items: SERVICES.map((s) => ({ name: s.name, subtitle: s.subtitle, href: `/servicios/${s.slug}` })),
  },
  {
    id: 'firma',
    label: 'La firma',
    prefix: '/firma/',
    feature: MENU_FEATURES.firma,
    items: FIRMA_NAV.map((f) => ({ name: f.name, subtitle: f.subtitle, href: f.path })),
  },
  {
    id: 'herramientas',
    label: TOOLS_INTRO.kicker,
    prefix: '/herramientas/',
    // Además del texto, enlace a la página que reúne todas las herramientas.
    feature: { kicker: TOOLS_INTRO.kicker, text: TOOLS_INTRO.title, more: { label: 'Ver todas las herramientas', href: '/herramientas' } },
    items: TOOLS.map((t) => ({ name: t.name, subtitle: t.summary, href: toolPath(t) })),
  },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;
const norm = (p: string) => p.replace(/\/$/, '') || '/';

export function Header() {
  const pathname = norm(usePathname());
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const leave = useRef<number | undefined>(undefined);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Al cambiar de página se cierran los menús.
  useEffect(() => {
    setOpen(null);
    setMobile(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (open) {
        headerRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="dd-${open}"]`)?.focus();
        setOpen(null);
      } else if (mobile) {
        setMobile(false);
        headerRef.current?.querySelector<HTMLButtonElement>('[aria-controls="menu-movil"]')?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!headerRef.current?.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [open, mobile]);

  const solid = scrolled || open !== null;
  const light = !solid && !mobile; // texto claro sobre la cabecera oscura de cada página

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
        solid ? 'bg-cream-50/90 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl' : 'bg-transparent'
      } ${light ? 'on-dark text-cream-50' : ''} ${mobile ? 'text-cream-50' : ''}`}
    >
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Logo inverse={light || mobile} className="relative z-10" />

        <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-1">
            {MENUS.map((menu) => {
              const active = pathname.startsWith(menu.prefix.replace(/\/$/, ''));
              const isOpen = open === menu.id;
              return (
                <li
                  key={menu.id}
                  onPointerEnter={(e) => {
                    if (e.pointerType !== 'mouse') return;
                    window.clearTimeout(leave.current);
                    setOpen(menu.id);
                  }}
                  onPointerLeave={(e) => {
                    if (e.pointerType !== 'mouse') return;
                    leave.current = window.setTimeout(() => setOpen((o) => (o === menu.id ? null : o)), 160);
                  }}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`dd-${menu.id}`}
                    onClick={() => setOpen(isOpen ? null : menu.id)}
                    className="relative inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-[0.92rem] font-medium transition-colors hover:bg-current/[0.07]"
                  >
                    {menu.label}
                    <svg
                      viewBox="0 0 12 12"
                      className={`h-3 w-3 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    >
                      <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                    {active && <span className="absolute inset-x-4 -bottom-0.5 h-px bg-gold-500" aria-hidden="true" />}
                  </button>
                  {/* Siempre en el HTML (contenido indexable); cerrado queda oculto con visibility. */}
                  <div
                    id={`dd-${menu.id}`}
                    className={`absolute inset-x-0 top-full border-t border-line bg-cream-50 text-ink shadow-[0_40px_60px_-40px_rgb(20_38_31/0.35)] transition-[opacity,transform,visibility] duration-300 ease-[var(--ease-out-expo)] ${
                      isOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                    }`}
                  >
                        <div className="wrap grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-12 py-10">
                          <div className="border-r border-line pr-12">
                            <p className="eyebrow">{menu.feature.kicker}</p>
                            <p className="mt-5 font-serif text-[1.65rem] leading-tight tracking-tight">{menu.feature.text}</p>
                            {'more' in menu.feature && (
                              <TextLink href={menu.feature.more.href} className="mt-6 text-[0.9rem]">
                                {menu.feature.more.label}
                              </TextLink>
                            )}
                          </div>
                          <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                            {menu.items.map((item, i) => {
                              const current = pathname === norm(item.href);
                              return (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    aria-current={current ? 'page' : undefined}
                                    className="group flex gap-4 rounded-xl p-4 transition-colors hover:bg-cream-100"
                                  >
                                    <span className="num pt-1">{pad(i + 1)}</span>
                                    <span className="flex-1">
                                      <span className="flex items-center gap-2 font-serif text-[1.25rem] leading-tight">
                                        {item.name}
                                        <Arrow className="h-3 w-3 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
                                      </span>
                                      <span className="mt-1 block text-[0.88rem] text-ink-soft">{item.subtitle}</span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <DiagnosisButton size="sm" variant={light ? 'light' : 'dark'} className="ml-4" />
        </nav>

        <button
          type="button"
          className="relative z-10 grid h-11 w-11 place-items-center rounded-full lg:hidden"
          aria-expanded={mobile}
          aria-controls="menu-movil"
          onClick={() => setMobile((v) => !v)}
        >
          <span className="sr-only">{mobile ? 'Cerrar menú' : 'Abrir menú'}</span>
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${mobile ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 h-px w-6 bg-current transition-transform duration-500 ${mobile ? 'top-1.5 -rotate-45' : 'top-3'}`} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {mobile && (
          <m.nav
            id="menu-movil"
            aria-label="Principal"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease }}
            className="on-dark fixed inset-0 overflow-y-auto bg-forest-950 pt-[4.5rem] text-cream-50 lg:hidden"
          >
            <div className="wrap flex min-h-full flex-col gap-10 pb-10 pt-6">
              {MENUS.map((menu, k) => (
                <div key={menu.id}>
                  <p className="eyebrow">{menu.label}</p>
                  <ul className="mt-3">
                    {menu.items.map((item, i) => (
                      <m.li
                        key={item.href}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + (k * 5 + i) * 0.035, duration: 0.6, ease }}
                      >
                        <Link
                          href={item.href}
                          aria-current={pathname === norm(item.href) ? 'page' : undefined}
                          className="flex items-baseline gap-4 border-b border-cream-50/10 py-3 font-serif text-[1.6rem] leading-tight"
                        >
                          <span className="num">{pad(i + 1)}</span>
                          {item.name}
                        </Link>
                      </m.li>
                    ))}
                  </ul>
                </div>
              ))}
              <div className="mt-auto">
                <DiagnosisButton variant="light" />
              </div>
            </div>
          </m.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
