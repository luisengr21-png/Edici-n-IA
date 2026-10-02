import React from 'react';
import {S, W} from '../../estatus/timing';
import {ICONS} from '../../motion/kit';
import {
  Cam,
  Card,
  clamp,
  Dust,
  EmberText,
  eio,
  eo,
  Figure,
  FigureFront,
  Fireflies,
  Fog,
  Halo,
  hash,
  INK,
  Layer,
  lerp,
  mix,
  Rays,
  Ridge,
  Sky,
  Stars,
  Verse,
} from '../kit';
import type {SceneProps} from './A';

const easeIO = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);

// ───────── Escena 19: semillas de diente de león ─────────
const SEEDS = 48;
const seedInfo = (i: number, a: number) => {
  const th = (i / SEEDS) * Math.PI * 2;
  const td = a + 1.0 + hash(i * 1.37) * 2.4;
  const dur = 3.6 + hash(i * 2.71) * 2.6;
  const xl = 950 + hash(i * 3.97) * 1300;
  const fertile = hash(i * 7.13) > 0.42;
  return {th, td, dur, xl, fertile, arc: 180 + hash(i * 5.3) * 260};
};
const groundY = (x: number) => 880 + Math.sin(x * 0.004) * 14;

export const Seeds: React.FC<SceneProps> = ({t, a, b}) => {
  const H = {x: 520, y: 600};
  const tLuck = W(46, 'suerte');
  const tAcc = W(46, 'accidentes');
  const tMe = W(47, 'ti mismo');
  const walk = eio(t, a + 9.4, 2.2);
  const px = lerp(2020, 2360, walk);
  const kneel = t > a + 11.8;
  const reach = eo(t, a + 12.2, 0.8);
  const take = eo(t, a + 13.0, 0.8);
  const chest = eo(t, tMe - 0.4, 0.8);
  return (
    <g>
      <Cam t={t} keys={[[a, 700, 560, 1.12], [a + 4.5, 1500, 520, 1.0], [a + 9.6, 2300, 600, 1.08], [b, 2400, 620, 1.18]]}>
        <Layer depth={0.15}>
          <Sky id="s19" x={-600} w={5000} stops={[[0, '#2A3A6A'], [0.45, '#C88AA0'], [0.75, '#FFC89A'], [1, '#FFE6B0']]} />
          <Halo x={2200} y={720} r={900} color="#FFE0B0" opacity={0.6} />
          <circle cx={2200} cy={760} r={110} fill="#FFF3D8" />
          <Rays x={2200} y={760} t={t} n={14} len={1800} spread={160} angle={250} color="#FFF0D0" opacity={0.18} />
        </Layer>
        <Layer depth={0.4}>
          <Ridge seed={71} y={770} amp={70} color="#B48AA0" x1={4400} opacity={0.75} />
          <Ridge seed={72} y={820} amp={50} color="#7A6A86" x1={4400} />
          <Fog y={810} h={160} color="#FFD8C0" opacity={0.3} x0={-600} w={5000} />
        </Layer>
        <Layer depth={1}>
          <path d={`M-400 1300 L-400 ${groundY(-400)} ${Array.from({length: 60}, (_, k) => `L${-400 + k * 70} ${groundY(-400 + k * 70)}`).join(' ')} L3800 1300 Z`} fill="#1C2620" />
          {/* suelos: fértil o roca */}
          {Array.from({length: SEEDS}, (_, i) => {
            const s = seedInfo(i, a);
            const gy = groundY(s.xl);
            return s.fertile ? (
              <ellipse key={i} cx={s.xl} cy={gy + 4} rx={40} ry={10} fill="#2E4A30" />
            ) : (
              <path key={i} d={`M${s.xl - 34} ${gy + 6} C${s.xl - 30} ${gy - 20} ${s.xl + 22} ${gy - 26} ${s.xl + 34} ${gy + 6} Z`} fill="#4A4A56" />
            );
          })}
          {/* roca grande y la persona caída */}
          <path d="M2500 900 C2510 800 2620 760 2700 790 C2760 810 2780 860 2780 900 Z" fill="#3A3A46" />
          <Figure x={2520} y={905} s={0.6} sit face={-1} slump={1 - take * 0.6} armF={take > 0 ? [lerp(20, 80, take), lerp(40, 0, take)] : [20, 40]} armB={[16, 50]} rim={{color: '#FFE0B0', dx: -1, dy: -1, opacity: 0.6}} />
          {/* el protagonista */}
          <Figure
            x={px}
            y={905}
            s={0.62}
            face={1}
            walk={walk > 0 && walk < 1 ? (t - a) * 5.5 : undefined}
            kneel={kneel}
            armF={chest > 0 ? [lerp(80, 10, chest), lerp(-5, 160, chest)] : [lerp(20, 80, reach), lerp(20, -5, reach)]}
            rim={{color: '#FFE0B0', dx: 1.2, dy: -1, opacity: 0.85}}
            hold={chest > 0 ? undefined : <Card x={0} y={0} s={1.6} glow={0.6} opacity={1 - reach} />}
          />
          {chest > 0 ? <Halo x={px + 30} y={905 - 0.62 * 190} r={70 * chest} color="#FFD8A0" opacity={0.6 * chest} /> : null}
          {/* el diente de león */}
          <path d={`M${H.x - 30} 905 C${H.x - 20} 800 ${H.x - 10} 700 ${H.x} ${H.y}`} stroke="#1C2620" strokeWidth={6} fill="none" />
          <circle cx={H.x} cy={H.y} r={10} fill="#3A3A2A" />
          {Array.from({length: SEEDS}, (_, i) => {
            const s = seedInfo(i, a);
            const x0 = H.x + Math.cos(s.th) * 66;
            const y0 = H.y + Math.sin(s.th) * 66;
            if (t < s.td) {
              const sway = Math.sin(t * 2 + i) * 2;
              return (
                <g key={i}>
                  <path d={`M${H.x} ${H.y} L${x0 + sway} ${y0}`} stroke="#F2EEE6" strokeWidth={1.2} opacity={0.7} />
                  <circle cx={x0 + sway} cy={y0} r={3} fill="#FFF8EC" />
                </g>
              );
            }
            const p = clamp((t - s.td) / s.dur);
            const e = easeIO(p);
            const gy = groundY(s.xl);
            const x = lerp(x0, s.xl, e) + Math.sin(t * 2 + i) * 14 * (1 - p);
            const y = lerp(y0, gy - 4, e) - Math.sin(Math.PI * e) * s.arc;
            const landed = p >= 1;
            const grow = landed && s.fertile ? eo(t, s.td + s.dur + 0.1, 1.6) : 0;
            const sh = 40 + hash(i * 9.1) * 60;
            return (
              <g key={i}>
                {!landed ? <Halo x={x} y={y} r={26} color="#FFE6B0" opacity={0.7} /> : null}
                {!landed ? (
                  <g transform={`translate(${x} ${y}) rotate(${Math.sin(t * 3 + i) * 20})`}>
                    {[-40, -20, 0, 20, 40].map((ang) => (
                      <path key={ang} d={`M0 0 L${Math.sin((ang * Math.PI) / 180) * 12} ${-Math.cos((ang * Math.PI) / 180) * 12}`} stroke="#FFF8EC" strokeWidth={1} />
                    ))}
                    <circle cx={0} cy={2} r={2.2} fill="#FFF8EC" />
                  </g>
                ) : s.fertile ? (
                  <g>
                    <path d={`M${s.xl} ${gy} C${s.xl + 6} ${gy - sh * 0.4 * grow} ${s.xl - 6} ${gy - sh * 0.7 * grow} ${s.xl} ${gy - sh * grow}`} stroke="#3E6A3A" strokeWidth={3} fill="none" />
                    {grow > 0.6 ? (
                      <g transform={`translate(${s.xl} ${gy - sh * grow}) scale(${eo(t, s.td + s.dur + 1.0, 0.8)})`}>
                        <Halo x={0} y={0} r={36} color={i % 2 ? '#FFB8C8' : '#FFE08A'} opacity={0.7} />
                        {Array.from({length: 6}, (_, k) => (
                          <ellipse key={k} cx={Math.cos(k) * 7} cy={Math.sin(k) * 7} rx={7} ry={4} fill={i % 2 ? '#FFB8C8' : '#FFE08A'} transform={`rotate(${k * 60} ${Math.cos(k) * 7} ${Math.sin(k) * 7})`} />
                        ))}
                        <circle cx={0} cy={0} r={4} fill="#FFF4D0" />
                      </g>
                    ) : null}
                  </g>
                ) : (
                  <circle cx={s.xl} cy={gy - 22} r={2} fill="#C8C0B8" opacity={0.6} />
                )}
              </g>
            );
          })}
          <Dust t={t} n={30} opacity={0.5} color="#FFF0D8" area={[0, 0, 3800, 1000]} />
        </Layer>
      </Cam>
      <Verse x={960} y={250} text="la suerte" t={t} at={tLuck - 0.3} out={tAcc + 1.6} size={64} color="#FFF6E6" glow="rgba(255,210,150,0.7)" />
      <Verse x={960} y={330} text="los accidentes" t={t} at={tAcc - 0.3} out={tAcc + 1.6} size={50} color="#FFF6E6" glow="rgba(255,210,150,0.6)" />
      <Verse x={960} y={250} text="deciden más de lo que creemos" t={t} at={tAcc + 2.0} out={S(47) - 0.3} size={50} color="#FFF6E6" glow="rgba(255,210,150,0.6)" />
      <Verse x={960} y={250} text="no juzgues a nadie… ni siquiera a ti" t={t} at={S(47) - 0.1} size={52} color="#FFF6E6" glow="rgba(255,210,150,0.7)" />
    </g>
  );
};

