import React from 'react';
import {OffthreadVideo, Img, staticFile} from 'remotion';
import {L, SANS, SERIF, EMOJI, clamp, lerp, eo, eio, spr, wobble, hash, pr, color} from './kit';

// Cada elemento del plan es un objeto {k: tipo, x, y, at, anim, ...}. t = segundos desde que empieza la escena.
export type El = {k: string; x?: number; y?: number; at?: number; anim?: string; s?: number; rot?: number; [key: string]: any};

const enter = (t: number, at: number, anim: string): React.CSSProperties => {
  const p = spr(t, at, 2.3, 0.5);
  const q = eo(t, at, 0.45);
  switch (anim) {
    case 'pop':
      return {transform: `scale(${p})`, opacity: clamp(q * 2)};
    case 'up':
      return {transform: `translateY(${(1 - q) * 90}px)`, opacity: q};
    case 'down':
      return {transform: `translateY(${-(1 - q) * 90}px)`, opacity: q};
    case 'left':
      return {transform: `translateX(${-(1 - q) * 220}px)`, opacity: q};
    case 'right':
      return {transform: `translateX(${(1 - q) * 220}px)`, opacity: q};
    case 'fall':
      return {transform: `translateY(${-(1 - p) * 900}px)`, opacity: t >= at ? 1 : 0};
    case 'zoom':
      return {transform: `scale(${lerp(1.9, 1, q)})`, opacity: q};
    case 'fade':
      return {opacity: eo(t, at, 0.7)};
    case 'slam':
      return {transform: `scale(${lerp(2.6, 1, eo(t, at, 0.18))}) rotate(${wobble(t, at + 0.18, 2, 6, 6)}deg)`, opacity: clamp((t - at) / 0.06)};
    default:
      return {opacity: t >= at ? 1 : 0};
  }
};

const Pos: React.FC<{e: El; t: number; i: number; children: React.ReactNode; origin?: string; idle?: boolean}> = ({e, t, i, children, origin, idle}) => {
  const at = e.at ?? 0.05 + i * 0.12;
  const st = enter(t, at, e.anim ?? 'pop');
  const bob = idle ? Math.sin(t * 2 + (e.x ?? 0) * 0.01) * 6 : 0;
  const out = e.out != null ? 1 - eo(t, e.out, 0.35) : 1;
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: (e.y ?? 540) + bob, transform: `translate(-50%,-50%) rotate(${e.rot ?? 0}deg) scale(${e.s ?? 1})`, opacity: (e.op ?? 1) * out}}>
      <div style={{...st, transformOrigin: origin ?? 'center'}}>{children}</div>
    </div>
  );
};

// Texto con *acento*: las palabras entre asteriscos van en el color de acento.
const Txt: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.05 + i * 0.12;
  const size = e.size ?? 104;
  const font = e.font === 'serif' ? SERIF : SANS;
  const base = color(e.color) ?? L.white;
  const acc = color(e.acc) ?? L.gold;
  const lines = String(e.text).split('\n');
  let w = 0;
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540, transform: `translate(-50%,-50%) rotate(${e.rot ?? 0}deg)`, width: e.w ?? 1600, textAlign: e.align ?? 'center', opacity: e.out != null ? 1 - eo(t, e.out, 0.3) : 1}}>
      {lines.map((ln, li) => (
        <div key={li} style={{fontFamily: font, fontWeight: e.weight ?? (e.font === 'serif' ? 900 : 900), fontStyle: e.italic ? 'italic' : 'normal', fontSize: size * (li > 0 && e.size2 ? e.size2 / size : 1), lineHeight: 1.12, letterSpacing: e.font === 'serif' ? 0 : -1, color: base, textShadow: e.noshadow ? 'none' : '0 6px 24px rgba(0,0,0,0.55)', textTransform: e.upper === false ? 'none' : undefined}}>
          {ln.split(' ').map((word, wi) => {
            const k = w++;
            const accent = /^\*.*\*[.,:;!?…]*$/.test(word);
            const clean = word.replace(/\*/g, '');
            const p = spr(t, at + k * (e.stagger ?? 0.07), 2.6, 0.55);
            const q = eo(t, at + k * (e.stagger ?? 0.07), 0.3);
            const strike = e.strike && accent ? eo(t, e.strikeAt ?? at + 0.6, 0.35) : 0;
            return (
              <span key={wi} style={{display: 'inline-block', position: 'relative', margin: '0 0.14em', transform: `translateY(${(1 - p) * 40}px) scale(${lerp(0.8, 1, p)})`, opacity: q, color: accent ? acc : undefined, filter: accent && e.glow ? `drop-shadow(0 0 18px ${acc})` : undefined}}>
                {clean}
                {strike > 0 && <span style={{position: 'absolute', left: '-4%', top: '52%', height: size * 0.12, width: `${strike * 108}%`, background: L.red, borderRadius: 8, transform: 'rotate(-4deg)'}} />}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Emo: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i} idle={e.idle !== false}>
    <div style={{fontFamily: EMOJI, fontSize: e.size ?? 200, lineHeight: 1, filter: `drop-shadow(0 18px 30px rgba(0,0,0,0.5))${e.glow ? ` drop-shadow(0 0 30px ${color(e.glow)})` : ''}${e.gray ? ' grayscale(1) brightness(0.8)' : ''}`, opacity: e.ghost ? 0.35 : 1, transform: `rotate(${e.spin ? t * e.spin : 0}deg)`}}>{e.ch}</div>
  </Pos>
);

const Tag: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.05 + i * 0.12;
  const c = color(e.color) ?? L.gold;
  const swing = wobble(t, at, 16, 1.1, 1.3) + Math.sin(t * 1.6) * 3;
  const size = e.size ?? 70;
  const grad = c === L.gold ? `linear-gradient(135deg, ${L.goldL}, ${L.gold} 55%, ${L.goldD})` : c;
  return (
    <Pos e={e} t={t} i={i} origin="0% 50%">
      <div style={{transform: `rotate(${swing}deg)`, transformOrigin: '0% 50%', position: 'relative'}}>
        <div style={{position: 'absolute', left: size * 0.22, top: -size * 1.4, width: 4, height: size * 1.4 + size * 0.5, background: 'rgba(245,215,120,0.8)', transformOrigin: 'bottom', transform: 'rotate(-28deg)'}} />
        <div style={{background: grad, clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 18% 100%, 0 50%)', padding: `${size * 0.28}px ${size * 0.5}px ${size * 0.28}px ${size * 0.95}px`, borderRadius: 10, fontFamily: SANS, fontWeight: 900, fontSize: size, color: e.ink ?? L.ink, whiteSpace: 'nowrap', boxShadow: '0 20px 40px rgba(0,0,0,0.4)'}}>{e.text}</div>
        <div style={{position: 'absolute', left: size * 0.32, top: '50%', width: size * 0.2, height: size * 0.2, marginTop: -size * 0.1, borderRadius: '50%', background: L.bg}} />
      </div>
    </Pos>
  );
};

const MarkSvg: React.FC<{kind: string; p: number; size: number; c?: string}> = ({kind, p, size, c}) => {
  const len = 300;
  if (kind === 'check')
    return (
      <svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
        <path d="M-34 2 L-10 28 L36 -30" fill="none" stroke={c ?? L.green} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
      </svg>
    );
  if (kind === 'circle')
    return (
      <svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
        <ellipse cx={0} cy={0} rx={46} ry={40} fill="none" stroke={c ?? L.red} strokeWidth={6} strokeLinecap="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} transform="rotate(-8)" />
      </svg>
    );
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" style={{overflow: 'visible'}}>
      <path d={`M-36 -36 L36 36`} fill="none" stroke={c ?? L.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - clamp(p * 2))} />
      <path d={`M36 -36 L-36 36`} fill="none" stroke={c ?? L.red} strokeWidth={14} strokeLinecap="round" strokeDasharray={110} strokeDashoffset={110 * (1 - clamp(p * 2 - 1))} />
    </svg>
  );
};

const Mark: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.3 + i * 0.12;
  if (e.kind === 'arrow') {
    const x1 = e.x ?? 0, y1 = e.y ?? 0, x2 = e.x2 ?? x1 + 200, y2 = e.y2 ?? y1;
    const p = eio(t, at, 0.5);
    const ang = Math.atan2(y2 - y1, x2 - x1);
    const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p);
    const c = color(e.color) ?? L.red;
    return (
      <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1} height={1}>
        <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={c} strokeWidth={14} strokeLinecap="round" />
        {p > 0.05 && <path d="M0 0 L-34 -22 L-34 22 Z" fill={c} transform={`translate(${ex},${ey}) rotate(${(ang * 180) / Math.PI})`} />}
      </svg>
    );
  }
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540, transform: 'translate(-50%,-50%)'}}>
      <MarkSvg kind={e.kind ?? 'x'} p={eio(t, at, 0.45)} size={e.size ?? 260} c={color(e.color)} />
    </div>
  );
};

