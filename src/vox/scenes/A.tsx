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

export type SceneProps = {t: number; a: number; b: number};

// ───────── objetos «fotográficos» en grises (para semitono) ─────────
export const Glass = () => (
  <g transform="translate(0 -10)">
    <path d="M-12 -40 L12 -40 L9 -18 Q0 -8 -9 -18 Z" fill="#9a9a9a" />
    <path d="M-10 -40 L-4 -40 L-6 -20 Z" fill="#e6e6e6" />
    <path d="M0 -10 L0 8 M-9 9 L9 9" stroke="#6a6a6a" strokeWidth={3} />
  </g>
);
export const Briefcase = () => (
  <g>
    <rect x={-36} y={0} width={72} height={52} rx={5} fill="#4a4a4a" />
    <rect x={-36} y={0} width={72} height={14} fill="#6a6a6a" />
    <path d="M-12 0 L-12 -10 L12 -10 L12 0" stroke="#2a2a2a" strokeWidth={5} fill="none" />
  </g>
);
export const PhotoCar: React.FC<{s?: number}> = ({s = 1}) => (
  <g transform={`scale(${s})`}>
    <path d="M-200 -20 C-200 -60 -180 -70 -120 -78 L-70 -130 C-40 -150 60 -150 90 -130 L140 -82 C190 -78 210 -60 210 -20 L210 10 L-200 10 Z" fill="#7a7a7a" />
    <path d="M-60 -122 L-20 -122 L-20 -82 L-104 -82 Z M0 -122 L70 -122 L112 -82 L0 -82 Z" fill="#d8d8d8" />
    <path d="M-200 -40 L210 -40" stroke="#bdbdbd" strokeWidth={6} />
    <circle cx={-120} cy={10} r={42} fill="#262626" />
    <circle cx={130} cy={10} r={42} fill="#262626" />
    <circle cx={-120} cy={10} r={18} fill="#b0b0b0" />
    <circle cx={130} cy={10} r={18} fill="#b0b0b0" />
  </g>
);
export const PhotoWatch = () => (
  <g>
    <rect x={-22} y={-110} width={44} height={220} rx={10} fill="#5a5a5a" />
    <circle r={62} fill="#9a9a9a" />
    <circle r={50} fill="#eeeeee" />
    {Array.from({length: 12}, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return <path key={i} d={`M${Math.cos(a) * 40} ${Math.sin(a) * 40} L${Math.cos(a) * 46} ${Math.sin(a) * 46}`} stroke="#333" strokeWidth={3} />;
    })}
    <path d="M0 0 L0 -32 M0 0 L22 10" stroke="#222" strokeWidth={4} strokeLinecap="round" />
  </g>
);
export const PhotoHouse = () => (
  <g>
    <path d="M-150 0 L-150 -150 L0 -250 L150 -150 L150 0 Z" fill="#b8b8b8" />
    <path d="M-170 -140 L0 -262 L170 -140" stroke="#4a4a4a" strokeWidth={18} fill="none" />
    <rect x={-30} y={-90} width={60} height={90} fill="#4a4a4a" />
    <rect x={-120} y={-120} width={60} height={50} fill="#e8e8e8" stroke="#666" strokeWidth={4} />
    <rect x={60} y={-120} width={60} height={50} fill="#e8e8e8" stroke="#666" strokeWidth={4} />
  </g>
);
export const PhotoTV = () => (
  <g>
    <rect x={-120} y={-170} width={240} height={190} rx={22} fill="#6a6a6a" />
    <rect x={-96} y={-150} width={170} height={130} rx={18} fill="#d0d0d0" />
    <circle cx={96} cy={-120} r={9} fill="#2a2a2a" />
    <circle cx={96} cy={-90} r={9} fill="#2a2a2a" />
    <path d="M-80 20 L-100 70 M80 20 L100 70 M-20 -170 L-60 -230 M20 -170 L60 -230" stroke="#3a3a3a" strokeWidth={6} />
  </g>
);
export const MoneyStack = () => (
  <g>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${(i % 2) * 6} ${-i * 20})`}>
        <rect x={-80} y={-18} width={160} height={36} fill="#a8a8a8" />
        <rect x={-80} y={-18} width={160} height={36} fill="none" stroke="#5a5a5a" strokeWidth={3} />
        <circle cx={0} cy={0} r={11} fill="#6a6a6a" />
      </g>
    ))}
  </g>
);

// ───────── Escena 1: la pregunta ─────────
export const PartyPhoto: React.FC = () => (
  <g>
    <rect x={-470} y={-300} width={940} height={600} fill="#9b9b9b" />
    <rect x={-470} y={120} width={940} height={180} fill="#6e6e6e" />
    <rect x={160} y={-250} width={220} height={250} fill="#e2e2e2" />
    <path d="M270 -250 L270 0 M160 -125 L380 -125" stroke="#7a7a7a" strokeWidth={8} />
    <ellipse cx={-280} cy={-230} rx={120} ry={30} fill="#c8c8c8" />
    <g transform="translate(0 290)">
      <PhotoPerson x={-330} y={0} s={0.82} suit={70} hair="bun" hairTone={50} dress skin={180} armR={[150, 30]} holdR={<Glass />} smile look={0.6} />
      <PhotoPerson x={-170} y={0} s={0.86} suit={45} hair="short" hairTone={30} armL={[20, 10]} armR={[30, 100]} holdR={<Glass />} look={-0.4} />
      <PhotoPerson x={20} y={0} s={0.9} suit={95} hair="wavy" hairTone={35} dress skin={190} armR={[25, 110]} holdR={<Glass />} smile look={0.5} />
      <PhotoPerson x={200} y={0} s={0.88} suit={40} hair="bald" hairTone={70} armR={[30, 100]} holdR={<Glass />} look={-0.7} />
      <PhotoPerson x={360} y={0} s={0.84} suit={110} hair="curly" hairTone={30} skin={120} smile look={-0.3} />
    </g>
  </g>
);

export const Question: React.FC<SceneProps & {strike?: boolean}> = ({t, a, b, strike}) => {
  const q = strike ? W(54, '¿a') : S(1);
  const typeP = pr(t, (strike ? S(53) + 0.5 : a + 0.6), strike ? 0.9 : 1.2);
  const hl = pr(t, q, 0.5);
  return (
    <Cam t={t} keys={[[a, 960, 540, 1.0], [b, 960, 500, 1.1]]}>
      <Layer depth={0.3}>
        <Bg kind="grid" />
      </Layer>
      <Layer depth={0.7}>
        <g transform="translate(900 470) rotate(-3)">
          <Cutout noBorder={false}>
            <PartyPhoto />
          </Cutout>
          <Tape x={-430} y={-290} rot={-30} />
          <Tape x={430} y={-290} rot={28} />
        </g>
      </Layer>
      <Layer depth={1.3}>
        <g transform="translate(1180 850) rotate(2)">
          <Sheet x={0} y={0} w={760} h={130}>
            <Highlight x={-330} y={-38} w={640} h={70} p={hl} />
            <Typed x={-320} y={20} text="¿A qué te dedicas?" p={typeP} size={64} caret />
          </Sheet>
          {strike ? (
            <>
              <Marker d="M-340 4 C-100 -6 120 10 340 -2" p={pr(t, q + 0.5, 0.4)} w={10} />
              <text x={0} y={140} textAnchor="middle" fontFamily={MARK} fontSize={64} fill={V.red} opacity={eo(t, q + 0.9, 0.3)} transform={`rotate(-3)`}>
                ¿Quién eres?
              </text>
            </>
          ) : null}
        </g>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 2: la gráfica de la cortesía ─────────
const JOBS = ['cajero', 'maestra', 'abogada', 'directora'];
export const Courtesy: React.FC<SceneProps> = ({t, a, b}) => {
  const tImp = W(2, 'impresionante');
  const tKnow = W(2, 'conocerte');
  const tAside = W(2, 'dejarte');
  const axes = eo(t, a + 0.1, 0.8);
  const curve = eio(t, tImp - 0.4, 1.4);
  const X0 = 400, X1 = 1560, Y0 = 860, Y1 = 260;
  const cy = (u: number) => Y0 - (Y1 - Y0) * -1 * Math.pow(u, 2.2) * 0.9 - 40;
  const pts = Array.from({length: 50}, (_, i) => {
    const u = i / 49;
    return `${i ? 'L' : 'M'}${lerp(X0, X1, u)} ${cy(u)}`;
  }).join(' ');
  const dots = Array.from({length: 26}, (_, i) => {
    const r1 = Math.sin(i * 12.9) * 0.5 + 0.5;
    const r2 = Math.sin(i * 78.2) * 0.5 + 0.5;
    const home: [number, number] = [lerp(X0 + 60, X1 - 60, r1), lerp(Y0 - 60, Y1 + 80, r2)];
    const target: [number, number] = [X1 - 40 - r1 * 220 + Math.sin(i) * 30, Y1 + 40 + r2 * 160];
    return {home, target, i};
  });
  const gather = eio(t, tKnow - 0.6, 1.6);
  const leave = eio(t, tAside - 0.2, 1.4);
  const camK = eio(t, tAside, 1.2);
  return (
    <Cam t={t} keys={[[a, 980, 560, 1.0], [tAside, 980, 560, 1.0], [tAside + 1.4, 560, 760, 1.5]]}>
      <Layer depth={0.4}>
        <Bg kind="grid" />
      </Layer>
      <Layer depth={1}>
        <Marker d={`M${X0} ${Y1 - 40} L${X0} ${Y0} L${X1 + 40} ${Y0}`} p={axes} color={V.ink} w={4} />
        <text x={X0 - 30} y={Y1 - 60} fontFamily={HEAD} fontWeight={600} fontSize={40} fill={V.ink} opacity={axes}>
          INTERÉS DE LOS DEMÁS ↑
        </text>
        <text x={X1 + 40} y={Y0 + 110} textAnchor="end" fontFamily={HEAD} fontWeight={600} fontSize={40} fill={V.ink} opacity={axes}>
          PRESTIGIO DE TU RESPUESTA →
        </text>
        {JOBS.map((j, i) => {
          const x = lerp(X0 + 120, X1 - 80, i / 3);
          return (
            <g key={j}>
              {j === 'directora' ? <Highlight x={x - 80} y={Y0 + 18} w={160} h={44} p={pr(t, tKnow, 0.5)} /> : null}
              <Typed x={x} y={Y0 + 52} text={j} p={pr(t, a + 0.5 + i * 0.25, 0.4)} size={34} anchor="middle" />
            </g>
          );
        })}
        <path d={pts} fill="none" stroke={V.ink} strokeWidth={5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - curve} />
        {dots.map(({home, target, i}) => {
          const isOut = i === 7;
          let [x, y] = [lerp(home[0], target[0], gather), lerp(home[1], target[1], gather)];
          if (isOut) {
            x = lerp(X0 + 110, X0 - 260, leave);
            y = lerp(Y0 - 70, Y0 + 260, leave * leave);
          }
          return <circle key={i} cx={x} cy={y} r={isOut ? 15 : 12} fill={isOut ? V.red : V.ink} opacity={eo(t, a + 0.3 + i * 0.03, 0.3)} />;
        })}
        <text x={X0 - 200} y={Y0 + 180} fontFamily={MARK} fontSize={40} fill={V.red} opacity={eo(t, tAside + 0.6, 0.4)} transform={`rotate(-4 ${X0 - 200} ${Y0 + 180})`}>
          «dejado de lado»
        </text>
        <Tag x={X1 + 40} y={200} text="Gráfico ilustrativo" anchor="end" p={eo(t, a + 1, 0.5) * (1 - camK)} />
      </Layer>
    </Cam>
  );
};

// ───────── Escena 3: el mundo de los engreídos ─────────
export const Snobs: React.FC<SceneProps> = ({t, a, b}) => {
  const tPart = W(3, 'pequeña parte');
  const tId = W(3, 'identidades');
  const tVer = W(3, 'veredicto');
  const frameIn = eio(t, tPart - 0.3, 0.8);
  const fadeRest = eo(t, tId + 0.4, 0.8);
  const formIn = eio(t, tVer - 1.4, 0.8);
  const fx = 960, fy = 560;
  const [vx, vy, vw, vh] = [lerp(560, 860, frameIn), lerp(160, 560, frameIn), lerp(800, 220, frameIn), lerp(860, 260, frameIn)];
  const bracket = (x: number, y: number, sx: number, sy: number) => <path d={`M${x} ${y + sy * 40} L${x} ${y} L${x + sx * 40} ${y}`} stroke={V.red} strokeWidth={7} fill="none" strokeLinecap="square" />;
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 540, 1.0], [tVer - 1.4, 960, 560, 1.06], [tVer - 0.4, 1240, 560, 1.06], [b, 1260, 560, 1.12]]}>
        <Layer depth={0.3}>
          <Bg kind="news" />
        </Layer>
        <Layer depth={0.8}>
          <defs>
            <clipPath id="vfClip">
              <rect x={vx} y={vy} width={vw} height={vh} />
            </clipPath>
          </defs>
          <g opacity={1 - fadeRest * 0.85}>
            <Cutout>
              <PhotoPerson x={fx} y={fy + 440} s={1.15} suit={55} hair="short" hairTone={35} armL={[8, 4]} armR={[6, 12]} holdR={<Briefcase />} look={0.2} />
            </Cutout>
          </g>
          <g clipPath="url(#vfClip)" opacity={fadeRest}>
            <Cutout noBorder>
              <PhotoPerson x={fx} y={fy + 440} s={1.15} suit={55} hair="short" hairTone={35} armL={[8, 4]} armR={[6, 12]} holdR={<Briefcase />} look={0.2} />
            </Cutout>
          </g>
          {frameIn > 0 ? (
            <g opacity={frameIn}>
              {bracket(vx, vy, 1, 1)}
              {bracket(vx + vw, vy, -1, 1)}
              {bracket(vx, vy + vh, 1, -1)}
              {bracket(vx + vw, vy + vh, -1, -1)}
              <circle cx={vx + 26} cy={vy + 26} r={8} fill={V.red} opacity={Math.sin(t * 8) > 0 ? 1 : 0.2} />
            </g>
          ) : null}
          <Tag x={vx} y={vy + vh + 50} text="identidad profesional" dark p={eo(t, tId, 0.4)} />
          <text x={vx + vw + 40} y={vy - 30} fontFamily={MARK} fontSize={40} fill={V.red} opacity={eo(t, tId + 1.2, 0.4) * (1 - formIn)}>
            ¿y el resto?
          </text>
        </Layer>
        <Layer depth={1.25}>
          <g transform={`translate(${lerp(2300, 1300, formIn)} 560) rotate(${lerp(8, 3, formIn)})`}>
            <Sheet x={0} y={0} w={560} h={700}>
              <text x={0} y={-270} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={V.ink}>
                FORMULARIO DE EVALUACIÓN
              </text>
              <path d="M-230 -244 L230 -244" stroke={V.ink} strokeWidth={2} />
              {['Nombre: ____________', 'Ocupación: __________', 'Ingresos: ___________'].map((l, i) => (
                <text key={i} x={-220} y={-180 + i * 60} fontFamily={TYPE} fontSize={28} fill={V.inkSoft}>
                  {l}
                </text>
              ))}
              <Highlight x={-226} y={-20} w={460} h={48} p={pr(t, tVer - 0.3, 0.5)} />
              <text x={-220} y={14} fontFamily={TYPE} fontSize={30} fill={V.ink}>
                ¿Valioso como ser humano?
              </text>
              {['Sí', 'No'].map((l, i) => (
                <g key={l} transform={`translate(${-160 + i * 220} 110)`}>
                  <rect x={-24} y={-26} width={40} height={40} fill="none" stroke={V.ink} strokeWidth={3} />
                  <text x={34} y={6} fontFamily={TYPE} fontSize={32} fill={V.ink}>
                    {l}
                  </text>
                </g>
              ))}
              <Marker d="M46 90 L66 116 L112 54" p={pr(t, tVer + 0.05, 0.35)} w={10} />
              <MarkerCircle cx={-160} cy={-126} rx={150} ry={34} p={pr(t, tVer + 0.9, 0.6)} />
              <text x={-60} y={250} fontFamily={MARK} fontSize={34} fill={V.red} opacity={eo(t, tVer + 1.4, 0.4)} transform="rotate(-4)">
                ← lo único que miran
              </text>
            </Sheet>
          </g>
        </Layer>
      </Cam>
      <ChapterCard t={t} at={a} num="1." title="EL JUICIO" />
    </g>
  );
};

// ───────── Escena 4: tu madre, y los demás ─────────
const Portrait: React.FC<{x: number; y: number; i: number}> = ({x, y, i}) => (
  <g>
    <defs>
      <clipPath id={`pt${i}`}>
        <rect x={x - 62} y={y - 78} width={124} height={156} />
      </clipPath>
    </defs>
    <rect x={x - 62} y={y - 78} width={124} height={156} fill={['#9a9a9a', '#b5b5b5', '#8a8a8a', '#a5a5a5'][i % 4]} />
    <g clipPath={`url(#pt${i})`}>
      <PhotoPerson
        x={x}
        y={y - 20 + 382 * 0.72}
        s={0.72}
        suit={40 + ((i * 37) % 90)}
        hair={(['short', 'bun', 'bald', 'wavy', 'curly', 'long'] as const)[i % 6]}
        hairTone={20 + ((i * 23) % 70)}
        skin={120 + ((i * 29) % 80)}
        look={i % 2 ? 0.5 : -0.5}
        dress={i % 3 === 1}
        tie={i % 3 === 0}
      />
    </g>
  </g>
);

