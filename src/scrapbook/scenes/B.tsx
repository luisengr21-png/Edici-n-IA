import React from 'react';
import {
  Cam,
  Cut,
  Dot,
  Dymo,
  E,
  Fig,
  Hand,
  Icon,
  K,
  P,
  PE,
  PFig,
  PO,
  Page,
  Ransom,
  S,
  SceneProps,
  Svg,
  Tape,
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
  tornRect,
  usePose,
} from '../kit';

// ════════════════════ Escena 6 — Teléfono de cartón, Dymo y polaroids ════════════════════
const PostArt: React.FC<{smile: number; trophy: number; perfect: number; real?: boolean; pose: number}> = ({smile, trophy, perfect, real, pose}) => {
  const hy = figHeadY(0) * 2.4;
  return (
    <g>
      <rect x={-200} y={-200} width={400} height={400} fill={real ? '#d8d2c4' : mixHex('#cfe0ea', '#f6d9a8', perfect)} />
      <Fig x={-10} y={170} s={2.4} color={real ? '#a99c86' : mixHex(K.mustard, '#ffc94d', perfect)} shadow={false} />
      {smile > 0 && (
        <g filter="url(#boil)">
          <path d={`M-32 ${170 + hy + 2} Q-10 ${170 + hy + 22} 12 ${170 + hy + 2}`} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - smile} stroke={K.ink} strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      )}
      {trophy > 0 && (
        <g transform={`translate(110 40) scale(${easeOutBack(trophy) * 1.4}) rotate(12)`}>
          <Icon name="trophy" color="#e9b53c" />
        </g>
      )}
      {perfect > 0 &&
        Array.from({length: 26}).map((_, i) => (
          <circle key={i} cx={(hash(i + pose * 0.13) - 0.5) * 380} cy={(hash(i * 7 + pose * 0.29) - 0.5) * 380} r={2 + hash(i) * 3} fill={i % 3 ? '#ffd76a' : K.white} opacity={perfect} />
        ))}
    </g>
  );
};

const Polaroid: React.FC<{dev: number; smile: number; trophy: number; perfect: number; pose: number; real?: boolean}> = ({dev, ...rest}) => (
  <g>
    <rect x={-230} y={-230} width={460} height={540} fill={K.white} />
    <g transform="scale(1.05)">
      <PostArt {...rest} />
    </g>
    <rect x={-210} y={-210} width={420} height={420} fill="#2a2a2e" opacity={1 - dev} />
  </g>
);

