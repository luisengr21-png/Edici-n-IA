import React from 'react';
import {Briefcase, Bubble, C, Cam, clamp, Coin, easeInOut, eio, eo, FELL, FELLSC, Ground, Heart, Ink, lerp, Person, Phone, pop, pr, settle, Shape, Stamp, Write} from '../kit';
import {S, W} from '../timing';
import {Car, SceneProps, Balance} from './A';

/** opacidad de una fase interna de escena con fundidos suaves */
const phase = (t: number, t0: number, t1: number, f = 0.5) => clamp((t - t0) / f) * clamp((t1 - t) / f);

// ───────── Escena 7: «La vulnerabilidad detrás del brillo» ─────────
export const Phone7: React.FC<SceneProps> = ({t, a, b}) => {
  const tVan = W(11, 'vanidad');
  const tFri = W(11, 'frivolidad');
  const tIn = S(12);
  const tLove = W(12, 'amor');
  const tTri = S(13);
  const xray = eio(t, tIn + 0.2, 1.4);
  const main = phase(t, a - 1, tTri + 0.3, 0.6);
  const panels: [string, number][] = [
    ['vecino', W(13, 'vecino')],
    ['amigo', W(13, 'amigo')],
    ['compañero', W(13, 'compañero')],
  ];
  return (
    <g>
      {main > 0 ? (
        <g opacity={main}>
          <Cam t={t} t0={tIn - 0.2} t1={tIn + 1.6} from={[960, 560, 1.0]} to={[940, 440, 1.9]}>
            <Ground y={900} x0={560} x1={1360} />
            <Person
              x={960}
              y={900}
              s={1.8}
              coat={C.ochre}
              hair="long"
              hairColor="#24170f"
              mood={t < tIn ? 'smug' : 'worried'}
              armFront={[150, -70]}
              holdFront={<Phone glow={1 - xray} />}
              armBack={[6, -8]}
              dress
              skin={C.skin[1]}
              headTilt={-6}
            />
            {/* «¿vanidad? ¿frivolidad?» escritos y tachados */}
            <Write id="s7a" x={680} y={380} p={pr(t, tVan - 0.2, 0.7)} size={56} color={C.slate}>
              ¿vanidad?
            </Write>
            <Write id="s7b" x={1260} y={440} p={pr(t, tFri - 0.2, 0.7)} size={56} color={C.slate}>
              ¿frivolidad?
            </Write>
            <Ink d="M580 372 L790 360" draw={eo(t, tFri + 1.0, 0.4)} w={4} color={C.brick} />
            <Ink d="M1135 432 L1395 420" draw={eo(t, tFri + 1.4, 0.4)} w={4} color={C.brick} />
            {/* radiografía tierna: dentro hay una niña que tiende los brazos */}
            {xray > 0 ? (
              <g opacity={xray}>
                <circle cx={942} cy={548} r={lerp(6, 52, xray)} fill={C.rose} stroke={C.ink} strokeWidth={2} />
                <circle cx={942} cy={548} r={lerp(6, 52, xray) + 9} fill="none" stroke={C.roseDeep} strokeWidth={1.2} strokeDasharray="3 5" />
                <g transform={`translate(${Math.sin(t * 22) * 1.2} 0)`}>
                  <Person x={936} y={592} s={0.36} child coat={C.cream} hair="bun" hairColor="#24170f" mood="sad" armFront={[150, 10]} armBack={[140, 10]} dress skin={C.skin[1]} />
                </g>
                <Heart x={972} y={520} s={pop(t, tLove, 0.6) * 0.45} fill={C.brick} />
              </g>
            ) : null}
          </Cam>
          <Write id="s7c" x={960} y={1010} p={pr(t, W(12, 'vulnerabilidad'), 1.2) * (1 - pr(t, tTri - 0.5, 0.5))} size={54} color={C.brick}>
            necesidad de amor y reconocimiento
          </Write>
        </g>
      ) : null}
      {/* tríptico */}
      {panels.map(([k, at], i) => {
        const p = eio(t, at - 0.4, 0.7);
        if (p <= 0) return null;
        const x = 120 + i * 580;
        return (
          <g key={k} transform={`translate(0 ${(1 - p) * 1100})`}>
            <Shape d={`M${x} 140 L${x + 520} 140 L${x + 520} 900 L${x} 900 Z`} fill={[C.cream, '#f6ead3', '#efe3cc'][i]} />
            <Ink d={`M${x + 30} 800 L${x + 490} 800`} w={2} />
            {i === 0 ? (
              <g>
                <g transform={`translate(${x + 320} 800) scale(1.1)`}>
                  <Car />
                </g>
                <Person x={x + 140} y={800} s={1.1} coat={C.slate} hair="bald" hairColor={C.gray} mood="smug" armFront={[90 + Math.sin(t * 6) * 15, 20]} skin={C.skin[0]} />
              </g>
            ) : i === 1 ? (
              <g>
                <Shape d={`M${x + 260} 360 L${x + 460} 360 L${x + 460} 520 L${x + 260} 520 Z`} fill="#bfe1ea" />
                <path d={`M${x + 260} 470 Q${x + 360} 450 ${x + 460} 480 L${x + 460} 520 L${x + 260} 520 Z`} fill={C.honey} />
                <circle cx={x + 420} cy={395} r={18} fill={C.ochre} />
                <Person x={x + 180} y={800} s={1.1} coat={C.sage} hair="curly" hairColor="#3d2618" mood="smile" armFront={[150, -40]} holdFront={<Phone />} skin={C.skin[3]} />
              </g>
            ) : (
              <Person x={x + 260} y={800} s={1.2} coat={C.brick} hair="short" hairColor="#3d2618" mood="smug" tie={C.gold} armFront={[10, 10]} skin={C.skin[2]} />
            )}
            {i === 2 ? (
              <g>
                <text x={x + 260} y={620} textAnchor="middle" fontFamily={FELLSC} fontSize={34} fill={C.gold} letterSpacing={6}>
                  LUXE
                </text>
                <text x={x + 230} y={790} textAnchor="middle" fontFamily={FELLSC} fontSize={18} fill={C.cream} letterSpacing={3}>
                  LUXE
                </text>
              </g>
            ) : null}
            <Bubble x={x + 400} y={250} w={140} h={100} tail={[x + 330, 330]} p={pr(t, at + 0.6, 0.5)}>
              <Heart x={x + 400} y={256} s={1.3} fill={C.brick} />
            </Bubble>
            <text x={x + 260} y={880} textAnchor="middle" fontFamily={FELL} fontSize={34} fontStyle="italic" fill={C.ink}>
              {['el vecino', 'el amigo', 'el compañero'][i]}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ───────── Escena 8: «¡Puedes hacer cualquier cosa!» ─────────
const Doors: React.FC<{p: number; t: number}> = ({p, t}) => (
  <g>
    {Array.from({length: 9}, (_, i) => {
      const k = Math.pow(0.78, i);
      const w = 1500 * k;
      const h = 900 * k;
      const cx = 960;
      const cy = 520 - (1 - k) * 40;
      const show = clamp(p * 9 - i);
      if (show <= 0) return null;
      return (
        <g key={i} opacity={show}>
          <Ink d={`M${cx - w / 2} ${cy + h / 2} L${cx - w / 2} ${cy - h / 2} L${cx + w / 2} ${cy - h / 2} L${cx + w / 2} ${cy + h / 2}`} w={2.4 * k + 0.6} />
          {[-1, 1].map((sd) => {
            const dx = cx + sd * w * 0.36;
            const dw = w * 0.1;
            const dh = h * 0.5;
            const open = clamp(Math.sin(t * 0.9 + i + sd) * 0.5 + 0.5);
            return (
              <g key={sd}>
                <rect x={dx - dw / 2} y={cy + h / 2 - dh} width={dw} height={dh} fill={C.honey} opacity={0.7} />
                <path
                  d={`M${dx - dw / 2} ${cy + h / 2 - dh} L${dx - dw / 2 + dw * (1 - open * 0.7)} ${cy + h / 2 - dh - dh * 0.05 * open} L${dx - dw / 2 + dw * (1 - open * 0.7)} ${cy + h / 2 + dh * 0.05 * open} L${dx - dw / 2} ${cy + h / 2} Z`}
                  fill={[C.brick, C.sage, C.slate, C.ochre][(i + (sd > 0 ? 1 : 0)) % 4]}
                  stroke={C.ink}
                  strokeWidth={1.6 * k + 0.4}
                />
              </g>
            );
          })}
        </g>
      );
    })}
  </g>
);

export const Anything: React.FC<SceneProps> = ({t, a, b}) => {
  const tChalk = W(14, '¡podemos');
  const tKid = S(15);
  const tDoors = S(16);
  const tFail = W(17, 'fallamos');
  const tTop = W(18, 'cima');
  const school = phase(t, a - 1, tDoors + 0.2, 0.6);
  const doors = phase(t, tDoors - 0.2, S(17) + 0.3, 0.6);
  const mount = phase(t, S(17) - 0.2, b + 2, 0.6);
  const climb = eio(t, S(17) + 0.3, tFail - S(17));
  const slip = eio(t, tFail, 1.4);
  const prog = Math.min(climb, 1) * 0.62 - slip * 0.3;
  // ladera: de (360,900) a (1240,240)
  const px = lerp(360, 1240, prog);
  const py = lerp(900, 240, prog);
  return (
    <g>
      {school > 0 ? (
        <g opacity={school}>
          <Cam t={t} t0={a} t1={tDoors} from={[960, 540, 1.0]} to={[900, 520, 1.1]}>
            <Shape d="M360 150 L1560 150 L1560 620 L360 620 Z" fill="#3f5a4a" w={6} color="#7a4b2a" />
            <Write id="s8a" x={960} y={360} p={pr(t, tChalk - 1.6, 1.4)} size={78} color="#f4efe3" weight={700}>
              ¡PUEDES SER LO QUE QUIERAS!
            </Write>
            <Write id="s8b" x={960} y={470} p={pr(t, tChalk, 0.9)} size={48} color="#f4efe3">
              astronauta · presidenta · estrella
            </Write>
            <Ground y={900} x0={300} x1={1620} />
            <Person x={900} y={900} s={1.25} child coat={C.ochre} hair="short" hairColor="#3d2618" hat="crown" mood="smile" armFront={[160 + Math.sin(t * 5) * 8, -10]} skin={C.skin[1]} />
            {t > tKid - 0.3 ? (
              <>
                <Person x={500} y={900} s={1.1} coat={C.sage} hair="bun" hairColor={C.gray} dress mood="smile" armFront={[120 + Math.sin(t * 12) * 12, -50]} armBack={[110 - Math.sin(t * 12) * 12, -40]} opacity={eo(t, tKid - 0.3, 0.6)} />
                <Person x={1360} y={900} s={1.15} flip coat={C.slate} hair="short" hairColor={C.ink} tie={C.brick} mood="smile" armFront={[160, -20]} opacity={eo(t, tKid, 0.6)} />
              </>
            ) : null}
          </Cam>
        </g>
      ) : null}
      {doors > 0 ? (
        <g opacity={doors}>
          <Cam t={t} t0={tDoors} t1={S(17)} from={[960, 520, 1.0]} to={[960, 520, 1.5]}>
            <Doors p={eo(t, tDoors - 0.2, 2.0)} t={t} />
            <Person x={960} y={980} s={0.9} coat={C.ochre} hair="short" hairColor="#3d2618" child mood="surprised" skin={C.skin[1]} />
          </Cam>
          <Write id="s8c" x={960} y={110} p={pr(t, W(16, 'oportunidades'), 0.9)} size={60} font={FELL}>
            tantas oportunidades
          </Write>
        </g>
      ) : null}
      {mount > 0 ? (
        <g opacity={mount}>
          <Cam t={t} t0={S(17)} t1={b} from={[700, 700, 1.15]} to={[900, 470, 0.95]}>
            <path d="M120 940 L560 620 L740 700 L1240 220 L1500 470 L1640 400 L1880 940 Z" fill={C.slateLight} opacity={0.55} />
            <Shape d="M120 940 L560 620 L740 700 L1240 220 L1500 470 L1640 400 L1880 940 Z" fill="none" />
            <Ink d="M1180 280 L1240 220 L1300 290 L1260 270 L1240 300 L1210 270 Z" fill={C.cream} w={2} />
            {/* la cima: pocos con bandera */}
            <Ink d="M1252 222 L1252 120" w={3} />
            <path d={`M1252 122 L1330 ${140 + Math.sin(t * 5) * 6} L1252 160 Z`} fill={C.brick} stroke={C.ink} strokeWidth={2} />
            <Person x={1215} y={232} s={0.35} coat={C.gold} hair="short" hairColor={C.ink} mood="smile" armFront={[170, 0]} />
            <Person x={1280} y={236} s={0.35} flip coat={C.brick} hair="bun" hairColor={C.ink} mood="smile" armFront={[170, 0]} dress />
            {/* quien trepa y resbala */}
            <Person x={px} y={py} s={0.5} coat={C.ochre} hair="short" hairColor="#3d2618" mood={slip > 0.3 ? 'sad' : 'worried'} lean={slip > 0.6 ? 0 : -25} sit={slip > 0.6} armFront={[150, 0]} armBack={[140, 10]} skin={C.skin[1]} />
            {slip > 0 && slip < 0.8 ? <Ink d={`M${px + 30} ${py - 60} q10 -10 0 -20 M${px + 50} ${py - 50} q12 -8 4 -22`} w={1.6} color={C.inkSoft} /> : null}
          </Cam>
          <Write id="s8d" x={960} y={1000} p={pr(t, tTop + 0.2, 1.0)} size={54} color={C.slate}>
            ¿y si no llegaste a la cima?
          </Write>
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 9: «No todos partimos del mismo lugar» ─────────
const Rock: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M-30 0 L-24 -26 L-4 -38 L22 -30 L32 0 Z" fill={C.gray} stroke={C.ink} strokeWidth={2.2} strokeLinejoin="round" />
);

export const Race: React.FC<SceneProps> = ({t, a, b}) => {
  const tEdu = W(20, 'educación');
  const tHealth = W(20, 'salud');
  const tStab = W(20, 'estabilidad');
  const tLack = W(20, 'carencias');
  const tRule = W(21, 'misma regla');
  const tGun = W(21, 'ignorar');
  const tDes = W(21, 'desigualdades');
  const run = eio(t, tGun + 0.2, 4.5);
  const r1 = lerp(330, 1500, run);
  const r2 = lerp(330, 640, run);
  const struggle = Math.sin(t * 9) * (run > 0 ? 3 : 0);
  return (
    <Cam t={t} t0={a} t1={b} from={[960, 560, 1.06]} to={[1000, 560, 0.98]}>
      {/* carril favorecido */}
      <Shape d="M100 300 L1820 300 L1820 520 L100 520 Z" fill="#b9cdb0" />
      <Ink d="M100 410 L1820 410" w={1.4} color={C.cream} strokeDasharray="20 18" />
      {/* carril difícil */}
      <Shape d="M100 560 L1820 560 L1820 800 L100 800 Z" fill="#dcc29a" />
      {Array.from({length: 26}, (_, i) => (
        <circle key={i} cx={140 + ((i * 137) % 1660)} cy={600 + ((i * 53) % 180)} r={3 + (i % 3)} fill={C.grayDark} opacity={0.4} />
      ))}
      {/* línea de salida */}
      <Ink d="M280 290 L280 810" w={4} />
      <Write id="s9a" x={960} y={180} p={pr(t, W(19, 'mismo lugar') - 0.3, 1.0)} size={58} font={FELL}>
        no todos partimos del mismo lugar
      </Write>
      {/* ventajas del carril 1 */}
      <g transform={`translate(560 ${490}) scale(${pop(t, tEdu, 0.5)})`}>
        <Shape d="M-40 -60 L40 -60 L40 0 L-40 0 Z" fill={C.slate} />
        <Ink d="M0 -60 L0 0" w={1.6} />
      </g>
      <g transform={`translate(800 490) scale(${pop(t, tHealth, 0.5)})`}>
        <Shape d="M-40 -50 L40 -50 L40 0 L-40 0 Z" fill={C.cream} />
        <path d="M-8 -40 L8 -40 L8 -32 L16 -32 L16 -18 L8 -18 L8 -10 L-8 -10 L-8 -18 L-16 -18 L-16 -32 L-8 -32 Z" fill={C.brick} />
      </g>
      <g transform={`translate(1040 500) scale(${pop(t, tStab, 0.5)})`}>
        <Coin x={0} y={-10} r={20} />
        <Coin x={0} y={-22} r={20} />
        <Coin x={0} y={-34} r={20} />
      </g>
      {/* obstáculos del carril 2 */}
      {[420, 560, 760, 980, 1240, 1500].map((x, i) => (
        <g key={i} transform={`translate(0 ${(1 - pop(t, tLack + i * 0.15, 0.5)) * -60})`} opacity={pr(t, tLack + i * 0.15, 0.2)}>
          <Rock x={x} y={770} s={1 + (i % 2) * 0.4} />
        </g>
      ))}
      {/* corredores */}
      <Person x={r1} y={500} s={0.75} coat={C.sage} legs={C.sageDark} hair="short" hairColor="#3d2618" mood="smile" lean={run > 0 && run < 1 ? 12 : 0} armFront={[run > 0 ? 60 + Math.sin(t * 14) * 40 : 10, 40]} armBack={[run > 0 ? -40 - Math.sin(t * 14) * 40 : 0, 40]} skin={C.skin[0]} />
      <g>
        <Person x={r2 + struggle} y={770} s={0.75} coat={C.ochre} hair="curly" hairColor="#24170f" mood={run > 0 ? 'sad' : 'worried'} lean={run > 0 ? 18 : 0} armFront={[50, 30]} skin={C.skin[3]} />
        {/* bola de hierro atada al tobillo */}
        <Ink d={`M${r2 + struggle + 10} 770 Q${r2 - 40} 790 ${r2 - 80} 780`} draw={eo(t, tLack + 0.8, 0.6)} w={2} />
        {t > tLack + 1 ? <circle cx={r2 - 92} cy={772} r={18} fill={C.ink} /> : null}
        <Write id="s9d" x={r2 - 92} y={830} p={pr(t, tLack + 1.2, 0.5)} size={30} color={C.inkSoft}>
          deuda
        </Write>
      </g>
      {/* juez con chistera y pistola */}
      <Person x={180} y={980} s={0.9} coat={C.ink} hat="top" hair="none" mood="smug" armFront={[170, 0]} holdFront={t > tGun && t < tGun + 0.6 ? <circle cx={0} cy={-20} r={20 * eo(t, tGun, 0.3)} fill={C.cream} stroke={C.ink} strokeWidth={2} /> : <rect x={-4} y={-30} width={8} height={26} fill={C.ink} />} opacity={pr(t, tRule - 1, 0.6)} />
      <Stamp x={1450} y={960} t={t} at={tRule} text="MISMA REGLA PARA TODOS" size={40} rot={-3} color={C.ink} />
      <Write id="s9e" x={960} y={890} p={pr(t, tDes, 1.2)} size={50} color={C.brick}>
        desigualdades estructurales
      </Write>
    </Cam>
  );
};

// ───────── Escena 10: «La sección de autoayuda» ─────────
const SPINES = Array.from({length: 22}, (_, i) => ({w: 38 + ((i * 37) % 30), h: 190 + ((i * 53) % 60), c: [C.brick, C.gold, C.slate, C.sage, C.ochre, C.rose, C.roseDeep][i % 7]}));

const Cover: React.FC<{lines: string[]; fill: string; ink: string; p: number; x: number; y: number; flashy?: boolean}> = ({lines, fill, ink, p, x, y, flashy}) => {
  if (p <= 0) return null;
  const s = easeInOut(clamp(p));
  return (
    <g transform={`translate(${x} ${lerp(y + 120, y, s)}) scale(${lerp(0.4, 1, s)})`} opacity={clamp(p * 3)}>
      <Shape d="M-160 -220 L160 -220 L160 220 L-160 220 Z" fill={fill} />
      <Ink d="M-140 -200 L140 -200 L140 200 L-140 200 Z" w={1.4} color={ink} />
      {flashy ? (
        <g>
          {Array.from({length: 12}, (_, i) => {
            const ang = (i / 12) * Math.PI * 2;
            return <Ink key={i} d={`M${Math.cos(ang) * 60} ${110 + Math.sin(ang) * 30} L${Math.cos(ang) * 95} ${110 + Math.sin(ang) * 48}`} w={2} color={ink} />;
          })}
          <circle cx={0} cy={110} r={38} fill={C.honey} stroke={ink} strokeWidth={2} />
          <text x={0} y={122} textAnchor="middle" fontFamily={FELLSC} fontSize={34} fill={C.ink}>$</text>
        </g>
      ) : (
        <g>
          <path d="M-40 150 Q0 80 40 150" stroke={ink} strokeWidth={2} fill="none" />
          <circle cx={0} cy={60} r={20} fill="none" stroke={ink} strokeWidth={2} />
          <path d="M-30 110 Q0 96 30 110" stroke={ink} strokeWidth={2} fill="none" />
        </g>
      )}
      {lines.map((l, i) => (
        <text key={i} x={0} y={-130 + i * 46} textAnchor="middle" fontFamily={flashy ? FELLSC : FELL} fontSize={flashy ? 27 : 32} fill={ink} fontStyle={flashy ? 'normal' : 'italic'}>
          {l}
        </text>
      ))}
    </g>
  );
};

export const Bookstore: React.FC<SceneProps> = ({t, a, b}) => {
  const tA = S(24);
  const tB = W(24, 'conviértase');
  const tLow = S(25);
  const tC = S(26);
  const shelf = (y: number, dim: number) => {
    let x = 160;
    return (
      <g opacity={1 - dim * 0.35}>
        {SPINES.map((sp, i) => {
          const el = (
            <g key={i}>
              <Shape d={`M${x} ${y} L${x + sp.w} ${y} L${x + sp.w} ${y - sp.h} L${x} ${y - sp.h} Z`} fill={dim ? [C.gray, C.slateLight, C.grayDark][i % 3] : sp.c} w={2} />
              <Ink d={`M${x + 8} ${y - sp.h + 24} L${x + sp.w - 8} ${y - sp.h + 24} M${x + 8} ${y - 30} L${x + sp.w - 8} ${y - 30}`} w={1.2} color={C.cream} />
            </g>
          );
          x += sp.w + 4;
          return el;
        })}
        <Shape d={`M120 ${y} L1800 ${y} L1800 ${y + 26} L120 ${y + 26} Z`} fill="#8a5a34" />
      </g>
    );
  };
  return (
    <g>
      <Cam t={t} t0={tLow - 0.4} t1={tLow + 1.4} from={[960, 420, 1.0]} to={[960, 1060, 1.0]}>
        <Shape d="M100 60 L1820 60 L1820 1560 L100 1560 Z" fill="#c9a77c" />
        <Write id="s10t" x={960} y={140} p={pr(t, a + 0.3, 1.0)} size={56} font={FELLSC} spacing={8}>
          AUTOAYUDA
        </Write>
        {shelf(560, 0)}
        {shelf(1300, 1)}
        <Cover x={620} y={420} p={pr(t, tA - 0.3, 0.7)} lines={['CÓMO TRIUNFAR', 'EN 15 MINUTOS']} fill={C.brick} ink={C.honey} flashy />
        <Cover x={1300} y={420} p={pr(t, tB - 0.3, 0.7)} lines={['CONVIÉRTASE EN', 'MILLONARIO', 'DE LA NOCHE', 'A LA MAÑANA']} fill={C.gold} ink={C.ink} flashy />
        <Cover x={960} y={1140} p={pr(t, tC - 0.3, 0.8)} lines={['Cómo lidiar', 'con una baja', 'autoestima']} fill={C.slateLight} ink={C.night} />
      </Cam>
    </g>
  );
};

// ───────── Escena 11: «Ambos géneros están relacionados» ─────────
export const Pyramid: React.FC<SceneProps> = ({t, a, b}) => {
  const tPyr = W(28, 'una sociedad');
  const tFew = W(28, 'pequeña minoría');
  const tSad = W(28, 'insatisfacción');
  const join = eio(t, a + 0.2, 1.4);
  const books = phase(t, a - 1, tPyr + 0.3, 0.6);
  const pyr = phase(t, tPyr - 0.2, b + 2, 0.6);
  const tiers = [1, 3, 6, 10, 15];
  return (
    <g>
      {books > 0 ? (
        <g opacity={books}>
          <Cover x={lerp(560, 820, join)} y={540} p={1} lines={['CÓMO TRIUNFAR', 'EN 15 MINUTOS']} fill={C.brick} ink={C.honey} flashy />
          <Cover x={lerp(1360, 1100, join)} y={540} p={1} lines={['Cómo lidiar', 'con una baja', 'autoestima']} fill={C.slateLight} ink={C.night} />
          <Ink d="M700 400 C820 300 1100 300 1220 400" draw={eo(t, a + 1.4, 0.8)} w={4} color={C.brick} />
          <Write id="s11a" x={960} y={930} p={pr(t, a + 0.6, 1.0)} size={56} font={FELL}>
            dos caras de la misma moneda
          </Write>
        </g>
      ) : null}
      {pyr > 0 ? (
        <g opacity={pyr}>
          <Cam t={t} t0={tPyr} t1={b} from={[960, 380, 1.3]} to={[960, 560, 0.95]}>
            {tiers.map((n, row) => {
              const y = 260 + row * 150;
              const w = 160 + row * 300;
              return (
                <g key={row}>
                  <Shape d={`M${960 - w / 2} ${y} L${960 + w / 2} ${y} L${960 + w / 2 + 40} ${y + 30} L${960 - w / 2 - 40} ${y + 30} Z`} fill={row === 0 ? C.gold : '#c9b18c'} />
                  {Array.from({length: n}, (_, k) => {
                    const x = 960 - w / 2 + (w / (n + 1)) * (k + 1);
                    const top = row === 0;
                    return (
                      <Person
                        key={k}
                        x={x}
                        y={y}
                        s={0.32}
                        flip={k % 2 === 1}
                        coat={top ? C.gold : [C.slate, C.grayDark, C.sage, C.ochre][(k + row) % 4]}
                        hair={(['short', 'bun', 'curly', 'long', 'bald'] as const)[(k + row) % 5]}
                        hairColor={C.ink}
                        mood={top ? 'smile' : t > tSad ? 'sad' : 'neutral'}
                        armFront={top ? [165, 0] : [5, 10]}
                        hat={top ? 'top' : 'none'}
                        skin={C.skin[(k + row) % 4]}
                      />
                    );
                  })}
                </g>
              );
            })}
            <Write id="s11b" x={1300} y={200} p={pr(t, tFew, 0.8)} size={44} color={C.gold}>
              ← una pequeña minoría
            </Write>
            {/* nube de lluvia sobre la base */}
            {t > tSad - 0.5 ? (
              <g opacity={eo(t, tSad - 0.5, 0.8)}>
                {[700, 960, 1220].map((x, i) => (
                  <g key={i}>
                    <Shape d={`M${x - 120} 760 C${x - 140} 700 ${x - 60} 670 ${x - 20} 700 C${x} 650 ${x + 90} 660 ${x + 90} 710 C${x + 140} 700 ${x + 150} 760 ${x + 110} 770 Z`} fill={C.slateLight} />
                    {Array.from({length: 7}, (_, k) => {
                      const yy = 790 + ((t * 300 + k * 37) % 120);
                      return <Ink key={k} d={`M${x - 90 + k * 30} ${yy} l-6 18`} w={2} color={C.slate} />;
                    })}
                  </g>
                ))}
              </g>
            ) : null}
          </Cam>
          <Write id="s11c" x={960} y={1020} p={pr(t, tSad, 1.0)} size={52} color={C.slate}>
            insatisfacción y aflicción
          </Write>
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 12: «Antes, el sistema estaba arreglado» ─────────
const Horse: React.FC<{x: number; y: number; s?: number; step: number}> = ({x, y, s = 1, step}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Ink d={`M-60 -90 L${-66 + step * 8} 0 M-40 -90 L${-34 - step * 8} 0 M40 -90 L${46 + step * 8} 0 M58 -90 L${52 - step * 8} 0`} w={6} color="#5a3a22" />
    <Shape d="M-80 -150 C-90 -110 -70 -84 -40 -84 L50 -84 C80 -84 86 -120 76 -150 C60 -170 -60 -172 -80 -150 Z" fill="#8a5a34" />
    <Shape d="M60 -150 L100 -220 C108 -232 130 -230 136 -214 L140 -192 L118 -186 L96 -150 Z" fill="#8a5a34" />
    <Ink d="M100 -222 C88 -200 80 -180 70 -160" w={6} color="#3a2414" />
    <Ink d="M-82 -146 C-110 -130 -112 -100 -100 -80" w={6} color="#3a2414" />
    <circle cx={122} cy={-212} r={2.4} fill={C.ink} />
  </g>
);

export const Tapestry: React.FC<SceneProps> = ({t, a, b}) => {
  const tPast = S(30);
  const tShrug = S(31);
  const tMer = W(32, 'meritocracias');
  const tWork = W(32, 'trabajadoras');
  const just = phase(t, a - 1, tPast + 0.2, 0.6);
  const tap = t >= tPast - 0.3 ? 1 : 0;
  const roll = eio(t, tMer - 0.4, 1.4);
  const shrug = Math.max(0, Math.sin(clamp((t - tShrug - 1.2) / 1.0) * Math.PI));
  const walk = (t - tPast) * 0.6;
  return (
    <g>
      {just > 0 ? (
        <g opacity={just}>
          <Balance x={960} y={260} tilt={settle(t, a + 0.3, 8, 0.8, 1.2)} s={0.9} />
          <Write id="s12a" x={960} y={180} p={pr(t, W(29, 'justas') - 0.2, 0.8)} size={80} weight={700} color={C.brick}>
            «justas»
          </Write>
        </g>
      ) : null}
      {tap > 0 ? (
        <g>
          {/* oficina moderna, debajo del tapiz */}
          <g opacity={roll}>
            <Shape d="M160 100 L1760 100 L1760 980 L160 980 Z" fill={C.cream} />
            {[300, 620, 1300, 1620].map((x, i) => (
              <Shape key={i} d={`M${x - 90} 180 L${x + 90} 180 L${x + 90} 420 L${x - 90} 420 Z`} fill="#dfe8ea" />
            ))}
            <Ink d="M160 900 L1760 900" />
            {/* escalera dorada del mérito */}
            <Ink d="M820 900 L900 160 M1100 900 L1020 160" w={6} color={C.gold} />
            {Array.from({length: 9}, (_, i) => {
              const y = 860 - i * 84;
              const k = (900 - y) / 740;
              return <Ink key={i} d={`M${820 + 80 * k} ${y} L${1100 - 80 * k} ${y}`} w={5} color={C.gold} />;
            })}
            <text x={960} y={140} textAnchor="middle" fontFamily={FELLSC} fontSize={48} fill={C.gold} letterSpacing={10}>
              MÉRITO
            </text>
            {[0, 1, 2].map((i) => {
              const p = eio(t, tWork - 0.5 + i * 0.4, 6);
              const k = clamp(p * 0.8 - i * 0.12);
              return <Person key={i} x={lerp(870, 940, k)} y={lerp(900, 330, k)} s={0.55} coat={[C.slate, C.ink, C.sage][i]} hair={(['short', 'bun', 'bald'] as const)[i]} hairColor={C.ink} tie={C.brick} mood="neutral" armFront={[170, -10]} armBack={[150, 0]} holdBack={i === 1 ? <Briefcase /> : undefined} skin={C.skin[i]} />;
            })}
            <Write id="s12c" x={1420} y={700} p={pr(t, tWork, 1.0)} size={44} color={C.inkSoft}>
              trabajadoras y astutas
            </Write>
          </g>
          {/* el tapiz que se enrolla hacia arriba */}
          <g>
            <defs>
              <clipPath id="tapClip">
                <rect x={0} y={0} width={1920} height={lerp(1080, 0, roll)} />
              </clipPath>
              <pattern id="weave" width="8" height="8" patternUnits="userSpaceOnUse">
                <rect width="8" height="8" fill="#e9dcbc" />
                <path d="M0 4 H8 M4 0 V8" stroke="#d6c59e" strokeWidth={1} />
              </pattern>
            </defs>
            <g clipPath="url(#tapClip)" opacity={eo(t, tPast - 0.3, 0.6)}>
              <rect x={0} y={0} width={1920} height={1080} fill="url(#weave)" />
              {/* cenefas bordadas */}
              {[60, 1000].map((y) => (
                <g key={y}>
                  <rect x={0} y={y - 30} width={1920} height={60} fill="#4a5a7a" opacity={0.8} />
                  {Array.from({length: 24}, (_, i) => (
                    <path key={i} d={`M${i * 80 + 20} ${y} l20 -18 l20 18 l-20 18 z`} fill={C.ochre} stroke={C.ink} strokeWidth={1.5} />
                  ))}
                </g>
              ))}
              <Ink d="M100 840 C500 830 1300 850 1820 836" w={3} color="#5a3a22" />
              {/* el campesino ara */}
              <g>
                <Ink d={`M${520} 820 L${600} 760`} w={6} color="#5a3a22" />
                <Person x={470} y={840} s={1.2} coat="#9a6b3a" legs="#5a3a22" hair="short" hairColor="#5a3a22" hat="cap" mood={shrug > 0.3 ? 'neutral' : 'sad'} lean={10 - shrug * 10} armFront={[70 + shrug * 70, -20 - shrug * 40]} armBack={[60 + shrug * 70, -10 - shrug * 40]} skin={C.skin[2]} />
                {Array.from({length: 6}, (_, i) => (
                  <Ink key={i} d={`M${200 + i * 50} 852 l30 -6`} w={2} color="#5a3a22" />
                ))}
              </g>
              {/* el señor feudal a caballo */}
              <g transform={`translate(${-walk * 30} 0)`}>
                <Horse x={1380} y={840} s={1.3} step={Math.sin(t * 4)} />
                <Person x={1380} y={650} s={1.1} coat="#7a2a3a" hair="none" hat="crown" mood={shrug > 0.3 ? 'neutral' : 'smug'} sit armFront={[60 + shrug * 80, -30 - shrug * 30]} armBack={[50 + shrug * 80, -30]} skin={C.skin[0]} />
              </g>
              <text x={960} y={240} textAnchor="middle" fontFamily={'UnifrakturMaguntia, serif'} fontSize={64} fill="#5a2a2a" opacity={eo(t, tPast + 0.2, 0.8)}>
                Así son las cosas
              </text>
              <text x={470} y={940} textAnchor="middle" fontFamily={FELL} fontStyle="italic" fontSize={38} fill="#3a2a1f" opacity={eo(t, W(31, 'campesino'), 0.6)}>
                no era tu culpa
              </text>
              <text x={1420} y={940} textAnchor="middle" fontFamily={FELL} fontStyle="italic" fontSize={38} fill="#3a2a1f" opacity={eo(t, W(31, 'feudal'), 0.6)}>
                ni tu mérito
              </text>
            </g>
            {/* rodillo del tapiz */}
            {roll > 0 && roll < 1 ? (
              <g transform={`translate(0 ${lerp(1080, 0, roll)})`}>
                <rect x={0} y={-24} width={1920} height={48} rx={24} fill="#c9b48a" stroke={C.ink} strokeWidth={2.4} />
                <Ink d="M0 -8 L1920 -8 M0 8 L1920 8" w={1} color="#a8946a" />
              </g>
            ) : null}
          </g>
        </g>
      ) : null}
    </g>
  );
};

export const _b = {FELL};
