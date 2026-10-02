import React from 'react';
import {S, W} from '../../estatus/timing';
import {
  Bg,
  Cam,
  clamp,
  Cutout,
  eio,
  eo,
  HEAD,
  Highlight,
  Layer,
  lerp,
  MARK,
  Marker,
  MarkerArrow,
  MarkerCircle,
  PhotoPerson,
  pop,
  pr,
  SANS,
  settle,
  Sheet,
  Tag,
  Tape,
  TYPE,
  Typed,
  V,
} from '../kit';
import {Question, SceneProps} from './A';

/** Encabezado numerado de cada «cómo superarlo» */
const Head: React.FC<{t: number; at: number; n: string; text: string; dark?: boolean}> = ({t, at, n, text, dark}) => (
  <g opacity={eo(t, at, 0.3)}>
    <rect x={80} y={60} width={110} height={110} fill={V.yellow} />
    <text x={135} y={145} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={90} fill={V.ink}>
      {n}
    </text>
    <Typed x={220} y={140} text={text} p={pr(t, at + 0.1, 0.8)} size={62} font={HEAD} weight={800} color={dark ? '#fbfaf5' : V.ink} />
  </g>
);

// ───────── Escena 19: la suerte (máquina de Galton) ─────────
const ROWS = 10;
const GAP = 52;
const N_BALLS = 64;
const BALLS = Array.from({length: N_BALLS}, (_, i) => {
  const bits = Array.from({length: ROWS}, (_, r) => (Math.sin(i * 127.1 + r * 311.7) * 43758.5453) % 1);
  const dirs = bits.map((v) => (Math.abs(v) > 0.5 ? 1 : -1));
  return {dirs, bin: dirs.filter((d) => d > 0).length};
});
const YOU = 41;

