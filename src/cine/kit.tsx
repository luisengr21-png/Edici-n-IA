import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// ───────────────────────── Tipografía ─────────────────────────
export const SERIF = '"Cormorant Garamond", Georgia, serif';
export const GOTH = 'UnifrakturMaguntia, serif';
const faces: [string, string, string, string][] = [
  ['Cormorant Garamond', 'fonts/CormorantGaramond-300-normal.woff', '300', 'normal'],
  ['Cormorant Garamond', 'fonts/CormorantGaramond-500-normal.woff', '500', 'normal'],
  ['Cormorant Garamond', 'fonts/CormorantGaramond-300-italic.woff', '300', 'italic'],
  ['Cormorant Garamond', 'fonts/CormorantGaramond-400-italic.woff', '400', 'italic'],
  ['UnifrakturMaguntia', 'motion/fonts/Unifraktur.woff', '400', 'normal'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('Tipografías cine');
  Promise.all(
    faces.map(([fam, file, weight, style]) => {
      const f = new FontFace(fam, `url(${staticFile(file)}) format('woff')`, {weight, style});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}

// ───────────────────────── Utilidades ─────────────────────────
export const INK = '#06070D';
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const pr = (t: number, t0: number, dur = 0.5) => clamp((t - t0) / dur);
export const eo = (t: number, t0: number, dur = 0.5) => easeOut(pr(t, t0, dur));
export const eio = (t: number, t0: number, dur = 0.5) => easeInOut(pr(t, t0, dur));
export const phase = (t: number, t0: number, t1: number, f = 0.6) => clamp((t - t0) / f) * clamp((t1 - t) / f);
export const hash = (n: number) => {
  const s = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
};
export const wobble = (t: number, t0: number, amp = 1, freq = 3, damp = 5) => {
  const x = t - t0;
  if (x < 0) return 0;
  return amp * Math.exp(-x * damp) * Math.sin(x * freq * Math.PI * 2);
};
const toRgb = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
export const mix = (a: string, b: string, k: number) => {
  const A = toRgb(a);
  const B = toRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k)));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
};
const idOf = (s: string) => s.replace(/[^a-zA-Z0-9]/g, '');

// ───────────────────────── Cámara con paralaje ─────────────────────────
type CamState = {cx: number; cy: number; z: number; rot: number; sx: number; sy: number};
const CamCtx = React.createContext<CamState>({cx: 960, cy: 540, z: 1, rot: 0, sx: 0, sy: 0});
export const Cam: React.FC<{t: number; keys: [number, number, number, number][]; shake?: [number, number][]; rot?: number; children: React.ReactNode}> = ({t, keys, shake = [], rot = 0, children}) => {
  let st: CamState = {cx: keys[0][1], cy: keys[0][2], z: keys[0][3], rot, sx: 0, sy: 0};
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0, z0] = keys[i];
    const [t1, x1, y1, z1] = keys[i + 1];
    if (t >= t0) {
      const k = easeInOut(clamp((t - t0) / Math.max(0.001, t1 - t0)));
      st = {...st, cx: lerp(x0, x1, k), cy: lerp(y0, y1, k), z: Math.exp(lerp(Math.log(z0), Math.log(z1), k))};
    }
  }
  for (const [at, amp] of shake) {
    st.sx += wobble(t, at, amp, 7.3, 5);
    st.sy += wobble(t, at + 0.03, amp * 0.8, 6.1, 5);
  }
  return <CamCtx.Provider value={st}>{children}</CamCtx.Provider>;
};
export const Layer: React.FC<{depth?: number; children: React.ReactNode}> = ({depth = 1, children}) => {
  const {cx, cy, z, rot, sx, sy} = React.useContext(CamCtx);
  const ze = 1 + (z - 1) * depth;
  const ox = 960 + (cx - 960) * depth;
  const oy = 540 + (cy - 540) * depth;
  return <g transform={`translate(${960 + sx * depth} ${540 + sy * depth}) rotate(${rot * depth}) scale(${ze}) translate(${-ox} ${-oy})`}>{children}</g>;
};