export const Scene6: React.FC<SceneProps> = ({t, a}) => {
  const pose = usePose();
  const tLikes = W(9, 'likes');
  const tFollow = W(9, 'seguidores');
  const tVal = W(9, 'validación');
  const tSmile = W(9, 'sonrientes');
  const tWin = W(9, 'exitosas');
  const tPerf = W(9, 'perfectas');
  const tBig = S(10) - 0.3;
  const tBars = W(10, 'perdemos');
  const tFree = W(10, 'libertad') - 0.2;
  const smile = PE(t, tSmile, 0.5);
  const trophy = P(t, tWin, 0.4);
  const perfect = PE(t, tPerf, 0.5);
  const likes = t < tLikes ? 12 : 12 + Math.pow(Math.max(0, t - tLikes), 2.6) * 140;
  const follows = t < tFollow ? 3 : 3 + Math.pow(Math.max(0, t - tFollow), 2.2) * 35;
  const big = t >= tBig;
  const edits = [tSmile, tWin, tPerf];
  // rotulador que dibuja la sonrisa
  const pen = P(t, tSmile - 0.1, 0.7);
  return (
    <>
      <Page kind="paper" tint="#efe4cf" />
      <Svg>
        {!big && (
          <g>
            <g transform={`translate(700 ${lerp(1300, 560, PO(t, a + 0.1, 0.6))})`}>
              <Cut id={200} plain>
                <rect x={-290} y={-520} width={580} height={1080} rx={60} fill={K.kraft} />
                <rect x={-250} y={-470} width={500} height={940} rx={24} fill="#e9f3f6" opacity={0.92} />
                <polygon points="-250,-470 -60,-470 -250,-120" fill="#ffffff" opacity={0.35} />
              </Cut>
              <circle cx={-170} cy={-400} r={32} fill={K.mustard} />
              <rect x={-120} y={-416} width={140} height={12} rx={6} fill={K.newsDark} opacity={0.6} />
              <g transform="translate(0 -60)">
                <Cut id={201} plain jitter={0.4}>
                  <PostArt smile={smile} trophy={trophy} perfect={perfect} pose={pose} />
                </Cut>
              </g>
              <g transform="translate(-160 250)">
                <Cut id={202} x={-40} s={0.75}>
                  <Icon name="heart" color={K.tomato} />
                </Cut>
              </g>
              <Dymo text={String(Math.floor(likes))} x={-30} y={250} size={34} rot={-2} />
              <g opacity={t > tFollow - 0.2 ? 1 : 0}>
                <Cut id={203} x={90} y={250} s={0.7}>
                  <Icon name="user" color={K.sage} />
                </Cut>
                <Dymo text={String(Math.floor(follows))} x={200} y={250} size={34} rot={2} color={K.tomato} />
              </g>
              {Array.from({length: 24}).map((_, i) => {
                const u = P(t, tLikes + i * 0.25, 1.8);
                if (u <= 0 || u >= 1) return null;
                return (
                  <Cut key={i} id={210 + i} x={-200 + Math.sin(i * 2.3 + u * 6) * 30} y={230 - u * 540} s={0.45 + hash(i) * 0.25} rot={(hash(i) - 0.5) * 30}>
                    <Icon name="heart" color={K.tomato} />
                  </Cut>
                );
              })}
            </g>
            {/* notificaciones: notas adhesivas */}
            {[0, 1, 2, 3, 4].map((i) => {
              if (t < tVal + i * 0.18) return null;
              return (
                <Cut key={i} id={240 + i} x={1180 + (i % 2) * 150} y={180 + i * 120} rot={(hash(i * 5) - 0.5) * 14} plain s={easeOutBack(P(t, tVal + i * 0.18, 0.25))}>
                  <rect x={-65} y={-55} width={130} height={110} fill={['#fbe48a', '#f5b8c4', '#bfe3d6', '#fbe48a', '#cfe0ea'][i]} />
                  <Icon name={['heart', 'user', 'thumb', 'bell', 'heart'][i]} s={0.55} color={K.ink} />
                </Cut>
              );
            })}
            {/* rotulador */}
            {pen > 0 && pen < 1 && (
              <g transform={`translate(${lerp(640, 720, pen)} ${lerp(440, 470, Math.sin(pen * Math.PI))}) rotate(35)`}>
                <Cut id={250} plain>
                  <rect x={-14} y={-200} width={28} height={170} rx={6} fill={K.ink} />
                  <rect x={-14} y={-210} width={28} height={30} rx={6} fill={K.tomato} />
                  <polygon points="-10,-30 10,-30 0,0" fill={K.ink} />
                </Cut>
              </g>
            )}
            {/* polaroids que salen y se revelan */}
            {edits.map((t0, i) => {
              const k = PO(t, t0 + 0.35, 0.6);
              if (k <= 0) return null;
              return (
                <Cut key={i} id={260 + i} x={lerp(900, 1250 + i * 210, k)} y={lerp(560, 820 - (i % 2) * 30, k)} s={0.38} rot={lerp(0, [-7, 4, -3][i], k)} plain>
                  <Polaroid dev={P(t, t0 + 0.6, 1.4)} smile={1} trophy={i >= 1 ? 1 : 0} perfect={i >= 2 ? 1 : 0} pose={pose} />
                </Cut>
              );
            })}
          </g>
        )}
        {big &&
          (() => {
            const g = PO(t, tBig, 0.6);
            const peel = PE(t, tBars + 0.4, 0.8);
            const fly = P(t, tFree, 2.4);
            return (
              <g>
                <Cut id={270} x={lerp(1670, 960, g)} y={lerp(800, 470, g)} s={lerp(0.38, 1.25, g)} rot={lerp(-3, 1, g)} plain>
                  <Polaroid dev={1} smile={1} trophy={1} perfect={1} pose={pose} />
                  <g opacity={peel}>
                    <g transform="scale(1.05)">
                      <PostArt smile={0} trophy={0} perfect={0} pose={pose} real />
                    </g>
                  </g>
                  {Array.from({length: 7}).map((_, i) => {
                    const ti = tBars - 0.2 + i * 0.09;
                    if (t < ti) return null;
                    const k = PO(t, ti, 0.25);
                    const x = -210 + (i + 0.5) * (420 / 7);
                    return <rect key={i} x={x - 11} y={lerp(-700, -215, k)} width={22} height={430} fill={K.card} transform={`rotate(${(hash(i) - 0.5) * 3} ${x} 0)`} filter="url(#pshadow)" />;
                  })}
                </Cut>
                {fly > 0 && (
                  <g transform={`translate(${lerp(960, 2100, easeIn(fly) * 0.5 + fly * 0.5)} ${lerp(470, -150, Math.pow(fly, 0.8)) + Math.sin(fly * 9) * 14}) scale(${1.4})`}>
                    <Cut id={280} plain>
                      <polygon points={`0,0 -46,${-26 + Math.sin(pose * 1.6) * 22} -8,-6`} fill={K.mustard} />
                      <polygon points={`0,0 46,${-26 + Math.sin(pose * 1.6 + 0.5) * 22} 8,-6`} fill={K.mustardDark} />
                      <polygon points="-14,4 20,4 34,-10 0,12" fill={K.mustard} />
                    </Cut>
                  </g>
                )}
              </g>
            );
          })()}
        <Tape x={700} y={40} w={180} rot={-3} pat="washiC" opacity={big ? 0 : 1} />
      </Svg>
    </>
  );
};

