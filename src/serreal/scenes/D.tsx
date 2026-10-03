import React from 'react';
import {C, Cam, Draw, E, Fig, Icon, OSWALD, P, PE, PO, S, SceneProps, Title, TopFig, W, easeOutBack, figHeadY, hash, lerp, mixHex, noise} from '../kit';
import {Svg} from './A';

// ════════════════════ Escena 15 — El monstruo de la pared ════════════════════
const BLOCKS = [
  {x: 960, h: 300, icon: 'mask', word: 'divertido'},
  {x: 720, h: 210, icon: 'owl', word: 'sabio'},
  {x: 1200, h: 150, icon: 'star', word: 'atractivo'},
];

export const Scene15: React.FC<SceneProps> = ({t, a}) => {
  const tClick = W(29, 'no existen') - 0.15;
  const tPod = S(30) - 0.35;
  const grow = PE(t, a + 0.3, W(29, 'redes') - a);
  const shrink = PE(t, tClick, 0.5);
  const monster = grow * (1 - shrink);
  const lit = PE(t, tClick, 0.25);
  const pod = PE(t, tPod, 0.7);
  const fx = 1180;
  const gy = 880;
  const fs = 2.4;
  const hy = gy + figHeadY(0) * fs;
  const flick = 1 + 0.03 * noise(t * 12, 3) * monster;
  const sh = lerp(1, 4.2, monster) * flick;
  const phoneRot = lerp(0, 180, PE(t, tClick + 0.2, 0.5));
  return (
    <Svg>
      {pod < 1 && (
        <g opacity={1 - pod}>
          <rect width={1920} height={1080} fill={C.night} opacity={0.75 * (1 - lit)} />
          <rect width={1920} height={1080} fill="#3a2e22" opacity={0.35 * lit} />
          {/* pared y suelo */}
          <line x1={0} x2={1920} y1={gy + 2} y2={gy + 2} stroke={C.line} strokeWidth={2} />
          {/* luz del teléfono sobre la pared: hace visible la sombra */}
          <ellipse cx={lerp(1080, 820, monster)} cy={gy - 260 - 120 * monster} rx={lerp(380, 900, monster)} ry={lerp(330, 620, monster)} fill="url(#srPhone)" opacity={0.9 * (1 - lit)} />
          {/* sombra proyectada */}
          <g transform={`translate(${lerp(1040, 760, monster)} ${gy}) scale(${sh})`} opacity={lerp(0.35, 0.95, monster)}>
            <Fig x={0} y={0} s={fs} color="#06080c" shadow={false} />
            {monster > 0.05 &&
              ['bell', 'heart', 'thumb', 'bell', 'heart', 'user', 'bell'].map((n, i) => {
                const an = -150 + i * 20;
                const r = 40 + 6 * Math.sin(t * 6 + i);
                return (
                  <Icon
                    key={i}
                    name={n}
                    x={Math.cos((an * Math.PI) / 180) * r}
                    y={figHeadY(0) * fs + Math.sin((an * Math.PI) / 180) * r}
                    s={0.32 * monster}
                    rot={an + 90}
                    color="#06080c"
                  />
                );
              })}
          </g>
          {/* destellos rojos de notificación en la sombra */}
          {monster > 0.2 &&
            [0, 1, 2, 3, 4].map((i) => (
              <circle key={i} cx={lerp(1040, 760, monster) + (hash(i) - 0.5) * 500 * monster} cy={gy - 100 - hash(i * 3) * 600 * monster} r={9} fill={C.coral} opacity={monster * (0.5 + 0.5 * Math.sin(t * 7 + i * 2))} />
            ))}
          {/* luz del teléfono sobre la figura */}
          <circle cx={fx - 50} cy={hy + 40} r={260} fill="url(#srPhone)" opacity={1 - lit} />
          <Fig x={fx} y={gy} s={fs} color={mixHex(C.amberMuted, C.amber, lit)} glow={lit * 0.4} />
          <g transform={`translate(${fx - 52} ${lerp(hy + 46, gy - 8, PE(t, tClick + 0.2, 0.6))}) rotate(${phoneRot})`}>
            <rect x={-14} y={-24} width={28} height={48} rx={5} fill={mixHex('#cfe3ff', '#2a2f3a', lit)} stroke={C.cream} strokeWidth={2} />
          </g>
          {/* interruptor */}
          <g transform="translate(300 520)" opacity={0.8}>
            <rect x={-26} y={-44} width={52} height={88} rx={8} fill={C.bg2} stroke={C.creamDim} strokeWidth={3} />
            <rect x={-12} y={lerp(4, -32, lit)} width={24} height={28} rx={4} fill={mixHex(C.stone, C.amber, lit)} />
          </g>
          {lit > 0 && <circle cx={960} cy={-100} r={1100} fill="url(#srWarm)" opacity={0.5 * lit} />}
        </g>
      )}
      {pod > 0 && (
        <g opacity={pod}>
          <line x1={0} x2={1920} y1={gy + 2} y2={gy + 2} stroke={C.line} strokeWidth={2} />
          {BLOCKS.map((b, i) => {
            const tf = W(30, b.word) + 0.15;
            const f = Math.max(0, t - tf);
            const pieces = [0, 1, 2, 3];
            const fell = t > tf;
            return (
              <g key={i}>
                {pieces.map((k) => {
                  const pw = 220 / 2;
                  const ph = b.h / 2;
                  const px = b.x - 110 + (k % 2) * pw;
                  const py = gy - b.h + Math.floor(k / 2) * ph;
                  const vx = ((k % 2 ? 1 : -1) * (120 + hash(i * 4 + k) * 160));
                  const dy = fell ? Math.min(gy - ph - py, 0.5 * 2400 * f * f) : 0;
                  const rot = fell ? (k % 2 ? 1 : -1) * Math.min(90, f * 200) * (0.4 + hash(k + i) * 0.6) : 0;
                  return (
                    <rect
                      key={k}
                      x={px + (fell ? vx * Math.min(f, 0.6) : 0)}
                      y={py + dy}
                      width={pw - 4}
                      height={ph - 4}
                      rx={4}
                      fill={mixHex(C.stoneDark, C.stone, 0.5 + 0.1 * k)}
                      transform={`rotate(${rot} ${px + pw / 2} ${py + ph / 2 + dy})`}
                      opacity={1 - P(t, tf + 1.4, 0.8)}
                    />
                  );
                })}
                <Icon
                  name={b.icon}
                  x={b.x + (fell ? Math.min(f, 0.8) * 90 : 0)}
                  y={fell ? Math.min(gy - 40, gy - b.h - 60 + 0.5 * 2400 * f * f) : gy - b.h - 60}
                  s={1.4}
                  rot={fell ? Math.min(f * 300, 120) : 0}
                  color={[C.coral, C.cream, C.amber][i]}
                  opacity={1 - P(t, tf + 1.4, 0.8)}
                  sw={5}
                />
                {i === 0 && <rect x={b.x - 30} y={gy - b.h + 20} width={60} height={0} />}
              </g>
            );
          })}
          <Fig x={1560} y={gy} s={2.2} color={C.amber} glow={0.5} />
        </g>
      )}
    </Svg>
  );
};

