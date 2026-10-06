import React from 'react';
import {Cam, Cut, E, Hand, Icon, K, P, PE, PFig, PO, Page, Ransom, S, SceneProps, Svg, Tape, W, clamp, easeOutBack, figHeadY, hash, lerp, mixHex, tornRect} from '../kit';

// ════════════════════ Escenas 11 y 12 — Teléfono de latas ════════════════════
const LX = 700;
const RX = 1220;
const GY = 840;
const FS = 2.6;
const HY = GY + figHeadY(0) * FS;
const canL = {x: LX + 62, y: HY + 18};
const canR = {x: RX - 62, y: HY + 18};

const Can: React.FC<{x: number; y: number; flip?: boolean; id: number}> = ({x, y, flip, id}) => (
  <Cut id={id} x={x} y={y} rot={flip ? -90 : 90} plain>
    <rect x={-26} y={-34} width={52} height={68} rx={6} fill="#b9bfc6" />
    {[-22, -8, 6, 20].map((yy) => (
      <rect key={yy} x={-26} y={yy} width={52} height={3} fill="#8e959d" />
    ))}
    <rect x={-26} y={-34} width={52} height={10} rx={4} fill="#d8dde2" />
  </Cut>
);

/** Cordel: tensión (vibra, tomate), comba, flujo (lana verde ondulante) */
const Cord: React.FC<{t: number; tension: number; sag: number; flow: number}> = ({t, tension, sag, flow}) => {
  const x0 = canL.x + 34;
  const x1 = canR.x - 34;
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60;
    const env = Math.sin(Math.PI * u);
    const y = canL.y + sag * env + tension * 8 * env * Math.sin(t * 80 + u * 34) + flow * 24 * env * Math.sin(u * Math.PI * 4 - t * 4.5);
    pts.push(`${lerp(x0, x1, u)},${y}`);
  }
  const col = flow > 0 ? mixHex('#c9b99a', K.sage, flow) : mixHex('#c9b99a', K.tomato, tension);
  return (
    <g>
      <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={lerp(3, 8, flow)} strokeLinecap="round" filter="url(#pshadow)" />
      {flow > 0 && <polyline points={pts.join(' ')} fill="none" stroke={K.sageLight} strokeWidth={3} strokeDasharray="5 9" opacity={0.7 * flow} />}
    </g>
  );
};

const Duo: React.FC<{sweat?: number; t: number}> = ({sweat = 0, t}) => (
  <g>
    <polygon points={tornRect(-100, GY, 2200, 300, 111, 14)} fill="#d9c09a" />
    <PFig id={700} x={LX} y={GY} s={FS} color={K.mustard} />
    <PFig id={701} x={RX} y={GY} s={FS} color={K.blue} />
    <Can x={canL.x} y={canL.y} id={702} />
    <Can x={canR.x} y={canR.y} id={703} flip />
    {sweat > 0 &&
      [0, 1, 2].map((i) => {
        const u = (t * 0.9 + i * 0.33) % 1;
        return (
          <g key={i} transform={`translate(${LX - 52 + i * 6} ${HY - 24 + u * 70})`} opacity={sweat * (1 - u)}>
            <path d="M0 -14 C7 -3 9 5 0 10 C-9 5 -7 -3 0 -14 Z" fill={K.white} />
            <path d="M0 -10 C5 -2 6 4 0 7 C-6 4 -5 -2 0 -10 Z" fill="#8fc3e6" />
          </g>
        );
      })}
  </g>
);

