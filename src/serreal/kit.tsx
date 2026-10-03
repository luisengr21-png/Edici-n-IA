import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import cues from './cues.json';
import plan from './plan.json';

// ───────────────────────── Tiempo ─────────────────────────
export const FPS = plan.fps;
export const DURATION = plan.duration;
export const SCENES = plan.scenes;

/** Inicio / fin de la frase i (s) */
export const S = (i: number) => cues[i].start;
export const E = (i: number) => cues[i].end;
/** Instante aproximado en que se pronuncia `word` dentro de la frase i (interpolación por caracteres) */
export const W = (i: number, word: string) => {
  const c = cues[i];
  const k = c.text.toLowerCase().indexOf(word.toLowerCase());
  if (k < 0) throw new Error(`"${word}" no está en la frase ${i}`);
  return c.start + (c.end - c.start) * (k / c.text.length);
};

export type SceneProps = {t: number; a: number; b: number};

// ───────────────────────── Paleta ─────────────────────────
export const C = {
  bg: '#11151c',
  bg2: '#181d27',
  grid: '#2a3140',
  line: '#3a4252',
  cream: '#e9e3d5',
  creamDim: '#b9b3a6',
  stone: '#5a6270',
  stoneLight: '#7c8594',
  stoneDark: '#3b414d',
  amber: '#f4b942',
  amberMuted: '#9c8a62',
  amberGlow: '#ffd27a',
  coral: '#e8604c',
  coralDark: '#9c3b2f',
  teal: '#3fb8af',
  tealDark: '#22706b',
  shadow: 'rgba(0,0,0,0.35)',
  night: '#0a0d12',
};

export const OSWALD = 'Oswald, "Arial Narrow", sans-serif';
if (typeof document !== 'undefined') {
  const h = delayRender('Oswald');
  Promise.all(
    ['400', '500', '600'].map((w) => {
      const f = new FontFace('Oswald', `url(${staticFile(`serreal/fonts/oswald-latin-${w}-normal.woff2`)}) format('woff2')`, {weight: w});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}

// ───────────────────────── Matemática y easing ─────────────────────────
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const easeInOut = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);
export const easeIn = (k: number) => k * k * k;
export const expoInOut = (k: number) =>
  k <= 0 ? 0 : k >= 1 ? 1 : k < 0.5 ? Math.pow(2, 20 * k - 10) / 2 : (2 - Math.pow(2, -20 * k + 10)) / 2;
export const easeOutBack = (k: number) => {
  const c1 = 1.70158;
  return 1 + (c1 + 1) * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
};
/** progreso lineal 0..1 desde t0 durante dur */
export const P = (t: number, t0: number, dur: number) => clamp((t - t0) / dur);
/** progreso con easeInOut */
export const PE = (t: number, t0: number, dur: number) => easeInOut(P(t, t0, dur));
/** progreso con easeOut */
export const PO = (t: number, t0: number, dur: number) => easeOut(P(t, t0, dur));
/** entra en t0 y sale en t1 (opacidad) */
export const inOut = (t: number, t0: number, t1: number, f = 0.5) => P(t, t0, f) * (1 - P(t, t1 - f, f));

export const rng = (seed: number) => {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
};
export const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
/** ruido suave 1D */
export const noise = (x: number, seed = 0) => {
  const i = Math.floor(x);
  const f = x - i;
  const u = f * f * (3 - 2 * f);
  return lerp(hash(i + seed * 57), hash(i + 1 + seed * 57), u) * 2 - 1;
};

export const mixHex = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(k))).toString(16).padStart(2, '0')).join('');
};

// ───────────────────────── Figuras ─────────────────────────
type FigProps = {
  x: number;
  y: number; // pies
  s?: number;
  color?: string;
  child?: number; // 0 adulto … 1 niño (cabeza proporcionalmente mayor)
  opacity?: number;
  shadow?: boolean;
  glow?: number;
  outline?: string;
  rot?: number;
  squash?: number;
  children?: React.ReactNode; // contenido dentro del cuerpo (coordenadas locales)
};