export const Mother: React.FC<SceneProps> = ({t, a, b}) => {
  const tOut = S(6);
  const tJ = W(7, 'juicio');
  const tH = W(7, 'humillación');
  const cells: [number, number][] = [];
  for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) if (!(r >= 1 && r <= 3 && c >= 3 && c <= 5)) cells.push([170 + c * 197, 130 + r * 205]);
  return (
    <Cam t={t} keys={[[a, 960, 540, 2.0], [tOut - 0.2, 960, 540, 2.15], [tOut + 1.6, 960, 540, 1.0], [b, 960, 540, 0.96]]}>
      <Layer depth={0.3}>
        <Bg kind="paper" />
      </Layer>
      <Layer depth={0.8}>
        {/* anuario de miradas */}
        <g opacity={eo(t, tOut, 0.6)}>
          <Cutout fine>
            {cells.map(([x, y], i) => (
              <Portrait key={i} x={x} y={y} i={i} />
            ))}
          </Cutout>
          {cells.map(([x, y], i) => {
            const p = pr(t, tOut + 0.6 + i * 0.05, 0.25);
            return <Highlight key={i} x={x - 26} y={y - 30} w={52} h={15} p={p} />;
          })}
        </g>
      </Layer>
      <Layer depth={1}>
        {/* la única foto a color */}
        <g transform="translate(960 540) rotate(-2)">
          <defs>
            <clipPath id="kodakClip">
              <rect x={-250} y={-200} width={500} height={400} />
            </clipPath>
          </defs>
          <g filter="url(#kodak)">
            <g clipPath="url(#kodakClip)">
            <rect x={-250} y={-200} width={500} height={400} fill="#c99c6a" />
            <rect x={-250} y={60} width={500} height={140} fill="#8a5a3a" />
            <rect x={110} y={-170} width={110} height={150} fill="#f0d9a0" />
            <g transform="translate(0 300)">
              <PhotoPerson x={-50} y={0} s={0.9} hair="bun" dress smile colors={{suit: '#b5523b', skin: '#e5b994', hair: '#8a6a50'}} suit={100} skin={170} hairTone={90} armR={[70, 70]} armL={[40, 20]} look={0.6} />
              <PhotoPerson x={80} y={0} s={1.0} child hair="curly" smile colors={{suit: '#3f6f8f', skin: '#e0b08a', hair: '#3a2416', shirt: '#f0e6d2'}} suit={90} skin={170} hairTone={40} tie={false} armL={[60, 60]} look={-0.6} />
            </g>
            </g>
          </g>
          <Tape x={-230} y={-200} rot={-35} />
          <Tape x={230} y={190} rot={-35} />
          <Marker d="M0 -120 C-60 -200 -190 -150 -150 -40 C-120 40 -30 90 0 140 C30 90 120 40 150 -40 C190 -150 60 -200 0 -120" p={pr(t, S(5), 1.0)} w={7} />
        </g>
      </Layer>
      <Layer depth={1.3}>
        <g opacity={eo(t, tJ - 0.2, 0.3)}>
          <Sheet x={960} y={930} w={760} h={110} rot={1}>
            <Highlight x={-320} y={-30} w={220} h={56} p={pr(t, tJ, 0.4)} />
            <Highlight x={10} y={-30} w={320} h={56} p={pr(t, tH, 0.4)} />
            <text x={-300} y={14} fontFamily={TYPE} fontSize={46} fill={V.ink}>
              juicio
            </text>
            <text x={-90} y={14} fontFamily={TYPE} fontSize={46} fill={V.inkSoft}>
              y
            </text>
            <text x={30} y={14} fontFamily={TYPE} fontSize={46} fill={V.ink}>
              humillación
            </text>
          </Sheet>
        </g>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 5: catálogo → tablero de corcho ─────────
const ITEMS: [number, number, React.ReactNode, string, number][] = [
  [470, 430, <PhotoCar key="c" s={0.85} />, '$2.499', 0.1],
  [1430, 400, <PhotoHouse key="h" />, '$18.900', 0.5],
  [560, 820, <PhotoWatch key="w" />, '$129', 0.9],
  [1320, 830, <PhotoTV key="tv" />, '$349', 1.3],
];
const NOTES: [number, number, string][] = [
  [960, 260, 'admiración'],
  [960, 560, 'pertenencia'],
  [960, 860, 'seguridad'],
];

export const Catalog: React.FC<SceneProps> = ({t, a, b}) => {
  const tEmo = W(9, 'recompensas');
  const cork = eio(t, tEmo - 0.8, 0.8);
  return (
    <Cam t={t} keys={[[a, 960, 540, 1.0], [tEmo - 0.8, 960, 540, 1.05], [tEmo + 1, 700, 520, 1.2], [b, 1200, 560, 1.15]]}>
      <Layer depth={0.4}>
        <Bg kind="news" />
        <rect x={-1200} y={-1200} width={4320} height={3480} fill={V.cork} opacity={cork} />
        {cork > 0
          ? Array.from({length: 140}, (_, i) => <circle key={i} cx={(i * 197) % 2200 - 100} cy={(i * 131) % 1300 - 100} r={2 + (i % 3)} fill="#a5794c" opacity={cork * 0.6} />)
          : null}
      </Layer>
      <Layer depth={0.9}>
        <g opacity={1 - cork}>
          <text x={960} y={140} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={72} fill={V.ink}>
            Catálogo de primavera
          </text>
          <path d="M360 170 L1560 170 M360 180 L1560 180" stroke={V.ink} strokeWidth={2} />
          <text x={960} y={1030} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={V.inkSoft}>
            «una época materialista»
          </text>
        </g>
        {ITEMS.map(([x, y, el, price, d], i) => {
          const p = pop(t, a + d, 0.45);
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${p}) rotate(${(i % 2 ? 2 : -3) * cork})`}>
              <Cutout>{el}</Cutout>
              <g transform="translate(110 70) rotate(-8)" opacity={1 - cork}>
                <rect x={-70} y={-28} width={140} height={52} fill="#fbfaf5" stroke={V.ink} strokeWidth={2} />
                <text y={10} textAnchor="middle" fontFamily={TYPE} fontSize={30} fill={V.ink}>
                  {price}
                </text>
              </g>
              {cork > 0 ? <circle cx={0} cy={-120} r={13} fill={V.red} stroke="#7a1a12" strokeWidth={2} opacity={cork} /> : null}
            </g>
          );
        })}
        {/* hilos rojos */}
        {cork > 0
          ? ITEMS.map(([x, y], i) => {
              const n = NOTES[i % 3];
              const p = eo(t, tEmo + 0.2 + i * 0.35, 0.6);
              return <path key={i} d={`M${x} ${y - 120} Q${(x + n[0]) / 2} ${(y + n[1]) / 2 + 60} ${n[0]} ${n[1]}`} fill="none" stroke={V.red} strokeWidth={3.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
            })
          : null}
        {NOTES.map(([x, y, label], i) => {
          const p = pop(t, tEmo + 0.1 + i * 0.4, 0.45);
          if (p <= 0) return null;
          return (
            <g key={i} transform={`translate(${x} ${y}) rotate(${[-4, 3, -2][i]}) scale(${p})`}>
              <rect x={-130} y={-70} width={260} height={140} fill={V.yellow} filter="url(#paperShadow)" />
              <text y={14} textAnchor="middle" fontFamily={MARK} fontSize={40} fill={V.ink}>
                {label}
              </text>
              <circle cx={0} cy={-58} r={11} fill={V.red} />
            </g>
          );
        })}
      </Layer>
      <Layer depth={1.2}>
        <g opacity={eo(t, W(9, 'bienes'), 0.4)}>
          <Sheet x={960} y={980} w={1100} h={90} rot={-1}>
            <Typed x={0} y={14} text="recompensas emocionales  ↔  bienes materiales" p={pr(t, W(9, 'bienes'), 0.9)} size={36} anchor="middle" />
          </Sheet>
        </g>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 6: el iceberg ─────────
export const Iceberg: React.FC<SceneProps> = ({t, a, b}) => {
  const tDive = W(10, 'rara vez');
  const tAtt = W(10, 'atención');
  const tResp = W(10, 'respeto');
  const tLove = W(10, 'amor');
  const WL = 560;
  return (
    <Cam t={t} keys={[[a, 960, 470, 1.0], [tDive - 0.3, 960, 470, 1.04], [tDive + 1.6, 960, 1180, 1.0], [b, 960, 1240, 0.94]]}>
      <Layer depth={1}>
        <rect x={-1200} y={-1200} width={4320} height={1200 + WL} fill={V.paper} />
        <rect x={-1200} y={WL} width={4320} height={2400} fill={V.blue} />
        <rect x={-1200} y={WL + 500} width={4320} height={2000} fill={V.blueDeep} opacity={0.7} />
        {/* parte oculta, mucho mayor */}
        <path d="M700 560 L560 760 L470 1080 L560 1420 L780 1680 L1120 1720 L1380 1500 L1480 1160 L1400 820 L1250 560 Z" fill="#cfe3ea" />
        <path d="M960 560 L860 900 L980 1300 L1120 1720 L1380 1500 L1480 1160 L1400 820 L1250 560 Z" fill="#b2cfd9" />
        {/* la punta visible */}
        <path d="M760 560 L860 380 L940 300 L1030 360 L1120 450 L1200 560 Z" fill="#f5fafb" stroke={V.ink} strokeWidth={3} />
        <path d={`M-1200 ${WL} L3120 ${WL}`} stroke="#fbfaf5" strokeWidth={6} />
        {[...Array(9)].map((_, i) => (
          <path key={i} d={`M${100 + i * 220} ${WL + 20 + (i % 3) * 8} q20 -8 40 0`} stroke="#9fc3d0" strokeWidth={3} fill="none" />
        ))}
        {/* lo que compramos, en la punta */}
        <g transform="translate(860 330) scale(0.42)">
          <Cutout>
            <MoneyStack />
          </Cutout>
        </g>
        <g transform="translate(1000 280) scale(0.9)">
          <Cutout>
            <Briefcase />
          </Cutout>
        </g>
        <g transform="translate(1100 420) scale(0.32)">
          <Cutout>
            <PhotoCar />
          </Cutout>
        </g>
        {['dinero', 'un gran trabajo', 'autos de lujo'].map((l, i) => (
          <Typed key={l} x={1260} y={260 + i * 60} text={l} p={pr(t, a + 0.6 + i * 0.6, 0.5)} size={38} />
        ))}
        <text x={1260} y={190} fontFamily={HEAD} fontWeight={800} fontSize={44} fill={V.ink} opacity={eo(t, a + 0.3, 0.4)}>
          LO QUE BUSCAMOS…
        </text>
        <text x={120} y={700} fontFamily={HEAD} fontWeight={800} fontSize={48} fill="#fbfaf5" opacity={eo(t, tDive + 1.2, 0.5)}>
          …LO QUE QUEREMOS DE VERDAD
        </text>
        {[
          ['atención', tAtt, 980],
          ['respeto', tResp, 1160],
          ['«amor»', tLove, 1380],
        ].map(([l, at, y], i) => (
          <g key={i}>
            {i === 2 ? <Highlight x={800} y={(y as number) - 64} w={330} h={84} p={pr(t, (at as number) + 0.3, 0.5)} /> : null}
            <Typed x={820} y={y as number} text={l as string} p={pr(t, (at as number) - 0.1, 0.5)} size={i === 2 ? 76 : 60} color={V.blueDeep} />
          </g>
        ))}
        <MarkerArrow x0={1560} y0={1480} x1={1300} y1={1380} p={pr(t, tLove + 0.6, 0.6)} color={V.yellow} />
      </Layer>
    </Cam>
  );
};

export const _a = {clamp, settle, SANS};
