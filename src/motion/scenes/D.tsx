import React from 'react';
import {S, W} from '../../estatus/timing';
import {
  Bg,
  Burst,
  Cam,
  clamp,
  Disclaimer,
  eio,
  eo,
  FONT,
  Glow,
  hash,
  Icon,
  IconBadge,
  ICONS,
  Kin,
  Layer,
  lerp,
  M,
  PALETTE,
  Pill,
  pr,
  SectionHead,
  Shock,
  spr,
  Token,
  wobble,
} from '../kit';
import {MorphBubble, SceneProps} from './A';
import {Shatter} from './B';

// ───────── Escena 19: la suerte cuenta (máquina de Galton de neón) ─────────
const ROWS = 10;
const GAP = 50;
const N_BALLS = 70;
const BALLS = Array.from({length: N_BALLS}, (_, i) => {
  const dirs = Array.from({length: ROWS}, (_, r) => (hash(i * 13.7 + r * 3.1) > 0.5 ? 1 : -1));
  return {dirs, bin: dirs.filter((d) => d > 0).length};
});
const YOU = 47;

export const Galton: React.FC<SceneProps> = ({t, a, b}) => {
  const tAcc = W(46, 'accidentes');
  const tHier = W(46, 'jerarquía');
  const tNo = S(47);
  const start = a + 0.9;
  const spacing = 0.13;
  const step = 0.1;
  const top = 270;
  const cx = 960;
  const binY = top + ROWS * GAP + 30;
  const counts = new Array(ROWS + 1).fill(0);
  const xAt = (row: number, kk: number) => cx + (2 * kk - row) * (GAP / 2);
  const balls = BALLS.map((bl, i) => {
    const age = t - (start + i * spacing);
    if (age < 0) return null;
    const r = Math.min(ROWS, Math.floor(age / step));
    const frac = clamp(age / step - r);
    let k = 0;
    for (let j = 0; j < r; j++) k += bl.dirs[j] > 0 ? 1 : 0;
    if (r < ROWS) {
      const nk = k + (bl.dirs[r] > 0 ? 1 : 0);
      return {x: lerp(xAt(r, k), xAt(r + 1, nk), frac), y: top + (r + frac) * GAP - Math.sin(frac * Math.PI) * 14, i, landed: false};
    }
    const slot = counts[bl.bin]++;
    const yEnd = binY + 222 - slot * 19;
    return {x: xAt(ROWS, bl.bin), y: Math.min(yEnd, binY + (age - ROWS * step) * 900), i, landed: true};
  });
  const you = balls[YOU];
  const youLanded = you && you.landed;
  return (
    <Cam t={t} keys={[[a, 960, 560, 1.0], [tNo - 0.5, 960, 560, 1.0], [tNo + 0.6, 960, 600, 0.92]]}>
      <Layer depth={0.3}>
        <Bg t={t} kind="plum" />
      </Layer>
      <Layer depth={1}>
        <Glow>
          {Array.from({length: ROWS}, (_, r) =>
            Array.from({length: r + 1}, (_, k) => <circle key={`${r}-${k}`} cx={xAt(r, k)} cy={top + r * GAP + GAP / 2 + 8} r={5} fill={M.cyan} />),
          )}
        </Glow>
        {Array.from({length: ROWS + 2}, (_, k) => {
          const x = cx + (2 * k - ROWS - 1) * (GAP / 2);
          return <path key={k} d={`M${x} ${binY + 14} L${x} ${binY + 240}`} stroke={M.cyan} strokeWidth={3} opacity={0.5} />;
        })}
        <path d={`M${cx - (ROWS + 1) * (GAP / 2)} ${binY + 240} L${cx + (ROWS + 1) * (GAP / 2)} ${binY + 240}`} stroke={M.cyan} strokeWidth={4} opacity={0.7} />
        {[
          ['ABAJO', cx - 220],
          ['EN MEDIO', cx],
          ['ARRIBA', cx + 220],
        ].map(([l, x]) => (
          <text key={l as string} x={x as number} y={binY + 285} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} letterSpacing={3} fill={M.white} opacity={0.75}>
            {l as string}
          </text>
        ))}
        {balls.map((bl) => (bl && bl.i !== YOU ? <circle key={bl.i} cx={bl.x} cy={bl.y} r={9} fill="#D9D3FF" /> : null))}
        {you ? (
          <Glow>
            <circle cx={you.x} cy={you.y} r={12} fill={M.amber} />
          </Glow>
        ) : null}
        {youLanded ? <Pill x={you!.x + 70} y={you!.y - 60} text="TÚ" t={t} at={start + YOU * spacing + ROWS * step + 0.4} bg={M.amber} color={M.bg} size={30} anchor="left" /> : null}
        <Kin x={1500} y={460} text={'SUERTE\n· ACCIDENTES'} t={t} at={tAcc - 0.2} size={50} weight={900} color={M.amber} w={700} stagger={0.02} />
        <Kin x={1500} y={640} text={'DECIDEN\nTU LUGAR'} t={t} at={tHier - 0.4} size={50} weight={900} color={M.white} w={700} stagger={0.02} />
        <Kin x={960} y={225} text="NO TRATES A NADIE —NI A TI MISMO— COMO SI MERECIERA SU LUGAR" t={t} at={tNo - 0.1} size={34} weight={800} color={M.white} stagger={0.006} />
        <Disclaimer text="SIMULACIÓN ILUSTRATIVA" />
      </Layer>
      <SectionHead t={t} at={a + 0.05} n="1" text="LA SUERTE CUENTA" />
    </Cam>
  );
};

