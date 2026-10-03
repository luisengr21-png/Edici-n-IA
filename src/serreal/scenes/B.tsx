import React from 'react';
import {
  Bird,
  C,
  Cam,
  Draw,
  E,
  Fig,
  Icon,
  P,
  PE,
  PO,
  S,
  SceneProps,
  Title,
  TopFig,
  W,
  clamp,
  easeIn,
  easeInOut,
  easeOut,
  easeOutBack,
  figHeadY,
  hash,
  lerp,
  mixHex,
  noise,
  rng,
} from '../kit';
import {Svg} from './A';

// ════════════════════ Escena 6 — El estudio de edición ════════════════════
const fmt = (n: number) => Math.floor(n).toLocaleString('es-ES').replace(/,/g, '.');

/** La «publicación»: figura con las ediciones aplicadas. */
const Post: React.FC<{smile: number; trophy: number; perfect: number; t: number; real?: boolean}> = ({smile, trophy, perfect, t, real}) => {
  const col = real ? C.amberMuted : mixHex(C.amberMuted, '#ffc94d', perfect);
  const hy = figHeadY(0) * 2.6;
  return (
    <g>
      <rect x={-220} y={-220} width={440} height={440} rx={10} fill={mixHex('#1d2431', '#3a2d3f', perfect * 0.8)} />
      <circle cx={0} cy={-40} r={260} fill="url(#srWarm)" opacity={perfect * 0.8} />
      <Fig x={-20} y={170} s={2.6} color={col} glow={perfect * 0.8} shadow={false} />
      {smile > 0 && <Draw d={`M${-20 - 18} ${170 + hy + 2} Q${-20} ${170 + hy + 22} ${-20 + 18} ${170 + hy + 2}`} p={smile} color={C.bg} w={5} />}
      {trophy > 0 && <Icon name="trophy" x={110} y={60} s={1.5 * easeOutBack(trophy)} color={C.amber} />}
      {perfect > 0 &&
        [0, 1, 2, 3].map((i) => (
          <Icon key={i} name="sparkle" x={[-150, 140, -120, 150][i]} y={[-150, -120, 90, -10][i]} s={0.6 * perfect * (0.7 + 0.3 * Math.sin(t * 5 + i * 2))} color={C.cream} />
        ))}
    </g>
  );
};

const Polaroid: React.FC<{x: number; y: number; s: number; rot: number; smile: number; trophy: number; perfect: number; t: number; o?: number}> = ({x, y, s, rot, o = 1, ...rest}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
    <rect x={-250} y={-250} width={500} height={590} rx={6} fill={C.cream} />
    <g transform="scale(1.06)">
      <Post {...rest} />
    </g>
  </g>
);