export const Scene11: React.FC<SceneProps> = ({t, a}) => {
  const tTry = W(21, 'esfuerzas') - 0.3;
  const tI = W(21, 'interesante');
  const tF = W(21, 'gracioso');
  const tS = W(21, 'inteligente');
  const tTense = W(21, 'tenso') - 0.2;
  const tension = PE(t, tTry, E(21) - tTry + 0.4);
  const z = lerp(1, 1.3, PE(t, tTry, E(21) - tTry + 0.8));
  const pile = [
    {name: 'bulb', t0: tI, x: -90, y: 0},
    {name: 'mask', t0: tF, x: 0, y: 0},
    {name: 'cap', t0: tS, x: 95, y: 0},
    {name: 'trophy', t0: tTense, x: -60, y: -110},
    {name: 'star', t0: tTense + 0.25, x: 55, y: -115},
    {name: 'bulb', t0: tTense + 0.5, x: 140, y: -70},
    {name: 'mask', t0: tTense + 0.7, x: -150, y: -85},
    {name: 'cap', t0: tTense + 0.9, x: 0, y: -200},
    {name: 'trophy', t0: tTense + 1.1, x: 125, y: -185},
    {name: 'star', t0: tTense + 1.3, x: -115, y: -195},
  ];
  return (
    <>
      <Page kind="paper" tint={mixHex('#efe4cf', '#d9cdb6', tension)} />
      <Svg>
        <Cam cx={960} cy={lerp(540, 560, tension)} z={z}>
          <Duo t={t} sweat={P(t, tTense, 0.5)} />
          <Cord t={t} tension={tension} sag={lerp(46, 0, tension)} flow={0} />
          {/* bocadillo: nota adhesiva */}
          <Cut id={710} x={LX - 30} y={430} plain s={easeOutBack(P(t, a + 0.5, 0.3))} rot={-3}>
            <rect x={-200} y={-110} width={400} height={220} fill="#fbe48a" />
            <polygon points="-10,110 30,110 -20,160" fill="#fbe48a" />
          </Cut>
          <Cut id={711} x={RX + 20} y={470} plain s={easeOutBack(P(t, a + 0.7, 0.3))} rot={4}>
            <rect x={-80} y={-55} width={160} height={110} fill="#cfe0ea" />
            {[-30, 0, 30].map((d) => (
              <circle key={d} cx={d} r={8} fill={K.graphite} />
            ))}
          </Cut>
          {pile.map((p, i) => {
            if (t < p.t0) return null;
            return (
              <Cut key={i} id={720 + i} x={LX - 30 + p.x} y={430 + p.y} s={0.9 * easeOutBack(P(t, p.t0, 0.3))} rot={(hash(i) - 0.5) * 30 + tension * 6 * Math.sin(t * 30 + i)}>
                <Icon name={p.name} color={[K.mustard, K.ink, K.tomato, K.sage][i % 4]} sw={6} />
              </Cut>
            );
          })}
        </Cam>
        {/* termómetro de papel */}
        <g opacity={P(t, tTry, 0.3)} transform="translate(660 90)">
          <Cut id={730} plain>
            <rect x={0} y={-18} width={600} height={36} rx={18} fill={K.white} />
            <circle cx={-10} cy={0} r={34} fill={K.white} />
          </Cut>
          <circle cx={-10} cy={0} r={22} fill={K.tomato} />
          <Hand d={`M10 0 L${10 + 570 * tension} 0`} color={K.tomato} w={16} />
          {Array.from({length: 9}).map((_, i) => (
            <line key={i} x1={60 + i * 62} x2={60 + i * 62} y1={-18} y2={-6} stroke={K.graphite} strokeWidth={2} />
          ))}
        </g>
      </Svg>
    </>
  );
};

const WORDS = ['yo', 'todo', 'más', 'perfecto', 'quizá', 'debería', 'mira', 'éxito', 'gusta', 'nunca', 'siempre', 'parece', 'brillante', 'gracioso', 'listo'];
const SCRAP_FONTS = ['Anton', 'Abril', 'IMFell', 'SpecialElite', 'Oswald', 'Cormorant'];