export const Galton: React.FC<SceneProps> = ({t, a, b}) => {
  const tLuck = W(46, 'suerte');
  const tAcc = W(46, 'accidentes');
  const tHier = W(46, 'jerarquía');
  const tNo = S(47);
  const start = a + 0.9;
  const spacing = 0.14;
  const step = 0.11;
  const top = 210;
  const cx = 960;
  const binY = top + ROWS * GAP + 40;
  const counts = new Array(ROWS + 1).fill(0);
  const balls = BALLS.map((bl, i) => {
    const t0 = start + i * spacing + (i === YOU ? 0 : 0);
    const age = t - t0;
    if (age < 0) return null;
    const r = Math.min(ROWS, Math.floor(age / step));
    const frac = clamp(age / step - r);
    let k = 0;
    for (let j = 0; j < r; j++) k += bl.dirs[j] > 0 ? 1 : 0;
    const xAt = (row: number, kk: number) => cx + (2 * kk - row) * (GAP / 2);
    if (r < ROWS) {
      const nk = k + (bl.dirs[r] > 0 ? 1 : 0);
      const x = lerp(xAt(r, k), xAt(r + 1, nk), frac);
      const y = top + (r + frac) * GAP - Math.sin(frac * Math.PI) * 16;
      return {x, y, i};
    }
    // en el casillero
    const slot = counts[bl.bin]++;
    const fallAge = age - ROWS * step;
    const yEnd = binY + 262 - slot * 20;
    const y = Math.min(yEnd, binY + fallAge * 900);
    return {x: xAt(ROWS, bl.bin), y, i};
  });
  return (
    <Cam t={t} keys={[[a, 960, 560, 1.0], [tNo - 0.6, 960, 560, 1.0], [tNo + 0.6, 960, 640, 0.88]]}>
      <Layer depth={0.3}>
        <Bg kind="grid" />
      </Layer>
      <Layer depth={1}>
        {/* clavos */}
        {Array.from({length: ROWS}, (_, r) =>
          Array.from({length: r + 1}, (_, k) => <circle key={`${r}-${k}`} cx={cx + (2 * k - r) * (GAP / 2)} cy={top + r * GAP + GAP / 2 + 10} r={5} fill={V.ink} />),
        )}
        {/* casilleros */}
        {Array.from({length: ROWS + 2}, (_, k) => {
          const x = cx + (2 * k - ROWS - 1) * (GAP / 2);
          return <path key={k} d={`M${x} ${binY + 20} L${x} ${binY + 280}`} stroke={V.ink} strokeWidth={3} />;
        })}
        <path d={`M${cx - (ROWS + 1) * (GAP / 2)} ${binY + 280} L${cx + (ROWS + 1) * (GAP / 2)} ${binY + 280}`} stroke={V.ink} strokeWidth={4} />
        {[
          ['ABAJO', cx - 230],
          ['EN MEDIO', cx],
          ['ARRIBA', cx + 230],
        ].map(([l, x]) => (
          <text key={l as string} x={x as number} y={binY + 320} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={26} letterSpacing={3} fill={V.ink}>
            {l as string}
          </text>
        ))}
        {balls.map((bl) =>
          bl ? <circle key={bl.i} cx={bl.x} cy={bl.y} r={bl.i === YOU ? 13 : 10} fill={bl.i === YOU ? V.yellow : V.gray} stroke={V.ink} strokeWidth={bl.i === YOU ? 3 : 1.5} /> : null,
        )}
        {(() => {
          const you = balls[YOU];
          if (!you || t < start + YOU * spacing + ROWS * step + 0.6) return null;
          return (
            <g>
              <MarkerArrow x0={you.x + 220} y0={you.y - 160} x1={you.x + 24} y1={you.y - 16} p={pr(t, start + YOU * spacing + ROWS * step + 0.6, 0.5)} />
              <text x={you.x + 230} y={you.y - 170} fontFamily={MARK} fontSize={48} fill={V.red}>
                tú
              </text>
            </g>
          );
        })()}
        <text x={1500} y={420} fontFamily={MARK} fontSize={44} fill={V.red} opacity={eo(t, tAcc, 0.3)} transform="rotate(-4 1500 420)">
          suerte · accidentes
        </text>
        <text x={1500} y={490} fontFamily={MARK} fontSize={44} fill={V.inkSoft} opacity={eo(t, tHier - 0.3, 0.3)} transform="rotate(-4 1500 490)">
          deciden tu lugar
        </text>
        <Tag x={420} y={1000} text="Simulación ilustrativa" />
        <g opacity={eo(t, tNo - 0.3, 0.3)}>
          <Sheet x={960} y={1120} w={1500} h={110} rot={-1}>
            <Highlight x={-700} y={-36} w={1400} h={64} p={pr(t, tNo + 0.4, 1.0)} />
            <Typed x={0} y={14} text="No trates a nadie —ni a ti mismo— como si mereciera su lugar" p={pr(t, tNo - 0.2, 1.4)} size={40} anchor="middle" />
          </Sheet>
        </g>
        <Head t={t} at={a + 0.05} n="1" text="LA SUERTE CUENTA" />
      </Layer>
    </Cam>
  );
};

// ───────── Escena 20: tu propia definición de éxito (radar) ─────────
const AXES = ['DINERO', 'ESTATUS', 'EMPATÍA', 'FAMILIA', 'AMISTAD', 'PROPÓSITO'];
const SOCIETY = [1.0, 0.95, 0.22, 0.28, 0.35, 0.3];
const YOURS = [0.5, 0.35, 0.85, 0.92, 0.8, 0.88];

