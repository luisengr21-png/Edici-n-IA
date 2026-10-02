import React from 'react';
import {S, W} from '../../estatus/timing';
import {ICONS} from '../../motion/kit';
import {
  Cam,
  Card,
  clamp,
  Dust,
  eio,
  Embers,
  EmberText,
  eo,
  Figure,
  Fog,
  Halo,
  handPos,
  hash,
  INK,
  Lantern,
  Layer,
  lerp,
  mix,
  Moon,
  phase,
  pr,
  Rays,
  Ridge,
  Skyline,
  Sky,
  Stars,
  Verse,
  wobble,
} from '../kit';

export type SceneProps = {t: number; a: number; b: number};

const Glass = () => <path d="M-8 -26 L8 -26 L5 -10 L0 -6 L-5 -10 Z M-1 -6 L-1 8 L-6 10 L6 10 L1 8 L1 -6" fill={INK} />;

// ───────── Escena 1: la luna y la pregunta ─────────
export const MoonPlain: React.FC<SceneProps> = ({t, a, b}) => {
  const q = S(1);
  const rise = eio(t, a, 6);
  const moonY = lerp(700, 460, rise);
  const moonC = mix('#F3D9B0', '#EEF0F6', rise);
  return (
    <Cam t={t} keys={[[a, 900, 600, 1.0], [b, 850, 650, 1.14]]}>
      <Layer depth={0.15}>
        <Sky id="s1" stops={[[0, '#020309'], [0.45, '#0B1130'], [0.78, '#1D2856'], [1, '#2C3A6C']]} />
        <Stars t={t} n={200} y1={650} />
        <Moon x={1260} y={moonY} r={250} color={moonC} />
      </Layer>
      <Layer depth={0.3}>
        <Ridge seed={7} y={740} amp={110} color="#1C2450" />
      </Layer>
      <Layer depth={0.4}>
        <Ridge seed={1} y={770} amp={70} color="#141B3A" />
        <Fog y={790} h={180} color="#40508A" opacity={0.35} />
      </Layer>
      <Layer depth={0.7}>
        <Ridge seed={2} y={830} amp={22} color="#0B0F22" />
      </Layer>
      <Layer depth={1}>
        <Ridge seed={3} y={862} amp={5} rough={0.4} color={INK} />
        <Figure x={820} y={862} s={0.3} face={1} armF={[38, 30]} rim={{color: '#C9D4F0', dx: 1.2, dy: -0.6, opacity: 0.8}} hold={<Card x={0} y={0} s={2.4} glow={1.4} />} />
        <Embers t={t} t0={q - 0.6} n={34} x={640} y={760} spread={900} />
        <Dust t={t} n={30} opacity={0.25} />
      </Layer>
      <EmberText x={640} y={440} text="¿A qué te dedicas?" t={t} at={q - 0.15} size={84} rise={4} />
    </Cam>
  );
};

// ───────── Escena 2: la terraza de las linternas ─────────
const CROWD = [
  [260, 0.86, 1, 'short'],
  [400, 0.92, -1, 'bun'],
  [540, 0.84, 1, 'long'],
  [690, 0.95, 1, 'short'],
  [830, 0.88, -1, 'bun'],
  [980, 0.92, 1, 'short'],
  [1120, 0.86, -1, 'long'],
  [1260, 0.94, 1, 'short'],
] as const;