const Card: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.05 + i * 0.15;
  const w = e.w ?? 420, h = e.h ?? 460;
  const c = color(e.color) ?? L.gold;
  return (
    <Pos e={{...e, at}} t={t} i={i}>
      <div style={{width: w, height: h, borderRadius: 34, background: e.bg ?? 'linear-gradient(160deg,#2a2631,#17151c)', border: `4px solid ${c}`, boxShadow: `0 30px 60px rgba(0,0,0,0.45), 0 0 40px ${c}33`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', gap: 18}}>
        {e.ch && <div style={{fontFamily: EMOJI, fontSize: h * 0.36, lineHeight: 1}}>{e.ch}</div>}
        {e.text && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 46, color: e.ink ?? L.white, textAlign: 'center', padding: '0 24px', lineHeight: 1.1}}>{e.text}</div>}
        {e.mark && (
          <div style={{position: 'absolute', left: '80%', top: '18%', transform: 'translate(-50%,-50%)'}}>
            <MarkSvg kind={e.mark} p={eio(t, e.markAt ?? at + 0.8, 0.4)} size={Math.min(w, h) * 0.42} />
          </div>
        )}
      </div>
    </Pos>
  );
};

// ───── personaje "Tú": silueta sin rostro con sudadera mostaza ─────
const POSES: Record<string, [number, number, number, number]> = {
  // [brazoIzq, codoIzq, brazoDer, codoDer] en grados (0 = hacia abajo, positivo = hacia afuera)
  stand: [8, 0, 8, 0],
  wave: [8, 0, 150, 30],
  handup: [8, 0, 172, 0],
  scratch: [8, 0, 150, 120],
  phone: [8, 0, 40, 110],
  selfie: [8, 0, 125, 20],
  bags: [14, 0, 14, 0],
  shrug: [60, -90, 60, -90],
  reach: [8, 0, 95, 0],
  hips: [40, -110, 40, -110],
};
const Person: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.05 + i * 0.12;
  let [la, le, ra, re] = POSES[e.pose ?? 'stand'] ?? POSES.stand;
  if (e.pose === 'wave') ra += Math.sin(t * 9) * 14;
  const walk = e.walk ? Math.sin(t * 7 + i) : 0;
  const hood = color(e.hood) ?? L.mustard;
  const dark = e.dark ?? '#26232c';
  const arm = (side: number, a: number, el: number) => {
    const sx = side * 58, sy = -112;
    const r1 = ((side * a) * Math.PI) / 180;
    const ex = sx + Math.sin(r1) * 68, ey = sy + Math.cos(r1) * 68;
    const r2 = ((side * (a + el)) * Math.PI) / 180;
    const hx = ex + Math.sin(r2) * 64, hy = ey + Math.cos(r2) * 64;
    return {d: `M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}`, hx, hy};
  };
  const A = arm(-1, la + walk * 14, le), B = arm(1, ra - walk * 14, re);
  const legL = `M-28 34 L${-30 + walk * 26} 205`, legR = `M28 34 L${30 - walk * 26} 205`;
  const sit = e.pose === 'sit';
  return (
    <Pos e={{...e, at}} t={t} i={i}>
      <div style={{position: 'relative', opacity: e.ghost ? 0.3 : 1, filter: e.blur ? `blur(${e.blur}px)` : undefined}}>
        <svg width={360} height={520} viewBox="-180 -270 360 520" style={{overflow: 'visible', transform: `scaleX(${e.flip ? -1 : 1})`}}>
          <ellipse cx={0} cy={214} rx={90} ry={14} fill="rgba(0,0,0,0.35)" />
          {sit ? (
            <path d="M-28 34 L-30 110 L60 112 L62 205 M28 34 L30 110 L100 112 L102 205" stroke={dark} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          ) : (
            <>
              <path d={legL} stroke={dark} strokeWidth={36} strokeLinecap="round" fill="none" />
              <path d={legR} stroke={dark} strokeWidth={36} strokeLinecap="round" fill="none" />
            </>
          )}
          <path d={A.d} stroke={hood} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M-64 -126 Q0 -150 64 -126 L70 44 Q0 58 -70 44 Z" fill={hood} />
          <path d="M-30 -10 L30 -10 L26 20 L-26 20 Z" fill="rgba(0,0,0,0.12)" />
          <path d={B.d} stroke={hood} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" fill="none" />
          {/* cara del personaje principal */}
          <circle cx={0} cy={-182} r={50} fill={e.sil ? dark : e.ghost ? '#cbbfb3' : e.skin ?? '#D9A27A'} />
          {e.back ? <circle cx={0} cy={-186} r={50} fill="#3a2418" /> : !e.sil && <path d="M-46 -200 Q-40 -236 0 -238 Q40 -236 46 -200 Q30 -222 0 -222 Q-30 -222 -46 -200 Z" fill="#3a2418" />}
          {!e.sil && !e.back && (() => {
            const worried = e.sweat || e.pose === 'scratch' || e.mood === 'worried';
            const happy = e.pose === 'wave' || e.mood === 'happy';
            const blink = Math.sin(t * 2.3 + i * 1.7) > 0.985 ? 0.15 : 1;
            return (
              <g>
                <path d={worried ? 'M-30 -197 L-12 -205' : 'M-30 -200 L-12 -203'} stroke="#3a2418" strokeWidth={5} strokeLinecap="round" />
                <path d={worried ? 'M30 -197 L12 -205' : 'M30 -200 L12 -203'} stroke="#3a2418" strokeWidth={5} strokeLinecap="round" />
                <ellipse cx={-19} cy={-186} rx={5.5} ry={7 * blink} fill="#1f1612" />
                <ellipse cx={19} cy={-186} rx={5.5} ry={7 * blink} fill="#1f1612" />
                <circle cx={-17} cy={-189} r={1.8} fill="#fff" opacity={blink} />
                <circle cx={21} cy={-189} r={1.8} fill="#fff" opacity={blink} />
                <ellipse cx={-30} cy={-168} rx={8} ry={4.5} fill="#e98a7a" opacity={0.55} />
                <ellipse cx={30} cy={-168} rx={8} ry={4.5} fill="#e98a7a" opacity={0.55} />
                <path d={worried ? 'M-12 -160 Q0 -167 12 -160' : happy ? 'M-15 -166 Q0 -150 15 -166' : 'M-12 -164 Q0 -156 12 -164'} stroke="#5a2a1e" strokeWidth={5} fill={happy ? '#7a2e22' : 'none'} strokeLinecap="round" />
              </g>
            );
          })()}
          <path d="M-52 -176 Q-56 -238 0 -240 Q56 -238 52 -176 Q44 -146 0 -138 Q-44 -146 -52 -176 Z" fill="none" stroke={hood} strokeWidth={10} />
          {e.sweat && <path d="M58 -214 q10 18 0 26 q-10 -8 0 -26 Z" fill="#7FD3FF" />}
        </svg>
        {e.hold && (
          <div style={{position: 'absolute', left: 180 + (e.flip ? -B.hx : B.hx), top: 270 + B.hy, transform: 'translate(-50%,-30%)', fontFamily: EMOJI, fontSize: e.holdSize ?? 90}}>{e.hold}</div>
        )}
        {e.holdL && (
          <div style={{position: 'absolute', left: 180 + (e.flip ? -A.hx : A.hx), top: 270 + A.hy, transform: 'translate(-50%,-30%)', fontFamily: EMOJI, fontSize: e.holdSize ?? 90}}>{e.holdL}</div>
        )}
        {e.label && <div style={{position: 'absolute', left: 180, top: -40, transform: 'translateX(-50%)', fontFamily: SANS, fontWeight: 900, fontSize: 40, color: L.white, whiteSpace: 'nowrap'}}>{e.label}</div>}
      </div>
    </Pos>
  );
};