export const Scene6: React.FC<SceneProps> = ({t, a}) => {
  const tLikes = W(9, 'likes');
  const tFollow = W(9, 'seguidores');
  const tVal = W(9, 'validación');
  const tEdit = W(9, 'versiones') - 0.3;
  const tSmile = W(9, 'sonrientes');
  const tWin = W(9, 'exitosas');
  const tPerf = W(9, 'perfectas');
  const tBig = S(10) - 0.3;
  const tBars = W(10, 'perdemos');
  const tFree = W(10, 'libertad') - 0.2;
  const smile = PE(t, tSmile, 0.5);
  const trophy = P(t, tWin, 0.45);
  const perfect = PE(t, tPerf, 0.6);
  const likes = t < tLikes ? 12 : 12 + Math.pow(Math.max(0, t - tLikes), 2.6) * 140;
  const follows = t < tFollow ? 3 : 3 + Math.pow(Math.max(0, t - tFollow), 2.2) * 35;
  const big = PE(t, tBig, 1.1);
  const ui = 1 - big;
  const phoneIn = PO(t, a + 0.2, 1.1);
  const edits = [
    {t0: tSmile, x: 1290},
    {t0: tWin, x: 1530},
    {t0: tPerf, x: 1770},
  ];
  return (
    <Svg>
      {ui > 0 && (
        <g opacity={ui}>
          {/* teléfono gigante */}
          <g transform={`translate(${lerp(760, 700, PE(t, tEdit, 1))} ${lerp(1300, 560, phoneIn)})`}>
            <rect x={-280} y={-520} width={560} height={1060} rx={70} fill="#151a23" stroke={C.cream} strokeWidth={6} />
            <rect x={-60} y={-500} width={120} height={22} rx={11} fill={C.cream} opacity={0.5} />
            {/* cabecera de perfil */}
            <circle cx={-190} cy={-400} r={34} fill={C.amberMuted} />
            <rect x={-140} y={-418} width={150} height={14} rx={7} fill={C.creamDim} opacity={0.6} />
            <rect x={-140} y={-394} width={90} height={10} rx={5} fill={C.creamDim} opacity={0.35} />
            <g transform="translate(0 -60)">
              <Post smile={smile} trophy={trophy} perfect={perfect} t={t} />
              {/* marco de selección (edición) */}
              <rect x={-236} y={-236} width={472} height={472} fill="none" stroke={C.teal} strokeWidth={3} strokeDasharray="14 10" strokeDashoffset={-t * 40} opacity={P(t, tEdit, 0.3) * (1 - P(t, tPerf + 1, 0.4))} />
            </g>
            {/* likes y seguidores */}
            <g transform="translate(-200 250)">
              <Icon name="heart" s={0.8} color={C.coral} />
              <text x={40} y={14} fontFamily="Oswald" fontWeight={500} fontSize={42} fill={C.cream}>
                {fmt(likes)}
              </text>
            </g>
            <g transform="translate(40 250)" opacity={P(t, tFollow - 0.2, 0.3)}>
              <Icon name="user" s={0.9} color={C.teal} />
              <text x={34} y={14} fontFamily="Oswald" fontWeight={500} fontSize={42} fill={C.cream}>
                {fmt(follows)}
              </text>
            </g>
            <rect x={-200} y={330} width={400} height={14} rx={7} fill={C.creamDim} opacity={0.3} />
            <rect x={-200} y={360} width={260} height={14} rx={7} fill={C.creamDim} opacity={0.2} />
            {/* corazones que suben */}
            {Array.from({length: 26}).map((_, i) => {
              const t0 = tLikes + i * 0.22;
              const u = P(t, t0, 1.8);
              if (u <= 0 || u >= 1) return null;
              return <Icon key={i} name="heart" x={-200 + Math.sin(i * 2.3 + u * 6) * 30} y={230 - u * 520} s={0.5 + hash(i) * 0.3} color={C.coral} opacity={1 - u} />;
            })}
          </g>
          {/* notificaciones de validación */}
          {[0, 1, 2, 3, 4].map((i) => {
            const k = easeOutBack(P(t, tVal + i * 0.18, 0.4));
            return (
              <g key={i} transform={`translate(${1130 + (i % 2) * 40} ${200 + i * 80}) scale(${k})`} opacity={P(t, tVal + i * 0.18, 0.2) * (1 - PE(t, tEdit, 0.5))}>
                <rect x={-30} y={-30} width={300} height={60} rx={30} fill={C.bg2} stroke={C.line} strokeWidth={2} />
                <Icon name={['heart', 'user', 'thumb', 'bell', 'heart'][i]} x={4} s={0.45} color={[C.coral, C.teal, C.cream, C.amber, C.coral][i]} />
                <rect x={44} y={-8} width={160 - i * 12} height={16} rx={8} fill={C.creamDim} opacity={0.4} />
              </g>
            );
          })}
          {/* panel de edición */}
          <g opacity={PE(t, tEdit, 0.6)} transform={`translate(${lerp(80, 0, PE(t, tEdit, 0.6))} 0)`}>
            <rect x={1150} y={210} width={700} height={330} rx={18} fill={C.bg2} stroke={C.line} strokeWidth={2} />
            {[0, 1, 2].map((i) => {
              const v = lerp(0.25, 0.85, PE(t, edits[i].t0 - 0.1, 0.6));
              const y = 290 + i * 95;
              return (
                <g key={i}>
                  <Icon name={['mask', 'trophy', 'sparkle'][i]} x={1215} y={y} s={0.6} color={C.creamDim} />
                  <line x1={1280} x2={1790} y1={y} y2={y} stroke={C.line} strokeWidth={6} strokeLinecap="round" />
                  <line x1={1280} x2={lerp(1280, 1790, v)} y1={y} y2={y} stroke={C.teal} strokeWidth={6} strokeLinecap="round" />
                  <circle cx={lerp(1280, 1790, v)} cy={y} r={16} fill={C.cream} />
                </g>
              );
            })}
          </g>
          {/* polaroids que salen de cada edición */}
          {edits.map((e, i) => {
            const k = PO(t, e.t0 + 0.35, 0.8);
            if (k <= 0) return null;
            const flip = Math.cos((1 - k) * Math.PI * 0.9);
            return (
              <g key={i} transform={`translate(${lerp(700, e.x, k)} ${lerp(500, 800, k)}) scale(${flip} 1)`}>
                <Polaroid x={0} y={0} s={lerp(0.85, 0.42, k)} rot={lerp(0, [-6, 4, -3][i], k)} smile={i >= 0 ? 1 : 0} trophy={i >= 1 ? 1 : 0} perfect={i >= 2 ? 1 : 0} t={t} />
              </g>
            );
          })}
        </g>
      )}
      {big > 0 && (
        <g opacity={big}>
          {/* la última polaroid crece y se vuelve jaula */}
          {(() => {
            const peel = PE(t, tBars + 0.3, 0.9);
            const barsP = PO(t, tBars - 0.2, 0.9);
            const hy = 455 + figHeadY(0) * 2.6 * 1.06;
            const fly = P(t, tFree, 2.6);
            return (
              <g>
                <Polaroid x={lerp(1770, 960, big)} y={lerp(800, 470, big)} s={lerp(0.42, 1.25, big)} rot={lerp(-3, 0, big)} smile={1} trophy={1} perfect={1} t={t} o={1} />
                <g transform={`translate(960 470) scale(1.25)`}>
                  <clipPath id="realClip">
                    <rect x={-233} y={-233} width={466} height={466} />
                  </clipPath>
                  <g clipPath="url(#realClip)" opacity={peel}>
                    <g transform="scale(1.06)">
                      <Post smile={0} trophy={0} perfect={0} t={t} real />
                    </g>
                  </g>
                  {Array.from({length: 8}).map((_, i) => {
                    const x = -233 + (i + 0.5) * (466 / 8);
                    return <Draw key={i} d={`M${x} -240 L${x} 240`} p={clamp(barsP * 1.4 - i * 0.05)} color={C.stoneLight} w={9} cap="butt" />;
                  })}
                  <rect x={-240} y={-240} width={480} height={480} fill="none" stroke={C.stoneLight} strokeWidth={10} opacity={barsP} />
                </g>
                {fly > 0 && (
                  <Bird
                    x={lerp(940, 2050, easeIn(fly) * 0.6 + fly * 0.4)}
                    y={lerp(470 + hy - 455 - 40, -120, Math.pow(fly, 0.8)) + Math.sin(fly * 9) * 12}
                    s={1.3}
                    flap={t * 16}
                  />
                )}
              </g>
            );
          })()}
        </g>
      )}
    </Svg>
  );
};