// ───────────────────────── Cielo y astros ─────────────────────────
export const Sky: React.FC<{stops: [number, string][]; id: string; x?: number; y?: number; w?: number; h?: number}> = ({stops, id, x = -600, y = -600, w = 3120, h = 2280}) => (
  <g>
    <defs>
      <linearGradient id={`sky-${id}`} x1="0" y1="0" x2="0" y2="1">
        {stops.map(([o, c], i) => (
          <stop key={i} offset={o} stopColor={c} />
        ))}
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} fill={`url(#sky-${id})`} />
  </g>
);

/** Halo radial (sin filtros: barato de renderizar) */
export const Halo: React.FC<{x: number; y: number; r: number; color: string; opacity?: number; inner?: number}> = ({x, y, r, color, opacity = 1, inner = 0}) => {
  const id = `halo-${idOf(color)}-${Math.round(inner * 100)}`;
  return (
    <g>
      <defs>
        <radialGradient id={id}>
          <stop offset={inner} stopColor={color} stopOpacity={1} />
          <stop offset={Math.min(0.99, inner + (1 - inner) * 0.35)} stopColor={color} stopOpacity={0.35} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
};

export const Moon: React.FC<{x: number; y: number; r: number; color?: string; glow?: number; shade?: string}> = ({x, y, r, color = '#EEF1F8', glow = 1, shade = '#9AA6C2'}) => {
  const id = `moon-${idOf(color)}`;
  return (
    <g>
      <Halo x={x} y={y} r={r * 4.2} color={color} opacity={0.2 * glow} />
      <Halo x={x} y={y} r={r * 1.9} color={color} opacity={0.42 * glow} />
      <defs>
        <radialGradient id={id} cx="0.4" cy="0.38" r="0.68">
          <stop offset="0" stopColor={mix(color, '#FFFFFF', 0.55)} />
          <stop offset="0.65" stopColor={color} />
          <stop offset="1" stopColor={mix(color, shade, 0.55)} />
        </radialGradient>
      </defs>
      <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
      <g fill={shade}>
        <path d={`M${x - r * 0.62} ${y - r * 0.18} c${r * 0.1} ${-r * 0.3} ${r * 0.48} ${-r * 0.36} ${r * 0.58} ${-r * 0.08} c${r * 0.08} ${r * 0.26} ${-r * 0.16} ${r * 0.42} ${-r * 0.38} ${r * 0.36} c${-r * 0.16} ${-r * 0.04} ${-r * 0.26} ${-r * 0.14} ${-r * 0.2} ${-r * 0.28} z`} opacity={0.22} />
        <path d={`M${x + r * 0.05} ${y + r * 0.12} c${r * 0.18} ${-r * 0.12} ${r * 0.5} ${-r * 0.04} ${r * 0.5} ${r * 0.22} c0 ${r * 0.24} ${-r * 0.3} ${r * 0.34} ${-r * 0.48} ${r * 0.2} c${-r * 0.1} ${-r * 0.1} ${-r * 0.12} ${-r * 0.32} ${-r * 0.02} ${-r * 0.42} z`} opacity={0.18} />
        <ellipse cx={x + r * 0.32} cy={y - r * 0.42} rx={r * 0.16} ry={r * 0.12} opacity={0.2} />
        <ellipse cx={x - r * 0.22} cy={y + r * 0.5} rx={r * 0.12} ry={r * 0.08} opacity={0.16} />
        <circle cx={x - r * 0.05} cy={y - r * 0.55} r={r * 0.05} opacity={0.25} />
      </g>
    </g>
  );
};

export const Stars: React.FC<{t: number; n?: number; seed?: number; x0?: number; x1?: number; y0?: number; y1?: number; opacity?: number; color?: string}> = ({t, n = 160, seed = 1, x0 = -200, x1 = 2120, y0 = -100, y1 = 700, opacity = 1, color = '#ffffff'}) => (
  <g opacity={opacity}>
    {Array.from({length: n}, (_, i) => {
      const x = x0 + hash(i * 3.1 + seed) * (x1 - x0);
      const y = y0 + hash(i * 7.7 + seed) * (y1 - y0);
      const s = 0.6 + hash(i * 1.3 + seed) ** 3 * 2.6;
      const tw = 0.55 + 0.45 * Math.sin(t * (1 + hash(i + seed) * 2) + i);
      return <circle key={i} cx={x} cy={y} r={s} fill={color} opacity={tw * (0.35 + hash(i * 5.5 + seed) * 0.65)} />;
    })}
  </g>
);

// ───────────────────────── Paisaje ─────────────────────────
/** Cordillera / colinas procedurales rellenas hasta abajo */
export const Ridge: React.FC<{seed: number; y: number; amp?: number; rough?: number; color: string; x0?: number; x1?: number; step?: number; bottom?: number; opacity?: number}> = ({
  seed,
  y,
  amp = 80,
  rough = 1,
  color,
  x0 = -600,
  x1 = 2520,
  step = 24,
  bottom = 1800,
  opacity = 1,
}) => {
  const pts: string[] = [];
  for (let x = x0; x <= x1; x += step) {
    const u = x / 1920;
    const v =
      Math.sin(u * 5.1 + seed * 1.7) * 0.55 +
      Math.sin(u * 11.3 + seed * 2.9) * 0.28 * rough +
      Math.sin(u * 23.7 + seed * 0.7) * 0.12 * rough +
      (hash(Math.floor(x / step) + seed * 100) - 0.5) * 0.08 * rough;
    pts.push(`${x} ${(y - v * amp).toFixed(1)}`);
  }
  return <path d={`M${x0} ${bottom} L${pts.join(' L')} L${x1} ${bottom} Z`} fill={color} opacity={opacity} />;
};

/** Banda de niebla (degradado vertical, sin desenfoque) */
export const Fog: React.FC<{y: number; h: number; color: string; opacity?: number; x0?: number; w?: number}> = ({y, h, color, opacity = 0.6, x0 = -600, w = 3120}) => {
  const id = `fog-${idOf(color)}`;
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0} />
          <stop offset="0.5" stopColor={color} stopOpacity={1} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <rect x={x0} y={y - h / 2} width={w} height={h} fill={`url(#${id})`} opacity={opacity} />
    </g>
  );
};

