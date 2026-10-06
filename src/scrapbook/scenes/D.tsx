import React from 'react';
import {Cam, Cut, Dot, Dymo, E, Fig, Hand, Icon, K, P, PE, PFig, PO, Page, S, SceneProps, Svg, Tape, Typed, W, clamp, easeOutBack, figHeadY, hash, lerp, mixHex, noise, tornRect} from '../kit';

// ════════════════════ Escena 15 — Teatro de sombras y podio de cerillas ════════════════════
const BOXES = [
  {x: 960, n: 3, icon: 'mask', word: 'divertido', col: K.tomato},
  {x: 740, n: 2, icon: 'owl', word: 'sabio', col: K.ink},
  {x: 1180, n: 1, icon: 'star', word: 'atractivo', col: '#e9b53c'},
];
const Matchbox: React.FC<{x: number; y: number; rot?: number; id: number}> = ({x, y, rot = 0, id}) => (
  <Cut id={id} x={x} y={y} rot={rot} plain>
    <rect x={-105} y={-45} width={210} height={90} rx={4} fill="#e9dcc0" />
    <rect x={-105} y={-45} width={210} height={16} fill={K.tomato} />
    <rect x={-60} y={-18} width={120} height={46} fill="#2f5a8a" />
    <circle cx={0} cy={5} r={14} fill="#f4c64e" />
  </Cut>
);

export const Scene15: React.FC<SceneProps> = ({t, a}) => {
  const tClick = W(29, 'no existen') - 0.15;
  const tPod = S(30) - 0.35;
  const grow = PE(t, a + 0.3, W(29, 'redes') - a);
  const shrink = PE(t, tClick, 0.4);
  const monster = grow * (1 - shrink);
  const lit = t >= tClick ? 1 : 0;
  const pod = t >= tPod;
  const fx = 1180;
  const gy = 880;
  const fs = 2.4;
  const hy = gy + figHeadY(0) * fs;
  const sh = lerp(1, 3.3, monster) * (1 + 0.03 * noise(t * 12, 3) * monster);
  return (
    <>
      <Page kind={pod ? 'paper' : 'night'} tint={pod ? '#efe4cf' : lit ? '#5d5446' : undefined} />
      <Svg>
        {!pod && (
          <g>
            <polygon points={tornRect(-100, gy, 2200, 300, 161, 14)} fill={lit ? '#9b7f5c' : '#2a2a33'} />
            <ellipse cx={lerp(1080, 820, monster)} cy={gy - 280 - 120 * monster} rx={lerp(380, 900, monster)} ry={lerp(330, 620, monster)} fill="url(#phoneLight)" opacity={lit ? 0 : 1} />
            {/* sombra proyectada en la pared */}
            <g transform={`translate(${lerp(1040, 760, monster)} ${gy}) scale(${sh})`} opacity={lit ? 0.3 : lerp(0.4, 0.92, monster)}>
              <Fig x={0} y={0} s={fs} color="#0b0d14" shadow={false} />
            </g>
            {monster > 0.1 &&
              ['bell', 'heart', 'thumb', 'bell', 'heart', 'user', 'bell'].map((n, i) => {
                const an = -160 + i * 23;
                const cx = lerp(1040, 760, monster);
                const cy = gy + figHeadY(0) * fs * sh;
                const r = 16 * fs * sh * 0.9;
                return (
                  <Cut key={i} id={900 + i} x={cx + Math.cos((an * Math.PI) / 180) * r} y={cy + Math.sin((an * Math.PI) / 180) * r} s={0.75 * monster} rot={an + 90}>
                    <Icon name={n} color={K.tomato} />
                  </Cut>
                );
              })}
            {!lit && <circle cx={fx - 50} cy={hy + 40} r={240} fill="url(#phoneLight)" />}
            <PFig id={910} x={fx} y={gy} s={fs} color={lit ? K.mustard : '#8a7a5a'} />
            <g transform={`translate(${fx - 56} ${lit ? gy - 14 : hy + 46}) rotate(${lit ? 90 : 0})`}>
              <Cut id={911} plain>
                <rect x={-15} y={-26} width={30} height={52} rx={5} fill={K.kraft} />
                <rect x={-11} y={-20} width={22} height={38} rx={3} fill={lit ? '#3a3a40' : '#dcecff'} />
              </Cut>
            </g>
            {/* lámpara de papel e interruptor */}
            <g transform="translate(330 520)">
              <Cut id={912} plain>
                <rect x={-28} y={-46} width={56} height={92} rx={8} fill={K.white} />
                <rect x={-12} y={lit ? -34 : 4} width={24} height={30} rx={4} fill={lit ? K.mustard : K.newsDark} />
              </Cut>
            </g>
            {lit === 1 && <circle cx={960} cy={-60} r={1100} fill="url(#lamp)" />}
          </g>
        )}
        {pod && (
          <g>
            <polygon points={tornRect(-100, gy, 2200, 300, 162, 14)} fill="#d9c09a" />
            {BOXES.map((b, bi) => {
              const tf = W(30, b.word) + 0.15;
              const f = Math.max(0, t - tf);
              const fell = t > tf;
              return (
                <g key={bi}>
                  {Array.from({length: b.n}).map((_, k) => {
                    const y0 = gy - 45 - k * 92;
                    const dir = (k + bi) % 2 ? 1 : -1;
                    const rot = fell ? dir * Math.min(90, f * 260) * (0.5 + hash(k + bi) * 0.5) : 0;
                    const dy = fell ? Math.min(gy - 45 - y0, 0.5 * 2600 * f * f) : 0;
                    const dx = fell ? dir * Math.min(f, 0.5) * (100 + k * 60) : 0;
                    return <Matchbox key={k} id={920 + bi * 3 + k} x={b.x + dx} y={y0 + dy} rot={rot} />;
                  })}
                  <Cut id={930 + bi} x={b.x + (fell ? Math.min(f, 0.8) * 120 : 0)} y={fell ? Math.min(gy - 40, gy - b.n * 92 - 60 + 0.5 * 2600 * f * f) : gy - b.n * 92 - 60} s={1.3} rot={fell ? Math.min(f * 320, 130) : -6}>
                    <Icon name={b.icon} color={b.col} sw={6} />
                  </Cut>
                </g>
              );
            })}
            <PFig id={940} x={1560} y={gy} s={2.2} color={K.mustard} />
          </g>
        )}
      </Svg>
    </>
  );
};

