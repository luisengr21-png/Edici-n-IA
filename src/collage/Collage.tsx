// Motor del estilo «collage» (ver CLAUDE.md). Dibuja un video a partir de un plan JSON:
// escenas con fondo, transición de entrada y elementos que entran y salen en tiempos de la voz.
// Elementos: tarjetas (foto o clip con marco blanco), recortes tipo estampa, el personaje «Tú», notas a mano,
// marcador, titulares, sellos, trazos (flechas, círculos, tachones), gráficas, listas, globos y dibujitos.
import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, Sequence, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {renderEl} from '../burnout/elements';
import {clamp, eio, eo, hash, lerp, spr} from '../burnout/kit';

export const F = {anton: 'Anton, Impact, sans-serif', hand: 'Caveat, cursive', marker: '"Permanent Marker", cursive', emoji: '"Noto Color Emoji", sans-serif'};
export const C = {char: '#26252b', navy: '#14213d', cream: '#f3ead8', paper: '#fffdf6', red: '#e63b2e', green: '#1fbf7a', yellow: '#ffc93c', ink: '#1d1b22', blue: '#2b3a67'};
const STICKER = 'drop-shadow(5px 0 0 #fff) drop-shadow(-5px 0 0 #fff) drop-shadow(0 5px 0 #fff) drop-shadow(0 -5px 0 #fff) drop-shadow(0 18px 22px rgba(0,0,0,0.45))';

export type El = {k: string; at: number; out?: number; [key: string]: any};
export type Bg = {type: string; src?: string; video?: boolean; off?: number; tint?: string};
export type Scene = {n: number; start: number; end: number; bg: Bg; tr: {type: string; dur: number}; els: El[]; light: boolean; cam?: number};
export type Plan = {duration: number; audioEnd: number; scenes: Scene[]};

export const useFonts = () => {
  const [h] = React.useState(() => delayRender('fuentes collage'));
  React.useEffect(() => {
    const fs = [
      new FontFace('Anton', `url(${staticFile('canal/fonts/anton-regular.ttf')})`),
      new FontFace('Caveat', `url(${staticFile('canal/fonts/caveat-700.woff2')})`),
      new FontFace('Permanent Marker', `url(${staticFile('canal/fonts/permanent-marker-400.woff2')})`),
    ];
    Promise.all(fs.map((f) => f.load().then((x) => document.fonts.add(x)))).then(() => continueRender(h));
  }, [h]);
};