// ════════════════════ Escena 7 — Recorte de periódico y vaso de papel ════════════════════
const CANDLES = (() => {
  const r = rng(77);
  const out: {o: number; c: number; h: number; l: number}[] = [];
  let v = 0.45;
  for (let i = 0; i < 40; i++) {
    const o = v;
    v = clamp(v + (r() - 0.47) * 0.3 + Math.sin(i * 0.45) * 0.06, 0.1, 0.9);
    out.push({o, c: v, h: Math.max(o, v) + r() * 0.05, l: Math.min(o, v) - r() * 0.05});
  }
  return out;
})();

export const Scene7: React.FC<SceneProps> = ({t, a}) => {
  const pose = usePose();
  const tGlass = S(12) - 0.35;
  const tMore = W(12, 'cuanto');
  const x0 = 330;
  const dx = 31;
  const y0 = 820;
  const hh = 520;
  const run = (t - a - 0.3) / 0.12;
  const n = clamp(Math.floor(run), 0, CANDLES.length - 1);
  const last = CANDLES[n];
  const fx = x0 + n * dx + dx / 2;
  const fy = y0 - last.c * hh;
  const swipe = easeInOut(clamp((t - tGlass) / 0.5));
  const hearts: number[] = [];
  let ti = tGlass + 0.4;
  while (ti < a + 30) {
    hearts.push(ti);
    ti += lerp(0.7, 0.16, clamp((ti - tMore + 1) / 4));
  }
  let level = 0.08;
  for (const h of hearts) if (t > h + 0.55) level += 0.1 * Math.exp(-(t - h - 0.55) * 2.2);
  level = Math.min(level, 0.7);
  const spin = (t - tGlass) * 60 + Math.pow(Math.max(0, t - tMore), 2) * 70;
  const gx = 960;
  const gTop = 330;
  const gBot = 780;
  return (
    <>
      <Page kind="kraft" />
      <Svg>
        {swipe < 1 && (
          <g transform={`translate(${-swipe * 2000} 0) rotate(${-swipe * 6} 960 540)`}>
            <g filter="url(#pshadow)">
              <polygon points={tornRect(200, 120, 1520, 850, 71, 16)} fill="#ece6d6" />
            </g>
            {/* columnas de texto del periódico */}
            {Array.from({length: 18}).map((_, i) => (
              <rect key={i} x={250} y={150 + i * 16} width={i % 6 === 5 ? 300 : 480} height={7} fill="#9c968a" opacity={0.6} />
            ))}
            {Array.from({length: 18}).map((_, i) => (
              <rect key={`r${i}`} x={1200} y={150 + i * 16} width={i % 5 === 4 ? 200 : 470} height={7} fill="#9c968a" opacity={0.6} />
            ))}
            <rect x={800} y={150} width={330} height={36} fill="#5a554c" opacity={0.75} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={x0} x2={1600} y1={y0 - i * 110} y2={y0 - i * 110} stroke="#b9b2a2" strokeWidth={1.5} />
            ))}
            {CANDLES.slice(0, n + 1).map((c, i) => {
              const up = c.c >= c.o;
              const x = x0 + i * dx + dx / 2;
              return (
                <g key={i}>
                  <line x1={x} x2={x} y1={y0 - c.h * hh} y2={y0 - c.l * hh} stroke="#3c3832" strokeWidth={2} />
                  <rect x={x - 10} y={y0 - Math.max(c.o, c.c) * hh} width={20} height={Math.max(3, Math.abs(c.c - c.o) * hh)} fill={up ? '#ece6d6' : '#3c3832'} stroke="#3c3832" strokeWidth={2} />
                </g>
              );
            })}
            <g filter="url(#boil)">
              <polyline points={CANDLES.slice(0, n + 1).map((c, i) => `${x0 + i * dx + dx / 2},${y0 - c.c * hh}`).join(' ')} fill="none" stroke="#f6e25c" strokeWidth={18} opacity={0.6} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <PFig id={300} x={fx} y={fy - 4} s={1.3} color="#a99c86" />
            {CANDLES.slice(Math.max(0, n - 3), n + 1).map((c, k) => {
              const i = Math.max(0, n - 3) + k;
              const age = run - i;
              const up = c.c >= c.o;
              return (
                <Cut key={i} id={310 + i} x={x0 + i * dx + 40} y={y0 - c.c * hh - 150 - age * 25} s={0.55 * easeOutBack(clamp(age * 2))} rot={up ? -8 : 172} opacity={clamp(1 - age / 3)}>
                  <Icon name="thumb" color={up ? K.sage : K.tomato} />
                </Cut>
              );
            })}
          </g>
        )}
        {swipe > 0 && (
          <g transform={`translate(${(1 - swipe) * 2000} 0)`}>
            <g filter="url(#boil)">
              <g transform={`translate(${gx} 560) rotate(${spin})`}>
                <path d="M0 -370 A370 370 0 1 1 -262 -262" fill="none" stroke={K.tomato} strokeWidth={10} strokeLinecap="round" />
                <path d="M-262 -262 L-268 -216 M-262 -262 L-216 -268" stroke={K.tomato} strokeWidth={10} strokeLinecap="round" />
              </g>
            </g>
            <clipPath id="sbCup">
              <path d={`M${gx - 170} ${gTop} L${gx + 170} ${gTop} L${gx + 120} ${gBot} L${gx - 120} ${gBot} Z`} />
            </clipPath>
            <Cut id={330} plain jitter={0.4}>
              <path d={`M${gx - 170} ${gTop} L${gx + 170} ${gTop} L${gx + 120} ${gBot} L${gx - 120} ${gBot} Z`} fill={K.white} />
            </Cut>
            <g clipPath="url(#sbCup)">
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={gx - 200 + i * 90} y={gTop} width={40} height={500} fill={K.tomatoLight} opacity={0.6} transform={`skewX(${(i - 2) * 3})`} />
              ))}
              <rect x={gx - 200} y={gBot - level * (gBot - gTop)} width={400} height={600} fill={K.tomato} opacity={0.85} />
            </g>
            <path d={`M${gx - 170} ${gTop} L${gx + 170} ${gTop}`} stroke="#ddd5c4" strokeWidth={10} strokeLinecap="round" />
            <g filter="url(#boil)">
              <path d={`M${gx - 30} ${gBot} l12 -30 l10 16 l14 -34 l8 20`} fill="none" stroke={K.ink} strokeWidth={4} />
            </g>
            {hearts.map((h, i) => {
              const u = P(t, h, 0.6);
              if (u <= 0 || u >= 1) return null;
              return (
                <Cut key={i} id={340 + i} x={gx + (hash(i) - 0.5) * 180} y={lerp(-60, gBot - level * (gBot - gTop) - 10, easeIn(u))} s={0.6} rot={(hash(i * 3) - 0.5) * 50}>
                  <Icon name="heart" color={K.tomato} />
                </Cut>
              );
            })}
            {Array.from({length: 40}).map((_, i) => {
              const t0 = tGlass + 0.9 + i * lerp(0.35, 0.12, clamp(i / 25));
              const u = P(t, t0, 0.7);
              if (u <= 0 || u >= 1) return null;
              return (
                <g key={i} transform={`translate(${gx - 6 + (hash(i) - 0.5) * 24} ${gBot + 12 + easeIn(u) * 300}) rotate(${hash(i + pose) * 360})`}>
                  <path d="M0 -9 C8 -2 8 6 0 9 C-8 6 -8 -2 0 -9 Z" fill={K.tomato} opacity={0.9 * (1 - u)} />
                </g>
              );
            })}
          </g>
        )}
      </Svg>
    </>
  );
};

