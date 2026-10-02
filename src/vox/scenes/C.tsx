import React from 'react';
import {S, W} from '../../estatus/timing';
import {
  Bg,
  Cam,
  ChapterCard,
  clamp,
  Cutout,
  eio,
  eo,
  GOTH,
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
  SERIF,
  settle,
  Sheet,
  Tag,
  Tape,
  TYPE,
  Typed,
  V,
} from '../kit';
import {Briefcase, SceneProps} from './A';

const phase = (t: number, t0: number, t1: number, f = 0.35) => clamp((t - t0) / f) * clamp((t1 - t) / f);

/** Sello de goma rojo */
export const RedStamp: React.FC<{x: number; y: number; t: number; at: number; text: string; size?: number; rot?: number}> = ({x, y, t, at, text, size = 80, rot = -9}) => {
  if (t < at - 0.2) return null;
  const k = clamp((t - (at - 0.2)) / 0.2);
  const sc = t < at ? lerp(1.8, 1, k * k) : 1 + settle(t, at, 0.05, 2.5, 6);
  const w = text.length * size * 0.56 + 60;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={t < at ? k * 0.5 : 0.9} style={{mixBlendMode: 'multiply'}}>
      <rect x={-w / 2} y={-size * 0.75} width={w} height={size * 1.25} rx={8} fill="none" stroke={V.red} strokeWidth={8} />
      <text y={size * 0.3} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={size} fill={V.red} letterSpacing={6}>
        {text}
      </text>
    </g>
  );
};