export const Terrace: React.FC<SceneProps> = ({t, a, b}) => {
  const tImp = W(2, 'impresionante');
  const tKnow = W(2, 'conocerte');
  const tAside = W(2, 'dejarte');
  const lowered = eio(t, tAside - 0.2, 0.8);
  return (
    <Cam t={t} keys={[[a, 880, 560, 1.0], [b, 1000, 560, 1.06]]}>
      <Layer depth={0.2}>
        <Sky id="s2" stops={[[0, '#04060F'], [0.6, '#111A3A'], [1, '#283464']]} />
        <Stars t={t} n={110} y1={420} opacity={0.6} />
      </Layer>
      <Layer depth={0.45}>
        <Skyline seed={5} y={780} color="#18203F" win="#F2C879" winP={0.12} t={t} />
        <Fog y={770} h={120} color="#3A4778" opacity={0.3} />
      </Layer>
      <Layer depth={1}>
        {CROWD.map(([x, s, face, hair], i) => {
          const on = eo(t, tImp - 0.1 + i * 0.13, 0.5) * (1 - eo(t, tAside - 0.1 + i * 0.09, 0.35));
          const turned = t > tAside + 0.25 + i * 0.06 ? -1 : t > tImp + 0.3 + i * 0.05 ? 1 : face;
          const headY = 930 - 360 * s;
          return (
            <g key={i}>
              <Lantern x={x + 8} y={headY - 120} s={1.2} on={on} sway={Math.sin(t * 1.2 + i) * 4} />
              <Figure x={x} y={930} s={s} face={turned as 1 | -1} hair={hair as 'short'} dress={hair !== 'short'} armF={[22, 100]} hold={<Glass />} />
            </g>
          );
        })}
        {/* barandilla */}
        <rect x={-300} y={820} width={2500} height={14} fill={INK} />
        {Array.from({length: 46}, (_, i) => (
          <rect key={i} x={-300 + i * 56} y={834} width={12} height={100} fill={INK} />
        ))}
        <rect x={-300} y={930} width={2500} height={400} fill={INK} />
        {/* protagonista con la tarjeta en alto */}
        <Figure
          x={1540}
          y={930}
          s={1.05}
          face={-1}
          armF={[lerp(150, 20, lowered), lerp(10, 20, lowered)]}
          rim={{color: '#F2C879', dx: -1.5, dy: 0, opacity: 0.5 * (1 - lowered)}}
          hold={<Card x={0} y={0} s={2} glow={lerp(1.6, 0.5, lowered)} />}
        />
      </Layer>
      <Verse x={960} y={250} text="estarán más dispuestos a conocerte…" t={t} at={tKnow - 0.4} out={tAside - 0.4} size={50} />
      <Verse x={960} y={250} text="…o a dejarte de lado" t={t} at={tAside - 0.1} size={50} color="#C9D3F2" />
    </Cam>
  );
};

// ───────── Escena 3: los gigantes con focos ─────────
const Lamp: React.FC<{col?: string}> = ({col = '#04070A'}) => (
  <g>
    <rect x={-4} y={-12} width={30} height={24} rx={4} fill={col} />
    <rect x={2} y={-18} width={14} height={6} rx={2} fill={col} />
    <ellipse cx={27} cy={0} rx={4} ry={11} fill="#EAF6FF" />
  </g>
);
const Beam: React.FC<{id: string; ox: number; oy: number; tx: number; ty: number; w: number; o?: number}> = ({id, ox, oy, tx, ty, w, o = 1}) => {
  const ang = Math.atan2(ty - oy, tx - ox);
  const nx = -Math.sin(ang);
  const ny = Math.cos(ang);
  return (
    <g opacity={o}>
      <defs>
        <linearGradient id={id} gradientUnits="userSpaceOnUse" x1={ox} y1={oy} x2={tx} y2={ty}>
          <stop offset="0" stopColor="#EAF6FF" stopOpacity="0.6" />
          <stop offset="1" stopColor="#EAF6FF" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <path d={`M${ox + nx * 9} ${oy + ny * 9} L${tx + nx * w} ${ty + ny * w} L${tx - nx * w} ${ty - ny * w} L${ox - nx * 9} ${oy - ny * 9} Z`} fill={`url(#${id})`} />
      <path d={`M${ox + nx * 20} ${oy + ny * 20} L${tx + nx * w * 2} ${ty + ny * w * 2} L${tx - nx * w * 2} ${ty - ny * w * 2} L${ox - nx * 20} ${oy - ny * 20} Z`} fill={`url(#${id})`} opacity={0.25} />
      <ellipse cx={tx} cy={ty + 4} rx={w * 1.3} ry={w * 0.26} fill="#EAF6FF" opacity={0.28} />
    </g>
  );
};