/** Figura plana sin rostro, vista lateral: cabeza redonda + cuerpo en cápsula. Origen en los pies. */
export const Fig: React.FC<FigProps> = ({x, y, s = 1, color = C.stone, child = 0, opacity = 1, shadow = true, glow = 0, outline, rot = 0, squash = 0, children}) => {
  const H = lerp(100, 70, child);
  const hr = lerp(14, 16, child);
  const bw = lerp(34, 32, child);
  const bodyTop = -H * 0.66;
  const headY = bodyTop - hr - 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(${rot}) scale(${1 + squash * 0.15} ${1 - squash * 0.15})`} opacity={opacity}>
      {shadow && <ellipse cx={0} cy={2} rx={bw * 0.9} ry={5} fill={C.shadow} />}
      {glow > 0 && (
        <g opacity={glow}>
          <circle cx={0} cy={bodyTop * 0.5} r={H * 0.9} fill="url(#srGlow)" />
        </g>
      )}
      <rect x={-bw / 2} y={bodyTop} width={bw} height={-bodyTop} rx={bw / 2} fill={color} stroke={outline} strokeWidth={outline ? 2.5 : 0} />
      <circle cx={0} cy={headY} r={hr} fill={color} stroke={outline} strokeWidth={outline ? 2.5 : 0} />
      {children}
    </g>
  );
};
/** Altura de la cabeza (centro) de una Fig, en coordenadas locales sin escalar */
export const figHeadY = (child = 0) => {
  const H = lerp(100, 70, child);
  return -H * 0.66 - lerp(14, 16, child) - 4;
};

/** Figura vista desde arriba: hombros + cabeza. dir = ángulo (grados) hacia donde mira. */
export const TopFig: React.FC<{x: number; y: number; s?: number; color?: string; dir?: number; opacity?: number; glow?: number}> = ({
  x,
  y,
  s = 1,
  color = C.stone,
  dir = 90,
  opacity = 1,
  glow = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${dir - 90})`} opacity={opacity}>
    {glow > 0 && <circle r={46} fill="url(#srGlow)" opacity={glow} />}
    <ellipse cx={4} cy={5} rx={21} ry={12} fill={C.shadow} />
    <ellipse cx={0} cy={0} rx={21} ry={12} fill={mixHex(color, '#000000', 0.18)} />
    <circle cx={0} cy={2.5} r={10} fill={color} stroke={mixHex(color, '#000000', 0.3)} strokeWidth={1.5} />
  </g>
);