// ───── la vendedora (personaje ilustrado, rasgos mínimos) ─────
const Seller: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.05 + i * 0.12;
  const mood = e.mood ?? 'look';
  const brow = mood === 'look' ? -10 - Math.max(0, wobble(t, at + 0.3, 6, 2, 3)) : mood === 'frown' ? 8 : -16;
  const back = mood === 'turn';
  return (
    <Pos e={{...e, at}} t={t} i={i}>
      <svg width={420} height={620} viewBox="-210 -330 420 620" style={{overflow: 'visible', transform: `scaleX(${e.flip ? -1 : 1})`}}>
        <ellipse cx={0} cy={262} rx={110} ry={16} fill="rgba(0,0,0,0.35)" />
        <path d="M-70 -110 Q0 -130 70 -110 L120 250 L-120 250 Z" fill="#141217" stroke={L.gold} strokeWidth={3} />
        {e.arms === 'cross' ? (
          <path d="M-74 -96 L-40 10 L60 -14 M74 -96 L40 10 L-60 -14" stroke="#141217" strokeWidth={30} strokeLinecap="round" fill="none" />
        ) : (
          <path d="M-74 -96 L-96 80 M74 -96 L96 80" stroke="#141217" strokeWidth={30} strokeLinecap="round" fill="none" />
        )}
        <circle cx={0} cy={-104} r={10} fill={L.gold} />
        <rect x={-18} y={-160} width={36} height={40} fill={L.skin} />
        <ellipse cx={0} cy={-205} rx={54} ry={64} fill={back ? '#3a2418' : L.skin} />
        <path d="M-58 -210 Q-60 -280 0 -282 Q60 -280 58 -210 Q40 -250 0 -250 Q-40 -250 -58 -210 Z" fill="#3a2418" />
        <circle cx={0} cy={-286} r={30} fill="#3a2418" />
        {!back && (
          <>
            <path d={`M-38 -224 L-12 ${-224 + (mood === 'frown' ? 6 : 0)}`} stroke="#3a2418" strokeWidth={7} strokeLinecap="round" />
            <path d={`M12 -224 L38 ${-224 + brow}`} stroke="#3a2418" strokeWidth={7} strokeLinecap="round" />
            <ellipse cx={-24} cy={-206} rx={6} ry={mood === 'shock' ? 8 : 3} fill="#3a2418" />
            <ellipse cx={24} cy={-206} rx={6} ry={mood === 'shock' ? 8 : 3} fill="#3a2418" />
            {mood === 'shock' ? <ellipse cx={0} cy={-168} rx={14} ry={18} fill={L.red} /> : <path d="M-16 -170 Q0 -162 16 -170 Q0 -176 -16 -170 Z" fill={L.red} />}
          </>
        )}
      </svg>
    </Pos>
  );
};

const House: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.05 + i * 0.12;
  const f = e.fade ? 1 - eio(t, at + (e.fadeAt ?? 0.6), e.fadeDur ?? 2.2) : 1;
  const sh = e.fade ? lerp(0.55, 1, f) : 1;
  const c = color(e.color) ?? L.cream;
  return (
    <Pos e={{...e, at, op: (e.op ?? 1) * clamp(f + 0.05)}} t={t} i={i} idle>
      <svg width={300} height={280} viewBox="-150 -150 300 280" style={{overflow: 'visible', transform: `scale(${sh}) translateY(${(1 - f) * -60}px)`, filter: e.glow ? `drop-shadow(0 0 30px ${L.goldL})` : 'drop-shadow(0 20px 30px rgba(0,0,0,0.4))'}}>
        <path d="M-120 -10 L0 -130 L120 -10 Z" fill={L.red} />
        <rect x={-100} y={-12} width={200} height={140} fill={c} />
        <rect x={-24} y={50} width={48} height={78} fill="#5b4636" />
        <rect x={-80} y={14} width={42} height={36} fill="#8fc6e8" />
        <rect x={38} y={14} width={42} height={36} fill="#8fc6e8" />
        {e.crack && <path d="M10 -100 L-8 -60 L14 -30 L-6 10 L18 60" stroke={L.ink} strokeWidth={5} fill="none" strokeDasharray={260} strokeDashoffset={260 * (1 - eo(t, at + 0.4, 0.6))} />}
      </svg>
    </Pos>
  );
};

const Bag: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i} idle>
    <svg width={360} height={340} viewBox="-180 -180 360 340" style={{overflow: 'visible', filter: `drop-shadow(0 0 ${e.glow === false ? 0 : 40}px rgba(245,215,120,0.55)) drop-shadow(0 30px 40px rgba(0,0,0,0.5))`}}>
      <defs>
        <linearGradient id="bagg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={L.goldL} />
          <stop offset="0.55" stopColor={L.gold} />
          <stop offset="1" stopColor={L.goldD} />
        </linearGradient>
      </defs>
      <path d="M-70 -40 Q-70 -150 0 -150 Q70 -150 70 -40" fill="none" stroke={L.goldD} strokeWidth={20} />
      <path d="M-150 -40 L150 -40 L130 150 L-130 150 Z" fill="url(#bagg)" />
      <path d="M-150 -40 L150 -40 L140 10 L-140 10 Z" fill="rgba(0,0,0,0.12)" />
      <rect x={-26} y={-8} width={52} height={36} rx={8} fill={L.goldD} />
      {e.house && <g opacity={1 - eio(t, (e.at ?? 0) + 1.0, 2)} transform="translate(0,70) scale(0.35)"><path d="M-120 -10 L0 -130 L120 -10 Z" fill={L.red} /><rect x={-100} y={-12} width={200} height={140} fill={L.cream} /></g>}
    </svg>
  </Pos>
);

const Cage: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.1;
  const mode = e.mode ?? 'drop';
  const y = mode === 'drop' ? -(1 - spr(t, at, 1.6, 0.4)) * 1100 : mode === 'open' ? -eio(t, at + 0.4, 1.8) * 900 : 0;
  const door = mode === 'open' ? eio(t, at + 0.3, 1.6) * 75 : 0;
  const bars = [];
  for (let k = -4; k <= 4; k++) bars.push(<line key={k} x1={k * 50} y1={-200} x2={k * 50} y2={240} stroke={k % 2 ? L.gold : L.goldL} strokeWidth={12} />);
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: (e.y ?? 560) + y, transform: `translate(-50%,-50%) scale(${e.s ?? 1})`}}>
      <svg width={520} height={620} viewBox="-260 -330 520 620" style={{overflow: 'visible', filter: 'drop-shadow(0 0 30px rgba(245,215,120,0.45))'}}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={L.goldD} />
            <stop offset="0.5" stopColor={L.goldL} />
            <stop offset="1" stopColor={L.goldD} />
          </linearGradient>
        </defs>
        <path d="M-210 -200 Q0 -330 210 -200" fill="none" stroke="url(#cg)" strokeWidth={16} />
        <circle cx={0} cy={-300} r={22} fill="none" stroke="url(#cg)" strokeWidth={10} />
        <g transform={mode === 'open' ? 'translate(0,0)' : ''}>{bars.slice(0, 7)}</g>
        <g style={{transformOrigin: '150px 20px', transform: `perspective(600px) rotateY(${-door}deg)`}}>{bars.slice(7)}</g>
        <rect x={-220} y={-210} width={440} height={22} rx={8} fill="url(#cg)" />
        <rect x={-230} y={232} width={460} height={28} rx={8} fill="url(#cg)" />
      </svg>
    </div>
  );
};

const Scale: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.1;
  const tilt = (e.tilt ?? 0) * spr(t, at + 0.5, 1.2, 0.35);
  const r = (tilt * Math.PI) / 180;
  const half = 330;
  const ly = -Math.sin(r) * half, ry = Math.sin(r) * half;
  const pan = (x: number, y: number, item: string, label: string) => (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-100%)', textAlign: 'center'}}>
      <div style={{fontFamily: EMOJI, fontSize: 130, lineHeight: 1, filter: 'drop-shadow(0 12px 20px rgba(0,0,0,0.5))'}}>{item}</div>
      <div style={{width: 260, height: 26, borderRadius: '0 0 130px 130px', background: L.gold, margin: '0 auto'}} />
      {label && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 44, color: e.ink ?? L.white, marginTop: 12}}>{label}</div>}
    </div>
  );
  return (
    <Pos e={{...e, at}} t={t} i={i}>
      <div style={{position: 'relative', width: 900, height: 600}}>
        <div style={{position: 'absolute', left: 440, top: 150, width: 20, height: 420, background: L.goldD, borderRadius: 10}} />
        <div style={{position: 'absolute', left: 330, top: 560, width: 240, height: 24, background: L.goldD, borderRadius: 12}} />
        <div style={{position: 'absolute', left: 450 - half, top: 150, width: half * 2, height: 16, background: L.gold, borderRadius: 8, transform: `rotate(${tilt}deg)`}} />
        {pan(450 - Math.cos(r) * half, 150 + ly + 60, e.left ?? '💧', e.ll ?? '')}
        {pan(450 + Math.cos(r) * half, 150 + ry + 60, e.right ?? '💎', e.rl ?? '')}
      </div>
    </Pos>
  );
};

const Stamp: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const c = color(e.color) ?? L.red;
  return (
    <Pos e={{...e, anim: e.anim ?? 'slam', rot: e.rot ?? -8}} t={t} i={i}>
      <div style={{border: `${(e.size ?? 130) * 0.09}px solid ${c}`, borderRadius: 24, padding: '0.1em 0.45em', fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 130, color: c, letterSpacing: 4, whiteSpace: 'nowrap', background: e.fill ?? 'rgba(0,0,0,0.25)', boxShadow: `0 0 50px ${c}55`}}>{e.text}</div>
    </Pos>
  );
};

