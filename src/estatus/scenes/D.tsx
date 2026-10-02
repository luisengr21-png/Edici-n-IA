import React from 'react';
import {Bubble, C, Cam, Card, clamp, Coin, eio, eo, FELL, FELLSC, Ground, Heart, Ink, lerp, Person, pop, pr, settle, Shape, Write} from '../kit';
import {S, W} from '../timing';
import {Balance, Party, SceneProps} from './A';

const Numeral: React.FC<{t: number; at: number; n: string; word: string}> = ({t, at, n, word}) => (
  <g opacity={eo(t, at, 0.6)}>
    <text x={140} y={190} fontFamily={FELL} fontSize={130} fill={C.brick}>
      {n}
    </text>
    <Write id={`num-${n}`} x={240} y={170} p={pr(t, at + 0.2, 0.8)} size={56} anchor="start" color={C.ink}>
      {word}
    </Write>
  </g>
);

// ───────── Escena 19: «Primero: la suerte existe» ─────────
export const Luck: React.FC<SceneProps> = ({t, a, b}) => {
  const tLuck = W(46, 'suerte');
  const tAcc = W(46, 'accidentes');
  const tHier = W(46, 'jerarquía');
  const tKind = S(47);
  const rungs = [880, 790, 700, 610, 520, 430, 340];
  // cada figura cae en un peldaño según una tirada de dados
  const people = [
    {rung: 5, at: tLuck + 0.3, coat: C.sage, side: -1},
    {rung: 1, at: tLuck + 0.7, coat: C.ochre, side: 1},
    {rung: 3, at: tAcc + 0.1, coat: C.slate, side: -1},
    {rung: 0, at: tAcc + 0.5, coat: C.roseDeep, side: 1},
    {rung: 6, at: tHier - 0.4, coat: C.brick, side: 1},
  ];
  const kind = eo(t, tKind - 0.4, 0.8);
  return (
    <g>
      <Numeral t={t} at={a + 0.1} n="1." word="la suerte cuenta" />
      <Cam t={t} t0={a} t1={b} from={[960, 560, 1.0]} to={[980, 580, 1.04]}>
        <Ground y={940} />
        <Ink d="M820 940 L880 280 M1100 940 L1040 280" w={6} color={C.gold} />
        {rungs.map((y, i) => {
          const k = (940 - y) / 660;
          return <Ink key={i} d={`M${820 + 60 * k} ${y} L${1100 - 60 * k} ${y}`} w={5} color={C.gold} />;
        })}
        {/* los dados que deciden */}
        {[0, 1].map((i) => {
          const p = eo(t, tLuck - 0.4 + i * 0.2, 1.0);
          const x = lerp(1700, 1380 + i * 120, p);
          const rot = p * (500 + i * 120);
          return (
            <g key={i} transform={`translate(${x} ${840 - Math.abs(Math.sin(p * 7)) * 80 * (1 - p)}) rotate(${rot})`} opacity={pr(t, tLuck - 0.4, 0.2)}>
              <rect x={-36} y={-36} width={72} height={72} rx={12} fill={C.cream} stroke={C.ink} strokeWidth={2.6} />
              <circle cx={-14} cy={-14} r={6} fill={C.ink} />
              <circle cx={14} cy={14} r={6} fill={C.ink} />
              {i ? <circle r={6} fill={C.ink} /> : null}
            </g>
          );
        })}
        {people.map((pp, i) => {
          const p = eo(t, pp.at, 0.6);
          if (p <= 0) return null;
          const y = rungs[pp.rung];
          const k = (940 - y) / 660;
          const x = pp.side < 0 ? 820 + 60 * k + 30 : 1100 - 60 * k - 30;
          return (
            <g key={i} transform={`translate(0 ${(1 - p) * -200})`} opacity={p}>
              <Person x={x} y={y} s={0.42} flip={pp.side > 0} coat={pp.coat} hair={(['short', 'bun', 'curly', 'long', 'bald'] as const)[i]} hairColor={C.ink} mood={pp.rung > 3 ? 'smile' : 'neutral'} armFront={[150, 0]} skin={C.skin[i % 4]} />
            </g>
          );
        })}
        <Write id="s19a" x={1440} y={420} p={pr(t, tAcc, 0.8)} size={44} color={C.inkSoft}>
          suerte · accidentes
        </Write>
        {/* compasión: con los demás y con uno mismo */}
        {kind > 0 ? (
          <g opacity={kind}>
            <circle cx={420} cy={760} r={220} fill={C.honey} opacity={0.25} filter="url(#soft)" />
            <Person x={360} y={940} s={0.95} coat={C.sage} hair="bun" hairColor="#3d2618" mood="smile" dress armFront={[lerp(10, 92, eo(t, tKind, 0.6)), -20]} armBack={[lerp(0, 60, eo(t, tKind + 0.5, 0.5)), 80]} skin={C.skin[0]} />
            <Person x={500} y={940} s={0.95} flip coat={C.grayDark} hair="curly" hairColor="#2a1c14" mood={t > tKind + 0.8 ? 'smile' : 'sad'} skin={C.skin[3]} />
            <Heart x={430} y={660} s={pop(t, tKind + 0.9, 0.5) * 0.9} fill={C.brick} />
          </g>
        ) : null}
      </Cam>
      <Write id="s19b" x={960} y={1030} p={pr(t, tKind, 1.0)} size={46} color={C.brick}>
        nadie merece del todo su lugar · ni siquiera tú
      </Write>
    </g>
  );
};