// ───────── Escena 20: tu propia definición de éxito (radar) ─────────
const AXES = ['DINERO', 'ESTATUS', 'EMPATÍA', 'FAMILIA', 'AMISTAD', 'PROPÓSITO'];
const SOCIETY = [1.0, 0.95, 0.22, 0.28, 0.35, 0.3];
const YOURS = [0.5, 0.38, 0.88, 0.92, 0.82, 0.9];

export const Radar: React.FC<SceneProps> = ({t, a, b}) => {
  const tSoc = W(48, 'sociedad');
  const tMany = W(49, 'muchas formas');
  const tEmp = W(50, 'empatía');
  const tFam = W(50, 'familiar');
  const R = 300;
  const cx = 900;
  const cy = 600;
  const rot = (t - a) * 0.8;
  const ang = (i: number) => -Math.PI / 2 + (i / 6) * Math.PI * 2 + (rot * Math.PI) / 180;
  const pt = (i: number, v: number): [number, number] => [cx + Math.cos(ang(i)) * R * v, cy + Math.sin(ang(i)) * R * v];
  const shape = (vals: number[], p: number) => vals.map((v, i) => pt(i, v * p)).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + ' Z';
  const soc = spr(t, tSoc - 0.2, 1.6, 0.5);
  const yours = spr(t, tMany - 0.2, 1.4, 0.5);
  return (
    <g>
      <Bg t={t} kind="plum" />
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <path key={k} d={shape([k, k, k, k, k, k], 1)} fill="none" stroke="#ffffff" strokeWidth={2} opacity={0.14} />
      ))}
      {AXES.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <path key={i} d={`M${cx} ${cy} L${x} ${y}`} stroke="#ffffff" strokeWidth={2} opacity={0.14} />;
      })}
      {soc > 0.001 ? <path d={shape(SOCIETY, soc)} fill={M.grayLight} opacity={0.35} stroke={M.grayLight} strokeWidth={4} /> : null}
      {yours > 0.001 ? (
        <Glow>
          <path d={shape(YOURS, yours)} fill={M.mint} fillOpacity={0.35} stroke={M.mint} strokeWidth={5} />
        </Glow>
      ) : null}
      {[
        [2, tEmp],
        [3, tFam],
      ].map(([i, at]) => {
        const [x, y] = pt(i, SOCIETY[i]);
        const k = (t - at) % 0.8;
        if (t < at) return null;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={14} fill={M.coral} />
            <circle cx={x} cy={y} r={14 + k * 50} fill="none" stroke={M.coral} strokeWidth={4} opacity={1 - k / 0.8} />
          </g>
        );
      })}
      {AXES.map((l, i) => {
        const [x, y] = pt(i, 1.2);
        return (
          <text key={l} x={x} y={y + 10} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} fill={M.white}>
            {l}
          </text>
        );
      })}
      <Pill x={1380} y={430} text="ÉXITO SEGÚN LA SOCIEDAD" t={t} at={tSoc} bg={M.gray} size={28} anchor="left" />
      <Pill x={1380} y={520} text="TU PROPIA DEFINICIÓN" t={t} at={tMany} bg={M.mint} color={M.bg} size={28} anchor="left" />
      <Kin x={1380} y={700} text={'RICO EN DINERO,\nPOBRE EN EMPATÍA'} t={t} at={tFam + 0.3} size={46} weight={900} color={M.coral} align="left" w={600} stagger={0.015} />
      <Disclaimer />
      <SectionHead t={t} at={a + 0.05} n="2" text="TU PROPIA DEFINICIÓN DE ÉXITO" />
    </g>
  );
};

