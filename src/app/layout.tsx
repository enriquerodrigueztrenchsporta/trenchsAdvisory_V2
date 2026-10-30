import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { MobileCta } from '@/components/layout/MobileCta';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { RevealObserver } from '@/components/motion/RevealObserver';
import { SITE_NAME, SITE_URL, asset } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: 'Trenchs Advisory · Consultoría de estrategia, finanzas, datos e IA',
    template: `%s · ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  icons: { icon: asset('/favicon.svg') },
  openGraph: { type: 'website', locale: 'es_ES', siteName: SITE_NAME },
  twitter: { card: 'summary_large_image' },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: '#1F3A33',
  width: 'device-width',
  initialScale: 1,
};

// @font-face aquí (y no en globals.css) para que las URLs lleven el prefijo BASE_PATH.
const fontFaces = `
@font-face{font-family:'Newsreader';font-style:normal;font-weight:300;font-display:swap;src:url('${asset('/fonts/newsreader-300.woff2')}') format('woff2')}
@font-face{font-family:'Newsreader';font-style:italic;font-weight:300;font-display:swap;src:url('${asset('/fonts/newsreader-300-italic.woff2')}') format('woff2')}
@font-face{font-family:'Inter';font-style:normal;font-weight:100 900;font-display:swap;src:url('${asset('/fonts/inter-var.woff2')}') format('woff2')}
`;

// Antes de pintar: activa las apariciones solo si hay JavaScript y recupera «Pausar animaciones» (v1: localStorage.motion).
const boot = `document.documentElement.classList.add('js');try{if(localStorage.getItem('motion')==='paused')document.documentElement.classList.add('motion-paused')}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preload" href={asset('/fonts/newsreader-300.woff2')} as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href={asset('/fonts/inter-var.woff2')} as="font" type="font/woff2" crossOrigin="anonymous" />
        <style dangerouslySetInnerHTML={{ __html: fontFaces }} />
        <script dangerouslySetInnerHTML={{ __html: boot }} />
      </head>
      <body>
        <a className="skip-link" href="#contenido">
          Saltar al contenido
        </a>
        <MotionProvider>
          <Header />
          <main id="contenido" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <MobileCta />
          <RevealObserver />
        </MotionProvider>
      </body>
    </html>
  );
}