// ───────────────────────── FONDOS ─────────────────────────
const Paper: React.FC<{color: string; id: string; grid?: string; lines?: string; crumple?: boolean}> = ({color, id, grid, lines, crumple}) => (
  <AbsoluteFill style={{background: color}}>
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
      <filter id={`n${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency={crumple ? 0.006 : 0.9} numOctaves={crumple ? 4 : 2} seed={(hash(id.length * 7) * 50) | 0} />
        {crumple ? (
          <feDiffuseLighting lightingColor="#fff" surfaceScale={3}>
            <feDistantLight azimuth={225} elevation={55} />
          </feDiffuseLighting>
        ) : (
          <feColorMatrix type="saturate" values="0" />
        )}
      </filter>
      <rect width="1920" height="1080" filter={`url(#n${id})`} opacity={crumple ? 0.35 : 0.13} style={{mixBlendMode: 'multiply'}} />
    </svg>
    {grid && <AbsoluteFill style={{backgroundImage: `linear-gradient(${grid} 1.5px, transparent 1.5px), linear-gradient(90deg, ${grid} 1.5px, transparent 1.5px)`, backgroundSize: '54px 54px'}} />}
    {lines && (
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${lines} 2px, transparent 2px)`, backgroundSize: '100% 64px', backgroundPosition: '0 40px'}}>
        <div style={{position: 'absolute', left: 190, top: 0, bottom: 0, width: 3, background: 'rgba(230,59,46,0.45)'}} />
      </AbsoluteFill>
    )}
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.32) 100%)'}} />
  </AbsoluteFill>
);

const Stars: React.FC<{t: number}> = ({t}) => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 40%, #151827 0%, #07070b 75%)'}}>
    {Array.from({length: 170}).map((_, k) => {
      const tw = 0.5 + 0.5 * Math.sin(t * (1 + hash(k) * 2) + k);
      return <div key={k} style={{position: 'absolute', left: hash(k * 3.1) * 1920, top: hash(k * 7.7) * 1080, width: 1 + hash(k) * 3, height: 1 + hash(k) * 3, borderRadius: 3, background: '#fff', opacity: 0.22 + 0.6 * tw}} />;
    })}
  </AbsoluteFill>
);

const Media: React.FC<{src: string; video?: boolean; off?: number; fit?: 'cover' | 'contain'}> = ({src, video, off = 0.4, fit = 'cover'}) => {
  const {fps} = useVideoConfig();
  const st: React.CSSProperties = {width: '100%', height: '100%', objectFit: fit};
  return video ? <OffthreadVideo src={staticFile(src)} startFrom={Math.round(off * fps)} muted style={st} /> : <Img src={staticFile(src)} style={st} />;
};

const Background: React.FC<{bg: Bg; t: number; d: number; id: string}> = ({bg, t, d, id}) => {
  switch (bg.type) {
    case 'papel oscuro': return <Paper color={C.char} id={id} />;
    case 'papel crema': return <Paper color={C.cream} id={id} />;
    case 'papel arrugado': return <Paper color="#e9e2d2" id={id} crumple />;
    case 'cuadriculado': return <Paper color={C.cream} id={id} grid="rgba(80,120,190,0.22)" crumple />;
    case 'rayado': return <Paper color={C.paper} id={id} lines="rgba(70,110,200,0.28)" />;
    case 'pizarrón azul':
      return (
        <AbsoluteFill>
          <Paper color={C.navy} id={id} />
          <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)', backgroundSize: '120px 120px'}} />
        </AbsoluteFill>
      );
    case 'espacio': return <Stars t={t} />;
    case 'pintura':
      return (
        <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
          <AbsoluteFill style={{transform: `scale(${1.04 + 0.06 * (t / Math.max(d, 1))}) translateX(${-12 * (t / Math.max(d, 1))}px)`}}><Media src={bg.src!} /></AbsoluteFill>
          <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.45) 100%)'}} />
        </AbsoluteFill>
      );
    case 'desenfocado':
      return (
        <AbsoluteFill style={{overflow: 'hidden', background: '#000'}}>
          <AbsoluteFill style={{filter: 'blur(34px) brightness(0.62) saturate(1.1)', transform: 'scale(1.15)'}}><Media src={bg.src!} video={bg.video} off={bg.off} /></AbsoluteFill>
          <AbsoluteFill style={{background: bg.tint ?? 'rgba(60,30,90,0.35)', mixBlendMode: 'multiply'}} />
        </AbsoluteFill>
      );
    default: return <Paper color={C.char} id={id} />;
  }
};

// ───────────────────────── ELEMENTOS ─────────────────────────
const vis = (t: number, e: El) => t >= e.at && (e.out == null || t < e.out + 0.35);
const outK = (t: number, e: El) => (e.out == null ? 1 : 1 - eio(t, e.out, 0.3));

const Card: React.FC<{e: El; t: number}> = ({e, t}) => {
  const p = spr(t, e.at, 1.6, 0.5), o = outK(t, e);
  const from = e.from ?? 'right';
  const dx = from === 'right' ? 1500 : from === 'left' ? -1500 : 0, dy = from === 'top' ? -1000 : from === 'bottom' ? 1000 : 0;
  const fl = Math.sin((t - e.at) * 0.8 + e.x) * 5;
  const w = e.w ?? 900, h = e.h ?? 520;
  return (
    <div style={{position: 'absolute', left: e.x - w / 2, top: e.y - h / 2, width: w, height: h, opacity: o, transform: `translate(${lerp(dx, 0, p)}px, ${lerp(dy, 0, p) + fl + (1 - o) * 60}px) rotate(${(e.rot ?? 0) + (1 - p) * 10}deg) scale(${0.92 + 0.08 * o})`, background: '#fff', padding: 14, borderRadius: 24, boxShadow: '0 30px 50px rgba(0,0,0,0.45)'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 14, overflow: 'hidden', position: 'relative'}}>
        <AbsoluteFill style={{transform: `scale(${1.04 + 0.04 * clamp((t - e.at) / 8)})`}}><Media src={e.src} video={e.video} off={e.off} /></AbsoluteFill>
      </div>
    </div>
  );
};

const Cut: React.FC<{e: El; t: number}> = ({e, t}) => {
  const s = spr(t, e.at, 2.2, 0.42) * outK(t, e);
  const fl = Math.sin((t - e.at) * 1.3 + e.x * 0.01) * 6;
  return (
    <div style={{position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%,-50%) translateY(${fl}px) scale(${s * (e.flip ? -1 : 1)}, ${s}) rotate(${(e.rot ?? 0) + Math.sin(t * 1.1 + e.x) * 1.5}deg)`, filter: STICKER}}>
      <Img src={staticFile(e.src)} style={{height: e.h ?? 400, display: 'block'}} />
    </div>
  );
};

