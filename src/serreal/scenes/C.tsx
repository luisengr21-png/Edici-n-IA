import React from 'react';
import {C, Cam, Draw, E, Fig, Icon, OSWALD, P, PE, PO, S, SceneProps, W, clamp, easeOutBack, figHeadY, hash, lerp, mixHex} from '../kit';
import {Svg} from './A';

// ════════════════════ Escenas 11 y 12 — La cuerda ════════════════════
const LX = 700;
const RX = 1220;
const GY = 840;
const FS = 2.6;
const chestY = GY - FS * 40;

/** Cuerda entre los pechos: tension 0..1 (vibración y color), sag = comba, flow = onda viajera */
const Rope: React.FC<{t: number; tension: number; sag: number; flow: number}> = ({t, tension, sag, flow}) => {
  const x0 = LX + 30;
  const x1 = RX - 30;
  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const u = i / 80;
    const env = Math.sin(Math.PI * u);
    const y = chestY + sag * env + tension * 7 * env * Math.sin(t * 95 + u * 40) + flow * 22 * env * Math.sin(u * Math.PI * 4 - t * 4.5);
    pts.push(`${lerp(x0, x1, u)},${y}`);
  }
  const col = flow > 0 ? mixHex(C.cream, C.teal, flow) : mixHex(C.creamDim, C.coral, tension);
  return <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={lerp(4, 6, Math.max(tension, flow))} strokeLinecap="round" />;
};

const Duo: React.FC<{t: number; leftGlow?: number; sweat?: number}> = ({t, leftGlow = 0.3, sweat = 0}) => {
  const hy = GY + figHeadY(0) * FS;
  return (
    <g>
      <line x1={200} x2={1720} y1={GY + 2} y2={GY + 2} stroke={C.line} strokeWidth={2} />
      <Fig x={LX} y={GY} s={FS} color={C.amber} glow={leftGlow} />
      <Fig x={RX} y={GY} s={FS} color={mixHex(C.stoneLight, C.cream, 0.25)} />
      {sweat > 0 &&
        [0, 1, 2].map((i) => {
          const u = ((t * 0.9 + i * 0.33) % 1);
          return <path key={i} d="M0 -12 C6 -2 8 4 0 8 C-8 4 -6 -2 0 -12 Z" fill="#9fd6ff" opacity={sweat * (1 - u)} transform={`translate(${LX - 48 + i * 4} ${hy - 20 + u * 60})`} />;
        })}
    </g>
  );
};

const SpeechBubble: React.FC<{x: number; y: number; w: number; h: number; o: number; color?: string; tailX?: number}> = ({x, y, w, h, o, color = C.cream, tailX = 0}) => (
  <g opacity={o}>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={34} fill={C.bg2} stroke={color} strokeWidth={4} />
    <path d={`M${x + tailX - 22} ${y + h / 2 - 2} L${x + tailX} ${y + h / 2 + 40} L${x + tailX + 18} ${y + h / 2 - 2}`} fill={C.bg2} stroke={color} strokeWidth={4} strokeLinejoin="round" />
    <rect x={x + tailX - 20} y={y + h / 2 - 6} width={36} height={8} fill={C.bg2} />
  </g>
);