// ───────── Escena 20: «Segundo: tu propia definición de éxito» ─────────
const Plant = () => (
  <g>
    <Shape d="M-40 0 L40 0 L30 -60 L-30 -60 Z" fill={C.brick} />
    <Ink d="M0 -60 C0 -100 -10 -130 -4 -160 M0 -90 C20 -110 40 -112 50 -130 M-2 -110 C-30 -120 -44 -140 -50 -150" w={3} color={C.sageDark} />
    {[[-4, -165], [52, -134], [-52, -154]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={11} fill={[C.rose, C.honey, C.rose][i]} stroke={C.ink} strokeWidth={1.6} />
    ))}
  </g>
);
const Dinner = ({t}: {t: number}) => (
  <g>
    <Shape d="M-110 -40 L110 -40 L110 -24 L-110 -24 Z" fill="#a87448" />
    <Ink d="M-90 -24 L-90 0 M90 -24 L90 0" w={4} />
    <Shape d="M-30 -40 C-30 -70 30 -70 30 -40 Z" fill={C.cream} />
    {[0, 1, 2].map((i) => (
      <Ink key={i} d={`M${-14 + i * 14} -78 q${6 + Math.sin(t * 3 + i) * 4} -14 0 -28 q-6 -12 0 -24`} w={1.6} color={C.gray} />
    ))}
    <Person x={-140} y={0} s={0.42} coat={C.sage} hair="bun" hairColor={C.ink} mood="smile" dress armFront={[80, 20]} skin={C.skin[1]} />
    <Person x={140} y={0} s={0.42} flip coat={C.slate} hair="short" hairColor={C.ink} mood="smile" armFront={[80, 20]} skin={C.skin[2]} />
  </g>
);
const OpenBook = () => (
  <g>
    <Shape d="M0 -20 C-40 -40 -90 -40 -120 -24 L-120 -110 C-90 -126 -40 -126 0 -106 Z" fill={C.cream} />
    <Shape d="M0 -20 C40 -40 90 -40 120 -24 L120 -110 C90 -126 40 -126 0 -106 Z" fill={C.cream} />
    {[0, 1, 2, 3].map((i) => (
      <Ink key={i} d={`M-100 ${-96 + i * 16} C-70 ${-106 + i * 16} -30 ${-106 + i * 16} -16 ${-96 + i * 16} M16 ${-96 + i * 16} C30 ${-106 + i * 16} 70 ${-106 + i * 16} 100 ${-96 + i * 16}`} w={1.2} color={C.gray} />
    ))}
  </g>
);
const Embrace = () => (
  <g>
    <Person x={-24} y={0} s={0.5} coat={C.roseDeep} hair="long" hairColor={C.ink} dress mood="closed" armFront={[100, -48]} armBack={[96, -40]} skin={C.skin[0]} />
    <Person x={26} y={0} s={0.5} flip coat={C.ochre} hair="short" hairColor={C.ink} mood="closed" armFront={[100, -48]} armBack={[96, -40]} skin={C.skin[3]} />
  </g>
);
const Workshop = () => (
  <g>
    <Shape d="M-70 -70 L30 -70 L30 -56 L-70 -56 Z" fill="#a87448" />
    <Ink d="M-60 -56 L-60 0 M20 -56 L20 0 M20 -70 L20 -140" w={5} color="#7a4b2a" />
    <g transform="translate(80 -40) rotate(-30)">
      <Shape d="M-6 0 L6 0 L6 80 L-6 80 Z" fill="#a87448" />
      <Shape d="M-26 -14 L26 -14 L26 6 L-26 6 Z" fill={C.gray} />
    </g>
  </g>
);

