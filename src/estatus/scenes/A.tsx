import React from 'react';
import {Briefcase, Bubble, C, Cam, Card, eio, eo, FELL, FELLSC, Ground, HAND, Heart, Ink, lerp, Person, pop, pr, settle, Shape, Stamp, WineGlass, Write, Coin, clamp, easeInOut} from '../kit';
import {S, W} from '../timing';

export type SceneProps = {t: number; a: number; b: number};

// ───────── Escena 1: «La pregunta» — un cóctel a lo Sempé ─────────
export const Party: React.FC<SceneProps & {reprise?: boolean}> = ({t, a, b, reprise}) => {
  const q = reprise ? W(54, '¿a') : S(1);
  const bubbleP = pr(t, q - (reprise ? 0.7 : 0.15), 0.5);
  const writeP = pr(t, q - (reprise ? 0.5 : 0), reprise ? 0.8 : 1.0);
  // en la repetición final, el bocadillo se dobla y vuela por la ventana
  const fly = reprise ? eio(t, q + 0.45, 1.1) : 0;
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 560, 1.0]} to={[1010, 520, reprise ? 1.08 : 1.18]}>
      {/* ventana y lámpara */}
      <Shape d="M1430 170 L1720 170 L1720 520 L1430 520 Z" fill={reprise ? '#f6d9a6' : '#dfe6e6'} />
      <Ink d="M1575 170 L1575 520 M1430 345 L1720 345" />
      <Ink d="M300 150 L300 250" w={2} />
      <Shape d="M250 250 L350 250 L330 300 L270 300 Z" fill={C.honey} />
      <circle cx={300} cy={330} r={110} fill={C.honey} opacity={0.18} />
      <Ground y={860} />
      {/* invitados al fondo */}
      <Person x={360} y={860} s={0.9} coat={C.sage} hair="bun" hairColor="#5a3c2a" dress mood="smug" armFront={[-20, 120]} holdFront={<WineGlass />} skin={C.skin[1]} />
      <Person x={520} y={860} s={0.95} coat={C.grayDark} hair="bald" hairColor={C.gray} tie={C.brick} mood="neutral" flip armFront={[-5, 110]} holdFront={<WineGlass wine={C.honey} />} />
      <Person x={1650} y={860} s={0.9} coat={C.roseDeep} hair="long" hairColor="#2e2018" dress flip mood="neutral" skin={C.skin[2]} />
      {/* los protagonistas */}
      <Person
        x={880}
        y={880}
        s={1.35}
        coat={C.brick}
        hair="long"
        hairColor="#3d2618"
        dress
        mood={reprise ? 'smile' : 'smile'}
        armFront={reprise && t > q + 0.1 ? [lerp(-10, 150, eio(t, q + 0.1, 0.4)), -40] : [-25, 115]}
        holdFront={reprise ? undefined : <WineGlass />}
        lean={reprise ? 0 : settle(t, q, 2, 0.6, 1.5)}
      />
      <Person
        x={1180}
        y={880}
        s={1.35}
        flip
        coat={C.slate}
        hair="short"
        hairColor="#2a1c14"
        tie={C.ochre}
        mood={reprise ? 'smile' : 'neutral'}
        armFront={[-20, 118]}
        holdFront={<WineGlass wine={C.honey} />}
        skin={C.skin[1]}
      />
      {/* el bocadillo */}
      {fly < 1 ? (
        <g
          transform={
            fly > 0
              ? `translate(${lerp(0, 520, fly)} ${lerp(0, -330, fly) + Math.sin(fly * 6) * 20}) rotate(${fly * 30} 1100 420) scale(${lerp(1, 0.35, fly)})`
              : undefined
          }
        >
          <Bubble x={1100} y={420} w={430} h={150} tail={[1180, 520]} p={bubbleP}>
            <Write id={reprise ? 'q2' : 'q1'} x={1100} y={440} p={writeP} size={62} weight={700}>
              ¿A qué te dedicas?
            </Write>
          </Bubble>
        </g>
      ) : null}
      {fly > 0 && fly < 1 ? <Ink d={`M1300 400 Q1420 300 ${lerp(1300, 1620, fly)} ${lerp(400, 240, fly)}`} w={1.4} color={C.inkSoft} strokeDasharray="6 8" /> : null}
    </Cam>
  );
};