// ════════════════════ Escena 8 — Mitades cosidas, letras recortadas, teatrito ════════════════════
export const Scene8: React.FC<SceneProps> = ({t, a}) => {
  const pose = usePose();
  const tAccept = W(13, 'aceptas') - 0.2;
  const tShadows = W(13, 'luces');
  const tFree = W(13, 'libre') - 0.25;
  const tText = S(14) - 0.35;
  const tStage = S(15) - 0.45;
  const tAct = W(15, 'dejar de actuar');
  const tLive = W(15, 'vivir para ti') - 0.3;
  const join = PE(t, tShadows, tFree - tShadows + 0.1);
  const gap = lerp(120, 0, join);
  const stitches = clamp((t - tFree + 0.6) / 1.4);
  const phase = t < tText ? 0 : t < tStage ? 1 : 2;
  const s = 4.4;
  const dis = P(t, tAccept, 1.3);
  // teatrito
  const walk1 = PE(t, tAct, 1.8);
  const walk2 = PE(t, tLive, 2.6);
  const figX = lerp(560, 1060, walk1) + walk2 * 380;
  const onStage = figX < 930;
  const hop = figX > 930 && figX < 1030 ? Math.sin(((figX - 930) / 100) * Math.PI) * 40 : 0;
  const walking = (walk1 > 0 && walk1 < 1) || (walk2 > 0 && walk2 < 1);
  const bob = walking ? -Math.abs(Math.sin(pose * 0.9)) * 10 : 0;
  const sun = PE(t, tStage + 0.4, 4.2);
  return (
    <>
      <Page kind={phase === 2 ? 'kraft' : 'paper'} tint={phase === 2 ? '#8f6a46' : undefined} />
      <Svg>
        {phase === 0 && (
          <g>
            <polygon points={tornRect(-100, 925, 2200, 300, 81, 14)} fill="#d9c09a" />
            <circle cx={960} cy={560} r={620} fill="url(#lamp)" opacity={join} />
            <g transform={`translate(960 925)`}>
              <clipPath id="sbL">
                <rect x={-400} y={-700} width={400} height={800} />
              </clipPath>
              <clipPath id="sbR">
                <rect x={0} y={-700} width={400} height={800} />
              </clipPath>
              <g transform={`translate(${-gap / 2} 0)`} clipPath="url(#sbL)">
                <PFig id={400} x={0} y={0} s={s} color={K.mustard} />
              </g>
              <g transform={`translate(${gap / 2} 0)`} clipPath="url(#sbR)">
                <PFig id={401} x={0} y={0} s={s} color={mixHex(K.card, K.mustard, PE(t, tFree + 0.8, 0.8))} />
              </g>
              {/* puntadas de hilo verde sobre la costura */}
              {Array.from({length: 11}).map((_, i) => {
                if (stitches * 11 < i + 1 || gap > 2) return null;
                const y = -60 - i * 36;
                return <line key={i} x1={-14} y1={y} x2={14} y2={y - 14} stroke={K.sage} strokeWidth={5} strokeLinecap="round" />;
              })}
            </g>
            {/* barrotes de cartulina que se rasgan */}
            {Array.from({length: 7}).map((_, i) => {
              const x = 960 - 330 + (i + 0.5) * (660 / 7);
              const u = clamp(dis * 1.5 - i * 0.07);
              const fly = easeIn(u);
              return (
                <g key={i} opacity={1 - u}>
                  <rect x={x - 12 - fly * 120 * (i % 2 ? 1 : -1)} y={150 - fly * 600} width={24} height={380} fill={K.card} transform={`rotate(${fly * 70 * (i % 2 ? 1 : -1)} ${x} 340)`} filter="url(#pshadow)" />
                  <rect x={x - 12 + fly * 140 * (i % 2 ? 1 : -1)} y={540 + fly * 500} width={24} height={400} fill={K.card} transform={`rotate(${-fly * 50 * (i % 2 ? 1 : -1)} ${x} 740)`} filter="url(#pshadow)" />
                </g>
              );
            })}
            {Array.from({length: 50}).map((_, i) => {
              const u = clamp(dis * 1.4 - hash(i) * 0.4);
              if (u <= 0 || u >= 1) return null;
              return <rect key={i} x={660 + hash(i * 3) * 600 + Math.sin(u * 6 + i) * 30} y={900 - hash(i * 5) * 600 - u * 300} width={10} height={6} fill={i % 3 ? '#e9b53c' : K.white} transform={`rotate(${hash(i + pose) * 360} ${660 + hash(i * 3) * 600} ${900 - hash(i * 5) * 600 - u * 300})`} opacity={1 - u} />;
            })}
          </g>
        )}
        {phase === 2 && (
          <Cam cx={lerp(960, 1200, PE(t, tAct, 5.5))} cy={560} z={lerp(1, 1.15, PE(t, tLive - 0.4, 4))}>
            {/* paisaje de papel rasgado */}
            <rect x={980} y={-200} width={1600} height={1040} fill="#f1d9b0" />
            <circle cx={1660} cy={lerp(980, 700, sun)} r={700} fill="url(#dawn)" opacity={sun} />
            <g transform={`translate(1660 ${lerp(1000, 690, sun)})`}>
              <line x1={0} y1={0} x2={0} y2={400} stroke={K.kraftDark} strokeWidth={10} />
              <Cut id={420} plain>
                <circle r={95} fill="#f4b942" />
              </Cut>
            </g>
            <polygon points={`980,840 ${Array.from({length: 13}).map((_, i) => `${980 + i * 130},${720 + Math.sin(i * 1.1) * 40 + (hash(i) - 0.5) * 18}`).join(' ')} 2600,840`} fill="#8fb59f" filter="url(#pshadow)" />
            <polygon points={`980,860 ${Array.from({length: 13}).map((_, i) => `${980 + i * 130},${790 + Math.sin(i * 0.8 + 2) * 30 + (hash(i * 3) - 0.5) * 18}`).join(' ')} 2600,860`} fill={K.sage} filter="url(#pshadow)" />
            <rect x={980} y={840} width={1600} height={300} fill="#6e8f74" />
            {/* caja de zapatos */}
            <rect x={110} y={-40} width={880} height={900} fill="#6b4a2c" />
            <rect x={150} y={20} width={800} height={760} fill="#3f2b1a" />
            <polygon points={`${560 - 50},20 ${560 + 50},20 ${560 + 240},780 ${560 - 240},780`} fill="#fff6d8" opacity={0.35 * (1 - walk1 * 0.7)} />
            <rect x={150} y={760} width={800} height={60} fill={K.kraft} />
            {[0, 1].map((side) => (
              <path
                key={side}
                d={side === 0 ? 'M150 20 L330 20 C300 260 300 520 250 780 L150 780 Z' : 'M950 20 L790 20 C820 260 820 520 870 780 L950 780 Z'}
                fill={K.tomato}
                filter="url(#pshadow)"
              />
            ))}
            {[180, 220, 260, 840, 880, 920].map((x, i) => (
              <line key={i} x1={x} y1={30} x2={x - 4} y2={770} stroke="#a83c2a" strokeWidth={5} />
            ))}
            <rect x={140} y={0} width={820} height={50} fill="#a83c2a" />
            <PFig id={421} x={figX} y={(onStage ? 768 : 842) - hop + bob} s={2.3} color={K.mustard} />
            {/* público de papel */}
            {Array.from({length: 11}).map((_, i) => (
              <g key={i} opacity={1 - walk2 * 0.6}>
                <ellipse cx={80 + i * 95} cy={1160} rx={52} ry={80} fill="#4a3220" />
                <circle cx={80 + i * 95} cy={1050} r={34} fill="#4a3220" />
              </g>
            ))}
          </Cam>
        )}
      </Svg>
      {phase === 1 && <Ransom lines={['La autenticidad es', 'una forma de', 'LIBERTAD']} reveal={P(t, tText, 2.2)} size={108} y={520} seed={14} highlight="LIBERTAD" />}
    </>
  );
};