export const OwnSuccess: React.FC<SceneProps> = ({t, a, b}) => {
  const tMany = S(49);
  const tRich = S(50);
  const tEmp = W(50, 'empatía');
  const tFam = W(50, 'familiar');
  const items: [React.ReactNode, string][] = [
    [<Plant key="p" />, 'un huerto'],
    [<Dinner key="d" t={t} />, 'una mesa compartida'],
    [<OpenBook key="b" />, 'un buen libro'],
    [<Embrace key="e" />, 'un abrazo'],
    [<Workshop key="w" />, 'un oficio'],
  ];
  const camX = lerp(960, 2860, eio(t, tRich - 0.6, 1.8));
  return (
    <g>
      <g transform={`translate(${960 - camX} 0)`}>
        <Numeral t={t} at={a + 0.1} n="2." word="tu propia definición de éxito" />
        {/* vitrina de trofeos */}
        <Shape d="M120 260 L1800 260 L1800 860 L120 860 Z" fill="#8a5a34" />
        {items.map(([el, label], i) => {
          const x = 290 + i * 335;
          const p = pop(t, tMany - 1.8 + i * 1.1, 0.6);
          return (
            <g key={i}>
              <Shape d={`M${x - 150} 300 L${x + 150} 300 L${x + 150} 820 L${x - 150} 820 Z`} fill="#f4e9d3" />
              <rect x={x - 150} y={300} width={300} height={520} fill={C.honey} opacity={0.18 * p} />
              <g transform={`translate(${x} 680) scale(${p})`}>{el}</g>
              <Shape d={`M${x - 100} 720 L${x + 100} 720 L${x + 100} 770 L${x - 100} 770 Z`} fill={C.gold} opacity={clamp(p)} />
              <text x={x} y={754} textAnchor="middle" fontFamily={FELL} fontStyle="italic" fontSize={26} fill={C.ink} opacity={clamp(p)}>
                {label}
              </text>
            </g>
          );
        })}
        <Write id="s20a" x={960} y={950} p={pr(t, W(49, 'nada que ver'), 1.0)} size={48} color={C.sageDark}>
          muchas formas de tener éxito
        </Write>
        {/* el hombre solo, sobre su montaña de monedas, mira una ventana encendida */}
        <g>
          {Array.from({length: 9}, (_, row) =>
            Array.from({length: 10 - row}, (_, k) => {
              const x = 2640 - (10 - row) * 19 + k * 38 + (row % 2) * 6;
              const y = 905 - row * 24;
              return <Coin key={`${row}-${k}`} x={x} y={y} r={21} />;
            }),
          )}
          <Person x={2630} y={706} s={0.9} coat={C.ink} hair="bald" hairColor={C.gray} tie={C.gold} mood={t > tEmp ? 'sad' : 'neutral'} sit armFront={[40, 30]} skin={C.skin[0]} />
          <Shape d="M3120 260 L3460 260 L3460 560 L3120 560 Z" fill={C.honey} />
          <Ink d="M3290 260 L3290 560 M3120 410 L3460 410" />
          <circle cx={3290} cy={410} r={260} fill={C.honey} opacity={0.2} filter="url(#soft)" />
          <g opacity={eo(t, tFam - 0.6, 0.8)}>
            <Person x={3220} y={550} s={0.36} coat={C.sage} hair="bun" hairColor={C.ink} mood="smile" dress armFront={[80, 20]} skin={C.skin[1]} />
            <Person x={3360} y={550} s={0.36} flip coat={C.slate} hair="short" hairColor={C.ink} mood="smile" armFront={[80, 20]} skin={C.skin[2]} />
            <Person x={3290} y={550} s={0.36} child coat={C.ochre} hair="curly" hairColor={C.ink} mood="smile" armFront={[150, 0]} skin={C.skin[3]} />
          </g>
          <Ink d="M2700 470 C2850 380 2980 360 3100 380" draw={eo(t, tEmp - 0.3, 1.0)} w={1.6} color={C.inkSoft} strokeDasharray="6 9" />
          <Write id="s20b" x={2860} y={1000} p={pr(t, tEmp, 1.0)} size={46} color={C.slate}>
            rico en dinero, pobre en empatía
          </Write>
        </g>
      </g>
    </g>
  );
};

