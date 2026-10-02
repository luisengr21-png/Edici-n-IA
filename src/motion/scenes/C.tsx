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
  GOTH,
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
  Shock,
  spr,
  Token,
  wobble,
} from '../kit';
import {SceneProps} from './A';

const phase = (t: number, t0: number, t1: number, f = 0.4) => clamp((t - t0) / f) * clamp((t1 - t) / f);

/** Etiqueta que cae y se estampa con onda expansiva */
const SlamTag: React.FC<{x: number; y: number; text: string; t: number; at: number; bg?: string; color?: string; size?: number; rot?: number}> = ({x, y, text, t, at, bg = M.red, color = M.white, size = 54, rot = -6}) => {
  if (t < at - 0.18) return null;
  const k = clamp((t - (at - 0.18)) / 0.18);
  const sc = t < at ? lerp(2.4, 1, k * k) : 1 + wobble(t, at, 0.06, 3, 6);
  const w = text.length * size * 0.72 + size * 1.4;
  return (
    <g>
      <Shock x={x} y={y} t={t} at={at} color={bg} r={380} />
      <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={t < at ? k : 1}>
        <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.8} rx={size * 0.5} fill={bg} filter="url(#dropShadow)" />
        <text y={size * 0.36} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={size} letterSpacing={3} fill={color}>
          {text}
        </text>
      </g>
    </g>
  );
};

// ───────── Escena 13: la escalera y la flecha que se invierte ─────────
export const Stairs: React.FC<SceneProps> = ({t, a, b}) => {
  const tAdor = W(33, 'adorables');
  const tProb = W(33, 'problema');
  const tTop = W(33, 'cima');
  const tBottom = W(33, 'fondo');
  const tResp = W(33, 'responsables');
  const flip = spr(t, tBottom - 0.2, 1.6, 0.5);
  const arrowRot = 180 * flip;
  const ax = lerp(1640, 330, eio(t, tBottom - 0.2, 0.8));
  const ay = lerp(420, 400, eio(t, tBottom - 0.2, 0.8));
  const arrowCol = flip > 0.5 ? M.coral : M.mint;
  return (
    <g>
      <Bg t={t} />
      <Kin x={960} y={130} text="LA MERITOCRACIA SUENA ADORABLE" t={t} at={a + 0.1} size={58} weight={900} stagger={0.012} out={tTop - 0.6} />
      {[[420, 240], [1100, 210], [1720, 220]].map(([x, y], i) => (
        <IconBadge key={i} name="heart" x={x} y={y + Math.sin(t * 3 + i) * 8} r={34} bg={M.rose} p={spr(t, tAdor + i * 0.12, 2.6, 0.45) * (1 - eo(t, tTop - 0.6, 0.3))} />
      ))}
      <Pill x={960} y={250} text="PERO…" t={t} at={tProb - 0.1} bg={M.coral} size={40} out={tTop - 0.6} />
      {/* escalera con volumen */}
      {Array.from({length: 6}, (_, i) => {
        const x = 520 + i * 160;
        const h = (i + 1) * 95;
        const yTop = 960 - h;
        const s = spr(t, a + 0.3 + i * 0.08, 2.2, 0.5);
        return (
          <g key={i} transform={`translate(0 ${(1 - clamp(s)) * 400})`} opacity={clamp(s * 3)}>
            <rect x={x} y={yTop} width={160} height={h} fill={M.bg3} />
            <path d={`M${x} ${yTop} L${x + 34} ${yTop - 26} L${x + 194} ${yTop - 26} L${x + 160} ${yTop} Z`} fill="#3B4280" />
            {i === 5 ? <path d={`M${x + 160} ${yTop} L${x + 194} ${yTop - 26} L${x + 194} ${960 - 26} L${x + 160} 960 Z`} fill="#1B1F45" /> : null}
          </g>
        );
      })}
      {/* los de arriba, con estrellas */}
      {[0, 1].map((i) => {
        const x = 1260 + i * 160;
        const yTop = 960 - (i + 5) * 95 - 12;
        return (
          <g key={i}>
            <Token x={x + 95} y={yTop} s={0.95} color={i ? M.violet : M.cyan} p={spr(t, a + 0.9 + i * 0.15)} />
            <g transform={`translate(${x + 95} ${yTop - 240}) scale(${spr(t, tTop + 0.1 + i * 0.2, 2.6, 0.45) * 0.55}) rotate(${t * 120})`}>
              <Icon name="star" x={0} y={0} color={M.amber} fill={M.amber} sw={6} />
            </g>
          </g>
        );
      })}
      {/* el de abajo */}
      <Token x={330} y={960} s={1.1} color={M.gray} p={spr(t, a + 1.0)} sad={t > tResp} />
      {/* la flecha */}
      <g transform={`translate(${ax} ${ay}) rotate(${arrowRot}) scale(${spr(t, tTop - 0.2)})`}>
        <Glow>
          <path d="M-24 90 L-24 -20 L-60 -20 L0 -100 L60 -20 L24 -20 L24 90 Z" fill={arrowCol} />
        </Glow>
      </g>
      <Kin x={1640} y={640} text={'MERECEN\nESTAR ARRIBA'} t={t} at={tTop} size={46} weight={900} color={M.mint} out={tBottom - 0.3} w={600} />
      <Kin x={960} y={1030} text="…ENTONCES LOS DE ABAJO TAMBIÉN MERECEN SU LUGAR" t={t} at={tBottom + 0.2} size={44} weight={900} color={M.white} stagger={0.01} />
      <SlamTag x={360} y={640} text="RESPONSABLE" t={t} at={tResp} size={48} />
    </g>
  );
};

