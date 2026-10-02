import React from 'react';
import {S, W} from '../../estatus/timing';
import {ICONS} from '../../motion/kit';
import {
  ActTitle,
  Cam,
  Candle,
  clamp,
  Dust,
  eio,
  eo,
  Figure,
  Fog,
  Halo,
  handPos,
  hash,
  INK,
  Layer,
  lerp,
  mix,
  Rain,
  Rays,
  Ridge,
  Sky,
  Skyline,
  Stars,
  Tiny,
  Verse,
  wobble,
} from '../kit';
import type {SceneProps} from './A';

// ───────── utilidades locales ─────────
const HeartsUp: React.FC<{t: number; t0: number; x: number; y: number; n?: number; color?: string}> = ({t, t0, x, y, n = 14, color = '#FF9EC0'}) => {
  if (t < t0) return null;
  return (
    <g>
      {Array.from({length: n}, (_, i) => {
        const life = 3.5 + hash(i * 2.3) * 2;
        const age = (((t - t0 - hash(i * 5.1) * life) % life) + life) % life;
        const px = x + Math.sin(age * 1.6 + i) * 26 + (hash(i * 3.7) - 0.5) * 160 * (age / life);
        const py = y - age * 70;
        const o = Math.sin((age / life) * Math.PI) * clamp((t - t0) / 0.6);
        const sc = 0.16 + hash(i * 1.9) * 0.14;
        return (
          <g key={i} transform={`translate(${px} ${py}) scale(${sc})`} opacity={o}>
            <Halo x={0} y={0} r={100} color={color} opacity={0.5} />
            <path d={ICONS.heart} fill={color} />
          </g>
        );
      })}
    </g>
  );
};