// ───────── Escena 21: más que tus logros (mosaico de iconos) ─────────
const MOSAIC_ICONS = ['heart', 'music', 'book', 'plant', 'camera', 'bike', 'sun', 'house', 'envelope', 'globe', 'smile', 'star'];
const CELL = 46;
const inside = (x: number, y: number) => {
  const head = ((x - 960) / 165) ** 2 + ((y - 380) / 200) ** 2 < 1;
  const neck = y > 540 && y < 640 && Math.abs(x - 960) < 70;
  const body = y >= 620 && Math.abs(x - 960) < 210 + (y - 620) * 1.35;
  return head || neck || body;
};
const CELLS = (() => {
  const out: {x: number; y: number; k: number}[] = [];
  for (let y = 180 + CELL / 2; y < 1080; y += CELL) for (let x = CELL / 2; x < 1920; x += CELL) if (inside(x, y)) out.push({x, y, k: out.length});
  return out;
})();
const CARD = CELLS.reduce((best, c) => (Math.hypot(c.x - 960, c.y - 780) < Math.hypot(best.x - 960, best.y - 780) ? c : best), CELLS[0]);

export const Mosaic: React.FC<SceneProps> = ({t, a, b}) => {
  const tEss = S(52);
  const tCv = W(52, 'currículum');
  const zk = eio(t, a + 0.9, tCv - 0.7 - (a + 0.9));
  const z = Math.exp(lerp(Math.log(9), Math.log(1), zk));
  const cxCam = lerp(CARD.x, 960, zk);
  const cyCam = lerp(CARD.y, 600, zk);
  return (
    <g>
      <Bg t={t} kind="plum" />
      <g transform={`translate(960 540) scale(${z}) translate(${-cxCam} ${-cyCam})`}>
        {CELLS.map((c) => {
          if (c.k === CARD.k) return null;
          const h = hash(c.k * 1.37);
          const col = PALETTE[Math.floor(h * PALETTE.length)];
          const br = 1 + 0.08 * Math.sin(t * 2 + c.k * 0.7);
          const appear = spr(t, a + 0.5 + hash(c.k * 7.7) * 1.4, 2.4, 0.5);
          return (
            <g key={c.k} transform={`translate(${c.x} ${c.y}) scale(${br * appear})`}>
              <circle r={CELL * 0.46} fill={col} opacity={0.22} />
              <path d={ICONS[MOSAIC_ICONS[Math.floor(hash(c.k * 3.3) * MOSAIC_ICONS.length)]]} transform="scale(0.32)" fill="none" stroke={col} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          );
        })}
        {/* la tarjeta de presentación: una sola tesela */}
        <g transform={`translate(${CARD.x} ${CARD.y})`}>
          <rect x={-21} y={-14} width={42} height={28} rx={4} fill={M.white} />
          <text y={-2} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={4.6} fill={M.bg}>
            GERENTE REGIONAL
          </text>
          <rect x={-14} y={4} width={28} height={2.4} rx={1.2} fill="#C9CCDD" />
          <rect x={-14} y={8} width={18} height={2.4} rx={1.2} fill="#E1E3EE" />
        </g>
      </g>
      {z > 4 ? <Kin x={960} y={980} text="ESTO ES LO QUE VEN…" t={t} at={a + 0.4} size={56} weight={900} out={a + 2.4} /> : null}
      {z < 1.15 ? (
        <g>
          <g opacity={eo(t, tCv, 0.3)}>
            <circle cx={CARD.x} cy={CARD.y + (600 - 600)} r={40 + 8 * Math.sin(t * 6)} fill="none" stroke={M.amber} strokeWidth={5} />
          </g>
          <Pill x={CARD.x + 90} y={CARD.y + 6} text="TU CURRÍCULUM" t={t} at={tCv + 0.2} bg={M.amber} color={M.bg} size={26} anchor="left" />
        </g>
      ) : null}
      <Pill x={960} y={1025} text="…Y ESTO ES LO QUE ERES" t={t} at={tEss + 0.1} bg={M.mint} color={M.bg} size={40} />
      <SectionHead t={t} at={a + 0.05} n="3" text="MÁS QUE TUS LOGROS" />
    </g>
  );
};