export const Scene11: React.FC<SceneProps> = ({t, a}) => {
  const tTry = W(21, 'esfuerzas') - 0.3;
  const tI = W(21, 'interesante');
  const tF = W(21, 'gracioso');
  const tS = W(21, 'inteligente');
  const tTense = W(21, 'tenso') - 0.2;
  const tension = PE(t, tTry, E(21) - tTry + 0.4);
  const z = lerp(1, 1.32, PE(t, tTry, E(21) - tTry + 0.8));
  const pile = [
    {name: 'bulb', t0: tI, x: -90, y: 0},
    {name: 'mask', t0: tF, x: 0, y: 0},
    {name: 'cap', t0: tS, x: 90, y: 0},
    {name: 'trophy', t0: tTense, x: -60, y: -105},
    {name: 'star', t0: tTense + 0.25, x: 50, y: -110},
    {name: 'bulb', t0: tTense + 0.5, x: 130, y: -70},
    {name: 'mask', t0: tTense + 0.7, x: -140, y: -80},
    {name: 'cap', t0: tTense + 0.9, x: 0, y: -190},
    {name: 'trophy', t0: tTense + 1.1, x: 120, y: -180},
    {name: 'star', t0: tTense + 1.3, x: -110, y: -190},
  ];
  const bub = PO(t, a + 0.6, 0.6);
  return (
    <Svg>
      <polygon points="860,-20 1060,-20 1500,1080 420,1080" fill="url(#srCold)" opacity={0.25 + 0.5 * tension} />
      <Cam cx={960} cy={lerp(540, 560, tension)} z={z}>
        <Duo t={t} sweat={P(t, tTense, 0.6)} leftGlow={0.3 * (1 - tension)} />
        <Rope t={t} tension={tension} sag={lerp(40, 0, tension)} flow={0} />
        <SpeechBubble x={LX - 30} y={420} w={lerp(260, 400, PE(t, tI - 0.4, 0.6))} h={190} o={bub} tailX={20} />
        <SpeechBubble x={RX + 10} y={470} w={150} h={100} o={bub * 0.8} color={C.creamDim} tailX={-10} />
        {[-28, 0, 28].map((d, i) => (
          <circle key={i} cx={RX + 10 + d} cy={470} r={8} fill={C.creamDim} opacity={bub * (0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i)))} />
        ))}
        {pile.map((p, i) => {
          const k = easeOutBack(P(t, p.t0, 0.4));
          if (k <= 0) return null;
          const jit = tension * 4 * Math.sin(t * 40 + i * 3);
          return <Icon key={i} name={p.name} x={LX - 30 + p.x + jit} y={420 + p.y} s={0.95 * k} color={[C.amber, C.cream, C.coral, C.teal][i % 4]} sw={5} />;
        })}
      </Cam>
      {/* medidor de tensión */}
      <g opacity={P(t, tTry, 0.5)}>
        <rect x={660} y={90} width={600} height={22} rx={11} fill={C.bg2} stroke={C.line} strokeWidth={2} />
        <rect x={662} y={92} width={596 * tension} height={18} rx={9} fill={mixHex(C.teal, C.coral, tension)} />
        <Icon name="heartO" x={620} y={101} s={0.5} color={C.creamDim} sw={5} />
      </g>
    </Svg>
  );
};