const Notifs: React.FC<{e: El; t: number}> = ({e, t}) => {
  const n = e.n ?? 40;
  const texts: string[] = e.texts ?? ['¡Oferta solo hoy!', 'Te lo mereces ✨', 'Últimas piezas', '-40% en lujo', 'Date un gusto', 'Compra ahora, paga después', 'Nuevo drop premium', 'Vive hoy'];
  const out = [];
  for (let k = 0; k < n; k++) {
    const at = (e.at ?? 0) + Math.pow(k / n, 0.7) * (e.dur ?? 2.6);
    const q = spr(t, at, 3, 0.5);
    if (t < at) continue;
    out.push(
      <div key={k} style={{position: 'absolute', left: 120 + hash(k) * 1500, top: 60 + hash(k + 40) * 880, transform: `scale(${q}) rotate(${(hash(k + 9) - 0.5) * 10}deg)`, width: 440, padding: '18px 24px', borderRadius: 22, background: 'rgba(250,248,252,0.96)', boxShadow: '0 18px 40px rgba(0,0,0,0.45)', display: 'flex', gap: 16, alignItems: 'center'}}>
        <div style={{width: 54, height: 54, borderRadius: 14, background: [L.red, L.gold, L.pink, L.green][k % 4], fontFamily: EMOJI, fontSize: 32, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{['🛍️', '✨', '🔥', '💳'][k % 4]}</div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: L.ink}}>{texts[k % texts.length]}</div>
      </div>,
    );
  }
  return <>{out}</>;
};

const Checklist: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const items: string[] = e.items ?? [];
  const at = e.at ?? 0.1;
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540, transform: 'translate(-50%,-50%)'}}>
      {items.map((it, k) => {
        const done = k < (e.pre ?? 0) ? 1 : eio(t, at + 0.4 + (k - (e.pre ?? 0)) * (e.gap ?? 0.9), 0.35);
        const q = eo(t, at + k * 0.12, 0.4);
        return (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 34, margin: '26px 0', opacity: q, transform: `translateX(${(1 - q) * -80}px)`}}>
            <div style={{width: 84, height: 84, borderRadius: 18, border: `7px solid ${L.gold}`, position: 'relative', flex: 'none'}}>
              <div style={{position: 'absolute', left: -2, top: -10}}>
                <MarkSvg kind="check" p={done} size={88} c={L.greenL} />
              </div>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 62, color: done > 0.5 ? L.white : 'rgba(255,255,255,0.75)'}}>{it}</div>
          </div>
        );
      })}
    </div>
  );
};

const fmt = (v: number, dec = 0, sep = true) => (sep ? v.toLocaleString('en-US', {minimumFractionDigits: dec, maximumFractionDigits: dec}) : v.toFixed(dec));
const Count: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.1;
  const p = eio(t, at, e.dur ?? 1.6);
  const v = lerp(e.from ?? 0, e.to ?? 100, p);
  return (
    <Pos e={{...e, at, anim: e.anim ?? 'fade'}} t={t} i={i}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 260, color: color(e.color) ?? L.gold, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap', textShadow: '0 10px 40px rgba(0,0,0,0.5)'}}>
        {e.prefix ?? ''}
        {fmt(v, e.dec ?? 0, e.sep !== false)}
        {e.suffix ?? ''}
      </div>
    </Pos>
  );
};

const Bars: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const items: {label: string; from?: number; to: number; color?: string}[] = e.items ?? [];
  const at = e.at ?? 0.15;
  const H = e.h ?? 520;
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 560, transform: 'translate(-50%,-50%)', display: 'flex', gap: 120, alignItems: 'flex-end', height: H + 90}}>
      {items.map((b, k) => {
        const v = lerp(b.from ?? 0, b.to, eio(t, at + k * 0.2, e.dur ?? 1.4));
        return (
          <div key={k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20}}>
            <div style={{width: e.bw ?? 170, height: H * v, background: color(b.color) ?? L.gold, borderRadius: '18px 18px 0 0', boxShadow: `0 0 40px ${color(b.color) ?? L.gold}55`}} />
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 46, color: e.ink ?? L.white}}>{b.label}</div>
          </div>
        );
      })}
    </div>
  );
};

// Gráfica de precios: series que suben o bajan desde 0 %
const Chart: React.FC<{e: El; t: number}> = ({e, t}) => {
  const W = 1320, H = 640, x0 = 230, y0 = 860;
  const series: {label: string; ch?: string; to: number; color?: string; at?: number}[] = e.series ?? [];
  const ymap = (v: number) => y0 - 320 - (v / 150) * 300;
  const axisP = eo(t, 0, 0.6);
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <line x1={x0} y1={ymap(0)} x2={x0 + W * axisP} y2={ymap(0)} stroke="rgba(255,255,255,0.5)" strokeWidth={4} strokeDasharray="14 10" />
      <text x={x0 - 30} y={ymap(0) + 14} fill="rgba(255,255,255,0.7)" fontFamily={SANS} fontWeight={800} fontSize={36} textAnchor="end">0%</text>
      {e.marker && (
        <>
          <line x1={x0} y1={ymap(100)} x2={x0 + W} y2={ymap(100)} stroke={L.red} strokeWidth={4} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 6)) * pr(t, e.marker, 0.2)} />
          <text x={x0 - 30} y={ymap(100) + 14} fill={L.red} fontFamily={SANS} fontWeight={900} fontSize={40} textAnchor="end">+100%</text>
        </>
      )}
      <text x={x0} y={y0 + 70} fill="rgba(255,255,255,0.6)" fontFamily={SANS} fontWeight={800} fontSize={34}>2000</text>
      <text x={x0 + W} y={y0 + 70} fill="rgba(255,255,255,0.6)" fontFamily={SANS} fontWeight={800} fontSize={34} textAnchor="end">HOY</text>
      {series.map((s, k) => {
        const p = s.at != null && s.at < 0 ? 1 : eio(t, s.at ?? 0.3 + k * 0.25, e.dur ?? 1.6);
        const pts = [];
        for (let j = 0; j <= 40; j++) {
          const u = (j / 40) * p;
          const v = s.to * (Math.pow(u, s.to > 0 ? 1.4 : 0.6)) + Math.sin(u * 20 + k) * 3 * u;
          pts.push(`${x0 + W * u},${ymap(v)}`);
        }
        const last = pts[pts.length - 1].split(',').map(Number);
        const c = color(s.color) ?? (s.to > 0 ? L.red : L.green);
        return (
          <g key={k}>
            <polyline points={pts.join(' ')} fill="none" stroke={c} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={last[0]} cy={last[1]} r={14} fill={c} />
            <text x={last[0] + 26} y={last[1] + 22} fontFamily={EMOJI} fontSize={66}>{s.ch ?? ''}</text>
            {s.label && <text x={last[0] + (s.ch ? 106 : 26)} y={last[1] + 14} fill={c} fontFamily={SANS} fontWeight={900} fontSize={40}>{s.label}</text>}
          </g>
        );
      })}
    </svg>
  );
};