export const Giants: React.FC<SceneProps> = ({t, a, b}) => {
  const tSnob = W(3, 'engreídos');
  const tPart = W(3, 'pequeña parte');
  const tId = W(3, 'identidades');
  const tVer = W(3, 'veredicto');
  const conv = eio(t, tPart - 0.5, 1.2);
  const vanish = eo(t, tId, 1.2);
  const crack = eo(t, tVer + 0.05, 0.9);
  const px = 960;
  const py = 905;
  const ARM: [number, number] = [92, -8];
  const front = [
    {x: 230, face: 1 as const},
    {x: 1700, face: -1 as const},
  ];
  const back = [
    {x: 560, face: 1 as const},
    {x: 1400, face: -1 as const},
  ];
  const beam = (i: number, gx: number, gy: number, s: number, face: 1 | -1, w0: number, tyBase: number) => {
    const h = handPos(gx, gy, s, face, ARM);
    const ox = h.x + face * 27 * s;
    const oy = h.y;
    const sweep = px + Math.sin(t * 0.7 + i * 2.1) * 560;
    const tx = lerp(sweep, px, conv);
    const ty = lerp(tyBase + Math.cos(t * 0.5 + i) * 30, py - 10, conv);
    return <Beam key={`b${i}`} id={`beam${i}`} ox={ox} oy={oy} tx={tx} ty={ty} w={lerp(w0, 60, conv)} />;
  };
  const cracks = [
    'M960 905 L900 912 L850 906 L780 916 L700 909 L610 918',
    'M960 905 L1030 913 L1090 905 L1170 915 L1250 908 L1340 917',
    'M900 912 L880 935 L860 960',
    'M1090 905 L1110 930 L1140 955',
    'M780 916 L760 945',
  ];
  return (
    <Cam t={t} keys={[[a, 960, 540, 1.0], [tVer - 0.3, 960, 552, 1.04], [b, 960, 560, 1.07]]} shake={[[tVer, 16]]}>
      <Layer depth={0.2}>
        <Sky id="s3" stops={[[0, '#020406'], [0.5, '#0B1820'], [1, '#1D3140']]} />
        <Stars t={t} n={60} y1={400} opacity={0.35} />
      </Layer>
      <Layer depth={0.35}>
        <Skyline seed={9} y={830} color="#13222C" hMin={120} hMax={340} win="#9FB8C8" winP={0.06} t={t} />
        <Fog y={820} h={300} color="#2C4656" opacity={0.5} />
      </Layer>
      <Layer depth={0.6}>
        {back.map((g, i) => (
          <Figure key={i} x={g.x} y={880} s={1.5} face={g.face} hat="top" armF={ARM} color="#15242E" hold={<Lamp col="#15242E" />} />
        ))}
        {back.map((g, i) => beam(i + 10, g.x, 880, 1.5, g.face, 110, 860))}
        <Fog y={880} h={200} color="#2C4656" opacity={0.4} />
      </Layer>
      <Layer depth={1}>
        <rect x={-300} y={py} width={2500} height={400} fill="#03050A" />
        {front.map((g, i) => {
          const stomp = i === 1 ? -Math.max(0, wobble(t, tVer - 0.25, 30, 1.2, 4)) : 0;
          return <Figure key={i} x={g.x} y={1010 + stomp} s={2.0} face={g.face} hat="top" armF={ARM} color="#04070A" monocle="#8FA6B8" hold={<Lamp />} />;
        })}
        {front.map((g, i) => beam(i, g.x, 1010, 2.0, g.face, 150, 900))}
        {/* el protagonista desaparece; queda la tarjeta */}
        <Figure x={px} y={py} s={0.42} face={1} armF={[40, 30]} opacity={1 - vanish * 0.94} rim={{color: '#DDEBFF', dx: 0, dy: -1.5, opacity: conv * 0.8}} hold={<Card x={0} y={0} s={2.4 + vanish * 1.2} glow={1 + vanish} opacity={1 / Math.max(0.06, 1 - vanish * 0.94)} />} />
        {/* la grieta del veredicto */}
        {crack > 0 ? (
          <g>
            <Halo x={px} y={py + 10} r={420 * crack} color="#FF4A2C" opacity={0.3} />
            {cracks.map((d, k) => (
              <g key={k}>
                <path d={d} fill="none" stroke="#FF3A1C" strokeWidth={14} opacity={0.25} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(crack * 1.4 - k * 0.12)} strokeLinejoin="round" />
                <path d={d} fill="none" stroke="#FFB08A" strokeWidth={3.5} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(crack * 1.4 - k * 0.12)} strokeLinejoin="round" />
              </g>
            ))}
            <Embers t={t} t0={tVer} n={24} x={px} y={py} spread={600} color="#FF7A4C" />
          </g>
        ) : null}
        <Dust t={t} n={40} opacity={0.3} color="#DCEBFF" />
      </Layer>
      <Verse x={960} y={250} text="un mundo de engreídos" t={t} at={tSnob - 0.3} out={tPart - 0.3} size={54} />
      <Verse x={960} y={250} text="toman una pequeña parte de nosotros" t={t} at={tPart - 0.1} out={tVer - 0.7} size={50} />
      <Verse x={960} y={250} text="…y dictan un veredicto" t={t} at={tVer - 0.2} size={54} color="#FFB3A0" glow="rgba(255,80,50,0.5)" />
    </Cam>
  );
};