const SYMS = ['■', '▲', '●', '◆'];
export const Scene12: React.FC<SceneProps> = ({t, a}) => {
  const release = PE(t, a, 0.9);
  const tFlow = W(22, 'palabras') - 0.4;
  const tListen = W(23, 'Escuchas');
  const tConnect = W(23, 'conectas');
  const tDetail = S(24) - 0.35;
  const tBut = W(24, 'sino') - 0.2;
  const tFeel = W(24, 'sientes') - 0.4;
  const flow = PE(t, tFlow - 0.5, 1.2);
  const z = lerp(1.32, 1.0, PE(t, a, 1.6));
  const det = PE(t, tDetail, 0.8);
  const sync = PE(t, tListen, tConnect - tListen + 0.6);
  const hy = GY + figHeadY(0) * FS;
  const wave = (cx: number, phase: number, col: string) => {
    const pts: string[] = [];
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      pts.push(`${cx - 150 + u * 300},${hy - 170 + Math.sin(u * Math.PI * 6 + t * 5 + phase) * 26 * Math.sin(Math.PI * u)}`);
    }
    return <polyline points={pts.join(' ')} fill="none" stroke={col} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />;
  };
  // detalle: cabeza → tamiz, pecho → palabras
  const DX = 640;
  const DY = 1180;
  const DS = 7.2;
  const headY = DY + figHeadY(0) * DS;
  const chest = DY - 34 * DS;
  const sieveX = 1180;
  const stopTorrent = PE(t, tBut, 0.6);
  return (
    <Svg>
      {det < 1 && (
        <g opacity={1 - det}>
          <Cam cx={960} cy={560} z={z}>
            <Duo t={t} leftGlow={0.3 + 0.4 * sync} />
            <Rope t={t} tension={1 - release} sag={lerp(0, 18, release) * (1 - flow)} flow={flow} />
            <g opacity={P(t, tListen - 0.3, 0.5)}>
              {wave(LX, 0, C.teal)}
              {wave(RX, lerp(Math.PI * 1.4, 0, sync), mixHex(C.creamDim, C.teal, sync))}
            </g>
            <Icon name="ear" x={RX + 90} y={hy - 10} s={0.8 * easeOutBack(P(t, tListen, 0.5))} color={C.teal} sw={5} />
            <circle cx={(LX + RX) / 2} cy={chestY} r={40 + 200 * PO(t, tConnect, 1.6)} fill="none" stroke={C.teal} strokeWidth={3} opacity={0.7 * P(t, tConnect, 0.1) * (1 - P(t, tConnect, 1.6))} />
          </Cam>
        </g>
      )}
      {det > 0 && (
        <g opacity={det}>
          <Cam cx={960} cy={540} z={lerp(1.08, 1, PE(t, tFeel, 3))}>
            <line x1={0} x2={1920} y1={DY} y2={DY} stroke={C.line} strokeWidth={2} />
            <circle cx={DX} cy={chest} r={300} fill="url(#srGlow)" opacity={PE(t, tFeel, 0.8)} />
            <Fig x={DX} y={DY} s={DS} color={C.amber} shadow={false} />
            {/* núcleo del pecho */}
            <circle cx={DX} cy={chest} r={34 + 6 * Math.sin(t * 4) * PE(t, tFeel, 0.5)} fill={C.amberGlow} opacity={PE(t, tFeel - 0.3, 0.6)} />
            {/* torrente de símbolos desde la cabeza */}
            {Array.from({length: 70}).map((_, i) => {
              const t0 = tDetail + 0.3 + i * 0.06;
              if (t0 > tBut + 0.4) return null;
              const u = P(t, t0, 1.3);
              if (u <= 0) return null;
              const passes = hash(i * 13) < 0.12;
              const x = lerp(DX + 120, sieveX - 22, Math.min(1, u * 1.4));
              const fall = passes ? 0 : Math.max(0, u * 1.4 - 1) * 1.6;
              const y = headY - 30 + (hash(i) - 0.5) * 180 + Math.sin(u * 8 + i) * 10 + fall * fall * 600;
              const xx = passes ? lerp(DX + 120, sieveX + 260, u) : x;
              const o = (passes ? 1 - u : 1 - clamp(fall)) * (1 - stopTorrent * 0.6);
              return (
                <text key={i} x={xx} y={y} fontSize={24 + hash(i * 3) * 14} fill={[C.cream, C.creamDim, C.coral, C.stoneLight][i % 4]} opacity={o} fontFamily="sans-serif">
                  {SYMS[i % 4]}
                </text>
              );
            })}
            {/* tamiz */}
            <g opacity={P(t, tDetail + 0.2, 0.5)}>
              <rect x={sieveX - 18} y={headY - 220} width={36} height={420} rx={8} fill="none" stroke={C.creamDim} strokeWidth={4} />
              {Array.from({length: 14}).map((_, i) => (
                <line key={i} x1={sieveX - 18} x2={sieveX + 18} y1={headY - 210 + i * 30} y2={headY - 195 + i * 30} stroke={C.creamDim} strokeWidth={2} />
              ))}
            </g>
            {/* palabra que nace del pecho */}
            {(() => {
              const k = easeOutBack(P(t, tFeel, 0.9));
              if (k <= 0) return null;
              return (
                <g>
                  <Draw d={`M${DX + 60} ${chest} C ${DX + 300} ${chest} ${DX + 420} ${chest - 120} ${1380} ${chest - 150}`} p={PO(t, tFeel - 0.2, 0.8)} color={C.amber} w={5} opacity={0.6} />
                  <g transform={`translate(1500 ${chest - 170}) scale(${k})`}>
                    <rect x={-150} y={-90} width={300} height={180} rx={40} fill={C.bg2} stroke={C.teal} strokeWidth={5} />
                    <Icon name="heart" s={1.5} color={C.amber} />
                  </g>
                </g>
              );
            })()}
          </Cam>
        </g>
      )}
    </Svg>
  );
};

// ════════════════════ Escena 13 — Agradar ≠ conectar ════════════════════
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
  const word = (txt: string, x: number, col: string, t0: number) => {
    const k = P(t, t0, 0.5);
    const mk = PE(t, t0 + 0.3, 0.6);
    return (
      <g opacity={k} transform={`translate(${x} ${330 + (1 - easeOutBack(k)) * 30})`}>
        <rect x={-210} y={8} width={420 * mk} height={22} rx={4} fill={col} opacity={0.9} />
        <text x={0} y={0} textAnchor="middle" fontFamily={OSWALD} fontWeight={600} fontSize={140} fill={C.cream} letterSpacing="0.03em">
          {txt}
        </text>
      </g>
    );
  };
  const badge = (name: string, x: number, y: number, col: string, t0: number) => {
    const k = easeOutBack(P(t, t0, 0.5));
    if (k <= 0) return null;
    return (
      <g transform={`translate(${x} ${y}) scale(${k})`}>
        <circle r={74} fill={C.bg2} stroke={col} strokeWidth={4} />
        <Icon name={name} s={1.2} color={col} sw={5} />
      </g>
    );
  };
  return (
    <Svg>
      <rect x={0} width={960} height={1080} fill={C.coral} opacity={0.06 + 0.05 * clamp(-focus)} />
      <rect x={960} width={960} height={1080} fill={C.teal} opacity={0.06 + 0.05 * clamp(focus)} />
      <Cam cx={960 + focus * 70} cy={560} z={1.04}>
        <line x1={960} x2={960} y1={200} y2={980} stroke={C.line} strokeWidth={2} opacity={P(t, a + 0.4, 0.6)} />
        {word('AGRADAR', 520, C.coral, tA)}
        {word('CONECTAR', 1400, C.teal, tC)}
        <g opacity={P(t, tNe, 0.4)} transform="translate(960 300)">
          <circle r={58} fill={C.bg} stroke={C.cream} strokeWidth={4} />
          <text y={30} textAnchor="middle" fontFamily={OSWALD} fontWeight={500} fontSize={90} fill={C.cream}>
            ≠
          </text>
        </g>
        {badge('thumb', 420, 600, C.coral, r1L)}
        {badge('clap', 620, 600, C.coral, r1L + 0.25)}
        {badge('ear', 1300, 600, C.teal, r1R)}
        {badge('bridge', 1500, 600, C.teal, r1R + 0.25)}
        {badge('mask', 420, 820, C.coral, r2L)}
        {badge('stage', 620, 820, C.coral, r2L + 0.25)}
        {badge('hand', 1300, 820, C.teal, r2R)}
        {badge('door', 1500, 820, C.teal, r2R + 0.25)}
      </Cam>
    </Svg>
  );
};