// ───────── Escena 14: un sistema diseñado ─────────
const band = (x0: number, y0: number, h0: number, x1: number, y1: number, h1: number) => {
  const mx = (x0 + x1) / 2;
  return `M${x0} ${y0} C${mx} ${y0} ${mx} ${y1} ${x1} ${y1} L${x1} ${y1 + h1} C${mx} ${y1 + h1} ${mx} ${y0 + h0} ${x0} ${y0 + h0} Z`;
};
const bez = (x0: number, y0: number, x1: number, y1: number, u: number): [number, number] => {
  const mx = (x0 + x1) / 2;
  const p0 = [x0, y0], p1 = [mx, y0], p2 = [mx, y1], p3 = [x1, y1];
  const v = 1 - u;
  return [0, 1].map((k) => v * v * v * p0[k] + 3 * v * v * u * p1[k] + 3 * v * u * u * p2[k] + u * u * u * p3[k]) as [number, number];
};
const FLOWS: [number, number, number, number, number, string, number][] = [
  // y0 (centro izq), h, y1 (centro der), h1, opacidad, color, densidad
  [370, 190, 365, 190, 0.85, M.amber, 10],
  [465, 30, 585, 30, 0.45, M.amber, 2],
  [570, 60, 480, 60, 0.4, M.grayLight, 3],
  [750, 300, 735, 300, 0.7, M.grayLight, 12],
];