/** Rayos de luz volumétricos que nacen de un punto */
export const Rays: React.FC<{x: number; y: number; t: number; n?: number; len?: number; spread?: number; angle?: number; color?: string; opacity?: number; width?: number}> = ({
  x,
  y,
  t,
  n = 9,
  len = 1600,
  spread = 70,
  angle = 90,
  color = '#FFF2D6',
  opacity = 0.18,
  width = 5,
}) => {
  const id = `ray-${idOf(color)}-${Math.round(x)}-${Math.round(y)}-${Math.round(len)}`;
  return (
    <g opacity={opacity}>
      <defs>
        <radialGradient id={id} cx={x} cy={y} r={len} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={color} stopOpacity={0.9} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </radialGradient>
      </defs>
      {Array.from({length: n}, (_, i) => {
        const a = ((angle - spread / 2 + (spread * (i + 0.5)) / n + Math.sin(t * 0.3 + i * 1.7) * 2) * Math.PI) / 180;
        const w = ((width + hash(i) * width) * Math.PI) / 180;
        const p1 = [x + Math.cos(a - w / 2) * len, y + Math.sin(a - w / 2) * len];
        const p2 = [x + Math.cos(a + w / 2) * len, y + Math.sin(a + w / 2) * len];
        return <path key={i} d={`M${x} ${y} L${p1[0]} ${p1[1]} L${p2[0]} ${p2[1]} Z`} fill={`url(#${id})`} opacity={0.5 + 0.5 * Math.sin(t * 0.7 + i * 2.1)} />;
      })}
    </g>
  );
};

/** Skyline de ciudad con ventanas */
export const Skyline: React.FC<{seed: number; y: number; color: string; hMin?: number; hMax?: number; win?: string; winP?: number; x0?: number; x1?: number; t?: number}> = ({seed, y, color, hMin = 80, hMax = 260, win, winP = 0.25, x0 = -300, x1 = 2220, t = 0}) => {
  const out: React.ReactNode[] = [];
  let x = x0;
  let k = 0;
  while (x < x1) {
    const w = 50 + hash(k * 3.3 + seed) * 110;
    const h = hMin + hash(k * 7.1 + seed) * (hMax - hMin);
    out.push(<rect key={`b${k}`} x={x} y={y - h} width={w + 1} height={h + 400} fill={color} />);
    if (hash(k * 2.2 + seed) > 0.7) out.push(<rect key={`a${k}`} x={x + w / 2 - 2} y={y - h - 30} width={4} height={30} fill={color} />);
    if (win) {
      for (let wy = y - h + 14; wy < y - 8; wy += 22)
        for (let wx = x + 8; wx < x + w - 10; wx += 16) {
          const hh = hash(wx * 0.37 + wy * 1.91 + seed);
          if (hh < winP) out.push(<rect key={`w${wx}-${wy}`} x={wx} y={wy} width={6} height={9} fill={win} opacity={0.5 + 0.5 * Math.sin(t * 0.5 + hh * 40)} />);
        }
    }
    x += w + 2 + hash(k + seed) * 10;
    k++;
  }
  return <g>{out}</g>;
};