// ════════════════════ Escena 7 — La bolsa de valores del yo ════════════════════
const CANDLES = (() => {
  const r = rng(77);
  const out: {o: number; c: number; h: number; l: number}[] = [];
  let v = 0.45;
  for (let i = 0; i < 46; i++) {
    const o = v;
    v = clamp(v + (r() - 0.47) * 0.3 + Math.sin(i * 0.45) * 0.06, 0.1, 0.9);
    out.push({o, c: v, h: Math.max(o, v) + r() * 0.05, l: Math.min(o, v) - r() * 0.05});
  }
  return out;
})();

export const Scene7: React.FC<SceneProps> = ({t, a}) => {
  const tGlass = S(12) - 0.35;
  const tMore = W(12, 'cuanto');
  const x0 = 180;
  const dx = 31;
  const y0 = 860;
  const hh = 620;
  const run = (t - a - 0.3) / 0.105;
  const n = clamp(Math.floor(run), 0, CANDLES.length - 1);
  const last = CANDLES[n];
  const fx = x0 + n * dx + dx / 2;
  const fy = y0 - last.c * hh;
  const whip = easeInOut(clamp((t - tGlass) / 0.6));
  // vaso
  const hearts: number[] = [];
  let ti = tGlass + 0.5;
  while (ti < a + 30) {
    hearts.push(ti);
    ti += lerp(0.75, 0.16, clamp((ti - tMore + 1) / 4));
  }
  let level = 0.08;
  for (const h of hearts) if (t > h + 0.55) level += 0.1 * Math.exp(-(t - h - 0.55) * 2.2);
  level = Math.min(level, 0.7);
  const spin = (t - tGlass) * 60 + Math.pow(Math.max(0, t - tMore), 2) * 70;
  const gx = 960;
  const gTop = 330;
  const gBot = 770;
  return (
    <Svg>
      {whip < 1 && (
        <g transform={`translate(${-whip * 1920} 0)`} opacity={1 - whip * 0.5}>
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line key={i} x1={x0} x2={1780} y1={y0 - i * 124} y2={y0 - i * 124} stroke={C.grid} strokeWidth={1.5} />
          ))}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <rect key={i} x={1800} y={y0 - i * 124 - 7} width={50} height={14} rx={7} fill={C.line} />
          ))}
          {CANDLES.slice(0, n + 1).map((c, i) => {
            const up = c.c >= c.o;
            const x = x0 + i * dx + dx / 2;
            const col = up ? C.teal : C.coral;
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={y0 - c.h * hh} y2={y0 - c.l * hh} stroke={col} strokeWidth={2} />
                <rect x={x - 10} y={y0 - Math.max(c.o, c.c) * hh} width={20} height={Math.max(3, Math.abs(c.c - c.o) * hh)} fill={col} />
              </g>
            );
          })}
          <polyline points={CANDLES.slice(0, n + 1).map((c, i) => `${x0 + i * dx + dx / 2},${y0 - c.c * hh}`).join(' ')} fill="none" stroke={C.cream} strokeWidth={2.5} opacity={0.6} />
          <line x1={x0} x2={1780} y1={fy} y2={fy} stroke={C.cream} strokeWidth={1.5} strokeDasharray="6 8" opacity={0.4} />
          <Fig x={fx} y={fy - 4} s={1.35} color={C.amberMuted} shadow={false} />
          {/* pulgares que aparecen / desaparecen */}
          {CANDLES.slice(Math.max(0, n - 4), n + 1).map((c, k) => {
            const i = Math.max(0, n - 4) + k;
            const age = run - i;
            const up = c.c >= c.o;
            const x = x0 + i * dx + dx / 2;
            return (
              <Icon
                key={i}
                name="thumb"
                x={x + 30}
                y={y0 - c.c * hh - 140 - age * 30}
                s={0.55 * easeOutBack(clamp(age * 2))}
                rot={up ? 0 : 180}
                color={up ? C.teal : C.coral}
                opacity={clamp(1 - age / 3.5)}
              />
            );
          })}
        </g>
      )}
      {whip > 0 && (
        <g transform={`translate(${(1 - whip) * 1920} 0)`}>
          <polygon points={`${gx - 90},0 ${gx + 90},0 ${gx + 420},1080 ${gx - 420},1080`} fill="url(#srCold)" opacity={0.5} />
          {/* bucle que acelera */}
          <g transform={`translate(${gx} 560) rotate(${spin})`} opacity={P(t, tGlass + 0.6, 0.6)}>
            <path d="M0 -360 A360 360 0 1 1 -254 -254" fill="none" stroke={C.coral} strokeWidth={8} strokeLinecap="round" />
            <path d="M-254 -254 L-262 -214 M-254 -254 L-214 -262" stroke={C.coral} strokeWidth={8} strokeLinecap="round" />
          </g>
          <clipPath id="glassClip">
            <path d={`M${gx - 160} ${gTop} L${gx + 160} ${gTop} L${gx + 115} ${gBot} L${gx - 115} ${gBot} Z`} />
          </clipPath>
          <g clipPath="url(#glassClip)">
            <rect x={gx - 200} y={gBot - level * (gBot - gTop)} width={400} height={600} fill={C.coral} opacity={0.75} />
            <path
              d={`M${gx - 200} ${gBot - level * (gBot - gTop)} ${Array.from({length: 21})
                .map((_, i) => `L${gx - 200 + i * 20} ${gBot - level * (gBot - gTop) + Math.sin(i * 0.9 + t * 6) * 4}`)
                .join(' ')}`}
              fill="none"
              stroke="#ff9a85"
              strokeWidth={3}
            />
          </g>
          <path d={`M${gx - 160} ${gTop} L${gx - 115} ${gBot} L${gx + 115} ${gBot} L${gx + 160} ${gTop}`} fill="none" stroke={C.cream} strokeWidth={6} strokeLinejoin="round" />
          <path d={`M${gx - 30} ${gBot} l12 -26 l10 14 l14 -30 l8 18`} fill="none" stroke={C.bg} strokeWidth={5} />
          <path d={`M${gx - 30} ${gBot} l12 -26 l10 14 l14 -30 l8 18`} fill="none" stroke={C.cream} strokeWidth={2} opacity={0.8} />
          {hearts.map((h, i) => {
            const u = P(t, h, 0.6);
            if (u <= 0 || u >= 1) return null;
            return <Icon key={i} name="heart" x={gx + (hash(i) - 0.5) * 160} y={lerp(-60, gBot - level * (gBot - gTop) - 10, easeIn(u))} s={0.7} color={C.coral} />;
          })}
          {/* goteo por la grieta */}
          {Array.from({length: 40}).map((_, i) => {
            const t0 = tGlass + 0.9 + i * lerp(0.35, 0.12, clamp(i / 25));
            const u = P(t, t0, 0.7);
            if (u <= 0 || u >= 1) return null;
            return <ellipse key={i} cx={gx - 6 + (hash(i) - 0.5) * 20} cy={gBot + 10 + easeIn(u) * 320} rx={6} ry={9} fill={C.coral} opacity={0.85 * (1 - u)} />;
          })}
          <ellipse cx={gx} cy={1010} rx={160 * PO(t, tGlass + 1.2, 6)} ry={14 * PO(t, tGlass + 1.2, 6)} fill={C.coral} opacity={0.35} />
        </g>
      )}
    </Svg>
  );
};