// ───────── Escena 13: la otra cara (silogismo) ─────────
export const Syllogism: React.FC<SceneProps> = ({t, a, b}) => {
  const tAdor = W(33, 'adorables');
  const tProb = W(33, 'problema');
  const tTop = W(33, 'cima');
  const tBottom = W(33, 'fondo');
  const tResp = W(33, 'responsables');
  return (
    <Cam t={t} keys={[[a, 960, 470, 1.0], [tBottom - 0.4, 960, 470, 1.0], [tBottom + 0.1, 960, 900, 1.0], [b, 960, 920, 1.04]]}>
      <Layer depth={0.3}>
        <Bg kind="dark" />
      </Layer>
      <Layer depth={1}>
        <g opacity={eo(t, a + 0.1, 0.3)}>
          <text x={960} y={200} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={64} fill="#fbfaf5">
            la meritocracia suena adorable
          </text>
          {[0, 1, 2].map((i) => (
            <path key={i} transform={`translate(${1460 + i * 60} ${150 - i * 20}) scale(${pop(t, tAdor + i * 0.12, 0.4) * 1.3})`} d="M0 12 C-18 0 -22 -12 -14 -19 C-8 -24 -2 -21 0 -15 C2 -21 8 -24 14 -19 C22 -12 18 0 0 12 Z" fill="#f08aa0" />
          ))}
          <text x={960} y={290} textAnchor="middle" fontFamily={MARK} fontSize={60} fill={V.yellow} opacity={eo(t, tProb - 0.1, 0.3)}>
            pero…
          </text>
        </g>
        {/* premisa */}
        <g opacity={eo(t, tTop - 0.5, 0.3)}>
          <text x={300} y={470} fontFamily={HEAD} fontWeight={800} fontSize={74} fill="#fbfaf5">
            SI LOS DE <tspan fill={V.green}>ARRIBA</tspan> MERECEN ESTAR ARRIBA…
          </text>
          <path d={`M200 ${560} L200 ${lerp(560, 380, eo(t, tTop, 0.6))}`} stroke={V.green} strokeWidth={16} />
          <path d={`M170 ${lerp(590, 410, eo(t, tTop, 0.6))} L200 ${lerp(560, 380, eo(t, tTop, 0.6))} L230 ${lerp(590, 410, eo(t, tTop, 0.6))}`} stroke={V.green} strokeWidth={16} fill="none" strokeLinejoin="round" />
        </g>
        {/* conclusión en espejo */}
        <g opacity={eo(t, tBottom - 0.1, 0.3)}>
          <text x={300} y={900} fontFamily={HEAD} fontWeight={800} fontSize={74} fill="#fbfaf5">
            …LOS DE <tspan fill={V.red}>ABAJO</tspan> MERECEN ESTAR ABAJO
          </text>
          <path d={`M200 ${800} L200 ${lerp(800, 980, eo(t, tBottom, 0.6))}`} stroke={V.red} strokeWidth={16} />
          <path d={`M170 ${lerp(770, 950, eo(t, tBottom, 0.6))} L200 ${lerp(800, 980, eo(t, tBottom, 0.6))} L230 ${lerp(770, 950, eo(t, tBottom, 0.6))}`} stroke={V.red} strokeWidth={16} fill="none" strokeLinejoin="round" />
        </g>
        <g opacity={eo(t, tResp - 0.4, 0.3)}>
          <Highlight x={640} y={990} w={640} h={80} p={pr(t, tResp - 0.2, 0.5)} />
          <text x={960} y={1050} textAnchor="middle" fontFamily={TYPE} fontSize={58} fill={V.ink}>
            «responsables»
          </text>
          <MarkerCircle cx={960} cy={1030} rx={360} ry={70} p={pr(t, tResp + 0.4, 0.6)} />
        </g>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 14: un sistema diseñado ─────────
const Capitol: React.FC = () => (
  <g>
    <path d="M-420 -260 L0 -420 L420 -260 Z" fill="#cfcfcf" />
    <rect x={-440} y={-260} width={880} height={40} fill="#b0b0b0" />
    {Array.from({length: 8}, (_, i) => (
      <g key={i}>
        <rect x={-380 + i * 106} y={-220} width={52} height={360} fill={i % 2 ? '#d8d8d8' : '#e8e8e8'} />
        <rect x={-380 + i * 106} y={-220} width={14} height={360} fill="#a8a8a8" />
      </g>
    ))}
    <rect x={-460} y={140} width={920} height={40} fill="#9a9a9a" />
    <rect x={-500} y={180} width={1000} height={40} fill="#8a8a8a" />
    <path d="M-140 -400 Q0 -560 140 -400 Z" fill="#bdbdbd" />
  </g>
);

const band = (x0: number, y0: number, h0: number, x1: number, y1: number, h1: number) => {
  const mx = (x0 + x1) / 2;
  return `M${x0} ${y0} C${mx} ${y0} ${mx} ${y1} ${x1} ${y1} L${x1} ${y1 + h1} C${mx} ${y1 + h1} ${mx} ${y0 + h0} ${x0} ${y0 + h0} Z`;
};

export const System: React.FC<SceneProps> = ({t, a, b}) => {
  const tRep = W(35, 'repetir');
  const tNo = W(35, 'no se corrigen');
  const tEff = W(36, 'esforzarse');
  const tSmart = W(36, 'listo');
  const tRec = W(36, 'reconocer');
  const tSys = W(36, 'sistemas');
  const tPriv = W(36, 'privilegios');
  const flow = eio(t, tSys - 0.4, 1.6);
  const notesFall = eio(t, tRec, 0.9);
  return (
    <Cam t={t} keys={[[a, 960, 540, 1.0], [tEff - 0.6, 1000, 540, 1.02], [tRec + 0.2, 1000, 540, 1.02], [tSys - 0.4, 2880, 540, 1.0], [b, 2900, 540, 1.04]]}>
      <Layer depth={0.3}>
        <Bg kind="paper" />
      </Layer>
      <Layer depth={0.8}>
        <g transform="translate(700 620)">
          <Cutout>
            <Capitol />
          </Cutout>
        </g>
        <text x={700} y={980} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={44} fill={V.ink} letterSpacing={6} opacity={eo(t, a + 0.2, 0.3)}>
          LOS GOBIERNOS
        </text>
      </Layer>
      <Layer depth={1.15}>
        <g opacity={eo(t, tRep - 0.3, 0.3)}>
          <Sheet x={1300} y={250} w={760} h={180} rot={2}>
            <text x={-340} y={-40} fontFamily={HEAD} fontWeight={600} fontSize={28} fill={V.inkSoft} letterSpacing={3}>
              DISCURSO OFICIAL
            </text>
            <Typed x={-340} y={30} text="«Vivimos en una sociedad" p={pr(t, tRep, 0.8)} size={40} />
            <Typed x={-340} y={80} text="de oportunidades.»" p={pr(t, tRep + 0.7, 0.6)} size={40} />
            <Marker d="M-350 18 L330 30 M-350 66 L60 76" p={pr(t, tNo + 0.2, 0.5)} w={8} />
          </Sheet>
        </g>
        <text x={1060} y={450} fontFamily={MARK} fontSize={42} fill={V.red} opacity={eo(t, tNo + 0.6, 0.3)} transform="rotate(-4 1060 450)">
          sin corregir la desigualdad de origen
        </text>
        {/* notas que se despegan */}
        {[
          ['esfuérzate más', tEff, 1240, 640, -6],
          ['sé más listo', tSmart, 1560, 720, 5],
        ].map(([l, at, x, y, r], i) => {
          const p = pop(t, at as number, 0.4);
          if (p <= 0) return null;
          const fall = notesFall;
          return (
            <g key={i} transform={`translate(${(x as number) + fall * 60 * (i ? 1 : -1)} ${(y as number) + fall * fall * 700}) rotate(${(r as number) + fall * 50 * (i ? 1 : -1)}) scale(${p})`}>
              <rect x={-150} y={-70} width={300} height={140} fill={V.yellow} filter="url(#paperShadow)" />
              <text y={14} textAnchor="middle" fontFamily={MARK} fontSize={40} fill={V.ink}>
                {l as string}
              </text>
            </g>
          );
        })}
      </Layer>
      {/* diagrama de flujos: los privilegios vuelven a donde estaban */}
      <Layer depth={1}>
        <defs>
          <clipPath id="sankeyClip">
            <rect x={2380} y={0} width={1120 * flow} height={1080} />
          </clipPath>
        </defs>
        <g opacity={eo(t, tSys - 0.6, 0.4)}>
          <text x={2880} y={150} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={60} fill={V.ink}>
            DE DÓNDE VIENES → DÓNDE TERMINAS
          </text>
          <rect x={2400} y={260} width={40} height={220} fill={V.ink} />
          <rect x={2400} y={540} width={40} height={360} fill={V.gray} />
          <rect x={3420} y={260} width={40} height={250} fill={V.ink} />
          <rect x={3420} y={570} width={40} height={330} fill={V.gray} />
          <g clipPath="url(#sankeyClip)">
            <path d={band(2440, 260, 190, 3420, 260, 190)} fill={V.yellow} opacity={0.85} />
            <path d={band(2440, 450, 30, 3420, 570, 30)} fill={V.yellow} opacity={0.5} />
            <path d={band(2440, 540, 60, 3420, 450, 60)} fill={V.gray} opacity={0.45} />
            <path d={band(2440, 600, 300, 3420, 600, 300)} fill={V.gray} opacity={0.7} />
          </g>
          {[
            ['ORIGEN PRIVILEGIADO', 2385, 380, 'end'],
            ['ORIGEN HUMILDE', 2385, 730, 'end'],
            ['ARRIBA', 3475, 395, 'start'],
            ['ABAJO', 3475, 745, 'start'],
          ].map(([l, x, y, an]) => (
            <text key={l as string} x={x as number} y={y as number} textAnchor={an as 'start' | 'end'} fontFamily={SANS} fontWeight={700} fontSize={26} letterSpacing={2} fill={V.ink}>
              {l as string}
            </text>
          ))}
          <g opacity={eo(t, tPriv - 0.2, 0.3)}>
            <Highlight x={2440} y={940} w={880} h={70} p={pr(t, tPriv, 0.6)} />
            <text x={2880} y={992} textAnchor="middle" fontFamily={TYPE} fontSize={46} fill={V.ink}>
              los privilegios se quedan donde están
            </text>
          </g>
          <Tag x={3560} y={190} text="Gráfico ilustrativo" anchor="end" />
        </g>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 15: de desafortunados a perdedores ─────────
const USA =
  'M40 40 L230 40 L560 40 L600 60 L640 110 L700 100 L720 150 L760 130 L800 140 L840 110 L900 90 L960 40 L990 70 L950 130 L900 170 L880 230 L860 280 L870 330 L820 400 L790 450 L820 560 L780 560 L740 470 L640 470 L600 500 L520 520 L470 590 L420 520 L380 470 L300 470 L250 420 L140 400 L80 330 L40 200 L30 100 Z';

export const Fortune: React.FC<SceneProps> = ({t, a, b}) => {
  const tMer = W(37, 'merece');
  const tMed = S(38);
  const tDes = W(38, 'desafortunados');
  const tGod = W(38, 'diosa');
  const tNow = S(39);
  const tUS = W(39, 'estados unidos');
  const tLos = W(39, 'perdedores');
  const intro = phase(t, a - 1, tMed + 0.1);
  const manus = phase(t, tMed - 0.3, tNow + 0.3);
  const map = t > tNow - 0.3;
  const ang = (t - tMed) * 20;
  return (
    <g>
      {intro > 0 ? (
        <g opacity={intro}>
          <Bg kind="grid" />
          <g transform="translate(960 900)">
            <Cutout>
              <rect x={-260} y={-30} width={520} height={30} fill="#7a7a7a" />
              <PhotoPerson x={-60} y={0} s={1.0} suit={90} hair="bun" hairTone={70} skin={205} tie={false} sad sit armR={[30, 40]} />
            </Cutout>
          </g>
          <Typed x={960} y={200} text="la pobreza" p={pr(t, a + 0.2, 0.6)} size={80} anchor="middle" />
          <text x={960} y={300} textAnchor="middle" fontFamily={MARK} fontSize={48} fill={V.inkSoft} opacity={eo(t, W(37, 'desagradable') - 0.2, 0.3)}>
            no solo desagradable…
          </text>
          <RedStamp x={1360} y={460} t={t} at={tMer} text="MERECIDA" size={90} />
        </g>
      ) : null}
      {manus > 0 ? (
        <g opacity={manus}>
          <Bg kind="news" />
          <Sheet x={960} y={540} w={1400} h={900} fill="#efe1bc">
            <rect x={-670} y={-420} width={1340} height={840} fill="none" stroke="#c99a3a" strokeWidth={12} />
            <rect x={-640} y={-390} width={1280} height={780} fill="none" stroke="#2f4a8a" strokeWidth={5} />
            <g transform="translate(-260 40)">
              <g transform={`rotate(${ang})`}>
                <circle r={300} fill="none" stroke="#5a3a1a" strokeWidth={20} />
                <circle r={300} fill="none" stroke="#c99a3a" strokeWidth={12} />
                {Array.from({length: 8}, (_, i) => {
                  const r = (i / 8) * Math.PI * 2;
                  return <path key={i} d={`M0 0 L${Math.cos(r) * 300} ${Math.sin(r) * 300}`} stroke="#5a3a1a" strokeWidth={8} />;
                })}
                <circle r={46} fill="#c99a3a" stroke="#5a3a1a" strokeWidth={4} />
              </g>
              {[0, 1, 2, 3].map((i) => {
                const r = ((ang + i * 90) * Math.PI) / 180;
                const top = Math.sin(r) < -0.5;
                return (
                  <g key={i} transform={`translate(${Math.cos(r) * 300} ${Math.sin(r) * 300}) scale(0.38)`}>
                    <PhotoPerson x={0} y={0} colors={{suit: ['#a8322a', '#2f4a8a', '#3f7a4a', '#c99a3a'][i], skin: '#e6c09a', hair: '#3a2416'}} suit={90} skin={170} hairTone={40} tie={false} hair="short" smile={top} sad={!top} hat={top} armR={[120, 10]} armL={[120, 10]} />
                  </g>
                );
              })}
            </g>
            <g opacity={eo(t, tGod - 0.4, 0.5)} transform="translate(330 360) scale(0.9)">
              <PhotoPerson x={0} y={0} dress hair="long" colors={{suit: '#2f4a8a', skin: '#ecc8a4', hair: '#c99a3a'}} suit={90} skin={170} hairTone={40} armR={[100, 10]} armL={[80, 10]} />
              <path d="M-26 -388 L26 -388" stroke="#a8322a" strokeWidth={10} />
            </g>
            <text x={330} y={-260} textAnchor="middle" fontFamily={GOTH} fontSize={82} fill="#7a1f1a" opacity={eo(t, tDes - 0.4, 0.5)}>
              Desafortunados
            </text>
            <Highlight x={110} y={-330} w={460} h={90} p={pr(t, tDes + 0.3, 0.6)} />
            <text x={330} y={-190} textAnchor="middle" fontFamily={MARK} fontSize={34} fill={V.red} opacity={eo(t, tGod + 0.3, 0.3)}>
              ← no bendecidos por la diosa Fortuna
            </text>
          </Sheet>
          <Tag x={1640} y={1030} text="Inglaterra medieval" dark anchor="end" />
        </g>
      ) : null}
      {map ? (
        <g opacity={eo(t, tNow - 0.3, 0.3)}>
          <Cam t={t} keys={[[tNow - 0.3, 960, 540, 1.15], [b, 960, 560, 1.0]]}>
            <Layer depth={0.4}>
              <Bg kind="news" />
            </Layer>
            <Layer depth={1}>
              <g transform="translate(420 260)">
                <path d={USA} fill="#d6d0c2" stroke={V.ink} strokeWidth={5} strokeLinejoin="round" filter="url(#paperShadow)" />
                <path d={USA} fill="url(#newsprint)" opacity={0.6} />
              </g>
              <text x={920} y={560} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={72} fill={V.ink} opacity={eo(t, tUS - 0.2, 0.3)}>
                ESTADOS UNIDOS
              </text>
              <text x={1180} y={200} fontFamily={MARK} fontSize={44} fill={V.red} opacity={eo(t, tUS + 0.9, 0.3)} transform="rotate(-5 1180 200)">
                «un país meritocrático»
              </text>
              <RedStamp x={920} y={720} t={t} at={tLos} text="PERDEDORES" size={110} rot={-8} />
            </Layer>
          </Cam>
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 16: el veredicto ─────────
const Box: React.FC = () => (
  <g>
    <path d="M-150 -60 L-130 -140 L-30 -110 L-40 -40 Z" fill="#6aa060" />
    <rect x={20} y={-160} width={90} height={110} fill="#9a9a9a" stroke="#4a4a4a" strokeWidth={6} />
    <path d="M-60 -60 L-60 -190 M-60 -190 C-90 -200 -110 -170 -100 -150 M-60 -170 C-30 -190 -10 -170 -20 -150" stroke="#4a4a4a" strokeWidth={8} fill="none" />
    <path d="M-180 -70 L180 -70 L160 120 L-160 120 Z" fill="#a8a8a8" />
    <path d="M-180 -70 L-220 -130 L-40 -130 L0 -70 Z" fill="#c0c0c0" />
    <path d="M180 -70 L220 -130 L40 -130 L0 -70 Z" fill="#8a8a8a" />
  </g>
);

export const Verdict: React.FC<SceneProps> = ({t, a, b}) => {
  const tFired = S(41);
  const tBad = W(41, 'mala suerte');
  const tPos = S(42);
  const tPosW = W(42, 'posición');
  const tVer = W(42, 'veredicto');
  const tChar = W(42, 'carácter');
  const roll = eo(t, a + 0.1, 1.2);
  const dice = phase(t, a - 1, tFired + 0.1);
  const box = phase(t, tFired - 0.2, tPos + 0.2);
  const cv = t > tPos - 0.3;
  const die = (x: number, y: number, rot: number, n: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-60} y={-60} width={120} height={120} rx={18} fill="#fbfaf5" stroke={V.ink} strokeWidth={4} filter="url(#paperShadow)" />
      {(n === 5 ? [[-28, -28], [28, -28], [0, 0], [-28, 28], [28, 28]] : [[-28, -28], [0, 0], [28, 28]]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={10} fill={V.ink} />
      ))}
    </g>
  );
  return (
    <g>
      {dice > 0 ? (
        <g opacity={dice}>
          <Bg kind="grid" />
          {die(lerp(-200, 820, roll), 480 - Math.abs(Math.sin(roll * 8)) * 120 * (1 - roll), roll * 600, 5)}
          {die(lerp(-100, 1080, roll), 520 - Math.abs(Math.sin(roll * 7 + 1)) * 100 * (1 - roll), roll * 470 + 20, 3)}
          <Typed x={960} y={760} text="la suerte" p={pr(t, a + 0.6, 0.6)} size={72} anchor="middle" />
          <Marker d="M790 740 L1130 732" p={pr(t, a + 2.2, 0.4)} w={10} />
          <text x={960} y={860} textAnchor="middle" fontFamily={MARK} fontSize={44} fill={V.red} opacity={eo(t, a + 2.6, 0.3)}>
            ya no la tomamos en serio
          </text>
        </g>
      ) : null}
      {box > 0 ? (
        <g opacity={box}>
          <Bg kind="paper" />
          <g transform="translate(760 640)">
            <Cutout>
              <Box />
            </Cutout>
          </g>
          <Sheet x={1340} y={420} w={560} h={150} rot={3}>
            <Typed x={-240} y={-10} text="despedido por" p={pr(t, tBad - 0.6, 0.5)} size={42} />
            <Typed x={-240} y={44} text="«mala suerte»" p={pr(t, tBad - 0.1, 0.5)} size={42} />
          </Sheet>
          <text x={1300} y={640} fontFamily={MARK} fontSize={56} fill={V.red} opacity={eo(t, tBad + 0.7, 0.3)} transform="rotate(-6 1300 640)">
            nadie te creerá
          </text>
        </g>
      ) : null}
      {cv ? (
        <g opacity={eo(t, tPos - 0.3, 0.3)}>
          <Cam t={t} keys={[[tPos - 0.3, 960, 540, 1.0], [tPosW, 960, 540, 1.0], [tPosW + 0.6, 920, 480, 1.12], [b, 940, 500, 1.08]]}>
            <Layer depth={0.4}>
              <Bg kind="paper" />
            </Layer>
            <Layer depth={1}>
              <Sheet x={860} y={540} w={760} h={960} rot={-2}>
                <text x={-320} y={-380} fontFamily={TYPE} fontSize={52} fill={V.ink}>
                  CURRÍCULUM
                </text>
                <path d="M-320 -350 L320 -350" stroke={V.ink} strokeWidth={2} />
                <text x={-320} y={-280} fontFamily={TYPE} fontSize={32} fill={V.inkSoft}>
                  Nombre: ____________________
                </text>
                <text x={-320} y={-200} fontFamily={TYPE} fontSize={36} fill={V.ink}>
                  Puesto: Gerente regional
                </text>
                {Array.from({length: 9}, (_, i) => (
                  <path key={i} d={`M-320 ${-120 + i * 52} L${200 - (i % 3) * 90} ${-120 + i * 52}`} stroke={V.grayLight} strokeWidth={4} />
                ))}
                <MarkerCircle cx={-70} cy={-212} rx={270} ry={46} p={pr(t, tPosW, 0.6)} />
              </Sheet>
              <MarkerArrow x0={1020} y0={320} x1={1200} y1={230} p={pr(t, tChar - 0.6, 0.5)} />
              <text x={1220} y={240} fontFamily={MARK} fontSize={76} fill={V.red} opacity={eo(t, tChar - 0.1, 0.3)}>
                = CARÁCTER
              </text>
              <RedStamp x={1100} y={820} t={t} at={tVer} text="VEREDICTO" size={96} rot={-12} />
            </Layer>
          </Cam>
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
  const line = eio(t, a + 0.5, 7);
  const toDots = eio(t, tPeople - 0.3, 1.2);
  const pts = Array.from({length: 60}, (_, i) => {
    const u = i / 59;
    return [300 + u * 1320, 840 - Math.pow(u, 2.3) * 520 - Math.sin(u * 19) * 6] as [number, number];
  });
  const shown = Math.floor(line * 59);
  const portrait = (k: number, at: number, label: string, children: React.ReactNode) => {
    const p = eo(t, at - 0.4, 0.8);
    if (p <= 0) return null;
    const x = 380 + k * 580;
    return (
      <g opacity={p} transform={`translate(0 ${(1 - p) * 40})`}>
        {children}
        <text x={x} y={960} textAnchor="middle" fontFamily={MARK} fontSize={48} fill={V.red}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <g>
      <Bg kind="grid" />
      <g opacity={1 - toDots}>
        <path d="M300 860 L1640 860 M300 860 L300 260" stroke={V.ink} strokeWidth={4} />
        <path d={pts.slice(0, shown + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={V.ink} strokeWidth={5} />
        <text x={1640} y={920} textAnchor="end" fontFamily={MARK} fontSize={40} fill={V.inkSoft} opacity={eo(t, tMod - 0.2, 0.4)}>
          hacia el «mundo moderno» →
        </text>
        <Tag x={1640} y={220} text="Ilustrativo · sin cifras" anchor="end" />
      </g>
      {/* la línea se descompone en personas */}
      {toDots > 0 && toDots < 1
        ? pts.filter((_, i) => i % 3 === 0).map(([x, y], i) => <circle key={i} cx={lerp(x, 380 + (i % 3) * 580, toDots)} cy={lerp(y, 560, toDots)} r={lerp(6, 2, toDots)} fill={V.ink} opacity={1 - toDots} />)
        : null}
      {portrait(
        0,
        tShame,
        'vergüenza',
        <g>
          <g transform="translate(380 840)">
            <Cutout>
              <rect x={-230} y={-500} width={460} height={500} fill="#a0a0a0" />
              <PhotoPerson x={-40} y={0} s={1.15} suit={80} hair="short" hairTone={40} sad sit armR={[80, 20]} holdR={<g><rect x={-10} y={-80} width={140} height={110} fill="#e8e8e8" /><path d="M0 -60 L110 -60 M0 -40 L110 -40 M0 -20 L80 -20" stroke="#6a6a6a" strokeWidth={5} /></g>} />
            </Cutout>
          </g>
        </g>,
      )}
      {portrait(
        1,
        tLie,
        'aparentar',
        <g transform="translate(960 840)">
          <Cutout>
            <rect x={-230} y={-500} width={460} height={500} fill="#b5b5b5" />
            <PhotoPerson x={0} y={0} s={1.15} suit={70} hair="bun" hairTone={30} dress sad armR={[150, -30]} />
            <g transform="translate(40 -446)">
              <ellipse rx={40} ry={48} fill="#f2f2f2" />
              <circle cx={-14} cy={-10} r={5} fill="#222" />
              <circle cx={14} cy={-10} r={5} fill="#222" />
              <path d="M-20 14 Q0 34 20 14" stroke="#222" strokeWidth={5} fill="none" />
            </g>
          </Cutout>
        </g>,
      )}
      {portrait(
        2,
        tBroken,
        'rotas… y reparables',
        <g transform="translate(1540 840)">
          <Cutout>
            <rect x={-230} y={-500} width={460} height={500} fill="#9a9a9a" />
            <PhotoPerson x={0} y={0} s={1.15} suit={110} hair="wavy" hairTone={120} skin={205} tie={false} sad armR={[40, 30]} armL={[40, 30]} />
          </Cutout>
          <Marker d="M-30 -330 L10 -270 L-10 -220 L30 -160" p={pr(t, tBroken + 0.4, 1.4)} color="#d4a72c" w={7} opacity={1} />
          <Marker d="M10 -420 L20 -396 L10 -376" p={pr(t, tBroken + 1.0, 0.8)} color="#d4a72c" w={6} opacity={1} />
        </g>,
      )}
    </g>
  );
};

// ───────── Escena 18: cartela «¿Cómo superarlo?» ─────────
export const HowCard: React.FC<SceneProps> = ({t, a}) => (
  <g>
    <Bg kind="yellow" />
    <ChapterCard t={t} at={a} dur={30} num="4." title="¿CÓMO SUPERARLO?" />
  </g>
);

export const _c = {Briefcase, MarkerArrow, Tape, PhotoPerson};