// ───────────────────────── Iconos (centrados en 0,0, ~ 60 px) ─────────────────────────
export const Icon: React.FC<{name: string; x?: number; y?: number; s?: number; color?: string; opacity?: number; rot?: number; sw?: number}> = ({
  name,
  x = 0,
  y = 0,
  s = 1,
  color = C.cream,
  opacity = 1,
  rot = 0,
  sw = 4,
}) => {
  const st = {fill: 'none', stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const};
  let body: React.ReactNode = null;
  switch (name) {
    case 'heart':
      body = <path d="M0 22 C-34 0 -30 -26 -14 -26 C-6 -26 -2 -20 0 -15 C2 -20 6 -26 14 -26 C30 -26 34 0 0 22 Z" fill={color} />;
      break;
    case 'heartO':
      body = <path d="M0 22 C-34 0 -30 -26 -14 -26 C-6 -26 -2 -20 0 -15 C2 -20 6 -26 14 -26 C30 -26 34 0 0 22 Z" {...st} />;
      break;
    case 'thumb':
      body = (
        <g {...st}>
          <rect x={-26} y={-6} width={12} height={30} rx={2} fill={color} />
          <path d="M-10 -4 L0 -26 C6 -30 12 -26 10 -18 L6 -6 L22 -6 C28 -6 30 0 28 4 L22 22 C20 25 18 26 14 26 L-10 26 Z" fill={color} />
        </g>
      );
      break;
    case 'chain':
      body = (
        <g {...st}>
          <rect x={-30} y={-10} width={34} height={20} rx={10} transform="rotate(-35)" />
          <rect x={-4} y={-10} width={34} height={20} rx={10} transform="rotate(-35)" />
        </g>
      );
      break;
    case 'bulb':
      body = (
        <g {...st}>
          <path d="M-12 12 C-12 2 -22 -2 -22 -14 C-22 -27 -12 -34 0 -34 C12 -34 22 -27 22 -14 C22 -2 12 2 12 12 Z" />
          <line x1={-10} y1={20} x2={10} y2={20} />
          <line x1={-7} y1={27} x2={7} y2={27} />
        </g>
      );
      break;
    case 'mask':
      body = (
        <g>
          <path d="M-26 -24 C-10 -18 10 -18 26 -24 C28 0 18 26 0 28 C-18 26 -28 0 -26 -24 Z" fill={color} />
          <path d="M-15 -6 Q-10 -12 -5 -6" stroke={C.bg} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M5 -6 Q10 -12 15 -6" stroke={C.bg} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M-12 7 Q0 20 12 7" stroke={C.bg} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        </g>
      );
      break;
    case 'cap':
      body = (
        <g>
          <path d="M-34 -6 L0 -20 L34 -6 L0 8 Z" fill={color} />
          <path d="M-18 0 L-18 14 C-8 22 8 22 18 14 L18 0 L0 8 Z" fill={color} opacity={0.8} />
          <path d="M26 -3 L26 16" stroke={color} strokeWidth={3} />
          <circle cx={26} cy={18} r={3.5} fill={color} />
        </g>
      );
      break;
    case 'trophy':
      body = (
        <g>
          <path d="M-18 -26 L18 -26 L16 -4 C14 6 6 10 0 10 C-6 10 -14 6 -16 -4 Z" fill={color} />
          <path d="M-18 -20 C-32 -20 -30 -2 -14 -2 M18 -20 C32 -20 30 -2 14 -2" {...st} />
          <rect x={-4} y={10} width={8} height={10} fill={color} />
          <rect x={-14} y={20} width={28} height={7} rx={2} fill={color} />
        </g>
      );
      break;
    case 'star':
      body = <path d="M0 -30 L8.8 -12 L28.5 -9.3 L14.3 4.6 L17.6 24.3 L0 15 L-17.6 24.3 L-14.3 4.6 L-28.5 -9.3 L-8.8 -12 Z" fill={color} />;
      break;
    case 'ear':
      body = (
        <g {...st}>
          <path d="M-14 -6 C-14 -24 -2 -32 8 -32 C20 -32 26 -22 26 -12 C26 0 14 4 12 14 C10 24 4 30 -4 30 C-10 30 -14 26 -14 22" />
          <path d="M-2 -8 C-2 -16 4 -20 10 -18 C16 -16 16 -8 12 -4" />
        </g>
      );
      break;
    case 'bridge':
      body = (
        <g {...st}>
          <path d="M-34 4 Q0 -30 34 4" />
          <line x1={-36} y1={4} x2={36} y2={4} />
          <line x1={-20} y1={-8} x2={-20} y2={4} />
          <line x1={0} y1={-13} x2={0} y2={4} />
          <line x1={20} y1={-8} x2={20} y2={4} />
          <line x1={-26} y1={4} x2={-26} y2={24} />
          <line x1={26} y1={4} x2={26} y2={24} />
        </g>
      );
      break;
    case 'hand':
      body = (
        <g {...st}>
          <path d="M-16 26 L-20 4 C-22 -4 -14 -6 -12 0 L-10 6 L-10 -24 C-10 -30 -2 -30 -2 -24 L-2 -2 L-2 -30 C-2 -36 6 -36 6 -30 L6 -2 L6 -26 C6 -32 14 -32 14 -26 L14 0 L14 -18 C14 -24 22 -24 22 -18 L22 10 C22 20 16 26 8 26 Z" />
        </g>
      );
      break;
    case 'door':
      body = (
        <g {...st}>
          <rect x={-20} y={-30} width={40} height={60} />
          <path d="M-20 -30 L6 -24 L6 36 L-20 30 Z" fill={color} />
        </g>
      );
      break;
    case 'clap':
      body = (
        <g {...st}>
          <path d="M-20 24 L-26 -4 C-28 -12 -18 -14 -16 -6 L-14 2 L-18 -22 C-20 -30 -10 -32 -8 -24 L-2 0" />
          <path d="M20 24 L26 -4 C28 -12 18 -14 16 -6 L14 2 L18 -22 C20 -30 10 -32 8 -24 L2 0" />
          <path d="M-10 -36 L-12 -44 M0 -38 L0 -46 M10 -36 L12 -44" />
        </g>
      );
      break;
    case 'stage':
      body = (
        <g {...st}>
          <path d="M-34 20 L34 20 M-30 20 L-30 -28 L30 -28 L30 20" />
          <path d="M-30 -28 Q-18 -4 -14 20 M30 -28 Q18 -4 14 20" fill={color} />
        </g>
      );
      break;
    case 'bell':
      body = (
        <g>
          <path d="M-18 14 L-18 -4 C-18 -16 -10 -24 0 -24 C10 -24 18 -16 18 -4 L18 14 L24 20 L-24 20 Z" fill={color} />
          <circle cx={0} cy={26} r={5} fill={color} />
        </g>
      );
      break;
    case 'owl':
      body = (
        <g>
          <path d="M-22 26 L-22 -8 C-22 -22 -14 -28 0 -28 C14 -28 22 -22 22 -8 L22 26 Z" fill={color} />
          <path d="M-22 -26 L-14 -20 M22 -26 L14 -20" stroke={color} strokeWidth={4} />
          <circle cx={-9} cy={-10} r={7} fill={C.bg} />
          <circle cx={9} cy={-10} r={7} fill={C.bg} />
          <path d="M-3 -2 L0 4 L3 -2 Z" fill={C.bg} />
        </g>
      );
      break;
    case 'user':
      body = (
        <g>
          <circle cx={0} cy={-10} r={11} fill={color} />
          <path d="M-20 22 C-20 6 -10 2 0 2 C10 2 20 6 20 22 Z" fill={color} />
        </g>
      );
      break;
    case 'sparkle':
      body = <path d="M0 -24 C2 -6 6 -2 24 0 C6 2 2 6 0 24 C-2 6 -6 2 -24 0 C-6 -2 -2 -6 0 -24 Z" fill={color} />;
      break;
    default:
      body = null;
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
      {body}
    </g>
  );
};