export const Scene12: React.FC<SceneProps> = ({t, a}) => {
  const release = PE(t, a, 0.8);
  const tFlow = W(22, 'palabras') - 0.4;
  const tListen = W(23, 'Escuchas');
  const tConnect = W(23, 'conectas');
  const tDetail = S(24) - 0.35;
  const tBut = W(24, 'sino') - 0.2;
  const tFeel = W(24, 'sientes') - 0.4;
  const flow = PE(t, tFlow - 0.5, 1.2);
  const z = lerp(1.3, 1.0, PE(t, a, 1.4));
  const sync = PE(t, tListen, tConnect - tListen + 0.6);
  const detail = t >= tDetail;
  const wave = (cx: number, phase: number, col: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 50; i++) {
      const u = i / 50;
      pts.push(`${cx - 150 + u * 300},${HY - 190 + Math.sin(u * Math.PI * 6 + t * 5 + phase) * 26 * Math.sin(Math.PI * u)}`);
    }
    return <Hand d={`M${pts.join(' L')}`} color={col} w={5} />;
  };
  // lámina de anatomía
  const DX = 600;
  const DY = 1180;
  const DS = 7.2;
  const headY = DY + figHeadY(0) * DS;
  const chest = DY - 34 * DS;
  const sx = 1200;
  const sy = headY + 60;
  return (
    <>
      <Page kind="paper" tint={detail ? '#efe2c4' : undefined} />
      <Svg>
        {!detail && (
          <Cam cx={960} cy={560} z={z}>
            <Duo t={t} />
            <Cord t={t} tension={1 - release} sag={lerp(0, 22, release) * (1 - flow)} flow={flow} />
            {t > tListen - 0.3 && (
              <g>
                {wave(LX, 0, K.sage)}
                {wave(RX, lerp(Math.PI * 1.4, 0, sync), mixHex(K.graphite, K.sage, sync))}
              </g>
            )}
            {t > tListen && (
              <Cut id={740} x={RX + 95} y={HY - 30} s={0.8 * easeOutBack(P(t, tListen, 0.3))} rot={10}>
                <Icon name="ear" color={K.sage} sw={6} />
              </Cut>
            )}
            {t > tConnect && (
              <g filter="url(#boil)">
                <circle cx={(LX + RX) / 2} cy={canL.y} r={40 + 220 * PO(t, tConnect, 1.6)} fill="none" stroke={K.sage} strokeWidth={4} opacity={0.8 * (1 - P(t, tConnect, 1.6))} strokeDasharray="16 10" />
              </g>
            )}
          </Cam>
        )}
        {detail && (
          <g>
            {/* marco de lámina antigua */}
            <rect x={40} y={40} width={1840} height={1000} fill="none" stroke={K.sepia} strokeWidth={3} />
            <rect x={56} y={56} width={1808} height={968} fill="none" stroke={K.sepia} strokeWidth={1.2} />
            <PFig id={750} x={DX} y={DY} s={DS} color={K.mustard} />
            {/* corazón de papel que late */}
            <Cut id={751} x={DX} y={chest} s={(1.4 + 0.12 * Math.sin(t * 7)) * (0.6 + 0.4 * PE(t, tFeel - 0.3, 0.5))}>
              <Icon name="heart" color={K.tomato} />
            </Cut>
            {/* palabras recortadas que salen de la cabeza */}
            {Array.from({length: 46}).map((_, i) => {
              const t0 = tDetail + 0.3 + i * 0.08;
              if (t0 > tBut + 0.3 || t < t0) return null;
              const u = P(t, t0, 1.2);
              const passes = hash(i * 13) < 0.12;
              const arrive = Math.min(1, u * 1.5);
              const x = lerp(DX + 140, passes ? sx + 300 : sx - 40, passes ? u : arrive);
              const fall = passes ? 0 : Math.max(0, u * 1.5 - 1) * 1.7;
              const y = headY - 40 + (hash(i) - 0.5) * 160 * (1 - arrive) + lerp(0, sy - headY + 40, arrive) + fall * fall * 700;
              const word = WORDS[i % WORDS.length];
              const fz = 26 + hash(i * 3) * 10;
              return (
                <g key={i} transform={`translate(${x} ${y}) rotate(${(hash(i * 5) - 0.5) * 30 + fall * 90})`} opacity={passes ? 1 - u : 1 - clamp(fall)}>
                  <rect x={-word.length * fz * 0.3} y={-fz * 0.8} width={word.length * fz * 0.6} height={fz} fill={[K.white, K.news, '#f2e3c2', K.blueLight][i % 4]} />
                  <text x={0} y={-fz * 0.08} textAnchor="middle" fontFamily={SCRAP_FONTS[i % SCRAP_FONTS.length]} fontSize={fz * 0.8} fill={K.ink}>
                    {word}
                  </text>
                </g>
              );
            })}
            {/* colador de té */}
            <g transform={`translate(${sx} ${sy}) rotate(-90)`}>
              <Cut id={752} plain jitter={0.4}>
                <rect x={-10} y={110} width={20} height={200} rx={8} fill="#9aa1a9" />
                <circle r={115} fill="#dfe3e7" />
                <circle r={102} fill="#c3c8cd" />
                {Array.from({length: 16}).map((_, i) => (
                  <line key={i} x1={-100 + i * 13} x2={-100 + i * 13} y1={-Math.sqrt(Math.max(0, 102 * 102 - (-100 + i * 13) ** 2))} y2={Math.sqrt(Math.max(0, 102 * 102 - (-100 + i * 13) ** 2))} stroke="#8e959d" strokeWidth={2} />
                ))}
                {Array.from({length: 16}).map((_, i) => (
                  <line key={`h${i}`} y1={-100 + i * 13} y2={-100 + i * 13} x1={-Math.sqrt(Math.max(0, 102 * 102 - (-100 + i * 13) ** 2))} x2={Math.sqrt(Math.max(0, 102 * 102 - (-100 + i * 13) ** 2))} stroke="#8e959d" strokeWidth={2} />
                ))}
              </Cut>
            </g>
            {/* bocadillo con sello de goma desde el pecho */}
            {t > tFeel && (
              <g>
                <Hand d={`M${DX + 70} ${chest} C ${DX + 320} ${chest} ${DX + 460} ${chest - 110} ${1360} ${chest - 140}`} p={PO(t, tFeel - 0.2, 0.7)} color={K.tomato} w={4} />
                <g transform={`translate(1520 ${chest - 170}) scale(${easeOutBack(P(t, tFeel, 0.35))}) rotate(-4)`} filter="url(#boil)">
                  <rect x={-160} y={-95} width={320} height={190} rx={42} fill="none" stroke={K.sage} strokeWidth={10} strokeDasharray="60 4 30 3" />
                  <g opacity={0.85}>
                    <Icon name="heart" s={1.6} color={K.sage} />
                  </g>
                </g>
              </g>
            )}
          </g>
        )}
      </Svg>
    </>
  );
};

