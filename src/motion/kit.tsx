import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// ───────────────────────── Paleta y tipografía ─────────────────────────
export const M = {
  bg: '#0F1226',
  bg2: '#1A1E40',
  bg3: '#262B57',
  coral: '#FF5A5F',
  mint: '#2EE6A6',
  violet: '#7B61FF',
  amber: '#FFC845',
  cyan: '#3DD5F3',
  white: '#F5F7FF',
  gray: '#4A5075',
  grayLight: '#8C92B0',
  red: '#FF3B4E',
  ink: '#0A0C1A',
  peach: '#FFB38A',
  rose: '#FF7EA1',
};
export const PALETTE = [M.coral, M.mint, M.violet, M.amber, M.cyan, M.rose];
export const FONT = 'Poppins, "DejaVu Sans", sans-serif';
export const GOTH = 'UnifrakturMaguntia, serif';

const faces: [string, string, string][] = [
  ['Poppins', 'Poppins-500.woff', '500'],
  ['Poppins', 'Poppins-700.woff', '700'],
  ['Poppins', 'Poppins-800.woff', '800'],
  ['Poppins', 'Poppins-900.woff', '900'],
  ['UnifrakturMaguntia', 'Unifraktur.woff', '400'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('Tipografías motion');
  Promise.all(
    faces.map(([fam, file, weight]) => {
      const f = new FontFace(fam, `url(${staticFile(`motion/fonts/${file}`)}) format('woff')`, {weight});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}

// ───────────────────────── Tiempo, easing y resortes ─────────────────────────
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const pr = (t: number, t0: number, dur = 0.5) => clamp((t - t0) / dur);
export const eo = (t: number, t0: number, dur = 0.5) => easeOut(pr(t, t0, dur));
export const eio = (t: number, t0: number, dur = 0.5) => easeInOut(pr(t, t0, dur));

/** Resorte amortiguado analítico: 0 → 1 con rebote (overshoot). */
export const spr = (t: number, t0: number, freq = 2.0, damp = 0.45) => {
  const x = t - t0;
  if (x <= 0) return 0;
  const w = Math.PI * 2 * freq;
  const z = damp;
  const wd = w * Math.sqrt(1 - z * z);
  return 1 - Math.exp(-z * w * x) * (Math.cos(wd * x) + ((z * w) / wd) * Math.sin(wd * x));
};
/** Oscilación amortiguada que arranca en t0 (para sacudidas y bamboleos) */
export const wobble = (t: number, t0: number, amp = 1, freq = 3, damp = 5) => {
  const x = t - t0;
  if (x < 0) return 0;
  return amp * Math.exp(-x * damp) * Math.sin(x * freq * Math.PI * 2);
};
/** Ruido determinista 0..1 */
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};

export const tint = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(c + (255 - c) * k);
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};
export const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(c * (1 - k));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

// ───────────────────────── Definiciones globales ─────────────────────────
export const MotionDefs: React.FC = () => (
  <defs>
    <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="9" />
    </filter>
    <filter id="bloomBig" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="22" />
    </filter>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="150%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="10" />
      <feOffset dy="12" result="o" />
      <feFlood floodColor="#000" floodOpacity="0.35" />
      <feComposite in2="o" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    <pattern id="dots" width="48" height="48" patternUnits="userSpaceOnUse">
      <circle cx="24" cy="24" r="2" fill="#ffffff" opacity="0.07" />
    </pattern>
    <radialGradient id="bgNight" cx="0.5" cy="0.45" r="0.75">
      <stop offset="0" stopColor={M.bg3} />
      <stop offset="0.55" stopColor={M.bg2} />
      <stop offset="1" stopColor={M.bg} />
    </radialGradient>
    <radialGradient id="bgPlum" cx="0.5" cy="0.4" r="0.8">
      <stop offset="0" stopColor="#4A3270" />
      <stop offset="0.6" stopColor="#2A1E4A" />
      <stop offset="1" stopColor="#170F2C" />
    </radialGradient>
    <linearGradient id="bgWarm" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFC9A3" />
      <stop offset="1" stopColor="#FF8FA8" />
    </linearGradient>
    <linearGradient id="bgAmber" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#FFD56B" />
      <stop offset="1" stopColor="#FFB547" />
    </linearGradient>
  </defs>
);

/** Fondo: degradado + retícula de puntos que deriva + motas flotantes */
export const Bg: React.FC<{t: number; kind?: 'night' | 'plum' | 'warm' | 'amber' | 'gray'; motes?: boolean}> = ({t, kind = 'night', motes = true}) => {
  const fill = kind === 'night' ? 'url(#bgNight)' : kind === 'plum' ? 'url(#bgPlum)' : kind === 'warm' ? 'url(#bgWarm)' : kind === 'amber' ? 'url(#bgAmber)' : '#2B2F45';
  const dark = kind === 'night' || kind === 'plum' || kind === 'gray';
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1480} fill={fill} />
      <g transform={`translate(${(t * 6) % 48} ${(t * 4) % 48})`} opacity={dark ? 1 : 0.6}>
        <rect x={-248} y={-248} width={2420} height={1580} fill="url(#dots)" />
      </g>
      {motes
        ? Array.from({length: 26}, (_, i) => {
            const x = (hash(i) * 2000 + t * (6 + hash(i + 9) * 14)) % 2000 - 40;
            const y = (hash(i + 3) * 1160 - t * (4 + hash(i + 5) * 10) + 2320) % 1160 - 40;
            return <circle key={i} cx={x} cy={y} r={1.5 + hash(i + 7) * 2.5} fill={dark ? '#ffffff' : '#ffffff'} opacity={0.1 + hash(i + 11) * 0.18} />;
          })
        : null}
    </g>
  );
};