// ───────────────────────── Texto con rotulador ─────────────────────────
/** Texto Oswald en mayúsculas (HTML absolute). `mark` = progreso 0..1 del rotulador bajo las palabras de `markWords`. */
export const Title: React.FC<{
  words: string[];
  markWords?: number[];
  mark?: number;
  size?: number;
  color?: string;
  markColor?: string;
  opacity?: number;
  y?: number;
  reveal?: number; // 0..1 aparición por palabras
  tracking?: number;
}> = ({words, markWords = [], mark = 0, size = 96, color = C.cream, markColor = C.amber, opacity = 1, y = 540, reveal = 1, tracking = 0.02}) => (
  <div
    style={{
      position: 'absolute',
      left: 120,
      right: 120,
      top: y,
      transform: 'translateY(-50%)',
      textAlign: 'center',
      fontFamily: OSWALD,
      fontWeight: 600,
      fontSize: size,
      lineHeight: 1.12,
      letterSpacing: `${tracking}em`,
      textTransform: 'uppercase',
      color,
      opacity,
    }}
  >
    {words.map((w, i) => {
      const k = clamp(reveal * words.length - i);
      const marked = markWords.includes(i);
      return (
        <span key={i} style={{display: 'inline-block', position: 'relative', margin: `0 ${size * 0.13}px`, opacity: k, transform: `translateY(${(1 - easeOut(k)) * size * 0.35}px)`}}>
          {marked && (
            <span
              style={{
                position: 'absolute',
                left: -size * 0.08,
                bottom: size * 0.08,
                height: size * 0.36,
                width: `calc(${mark * 100}% + ${size * 0.16 * mark}px)`,
                background: markColor,
                opacity: 0.9,
                borderRadius: 3,
                zIndex: 0,
              }}
            />
          )}
          <span style={{position: 'relative', zIndex: 1, color: marked && mark > 0.5 ? C.cream : color}}>{w}</span>
        </span>
      );
    })}
  </div>
);