// ════════════════════ Escena 13 — Doble página: agradar ≠ conectar ════════════════════
export const Scene13: React.FC<SceneProps> = ({t, a}) => {
  const tA = W(25, 'agradar');
  const tC = W(25, 'conectar');
  const tNe = E(25) - 0.2;
  const r1L = W(26, 'aprobación') - 0.4;
  const r1R = W(26, 'comprensión') - 0.4;
  const r2L = W(27, 'actuar') - 0.3;
  const r2R = W(27, 'abrirte') - 0.3;
  const foci: [number, number][] = [
    [tA - 0.3, -1],
    [tC - 0.3, 1],
    [tNe, 0],
    [S(26) - 0.2, -1],
    [W(26, 'conectar') - 0.3, 1],
    [S(27) - 0.2, -1],
    [W(27, 'conectar') - 0.3, 1],
    [E(27) - 0.2, 0],
  ];
  let focus = 0;
  let prev = 0;
  for (const [ti, f] of foci) {
    focus += (f - prev) * PE(t, ti, 0.9);
    prev = f;
  }
  const sticker = (name: string, x: number, y: number, col: string, t0: number, id: number) =>
    t < t0 ? null : (
      <Cut key={id} id={id} x={x} y={y} s={1.15 * easeOutBack(P(t, t0, 0.3))} rot={(hash(id) - 0.5) * 16}>
        <circle r={62} fill={K.white} />
        <Icon name={name} s={1.05} color={col} sw={6} />
      </Cut>
    );
  return (
    <div style={{position: 'absolute', inset: 0, transform: `translateX(${-focus * 60}px) scale(1.06)`}}>
      <Page kind="paper" />
      <Svg>
        <polygon points={tornRect(70, 60, 870, 960, 131, 10)} fill={K.tomatoLight} opacity={0.75} filter="url(#pshadow)" />
        <polygon points={tornRect(980, 60, 870, 960, 132, 10)} fill={K.sageLight} opacity={0.85} filter="url(#pshadow)" />
        <defs>
          <linearGradient id="gutter2" x1="0" x2="1">
            <stop offset="0" stopColor="#3a2410" stopOpacity={0} />
            <stop offset="0.5" stopColor="#3a2410" stopOpacity={0.3} />
            <stop offset="1" stopColor="#3a2410" stopOpacity={0} />
          </linearGradient>
        </defs>
        <rect x={900} width={120} height={1080} fill="url(#gutter2)" />
        {t > tNe && (
          <g>
            <Tape x={960} y={290} w={110} h={26} rot={0} pat="washiC" />
            <Tape x={960} y={330} w={110} h={26} rot={0} pat="washiC" />
            <Tape x={960} y={310} w={130} h={22} rot={-60} pat="washiB" />
          </g>
        )}
        {sticker('thumb', 380, 620, K.tomato, r1L, 760)}
        {sticker('clap', 600, 640, K.tomato, r1L + 0.25, 761)}
        {sticker('ear', 1320, 620, K.sage, r1R, 762)}
        {sticker('bridge', 1540, 640, K.sage, r1R + 0.25, 763)}
        {sticker('mask', 390, 850, K.tomato, r2L, 764)}
        {sticker('stage', 610, 830, K.tomato, r2L + 0.25, 765)}
        {sticker('hand', 1330, 850, K.sage, r2R, 766)}
        {sticker('door', 1550, 830, K.sage, r2R + 0.25, 767)}
      </Svg>
      {t > tA - 0.2 && <Ransom lines={['AGRADAR']} reveal={P(t, tA - 0.2, 0.9)} size={110} x={70} w={870} y={300} seed={25} />}
      {t > tC - 0.2 && <Ransom lines={['CONECTAR']} reveal={P(t, tC - 0.2, 0.9)} size={110} x={980} w={870} y={300} seed={26} />}
    </div>
  );
};

