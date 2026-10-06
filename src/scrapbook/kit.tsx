import React, {createContext, useContext} from 'react';
import {AbsoluteFill, continueRender, delayRender, Img, staticFile} from 'remotion';
import {Fig, hash, clamp, easeOutBack, lerp, mixHex} from '../serreal/kit';

export * from '../serreal/kit';

// ───────────────────────── Tiempo stop-motion ─────────────────────────
export const SB_FPS = 24;
/** Poses «a dos»: la animación avanza cada 2 fotogramas (12 poses/s) */
export const poseOf = (frame: number) => Math.floor(frame / 2);
export const PoseCtx = createContext(0);
export const usePose = () => useContext(PoseCtx);

// ───────────────────────── Paleta de papelería ─────────────────────────
export const K = {
  paper: '#f3ead7',
  paperDark: '#e6d8bb',
  kraft: '#c9a27a',
  kraftDark: '#a9825a',
  ink: '#2e2a26',
  graphite: '#4a4640',
  mustard: '#e3a93b',
  mustardDark: '#b9832a',
  sepia: '#b79b72',
  tomato: '#d9573f',
  tomatoLight: '#f0b3a3',
  sage: '#5e9c8f',
  sageLight: '#b9d8cf',
  blue: '#7fa3b8',
  blueLight: '#cfe0ea',
  news: '#a9a397',
  newsDark: '#8e897f',
  card: '#2b2826',
  white: '#fffdf6',
  wood: '#5b3d26',
  night: '#1e2433',
  gridBlue: '#a9c4d6',
};