// ───────────────────────── Utilidades SVG ─────────────────────────
/** Defs comunes: brillo radial ámbar, degradados */
export const Defs: React.FC = () => (
  <defs>
    <radialGradient id="srGlow">
      <stop offset="0" stopColor={C.amberGlow} stopOpacity={0.55} />
      <stop offset="0.45" stopColor={C.amber} stopOpacity={0.18} />
      <stop offset="1" stopColor={C.amber} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="srGlowTeal">
      <stop offset="0" stopColor={C.teal} stopOpacity={0.5} />
      <stop offset="1" stopColor={C.teal} stopOpacity={0} />
    </radialGradient>
    <radialGradient id="srWarm">
      <stop offset="0" stopColor="#ffcf86" stopOpacity={0.5} />
      <stop offset="0.5" stopColor="#f4b942" stopOpacity={0.12} />
      <stop offset="1" stopColor="#f4b942" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="srBeam" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffd890" stopOpacity={0.55} />
      <stop offset="1" stopColor="#ffd890" stopOpacity={0.06} />
    </linearGradient>
    <linearGradient id="srCold" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#9fc7ff" stopOpacity={0.35} />
      <stop offset="1" stopColor="#9fc7ff" stopOpacity={0.02} />
    </linearGradient>
    <radialGradient id="srSun">
      <stop offset="0" stopColor="#ffd27a" stopOpacity={0.9} />
      <stop offset="0.18" stopColor="#f4b942" stopOpacity={0.55} />
      <stop offset="0.45" stopColor="#e8604c" stopOpacity={0.22} />
      <stop offset="1" stopColor="#7a3a5a" stopOpacity={0} />
    </radialGradient>
    <radialGradient id="srPhone">
      <stop offset="0" stopColor="#8fb8ff" stopOpacity={0.45} />
      <stop offset="1" stopColor="#8fb8ff" stopOpacity={0} />
    </radialGradient>
    <linearGradient id="srSoil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#3a2a1c" stopOpacity={0.9} />
      <stop offset="1" stopColor="#140f0b" stopOpacity={0.95} />
    </linearGradient>
    <filter id="srBlur6" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
    <filter id="srBlur2" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="2" />
    </filter>
  </defs>
);

/** Trazo que se dibuja: p = 0..1 */
export const Draw: React.FC<{d: string; p: number; color?: string; w?: number; opacity?: number; dash?: string; cap?: 'round' | 'butt'}> = ({
  d,
  p,
  color = C.cream,
  w = 3,
  opacity = 1,
  cap = 'round',
}) =>
  p <= 0 ? null : (
    <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} fill="none" stroke={color} strokeWidth={w} strokeLinecap={cap} strokeLinejoin="round" opacity={opacity} />
  );

/** Grupo con cámara: centro de interés (cx,cy) llevado al centro de pantalla con zoom z */
export const Cam: React.FC<{cx?: number; cy?: number; z?: number; rot?: number; children: React.ReactNode}> = ({cx = 960, cy = 540, z = 1, rot = 0, children}) => (
  <g transform={`translate(960 540) rotate(${rot}) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>
);

/** Teléfono (contorno). Origen en el centro. */
export const Phone: React.FC<{x: number; y: number; w?: number; h?: number; color?: string; screen?: string; sw?: number; children?: React.ReactNode; opacity?: number}> = ({
  x,
  y,
  w = 120,
  h = 240,
  color = C.cream,
  screen = C.bg2,
  sw = 3,
  children,
  opacity = 1,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={w * 0.14} fill={screen} stroke={color} strokeWidth={sw} />
    <rect x={-w * 0.12} y={-h / 2 + h * 0.035} width={w * 0.24} height={h * 0.025} rx={h * 0.0125} fill={color} opacity={0.6} />
    {children}
  </g>
);

/** Pájaro simple (vuelo) */
export const Bird: React.FC<{x: number; y: number; s?: number; flap: number; color?: string}> = ({x, y, s = 1, flap, color = C.amber}) => {
  const w = Math.sin(flap) * 16;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-26 ${-w} Q-12 ${-w * 0.4 - 6} 0 0 Q12 ${-w * 0.4 - 6} 26 ${-w}`} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx={0} cy={2} rx={7} ry={5} fill={color} />
    </g>
  );
};