// ───────────────────────── Cámara ─────────────────────────
type CamState = {cx: number; cy: number; z: number; rot: number; sx: number; sy: number};
const CamCtx = React.createContext<CamState>({cx: 960, cy: 540, z: 1, rot: 0, sx: 0, sy: 0});

export const Cam: React.FC<{t: number; keys: [number, number, number, number][]; shake?: [number, number][]; rot?: number; children: React.ReactNode}> = ({t, keys, shake = [], rot = 0, children}) => {
  let st: CamState = {cx: keys[0][1], cy: keys[0][2], z: keys[0][3], rot, sx: 0, sy: 0};
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0, z0] = keys[i];
    const [t1, x1, y1, z1] = keys[i + 1];
    if (t >= t0) {
      const k = easeInOut(clamp((t - t0) / Math.max(0.001, t1 - t0)));
      // zoom interpolado en escala logarítmica: los acercamientos grandes se sienten naturales
      st = {...st, cx: lerp(x0, x1, k), cy: lerp(y0, y1, k), z: Math.exp(lerp(Math.log(z0), Math.log(z1), k))};
    }
  }
  for (const [at, amp] of shake) {
    st.sx += wobble(t, at, amp, 7.3, 6);
    st.sy += wobble(t, at + 0.03, amp * 0.8, 6.1, 6);
  }
  return <CamCtx.Provider value={st}>{children}</CamCtx.Provider>;
};

export const Layer: React.FC<{depth?: number; children: React.ReactNode}> = ({depth = 1, children}) => {
  const {cx, cy, z, rot, sx, sy} = React.useContext(CamCtx);
  const ze = 1 + (z - 1) * depth;
  const ox = 960 + (cx - 960) * depth;
  const oy = 540 + (cy - 540) * depth;
  return <g transform={`translate(${960 + sx} ${540 + sy}) rotate(${rot * depth}) scale(${ze}) translate(${-ox} ${-oy})`}>{children}</g>;
};

