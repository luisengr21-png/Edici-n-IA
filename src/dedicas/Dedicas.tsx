// Motor visual de «¿A qué te dedicas?» (video 5).
// Reglas del canal desde este video (CLAUDE.md, «Edición: fondos, transiciones y efectos»):
// - cada escena con un fondo distinto (color y tipo), nada de azul marino por defecto;
// - transición distinta en cada corte (0.3–0.8 s, con easing y escenas que se solapan);
// - ninguna imagen estática: efecto de entrada + permanencia + hasta 2 tratamientos visuales.
// El plan (qué fondo, qué transición y qué efectos) lo decide scripts/dedicas/viz.py y lo revisa antes de renderizar.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {renderEl} from '../burnout/elements';
import {clamp, eo, eio, hash, lerp, spr, wobble} from '../burnout/kit';
import plan from './plan.json';

const ANTON = 'Anton, "Noto Color Emoji", Impact, sans-serif';
const EMOJI = '"Noto Color Emoji", sans-serif';
export const INK = '#1C1A27';

if (typeof document !== 'undefined') {
  const h = delayRender('Anton');
  const f = new FontFace('Anton', `url(${staticFile('canal/fonts/anton-regular.ttf')}) format('truetype')`);
  f.load().then((ff) => document.fonts.add(ff)).finally(() => continueRender(h));
}

type FX = {in?: string; keep?: string; treat?: string[]; special?: string; shape?: string};
type Media = {t: 'v' | 'f'; src: string; off?: number; rate?: number; ar?: number; fx?: FX};
type Icon = {e?: string; svg?: string; at?: number; fx?: FX};
type Txt = {text: string; card: boolean; size: 'grande' | 'mediano' | 'chico'; acc: string; red: boolean; at?: number; y?: number};
type Bg = {type: string; c1: string; c2: string; c3: string; light: boolean};
type Tr = {type: string; dur: number};
export type SceneT = {
  n: number; start: number; end: number; tipo: string; layout: string; bg: Bg; tr: Tr;
  media: Media[]; icons: Icon[]; txt: Txt[]; fx: string[]; hit?: boolean; person?: any; vertical?: boolean;
  acc: {amber: string; red: string}; endscreen?: boolean;
};

const easeIO = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

// ───────────────────────── FONDOS ─────────────────────────
const GRAIN = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>')}")`;
const PAPER = `url("data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4"/><feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.28  0 0 0 0 0.2  0 0 0 0.22 0"/></filter><rect width="100%" height="100%" filter="url(#p)"/></svg>')}")`;