// ───────────────────────── Partículas ─────────────────────────
export const Dust: React.FC<{t: number; n?: number; seed?: number; color?: string; opacity?: number; area?: [number, number, number, number]}> = ({t, n = 50, seed = 3, color = '#FFF4DE', opacity = 0.5, area = [0, 0, 1920, 1080]}) => (
  <g opacity={opacity}>
    {Array.from({length: n}, (_, i) => {
      const [ax, ay, aw, ah] = area;
      const x = ax + ((hash(i * 2.1 + seed) * aw + t * (4 + hash(i + seed) * 12) + Math.sin(t * 0.6 + i) * 20) % aw);
      const y = ay + ((hash(i * 5.3 + seed) * ah - t * (3 + hash(i * 3 + seed) * 8)) % ah + ah) % ah;
      return <circle key={i} cx={x} cy={y} r={0.8 + hash(i * 9 + seed) * 2.2} fill={color} opacity={0.3 + 0.7 * hash(i * 4.4 + seed)} />;
    })}
  </g>
);

export const Embers: React.FC<{t: number; t0: number; n?: number; x: number; y: number; spread?: number; color?: string}> = ({t, t0, n = 40, x, y, spread = 600, color = '#FFB25C'}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const life = 4 + hash(i * 3) * 3;
      const age = ((t - t0 - hash(i * 7) * life) % life + life) % life;
      if (t < t0) return null;
      const px = x + (hash(i * 1.7) - 0.5) * spread + Math.sin(age * 1.5 + i) * 30;
      const py = y - age * (40 + hash(i * 2.9) * 50);
      const o = Math.sin((age / life) * Math.PI);
      return <circle key={i} cx={px} cy={py} r={1.2 + hash(i * 5) * 2.4} fill={color} opacity={o * 0.9} />;
    })}
  </g>
);

export const Fireflies: React.FC<{t: number; n?: number; seed?: number; area: [number, number, number, number]; color?: string; opacity?: number}> = ({t, n = 30, seed = 7, area, color = '#FFE29A', opacity = 1}) => (
  <g opacity={opacity}>
    {Array.from({length: n}, (_, i) => {
      const [ax, ay, aw, ah] = area;
      const x = ax + hash(i * 3.7 + seed) * aw + Math.sin(t * (0.4 + hash(i) * 0.6) + i) * 40;
      const y = ay + hash(i * 6.1 + seed) * ah + Math.cos(t * (0.3 + hash(i + 2) * 0.5) + i) * 30;
      const b = Math.max(0, Math.sin(t * (1.2 + hash(i + 5)) + i * 2));
      return (
        <g key={i}>
          <circle cx={x} cy={y} r={14} fill={color} opacity={0.12 * b} />
          <circle cx={x} cy={y} r={2.6} fill={color} opacity={0.3 + 0.7 * b} />
        </g>
      );
    })}
  </g>
);

export const Rain: React.FC<{t: number; n?: number; opacity?: number; color?: string; slant?: number; speed?: number}> = ({t, n = 140, opacity = 0.35, color = '#BFD4EA', slant = 0.18, speed = 1400}) => (
  <g opacity={opacity}>
    {Array.from({length: n}, (_, i) => {
      const len = 20 + hash(i * 3) * 40;
      const x = hash(i * 1.9) * 2100 - 90;
      const y = ((hash(i * 4.7) * 1300 + t * speed * (0.7 + hash(i) * 0.6)) % 1300) - 110;
      return <path key={i} d={`M${x + y * slant} ${y} l${len * slant} ${len}`} stroke={color} strokeWidth={1.4} />;
    })}
  </g>
);