// ───────── Escena 2: «La balanza» ─────────
export const Balance: React.FC<{x: number; y: number; tilt: number; left?: React.ReactNode; right?: React.ReactNode; s?: number; draw?: number}> = ({
  x,
  y,
  tilt,
  left,
  right,
  s = 1,
  draw = 1,
}) => {
  const arm = 260;
  const r = (tilt * Math.PI) / 180;
  const lx = -Math.cos(r) * arm;
  const ly = -Math.sin(r) * arm;
  const rx = Math.cos(r) * arm;
  const ry = Math.sin(r) * arm;
  const pan = (px: number, py: number, content: React.ReactNode) => (
    <g transform={`translate(${px} ${py})`}>
      <Ink d="M0 0 L-70 150 M0 0 L70 150" w={1.8} draw={draw} />
      <Shape d="M-95 150 Q0 205 95 150 Z" fill={C.honey} draw={draw} />
      <g transform="translate(0 150)">{content}</g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shape d="M-110 430 L110 430 L80 400 L-80 400 Z" fill={C.gold} draw={draw} />
      <Shape d="M-12 400 L-8 20 L8 20 L12 400 Z" fill={C.gold} draw={draw} />
      <circle cx={0} cy={0} r={16} fill={C.gold} stroke={C.ink} strokeWidth={2.4} />
      <Shape d={`M${lx} ${ly - 6} L${rx} ${ry - 6} L${rx} ${ry + 6} L${lx} ${ly + 6} Z`} fill={C.gold} draw={draw} />
      <path d="M-8 -30 L8 -30 L0 -6 Z" fill={C.ink} />
      {pan(lx, ly, left)}
      {pan(rx, ry, right)}
    </g>
  );
};

export const Scale: React.FC<SceneProps> = ({t, a, b}) => {
  const tImp = W(2, 'impresionante');
  const tBetter = W(2, 'conocerte');
  const tAside = W(2, 'dejarte');
  const card1 = pr(t, a + 0.4, 0.6);
  const swap = pr(t, tAside - 1.2, 0.6);
  const tilt = -lerp(0, 14, eio(t, tImp, 0.8)) + settle(t, tImp + 0.6, 3, 1.3, 2.5) + lerp(0, 30, eio(t, tAside - 0.8, 0.8)) + settle(t, tAside, 3, 1.3, 2.5);
  const cardEl = (
    <g transform={`translate(0 ${-34 + (1 - easeInOut(card1)) * -420})`} opacity={1 - swap}>
      <Card text="DIRECTORA" w={180} h={72} size={26} />
    </g>
  );
  const card2 = (
    <g transform={`translate(0 ${-34 + (1 - easeInOut(swap)) * -420})`} opacity={swap}>
      <Card text="CAJERO" w={160} h={72} size={26} fill="#eadfca" />
    </g>
  );
  const lean = lerp(0, 9, eio(t, tBetter - 0.5, 0.7)) - lerp(0, 9, eio(t, tAside - 0.6, 0.6));
  const turn = t > tAside - 0.2;
  const walk = eio(t, tAside, 1.6);
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 520, 1.05]} to={[1060, 540, 1.0]}>
      <Balance x={720} y={230} tilt={tilt} left={<g>{cardEl}{card2}</g>} right={<g><Coin x={-20} y={-12} /><Coin x={18} y={-14} /><Coin x={0} y={-24} /></g>} />
      <Ground y={880} x0={1150} x1={1860} />
      <Person
        x={lerp(1380, 1700, walk)}
        y={880}
        s={1.25}
        flip={!turn}
        coat={C.slate}
        hair="short"
        hairColor="#2a1c14"
        tie={C.ochre}
        mood={turn ? 'smug' : 'smile'}
        lean={turn ? 0 : -lean}
        armFront={[-20, 118]}
        holdFront={<WineGlass wine={C.honey} />}
        skin={C.skin[1]}
      />
      <Write id="s2a" x={1380} y={300} p={pr(t, tBetter, 0.9)} size={44} color={C.sageDark}>
        «¡Qué interesante!»
      </Write>
      <Write id="s2b" x={1560} y={380} p={pr(t, tAside + 0.2, 0.8)} size={44} color={C.slate}>
        «Ah… disculpa.»
      </Write>
    </Cam>
  );
};

