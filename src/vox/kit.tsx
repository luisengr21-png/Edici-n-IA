import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import {clamp, easeInOut, easeOut, lerp} from '../estatus/kit';

export {clamp, lerp, easeInOut, easeOut, easeIn, easeOutBack, pr, eo, eio, pop, settle} from '../estatus/kit';

// ───────────────────────── Paleta ─────────────────────────
export const V = {
  paper: '#f2eee5',
  news: '#e7e1d3',
  grid: '#c4d3d9',
  ink: '#1a1a1a',
  inkSoft: '#55524c',
  yellow: '#ffe135',
  hl: '#ffe94a',
  red: '#e2372b',
  green: '#3f9b6b',
  blue: '#1f4e5f',
  blueDeep: '#13303b',
  gray: '#8d8a83',
  grayLight: '#c9c5bc',
  board: '#1c1f1e',
  cork: '#c69c6d',
};

export const HEAD = '"Barlow Condensed", "Oswald", sans-serif';
export const SANS = '"Libre Franklin", Arial, sans-serif';
export const TYPE = '"Special Elite", "Courier New", monospace';
export const MARK = '"Permanent Marker", cursive';
export const SERIF = '"Libre Caslon Text", Georgia, serif';
export const GOTH = 'UnifrakturMaguntia, serif';