// ───────────────────────── Objetos ─────────────────────────
/** Tarjeta de presentación luminosa: el motivo que atraviesa el film */
export const Card: React.FC<{x: number; y: number; s?: number; glow?: number; rot?: number; opacity?: number}> = ({x, y, s = 1, glow = 1, rot = -8, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={opacity}>
    <Halo x={0} y={0} r={60} color="#FFF6E0" opacity={0.55 * glow} />
    <rect x={-17} y={-11} width={34} height={22} rx={2} fill="#FFFDF6" />
    <rect x={-11} y={-4} width={20} height={2} fill="#C9C2B0" />
    <rect x={-11} y={1} width={14} height={2} fill="#DED8C8" />
  </g>
);

export const Lantern: React.FC<{x: number; y: number; s?: number; on: number; color?: string; sway?: number}> = ({x, y, s = 1, on, color = '#FFB65C', sway = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${sway}) scale(${s})`}>
    {on > 0 ? <Halo x={0} y={14} r={110} color={color} opacity={0.55 * on} /> : null}
    <path d="M0 -40 L0 -14" stroke={INK} strokeWidth={2} />
    <rect x={-9} y={-16} width={18} height={6} rx={2} fill={INK} />
    <path d="M-20 -10 C-30 10 -30 30 -20 44 L20 44 C30 30 30 10 20 -10 Z" fill={mix('#2A2430', color, on)} />
    <path d="M-12 -10 C-18 10 -18 30 -12 44 M0 -10 L0 44 M12 -10 C18 10 18 30 12 44" stroke={mix('#1A1620', '#C77A2E', on)} strokeWidth={1.6} fill="none" opacity={0.7} />
    <rect x={-9} y={44} width={18} height={6} rx={2} fill={INK} />
  </g>
);

/** Vela con llama que titila */
export const Candle: React.FC<{x: number; y: number; s?: number; t: number; glow?: number; h?: number}> = ({x, y, s = 1, t, glow = 1, h = 46}) => {
  const fl = 1 + Math.sin(t * 13) * 0.06 + Math.sin(t * 7.3) * 0.05;
  const sway = Math.sin(t * 5.1) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Halo x={0} y={-h - 14} r={260 * glow * fl} color="#FFB45A" opacity={0.35} />
      <Halo x={0} y={-h - 14} r={70 * fl} color="#FFE2A8" opacity={0.8 * glow} />
      <rect x={-8} y={-h} width={16} height={h} rx={2} fill="#F3E3C4" />
      <path d={`M0 ${-h - 30 * fl} C${7 + sway} ${-h - 16} 7 ${-h - 4} 0 ${-h - 2} C-7 ${-h - 4} ${-7 + sway} ${-h - 16} 0 ${-h - 30 * fl} Z`} fill="#FFE7B0" />
      <path d={`M0 ${-h - 16 * fl} C3 ${-h - 9} 3 ${-h - 4} 0 ${-h - 3} C-3 ${-h - 4} -3 ${-h - 9} 0 ${-h - 16 * fl} Z`} fill="#FFFFFF" />
    </g>
  );
};

/** Persona diminuta (para multitudes: barato) */
export const Tiny: React.FC<{x: number; y: number; s?: number; color?: string; opacity?: number}> = ({x, y, s = 1, color = INK, opacity = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={opacity}>
    <circle cx={0} cy={-27} r={5} fill={color} />
    <path d="M-6 -20 L6 -20 L7 -6 L4 0 L-4 0 L-7 -6 Z" fill={color} />
  </g>
);

// ───────────────────────── La silueta humana ─────────────────────────
export type FigureProps = {
  x: number;
  y: number;
  s?: number;
  face?: 1 | -1;
  walk?: number; // fase del paso (radianes); undefined = de pie
  armF?: [number, number]; // ángulo hombro, codo (grados desde abajo, + hacia delante)
  armB?: [number, number];
  hold?: React.ReactNode; // en la mano delantera
  holdB?: React.ReactNode;
  dress?: boolean;
  hair?: 'short' | 'bun' | 'long' | 'none';
  hat?: 'top' | 'none';
  child?: boolean;
  sit?: boolean;
  kneel?: boolean;
  slump?: number; // 0..1 hombros caídos, cabeza baja
  color?: string;
  opacity?: number;
  rot?: number;
  rim?: {color: string; dx: number; dy: number; opacity?: number};
  monocle?: string;
};

const limb = (sx: number, sy: number, a: number, b: number, l1: number, l2: number) => {
  const r = Math.PI / 180;
  const ex = sx + Math.sin(a * r) * l1;
  const ey = sy + Math.cos(a * r) * l1;
  return {ex, ey, hx: ex + Math.sin((a + b) * r) * l2, hy: ey + Math.cos((a + b) * r) * l2};
};

/** Silueta de perfil, proporciones realistas; origen entre los pies. Altura ≈ 360·s */
export const Figure: React.FC<FigureProps> = ({
  x,
  y,
  s = 1,
  face = 1,
  walk,
  armF = [8, 10],
  armB = [-6, 8],
  hold,
  holdB,
  dress,
  hair = 'short',
  hat = 'none',
  child,
  sit,
  kneel,
  slump = 0,
  color = INK,
  opacity = 1,
  rot = 0,
  rim,
  monocle,
}) => {
  const sc = child ? s * 0.6 : s;
  const headR = child ? 30 : 23;
  const hip = {x: 0, y: -170};
  const sh = {x: 6 + slump * 6, y: -288 + slump * 8};
  // piernas
  let legF: string;
  let legB: string;
  if (sit) {
    legF = `M0 -170 L70 -165 L74 -70 L96 -66`;
    legB = `M-4 -168 L62 -160 L66 -70 L88 -66`;
  } else if (kneel) {
    legF = `M0 -170 L46 -100 L44 -6 L74 -4`;
    legB = `M-4 -168 L-10 -84 L-90 -70 L-104 -60`;
  } else {
    const ph = walk ?? 0;
    const swing = walk === undefined ? 0 : 26;
    const lf = limb(0, -170, Math.sin(ph) * swing, walk === undefined ? 0 : -Math.max(0, Math.sin(ph + 1.2)) * 30, 88, 84);
    const lb = limb(0, -170, -Math.sin(ph) * swing, walk === undefined ? 0 : -Math.max(0, Math.sin(ph + 1.2 + Math.PI)) * 30, 88, 84);
    legF = `M0 -170 L${lf.ex} ${lf.ey} L${lf.hx} ${lf.hy} L${lf.hx + 22} ${lf.hy}`;
    legB = `M0 -170 L${lb.ex} ${lb.ey} L${lb.hx} ${lb.hy} L${lb.hx + 22} ${lb.hy}`;
  }
  const armSwing = walk === undefined ? 0 : Math.sin(walk) * 22;
  const F = limb(sh.x, sh.y, armF[0] - armSwing, armF[1], 70, 66);
  const B = limb(sh.x - 6, sh.y + 2, armB[0] + armSwing, armB[1], 70, 66);
  const bob = walk === undefined ? 0 : Math.abs(Math.cos(walk)) * 4;
  const headX = 10 + slump * 22;
  const headY = -322 + slump * 22;
  const draw = (col: string, main: boolean) => (
      <g transform={`translate(0 ${-bob})`}>
        {/* brazo trasero */}
        <path d={`M${sh.x - 6} ${sh.y + 2} L${B.ex} ${B.ey} L${B.hx} ${B.hy}`} stroke={col} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {main && holdB ? <g transform={`translate(${B.hx} ${B.hy})`}>{holdB}</g> : null}
        {/* piernas */}
        <path d={legB} stroke={col} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={legF} stroke={col} strokeWidth={26} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {/* torso */}
        {dress ? (
          <path d={`M${sh.x - 26} ${sh.y} C${sh.x - 34} -240 -30 -200 -48 -120 L48 -120 C30 -190 ${sh.x + 30} -250 ${sh.x + 22} ${sh.y} Z`} fill={col} />
        ) : (
          <path d={`M${sh.x - 26} ${sh.y + 2} C${sh.x - 34} -250 -26 -200 -24 -160 L24 -160 C26 -200 ${sh.x + 30} -252 ${sh.x + 22} ${sh.y} Z`} fill={col} />
        )}
        {/* cuello y cabeza */}
        <path d={`M${sh.x - 6} ${sh.y + 6} L${headX - 6} ${headY + 18} L${headX + 6} ${headY + 20} L${sh.x + 10} ${sh.y + 6} Z`} fill={col} />
        <ellipse cx={headX} cy={headY} rx={headR} ry={headR * 1.14} fill={col} />
        <path d={`M${headX + headR - 2} ${headY - 2} L${headX + headR + 6} ${headY + 8} L${headX + headR - 2} ${headY + 10} Z`} fill={col} />
        {hair === 'bun' ? <circle cx={headX - headR * 0.8} cy={headY - headR * 0.8} r={headR * 0.5} fill={col} /> : null}
        {hair === 'long' ? <path d={`M${headX - headR} ${headY - 6} C${headX - headR - 10} ${headY + 30} ${headX - headR - 6} ${headY + 60} ${headX - headR + 6} ${headY + 74} L${headX} ${headY + 20} Z`} fill={col} /> : null}
        {hat === 'top' ? (
          <g>
            <rect x={headX - headR - 8} y={headY - headR - 4} width={headR * 2 + 16} height={7} rx={3} fill={col} />
            <rect x={headX - headR + 4} y={headY - headR - 56} width={headR * 2 - 8} height={54} rx={4} fill={col} />
          </g>
        ) : null}
        {/* brazo delantero */}
        <path d={`M${sh.x} ${sh.y} L${F.ex} ${F.ey} L${F.hx} ${F.hy}`} stroke={col} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {main && monocle ? <circle cx={headX + headR * 0.55} cy={headY - 4} r={7} fill="none" stroke={monocle} strokeWidth={2.5} /> : null}
        {main && hold ? <g transform={`translate(${F.hx} ${F.hy}) scale(${face} 1)`}>{hold}</g> : null}
      </g>
  );
  return (
    <g opacity={opacity}>
      {rim ? (
        <g transform={`translate(${x + rim.dx} ${y + rim.dy}) rotate(${rot}) scale(${sc * face} ${sc})`} opacity={rim.opacity ?? 1}>
          {draw(rim.color, false)}
        </g>
      ) : null}
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc * face} ${sc})`}>{draw(color, true)}</g>
    </g>
  );
};