// ───────── Escena 3: «El mundo de los engreídos» ─────────
export const Snobs: React.FC<SceneProps> = ({t, a, b}) => {
  const tPart = W(3, 'pequeña parte');
  const tProf = W(3, 'identidades');
  const tVer = W(3, 'veredicto');
  const lensIn = eio(t, tPart - 0.8, 1.2);
  const fadeRest = eio(t, tProf, 1.0);
  const lx = lerp(1500, 960, lensIn);
  const ly = lerp(160, 520, lensIn);
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 560, 0.95]} to={[960, 520, 1.12]}>
      <Ground y={900} />
      {/* la persona entera: se desvanece salvo lo que ve la lupa */}
      <defs>
        <clipPath id="lensClip">
          <circle cx={lx} cy={ly} r={150} />
        </clipPath>
      </defs>
      <g opacity={1 - fadeRest * 0.82}>
        <Person x={960} y={900} s={1.75} coat={C.sage} hair="curly" hairColor="#4a2e1c" mood="worried" armBack={[10, -10]} armFront={[-5, 10]} holdFront={<Briefcase />} tie={C.brick} skin={C.skin[2]} />
        {/* lo que la hace única: una guitarra, un libro, un gato */}
        <g opacity={1}>
          <Write id="s3w1" x={660} y={430} p={pr(t, a + 0.8, 0.8)} size={38} color={C.inkSoft}>
            toca el violonchelo
          </Write>
          <Write id="s3w2" x={1280} y={360} p={pr(t, a + 1.6, 0.8)} size={38} color={C.inkSoft}>
            cuida de su padre
          </Write>
          <Write id="s3w3" x={1300} y={700} p={pr(t, a + 2.4, 0.8)} size={38} color={C.inkSoft}>
            ríe muy fuerte
          </Write>
          <Write id="s3w4" x={640} y={720} p={pr(t, a + 3.2, 0.8)} size={38} color={C.inkSoft}>
            escribe poemas
          </Write>
        </g>
      </g>
      <g clipPath="url(#lensClip)" opacity={fadeRest}>
        <Person x={960} y={900} s={1.75} coat={C.sage} hair="curly" hairColor="#4a2e1c" mood="worried" armBack={[10, -10]} armFront={[-5, 10]} holdFront={<Briefcase />} tie={C.brick} skin={C.skin[2]} />
      </g>
      {/* la mano con monóculo y la lupa */}
      <g opacity={lensIn > 0 ? 1 : 0}>
        <circle cx={lx} cy={ly} r={150} fill="none" stroke={C.ink} strokeWidth={10} />
        <circle cx={lx} cy={ly} r={150} fill="none" stroke={C.gold} strokeWidth={5} />
        <path d={`M${lx + 106} ${ly + 106} L${lx + 260} ${ly + 260}`} stroke={C.ink} strokeWidth={26} strokeLinecap="round" />
        <path d={`M${lx + 106} ${ly + 106} L${lx + 260} ${ly + 260}`} stroke="#7a4b2a" strokeWidth={18} strokeLinecap="round" />
        <path d={`M${lx + 245} ${ly + 230} q30 -10 50 10 q20 20 10 50 l-60 -10 z`} fill={C.skin[0]} stroke={C.ink} strokeWidth={2.4} />
        <path d={`M${lx + 300} ${ly + 240} l90 -20 l20 40 l-90 30 z`} fill={C.ink} />
      </g>
      {/* el mazo del juez y el veredicto */}
      <g transform={`rotate(${t < tVer ? lerp(-60, 0, easeInOut(pr(t, tVer - 0.5, 0.5))) : settle(t, tVer, 6, 2, 5)} 1560 820)`} opacity={pr(t, tVer - 0.7, 0.2)}>
        <Shape d="M1380 690 L1470 690 L1470 760 L1380 760 Z" fill="#8a5a34" />
        <Shape d="M1470 718 L1640 830 L1630 845 L1462 735 Z" fill="#a87448" />
      </g>
      <Stamp x={700} y={240} t={t} at={tVer + 0.05} text="VALOR: ?" size={70} />
    </Cam>
  );
};