// ════════════════════ Escena 8 — Luces y sombras ════════════════════
export const Scene8: React.FC<SceneProps> = ({t, a}) => {
  const tAccept = W(13, 'aceptas') - 0.2;
  const tShadows = W(13, 'luces');
  const tFree = W(13, 'libre') - 0.25;
  const tText = S(14) - 0.35;
  const tLib = W(14, 'libertad');
  const tStage = S(15) - 0.45;
  const tAct = W(15, 'dejar de actuar');
  const tLive = W(15, 'vivir para ti') - 0.3;
  const join = PE(t, tShadows, tFree - tShadows + 0.2);
  const fused = PE(t, tFree, 0.6);
  const p1 = 1 - PE(t, tText, 0.6);
  const txt = PE(t, tText, 0.5) * (1 - PE(t, tStage, 0.6));
  const stage = PE(t, tStage, 0.8);
  const gap = lerp(110, 0, join);
  const s = 4.4;
  const halves = (
    <g transform={`translate(960 920) scale(${s})`}>
      <clipPath id="leftHalf">
        <rect x={-60} y={-130} width={60} height={140} />
      </clipPath>
      <clipPath id="rightHalf">
        <rect x={0} y={-130} width={60} height={140} />
      </clipPath>
      <circle cx={0} cy={-55} r={110} fill="url(#srGlow)" opacity={fused} />
      <g transform={`translate(${-gap / s / 2} 0)`} clipPath="url(#leftHalf)">
        <Fig x={0} y={0} color={C.amber} shadow={false} />
      </g>
      <g transform={`translate(${gap / s / 2} 0)`} clipPath="url(#rightHalf)">
        <Fig x={0} y={0} color={mixHex('#2b303b', C.amber, fused)} outline={fused < 1 ? mixHex('#454c5a', C.amber, fused) : undefined} shadow={false} />
      </g>
    </g>
  );
  // barrotes que se deshacen en partículas
  const dis = P(t, tAccept, 2.4);
  const bars = Array.from({length: 7}).map((_, i) => {
    const x = 960 - 330 + (i + 0.5) * (660 / 7);
    return (
      <g key={i}>
        <line x1={x} x2={x} y1={150} y2={950} stroke={C.stoneLight} strokeWidth={10} opacity={1 - clamp(dis * 2.2 - i * 0.08)} />
        {Array.from({length: 14}).map((_, k) => {
          const u = clamp(dis * 1.6 - hash(i * 20 + k) * 0.5);
          if (u <= 0 || u >= 1) return null;
          return <circle key={k} cx={x + (hash(k + i) - 0.5) * 30 + Math.sin(u * 6 + k) * 14} cy={150 + hash(k * 3 + i) * 800 - u * 380} r={4 * (1 - u) + 1} fill={C.amberGlow} opacity={(1 - u) * 0.9} />;
        })}
      </g>
    );
  });
  // escenario y amanecer
  const walk1 = PE(t, tAct, 1.8);
  const walk2 = PE(t, tLive, 2.6);
  const figX = lerp(560, 1040, walk1) + (walk2 * 380);
  const onStage = figX < 900;
  const hop = figX > 900 && figX < 1000 ? Math.sin(((figX - 900) / 100) * Math.PI) * 40 : 0;
  const walking = (walk1 > 0 && walk1 < 1) || (walk2 > 0 && walk2 < 1);
  const bob = walking ? -Math.abs(Math.sin(t * 9)) * 9 : 0;
  const figY = (onStage ? 760 : 820) - hop + bob;
  const sun = PE(t, tStage + 0.4, 4.2);
  const camZ = lerp(1, 1.18, PE(t, tLive - 0.4, 4));
  const camX = lerp(960, 1220, PE(t, tAct, 5.5));
  return (
    <>
      <Svg>
        <rect width={1920} height={1080} fill={C.night} opacity={0.5 * (1 - stage)} />
        {p1 > 0 && (
          <g opacity={p1}>
            <circle cx={960} cy={520} r={700} fill="url(#srWarm)" opacity={fused * 0.6} />
            <line x1={400} x2={1520} y1={922} y2={922} stroke={C.line} strokeWidth={2} />
            {halves}
            {bars}
          </g>
        )}
        {stage > 0 && (
          <g opacity={stage}>
            <Cam cx={camX} cy={560} z={camZ}>
              {/* amanecer */}
              <clipPath id="skyClip">
                <rect x={-600} y={-600} width={3400} height={1422} />
              </clipPath>
              <g clipPath="url(#skyClip)">
                <circle cx={1640} cy={lerp(1150, 830, sun)} r={1000} fill="url(#srSun)" opacity={sun} />
                <circle cx={1640} cy={lerp(1000, 800, sun)} r={105} fill={C.amberGlow} opacity={0.95 * sun} />
              </g>
              <line x1={980} x2={2600} y1={822} y2={822} stroke={C.creamDim} strokeWidth={3} />
              {/* escenario */}
              <rect x={150} y={760} width={760} height={62} fill="#2a2430" stroke={C.creamDim} strokeWidth={3} />
              <polygon points={`${560 - 60},40 ${560 + 60},40 ${560 + 250},760 ${560 - 250},760`} fill="url(#srBeam)" opacity={0.75 * (1 - walk1 * 0.7)} />
              <ellipse cx={560} cy={762} rx={250} ry={18} fill="#ffd890" opacity={0.25 * (1 - walk1 * 0.7)} />
              {[0, 1].map((side) => (
                <path
                  key={side}
                  d={
                    side === 0
                      ? 'M120 30 L330 30 C300 250 300 500 250 760 L120 760 Z'
                      : 'M940 30 L790 30 C820 250 820 500 870 760 L940 760 Z'
                  }
                  fill={C.coralDark}
                />
              ))}
              {[150, 190, 230, 270].map((x, i) => (
                <line key={i} x1={x} y1={40} x2={x - 6} y2={760} stroke="#7a2c23" strokeWidth={6} />
              ))}
              <rect x={110} y={20} width={840} height={50} fill="#7a2c23" />
              <Fig x={figX} y={figY} s={2.3} color={C.amber} glow={0.5 + 0.4 * walk2} />
            </Cam>
            {/* público en primer plano */}
            {Array.from({length: 11}).map((_, i) => (
              <g key={i} opacity={1 - walk2 * 0.6}>
                <ellipse cx={60 + i * 95} cy={1110} rx={52} ry={70} fill="#0b0e13" />
                <circle cx={60 + i * 95} cy={1010} r={34} fill="#0b0e13" />
              </g>
            ))}
          </g>
        )}
      </Svg>
      {txt > 0 && (
        <Title
          words={['La', 'autenticidad', 'es', 'una', 'forma', 'de', 'libertad']}
          markWords={[6]}
          mark={PE(t, tLib - 0.1, 0.6)}
          reveal={PO(t, tText, 1.6)}
          size={104}
          opacity={txt}
          y={530}
        />
      )}
    </>
  );
};