// ───────── Escena 4: la ventana de mamá / la calle que mira ─────────
export const MotherWindow: React.FC<SceneProps> = ({t, a, b}) => {
  const tCold = S(6);
  const walk = eio(t, S(4) + 0.2, 2.4);
  const px = lerp(520, 950, walk);
  const open = eo(t, S(4) + 0.6, 0.9);
  const hug = eo(t, S(4) + 2.5, 0.9);
  const cardO = 1 - eo(t, S(5) + 0.1, 0.9);
  const inside = phase(t, a - 2, tCold + 0.1, 0.6);
  const street = t > tCold - 0.5;
  return (
    <g>
      {inside > 0 ? (
        <g opacity={inside}>
          <Cam t={t} keys={[[a, 960, 560, 1.06], [tCold, 960, 540, 1.0]]}>
            <Layer depth={1}>
              <rect x={-300} y={-300} width={2500} height={1700} fill="#0A0B12" />
              {Array.from({length: 18}, (_, i) => (
                <rect key={i} x={-300 + (i % 6) * 420 + ((Math.floor(i / 6) % 2) * 210)} y={120 + Math.floor(i / 6) * 290} width={400} height={8} fill="#11131C" />
              ))}
              <Halo x={960} y={540} r={760} color="#FFB060" opacity={0.35} />
              <defs>
                <linearGradient id="room" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#FFD9A0" />
                  <stop offset="1" stopColor="#E0823E" />
                </linearGradient>
                <clipPath id="winClip">
                  <rect x={640} y={290} width={640} height={480} />
                </clipPath>
              </defs>
              <rect x={640} y={290} width={640} height={480} fill="url(#room)" />
              <g clipPath="url(#winClip)">
                <Halo x={1000} y={420} r={260} color="#FFF0D0" opacity={0.7} />
                {/* cortinas y lámpara */}
                <path d="M640 290 C700 300 720 500 690 770 L640 770 Z" fill="#7A3A1C" opacity={0.45} />
                <path d="M1280 290 C1220 300 1200 500 1230 770 L1280 770 Z" fill="#7A3A1C" opacity={0.45} />
                <path d="M960 290 L960 340" stroke="#3A1E0E" strokeWidth={3} />
                <path d="M930 360 L990 360 L975 340 L945 340 Z" fill="#3A1E0E" />
                <Halo x={960} y={370} r={160} color="#FFF3D6" opacity={0.6} />
                <Figure
                  x={1080}
                  y={775}
                  s={1.15}
                  face={-1}
                  dress
                  hair="bun"
                  armF={open < 1 ? [lerp(10, 60, open), lerp(10, -10, open)] : [lerp(60, 63, hug), lerp(-10, 12, hug)]}
                  armB={open < 1 ? [lerp(-6, 40, open), lerp(8, -5, open)] : [lerp(40, 49, hug), lerp(-5, 17, hug)]}
                  rot={-hug * 4}
                />
                <Figure x={px} y={775} s={1.08} face={1} walk={walk < 1 ? (t - a) * 7 : undefined} slump={hug * 0.15} armF={[lerp(30, 47, hug), lerp(30, 33, hug)]} armB={[lerp(-6, 25, hug), lerp(8, 25, hug)]} rot={hug * 4} hold={<Card x={0} y={0} s={2} opacity={cardO} glow={cardO} />} />
              </g>
              <rect x={640} y={290} width={640} height={480} fill="none" stroke="#08090E" strokeWidth={22} />
              <rect x={954} y={290} width={12} height={480} fill="#08090E" />
              <rect x={640} y={524} width={640} height={12} fill="#08090E" />
              <path d="M640 770 L1280 770 L1500 1100 L420 1100 Z" fill="#FFB060" opacity={0.12} />
            </Layer>
          </Cam>
          <Verse x={960} y={890} text="no le interesa tu estatus, sino tu persona" t={t} at={W(5, 'estatus') - 0.5} size={44} out={tCold - 0.6} />
        </g>
      ) : null}
      {street ? (
        <g opacity={eo(t, tCold - 0.5, 0.8)}>
          <Cam t={t} keys={[[tCold - 0.5, 960, 640, 1.35], [b, 960, 560, 1.0]]}>
            <Layer depth={1}>
              <Sky id="s4b" x={-400} y={-300} w={2720} h={1300} stops={[[0, '#020309'], [0.6, '#0A1024'], [1, '#141D3A']]} />
              {/* edificios lejanos al fondo de la calle */}
              {Array.from({length: 7}, (_, k) => {
                const bx = 700 + k * 76;
                const top = 560 + hash(k + 40) * 80;
                return (
                  <g key={k}>
                    <rect x={bx} y={top} width={72} height={880 - top} fill="#0D1326" />
                    {Array.from({length: 6}, (_, r) => (
                      <rect key={r} x={bx + 14 + (r % 2) * 26} y={top + 16 + Math.floor(r / 2) * 34} width={14} height={18} fill="#6E82B4" opacity={eo(t, tCold + 0.6 + hash(k * 9 + r) * 2.2, 0.4) * 0.5} />
                    ))}
                  </g>
                );
              })}
              <Fog y={760} h={220} color="#2A3760" opacity={0.5} />
              {/* bloques izquierdo y derecho */}
              {[-260, 70, 400, 1210, 1540, 1870].map((bx, c) => {
                const top = [190, 140, 250, 230, 130, 200][c];
                return (
                  <g key={c}>
                    <rect x={bx} y={top} width={318} height={1000} fill={c === 2 || c === 3 ? '#0B1020' : '#080C18'} />
                    {Array.from({length: 18}, (_, k) => {
                      const wx = bx + 44 + (k % 3) * 92;
                      const wy = top + 60 + Math.floor(k / 3) * 118;
                      if (wy > 800) return null;
                      const lit = hash(c * 18 + k + 3) < 0.62;
                      const on = lit ? eo(t, tCold + 0.3 + hash(c * 18 + k) * 2.4, 0.4) : 0;
                      return (
                        <g key={k}>
                          <rect x={wx} y={wy} width={52} height={72} fill={mix('#0D1120', '#8DA2D6', on * 0.85)} />
                          {on > 0.2 ? (
                            <g opacity={on}>
                              <ellipse cx={wx + 26} cy={wy + 40} rx={8} ry={10} fill="#070A14" />
                              <path d={`M${wx + 10} ${wy + 72} C${wx + 12} ${wy + 54} ${wx + 40} ${wy + 54} ${wx + 42} ${wy + 72} Z`} fill="#070A14" />
                            </g>
                          ) : null}
                        </g>
                      );
                    })}
                  </g>
                );
              })}
              {/* calle en perspectiva */}
              <rect x={-300} y={880} width={2500} height={500} fill="#04050A" />
              {[-1400, -700, 0, 700, 1400].map((dx, k) => (
                <path key={k} d={`M960 880 L${960 + dx} 1300`} stroke="#141A2E" strokeWidth={2} />
              ))}
              <Halo x={960} y={760} r={340} color="#9DB4FF" opacity={0.14} />
              {/* sombra alargada que tiembla */}
              <path d={`M948 882 L972 882 L${1010 + Math.sin(t * 9) * 6} 1200 L${910 + Math.sin(t * 7) * 6} 1200 Z`} fill="#000" opacity={0.75} />
              <Figure x={960} y={882} s={0.62} face={1} slump={0.5} armF={[20, 20]} rim={{color: '#9DB4FF', dx: 0, dy: -1.2, opacity: 0.6}} hold={<Card x={0} y={0} s={2.2} glow={0.8} />} />
            </Layer>
          </Cam>
          <Verse x={960} y={300} text="el juicio" t={t} at={W(7, 'juicio') - 0.2} size={62} color="#C8D7FF" glow="rgba(150,180,255,0.6)" />
          <Verse x={960} y={392} text="la humillación" t={t} at={W(7, 'humillación') - 0.2} size={62} color="#C8D7FF" glow="rgba(150,180,255,0.6)" />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 5: el mercado de linternas ─────────
const MARKET: [number, number, string][] = [
  [600, 560, 'car'],
  [1050, 480, 'house'],
  [1500, 590, 'watch'],
  [1950, 500, 'phone'],
  [2400, 560, 'crown'],
];
export const Market: React.FC<SceneProps> = ({t, a, b}) => {
  const tEmo = W(9, 'recompensas');
  const fx = lerp(380, 2500, clamp((t - a) / (b - a)));
  return (
    <Cam t={t} keys={[[a, 700, 560, 1.0], [b, 2250, 560, 1.0]]}>
      <Layer depth={0.15}>
        <Sky id="s5" stops={[[0, '#07040D'], [0.55, '#1E1030'], [1, '#43203F']]} />
        <Stars t={t} n={70} y1={400} opacity={0.4} />
      </Layer>
      <Layer depth={0.5}>
        <Skyline seed={14} y={800} color="#1C1026" hMin={60} hMax={180} x1={3600} />
      </Layer>
      <Layer depth={1}>
        {/* guirnaldas de luces */}
        {[0, 1, 2].map((r) => (
          <g key={r}>
            {Array.from({length: 40}, (_, i) => {
              const x = -200 + i * 80 + r * 30;
              const y = 230 + r * 60 + Math.sin((i / 39) * Math.PI * 6) * -30 + 40;
              return <circle key={i} cx={x} cy={y} r={4} fill="#FFD28A" opacity={0.6 + 0.4 * Math.sin(t * 2 + i + r)} />;
            })}
          </g>
        ))}
        {MARKET.map(([x, y, icon], i) => {
          const thread = eo(t, tEmo - 0.3 + i * 0.25, 1.2);
          const bob = Math.sin(t * 1.3 + i) * 10;
          return (
            <g key={i}>
              {thread > 0 ? (
                <g>
                  <path d={`M${x} ${y + bob - 105} C${x + 20} ${y - 140} ${x - 30} ${y - 170} ${x + 10} ${y - 200}`} fill="none" stroke="#FFC8D8" strokeWidth={2} opacity={0.8} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - thread} />
                  <g transform={`translate(${x + 10 + Math.sin(t * 1.1 + i) * 6} ${y - 222}) scale(${0.62 * eo(t, tEmo + 0.6 + i * 0.25, 0.6)})`}>
                    <Halo x={0} y={0} r={90} color="#FF8FB0" opacity={0.6} />
                    <path d="M0 34 C-30 14 -40 -6 -32 -22 C-24 -36 -6 -36 0 -22 C6 -36 24 -36 32 -22 C40 -6 30 14 0 34 Z" fill="#FFB3C8" />
                  </g>
                </g>
              ) : null}
              <Lantern x={x} y={y + bob} s={2.6} on={1} color="#FFA552" />
              <g transform={`translate(${x} ${y + bob + 40}) scale(0.42)`}>
                <path d={ICONS[icon]} fill="none" stroke="#5A2A10" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" opacity={0.75} />
              </g>
            </g>
          );
        })}
        <rect x={-300} y={900} width={3500} height={500} fill={INK} />
        <Figure x={fx} y={905} s={0.85} face={1} walk={(t - a) * 6} armF={[30, 30]} hold={<Card x={0} y={0} s={2} glow={1.1} />} />
      </Layer>
      <Layer depth={1.35}>
        {Array.from({length: 7}, (_, i) => (
          <Figure key={i} x={i * 520 + 100} y={1080} s={1.5} face={i % 2 ? 1 : -1} color="#020205" hair={i % 3 ? 'short' : 'bun'} />
        ))}
      </Layer>
      <Verse x={960} y={230} text="una época materialista" t={t} at={S(8) + 0.2} out={tEmo - 0.6} size={50} />
      <Verse x={960} y={230} text="recompensas emocionales, atadas a bienes materiales" t={t} at={tEmo - 0.2} size={46} color="#FFD9E4" glow="rgba(255,140,180,0.5)" />
    </Cam>
  );
};

// ───────── Escena 6: lo que hay bajo el agua ─────────
const WHALE =
  'M0 50 C0 22 40 2 120 -4 C240 -12 380 2 470 22 C520 33 560 40 600 44 C560 52 520 60 470 68 C380 90 240 104 130 96 C60 90 8 76 0 50 Z';
const FIN = 'M150 82 C190 122 240 160 300 182 C272 142 232 102 200 86 Z';
const FLUKE = 'M592 44 C616 20 640 0 670 -14 C664 14 652 32 638 44 C652 56 664 74 670 102 C640 88 616 68 592 44 Z';
const Whale: React.FC<{x: number; y: number; s: number; color: string; t: number; dir?: 1 | -1; glow?: number}> = ({x, y, s, color, t, dir = -1, glow = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s * -dir} ${s}) rotate(${Math.sin(t * 0.6) * 2})`}>
    <Halo x={300} y={44} r={560} color={color} opacity={0.28 * glow} />
    <Halo x={300} y={44} r={300} color={color} opacity={0.22 * glow} />
    <path d={FIN} fill="#06192C" stroke={color} strokeWidth={2.5} strokeOpacity={0.8} transform={`rotate(${Math.sin(t * 1.1) * 6} 170 86)`} />
    <path d={WHALE} fill="#06192C" stroke={color} strokeWidth={3} strokeOpacity={0.9} />
    <path d={FLUKE} fill="#06192C" stroke={color} strokeWidth={2.5} strokeOpacity={0.9} transform={`rotate(${Math.sin(t * 1.4) * 9} 592 44)`} />
    {Array.from({length: 9}, (_, k) => (
      <path key={k} d={`M${40 + k * 26} ${74 + k * 2.2} L${110 + k * 24} ${90 + k * 1.2}`} stroke={color} strokeWidth={2} opacity={0.35} />
    ))}
    {Array.from({length: 18}, (_, k) => (
      <circle key={k} cx={70 + k * 28} cy={18 - Math.sin((k / 17) * Math.PI) * 18 + (k % 2) * 6} r={2.6} fill="#FFFFFF" opacity={0.45 + 0.55 * Math.sin(t * 2.2 + k)} />
    ))}
    <circle cx={64} cy={46} r={4} fill={color} />
  </g>
);
/** Estela de luz que deja una ballena (puntos que se apagan detrás) */
const Trail: React.FC<{pts: (u: number) => [number, number]; t: number; color: string}> = ({pts, t, color}) => (
  <g>
    {Array.from({length: 28}, (_, k) => {
      const [x, y] = pts(t - k * 0.12);
      return <circle key={k} cx={x} cy={y + Math.sin(k * 1.7 + t) * 6} r={3 - k * 0.08} fill={color} opacity={(1 - k / 28) * 0.6} />;
    })}
  </g>
);

export const Ocean: React.FC<SceneProps> = ({t, a, b}) => {
  const tDive = W(10, 'rara vez');
  const tAtt = W(10, 'atención');
  const tResp = W(10, 'respeto');
  const tLove = W(10, 'amor');
  const SEA = 620;
  const w1 = (u: number): [number, number] => [1240 + (u - a) * 14, 1110 + Math.sin(u * 0.5) * 12];
  const w2 = (u: number): [number, number] => [760 - (u - a) * 10, 1330 + Math.sin(u * 0.45 + 1) * 12];
  const w3 = (u: number): [number, number] => [1117 + (u - a) * 12, 1640 + Math.sin(u * 0.4 + 2) * 10];
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 520, 1.0], [tDive - 0.3, 960, 540, 1.04], [tDive + 2.0, 960, 1300, 1.0], [b, 960, 1340, 0.97]]}>
        <Layer depth={1}>
          <Sky id="s6" x={-600} y={-800} w={3120} h={800 + SEA} stops={[[0, '#020309'], [0.7, '#0E1838'], [1, '#26346A']]} />
          <Stars t={t} n={120} y0={-300} y1={520} />
          <Moon x={1420} y={250} r={80} color="#EEF0F6" />
          <defs>
            <linearGradient id="sea6" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#10284C" />
              <stop offset="0.2" stopColor="#061633" />
              <stop offset="1" stopColor="#01040C" />
            </linearGradient>
          </defs>
          <rect x={-600} y={SEA} width={3120} height={2200} fill="url(#sea6)" />
          {/* reflejo de la luna */}
          {Array.from({length: 22}, (_, i) => (
            <rect key={i} x={1420 - 70 + Math.sin(t * 2 + i) * 22 + hash(i) * 50} y={SEA + 6 + i * 10} width={70 - i * 2.6} height={3} rx={1.5} fill="#EEF1F8" opacity={0.55 - i * 0.022} />
          ))}
          {/* objetos que flotan */}
          {[
            [470, 'coin'],
            [640, 'briefcase'],
            [1200, 'car'],
            [1330, 'coin'],
          ].map(([x, ic], i) => (
            <g key={i} transform={`translate(${x as number} ${SEA - 6 + Math.sin(t * 1.5 + i) * 5}) scale(0.5) rotate(${Math.sin(t + i) * 5})`}>
              <path d={ICONS[ic as string]} fill={INK} stroke={INK} strokeWidth={10} />
            </g>
          ))}
          {/* el bote: la figura sentada dentro, el casco por delante */}
          <g transform={`translate(930 ${SEA + Math.sin(t * 1.2) * 4}) rotate(${Math.sin(t * 0.9) * 2})`}>
            <Figure x={-30} y={34} s={0.42} face={1} sit armF={[50, 30]} rim={{color: '#DDE6FF', dx: 0.8, dy: -0.8, opacity: 0.7}} hold={<Card x={0} y={0} s={2.4} glow={1.2} />} />
            <path d="M-150 -16 L150 -16 L108 18 L-108 18 Z" fill={INK} />
            <path d="M-150 -16 L150 -16" stroke="#3A4A7A" strokeWidth={2} />
          </g>
          {/* bajo el agua */}
          <Rays x={960} y={SEA} t={t} n={10} len={1200} spread={70} angle={90} color="#9FD6FF" opacity={0.12} />
          <Trail pts={w1} t={t} color="#38E1FF" />
          <Trail pts={w2} t={t} color="#7BF5D6" />
          <Trail pts={w3} t={t} color="#FF8FA8" />
          <Whale x={w1(t)[0]} y={w1(t)[1] - 44 * 0.62} s={0.62} color="#38E1FF" t={t} dir={1} glow={0.6 + 0.5 * eo(t, tAtt - 0.2, 0.6)} />
          <Whale x={w2(t)[0]} y={w2(t)[1] - 44 * 0.56} s={0.56} color="#7BF5D6" t={t + 1} dir={-1} glow={0.6 + 0.5 * eo(t, tResp - 0.2, 0.6)} />
          <Whale x={w3(t)[0]} y={w3(t)[1] - 44 * 0.95} s={0.95} color="#FF8FA8" t={t + 2} dir={1} glow={0.6 + 0.7 * eo(t, tLove - 0.2, 0.6)} />
          {Array.from({length: 40}, (_, i) => {
            const y = ((hash(i * 3) * 1400 - t * (30 + hash(i) * 40)) % 1400 + 1400) % 1400 + SEA + 40;
            return <circle key={i} cx={hash(i * 7) * 1920 + Math.sin(t + i) * 10} cy={y} r={2 + hash(i * 5) * 5} fill="none" stroke="#BFEFFF" strokeWidth={1.5} opacity={0.4} />;
          })}
          <Verse x={540} y={1190} text="atención" t={t} at={tAtt - 0.2} size={88} color="#E8FBFF" glow="rgba(56,225,255,0.85)" italic={false} spacing="0.15em" />
          <Verse x={1300} y={1340} text="respeto" t={t} at={tResp - 0.2} size={88} color="#E8FFF8" glow="rgba(123,245,214,0.85)" italic={false} spacing="0.15em" />
          <Verse x={960} y={1570} text="amor" t={t} at={tLove - 0.2} size={150} color="#FFE9EE" glow="rgba(255,143,168,0.95)" spacing="0.1em" />
        </Layer>
      </Cam>
      <Verse x={960} y={250} text="…lo que de verdad buscamos" t={t} at={tDive + 0.9} out={tLove + 0.8} size={46} color="#CFF6FF" />
    </g>
  );
};

export const _a = {pr, Rays, Ridge, Fog};