// ───────── Escena 21: «Tercero: más que un currículum» ─────────
const SIL = 'M960 120 C1080 120 1150 210 1150 330 C1150 430 1100 500 1040 530 L1040 600 C1240 630 1420 720 1460 1000 L1460 1080 L460 1080 L460 1000 C500 720 680 630 880 600 L880 530 C820 500 770 430 770 330 C770 210 840 120 960 120 Z';
export const Identity: React.FC<SceneProps> = ({t, a, b}) => {
  const tEss = S(52);
  const tCv = W(52, 'currículum');
  const fill = eo(t, a + 0.6, 1.2);
  const memories: [number, number, React.ReactNode, string][] = [
    [880, 300, <g key="m"><Ink d="M-14 20 L-14 -24 L18 -32 L18 12" w={3} color={C.cream} /><circle cx={-20} cy={20} r={8} fill={C.cream} /><circle cx={12} cy={12} r={8} fill={C.cream} /></g>, 'una canción'],
    [1050, 330, <g key="h"><Heart x={0} y={0} s={1.1} fill={C.rose} /></g>, 'un amor'],
    [700, 780, <g key="b"><circle cx={-30} cy={10} r={20} fill="none" stroke={C.cream} strokeWidth={3} /><circle cx={30} cy={10} r={20} fill="none" stroke={C.cream} strokeWidth={3} /><Ink d="M-30 10 L-6 -18 L22 -18 L30 10 M-6 -18 L0 10 L22 -18" w={3} color={C.cream} /></g>, 'la bici de la infancia'],
    [960, 720, <g key="d"><Ink d="M-30 10 L-30 -10 Q0 -22 26 -10 L26 10 M26 -10 L40 -26 L44 -12 M-30 -6 L-44 -16" w={3} color={C.cream} /></g>, 'un perro'],
    [1220, 800, <g key="c"><Ink d="M-34 18 L-34 -10 L-20 -10 L-20 -30 L0 -30 L0 -4 L16 -4 L16 -24 L34 -24 L34 18" w={3} color={C.cream} /></g>, 'una ciudad'],
    [960, 930, <g key="l"><Ink d="M-30 -18 L30 -18 L30 18 L-30 18 Z M-30 -18 L0 4 L30 -18" w={3} color={C.cream} /></g>, 'una carta'],
    [960, 470, <g key="s"><circle r={26} fill="none" stroke={C.cream} strokeWidth={3} /><Ink d="M-12 6 Q0 18 12 6" w={3} color={C.cream} /><circle cx={-9} cy={-6} r={3} fill={C.cream} /><circle cx={9} cy={-6} r={3} fill={C.cream} /></g>, 'una risa'],
  ];
  const cardIn = eo(t, tCv - 0.5, 0.8);
  return (
    <g>
      <Numeral t={t} at={a + 0.1} n="3." word="más que tus logros" />
      <Cam t={t} t0={tEss} t1={b} from={[960, 560, 1.0]} to={[960, 590, 0.88]}>
        <path d={SIL} fill={C.night} opacity={fill} />
        <Ink d={SIL} draw={eo(t, a, 1.2)} w={3} />
        {/* constelación que une los recuerdos */}
        <Ink d={memories.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} draw={eo(t, a + 1.4, 5)} w={1.2} color={C.honey} strokeDasharray="3 7" />
        {memories.map(([x, y, el, label], i) => {
          const p = pop(t, a + 1.2 + i * 0.75, 0.5);
          return (
            <g key={i} opacity={clamp(p)}>
              <g transform={`translate(${x} ${y}) scale(${p})`}>{el}</g>
              <text x={x} y={y + 54} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={26} fill={C.honey}>
                {label}
              </text>
            </g>
          );
        })}
        {Array.from({length: 30}, (_, i) => (
          <circle key={i} cx={560 + ((i * 263) % 800)} cy={260 + ((i * 151) % 780)} r={1.6 + (i % 3)} fill={C.cream} opacity={fill * (0.3 + 0.4 * Math.abs(Math.sin(t * 1.5 + i)))} />
        ))}
        {/* la tarjeta de presentación: ridículamente pequeña */}
        {cardIn > 0 ? (
          <g transform={`translate(${lerp(1700, 1500, cardIn)} ${lerp(200, 380, cardIn) + Math.sin(t * 2) * 6}) rotate(${-8 + settle(t, tCv, 6, 1, 1.5)}) scale(0.7)`}>
            <Card text="CONTABLE" w={200} h={110} size={28} />
          </g>
        ) : null}
      </Cam>
      <Write id="s21a" x={960} y={1030} p={pr(t, tCv + 0.2, 1.0)} size={46} color={C.ink}>
        lo que nunca cabrá en un currículum
      </Write>
    </g>
  );
};