// ════════════════════ Escena 14 — Raíces bordadas ════════════════════
const ROOT_X = [360, 660, 960, 1260, 1560];
const GROUND = 600;
const rootPath = (x: number, k: number, depth: number, seed: number) => {
  let d = `M${x} ${GROUND + 10}`;
  let cx = x;
  let cy = GROUND + 10;
  const dir = k % 2 ? 1 : -1;
  for (let i = 1; i <= 6; i++) {
    const nx = x + dir * i * (30 + hash(seed) * 35) + Math.sin(i * 0.9 + seed) * 18;
    const ny = GROUND + (i / 6) * depth;
    d += ` Q${cx + (hash(seed * 3 + i) - 0.5) * 50} ${(cy + ny) / 2} ${nx} ${ny}`;
    cx = nx;
    cy = ny;
  }
  return d;
};
export const Scene14: React.FC<SceneProps> = ({t}) => {
  const tListen = W(28, 'escuchar');
  const tUnd = W(28, 'comprender');
  const tShare = W(28, 'compartir');
  const tChange = W(28, 'relaciones') - 0.3;
  const tDeep = W(28, 'profundas') - 0.3;
  const down = PE(t, tChange, 3.2);
  const links = [tListen, tUnd, tShare, tShare + 0.4];
  const strata = ['#b98e5f', '#a07548', '#8a6239', '#6f4d2c'];
  return (
    <>
      <Page kind="paper" tint="#efe3cb" />
      <Svg>
        <Cam cx={960} cy={lerp(520, 830, down)} z={lerp(1, 0.86, down)}>
          {strata.map((c, i) => (
            <polygon key={i} points={tornRect(-500, GROUND + 20 + i * 230, 2920, 400, 140 + i, 22)} fill={c} filter="url(#pshadow)" />
          ))}
          <polygon points={tornRect(-500, GROUND - 20, 2920, 60, 150, 14)} fill="#8fb59f" filter="url(#pshadow)" />
          {/* raíces bordadas: el hilo avanza puntada a puntada */}
          {ROOT_X.map((x, i) =>
            [0, 1, 2, 3].map((k) => {
              const deep = k >= 2;
              const t0 = (deep ? tDeep : tChange) + i * 0.12 + k * 0.1;
              const p = PE(t, t0, deep ? 2.4 : 2.0);
              if (p <= 0) return null;
              const id = `rt${i}${k}`;
              return (
                <g key={id}>
                  <mask id={id}>
                    <path d={rootPath(x, k, deep ? 720 : 380, i * 10 + k)} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} stroke="#fff" strokeWidth={20} fill="none" />
                  </mask>
                  <g mask={`url(#${id})`}>
                    <path d={rootPath(x, k, deep ? 720 : 380, i * 10 + k)} fill="none" stroke={deep ? '#e9b53c' : K.sage} strokeWidth={deep ? 5 : 7} strokeLinecap="round" strokeDasharray="16 9" />
                  </g>
                </g>
              );
            }),
          )}
          {/* conexiones de hilo entre figuras */}
          {links.map((tl, i) => {
            const x0 = ROOT_X[i];
            const x1 = ROOT_X[i + 1];
            const y = GROUND - 2.0 * 40;
            const p = PE(t, tl - 0.3, 0.9);
            if (p <= 0) return null;
            const d = `M${x0 + 30} ${y} Q${(x0 + x1) / 2} ${y - 90} ${x1 - 30} ${y}`;
            return <path key={i} d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} fill="none" stroke={K.sage} strokeWidth={6} strokeLinecap="round" filter="url(#pshadow)" />;
          })}
          {ROOT_X.map((x, i) => (
            <PFig key={i} id={800 + i} x={x} y={GROUND} s={2.0} color={i === 2 ? K.mustard : mixHex(K.news, i % 2 ? K.mustard : K.sage, PE(t, links[Math.min(i, 3)], 1.2) * 0.6)} />
          ))}
        </Cam>
      </Svg>
    </>
  );
};