export const System: React.FC<SceneProps> = ({t, a, b}) => {
  const tGov = S(34);
  const tResp = W(34, 'responsabilidad');
  const tRep = W(35, 'repetir');
  const tNo = W(35, 'no se corrigen');
  const tEff = W(36, 'esforzarse');
  const tSmart = W(36, 'listo');
  const tRec = W(36, 'reconocer');
  const tSys = W(36, 'sistemas');
  const tPriv = W(36, 'privilegios');
  const flow = eio(t, tSys - 0.3, 1.6);
  const fall = eio(t, tRec, 0.9);
  return (
    <g>
      <Bg t={t} />
      <Cam t={t} keys={[[a, 960, 540, 1.0], [tSys - 0.6, 1000, 540, 1.0], [tSys + 0.4, 2900, 540, 1.0], [b, 2920, 540, 1.04]]}>
        <Layer depth={1}>
          {/* edificio de gobierno */}
          <g transform={`translate(640 600) scale(${spr(t, a + 0.2, 1.8, 0.5)})`}>
            <path d="M-330 -170 L0 -330 L330 -170 Z" fill={M.violet} />
            <rect x={-350} y={-170} width={700} height={36} rx={8} fill="#6A52E0" />
            {Array.from({length: 6}, (_, i) => (
              <rect key={i} x={-290 + i * 112} y={-130} width={56} height={330} rx={10} fill={M.white} opacity={0.92} />
            ))}
            <rect x={-370} y={200} width={740} height={40} rx={10} fill="#6A52E0" />
            <rect x={-400} y={240} width={800} height={40} rx={10} fill={M.violet} />
            <path d="M0 -330 L0 -430" stroke={M.white} strokeWidth={8} strokeLinecap="round" />
            <path d={`M0 -430 L${90 + Math.sin(t * 6) * 8} ${-415 + Math.sin(t * 5) * 6} L0 -395 Z`} fill={M.coral} />
          </g>
          <Kin x={640} y={130} text="LOS GOBIERNOS" t={t} at={tGov - 0.1} size={70} weight={900} stagger={0.02} />
          <Pill x={640} y={1010} text="GRAN PARTE DE LA RESPONSABILIDAD" t={t} at={tResp - 0.3} bg={M.amber} color={M.bg} size={30} />
          {/* bocadillo oficial */}
          <g transform={`translate(1360 330) scale(${spr(t, tRep - 0.2, 2, 0.5)})`}>
            <rect x={-330} y={-80} width={660} height={160} rx={40} fill={M.white} filter="url(#dropShadow)" />
            <path d="M-260 70 L-330 150 L-180 74 Z" fill={M.white} />
            <text y={-12} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={M.bg}>
              «SOCIEDAD DE
            </text>
            <text y={42} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={M.bg}>
              OPORTUNIDADES»
            </text>
            {t > tNo + 0.2 ? <rect x={-300} y={-6} width={600 * eo(t, tNo + 0.2, 0.3)} height={12} rx={6} fill={M.coral} /> : null}
          </g>
          {/* notas que se despegan */}
          {[
            ['ESFUÉRZATE MÁS', tEff, 1220, 700, -7, M.amber],
            ['SÉ MÁS LISTO', tSmart, 1560, 760, 6, M.cyan],
          ].map(([l, at, x, y, r, c], i) => {
            const p = spr(t, at as number, 2.4, 0.45);
            if (p <= 0.001) return null;
            return (
              <g key={i} transform={`translate(${(x as number) + fall * (i ? 80 : -80)} ${(y as number) + fall * fall * 700}) rotate(${(r as number) + fall * (i ? 60 : -60)}) scale(${p})`}>
                <rect x={-160} y={-80} width={320} height={160} rx={14} fill={c as string} filter="url(#dropShadow)" />
                <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={34} fill={M.bg}>
                  {l as string}
                </text>
              </g>
            );
          })}
          {/* diagrama de flujos */}
          <g opacity={eo(t, tSys - 0.5, 0.4)}>
            <Kin x={2900} y={150} text="DE DÓNDE VIENES → DÓNDE TERMINAS" t={t} at={tSys - 0.3} size={52} weight={900} stagger={0.012} />
            <defs>
              <clipPath id="flowClip">
                <rect x={2380} y={0} width={1100 * flow} height={1080} />
              </clipPath>
            </defs>
            <g clipPath="url(#flowClip)">
              {FLOWS.map(([y0, h0, y1, h1, o, c], i) => (
                <path key={i} d={band(2440, y0 - h0 / 2, h0, 3420, y1 - h1 / 2, h1)} fill={c} opacity={o * 0.55} />
              ))}
            </g>
            {/* partículas que fluyen */}
            {flow >= 1
              ? FLOWS.flatMap(([y0, h0, y1, h1, , c, n], i) =>
                  Array.from({length: n}, (_, k) => {
                    const u = ((t * 0.32 + k / n + i * 0.13) % 1 + 1) % 1;
                    const off = (hash(k + i * 17) - 0.5) * 0.7;
                    const [x, y] = bez(2440, y0 + off * h0, 3420, y1 + off * h1, u);
                    return <circle key={`${i}-${k}`} cx={x} cy={y} r={5} fill={c === M.amber ? M.amber : M.white} opacity={0.85} />;
                  }),
                )
              : null}
            <rect x={2400} y={260} width={40} height={220} rx={10} fill={M.amber} />
            <rect x={2400} y={540} width={40} height={360} rx={10} fill={M.grayLight} />
            <rect x={3420} y={260} width={40} height={250} rx={10} fill={M.amber} />
            <rect x={3420} y={570} width={40} height={330} rx={10} fill={M.grayLight} />
            {[
              ['ORIGEN PRIVILEGIADO', 2380, 380, 'end'],
              ['ORIGEN HUMILDE', 2380, 730, 'end'],
              ['ARRIBA', 3480, 395, 'start'],
              ['ABAJO', 3480, 745, 'start'],
            ].map(([l, x, y, an]) => (
              <text key={l as string} x={x as number} y={y as number} textAnchor={an as 'start' | 'end'} fontFamily={FONT} fontWeight={800} fontSize={26} letterSpacing={2} fill={M.white}>
                {l as string}
              </text>
            ))}
            <Kin x={2900} y={1010} text="LOS PRIVILEGIOS SE QUEDAN DONDE ESTÁN" t={t} at={tPriv - 0.2} size={48} weight={900} color={M.amber} stagger={0.01} />
            <Disclaimer x={3780} y={200} />
          </g>
        </Layer>
      </Cam>
    </g>
  );
};