/** Posición (mundo) de la mano delantera de una figura de pie */
export const handPos = (x: number, y: number, s: number, face: 1 | -1, armF: [number, number], slump = 0) => {
  const sh = {x: 6 + slump * 6, y: -288 + slump * 8};
  const F = limb(sh.x, sh.y, armF[0], armF[1], 70, 66);
  return {x: x + face * F.hx * s, y: y + F.hy * s};
};

/** Silueta de frente (para el giro final hacia cámara) */
export const FigureFront: React.FC<{x: number; y: number; s?: number; color?: string; sx?: number; opacity?: number; rim?: string}> = ({x, y, s = 1, color = INK, sx = 1, opacity = 1, rim}) => {
  const body = (col: string) => (
    <g>
      <path d="M-14 -170 L-16 -2 M14 -170 L16 -2" stroke={col} strokeWidth={26} strokeLinecap="round" />
      <path d="M-44 -282 C-46 -240 -30 -200 -28 -160 L28 -160 C30 -200 46 -240 44 -282 C30 -294 -30 -294 -44 -282 Z" fill={col} />
      <path d="M-42 -278 L-52 -200 L-48 -140 M42 -278 L52 -200 L48 -140" stroke={col} strokeWidth={19} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <rect x={-9} y={-306} width={18} height={22} fill={col} />
      <ellipse cx={0} cy={-322} rx={22} ry={26} fill={col} />
    </g>
  );
  return (
    <g opacity={opacity}>
      {rim ? <g transform={`translate(${x} ${y + 1.5}) scale(${s * sx * 1.03} ${s * 1.012})`}>{body(rim)}</g> : null}
      <g transform={`translate(${x} ${y}) scale(${s * sx} ${s})`}>{body(color)}</g>
    </g>
  );
};