export const Radar: React.FC<SceneProps> = ({t, a, b}) => {
  const tSoc = W(48, 'sociedad');
  const tMany = W(49, 'muchas formas');
  const tEmp = W(50, 'empatía');
  const tFam = W(50, 'familiar');
  const R = 330;
  const cx = 960;
  const cy = 590;
  const ang = (i: number) => -Math.PI / 2 + (i / 6) * Math.PI * 2;
  const pt = (i: number, v: number): [number, number] => [cx + Math.cos(ang(i)) * R * v, cy + Math.sin(ang(i)) * R * v];
  const shape = (vals: number[], p: number) => vals.map((v, i) => pt(i, v * p)).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + ' Z';
  const soc = eio(t, tSoc - 0.3, 1.0);
  const yours = eio(t, tMany - 0.2, 1.2);
  const rot = (t - a) * 0.6;
  return (
    <Cam t={t} keys={[[a, 960, 560, 1.0], [tEmp - 0.5, 960, 560, 1.0], [tEmp + 0.4, 820, 700, 1.25], [b, 840, 700, 1.2]]}>
      <Layer depth={0.3}>
        <Bg kind="grid" />
      </Layer>
      <Layer depth={1}>
        <g transform={`rotate(${rot} ${cx} ${cy})`}>
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <path key={k} d={shape([k, k, k, k, k, k], 1)} fill="none" stroke={V.grayLight} strokeWidth={2} />
          ))}
          {AXES.map((_, i) => {
            const [x, y] = pt(i, 1);
            return <path key={i} d={`M${cx} ${cy} L${x} ${y}`} stroke={V.grayLight} strokeWidth={2} />;
          })}
          {soc > 0 ? <path d={shape(SOCIETY, soc)} fill={V.gray} opacity={0.45} stroke={V.ink} strokeWidth={4} /> : null}
          {yours > 0 ? <path d={shape(YOURS, yours)} fill={V.yellow} opacity={0.7} stroke={V.ink} strokeWidth={4} style={{mixBlendMode: 'multiply'}} /> : null}
          {[
            [2, tEmp],
            [3, tFam],
          ].map(([i, at]) => {
            const [x, y] = pt(i, SOCIETY[i]);
            return <MarkerCircle key={i} cx={x} cy={y} rx={48} ry={48} p={pr(t, at, 0.5)} w={7} />;
          })}
        </g>
        {AXES.map((l, i) => {
          const a2 = ang(i) + (rot * Math.PI) / 180;
          const x = cx + Math.cos(a2) * (R + 70);
          const y = cy + Math.sin(a2) * (R + 60) + 12;
          return (
            <text key={l} x={x} y={y} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={38} fill={V.ink}>
              {l}
            </text>
          );
        })}
        <g opacity={eo(t, tSoc, 0.3)}>
          <rect x={1420} y={330} width={36} height={36} fill={V.gray} opacity={0.6} stroke={V.ink} strokeWidth={2} />
          <text x={1470} y={360} fontFamily={SANS} fontWeight={700} fontSize={24} fill={V.ink}>
            éxito según la sociedad
          </text>
        </g>
        <g opacity={eo(t, tMany, 0.3)}>
          <rect x={1420} y={390} width={36} height={36} fill={V.yellow} stroke={V.ink} strokeWidth={2} />
          <text x={1470} y={420} fontFamily={SANS} fontWeight={700} fontSize={24} fill={V.ink}>
            tu propia definición
          </text>
        </g>
        <text x={430} y={960} fontFamily={MARK} fontSize={42} fill={V.red} opacity={eo(t, tFam + 0.3, 0.3)} transform="rotate(-3 430 960)">
          rico en dinero, pobre en empatía
        </text>
        <Tag x={1840} y={1010} text="Gráfico ilustrativo" anchor="end" />
        <Head t={t} at={a + 0.05} n="2" text="TU PROPIA DEFINICIÓN DE ÉXITO" />
      </Layer>
    </Cam>
  );
};