// ───────────────────────── Personajes: tokens ─────────────────────────
export const Token: React.FC<{
  x: number;
  y: number;
  s?: number;
  color: string;
  head?: string;
  p?: number; // aparición (0..1, admite rebote)
  sad?: boolean;
  squash?: number;
  opacity?: number;
  lean?: number;
  shadow?: boolean;
  children?: React.ReactNode; // accesorios, en coordenadas del token
}> = ({x, y, s = 1, color, head, p = 1, sad, squash = 0, opacity = 1, lean = 0, shadow = true, children}) => {
  if (p <= 0.001) return null;
  const hy = sad ? -128 : -140;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * p * (1 - squash * 0.4)} ${s * p * (1 + squash)})`} opacity={opacity}>
      {shadow ? <ellipse cx={0} cy={2} rx={46} ry={9} fill="#000" opacity={0.28} /> : null}
      <g transform={`rotate(${lean + (sad ? 6 : 0)} 0 0)`}>
        <rect x={-35} y={-100} width={70} height={100} rx={35} fill={color} />
        <rect x={-35} y={-100} width={30} height={100} rx={15} fill="#ffffff" opacity={0.12} />
        <circle cx={sad ? 4 : 0} cy={hy} r={28} fill={head ?? tint(color, 0.35)} />
        <circle cx={(sad ? 4 : 0) - 10} cy={hy - 10} r={8} fill="#ffffff" opacity={0.25} />
        {children}
      </g>
    </g>
  );
};

// ───────────────────────── Iconos de línea ─────────────────────────
const circ = (cx: number, cy: number, r: number) => `M${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy}`;
const ell = (cx: number, cy: number, rx: number, ry: number) => `M${cx + rx} ${cy} A${rx} ${ry} 0 1 1 ${cx - rx} ${cy} A${rx} ${ry} 0 1 1 ${cx + rx} ${cy}`;
const starPath = (r1: number, r2: number) =>
  Array.from({length: 10}, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const r = i % 2 ? r2 : r1;
    return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`;
  }).join(' ') + ' Z';