// ════════════════════ Escena 9 — Mesa para uno ════════════════════
const BG_PEOPLE = [140, 360, 560, 1390, 1600, 1810];
export const Scene9: React.FC<SceneProps> = ({t, a}) => {
  const tThink = S(17) - 0.3;
  const tLess = W(17, 'menos');
  const tMine = W(17, 'tú piensas') - 0.2;
  const tNice = W(17, 'agradable') - 0.2;
  const knob = lerp(120, -120, PE(t, tLess, 1.4));
  const z = lerp(1.04, 1.16, PE(t, a, 16));
  const bubbles = Array.from({length: 18}).map((_, i) => {
    const px = BG_PEOPLE[i % BG_PEOPLE.length];
    const born = tThink + i * 0.12;
    const o = P(t, born, 0.4) * (1 - PE(t, tLess + 0.2 + hash(i) * 0.9, 0.5));
    const sc = easeOutBack(P(t, born, 0.5)) * (1 - PE(t, tLess + 0.2 + hash(i) * 0.9, 0.5));
    const bx = px + (hash(i * 5) - 0.5) * 260;
    const by = 560 - hash(i * 9) * 190 - (t - born) * 10;
    return { o, sc, bx, by, i };
  });
  return (
    <Svg>
      <Cam cx={980} cy={600} z={z}>
        <circle cx={980} cy={430} r={900} fill="url(#srWarm)" opacity={0.85} />
        {/* gente desenfocada al fondo */}
        <g filter="url(#srBlur6)" opacity={0.55}>
          {BG_PEOPLE.map((x, i) => (
            <Fig key={i} x={x} y={800} s={1.7} color={C.stone} shadow={false} />
          ))}
        </g>
        {bubbles.map(({o, sc, bx, by, i}) =>
          o > 0 ? (
            <g key={i} opacity={o} transform={`translate(${bx} ${by}) scale(${sc})`}>
              <ellipse rx={62} ry={44} fill={C.stone} />
              {[-20, 0, 20].map((d) => (
                <circle key={d} cx={d} cy={0} r={6} fill={C.bg2} />
              ))}
              <circle cx={-34} cy={56} r={10} fill={C.stone} />
              <circle cx={-46} cy={78} r={6} fill={C.stone} />
            </g>
          ) : null,
        )}
        <line x1={0} x2={1920} y1={822} y2={822} stroke={C.line} strokeWidth={2} />
        {/* lámpara */}
        <line x1={985} y1={-200} x2={985} y2={330} stroke={C.creamDim} strokeWidth={3} />
        <polygon points="935,330 1035,330 1080,400 890,400" fill="#3b3428" stroke={C.creamDim} strokeWidth={2} />
        <ellipse cx={985} cy={402} rx={70} ry={10} fill={C.amberGlow} />
        <polygon points="895,402 1075,402 1260,700 720,700" fill="url(#srBeam)" opacity={0.5} />
        {/* figura sentada detrás de la mesa */}
        <Fig x={860} y={850} s={2.3} color={C.amber} glow={0.5 + 0.4 * PE(t, tNice, 0.8)} />
        {/* silla vacía */}
        <g stroke={C.creamDim} strokeWidth={5} fill="none" opacity={0.55} strokeLinecap="round">
          <path d="M1320 560 L1330 822 M1250 720 L1390 720 M1270 720 L1260 822 M1380 720 L1385 822" />
        </g>
        {/* mesa */}
        <rect x={760} y={700} width={470} height={16} rx={4} fill="#4a3c2c" />
        <rect x={985} y={716} width={16} height={106} fill="#3a2f23" />
        <rect x={930} y={814} width={126} height={10} rx={5} fill="#3a2f23" />
        {/* libro */}
        <path d="M920 698 L970 685 L1020 698 Z" fill={C.cream} />
        <path d="M970 685 L970 698" stroke="#b9a98f" strokeWidth={2} />
        {/* taza y vapor */}
        <path d="M1070 650 L1130 650 L1124 698 L1076 698 Z" fill={C.cream} />
        <path d="M1130 662 C1152 662 1152 688 1127 688" fill="none" stroke={C.cream} strokeWidth={6} />
        {[0, 1, 2].map((i) => {
          const ph = t * 1.4 + i * 2.1;
          const pts = Array.from({length: 12}).map((_, k) => `${1088 + i * 14 + Math.sin(ph + k * 0.6) * 9},${640 - k * 9 - ((t * 20) % 9)}`);
          return <polyline key={i} points={pts.join(' ')} fill="none" stroke={C.cream} strokeWidth={3} strokeLinecap="round" opacity={0.35} />;
        })}
        {/* pensamiento propio */}
        {(() => {
          const k = easeOutBack(P(t, tMine, 0.8));
          if (k <= 0) return null;
          const hy = 850 + figHeadY(0) * 2.3;
          return (
            <g transform={`translate(${860 + 120} ${hy - 150}) scale(${k})`}>
              <circle cx={-90} cy={110} r={10} fill={C.amber} />
              <circle cx={-60} cy={80} r={16} fill={C.amber} />
              <ellipse rx={120} ry={84} fill={C.amber} />
              <Icon name="heart" s={1.2} color={C.bg} />
            </g>
          );
        })()}
        <circle cx={860} cy={700} r={120 + 500 * PO(t, tNice, 2)} fill="none" stroke={C.amber} strokeWidth={4} opacity={0.6 * P(t, tNice, 0.15) * (1 - P(t, tNice, 2))} />
      </Cam>
      {/* perilla de volumen */}
      <g transform="translate(1660 880)" opacity={P(t, tThink + 0.6, 0.5)}>
        <circle r={86} fill={C.bg2} stroke={C.line} strokeWidth={3} />
        {Array.from({length: 13}).map((_, i) => {
          const an = ((-120 + i * 20) * Math.PI) / 180;
          const on = -120 + i * 20 <= knob;
          return <line key={i} x1={Math.sin(an) * 96} y1={-Math.cos(an) * 96} x2={Math.sin(an) * 112} y2={-Math.cos(an) * 112} stroke={on ? C.cream : C.line} strokeWidth={4} strokeLinecap="round" />;
        })}
        <g transform={`rotate(${knob})`}>
          <circle r={64} fill="#232a36" stroke={C.creamDim} strokeWidth={3} />
          <line x1={0} y1={-20} x2={0} y2={-54} stroke={C.cream} strokeWidth={7} strokeLinecap="round" />
        </g>
        <g transform="translate(0 -150)">
          <ellipse rx={36} ry={26} fill={C.stone} />
          {[-12, 0, 12].map((d) => (
            <circle key={d} cx={d} r={4} fill={C.bg2} />
          ))}
        </g>
      </g>
    </Svg>
  );
};