// ───────── Escena 21: más que un currículum (fotomosaico) ─────────
const TS = 40;
const COLS = 48;
const ROWS_M = 27;
const inside = (x: number, y: number) => {
  const head = ((x - 960) / 175) ** 2 + ((y - 390) / 215) ** 2 < 1;
  const neck = y > 560 && y < 660 && Math.abs(x - 960) < 70;
  const body = y >= 640 && Math.abs(x - 960) < 220 + (y - 640) * 1.3;
  return head || neck || body;
};
const WARM = ['#d9a441', '#b5523b', '#e3b2a6', '#c98a5a', '#8a5a34', '#e9c27c', '#a8322a', '#d8875a'];
const COOL = ['#dfe6e6', '#cfd8dc', '#e7e1d3', '#d6d0c2', '#c9d6dc', '#ebe7dd'];
const CARD: [number, number] = [21, 17];

const TileIcon: React.FC<{k: number}> = ({k}) => {
  const c = 'rgba(255,255,255,0.75)';
  switch (k % 6) {
    case 0:
      return <path d="M-8 4 a5 5 0 1 0 0.1 0 M8 4 a5 5 0 1 0 0.1 0 M-8 4 L-2 -4 L6 -4 L8 4" stroke={c} strokeWidth={1.6} fill="none" />;
    case 1:
      return <path d="M0 6 C-8 0 -9 -5 -6 -8 C-3 -10 -1 -9 0 -6 C1 -9 3 -10 6 -8 C9 -5 8 0 0 6 Z" fill={c} />;
    case 2:
      return <path d="M-3 6 L-3 -8 L6 -10 L6 4 M-6 6 a3 3 0 1 0 0.1 0" stroke={c} strokeWidth={1.6} fill="none" />;
    case 3:
      return <path d="M-9 6 L-9 -2 L0 -9 L9 -2 L9 6 Z" fill={c} />;
    case 4:
      return <circle r={6} fill={c} />;
    default:
      return <path d="M-9 -6 L9 -6 L9 6 L-9 6 Z M-9 -6 L0 1 L9 -6" stroke={c} strokeWidth={1.4} fill="none" />;
  }
};

export const Mosaic: React.FC<SceneProps> = ({t, a, b}) => {
  const tEss = S(52);
  const tCv = W(52, 'currículum');
  const cardX = CARD[0] * TS + TS / 2;
  const cardY = CARD[1] * TS + TS / 2;
  const tiles: React.ReactNode[] = [];
  for (let r = 0; r < ROWS_M; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = c * TS;
      const y = r * TS;
      const isCard = c === CARD[0] && r === CARD[1];
      const inn = inside(x + TS / 2, y + TS / 2);
      const h = Math.abs(Math.sin(c * 12.9898 + r * 78.233) * 43758.5453) % 1;
      const fill = isCard ? '#ffffff' : inn ? WARM[Math.floor(h * WARM.length)] : COOL[Math.floor(h * COOL.length)];
      tiles.push(
        <g key={`${r}-${c}`}>
          <rect x={x + 1} y={y + 1} width={TS - 2} height={TS - 2} fill={fill} />
          {inn && !isCard && h < 0.55 ? (
            <g transform={`translate(${x + TS / 2} ${y + TS / 2})`}>
              <TileIcon k={Math.floor(h * 60)} />
            </g>
          ) : null}
        </g>,
      );
    }
  }
  const z = (() => {
    const k = eio(t, a + 1.2, tCv - 0.8 - (a + 1.2));
    return Math.exp(lerp(Math.log(14), Math.log(1), k));
  })();
  const cxCam = lerp(cardX, 960, clamp((14 - z) / 13));
  const cyCam = lerp(cardY, 540, clamp((14 - z) / 13));
  return (
    <g>
      <Bg kind="paper" />
      <g transform={`translate(960 540) scale(${z}) translate(${-cxCam} ${-cyCam})`}>
        {tiles}
        {/* la tarjeta de presentación: una tesela */}
        <g transform={`translate(${cardX} ${cardY})`}>
          <rect x={-18} y={-12} width={36} height={24} fill="#ffffff" stroke={V.ink} strokeWidth={0.6} />
          <text y={-2} textAnchor="middle" fontFamily={TYPE} fontSize={3.3} fill={V.ink}>
            GERENTE REGIONAL
          </text>
          <path d="M-12 4 L12 4 M-12 7 L6 7" stroke={V.grayLight} strokeWidth={0.6} />
        </g>
      </g>
      {/* anotaciones en espacio de pantalla, cuando la tarjeta ya es diminuta */}
      {z < 1.3 ? (
        <g>
          <MarkerCircle cx={cardX} cy={cardY} rx={44} ry={34} p={pr(t, tCv, 0.5)} />
          <MarkerArrow x0={cardX + 360} y0={cardY + 170} x1={cardX + 50} y1={cardY + 26} p={pr(t, tCv + 0.3, 0.5)} />
          <g opacity={eo(t, tCv + 0.5, 0.3)}>
            <rect x={cardX + 330} y={cardY + 150} width={560} height={90} fill="#fbfaf5" filter="url(#paperShadow)" />
            <text x={cardX + 610} y={cardY + 210} textAnchor="middle" fontFamily={MARK} fontSize={40} fill={V.red}>
              tu currículum
            </text>
          </g>
        </g>
      ) : null}
      {z > 6 ? (
        <g opacity={eo(t, a + 0.2, 0.3)}>
          <rect x={700} y={920} width={520} height={90} fill="#fbfaf5" filter="url(#paperShadow)" />
          <text x={960} y={980} textAnchor="middle" fontFamily={MARK} fontSize={46} fill={V.red}>
            esto es lo que ven…
          </text>
        </g>
      ) : null}
      <g opacity={eo(t, tEss, 0.4) * (z < 2 ? 1 : 0)}>
        <rect x={60} y={900} width={760} height={110} fill="#fbfaf5" filter="url(#paperShadow)" />
        <Typed x={90} y={970} text="…y esto es lo que eres" p={pr(t, tEss + 0.2, 1.0)} size={48} />
      </g>
      <Head t={t} at={a + 0.05} n="3" text="MÁS QUE TUS LOGROS" />
    </g>
  );
};