// ════════════════════ Escena 16 — Máquina de escribir ════════════════════
const PHRASE = 'Solo tienes que ser tú';
export const Scene16: React.FC<SceneProps> = ({t, a}) => {
  const k = P(t, S(31) - 0.05, E(31) - S(31) + 0.1);
  const n = Math.round(PHRASE.length * k);
  return (
    <>
      <Page kind="paper" tint="#f6efdf" />
      <Svg>
        <circle cx={960} cy={480} r={260} fill="url(#lamp)" />
        <PFig id={950} x={960} y={600} s={1.7} color={K.mustard} />
        <Tape x={960} y={410} w={120} h={30} rot={-4} pat="washiC" opacity={P(t, a + 0.4, 0.2)} />
      </Svg>
      <Typed text={PHRASE} n={n} y={690} size={56} />
    </>
  );
};

// ════════════════════ Escena 17 — Hojas, hilos y tijeras; el álbum abierto ════════════════════
const GROUP_X = [400, 680, 960, 1240, 1520];
const Scissors: React.FC<{x: number; y: number; open: number}> = ({x, y, open}) => (
  <g transform={`translate(${x} ${y}) rotate(-20)`}>
    <Cut id={960} plain jitter={0.5}>
      <g transform={`rotate(${-open * 18})`}>
        <polygon points="0,0 120,-8 120,4 0,10" fill="#b9bfc6" />
        <circle cx={-46} cy={-16} r={24} fill="none" stroke={K.tomato} strokeWidth={12} />
      </g>
      <g transform={`rotate(${open * 18})`}>
        <polygon points="0,0 120,8 120,-4 0,-10" fill="#9aa1a9" />
        <circle cx={-46} cy={16} r={24} fill="none" stroke={K.tomato} strokeWidth={12} />
      </g>
      <circle r={6} fill={K.ink} />
    </Cut>
  </g>
);