const Tu: React.FC<{e: El; t: number}> = ({e, t}) => (
  <div style={{position: 'absolute', inset: 0, filter: STICKER, opacity: outK(t, e)}}>
    {renderEl({k: 'person', at: e.at, anim: 'up', float: 3, x: e.x, y: e.y, s: e.s ?? 1.2, pose: e.pose ?? 'stand', mood: e.mood, hold: e.hold, sweat: e.sweat, flip: e.flip} as any, t, 0)}
  </div>
);

const Write: React.FC<{e: El; t: number; light: boolean}> = ({e, t, light}) => {
  const n = Math.floor(clamp((t - e.at) * (e.speed ?? 24), 0, e.text.length));
  const font = e.k === 'marker' ? F.marker : F.hand;
  const color = e.color ?? (e.k === 'marker' ? C.red : light ? C.ink : C.cream);
  return (
    <div style={{position: 'absolute', left: e.x, top: e.y, width: e.w, transform: `translate(-50%,-50%) rotate(${e.rot ?? 0}deg)`, opacity: outK(t, e), fontFamily: font, fontSize: (e.size ?? 72) * (e.k === 'hand' ? 1.32 : 1.12), color, whiteSpace: e.w ? 'normal' : 'pre', textAlign: 'center', lineHeight: 1.05}}>
      {e.text.slice(0, n)}<span style={{opacity: 0}}>{e.text.slice(n)}</span>
    </div>
  );
};

const Title: React.FC<{e: El; t: number; light: boolean}> = ({e, t, light}) => {
  const p = spr(t, e.at, 2, 0.5) * outK(t, e);
  const acc: string = e.acc ?? '';
  const parts = acc && e.text.includes(acc) ? e.text.split(acc) : [e.text];
  const col = light ? C.ink : '#fff';
  const box = e.box ?? C.red;
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540, transform: `translate(-50%,-50%) scale(${p}) rotate(${e.rot ?? -2}deg)`, fontFamily: F.anton, fontSize: e.size ?? 130, color: col, whiteSpace: 'nowrap', letterSpacing: 2, textShadow: light ? 'none' : '0 8px 24px rgba(0,0,0,0.5)'}}>
      {parts.length === 2 ? (
        <>
          {parts[0]}
          <span style={{background: box, color: '#fff', padding: '0 22px', borderRadius: 10, display: 'inline-block', transform: 'rotate(2deg)'}}>{acc}</span>
          {parts[1]}
        </>
      ) : e.text}
    </div>
  );
};