const faces: [string, string, string, string][] = [
  ['Barlow Condensed', 'BarlowC-600.woff', '600', 'normal'],
  ['Barlow Condensed', 'BarlowC-800.woff', '800', 'normal'],
  ['Libre Franklin', 'Franklin-400.woff', '400', 'normal'],
  ['Libre Franklin', 'Franklin-700.woff', '700', 'normal'],
  ['Special Elite', 'SpecialElite.woff', '400', 'normal'],
  ['Permanent Marker', 'PermanentMarker.woff', '400', 'normal'],
  ['Libre Caslon Text', 'Caslon.woff', '400', 'normal'],
  ['Libre Caslon Text', 'Caslon-italic.woff', '400', 'italic'],
  ['UnifrakturMaguntia', 'Unifraktur.woff', '400', 'normal'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('Tipografías vox');
  Promise.all(
    faces.map(([fam, file, weight, style]) => {
      const f = new FontFace(fam, `url(${staticFile(`vox/fonts/${file}`)}) format('woff')`, {weight, style});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}

// ───────────────────────── Filtros ─────────────────────────
const DOT = (size: number) =>
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><defs><radialGradient id="g" cx="0.5" cy="0.5" r="0.7071"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient></defs><rect width="${size}" height="${size}" fill="url(#g)"/></svg>`,
  );
const THRESH = (lo: number, hi: number) => Array.from({length: 20}, (_, i) => (i === 19 ? hi : lo)).join(' ');

/** Semitono: dibujo en grises -> foto impresa en periódico, con borde de pegatina y sombra */
export const VoxDefs: React.FC = () => (
  <defs>
    {[
      ['cutout', 7, 8],
      ['cutoutFine', 5, 6],
      ['halftone', 7, 0],
    ].map(([id, dot, border]) => (
      <filter key={id as string} id={id as string} x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0.3 0.59 0.11 0 0  0 0 0 1 0" result="gray" />
        <feFlood floodColor="#ffffff" result="white" />
        <feComposite in="gray" in2="white" operator="over" result="grayOpaque" />
        <feImage href={DOT(dot as number)} x="0" y="0" width={dot as number} height={dot as number} result="dot" />
        <feTile in="dot" result="dots" />
        <feComposite in="grayOpaque" in2="dots" operator="arithmetic" k1="0" k2="1" k3="1" k4="-0.02" result="sum" />
        <feComponentTransfer in="sum" result="ht">
          <feFuncR type="discrete" tableValues={THRESH(0.1, 0.96)} />
          <feFuncG type="discrete" tableValues={THRESH(0.1, 0.95)} />
          <feFuncB type="discrete" tableValues={THRESH(0.11, 0.92)} />
        </feComponentTransfer>
        <feComposite in="ht" in2="SourceAlpha" operator="in" result="htClip" />
        {(border as number) > 0 ? (
          <>
            <feMorphology in="SourceAlpha" operator="dilate" radius={border as number} result="fat" />
            <feFlood floodColor="#fbfaf6" result="paperWhite" />
            <feComposite in="paperWhite" in2="fat" operator="in" result="sticker" />
            <feGaussianBlur in="fat" stdDeviation="7" result="blur" />
            <feOffset in="blur" dx="5" dy="9" result="off" />
            <feFlood floodColor="#000" floodOpacity="0.32" />
            <feComposite in2="off" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="sticker" />
              <feMergeNode in="htClip" />
            </feMerge>
          </>
        ) : null}
      </filter>
    ))}
    {/* foto a color desvaída (Kodachrome) con borde blanco */}
    <filter id="kodak" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
      <feColorMatrix in="SourceGraphic" type="matrix" values="0.9 0.12 0.05 0 0.06  0.06 0.82 0.1 0 0.05  0.04 0.1 0.66 0 0.04  0 0 0 1 0" result="warm" />
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="noise" />
      <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.12 0" result="grain" />
      <feComposite in="grain" in2="SourceAlpha" operator="in" result="grainClip" />
      <feMorphology in="SourceAlpha" operator="dilate" radius="10" result="fat" />
      <feFlood floodColor="#fbfaf4" />
      <feComposite in2="fat" operator="in" result="sticker" />
      <feGaussianBlur in="fat" stdDeviation="8" result="blur" />
      <feOffset in="blur" dx="6" dy="10" result="off" />
      <feFlood floodColor="#000" floodOpacity="0.3" />
      <feComposite in2="off" operator="in" result="shadow" />
      <feMerge>
        <feMergeNode in="shadow" />
        <feMergeNode in="sticker" />
        <feMergeNode in="warm" />
        <feMergeNode in="grainClip" />
      </feMerge>
    </filter>
    {/* sombra suave para papeles y documentos */}
    <filter id="paperShadow" x="-10%" y="-10%" width="125%" height="130%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="8" />
      <feOffset dx="4" dy="10" result="o" />
      <feFlood floodColor="#000" floodOpacity="0.28" />
      <feComposite in2="o" operator="in" />
      <feMerge>
        <feMergeNode />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    {/* trazo de rotulador ligeramente irregular */}
    <filter id="rough" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="4" result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="softBlur" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="12" />
    </filter>
    <pattern id="gridPaper" width="40" height="40" patternUnits="userSpaceOnUse">
      <rect width="40" height="40" fill={V.paper} />
      <path d="M40 0 L0 0 0 40" fill="none" stroke={V.grid} strokeWidth="1" />
      <path d="M20 0 L20 40 M0 20 L40 20" fill="none" stroke={V.grid} strokeWidth="0.5" opacity="0.6" />
    </pattern>
    <pattern id="newsprint" width="6" height="6" patternUnits="userSpaceOnUse">
      <rect width="6" height="6" fill={V.news} />
      <circle cx="3" cy="3" r="0.7" fill="#cfc8b8" />
    </pattern>
  </defs>
);

// ───────────────────────── Cámara con paralaje ─────────────────────────
type CamState = {cx: number; cy: number; z: number; rot: number};
const CamCtx = React.createContext<CamState>({cx: 960, cy: 540, z: 1, rot: 0});

/** Cámara 2.5D: los hijos se agrupan en <Layer depth> que se mueven distinto según su profundidad */
export const Cam: React.FC<{
  t: number;
  keys: [number, number, number, number][]; // [tiempo, cx, cy, zoom]
  rot?: number;
  children: React.ReactNode;
}> = ({t, keys, rot = 0, children}) => {
  let st: CamState = {cx: keys[0][1], cy: keys[0][2], z: keys[0][3], rot};
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, x0, y0, z0] = keys[i];
    const [t1, x1, y1, z1] = keys[i + 1];
    if (t >= t0) {
      const k = easeInOut(clamp((t - t0) / (t1 - t0)));
      st = {cx: lerp(x0, x1, k), cy: lerp(y0, y1, k), z: lerp(z0, z1, k), rot};
    }
  }
  return <CamCtx.Provider value={st}>{children}</CamCtx.Provider>;
};

export const Layer: React.FC<{depth?: number; children: React.ReactNode}> = ({depth = 1, children}) => {
  const {cx, cy, z, rot} = React.useContext(CamCtx);
  const ze = 1 + (z - 1) * depth;
  const ox = 960 + (cx - 960) * depth;
  const oy = 540 + (cy - 540) * depth;
  return <g transform={`translate(960 540) rotate(${rot * depth}) scale(${ze}) translate(${-ox} ${-oy})`}>{children}</g>;
};

// ───────────────────────── Recortes y papeles ─────────────────────────
/** Recorte de «foto de archivo» en semitono con borde blanco */
export const Cutout: React.FC<{children: React.ReactNode; fine?: boolean; noBorder?: boolean; opacity?: number}> = ({children, fine, noBorder, opacity = 1}) => (
  <g filter={`url(#${noBorder ? 'halftone' : fine ? 'cutoutFine' : 'cutout'})`} opacity={opacity}>
    {children}
  </g>
);

/** Cinta adhesiva semitransparente */
export const Tape: React.FC<{x: number; y: number; w?: number; rot?: number}> = ({x, y, w = 120, rot = -8}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={`M${-w / 2} -16 L${w / 2} -18 L${w / 2 - 4} -10 L${w / 2 + 2} -2 L${w / 2 - 3} 6 L${w / 2} 16 L${-w / 2} 18 L${-w / 2 + 3} 8 L${-w / 2 - 2} 0 L${-w / 2 + 4} -8 Z`} fill="#efe6c8" opacity={0.78} />
  </g>
);

/** Hoja de papel con sombra */
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; rot?: number; fill?: string; children?: React.ReactNode}> = ({x, y, w, h, rot = 0, fill = '#fbfaf5', children}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={fill} filter="url(#paperShadow)" />
    {children}
  </g>
);

// ───────────────────────── Texto ─────────────────────────
/** Texto mecanografiado: aparece carácter a carácter */
export const Typed: React.FC<{
  x: number;
  y: number;
  text: string;
  p: number;
  size?: number;
  font?: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
  caret?: boolean;
  spacing?: number;
}> = ({x, y, text, p, size = 40, font = TYPE, color = V.ink, anchor = 'start', weight = 400, caret, spacing = 0}) => {
  if (p <= 0) return null;
  const n = Math.round(clamp(p) * text.length);
  return (
    <text x={x} y={y} fontFamily={font} fontSize={size} fill={color} textAnchor={anchor} fontWeight={weight} letterSpacing={spacing}>
      {text.slice(0, n)}
      {caret && p < 1 ? <tspan fill={V.red}>|</tspan> : null}
      {anchor !== 'start' ? <tspan opacity={0}>{text.slice(n)}</tspan> : null}
    </text>
  );
};

/** Subrayador amarillo que barre de izquierda a derecha detrás de un texto */
export const Highlight: React.FC<{x: number; y: number; w: number; h: number; p: number; color?: string; rot?: number}> = ({x, y, w, h, p, color = V.hl, rot = -0.6}) => {
  if (p <= 0) return null;
  const ww = w * easeOut(clamp(p));
  const j = (k: number) => Math.sin(k * 12.9898) * 2.5;
  return (
    <path
      transform={`rotate(${rot} ${x} ${y})`}
      d={`M${x} ${y + j(1)} L${x + ww} ${y + j(2)} L${x + ww + 4} ${y + h * 0.5} L${x + ww} ${y + h + j(3)} L${x} ${y + h + j(4)} L${x - 3} ${y + h * 0.5} Z`}
      fill={color}
      opacity={0.92}
      style={{mixBlendMode: 'multiply'}}
    />
  );
};

/** Trazo de rotulador que se dibuja */
export const Marker: React.FC<{d: string; p: number; color?: string; w?: number; opacity?: number}> = ({d, p, color = V.red, w = 6, opacity = 0.92}) => {
  if (p <= 0) return null;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - clamp(p)}
      opacity={opacity}
      filter="url(#rough)"
    />
  );
};

/** Elipse de rotulador alrededor de algo (un poco más de una vuelta, como a mano) */
export const MarkerCircle: React.FC<{cx: number; cy: number; rx: number; ry: number; p: number; color?: string; w?: number}> = ({cx, cy, rx, ry, p, color, w}) => {
  const pts: string[] = [];
  for (let i = 0; i <= 44; i++) {
    const a = -2.2 + (i / 40) * Math.PI * 2;
    const k = 1 + Math.sin(i * 0.9) * 0.03 + i * 0.002;
    pts.push(`${i ? 'L' : 'M'}${(cx + Math.cos(a) * rx * k).toFixed(1)} ${(cy + Math.sin(a) * ry * k).toFixed(1)}`);
  }
  return <Marker d={pts.join(' ')} p={p} color={color} w={w} />;
};

/** Flecha de rotulador de (x0,y0) a (x1,y1), con curva */
export const MarkerArrow: React.FC<{x0: number; y0: number; x1: number; y1: number; p: number; bend?: number; color?: string}> = ({x0, y0, x1, y1, p, bend = 40, color}) => {
  const mx = (x0 + x1) / 2 - ((y1 - y0) / Math.hypot(x1 - x0, y1 - y0)) * bend;
  const my = (y0 + y1) / 2 + ((x1 - x0) / Math.hypot(x1 - x0, y1 - y0)) * bend;
  const ang = Math.atan2(y1 - my, x1 - mx);
  const h1 = `M${x1} ${y1} L${x1 - Math.cos(ang - 0.5) * 26} ${y1 - Math.sin(ang - 0.5) * 26}`;
  const h2 = `M${x1} ${y1} L${x1 - Math.cos(ang + 0.5) * 26} ${y1 - Math.sin(ang + 0.5) * 26}`;
  return (
    <g>
      <Marker d={`M${x0} ${y0} Q${mx} ${my} ${x1} ${y1}`} p={p * 1.25} color={color} />
      <Marker d={h1} p={(p - 0.8) * 5} color={color} />
      <Marker d={h2} p={(p - 0.85) * 6} color={color} />
    </g>
  );
};

/** Etiqueta pequeña tipo Vox (p. ej. «Gráfico ilustrativo») */
export const Tag: React.FC<{x: number; y: number; text: string; p?: number; dark?: boolean; anchor?: 'start' | 'end'}> = ({x, y, text, p = 1, dark, anchor = 'start'}) => {
  const w = text.length * 9.6 + 28;
  const x0 = anchor === 'end' ? x - w : x;
  return (
    <g opacity={clamp(p)}>
      <rect x={x0} y={y - 22} width={w} height={32} fill={dark ? V.ink : '#fbfaf5'} stroke={V.ink} strokeWidth={1.4} />
      <text x={x0 + 14} y={y} fontFamily={SANS} fontSize={15} fontWeight={700} letterSpacing={1.6} fill={dark ? '#fbfaf5' : V.ink}>
        {text.toUpperCase()}
      </text>
    </g>
  );
};

/** Cartela de capítulo amarilla a pantalla completa */
export const ChapterCard: React.FC<{t: number; at: number; dur?: number; num: string; title: string}> = ({t, at, dur = 1.7, num, title}) => {
  if (t < at || t > at + dur + 0.5) return null;
  const inK = clamp((t - at) / 0.18);
  const outK = easeInOut(clamp((t - at - dur) / 0.45));
  const slam = lerp(1.25, 1, easeOut(inK));
  return (
    <g transform={`translate(0 ${-outK * 1100})`}>
      <rect x={-20} y={-20} width={1960} height={1120} fill={V.yellow} />
      <g transform={`translate(960 540) scale(${slam}) translate(-960 -540)`} opacity={inK}>
        <text x={960} y={470} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={120} fill={V.ink}>
          {num}
        </text>
        <text x={960} y={640} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={170} fill={V.ink} letterSpacing={2}>
          {title}
        </text>
        <rect x={760} y={680} width={400} height={10} fill={V.ink} />
      </g>
    </g>
  );
};

/** Fondo de papel milimetrado o de periódico */
export const Bg: React.FC<{kind?: 'grid' | 'news' | 'paper' | 'dark' | 'cork' | 'yellow'}> = ({kind = 'grid'}) => {
  const fill = kind === 'grid' ? 'url(#gridPaper)' : kind === 'news' ? 'url(#newsprint)' : kind === 'dark' ? V.board : kind === 'cork' ? V.cork : kind === 'yellow' ? V.yellow : V.paper;
  return <rect x={-1200} y={-1200} width={4320} height={3480} fill={fill} />;
};

// ───────────────────────── Persona «fotográfica» (para semitono) ─────────────────────────
export type PhotoPersonProps = {
  x: number;
  y: number;
  s?: number;
  suit?: number; // gris del traje 0..255
  shirt?: number;
  skin?: number;
  hair?: 'short' | 'long' | 'bun' | 'bald' | 'curly' | 'wavy';
  hairTone?: number;
  dress?: boolean;
  tie?: boolean;
  look?: number; // -1..1 hacia dónde mira
  armL?: [number, number];
  armR?: [number, number];
  holdL?: React.ReactNode;
  holdR?: React.ReactNode;
  smile?: boolean;
  sad?: boolean;
  hat?: boolean;
  child?: boolean;
  sit?: boolean;
  colors?: {suit: string; skin: string; hair: string; shirt?: string};
};

const g0 = (v: number) => `rgb(${v},${v},${v})`;
const shade = (hex: string, d: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.max(0, Math.min(255, c + d));
  return `rgb(${f((n >> 16) & 255)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

const limb = (sx: number, sy: number, a: number, b: number, l1: number, l2: number) => {
  const r = Math.PI / 180;
  const ex = sx + Math.sin(a * r) * l1;
  const ey = sy + Math.cos(a * r) * l1;
  return {ex, ey, hx: ex + Math.sin((a + b) * r) * l2, hy: ey + Math.cos((a + b) * r) * l2};
};

/** Figura de proporciones realistas, en grises con luz lateral: al pasar por el semitono parece una foto de época. Origen entre los pies. */
export const PhotoPerson: React.FC<PhotoPersonProps> = ({
  x,
  y,
  s = 1,
  suit = 60,
  shirt = 225,
  skin = 188,
  hair = 'short',
  hairTone = 40,
  dress,
  tie = true,
  look = 0,
  armL = [12, 8],
  armR = [12, 8],
  holdL,
  holdR,
  smile,
  sad,
  hat,
  child,
  sit,
  colors,
}) => {
  // color por rol: en gris para el semitono o con paleta para la foto a color
  const base = {suit, skin, hair: hairTone, shirt};
  const c = (role: 'suit' | 'skin' | 'hair' | 'shirt', d = 0) =>
    colors ? shade(role === 'shirt' ? colors.shirt ?? '#f4efe6' : colors[role], d) : g0(Math.max(0, Math.min(255, base[role] + d)));
  const g = g0;
  const sc = child ? s * 0.62 : s;
  const lx = look * 6;
  const L = limb(-44, -318, armL[0] * -1, armL[1] * -1, 92, 86);
  const R = limb(44, -318, armR[0], armR[1], 92, 86);
  const id = `pp${Math.round(x)}_${Math.round(y)}_${suit}`;
  return (
    <g transform={`translate(${x} ${y}) scale(${sc})`}>
      <defs>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={c('suit', 50)} />
          <stop offset="1" stopColor={c('suit', -30)} />
        </linearGradient>
        <radialGradient id={`${id}f`} cx="0.38" cy="0.4" r="0.7">
          <stop offset="0" stopColor={c('skin', 50)} />
          <stop offset="1" stopColor={c('skin', -55)} />
        </radialGradient>
      </defs>
      {/* piernas */}
      {sit ? (
        <g>
          <path d="M-30 -196 L70 -196 L72 -40" stroke={c('suit', -15)} strokeWidth={34} fill="none" strokeLinejoin="round" />
          <path d="M20 -190 L110 -190 L112 -40" stroke={c('suit', -30)} strokeWidth={34} fill="none" strokeLinejoin="round" />
          <ellipse cx={86} cy={-30} rx={28} ry={11} fill={g(25)} />
          <ellipse cx={126} cy={-30} rx={28} ry={11} fill={g(25)} />
        </g>
      ) : dress ? (
        <g>
          <path d="M-16 -120 L-20 -6 M18 -120 L22 -6" stroke={c('skin', -20)} strokeWidth={20} strokeLinecap="round" />
          <ellipse cx={-22} cy={-4} rx={18} ry={8} fill={g(30)} />
          <ellipse cx={24} cy={-4} rx={18} ry={8} fill={g(30)} />
        </g>
      ) : (
        <g>
          <path d="M-22 -200 L-26 -10" stroke={c('suit', -10)} strokeWidth={36} strokeLinecap="round" />
          <path d="M22 -200 L26 -10" stroke={c('suit', -35)} strokeWidth={36} strokeLinecap="round" />
          <ellipse cx={-30} cy={-4} rx={26} ry={10} fill={g(25)} />
          <ellipse cx={30} cy={-4} rx={26} ry={10} fill={g(25)} />
        </g>
      )}
      {/* brazo izquierdo (detrás) */}
      <path d={`M-44 -318 L${L.ex} ${L.ey} L${L.hx} ${L.hy}`} stroke={c('suit', -20)} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={L.hx} cy={L.hy} r={13} fill={`url(#${id}f)`} />
      {holdL ? <g transform={`translate(${L.hx} ${L.hy})`}>{holdL}</g> : null}
      {/* torso */}
      {dress ? (
        <path d="M-48 -330 C-58 -300 -56 -250 -48 -210 L-80 -110 L80 -110 L48 -210 C56 -250 58 -300 48 -330 Q0 -344 -48 -330 Z" fill={`url(#${id}s)`} />
      ) : (
        <g>
          <path d="M-52 -330 C-62 -300 -60 -240 -54 -190 L54 -190 C60 -240 62 -300 52 -330 Q0 -344 -52 -330 Z" fill={`url(#${id}s)`} />
          <path d="M-18 -334 L0 -270 L18 -334 Z" fill={c('shirt')} />
          {tie ? <path d="M-6 -326 L6 -326 L9 -262 L0 -248 L-9 -262 Z" fill={g(35)} /> : null}
          <path d="M-18 -334 L-4 -276 L-30 -300 Z M18 -334 L4 -276 L30 -300 Z" fill={c('suit', -25)} />
        </g>
      )}
      {/* cuello y cabeza */}
      <path d="M-11 -336 L-11 -356 L11 -356 L11 -336 Z" fill={c('skin', -30)} />
      {hair === 'long' || hair === 'wavy' ? <path d="M-30 -392 C-44 -360 -44 -320 -34 -300 L34 -300 C44 -320 44 -360 30 -392 Z" fill={c('hair')} /> : null}
      <ellipse cx={lx * 0.4} cy={-382} rx={24} ry={30} fill={`url(#${id}f)`} />
      {/* rasgos */}
      <ellipse cx={-9 + lx} cy={-386} rx={3.4} ry={2.4} fill={g(30)} />
      <ellipse cx={9 + lx} cy={-386} rx={3.4} ry={2.4} fill={g(30)} />
      <path d={`M${-13 + lx} -394 L${-5 + lx} ${sad ? -392 : -395} M${5 + lx} ${sad ? -392 : -395} L${13 + lx} -394`} stroke={g(45)} strokeWidth={2.2} />
      <path d={`M${1 + lx * 1.3} -384 L${4 + lx * 1.3} -372 L${-1 + lx} -370`} stroke={c('skin', -70)} strokeWidth={2.4} fill="none" />
      <path d={smile ? `M${-8 + lx} -363 Q${lx} -357 ${8 + lx} -363` : sad ? `M${-8 + lx} -360 Q${lx} -365 ${8 + lx} -360` : `M${-7 + lx} -362 L${7 + lx} -362`} stroke={g(60)} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      {/* pelo */}
      {hair === 'short' ? <path d="M-25 -388 C-28 -416 -6 -420 6 -418 C22 -416 30 -404 25 -386 C18 -400 6 -404 -6 -402 C-14 -400 -20 -396 -25 -388 Z" fill={c('hair')} /> : null}
      {hair === 'bald' ? <path d="M-24 -380 C-26 -372 -24 -366 -20 -364 M24 -380 C26 -372 24 -366 20 -364" stroke={c('hair')} strokeWidth={6} /> : null}
      {hair === 'bun' ? (
        <g fill={c('hair')}>
          <circle cx={0} cy={-418} r={14} />
          <path d="M-25 -386 C-28 -414 28 -414 25 -386 C16 -400 -16 -400 -25 -386 Z" />
        </g>
      ) : null}
      {hair === 'curly' ? (
        <g fill={c('hair')}>
          {[[-20, -400], [-8, -412], [8, -412], [20, -400], [-24, -384], [24, -384]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={12} />
          ))}
        </g>
      ) : null}
      {hair === 'long' || hair === 'wavy' ? <path d="M-26 -384 C-30 -416 30 -416 26 -384 C14 -402 -14 -402 -26 -384 Z" fill={c('hair')} /> : null}
      {hat ? (
        <g fill={g(30)}>
          <ellipse cx={0} cy={-404} rx={40} ry={8} />
          <path d="M-24 -404 L-22 -440 Q0 -448 22 -440 L24 -404 Z" />
        </g>
      ) : null}
      {/* brazo derecho (delante) */}
      <path d={`M44 -318 L${R.ex} ${R.ey} L${R.hx} ${R.hy}`} stroke={c('suit', 15)} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {holdR ? <g transform={`translate(${R.hx} ${R.hy})`}>{holdR}</g> : null}
      <circle cx={R.hx} cy={R.hy} r={13} fill={`url(#${id}f)`} />
    </g>
  );
};

export const _vk = {g0};