export const Background: React.FC<{bg: Bg; t: number; w: number; h: number; media?: Media}> = ({bg, t, w, h, media}) => {
  const {c1, c2, c3} = bg;
  const s = t * 0.25;
  switch (bg.type) {
    case 'solid':
      return <AbsoluteFill style={{background: c1}} />;
    case 'linear':
      return <AbsoluteFill style={{background: `linear-gradient(${130 + Math.sin(s) * 20}deg, ${c1} 0%, ${c2} 100%)`}} />;
    case 'radial':
      return <AbsoluteFill style={{background: `radial-gradient(circle at ${50 + Math.sin(s) * 12}% ${45 + Math.cos(s) * 10}%, ${c2} 0%, ${c1} 70%)`}} />;
    case 'conic':
      return <AbsoluteFill style={{background: `conic-gradient(from ${t * 18}deg at 50% 55%, ${c1}, ${c2}, ${c3}, ${c1})`}} />;
    case 'mesh':
      return (
        <AbsoluteFill style={{background: c1, overflow: 'hidden'}}>
          {[c2, c3, c2].map((c, k) => (
            <div key={k} style={{position: 'absolute', width: w * 0.9, height: w * 0.9, borderRadius: '50%', background: c, filter: 'blur(120px)', opacity: 0.85,
              left: w * (0.1 + 0.5 * k) - w * 0.45 + Math.sin(t * 0.4 + k * 2) * w * 0.15, top: h * (0.2 + 0.3 * (k % 2)) - w * 0.45 + Math.cos(t * 0.35 + k) * h * 0.2}} />
          ))}
        </AbsoluteFill>
      );
    case 'paper':
      return <AbsoluteFill style={{background: c1}}><AbsoluteFill style={{backgroundImage: PAPER, opacity: 1}} /><AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(80,50,20,0.18) 100%)'}} /></AbsoluteFill>;
    case 'grain':
      return <AbsoluteFill style={{background: `linear-gradient(160deg, ${c1}, ${c2})`}}><AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.35, transform: `translate(${(Math.floor(t * 12) % 4) * 7}px, ${(Math.floor(t * 12) % 3) * 5}px)`}} /></AbsoluteFill>;
    case 'grid':
      return <AbsoluteFill style={{background: c1, backgroundImage: `linear-gradient(${c2} 2px, transparent 2px), linear-gradient(90deg, ${c2} 2px, transparent 2px)`, backgroundSize: '64px 64px', backgroundPosition: `${t * 12}px ${t * 8}px`}} />;
    case 'halftone':
      return <AbsoluteFill style={{background: c1, backgroundImage: `radial-gradient(${c2} 28%, transparent 30%)`, backgroundSize: '26px 26px', backgroundPosition: `${t * 10}px 0`}}><AbsoluteFill style={{background: `linear-gradient(90deg, ${c1} 0%, transparent 60%)`}} /></AbsoluteFill>;
    case 'lines':
      return <AbsoluteFill style={{background: c1, backgroundImage: `repeating-linear-gradient(-45deg, ${c2} 0 18px, transparent 18px 54px)`, backgroundPosition: `${t * 40}px 0`}} />;
    case 'circles':
      return (
        <AbsoluteFill style={{background: c1, overflow: 'hidden'}}>
          {Array.from({length: 7}).map((_, k) => {
            const r = 120 + hash(k + 3) * 260;
            return <div key={k} style={{position: 'absolute', left: hash(k) * w - r / 2, top: ((hash(k + 7) * h - t * (20 + k * 6)) % (h + r) + h + r) % (h + r) - r, width: r, height: r, borderRadius: '50%', border: `${10 + k * 2}px solid ${k % 2 ? c2 : c3}`, opacity: 0.55}} />;
          })}
        </AbsoluteFill>
      );
    case 'blobs':
      return (
        <AbsoluteFill style={{background: c1, overflow: 'hidden'}}>
          {Array.from({length: 5}).map((_, k) => {
            const r = 260 + hash(k + 1) * 300;
            const br = `${40 + 20 * Math.sin(t + k)}% ${60 - 20 * Math.sin(t * 0.8 + k)}% ${55 + 15 * Math.cos(t * 0.7 + k)}% ${45 - 15 * Math.cos(t + k)}% / ${50 + 15 * Math.sin(t * 0.9 + k)}% ${45 + 10 * Math.cos(t + k)}% ${55 - 10 * Math.sin(t + k)}% ${50 + 10 * Math.cos(t * 1.1 + k)}%`;
            return <div key={k} style={{position: 'absolute', left: hash(k * 3) * w - r / 2 + Math.sin(t * 0.3 + k) * 60, top: hash(k * 5 + 2) * h - r / 2 + Math.cos(t * 0.25 + k) * 50, width: r, height: r, borderRadius: br, background: k % 2 ? c2 : c3, opacity: 0.7}} />;
          })}
        </AbsoluteFill>
      );
    case 'blurmedia':
      return (
        <AbsoluteFill style={{overflow: 'hidden', background: c1}}>
          {media && <AbsoluteFill style={{filter: 'blur(40px) saturate(1.2)', transform: 'scale(1.25)'}}><Img src={staticFile(media.t === 'f' ? media.src : media.src.replace('/videos/', '/thumbs/').replace('.mp4', '.jpg'))} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></AbsoluteFill>}
          <AbsoluteFill style={{background: c2, opacity: 0.55, mixBlendMode: 'multiply'}} />
        </AbsoluteFill>
      );
    case 'warm':
    default:
      return <AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 20%, ${c2} 0%, ${c1} 60%)`}}><AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.12}} /></AbsoluteFill>;
  }
};

// ───────────────────────── EFECTOS DE IMAGEN ─────────────────────────
const blocksPath = (p: number, w: number, h: number, n = 8, m = 5) => {
  let d = '';
  for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
    const k = clamp((p * 1.6 - hash(i * 13 + j * 7) * 0.6) / 1);
    if (k <= 0) continue;
    const cw = w / n, ch = h / m, s = k;
    const x = i * cw + (cw * (1 - s)) / 2, y = j * ch + (ch * (1 - s)) / 2;
    d += `M${x} ${y}h${cw * s + 1}v${ch * s + 1}h${-(cw * s + 1)}Z`;
  }
  return d || 'M0 0Z';
};
const SHAPES: Record<string, string> = {
  circle: 'circle(48% at 50% 50%)',
  arch: 'inset(0 0 0 0 round 50% 50% 18px 18px / 40% 40% 18px 18px)',
  rounded: 'inset(0 0 0 0 round 36px)',
  blob: 'polygon(12% 8%, 45% 0%, 82% 6%, 100% 35%, 94% 74%, 70% 100%, 30% 96%, 4% 78%, 0% 40%)',
};

const entryStyle = (kind: string | undefined, t: number, w: number, h: number, seed: number): React.CSSProperties => {
  const p = eo(t, 0.05, 0.6);
  switch (kind) {
    case 'mask':
      return {clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`};
    case 'zoomPoint': {
      const ox = hash(seed) > 0.5 ? '20%' : '80%', oy = hash(seed + 1) > 0.5 ? '25%' : '75%';
      return {transform: `scale(${lerp(0.05, 1, p)})`, transformOrigin: `${ox} ${oy}`, opacity: clamp(p * 3)};
    }
    case 'slideBounce': {
      const s = spr(t, 0.05, 2.0, 0.42);
      return {transform: `translateX(${(1 - s) * (hash(seed) > 0.5 ? 1 : -1) * 900}px)`};
    }
    case 'blurSharp':
      return {filter: `blur(${(1 - p) * 30}px)`, opacity: clamp(p * 2)};
    case 'blocks':
      return {clipPath: `path('${blocksPath(eo(t, 0.05, 0.8), w, h)}')`};
    case 'polaroid': {
      const s = spr(t, 0.05, 1.8, 0.45);
      return {transform: `translateY(${(1 - s) * -1100}px) rotate(${(1 - s) * -18 + 3}deg)`};
    }
    case 'shapeOpen':
      return {clipPath: `circle(${lerp(0, 75, p)}% at 50% 50%)`};
    default:
      return {opacity: clamp(p * 2)};
  }
};
const keepTransform = (kind: string | undefined, t: number, d: number, seed: number) => {
  const u = clamp(t / Math.max(d, 0.5));
  switch (kind) {
    case 'kenburns': return `scale(${lerp(1.05, 1.17, u)}) translate(${(hash(seed) > 0.5 ? 1 : -1) * lerp(-24, 24, u)}px, ${lerp(10, -10, u)}px)`;
    case 'parallax': return `scale(1.12) translateX(${lerp(30, -30, u)}px)`;
    case 'float': return `translateY(${Math.sin(t * 1.6 + seed) * 10}px)`;
    case 'rotate': return `rotate(${Math.sin(t * 0.6 + seed) * 1.6}deg) scale(1.04)`;
    case 'breathe': return `scale(${1 + 0.02 + 0.02 * Math.sin(t * 1.8 + seed)})`;
    default: return `scale(${lerp(1.0, 1.06, u)})`;
  }
};
const treatFilter = (treat: string[]) => {
  const f: string[] = [];
  if (treat.includes('duotone')) f.push('grayscale(1) contrast(1.15)');
  if (treat.includes('bwaccent')) f.push('grayscale(1) contrast(1.1)');
  if (treat.includes('glow')) f.push('brightness(1.08) saturate(1.15)');
  return f.join(' ') || undefined;
};
const TreatOverlay: React.FC<{treat: string[]; acc: string; t: number}> = ({treat, acc, t}) => (
  <>
    {treat.includes('duotone') && <AbsoluteFill style={{background: `linear-gradient(135deg, ${acc}, #2b1055)`, mixBlendMode: 'color', opacity: 0.85}} />}
    {treat.includes('bwaccent') && <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, ${acc} 0%, transparent 45%)`, mixBlendMode: 'color', opacity: 0.8}} />}
    {treat.includes('grain') && <AbsoluteFill style={{backgroundImage: GRAIN, opacity: 0.28, transform: `translate(${(Math.floor(t * 12) % 4) * 6}px, ${(Math.floor(t * 12) % 3) * 5}px)`}} />}
    {treat.includes('vignette') && <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.6) 100%)'}} />}
    {treat.includes('halftone') && <AbsoluteFill style={{backgroundImage: 'radial-gradient(rgba(0,0,0,0.5) 25%, transparent 27%)', backgroundSize: '9px 9px', mixBlendMode: 'multiply', opacity: 0.35}} />}
  </>
);
const Special: React.FC<{kind?: string; t: number; d: number; w: number; h: number; acc: string}> = ({kind, t, d, w, h, acc}) => {
  if (!kind) return null;
  switch (kind) {
    case 'shine': {
      const x = lerp(-0.6, 1.6, clamp((t - 0.5) / 1.1)) * w;
      return <div style={{position: 'absolute', left: x - 200, top: -h * 0.2, width: 160, height: h * 1.4, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)', transform: 'rotate(18deg)', pointerEvents: 'none'}} />;
    }
    case 'flare': {
      const x = lerp(0.15, 0.85, clamp(t / d)) * w, y = h * 0.25;
      return <div style={{position: 'absolute', left: x - 260, top: y - 260, width: 520, height: 520, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,240,200,0.75) 0%, rgba(255,200,120,0.25) 25%, transparent 60%)', mixBlendMode: 'screen'}} />;
    }
    case 'leak':
      return <AbsoluteFill style={{background: `radial-gradient(ellipse at ${lerp(-10, 110, clamp(t / d))}% 30%, rgba(255,140,40,0.55) 0%, rgba(255,80,60,0.2) 30%, transparent 60%)`, mixBlendMode: 'screen'}} />;
    case 'particles':
      return <>{Array.from({length: 22}).map((_, k) => <div key={k} style={{position: 'absolute', left: hash(k) * w, top: ((hash(k + 9) * h - t * (30 + hash(k + 2) * 60)) % h + h) % h, width: 6 + hash(k + 4) * 8, height: 6 + hash(k + 4) * 8, borderRadius: '50%', background: acc, opacity: 0.6}} />)}</>;
    case 'speedlines':
      return <>{Array.from({length: 14}).map((_, k) => <div key={k} style={{position: 'absolute', left: ((hash(k) * w + t * 2200) % (w + 400)) - 400, top: hash(k + 5) * h, width: 260 + hash(k + 1) * 220, height: 4, background: 'rgba(255,255,255,0.75)', borderRadius: 2}} />)}</>;
    case 'frame':
      return <div style={{position: 'absolute', inset: 18, border: `6px dashed ${acc}`, borderRadius: 28, opacity: 0.9, clipPath: `inset(0 ${(1 - eo(t, 0.2, 0.8)) * 100}% 0 0)`}} />;
    case 'stickers':
      return <>{['✨', '⭐', '✨', '💫'].map((e, k) => <div key={k} style={{position: 'absolute', left: [0.06, 0.88, 0.12, 0.82][k] * w, top: [0.12, 0.18, 0.78, 0.74][k] * h, fontFamily: EMOJI, fontSize: 70, transform: `scale(${spr(t, 0.3 + k * 0.15, 2, 0.4)}) rotate(${Math.sin(t * 2 + k) * 12}deg)`}}>{e}</div>)}</>;
    default:
      return null;
  }
};

const Clip: React.FC<{m: Media; fit?: boolean}> = ({m, fit}) => {
  const {fps} = useVideoConfig();
  const style: React.CSSProperties = {width: '100%', height: '100%', objectFit: fit ? 'contain' : 'cover'};
  return m.t === 'v' ? <OffthreadVideo src={staticFile(m.src)} startFrom={Math.round((m.off ?? 0.4) * fps)} playbackRate={m.rate ?? 1} muted style={style} /> : <Img src={staticFile(m.src)} style={style} />;
};

// Imagen a pantalla completa (con su fondo desenfocado si es vertical) o en tarjeta con forma.
const MediaView: React.FC<{m: Media; t: number; d: number; w: number; h: number; full: boolean; seed: number; acc: string; V: boolean}> = ({m, t, d, w, h, full, seed, acc, V}) => {
  const fx = m.fx ?? {};
  const treat = fx.treat ?? [];
  const portrait = (m.ar ?? 1.78) < 1.2;
  if (full) {
    const fit = V || portrait;
    return (
      <AbsoluteFill style={{overflow: 'hidden', ...entryStyle(fx.in, t, w, h, seed)}}>
        {fit && <AbsoluteFill style={{filter: 'blur(36px) brightness(0.6)', transform: 'scale(1.2)'}}><Clip m={m} /></AbsoluteFill>}
        <AbsoluteFill style={{transform: keepTransform(fx.keep, t, d, seed), filter: treatFilter(treat)}}><Clip m={m} fit={fit} /></AbsoluteFill>
        <TreatOverlay treat={treat} acc={acc} t={t} />
        <Special kind={fx.special} t={t} d={d} w={w} h={h} acc={acc} />
      </AbsoluteFill>
    );
  }
  const cw = V ? 900 : portrait ? 520 : 980, ch = V ? (portrait ? 1150 : 560) : portrait ? 760 : 560;
  const shape = fx.shape ?? 'rounded';
  const polaroid = fx.in === 'polaroid';
  const sh = treat.includes('shadowBorder') || polaroid;
  const chroma = treat.includes('chroma');
  return (
    <div style={{position: 'absolute', left: (V ? w / 2 : w * 0.5) - cw / 2, top: (V ? 760 : h * 0.46) - ch / 2, width: cw, height: ch, ...entryStyle(fx.in, t, cw, ch, seed)}}>
      <div style={{position: 'absolute', inset: 0, transform: keepTransform(fx.keep === 'kenburns' ? 'float' : fx.keep, t, d, seed),
        filter: [chroma ? 'drop-shadow(6px 0 0 rgba(255,0,80,0.55)) drop-shadow(-6px 0 0 rgba(0,220,255,0.55))' : '', treat.includes('glow') ? `drop-shadow(0 0 40px ${acc})` : '', sh ? 'drop-shadow(0 30px 40px rgba(0,0,0,0.45))' : ''].join(' ').trim() || undefined}}>
        <div style={{position: 'absolute', inset: 0, background: polaroid ? '#fff' : 'transparent', padding: polaroid ? '22px 22px 90px' : 0, clipPath: polaroid ? undefined : SHAPES[shape], borderRadius: polaroid ? 8 : 0}}>
          <div style={{position: 'relative', width: '100%', height: '100%', overflow: 'hidden', borderRadius: polaroid ? 4 : 0}}>
            <AbsoluteFill style={{transform: keepTransform(fx.keep === 'kenburns' ? 'kenburns' : 'breathe', t, d, seed), filter: treatFilter(treat)}}><Clip m={m} /></AbsoluteFill>
            <TreatOverlay treat={treat} acc={acc} t={t} />
            <Special kind={fx.special} t={t} d={d} w={cw} h={ch} acc={acc} />
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── ÍCONOS ─────────────────────────
const SvgIcon: React.FC<{k: string; size: number}> = ({k, size}) => {
  if (k === 'perdedor')
    return (
      <svg width={size} height={size} viewBox="-120 -120 240 240">
        <rect x={-70} y={-100} width={52} height={190} rx={22} fill="#FFCC8A" stroke="#8A4B12" strokeWidth={8} />
        <rect x={-70} y={40} width={150} height={52} rx={22} fill="#FFCC8A" stroke="#8A4B12" strokeWidth={8} />
        <text x={30} y={-10} fontFamily="Anton" fontSize={120} fill="#FF2E2E" textAnchor="middle">L</text>
      </svg>
    );
  return null;
};
const IconView: React.FC<{ic: Icon; size: number}> = ({ic, size}) =>
  ic.svg ? <SvgIcon k={ic.svg} size={size} /> : (
    <div style={{fontFamily: EMOJI, fontSize: size * 0.82 * Math.min(1, 1.3 / Array.from(new (Intl as any).Segmenter().segment(ic.e ?? '')).length), lineHeight: 1, minWidth: size, height: size, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{ic.e}</div>
  );
const iconEnter = (kind: string | undefined, t: number, at: number): React.CSSProperties => {
  const p = spr(t, at, 2.2, 0.5), q = eo(t, at, 0.5);
  switch (kind) {
    case 'drop': return {transform: `translateY(${(1 - spr(t, at, 2, 0.4)) * -700}px)`, opacity: t >= at ? 1 : 0};
    case 'spin': return {transform: `rotate(${(1 - q) * -260}deg) scale(${q})`, opacity: q};
    case 'slide': return {transform: `translateX(${(1 - spr(t, at, 2, 0.45)) * 600}px)`, opacity: t >= at ? 1 : 0};
    case 'blur': return {filter: `blur(${(1 - q) * 24}px)`, opacity: q, transform: `scale(${lerp(1.4, 1, q)})`};
    default: return {transform: `scale(${p})`, opacity: clamp(p * 2)};
  }
};
const Icons: React.FC<{icons: Icon[]; t: number; d: number; cx: number; cy: number; maxW: number; fx: string[]; col?: boolean; big?: number; light: boolean}> = ({icons, t, d, cx, cy, maxW, fx, col, big, light}) => {
  const list = icons.filter((i) => i.e !== '❌' || !fx.includes('cross'));
  const n = list.length;
  if (!n) return null;
  const size = big ?? (n === 1 ? 400 : n === 2 ? 330 : n === 3 ? 290 : 240);
  const gap = Math.min(size * 1.25, maxW / n);
  const step = n > 1 ? Math.min(0.55, (d * 0.6) / (n - 1)) : 0;
  return (
    <>
      {list.map((ic, i) => {
        const at = ic.at ?? 0.15 + i * step;
        const off = (i - (n - 1) / 2) * gap;
        const x = col ? cx : cx + off, y = col ? cy + off : cy;
        const keep = ic.fx?.keep ?? 'float';
        const tr = keep === 'rotate' ? `rotate(${Math.sin(t * 1.2 + i) * 6}deg)` : keep === 'breathe' ? `scale(${1 + 0.04 * Math.sin(t * 2 + i)})` : `translateY(${Math.sin(t * 2 + i) * 10}px)`;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)'}}>
            <div style={iconEnter(ic.fx?.in, t, at)}>
              <div style={{transform: tr, filter: `drop-shadow(0 18px 24px rgba(0,0,0,${light ? 0.22 : 0.45}))`}}><IconView ic={ic} size={size} /></div>
            </div>
          </div>
        );
      })}
      {fx.includes('cross') && <div style={{position: 'absolute', left: cx - (col ? 0 : ((n - 1) / 2) * gap), top: col ? cy - ((n - 1) / 2) * gap : cy, transform: `translate(-50%,-50%) scale(${lerp(2.2, 1, eo(t, d * 0.35, 0.2))})`, opacity: clamp((t - d * 0.35) / 0.08), fontFamily: EMOJI, fontSize: size * 1.05}}>❌</div>}
    </>
  );
};

// ───────────────────────── TEXTO ─────────────────────────
const SIZE = {grande: 150, mediano: 96, chico: 66};
export const TextEl: React.FC<{tx: Txt; t: number; x: number; y: number; scale?: number; align?: 'center' | 'left'; maxW?: number; light: boolean; onMedia: boolean; acc: {amber: string; red: string}}> = ({tx, t, x, y, scale = 1, align = 'center', maxW = 1700, light, onMedia, acc}) => {
  const at = tx.at ?? 0.2;
  const fs = SIZE[tx.size] * scale;
  const slam = tx.size === 'grande';
  const q = eo(t, at, 0.35);
  const tr = slam ? `scale(${lerp(1.8, 1, eo(t, at, 0.2))}) rotate(${wobble(t, at + 0.2, 1.5, 6, 6)}deg)` : `translateY(${(1 - q) * 40}px) scale(${lerp(0.9, 1, q)})`;
  const op = slam ? clamp((t - at) / 0.06) : q;
  const i = tx.text.indexOf(tx.acc);
  const parts = i >= 0 ? [tx.text.slice(0, i), tx.text.slice(i, i + tx.acc.length), tx.text.slice(i + tx.acc.length)] : [tx.text, '', ''];
  // Contraste: sobre fondo claro, texto oscuro; sobre oscuro o sobre imagen, blanco con contorno.
  const dark = light && !onMedia;
  const base = tx.card ? (dark ? '#FFFFFF' : INK) : dark ? INK : '#FFFFFF';
  const cardBg = dark ? INK : '#FFF8EC';
  // El acento siempre contrasta con lo que tiene detrás: tarjeta oscura → acento claro; tarjeta clara → acento oscuro.
  const cardAcc = dark ? {amber: '#FFB547', red: '#FF6B6B'} : {amber: '#8A4100', red: '#B0101C'};
  const accC = tx.card ? (tx.red ? cardAcc.red : cardAcc.amber) : tx.red ? acc.red : acc.amber;
  const stroke = !tx.card && !dark ? {WebkitTextStroke: `${Math.round(fs * 0.075)}px #14121c`, paintOrder: 'stroke fill' as const, textShadow: '0 8px 22px rgba(0,0,0,0.7)'} : {};
  return (
    <div style={{position: 'absolute', left: align === 'center' ? x - maxW / 2 : x, top: y, width: maxW, transform: 'translateY(-50%)', display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', opacity: op}}>
      <div style={{transform: tr, transformOrigin: align === 'center' ? 'center' : 'left center', textAlign: align,
        ...(tx.card ? {background: cardBg, border: `${Math.max(3, fs * 0.045)}px solid ${accC}`, borderRadius: fs * 0.22, padding: `${fs * 0.14}px ${fs * 0.36}px`, boxShadow: '0 18px 40px rgba(0,0,0,0.35)'} : {})}}>
        <span style={{fontFamily: ANTON, fontSize: fs, lineHeight: 1.08, color: base, letterSpacing: fs * 0.012, ...stroke}}>
          {parts[0]}<span style={{color: accC}}>{parts[1]}</span>{parts[2]}
        </span>
      </div>
    </div>
  );
};

// ───────────────────────── ESCENA ─────────────────────────
export const SceneView: React.FC<{sc: SceneT; T: number; w: number; h: number}> = ({sc, T, w, h}) => {
  const t = T - sc.start;
  const d = sc.end - sc.start;
  const V = !!sc.vertical;
  const full = sc.layout === 'full';
  const hasPerson = sc.tipo === '2D' && sc.person;
  const light = sc.bg.light;
  const accFor = light && !full ? {amber: sc.acc.amber, red: sc.acc.red} : {amber: '#FFB547', red: '#FF4D4D'};
  const punch = sc.hit ? 1 + 0.045 * (1 - eo(t, 0, 0.25)) : 1;
  const els: React.ReactNode[] = [];
  const S = V ? 0.78 : 1;
  const textY = (tx: Txt, k: number, nT: number) => {
    if (tx.y != null) return tx.y;
    if (sc.tipo === 'TEXTO') return nT === 1 ? (V ? 700 : 540) : (V ? [600, 860] : [400, 690])[k];
    if (tx.size === 'chico' && tx.card) return V ? 330 : 115;
    if (tx.size === 'grande' && !sc.icons.length && !hasPerson && !full && !sc.media.length) return V ? 700 : 540;
    return V ? 1010 : 905;
  };
  if (!full) els.push(<Background key="bg" bg={sc.bg} t={T} w={w} h={h} media={sc.media[0]} />);
  if (sc.media.length) {
    if (full && sc.fx.includes('split') && sc.media.length >= 2) {
      els.push(<AbsoluteFill key="split" style={{flexDirection: V ? 'column' : 'row'}}>{sc.media.slice(0, 2).map((m, i) => <div key={i} style={{position: 'relative', flex: 1, overflow: 'hidden'}}><MediaView m={m} t={t - i * 0.2} d={d} w={V ? w : w / 2} h={V ? h / 2 : h} full seed={sc.n + i} acc={accFor.amber} V={V} /></div>)}</AbsoluteFill>);
    } else if (sc.media.length >= 2) {
      const half = d / 2, i = t < half ? 0 : 1;
      els.push(<Sequence key={'m' + i} from={i ? Math.round(half * 30) : 0} layout="none"><MediaView m={sc.media[i]} t={t - i * half} d={half} w={w} h={h} full={full} seed={sc.n + i} acc={accFor.amber} V={V} /></Sequence>);
    } else {
      els.push(<MediaView key="m" m={sc.media[0]} t={t} d={d} w={w} h={h} full={full} seed={sc.n} acc={accFor.amber} V={V} />);
    }
    if (full) els.push(<AbsoluteFill key="shade" style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />);
  }
  if (hasPerson) {
    const px = V ? w / 2 : sc.icons.length ? 600 : 960;
    els.push(<React.Fragment key="tu">{renderEl({k: 'person', x: px, y: V ? 860 : 560, s: V ? 1.45 : 1.3, at: 0.02, anim: 'up', float: 3, ...sc.person}, t, 0)}</React.Fragment>);
  }
  if (sc.icons.length) {
    const side = !!(hasPerson || (sc.media.length && !full));
    if (V) els.push(<Icons key="ic" icons={sc.icons} t={t} d={d} cx={w / 2} cy={side || full ? (full ? 1450 : 380) : 720} maxW={960} fx={sc.fx} big={side || full ? 220 : undefined} light={light && !full} />);
    else if (full) els.push(<Icons key="ic" icons={sc.icons} t={t} d={d} cx={w * 0.78} cy={h * 0.46} maxW={700} fx={sc.fx} col={sc.icons.length > 1} big={230} light={false} />);
    else els.push(<Icons key="ic" icons={sc.icons} t={t} d={d} cx={side ? 1360 : 960} cy={470} maxW={side ? 820 : 1500} fx={sc.fx} col={side && sc.icons.length > 2} big={side ? (sc.icons.length > 2 ? 200 : 300) : undefined} light={light} />);
  }
  if (sc.fx.includes('dark')) els.push(<AbsoluteFill key="dk" style={{background: '#000', opacity: eio(t, d * 0.4, d * 0.5) * 0.55}} />);
  const nT = sc.txt.length;
  sc.txt.forEach((tx, k) => {
    const at = sc.tipo === 'TEXTO' && k > 0 ? Math.max(0.6, d * 0.42) : tx.size === 'chico' ? 0.15 : 0.35;
    const chico = tx.size === 'chico' && tx.card && sc.tipo !== 'TEXTO';
    const sz = sc.tipo === 'TEXTO' ? (nT > 1 ? 1.4 : tx.size === 'grande' ? 1.25 : 1.6) : 1;
    els.push(<TextEl key={'t' + k} tx={{...tx, at}} t={t} x={chico && !V ? 90 : w / 2} y={textY(tx, k, nT)} align={chico && !V ? 'left' : 'center'} scale={sz * S} maxW={V ? 980 : 1750} light={light} onMedia={full} acc={accFor} />);
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: sc.bg.c1}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>{els}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// ───────────────────────── TRANSICIONES ─────────────────────────
const barsPath = (p: number, w: number, h: number, n = 9) => {
  let d = '';
  for (let i = 0; i < n; i++) {
    const bh = (h / n) * clamp(p * 1.4 - (i % 2) * 0.25);
    d += `M0 ${i * (h / n)}h${w}v${bh + 1}h${-w}Z`;
  }
  return d;
};
const inkPath = (p: number, w: number, h: number) => {
  const R = Math.hypot(w, h) * 0.6 * p, cx = w / 2, cy = h / 2;
  let d = '';
  for (let k = 0; k <= 48; k++) {
    const a = (k / 48) * Math.PI * 2;
    const r = R * (1 + 0.12 * Math.sin(a * 5 + p * 6) + 0.06 * Math.sin(a * 11));
    d += `${k ? 'L' : 'M'}${cx + Math.cos(a) * r} ${cy + Math.sin(a) * r}`;
  }
  return d + 'Z';
};
// Devuelve el estilo de la escena que sale (a) y de la que entra (b), y una capa encima (o).
const transition = (type: string, p0: number, w: number, h: number): {a: React.CSSProperties; b: React.CSSProperties; o?: React.ReactNode; bOnTop?: boolean} => {
  const p = easeIO(clamp(p0));
  switch (type) {
    case 'slide': return {a: {transform: `translateX(${-p * 100}%)`}, b: {transform: `translateX(${(1 - p) * 100}%)`}};
    case 'push': return {a: {transform: `translateY(${-p * 100}%)`}, b: {transform: `translateY(${(1 - p) * 100}%)`}};
    case 'wipe': return {a: {}, b: {clipPath: `polygon(0 0, ${p * 220}% 0, ${p * 220 - 60}% 100%, 0 100%)`}};
    case 'wipev': return {a: {}, b: {clipPath: `inset(${(1 - p) * 100}% 0 0 0)`}};
    case 'zoom': return {a: {transform: `scale(${1 + p * 0.6})`, opacity: 1 - p}, b: {transform: `scale(${0.7 + 0.3 * p})`, opacity: p}};
    case 'whip': return {a: {transform: `translateX(${-p * 120}%)`, filter: `blur(${p * 34}px)`}, b: {transform: `translateX(${(1 - p) * 120}%)`, filter: `blur(${(1 - p) * 34}px)`}};
    case 'iris': return {a: {}, b: {clipPath: `circle(${p * 75}% at 50% 50%)`}};
    case 'blinds': return {a: {}, b: {clipPath: `path('${barsPath(p, w, h)}')`}};
    case 'blocks': return {a: {}, b: {clipPath: `path('${blocksPath(p, w, h, 12, 7)}')`}};
    case 'glitch': {
      const j = Math.sin(p0 * 60) * 40 * Math.sin(Math.PI * p0);
      const g = `drop-shadow(${j * 0.5}px 0 0 rgba(255,0,60,0.8)) drop-shadow(${-j * 0.5}px 0 0 rgba(0,240,255,0.8))`;
      return p0 < 0.5 ? {a: {transform: `translateX(${j}px)`, filter: g}, b: {opacity: 0}} : {a: {opacity: 0}, b: {transform: `translateX(${j}px)`, filter: g}};
    }
    case 'dissolve': return {a: {}, b: {opacity: p}};
    case 'dip': return {a: {opacity: p0 < 0.5 ? 1 : 0}, b: {opacity: p0 < 0.5 ? 0 : 1}, o: <AbsoluteFill style={{background: '#FFB547', opacity: Math.sin(Math.PI * p0)}} />};
    case 'flash': return {a: {opacity: p0 < 0.5 ? 1 : 0}, b: {opacity: p0 < 0.5 ? 0 : 1}, o: <AbsoluteFill style={{background: '#fff', opacity: Math.pow(Math.sin(Math.PI * p0), 0.6)}} />};
    case 'leak': return {a: {}, b: {opacity: p}, o: <AbsoluteFill style={{background: `radial-gradient(ellipse at ${lerp(-20, 120, p0)}% 40%, rgba(255,150,40,0.85) 0%, rgba(255,70,80,0.35) 35%, transparent 65%)`, mixBlendMode: 'screen', opacity: Math.sin(Math.PI * p0)}} />};
    case 'blur': return {a: {filter: `blur(${p * 30}px)`, opacity: 1 - p}, b: {filter: `blur(${(1 - p) * 30}px)`, opacity: p}};
    case 'page': return {a: {transform: `perspective(2200px) rotateY(${-p * 105}deg)`, transformOrigin: 'left center', boxShadow: '30px 0 60px rgba(0,0,0,0.4)'}, b: {}, bOnTop: false};
    case 'cube': return {a: {transform: `perspective(2400px) translateX(${-p * 50}%) rotateY(${-p * 90}deg)`, transformOrigin: 'right center'}, b: {transform: `perspective(2400px) translateX(${(1 - p) * 50}%) rotateY(${(1 - p) * 90}deg)`, transformOrigin: 'left center'}};
    case 'ink': return {a: {}, b: {clipPath: `path('${inkPath(p, w, h)}')`}};
    default: return {a: {}, b: {opacity: p}};
  }
};

// Cada escena vive en su propio Sequence (un poco más larga, para poder solaparse con la siguiente).
export const SceneSeq: React.FC<{sc: SceneT; w: number; h: number; style?: React.CSSProperties}> = ({sc, w, h, style}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(sc.start * fps);
  return (
    <Sequence from={from} durationInFrames={Math.max(1, Math.round((sc.end + 1) * fps) - from)} layout="none">
      <AbsoluteFill style={style}><Inner sc={sc} w={w} h={h} from={from} /></AbsoluteFill>
    </Sequence>
  );
};
const Inner: React.FC<{sc: SceneT; w: number; h: number; from: number}> = ({sc, w, h, from}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <SceneView sc={sc} T={(f + from) / fps} w={w} h={h} />;
};

export const findIdx = (list: SceneT[], T: number) => {
  let lo = 0, hi = list.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (list[mid].start <= T) lo = mid;
    else hi = mid - 1;
  }
  return lo;
};

export const Track: React.FC<{scenes: SceneT[]}> = ({scenes}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const T = frame / fps;
  const i = findIdx(scenes, T);
  const sc = scenes[i];
  const prev = i > 0 ? scenes[i - 1] : null;
  const pt = prev ? (T - sc.start) / sc.tr.dur : 1;
  if (prev && pt < 1) {
    const tr = transition(sc.tr.type, pt, width, height);
    const A = <SceneSeq key={'a' + prev.n} sc={prev} w={width} h={height} style={tr.a} />;
    const B = <SceneSeq key={'b' + sc.n} sc={sc} w={width} h={height} style={tr.b} />;
    return (
      <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
        {tr.bOnTop === false ? <>{B}{A}</> : <>{A}{B}</>}
        {tr.o}
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneSeq key={'b' + sc.n} sc={sc} w={width} h={height} />
    </AbsoluteFill>
  );
};

const scenes = (plan as any).scenes as SceneT[];
export const DedicasVideo: React.FC = () => <Track scenes={scenes} />;