// ───────── Escena 4: «Lo opuesto: tu madre» ─────────
export const Mother: React.FC<SceneProps> = ({t, a, b}) => {
  const tCrowd = S(6);
  const tHum = W(7, 'humillación');
  const zoomOut = eio(t, tCrowd - 0.3, 1.8);
  const shrink = eio(t, tHum - 0.4, 1.4);
  const warm = 1 - eio(t, tCrowd, 1.5) * 0.4;
  const eyes = Array.from({length: 16}, (_, i) => {
    const ang = (i / 16) * Math.PI * 2;
    return {x: 960 + Math.cos(ang) * 760, y: 560 + Math.sin(ang) * 420, d: i * 0.08};
  });
  return (
    <g>
      <Cam t={t} t0={tCrowd - 0.3} t1={tCrowd + 1.8} from={[960, 540, 1.35]} to={[960, 540, 0.82]}>
        {/* aura cálida de acuarela */}
        <g filter="url(#wash)" opacity={warm}>
          <circle cx={960} cy={560} r={330} fill={C.rose} opacity={0.55} />
          <circle cx={900} cy={600} r={240} fill={C.honey} opacity={0.5} />
        </g>
        <Ground y={820} x0={700} x1={1220} />
        <g transform={`translate(960 820) scale(${1 - shrink * 0.35}) translate(-960 -820)`}>
          <Person x={1010} y={820} s={1.25} flip coat={C.sage} hair="short" hairColor="#3d2618" mood={t > tHum ? 'worried' : 'closed'} armFront={[100, -48]} armBack={[96, -40]} skin={C.skin[1]} lean={-4} />
          <Person x={890} y={820} s={1.15} coat={C.roseDeep} hair="bun" hairColor={C.gray} dress mood="closed" armFront={[98, -50]} armBack={[94, -42]} lean={6} />
          <Heart x={950} y={440} s={eo(t, S(5), 0.8) * 1.4} fill={C.brick} opacity={1 - zoomOut} />
        </g>
        <Write id="s4a" x={960} y={300} p={pr(t, W(5, 'persona'), 0.6) * (1 - zoomOut)} size={54} color={C.brick}>
          no tu estatus, tu persona
        </Write>
        {/* multitud que juzga */}
        {zoomOut > 0
          ? eyes.map((e, i) => {
              const p = eo(t, tCrowd + 0.4 + e.d, 0.6);
              if (p <= 0) return null;
              const look = Math.atan2(560 - e.y, 960 - e.x);
              return (
                <g key={i} opacity={p}>
                  <Person
                    x={e.x}
                    y={e.y + 160}
                    s={0.8}
                    flip={e.x > 960}
                    coat={[C.slate, C.grayDark, C.sage, C.ochre][i % 4]}
                    hair={(['short', 'bun', 'bald', 'long', 'curly'] as const)[i % 5]}
                    hairColor={C.ink}
                    hat={i % 6 === 0 ? 'top' : 'none'}
                    mood="smug"
                    skin={C.skin[i % 4]}
                  />
                  <Ink d={`M${e.x + Math.cos(look) * 40} ${e.y - 60 + Math.sin(look) * 40} L${e.x + Math.cos(look) * 120} ${e.y - 60 + Math.sin(look) * 120}`} w={1.2} color={C.inkSoft} strokeDasharray="4 6" />
                </g>
              );
            })
          : null}
        {/* foco de las miradas */}
        <circle cx={960} cy={620} r={280} fill={C.slate} opacity={0.18 * shrink} />
      </Cam>
      <Write id="s4b" x={960} y={1000} p={pr(t, W(7, 'juicio'), 0.9)} size={56} color={C.ink}>
        el juicio · la humillación
      </Write>
    </g>
  );
};