const Stamp: React.FC<{e: El; t: number}> = ({e, t}) => {
  const s = lerp(2.4, 1, eo(t, e.at, 0.14));
  const color = e.color ?? C.red;
  return (
    <div style={{position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%,-50%) rotate(${e.rot ?? -10}deg) scale(${s})`, opacity: clamp((t - e.at) / 0.06) * outK(t, e), border: `9px solid ${color}`, borderRadius: 14, padding: '6px 30px', fontFamily: F.anton, fontSize: e.size ?? 90, color, letterSpacing: 4, whiteSpace: 'nowrap', background: 'rgba(255,255,255,0.08)', boxShadow: `0 0 30px ${color}44`}}>
      {e.text}
    </div>
  );
};

// Trazo a mano: flecha (de x1,y1 a x2,y2 con curva), círculo (elipse), tachón, subrayado o camino libre.
const Stroke: React.FC<{e: El; t: number}> = ({e, t}) => {
  const p = eio(t, e.at, e.dur ?? 0.5);
  let d: string = e.d ?? '';
  let head = '';
  if (e.k === 'arrow') {
    const {x1, y1, x2, y2} = e;
    const bend = e.bend ?? 0.25;
    const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
    d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
    const ang = Math.atan2(y2 - my, x2 - mx), L = 34;
    head = `M ${x2 - L * Math.cos(ang - 0.5)} ${y2 - L * Math.sin(ang - 0.5)} L ${x2} ${y2} L ${x2 - L * Math.cos(ang + 0.5)} ${y2 - L * Math.sin(ang + 0.5)}`;
  } else if (e.k === 'circle') {
    const {x, y, rx, ry} = e;
    d = `M ${x + rx} ${y} A ${rx} ${ry} 0 1 1 ${x + rx * 0.98} ${y - ry * 0.2}`;
  } else if (e.k === 'strike' || e.k === 'underline') {
    const {x1, y1, x2, y2} = e;
    d = `M ${x1} ${y1} C ${x1 + (x2 - x1) * 0.3} ${y1 - 8} ${x1 + (x2 - x1) * 0.7} ${y2 + 8} ${x2} ${y2}`;
  }
  const color = e.color ?? C.red;
  const len = e.len ?? 2400;
  return (
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: outK(t, e)}}>
      <path d={d} fill="none" stroke={color} strokeWidth={e.w ?? 8} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      {head && p > 0.95 && <path d={head} fill="none" stroke={color} strokeWidth={e.w ?? 8} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
  );
};

const XMark: React.FC<{e: El; t: number}> = ({e, t}) => {
  const r = e.size ?? 120, p1 = eo(t, e.at, 0.18), p2 = eo(t, e.at + 0.15, 0.18);
  return (
    <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: outK(t, e)}}>
      <path d={`M ${e.x - r} ${e.y - r} L ${e.x - r + 2 * r * p1} ${e.y - r + 2 * r * p1}`} stroke={C.red} strokeWidth={26} strokeLinecap="round" />
      {p2 > 0 && <path d={`M ${e.x + r} ${e.y - r} L ${e.x + r - 2 * r * p2} ${e.y - r + 2 * r * p2}`} stroke={C.red} strokeWidth={26} strokeLinecap="round" />}
    </svg>
  );
};

const Chart: React.FC<{e: El; t: number}> = ({e, t}) => {
  const pts: number[][] = e.pts;
  const dd = 'M ' + pts.map((q) => q.join(' ')).join(' L ');
  const dur = e.dur ?? 1.4;
  const color = e.color ?? '#fff';
  return (
    <div style={{position: 'absolute', inset: 0, opacity: outK(t, e)}}>
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0}}>
        <path d={dd} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={3000} strokeDashoffset={3000 * (1 - eio(t, e.at, dur))} />
      </svg>
      {pts.map((q, k) => (t > e.at + (k / pts.length) * dur ? <div key={k} style={{position: 'absolute', left: q[0] - 13, top: q[1] - 13, width: 26, height: 26, borderRadius: 13, background: color, transform: `scale(${spr(t, e.at + (k / pts.length) * dur, 3, 0.5)})`}} /> : null))}
    </div>
  );
};

// Hoja con una lista escrita a mano; cada renglón puede tacharse o palomearse en su tiempo.
const List: React.FC<{e: El; t: number}> = ({e, t}) => {
  const p = spr(t, e.at, 1.6, 0.5), o = outK(t, e);
  const w = e.w ?? 860, rowH = e.rowH ?? 104;
  const rows: {text: string; at?: number; mark?: string; markAt?: number}[] = e.rows;
  const h = 150 + rows.length * rowH + 40;
  return (
    <div style={{position: 'absolute', left: e.x - w / 2, top: e.y - h / 2, width: w, height: h, opacity: o, background: C.paper, boxShadow: '0 30px 60px rgba(0,0,0,0.3)', transform: `rotate(${(e.rot ?? -2) + (1 - p) * 8}deg) translateY(${(1 - p) * 1000}px)`, backgroundImage: 'linear-gradient(rgba(70,110,200,0.25) 2px, transparent 2px)', backgroundSize: `100% ${rowH}px`, backgroundPosition: '0 46px'}}>
      {e.title && <div style={{position: 'absolute', left: 50, top: 34, fontFamily: F.anton, fontSize: 62, color: C.ink, letterSpacing: 3}}>{e.title}</div>}
      {rows.map((r, k) => {
        const ra = r.at ?? e.at;
        const n = Math.floor(clamp((t - ra) * 26, 0, r.text.length));
        const top = 150 + k * rowH;
        const mp = r.markAt != null ? eio(t, r.markAt, 0.35) : 0;
        return (
          <div key={k} style={{position: 'absolute', left: 90, top, height: rowH, display: 'flex', alignItems: 'center', fontFamily: F.hand, fontSize: 64, color: C.blue}}>
            {r.text.slice(0, n)}
            {r.mark === 'strike' && mp > 0 && <div style={{position: 'absolute', left: -10, top: rowH / 2, width: `${mp * 105}%`, height: 9, background: C.red, borderRadius: 5, transform: 'rotate(-2deg)'}} />}
            {r.mark === 'check' && mp > 0 && <div style={{position: 'absolute', left: -70, top: rowH / 2 - 40, fontFamily: F.marker, fontSize: 70, color: C.green, transform: `scale(${spr(t, r.markAt!, 3, 0.5)})`}}>✓</div>}
          </div>
        );
      })}
    </div>
  );
};

const Bubble: React.FC<{e: El; t: number}> = ({e, t}) => {
  const s = spr(t, e.at, 2.2, 0.45) * outK(t, e);
  return (
    <div style={{position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%,-50%) scale(${s}) rotate(${e.rot ?? -3}deg)`, background: '#fff', border: `6px solid ${C.ink}`, borderRadius: 56, padding: '20px 54px', fontFamily: F.marker, fontSize: e.size ?? 80, color: C.ink, whiteSpace: 'nowrap', boxShadow: '0 14px 0 rgba(0,0,0,0.15)'}}>
      {e.text}
    </div>
  );
};