// ───────────────────────── Texto poético ─────────────────────────
/** Verso: las palabras emergen del desenfoque, como un pensamiento */
export const Verse: React.FC<{
  x: number;
  y: number;
  text: string;
  t: number;
  at: number;
  out?: number;
  size?: number;
  color?: string;
  italic?: boolean;
  weight?: number;
  glow?: string;
  stagger?: number;
  w?: number;
  align?: 'center' | 'left' | 'right';
  spacing?: string;
  font?: string;
}> = ({x, y, text, t, at, out, size = 54, color = '#F4EEE2', italic = true, weight = 300, glow = 'rgba(255,240,215,0.35)', stagger = 0.09, w = 1700, align = 'center', spacing = '0.02em', font = SERIF}) => {
  if (t < at - 0.1) return null;
  const o = out !== undefined ? 1 - eio(t, out, 0.8) : 1;
  if (o <= 0) return null;
  const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
  let idx = 0;
  return (
    <foreignObject x={x0} y={y - size} width={w} height={size * 3.4} style={{overflow: 'visible'}}>
      <div
        style={{
          fontFamily: font,
          fontStyle: italic ? 'italic' : 'normal',
          fontWeight: weight,
          fontSize: size,
          color,
          textAlign: align,
          lineHeight: 1.18,
          letterSpacing: spacing,
          textShadow: `0 0 ${size * 0.5}px ${glow}, 0 2px 12px rgba(0,0,0,0.6)`,
          opacity: o,
          filter: o < 1 ? `blur(${(1 - o) * 8}px)` : undefined,
        }}
      >
        {text.split('\n').map((line, li) => (
          <div key={li}>
            {line.split(' ').map((word, wi) => {
              const k = eo(t, at + idx++ * stagger, 1.1);
              return (
                <span key={wi} style={{display: 'inline-block', marginRight: '0.28em', opacity: k, filter: k < 1 ? `blur(${(1 - k) * 10}px)` : undefined, transform: `translateY(${(1 - k) * 10}px)`}}>
                  {word}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </foreignObject>
  );
};

/** Texto de brasas: letras naranjas que titilan y suben despacio */
export const EmberText: React.FC<{x: number; y: number; text: string; t: number; at: number; out?: number; size?: number; color?: string; rise?: number; scatter?: number}> = ({
  x,
  y,
  text,
  t,
  at,
  out,
  size = 76,
  color = '#FFB65C',
  rise = 8,
  scatter = 0,
}) => {
  if (t < at - 0.1) return null;
  const o = out !== undefined ? 1 - eio(t, out, 1.0) : 1;
  if (o <= 0) return null;
  const chars = Array.from(text);
  return (
    <foreignObject x={x - 900} y={y - size} width={1800} height={size * 2.4} style={{overflow: 'visible'}}>
      <div style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 400, fontSize: size, color, textAlign: 'center', whiteSpace: 'nowrap'}}>
        {chars.map((ch, i) => {
          const k = eo(t, at + i * 0.045, 0.9);
          const fl = 0.75 + 0.25 * Math.sin(t * 9 + i * 1.7) * Math.sin(t * 3.1 + i);
          const sx = scatter * (hash(i * 3.3) - 0.5) * 300;
          const sy = -scatter * (100 + hash(i * 7.1) * 300);
          return (
            <span
              key={i}
              style={{
                display: 'inline-block',
                whiteSpace: 'pre',
                opacity: k * o * fl,
                transform: `translate(${sx}px, ${(1 - k) * 20 - (t - at) * rise + sy}px)`,
                textShadow: `0 0 18px ${color}, 0 0 40px rgba(255,120,40,0.6)`,
                filter: k < 1 ? `blur(${(1 - k) * 6}px)` : undefined,
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          );
        })}
      </div>
    </foreignObject>
  );
};

/** Título de acto: número romano + nombre, escritos en luz */
export const ActTitle: React.FC<{t: number; at: number; num: string; title: string; dur?: number; color?: string}> = ({t, at, num, title, dur = 2.4, color = '#FFF3DC'}) => {
  if (t < at || t > at + dur + 1) return null;
  const o = eo(t, at, 0.8) * (1 - eio(t, at + dur, 0.8));
  return (
    <g opacity={o}>
      <rect x={-100} y={-100} width={2120} height={1280} fill="#000" opacity={0.45} />
      <Verse x={960} y={470} text={num} t={t} at={at} size={46} italic={false} weight={500} spacing="0.6em" color={color} />
      <Verse x={960} y={590} text={title} t={t} at={at + 0.25} size={92} color={color} glow="rgba(255,220,170,0.5)" />
    </g>
  );
};