// ───────── Escena 22: la pregunta, otra vez ─────────
export const QuestionAgain: React.FC<SceneProps> = (p) => <Question {...p} strike />;

// ───────── Escena 23: ¿y tú qué piensas? ─────────
export const Poll: React.FC<SceneProps> = ({t, a, b}) => {
  const tMoney = W(56, 'dinero');
  const tHuman = W(56, 'humano');
  const knob = 960 + Math.sin((t - a) * 1.6) * 260 * Math.exp(-(t - a) * 0.08);
  return (
    <g>
      <rect x={0} y={0} width={960} height={1080} fill="#2a2a2a" />
      <rect x={960} y={0} width={960} height={1080} fill={V.yellow} />
      <text x={960} y={150} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={96} fill={V.ink} stroke="#fbfaf5" strokeWidth={10} paintOrder="stroke">
        ¿Y TÚ QUÉ PIENSAS?
      </text>
      <g opacity={eo(t, tMoney - 0.4, 0.4)}>
        <g transform="translate(480 560)">
          <Cutout>
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <g key={i} transform={`translate(${(i % 2) * 8 - 4} ${-i * 26})`}>
                <ellipse rx={110} ry={34} fill="#a8a8a8" />
                <ellipse cy={-6} rx={110} ry={34} fill="#c8c8c8" />
              </g>
            ))}
          </Cutout>
        </g>
        <text x={480} y={760} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={76} fill="#fbfaf5">
          DINERO Y ESTATUS
        </text>
      </g>
      <g opacity={eo(t, tHuman - 0.6, 0.4)}>
        <g transform="translate(1440 650) scale(0.75)">
          <Cutout>
            <PhotoPerson x={-80} y={0} suit={140} hair="bun" hairTone={50} dress smile armR={[30, 0]} look={0.6} />
            <PhotoPerson x={80} y={0} suit={70} hair="short" hairTone={40} tie={false} smile armL={[30, 0]} look={-0.6} />
          </Cutout>
        </g>
        <text x={1440} y={760} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={76} fill={V.ink}>
          ALGO MÁS HUMANO
        </text>
      </g>
      {/* barra de votación que no se decide */}
      <g opacity={eo(t, a + 0.6, 0.4)}>
        <rect x={560} y={880} width={800} height={26} rx={13} fill="#fbfaf5" stroke={V.ink} strokeWidth={3} />
        <rect x={560} y={880} width={knob - 560} height={26} rx={13} fill={V.red} />
        <circle cx={knob} cy={893} r={30} fill="#fbfaf5" stroke={V.ink} strokeWidth={4} />
        <text x={knob} y={906} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={36} fill={V.ink}>
          ?
        </text>
      </g>
      <text x={960} y={1010} textAnchor="middle" fontFamily={MARK} fontSize={40} fill="#fbfaf5" stroke={V.ink} strokeWidth={6} paintOrder="stroke" opacity={eo(t, tHuman + 0.6, 0.4)}>
        te leo en los comentarios
      </text>
    </g>
  );
};