const Emo: React.FC<{e: El; t: number}> = ({e, t}) => {
  const s = spr(t, e.at, 2.4, 0.42) * outK(t, e);
  return <div style={{position: 'absolute', left: e.x, top: e.y, transform: `translate(-50%,-50%) scale(${s}) rotate(${(e.rot ?? 0) + Math.sin(t * 1.6 + e.x) * 4}deg)`, fontFamily: F.emoji, fontSize: e.size ?? 160, lineHeight: 1, filter: STICKER}}>{e.e}</div>;
};

// Dibujitos propios: cronómetro, signo de pregunta, casillas, sol, nube, corazón, puerta con luz, líneas de velocidad.
const Doodle: React.FC<{e: El; t: number; light: boolean}> = ({e, t, light}) => {
  const s = spr(t, e.at, 2.2, 0.45) * outK(t, e) * (1 + (e.grow ?? 0) * eio(t, e.at + 0.3, e.growDur ?? 4));
  const ink = e.color ?? (light ? C.ink : C.cream);
  const z = e.size ?? 220;
  let g: React.ReactNode = null;
  switch (e.name) {
    case 'cronometro': {
      const a = clamp((t - e.at) / (e.run ?? 3)) * 360;
      g = (<g><circle r="80" fill="none" stroke={ink} strokeWidth="10" /><rect x="-14" y="-112" width="28" height="22" rx="6" fill={ink} /><line x1="0" y1="0" x2={70 * Math.sin((a * Math.PI) / 180)} y2={-70 * Math.cos((a * Math.PI) / 180)} stroke={C.red} strokeWidth="9" strokeLinecap="round" /><circle r="9" fill={ink} /></g>);
      break;
    }
    case 'pregunta': g = <text x="0" y="60" textAnchor="middle" fontFamily="Permanent Marker" fontSize="190" fill={e.color ?? C.red}>?</text>; break;
    case 'casillas': {
      const checks: number[] = e.checks ?? [];
      g = (<g>{[0, 1, 2].map((k) => (<g key={k} transform={`translate(${(k - 1) * 120} 0)`}><rect x="-40" y="-40" width="80" height="80" rx="8" fill="none" stroke={ink} strokeWidth="8" />{checks[k] != null && t > checks[k] && <path d="M -26 0 L -6 22 L 30 -26" fill="none" stroke={C.green} strokeWidth="12" strokeLinecap="round" strokeDasharray="120" strokeDashoffset={120 * (1 - eo(t, checks[k], 0.3))} />}</g>))}</g>);
      break;
    }
    case 'sol': g = (<g transform={`rotate(${t * 25})`}>{Array.from({length: 12}).map((_, k) => <line key={k} x1="0" y1="-80" x2="0" y2="-118" stroke={C.yellow} strokeWidth="12" strokeLinecap="round" transform={`rotate(${k * 30})`} />)}<circle r="62" fill={C.yellow} /></g>); break;
    case 'nube': g = (<g><path d="M -90 30 Q -120 -20 -60 -40 Q -40 -100 20 -70 Q 80 -100 100 -30 Q 140 0 100 40 Z" fill="#6b7280" stroke={ink} strokeWidth="6" /><path d="M -10 50 L -30 100 L 0 95 L -20 140" fill="none" stroke={C.yellow} strokeWidth="10" strokeLinecap="round" /></g>); break;
    case 'corazon': g = <path d="M 0 60 C -120 -20 -60 -110 0 -40 C 60 -110 120 -20 0 60 Z" fill={e.color ?? '#ff5d8f'} stroke={ink} strokeWidth="6" transform={`scale(${1 + 0.06 * Math.sin(t * 6)})`} />; break;
    case 'puerta': g = (<g><rect x="-70" y="-110" width="140" height="220" fill="#fff6c9" opacity={0.9} /><rect x="-70" y="-110" width="140" height="220" fill="none" stroke={ink} strokeWidth="8" /><path d={`M -70 -110 L ${-70 + 100 * (1 - eo(t, e.at + 0.4, 1))} -90 L ${-70 + 100 * (1 - eo(t, e.at + 0.4, 1))} 130 L -70 110 Z`} fill="#7a4b2a" stroke={ink} strokeWidth="6" /></g>); break;
    case 'velocidad': g = (<g>{[0, 1, 2, 3].map((k) => <line key={k} x1={-120} y1={-60 + k * 40} x2={60 - k * 20} y2={-60 + k * 40} stroke={ink} strokeWidth="8" strokeLinecap="round" />)}</g>); break;
    case 'igual': g = (<g><line x1="-60" y1="-20" x2="60" y2="-20" stroke={ink} strokeWidth="14" strokeLinecap="round" /><line x1="-60" y1="20" x2="60" y2="20" stroke={ink} strokeWidth="14" strokeLinecap="round" /></g>); break;
    case 'escalera': g = (<g><line x1="-60" y1="-140" x2="-60" y2="140" stroke={ink} strokeWidth="9" /><line x1="60" y1="-140" x2="60" y2="140" stroke={ink} strokeWidth="9" />{[0, 1, 2, 3, 4].map((k) => <line key={k} x1="-60" y1={-110 + k * 55} x2="60" y2={-110 + k * 55} stroke={ink} strokeWidth="9" />)}</g>); break;
    case 'trebol': g = (<g>{[0, 90, 180, 270].map((r) => <circle key={r} cx={0} cy={-38} r="34" fill="#3aa35b" stroke={ink} strokeWidth="5" transform={`rotate(${r})`} />)}<path d="M 0 0 Q 10 60 -10 110" stroke="#3aa35b" strokeWidth="10" fill="none" /></g>); break;
    default: g = null;
  }
  return (
    <svg width={z} height={z} viewBox="-150 -150 300 300" style={{position: 'absolute', left: e.x - z / 2, top: e.y - z / 2, transform: `scale(${s}) rotate(${e.rot ?? 0}deg)`, overflow: 'visible'}}>{g}</svg>
  );
};