const faces: [string, string, string][] = [
  ['SpecialElite', 'scrapbook/fonts/special-elite-latin-400-normal.woff2', '400'],
  ['Abril', 'scrapbook/fonts/abril-fatface-latin-400-normal.woff2', '400'],
  ['Anton', 'scrapbook/fonts/anton-latin-400-normal.woff2', '400'],
  ['Caveat', 'estatus/fonts/Caveat-700.woff', '700'],
  ['IMFell', 'estatus/fonts/IMFell.woff', '400'],
  ['Cormorant', 'fonts/CormorantGaramond-500-normal.woff', '500'],
  ['InterSB', 'fonts/Inter-500-normal.woff', '500'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('Tipografías scrapbook');
  Promise.all(
    faces.map(([fam, file, weight]) => {
      const f = new FontFace(fam, `url(${staticFile(file)})`, {weight});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}
export const TYPEWRITER = 'SpecialElite, "Courier New", monospace';

// ───────────────────────── Filtros SVG ─────────────────────────
/** Defs de cada hoja: pegatina (borde blanco + sombra), sombra de papel, trazo que hierve */
export const SDefs: React.FC = () => {
  const pose = usePose();
  return (
    <defs>
      <filter id="sticker" x="-25%" y="-25%" width="150%" height="150%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="5" result="d" />
        <feFlood floodColor={K.white} result="w" />
        <feComposite in="w" in2="d" operator="in" result="border" />
        <feGaussianBlur in="d" stdDeviation="3.5" result="sb" />
        <feOffset in="sb" dx="4" dy="6" result="so" />
        <feFlood floodColor="#2a1c10" floodOpacity="0.35" />
        <feComposite in2="so" operator="in" result="shadow" />
        <feMerge>
          <feMergeNode in="shadow" />
          <feMergeNode in="border" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
      <filter id="pshadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="3" dy="5" stdDeviation="4" floodColor="#2a1c10" floodOpacity="0.3" />
      </filter>
      <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={2} seed={Math.floor(pose / 2) % 3} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={3.2} xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="watercolor" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={3} seed={4} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={26} xChannelSelector="R" yChannelSelector="G" result="d" />
        <feGaussianBlur in="d" stdDeviation="1.6" />
      </filter>
      <filter id="soft8" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="8" />
      </filter>
      <radialGradient id="lamp">
        <stop offset="0" stopColor="#fff2c8" stopOpacity={0.55} />
        <stop offset="0.5" stopColor="#ffd98a" stopOpacity={0.16} />
        <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="dawn">
        <stop offset="0" stopColor="#ffe3a0" stopOpacity={0.9} />
        <stop offset="0.35" stopColor="#f4b25a" stopOpacity={0.45} />
        <stop offset="1" stopColor="#d9573f" stopOpacity={0} />
      </radialGradient>
      <radialGradient id="phoneLight">
        <stop offset="0" stopColor="#bcd6ff" stopOpacity={0.55} />
        <stop offset="1" stopColor="#bcd6ff" stopOpacity={0} />
      </radialGradient>
      <linearGradient id="tissue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffe27a" stopOpacity={0.75} />
        <stop offset="1" stopColor="#ffe27a" stopOpacity={0.35} />
      </linearGradient>
      <pattern id="washiA" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="22" height="22" fill={K.sageLight} />
        <rect width="9" height="22" fill={K.white} opacity={0.7} />
      </pattern>
      <pattern id="washiB" width="26" height="26" patternUnits="userSpaceOnUse">
        <rect width="26" height="26" fill={K.tomatoLight} />
        <circle cx="13" cy="13" r="4" fill={K.white} opacity={0.8} />
      </pattern>
      <pattern id="washiC" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
        <rect width="18" height="18" fill="#f2d48a" />
        <rect width="6" height="18" fill={K.mustard} opacity={0.6} />
      </pattern>
      <pattern id="gridPat" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M40 0 L0 0 L0 40" fill="none" stroke={K.gridBlue} strokeWidth={1.4} />
      </pattern>
    </defs>
  );
};

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', ...style}}>
    <SDefs />
    {children}
  </svg>
);

// ───────────────────────── Hojas ─────────────────────────
export type PageKind = 'paper' | 'grid' | 'kraft' | 'night' | 'cork' | 'tomato' | 'sage';
const PAGE_COL: Record<PageKind, string> = {
  paper: K.paper,
  grid: '#f5f1e6',
  kraft: K.kraft,
  night: K.night,
  cork: '#b88a5a',
  tomato: '#efc4b6',
  sage: '#c7ddd4',
};
/** Hoja de papel a pantalla completa con fibra, retícula opcional y bordes tostados */
export const Page: React.FC<{kind?: PageKind; tint?: string; children?: React.ReactNode}> = ({kind = 'paper', tint, children}) => (
  <AbsoluteFill style={{background: tint ?? PAGE_COL[kind]}}>
    <Img src={staticFile('estatus/paper.jpg')} style={{position: 'absolute', width: 1920, height: 1080, mixBlendMode: 'multiply', opacity: kind === 'night' ? 0.35 : 0.6}} />
    {kind === 'grid' && (
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        <SDefs />
        <rect width={1920} height={1080} fill="url(#gridPat)" opacity={0.8} />
        <line x1={160} x2={160} y1={0} y2={1080} stroke={K.tomato} strokeWidth={2} opacity={0.5} />
      </svg>
    )}
    {kind === 'cork' && (
      <svg width={1920} height={1080} style={{position: 'absolute'}}>
        {Array.from({length: 900}).map((_, i) => (
          <circle key={i} cx={hash(i) * 1920} cy={hash(i * 7.1) * 1080} r={1 + hash(i * 3.3) * 3} fill={hash(i * 1.7) > 0.5 ? '#8e6436' : '#d8ad78'} opacity={0.5} />
        ))}
      </svg>
    )}
    {children}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 62%, rgba(70,40,15,0.28) 100%)'}} />
  </AbsoluteFill>
);

// ───────────────────────── Recortes ─────────────────────────
/** Temblor de stop-motion: desplazamiento y giro mínimos que cambian con cada pose */
export const useJitter = (id: number, amt = 1) => {
  const pose = Math.floor(usePose() / 2);
  return {
    dx: (hash(pose * 13.1 + id * 7.7) - 0.5) * 2.4 * amt,
    dy: (hash(pose * 5.3 + id * 3.1) - 0.5) * 2.4 * amt,
    rot: (hash(pose * 9.7 + id * 1.3) - 0.5) * 1.0 * amt,
  };
};

/** Recorte con borde blanco de tijera, sombra y temblor */
export const Cut: React.FC<{id?: number; x?: number; y?: number; rot?: number; s?: number; children: React.ReactNode; opacity?: number; jitter?: number; plain?: boolean}> = ({
  id = 0,
  x = 0,
  y = 0,
  rot = 0,
  s = 1,
  children,
  opacity = 1,
  jitter = 1,
  plain,
}) => {
  const j = useJitter(id, jitter);
  return (
    <g filter={plain ? 'url(#pshadow)' : 'url(#sticker)'} opacity={opacity}>
      <g transform={`translate(${x + j.dx} ${y + j.dy}) rotate(${rot + j.rot}) scale(${s})`}>{children}</g>
    </g>
  );
};

/** Figura de cartulina (origen en los pies) */
export const PFig: React.FC<{id?: number; x: number; y: number; s?: number; color?: string; child?: number; opacity?: number; rot?: number; children?: React.ReactNode}> = ({
  id = 0,
  x,
  y,
  s = 1,
  color = K.mustard,
  child = 0,
  opacity = 1,
  rot = 0,
  children,
}) => (
  <Cut id={id} x={x} y={y} s={s} rot={rot} opacity={opacity}>
    <Fig x={0} y={0} s={1} color={color} child={child} shadow={false}>
      {children}
    </Fig>
  </Cut>
);

/** Figura de confeti vista desde arriba */
export const Dot: React.FC<{x: number; y: number; s?: number; color?: string; dir?: number; id?: number; flip?: number}> = ({x, y, s = 1, color = K.news, dir = 90, id = 0, flip = 1}) => {
  const j = useJitter(id, 0.8);
  return (
    <g transform={`translate(${x + j.dx} ${y + j.dy}) rotate(${dir - 90 + j.rot}) scale(${s * flip} ${s})`}>
      <ellipse cx={3} cy={6} rx={25} ry={16} fill="#2a1c10" opacity={0.22} />
      <ellipse cy={-3} rx={24} ry={15} fill={K.white} />
      <circle cy={8} r={14.5} fill={K.white} />
      <ellipse cy={-3} rx={21} ry={12} fill={color} />
      <circle cy={8} r={11.5} fill={mixHex(color, '#ffffff', 0.25)} />
    </g>
  );
};

/** Tira de cinta washi */
export const Tape: React.FC<{x: number; y: number; w?: number; h?: number; rot?: number; pat?: 'washiA' | 'washiB' | 'washiC'; opacity?: number}> = ({
  x,
  y,
  w = 150,
  h = 40,
  rot = 0,
  pat = 'washiA',
  opacity = 1,
}) => {
  const zig = (side: number) => Array.from({length: 7}).map((_, i) => `${side * (w / 2 + (i % 2 ? 4 : 0))},${-h / 2 + (i * h) / 6}`);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} opacity={opacity * 0.88}>
      <polygon points={[...zig(-1), ...zig(1).reverse()].join(' ')} fill={`url(#${pat})`} />
      <polygon points={[...zig(-1), ...zig(1).reverse()].join(' ')} fill="#ffffff" opacity={0.15} />
    </g>
  );
};