export const ICONS: Record<string, string> = {
  house: 'M-38 2 L0 -34 L38 2 M-28 -6 L-28 36 L28 36 L28 -6 M-10 36 L-10 12 L10 12 L10 36',
  car: `M-44 14 L-44 -2 L-30 -6 L-18 -24 L18 -24 L30 -6 L44 -2 L44 14 L36 14 M-12 14 L12 14 M-36 14 L-44 14 M-30 -6 L30 -6 ${circ(-24, 14, 10)} ${circ(24, 14, 10)}`,
  watch: `M-14 -44 L14 -44 L12 -24 M-14 -44 L-12 -24 M-14 44 L14 44 L12 24 M-14 44 L-12 24 ${circ(0, 0, 25)} M0 -12 L0 0 L10 6`,
  phone: 'M-20 -40 L20 -40 Q26 -40 26 -34 L26 34 Q26 40 20 40 L-20 40 Q-26 40 -26 34 L-26 -34 Q-26 -40 -20 -40 Z M-6 30 L6 30',
  briefcase: 'M-40 -18 L40 -18 L40 30 L-40 30 Z M-14 -18 L-14 -30 L14 -30 L14 -18 M-40 2 L40 2',
  heart: 'M0 34 C-30 14 -40 -6 -32 -22 C-24 -36 -6 -36 0 -22 C6 -36 24 -36 32 -22 C40 -6 30 14 0 34 Z',
  star: starPath(42, 18),
  music: `${ell(-14, 28, 12, 9)} ${ell(18, 18, 12, 9)} M-2 28 L-2 -30 L30 -38 L30 18`,
  book: 'M0 -28 C-12 -36 -30 -36 -42 -30 L-42 30 C-30 24 -12 24 0 32 C12 24 30 24 42 30 L42 -30 C30 -36 12 -36 0 -28 Z M0 -28 L0 32',
  plant: 'M-20 40 L20 40 L24 12 L-24 12 Z M0 12 L0 -20 M0 -6 C-20 -6 -30 -20 -30 -34 C-14 -34 0 -24 0 -6 M0 -14 C18 -14 28 -28 28 -40 C12 -40 0 -30 0 -14',
  camera: `M-40 -20 L-16 -20 L-10 -32 L10 -32 L16 -20 L40 -20 L40 30 L-40 30 Z ${circ(0, 4, 15)}`,
  dollar: 'M22 -24 C14 -34 -22 -34 -22 -14 C-22 6 22 -2 22 18 C22 38 -16 36 -24 24 M0 -42 L0 42',
  gavel: 'M-30 -22 L-6 -46 L14 -26 L-10 -2 Z M2 -14 L38 22 M-2 40 L40 40',
  crown: 'M-36 24 L-40 -20 L-18 2 L0 -30 L18 2 L40 -20 L36 24 Z',
  wheat: 'M0 40 L0 -36 M0 -30 C-14 -30 -16 -18 -16 -12 C-4 -12 0 -20 0 -30 M0 -30 C14 -30 16 -18 16 -12 C4 -12 0 -20 0 -30 M0 -12 C-14 -12 -16 0 -16 6 C-4 6 0 -2 0 -12 M0 -12 C14 -12 16 0 16 6 C4 6 0 -2 0 -12 M0 6 C-14 6 -16 18 -16 24 C-4 24 0 16 0 6 M0 6 C14 6 16 18 16 24 C4 24 0 16 0 6',
  castle: 'M-40 40 L-40 -20 L-28 -20 L-28 -32 L-16 -32 L-16 -20 L-6 -20 L-6 -32 L6 -32 L6 -20 L16 -20 L16 -32 L28 -32 L28 -20 L40 -20 L40 40 Z M-10 40 L-10 16 A10 10 0 0 1 10 16 L10 40',
  battery: 'M-40 -22 L32 -22 L32 22 L-40 22 Z M32 -8 L42 -8 L42 8 L32 8',
  bell: 'M-30 22 C-30 -10 -26 -36 0 -38 C26 -36 30 -10 30 22 L38 30 L-38 30 Z M-8 30 A8 8 0 0 0 8 30 M0 -38 L0 -46',
  thumb: 'M-40 -6 L-24 -6 L-24 40 L-40 40 Z M-18 -6 L-2 -36 C2 -46 16 -44 14 -32 L10 -10 L34 -10 C42 -10 44 -2 42 4 L36 32 C34 38 30 40 24 40 L-18 40 Z',
  comment: 'M-40 -30 L40 -30 L40 20 L-6 20 L-24 38 L-22 20 L-40 20 Z M-18 -5 L-17 -5 M0 -5 L1 -5 M18 -5 L19 -5',
  gradcap: 'M-46 -10 L0 -30 L46 -10 L0 10 Z M-26 0 L-26 20 C-12 30 12 30 26 20 L26 0 M40 -8 L40 20',
  capitol: 'M-46 -14 L0 -40 L46 -14 Z M-40 -14 L-40 34 M-20 -14 L-20 34 M0 -14 L0 34 M20 -14 L20 34 M40 -14 L40 34 M-50 34 L50 34 M-46 42 L46 42',
  cloud: 'M-30 16 C-46 16 -46 -6 -30 -6 C-28 -24 -6 -30 4 -16 C14 -28 36 -20 32 -2 C46 0 44 16 30 16 Z',
  link: 'M-6 10 L10 -6 M-10 -2 L-22 10 A12 12 0 0 0 -6 26 L6 14 M10 2 L22 -10 A12 12 0 0 0 6 -26 L-6 -14',
  flag: 'M-24 40 L-24 -40 M-24 -36 L28 -36 L18 -20 L28 -4 L-24 -4',
  medkit: 'M-36 -24 L36 -24 L36 32 L-36 32 Z M0 -12 L0 20 M-16 4 L16 4 M-12 -24 L-12 -34 L12 -34 L12 -24',
  weight: 'M-26 38 L26 38 C40 38 40 -2 26 -10 L-26 -10 C-40 -2 -40 38 -26 38 Z M-14 -10 C-18 -40 18 -40 14 -10',
  sun: `${circ(0, 0, 16)} M0 -30 L0 -42 M0 30 L0 42 M-30 0 L-42 0 M30 0 L42 0 M-21 -21 L-30 -30 M21 21 L30 30 M-21 21 L-30 30 M21 -21 L30 -30`,
  wave: 'M-44 0 C-30 -12 -16 12 0 0 C16 -12 30 12 44 0 M-44 18 C-30 6 -16 30 0 18 C16 6 30 30 44 18',
  shirt: 'M-16 -36 L-40 -24 L-30 -4 L-22 -10 L-22 38 L22 38 L22 -10 L30 -4 L40 -24 L16 -36 C10 -26 -10 -26 -16 -36 Z',
  bike: `${circ(-24, 14, 16)} ${circ(24, 14, 16)} M-24 14 L-6 -14 L14 -14 M-6 -14 L0 14 L24 14 L10 -22 M-12 -22 L0 -22 M6 -22 L16 -22`,
  envelope: 'M-40 -26 L40 -26 L40 26 L-40 26 Z M-40 -26 L0 6 L40 -26',
  globe: `${circ(0, 0, 38)} M-38 0 L38 0 M0 -38 C-20 -20 -20 20 0 38 M0 -38 C20 -20 20 20 0 38`,
  smile: `${circ(0, 0, 38)} M-16 10 C-8 22 8 22 16 10 M-12 -10 L-12 -6 M12 -10 L12 -6`,
  coin: `${circ(0, 0, 36)} M12 -14 C8 -20 -12 -20 -12 -8 C-12 4 12 -2 12 10 C12 22 -8 20 -14 14 M0 -26 L0 26`,
  scale: 'M0 -40 L0 36 M-28 36 L28 36 M-40 -24 L40 -24 M-40 -24 L-54 8 L-26 8 Z M40 -24 L26 8 L54 8 Z',
  eye: 'M-44 0 C-24 -28 24 -28 44 0 C24 28 -24 28 -44 0 Z',
  mask: `${ell(0, 0, 34, 40)} M-14 -8 L-6 -8 M6 -8 L14 -8 M-16 12 C-6 24 6 24 16 12`,
  rocket: 'M0 -44 C18 -30 22 -4 14 22 L-14 22 C-22 -4 -18 -30 0 -44 Z M-14 10 L-28 26 L-14 26 M14 10 L28 26 L14 26 M-6 22 L0 40 L6 22',
  trophy: 'M-24 -36 L24 -36 L20 0 C16 14 -16 14 -20 0 Z M-24 -28 C-44 -28 -40 2 -20 -2 M24 -28 C44 -28 40 2 20 -2 M0 12 L0 28 M-18 36 L18 36 L14 28 L-14 28 Z',
};

