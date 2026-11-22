// Motor visual de «La riqueza de otros».
// Escenas: VIDEO y FOTO (recursos del creador), ÍCONOS, 2D (personaje «Tú») y TEXTO.
// Los íconos, los textos en pantalla y el personaje se dibujan aquí, con código (excepción acordada para este video).
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {renderEl} from '../burnout/elements';
import {clamp, eo, eio, hash, lerp, spr, wobble} from '../burnout/kit';
import plan from './plan.json';

export const C = {navy: '#0B1A3A', navy2: '#16306A', deep: '#050D20', gold: '#F5B700', goldL: '#FFD95A', red: '#FF1A1A', white: '#FFFFFF', ink: '#050B1F'};
const ANTON = 'Anton, "Noto Color Emoji", Impact, sans-serif';
const EMOJI = '"Noto Color Emoji", sans-serif';

if (typeof document !== 'undefined') {
  const h = delayRender('Anton');
  const f = new FontFace('Anton', `url(${staticFile('canal/fonts/anton-regular.ttf')}) format('truetype')`);
  f.load().then((ff) => document.fonts.add(ff)).finally(() => continueRender(h));
}

type Media = {t: 'v' | 'f'; src: string; off?: number; k?: number; ar?: number; rate?: number};
type Icon = {e?: string; svg?: string; at?: number};
type Txt = {text: string; card: boolean; size: 'grande' | 'mediano' | 'chico'; acc: string; red: boolean; at?: number; y?: number};
type Person = {pose?: string; mood?: string; hold?: string; sweat?: boolean; walk?: boolean};
export type SceneT = {n: number; start: number; end: number; tipo: string; sec?: string; media: Media[]; icons: Icon[]; txt: Txt[]; fx: string[]; hit?: boolean; person?: Person; endscreen?: boolean; vertical?: boolean};