const Elem: React.FC<{e: El; t: number; light: boolean}> = ({e, t, light}) => {
  if (!vis(t, e)) return null;
  switch (e.k) {
    case 'card': return <Card e={e} t={t} />;
    case 'cut': return <Cut e={e} t={t} />;
    case 'tu': return <Tu e={e} t={t} />;
    case 'hand': case 'marker': return <Write e={e} t={t} light={light} />;
    case 'title': return <Title e={e} t={t} light={light} />;
    case 'stamp': return <Stamp e={e} t={t} />;
    case 'arrow': case 'circle': case 'strike': case 'underline': case 'path': return <Stroke e={e} t={t} />;
    case 'x': return <XMark e={e} t={t} />;
    case 'chart': return <Chart e={e} t={t} />;
    case 'list': return <List e={e} t={t} />;
    case 'bubble': return <Bubble e={e} t={t} />;
    case 'emo': return <Emo e={e} t={t} />;
    case 'doodle': return <Doodle e={e} t={t} light={light} />;
    default: return null;
  }
};

// ───────────────────────── ESCENAS Y TRANSICIONES ─────────────────────────
const SceneView: React.FC<{sc: Scene; T: number}> = ({sc, T}) => {
  const t = T - sc.start, d = sc.end - sc.start;
  const z = 1 + (sc.cam ?? 0.03) * eio(t, 0, d);
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Background bg={sc.bg} t={t} d={d} id={`s${sc.n}`} />
      <AbsoluteFill style={{transform: `scale(${z})`}}>
        {sc.els.map((e, i) => <Elem key={i} e={e} t={T} light={sc.light} />)}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const trStyle = (type: string, p: number): React.CSSProperties => {
  switch (type) {
    case 'slide': return {transform: `translateX(${(1 - p) * 1920}px) rotate(${(1 - p) * 3}deg)`, boxShadow: '-40px 0 60px rgba(0,0,0,0.5)'};
    case 'whip': return {transform: `translateX(${(1 - p) * -1920}px)`, filter: `blur(${(1 - p) * 20}px)`};
    case 'up': return {transform: `translateY(${(1 - p) * 1080}px)`, boxShadow: '0 -40px 60px rgba(0,0,0,0.5)'};
    case 'page': return {transform: `perspective(2200px) rotateY(${(1 - p) * -95}deg)`, transformOrigin: '0% 50%'};
    case 'zoom': return {transform: `scale(${0.6 + 0.4 * p})`, opacity: p};
    case 'dissolve': default: return {opacity: p};
  }
};

export const CollageTrack: React.FC<{plan: Plan}> = ({plan}) => {
  useFonts();
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = frame / fps;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {plan.scenes.map((sc, i) => {
        const next = plan.scenes[i + 1];
        const until = next ? next.start + next.tr.dur + 0.1 : plan.duration;
        const from = Math.max(0, Math.round(sc.start * fps));
        const dur = Math.max(1, Math.round(until * fps) - from);
        if (frame < from || frame >= from + dur) return null;
        const since = T - sc.start;
        const inTr = i > 0 && since < sc.tr.dur;
        const p = inTr ? eio(since, 0, sc.tr.dur) : 1;
        const flash = sc.tr.type === 'flash' && inTr ? 1 - p : 0;
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            <AbsoluteFill style={inTr && sc.tr.type !== 'flash' ? trStyle(sc.tr.type, p) : undefined}>
              <SceneView sc={sc} T={T} />
              {flash > 0 && <AbsoluteFill style={{background: '#fff', opacity: flash}} />}
            </AbsoluteFill>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