// ───────── Escena 22: la pregunta, otra vez ─────────
export const PartyReprise: React.FC<SceneProps> = (p) => <Party {...p} reprise />;

// ───────── Escena 23: «¿Y tú qué piensas?» ─────────
export const YourView: React.FC<SceneProps> = ({t, a, b}) => {
  const tQ = S(56);
  const tMoney = W(56, 'dinero');
  const tHuman = W(56, 'humano');
  const tilt = Math.sin((t - a) * 1.1) * 9 * Math.exp(-(t - a) * 0.12) + settle(t, tHuman, 4, 1, 1.2);
  return (
    <g>
      <Write id="s23a" x={960} y={150} p={pr(t, a + 0.2, 1.2)} size={84} weight={700}>
        ¿Y tú qué piensas?
      </Write>
      <Cam t={t} t0={a} t1={b} from={[960, 600, 0.95]} to={[960, 600, 1.02]}>
        <Balance
          x={960}
          y={330}
          s={0.95}
          tilt={tilt}
          left={
            <g transform={`scale(${pop(t, tMoney - 0.2, 0.5)})`}>
              <Coin x={-30} y={-12} r={18} />
              <Coin x={22} y={-14} r={18} />
              <Coin x={-4} y={-28} r={18} />
              <path d="M-26 -40 L-30 -74 L-14 -58 L0 -80 L14 -58 L30 -74 L26 -40 Z" fill={C.honey} stroke={C.ink} strokeWidth={2} />
            </g>
          }
          right={
            <g transform={`scale(${pop(t, tHuman - 0.2, 0.5)})`}>
              <Person x={-24} y={-6} s={0.28} coat={C.sage} hair="bun" hairColor={C.ink} dress mood="smile" armFront={[50, 0]} skin={C.skin[1]} />
              <Person x={24} y={-6} s={0.28} flip coat={C.ochre} hair="short" hairColor={C.ink} mood="smile" armFront={[50, 0]} skin={C.skin[3]} />
              <Heart x={0} y={-110} s={0.9} fill={C.brick} />
            </g>
          }
        />
        <Write id="s23b" x={520} y={900} p={pr(t, tMoney, 0.9)} size={50} color={C.gold}>
          ¿dinero y estatus…
        </Write>
        <Write id="s23c" x={1400} y={900} p={pr(t, tHuman - 0.6, 0.9)} size={50} color={C.brick}>
          …o algo más humano?
        </Write>
      </Cam>
      <rect x={0} y={0} width={0} height={0} opacity={tQ ? 0 : 0} />
    </g>
  );
};