// ───────── fondo azul marino con polvo dorado ─────────
const Navy: React.FC<{t: number; w: number; h: number; floor?: boolean}> = ({t, w, h, floor}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 38%, ${C.navy2} 0%, ${C.navy} 55%, ${C.deep} 100%)`}}>
    {floor && <div style={{position: 'absolute', left: 0, right: 0, top: h * 0.8, bottom: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.5))', borderTop: '3px solid rgba(245,183,0,0.18)'}} />}
    {Array.from({length: 26}).map((_, k) => {
      const x = (hash(k) * w + t * (8 + hash(k + 3) * 20)) % (w + 40);
      const y = (hash(k + 11) * h - t * (5 + hash(k + 5) * 12) + h * 5) % h;
      const s = 2 + hash(k + 2) * 5;
      return <div key={k} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: 'rgba(245,183,0,0.55)', opacity: 0.25 + 0.45 * Math.abs(Math.sin(t * 0.7 + k))}} />;
    })}
  </AbsoluteFill>
);

// ───────── íconos dibujados en SVG ─────────
const Silhouette: React.FC<{hat?: 'top' | 'cap'; beard?: boolean; mustache?: boolean; rifle?: boolean; fill?: string}> = ({hat, beard, mustache, rifle, fill = '#1a1a22'}) => (
  <g fill={fill}>
    <path d="M-70 120 Q-70 20 0 10 Q70 20 70 120 Z" />
    <circle cx={0} cy={-25} r={34} />
    {hat === 'top' && <><rect x={-30} y={-112} width={60} height={62} rx={4} /><rect x={-50} y={-56} width={100} height={12} rx={6} /></>}
    {hat === 'cap' && <path d="M-36 -40 Q-34 -72 0 -72 Q34 -72 38 -44 L62 -40 L36 -34 Z" />}
    {beard && <path d="M-26 -14 Q0 40 26 -14 Q0 6 -26 -14 Z" />}
    {mustache && <path d="M-30 -6 Q-15 -16 0 -8 Q15 -16 30 -6 Q15 2 0 -2 Q-15 2 -30 -6 Z" fill="#000" />}
    {rifle && <rect x={44} y={-80} width={9} height={190} rx={3} transform="rotate(14)" />}
  </g>
);
const SvgIcon: React.FC<{k: string; size: number; t: number}> = ({k, size, t}) => {
  const vb = '-130 -130 260 260';
  const goldStroke = {stroke: C.gold, strokeWidth: 6};
  let body: React.ReactNode = null;
  switch (k) {
    case 'estrellas':
      body = <g>{[0, 1, 2, 3, 4].map((i) => {
        const p = clamp((t - 0.25 - i * 0.18) / 0.25);
        const cx = -112 + i * 56;
        const pts = Array.from({length: 10}).map((_, j) => {
          const r = j % 2 ? 11 : 26; const a = -Math.PI / 2 + (j * Math.PI) / 5;
          return `${cx + r * Math.cos(a)},${r * Math.sin(a)}`;
        }).join(' ');
        return <polygon key={i} points={pts} fill={p > 0.5 ? C.gold : 'rgba(255,255,255,0.15)'} stroke={C.gold} strokeWidth={3} transform={`translate(${cx},0) scale(${1 + 0.3 * Math.sin(p * Math.PI)}) translate(${-cx},0)`} />;
      })}</g>;
      break;
    case 'pastel_injusto':
    case 'pastel_parejo': {
      const parts = k === 'pastel_injusto' ? [0.8, 0.05, 0.05, 0.05, 0.05] : [0.2, 0.2, 0.2, 0.2, 0.2];
      let a0 = -Math.PI / 2;
      body = <g>{parts.map((f, i) => {
        const a1 = a0 + f * Math.PI * 2; const big = f > 0.5 ? 1 : 0;
        const off = k === 'pastel_injusto' && i === 0 ? 14 : 4; const mid = (a0 + a1) / 2;
        const dx = Math.cos(mid) * off, dy = Math.sin(mid) * off;
        const d = `M${dx} ${dy} L${dx + 100 * Math.cos(a0)} ${dy + 100 * Math.sin(a0)} A100 100 0 ${big} 1 ${dx + 100 * Math.cos(a1)} ${dy + 100 * Math.sin(a1)} Z`;
        a0 = a1;
        return <path key={i} d={d} fill={k === 'pastel_injusto' ? (i === 0 ? C.red : C.gold) : [C.gold, '#FFC93C', '#E0A526', '#FFD95A', '#F2A900'][i]} stroke={C.navy} strokeWidth={4} />;
      })}</g>;
      break;
    }
    case 'silueta_1900':
      body = <g transform="translate(0,10)"><Silhouette hat="top" beard fill="#151520" /></g>;
      break;
    case 'silueta_nino':
      body = <g transform="translate(0,20) scale(0.85)"><Silhouette hat="cap" fill="#151520" /></g>;
      break;
    case 'villano':
      body = <g transform="translate(0,10)"><Silhouette hat="top" mustache fill="#0d0d12" /></g>;
      break;
    case 'guardias':
      body = <g>{[-80, 0, 80].map((x, i) => <g key={i} transform={`translate(${x},${i === 1 ? 0 : 14}) scale(0.62)`}><Silhouette hat="cap" rifle fill="#111118" /></g>)}</g>;
      break;
    case 'aureola':
      body = <ellipse cx={0} cy={0} rx={95} ry={30} fill="none" stroke={C.goldL} strokeWidth={18} style={{filter: 'drop-shadow(0 0 14px #FFD95A)'}} />;
      break;
    case 'sin_senal':
      body = <g>{[0, 1, 2, 3].map((i) => <rect key={i} x={-90 + i * 48} y={60 - i * 40} width={34} height={40 + i * 40} rx={6} fill="rgba(255,255,255,0.25)" />)}
        <path d="M-70 -70 L70 70 M70 -70 L-70 70" stroke={C.red} strokeWidth={22} strokeLinecap="round" /></g>;
      break;
    case 'bascula': {
      const a = lerp(-70, 80, eio(t, 0.3, 1.2)) + wobble(t, 1.5, 6, 3, 3);
      body = <g><rect x={-110} y={-90} width={220} height={190} rx={36} fill="#E8EDF5" {...goldStroke} />
        <circle cx={0} cy={-10} r={62} fill="#fff" stroke="#9aa3b5" strokeWidth={5} />
        <line x1={0} y1={-10} x2={52 * Math.sin((a * Math.PI) / 180)} y2={-10 - 52 * Math.cos((a * Math.PI) / 180)} stroke={C.red} strokeWidth={8} strokeLinecap="round" /></g>;
      break;
    }
    case 'poste_luz':
      body = <g><rect x={-8} y={-80} width={16} height={190} fill="#c9cfdb" /><path d="M0 -80 Q0 -110 50 -110" stroke="#c9cfdb" strokeWidth={14} fill="none" />
        <path d="M30 -112 L80 -112 L70 -94 L40 -94 Z" fill="#c9cfdb" /><ellipse cx={55} cy={-86} rx={26} ry={10} fill={C.goldL} style={{filter: 'drop-shadow(0 0 20px #FFD95A)'}} /></g>;
      break;
  }
  return <svg width={size} height={size} viewBox={vb} style={{overflow: 'visible'}}>{body}</svg>;
};

const IconView: React.FC<{ic: Icon; size: number; t: number}> = ({ic, size, t}) =>
  ic.svg ? (
    <div style={{filter: 'drop-shadow(0 0 3px rgba(255,217,90,0.9)) drop-shadow(0 0 16px rgba(255,217,90,0.45)) drop-shadow(0 18px 26px rgba(0,0,0,0.5))'}}><SvgIcon k={ic.svg} size={size} t={t} /></div>
  ) : (
    <div style={{fontFamily: EMOJI, fontSize: (size * 0.82) * Math.min(1, 1.3 / Array.from(new (Intl as any).Segmenter().segment(ic.e ?? '')).length), lineHeight: 1, minWidth: size, height: size, whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center', filter: 'drop-shadow(0 18px 26px rgba(0,0,0,0.5))'}}>{ic.e}</div>
  );

// Fila (o columna) de íconos que aparecen uno por uno a lo largo de la escena.
const Icons: React.FC<{icons: Icon[]; t: number; d: number; cx: number; cy: number; maxW: number; fx: string[]; col?: boolean; big?: number}> = ({icons, t, d, cx, cy, maxW, fx, col, big}) => {
  const list = icons.filter((i) => i.e !== '❌' || !fx.includes('cross'));
  const n = list.length;
  if (!n) return null;
  const size = big ?? (n === 1 ? 400 : n === 2 ? 330 : n === 3 ? 290 : n === 4 ? 250 : 220);
  const gap = Math.min(size * 1.25, maxW / n);
  const step = n > 1 ? Math.min(0.55, (d * 0.6) / (n - 1)) : 0;
  const cross = fx.includes('cross');
  return (
    <>
      {list.map((ic, i) => {
        const at = ic.at ?? 0.15 + i * step;
        const p = spr(t, at, 2.2, 0.5);
        const off = (i - (n - 1) / 2) * gap;
        const x = col ? cx : cx + off, y = col ? cy + off : cy;
        let rot = 0, dy = 0;
        if (fx.includes('tilt') && ic.e === '⚖️') rot = Math.sin(t * 2.4) * 12;
        if (fx.includes('rise')) dy = -eio(t, at + 0.4, d * 0.7) * 120;
        if (fx.includes('drop') && i === 0) dy = Math.max(0, eo(t, d * 0.45, 0.6) * 60);
        const bob = Math.sin(t * 2 + i) * 6;
        return (
          <div key={i} style={{position: 'absolute', left: x, top: y + dy + bob, transform: `translate(-50%,-50%) scale(${p}) rotate(${rot}deg)`, opacity: clamp(p * 2)}}>
            <div style={{position: 'absolute', left: '50%', top: '50%', width: size * 1.15, height: size * 1.15, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,183,0,0.28) 0%, rgba(245,183,0,0) 65%)'}} />
            <IconView ic={ic} size={size} t={t - at} />
          </div>
        );
      })}
      {cross && (
        <div style={{position: 'absolute', left: cx + (col ? 0 : -((n - 1) / 2) * gap), top: col ? cy - ((n - 1) / 2) * gap : cy, transform: `translate(-50%,-50%) scale(${lerp(2.2, 1, eo(t, d * 0.35, 0.2))})`, opacity: clamp((t - d * 0.35) / 0.08), fontFamily: EMOJI, fontSize: size * 1.05}}>❌</div>
      )}
    </>
  );
};

// ───────── texto en pantalla (tipografía Anton, acento dorado o rojo) ─────────
const SIZE = {grande: 150, mediano: 96, chico: 66};
export const TextEl: React.FC<{tx: Txt; t: number; x: number; y: number; scale?: number; align?: 'center' | 'left'; maxW?: number}> = ({tx, t, x, y, scale = 1, align = 'center', maxW = 1700}) => {
  const at = tx.at ?? 0.2;
  const fs = SIZE[tx.size] * scale;
  const slam = tx.size === 'grande';
  const q = eo(t, at, 0.35);
  const tr = slam ? `scale(${lerp(1.8, 1, eo(t, at, 0.2))}) rotate(${wobble(t, at + 0.2, 1.5, 6, 6)}deg)` : `translateY(${(1 - q) * 40}px) scale(${lerp(0.9, 1, q)})`;
  const op = slam ? clamp((t - at) / 0.06) : q;
  const i = tx.text.indexOf(tx.acc);
  const accColor = tx.red ? C.red : C.gold;
  const parts = i >= 0 ? [tx.text.slice(0, i), tx.text.slice(i, i + tx.acc.length), tx.text.slice(i + tx.acc.length)] : [tx.text, '', ''];
  const stroke = tx.card ? {} : {WebkitTextStroke: `${Math.round(fs * 0.075)}px ${C.ink}`, paintOrder: 'stroke fill' as const};
  const glow = tx.red ? '0 0 26px rgba(255,26,26,0.55)' : '0 0 26px rgba(245,183,0,0.45)';
  return (
    <div style={{position: 'absolute', left: align === 'center' ? x - maxW / 2 : x, top: y, width: maxW, transform: 'translateY(-50%)', display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start', opacity: op}}>
      <div style={{transform: tr, transformOrigin: align === 'center' ? 'center' : 'left center', textAlign: align,
        ...(tx.card ? {background: 'rgba(11,26,58,0.94)', border: `${Math.max(3, fs * 0.045)}px solid ${accColor}`, borderRadius: fs * 0.22, padding: `${fs * 0.14}px ${fs * 0.36}px`, boxShadow: '0 18px 40px rgba(0,0,0,0.55)'} : {})}}>
        <span style={{fontFamily: ANTON, fontSize: fs, lineHeight: 1.08, color: C.white, letterSpacing: fs * 0.012, textShadow: tx.card ? 'none' : '0 8px 22px rgba(0,0,0,0.75)', ...stroke}}>
          {parts[0]}<span style={{color: accColor, textShadow: tx.card ? glow : `0 8px 22px rgba(0,0,0,0.75), ${glow}`}}>{parts[1]}</span>{parts[2]}
        </span>
      </div>
    </div>
  );
};

// ───────── fotos y videos ─────────
const Clip: React.FC<{m: Media; t: number; d: number; w: number; h: number; fit?: boolean; n: number}> = ({m, t, d, w, h, fit, n}) => {
  const {fps} = useVideoConfig();
  const u = clamp(t / Math.max(d, 0.5));
  const dir = (n + (m.k ?? 0)) % 2 ? 1 : -1;
  const kb = m.t === 'f' ? `scale(${lerp(1.04, 1.14, u)}) translate(${dir * lerp(-18, 18, u)}px, ${lerp(8, -8, u)}px)` : `scale(${lerp(1.0, 1.05, u)})`;
  const portrait = (m.ar ?? 1.78) < 1.2;
  const inner = (style: React.CSSProperties) =>
    m.t === 'v' ? (
      <OffthreadVideo src={staticFile(m.src)} startFrom={Math.round((m.off ?? 0.4) * fps)} playbackRate={m.rate ?? 1} muted style={style} />
    ) : (
      <Img src={staticFile(m.src)} style={style} />
    );
  if (fit || portrait) {
    return (
      <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
        <AbsoluteFill style={{filter: 'blur(36px) brightness(0.55)', transform: 'scale(1.2)'}}>{inner({width: '100%', height: '100%', objectFit: 'cover'})}</AbsoluteFill>
        <AbsoluteFill style={{transform: kb, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{inner({width: '100%', height: '100%', objectFit: 'contain'})}</AbsoluteFill>
      </AbsoluteFill>
    );
  }
  return <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}><AbsoluteFill style={{transform: kb}}>{inner({width: '100%', height: '100%', objectFit: 'cover'})}</AbsoluteFill></AbsoluteFill>;
};

const MediaCard: React.FC<{m: Media; t: number; d: number; x: number; y: number; cw: number; ch: number; n: number}> = ({m, t, d, x, y, cw, ch, n}) => {
  const p = spr(t, 0.05, 2, 0.6);
  return (
    <div style={{position: 'absolute', left: x - cw / 2, top: y - ch / 2, width: cw, height: ch, borderRadius: 28, overflow: 'hidden', border: `6px solid ${C.gold}`, boxShadow: '0 30px 70px rgba(0,0,0,0.6)', transform: `scale(${lerp(0.85, 1, p)}) rotate(${-1.5 + (n % 2) * 3}deg)`, opacity: clamp(p * 2)}}>
      <Clip m={m} t={t} d={d} w={cw} h={ch} n={n} />
    </div>
  );
};

// ───────── personaje «Tú» ─────────
const Tu: React.FC<{p: Person; t: number; x: number; y: number; s: number}> = ({p, t, x, y, s}) => (
  <>{renderEl({k: 'person', x, y, s, at: 0.02, anim: 'up', float: 3, ...p}, t, 0)}</>
);

// ───────── escena ─────────
export const SceneView: React.FC<{sc: SceneT; T: number; w: number; h: number}> = ({sc, T, w, h}) => {
  const t = T - sc.start;
  const d = sc.end - sc.start;
  const V = !!sc.vertical;
  const punch = sc.hit ? 1 + 0.045 * (1 - eo(t, 0, 0.25)) : 1;
  const full = sc.tipo === 'VIDEO' || sc.tipo === 'FOTO';
  const hasPerson = sc.tipo === '2D' && sc.person;
  const els: React.ReactNode[] = [];
  const S = V ? 0.78 : 1; // escala de textos en vertical

  // posiciones de los textos
  const textY = (tx: Txt, k: number, nT: number) => {
    if (tx.y != null) return tx.y;
    if (sc.tipo === 'TEXTO') return nT === 1 ? (V ? 700 : 540) : (V ? [600, 860] : [400, 690])[k];
    if (tx.size === 'chico' && tx.card) return V ? 330 : 115;
    if (tx.size === 'grande' && !sc.icons.length && !hasPerson && !full) return V ? 700 : 540;
    return V ? 1010 : 905;
  };

  if (full) {
    const ms = sc.media;
    if (sc.fx.includes('split') && ms.length >= 2) {
      els.push(
        <AbsoluteFill key="split" style={{flexDirection: V ? 'column' : 'row'}}>
          {ms.slice(0, 2).map((m, i) => (
            <div key={i} style={{position: 'relative', flex: 1, overflow: 'hidden', borderRight: !V && i === 0 ? `6px solid ${C.gold}` : undefined, borderBottom: V && i === 0 ? `6px solid ${C.gold}` : undefined, transform: `translate${V ? 'Y' : 'X'}(${(1 - eo(t, i * 0.25, 0.5)) * (i ? 1 : -1) * 400}px)`}}>
              <Clip m={m} t={t} d={d} w={V ? w : w / 2} h={V ? h / 2 : h} n={sc.n + i} />
            </div>
          ))}
        </AbsoluteFill>,
      );
    } else if (ms.length >= 2) {
      const half = d / 2;
      const i = t < half ? 0 : 1;
      els.push(<Sequence key={'m' + i} from={i ? Math.round(half * 30) : 0} layout="none"><Clip m={ms[i]} t={t - i * half} d={half} w={w} h={h} n={sc.n} fit={V} /></Sequence>);
    } else if (ms.length === 1) {
      els.push(<Clip key="m" m={ms[0]} t={t} d={d} w={w} h={h} n={sc.n} fit={V} />);
    }
    els.push(<AbsoluteFill key="shade" style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />);
    if (sc.icons.length) {
      els.push(<Icons key="ic" icons={sc.icons} t={t} d={d} cx={V ? w / 2 : w * 0.76} cy={V ? 1430 : h * 0.46} maxW={V ? 900 : 700} fx={sc.fx} col={!V && sc.icons.length > 1} big={V ? 240 : sc.icons.length === 1 ? 360 : 230} />);
    }
  } else {
    els.push(<Navy key="bg" t={T} w={w} h={h} floor={!!hasPerson} />);
    const m = sc.media[0];
    const side = !!(m || hasPerson);
    if (m) {
      const cw = V ? 900 : 860, ch = V ? 1200 : 640;
      els.push(<MediaCard key="card" m={m} t={t} d={d} x={V ? w / 2 : hasPerson ? 1300 : 600} y={V ? 760 : 470} cw={cw} ch={m.ar && m.ar < 1.2 ? ch : V ? 506 : ch} n={sc.n} />);
    }
    if (hasPerson) {
      const px = V ? w / 2 : sc.icons.length || m ? 600 : 960;
      els.push(<Tu key="tu" p={sc.person!} t={t} x={px} y={V ? 860 : 560} s={V ? 1.45 : 1.3} />);
    }
    if (sc.icons.length) {
      if (V) els.push(<Icons key="ic" icons={sc.icons} t={t} d={d} cx={w / 2} cy={hasPerson || m ? 380 : 720} maxW={960} fx={sc.fx} big={hasPerson || m ? 220 : undefined} />);
      else els.push(<Icons key="ic" icons={sc.icons} t={t} d={d} cx={side ? (m && !hasPerson ? 1440 : 1340) : 960} cy={side ? 470 : 470} maxW={side ? 820 : 1500} fx={sc.fx} col={side && sc.icons.length > 2} big={side ? (sc.icons.length > 2 ? 200 : 300) : undefined} />);
    }
  }
  if (sc.fx.includes('dark')) els.push(<AbsoluteFill key="dk" style={{background: '#000', opacity: (sc.tipo === 'TEXTO' ? 1 : eio(t, d * 0.4, d * 0.5)) * 0.65}} />);
  const nT = sc.txt.length;
  sc.txt.forEach((tx, k) => {
    const at = sc.tipo === 'TEXTO' && k > 0 ? Math.max(0.6, d * 0.42) : tx.size === 'chico' ? 0.15 : 0.35;
    const chico = tx.size === 'chico' && tx.card && sc.tipo !== 'TEXTO';
    const sz = sc.tipo === 'TEXTO' ? (nT > 1 ? 1.4 : tx.size === 'grande' ? 1.25 : 1.6) : 1;
    els.push(<TextEl key={'t' + k} tx={{...tx, at}} t={t} x={chico && !V ? 90 : w / 2} y={textY(tx, k, nT)} align={chico && !V ? 'left' : 'center'} scale={sz * S} maxW={V ? 980 : 1750} />);
  });
  return (
    <AbsoluteFill style={{overflow: 'hidden', background: C.deep}}>
      <AbsoluteFill style={{transform: `scale(${punch})`}}>{els}</AbsoluteFill>
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 62%, rgba(0,0,0,0.38) 100%)', pointerEvents: 'none'}} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - eo(t, 0, 0.12), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

export const SceneSeq: React.FC<{sc: SceneT; w: number; h: number}> = ({sc, w, h}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(sc.start * fps);
  return (
    <Sequence from={from} durationInFrames={Math.max(1, Math.round(sc.end * fps) - from)} layout="none">
      <Inner sc={sc} w={w} h={h} from={from} />
    </Sequence>
  );
};
const Inner: React.FC<{sc: SceneT; w: number; h: number; from: number}> = ({sc, w, h, from}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <SceneView sc={sc} T={(f + from) / fps} w={w} h={h} />;
};

export const findScene = (list: SceneT[], T: number) => {
  let lo = 0, hi = list.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (list[mid].start <= T) lo = mid;
    else hi = mid - 1;
  }
  return list[lo];
};

const scenes = (plan as any).scenes as SceneT[];
export const RiquezaVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const sc = findScene(scenes, frame / fps);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneSeq key={sc.n} sc={sc} w={width} h={height} />
    </AbsoluteFill>
  );
};