// ════════════════════ Escena 16 — Solo tú ════════════════════
const PHRASE = 'Solo tienes que ser tú';
export const Scene16: React.FC<SceneProps> = ({t, a}) => {
  const k = P(t, S(31) - 0.05, E(31) - S(31) + 0.1);
  const n = Math.round(PHRASE.length * k);
  const z = lerp(1, 1.07, P(t, a, 5));
  return (
    <>
      <Svg>
        <Cam z={z}>
          <circle cx={960} cy={500} r={260} fill="url(#srGlow)" opacity={0.7} />
          <Fig x={960} y={600} s={1.7} color={C.amber} />
        </Cam>
      </Svg>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 690,
          textAlign: 'center',
          fontFamily: OSWALD,
          fontWeight: 400,
          fontSize: 50,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.cream,
          transform: `scale(${z})`,
        }}
      >
        <span>{PHRASE.slice(0, n)}</span>
        <span style={{opacity: 0}}>{PHRASE.slice(n)}</span>
      </div>
    </>
  );
};

// ════════════════════ Escena 17 — Hilos cortados ════════════════════
const GROUP_X = [400, 680, 960, 1240, 1520];
const OPEN_GRID = (() => {
  const out: {x: number; y: number; c: string; id: number}[] = [];
  for (let r = -5; r <= 5; r++)
    for (let c = -8; c <= 8; c++) {
      const id = (r + 5) * 17 + (c + 8);
      // se agrupan: cada uno se desplaza hacia el centro de su grupo de 2×2
      const gx = Math.floor((c + 8) / 2) * 2 - 8 + 0.5;
      const gy = Math.floor((r + 5) / 2) * 2 - 5 + 0.5;
      const x = 960 + lerp(c, gx, 0.42) * 150;
      const y = 540 + lerp(r, gy, 0.42) * 150;
      const h = hash(id);
      out.push({x, y, id, c: c === 0 && r === 0 ? C.amber : h < 0.33 ? '#d8b77a' : h < 0.66 ? '#86c9c2' : mixHex(C.cream, C.amber, 0.25)});
    }
  return out;
})();

