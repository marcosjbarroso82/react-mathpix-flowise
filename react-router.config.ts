import type { Config } from "@react-router/dev/config";

export default {
  // Config options...
  // Server-side render by default, to enable SPA mode set this to `false`
  ssr: false, // CRÍTICO: Debe ser false para GitHub Pages
  basename: process.env.NODE_ENV === 'production' ? '/react-webcam-mathpix-ocr-explorer' : '/',
} satisfies Config;