/** Icono de línea gruesa que se dibuja solo (draw 0..1) y opcionalmente se rellena */
export const Icon: React.FC<{name: string; x: number; y: number; s?: number; color?: string; draw?: number; sw?: number; fill?: string; fillP?: number; rot?: number; opacity?: number}> = ({
  name,
  x,
  y,
  s = 1,
  color = M.white,
  draw = 1,
  sw = 6,
  fill,
  fillP = 1,
  rot = 0,
  opacity = 1,
}) => {
  if (draw <= 0) return null;
  const d = ICONS[name];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
      {fill ? <path d={d} fill={fill} opacity={clamp((draw - 0.6) * 2.5) * fillP} /> : null}
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={draw < 1 ? 1 : undefined}
        strokeDasharray={draw < 1 ? '1 1' : undefined}
        strokeDashoffset={draw < 1 ? 1 - draw : undefined}
      />
    </g>
  );
};

/** Icono dentro de un círculo de color que aparece con resorte */
export const IconBadge: React.FC<{name: string; x: number; y: number; r?: number; bg: string; color?: string; p: number; draw?: number}> = ({name, x, y, r = 60, bg, color = M.white, p, draw = 1}) => {
  if (p <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${p})`}>
      <circle r={r} fill={bg} />
      <circle r={r} fill="#fff" opacity={0.08} transform={`translate(${-r * 0.2} ${-r * 0.2}) scale(0.7)`} />
      <Icon name={name} x={0} y={0} s={(r / 60) * 0.8} color={color} draw={draw} sw={7} />
    </g>
  );
};

// ───────────────────────── Tipografía cinética ─────────────────────────
type KinMode = 'drop' | 'rise' | 'pop' | 'slam';
/** Texto que entra letra a letra con física de resorte. Usa foreignObject para que el navegador maquete. */
export const Kin: React.FC<{
  x: number;
  y: number;
  text: string;
  t: number;
  at: number;
  size?: number;
  color?: string;
  weight?: number;
  w?: number;
  align?: 'center' | 'left' | 'right';
  mode?: KinMode;
  stagger?: number;
  out?: number;
  font?: string;
  glow?: string;
  spacing?: number;
  lineHeight?: number;
}> = ({x, y, text, t, at, size = 80, color = M.white, weight = 800, w = 1800, align = 'center', mode = 'drop', stagger = 0.03, out, font = FONT, glow, spacing = 0, lineHeight = 1.1}) => {
  if (t < at - 0.05) return null;
  const outK = out !== undefined ? eio(t, out, 0.35) : 0;
  if (outK >= 1) return null;
  const lines = text.split('\n');
  const h = size * lineHeight * lines.length + size;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  let idx = 0;
  return (
    <foreignObject x={x0} y={y - size * 0.95} width={w} height={h} style={{overflow: 'visible'}}>
      <div
        style={{
          fontFamily: font,
          fontWeight: weight,
          fontSize: size,
          lineHeight,
          color,
          textAlign: align,
          letterSpacing: spacing,
          opacity: 1 - outK,
          transform: `translateY(${-outK * 30}px)`,
          textShadow: glow ? `0 0 ${size * 0.35}px ${glow}` : undefined,
          whiteSpace: 'nowrap',
        }}
      >
        {lines.map((line, li) => (
          <div key={li}>
            {Array.from(line).map((ch, ci) => {
              const k = idx++;
              const s = spr(t, at + k * stagger, mode === 'slam' ? 2.6 : 2.2, mode === 'slam' ? 0.55 : 0.42);
              const o = clamp(s * 4);
              let tr = '';
              if (mode === 'drop') tr = `translateY(${(1 - s) * -size * 0.9}px) rotate(${(1 - s) * -12}deg)`;
              if (mode === 'rise') tr = `translateY(${(1 - s) * size * 0.9}px)`;
              if (mode === 'pop') tr = `scale(${s})`;
              if (mode === 'slam') tr = `scale(${lerp(2.2, 1, clamp(s))}) translateY(${(1 - clamp(s)) * -10}px)`;
              return (
                <span key={ci} style={{display: 'inline-block', transform: tr, opacity: o, whiteSpace: 'pre'}}>
                  {ch === ' ' ? ' ' : ch}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </foreignObject>
  );
};

/** Etiqueta tipo píldora (texto con fondo redondeado), con aparición elástica */
export const Pill: React.FC<{x: number; y: number; text: string; t: number; at: number; bg?: string; color?: string; size?: number; out?: number; anchor?: 'center' | 'left' | 'right'; icon?: string}> = ({
  x,
  y,
  text,
  t,
  at,
  bg = M.coral,
  color = M.white,
  size = 30,
  out,
  anchor = 'center',
  icon,
}) => {
  const s = spr(t, at, 2.4, 0.5);
  if (s <= 0.001) return null;
  const outK = out !== undefined ? eio(t, out, 0.3) : 0;
  if (outK >= 1) return null;
  const W = 1200;
  const x0 = anchor === 'center' ? x - W / 2 : anchor === 'right' ? x - W : x;
  return (
    <foreignObject x={x0} y={y - size * 1.1} width={W} height={size * 2.4} style={{overflow: 'visible'}}>
      <div style={{display: 'flex', justifyContent: anchor === 'center' ? 'center' : anchor === 'right' ? 'flex-end' : 'flex-start', opacity: 1 - outK}}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: size * 0.35,
            background: bg,
            color,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: size,
            padding: `${size * 0.32}px ${size * 0.8}px`,
            borderRadius: size * 2,
            transform: `scale(${s})`,
            transformOrigin: anchor === 'left' ? 'left center' : anchor === 'right' ? 'right center' : 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            whiteSpace: 'nowrap',
          }}
        >
          {icon ? (
            <svg width={size * 1.1} height={size * 1.1} viewBox="-50 -50 100 100">
              <path d={ICONS[icon]} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : null}
          {text}
        </div>
      </div>
    </foreignObject>
  );
};

/** Encabezado de sección numerado (píldora con número) */
export const SectionHead: React.FC<{t: number; at: number; n: string; text: string; color?: string}> = ({t, at, n, text, color = M.amber}) => {
  const s = spr(t, at, 2.2, 0.5);
  if (s <= 0) return null;
  return (
    <g>
      <g transform={`translate(130 120) scale(${s})`}>
        <circle r={46} fill={color} />
        <text y={18} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={52} fill={M.ink}>
          {n}
        </text>
      </g>
      <Kin x={200} y={140} text={text} t={t} at={at + 0.1} size={52} align="left" w={1600} mode="rise" stagger={0.015} />
    </g>
  );
};

// ───────────────────────── Efectos ─────────────────────────
/** Ondas expansivas */
export const Shock: React.FC<{x: number; y: number; t: number; at: number; color?: string; n?: number; r?: number}> = ({x, y, t, at, color = M.white, n = 3, r = 320}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const k = pr(t, at + i * 0.09, 0.9);
      if (k <= 0 || k >= 1) return null;
      return <circle key={i} cx={x} cy={y} r={easeOut(k) * r} fill="none" stroke={color} strokeWidth={8 * (1 - k)} opacity={1 - k} />;
    })}
  </g>
);

/** Estallido de partículas (confeti) determinista */
export const Burst: React.FC<{x: number; y: number; t: number; at: number; n?: number; colors?: string[]; spread?: number; gravity?: number; dur?: number; size?: number; seed?: number}> = ({
  x,
  y,
  t,
  at,
  n = 30,
  colors = PALETTE,
  spread = 420,
  gravity = 600,
  dur = 1.6,
  size = 14,
  seed = 1,
}) => {
  const age = t - at;
  if (age < 0 || age > dur) return null;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const a = hash(i * 7 + seed) * Math.PI * 2;
        const v = spread * (0.45 + hash(i * 13 + seed) * 0.8);
        const px = x + Math.cos(a) * v * age;
        const py = y + Math.sin(a) * v * age * 0.8 + 0.5 * gravity * age * age - 80 * age;
        const r = age * (200 + hash(i + seed) * 500);
        const o = 1 - clamp((age - dur * 0.55) / (dur * 0.45));
        const c = colors[i % colors.length];
        return i % 3 === 0 ? (
          <circle key={i} cx={px} cy={py} r={size * 0.45} fill={c} opacity={o} />
        ) : (
          <rect key={i} x={px - size / 2} y={py - size / 4} width={size} height={size / 2} rx={2} fill={c} opacity={o} transform={`rotate(${r} ${px} ${py})`} />
        );
      })}
    </g>
  );
};

/** Anillo de progreso */
export const Ring: React.FC<{x: number; y: number; r: number; p: number; color: string; track?: string; sw?: number}> = ({x, y, r, p, color, track = 'rgba(255,255,255,0.12)', sw = 14}) => (
  <g transform={`translate(${x} ${y}) rotate(-90)`}>
    <circle r={r} fill="none" stroke={track} strokeWidth={sw} />
    {p > 0.001 ? <circle r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round" pathLength={1} strokeDasharray={`${clamp(p)} 1`} /> : null}
  </g>
);

/** Brillo: dibuja los hijos dos veces, una desenfocada debajo */
export const Glow: React.FC<{children: React.ReactNode; strength?: number; big?: boolean}> = ({children, strength = 0.9, big}) => (
  <g>
    <g filter={`url(#${big ? 'bloomBig' : 'bloom'})`} opacity={strength}>
      {children}
    </g>
    {children}
  </g>
);

/** Etiqueta «ilustrativo» discreta */
export const Disclaimer: React.FC<{x?: number; y?: number; text?: string; dark?: boolean}> = ({x = 1850, y = 1030, text = 'ILUSTRATIVO', dark = true}) => (
  <text x={x} y={y} textAnchor="end" fontFamily={FONT} fontWeight={700} fontSize={16} letterSpacing={3} fill={dark ? '#ffffff' : M.ink} opacity={0.45}>
    {text}
  </text>
);

/** Título de capítulo a pantalla completa que se desliza hacia arriba al salir */
export const ChapterTitle: React.FC<{t: number; at: number; num: string; title: string; color: string; dur?: number; ink?: string}> = ({t, at, num, title, color, dur = 1.9, ink = M.ink}) => {
  if (t < at || t > at + dur + 0.6) return null;
  const out = eio(t, at + dur, 0.5);
  const numS = spr(t, at + 0.05, 1.8, 0.5);
  return (
    <g transform={`translate(0 ${-out * 1180})`}>
      <rect x={-100} y={-100} width={2120} height={1280} fill={color} />
      {/* círculos decorativos que respiran */}
      <circle cx={1660} cy={220} r={180 * spr(t, at + 0.1)} fill="#ffffff" opacity={0.12} />
      <circle cx={260} cy={880} r={260 * spr(t, at + 0.2)} fill="#000000" opacity={0.06} />
      <text x={960} y={480} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={260} fill="none" stroke={ink} strokeWidth={6} opacity={numS} transform={`translate(0 ${(1 - numS) * 80})`}>
        {num}
      </text>
      <Kin x={960} y={690} text={title} t={t} at={at + 0.2} size={110} color={ink} weight={900} mode="drop" stagger={0.025} />
    </g>
  );
};

export const _k = {ell, shade};
