import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// ───────────── Biblia visual de «No es pereza, es burnout» ─────────────
// Los nombres de color se mantienen (gold, red, green…) para reutilizar los componentes del motor;
// aquí "gold" es la brasa naranja y "bg" la pizarra.
export const L = {
  bg: '#1B1F2A',
  bg2: '#262B39',
  gold: '#FF7A3D', // brasa
  goldL: '#FFB089',
  goldD: '#C2521D',
  cream: '#F5EFE6',
  red: '#EF4444',
  green: '#4ADE80', // verde batería
  greenL: '#86EFAC',
  mustard: '#E0A526', // sudadera del personaje
  ink: '#11141C',
  gray: '#7A7F8C', // ceniza
  ash: '#7A7F8C',
  amber: '#FBBF24',
  yellow: '#FACC15',
  night: '#1B1F2A',
  white: '#FFFFFF',
  skin: '#D9A27A',
  pink: '#FF8FB1',
  coral: '#FF6B6B',
  mint: '#7FD8C9',
  navy: '#1B1F2A',
  blue: '#60A5FA',
};
export const SANS = 'Montserrat, "Noto Color Emoji", "DejaVu Sans", sans-serif';
export const SERIF = '"Playfair Display", "Noto Color Emoji", Georgia, serif';
// Tipografía de títulos de este video (Envato: Rhino Rough). No trae ¿ ¡ · → ✓: caen a Montserrat.
export const TITLE = '"Rhino Rough", Montserrat, "Noto Color Emoji", "DejaVu Sans", sans-serif';
export const EMOJI = '"Noto Color Emoji", sans-serif';

const faces: [string, string, string, string, string][] = [
  ['Montserrat', 'lujo/fonts/montserrat-latin-600-normal.woff2', '600', 'normal', 'woff2'],
  ['Montserrat', 'lujo/fonts/montserrat-latin-800-normal.woff2', '800', 'normal', 'woff2'],
  ['Montserrat', 'lujo/fonts/montserrat-latin-900-normal.woff2', '900', 'normal', 'woff2'],
  ['Playfair Display', 'lujo/fonts/playfair-display-latin-700-normal.woff2', '700', 'normal', 'woff2'],
  ['Playfair Display', 'lujo/fonts/playfair-display-latin-900-normal.woff2', '900', 'normal', 'woff2'],
  ['Playfair Display', 'lujo/fonts/playfair-display-latin-700-italic.woff2', '700', 'italic', 'woff2'],
  ['Rhino Rough', 'burnout/fuentes/fuente_titulos.otf', '400', 'normal', 'opentype'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('Tipografías burnout');
  Promise.all(
    faces.map(([fam, file, weight, style, fmt]) => {
      const f = new FontFace(fam, `url(${staticFile(file)}) format('${fmt}')`, {weight, style});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}

// ───────────── tiempo y curvas ─────────────
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const pr = (t: number, t0: number, d = 0.5) => clamp((t - t0) / d);
export const eo = (t: number, t0: number, d = 0.5) => easeOut(pr(t, t0, d));
export const eio = (t: number, t0: number, d = 0.5) => easeInOut(pr(t, t0, d));
export const spr = (t: number, t0: number, freq = 2.2, damp = 0.45) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w = Math.PI * 2 * freq;
  const wd = w * Math.sqrt(1 - damp * damp);
  return 1 - Math.exp(-damp * w * x) * (Math.cos(wd * x) + ((damp * w) / wd) * Math.sin(wd * x));
};
export const wobble = (t: number, t0: number, amp = 1, freq = 3, damp = 4) => {
  const x = t - t0;
  if (x < 0) return 0;
  return amp * Math.exp(-x * damp) * Math.sin(x * freq * Math.PI * 2);
};
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const color = (c?: string) => (c && (L as any)[c]) || c;