// ───────── Escena 22: la agotadora pregunta → ¿quién eres? ─────────
export const Reprise: React.FC<SceneProps> = ({t, a, b}) => {
  const tTired = W(53, 'agotadora');
  const q = S(54);
  const morph = q + 0.95;
  const sag = eio(t, tTired - 0.2, 0.6) * (1 - eio(t, q - 0.1, 0.3));
  const typing = t < tTired - 0.2;
  return (
    <g>
      <Bg t={t} kind="plum" />
      <MorphBubble t={t} at={a + 0.3} sag={sag}>
        {typing && t > a + 0.6
          ? [0, 1, 2].map((i) => <circle key={i} cx={920 + i * 40} cy={520 - Math.max(0, Math.sin(t * 9 - i * 0.8)) * 16} r={13} fill={M.grayLight} />)
          : null}
        <Shatter x={960} y={560} text="¿A qué te dedicas?" t={t} at={tTired - 0.1} breakAt={morph} size={96} color={M.bg} seed={5} />
        <Kin x={960} y={555} text="¿Quién eres?" t={t} at={morph + 0.15} size={110} color={M.violet} weight={900} stagger={0.04} />
      </MorphBubble>
      <Shock x={960} y={520} t={t} at={morph + 0.1} color={M.mint} r={640} />
      <Burst x={960} y={520} t={t} at={morph + 0.1} n={40} spread={700} dur={1.6} colors={[M.mint, M.amber, M.white]} seed={11} />
      <Kin x={960} y={980} text="Y AHORA QUIERO SABER TU OPINIÓN" t={t} at={S(55) - 0.1} size={46} weight={900} color={M.amber} stagger={0.012} />
    </g>
  );
};