const Live: React.FC<{e: El; t: number}> = ({e, t}) => {
  const z = 1 + t * 0.012;
  if (e.src) {
    const isImg = /\.(jpe?g|png|webp)$/i.test(e.src);
    // Ken Burns: zoom lento + paneo suave en la dirección que indique la escena
    const kz = 1.04 + t * 0.022;
    const pan = (e.pan ?? 1) * t * 6;
    const st: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kz}) translateX(${pan}px)`};
    const media = (style: React.CSSProperties) => (isImg ? <Img src={staticFile(e.src)} style={style} /> : <OffthreadVideo src={staticFile(e.src)} muted style={style} />);
    return (
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: '#000'}}>
        {e.fit === 'blurfill' ? (
          <>
            {media({...st, filter: 'blur(28px) brightness(0.55)', transform: `scale(1.25)`})}
            {media({position: 'absolute', left: 0, width: '100%', top: '50%', height: 'auto', transform: `translateY(-50%) scale(${1 + t * 0.03})`, boxShadow: '0 30px 80px rgba(0,0,0,0.6)'})}
          </>
        ) : (
          media(st)
        )}
        {e.sepia && <div style={{position: 'absolute', inset: 0, background: 'rgba(90,60,20,0.18)', mixBlendMode: 'multiply'}} />}
        <div style={{position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 30%, transparent 55%, rgba(0,0,0,0.7) 100%)'}} />
      </div>
    );
  }
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: -60, transform: `scale(${z}) translateX(${Math.sin(t * 0.4) * 20}px)`, background: e.tint ?? 'radial-gradient(circle at 30% 40%, #3a3340, #141218 70%)'}} />
      {e.ch && <div style={{position: 'absolute', left: '50%', top: '46%', transform: `translate(-50%,-50%) scale(${1 + t * 0.02})`, fontFamily: EMOJI, fontSize: 260, opacity: 0.85, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))'}}>{e.ch}</div>}
      <div style={{position: 'absolute', left: 60, top: 60, right: 60, bottom: 60, border: `4px dashed ${L.gold}`, borderRadius: 24, opacity: 0.85}} />
      <div style={{position: 'absolute', left: 100, top: 96, padding: '10px 22px', background: L.red, color: L.white, fontFamily: SANS, fontWeight: 900, fontSize: 30, borderRadius: 10, letterSpacing: 2}}>🎬 CLIP DE STOCK PENDIENTE</div>
      <div style={{position: 'absolute', left: 100, bottom: 96, maxWidth: 1500, fontFamily: 'DejaVu Sans Mono, monospace', fontSize: 30, color: L.goldL}}>{e.kw}</div>
    </div>
  );
};

const Timeline: React.FC<{e: El; t: number}> = ({e, t}) => {
  const a = e.from ?? 1957, b = e.to ?? 2001;
  const p = eio(t, e.at ?? 0.2, e.dur ?? 1.2);
  const x1 = 260, x2 = 1660, y = e.y ?? 640;
  const yr = Math.round(lerp(a, b, p));
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: x1, top: y, width: x2 - x1, height: 8, background: 'rgba(255,255,255,0.25)', borderRadius: 4}} />
      <div style={{position: 'absolute', left: x1, top: y, width: (x2 - x1) * p, height: 8, background: L.gold, borderRadius: 4}} />
      {[a, b].map((v, k) => (
        <div key={k} style={{position: 'absolute', left: k ? x2 : x1, top: y + 40, transform: 'translateX(-50%)', fontFamily: SANS, fontWeight: 900, fontSize: 52, color: 'rgba(255,255,255,0.7)'}}>{v}</div>
      ))}
      <div style={{position: 'absolute', left: lerp(x1, x2, p), top: y - 10, width: 28, height: 28, marginLeft: -14, borderRadius: '50%', background: L.goldL, boxShadow: `0 0 30px ${L.goldL}`}} />
      <div style={{position: 'absolute', left: lerp(x1, x2, p), top: y - 150, transform: 'translateX(-50%)', fontFamily: SANS, fontWeight: 900, fontSize: 110, color: L.gold, fontVariantNumeric: 'tabular-nums'}}>{yr}</div>
    </div>
  );
};

export const Puzzle: React.FC<{x: number; y: number; size: number; active?: number; done?: number; red?: number; labels?: string[]; icons?: string[]; t: number; at?: number; light?: number[]}> = ({x, y, size, active = 0, done = 0, red = 0, labels, icons, t, at = 0, light}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', display: 'flex', gap: size * 0.22}}>
    {[1, 2, 3, 4].map((k) => {
      const lit = light ? eo(t, light[k - 1] ?? 99, 0.3) : k <= done ? 1 : 0;
      const isAct = k === active;
      const isRed = k === red;
      const q = spr(t, at + k * 0.12, 2.4, 0.5);
      const bg = isRed ? (Math.sin(t * 8) > 0 ? L.red : '#6b1517') : isAct ? L.gold : lit > 0 ? `rgba(201,162,39,${0.35 + 0.4 * lit})` : 'rgba(255,255,255,0.06)';
      return (
        <div key={k} style={{textAlign: 'center', transform: `scale(${q})`}}>
          <div style={{width: size, height: size, borderRadius: size * 0.18, border: `${Math.max(3, size * 0.07)}px solid ${isRed ? L.red : L.gold}`, background: bg, boxShadow: isAct ? `0 0 ${size * 0.6}px ${L.goldL}` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: size * 0.5, color: isAct || lit > 0.5 ? L.ink : L.gold}}>
            {icons ? <span style={{fontFamily: EMOJI, fontSize: size * 0.5}}>{icons[k - 1]}</span> : k}
          </div>
          {labels && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: size * 0.22, color: L.white, marginTop: size * 0.12, opacity: lit || isAct ? 1 : 0.5}}>{labels[k - 1]}</div>}
        </div>
      );
    })}
  </div>
);

const PuzzleEl: React.FC<{e: El; t: number}> = ({e, t}) => <div style={{opacity: e.out != null ? 1 - eo(t, e.out, 0.3) : 1}}><Puzzle x={e.x ?? 960} y={e.y ?? 540} size={e.size ?? 200} active={e.active} done={e.done} red={e.red} labels={e.labels} icons={e.icons} t={t} at={e.at ?? 0} light={e.light} /></div>;

const Phone: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i} idle>
    <div style={{width: 380, height: 760, borderRadius: 60, background: '#0b0b0e', padding: 18, boxShadow: '0 40px 80px rgba(0,0,0,0.6)', border: '3px solid #333'}}>
      <div style={{width: '100%', height: '100%', borderRadius: 44, background: e.screen ?? 'linear-gradient(180deg,#232036,#14121c)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20, position: 'relative', overflow: 'hidden'}}>
        {e.big && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: e.bigSize ?? 110, color: color(e.color) ?? L.white, textAlign: 'center'}}>{e.big}</div>}
        {e.sub && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 36, color: 'rgba(255,255,255,0.7)', textAlign: 'center', padding: '0 20px'}}>{e.sub}</div>}
        {e.notif && (
          <div style={{position: 'absolute', top: 70, left: 20, right: 20, padding: 18, borderRadius: 20, background: `rgba(255,255,255,${e.faint ? 0.12 : 0.92})`, color: e.faint ? 'rgba(255,255,255,0.55)' : L.ink, fontFamily: SANS, fontWeight: 800, fontSize: 28, transform: `translateY(${(1 - eo(t, (e.at ?? 0) + 0.5, 0.5)) * -160}px)`}}>{e.notif}</div>
        )}
      </div>
    </div>
  </Pos>
);

const Frame: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const kind = e.kind ?? 'paper';
  const w = e.w ?? 720, h = e.h ?? 520;
  const styles: Record<string, React.CSSProperties> = {
    paper: {background: '#f5f0e6', color: L.ink, borderRadius: 8},
    polaroid: {background: '#fff', color: L.ink, padding: '24px 24px 90px', borderRadius: 6},
    post: {background: '#fff', color: L.ink, borderRadius: 26},
    tv: {background: '#2a2a2a', color: L.white, borderRadius: 50, border: '24px solid #3b3b3b'},
    sign: {background: L.green, color: L.white, borderRadius: 16, border: '6px solid #fff'},
    mag: {background: `linear-gradient(160deg, ${L.red}, #7a1416)`, color: L.white, borderRadius: 6},
    glass: {background: 'rgba(160,200,230,0.12)', color: L.white, borderRadius: 10, border: '6px solid rgba(255,255,255,0.4)'},
    ticket: {background: '#fbfbf7', color: L.ink, borderRadius: 4},
    dark: {background: 'rgba(20,18,26,0.92)', color: L.white, borderRadius: 30, border: `4px solid ${L.gold}`},
  };
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{width: w, minHeight: h, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18, position: 'relative', ...styles[kind]}}>
        {kind === 'paper' && !e.nolines && [0, 1, 2, 3, 4, 5].map((k) => <div key={k} style={{position: 'absolute', left: 60, right: 60 + hash(k) * 160, top: 150 + k * 50, height: 14, borderRadius: 7, background: 'rgba(0,0,0,0.12)'}} />)}
        {e.ch && <div style={{fontFamily: EMOJI, fontSize: e.chSize ?? h * 0.4, lineHeight: 1, opacity: e.chOp ?? 1}}>{e.ch}</div>}
        {e.text && <div style={{fontFamily: e.font === 'serif' ? SERIF : SANS, fontWeight: 900, fontSize: e.size ?? 64, textAlign: 'center', padding: '0 30px', lineHeight: 1.1, position: 'relative'}}>{e.text}</div>}
        {e.sub && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: e.subSize ?? 34, textAlign: 'center', opacity: 0.75, padding: '0 30px'}}>{e.sub}</div>}
        {e.crack && (
          <svg style={{position: 'absolute', inset: 0, overflow: 'visible'}} width={w} height={h}>
            <path d={`M${w * 0.62} 0 L${w * 0.5} ${h * 0.22} L${w * 0.66} ${h * 0.38} L${w * 0.44} ${h * 0.6} L${w * 0.58} ${h * 0.8} L${w * 0.5} ${h}`} stroke="rgba(255,255,255,0.9)" strokeWidth={5} fill="none" strokeDasharray={2000} strokeDashoffset={2000 * (1 - eo(t, 0.2, 0.5))} />
            <path d={`M${w * 0.5} ${h * 0.22} L${w * 0.2} ${h * 0.3} M${w * 0.44} ${h * 0.6} L${w * 0.8} ${h * 0.66}`} stroke="rgba(255,255,255,0.7)" strokeWidth={3} fill="none" strokeDasharray={1000} strokeDashoffset={1000 * (1 - eo(t, 0.4, 0.4))} />
          </svg>
        )}
        {e.stamp && (
          <div style={{position: 'absolute', right: 30, top: 30, transform: `rotate(-10deg) scale(${lerp(2, 1, eo(t, (e.at ?? 0) + 0.5, 0.2))})`, opacity: pr(t, (e.at ?? 0) + 0.5, 0.05), border: `6px solid ${L.red}`, color: L.red, fontFamily: SANS, fontWeight: 900, fontSize: 56, padding: '4px 18px', borderRadius: 12}}>{e.stamp}</div>
        )}
      </div>
    </Pos>
  );
};