/** Borde rasgado: polígono irregular de un rectángulo */
export const tornRect = (x: number, y: number, w: number, h: number, seed: number, amp = 7) => {
  const pts: string[] = [];
  const n = Math.max(6, Math.round(w / 26));
  const m = Math.max(4, Math.round(h / 26));
  for (let i = 0; i <= n; i++) pts.push(`${x + (i / n) * w},${y + (hash(seed + i) - 0.5) * amp}`);
  for (let i = 1; i <= m; i++) pts.push(`${x + w + (hash(seed + 50 + i) - 0.5) * amp},${y + (i / m) * h}`);
  for (let i = n - 1; i >= 0; i--) pts.push(`${x + (i / n) * w},${y + h + (hash(seed + 100 + i) - 0.5) * amp}`);
  for (let i = m - 1; i >= 1; i--) pts.push(`${x + (hash(seed + 150 + i) - 0.5) * amp},${y + (i / m) * h}`);
  return pts.join(' ');
};

/** Trazo dibujado a mano (rotulador o lápiz) con temblor */
export const Hand: React.FC<{d: string; p?: number; color?: string; w?: number; opacity?: number}> = ({d, p = 1, color = K.ink, w = 5, opacity = 1}) =>
  p <= 0 ? null : (
    <g filter="url(#boil)">
      <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={opacity} />
    </g>
  );

