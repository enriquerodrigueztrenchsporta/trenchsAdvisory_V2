import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

// Imagen para compartir en redes (LinkedIn, etc.): logo, nombre y lema de la v1. Se genera al compilar como out/og.png.
export const dynamic = 'force-static';

const size = { width: 1200, height: 630 };

const font = (file: string) => readFileSync(join(process.cwd(), 'node_modules', file));

export function GET() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: 80, background: '#14261f', color: '#f5f3ee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <svg width="64" height="64" viewBox="0 0 648 648">
            <path fill="#f5f3ee" d="M0 0H247C247 60 262 110 290 210C310 290 318 340 322 387H0Z" />
            <path fill="#f5f3ee" d="M345 0H648V387H419C412 330 400 280 385 210C360 110 345 60 345 0Z" />
            <path fill="#f5f3ee" d="M0 432H327V485H0Z" />
            <path fill="#f5f3ee" d="M424 432H648V485H424Z" />
            <path fill="#9db5ac" d="M0 529H325L315 648H0Z" />
            <path fill="#9db5ac" d="M422 529H648V648H412Z" />
          </svg>
          <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Inter', fontSize: 26, letterSpacing: 9 }}>
            <span>TRENCHS</span>
            <span style={{ fontSize: 14, letterSpacing: 9, color: '#9db5ac', marginTop: 4 }}>ADVISORY</span>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontFamily: 'Newsreader', fontSize: 84, lineHeight: 1.02, letterSpacing: -2 }}>
          <span>Decisiones más inteligentes.</span>
          <span style={{ color: '#d4b778', fontStyle: 'italic' }}>Organizaciones más competitivas.</span>
        </div>
        <div style={{ display: 'flex', fontFamily: 'Inter', fontSize: 22, color: '#9db5ac', letterSpacing: 3 }}>
          CONSULTORÍA DE ESTRATEGIA, FINANZAS, DATOS E IA
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Newsreader', data: font('@fontsource/newsreader/files/newsreader-latin-300-normal.woff'), weight: 300, style: 'normal' },
        { name: 'Newsreader', data: font('@fontsource/newsreader/files/newsreader-latin-300-italic.woff'), weight: 300, style: 'italic' },
        { name: 'Inter', data: font('@fontsource/inter/files/inter-latin-300-normal.woff'), weight: 300, style: 'normal' },
      ],
    },
  );
}