// ───────── Escena 5: «Una época materialista» ─────────
const House = () => <Shape d="M-70 0 L-70 -90 L0 -150 L70 -90 L70 0 Z M-20 0 L-20 -50 L20 -50 L20 0" fill={C.ochre} />;
const Car = () => (
  <g>
    <Shape d="M-110 0 L-110 -40 L-60 -48 L-30 -86 L50 -86 L80 -48 L110 -40 L110 0 Z" fill={C.brick} />
    <Shape d="M-25 -78 L-5 -50 L45 -50 L32 -78 Z" fill="#cfe0e6" />
    <circle cx={-60} cy={0} r={22} fill={C.ink} />
    <circle cx={60} cy={0} r={22} fill={C.ink} />
    <circle cx={-60} cy={0} r={9} fill={C.gray} />
    <circle cx={60} cy={0} r={9} fill={C.gray} />
  </g>
);
const Watch = () => (
  <g>
    <Shape d="M-14 -70 L14 -70 L14 70 L-14 70 Z" fill="#7a4b2a" />
    <circle r={38} fill={C.gold} stroke={C.ink} strokeWidth={2.6} />
    <circle r={28} fill={C.cream} stroke={C.ink} strokeWidth={1.6} />
    <Ink d="M0 0 L0 -18 M0 0 L12 6" w={2} />
  </g>
);
const Bags = () => (
  <g>
    <Shape d="M-60 0 L-50 -110 L20 -110 L30 0 Z" fill={C.sage} />
    <Ink d="M-30 -110 Q-15 -150 0 -110" />
    <Shape d="M0 0 L12 -80 L70 -80 L80 0 Z" fill={C.rose} />
    <Ink d="M28 -80 Q41 -110 54 -80" />
  </g>
);

export const Materialism: React.FC<SceneProps> = ({t, a, b}) => {
  const items: [number, number, React.ReactNode, number][] = [
    [420, 760, <House key="h" />, a + 0.4],
    [820, 760, <Car key="c" />, a + 1.1],
    [1180, 700, <Watch key="w" />, a + 1.8],
    [1520, 760, <Bags key="b" />, a + 2.5],
  ];
  const tEmo = W(9, 'recompensas');
  const tMat = W(9, 'bienes');
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 600, 1.05]} to={[960, 480, 0.95]}>
      <Ground y={762} x0={200} x1={1720} />
      <Write id="s5t" x={960} y={180} p={pr(t, S(8) + 0.6, 1.2)} size={64} font={FELL} color={C.ink}>
        Una época materialista
      </Write>
      {items.map(([x, y, el, t0], i) => {
        const s = pop(t, t0, 0.5);
        const hx = x + (i - 1.5) * 30;
        const hy = 330 + Math.sin(t * 1.3 + i) * 12;
        const thread = eo(t, tEmo + i * 0.25, 0.9);
        return (
          <g key={i}>
            <g transform={`translate(${x} ${y}) scale(${s})`}>{el}</g>
            {thread > 0 ? (
              <>
                <Ink d={`M${x} ${y - 100} Q${(x + hx) / 2 + 30} ${(y + hy) / 2} ${hx} ${hy + 12}`} draw={thread} w={2} color={C.brick} />
                <Heart x={hx} y={hy} s={pop(t, tEmo + i * 0.25 + 0.6, 0.5) * 1.3} fill={C.brick} />
              </>
            ) : null}
          </g>
        );
      })}
      <Write id="s5b" x={960} y={950} p={pr(t, tMat, 1.0)} size={50} color={C.brick}>
        recompensas emocionales ↔ bienes materiales
      </Write>
    </Cam>
  );
};