// ════════════════════ Escena 9 — Diorama de café ════════════════════
const BG_PEOPLE = [140, 360, 560, 1400, 1610, 1820];
export const Scene9: React.FC<SceneProps> = ({t, a}) => {
  const tThink = S(17) - 0.3;
  const tLess = W(17, 'menos');
  const tMine = W(17, 'tú piensas') - 0.2;
  const tNice = W(17, 'agradable') - 0.2;
  const knob = lerp(120, -120, PE(t, tLess, 1.4));
  const z = lerp(1.03, 1.12, PE(t, a, 16));
  return (
    <>
      <Page kind="paper" tint="#ecdcc0" />
      <Svg>
        <Cam cx={980} cy={600} z={z}>
          <circle cx={985} cy={430} r={850} fill="url(#lamp)" />
          {/* gente de periódico al fondo */}
          <g opacity={0.5} filter="url(#soft8)">
            {BG_PEOPLE.map((x, i) => (
              <Fig key={i} x={x} y={800} s={1.7} color={K.newsDark} shadow={false} />
            ))}
          </g>
          {/* notas adhesivas grises */}
          {Array.from({length: 16}).map((_, i) => {
            const born = tThink + i * 0.13;
            if (t < born) return null;
            const fall = Math.max(0, t - (tLess + 0.2 + hash(i) * 1.0));
            const bx = BG_PEOPLE[i % 6] + (hash(i * 5) - 0.5) * 220;
            const by = 470 - hash(i * 9) * 200 + 0.5 * 2600 * fall * fall;
            if (by > 1300) return null;
            return (
              <Cut key={i} id={500 + i} x={bx} y={by} rot={(hash(i * 3) - 0.5) * 20 + fall * 240} s={easeOutBack(P(t, born, 0.25))} plain>
                <rect x={-50} y={-45} width={100} height={90} fill="#c9c6bf" />
                {[-20, 0, 20].map((d) => (
                  <circle key={d} cx={d} cy={0} r={6} fill={K.graphite} />
                ))}
              </Cut>
            );
          })}
          <polygon points={tornRect(-200, 822, 2400, 400, 91, 12)} fill="#c7a77d" />
          {/* lámpara de papel */}
          <line x1={985} y1={-200} x2={985} y2={330} stroke={K.ink} strokeWidth={3} />
          <Cut id={520} plain>
            <polygon points="925,330 1045,330 1095,410 875,410" fill={K.kraft} />
          </Cut>
          <polygon points="885,412 1085,412 1270,700 700,700" fill="url(#tissue)" opacity={0.35} />
          <PFig id={521} x={860} y={850} s={2.3} color={K.mustard} />
          {/* silla vacía de cartón */}
          <g filter="url(#pshadow)">
            <rect x={1300} y={560} width={14} height={260} fill={K.kraftDark} />
            <rect x={1250} y={712} width={150} height={14} fill={K.kraftDark} />
            <rect x={1262} y={726} width={12} height={96} fill={K.kraftDark} />
            <rect x={1378} y={726} width={12} height={96} fill={K.kraftDark} />
          </g>
          {/* mesa de cartón */}
          <Cut id={522} plain jitter={0.3}>
            <rect x={760} y={698} width={480} height={22} fill={K.kraft} />
            <rect x={984} y={720} width={22} height={102} fill={K.kraftDark} />
          </Cut>
          <Cut id={523} x={970} y={692} s={1} plain>
            <path d="M-50 0 L0 -12 L50 0 Z" fill={K.white} />
          </Cut>
          {/* mantel de papel con festón */}
          <path d={`M770 712 L1230 712 L1230 830 ${Array.from({length: 12}).map((_, i) => `Q${1230 - i * 38.3 - 19} 856 ${1230 - (i + 1) * 38.3} 830`).join(' ')} Z`} fill={K.tomatoLight} filter="url(#pshadow)" />
          {/* chapa como taza + vapor de algodón */}
          <Cut id={524} x={1110} y={672} plain>
            <rect x={-34} y={-24} width={68} height={50} rx={4} fill={K.tomato} />
            {Array.from({length: 9}).map((_, i) => (
              <rect key={i} x={-34 + i * 8} y={-24} width={3} height={50} fill="#a83c2a" />
            ))}
          </Cut>
          {[0, 1, 2, 3].map((i) => {
            const u = ((t * 0.35 + i * 0.25) % 1);
            return <circle key={i} cx={1110 + Math.sin(u * 6 + i) * 14} cy={630 - u * 160} r={14 + u * 14} fill={K.white} opacity={0.85 * (1 - u)} />;
          })}
          {/* nota propia en forma de corazón */}
          {t > tMine && (
            <Cut id={525} x={1000} y={490} s={1.7 * easeOutBack(P(t, tMine, 0.4))} rot={-6} plain>
              <Icon name="heart" color={K.mustard} />
            </Cut>
          )}
          {t > tNice && (
            <g filter="url(#boil)">
              <circle cx={860} cy={700} r={130 + 420 * PO(t, tNice, 2)} fill="none" stroke={K.mustard} strokeWidth={5} opacity={0.7 * (1 - P(t, tNice, 2))} strokeDasharray="20 14" />
            </g>
          )}
        </Cam>
        {/* tapa de frasco como perilla */}
        <g transform="translate(1660 900)" opacity={P(t, tThink + 0.6, 0.3)}>
          <g filter="url(#boil)">
            {Array.from({length: 13}).map((_, i) => {
              const an = ((-120 + i * 20) * Math.PI) / 180;
              return <line key={i} x1={Math.sin(an) * 100} y1={-Math.cos(an) * 100} x2={Math.sin(an) * 118} y2={-Math.cos(an) * 118} stroke={-120 + i * 20 <= knob ? K.ink : '#b3a68e'} strokeWidth={5} strokeLinecap="round" />;
            })}
          </g>
          <Cut id={530} rot={knob} plain>
            <circle r={78} fill="#c9ccd1" />
            {Array.from({length: 24}).map((_, i) => {
              const an = (i / 24) * Math.PI * 2;
              return <line key={i} x1={Math.cos(an) * 70} y1={Math.sin(an) * 70} x2={Math.cos(an) * 78} y2={Math.sin(an) * 78} stroke="#8d939b" strokeWidth={3} />;
            })}
            <circle r={58} fill="#dfe2e6" />
            <rect x={-5} y={-56} width={10} height={34} rx={4} fill={K.tomato} />
          </Cut>
        </g>
      </Svg>
    </>
  );
};