const Neon: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.1;
  const c = color(e.color) ?? L.pink;
  const fl = t < at ? 0 : t < at + 0.5 ? (Math.sin(t * 60) > 0.2 ? 1 : 0.2) : 0.92 + 0.08 * Math.sin(t * 13);
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540, transform: 'translate(-50%,-50%)', fontFamily: e.font === 'serif' ? SERIF : SANS, fontWeight: 900, fontStyle: e.font === 'serif' ? 'italic' : 'normal', fontSize: e.size ?? 140, color: '#fff', opacity: fl, whiteSpace: 'nowrap', textShadow: `0 0 10px ${c}, 0 0 30px ${c}, 0 0 70px ${c}, 0 0 120px ${c}`}}>{e.text}</div>
  );
};

const Rain: React.FC<{e: El; t: number}> = ({e, t}) => {
  const n = e.n ?? 26;
  const out = [];
  for (let k = 0; k < n; k++) {
    const sp = (e.speed ?? 380) * (0.7 + hash(k) * 0.6);
    const y = ((t * sp + hash(k + 3) * 1300) % 1300) - 120;
    out.push(<div key={k} style={{position: 'absolute', left: hash(k + 7) * 1920, top: e.up ? 1080 - y : y, fontFamily: EMOJI, fontSize: (e.size ?? 60) * (0.6 + hash(k + 1) * 0.8), opacity: e.op ?? 0.9, transform: `rotate(${t * 40 * (hash(k) - 0.5)}deg)`}}>{e.ch ?? '❄️'}</div>);
  }
  return <>{out}</>;
};

const Light: React.FC<{e: El; t: number}> = ({e, t}) => (
  <div style={{position: 'absolute', left: (e.x ?? 960) - 500, top: -100, width: 1000, height: 1300, background: `radial-gradient(ellipse at 50% 100%, ${e.c ?? 'rgba(255,230,160,0.35)'}, transparent 60%)`, opacity: eo(t, e.at ?? 0, 0.5), clipPath: 'polygon(42% 0, 58% 0, 100% 100%, 0 100%)'}} />
);

const Scan: React.FC<{e: El; t: number}> = ({e, t}) => {
  const p = eio(t, e.at ?? 0.1, e.dur ?? 1.4);
  const y = lerp(e.y1 ?? 900, e.y2 ?? 200, p);
  return <div style={{position: 'absolute', left: (e.x ?? 960) - 260, top: y, width: 520, height: 6, background: L.red, boxShadow: `0 0 30px ${L.red}, 0 0 60px ${L.red}`, opacity: p < 1 ? 1 : 0}} />;
};

const Shards: React.FC<{e: El; t: number}> = ({e, t}) => {
  const at = e.at ?? 0.1;
  const x = t - at;
  if (x < 0) return null;
  const out = [];
  for (let k = 0; k < 26; k++) {
    const a = hash(k) * Math.PI * 2;
    const v = 500 + hash(k + 5) * 900;
    out.push(<div key={k} style={{position: 'absolute', left: (e.x ?? 960) + Math.cos(a) * v * x, top: (e.y ?? 540) + Math.sin(a) * v * x + 600 * x * x, width: 40 + hash(k + 2) * 80, height: 30 + hash(k + 8) * 60, background: 'rgba(220,235,255,0.55)', border: '2px solid rgba(255,255,255,0.8)', clipPath: 'polygon(0 0, 100% 30%, 60% 100%)', transform: `rotate(${x * 400 * (hash(k) - 0.5)}deg)`, opacity: clamp(1 - x / 1.4)}} />);
  }
  return <>{out}</>;
};

const Balloon: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0;
  const rise = e.release != null ? Math.pow(Math.max(0, t - e.release), 2) * 260 : 0;
  const x = (e.x ?? 960) + Math.sin(t * 1.5 + i) * 14;
  const y = (e.y ?? 400) - rise;
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: eo(t, at, 0.4)}}>
      <svg width={10} height={10} style={{position: 'absolute', left: 0, top: 60, overflow: 'visible'}}>
        <path d={`M0 0 Q20 ${120} ${(e.hx ?? 960) - (e.x ?? 960)} ${(e.hy ?? 900) - (e.y ?? 400) - 60 + rise}`} stroke="rgba(255,255,255,0.6)" strokeWidth={3} fill="none" />
      </svg>
      <div style={{width: 150, height: 170, borderRadius: '50% 50% 48% 48%', background: color(e.color) ?? L.red, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EMOJI, fontSize: 80, boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.25)'}}>{e.ch}</div>
    </div>
  );
};

// ───────────── elementos propios de «El personaje que fabricas por miedo» ─────────────
// Cara del personaje "Tú" (misma que en Person) dibujada en coordenadas locales.
const Face: React.FC<{mood?: string; t: number; seed?: number; closed?: boolean}> = ({mood, t, seed = 0, closed}) => {
  const worried = mood === 'worried';
  const happy = mood === 'happy';
  const blink = closed ? 0.12 : Math.sin(t * 2.3 + seed * 1.7) > 0.985 ? 0.15 : 1;
  return (
    <g>
      <path d={worried ? 'M-30 -17 L-12 -25' : 'M-30 -20 L-12 -23'} stroke="#3a2418" strokeWidth={5} strokeLinecap="round" />
      <path d={worried ? 'M30 -17 L12 -25' : 'M30 -20 L12 -23'} stroke="#3a2418" strokeWidth={5} strokeLinecap="round" />
      {closed ? (
        <>
          <path d="M-25 -6 Q-19 0 -13 -6" stroke="#1f1612" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M13 -6 Q19 0 25 -6" stroke="#1f1612" strokeWidth={4} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <ellipse cx={-19} cy={-6} rx={5.5} ry={(worried ? 8 : 7) * blink} fill="#1f1612" />
          <ellipse cx={19} cy={-6} rx={5.5} ry={(worried ? 8 : 7) * blink} fill="#1f1612" />
          <circle cx={-17} cy={-9} r={1.8} fill="#fff" opacity={blink} />
          <circle cx={21} cy={-9} r={1.8} fill="#fff" opacity={blink} />
        </>
      )}
      <ellipse cx={-30} cy={12} rx={8} ry={4.5} fill="#e98a7a" opacity={0.55} />
      <ellipse cx={30} cy={12} rx={8} ry={4.5} fill="#e98a7a" opacity={0.55} />
      <path d={worried ? 'M-12 20 Q0 13 12 20' : happy ? 'M-15 14 Q0 30 15 14' : 'M-12 16 Q0 24 12 16'} stroke="#5a2a1e" strokeWidth={5} fill={happy ? '#7a2e22' : 'none'} strokeLinecap="round" />
    </g>
  );
};

// Reloj digital rojo de las 2:00
const Clock: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const on = eo(t, (e.at ?? 0) + 0.1, 0.15);
  const flick = t < (e.at ?? 0) + 0.5 ? (Math.sin(t * 70) > 0 ? 1 : 0.35) : 1;
  const blinkColon = Math.floor(t * 1.2) % 2 === 0 ? 1 : 0.25;
  const [hh, mm] = String(e.time ?? '2:00').split(':');
  return (
    <Pos e={{...e, anim: e.anim ?? 'fade'}} t={t} i={i}>
      <div style={{width: 640, height: 300, borderRadius: 50, background: 'linear-gradient(180deg,#1b1d27,#0b0c12)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 2px 0 rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid #2a2d3a'}}>
        <div style={{fontFamily: '"DejaVu Sans Mono", monospace', fontWeight: 700, fontSize: 210, color: '#ff3b3b', opacity: on * flick, textShadow: '0 0 18px #ff2a2a, 0 0 60px #ff0000', letterSpacing: 6, display: 'flex'}}>
          <span>{hh}</span>
          <span style={{opacity: blinkColon}}>:</span>
          <span>{mm}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: '50%', top: '50%', width: 1400, height: 1000, transform: 'translate(-50%,-50%)', background: 'radial-gradient(ellipse at 50% 50%, rgba(255,40,40,0.18), transparent 60%)', opacity: on, pointerEvents: 'none', zIndex: -1}} />
    </Pos>
  );
};