const OPEN_GRID = (() => {
  const out: {x: number; y: number; c: string}[] = [];
  for (let r = -2; r <= 2; r++)
    for (let c = -3; c <= 3; c++) {
      const gx = Math.floor((c + 3) / 2) * 2 - 3 + 0.5;
      const gy = Math.floor((r + 2) / 2) * 2 - 2 + 0.5;
      const h = hash((r + 2) * 7 + c + 3);
      out.push({
        x: lerp(c, gx, 0.4) * 110,
        y: lerp(r, gy, 0.4) * 110,
        c: c === 0 && r === 0 ? K.mustard : h < 0.33 ? K.sage : h < 0.66 ? K.mustard : K.blue,
      });
    }
  return out;
})();

export const Scene17: React.FC<SceneProps> = ({t, a}) => {
  const tGrow = S(32);
  const tUp = S(33) - 0.4;
  const tCut = W(33, 'controlar') - 0.3;
  const tMask = W(33, 'visto') - 0.4;
  const tOut = W(33, 'todo se vuelve') - 0.3;
  const out = t >= tOut;
  const up = PE(t, tUp, 2.0);
  const gy = 820;
  const fs = 2.2;
  const hy = gy + figHeadY(0) * fs;
  const strings = [
    {x: 960 - 30, y: gy - 60 * fs, top: 850},
    {x: 960, y: hy - 14 * fs, top: 960},
    {x: 960 + 30, y: gy - 60 * fs, top: 1070},
  ];
  const barY = -380;
  // tijeras: van de un hilo al siguiente
  const ci = clamp(Math.floor((t - tCut + 0.3) / 0.4), 0, 2);
  const cutY = (i: number) => lerp(barY, strings[i].y, 0.55);
  const cutX = (i: number) => lerp(strings[i].top, strings[i].x, 0.55);
  const scOpen = 0.5 + 0.5 * Math.cos(((t - tCut + 0.3) / 0.4) * Math.PI * 2);
  // vista final del álbum
  const pull = PE(t, tOut, 3.5);
  const sun = PE(t, tOut + 0.3, 5);
  return (
    <>
      {!out && (
        <>
          <Page kind="paper" tint="#f0e5cf" />
          <Svg>
            <Cam cx={960} cy={lerp(560, 200, up)} z={lerp(1, 0.82, up)}>
              <polygon points={tornRect(-300, gy, 2520, 400, 171, 14)} fill="#d9c09a" />
              {/* enredaderas de hojas de papel */}
              {GROUP_X.slice(0, 4).map((x, i) => {
                const x1 = GROUP_X[i + 1];
                const d = `M${x + 20} ${gy - 30} C ${x + 90} ${gy - 230}, ${x1 - 90} ${gy - 230}, ${x1 - 20} ${gy - 30}`;
                const p = PE(t, tGrow + i * 0.5, 2.6);
                return (
                  <g key={i}>
                    <Hand d={d} p={p} color="#6e8f5a" w={5} />
                    {[0.18, 0.32, 0.46, 0.6, 0.74, 0.86].map((u, k) => {
                      if (t < tGrow + i * 0.5 + u * 2.6) return null;
                      const lk = easeOutBack(P(t, tGrow + i * 0.5 + u * 2.6, 0.3));
                      const bx = (1 - u) ** 3 * (x + 20) + 3 * (1 - u) ** 2 * u * (x + 90) + 3 * (1 - u) * u * u * (x1 - 90) + u ** 3 * (x1 - 20);
                      const by = (1 - u) ** 3 * (gy - 30) + 3 * (1 - u) ** 2 * u * (gy - 230) + 3 * (1 - u) * u * u * (gy - 230) + u ** 3 * (gy - 30);
                      const dried = (i + k) % 3 === 0;
                      return (
                        <Cut key={k} id={970 + i * 10 + k} x={bx} y={by - 16 * (k % 2 ? 1 : -1)} rot={k % 2 ? 35 : -35} s={lk} plain>
                          <path d="M-22 0 C-10 -14 10 -14 22 0 C10 14 -10 14 -22 0 Z" fill={dried ? '#b58a4c' : '#7fae6a'} />
                          <line x1={-20} x2={20} y1={0} y2={0} stroke={dried ? '#8a6234' : '#4f7a41'} strokeWidth={1.5} />
                        </Cut>
                      );
                    })}
                  </g>
                );
              })}
              {GROUP_X.map((x, i) => (i === 2 ? null : <PFig key={i} id={990 + i} x={x} y={gy} s={fs} color={[K.sage, K.blue, '', K.blue, K.sage][i]} />))}
              {/* cruz de palitos de helado */}
              <Cut id={995} x={960} y={barY} plain>
                <rect x={-150} y={-14} width={300} height={28} rx={14} fill="#e2c48e" />
                <rect x={-14} y={-90} width={28} height={180} rx={14} fill="#e2c48e" />
              </Cut>
              {strings.map((st, i) => {
                const tc = tCut + i * 0.4;
                const c = Math.max(0, t - tc);
                if (t < tc) return <line key={i} x1={st.top} y1={barY} x2={st.x} y2={st.y} stroke={K.tomato} strokeWidth={3} />;
                const upper = Math.min(1, c * 2.5);
                const lower = Math.min(1, c * 1.8);
                return (
                  <g key={i}>
                    <line x1={st.top} y1={barY} x2={lerp(cutX(i), st.top, upper)} y2={lerp(cutY(i), barY, upper)} stroke={K.tomato} strokeWidth={3} />
                    <path d={`M${st.x} ${st.y} Q ${st.x + 30 * lower} ${lerp(cutY(i), st.y + 40, lower)} ${lerp(cutX(i), st.x + 10, lower)} ${lerp(cutY(i), st.y + 90, lower)}`} fill="none" stroke={K.tomato} strokeWidth={3} opacity={1 - P(t, tc + 0.8, 0.5)} />
                  </g>
                );
              })}
              {t > tCut - 0.7 && t < tCut + 1.3 && <Scissors x={cutX(ci) - 100} y={cutY(ci) + 30} open={scOpen} />}
              <PFig id={996} x={960} y={gy} s={fs} color={K.mustard} />
              {(() => {
                const f = Math.max(0, t - tMask);
                const my = hy + (t > tMask ? Math.min(gy - 20 - hy, 0.5 * 2200 * f * f) : 0);
                return (
                  <Cut id={997} x={960 + 16 + (t > tMask ? f * 120 : 0)} y={my} s={0.62} rot={t > tMask ? Math.min(f * 260, 100) : 0} opacity={1 - P(t, tMask + 1.2, 0.5)}>
                    <Icon name="mask" color={K.tomato} />
                  </Cut>
                );
              })()}
            </Cam>
          </Svg>
        </>
      )}
      {out && (
        <div style={{position: 'absolute', inset: 0, background: K.wood}}>
          <Svg>
            {/* vetas de la mesa */}
            {Array.from({length: 22}).map((_, i) => (
              <path key={i} d={`M-50 ${i * 52 + 10} C 500 ${i * 52 + 30 * Math.sin(i)}, 1300 ${i * 52 - 30 * Math.cos(i)}, 1980 ${i * 52 + 14}`} stroke="#4a311e" strokeWidth={3} fill="none" opacity={0.5} />
            ))}
            <circle cx={300} cy={-100} r={1300} fill="url(#dawn)" opacity={0.55 * sun} />
            <Cam cx={lerp(560, 960, pull)} cy={lerp(520, 540, pull)} z={lerp(2.1, 0.92, pull)}>
              {/* álbum abierto */}
              <rect x={200} y={170} width={1520} height={760} rx={10} fill="#3c2a1d" filter="url(#pshadow)" />
              <rect x={220} y={185} width={735} height={730} fill="#f5f1e6" />
              <rect x={965} y={185} width={735} height={730} fill={K.paper} />
              <rect x={220} y={185} width={735} height={730} fill="url(#gridPat)" opacity={0.7} />
              <rect x={900} y={185} width={120} height={730} fill="#3a2410" opacity={0.18} />
              {/* página de las celdas: cuadros borrados y figuras unidas con hilo */}
              <g transform="translate(587 550)">
                {OPEN_GRID.map((p, i) => (
                  <rect key={`w${i}`} x={Math.round(p.x / 110) * 110 - 45} y={Math.round(p.y / 110) * 110 - 45} width={90} height={90} fill="none" stroke={K.graphite} strokeWidth={2} opacity={0.12} />
                ))}
                {OPEN_GRID.map((p, i) =>
                  OPEN_GRID.slice(i + 1).map((q, j) => (Math.hypot(p.x - q.x, p.y - q.y) < 90 ? <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={K.sage} strokeWidth={4} opacity={PE(t, tOut + 0.5 + hash(i + j), 0.8)} /> : null)),
                )}
                {Array.from({length: 18}).map((_, i) => (
                  <rect key={`c${i}`} x={(hash(i) - 0.5) * 680} y={(hash(i * 3) - 0.5) * 600} width={6} height={4} fill="#d8c7c0" />
                ))}
                {OPEN_GRID.map((p, i) => (
                  <Dot key={i} id={1000 + i} x={p.x} y={p.y} s={0.9} color={p.c} dir={(Math.atan2(-p.y, -p.x) * 180) / Math.PI} />
                ))}
              </g>
              {/* página de recuerdos: mini polaroids de escenas anteriores */}
              {[
                {x: 1120, y: 330, r: -6, c: '#cfe0ea'},
                {x: 1340, y: 300, r: 5, c: '#eadcbc'},
                {x: 1560, y: 340, r: -3, c: '#f1d9b0'},
                {x: 1160, y: 640, r: 4, c: K.sageLight},
                {x: 1400, y: 660, r: -5, c: '#efc4b6'},
                {x: 1600, y: 630, r: 7, c: '#f6d9a8'},
              ].map((pp, i) => (
                <g key={i} transform={`translate(${pp.x} ${pp.y}) rotate(${pp.r})`} filter="url(#pshadow)">
                  <rect x={-90} y={-100} width={180} height={210} fill={K.white} />
                  <rect x={-78} y={-88} width={156} height={150} fill={pp.c} />
                  <Fig x={0} y={50} s={0.9} color={[K.mustard, K.mustard, K.mustard, K.sage, K.tomato, K.mustard][i]} shadow={false} />
                </g>
              ))}
              <Tape x={1120} y={240} w={100} h={28} rot={-10} pat="washiA" />
              <Tape x={1560} y={250} w={100} h={28} rot={8} pat="washiB" />
              <Tape x={1400} y={565} w={100} h={28} rot={-4} pat="washiC" />
            </Cam>
          </Svg>
        </div>
      )}
    </>
  );
};