// ════════════════════ Escena 10 — Confetis que se voltean ════════════════════
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
  const pose = usePose();
  const t0 = S(18);
  const tClose = S(19) - 0.35;
  const tLight = W(19, 'liviana') - 0.2;
  const tSpread = W(19, 'contagiosa') - 0.3;
  const close = t >= tClose;
  const z = lerp(1.25, 1.0, PE(t, a, tClose - a));
  const drop = Math.max(0, t - tLight);
  const rise = PE(t, tLight, 1.4);
  const figY = lerp(680, 560, rise) + Math.sin(t * 2.2) * 8 * rise;
  return (
    <>
      <Page kind={close ? 'paper' : 'grid'} tint={close ? '#f0e4cc' : undefined} />
      <Svg>
        {!close && (
          <Cam z={z}>
            <g filter="url(#boil)">
              {[0, 1, 2, 3].map((k) => {
                const u = ((t - t0 - k * 1.5) % 6) / 3.5;
                if (t < t0 + k * 1.5 || u > 1) return null;
                return <circle key={k} cx={960} cy={540} r={60 + u * 1000} fill="none" stroke={K.graphite} strokeWidth={3} opacity={0.6 * (1 - u)} />;
              })}
            </g>
            {CROWD.map((p, i) => {
              const dist = Math.hypot(p.x - 960, p.y - 540);
              const tr = t0 + 0.2 + dist / 380 + hash(i) * 0.5;
              const k = PE(t, tr, 0.9);
              const toward = (Math.atan2(540 - p.y, 960 - p.x) * 180) / Math.PI;
              let from = p.d + noise(t * 0.3, i) * 30;
              while (toward - from > 180) from += 360;
              while (toward - from < -180) from -= 360;
              const fl = P(t, tr + 0.2, 0.5); // volteo de la ficha
              const flip = Math.cos(fl * Math.PI);
              return <Dot key={i} id={i} x={p.x} y={p.y} s={1.1} color={fl > 0.5 ? K.mustard : K.news} dir={lerp(from, toward, k)} flip={Math.abs(flip) < 0.15 ? 0.15 : Math.abs(flip)} />;
            })}
            <Dot x={960} y={540} s={1.35} color={K.mustard} dir={90 + Math.sin(t * 0.8) * 20} id={999} />
          </Cam>
        )}
        {close && (
          <g>
            <circle cx={960} cy={figY - 120} r={650} fill="url(#lamp)" opacity={0.5 + 0.5 * rise} />
            <polygon points={tornRect(-100, 950, 2200, 300, 101, 14)} fill="#d9c09a" />
            {rise > 0 && <line x1={960} y1={-20} x2={960} y2={figY + figHeadY(0) * 3 - 16 * 3} stroke={K.ink} strokeWidth={2} />}
            {[-1, 1].map((sd) => {
              const wx = 960 + sd * 140;
              const base = figY + 140;
              const yy = t < tLight ? base : Math.min(base + 0.5 * 2600 * drop * drop, 925);
              const bounce = t > tLight && yy >= 925 ? Math.abs(Math.sin((t - tLight) * 18)) * Math.exp(-(t - tLight) * 6) * 30 : 0;
              return (
                <g key={sd}>
                  {t < tLight && (
                    <path d={`M${960 + sd * 18} ${figY - 6} L${wx} ${yy - 58}`} stroke="#9aa3ab" strokeWidth={5} strokeDasharray="16 8" strokeLinecap="round" />
                  )}
                  <Cut id={600 + sd} x={wx} y={yy - bounce} plain>
                    <circle r={50} fill="#a7adb4" />
                    <circle r={50} fill="none" stroke="#7d848c" strokeWidth={4} />
                    <circle r={18} fill="#efe4cc" />
                  </Cut>
                </g>
              );
            })}
            <PFig id={610} x={960} y={figY} s={3} color={K.mustard} />
            {Array.from({length: 40}).map((_, i) => {
              const u = P(t, tSpread + hash(i) * 1.2, 2.2);
              if (u <= 0 || u >= 1) return null;
              const an = hash(i * 7) * Math.PI * 2;
              const r = 80 + easeOut(u) * 800;
              const x = 960 + Math.cos(an) * r;
              const y = figY - 130 + Math.sin(an) * r * 0.6;
              return <rect key={i} x={x} y={y} width={12} height={7} fill={i % 3 ? '#e9b53c' : K.tomato} transform={`rotate(${hash(i + pose) * 360} ${x} ${y})`} opacity={1 - u} />;
            })}
          </g>
        )}
        <Tape x={960} y={30} w={200} rot={2} pat="washiB" opacity={close ? 0 : 1} />
      </Svg>
    </>
  );
};