// Máscara de cartón con sonrisa forzada
const Mask: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const tremble = e.tremble ? Math.sin(t * 40) * 3 : 0;
  const tilt = e.tilt ? wobble(t, e.tiltAt ?? 0.4, 18, 1.2, 1.5) + (e.tiltTo ?? 0) * eo(t, e.tiltAt ?? 0.4, 0.6) : 0;
  return (
    <Pos e={e} t={t} i={i} idle={e.idle}>
      <svg width={300} height={340} viewBox="-150 -170 300 340" style={{overflow: 'visible', transform: `rotate(${tilt + tremble}deg)`}}>
        <path d="M-120 -40 Q-124 -150 0 -158 Q124 -150 120 -40 Q118 90 0 150 Q-118 90 -120 -40 Z" fill="#C9A47A" stroke="#8B6B45" strokeWidth={6} />
        <path d="M-120 -40 Q-124 -150 0 -158 Q124 -150 120 -40" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={10} />
        {[[-70, -60], [40, 70], [-30, 100]].map(([x, y], k) => <path key={k} d={`M${x} ${y} l18 -6`} stroke="rgba(110,80,45,0.5)" strokeWidth={4} />)}
        {e.sleep ? (
          <>
            <path d="M-62 -30 Q-44 -16 -26 -30" stroke="#3a2a18" strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M26 -30 Q44 -16 62 -30" stroke="#3a2a18" strokeWidth={7} fill="none" strokeLinecap="round" />
            <path d="M-50 -170 L60 -230 L80 -150 Z" fill="#7FD8C9" />
            <circle cx={60} cy={-232} r={16} fill="#fff" />
          </>
        ) : (
          <>
            <ellipse cx={-44} cy={-34} rx={22} ry={16} fill="#2b2016" />
            <ellipse cx={44} cy={-34} rx={22} ry={16} fill="#2b2016" />
          </>
        )}
        <path d="M-78 34 Q0 120 78 34 Q0 76 -78 34 Z" fill={e.sleep ? 'none' : '#FF6B6B'} stroke="#8B3A30" strokeWidth={6} strokeLinejoin="round" />
        {!e.sleep && <path d="M-60 44 L60 44" stroke="#fff" strokeWidth={8} opacity={0.85} />}
        <circle cx={-128} cy={-30} r={7} fill="#6b5236" />
        <circle cx={128} cy={-30} r={7} fill="#6b5236" />
        {e.string && <path d="M-128 -30 Q0 40 128 -30" stroke="#d8d0c0" strokeWidth={3} fill="none" opacity={0.7} />}
      </svg>
    </Pos>
  );
};

// Reflector: cono de luz desde arriba sobre x; se apaga en e.off
const Spot: React.FC<{e: El; t: number}> = ({e, t}) => {
  const on = eo(t, e.at ?? 0, 0.25) * (e.off != null ? (t < e.off ? 1 : t < e.off + 0.12 ? 0.4 : 0) : 1);
  const x = (e.x ?? 960) + (e.follow ? Math.sin(t * 0.9) * e.follow : 0);
  const w = e.w ?? 640;
  const c = e.c ?? 'rgba(255,245,215,0.55)';
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: on}}>
      {e.dim !== false && <div style={{position: 'absolute', inset: 0, background: `radial-gradient(ellipse ${w * 0.62}px 160px at ${x}px ${e.y ?? 900}px, transparent 0%, rgba(4,6,16,${e.dim ?? 0.55}) 100%)`}} />}
      <div style={{position: 'absolute', left: x - w / 2, top: e.top ?? -40, width: w, height: (e.y ?? 900) - (e.top ?? -40) + 60, background: `linear-gradient(180deg, ${c}, rgba(255,245,215,0.08))`, clipPath: 'polygon(44% 0, 56% 0, 100% 100%, 0 100%)', filter: 'blur(3px)'}} />
      <div style={{position: 'absolute', left: x - w * 0.55, top: (e.y ?? 900) - 50, width: w * 1.1, height: 110, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,245,215,0.5), transparent 70%)'}} />
      {e.lamp !== false && <div style={{position: 'absolute', left: x - 50, top: (e.top ?? -40) - 10, width: 100, height: 70, borderRadius: '0 0 30px 30px', background: '#2a2d3a', boxShadow: `0 20px 50px ${c}`}} />}
    </div>
  );
};

// Oso blanco ilustrado
const Bear: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const wave = e.wave ? Math.sin(t * 8) * 20 : 0;
  const wink = e.wink && t > (e.winkAt ?? 0.5) && t < (e.winkAt ?? 0.5) + 0.5;
  return (
    <Pos e={e} t={t} i={i} idle={e.idle !== false}>
      <svg width={660} height={660} viewBox="-230 -230 460 460" style={{overflow: 'visible', transform: `scaleX(${e.flip ? -1 : 1})`}}>
        {!e.peek && <ellipse cx={0} cy={120} rx={170} ry={120} fill="#F4F7FA" stroke="#B9CBDA" strokeWidth={6} />}
        {e.wave && !e.peek && <path d={`M120 60 Q${190 + wave} ${-20} ${170 + wave} ${-70}`} stroke="#F4F7FA" strokeWidth={56} strokeLinecap="round" fill="none" />}
        <circle cx={-92} cy={-108} r={42} fill="#F4F7FA" stroke="#B9CBDA" strokeWidth={6} />
        <circle cx={92} cy={-108} r={42} fill="#F4F7FA" stroke="#B9CBDA" strokeWidth={6} />
        <circle cx={-92} cy={-108} r={20} fill="#E3B8C1" />
        <circle cx={92} cy={-108} r={20} fill="#E3B8C1" />
        <ellipse cx={0} cy={-20} rx={140} ry={124} fill="#F4F7FA" stroke="#B9CBDA" strokeWidth={6} />
        {wink ? <path d="M-62 -40 Q-46 -30 -30 -40" stroke="#1d2433" strokeWidth={7} fill="none" strokeLinecap="round" /> : <circle cx={-46} cy={-40} r={13} fill="#1d2433" />}
        <circle cx={46} cy={-40} r={13} fill="#1d2433" />
        <circle cx={-42} cy={-44} r={4} fill="#fff" />
        <circle cx={50} cy={-44} r={4} fill="#fff" />
        <ellipse cx={0} cy={20} rx={56} ry={40} fill="#E8EEF3" />
        <ellipse cx={0} cy={4} rx={20} ry={13} fill="#1d2433" />
        <path d="M-16 30 Q0 44 16 30" stroke="#1d2433" strokeWidth={5} fill="none" strokeLinecap="round" />
        <ellipse cx={-80} cy={12} rx={16} ry={9} fill="#F2B8C6" opacity={0.7} />
        <ellipse cx={80} cy={12} rx={16} ry={9} fill="#F2B8C6" opacity={0.7} />
      </svg>
    </Pos>
  );
};

// Isla en el mar con muros que suben (e.walls) y se agrietan (e.crack)
const Island: React.FC<{e: El; t: number}> = ({e, t}) => {
  const wh = e.walls != null ? eio(t, e.walls, e.wallDur ?? 1.4) : e.wallsUp ? 1 : 0;
  const cr = e.crack != null ? eo(t, e.crack, 0.5) : 0;
  const x = e.x ?? 960, y = e.y ?? 700;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: y - 40, bottom: 0, background: 'linear-gradient(180deg,#1d2d55,#0a1126)'}} />
      {[0, 1, 2, 3].map((k) => (
        <div key={k} style={{position: 'absolute', left: ((k * 530 + t * 40) % 2200) - 200, top: y + 30 + k * 70, width: 300, height: 6, borderRadius: 3, background: 'rgba(127,216,201,0.25)'}} />
      ))}
      <div style={{position: 'absolute', left: x - 300, top: y - 70, width: 600, height: 140, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 30%, #e7cf98, #b48f52 70%)', boxShadow: '0 0 0 18px rgba(127,216,201,0.15)'}} />
      {wh > 0 && (
        <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
          {[-1, 1].map((side) => (
            <g key={side}>
              {Array.from({length: 6}).map((_, row) =>
                Array.from({length: 3}).map((__, col) => {
                  const bx = x + side * (200 + col * 0) - 40 + (side > 0 ? 0 : 0);
                  const by = y - 20 - row * 62 * wh;
                  const show = row / 6 < wh;
                  if (!show) return null;
                  return <rect key={`${row}-${col}`} x={bx + (col - 1) * 0 + (row % 2) * 10 - (side < 0 ? 40 : -40) + (col - 1) * 0} y={by - 58} width={80} height={56} rx={6} fill="#8a5a44" stroke="#5c3a2b" strokeWidth={4} />;
                }),
              )}
            </g>
          ))}
          <rect x={x - 240} y={y - 20 - 6 * 62 * wh} width={480} height={30} rx={8} fill="#8a5a44" stroke="#5c3a2b" strokeWidth={4} opacity={wh > 0.95 ? 1 : 0} />
          {cr > 0 && <path d={`M${x - 200} ${y - 340} L${x - 220} ${y - 250} L${x - 190} ${y - 170} L${x - 230} ${y - 80}`} stroke="#FFD08A" strokeWidth={8} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - cr)} style={{filter: 'drop-shadow(0 0 12px #F2A541)'}} />}
          {cr > 0 && <path d={`M${x + 200} ${y - 360} L${x + 230} ${y - 260} L${x + 195} ${y - 190} L${x + 225} ${y - 90}`} stroke="#FFD08A" strokeWidth={8} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - cr)} style={{filter: 'drop-shadow(0 0 12px #F2A541)'}} />}
        </svg>
      )}
    </div>
  );
};

