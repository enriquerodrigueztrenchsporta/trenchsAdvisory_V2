import type { NextConfig } from 'next';

// Web estática: mismas rutas que la v1 (/ruta/index.html). BASE_PATH permite servirla bajo una subruta
// (p. ej. /Trenchs-Advisory en GitHub Pages); con dominio propio se deja vacío.
const basePath = process.env.BASE_PATH ?? '';

const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  poweredByHeader: false,
  reactStrictMode: true,
};

export default config;