// ───────── Escena 15: la ruleta de la fortuna ─────────
const USA =
  'M40 40 L230 40 L560 40 L600 60 L640 110 L700 100 L720 150 L760 130 L800 140 L840 110 L900 90 L960 40 L990 70 L950 130 L900 170 L880 230 L860 280 L870 330 L820 400 L790 450 L820 560 L780 560 L740 470 L640 470 L600 500 L520 520 L470 590 L420 520 L380 470 L300 470 L250 420 L140 400 L80 330 L40 200 L30 100 Z';
const SEG_ICONS = ['crown', 'coin', 'house', 'star', 'briefcase', 'heart', 'car', 'trophy'];

export const Fortune: React.FC<SceneProps> = ({t, a, b}) => {
  const tDes = W(37, 'desagradable');
  const tMer = W(37, 'merece');
  const tMed = S(38);
  const tUnl = W(38, 'desafortunados');
  const tGod = W(38, 'diosa');
  const tNow = S(39);
  const tUS = W(39, 'estados unidos');
  const tLos = W(39, 'perdedores');
  const intro = phase(t, a - 1, tMed + 0.1);
  const wheelOn = phase(t, tMed - 0.3, tUS - 0.6);
  // ángulo: rápido al principio, se frena hasta detenerse en «actualmente»
  const T = clamp((t - tMed) / (tNow + 0.6 - tMed));
  const ang = 900 * (1 - Math.pow(1 - T, 3)) + (t > tNow + 0.6 ? 0 : 0);
  const segPhase = (ang / 45) % 1;
  const tick = T < 1 ? (1 - segPhase) * 18 * (1 - T) : 0;
  const R = 330;
  return (
    <g>
      <Bg t={t} />
      {intro > 0 ? (
        <g opacity={intro}>
          <Kin x={960} y={240} text="LA POBREZA" t={t} at={a + 0.15} size={110} weight={900} stagger={0.03} />
          <Kin x={960} y={350} text="NO SOLO DESAGRADABLE…" t={t} at={tDes - 0.2} size={44} weight={800} color={M.grayLight} stagger={0.012} />
          <Token x={960} y={900} s={1.6} color={M.gray} sad p={spr(t, a + 0.3)} />
          <SlamTag x={1300} y={660} text="MERECIDA" t={t} at={tMer} size={60} />
        </g>
      ) : null}
      {wheelOn > 0 ? (
        <g opacity={wheelOn}>
          <g transform={`translate(760 600) rotate(${ang})`}>
            {Array.from({length: 8}, (_, i) => {
              const a0 = (i / 8) * Math.PI * 2;
              const a1 = ((i + 1) / 8) * Math.PI * 2;
              const am = (a0 + a1) / 2;
              return (
                <g key={i}>
                  <path d={`M0 0 L${Math.cos(a0) * R} ${Math.sin(a0) * R} A${R} ${R} 0 0 1 ${Math.cos(a1) * R} ${Math.sin(a1) * R} Z`} fill={PALETTE[i % PALETTE.length]} />
                  <Icon name={SEG_ICONS[i]} x={Math.cos(am) * R * 0.66} y={Math.sin(am) * R * 0.66} s={0.55} rot={(am * 180) / Math.PI + 90} color={M.bg} sw={8} />
                </g>
              );
            })}
            <circle r={R} fill="none" stroke={M.white} strokeWidth={14} />
            {Array.from({length: 16}, (_, i) => {
              const aa = (i / 16) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(aa) * (R + 2)} cy={Math.sin(aa) * (R + 2)} r={7} fill={M.amber} />;
            })}
            <circle r={44} fill={M.white} />
            <circle r={18} fill={M.bg} />
          </g>
          {/* puntero */}
          <g transform={`translate(760 ${600 - R - 30}) rotate(${-tick})`}>
            <path d="M-30 -40 L30 -40 L0 30 Z" fill={M.white} filter="url(#dropShadow)" />
          </g>
          <text x={1420} y={330} textAnchor="middle" fontFamily={GOTH} fontSize={110} fill={M.amber} opacity={eo(t, tUnl - 0.3, 0.4)} style={{filter: 'drop-shadow(0 0 18px rgba(255,200,69,0.55))'}}>
            Desafortunados
          </text>
          <Pill x={1420} y={460} text="LA DIOSA FORTUNA NO TE BENDIJO" t={t} at={tGod - 0.2} bg={M.violet} size={28} />
          <Disclaimer x={1850} y={1030} text="INGLATERRA MEDIEVAL" />
        </g>
      ) : null}
      {t > tUS - 0.8 ? (
        <g opacity={eo(t, tUS - 0.8, 0.4)}>
          <rect x={-100} y={-100} width={2120} height={1280} fill="#262A40" />
          <g transform={`translate(960 530) scale(${spr(t, tUS - 0.7, 1.6, 0.55)}) translate(-520 -300)`}>
            <path d={USA} fill="#3A3F5E" stroke={M.grayLight} strokeWidth={5} strokeLinejoin="round" />
          </g>
          <Kin x={960} y={560} text="ESTADOS UNIDOS" t={t} at={tUS - 0.4} size={80} weight={900} stagger={0.02} />
          <Pill x={960} y={170} text="«UN PAÍS MERITOCRÁTICO»" t={t} at={tUS + 0.6} bg={M.white} color={M.bg} size={32} />
          <SlamTag x={960} y={790} text="PERDEDORES" t={t} at={tLos} size={86} />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 16: el veredicto ─────────
const Die: React.FC<{x: number; y: number; rot: number; n: number; s?: number}> = ({x, y, rot, n, s = 1}) => {
  const pips: Record<number, [number, number][]> = {
    3: [[-26, -26], [0, 0], [26, 26]],
    5: [[-26, -26], [26, -26], [0, 0], [-26, 26], [26, 26]],
    6: [[-26, -28], [26, -28], [-26, 0], [26, 0], [-26, 28], [26, 28]],
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-60} y={-60} width={120} height={120} rx={26} fill={M.white} filter="url(#dropShadow)" />
      {pips[n].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={10} fill={M.bg} />
      ))}
    </g>
  );
};

