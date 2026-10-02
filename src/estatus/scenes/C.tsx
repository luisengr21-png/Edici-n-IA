import React from 'react';
import {Briefcase, Bubble, C, Cam, clamp, Coin, easeInOut, eio, eo, FELL, FELLSC, GOTH, Ground, Heart, Ink, lerp, Person, pop, pr, settle, Shape, Stamp, Write} from '../kit';
import {S, W} from '../timing';
import {SceneProps} from './A';

const phase = (t: number, t0: number, t1: number, f = 0.5) => clamp((t - t0) / f) * clamp((t1 - t) / f);

/** Mano que señala (apunta hacia la izquierda en su orientación base) */
const PointingHand: React.FC<{x: number; y: number; rot: number; s?: number}> = ({x, y, rot, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <Shape d="M120 -38 L320 -48 L320 48 L120 38 Z" fill={C.slate} />
    <Shape d="M110 -44 L132 -44 L132 44 L110 44 Z" fill={C.cream} />
    <Shape d="M110 -40 C70 -50 40 -40 30 -22 L-110 -26 C-130 -26 -132 -4 -112 -2 L20 0 C14 14 20 34 40 44 C70 54 100 48 110 40 Z" fill={C.skin[0]} />
    <Ink d="M40 10 C60 12 80 14 96 12 M44 26 C64 28 84 30 98 26" w={1.8} />
  </g>
);

// ───────── Escena 13: «La trampa de la meritocracia» ─────────
export const Trap: React.FC<SceneProps> = ({t, a, b}) => {
  const tAdor = W(33, 'adorables');
  const tTop = W(33, 'cima');
  const tBottom = W(33, 'fondo');
  const tResp = W(33, 'responsables');
  const handIn = eio(t, tTop - 0.6, 0.8);
  const down = eio(t, tBottom - 0.3, 0.7);
  const rot = lerp(-28, 32, down);
  const hy = lerp(260, 640, down);
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 500, 0.9]} to={[930, 520, 0.96]}>
      <Ground y={940} />
      {/* escalera */}
      <Ink d="M700 940 L800 200 M1000 940 L900 200" w={6} color={C.gold} />
      {Array.from({length: 10}, (_, i) => {
        const y = 900 - i * 76;
        const k = (940 - y) / 740;
        return <Ink key={i} d={`M${700 + 100 * k} ${y} L${1000 - 100 * k} ${y}`} w={5} color={C.gold} />;
      })}
      {/* flores de «adorables» */}
      {[[620, 180], [1080, 160], [560, 420], [1140, 380]].map(([x, y], i) => {
        const p = pop(t, tAdor + i * 0.12, 0.5) * (1 - eo(t, tTop - 0.5, 0.6));
        if (p <= 0) return null;
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${p})`}>
            {[0, 72, 144, 216, 288].map((r) => (
              <ellipse key={r} cx={0} cy={-14} rx={8} ry={14} transform={`rotate(${r})`} fill={C.rose} stroke={C.ink} strokeWidth={1.6} />
            ))}
            <circle r={7} fill={C.honey} stroke={C.ink} strokeWidth={1.6} />
          </g>
        );
      })}
      {/* los de arriba, con medallas */}
      {[0, 1].map((i) => (
        <g key={i}>
          <Person x={820 + i * 70} y={200} s={0.62} flip={i === 1} coat={[C.ink, C.slate][i]} hair={(['short', 'bun'] as const)[i]} hairColor={C.ink} tie={C.gold} mood="smug" armFront={[165, 0]} skin={C.skin[i]} />
          <g transform={`translate(${830 + i * 70} 90) scale(${pop(t, tTop + 0.3 + i * 0.2, 0.5)})`}>
            <Ink d="M-6 -20 L0 0 L6 -20" w={3} color={C.brick} />
            <circle cx={0} cy={8} r={11} fill={C.gold} stroke={C.ink} strokeWidth={1.8} />
          </g>
        </g>
      ))}
      {/* el de abajo, sentado, con su cartel */}
      <Person x={1160} y={940} s={0.9} coat={C.grayDark} hair="curly" hairColor="#2a1c14" mood={t > tResp ? 'sad' : 'worried'} sit armFront={[30, 40]} skin={C.skin[3]} />
      <g transform={`translate(1210 ${lerp(860, 800, eo(t, tResp - 0.4, 0.5))}) rotate(${settle(t, tResp, 5, 1.2, 2)})`} opacity={pr(t, tResp - 0.4, 0.3)}>
        <Ink d="M-40 -60 L0 -100 L40 -60" w={1.6} />
        <Shape d="M-100 -60 L100 -60 L100 0 L-100 0 Z" fill={C.cream} />
        <text y={-20} textAnchor="middle" fontFamily={FELLSC} fontSize={28} fill={C.brick} letterSpacing={2}>
          RESPONSABLE
        </text>
      </g>
      {/* el dedo que juzga */}
      <g opacity={handIn}>
        <PointingHand x={lerp(1900, 1240, handIn)} y={hy} rot={rot} s={0.9} />
      </g>
      <Write id="s13a" x={480} y={560} p={pr(t, tTop, 0.9)} size={46} color={C.gold}>
        «lo merecen»
      </Write>
      <Write id="s13b" x={1480} y={1000} p={pr(t, tResp, 0.9)} size={46} color={C.brick}>
        «es su culpa»
      </Write>
    </Cam>
  );
};

// ───────── Escena 14: «La responsabilidad de los gobiernos» ─────────
const PIPE = 'M300 900 L300 760 L520 760 L520 640 L380 640 L380 500 L760 500 L760 360 L560 360 L560 230 L960 230';
const pipePoint = (u: number): [number, number] => {
  const pts = [[300, 900], [300, 760], [520, 760], [520, 640], [380, 640], [380, 500], [760, 500], [760, 360], [560, 360], [560, 230], [960, 230]];
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    seg.push(d);
    total += d;
  }
  let target = u * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const k = target / seg[i];
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    target -= seg[i];
  }
  return [960, 230];
};

const Gear: React.FC<{x: number; y: number; r: number; rot: number; fill?: string}> = ({x, y, r, rot, fill = C.gray}) => {
  const teeth = Math.round(r / 6);
  const d = Array.from({length: teeth * 2}, (_, i) => {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r + 10;
    return `${i ? 'L' : 'M'}${Math.cos(a) * rr} ${Math.sin(a) * rr}`;
  }).join(' ') + ' Z';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d} fill={fill} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
      <circle r={r * 0.3} fill={C.paper} stroke={C.ink} strokeWidth={2} />
    </g>
  );
};

export const Government: React.FC<SceneProps> = ({t, a, b}) => {
  const tRep = W(35, 'repetir');
  const tReveal = W(35, 'no se corrigen');
  const tEff = W(36, 'esforzarse');
  const tSmart = W(36, 'ser más listo');
  const tSys = W(36, 'sistemas');
  const tPriv = W(36, 'privilegios');
  const reveal = eio(t, tReveal - 0.3, 1.4);
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 520, 1.0]} to={[960, 560, 1.08]}>
      <Ground y={940} />
      {/* maquinaria interior */}
      <g opacity={reveal}>
        <Ink d={PIPE} w={26} color={C.ink} />
        <Ink d={PIPE} w={20} color="#c98a5a" />
        {Array.from({length: 7}, (_, i) => {
          const u = ((t * 0.12 + i / 7) % 1);
          const [x, y] = pipePoint(u);
          return <Coin key={i} x={x} y={y} r={11} />;
        })}
        <Gear x={1180} y={600} r={90} rot={t * 30} />
        <Gear x={1320} y={470} r={60} rot={-t * 45 + 10} fill={C.slateLight} />
        <Gear x={1340} y={720} r={50} rot={-t * 54} fill={C.honey} />
        {/* la base, de donde sale el dinero */}
        {Array.from({length: 5}, (_, i) => (
          <Person key={i} x={180 + i * 60} y={940} s={0.4} coat={[C.grayDark, C.ochre, C.slate, C.sage, C.gray][i]} hair={(['short', 'bun', 'curly', 'bald', 'long'] as const)[i]} hairColor={C.ink} mood="sad" skin={C.skin[i % 4]} />
        ))}
        {/* la cima, adonde vuelve */}
        <Write id="s14p" x={1060} y={180} p={pr(t, tPriv - 0.2, 0.8)} size={44} color={C.gold}>
          privilegios →
        </Write>
        <g transform="translate(1330 230)">
          {[0, 1, 2, 3, 4].map((k) => (
            <Coin key={k} x={(k % 3) * 22 - 22} y={-k * 10} r={16} />
          ))}
        </g>
      </g>
      {/* fachada del edificio, que se vuelve transparente */}
      <g opacity={1 - reveal * 0.82}>
        <Shape d="M220 300 L960 110 L1700 300 Z" fill={C.cream} />
        <Shape d="M240 300 L1680 300 L1680 340 L240 340 Z" fill={C.cream} />
        {Array.from({length: 7}, (_, i) => {
          const x = 330 + i * 210;
          return <Shape key={i} d={`M${x - 34} 340 L${x + 34} 340 L${x + 28} 880 L${x - 28} 880 Z`} fill={C.cream} />;
        })}
        <Shape d="M200 880 L1720 880 L1740 940 L180 940 Z" fill={C.cream} />
        <text x={960} y={260} textAnchor="middle" fontFamily={FELLSC} fontSize={40} fill={C.ink} letterSpacing={8}>
          GOBIERNO
        </text>
      </g>
      {/* el orador con megáfono */}
      <g>
        <Shape d="M820 340 L1100 340 L1100 362 L820 362 Z" fill={C.gray} />
        <Person x={960} y={340} s={0.75} coat={C.ink} hair="short" hairColor={C.gray} tie={C.brick} mood="smile" armFront={[110, -10]} holdFront={<path d="M0 -6 L40 -24 L40 18 L0 6 Z" fill={C.honey} stroke={C.ink} strokeWidth={2} />} />
        <Bubble x={1340} y={150} w={500} h={110} tail={[1060, 140]} p={pr(t, tRep - 0.1, 0.5)}>
          <Write id="s14a" x={1340} y={166} p={pr(t, tRep + 0.2, 1.0)} size={44} weight={700}>
            ¡Sociedad de oportunidades!
          </Write>
        </Bubble>
      </g>
      <g>
        <Write id="s14b" x={480} y={1010} p={pr(t, tEff - 0.2, 0.8)} size={44} color={C.inkSoft}>
          «esfuérzate más»
        </Write>
        <Ink d="M340 1000 L620 994" draw={eo(t, tSmart + 0.6, 0.4)} w={4} color={C.brick} />
        <Write id="s14c" x={1440} y={1010} p={pr(t, tSmart - 0.2, 0.8)} size={44} color={C.inkSoft}>
          «sé más listo»
        </Write>
        <Ink d="M1310 1000 L1570 994" draw={eo(t, tSmart + 1.0, 0.4)} w={4} color={C.brick} />
      </g>
      <Stamp x={960} y={600} t={t} at={tSys + 0.4} text="SISTEMA DISEÑADO" size={50} rot={-6} />
    </Cam>
  );
};

// ───────── Escena 15: «De desafortunados a perdedores» ─────────
export const Fortune: React.FC<SceneProps> = ({t, a, b}) => {
  const tMer = W(37, 'merece');
  const tMed = S(38);
  const tDes = W(38, 'desafortunados');
  const tGod = W(38, 'diosa');
  const tNow = S(39);
  const tLos = W(39, 'perdedores');
  const intro = phase(t, a - 1, tMed + 0.2, 0.6);
  const wheel = t >= tMed - 0.3;
  const freeze = eio(t, tNow, 1.2);
  const ang = t < tNow ? (t - tMed) * 22 : (tNow - tMed) * 22 + 6 * eo(t, tNow, 1.2);
  return (
    <g>
      {intro > 0 ? (
        <g opacity={intro}>
          <Ground y={860} x0={500} x1={1420} />
          <Person x={960} y={860} s={1.4} coat={C.grayDark} hair="long" hairColor="#2a1c14" mood="sad" sit armFront={[40, 30]} skin={C.skin[2]} />
          <Write id="s15a" x={960} y={260} p={pr(t, a + 0.3, 1.0)} size={60} font={FELL}>
            la pobreza
          </Write>
          <Stamp x={1100} y={420} t={t} at={tMer} text="MERECIDA" size={64} />
        </g>
      ) : null}
      {wheel ? (
        <g opacity={eo(t, tMed - 0.3, 0.6)}>
          {/* pergamino con marco iluminado */}
          <Shape d="M180 60 L1740 60 L1740 1020 L180 1020 Z" fill="#efe0bd" />
          <rect x={210} y={90} width={1500} height={900} fill="none" stroke={C.gold} strokeWidth={10} />
          <rect x={232} y={112} width={1456} height={856} fill="none" stroke="#3f4f8a" strokeWidth={4} />
          {Array.from({length: 18}, (_, i) => (
            <circle key={i} cx={260 + i * 82} cy={101} r={5} fill={C.brick} />
          ))}
          <g filter={freeze > 0 ? undefined : undefined} opacity={1 - freeze * 0.45}>
            {/* la rueda */}
            <g transform={`translate(760 560) rotate(${ang})`}>
              <circle r={300} fill="none" stroke={C.ink} strokeWidth={16} />
              <circle r={300} fill="none" stroke={C.gold} strokeWidth={10} />
              {Array.from({length: 8}, (_, i) => {
                const r = (i / 8) * Math.PI * 2;
                return <Ink key={i} d={`M0 0 L${Math.cos(r) * 300} ${Math.sin(r) * 300}`} w={6} color="#7a4b2a" />;
              })}
              <circle r={40} fill={C.gold} stroke={C.ink} strokeWidth={3} />
            </g>
            {/* las figuras sobre la rueda (contrarrotan para quedar en pie) */}
            {[0, 1, 2, 3].map((i) => {
              const r = ((ang + i * 90) * Math.PI) / 180;
              const x = 760 + Math.cos(r) * 300;
              const y = 560 + Math.sin(r) * 300;
              const top = Math.sin(r) < -0.5;
              return (
                <Person
                  key={i}
                  x={x}
                  y={y}
                  s={0.55}
                  coat={['#7a2a3a', '#3f4f8a', '#5f7a5c', '#9a6b3a'][i]}
                  hair="short"
                  hairColor={C.ink}
                  hat={top ? 'crown' : 'none'}
                  mood={top ? 'smug' : Math.sin(r) > 0.5 ? 'sad' : 'worried'}
                  armFront={[120, 10]}
                  skin={C.skin[i]}
                />
              );
            })}
            {/* la diosa Fortuna, con los ojos vendados */}
            <g opacity={eo(t, tGod - 0.5, 0.8)}>
              <Person x={1280} y={880} s={1.5} coat="#3f4f8a" hair="long" hairColor="#c9a050" dress mood="closed" armFront={[110, 10]} armBack={[100, 20]} skin={C.skin[0]} />
              <Ink d="M1268 485 L1318 487" w={9} color={C.brick} />
            </g>
          </g>
          <text x={1300} y={230} textAnchor="middle" fontFamily={GOTH} fontSize={70} fill="#5a1f1f" opacity={eo(t, tDes - 0.4, 0.8) * (1 - freeze * 0.6)}>
            Desafortunados
          </text>
          {/* el presente: todo se vuelve gris y llega el sello */}
          <rect x={180} y={60} width={1560} height={960} fill={C.gray} opacity={freeze * 0.35} />
          <Write id="s15b" x={1500} y={230} p={pr(t, tNow + 0.8, 1.0)} size={40} color={C.ink}>
            (un país «meritocrático»)
          </Write>
          <Stamp x={760} y={840} t={t} at={tLos} text="PERDEDORES" size={86} rot={-10} />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 16: «El veredicto sobre tu carácter» ─────────
export const Verdict: React.FC<SceneProps> = ({t, a, b}) => {
  const tFired = S(41);
  const tBad = W(41, 'mala suerte');
  const tPos = S(42);
  const tVer = W(42, 'veredicto');
  const tChar = W(42, 'carácter');
  const dice = phase(t, a - 1, tFired + 0.1, 0.5);
  const fired = phase(t, tFired - 0.2, tPos + 0.2, 0.5);
  const doc = t > tPos - 0.3 ? eo(t, tPos - 0.3, 0.6) : 0;
  const roll = eo(t, a + 0.2, 1.4);
  const dust = eio(t, a + 2.4, 1.6);
  const die = (x: number, y: number, rot: number, n: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-50} y={-50} width={100} height={100} rx={16} fill={C.cream} stroke={C.ink} strokeWidth={3} />
      {(n === 5 ? [[-25, -25], [25, -25], [0, 0], [-25, 25], [25, 25]] : [[-25, -25], [0, 0], [25, 25]]).map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={8} fill={C.ink} />
      ))}
    </g>
  );
  return (
    <g>
      {dice > 0 ? (
        <g opacity={dice * (1 - dust)}>
          {die(lerp(200, 820, roll), 560 + Math.abs(Math.sin(roll * 9)) * -60 * (1 - roll), roll * 520, 5)}
          {die(lerp(100, 1060, roll), 600 + Math.abs(Math.sin(roll * 8 + 1)) * -50 * (1 - roll), roll * 400 + 20, 3)}
          <Write id="s16a" x={960} y={300} p={pr(t, a + 0.6, 1.0)} size={60} font={FELL}>
            la suerte
          </Write>
        </g>
      ) : null}
      {dust > 0 && dice > 0
        ? Array.from({length: 40}, (_, i) => {
            const ang = (i / 40) * Math.PI * 2;
            const r = dust * (80 + (i % 7) * 30);
            return <circle key={i} cx={940 + Math.cos(ang) * r} cy={580 + Math.sin(ang) * r - dust * 60} r={3 * (1 - dust)} fill={C.ink} opacity={1 - dust} />;
          })
        : null}
      {fired > 0 ? (
        <g opacity={fired}>
          <Ground y={880} x0={500} x1={1420} />
          <Person
            x={900}
            y={880}
            s={1.4}
            coat={C.slate}
            hair="short"
            hairColor="#3d2618"
            tie={C.ochre}
            mood="sad"
            armFront={[80, -10]}
            armBack={[70, -10]}
            holdFront={
              <g>
                <Shape d="M-20 -40 L110 -40 L100 40 L-10 40 Z" fill="#c9a77c" />
                <path d="M10 -40 L14 -70 L36 -64 L34 -40 Z" fill={C.sage} stroke={C.ink} strokeWidth={1.6} />
                <circle cx={70} cy={-52} r={12} fill={C.rose} stroke={C.ink} strokeWidth={1.6} />
              </g>
            }
          />
          <Bubble x={1300} y={420} w={330} h={110} tail={[1020, 470]} p={pr(t, tBad - 0.4, 0.5)}>
            <Write id="s16b" x={1300} y={436} p={pr(t, tBad - 0.1, 0.7)} size={52}>
              «mala suerte»
            </Write>
          </Bubble>
          <Ink d="M1160 420 L1440 400" draw={eo(t, tBad + 0.9, 0.3)} w={6} color={C.brick} />
          <Write id="s16c" x={1300} y={560} p={pr(t, tBad + 1.0, 0.6)} size={40} color={C.brick}>
            nadie te creerá
          </Write>
        </g>
      ) : null}
      {doc > 0 ? (
        <g opacity={doc}>
          <g transform={`translate(960 560) scale(${lerp(0.8, 1, doc)}) rotate(-3)`}>
            <Shape d="M-300 -420 L300 -420 L300 420 L-300 420 Z" fill={C.cream} />
            <text y={-340} textAnchor="middle" fontFamily={FELLSC} fontSize={44} fill={C.ink} letterSpacing={6}>
              CURRÍCULUM
            </text>
            {Array.from({length: 12}, (_, i) => (
              <Ink key={i} d={`M-230 ${-260 + i * 50} L${150 - (i % 3) * 60} ${-260 + i * 50}`} w={2} color={C.gray} />
            ))}
            <circle cx={190} cy={-200} r={60} fill={C.honey} stroke={C.ink} strokeWidth={2} />
          </g>
          <Stamp x={980} y={600} t={t} at={tVer} text="VEREDICTO" size={96} rot={-14} />
          <Write id="s16d" x={980} y={790} p={pr(t, tChar - 0.2, 0.8)} size={64} color={C.brick} weight={700}>
            sobre tu carácter
          </Write>
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 17: «Detrás de cada estadística» ─────────
export const Statistics: React.FC<SceneProps> = ({t, a, b}) => {
  const tPeople = S(44);
  const tShame = W(44, 'vergüenza');
  const tLie = W(44, 'mienten');
  const tBroken = W(44, 'rotas');
  const chart = phase(t, a - 1, tPeople + 0.5, 0.8);
  const line = eio(t, a + 0.6, 6);
  const pts = Array.from({length: 40}, (_, i) => {
    const u = i / 39;
    return [360 + u * 1200, 820 - Math.pow(u, 2.4) * 520 - Math.sin(u * 17) * 8] as [number, number];
  });
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  const vignette = (k: number, at: number, children: React.ReactNode, label: string) => {
    const p = eo(t, at - 0.4, 1.0);
    if (p <= 0) return null;
    const x = 380 + k * 580;
    return (
      <g opacity={p}>
        <Shape d={`M${x - 250} 200 L${x + 250} 200 L${x + 250} 800 L${x - 250} 800 Z`} fill="#ece4f0" />
        {/* luz de atardecer por la ventana */}
        <path d={`M${x - 250} 200 L${x - 60} 200 L${x + 250} 640 L${x + 250} 800 Z`} fill={C.honey} opacity={0.25} />
        {children}
        <text x={x} y={870} textAnchor="middle" fontFamily={FELL} fontStyle="italic" fontSize={36} fill={C.ink}>
          {label}
        </text>
      </g>
    );
  };
  return (
    <g>
      {chart > 0 ? (
        <g opacity={chart}>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0 L0 0 0 40" fill="none" stroke="#b9c7cf" strokeWidth={1} />
          </pattern>
          <rect x={300} y={200} width={1320} height={680} fill="url(#grid)" opacity={0.7} />
          <Ink d="M340 200 L340 860 L1620 860" w={2.6} />
          <Ink d={d} draw={line} w={3} color={C.slate} />
          <text x={1580} y={910} textAnchor="end" fontFamily={FELL} fontStyle="italic" fontSize={34} fill={C.inkSoft} opacity={eo(t, W(43, 'mundo moderno'), 0.8)}>
            el «mundo moderno» →
          </text>
        </g>
      ) : null}
      {vignette(
        0,
        tShame,
        <g>
          <Shape d={`M240 260 L520 260 L520 470 L240 470 Z`} fill="#cfdde6" />
          <Ink d="M380 260 L380 470 M240 365 L520 365" />
          <Person x={330} y={780} s={1.1} coat={C.slateLight} hair="short" hairColor={C.ink} mood="sad" sit armFront={[100, 20]} headTilt={10} holdFront={<g><Shape d="M-10 -50 L80 -50 L80 20 L-10 20 Z" fill={C.cream} /><text x={35} y={-24} textAnchor="middle" fontFamily={FELLSC} fontSize={14} fill={C.ink}>EMPLEOS</text></g>} skin={C.skin[1]} />
        </g>,
        'vergüenza',
      )}
      {vignette(
        1,
        tLie,
        <g>
          <Person x={960} y={780} s={1.2} coat={C.roseDeep} hair="bun" hairColor="#3d2618" dress mood="sad" armFront={[150, -40]} skin={C.skin[2]} />
          {/* la máscara sonriente sostenida frente a la cara */}
          <g transform="translate(1004 456)">
            <ellipse rx={30} ry={36} fill={C.cream} stroke={C.ink} strokeWidth={2.2} />
            <circle cx={-10} cy={-8} r={3} fill={C.ink} />
            <circle cx={10} cy={-8} r={3} fill={C.ink} />
            <path d="M-14 10 Q0 24 14 10" stroke={C.ink} strokeWidth={2.2} fill="none" />
          </g>
        </g>,
        'aparentar',
      )}
      {vignette(
        2,
        tBroken,
        <g>
          <Person x={1540} y={780} s={1.2} coat={C.gray} hair="long" hairColor={C.grayDark} mood="closed" armFront={[60, 30]} armBack={[50, 30]} skin={C.skin[0]} />
          {/* grietas reparadas con oro (kintsugi) */}
          <Ink d="M1520 540 L1545 600 L1530 640 L1556 700" w={3.5} color={C.gold} draw={eo(t, tBroken + 0.4, 1.6)} />
          <Ink d="M1548 470 L1560 492 L1552 510" w={3} color={C.gold} draw={eo(t, tBroken + 1.0, 1.0)} />
        </g>,
        'rotas… y reparables',
      )}
    </g>
  );
};

// ───────── Escena 18: «¿Cómo superarlo?» ─────────
export const HowTo: React.FC<SceneProps> = ({t, a}) => {
  const sprout = eo(t, a + 0.8, 2.0);
  return (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill={C.cream} opacity={eo(t, a, 0.8) * 0.6} />
      <Write id="s18" x={960} y={500} p={pr(t, a + 0.15, 1.6)} size={150} weight={700}>
        ¿Cómo superarlo?
      </Write>
      <Ink d="M960 760 C958 720 962 690 960 640" draw={sprout} w={4} color={C.sageDark} />
      <path transform={`translate(960 680) scale(${pop(t, a + 1.6, 0.6)})`} d="M0 0 C-20 -30 -60 -30 -70 -10 C-50 4 -20 6 0 0 Z" fill={C.sage} stroke={C.ink} strokeWidth={2} />
      <path transform={`translate(960 660) scale(${pop(t, a + 2.0, 0.6)})`} d="M0 0 C20 -34 64 -34 74 -12 C52 4 20 6 0 0 Z" fill={C.sage} stroke={C.ink} strokeWidth={2} />
      <Ink d="M880 762 Q960 750 1040 762" w={2.4} />
    </g>
  );
};

export const _c = {Briefcase, Heart, easeInOut, Ground};