// Medidor vertical de corazones
const Meter: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const at = e.at ?? 0.2;
  const v = lerp(e.from ?? 0, e.value ?? 0.5, eio(t, at, e.dur ?? 1.2));
  const c = color(e.color) ?? L.greenL;
  const H = e.h ?? 520;
  return (
    <Pos e={{...e, anim: e.anim ?? 'up'}} t={t} i={i}>
      <div style={{position: 'relative', width: 200, height: H, borderRadius: 100, border: '8px solid rgba(255,255,255,0.85)', background: 'rgba(255,255,255,0.06)', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${clamp(v) * 100}%`, background: `linear-gradient(180deg, ${c}, ${c}aa)`, boxShadow: `0 0 50px ${c}`}} />
        {Array.from({length: 5}).map((_, k) => (
          <div key={k} style={{position: 'absolute', left: 50 + (k % 2) * 40, bottom: `${(k / 5) * clamp(v) * 100 + 4}%`, fontFamily: EMOJI, fontSize: 46, opacity: v > 0.05 ? 0.9 : 0}}>{e.icon ?? '❤️'}</div>
        ))}
      </div>
      {e.label && <div style={{position: 'absolute', left: '50%', top: H + 30, transform: 'translateX(-50%)', fontFamily: SANS, fontWeight: 900, fontSize: e.labelSize ?? 44, color: c, whiteSpace: 'nowrap', textAlign: 'center'}}>{e.label}</div>}
      {e.over && v > 0.98 && Array.from({length: 6}).map((_, k) => <div key={k} style={{position: 'absolute', left: 100 + Math.cos(k) * 90 * (t - at), top: -40 - (t - at - 1) * 120 * hash(k + 2), fontFamily: EMOJI, fontSize: 50, opacity: clamp(1 - (t - at - 1.2) / 1.5)}}>{e.icon ?? '❤️'}</div>)}
    </Pos>
  );
};

// Globo de pensamiento: texto, garabatos o flechas en bucle; con e.release se va flotando
const Thought: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const w = e.w ?? 620, h = e.h ?? 300;
  const rise = e.release != null ? Math.pow(Math.max(0, t - e.release), 1.6) * 220 : 0;
  const drift = e.release != null ? Math.max(0, t - e.release) * 120 : 0;
  return (
    <div style={{position: 'absolute', left: (e.x ?? 960) + drift, top: (e.y ?? 300) - rise, transform: `translate(-50%,-50%) scale(${spr(t, e.at ?? 0.1, 2.2, 0.5) * (e.s ?? 1)})`, opacity: e.release != null ? clamp(1 - (t - e.release - 1.2) / 1.2) : 1, filter: e.blur ? `blur(${e.blur * eo(t, e.blurAt ?? 0.5, 0.6)}px)` : undefined}}>
      {[0, 1, 2].map((k) => <div key={k} style={{position: 'absolute', left: (e.tailX ?? -w * 0.32) + k * -26, top: h * 0.55 + k * 44, width: 46 - k * 12, height: 46 - k * 12, borderRadius: '50%', background: '#fff'}} />)}
      <div style={{position: 'relative', width: w, height: h, borderRadius: h / 2, background: '#fff', boxShadow: '0 30px 60px rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 40px'}}>
        {e.text && <div style={{fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 54, color: L.ink, textAlign: 'center', lineHeight: 1.1}}>{e.text}</div>}
        {e.ch && <div style={{fontFamily: EMOJI, fontSize: e.chSize ?? h * 0.5}}>{e.ch}</div>}
        {e.scribble && (
          <svg width={w * 0.7} height={h * 0.6} viewBox="0 0 400 160">
            <path d="M10 80 C40 20 70 140 100 80 S160 20 190 80 S250 140 280 80 S340 20 390 80" stroke="#3a3f5c" strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray={900} strokeDashoffset={900 * (1 - eo(t, (e.at ?? 0) + 0.2, 1))} />
            <path d="M60 130 L340 130" stroke="#FF6B6B" strokeWidth={8} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - eo(t, (e.at ?? 0) + 0.9, 0.5))} />
          </svg>
        )}
        {e.loop && (
          <div style={{position: 'absolute', right: -50, top: -50, fontFamily: EMOJI, fontSize: 90, transform: `rotate(${t * 220}deg)`}}>🔁</div>
        )}
      </div>
    </div>
  );
};

// Cama vista de lado con el personaje acostado
const Bed: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const glow = e.phone ? 0.5 + 0.15 * Math.sin(t * 3) : 0;
  const mood = e.mood ?? 'worried';
  return (
    <Pos e={{...e, anim: e.anim ?? 'fade'}} t={t} i={i}>
      <svg width={1100} height={520} viewBox="-550 -300 1100 520" style={{overflow: 'visible'}}>
        <rect x={-500} y={40} width={1000} height={120} rx={20} fill="#3a2f45" />
        <rect x={-520} y={-110} width={50} height={300} rx={14} fill="#4a3a56" />
        <rect x={470} y={-20} width={40} height={210} rx={12} fill="#4a3a56" />
        <rect x={-470} y={-30} width={260} height={90} rx={40} fill="#e9e4f2" />
        <path d="M-260 10 Q-100 -70 120 -40 Q330 -30 470 -10 L470 60 L-260 60 Z" fill={e.blanket ?? '#5b7bd6'} />
        <path d="M-260 10 Q-100 -70 120 -40 Q330 -30 470 -10" stroke="rgba(255,255,255,0.25)" strokeWidth={8} fill="none" />
        <g transform={`translate(-330 ${-70 + Math.sin(t * 1.4) * 2}) scale(1.45)`}>
          <circle cx={0} cy={0} r={60} fill={e.hood ?? '#E0A526'} />
          <circle cx={0} cy={0} r={52} fill={e.skin ?? '#D9A27A'} />
          <path d="M-48 -18 Q-42 -56 0 -58 Q42 -56 48 -18 Q30 -40 0 -40 Q-30 -40 -48 -18 Z" fill="#3a2418" />
          <Face mood={mood === 'sleep' ? 'happy' : mood} t={t} seed={i} closed={mood === 'sleep'} />
        </g>
        {e.phone && <ellipse cx={-180} cy={-40} rx={260} ry={160} fill={`rgba(120,170,255,${glow * 0.35})`} />}
        {mood === 'sleep' && ['Z', 'z', 'z'].map((z, k) => <text key={k} x={-250 + k * 50 + Math.sin(t + k) * 8} y={-150 - k * 50 - ((t * 30) % 40)} fill="#cfe7ff" fontFamily="Montserrat" fontWeight={900} fontSize={60 - k * 12} opacity={0.8}>{z}</text>)}
      </svg>
    </Pos>
  );
};

export const renderEl = (e: El, t: number, i: number) => {
  switch (e.k) {
    case 'txt':
      return <Txt key={i} e={e} t={t} i={i} />;
    case 'emo':
      return <Emo key={i} e={e} t={t} i={i} />;
    case 'tag':
      return <Tag key={i} e={e} t={t} i={i} />;
    case 'mark':
      return <Mark key={i} e={e} t={t} i={i} />;
    case 'card':
      return <Card key={i} e={e} t={t} i={i} />;
    case 'person':
      return <Person key={i} e={e} t={t} i={i} />;
    case 'seller':
      return <Seller key={i} e={e} t={t} i={i} />;
    case 'house':
      return <House key={i} e={e} t={t} i={i} />;
    case 'bag':
      return <Bag key={i} e={e} t={t} i={i} />;
    case 'cage':
      return <Cage key={i} e={e} t={t} i={i} />;
    case 'scale':
      return <Scale key={i} e={e} t={t} i={i} />;
    case 'stamp':
      return <Stamp key={i} e={e} t={t} i={i} />;
    case 'notifs':
      return <Notifs key={i} e={e} t={t} />;
    case 'check':
      return <Checklist key={i} e={e} t={t} i={i} />;
    case 'count':
      return <Count key={i} e={e} t={t} i={i} />;
    case 'bars':
      return <Bars key={i} e={e} t={t} i={i} />;
    case 'chart':
      return <Chart key={i} e={e} t={t} />;
    case 'live':
      return <Live key={i} e={e} t={t} />;
    case 'timeline':
      return <Timeline key={i} e={e} t={t} />;
    case 'puzzle':
      return <PuzzleEl key={i} e={e} t={t} />;
    case 'phone':
      return <Phone key={i} e={e} t={t} i={i} />;
    case 'frame':
      return <Frame key={i} e={e} t={t} i={i} />;
    case 'neon':
      return <Neon key={i} e={e} t={t} i={i} />;
    case 'rain':
      return <Rain key={i} e={e} t={t} />;
    case 'light':
      return <Light key={i} e={e} t={t} />;
    case 'scan':
      return <Scan key={i} e={e} t={t} />;
    case 'shards':
      return <Shards key={i} e={e} t={t} />;
    case 'balloon':
      return <Balloon key={i} e={e} t={t} i={i} />;
    case 'clock':
      return <Clock key={i} e={e} t={t} i={i} />;
    case 'mask':
      return <Mask key={i} e={e} t={t} i={i} />;
    case 'spot':
      return <Spot key={i} e={e} t={t} />;
    case 'bear':
      return <Bear key={i} e={e} t={t} i={i} />;
    case 'island':
      return <Island key={i} e={e} t={t} />;
    case 'meter':
      return <Meter key={i} e={e} t={t} i={i} />;
    case 'thought':
      return <Thought key={i} e={e} t={t} i={i} />;
    case 'bed':
      return <Bed key={i} e={e} t={t} i={i} />;
    default:
      return null;
  }
};