// ───────── Escena 24: cierre ─────────
export const Outro: React.FC<SceneProps> = ({t, a, b}) => {
  const tCom = W(57, 'comentarios');
  const tLike = W(57, 'like');
  const tSub = W(57, 'suscribirte');
  const black = eo(t, b - 1.2, 1.1);
  const icon = (i: number, at: number, label: string, el: React.ReactNode) => {
    const p = pop(t, at - 0.15, 0.5);
    const x = 560 + i * 400;
    return (
      <g key={i} opacity={clamp(p)}>
        <g transform={`translate(${x} 680) scale(${p})`}>
          <circle r={110} fill={i === 2 ? V.yellow : '#fbfaf5'} stroke={V.ink} strokeWidth={5} />
          {el}
        </g>
        <text x={x} y={850} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={48} fill={V.ink} letterSpacing={3}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <g>
      <Bg kind="paper" />
      <Highlight x={420} y={290} w={1080} h={130} p={pr(t, a + 0.4, 0.8)} color={V.yellow} />
      <text x={960} y={390} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={120} fill={V.ink}>
        ANSIEDAD POR EL ESTATUS
      </text>
      {icon(
        0,
        tCom,
        'COMENTA',
        <g>
          <path d="M-60 -40 L60 -40 Q70 -40 70 -30 L70 30 Q70 40 60 40 L0 40 L-30 64 L-24 40 L-60 40 Q-70 40 -70 30 L-70 -30 Q-70 -40 -60 -40 Z" fill={V.ink} />
          {[-30, 0, 30].map((x) => (
            <circle key={x} cx={x} cy={0} r={8} fill="#fbfaf5" />
          ))}
        </g>,
      )}
      {icon(
        1,
        tLike,
        'ME GUSTA',
        <g transform="scale(1.2)">
          <path d="M-46 -14 L-26 -14 L-26 46 L-46 46 Z" fill={V.ink} />
          <path d="M-20 -10 L6 -10 L0 -44 Q2 -60 16 -56 Q24 -38 22 -10 L40 -10 Q52 -8 50 6 L44 36 Q40 46 30 46 L-20 46 Z" fill={V.ink} />
        </g>,
      )}
      {icon(
        2,
        tSub,
        'SUSCRÍBETE',
        <g transform={`rotate(${settle(t, tSub + 0.2, 16, 2.2, 2.4)} 0 -50)`}>
          <path d="M-46 30 C-46 -12 -38 -48 0 -52 C38 -48 46 -12 46 30 L58 44 L-58 44 Z" fill={V.ink} />
          <circle cx={0} cy={56} r={11} fill={V.ink} />
        </g>,
      )}
      <rect x={0} y={0} width={1920} height={1080} fill="#000" opacity={black} />
    </g>
  );
};

export const _d = {Tape, Marker, Highlight};