// ───────── Escena 24: despedida ─────────
const ThumbUp = () => (
  <g>
    <Shape d="M-60 -20 L-36 -20 L-36 52 L-60 52 Z" fill={C.slate} />
    <Shape d="M-36 -14 L10 -14 C30 -14 34 4 24 10 C34 14 34 28 24 32 C32 36 30 50 20 52 L-36 52 Z" fill={C.skin[0]} />
    <Shape d="M-20 -14 C-18 -40 -10 -64 6 -64 C18 -64 18 -48 12 -30 L10 -14 Z" fill={C.skin[0]} />
  </g>
);
const BellIcon = ({t, at}: {t: number; at: number}) => (
  <g transform={`rotate(${settle(t, at + 0.3, 18, 2.2, 2.4)} 0 -56)`}>
    <Shape d="M-40 30 C-40 -10 -34 -46 0 -50 C34 -46 40 -10 40 30 L52 42 L-52 42 Z" fill={C.honey} />
    <circle cx={0} cy={52} r={10} fill={C.gold} stroke={C.ink} strokeWidth={2} />
    <circle cx={0} cy={-56} r={7} fill={C.gold} stroke={C.ink} strokeWidth={2} />
  </g>
);

export const Outro: React.FC<SceneProps> = ({t, a, b}) => {
  const tCom = W(57, 'comentarios');
  const tLike = W(57, 'like');
  const tSub = W(57, 'suscribirte');
  const icons: [number, React.ReactNode, string][] = [
    [tCom, <Bubble key="c" x={0} y={0} w={130} h={90} tail={[-30, 70]} p={1}><g>{[-30, 0, 30].map((x) => <circle key={x} cx={x} cy={0} r={7} fill={C.ink} />)}</g></Bubble>, 'comenta'],
    [tLike, <ThumbUp key="l" />, 'me gusta'],
    [tSub, <BellIcon key="b" t={t} at={tSub} />, 'suscríbete'],
  ];
  const fadeOut = eo(t, b - 1.4, 1.3);
  return (
    <g>
      <Write id="s24t" x={960} y={330} p={pr(t, a + 0.3, 1.6)} size={92} font={FELL}>
        Ansiedad por el estatus
      </Write>
      <Ink d="M640 380 Q960 400 1280 380" draw={eo(t, a + 1.4, 1.0)} w={2.4} color={C.brick} />
      {icons.map(([at, el, label], i) => {
        const x = 600 + i * 360;
        const p = pop(t, at - 0.2, 0.6);
        return (
          <g key={i} opacity={clamp(p)}>
            <g transform={`translate(${x} 640) scale(${p * 1.3})`}>{el}</g>
            <text x={x} y={800} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={44} fill={C.ink}>
              {label}
            </text>
          </g>
        );
      })}
      <rect x={0} y={0} width={1920} height={1080} fill={C.paper} opacity={fadeOut} />
      <text x={960} y={980} textAnchor="middle" fontFamily={FELLSC} fontSize={22} fill={C.inkSoft} letterSpacing={6} opacity={eo(t, a + 2, 1) * (1 - fadeOut)}>
        GRACIAS POR PENSAR CON NOSOTROS
      </text>
    </g>
  );
};

export const _d = {Ground, lerp};