// ════════════════════ Escena 18 — El álbum se cierra ════════════════════
export const Scene18: React.FC<SceneProps> = ({t, a}) => {
  const n = Math.floor(P(t, a + 0.9, 1.4) * 8);
  const band = PO(t, a + 3.0, 0.4);
  return (
    <div style={{position: 'absolute', inset: 0, background: K.wood}}>
      <Svg>
        {Array.from({length: 22}).map((_, i) => (
          <path key={i} d={`M-50 ${i * 52 + 10} C 500 ${i * 52 + 30 * Math.sin(i)}, 1300 ${i * 52 - 30 * Math.cos(i)}, 1980 ${i * 52 + 14}`} stroke="#4a311e" strokeWidth={3} fill="none" opacity={0.5} />
        ))}
        <g transform="rotate(-2 960 540)">
          <rect x={470} y={170} width={980} height={740} rx={16} fill={K.kraftDark} filter="url(#pshadow)" />
          <rect x={480} y={180} width={960} height={720} rx={12} fill={K.kraft} />
          <rect x={480} y={180} width={60} height={720} fill={K.kraftDark} opacity={0.6} />
          <Dymo text="SER REAL" n={n} x={1010} y={520} size={64} rot={-1.5} />
          {band > 0 && <rect x={lerp(1500, 1300, band)} y={150} width={18} height={800} rx={8} fill={K.card} />}
        </g>
      </Svg>
    </div>
  );
};