// ════════════════════ Escena 14 — Raíces ════════════════════
const ROOT_X = [360, 660, 960, 1260, 1560];
const GROUND = 600;
const rootPath = (x: number, k: number, depth: number, seed: number) => {
  let d = `M${x} ${GROUND}`;
  let cx = x;
  let cy = GROUND;
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

export const Scene14: React.FC<SceneProps> = ({t, a}) => {
  const tListen = W(28, 'escuchar');
  const tUnd = W(28, 'comprender');
  const tShare = W(28, 'compartir');
  const tChange = W(28, 'relaciones') - 0.3;
  const tDeep = W(28, 'profundas') - 0.3;
  const tReal = W(28, 'reales') - 0.2;
  const down = PE(t, tChange, 3.2);
  const links = [tListen, tUnd, tShare, tShare + 0.4];
  return (
    <Svg>
      <Cam cx={960} cy={lerp(520, 830, down)} z={lerp(1, 0.86, down)}>
        <rect x={-400} y={GROUND} width={2720} height={1400} fill="url(#srSoil)" />
        <circle cx={960} cy={GROUND + 420} r={900} fill="url(#srWarm)" opacity={0.35 * down} />
        <line x1={-400} x2={2320} y1={GROUND} y2={GROUND} stroke={C.creamDim} strokeWidth={3} />
        {/* raíces */}
        {ROOT_X.map((x, i) =>
          [0, 1, 2, 3].map((k) => {
            const deep = k >= 2;
            const t0 = (deep ? tDeep : tChange) + i * 0.12 + k * 0.1;
            return (
              <Draw
                key={`${i}-${k}`}
                d={rootPath(x, k, deep ? 720 : 380, i * 10 + k)}
                p={PE(t, t0, deep ? 2.4 : 2.0)}
                color={deep ? C.amber : C.teal}
                w={deep ? 5 : 7}
                opacity={0.85}
              />
            );
          }),
        )}
        {ROOT_X.slice(0, 4).map((x, i) => (
          <Draw
            key={`w${i}`}
            d={`M${x} ${GROUND + 160} C ${x + 100} ${GROUND + 320}, ${x + 200} ${GROUND + 320}, ${x + 300} ${GROUND + 160}`}
            p={PE(t, tReal + i * 0.15, 1.2)}
            color={C.amberGlow}
            w={4}
            opacity={0.7}
          />
        ))}
        {/* conexiones luminosas */}
        {links.map((tl, i) => {
          const x0 = ROOT_X[i];
          const x1 = ROOT_X[i + 1];
          const y = GROUND - 2.0 * 40;
          return (
            <g key={i}>
              <Draw d={`M${x0 + 30} ${y} Q${(x0 + x1) / 2} ${y - 90} ${x1 - 30} ${y}`} p={PE(t, tl - 0.3, 0.9)} color={C.teal} w={14} opacity={0.25} />
              <Draw d={`M${x0 + 30} ${y} Q${(x0 + x1) / 2} ${y - 90} ${x1 - 30} ${y}`} p={PE(t, tl - 0.3, 0.9)} color={C.teal} w={5} />
            </g>
          );
        })}
        {ROOT_X.map((x, i) => (
          <Fig
            key={i}
            x={x}
            y={GROUND}
            s={2.0}
            color={i === 2 ? C.amber : mixHex(C.stoneLight, i % 2 ? '#d8b77a' : '#86c9c2', PE(t, links[Math.min(i, 3)], 1.2) * 0.7)}
            glow={i === 2 ? 0.6 : 0}
          />
        ))}
      </Cam>
    </Svg>
  );
};