// ───────── Escena 23: la encuesta ─────────
export const Poll: React.FC<SceneProps> = ({t, a, b}) => {
  const tMoney = W(56, 'dinero');
  const tHuman = W(56, 'humano');
  const card = spr(t, a + 0.15, 1.6, 0.55);
  const split = 0.5 + 0.28 * Math.sin((t - a) * 1.7) * Math.exp(-(t - a) * 0.05);
  const hlL = eo(t, tMoney - 0.1, 0.3) * (1 - eo(t, tHuman - 0.3, 0.3));
  const hlR = eo(t, tHuman - 0.2, 0.3);
  return (
    <g>
      <Bg t={t} kind="plum" />
      <Kin x={960} y={150} text="¿Y TÚ QUÉ PIENSAS?" t={t} at={a + 0.1} size={96} weight={900} stagger={0.025} />
      <g transform={`translate(960 600) scale(${card})`}>
        <rect x={-520} y={-320} width={1040} height={640} rx={44} fill={M.white} filter="url(#dropShadow)" />
        <text x={0} y={-210} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={40} fill={M.bg}>
          El éxito debería definirse por…
        </text>
        {/* opciones */}
        {[
          ['DINERO Y ESTATUS', -60, M.coral, hlL, 'coin'],
          ['ALGO MÁS HUMANO', 80, M.mint, hlR, 'heart'],
        ].map(([l, y, c, hl, ic]) => (
          <g key={l as string} transform={`translate(0 ${y as number}) scale(${1 + 0.04 * (hl as number)})`}>
            <rect x={-440} y={-50} width={880} height={100} rx={50} fill={c as string} opacity={0.15 + 0.85 * (hl as number)} />
            <rect x={-440} y={-50} width={880} height={100} rx={50} fill="none" stroke={c as string} strokeWidth={5} />
            <g transform="translate(-370 0) scale(0.55)">
              <path d={ICONS[ic as string]} fill="none" stroke={(hl as number) > 0.5 ? M.white : (c as string)} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x={20} y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={(hl as number) > 0.5 ? M.white : M.bg}>
              {l as string}
            </text>
          </g>
        ))}
        {/* barra de resultados que no se decide */}
        <rect x={-440} y={210} width={880} height={36} rx={18} fill={M.mint} />
        <rect x={-440} y={210} width={880 * split} height={36} rx={18} fill={M.coral} />
        <g transform={`translate(${-440 + 880 * split} 228) scale(${1 + 0.1 * Math.sin(t * 6)})`}>
          <circle r={40} fill={M.white} stroke={M.bg} strokeWidth={5} />
          <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={M.bg}>
            ?
          </text>
        </g>
      </g>
      <Kin x={960} y={1035} text="TE LEO EN LOS COMENTARIOS" t={t} at={tHuman + 0.8} size={40} weight={900} color={M.amber} stagger={0.012} />
    </g>
  );
};

// ───────── Escena 24: cierre ─────────
export const Outro: React.FC<SceneProps> = ({t, a, b}) => {
  const tCom = W(57, 'comentarios');
  const tLike = W(57, 'like');
  const tSub = W(57, 'suscribirte');
  const iris = eio(t, b - 1.1, 1.0);
  const r = lerp(1300, 0, iris);
  const btn = (i: number, at: number, ic: string, label: string, bg: string) => {
    const s = spr(t, at - 0.15, 2.4, 0.45);
    const x = 560 + i * 400;
    return (
      <g key={i}>
        <Burst x={x} y={690} t={t} at={at} n={22} spread={420} dur={1.1} size={12} colors={[bg, M.white]} seed={i * 9 + 2} />
        <g transform={`translate(${x} 690) scale(${s}) rotate(${i === 2 ? wobble(t, at + 0.1, 18, 3, 2.5) : 0} 0 -40)`}>
          <circle r={96} fill={bg} />
          <circle r={96} fill="#ffffff" opacity={0.1} transform="translate(-20 -20) scale(0.7)" />
          <Icon name={ic} x={0} y={0} s={1.25} color={M.bg} sw={8} />
        </g>
        <Kin x={x} y={850} text={label} t={t} at={at} size={40} weight={900} w={500} stagger={0.02} />
      </g>
    );
  };
  return (
    <g>
      <Bg t={t} kind="plum" />
      <Kin x={960} y={330} text="ANSIEDAD POR EL ESTATUS" t={t} at={a + 0.25} size={104} weight={900} stagger={0.025} />
      <rect x={960 - 380 * eo(t, a + 1.1, 0.6)} y={372} width={760 * eo(t, a + 1.1, 0.6)} height={12} rx={6} fill={M.amber} />
      {btn(0, tCom, 'comment', 'COMENTA', M.cyan)}
      {btn(1, tLike, 'thumb', 'ME GUSTA', M.coral)}
      {btn(2, tSub, 'bell', 'SUSCRÍBETE', M.amber)}
      {/* iris de cierre a negro */}
      {iris > 0 ? (
        <g>
          <defs>
            <mask id="irisMask">
              <rect x={0} y={0} width={1920} height={1080} fill="#fff" />
              <circle cx={960} cy={540} r={r} fill="#000" />
            </mask>
          </defs>
          <rect x={0} y={0} width={1920} height={1080} fill="#000" mask="url(#irisMask)" />
        </g>
      ) : null}
    </g>
  );
};

export const _d = {Cam, Layer, Shock, IconBadge, Token, pr, clamp, Burst};