// ───────── Escena 6: «Lo que de verdad buscamos» ─────────
export const Spotlight: React.FC<SceneProps> = ({t, a, b}) => {
  const tOpen = W(10, 'rara vez');
  const tAtt = W(10, 'atención');
  const tLove = W(10, 'amor');
  const open = eio(t, tOpen - 0.3, 0.8);
  const light = eo(t, tOpen + 0.2, 1.0);
  const spot = eo(t, tAtt, 1.2);
  const crowd = Array.from({length: 9}, (_, i) => i);
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 560, 1.0]} to={[880, 540, 1.15]}>
      {/* telón de teatro de juguete */}
      <Shape d="M120 80 L1800 80 L1800 140 L120 140 Z" fill={C.brick} />
      <Shape d="M120 140 C200 400 180 700 140 980 L120 980 Z" fill={C.brick} />
      <Shape d="M1800 140 C1720 400 1740 700 1780 980 L1800 980 Z" fill={C.brick} />
      <rect x={140} y={140} width={1640} height={840} fill={C.ink} opacity={0.18 * spot} />
      <Ground y={880} x0={160} x1={1760} />
      {/* el foco */}
      <path d={`M700 60 L520 880 L1080 880 L900 60 Z`} fill={C.honey} opacity={0.35 * spot} />
      <ellipse cx={800} cy={880} rx={280} ry={30} fill={C.honey} opacity={0.5 * spot} />
      {/* el coche, con el maletero que se abre */}
      <g transform="translate(1180 880) scale(2.1)">
        <Car />
        <g transform={`rotate(${-open * 70} 108 -40)`}>
          <Shape d="M80 -48 L110 -40 L110 -10 L96 -10 Z" fill={C.brick} />
        </g>
        {light > 0 ? <path d="M110 -40 L230 -140 L230 40 L110 0 Z" fill={C.honey} opacity={0.5 * light} /> : null}
      </g>
      <Person x={800} y={880} s={1.4} coat={C.ink} legs={C.ink} hair="short" hairColor="#3a2414" tie={C.gold} mood={t > tAtt ? 'smile' : 'neutral'} armFront={[lerp(10, 130, open), -20]} />
      {/* multitud que aplaude, saliendo del maletero */}
      {crowd.map((i) => {
        const p = eo(t, tOpen + 0.4 + i * 0.12, 0.7);
        if (p <= 0) return null;
        const x = lerp(1450, 1150 + i * 70, p);
        const clap = Math.sin(t * 14 + i) * 8;
        return (
          <Person key={i} x={x + (i % 2) * 30} y={880 - (i % 3) * 8} s={0.62} flip coat={[C.sage, C.ochre, C.slate, C.rose][i % 4]} hair={(['bun', 'short', 'curly', 'long'] as const)[i % 4]} hairColor={C.ink} mood="smile" armFront={[120 + clap, -60]} armBack={[110 - clap, -50]} skin={C.skin[i % 4]} />
        );
      })}
      <Write id="s6a" x={960} y={250} p={pr(t, tAtt, 1.0)} size={60} font={FELL}>
        atención · respeto
      </Write>
      <Write id="s6b" x={960} y={340} p={pr(t, tLove, 0.8)} size={72} color={C.brick} weight={700}>
        «amor»
      </Write>
    </Cam>
  );
};

// re-export de utilidades para otras escenas
export {Car, House, Bags, Watch};
export const _unused = {FELLSC, HAND, clamp};