/** Niña sentada en el suelo abrazando sus rodillas (origen: suelo bajo la cadera) */
const ChildHug: React.FC<{x: number; y: number; s: number; color?: string; t: number}> = ({x, y, s, color = INK, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-30 0 C-40 -40 -34 -92 -8 -122 C6 -136 26 -134 36 -120 L74 -86 C82 -76 82 -62 74 -50 L86 -8 C88 0 82 2 74 2 Z" fill={color} />
    <path d="M60 -96 C72 -70 74 -50 70 -40" stroke={color} strokeWidth={16} fill="none" strokeLinecap="round" />
    <ellipse cx={30 + Math.sin(t * 0.8) * 1.5} cy={-144} rx={26} ry={28} fill={color} />
    <path d="M10 -160 C-6 -150 -14 -128 -12 -100 L6 -120 Z" fill={color} />
    <circle cx={8} cy={-166} r={12} fill={color} />
  </g>
);

const Phone: React.FC = () => (
  <g>
    <rect x={-7} y={-16} width={14} height={25} rx={2.5} fill="#0B0F1A" />
    <rect x={-5.5} y={-14} width={11} height={20} rx={1.5} fill="#A6F2FF" />
  </g>
);

const Firefly: React.FC<{x: number; y: number; t: number; on: number}> = ({x, y, t, on}) => {
  if (on <= 0) return null;
  const jx = Math.sin(t * 17) * 2 + Math.sin(t * 5.3) * 5;
  const jy = Math.cos(t * 13) * 2 + Math.sin(t * 3.1) * 6;
  const b = 0.7 + 0.3 * Math.sin(t * 9);
  return (
    <g opacity={on}>
      <Halo x={x + jx} y={y + jy} r={60} color="#FFD27A" opacity={0.7 * b} />
      <circle cx={x + jx} cy={y + jy} r={4.5} fill="#FFF4D0" />
    </g>
  );
};

// ───────── Escena 7: la niña de la vela ─────────
const CAR = 'M-150 -10 L-150 -40 C-150 -52 -140 -58 -120 -60 L-70 -64 L-30 -100 C-20 -108 -10 -110 10 -110 L80 -110 C100 -110 112 -104 124 -92 L156 -62 C170 -60 178 -54 180 -44 L182 -10 Z';

const Win: React.FC<{cx: number; cy: number; on: number; id: string; bg: [number, string][]; children: React.ReactNode}> = ({cx, cy, on, id, bg, children}) => {
  const w = 600;
  const h = 330;
  const x = cx - w / 2;
  const y = cy - h / 2;
  return (
    <g>
      <Halo x={cx} y={cy} r={560} color="#FFB870" opacity={0.22 * on} />
      <defs>
        <linearGradient id={`win-${id}`} x1="0" y1="0" x2="0" y2="1">
          {bg.map(([o, c], i) => (
            <stop key={i} offset={o} stopColor={c} />
          ))}
        </linearGradient>
        <clipPath id={`clip-${id}`}>
          <rect x={x} y={y} width={w} height={h} />
        </clipPath>
      </defs>
      <rect x={x} y={y} width={w} height={h} fill="#0A0712" />
      <g opacity={on} clipPath={`url(#clip-${id})`}>
        <rect x={x} y={y} width={w} height={h} fill={`url(#win-${id})`} />
        {children}
      </g>
      <rect x={x} y={y} width={w} height={h} fill="none" stroke="#07040C" strokeWidth={18} />
      <rect x={x - 30} y={y + h + 8} width={w + 60} height={16} fill="#07040C" />
    </g>
  );
};

export const Rooftop: React.FC<SceneProps> = ({t, a, b}) => {
  const tB = S(12);
  const tC = S(13) - 0.3;
  const WX = 1000;
  const WY = 860;
  const WS = 1.2;
  const arm: [number, number] = [40, 110];
  const hp = handPos(WX, WY, WS, 1, arm);
  const chest = {x: WX + 14, y: WY - WS * 240};
  const black = eo(t, tB + 1.5, 0.8);
  const iris = eo(t, tB + 1.9, 1.3);
  const cIn = eio(t, tC, 0.9);
  const tV = W(13, 'vecino');
  const tA = W(13, 'amigo');
  const tCo = W(13, 'compañero');
  const on1 = eo(t, tV - 0.2, 0.6);
  const on2 = eo(t, tA - 0.2, 0.6);
  const on3 = eo(t, tCo - 0.2, 0.6);
  const polish = Math.sin(t * 7);
  return (
    <g>
      {/* A · la azotea */}
      {t < tB + 2.6 ? (
        <g>
          <Cam t={t} keys={[[a, 960, 560, 1.0], [tB + 0.2, 990, 580, 1.1], [tB + 2.4, chest.x, chest.y, 9]]}>
            <Layer depth={0.15}>
              <Sky id="s7" stops={[[0, '#0A0618'], [0.5, '#2A1646'], [0.8, '#5A2F62'], [1, '#8A4A6A']]} />
              <Stars t={t} n={70} y1={420} opacity={0.5} />
            </Layer>
            <Layer depth={0.3}>
              <Skyline seed={23} y={760} color="#24163A" hMin={120} hMax={300} win="#FFC9E0" winP={0.07} t={t} />
              <Fog y={740} h={160} color="#6A3A72" opacity={0.35} />
            </Layer>
            <Layer depth={0.5}>
              <Skyline seed={27} y={820} color="#160C26" hMin={180} hMax={420} win="#9EF0FF" winP={0.09} t={t} />
            </Layer>
            <Layer depth={1}>
              <rect x={-300} y={WY} width={2500} height={600} fill={INK} />
              <rect x={-300} y={WY - 40} width={2500} height={40} fill={INK} />
              {/* depósito de agua y antena */}
              <path d="M1440 820 L1460 700 M1600 820 L1580 700 M1450 760 L1590 760" stroke={INK} strokeWidth={8} />
              <path d="M1430 700 L1430 560 C1430 540 1610 540 1610 560 L1610 700 Z M1420 560 L1520 500 L1620 560 Z" fill={INK} />
              <path d="M380 820 L380 520 M350 580 L410 580 M360 630 L400 630" stroke={INK} strokeWidth={6} />
              <circle cx={380} cy={516} r={5} fill="#FF4A6A" opacity={0.5 + 0.5 * Math.sin(t * 3)} />
              <Halo x={hp.x + 10} y={hp.y - 10} r={220} color="#7FE6FF" opacity={0.45} />
              <Figure x={WX} y={WY} s={WS} face={1} hair="long" armF={arm} armB={[-8, 30]} rim={{color: '#7FE6FF', dx: 1.6, dy: 0, opacity: 0.85}} hold={<Phone />} />
              <HeartsUp t={t} t0={a + 0.8} x={hp.x} y={hp.y - 20} />
            </Layer>
          </Cam>
          {black > 0 ? <rect x={0} y={0} width={1920} height={1080} fill={INK} opacity={black} /> : null}
          <Verse x={960} y={250} text="¿vanidad? ¿frivolidad?" t={t} at={W(11, 'vanidad') - 0.3} out={tB - 0.2} size={54} color="#F0E4F4" glow="rgba(200,120,220,0.4)" />
        </g>
      ) : null}
      {/* B · dentro del pecho: la niña con la vela */}
      {t > tB + 1.8 && t < tC + 1.0 ? (
        <g opacity={1 - cIn}>
          <defs>
            <clipPath id="iris7">
              <circle cx={960} cy={560} r={iris * 1150} />
            </clipPath>
            <radialGradient id="room7" cx="0.56" cy="0.66" r="0.8">
              <stop offset="0" stopColor="#4A2418" />
              <stop offset="0.45" stopColor="#1A0C10" />
              <stop offset="1" stopColor="#050306" />
            </radialGradient>
          </defs>
          <g clipPath="url(#iris7)">
            <Cam t={t} keys={[[tB + 1.9, 960, 560, 1.15], [tC + 1, 960, 600, 1.0]]}>
              <Layer depth={1}>
                <rect x={-200} y={-200} width={2320} height={1480} fill="url(#room7)" />
                <rect x={-200} y={780} width={2320} height={400} fill="#0A0508" />
                <Halo x={1080} y={760} r={500} color="#FF9A4A" opacity={0.25} />
                <g transform="translate(2 0)" opacity={0.85}>
                  <ChildHug x={880} y={784} s={1.5} color="#FFB46A" t={t} />
                </g>
                <ChildHug x={878} y={784} s={1.5} t={t} />
                <Candle x={1090} y={784} s={1.3} t={t} />
                <path d="M880 784 L560 800 L520 830 L900 800 Z" fill="#000" opacity={0.4} />
                <Dust t={t} n={26} opacity={0.4} color="#FFD8A0" area={[600, 300, 900, 500]} />
              </Layer>
            </Cam>
          </g>
          <Verse x={960} y={250} text="una vulnerabilidad especialmente intensa" t={t} at={W(12, 'vulnerabilidad') - 0.3} out={W(12, 'necesidad') - 0.5} size={50} color="#FFE6CC" glow="rgba(255,170,90,0.45)" />
          <Verse x={960} y={250} text="necesidad de amor y reconocimiento" t={t} at={W(12, 'necesidad') - 0.2} out={tC} size={50} color="#FFE6CC" glow="rgba(255,170,90,0.45)" />
        </g>
      ) : null}
      {/* C · el edificio: tres ventanas, la misma luciérnaga */}
      {t > tC ? (
        <g opacity={cIn}>
          <Cam
            t={t}
            keys={[
              [tC, 960, 300, 1.15],
              [tA - 0.4, 960, 300, 1.08],
              [tA + 0.3, 960, 760, 1.08],
              [tCo - 0.4, 960, 760, 1.08],
              [tCo + 0.3, 960, 1220, 1.08],
              [tCo + 0.9, 960, 1200, 1.04],
              [b + 0.6, 960, 760, 0.6],
            ]}
          >
            <Layer depth={1}>
              <rect x={-1400} y={-600} width={4720} height={2600} fill="#140C22" />
              {Array.from({length: 64}, (_, k) => (
                <rect key={k} x={-1400} y={-600 + k * 40} width={4720} height={2} fill="#1C1230" />
              ))}
              {/* 1 · el vecino y su coche */}
              <Win cx={960} cy={300} on={on1} id="w71" bg={[[0, '#FFD89A'], [1, '#C8743A']]}>
                <g transform="translate(1020 455) scale(1.0)">
                  <path d={CAR} fill={INK} />
                  <circle cx={-95} cy={-10} r={28} fill={INK} />
                  <circle cx={120} cy={-10} r={28} fill={INK} />
                  <path d="M-10 -96 L-26 -66 L60 -66 L60 -96 Z M74 -96 L74 -66 L140 -66 L112 -94 Z" fill="#FFE7B8" opacity={0.35} />
                </g>
                <Figure x={790} y={465} s={0.72} face={1} armF={[70 + polish * 16, 30 + polish * 14]} hold={<rect x={-6} y={-6} width={14} height={10} fill={INK} />} />
                <Firefly x={810} y={330} t={t} on={on1} />
              </Win>
              {/* 2 · el amigo en la playa */}
              <Win cx={960} cy={760} on={on2} id="w72" bg={[[0, '#FF7E66'], [0.5, '#FFC77A'], [0.56, '#FFD9A0'], [0.565, '#4A2E5E'], [1, '#2A1A40']]}>
                <circle cx={1120} cy={782} r={62} fill="#FFF0C8" />
                <Halo x={1120} y={782} r={260} color="#FFE2A0" opacity={0.5} />
                <rect x={660} y={781} width={600} height={140} fill="#3E2652" />
                {Array.from({length: 7}, (_, k) => (
                  <rect key={k} x={1060 + Math.sin(t * 2 + k) * 10} y={790 + k * 9} width={120 - k * 12} height={2.5} fill="#FFD9A0" opacity={0.6} />
                ))}
                <path d="M700 925 C706 860 716 800 744 740" stroke={INK} strokeWidth={10} fill="none" />
                <path d="M744 740 C710 730 690 744 676 766 M744 740 C760 716 790 712 812 724 M744 740 C736 712 748 692 770 686 M744 740 C720 722 700 712 680 718" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
                <Figure x={880} y={925} s={0.74} face={1} armF={[162, -8]} hold={<Phone />} />
                <Halo x={handPos(880, 925, 0.74, 1, [162, -8]).x} y={handPos(880, 925, 0.74, 1, [162, -8]).y} r={60} color="#FFFFFF" opacity={0.4 + 0.4 * Math.max(0, Math.sin(t * 2.4))} />
                <Firefly x={900} y={790} t={t + 1} on={on2} />
              </Win>
              {/* 3 · el compañero frente al espejo */}
              <Win cx={960} cy={1220} on={on3} id="w73" bg={[[0, '#E8EDF7'], [1, '#9AA6C2']]}>
                <path d="M690 1100 L860 1100" stroke={INK} strokeWidth={5} />
                {[0, 1, 2].map((k) => (
                  <g key={k} transform={`translate(${715 + k * 52} 1150) scale(0.55)`}>
                    <path d={ICONS.shirt} fill="#3A3F58" stroke="#3A3F58" strokeWidth={6} />
                  </g>
                ))}
                <defs>
                  <clipPath id="mirror7">
                    <ellipse cx={1150} cy={1230} rx={86} ry={140} />
                  </clipPath>
                </defs>
                <ellipse cx={1150} cy={1230} rx={86} ry={140} fill="#CBD5EA" />
                <g clipPath="url(#mirror7)">
                  <Figure x={1180} y={1385} s={0.82} face={-1} armF={[40, 120]} color="#4A5270" />
                </g>
                <ellipse cx={1150} cy={1230} rx={86} ry={140} fill="none" stroke="#3A3550" strokeWidth={10} />
                <Figure x={1000} y={1385} s={0.82} face={1} armF={[40, 120]} armB={[-10, 20]} holdB={<g><path d="M0 0 L6 14" stroke={INK} strokeWidth={1.5} /><rect x={2} y={14} width={10} height={14} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} /></g>} />
                <Firefly x={1020} y={1245} t={t + 2} on={on3} />
              </Win>
            </Layer>
          </Cam>
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 8: la cometa (Acto II) ─────────
const Kite: React.FC<{x: number; y: number; t: number; s?: number; glow?: number}> = ({x, y, t, s = 1, glow = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 1.3) * 10}) scale(${s})`}>
    <Halo x={0} y={0} r={160} color="#FFE08A" opacity={0.55 * glow} />
    <path d={ICONS.star} fill="#FFE7A0" transform="scale(1.3)" />
    {Array.from({length: 6}, (_, k) => {
      const tx = -k * 18 - 10;
      const ty = 50 + k * 20 + Math.sin(t * 3 + k * 0.8) * 8;
      return <path key={k} d={`M${tx - 7} ${ty - 5} L${tx + 7} ${ty + 5} M${tx + 7} ${ty - 5} L${tx - 7} ${ty + 5}`} stroke="#FFD27A" strokeWidth={4} strokeLinecap="round" />;
    })}
  </g>
);

const Door: React.FC<{x: number; y: number; s: number; t: number; i: number}> = ({x, y, s, t, i}) => {
  const open = 0.35 + 0.25 * Math.sin(t * 0.8 + i);
  return (
    <g transform={`translate(${x} ${y + Math.sin(t * 0.9 + i * 1.7) * 8}) scale(${s})`}>
      <Halo x={0} y={0} r={90} color="#FFE2A8" opacity={0.6} />
      <rect x={-17} y={-32} width={34} height={64} fill="#FFF3D0" />
      <path d={`M-17 -32 L${-17 + 34 * (1 - open)} ${-32 + 6 * open} L${-17 + 34 * (1 - open)} ${32 - 6 * open} L-17 32 Z`} fill="#5A3020" />
      <rect x={-20} y={-35} width={40} height={70} fill="none" stroke="#3A1E14" strokeWidth={3} />
    </g>
  );
};

export const KiteHill: React.FC<SceneProps> = ({t, a, b}) => {
  const tB = S(17) - 0.4;
  const kB = eio(t, tB, 1.0);
  const tDoors = W(16, 'oportunidades') - 0.8;
  const tSnap = W(18, 'cima');
  const kitePos = (u: number) => ({x: 980 + Math.sin(u * 0.6) * 110 + (u - a) * 5, y: 340 + Math.sin(u * 0.9) * 40});
  const kp = kitePos(t);
  const hp = handPos(520, 766, 0.6, 1, [150, 10]);
  // fase B: escalada
  const climb = eio(t, tB + 0.6, tSnap - 0.7 - (tB + 0.6));
  const slip = eio(t, tSnap - 0.15, 0.6);
  const u = lerp(0, 0.85, climb) - slip * 0.45;
  const cx = lerp(420, 800, u);
  const cy = lerp(872, 652, u);
  const bhp = handPos(cx, cy, 0.62, 1, [150, 10]);
  const kiteB = {x: 1150 + Math.sin(t * 0.8) * 40, y: 330 + Math.sin(t * 1.1) * 25};
  const fly = eio(t, tSnap, 1.6);
  const kbx = lerp(kiteB.x, 1272, fly);
  const kby = lerp(kiteB.y, 96, fly);
  return (
    <g>
      {kB < 1 ? (
        <g>
          <Cam t={t} keys={[[a, 900, 600, 1.06], [tDoors, 960, 540, 1.0], [tB + 1, 960, 500, 1.0]]}>
            <Layer depth={0.15}>
              <Sky id="s8" stops={[[0, '#3B2A5A'], [0.35, '#C46A5A'], [0.7, '#F2A65E'], [1, '#FFD58A']]} />
              <Halo x={1450} y={700} r={700} color="#FFD08A" opacity={0.5} />
              <circle cx={1450} cy={700} r={120} fill="#FFF0C8" />
              <Rays x={1450} y={700} t={t} n={12} len={1500} spread={150} angle={215} color="#FFE2B0" opacity={0.2} width={4} />
            </Layer>
            <Layer depth={0.4}>
              <Ridge seed={21} y={770} amp={60} color="#B4655A" opacity={0.85} />
              <Ridge seed={22} y={830} amp={40} color="#7A3E4E" />
            </Layer>
            <Layer depth={1}>
              {t > tDoors
                ? Array.from({length: 26}, (_, i) => {
                    const dx = 120 + hash(i * 4.1 + 3) * 1700;
                    const dy = 330 + hash(i * 6.7 + 1) * 280;
                    if (Math.abs(dx - 1450) < 170 && dy > 520) return null;
                    const k = eo(t, tDoors + hash(i * 2.9) * 1.6, 0.7);
                    return k > 0 ? <Door key={i} x={dx} y={dy} s={(0.9 + hash(i) * 0.8) * k} t={t} i={i} /> : null;
                  })
                : null}
              <path d="M-300 1300 L-300 860 C200 760 500 740 700 760 C900 780 1200 860 2300 900 L2300 1300 Z" fill={INK} />
              <path d={`M${hp.x} ${hp.y} Q${(hp.x + kp.x) / 2 + 40} ${(hp.y + kp.y) / 2 + 90} ${kp.x} ${kp.y + 10}`} stroke="#FFF3D6" strokeWidth={1.6} fill="none" opacity={0.8} />
              {Array.from({length: 24}, (_, k) => {
                const p = kitePos(t - k * 0.09);
                return <circle key={k} cx={p.x - 20} cy={p.y + 30 + k * 2} r={3.2 - k * 0.1} fill="#FFE7A0" opacity={(1 - k / 24) * 0.7} />;
              })}
              <Kite x={kp.x} y={kp.y} t={t} s={0.9} />
              <Figure x={520} y={766} s={1.0} child face={1} armF={[150, 10]} rim={{color: '#FFD08A', dx: 1.4, dy: -0.6, opacity: 0.9}} />
              <Dust t={t} n={30} opacity={0.5} color="#FFE6B0" />
            </Layer>
          </Cam>
          <Verse x={960} y={235} text="¡puedes hacer cualquier cosa!" t={t} at={W(14, 'podemos') - 0.4} out={S(16) - 0.5} size={58} color="#FFF4DC" glow="rgba(255,200,110,0.7)" />
          <Verse x={960} y={235} text="tantas oportunidades…" t={t} at={W(16, 'oportunidades') - 0.3} out={tB} size={54} color="#FFF4DC" glow="rgba(255,200,110,0.7)" />
        </g>
      ) : null}
      {kB > 0 ? (
        <g opacity={kB}>
          <Cam t={t} keys={[[tB, 900, 600, 1.1], [b, 960, 540, 1.0]]}>
            <Layer depth={0.15}>
              <Sky id="s8b" stops={[[0, '#0C0820'], [0.55, '#2A1A4A'], [1, '#6A3E6E']]} />
              <Stars t={t} n={90} y1={600} opacity={0.6} />
            </Layer>
            <Layer depth={0.4}>
              <Ridge seed={25} y={800} amp={90} color="#24183E" />
              <Fog y={800} h={200} color="#5A3A7A" opacity={0.35} />
            </Layer>
            <Layer depth={1}>
              <Halo x={1272} y={110} r={200 * fly + 10} color="#FFE08A" opacity={0.5 * fly} />
              <path
                d="M-200 1300 L-200 900 L300 905 L520 840 L700 700 L820 640 L900 520 L1000 440 L1080 330 L1160 250 L1230 160 L1272 118 L1310 150 L1380 230 L1500 330 L1650 420 L1800 520 L2200 700 L2200 1300 Z"
                fill="#110A1F"
              />
              <path d="M520 840 L700 700 L820 640 L900 520 L1000 440 L1080 330 L1160 250 L1230 160 L1272 118 L1310 150 L1380 230" stroke="#8A7AB8" strokeWidth={2} fill="none" opacity={0.6} />
              {t < tSnap ? (
                <path d={`M${bhp.x} ${bhp.y} Q${(bhp.x + kiteB.x) / 2} ${(bhp.y + kiteB.y) / 2 + 80} ${kiteB.x} ${kiteB.y + 10}`} stroke="#F3E6FF" strokeWidth={1.5} fill="none" opacity={0.8} />
              ) : (
                <g opacity={1 - eo(t, tSnap, 1.2)}>
                  <path d={`M${bhp.x} ${bhp.y} q30 ${40 + (t - tSnap) * 80} 60 ${90 + (t - tSnap) * 120}`} stroke="#F3E6FF" strokeWidth={1.5} fill="none" />
                  <circle cx={(bhp.x + kiteB.x) / 2} cy={(bhp.y + kiteB.y) / 2 + 40} r={20 * eo(t, tSnap, 0.3)} fill="#FFF3D6" opacity={1 - eo(t, tSnap, 0.4)} />
                </g>
              )}
              <Kite x={kbx} y={kby} t={t} s={lerp(0.8, 0.5, fly)} glow={1 + fly} />
              <Figure
                x={cx}
                y={cy}
                s={0.62}
                face={1}
                walk={climb < 1 && slip === 0 ? (t - tB) * 5 : undefined}
                kneel={slip > 0.6}
                armF={slip > 0 ? [lerp(150, 120, slip), 10] : [150, 10]}
                rot={14 - wobble(t, tSnap - 0.15, 22, 1.2, 3)}
                rim={{color: '#C9B8FF', dx: 1, dy: -1, opacity: 0.6}}
              />
            </Layer>
          </Cam>
          <Verse x={560} y={260} text="¿y si fallamos?" t={t} at={W(17, 'fallamos') - 0.4} out={tSnap - 0.8} size={56} color="#E8DEFF" glow="rgba(160,120,255,0.5)" />
          <Verse x={560} y={260} text="¿y si no llegas a la cima?" t={t} at={tSnap - 0.6} size={52} color="#E8DEFF" glow="rgba(160,120,255,0.5)" />
        </g>
      ) : null}
      <ActTitle t={t} at={a + 0.5} num="II" title="La promesa" dur={2.4} />
    </g>
  );
};

// ───────── Escena 9: dos caminos ─────────
const UMBRELLA = 'M-40 0 C-40 -26 -20 -40 0 -40 C20 -40 40 -26 40 0 C30 -8 20 -8 13 0 C7 -8 -7 -8 -13 0 C-20 -8 -30 -8 -40 0 Z M0 0 L0 30 C0 38 -10 38 -10 30';

const GoldCity: React.FC<{t: number; dim?: number; ground: string; gx1?: number}> = ({t, dim = 1, ground, gx1 = 1320}) => (
  <g>
    <g opacity={dim}>
      <Halo x={960} y={590} r={380} color="#FFD27A" opacity={0.6} />
      {Array.from({length: 13}, (_, k) => {
        const x = 830 + k * 21;
        const h = 24 + hash(k * 3.7 + 1) * 70 + (k === 6 ? 60 : 0);
        return <rect key={k} x={x} y={612 - h} width={17} height={h} fill={mix('#FFE7B0', '#FFC860', hash(k))} />;
      })}
      <path d="M952 552 L960 500 L968 552 Z M900 570 L908 536 L916 570 Z" fill="#FFF0C8" />
      <Dust t={t} n={10} opacity={0.6} color="#FFF0C0" area={[800, 440, 320, 170]} />
    </g>
    <rect x={600} y={611} width={gx1 - 600} height={700} fill={ground} />
  </g>
);

export const TwoPaths: React.FC<SceneProps> = ({t, a, b}) => {
  const tEdu = W(20, 'educación');
  const tSal = W(20, 'salud');
  const tEst = W(20, 'estabilidad');
  const tCar = W(20, 'carencias');
  const tRule = W(21, 'misma regla');
  const tDes = W(21, 'desigualdades');
  const tilt = eio(t, tDes - 0.2, 1.4);
  const roll = eio(t, tDes + 0.4, 2.0);
  const slam = eo(t, tRule - 0.3, 0.35);
  const keys: [number, number, number, number][] = [
    [a, 900, 540, 1.04],
    [b, 1010, 540, 1.04],
  ];
  const icons: [number, string, number, string][] = [
    [tEdu, ICONS.book, 250, 'educación'],
    [tSal, ICONS.medkit, 400, 'salud'],
    [tEst, UMBRELLA, 550, 'estabilidad'],
  ];
  const bx = lerp(1500, 1400, clamp((t - a) / (tDes - a)));
  const stoneX = bx + 34 + roll * 560;
  const stoneY = lerp(752, 868, clamp(roll * 5)) - Math.abs(Math.sin(roll * Math.PI * 4)) * 26 * (1 - roll) * clamp(roll * 5);
  return (
    <g>
      <defs>
        <clipPath id="cl9">
          <rect x={0} y={0} width={960} height={1080} />
        </clipPath>
        <clipPath id="cr9">
          <rect x={960} y={0} width={960} height={1080} />
        </clipPath>
      </defs>
      {/* izquierda: el sendero dorado */}
      <g clipPath="url(#cl9)">
        <Cam t={t} keys={keys}>
          <Layer depth={0.2}>
            <Sky id="s9a" stops={[[0, '#2A1A2E'], [0.45, '#B0603E'], [0.8, '#F0A85A'], [1, '#FFD890']]} />
          </Layer>
          <Layer depth={0.5}>
            <GoldCity t={t} ground="#5A2E1E" />
            <Ridge seed={33} y={640} amp={20} color="#7A3E2A" />
          </Layer>
          <Layer depth={1}>
            <rect x={-300} y={660} width={1500} height={600} fill="#3A1E16" />
            <path d="M60 1000 L560 1000 L930 640 L900 640 Z" fill="#C88A50" opacity={0.55} />
            {Array.from({length: 10}, (_, k) => {
              const v = k / 10;
              const y = lerp(990, 650, Math.pow(v, 0.7));
              return <path key={k} d={`M${lerp(70, 902, Math.pow(v, 0.7))} ${y} L${lerp(550, 928, Math.pow(v, 0.7))} ${y}`} stroke="#8A5A30" strokeWidth={2} opacity={0.5} />;
            })}
            {Array.from({length: 6}, (_, k) => {
              const uu = (((k / 6 - (t - a) * 0.025) % 1) + 1) % 1;
              const e = Math.pow(uu, 0.7);
              const lx = lerp(20, 880, e);
              const ly = lerp(1000, 640, e);
              const h = lerp(320, 30, e);
              return (
                <g key={k}>
                  <path d={`M${lx} ${ly} L${lx} ${ly - h}`} stroke={INK} strokeWidth={lerp(9, 1.5, e)} />
                  <Halo x={lx} y={ly - h} r={lerp(90, 14, e)} color="#FFD08A" opacity={0.8} />
                  <circle cx={lx} cy={ly - h} r={lerp(10, 2, e)} fill="#FFF0C8" />
                </g>
              );
            })}
            <Figure x={380} y={880} s={1.05} child face={1} walk={(t - a) * 6} rim={{color: '#FFD08A', dx: 1.2, dy: -0.6, opacity: 0.8}} />
            {icons.map(([at, d, ix, label], k) => {
              const o = eo(t, at - 0.2, 0.6);
              if (o <= 0) return null;
              const fy = 540 + Math.sin(t * 1.4 + k) * 8;
              return (
                <g key={k} opacity={o}>
                  <Halo x={ix} y={fy} r={70} color="#FFE2A0" opacity={0.6} />
                  <g transform={`translate(${ix} ${fy}) scale(${0.7 * o})`}>
                    <path d={d} fill="none" stroke="#FFF4DA" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                </g>
              );
            })}
          </Layer>
        </Cam>
        {icons.map(([at, , ix, label], k) => (
          <Verse key={k} x={ix - 40} y={640} text={label} t={t} at={at} out={tRule - 0.5} size={32} w={300} color="#FFF0D0" glow="rgba(255,200,120,0.6)" />
        ))}
      </g>
      {/* derecha: el acantilado bajo la lluvia */}
      <g clipPath="url(#cr9)">
        <Cam t={t} keys={keys}>
          <Layer depth={0.2}>
            <Sky id="s9b" stops={[[0, '#0A1018'], [0.6, '#2A3646'], [1, '#4A5868']]} />
          </Layer>
          <Layer depth={0.5}>
            <GoldCity t={t} dim={0.55} ground="#0E141C" gx1={1060} />
          </Layer>
          <Layer depth={1}>
            <g transform={`rotate(${tilt * 7} 1480 905)`}>
              <path d="M940 612 L1070 614 L1100 680 L1130 760 L1180 840 L1240 905 L2400 905 L2400 1500 L940 1500 Z" fill="#0E141C" />
              <path d="M1070 614 L1100 680 L1130 760 L1180 840 L1240 905" stroke="#3A4A5A" strokeWidth={2} fill="none" />
              <Figure x={bx} y={905} s={1.05} child face={-1} slump={0.6} walk={roll === 0 ? (t - a) * 2.4 : undefined} kneel={roll > 0.15} armF={roll > 0.1 ? [40, 30] : [-40, -95]} armB={roll > 0.1 ? [30, 30] : [-34, -100]} />
              <g transform={`translate(${stoneX} ${stoneY}) rotate(${roll * 540}) scale(1.25)`}>
                <path d="M-30 -4 C-32 -24 -10 -32 6 -30 C24 -28 32 -12 30 4 C28 22 10 30 -8 28 C-24 26 -28 14 -30 -4 Z" fill="#4A5460" stroke="#22282F" strokeWidth={3} />
              </g>
            </g>
            <Rain t={t} n={170} opacity={0.4} />
          </Layer>
        </Cam>
        <Verse x={1500} y={560} text="carencias" t={t} at={tCar - 0.2} out={tRule - 0.5} size={34} w={400} color="#C8D4E0" glow="rgba(120,150,190,0.4)" />
      </g>
      {/* costura dorada */}
      <Halo x={960} y={540} r={60} color="#FFD27A" opacity={0.25} />
      <rect x={959} y={138} width={2} height={804} fill="#FFE3A0" opacity={0.8} />
      <Verse x={960} y={250} text="no todos partimos del mismo lugar" t={t} at={W(19, 'no todos') - 0.3} out={S(20) - 0.3} size={52} />
      {slam > 0 ? (
        <g transform={`translate(0 ${(1 - slam) * -60 + wobble(t, tRule + 0.05, 6, 3, 6)})`} opacity={slam}>
          <defs>
            <linearGradient id="stone9" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9AA0A8" />
              <stop offset="1" stopColor="#5A5E66" />
            </linearGradient>
          </defs>
          <rect x={560} y={190} width={800} height={110} rx={10} fill="url(#stone9)" />
          <rect x={560} y={190} width={800} height={4} rx={2} fill="#C8CCD2" />
          <Verse x={960} y={262} text="LA MISMA REGLA PARA TODOS" t={t} at={tRule - 0.3} size={40} italic={false} weight={500} spacing="0.14em" color="#2A2D33" glow="rgba(255,255,255,0.2)" stagger={0.05} />
          {tilt > 0 ? <path d="M900 190 L920 225 L905 250 L935 300" stroke="#1A1C20" strokeWidth={3} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - tilt} /> : null}
        </g>
      ) : null}
      <Verse x={960} y={380} text="desigualdades estructurales" t={t} at={tDes - 0.2} size={50} color="#FFC6AE" glow="rgba(255,110,70,0.5)" />
    </g>
  );
};

// ───────── Escena 10: la biblioteca de las promesas ─────────
const BookBird: React.FC<{x: number; y: number; s: number; t: number; i: number; color: string; flap?: number; rot?: number}> = ({x, y, s, t, i, color, flap = 1, rot = 0}) => {
  const f = 25 + Math.sin(t * 9 + i * 1.3) * 40 * flap;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <g transform={`rotate(${-f})`}>
        <rect x={-46} y={-2} width={46} height={32} fill={color} transform="skewY(-8)" />
      </g>
      <g transform={`rotate(${f})`}>
        <rect x={0} y={-2} width={46} height={32} fill={color} transform="skewY(8)" />
      </g>
      <rect x={-3} y={-4} width={6} height={36} fill={mix(color, '#000000', 0.4)} />
    </g>
  );
};

const Shelves: React.FC<{x0: number; x1: number; seed: number; color: string; t: number; candles?: boolean}> = ({x0, x1, seed, color, t, candles}) => {
  const out: React.ReactNode[] = [];
  for (let row = 0; row < 14; row++) {
    const y = -260 + row * 112;
    out.push(<rect key={`s${row}`} x={x0} y={y} width={x1 - x0} height={10} fill={color} />);
    let x = x0 + 6;
    let k = 0;
    while (x < x1 - 10) {
      const w = 12 + hash(row * 97 + k * 3.1 + seed) * 16;
      const h = 54 + hash(row * 31 + k * 7.7 + seed) * 40;
      if (hash(row * 13 + k + seed) > 0.08) out.push(<rect key={`b${row}-${k}`} x={x} y={y - h} width={w - 2} height={h} fill={color} opacity={0.75 + hash(k * 1.7 + row) * 0.25} />);
      x += w;
      k++;
    }
    if (candles && hash(row * 5.5 + seed) > 0.55) out.push(<Candle key={`c${row}`} x={x0 + hash(row + seed) * (x1 - x0)} y={y - 4} s={0.45} t={t + row} glow={0.6} />);
  }
  out.push(<rect key="post0" x={x0 - 16} y={-400} width={18} height={2000} fill={color} />);
  out.push(<rect key="post1" x={x1} y={-400} width={18} height={2000} fill={color} />);
  return <g>{out}</g>;
};

export const Library: React.FC<SceneProps> = ({t, a, b}) => {
  const tFly = S(24) - 1.6;
  const tFall = S(25) - 0.3;
  const tOpen = S(26) - 0.5;
  const g = eio(t, tFall - 0.2, 2.5);
  const h1 = W(24, 'triunfar') - 0.5;
  const h2 = W(24, 'millonario') - 0.5;
  const rot = lerp(-3, 3, eio(t, a, b - a));
  const gold = mix('#FFD27A', '#7A808A', g);
  const fall = (x: number, y: number, i: number) => {
    if (t < tFall) return {x, y, r: 0};
    const d = t - tFall - hash(i * 3.3) * 0.6;
    if (d <= 0) return {x, y, r: 0};
    const ty = 812 - (i % 4) * 7;
    const yy = Math.min(ty, y + d * d * 90 + d * 60);
    const landed = yy >= ty;
    const xx = lerp(x, 600 + hash(i * 9.1) * 720, clamp(d / 3)) + (landed ? 0 : Math.sin(d * 3 + i) * 40);
    return {x: xx, y: yy, r: landed ? (hash(i) - 0.5) * 10 : Math.sin(d * 4 + i) * 50};
  };
  const openK = eo(t, tOpen, 1.0);
  return (
    <g>
      <Cam t={t} rot={rot} keys={[[a, 960, 520, 1.0], [tFall, 960, 560, 1.1], [b, 960, 640, 1.22]]}>
        <Layer depth={0.2}>
          <Sky id="s10" stops={[[0, mix('#1C120A', '#0E1014', g)], [0.6, mix('#3A2814', '#1E2228', g)], [1, mix('#4A3218', '#2A2E36', g)]]} />
          {/* vitral */}
          <g opacity={1 - g * 0.6}>
            <Halo x={960} y={420} r={520} color="#FFD27A" opacity={0.35} />
            <path d="M820 720 L820 330 C820 230 900 170 960 150 C1020 170 1100 230 1100 330 L1100 720 Z" fill="#E8A84A" />
            {[
              [840, 340, 50, 120, '#FFE08A'],
              [895, 300, 30, 160, '#5AB0A8'],
              [930, 260, 60, 200, '#FFD27A'],
              [995, 300, 30, 160, '#C85A4A'],
              [1030, 340, 50, 120, '#FFE08A'],
              [840, 470, 240, 110, '#F0B860'],
              [840, 590, 110, 120, '#5AB0A8'],
              [970, 590, 110, 120, '#C85A4A'],
            ].map(([x, y, w, h, c], k) => (
              <rect key={k} x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} opacity={0.75} />
            ))}
            <path d="M820 460 L1100 460 M820 580 L1100 580 M960 150 L960 720 M890 250 L890 720 M1030 250 L1030 720" stroke="#2A1A0C" strokeWidth={6} />
            <path d="M820 720 L820 330 C820 230 900 170 960 150 C1020 170 1100 230 1100 330 L1100 720 Z" fill="none" stroke="#1A1008" strokeWidth={14} />
          </g>
        </Layer>
        <Layer depth={0.35}>
          <Rays x={960} y={330} t={t} n={9} len={1000} spread={44} angle={90} color="#FFE2A0" opacity={0.26 * (1 - g * 0.7)} width={4} />
          <Shelves x0={-500} x1={700} seed={3} color={mix('#24180E', '#181A20', g)} t={t} />
          <Shelves x0={1220} x1={2420} seed={5} color={mix('#24180E', '#181A20', g)} t={t} />
        </Layer>
        <Layer depth={0.7}>
          <Shelves x0={-500} x1={480} seed={7} color={mix('#120C06', '#0E1014', g)} t={t} candles />
          <Shelves x0={1440} x1={2420} seed={9} color={mix('#120C06', '#0E1014', g)} t={t} candles />
          <Fog y={900} h={300} color={mix('#5A3A1A', '#3A4048', g)} opacity={0.4} />
        </Layer>
        <Layer depth={1}>
          {/* estante bajo y gris */}
          <rect x={540} y={820} width={840} height={16} fill="#2A2E36" />
          <rect x={560} y={836} width={12} height={200} fill="#2A2E36" />
          <rect x={1348} y={836} width={12} height={200} fill="#2A2E36" />
          {/* bandada de libros */}
          {t > tFly
            ? Array.from({length: 16}, (_, i) => {
                const sp = 160 + hash(i * 2.2) * 120;
                const x0 = -200 - hash(i * 5.7) * 600 + (t - tFly) * sp;
                const y0 = 260 + hash(i * 3.9) * 360 + Math.sin(t * 1.5 + i) * 30;
                const p = fall(x0, y0, i);
                return <BookBird key={i} x={p.x} y={p.y} s={0.45 + hash(i * 8.1) * 0.35} t={t} i={i} color={t > tFall ? mix(gold, '#5A606A', 0.5) : gold} flap={t > tFall ? 0.2 : 1} rot={p.r} />;
              })
            : null}
          {[
            [h1, 620, 480, 0],
            [h2, 1300, 560, 1],
          ].map(([at, x, y, i]) => {
            const k = eo(t, at, 0.8);
            if (k <= 0) return null;
            const p = fall(x + Math.sin(t * 0.8 + i) * 20, y + Math.sin(t * 1.2 + i) * 14, 20 + i);
            return (
              <g key={i}>
                {t < tFall ? <Halo x={p.x} y={p.y} r={170} color="#FFD27A" opacity={0.45 * k} /> : null}
                <BookBird x={p.x} y={p.y} s={1.15 * k} t={t} i={i} color={gold} flap={t > tFall ? 0.2 : 0.6} rot={p.r} />
              </g>
            );
          })}
          {/* el libro que se abre */}
          {t > tOpen - 1 ? (
            <g transform="translate(960 812)">
              {openK > 0 ? <Halo x={0} y={-30} r={260} color="#BFD2F0" opacity={0.35 * openK} /> : null}
              <path d={`M0 0 L${-80 * openK - 6} ${-6 - 30 * (1 - openK)} L${-80 * openK - 6} ${-8 - 30 * (1 - openK) - 40 * (1 - openK)} L0 -8 Z`} fill="#D8DEE8" />
              <path d={`M0 0 L${80 * openK + 6} ${-6 - 30 * (1 - openK)} L${80 * openK + 6} ${-8 - 30 * (1 - openK) - 40 * (1 - openK)} L0 -8 Z`} fill="#C8CED8" />
              <rect x={-2} y={-10} width={4} height={12} fill="#5A606A" />
            </g>
          ) : null}
          <Dust t={t} n={50} opacity={0.5} color={mix('#FFE6B0', '#C8D0DA', g)} />
        </Layer>
      </Cam>
      <Verse x={620} y={370} text="Cómo triunfar en 15 minutos" t={t} at={h1 + 0.2} out={tFall} size={42} w={700} color="#FFF0C8" glow="rgba(255,200,100,0.7)" />
      <Verse x={1300} y={450} text="Millonario de la noche a la mañana" t={t} at={h2 + 0.2} out={tFall} size={42} w={760} color="#FFF0C8" glow="rgba(255,200,100,0.7)" />
      <Verse x={960} y={560} text="Cómo lidiar con una baja autoestima" t={t} at={W(26, 'lidiar') - 0.3} size={50} color="#D6DEEA" glow="rgba(150,175,215,0.5)" />
    </g>
  );
};

// ───────── Escena 11: el reloj de arena ─────────
const topHalf = (y: number) => 12 + 178 * Math.pow(clamp((540 - y) / 360), 0.55);

export const Hourglass: React.FC<SceneProps> = ({t, a, b}) => {
  const tIns = W(28, 'insatisfacción');
  const tAfl = W(28, 'aflicción');
  const tAll = W(28, 'tenerlo');
  const tMin = W(28, 'minoría');
  const wind = eo(t, tIns - 1.2, 1.5);
  const PERIOD = 1.3;
  const nFallen = Math.max(0, Math.floor((t - (a + 0.8)) / PERIOD));
  const crowd: React.ReactNode[] = [];
  for (let r = 0; r < 9; r++) {
    const y = 500 - r * 24;
    const hw = topHalf(y) - 10;
    const n = Math.max(1, Math.floor((hw * 2) / 15));
    for (let k = 0; k < n; k++) {
      const x = 960 - hw + ((k + 0.5) * (hw * 2)) / n + Math.sin(t * 2 + k + r) * 1.2;
      crowd.push(<Tiny key={`${r}-${k}`} x={x} y={y + 6} s={0.62} color={mix('#4A4250', '#8A7E86', hash(r * 31 + k))} />);
    }
  }
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 540, 1.0], [b, 960, 540, 1.16]]}>
        <Layer depth={0.2}>
          <Sky id="s11" stops={[[0, '#1C1230'], [0.45, '#5A2E56'], [0.75, '#C2706A'], [1, '#F2A870']]} />
          <Stars t={t} n={40} y1={300} opacity={0.4} />
          <Halo x={960} y={830} r={760} color="#FFB070" opacity={0.45} />
          <circle cx={960} cy={830} r={240} fill="#FFC890" />
        </Layer>
        <Layer depth={0.45}>
          <Ridge seed={41} y={860} amp={50} color="#5A2E3A" />
          <Ridge seed={43} y={890} amp={36} color="#3A1E2A" />
        </Layer>
        <Layer depth={1}>
          {/* cristal */}
          <path d="M770 180 C770 360 940 470 950 540 C940 610 770 720 770 900 L1150 900 C1150 720 980 610 970 540 C980 470 1150 360 1150 180 Z" fill="#FFF4E8" opacity={0.08} />
          {crowd}
          {/* los pocos dorados que cruzan */}
          {Array.from({length: Math.min(nFallen + 1, 9)}, (_, i) => {
            const t0 = a + 0.8 + i * PERIOD;
            const d = t - t0;
            if (d < 0) return null;
            const landY = 896 - Math.floor(i / 5) * 2;
            const landX = 960 + ((i % 5) - 2) * 22 + Math.floor(i / 5) * 11;
            const y = Math.min(landY, 545 + d * d * 500);
            const x = d * d * 500 + 545 >= landY ? landX : lerp(960, landX, clamp((y - 545) / (landY - 545)));
            return (
              <g key={i}>
                <Halo x={x} y={y - 16} r={40} color="#FFD27A" opacity={0.7} />
                <Tiny x={x} y={y} s={0.62} color="#FFD98A" />
              </g>
            );
          })}
          <path d="M770 180 C770 360 940 470 950 540 C940 610 770 720 770 900 L1150 900 C1150 720 980 610 970 540 C980 470 1150 360 1150 180 Z" fill="none" stroke="#FFE8D0" strokeWidth={3} opacity={0.55} />
          <path d="M800 210 C805 330 880 420 930 500" stroke="#FFFFFF" strokeWidth={5} opacity={0.18} fill="none" strokeLinecap="round" />
          {/* armazón */}
          <rect x={720} y={150} width={480} height={32} rx={6} fill={INK} />
          <rect x={720} y={898} width={480} height={34} rx={6} fill={INK} />
          <rect x={734} y={180} width={16} height={720} fill={INK} />
          <rect x={1170} y={180} width={16} height={720} fill={INK} />
          <Ridge seed={45} y={940} amp={18} color={INK} />
          {/* viento con arena */}
          {wind > 0
            ? Array.from({length: 90}, (_, i) => {
                const sp = 500 + hash(i * 3.3) * 500;
                const x = ((hash(i * 7.1) * 2400 + t * sp) % 2400) - 240;
                const y = 560 + hash(i * 2.7) * 380 + Math.sin(t * 2 + i) * 14;
                const l = 20 + hash(i) * 50;
                return <path key={i} d={`M${x} ${y} l${l} ${-l * 0.08}`} stroke="#F6C890" strokeWidth={1.6} opacity={wind * (0.25 + hash(i * 5) * 0.5)} />;
              })
            : null}
        </Layer>
      </Cam>
      <Verse x={420} y={360} text="ambos están relacionados" t={t} at={S(27) + 0.1} out={tAll - 0.5} size={44} w={720} />
      <Verse x={420} y={360} text="«podrías tenerlo todo»…" t={t} at={tAll - 0.3} out={tIns - 0.6} size={48} w={720} color="#FFF0C8" glow="rgba(255,200,110,0.6)" />
      <Verse x={1500} y={360} text="…pero solo unos pocos lo logran" t={t} at={tMin - 0.3} out={tIns - 0.6} size={44} w={720} />
      <g transform={`translate(${(t - tIns) * 22} 0)`}>
        <Verse x={420} y={640} text="insatisfacción" t={t} at={tIns - 0.2} size={58} w={720} color="#FFD8B0" glow="rgba(255,150,90,0.5)" />
      </g>
      <g transform={`translate(${(t - tAfl) * 22} 0)`}>
        <Verse x={1500} y={640} text="aflicción" t={t} at={tAfl - 0.2} size={58} w={720} color="#FFD8B0" glow="rgba(255,150,90,0.5)" />
      </g>
    </g>
  );
};

// ───────── Escena 12: los hilos (Acto III) ─────────
const Horse: React.FC<{x: number; y: number; s?: number; face?: 1 | -1; walk?: number; color?: string; rot?: number}> = ({x, y, s = 1, face = 1, walk = 0, color = INK, rot = 0}) => {
  const L = (bx: number, ph: number) => {
    const sw = Math.sin(walk + ph) * 16;
    return `M${bx} -120 L${bx + sw * 0.6} -62 L${bx + sw} 0`;
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s * face} ${s})`}>
      {[L(-88, 0), L(-62, Math.PI), L(52, Math.PI), L(76, 0)].map((d, k) => (
        <path key={k} d={d} stroke={color} strokeWidth={15} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      ))}
      <ellipse cx={-8} cy={-142} rx={104} ry={36} fill={color} />
      <path d="M58 -162 L104 -236 C110 -248 124 -254 136 -250 L176 -214 C180 -206 174 -200 166 -202 L134 -214 L104 -150 Z" fill={color} />
      <path d="M114 -246 L118 -268 L126 -250 Z" fill={color} />
      <path d={`M-110 -150 C-130 -130 ${-136 + Math.sin(walk) * 6} -100 ${-128 + Math.sin(walk) * 8} -70`} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Ox: React.FC<{x: number; y: number; s?: number; walk?: number; color?: string; rot?: number}> = ({x, y, s = 1, walk = 0, color = INK, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[-80, -56, 50, 72].map((bx, k) => {
      const sw = Math.sin(walk + (k % 2 ? Math.PI : 0)) * 10;
      return <path key={k} d={`M${bx} -100 L${bx + sw} 0`} stroke={color} strokeWidth={17} strokeLinecap="round" />;
    })}
    <ellipse cx={-10} cy={-116} rx={112} ry={44} fill={color} />
    <path d="M-60 -150 C-30 -170 20 -168 50 -150 Z" fill={color} />
    <path d="M80 -136 L140 -126 C152 -116 152 -96 140 -88 L104 -88 L80 -104 Z" fill={color} />
    <path d="M116 -132 C120 -152 136 -160 150 -152 M106 -132 C100 -150 90 -156 80 -152" stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" />
    <path d="M-120 -120 C-134 -100 -136 -80 -130 -60" stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

const Castle: React.FC<{x: number; y: number; color?: string}> = ({x, y, color = INK}) => (
  <g transform={`translate(${x} ${y})`} fill={color}>
    <rect x={-120} y={-150} width={240} height={150} />
    <rect x={-160} y={-230} width={70} height={230} />
    <rect x={90} y={-230} width={70} height={230} />
    <rect x={-30} y={-290} width={60} height={140} />
    <path d="M-170 -230 L-125 -290 L-80 -230 Z M80 -230 L125 -290 L170 -230 Z M-40 -290 L0 -350 L40 -290 Z" />
    {Array.from({length: 6}, (_, k) => (
      <rect key={k} x={-120 + k * 44} y={-168} width={22} height={18} />
    ))}
    <path d="M0 -350 L0 -390 L34 -380 L0 -370" />
  </g>
);

const Scissors: React.FC<{x: number; y: number; open: number; rot?: number}> = ({x, y, open, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    {[1, -1].map((sg) => (
      <g key={sg} transform={`rotate(${sg * open * 16})`}>
        <path d={`M0 0 L-230 ${sg * 6} L-232 ${sg * 2} L0 ${-sg * 6} Z`} fill="#1A1008" />
        <path d={`M10 ${sg * 4} L60 ${sg * 26}`} stroke="#1A1008" strokeWidth={8} />
        <ellipse cx={82} cy={sg * 34} rx={28} ry={18} fill="none" stroke="#1A1008" strokeWidth={8} transform={`rotate(${sg * 20} 82 ${sg * 34})`} />
      </g>
    ))}
    <circle cx={0} cy={0} r={6} fill="#8A6A3A" />
  </g>
);

export const Strings: React.FC<SceneProps> = ({t, a, b}) => {
  const tMer = W(32, 'meritocracias');
  const tCut = tMer - 0.4;
  const tSnip = tCut + 0.6;
  const kB = eio(t, tSnip + 0.5, 1.1);
  const fl = 1 + Math.sin(t * 11) * 0.04 + Math.sin(t * 17.3) * 0.03;
  const drop = t > tSnip ? 0.5 * 1800 * Math.pow(t - tSnip, 2) : 0;
  const tumble = t > tSnip ? (t - tSnip) * 60 : 0;
  const sway = Math.sin(t * 1.4) * 6;
  // posiciones del teatro
  const pX = 470 + (t - a) * 6;
  const horseX = 1450 - (t - a) * 14;
  const ctrl1 = {x: 520 + sway, y: 200};
  const ctrl2 = {x: 1330 + sway * 0.8, y: 200};
  const strings: [number, number, number, number][] = [
    [ctrl1.x - 70, ctrl1.y, pX + 10, 470 + drop],
    [ctrl1.x + 70, ctrl1.y, pX + 70, 580 + drop],
    [ctrl1.x + 10, ctrl1.y, pX + 230, 690 + drop],
    [ctrl2.x - 80, ctrl2.y, horseX - 70, 600 + drop],
    [ctrl2.x + 20, ctrl2.y, horseX + 10, 520 + drop],
    [ctrl2.x + 90, ctrl2.y, horseX + 100, 690 + drop],
  ];
  const cut = 330;
  return (
    <g>
      {kB < 1 ? (
        <g>
          <defs>
            <radialGradient id="cloth12" cx="0.5" cy="0.55" r="0.7">
              <stop offset="0" stopColor={mix('#F6C680', '#FFE0A8', fl - 1 + 0.5)} />
              <stop offset="0.6" stopColor="#D08A44" />
              <stop offset="1" stopColor="#5A2E12" />
            </radialGradient>
          </defs>
          <Cam t={t} keys={[[a, 960, 540, 1.02], [tSnip, 960, 540, 1.0]]} shake={[[tSnip, 6]]}>
            <Layer depth={1}>
              <rect x={-100} y={-100} width={2120} height={1280} fill="#120806" />
              <rect x={110} y={175} width={1700} height={735} fill="url(#cloth12)" />
              {/* colina, castillo */}
              <path d="M1150 910 C1300 820 1450 700 1640 680 C1760 670 1820 690 1830 700 L1830 910 Z" fill="#1A0E06" />
              <Castle x={1650} y={690} color="#1A0E06" />
              <path d="M110 860 L1830 860 L1830 910 L110 910 Z" fill="#1A0E06" />
              {/* surcos */}
              {Array.from({length: 8}, (_, k) => (
                <path key={k} d={`M${120 + k * 60} 862 l40 -6`} stroke="#5A3418" strokeWidth={3} />
              ))}
              <g opacity={1 - clamp((t - tSnip) / 1.2)}>
                <g transform={`rotate(${tumble * 0.4} ${pX + 120} 860) translate(0 ${drop})`}>
                  <Ox x={pX + 240} y={860} s={0.9} walk={(t - a) * 2.4} color="#1A0E06" />
                  <path d={`M${pX + 120} 840 L${pX + 60} 780 M${pX + 120} 840 L${pX + 150} 864`} stroke="#1A0E06" strokeWidth={6} />
                  <path d={`M${pX + 120} 832 L${pX + 150} 760`} stroke="#1A0E06" strokeWidth={4} />
                  <Figure x={pX} y={860} s={0.88} face={1} walk={(t - a) * 2.4} armF={[48, 10]} armB={[40, 14]} color="#1A0E06" hair="none" />
                </g>
                <g transform={`rotate(${-tumble * 0.5} ${horseX} 860) translate(0 ${drop * 1.1})`}>
                  <Horse x={horseX} y={860} s={1.05} face={-1} walk={(t - a) * 3.4} color="#1A0E06" />
                  <Figure
                    x={horseX - 4}
                    y={860 - 152 * 1.05 + 70}
                    s={0.62}
                    face={-1}
                    color="#1A0E06"
                    armF={[50, -20]}
                    hold={
                      <g>
                        <path d="M0 0 L0 -120" stroke="#1A0E06" strokeWidth={4} />
                        <path d={`M0 -120 L52 ${-108 + Math.sin(t * 4) * 4} L0 -94 Z`} fill="#1A0E06" />
                      </g>
                    }
                  />
                </g>
              </g>
              {/* hilos y cruces de marioneta */}
              {strings.map(([x1, y1, x2, y2], k) =>
                t < tSnip ? (
                  <path key={k} d={`M${x1} ${y1} L${x2} ${y2}`} stroke="#2A1608" strokeWidth={1.6} opacity={0.85} />
                ) : (
                  <path key={k} d={`M${x1} ${y1} L${lerp(x1, x2, (cut - y1) / (y2 - drop - y1))} ${cut - (t - tSnip) * 60}`} stroke="#2A1608" strokeWidth={1.6} opacity={0.85 * (1 - clamp((t - tSnip) / 1.2))} />
                ),
              )}
              {[ctrl1, ctrl2].map((c, k) => (
                <g key={k} transform={`rotate(${sway * 0.6} ${c.x} ${c.y})`}>
                  <rect x={c.x - 100} y={c.y - 6} width={200} height={12} rx={4} fill="#3A2210" />
                  <rect x={c.x - 6} y={c.y - 50} width={12} height={80} rx={4} fill="#3A2210" />
                </g>
              ))}
              {t > tCut - 0.6 && t < tSnip + 0.8 ? (
                <Scissors x={lerp(1700, 1060, eio(t, tCut - 0.6, 0.6))} y={cut} open={t < tSnip ? 1 - eio(t, tCut + 0.1, 0.45) * 0.05 - (t > tCut + 0.35 ? eio(t, tCut + 0.35, 0.2) : 0) : 0} rot={180} />
              ) : null}
              {/* proscenio */}
              <path d="M110 175 L330 175 C260 360 230 640 300 910 L110 910 Z M1810 175 L1590 175 C1660 360 1690 640 1620 910 L1810 910 Z" fill="#3A0E10" />
              <path d="M110 160 L1810 160 L1810 220 C1600 250 1400 210 1200 236 C1000 260 900 210 700 236 C500 262 300 220 110 240 Z" fill="#4A1214" />
              <rect x={90} y={150} width={1740} height={780} fill="none" stroke="#1A0806" strokeWidth={30} />
            </Layer>
          </Cam>
          <Verse x={960} y={300} text="«justas»" t={t} at={W(29, 'justas') - 0.3} out={S(30) - 0.2} size={64} color="#2A1208" glow="rgba(255,220,160,0.25)" />
          <Verse x={960} y={300} text="el sistema estaba arreglado" t={t} at={W(30, 'arreglado') - 0.6} out={S(31) - 0.1} size={52} color="#2A1208" glow="rgba(255,220,160,0.25)" />
          <Verse x={960} y={300} text="no era tu culpa…" t={t} at={W(31, 'culpa') - 0.3} out={S(32) - 0.2} size={52} color="#2A1208" glow="rgba(255,220,160,0.25)" />
          <Verse x={960} y={370} text="…ni tu mérito" t={t} at={W(31, 'crédito') - 0.2} out={S(32) - 0.2} size={52} color="#2A1208" glow="rgba(255,220,160,0.25)" />
        </g>
      ) : null}
      {kB > 0 ? (
        <g opacity={kB}>
          <Cam t={t} keys={[[tSnip + 0.5, 960, 900, 1.0], [b, 960, 120, 1.0]]}>
            <Layer depth={1}>
              <Sky id="s12b" y={-700} h={2100} stops={[[0, '#FFF6DE'], [0.2, '#F6C46A'], [0.55, '#5A3A5A'], [1, '#0E0A18']]} />
              <Halo x={1400} y={-420} r={900} color="#FFF0C0" opacity={0.6} />
              <Rays x={1400} y={-520} t={t} n={12} len={1700} spread={60} angle={115} color="#FFE8B0" opacity={0.25} />
              {Array.from({length: 14}, (_, k) => (
                <g key={k} opacity={0.85}>
                  <ellipse cx={900 + hash(k * 3.1) * 1100 + Math.sin(t * 0.2 + k) * 30} cy={-360 + hash(k * 5.3) * 260} rx={160 + hash(k) * 160} ry={44 + hash(k * 2) * 30} fill="#FFF4E0" opacity={0.7} />
                </g>
              ))}
              {Array.from({length: 44}, (_, i) => {
                const sx = 160 + i * 32;
                const sy = 1240 - i * 38;
                const c = mix('#2A1A10', '#FFD98A', clamp(1 - sy / 1240));
                return (
                  <g key={i}>
                    <rect x={sx} y={sy} width={150} height={10} fill={c} />
                    <rect x={sx} y={sy + 10} width={150} height={28} fill={mix(c, '#000000', 0.45)} />
                  </g>
                );
              })}
              <path d="M160 1278 L1568 -394 L1568 -340 L230 1300 Z" fill="#0E0A14" opacity={0.6} />
              {Array.from({length: 8}, (_, i) => {
                const uu = (i / 8 + (t - tSnip) * 0.018) % 1;
                const k = Math.floor(uu * 44);
                const fx = 160 + uu * 44 * 32 + 70;
                const fy = 1240 - uu * 44 * 38;
                return (
                  <Figure
                    key={i}
                    x={fx}
                    y={fy - (k % 1)}
                    s={0.46}
                    face={1}
                    walk={(t + i) * 5}
                    color={INK}
                    rim={{color: '#FFE2A0', dx: 1, dy: -1.2, opacity: clamp(1 - fy / 1240) * 0.9}}
                    hold={<rect x={-10} y={-2} width={26} height={20} rx={3} fill={INK} />}
                  />
                );
              })}
            </Layer>
          </Cam>
          <Verse x={960} y={250} text="meritocracia" t={t} at={tSnip + 0.5} out={W(32, 'recompensas') - 0.5} size={86} italic={false} weight={500} spacing="0.18em" color="#FFF2D0" glow="rgba(255,200,100,0.8)" />
          <Verse x={960} y={250} text="las recompensas, para quienes las merecen" t={t} at={W(32, 'recompensas') - 0.2} out={W(32, 'trabajadoras') - 0.4} size={50} color="#FFF2D0" glow="rgba(255,200,100,0.6)" />
          <Verse x={960} y={250} text="…personas trabajadoras y astutas" t={t} at={W(32, 'trabajadoras') - 0.2} size={50} color="#FFF2D0" glow="rgba(255,200,100,0.6)" />
        </g>
      ) : null}
      <ActTitle t={t} at={a + 0.6} num="III" title="El mito" dur={2.4} color="#F3E6D0" />
    </g>
  );
};