// ───────────────────────── Letras ─────────────────────────
const RANSOM_FONTS = ['Anton', 'Abril', 'IMFell', 'Cormorant', 'InterSB', 'Oswald', 'SpecialElite'];
const RANSOM_BG = [K.white, K.news, K.card, K.mustard, K.white, K.blueLight, K.tomato, '#f2e3c2', K.sageLight];
/** Frase armada con letras recortadas de revistas; `reveal` 0..1 deja caer las letras una a una */
export const Ransom: React.FC<{lines: string[]; size?: number; reveal?: number; y?: number; seed?: number; highlight?: string; highlightColor?: string; x?: number; w?: number}> = ({
  x = 80,
  w = 1760,
  lines,
  size = 96,
  reveal = 1,
  y = 540,
  seed = 1,
  highlight,
  highlightColor = K.mustard,
}) => {
  const pose = Math.floor(usePose() / 2);
  const total = lines.join('').replace(/ /g, '').length;
  let k = 0;
  return (
    <div style={{position: 'absolute', left: x, width: w, top: y, transform: 'translateY(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: size * 0.22}}>
      {lines.map((line, li) => (
        <div key={li} style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap'}}>
          {line.split(' ').map((word, wi) => {
            const hl = highlight && word === highlight;
            return (
              <div key={wi} style={{display: 'flex', margin: `0 ${size * 0.18}px`, padding: hl ? `${size * 0.08}px ${size * 0.1}px` : 0, background: hl ? highlightColor : 'transparent', transform: hl ? 'rotate(-1.5deg)' : undefined, boxShadow: hl ? '4px 6px 10px rgba(40,25,10,0.3)' : undefined}}>
                {word.split('').map((ch, ci) => {
                  const idx = k++;
                  const h = (n: number) => hash(seed * 100 + idx * 7.3 + n);
                  const shown = clamp(reveal * total * 1.05 - idx);
                  if (shown <= 0) return <span key={ci} style={{opacity: 0}} />;
                  const bg = RANSOM_BG[Math.floor(h(1) * RANSOM_BG.length)];
                  const dark = bg === K.card || bg === K.tomato;
                  const fam = RANSOM_FONTS[Math.floor(h(2) * RANSOM_FONTS.length)];
                  const sz = size * (0.85 + h(3) * 0.3);
                  const wob = (hash(pose * 3.1 + idx) - 0.5) * 1.2;
                  const drop = easeOutBack(shown);
                  return (
                    <span
                      key={ci}
                      style={{
                        display: 'inline-block',
                        fontFamily: fam,
                        fontSize: sz,
                        lineHeight: 1,
                        padding: `${sz * 0.06}px ${sz * 0.09}px ${sz * 0.02}px`,
                        margin: `0 ${sz * 0.025}px`,
                        background: bg,
                        color: dark ? K.white : h(4) > 0.75 ? K.tomato : K.ink,
                        transform: `rotate(${(h(5) - 0.5) * 12 + wob}deg) translateY(${(h(6) - 0.5) * sz * 0.12}px) scale(${lerp(1.5, 1, drop)})`,
                        opacity: clamp(shown * 2),
                        boxShadow: '2px 3px 4px rgba(40,25,10,0.3)',
                        textTransform: h(7) > 0.3 ? 'uppercase' : 'lowercase',
                      }}
                    >
                      {ch}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

/** Texto tecleado a máquina */
export const Typed: React.FC<{text: string; n: number; x?: number; y: number; size?: number; color?: string}> = ({text, n, y, size = 54, color = K.ink}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: TYPEWRITER, fontSize: size, color, letterSpacing: '0.04em'}}>
    {text.split('').map((ch, i) => (
      <span key={i} style={{opacity: i < n ? 0.92 - hash(i) * 0.25 : 0, display: 'inline-block', transform: `translateY(${(hash(i * 3) - 0.5) * 3}px)`}}>
        {ch === ' ' ? ' ' : ch}
      </span>
    ))}
  </div>
);

/** Etiqueta Dymo (SVG). n = letras impresas */
export const Dymo: React.FC<{text: string; n?: number; x: number; y: number; size?: number; rot?: number; color?: string}> = ({text, n = 999, x, y, size = 40, rot = 0, color = K.card}) => {
  const shown = text.slice(0, n);
  const w = text.length * size * 0.62 + size * 0.9;
  const vis = shown.length * size * 0.62 + size * 0.9;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#pshadow)">
      <rect x={-w / 2} y={-size * 0.7} width={vis} height={size * 1.4} rx={size * 0.12} fill={color} />
      <rect x={-w / 2} y={-size * 0.7} width={vis} height={size * 0.18} fill="#ffffff" opacity={0.08} />
      <text x={-w / 2 + size * 0.45} y={size * 0.36} fontFamily="Oswald" fontWeight={500} fontSize={size} fill="#f4f1ea" letterSpacing={size * 0.18} style={{textTransform: 'uppercase'}}>
        {shown}
      </text>
    </g>
  );
};