// ════════════════════ Escena 10 — El contagio de lo genuino ════════════════════
const CROWD = (() => {
  const r = rng(1234);
  const pts: {x: number; y: number; d: number}[] = [];
  while (pts.length < 95) {
    const x = 60 + r() * 1800;
    const y = 40 + r() * 1000;
    if (Math.hypot(x - 960, y - 540) < 130) continue;
    if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 92)) continue;
    pts.push({x, y, d: r() * 360});
  }
  return pts;
})();

export const Scene10: React.FC<SceneProps> = ({t, a}) => {
  const t0 = S(18);
  const tClose = S(19) - 0.35;
  const tLight = W(19, 'liviana') - 0.2;
  const tSpread = W(19, 'contagiosa') - 0.3;
  const close = PE(t, tClose, 0.7);
  const z = lerp(1.3, 1.0, PE(t, a, tClose - a));
  // primer plano
  const drop = Math.max(0, t - tLight);
  const rise = PE(t, tLight, 1.4);
  const figY = lerp(690, 600, rise) + Math.sin(t * 2.2) * 8 * rise;
  const wy = (k: number) => {
    const base = figY + 150 + k * 0;
    if (t < tLight) return base;
    const yy = base + 0.5 * 2600 * drop * drop;
    return Math.min(yy, 935);
  };
  return (
    <Svg>
      {close < 1 && (
        <g opacity={1 - close}>
          <Cam z={z}>
            {[0, 1, 2, 3].map((k) => {
              const u = ((t - t0 - k * 1.5) % 6) / 3.5;
              if (t < t0 + k * 1.5 || u > 1) return null;
              return <circle key={k} cx={960} cy={540} r={60 + u * 1000} fill="none" stroke={C.amber} strokeWidth={3} opacity={0.4 * (1 - u)} />;
            })}
            {CROWD.map((p, i) => {
              const dist = Math.hypot(p.x - 960, p.y - 540);
              const tr = t0 + 0.2 + dist / 380 + hash(i) * 0.5;
              const k = PE(t, tr, 0.9);
              const toward = (Math.atan2(540 - p.y, 960 - p.x) * 180) / Math.PI;
              let from = p.d + noise(t * 0.3, i) * 30;
              while (toward - from > 180) from += 360;
              while (toward - from < -180) from -= 360;
              const warm = PE(t, tr + 0.2, 1.6);
              return <TopFig key={i} x={p.x} y={p.y} s={1.1} color={mixHex(C.stone, '#c9a25a', warm * 0.75)} dir={lerp(from, toward, k)} glow={warm * 0.25} />;
            })}
            <TopFig x={960} y={540} s={1.35} color={C.amber} dir={90 + Math.sin(t * 0.8) * 20} glow={1} />
          </Cam>
        </g>
      )}
      {close > 0 && (
        <g opacity={close}>
          <circle cx={960} cy={figY - 100} r={500 + 120 * PE(t, tSpread, 1.5)} fill="url(#srWarm)" opacity={0.5 + 0.5 * rise} />
          <line x1={0} x2={1920} y1={952} y2={952} stroke={C.line} strokeWidth={2} />
          {[-1, 1].map((sd) => {
            const wx = 960 + sd * 140;
            const yy = wy(sd);
            const ankleX = 960 + sd * 18;
            const ankleY = figY - 6;
            return (
              <g key={sd}>
                {t < tLight + 0.05 && <line x1={ankleX} y1={ankleY} x2={wx} y2={yy - 100} stroke={C.stoneLight} strokeWidth={5} strokeDasharray="12 6" />}
                <g transform={`translate(${wx} ${yy}) scale(1.7)`}>
                  <path d="M-22 -40 C-22 -64 22 -64 22 -40" fill="none" stroke={C.stoneLight} strokeWidth={9} />
                  <path d="M-44 0 C-48 -40 48 -40 44 0 L40 10 L-40 10 Z" fill={C.stoneLight} />
                </g>
              </g>
            );
          })}
          <Fig x={960} y={figY} s={3} color={C.amber} glow={0.6 + 0.4 * rise} shadow={false} />
          <ellipse cx={960} cy={952} rx={lerp(70, 40, rise)} ry={8} fill={C.shadow} />
          {Array.from({length: 36}).map((_, i) => {
            const u = P(t, tSpread + hash(i) * 1.2, 2.2);
            if (u <= 0 || u >= 1) return null;
            const an = hash(i * 7) * Math.PI * 2;
            const r = 80 + easeOut(u) * 800;
            return <circle key={i} cx={960 + Math.cos(an) * r} cy={figY - 130 + Math.sin(an) * r * 0.6} r={5 * (1 - u) + 2} fill={C.amberGlow} opacity={1 - u} />;
          })}
        </g>
      )}
    </Svg>
  );
};
