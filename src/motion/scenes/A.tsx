import React from 'react';
import {S, W} from '../../estatus/timing';
import {
  Bg,
  Burst,
  Cam,
  ChapterTitle,
  clamp,
  Disclaimer,
  eio,
  eo,
  FONT,
  Glow,
  hash,
  Icon,
  IconBadge,
  Kin,
  Layer,
  lerp,
  M,
  PALETTE,
  Pill,
  pr,
  Ring,
  Shock,
  spr,
  Token,
  wobble,
} from '../kit';

export type SceneProps = {t: number; a: number; b: number};

const mixHex = (a: string, b: string, k: number) => {
  const pa = parseInt(a.slice(1), 16);
  const pb = parseInt(b.slice(1), 16);
  const ch = (s: number) => Math.round(((pa >> s) & 255) + (((pb >> s) & 255) - ((pa >> s) & 255)) * clamp(k));
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};
export {mixHex};

// ───────── Bocadillo que nace de un punto (se reutiliza en la escena 22) ─────────
export const MorphBubble: React.FC<{t: number; at: number; cx?: number; cy?: number; w?: number; h?: number; color?: string; children?: React.ReactNode; sag?: number}> = ({
  t,
  at,
  cx = 960,
  cy = 520,
  w = 1000,
  h = 260,
  color = M.white,
  children,
  sag = 0,
}) => {
  const k = spr(t, at, 1.5, 0.5);
  if (k <= 0.001) return null;
  const ww = lerp(70, w, k);
  const hh = lerp(70, h, k) * (1 - sag * 0.12);
  const rx = Math.min(hh / 2, lerp(35, 80, k));
  const tail = clamp((k - 0.5) * 2);
  const float = Math.sin(t * 1.8) * 6 * eo(t, at + 0.8, 0.6);
  return (
    <g transform={`translate(0 ${float + sag * 26}) rotate(${sag * -3} ${cx} ${cy})`}>
      <g filter="url(#dropShadow)">
        <rect x={cx - ww / 2} y={cy - hh / 2} width={ww} height={hh} rx={rx} fill={color} />
        {tail > 0 ? <path d={`M${cx - ww * 0.28} ${cy + hh / 2 - 4} L${cx - ww * 0.36} ${cy + hh / 2 + 70 * tail} L${cx - ww * 0.16} ${cy + hh / 2 - 4} Z`} fill={color} /> : null}
      </g>
      {children}
    </g>
  );
};