export const Scene17: React.FC<SceneProps> = ({t, a}) => {
  const tGrow = S(32);
  const tUp = S(33) - 0.4;
  const tCut = W(33, 'controlar') - 0.3;
  const tMask = W(33, 'visto') - 0.4;
  const tOut = W(33, 'todo se vuelve') - 0.3;
  const out = PE(t, tOut, 1.4);
  const up = PE(t, tUp, 2.0);
  const gy = 820;
  const fs = 2.2;
  const hy = gy + figHeadY(0) * fs;
  const strings = [
    {x: 960 - 30, y: gy - 60 * fs},
    {x: 960, y: hy - 14 * fs},
    {x: 960 + 30, y: gy - 60 * fs},
  ];
  const barY = -380;
  const z2 = lerp(1.15, 0.68, PE(t, tOut, E(33) - tOut + 3));
  const sunrise = PE(t, tOut + 0.5, 6);
  return (
    <Svg>
      {out < 1 && (
        <g opacity={1 - out}>
          <Cam cx={960} cy={lerp(560, 200, up)} z={lerp(1, 0.82, up)}>
            <line x1={-200} x2={2120} y1={gy + 2} y2={gy + 2} stroke={C.line} strokeWidth={2} />
            {/* enredaderas entre figuras */}
            {GROUP_X.slice(0, 4).map((x, i) => {
              const x1 = GROUP_X[i + 1];
              const d = `M${x + 20} ${gy - 30} C ${x + 90} ${gy - 220}, ${x1 - 90} ${gy - 220}, ${x1 - 20} ${gy - 30}`;
              const p = PE(t, tGrow + i * 0.5, 2.6);
              return (
                <g key={i}>
                  <Draw d={d} p={p} color={C.teal} w={6} />
                  {[0.2, 0.35, 0.5, 0.65, 0.8].map((u, k) => {
                    const lk = easeOutBack(P(t, tGrow + i * 0.5 + u * 2.6, 0.5));
                    if (lk <= 0) return null;
                    const bx = (1 - u) ** 3 * (x + 20) + 3 * (1 - u) ** 2 * u * (x + 90) + 3 * (1 - u) * u * u * (x1 - 90) + u ** 3 * (x1 - 20);
                    const by = (1 - u) ** 3 * (gy - 30) + 3 * (1 - u) ** 2 * u * (gy - 220) + 3 * (1 - u) * u * u * (gy - 220) + u ** 3 * (gy - 30);
                    return <ellipse key={k} cx={bx} cy={by - 14 * (k % 2 ? 1 : -1)} rx={16 * lk} ry={8 * lk} fill={C.teal} transform={`rotate(${k % 2 ? 30 : -30} ${bx} ${by})`} />;
                  })}
                </g>
              );
            })}
            {GROUP_X.map((x, i) =>
              i === 2 ? null : <Fig key={i} x={x} y={gy} s={fs} color={mixHex(C.stoneLight, i % 2 ? '#d8b77a' : '#86c9c2', 0.6)} />,
            )}
            {/* hilos de marioneta */}
            <g>
              <line x1={820} x2={1100} y1={barY} y2={barY} stroke={C.coral} strokeWidth={10} strokeLinecap="round" />
              <line x1={960} x2={960} y1={barY - 70} y2={barY + 70} stroke={C.coral} strokeWidth={10} strokeLinecap="round" />
              {strings.map((st, i) => {
                const tc = tCut + i * 0.4;
                const c = Math.max(0, t - tc);
                const topX = [840, 960, 1080][i];
                const cutY = lerp(barY, st.y, 0.55);
                if (t < tc)
                  return <line key={i} x1={topX} y1={barY} x2={st.x} y2={st.y} stroke={C.coral} strokeWidth={2.5} opacity={0.9} />;
                const upper = Math.min(1, c * 2.5);
                const lower = Math.min(1, c * 1.8);
                return (
                  <g key={i}>
                    <line x1={topX} y1={barY} x2={lerp(lerp(topX, st.x, 0.55), topX, upper)} y2={lerp(cutY, barY, upper)} stroke={C.coral} strokeWidth={2.5} />
                    <path
                      d={`M${st.x} ${st.y} Q ${st.x + 30 * lower} ${lerp(cutY, st.y + 40, lower)} ${lerp(lerp(topX, st.x, 0.55), st.x + 10, lower)} ${lerp(cutY, st.y + 90, lower)}`}
                      fill="none"
                      stroke={C.coral}
                      strokeWidth={2.5}
                      opacity={1 - P(t, tc + 0.8, 0.6)}
                    />
                    <circle cx={lerp(topX, st.x, 0.55)} cy={cutY} r={30 * PO(t, tc, 0.4)} fill="none" stroke={C.cream} strokeWidth={2} opacity={1 - P(t, tc, 0.4)} />
                  </g>
                );
              })}
            </g>
            <Fig x={960} y={gy} s={fs} color={C.amber} glow={0.4 + 0.5 * P(t, tMask, 1)} />
            {/* máscara */}
            {(() => {
              const f = Math.max(0, t - tMask);
              const my = hy + (t > tMask ? Math.min(gy - 20 - hy, 0.5 * 2200 * f * f) : 0);
              return (
                <g opacity={1 - P(t, tMask + 1.2, 0.6)}>
                  <Icon name="mask" x={960 + 16 + (t > tMask ? f * 120 : 0)} y={my} s={0.62} rot={t > tMask ? Math.min(f * 260, 100) : 0} color={C.coral} />
                </g>
              );
            })()}
          </Cam>
        </g>
      )}
      {out > 0 && (
        <g opacity={out}>
          <circle cx={960} cy={lerp(1500, 1150, sunrise)} r={1300} fill="url(#srSun)" opacity={sunrise} />
          <Cam z={z2 * lerp(1.6, 1, out)}>
            {OPEN_GRID.map((p, i) => {
              // muros del principio que caen
              const h = 57;
              const cx = 960 + (Math.round((p.x - 960) / 150)) * 150;
              const cy = 540 + (Math.round((p.y - 540) / 150)) * 150;
              return (
                <rect key={`w${i}`} x={cx - h} y={cy - h} width={h * 2} height={h * 2} fill="none" stroke={C.stoneLight} strokeWidth={3} opacity={0.5 * (1 - PE(t, tOut + 0.2 + hash(i) * 1.2, 0.8))} />
              );
            })}
            {OPEN_GRID.map((p, i) =>
              OPEN_GRID.slice(i + 1).map((q, j) => {
                const d = Math.hypot(p.x - q.x, p.y - q.y);
                if (d > 120) return null;
                return <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={C.teal} strokeWidth={4} opacity={0.6 * PE(t, tOut + 0.8 + hash(i + j) * 1.5, 1)} />;
              }),
            )}
            {OPEN_GRID.map((p, i) => (
              <TopFig key={i} x={p.x} y={p.y} s={1.05} color={p.c} dir={(Math.atan2(540 - p.y, 960 - p.x) * 180) / Math.PI + noise(t * 0.3, i) * 40} glow={p.c === C.amber ? 1 : 0.15} />
            ))}
          </Cam>
        </g>
      )}
    </Svg>
  );
};

// ════════════════════ Escena 18 — Cierre ════════════════════
export const Scene18: React.FC<SceneProps> = ({t, a}) => {
  const k = PE(t, a + 0.6, 1.2);
  return (
    <>
      <Svg>
        <rect width={1920} height={1080} fill={C.bg} opacity={0.6} />
      </Svg>
      <Title words={['Ser', 'real']} markWords={[1]} mark={PE(t, a + 1.6, 0.9)} reveal={k} size={170} y={540} tracking={0.06} />
    </>
  );
};