// ───────── Escena 20: las ventanas encendidas ─────────
const House: React.FC<{x: number; w?: number; id: string; children?: React.ReactNode; lit?: number}> = ({x, w = 420, id, children, lit = 1}) => {
  const wx = x + w / 2 - 115;
  const wy = 640;
  return (
    <g>
      <path d={`M${x} 860 L${x} 560 L${x + w / 2} 440 L${x + w} 560 L${x + w} 860 Z`} fill="#1E1620" />
      <rect x={x + w - 90} y={470} width={36} height={70} fill="#1E1620" />
      <Halo x={wx + 115} y={wy + 70} r={260} color="#FFB868" opacity={0.3 * lit} />
      <defs>
        <clipPath id={`h-${id}`}>
          <rect x={wx} y={wy} width={230} height={150} />
        </clipPath>
        <linearGradient id={`hg-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFDCA0" />
          <stop offset="1" stopColor="#E08A44" />
        </linearGradient>
      </defs>
      <rect x={wx} y={wy} width={230} height={150} fill={`url(#hg-${id})`} opacity={lit} />
      <g clipPath={`url(#h-${id})`}>{children}</g>
      <rect x={wx} y={wy} width={230} height={150} fill="none" stroke="#120C12" strokeWidth={10} />
      <rect x={wx + 112} y={wy} width={6} height={150} fill="#120C12" />
      <rect x={x + 40} y={760} width={60} height={100} fill="#120C12" />
    </g>
  );
};

export const Windows: React.FC<SceneProps> = ({t, a, b}) => {
  const tB = S(50) - 0.4;
  const kB = eio(t, tB, 1.0);
  const px = lerp(260, 2600, clamp((t - a) / (tB - a)));
  const bikeX = lerp(980, 1500, clamp((t - a - 2) / 12));
  return (
    <g>
      {kB < 1 ? (
        <g>
          <Cam t={t} keys={[[a, 520, 560, 1.12], [S(49), 1300, 560, 1.06], [tB + 1, 2450, 560, 1.06]]}>
            <Layer depth={0.15}>
              <Sky id="s20" x={-600} w={5000} stops={[[0, '#1E1A3A'], [0.5, '#7A4A6A'], [0.8, '#E8946A'], [1, '#FFC88A']]} />
              <Stars t={t} n={50} y1={300} opacity={0.4} x1={4000} />
            </Layer>
            <Layer depth={0.35}>
              {/* el castillo helado sobre su montaña de monedas, a lo lejos */}
              <path d="M1600 760 C1700 600 1800 520 1900 510 C2000 520 2100 600 2200 760 Z" fill="#C8A050" opacity={0.75} />
              <g fill="#26364E">
                <rect x={1840} y={380} width={120} height={140} />
                <rect x={1820} y={330} width={30} height={190} />
                <rect x={1950} y={330} width={30} height={190} />
                <path d="M1815 330 L1835 290 L1855 330 Z M1945 330 L1965 290 L1985 330 Z" />
              </g>
              <rect x={1890} y={420} width={18} height={24} fill="#BFE0FF" />
              <Ridge seed={81} y={780} amp={50} color="#4A3446" x1={4400} />
            </Layer>
            <Layer depth={1}>
              <rect x={-400} y={858} width={4400} height={500} fill="#120C12" />
              {/* 1 · la cena en familia */}
              <House x={300} id="h1">
                <path d="M850 650 L850 670" stroke="#3A1E10" strokeWidth={2} />
                <path d="M835 670 L865 670 L858 660 L842 660 Z" fill="#3A1E10" />
                <rect x={780} y={740} width={160} height={10} fill="#3A1E10" />
                <rect x={790} y={750} width={8} height={40} fill="#3A1E10" />
                <rect x={922} y={750} width={8} height={40} fill="#3A1E10" />
                <Figure x={770} y={800} s={0.36} sit face={1} armF={[60, 30]} color="#3A1E10" />
                <Figure x={950} y={800} s={0.36} sit face={-1} armF={[60, 30 + Math.sin(t * 4) * 10]} color="#3A1E10" hair="bun" dress />
                <Figure x={860} y={796} s={0.36} child face={1} armF={[110 + Math.sin(t * 5) * 20, 20]} color="#3A1E10" />
                {Array.from({length: 3}, (_, k) => (
                  <path key={k} d={`M${850 + k * 8} 735 q${Math.sin(t * 2 + k) * 6} -12 0 -24`} stroke="#FFFFFF" strokeWidth={2} fill="none" opacity={0.4} />
                ))}
              </House>
              {/* 2 · enseñar a montar en bici */}
              <House x={1000} id="h2">
                <path d="M1120 790 L1120 720 M1100 740 L1140 740" stroke="#3A1E10" strokeWidth={4} />
                <circle cx={1300} cy={700} r={30} fill="#3A1E10" opacity={0.5} />
              </House>
              <g transform={`translate(${bikeX} 880)`}>
                <g transform="translate(0 -20) scale(0.9)">
                  <path d={ICONS.bike} fill="none" stroke={INK} strokeWidth={6} />
                </g>
                <Figure x={0} y={-12} s={0.42} child face={1} armF={[70, 0]} color={INK} />
                <Figure x={-70} y={0} s={0.56} face={1} walk={t * 6} armF={[60, 10]} color={INK} rim={{color: '#FFC88A', dx: 1, dy: -1, opacity: 0.7}} />
              </g>
              {/* 3 · el huerto */}
              <House x={1700} id="h3" />
              {Array.from({length: 7}, (_, k) => (
                <g key={k} transform={`translate(${1760 + k * 46} 872) scale(0.42)`}>
                  <path d="M0 0 C-10 -30 -30 -40 -40 -50 M0 0 C10 -30 30 -40 40 -50 M0 0 L0 -60" stroke="#3E6A3A" strokeWidth={8} fill="none" />
                  <circle cx={0} cy={-64} r={10} fill="#FF8A5A" />
                </g>
              ))}
              <Figure x={2120} y={880} s={0.56} kneel face={-1} armF={[80, -10]} color={INK} rim={{color: '#FFC88A', dx: -1, dy: -1, opacity: 0.7}} hold={<path d="M0 -6 L24 -6 L28 8 L0 8 Z M24 -2 L44 -16" stroke={INK} strokeWidth={4} fill={INK} />} />
              {Array.from({length: 8}, (_, k) => (
                <circle key={k} cx={2070 - k * 6 - ((t * 60 + k * 10) % 40)} cy={830 + ((t * 80 + k * 13) % 40)} r={2} fill="#BFE0FF" opacity={0.7} />
              ))}
              {/* 4 · el taller */}
              <House x={2400} id="h4">
                {Array.from({length: 5}, (_, k) => (
                  <path key={k} d={`M${2510 + k * 22} 660 L${2510 + k * 22} ${690 + (k % 2) * 10}`} stroke="#3A1E10" strokeWidth={4} />
                ))}
                <rect x={2490} y={750} width={160} height={10} fill="#3A1E10" />
                <rect x={2500} y={760} width={8} height={40} fill="#3A1E10" />
                <rect x={2632} y={760} width={8} height={40} fill="#3A1E10" />
                <Figure x={2700} y={800} s={0.42} face={-1} armF={[70 + Math.sin(t * 6) * 14, 20]} color="#3A1E10" />
                <rect x={2560} y={738} width={50} height={12} fill="#7A4A20" />
              </House>
              <Fireflies t={t} n={26} area={[0, 500, 3200, 350]} />
              <Figure x={px} y={905} s={0.55} face={1} walk={(t - a) * 5.5} armF={[20, 20]} rim={{color: '#FFC88A', dx: 1, dy: -1, opacity: 0.8}} hold={<Card x={0} y={0} s={1.8} glow={0.5} />} />
            </Layer>
          </Cam>
          <Verse x={960} y={250} text="crea tu propia definición de éxito" t={t} at={W(48, 'definición') - 0.6} out={S(49) - 0.2} size={54} color="#FFF4E0" glow="rgba(255,190,120,0.6)" />
          <Verse x={960} y={250} text="hay muchas formas de tener éxito" t={t} at={W(49, 'formas') - 0.4} out={tB} size={54} color="#FFF4E0" glow="rgba(255,190,120,0.6)" />
        </g>
      ) : null}
      {kB > 0 ? (
        <g opacity={kB}>
          <Cam t={t} keys={[[tB, 960, 560, 1.0], [b, 1180, 470, 1.55]]}>
            <Layer depth={0.2}>
              <Sky id="s20b" stops={[[0, '#050A18'], [0.6, '#12223E'], [1, '#2A3E62']]} />
              <Stars t={t} n={120} y1={600} />
            </Layer>
            <Layer depth={0.5}>
              {/* el pueblo cálido, muy abajo */}
              {Array.from({length: 40}, (_, k) => (
                <circle key={k} cx={100 + hash(k * 3.3) * 700} cy={820 + hash(k * 5.1) * 90} r={2.5} fill="#FFC870" opacity={0.6 + 0.4 * Math.sin(t * 2 + k)} />
              ))}
              <Halo x={450} y={860} r={340} color="#FFB868" opacity={0.3} />
            </Layer>
            <Layer depth={1}>
              <defs>
                <linearGradient id="coins20" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#F6D27A" />
                  <stop offset="1" stopColor="#7A5A20" />
                </linearGradient>
              </defs>
              <path d="M820 1100 C900 820 1040 660 1200 640 C1360 660 1500 820 1600 1100 Z" fill="url(#coins20)" />
              {Array.from({length: 120}, (_, k) => {
                const u = hash(k * 2.9);
                const v = hash(k * 6.7);
                const y = 680 + v * 360;
                const half = (y - 640) * 0.9;
                return <ellipse key={k} cx={1200 + (u - 0.5) * 2 * half} cy={y} rx={14} ry={5} fill="#FFE7A0" stroke="#8A6A20" strokeWidth={1.5} opacity={0.8} />;
              })}
              <g fill="#1A2A44">
                <rect x={1080} y={420} width={240} height={240} />
                <rect x={1040} y={330} width={60} height={330} />
                <rect x={1300} y={330} width={60} height={330} />
                <rect x={1170} y={280} width={60} height={160} />
                <path d="M1030 330 L1070 250 L1110 330 Z M1290 330 L1330 250 L1370 330 Z M1160 280 L1200 200 L1240 280 Z" />
              </g>
              <Halo x={1150} y={500} r={160} color="#BFE0FF" opacity={0.35} />
              <rect x={1110} y={460} width={80} height={110} fill="#CFE6FF" />
              <Figure x={1160} y={570} s={0.27} face={-1} armF={[10, 10]} color="#0A1426" />
              <rect x={1146} y={460} width={6} height={110} fill="#1A2A44" />
              <rect x={1110} y={512} width={80} height={6} fill="#1A2A44" />
              <Dust t={t} n={30} opacity={0.4} color="#DCEBFF" />
            </Layer>
          </Cam>
          <Verse x={600} y={250} text="exitosos en hacer dinero…" t={t} at={S(50) + 0.1} out={W(50, 'empatía') - 0.6} size={50} w={1000} color="#DCEBFF" glow="rgba(150,190,255,0.5)" />
          <Verse x={600} y={250} text="…y pobres en empatía, en familia" t={t} at={W(50, 'empatía') - 0.4} size={50} w={1000} color="#DCEBFF" glow="rgba(150,190,255,0.5)" />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 21: constelaciones ─────────
type Const = {cx: number; cy: number; s: number; pts: [number, number][]; edges: [number, number][]};
const ring = (cx: number, cy: number, r: number, n: number, a0 = 0): [number, number][] => Array.from({length: n}, (_, k) => [cx + Math.cos(a0 + (k / n) * Math.PI * 2) * r, cy + Math.sin(a0 + (k / n) * Math.PI * 2) * r]);
const loop = (from: number, n: number): [number, number][] => Array.from({length: n}, (_, k) => [from + k, from + ((k + 1) % n)]);
const CONSTS: Const[] = [
  {
    cx: 400, cy: 400, s: 2.2,
    pts: [[-30, 15], [30, 15], [-5, 15], [-12, -12], [22, -14], ...ring(-30, 15, 18, 4), ...ring(30, 15, 18, 4)],
    edges: [[0, 2], [2, 3], [3, 0], [2, 4], [4, 1], [3, 4], ...loop(5, 4), ...loop(9, 4)],
  },
  {
    cx: 780, cy: 330, s: 2.2,
    pts: [[40, -20], [25, -32], [18, -44], [14, -12], [-20, -6], [-40, -22], [-26, 14], [-22, 30], [14, 30], [20, 6]],
    edges: [[0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [4, 6], [6, 7], [3, 9], [9, 8], [0, 9]],
  },
  {
    cx: 1150, cy: 420, s: 2.2,
    pts: [[-12, 26], [2, 30], [6, 20], [6, -30], [22, -20], [20, -4]],
    edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4], [4, 5]],
  },
  {
    cx: 1500, cy: 330, s: 2.0,
    pts: [[-36, -22], [36, -22], [36, 22], [-36, 22], [0, 4]],
    edges: [[0, 1], [1, 2], [2, 3], [3, 0], [0, 4], [4, 1]],
  },
  {
    cx: 1660, cy: 560, s: 1.8,
    pts: [...ring(0, 0, 36, 8, 0.3), [-12, -10], [12, -10], [-16, 10], [0, 18], [16, 10]],
    edges: [...loop(0, 8), [10, 11], [11, 12]],
  },
];
const ALL: [number, number][] = CONSTS.flatMap((c) => c.pts.map(([x, y]) => [c.cx + x * c.s, c.cy + y * c.s] as [number, number]));
// contorno de una silueta de frente (escala 1.75, pies en y=880)
const OUTLINE_RAW: [number, number][] = [
  ...ring(0, -322, 26, 9, -Math.PI / 2).map(([x, y]) => [x, y] as [number, number]),
  [10, -294], [42, -284], [54, -200], [50, -140], [32, -240], [28, -160], [24, -80], [28, 0], [0, -150], [-28, 0], [-24, -80], [-28, -160], [-32, -240], [-50, -140], [-54, -200], [-42, -284], [-10, -294],
];
const resample = (poly: [number, number][], n: number): [number, number][] => {
  const segs = poly.map((p, i) => {
    const q = poly[(i + 1) % poly.length];
    return {p, q, l: Math.hypot(q[0] - p[0], q[1] - p[1])};
  });
  const total = segs.reduce((s, g) => s + g.l, 0);
  const out: [number, number][] = [];
  for (let k = 0; k < n; k++) {
    let d = (k / n) * total;
    for (const g of segs) {
      if (d <= g.l) {
        const u = d / g.l;
        out.push([lerp(g.p[0], g.q[0], u), lerp(g.p[1], g.q[1], u)]);
        break;
      }
      d -= g.l;
    }
  }
  return out;
};
const OUTLINE = resample(OUTLINE_RAW, ALL.length).map(([x, y]) => [960 + x * 1.75, 880 + y * 1.75] as [number, number]);

export const Constellations: React.FC<SceneProps> = ({t, a, b}) => {
  const tId = W(51, 'identidad');
  const tLog = W(51, 'logros');
  const tEss = W(52, 'esenciales');
  const tCv = W(52, 'currículum');
  const cardUp = eio(t, tId - 0.4, 2.4);
  const morph = eio(t, tCv - 1.2, 2.2);
  const lyingArm: [number, number] = [lerp(40, 90, eo(t, tId - 1.2, 1)), 0];
  const hx = 1100 - 0.5 * 140;
  const hy = 878 - 0.5 * 160;
  const cardPos = {x: lerp(hx, 1420, cardUp), y: lerp(hy, 420, cardUp)};
  let idx = 0;
  return (
    <g>
      <Cam t={t} keys={[[a, 1000, 800, 1.35], [tId + 1.0, 960, 560, 1.0], [b, 960, 540, 0.94]]}>
        <Layer depth={0.3}>
          <Sky id="s21" stops={[[0, '#03040E'], [0.55, '#0C1230'], [1, '#2A2050']]} />
          <g transform="rotate(-24 960 540)" opacity={0.5}>
            <Fog y={500} h={360} color="#6A5AA0" opacity={0.55} x0={-800} w={3600} />
            <Fog y={500} h={140} color="#C8B8F0" opacity={0.35} x0={-800} w={3600} />
          </g>
          <Stars t={t} n={320} y1={860} />
          <Stars t={t} n={60} seed={9} y1={860} color="#FFE6B0" />
        </Layer>
        <Layer depth={1}>
          {/* constelaciones que se forman y luego se convierten en su silueta */}
          {CONSTS.map((c, ci) => {
            const at = tLog - 0.6 + ci * 0.45;
            const draw = eo(t, at, 1.2);
            const base = idx;
            idx += c.pts.length;
            return (
              <g key={ci} opacity={(1 - morph) * draw}>
                {c.edges.map(([i0, i1], k) => {
                  const p0 = ALL[base + i0];
                  const p1 = ALL[base + i1];
                  return <path key={k} d={`M${p0[0]} ${p0[1]} L${p1[0]} ${p1[1]}`} stroke="#BFD4FF" strokeWidth={1.4} opacity={0.65} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - draw} />;
                })}
              </g>
            );
          })}
          {morph > 0 ? (
            <path d={`M${OUTLINE.map((p) => p.join(' ')).join(' L')} Z`} stroke="#DCE6FF" strokeWidth={1.6} fill="#BFD4FF" fillOpacity={0.05 * morph} opacity={morph * 0.8} />
          ) : null}
          {ALL.map(([x, y], i) => {
            const ci = CONSTS.findIndex((_, k) => i < CONSTS.slice(0, k + 1).reduce((s, cc) => s + cc.pts.length, 0));
            const vis = eo(t, tLog - 0.8 + ci * 0.45, 0.6);
            const [ox, oy] = OUTLINE[i];
            const mx = lerp(x, ox, morph);
            const my = lerp(y, oy, morph);
            const tw = 0.7 + 0.3 * Math.sin(t * 3 + i);
            return vis > 0 ? (
              <g key={i} opacity={vis}>
                <Halo x={mx} y={my} r={16} color="#DCE6FF" opacity={0.6 * tw} />
                <circle cx={mx} cy={my} r={2.6} fill="#FFFFFF" />
              </g>
            ) : null;
          })}
          {/* la tarjeta sube y se vuelve una estrella diminuta */}
          {t > tId - 1.6 ? (
            cardUp < 1 ? (
              <Card x={cardPos.x} y={cardPos.y} s={lerp(1.6, 0.15, cardUp)} glow={1 + cardUp} rot={lerp(-8, 30, cardUp)} />
            ) : (
              <g>
                <Halo x={1420} y={420} r={10} color="#FFF6E0" opacity={0.6} />
                <circle cx={1420} cy={420} r={1.4} fill="#FFFFFF" />
              </g>
            )
          ) : null}
          {/* la hierba y él, tumbado mirando el cielo */}
          <path d={`M-200 1300 L-200 900 ${Array.from({length: 40}, (_, k) => `L${-200 + k * 62} ${900 + Math.sin(k * 1.3) * 6}`).join(' ')} L2300 1300 Z`} fill="#05070C" />
          {Array.from({length: 90}, (_, k) => {
            const gx = -100 + k * 24 + hash(k * 5.1) * 20;
            const h = 4 + Math.pow(hash(k * 3.3), 2.2) * 34;
            const lean = (hash(k * 7.7) - 0.5) * 10 + Math.sin(t * 1.5 + k * 0.3) * 3;
            return <path key={k} d={`M${gx} 906 q${lean * 0.4} ${-h / 2} ${lean} ${-h}`} stroke="#05070C" strokeWidth={2} fill="none" />;
          })}
          <Figure x={1100} y={878} s={0.5} face={1} rot={-90} armF={lyingArm} armB={[10, 10]} rim={{color: '#9FB4FF', dx: 0, dy: -1.2, opacity: 0.7}} />
          <Fireflies t={t} n={18} area={[300, 760, 1400, 140]} color="#FFE6A0" />
        </Layer>
      </Cam>
      <Verse x={960} y={250} text="tu identidad no cabe en tus logros" t={t} at={tId - 0.2} out={tEss - 0.5} size={52} color="#EEF2FF" glow="rgba(170,190,255,0.6)" />
      <Verse x={960} y={250} text="hay partes esenciales de nosotros" t={t} at={tEss - 0.2} out={tCv - 0.6} size={52} color="#EEF2FF" glow="rgba(170,190,255,0.6)" />
      <Verse x={960} y={905} text="que nunca cabrán en un currículum… ni en una tarjeta" t={t} at={tCv - 0.3} size={44} color="#FFF6E0" glow="rgba(255,220,160,0.7)" />
    </g>
  );
};

// ───────── Escena 22: el barco de papel ─────────
const BOAT = 'M-34 0 L34 0 L24 14 L-24 14 Z M-16 0 L0 -30 L16 0 Z';

export const PaperBoat: React.FC<SceneProps> = ({t, a, b}) => {
  const tQ = S(54) - 0.1;
  const fold = eio(t, a + 1.4, 1.4);
  const place = eio(t, a + 3.0, 0.9);
  const drift = clamp((t - (a + 3.9)) / (b - a - 3.9));
  const scatter = eio(t, E54() + 0.15, 0.9);
  const hand = {x: 900 + 120, y: 800};
  const bx = place < 1 ? lerp(hand.x, 1080, place) : 1080 + drift * 520;
  const by = place < 1 ? lerp(hand.y, 860, place) : 860 + Math.sin(t * 2) * 3 - drift * 30;
  return (
    <g>
      <Cam t={t} keys={[[a, 980, 600, 1.12], [a + 4, 1050, 600, 1.08], [tQ - 0.3, 1200, 560, 1.04], [b, 1180, 420, 1.0]]}>
        <Layer depth={0.2}>
          <Sky id="s22" stops={[[0, '#2A2C5A'], [0.4, '#B07A9A'], [0.75, '#FFB89A'], [1, '#FFE0B0']]} />
          <Halo x={1500} y={760} r={700} color="#FFE6C0" opacity={0.55} />
          <circle cx={1500} cy={790} r={90} fill="#FFF4E0" />
        </Layer>
        <Layer depth={0.45}>
          <Ridge seed={91} y={780} amp={50} color="#8A6A8A" opacity={0.8} />
          <Fog y={790} h={120} color="#FFE0D0" opacity={0.35} />
        </Layer>
        <Layer depth={1}>
          <defs>
            <linearGradient id="river22" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#C88AA0" />
              <stop offset="0.3" stopColor="#4A5A8A" />
              <stop offset="1" stopColor="#1A2444" />
            </linearGradient>
          </defs>
          <rect x={-400} y={820} width={2800} height={500} fill="url(#river22)" />
          {Array.from({length: 26}, (_, k) => (
            <rect key={k} x={((hash(k * 3.1) * 2600 + t * (30 + hash(k) * 30)) % 2600) - 400} y={830 + hash(k * 7.7) * 120} width={40 + hash(k * 2) * 80} height={2} fill="#FFE6D0" opacity={0.35} />
          ))}
          {Array.from({length: 18}, (_, k) => (
            <rect key={k} x={1500 - 50 + Math.sin(t * 2 + k) * 16 + hash(k) * 30} y={830 + k * 8} width={70 - k * 3} height={2.5} fill="#FFF4E0" opacity={0.6 - k * 0.03} />
          ))}
          <path d="M-400 1300 L-400 820 L700 820 C820 822 900 840 960 870 L1000 1300 Z" fill="#141018" />
          {/* él, de rodillas en la orilla */}
          <Figure x={900} y={872} s={0.66} kneel face={1} armF={place < 1 ? [lerp(60, 80, fold), lerp(30, 10, fold)] : [lerp(80, 30, eo(t, a + 3.9, 1)), 10]} armB={[50, 40]} rim={{color: '#FFD8B8', dx: 1.2, dy: -1, opacity: 0.8}} />
          {/* tarjeta → barco */}
          <g transform={`translate(${bx} ${by}) rotate(${Math.sin(t * 1.6) * 3})`}>
            <Halo x={0} y={0} r={90} color="#FFF4E0" opacity={0.5} />
            <g opacity={1 - fold} transform={`scale(${2 - fold}) rotate(${fold * 40})`}>
              <rect x={-17} y={-11} width={34} height={22} rx={2} fill="#FFFDF6" />
            </g>
            <g opacity={fold} transform={`scale(${0.6 + fold * 0.6})`}>
              <path d={BOAT} fill="#FFFDF6" />
              <path d="M0 -30 L0 0" stroke="#D8D0C0" strokeWidth={1.5} />
            </g>
          </g>
          {place >= 1 ? <ellipse cx={bx} cy={by + 18} rx={60} ry={5} fill="#FFF4E0" opacity={0.25} /> : null}
        </Layer>
      </Cam>
      <EmberText x={1100} y={560} text="¿A qué te dedicas?" t={t} at={tQ} out={E54() + 0.5} size={80} rise={3} scatter={scatter} />
      <EmberText x={1000} y={300} text="¿Quién eres?" t={t} at={E54() + 0.55} size={96} rise={2} color="#FFE6B8" />
    </g>
  );
};
const E54 = () => S(54) + 1.23;

// ───────── Escena 23: la encrucijada ─────────
export const Crossroads: React.FC<SceneProps> = ({t, a, b}) => {
  const tTurn = W(56, 'piensas') - 0.2;
  const tMoney = W(56, 'dinero');
  const tHuman = W(56, 'humano');
  const turn = eio(t, tTurn, 0.8);
  const sx = turn < 0.5 ? 1 - turn * 2 : 0;
  const fx = turn < 0.5 ? 0 : (turn - 0.5) * 2;
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 540, 1.0], [tTurn, 960, 560, 1.04], [b, 960, 720, 1.32]]}>
        <Layer depth={0.2}>
          <Sky id="s23" stops={[[0, '#2A3460'], [0.45, '#A07A9A'], [0.8, '#FFC89A'], [1, '#FFE6B8']]} />
          <Halo x={960} y={640} r={800} color="#FFE6C0" opacity={0.5} />
        </Layer>
        <Layer depth={0.85}>
          {/* izquierda: torres doradas y frías */}
          <Halo x={420} y={540} r={380} color="#E8F0FF" opacity={0.35} />
          {[
            [250, 40, 120],
            [294, 52, 190],
            [350, 36, 150],
            [390, 64, 240],
            [458, 44, 170],
            [506, 50, 210],
            [560, 34, 130],
            [598, 40, 100],
          ].map(([x, w, h], k) => (
            <g key={k}>
              <defs>
                <linearGradient id={`tw23-${k}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#EADBA8" />
                  <stop offset="0.6" stopColor="#C8BC90" />
                  <stop offset="1" stopColor="#8E9CB4" />
                </linearGradient>
              </defs>
              <rect x={x} y={660 - h} width={w} height={h} fill={`url(#tw23-${k})`} opacity={0.9} />
              {k % 3 === 0 ? <rect x={x + w / 2 - 2} y={660 - h - 46} width={4} height={46} fill="#EADBA8" /> : null}
              {Array.from({length: Math.floor((h - 16) / 16)}, (_, r) =>
                Array.from({length: Math.floor((w - 8) / 10)}, (_, c) => (
                  <rect key={`${r}-${c}`} x={x + 6 + c * 10} y={660 - h + 10 + r * 16} width={4} height={7} fill="#FFFFFF" opacity={hash(k * 50 + r * 7 + c) > 0.5 ? 0.5 : 0.15} />
                )),
              )}
            </g>
          ))}
          {/* derecha: un valle de luces pequeñas y cálidas */}
          <Ridge seed={95} y={660} amp={30} color="#6A4A5A" x0={1100} x1={2000} />
          {Array.from({length: 46}, (_, k) => (
            <g key={k}>
              <Halo x={1250 + hash(k * 4.1) * 560} y={640 + hash(k * 6.3) * 40} r={16} color="#FFB868" opacity={0.7} />
              <circle cx={1250 + hash(k * 4.1) * 560} cy={640 + hash(k * 6.3) * 40} r={2.4} fill="#FFE6B0" opacity={0.6 + 0.4 * Math.sin(t * 2 + k)} />
            </g>
          ))}
          <Fog y={680} h={120} color="#FFE0C8" opacity={0.35} />
        </Layer>
        <Layer depth={1}>
          <rect x={-400} y={690} width={2720} height={700} fill="#1A1420" />
          <path d="M860 1200 L940 900 L400 690 L470 690 L960 880 L1450 690 L1520 690 L980 900 L1060 1200 Z" fill="#C8A080" opacity={0.35} />
          <g transform={`translate(960 905) scale(${sx} 1) translate(-960 -905)`}>
            {sx > 0 ? <Figure x={960} y={905} s={0.7} face={1} armF={[10, 10]} rim={{color: '#FFE0C0', dx: 1, dy: -1, opacity: 0.8}} /> : null}
          </g>
          {fx > 0 ? <FigureFront x={960} y={905} s={0.7} sx={fx} rim="#FFE0C0" /> : null}
        </Layer>
      </Cam>
      <Verse x={430} y={600} text="dinero y estatus" t={t} at={tMoney - 0.2} size={48} w={700} color="#E8F0FF" glow="rgba(200,220,255,0.6)" />
      <Verse x={1500} y={600} text="algo mucho más humano" t={t} at={tHuman - 0.3} size={48} w={700} color="#FFE8C8" glow="rgba(255,190,120,0.7)" />
      <Verse x={960} y={250} text="¿y tú qué piensas?" t={t} at={tTurn + 0.2} out={tMoney - 0.4} size={60} color="#FFF6E6" glow="rgba(255,220,170,0.7)" />
    </g>
  );
};

// ───────── Escena 24: créditos ─────────
export const Credits: React.FC<SceneProps> = ({t, a, b}) => {
  const rise = eio(t, a, 6);
  const tCom = W(57, 'comentarios');
  const tLike = W(57, 'like');
  const tSub = W(57, 'suscribirte');
  const white = eio(t, b - 1.6, 1.5);
  const sweep = clamp((t - (a + 1.6)) / 1.6);
  const icons: [number, string, number][] = [
    [tCom, ICONS.comment, 780],
    [tLike, ICONS.thumb, 960],
    [tSub, ICONS.bell, 1140],
  ];
  return (
    <g>
      <Sky id="s24" stops={[[0, mix('#3A3A6A', '#8AA0D0', rise)], [0.5, mix('#C88AA0', '#FFC8A0', rise)], [1, mix('#FFD0A0', '#FFF0D0', rise)]]} />
      <Halo x={960} y={lerp(900, 760, rise)} r={900} color="#FFF0D0" opacity={0.7} />
      <circle cx={960} cy={lerp(940, 790, rise)} r={130} fill="#FFF8EA" />
      <Rays x={960} y={lerp(940, 790, rise)} t={t} n={16} len={1600} spread={180} angle={270} color="#FFF6E0" opacity={0.22} />
      <Ridge seed={99} y={860} amp={40} color="#6A4A60" />
      <Ridge seed={98} y={900} amp={20} color="#2A1C2A" />
      <Dust t={t} n={40} opacity={0.6} color="#FFF6E0" />
      <Verse x={960} y={400} text="Ansiedad por el estatus" t={t} at={a + 0.6} size={96} italic={false} weight={500} spacing="0.04em" color="#2A1C2A" glow="rgba(255,255,255,0.7)" />
      {sweep > 0 && sweep < 1 ? <Halo x={lerp(500, 1420, sweep)} y={360} r={140} color="#FFFFFF" opacity={0.6 * Math.sin(sweep * Math.PI)} /> : null}
      <Verse x={960} y={480} text="una fábula de sombras y luz" t={t} at={a + 1.4} size={42} color="#4A3446" glow="rgba(255,255,255,0.6)" />
      {icons.map(([at, d, x], k) => {
        const o = eo(t, at - 0.2, 0.7);
        if (o <= 0) return null;
        const y = 640 + Math.sin(t * 2 + k) * 8;
        return (
          <g key={k} opacity={o}>
            <Halo x={x} y={y} r={90} color="#FFE6A0" opacity={0.8} />
            <g transform={`translate(${x} ${y}) scale(${0.75 * o})`}>
              <path d={d} fill="none" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </g>
        );
      })}
      {white > 0 ? <rect x={0} y={0} width={1920} height={1080} fill="#FFF6E6" opacity={white} /> : null}
    </g>
  );
};