// ───────── Escena 1: «la pregunta» ─────────
export const Opening: React.FC<SceneProps> = ({t, a, b}) => {
  const tVal = W(0, 'tu valor');
  const tDep = W(0, 'depender');
  const tOne = W(0, 'una sola');
  const q = S(1);
  const collapse = eio(t, q - 0.55, 0.35);
  const dot = t > q - 0.5 && t < q - 0.05;
  const pulse = 1 + 0.25 * Math.sin((t - (q - 0.5)) * 22);
  return (
    <Cam t={t} keys={[[a, 960, 540, 1.0], [b, 960, 540, 1.07]]}>
      <Layer depth={0.3}>
        <Bg t={t} />
      </Layer>
      <Layer depth={1}>
        {collapse < 1 ? (
          <g transform={`translate(960 540) scale(${1 - collapse}) translate(-960 -540)`} opacity={1 - collapse * 0.5}>
            <Kin x={960} y={420} text="TU VALOR" t={t} at={tVal - 0.15} size={150} weight={900} />
            <Kin x={960} y={560} text="=" t={t} at={tDep} size={120} color={M.amber} mode="pop" />
            <Kin x={960} y={720} text="1 PREGUNTA" t={t} at={tOne - 0.1} size={130} weight={900} color={M.mint} glow="rgba(46,230,166,0.5)" />
          </g>
        ) : null}
        {dot ? (
          <Glow>
            <circle cx={960} cy={540} r={22 * pulse} fill={M.coral} />
          </Glow>
        ) : null}
        <Shock x={960} y={540} t={t} at={q - 0.12} color={M.coral} r={520} />
        <MorphBubble t={t} at={q - 0.12}>
          <Kin x={960} y={555} text="¿A qué te dedicas?" t={t} at={q} size={96} color={M.bg} weight={800} stagger={0.035} />
        </MorphBubble>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 2: el medidor de interés ─────────
const FlipCard: React.FC<{x: number; y: number; theta: number; faces: [string, string, string]; p: number}> = ({x, y, theta, faces, p}) => {
  if (p <= 0.001) return null;
  const sx = Math.abs(Math.cos((theta * Math.PI) / 180));
  const face = theta < 90 ? 0 : theta < 270 ? 1 : 2;
  const label = faces[face];
  const gold = face === 1;
  const fill = face === 0 ? M.bg3 : face === 1 ? M.white : '#C9CCDD';
  const ink = face === 0 ? M.white : M.bg;
  return (
    <g transform={`translate(${x} ${y}) scale(${Math.max(0.02, sx) * p} ${p})`}>
      <rect x={-210} y={-80} width={420} height={160} rx={28} fill={fill} filter="url(#dropShadow)" />
      <text y={20} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={label.length > 6 ? 54 : 70} fill={ink} letterSpacing={2}>
        {label}
      </text>
      {gold ? (
        <g transform="translate(190 -70)">
          <circle r={34} fill={M.amber} />
          <Icon name="star" x={0} y={0} s={0.5} color={M.bg} sw={8} fill={M.bg} />
        </g>
      ) : null}
    </g>
  );
};

export const Interest: React.FC<SceneProps> = ({t, a, b}) => {
  const tImp = W(2, 'impresionante');
  const tKnow = W(2, 'conocerte');
  const tAside = W(2, 'dejarte');
  const theta = 180 * eio(t, tImp - 0.3, 0.5) + 180 * eio(t, tAside - 0.7, 0.5);
  const fill = lerp(0.12, 0.95, eio(t, tImp + 0.1, 1.1));
  const drain = eio(t, tAside - 0.3, 0.7);
  const ring = fill * (1 - drain) + 0.04 * drain;
  const ringColor = drain > 0.4 ? M.grayLight : M.mint;
  const approach = eio(t, tKnow - 0.6, 1.0);
  const leave = eio(t, tAside + 0.15, 1.1);
  const lx = lerp(lerp(560, 860, approach), -260, leave);
  const hop = Math.abs(Math.sin((t - tKnow) * 9)) * 40 * (approach > 0 && approach < 1 ? 1 : 0);
  return (
    <Cam t={t} keys={[[a, 960, 560, 1.0], [b, 920, 560, 1.05]]}>
      <Layer depth={0.3}>
        <Bg t={t} />
      </Layer>
      <Layer depth={1}>
        {/* estela del que se va */}
        {leave > 0 && leave < 1
          ? [1, 2, 3].map((g) => <Token key={g} x={lx + g * 70} y={860} s={1.45} color={M.mint} opacity={0.25 / g} shadow={false} />)
          : null}
        <Token x={lx} y={860 - hop} s={1.45} color={M.mint} p={spr(t, a + 0.15)} lean={leave > 0 ? -12 : approach * 6} />
        <Token x={1320} y={860} s={1.6} color={M.violet} p={spr(t, a + 0.3)} />
        <FlipCard x={1320} y={420} theta={theta} faces={['?', 'DIRECTORA', 'CAJERO']} p={spr(t, a + 0.6)} />
        {/* anillo de interés sobre el que escucha */}
        <g opacity={clamp(spr(t, a + 0.5) * 2) * (1 - leave)}>
          <Ring x={lx} y={500} r={78} p={ring} color={ringColor} sw={16} />
          <Icon name="heart" x={lx} y={500} s={0.75} color={ringColor} fill={ringColor} sw={6} />
        </g>
        <Pill x={lx} y={330} text="+ INTERÉS" t={t} at={tKnow - 0.3} bg={M.mint} color={M.bg} out={tAside - 0.5} />
        <Pill x={760} y={330} text="– INTERÉS" t={t} at={tAside} bg={M.coral} />
        <Kin x={960} y={1000} text="te conocen… o te dejan de lado" t={t} at={tAside + 0.4} size={44} weight={700} color={M.grayLight} stagger={0.012} />
      </Layer>
    </Cam>
  );
};

// ───────── Escena 3: el escáner (capítulo 1) ─────────
const ORBIT = ['music', 'book', 'plant', 'heart', 'camera'];
export const Scanner: React.FC<SceneProps> = ({t, a, b}) => {
  const tSnob = W(3, 'engreídos');
  const tPart = W(3, 'pequeña parte');
  const tId = W(3, 'identidades');
  const tVer = W(3, 'veredicto');
  const build = a + 2.1;
  const scanA = tPart - 0.3;
  const beamY = lerp(200, 1000, eio(t, scanA, 1.3));
  const scanning = t > scanA && t < scanA + 1.4;
  const gray = eo(t, scanA + 0.9, 0.6);
  const cx = 960;
  const bands = [M.coral, M.amber, M.mint, M.cyan, M.violet];
  const gavelRot = t < tVer ? lerp(-70, 0, eio(t, tVer - 0.45, 0.45)) : wobble(t, tVer, 8, 3, 6);
  const spin = t > tVer - 0.25 && t < tVer + 0.7;
  const val = spin ? String(Math.floor(hash(Math.floor(t * 30)) * 100)).padStart(2, '0') : t >= tVer + 0.7 ? '??' : '--';
  return (
    <g>
      <Cam
        t={t}
        keys={[
          [a, 960, 560, 1.0],
          [scanA, 960, 560, 1.0],
          [tId - 0.3, 1060, 640, 1.22],
          [tVer - 0.6, 1060, 640, 1.22],
          [tVer - 0.15, 960, 540, 1.0],
          [b, 960, 540, 1.04],
        ]}
        shake={[[tVer, 18]]}
      >
        <Layer depth={0.3}>
          <Bg t={t} />
        </Layer>
        <Layer depth={1}>
          <Kin x={960} y={170} text="UN MUNDO DE ENGREÍDOS" t={t} at={tSnob - 0.2} size={66} weight={900} color={M.white} out={scanA - 0.2} stagger={0.02} />
          {/* iconos que orbitan por detrás */}
          {ORBIT.map((n, i) => {
            const ang = t * 0.7 + (i / ORBIT.length) * Math.PI * 2;
            const z = Math.sin(ang);
            if (z >= 0) return null;
            const p = spr(t, build + 0.4 + i * 0.12);
            return (
              <g key={n} opacity={1 - gray * 0.6}>
                <IconBadge name={n} x={cx + Math.cos(ang) * 470} y={560 + z * 110} r={52 * (1 + z * 0.2)} bg={mixHex(PALETTE[i], '#4A5075', gray)} p={p} />
              </g>
            );
          })}
          {/* el token compuesto por franjas de colores */}
          <g transform={`translate(${cx} 920) scale(${2.5 * spr(t, build)})`}>
            <ellipse cx={0} cy={2} rx={46} ry={9} fill="#000" opacity={0.28} />
            <defs>
              <clipPath id="bodyClip">
                <rect x={-35} y={-100} width={70} height={100} rx={35} />
              </clipPath>
            </defs>
            <g clipPath="url(#bodyClip)">
              {bands.map((c, i) => (
                <rect key={i} x={-40} y={-100 + i * 20} width={80} height={20} fill={mixHex(c, '#4A5075', gray)} />
              ))}
            </g>
            <circle cx={0} cy={-140} r={28} fill={mixHex(M.amber, '#5A6080', gray)} />
          </g>
          {ORBIT.map((n, i) => {
            const ang = t * 0.7 + (i / ORBIT.length) * Math.PI * 2;
            const z = Math.sin(ang);
            if (z < 0) return null;
            const p = spr(t, build + 0.4 + i * 0.12);
            return (
              <g key={n} opacity={1 - gray * 0.6}>
                <IconBadge name={n} x={cx + Math.cos(ang) * 470} y={560 + z * 110} r={52 * (1 + z * 0.2)} bg={mixHex(PALETTE[i], '#4A5075', gray)} p={p} />
              </g>
            );
          })}
          {/* el maletín: lo único que queda encendido */}
          <g>
            {gray > 0 ? (
              <Glow big strength={0.8 * gray}>
                <circle cx={1170} cy={780} r={66} fill={M.amber} />
              </Glow>
            ) : null}
            <IconBadge name="briefcase" x={1170} y={780} r={62} bg={M.amber} color={M.bg} p={spr(t, build + 0.9) * (1 + 0.08 * Math.sin(t * 6) * gray)} />
          </g>
          <Pill x={1250} y={880} text="IDENTIDAD PROFESIONAL" t={t} at={tId} bg={M.amber} color={M.bg} size={28} anchor="left" />
          {/* haz del escáner */}
          {scanning ? (
            <g>
              <defs>
                <linearGradient id="beamTrail" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor={M.coral} stopOpacity="0" />
                  <stop offset="1" stopColor={M.coral} stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <rect x={360} y={beamY - 160} width={1200} height={160} fill="url(#beamTrail)" />
              <Glow>
                <rect x={360} y={beamY - 4} width={1200} height={8} rx={4} fill={M.coral} />
              </Glow>
            </g>
          ) : null}
          {/* contador de «valor» */}
          <g opacity={eo(t, tVer - 0.35, 0.2)} transform={`translate(560 330) scale(${spr(t, tVer - 0.35, 2.4, 0.5)})`}>
            <rect x={-170} y={-100} width={340} height={200} rx={30} fill={M.bg3} stroke={M.coral} strokeWidth={4} />
            <text y={-46} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={30} letterSpacing={6} fill={M.grayLight}>
              VALOR
            </text>
            <text y={62} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={110} fill={t >= tVer + 0.7 ? M.coral : M.white}>
              {val}
            </text>
          </g>
          {/* el mazo */}
          <g transform={`translate(1420 420) rotate(${gavelRot} 40 40)`} opacity={eo(t, tVer - 0.6, 0.2)}>
            <Icon name="gavel" x={0} y={0} s={2.6} color={M.white} sw={7} />
          </g>
          <Shock x={1380} y={520} t={t} at={tVer} color={M.white} r={460} />
        </Layer>
      </Cam>
      <ChapterTitle t={t} at={a} num="01" title="EL JUICIO" color={M.coral} />
    </g>
  );
};

// ───────── Escena 4: mamá vs. el mundo ─────────
const Eye: React.FC<{x: number; y: number; s: number; lookX: number; lookY: number; blink: number; p: number}> = ({x, y, s, lookX, lookY, blink, p}) => {
  if (p <= 0.001) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * p} ${s * p * (1 - blink * 0.92)})`}>
      <path d="M-44 0 C-24 -28 24 -28 44 0 C24 28 -24 28 -44 0 Z" fill={M.white} />
      <circle cx={lookX * 12} cy={lookY * 8} r={15} fill={M.cyan} />
      <circle cx={lookX * 14} cy={lookY * 9} r={7} fill={M.bg} />
    </g>
  );
};

export const Mother: React.FC<SceneProps> = ({t, a, b}) => {
  const tHug = S(4) + 1.2;
  const tHeart = S(5);
  const tCold = S(6);
  const tJ = W(7, 'juicio');
  const tH = W(7, 'humillación');
  const come = eio(t, S(4) + 0.3, 1.0);
  const heart = spr(t, tHeart - 0.05, 1.4, 0.5);
  const cold = eio(t, tCold - 0.2, 1.0);
  const tighten = eio(t, S(7) - 0.4, 2.2);
  const beat = 1 + 0.07 * Math.max(0, Math.sin(t * 7.5)) ** 4;
  const N = 22;
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 560, 1.0], [tCold - 0.1, 960, 560, 1.0], [tCold + 1.5, 960, 600, 0.6], [b, 960, 600, 0.58]]}>
        <Layer depth={0.2}>
          <Bg t={t} />
          <g opacity={1 - cold}>
            <rect x={-1200} y={-1200} width={4320} height={3480} fill="url(#bgWarm)" />
          </g>
        </Layer>
        <Layer depth={1}>
          {/* madre e hijo se abrazan y se vuelven un corazón */}
          <g opacity={1 - clamp(heart * 1.4)}>
            <Token x={lerp(700, 905, come)} y={860} s={1.9} color={M.rose} p={spr(t, a + 0.2)} lean={t > tHug ? 10 : 0} />
            <Token x={lerp(1220, 1040, come)} y={860} s={1.25} color={M.amber} p={spr(t, a + 0.4)} lean={t > tHug ? -12 : 0} />
          </g>
          {heart > 0.001 ? (
            <g transform={`translate(960 640) scale(${heart * beat * lerp(4.4, 3.2, cold)})`}>
              <path d="M0 34 C-30 14 -40 -6 -32 -22 C-24 -36 -6 -36 0 -22 C6 -36 24 -36 32 -22 C40 -6 30 14 0 34 Z" fill={M.coral} />
              <path d="M-26 -16 C-22 -26 -12 -28 -6 -22" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5} />
            </g>
          ) : null}
          {/* anillo de ojos */}
          {Array.from({length: N}, (_, i) => {
            const ang = (i / N) * Math.PI * 2 - Math.PI / 2;
            const k = lerp(1, 0.74, tighten);
            const x = 960 + Math.cos(ang) * 960 * k;
            const y = 640 + Math.sin(ang) * 560 * k;
            const p = spr(t, tCold + 0.3 + i * 0.05, 2.4, 0.5);
            const ph = hash(i * 3.3) * 4;
            const bl = Math.max(0, Math.sin((t + ph) * 2.3) - 0.93) * 14;
            return <Eye key={i} x={x} y={y} s={1.5} lookX={-Math.cos(ang)} lookY={-Math.sin(ang)} blink={clamp(bl)} p={p} />;
          })}
        </Layer>
      </Cam>
      <g opacity={1 - cold}>
        <Kin x={960} y={200} text="NO TU ESTATUS" t={t} at={W(5, 'estatus') - 0.2} size={60} color={M.bg} weight={800} out={tCold - 0.3} />
        {t > W(5, 'estatus') + 0.5 ? <rect x={720} y={168} width={480 * eo(t, W(5, 'estatus') + 0.5, 0.3)} height={8} rx={4} fill={M.bg} opacity={1 - eio(t, tCold - 0.3, 0.35)} /> : null}
        <Kin x={960} y={300} text="TU PERSONA" t={t} at={W(5, 'persona') - 0.1} size={92} color={M.white} weight={900} out={tCold - 0.3} />
      </g>
      <Kin x={960} y={130} text="JUICIO" t={t} at={tJ - 0.05} size={90} color={M.white} weight={900} mode="slam" stagger={0.02} />
      <Kin x={960} y={1010} text="HUMILLACIÓN" t={t} at={tH - 0.05} size={90} color={M.coral} weight={900} mode="slam" stagger={0.02} glow="rgba(255,90,95,0.5)" />
    </g>
  );
};

// ───────── Escena 5: la ecuación materialista ─────────
const Slab: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 130}) => (
  <g>
    <path d={`M${x - w} ${y} L${x} ${y + w * 0.4} L${x} ${y + w * 0.4 + 34} L${x - w} ${y + 34} Z`} fill={M.bg2} />
    <path d={`M${x} ${y + w * 0.4} L${x + w} ${y} L${x + w} ${y + 34} L${x} ${y + w * 0.4 + 34} Z`} fill="#13173A" />
    <path d={`M${x} ${y - w * 0.4} L${x + w} ${y} L${x} ${y + w * 0.4} L${x - w} ${y} Z`} fill={M.bg3} />
  </g>
);
const GOODS: [string, string][] = [
  ['house', M.amber],
  ['car', M.coral],
  ['watch', M.cyan],
  ['phone', M.violet],
];
const REACT: [string, string][] = [
  ['heart', M.coral],
  ['star', M.amber],
  ['thumb', M.mint],
  ['crown', M.violet],
];

export const Equation: React.FC<SceneProps> = ({t, a, b}) => {
  const tEmo = W(9, 'recompensas');
  const tLink = W(9, 'vinculan');
  const tGoods = W(9, 'bienes');
  return (
    <Cam t={t} keys={[[a, 880, 560, 1.0], [b, 1040, 540, 1.04]]}>
      <Layer depth={0.3}>
        <Bg t={t} />
      </Layer>
      <Layer depth={1}>
        <Kin x={960} y={150} text="UNA ÉPOCA MATERIALISTA" t={t} at={S(8) + 0.1} size={70} weight={900} stagger={0.02} />
        {GOODS.map(([n, c], i) => {
          const px = 420 + i * 360;
          const py = 720;
          const s = spr(t, a + 0.5 + i * 0.3, 2.2, 0.45);
          const rx = px + (i % 2 ? 70 : -70);
          const ry = 380;
          const lineP = eo(t, tEmo - 0.2 + i * 0.2, 0.5);
          const [rn, rc] = REACT[i];
          return (
            <g key={n}>
              <Slab x={px} y={py} />
              <g transform={`translate(0 ${(1 - clamp(s)) * -220})`}>
                <IconBadge name={n} x={px} y={py - 110 + Math.sin(t * 2 + i) * 6} r={72} bg={c} color={M.bg} p={s} />
              </g>
              {lineP > 0 ? (
                <path
                  d={`M${px} ${py - 190} Q${(px + rx) / 2 + 40} ${(py + ry) / 2 - 40} ${rx} ${ry + 50}`}
                  fill="none"
                  stroke={M.white}
                  strokeWidth={4}
                  strokeDasharray="4 14"
                  strokeDashoffset={-t * 60}
                  strokeLinecap="round"
                  opacity={0.6 * lineP}
                />
              ) : null}
              <IconBadge name={rn} x={rx} y={ry + Math.sin(t * 3 + i) * 8} r={44} bg={M.white} color={rc} p={spr(t, tEmo + 0.1 + i * 0.2, 2.6, 0.45)} />
            </g>
          );
        })}
        <Kin x={880} y={1000} text="RECOMPENSAS EMOCIONALES" t={t} at={tEmo - 0.1} size={54} color={M.coral} align="right" w={900} weight={900} stagger={0.015} />
        <Kin x={960} y={1000} text="=" t={t} at={tLink} size={64} color={t > tLink && Math.floor(t * 4) % 2 ? M.amber : M.white} mode="pop" w={200} />
        <Kin x={1040} y={1000} text="BIENES MATERIALES" t={t} at={tGoods - 0.1} size={54} color={M.cyan} align="left" w={900} weight={900} stagger={0.015} />
      </Layer>
    </Cam>
  );
};

// ───────── Escena 6: el iceberg low poly ─────────
const TIP: [string, string][] = [
  ['M940 250 L720 560 L860 560 Z', '#E8F7FF'],
  ['M940 250 L860 560 L1010 400 Z', '#C9EBF8'],
  ['M940 250 L1010 400 L1210 560 Z', '#F4FBFF'],
  ['M860 560 L1010 400 L1210 560 Z', '#A9DCF0'],
];
const BODY = (() => {
  const P: Record<string, [number, number]> = {B: [720, 560], E: [1210, 560], F: [560, 820], G: [500, 1160], H: [640, 1500], I: [940, 1700], J: [1260, 1520], K: [1420, 1160], L: [1360, 800], P: [900, 900], Q: [1100, 1250]};
  const tris = ['BFP', 'BPE', 'EPL', 'FGP', 'PGQ', 'PQK', 'PKL', 'GHQ', 'HIQ', 'IJQ', 'JKQ'];
  const cols = ['#5FB4DA', '#4A9FCB', '#73C3E2', '#3E8DBA', '#5AA9D0', '#2F7AA8', '#4F9CC6'];
  return tris.map((tr, i) => [`M${tr.split('').map((k) => P[k].join(' ')).join(' L')} Z`, cols[i % cols.length]] as [string, string]);
})();

export const Iceberg: React.FC<SceneProps> = ({t, a, b}) => {
  const tDive = W(10, 'rara vez');
  const tAtt = W(10, 'atención');
  const tResp = W(10, 'respeto');
  const tLove = W(10, 'amor');
  const tOwn = W(10, 'aquellos');
  const WL = 560;
  const wave = Array.from({length: 49}, (_, i) => {
    const x = -400 + i * 60;
    return `${i ? 'L' : 'M'}${x} ${WL + Math.sin(i * 0.7 + t * 2.4) * 10}`;
  }).join(' ');
  return (
    <Cam t={t} keys={[[a, 960, 470, 1.0], [tDive - 0.3, 960, 470, 1.03], [tDive + 1.8, 960, 1200, 1.0], [b, 960, 1260, 0.94]]}>
      <Layer depth={1}>
        <rect x={-1200} y={-1400} width={4320} height={1400 + WL} fill={M.bg} />
        <g transform="translate(0 -60)">
          <Bg t={t} motes={false} />
        </g>
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#1A5A86" />
            <stop offset="0.5" stopColor="#0E3358" />
            <stop offset="1" stopColor="#071833" />
          </linearGradient>
        </defs>
        <path d={`${wave} L2400 2400 L-400 2400 Z`} fill="url(#water)" />
        {/* rayos de luz bajo el agua */}
        {[0, 1, 2, 3].map((i) => (
          <path key={i} d={`M${300 + i * 420} ${WL} L${420 + i * 420} ${WL} L${620 + i * 420} 1600 L${380 + i * 420} 1600 Z`} fill="#ffffff" opacity={0.035} />
        ))}
        {BODY.map(([d, c], i) => (
          <path key={i} d={d} fill={c} opacity={0.82} />
        ))}
        {TIP.map(([d, c], i) => (
          <path key={i} d={d} fill={c} />
        ))}
        <path d={wave} fill="none" stroke="#9FE3FF" strokeWidth={4} opacity={0.7} />
        {/* burbujas al sumergirse */}
        {Array.from({length: 30}, (_, i) => {
          const age = t - (tDive + hash(i) * 2.4);
          if (age < 0 || age > 3) return null;
          return <circle key={i} cx={200 + hash(i + 4) * 1520 + Math.sin(age * 4 + i) * 10} cy={1300 + hash(i + 8) * 500 - age * 260} r={4 + hash(i + 2) * 10} fill="none" stroke="#BFEFFF" strokeWidth={2.5} opacity={0.6 * (1 - age / 3)} />;
        })}
        {/* lo que perseguimos */}
        <Kin x={960} y={130} text="LO QUE PERSEGUIMOS…" t={t} at={a + 0.25} size={58} weight={900} stagger={0.02} />
        {[
          ['dollar', 700, 360, M.amber, 'DINERO'],
          ['briefcase', 1240, 300, M.violet, 'TRABAJO'],
          ['car', 1380, 470, M.coral, 'AUTOS'],
        ].map(([n, x, y, c, l], i) => (
          <g key={n as string}>
            <IconBadge name={n as string} x={x as number} y={(y as number) + Math.sin(t * 2 + i) * 8} r={56} bg={c as string} color={M.bg} p={spr(t, a + 0.5 + i * 0.25)} />
            <Kin x={x as number} y={(y as number) + 100} text={l as string} t={t} at={a + 0.8 + i * 0.25} size={28} weight={800} w={400} stagger={0.02} />
          </g>
        ))}
        {/* lo que de verdad queremos */}
        <Kin x={110} y={860} text={"…LO QUE DE\nVERDAD\nQUEREMOS"} t={t} at={tDive + 1.1} size={56} weight={900} color={M.cyan} align="left" w={600} stagger={0.015} glow="rgba(0,0,0,0.6)" />
        <Kin x={960} y={1000} text="ATENCIÓN" t={t} at={tAtt - 0.1} size={110} weight={900} glow="rgba(255,255,255,0.45)" />
        <Kin x={960} y={1210} text="RESPETO" t={t} at={tResp - 0.1} size={110} weight={900} glow="rgba(255,255,255,0.45)" />
        <Kin x={960} y={1460} text="«AMOR»" t={t} at={tLove - 0.1} size={150} weight={900} color={M.coral} glow="rgba(255,90,95,0.8)" mode="slam" />
        {/* quienes poseen esas cosas reciben corazones */}
        {t > tOwn - 0.3 ? (
          <g>
            <Token x={1500} y={1560} s={1.0} color={M.violet} p={spr(t, tOwn - 0.3)}>
              <g transform="translate(0 -230) scale(0.5)">
                <Icon name="crown" x={0} y={0} color={M.amber} fill={M.amber} sw={8} />
              </g>
            </Token>
            {Array.from({length: 7}, (_, i) => {
              const age = (t - tOwn - i * 0.35) % 2.4;
              if (t < tOwn + i * 0.35) return null;
              return <Icon key={i} name="heart" x={1500 + Math.sin(age * 3 + i) * 50} y={1360 - age * 120} s={0.35} color={M.coral} fill={M.coral} sw={6} opacity={1 - age / 2.4} />;
            })}
          </g>
        ) : null}
      </Layer>
    </Cam>
  );
};

export const _a = {Burst, Disclaimer, pr};