/** Texto que se desintegra en píxeles */
const Pixelize: React.FC<{x: number; y: number; text: string; t: number; at: number; breakAt: number; size?: number; color?: string}> = ({x, y, text, t, at, breakAt, size = 150, color = M.white}) => {
  if (t < at) return null;
  const age = t - breakAt;
  if (age < 0) return <Kin x={x} y={y} text={text} t={t} at={at} size={size} weight={900} color={color} stagger={0.04} />;
  if (age > 1.4) return null;
  const w = text.length * size * 0.72;
  const cols = 34;
  const rows = 7;
  return (
    <g>
      {Array.from({length: cols * rows}, (_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const px = x - w / 2 + (c / cols) * w;
        const py = y - size * 0.75 + (r / rows) * size * 0.85;
        const d = hash(i * 1.7);
        const delay = (c / cols) * 0.4;
        const k = clamp((age - delay) / 0.9);
        if (hash(i * 9.1) < 0.35) return null;
        return <rect key={i} x={px + k * (120 + d * 300)} y={py - k * (60 + d * 200) + k * k * 120} width={w / cols - 3} height={w / cols - 3} rx={2} fill={color} opacity={(1 - k) * (k > 0 ? 1 : 0)} />;
      })}
    </g>
  );
};

export const Verdict: React.FC<SceneProps> = ({t, a, b}) => {
  const tFired = S(41);
  const tBad = W(41, 'mala suerte');
  const tPos = S(42);
  const tField = W(42, 'posición');
  const tChar = W(42, 'carácter');
  const tVer = W(42, 'veredicto');
  const dice = phase(t, a - 1, tFired + 0.1);
  const fired = phase(t, tFired - 0.2, tPos - 0.05, 0.3);
  const roll = eo(t, a + 0.1, 1.2);
  const glitch = t > tVer && t < tVer + 0.3;
  return (
    <g>
      <Bg t={t} />
      {dice > 0 ? (
        <g opacity={dice}>
          <Die x={lerp(-200, 760, roll)} y={420 - Math.abs(Math.sin(roll * 9)) * 140 * (1 - roll)} rot={roll * 620} n={5} />
          <Die x={lerp(-100, 1100, roll)} y={460 - Math.abs(Math.sin(roll * 8 + 1)) * 120 * (1 - roll)} rot={roll * 480 + 20} n={3} />
          <Pixelize x={960} y={800} text="SUERTE" t={t} at={a + 0.7} breakAt={a + 2.6} size={160} />
          <Kin x={960} y={980} text="YA NO CREEMOS EN ELLA" t={t} at={a + 2.8} size={44} weight={800} color={M.grayLight} stagger={0.012} />
        </g>
      ) : null}
      {fired > 0 ? (
        <g opacity={fired}>
          <g transform={`translate(960 ${lerp(-140, 300, spr(t, tFired - 0.1, 1.8, 0.55))})`}>
            <rect x={-420} y={-70} width={840} height={140} rx={34} fill={M.white} filter="url(#dropShadow)" />
            <circle cx={-340} cy={0} r={40} fill={M.coral} />
            <g transform={`translate(-340 0) rotate(${wobble(t, tFired + 0.2, 18, 3, 3)})`}>
              <Icon name="bell" x={0} y={0} s={0.5} color={M.white} sw={9} />
            </g>
            <text x={-270} y={-10} fontFamily={FONT} fontWeight={800} fontSize={26} fill={M.grayLight}>
              NOTIFICACIÓN
            </text>
            <text x={-270} y={34} fontFamily={FONT} fontWeight={900} fontSize={36} fill={M.bg}>
              Despedido por «mala suerte»
            </text>
          </g>
          <Token x={960} y={900} s={1.5} color={M.cyan} sad p={spr(t, tFired)} />
          <SlamTag x={1320} y={620} text="NADIE TE CREERÁ" t={t} at={tBad + 0.7} bg={M.coral} size={44} rot={4} />
        </g>
      ) : null}
      {t > tPos - 0.05 ? (
        <g opacity={eo(t, tPos - 0.05, 0.25)}>
          <g transform={`translate(760 560) scale(${spr(t, tPos, 1.8, 0.55)})`}>
            <rect x={-360} y={-300} width={720} height={600} rx={36} fill={M.white} filter="url(#dropShadow)" />
            <rect x={-360} y={-300} width={720} height={130} rx={36} fill={M.violet} />
            <circle cx={-250} cy={-160} r={70} fill={M.amber} stroke={M.white} strokeWidth={8} />
            <rect x={-160} y={-130} width={260} height={22} rx={11} fill="#C9CCDD" />
            <rect x={-160} y={-96} width={170} height={16} rx={8} fill="#E1E3EE" />
            <g>
              {t > tField - 0.1 ? <rect x={-320} y={-30} width={640} height={86} rx={20} fill="none" stroke={M.amber} strokeWidth={6} opacity={eo(t, tField - 0.1, 0.3)} /> : null}
              <text x={-290} y={24} fontFamily={FONT} fontWeight={800} fontSize={34} fill={M.grayLight}>
                PUESTO
              </text>
              <text x={-130} y={24} fontFamily={FONT} fontWeight={900} fontSize={34} fill={M.bg}>
                Gerente regional
              </text>
            </g>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <rect x={-290} y={100 + i * 56} width={580} height={18} rx={9} fill="#E1E3EE" />
                <rect x={-290} y={100 + i * 56} width={[460, 330, 400][i]} height={18} rx={9} fill={[M.mint, M.cyan, M.violet][i]} opacity={0.7} />
              </g>
            ))}
          </g>
          {t > tChar - 0.5 ? <path d={`M1080 560 C1200 560 1220 380 ${lerp(1080, 1340, eo(t, tChar - 0.5, 0.4))} 380`} fill="none" stroke={M.amber} strokeWidth={6} strokeLinecap="round" strokeDasharray="2 14" /> : null}
          <Pill x={1340} y={380} text="= CARÁCTER" t={t} at={tChar - 0.1} bg={M.amber} color={M.bg} size={50} anchor="left" />
          <g transform={`translate(${glitch ? (hash(Math.floor(t * 60)) - 0.5) * 30 : 0} 0)`}>
            {glitch ? (
              <g opacity={0.7}>
                <SlamTag x={1394} y={760} text="VEREDICTO" t={t} at={tVer} bg={M.cyan} size={74} rot={-8} />
              </g>
            ) : null}
            <SlamTag x={1380} y={760} text="VEREDICTO" t={t} at={tVer} bg={M.red} size={74} rot={-8} />
          </g>
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 17: detrás de cada estadística ─────────
export const Behind: React.FC<SceneProps> = ({t, a, b}) => {
  const tMod = W(43, 'mundo moderno');
  const tPeople = S(44);
  const tShame = W(44, 'vergüenza');
  const tLie = W(44, 'mienten');
  const tBroken = W(44, 'rotas');
  const line = eio(t, a + 0.5, 7.5);
  const toDots = eio(t, tPeople - 0.3, 1.2);
  const pts = Array.from({length: 60}, (_, i) => {
    const u = i / 59;
    return [300 + u * 1320, 820 - Math.pow(u, 2.3) * 500 - Math.sin(u * 19) * 6] as [number, number];
  });
  const shown = Math.floor(line * 59);
  const fig = (k: number, at: number, label: string, el: React.ReactNode) => {
    const p = eo(t, at - 0.5, 1.0);
    if (p <= 0) return null;
    const x = 420 + k * 540;
    return (
      <g opacity={p} transform={`translate(0 ${(1 - p) * 30})`}>
        {el}
        <Kin x={x} y={960} text={label} t={t} at={at - 0.2} size={44} weight={900} color={k === 2 ? M.amber : M.grayLight} stagger={0.02} w={600} />
      </g>
    );
  };
  return (
    <g>
      <Bg t={t} kind="night" />
      <rect x={-100} y={-100} width={2120} height={1280} fill="#000" opacity={0.25} />
      <g opacity={1 - toDots}>
        <path d="M300 860 L1640 860 M300 860 L300 260" stroke={M.grayLight} strokeWidth={3} opacity={0.5} />
        <path d={pts.slice(0, shown + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={M.white} strokeWidth={4} strokeLinecap="round" />
        <Kin x={1640} y={930} text="hacia el «mundo moderno» →" t={t} at={tMod - 0.2} size={34} weight={700} color={M.grayLight} align="right" w={900} stagger={0.01} />
        <Disclaimer x={1640} y={230} text="ILUSTRATIVO · SIN CIFRAS" />
      </g>
      {toDots > 0 && toDots < 1
        ? pts.filter((_, i) => i % 4 === 0).map(([x, y], i) => <circle key={i} cx={lerp(x, 420 + (i % 3) * 540, toDots)} cy={lerp(y, 620, toDots)} r={lerp(5, 2, toDots)} fill={M.white} opacity={1 - toDots} />)
        : null}
      {fig(
        0,
        tShame,
        'VERGÜENZA',
        <g>
          <Token x={420} y={820} s={1.5} color={M.gray} sad />
          <g transform={`translate(420 ${430 + Math.sin(t * 2) * 6})`}>
            <Icon name="cloud" x={0} y={0} s={1.4} color={M.grayLight} fill={M.gray} sw={6} />
            {Array.from({length: 6}, (_, i) => {
              const k = ((t * 1.4 + i / 6) % 1);
              return <path key={i} d={`M${-36 + i * 15} ${40 + k * 80} l-5 14`} stroke={M.cyan} strokeWidth={4} strokeLinecap="round" opacity={1 - k} />;
            })}
          </g>
        </g>,
      )}
      {fig(
        1,
        tLie,
        'APARENTAR',
        <g>
          <Token x={960} y={820} s={1.5} color={M.violet} sad />
          <g transform={`translate(${1000 + Math.sin(t * 1.5) * 4} 600) rotate(-8)`}>
            <Icon name="mask" x={0} y={0} s={1.2} color={M.bg} fill={M.white} sw={6} />
          </g>
        </g>,
      )}
      {fig(
        2,
        tBroken,
        'ROTAS… Y REPARABLES',
        <g transform="translate(1500 640) scale(5)">
          <path d="M0 34 C-30 14 -40 -6 -32 -22 C-24 -36 -6 -36 0 -22 C6 -36 24 -36 32 -22 C40 -6 30 14 0 34 Z" fill="#B8434B" />
          <path d="M-2 -20 L6 -6 L-4 6 L4 18 L0 30" fill="none" stroke={M.bg} strokeWidth={3} strokeLinejoin="round" />
          <g opacity={eo(t, tBroken + 0.5, 1.4)}>
            <path d="M-2 -20 L6 -6 L-4 6 L4 18 L0 30" fill="none" stroke={M.amber} strokeWidth={2.2} strokeLinejoin="round" style={{filter: 'drop-shadow(0 0 3px rgba(255,200,69,0.9))'}} />
          </g>
        </g>,
      )}
    </g>
  );
};

// ───────── Escena 18: título del capítulo 4 ─────────
export const HowTitle: React.FC<SceneProps> = ({t, a}) => (
  <g>
    <rect x={-100} y={-100} width={2120} height={1280} fill={M.amber} />
    <ChapterTitle t={t} at={a} num="04" title="¿CÓMO SUPERARLO?" color={M.amber} dur={30} />
    <Burst x={960} y={600} t={t} at={a + 0.6} n={40} spread={700} dur={2.4} colors={[M.white, M.coral, M.violet]} seed={7} />
  </g>
);

export const _c = {pr, Glow, Cam, Layer};
