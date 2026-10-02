import React from 'react';
import {S, W} from '../../estatus/timing';
import {
  Cam,
  Card,
  clamp,
  Dust,
  eio,
  eo,
  Figure,
  Fog,
  GOTH,
  Halo,
  handPos,
  hash,
  INK,
  Layer,
  lerp,
  mix,
  Rain,
  Rays,
  Ridge,
  SERIF,
  Sky,
  Stars,
  Tiny,
  Verse,
  wobble,
} from '../kit';
import type {SceneProps} from './A';

/** Destellos de relámpago: intensidad 0..1 */
const flashAt = (t: number, times: number[]) => times.reduce((m, f) => Math.max(m, t >= f ? Math.exp(-(t - f) * 7) * (0.6 + 0.4 * Math.sin((t - f) * 60)) : 0), 0);

// ───────── Escena 13: el dedo ─────────
export const Finger: React.FC<SceneProps> = ({t, a, b}) => {
  const tAdo = W(33, 'adorables');
  const tCima = W(33, 'cima');
  const tFondo = W(33, 'fondo');
  const tResp = W(33, 'responsables');
  const down = eio(t, tCima + 0.6, tFondo - 0.3 - (tCima + 0.6));
  const fIn = eio(t, tFondo - 0.4, 1.3);
  const flash = flashAt(t, [tResp - 0.05, tResp + 0.25]);
  const steps = 26;
  // dedo de nubes (en pantalla)
  const arm = (u: number) => ({x: lerp(-420, 600, u) + Math.sin(u * 3) * 30, y: lerp(-380, 520, u) - Math.sin(u * Math.PI) * 80});
  const tip = {x: 790, y: 710};
  const off = (1 - fIn) * -700;
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 60, 1.0], [tCima + 0.6, 960, 120, 1.0], [tFondo - 0.3, 960, 1000, 1.0], [b, 940, 1010, 1.04]]} shake={[[tResp, 12]]}>
        <Layer depth={1}>
          <Sky id="s13" y={-700} h={2300} stops={[[0, '#FFF6DE'], [0.18, '#F6C46A'], [0.45, '#7A4E5A'], [0.7, '#1E1626'], [1, '#07060C']]} />
          <Halo x={960} y={-260} r={900} color="#FFF0C0" opacity={0.7} />
          <Rays x={960} y={-400} t={t} n={14} len={1500} spread={70} angle={90} color="#FFF0C8" opacity={0.3} />
          {Array.from({length: steps}, (_, i) => {
            const v = i / (steps - 1);
            const y = lerp(1260, -40, v);
            const w = lerp(1900, 360, Math.pow(v, 0.8));
            const c = mix('#120C10', '#FFD98A', Math.pow(v, 1.4));
            return (
              <g key={i}>
                <rect x={960 - w / 2} y={y - 50} width={w} height={12} fill={mix(c, '#FFFFFF', 0.25 * v)} />
                <rect x={960 - w / 2} y={y - 38} width={w} height={38} fill={mix(c, '#000000', 0.4)} />
              </g>
            );
          })}
          {/* la cima: aplausos en la luz */}
          {Array.from({length: 11}, (_, i) => {
            const x = 830 + i * 26;
            const clap = Math.abs(Math.sin(t * 9 + i)) * 6;
            return (
              <g key={i}>
                <Tiny x={x} y={-92} s={1.4} color="#5A3A10" />
                <circle cx={x - 4} cy={-140 - clap} r={3} fill="#5A3A10" />
                <circle cx={x + 4} cy={-140 - clap} r={3} fill="#5A3A10" />
              </g>
            );
          })}
          {Array.from({length: 40}, (_, i) => {
            const life = 3;
            const age = (((t - hash(i * 3.1) * life) % life) + life) % life;
            const x = 760 + hash(i * 7.3) * 400 + Math.sin(age * 3 + i) * 20;
            const y = -260 + age * 70;
            return <rect key={i} x={x} y={y} width={6} height={3} fill={i % 3 ? '#FFE7A0' : '#FFFFFF'} opacity={Math.sin((age / life) * Math.PI)} transform={`rotate(${age * 200 + i * 40} ${x} ${y})`} />;
          })}
          {/* el fondo: sombra y una figura sentada */}
          <rect x={-400} y={1180} width={2720} height={500} fill="#050407" />
          <Fog y={1160} h={200} color="#1A1426" opacity={0.6} />
          <Halo x={760} y={1120} r={240} color="#9AA8D0" opacity={0.12 + flash * 0.5} />
          <Figure x={760} y={1180} s={0.62} sit face={1} slump={0.9} armF={[40, 60]} armB={[30, 70]} rim={{color: '#B8C4E8', dx: 0, dy: -1.4, opacity: 0.4 + flash}} />
        </Layer>
      </Cam>
      {/* el dedo de tormenta */}
      {fIn > 0 ? (
        <g transform={`translate(${off} ${off * 0.8})`}>
          {Array.from({length: 70}, (_, k) => {
            const u = hash(k * 1.7) * 0.92;
            const p = arm(u);
            const spread = 120 - u * 40;
            const px = p.x + (hash(k * 3.1) - 0.5) * spread + Math.sin(t * 0.8 + k) * 6;
            const py = p.y + (hash(k * 5.3) - 0.5) * spread * 0.8 + Math.cos(t * 0.7 + k) * 5;
            const r = 40 + hash(k * 7.9) * 60 - u * 14;
            return <circle key={k} cx={px} cy={py} r={r} fill={mix('#1A1C24', '#2E3240', hash(k * 2.2))} />;
          })}
          {Array.from({length: 40}, (_, k) => {
            const u = hash(k * 4.1) * 0.95;
            const p = arm(u);
            return <circle key={k} cx={p.x + (hash(k * 6.1) - 0.5) * 90} cy={p.y + 28 + hash(k * 8.3) * 30} r={24 + hash(k * 2.7) * 30} fill={mix('#3A3F50', '#C8D4FF', flash * 0.7)} opacity={0.55} />;
          })}
          {/* puño */}
          {Array.from({length: 9}, (_, k) => (
            <circle key={k} cx={600 + (hash(k * 9.1) - 0.5) * 120} cy={545 + (hash(k * 4.7) - 0.5) * 90} r={44 + hash(k * 3.9) * 26} fill={mix('#262A36', '#B8C6F0', flash * 0.6)} />
          ))}
          {/* el índice: una nube afilada que señala */}
          <path d={`M630 520 C680 560 730 620 ${tip.x + 8} ${tip.y - 6} C${tip.x + 4} ${tip.y + 10} ${tip.x - 14} ${tip.y + 8} ${tip.x - 18} ${tip.y - 4} C700 660 650 610 590 580 Z`} fill={mix('#3A3F50', '#DCE4FF', flash * 0.8)} />
          <path d={`M640 540 C690 580 735 630 ${tip.x + 4} ${tip.y - 8}`} stroke="#C8D4FF" strokeWidth={3} fill="none" opacity={0.25 + flash * 0.75} />
          {flash > 0.3 ? <path d="M420 300 L470 360 L450 368 L520 430" stroke="#EEF2FF" strokeWidth={3} fill="none" opacity={flash} /> : null}
        </g>
      ) : null}
      {flash > 0.02 ? <rect x={0} y={0} width={1920} height={1080} fill="#DCE6FF" opacity={flash * 0.35} /> : null}
      <Verse x={960} y={225} text="las meritocracias suenan adorables…" t={t} at={tAdo - 0.4} out={tCima - 0.4} size={50} color="#3A2208" glow="rgba(255,240,200,0.6)" />
      <Verse x={960} y={225} text="los de arriba merecen estar ahí" t={t} at={tCima - 0.2} out={tCima + 1.6} size={50} color="#3A2208" glow="rgba(255,240,200,0.6)" />
      <Verse x={1280} y={420} text="…y los de abajo, también" t={t} at={tFondo - 0.2} out={tResp - 0.2} size={50} color="#C8D2EA" glow="rgba(150,170,220,0.4)" />
      <Verse x={1300} y={420} text="RESPONSABLES" t={t} at={tResp - 0.05} size={84} italic={false} weight={500} spacing="0.22em" color="#EEF2FF" glow="rgba(170,190,255,0.8)" stagger={0.04} w={1100} />
    </g>
  );
};

// ───────── Escena 14: la maquinaria ─────────
const gearPath = (r: number, teeth: number, depth: number) => {
  const pts: string[] = [];
  const n = teeth * 4;
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2;
    const rr = i % 4 === 1 || i % 4 === 2 ? r + depth : r;
    pts.push(`${(Math.cos(ang) * rr).toFixed(1)} ${(Math.sin(ang) * rr).toFixed(1)}`);
  }
  return `M${pts.join(' L')} Z`;
};
const Gear: React.FC<{x: number; y: number; r: number; teeth: number; rot: number; color: string; rim?: string}> = ({x, y, r, teeth, rot, color, rim = '#C8763A'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={gearPath(r, teeth, r * 0.12)} fill={color} stroke={rim} strokeWidth={2} strokeOpacity={0.5} />
    <circle cx={0} cy={0} r={r * 0.72} fill="none" stroke={mix(color, '#000000', 0.4)} strokeWidth={r * 0.08} />
    {Array.from({length: 6}, (_, k) => (
      <rect key={k} x={-r * 0.05} y={-r * 0.7} width={r * 0.1} height={r * 0.7} fill={mix(color, '#000000', 0.3)} transform={`rotate(${k * 60})`} />
    ))}
    <circle cx={0} cy={0} r={r * 0.14} fill={mix(color, '#000000', 0.5)} />
  </g>
);

const Palace: React.FC<{x: number; y: number}> = ({x, y}) => (
  <g transform={`translate(${x} ${y})`} fill="#0C0A10">
    <rect x={-330} y={-40} width={660} height={40} />
    <rect x={-300} y={-80} width={600} height={40} />
    <rect x={-260} y={-300} width={520} height={220} />
    <path d="M-290 -300 L0 -400 L290 -300 Z" />
    <rect x={-120} y={-470} width={240} height={90} />
    <path d="M-130 -470 C-130 -600 130 -600 130 -470 Z" />
    <rect x={-6} y={-650} width={12} height={70} />
    <path d="M6 -650 L60 -636 L6 -620 Z" fill="#7A1E1E" />
    {Array.from({length: 8}, (_, k) => (
      <rect key={k} x={-240 + k * 66} y={-290} width={22} height={210} fill="#1A1620" />
    ))}
  </g>
);

export const Machinery: React.FC<SceneProps> = ({t, a, b}) => {
  const tOpp = W(35, 'oportunidades');
  const tDes = W(35, 'desigualdades');
  const tEsf = W(36, 'esforzarse');
  const tList = W(36, 'listo');
  const tSys = W(36, 'sistemas');
  const tPriv = W(36, 'privilegios');
  const pan = eio(t, tDes - 0.4, 3.2);
  // canal de luz: de las casas del valle a la torre
  const route: [number, number][] = [
    [2300, 860],
    [2450, 760],
    [2700, 760],
    [2850, 640],
    [3150, 640],
    [3320, 470],
    [3420, 300],
  ];
  const along = (u: number) => {
    const seg = route.length - 1;
    const f = clamp(u) * seg;
    const i = Math.min(seg - 1, Math.floor(f));
    const k = f - i;
    return [lerp(route[i][0], route[i + 1][0], k), lerp(route[i][1], route[i + 1][1], k)];
  };
  const routeD = `M${route.map((p) => p.join(' ')).join(' L')}`;
  return (
    <g>
      <Cam t={t} keys={[[a, 900, 560, 1.06], [tDes - 0.4, 960, 540, 1.0], [tDes + 2.8, 2860, 540, 1.0], [b, 2980, 520, 0.96]]}>
        <Layer depth={0.2}>
          <Sky id="s14" x={-800} w={6000} stops={[[0, '#0C0A14'], [0.45, '#3A2430'], [0.8, '#9A5A3A'], [1, '#D88A4A']]} />
          {Array.from({length: 10}, (_, k) => (
            <ellipse key={k} cx={((hash(k * 3.3) * 4000 + t * 12) % 4400) - 400} cy={180 + hash(k) * 260} rx={260 + hash(k * 2) * 200} ry={40 + hash(k * 5) * 30} fill="#5A4048" opacity={0.35} />
          ))}
        </Layer>
        <Layer depth={0.5}>
          <Ridge seed={51} y={760} amp={60} color="#2A1A20" x1={5200} />
          <Fog y={760} h={220} color="#7A4A3A" opacity={0.35} x0={-600} w={6000} />
        </Layer>
        <Layer depth={1}>
          {/* colina y palacio */}
          <path d="M-400 1200 L-400 860 C200 820 500 700 960 690 C1400 700 1700 820 2200 880 L2200 1200 Z" fill="#0A080E" />
          <Palace x={960} y={700} />
          {/* estandartes */}
          {[700, 1220].map((bx, k) => (
            <g key={k}>
              <rect x={bx - 3} y={300} width={6} height={400} fill="#0A080E" />
              <path d={`M${bx} 310 L${bx + 120 + Math.sin(t * 2 + k) * 10} ${320 + Math.sin(t * 2.4 + k) * 6} L${bx + 120 + Math.sin(t * 2 + k + 1) * 10} ${380 + Math.sin(t * 2.4 + k) * 6} L${bx} 370 Z`} fill="#7A1E22" />
            </g>
          ))}
          <path d="M680 420 Q960 470 1240 420 L1240 470 Q960 520 680 470 Z" fill="#8A2A24" />
          <text x={960} y={466} textAnchor="middle" fontFamily={SERIF} fontSize={30} fontWeight={500} letterSpacing="0.12em" fill="#F6E2C0">
            SOCIEDAD DE OPORTUNIDADES
          </text>
          {/* el valle de casas pobres */}
          <path d="M1900 1200 L1900 880 L2800 900 L3600 905 L4400 900 L4400 1200 Z" fill="#0A080E" />
          {Array.from({length: 9}, (_, k) => {
            const hx = 1980 + k * 90;
            const hy = 880 + (k % 3) * 8;
            const drain = clamp((t - (tDes + 1 + k * 0.4)) / 6);
            return (
              <g key={k}>
                <path d={`M${hx - 30} ${hy} L${hx - 30} ${hy - 40} L${hx} ${hy - 64} L${hx + 30} ${hy - 40} L${hx + 30} ${hy} Z`} fill="#141018" />
                <rect x={hx - 9} y={hy - 34} width={18} height={18} fill={mix('#FFC870', '#2A2028', drain * 0.85)} />
                {drain < 1 ? <Halo x={hx} y={hy - 25} r={50} color="#FFC870" opacity={0.6 * (1 - drain)} /> : null}
              </g>
            );
          })}
          {/* acueducto */}
          {Array.from({length: 8}, (_, k) => (
            <path key={k} d={`M${2460 + k * 50} 900 L${2460 + k * 50} 790 Q${2485 + k * 50} 765 ${2510 + k * 50} 790 L${2510 + k * 50} 900`} fill="none" stroke="#1E1418" strokeWidth={10} />
          ))}
          {/* engranajes */}
          <Gear x={2620} y={520} r={180} teeth={16} rot={t * 14} color="#3A2418" />
          <Gear x={2880} y={360} r={110} teeth={11} rot={-t * 23} color="#4A2C1A" />
          <Gear x={3100} y={560} r={150} teeth={14} rot={t * 17} color="#3A2418" />
          <Gear x={2400} y={340} r={90} teeth={9} rot={-t * 28} color="#4A2C1A" />
          {/* la torre más alta */}
          <rect x={3380} y={300} width={80} height={700} fill="#0E0A10" />
          <path d="M3370 300 L3420 150 L3470 300 Z" fill="#0E0A10" />
          <Halo x={3420} y={240} r={260 + 120 * pan} color="#FFD27A" opacity={0.3 + 0.5 * eo(t, tSys, 2)} />
          <circle cx={3420} cy={250} r={14} fill="#FFF0C0" />
          <path d={routeD} stroke="#2A1A14" strokeWidth={22} fill="none" strokeLinejoin="round" />
          <path d={routeD} stroke="#FFB45A" strokeWidth={4} fill="none" strokeLinejoin="round" opacity={0.35} />
          {Array.from({length: 26}, (_, k) => {
            const u = (((t - tDes) * 0.12 + k / 26) % 1 + 1) % 1;
            const [px, py] = along(u);
            return t > tDes - 0.5 ? (
              <g key={k}>
                <Halo x={px} y={py} r={22} color="#FFC870" opacity={0.8} />
                <circle cx={px} cy={py} r={4} fill="#FFF0C0" />
              </g>
            ) : null;
          })}
          <rect x={-400} y={990} width={4600} height={400} fill="#07060A" />
          <Dust t={t} n={40} opacity={0.35} color="#FFC890" area={[0, 0, 1920, 1080]} />
        </Layer>
      </Cam>
      {/* el eco del discurso */}
      {[0, 1, 2].map((k) => (
        <g key={k} opacity={1 - k * 0.3}>
          <Verse x={960 + k * 30} y={250 + k * 56} text="«vivimos en una sociedad de oportunidades»" t={t} at={tOpp - 1.6 + k * 0.45} out={tDes - 0.6 + k * 0.1} size={44 - k * 6} color="#F6E2C0" glow="rgba(255,180,100,0.4)" />
        </g>
      ))}
      <Verse x={960} y={250} text="…sin corregir las desigualdades de origen" t={t} at={tDes - 0.2} out={tEsf - 0.6} size={46} color="#F6E2C0" />
      <Verse x={700} y={250} text="«esfuérzate más»" t={t} at={tEsf - 0.2} out={tSys - 0.5} size={48} color="#F6E2C0" glow="rgba(255,180,100,0.4)" />
      <Verse x={1250} y={320} text="«sé más listo»" t={t} at={tList - 0.3} out={tSys - 0.5} size={48} color="#F6E2C0" glow="rgba(255,180,100,0.4)" />
      <Verse x={960} y={250} text="sistemas enteros diseñados" t={t} at={tSys - 0.2} out={tPriv - 0.5} size={52} color="#FFE2B8" glow="rgba(255,170,80,0.5)" />
      <Verse x={960} y={250} text="para que los privilegios no se muevan" t={t} at={tPriv - 0.3} size={52} color="#FFE2B8" glow="rgba(255,170,80,0.5)" />
    </g>
  );
};

// ───────── Escena 15: la rueda ─────────
export const Wheel: React.FC<SceneProps> = ({t, a, b}) => {
  const tMer = W(37, 'merece');
  const tDes = W(38, 'desafortunados');
  const tDiosa = W(38, 'diosa');
  const tNow = S(39) - 0.05;
  const tLos = W(39, 'perdedores');
  const neon = t < tNow;
  const spin = (Math.min(t, tNow) - a) * 9 - Math.max(0, wobble(t, tNow - 0.2, 4, 1.5, 4));
  const flashes = [a + 1.2, a + 4.6, tDes - 0.3, a + 9.8, tDiosa + 0.4, a + 13.4];
  const fl = flashAt(t, flashes);
  const C = {x: 1180, y: 530};
  const R = 330;
  const hp = handPos(560, 990, 2.0, 1, [95, -8]);
  // neón
  const buzz = Math.sin(t * 37) * Math.sin(t * 5.3) > -0.2 ? 1 : 0.1;
  const nOn = t < tNow + 0.8 ? 0 : t < tLos - 0.3 ? buzz * 0.45 : t < tLos + 0.9 ? (Math.sin(t * 41) > -0.5 ? 1 : 0.2) : 1;
  return (
    <g>
      {neon ? (
        <g>
          <Cam t={t} keys={[[a, 1100, 540, 1.08], [tNow, 1000, 540, 1.0]]}>
            <Layer depth={0.2}>
              <Sky id="s15" stops={[[0, mix('#0A0C12', '#5A607A', fl)], [0.6, mix('#2A2A36', '#9AA0C0', fl)], [1, mix('#5A4A3A', '#C8C0B0', fl)]]} />
              {fl > 0.3 ? <path d={`M${1500 + hash(Math.floor(t)) * 300} 140 L1580 300 L1540 310 L1620 480`} stroke="#EEF2FF" strokeWidth={4} fill="none" opacity={fl} /> : null}
              {Array.from({length: 12}, (_, k) => (
                <ellipse key={k} cx={((hash(k * 2.7) * 2600 + t * 30) % 2800) - 400} cy={170 + hash(k * 9) * 220} rx={300} ry={60} fill="#14141C" opacity={0.55} />
              ))}
            </Layer>
            <Layer depth={0.5}>
              <Ridge seed={61} y={840} amp={40} color="#14121A" />
            </Layer>
            <Layer depth={1}>
              {/* rueda */}
              <g transform={`translate(${C.x} ${C.y})`}>
                <circle r={R} fill="none" stroke="#2A2218" strokeWidth={22} />
                <circle r={R - 30} fill="none" stroke="#2A2218" strokeWidth={6} />
                {Array.from({length: 12}, (_, k) => (
                  <rect key={k} x={-5} y={-R} width={10} height={R} fill="#2A2218" transform={`rotate(${spin + k * 30})`} />
                ))}
                <circle r={46} fill="#2A2218" />
                {Array.from({length: 36}, (_, k) => {
                  const ang = ((spin + k * 10) * Math.PI) / 180;
                  return <circle key={k} cx={Math.cos(ang) * R} cy={Math.sin(ang) * R} r={4} fill="#FFD98A" opacity={(0.5 + 0.5 * Math.sin(t * 6 + k)) * (t > tNow ? 0 : 1)} />;
                })}
                {Array.from({length: 10}, (_, k) => {
                  const ang = ((spin + k * 36) * Math.PI) / 180;
                  const gx = Math.cos(ang) * R;
                  const gy = Math.sin(ang) * R;
                  const up = clamp(-gy / R * 1.5 + 0.5);
                  const col = mix('#3A3440', '#FFD98A', up);
                  return (
                    <g key={k} transform={`translate(${gx} ${gy})`}>
                      <path d="M0 0 L0 30" stroke="#2A2218" strokeWidth={4} />
                      {up > 0.5 ? <Halo x={0} y={50} r={70} color="#FFD98A" opacity={0.5 * up} /> : null}
                      <path d="M-34 30 L34 30 L28 70 L-28 70 Z" fill="#2A2218" />
                      <Tiny x={-10} y={34} s={1.1} color={col} />
                      <Tiny x={12} y={34} s={1.1} color={col} />
                    </g>
                  );
                })}
              </g>
              <path d={`M${C.x} ${C.y} L${C.x - 180} 960 M${C.x} ${C.y} L${C.x + 180} 960`} stroke="#1A1610" strokeWidth={26} />
              {/* la diosa Fortuna, con los ojos vendados */}
              <Figure x={560} y={990} s={2.0} face={1} dress hair="long" armF={[95, -8]} armB={[20, 30]} color="#0C0A10" rim={{color: '#C8C8E0', dx: 0, dy: -2, opacity: 0.45 + fl * 0.55}} />
              <g transform={`rotate(-4 ${560 + 20} ${990 - 322 * 2})`}>
                <rect x={560 + 20 - 54} y={990 - 322 * 2 - 14} width={108} height={18} rx={4} fill="#D8D0C0" />
                <path d={`M${560 - 30} ${990 - 322 * 2 - 6} q-40 ${20 + Math.sin(t * 3) * 8} -70 ${50 + Math.sin(t * 2) * 10} M${560 - 30} ${990 - 322 * 2 - 2} q-30 ${30 + Math.sin(t * 2.6) * 8} -50 ${70 + Math.sin(t * 2.2) * 8}`} stroke="#D8D0C0" strokeWidth={7} fill="none" strokeLinecap="round" />
              </g>
              <Halo x={hp.x} y={hp.y} r={60} color="#FFD98A" opacity={0.25} />
              <Rain t={t} n={110} opacity={0.25} />
            </Layer>
          </Cam>
          {fl > 0.02 ? <rect x={0} y={0} width={1920} height={1080} fill="#E6ECFF" opacity={fl * 0.25} /> : null}
          <Verse x={560} y={240} text="la pobreza, como algo que se merece" t={t} at={tMer - 0.6} out={tDes - 0.6} size={46} w={900} color="#EDE6D8" />
          <Verse x={560} y={262} text="Desafortunados" t={t} at={tDes - 0.2} out={tNow - 0.3} size={96} italic={false} weight={400} font={GOTH} color="#FFE6A8" glow="rgba(255,200,90,0.9)" w={1000} />
          <Verse x={1560} y={905} text="no bendecidos por la diosa Fortuna" t={t} at={tDiosa - 0.3} out={tNow - 0.3} size={38} w={800} color="#EDE6D8" />
        </g>
      ) : (
        <g>
          <Cam t={t} keys={[[tNow, 960, 560, 1.12], [b, 960, 540, 1.0]]}>
            <Layer depth={0.2}>
              <Sky id="s15b" stops={[[0, '#020205'], [0.7, '#0A0A14'], [1, '#14121C']]} />
            </Layer>
            <Layer depth={1}>
              <rect x={-400} y={640} width={2720} height={800} fill="#0B0B12" />
              {[0.18, 0.4, 0.62].map((u, k) => {
                const lx = lerp(900, -200, u);
                const ly = lerp(650, 1000, u);
                const h = lerp(60, 520, u);
                return (
                  <g key={k}>
                    <rect x={lx} y={ly - h} width={lerp(2, 12, u)} height={h} fill="#050508" />
                    <Halo x={lx + 6} y={ly - h} r={lerp(30, 240, u)} color="#F2A65A" opacity={0.5} />
                    <ellipse cx={lx + 40} cy={ly + 20} rx={lerp(20, 200, u)} ry={lerp(4, 30, u)} fill="#F2A65A" opacity={0.12} />
                  </g>
                );
              })}
              <path d="M960 640 L-400 1100 M960 640 L2320 1100" stroke="#1A1A22" strokeWidth={3} />
              {Array.from({length: 9}, (_, k) => {
                const v = ((k / 9 + (t - tNow) * 0.25) % 1);
                const e = v * v;
                return <rect key={k} x={960 - 4 - e * 30} y={lerp(650, 1100, e)} width={8 + e * 60} height={4 + e * 30} fill="#5A5A60" opacity={0.6} />;
              })}
              {/* poste y letrero de neón */}
              <rect x={1356} y={320} width={14} height={340} fill="#0E0E14" />
              <rect x={1100} y={250} width={540} height={100} rx={8} fill="#0E0A10" stroke="#2A1A20" strokeWidth={3} />
              <Halo x={1370} y={300} r={420} color="#FF2A4A" opacity={0.45 * nOn} />
              <text x={1370} y={318} textAnchor="middle" fontFamily={SERIF} fontWeight={500} fontSize={58} letterSpacing="0.16em" fill={nOn > 0.5 ? '#FFD6DC' : '#3A1A22'} stroke="#FF3A5A" strokeWidth={nOn > 0.5 ? 2 : 0.5} style={{filter: nOn > 0.5 ? 'drop-shadow(0 0 10px #FF3A5A) drop-shadow(0 0 24px #FF2A4A)' : undefined}}>
                PERDEDORES
              </text>
              {/* reflejo en el asfalto mojado */}
              <g opacity={0.5 * nOn}>
                {Array.from({length: 14}, (_, k) => (
                  <rect key={k} x={1170 + hash(k) * 30 + Math.sin(t * 3 + k) * 8} y={700 + k * 18} width={400 - k * 18} height={5} fill="#FF3A5A" opacity={0.6 - k * 0.04} />
                ))}
              </g>
              <Figure x={lerp(560, 760, clamp((t - tNow) / (b - tNow)))} y={760} s={0.5} face={1} walk={(t - tNow) * 5} slump={0.4} rim={{color: '#FF6A7A', dx: 1.2, dy: 0, opacity: 0.25 + 0.6 * nOn}} />
              <Rain t={t} n={160} opacity={0.35} color="#D8C8D8" />
            </Layer>
          </Cam>
        </g>
      )}
    </g>
  );
};

// ───────── Escena 16: el veredicto (noir) ─────────
const Die: React.FC<{x: number; y: number; s: number; rot: number; dots: number; o?: number}> = ({x, y, s, rot, dots, o = 1}) => {
  const P: Record<number, [number, number][]> = {
    1: [[0, 0]],
    3: [[-14, -14], [0, 0], [14, 14]],
    5: [[-14, -14], [14, -14], [0, 0], [-14, 14], [14, 14]],
    6: [[-14, -14], [14, -14], [-14, 0], [14, 0], [-14, 14], [14, 14]],
  };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={o}>
      <rect x={-28} y={-28} width={56} height={56} rx={9} fill="#E8E8E8" />
      <rect x={-28} y={-28} width={56} height={8} rx={4} fill="#FFFFFF" />
      {(P[dots] ?? P[5]).map(([dx, dy], k) => (
        <circle key={k} cx={dx} cy={dy} r={5} fill="#111" />
      ))}
    </g>
  );
};

export const Verdict: React.FC<SceneProps> = ({t, a, b}) => {
  const tLuck = W(40, 'suerte');
  const tB = S(41) - 0.2;
  const tCar = W(42, 'carácter');
  const tSlam = W(42, 'veredicto') - 0.1;
  void tCar;
  const slam = eio(t, tSlam - 0.5, 0.5);
  const after = t > tSlam;
  const dust = eo(t, tLuck + 1.4, 1.4);
  const roll = (k: number) => {
    const d = clamp((t - (a + 0.3 + k * 0.15)) / 2.2);
    const e = 1 - Math.pow(1 - d, 2.4);
    return {x: lerp(300 + k * 60, 820 + k * 220, e), y: 640 - Math.abs(Math.sin(e * Math.PI * 3)) * 90 * (1 - e), r: e * (700 + k * 140)};
  };
  const manX = lerp(1300, 1020, clamp((t - tB) / 4.2));
  return (
    <g>
      {t < tB + 0.6 ? (
        <g opacity={1 - eio(t, tB, 0.6)}>
          <rect x={0} y={0} width={1920} height={1080} fill="#0A0A0A" />
          <Halo x={960} y={560} r={700} color="#D8D8D8" opacity={0.18} />
          <path d="M0 700 L1920 700 L1920 1080 L0 1080 Z" fill="#2A2A2A" />
          <path d="M0 700 L1920 700" stroke="#5A5A5A" strokeWidth={3} />
          {Array.from({length: 30}, (_, k) => (
            <path key={k} d={`M${hash(k) * 1920} ${710 + hash(k * 3) * 220} l${40 + hash(k * 5) * 80} ${(hash(k * 7) - 0.5) * 8}`} stroke="#3A3A3A" strokeWidth={2} />
          ))}
          {[0, 1].map((k) => {
            const p = roll(k);
            return (
              <g key={k}>
                <ellipse cx={p.x} cy={705} rx={36 * (1 - dust)} ry={6} fill="#000" opacity={0.5} />
                <Die x={p.x} y={p.y + 30} s={1.4} rot={p.r} dots={k ? 6 : 5} o={1 - dust} />
                {dust > 0
                  ? Array.from({length: 40}, (_, i) => (
                      <circle key={i} cx={p.x + (hash(i * 3 + k) - 0.5) * 120 * dust + dust * 160} cy={p.y + 30 - hash(i * 5 + k) * 160 * dust} r={1.5 + hash(i) * 2.5} fill="#E8E8E8" opacity={(1 - dust) * 0.9 + 0.1 * (1 - dust)} />
                    ))
                  : null}
              </g>
            );
          })}
          <Verse x={960} y={300} text="ya no creemos en la suerte" t={t} at={tLuck - 0.4} out={tB - 0.4} size={56} color="#EDEDED" glow="rgba(255,255,255,0.25)" />
        </g>
      ) : null}
      {t > tB ? (
        <g opacity={eio(t, tB, 0.6)}>
          <Cam t={t} rot={-7} keys={[[tB, 1000, 560, 1.12], [b, 960, 540, 1.04]]} shake={[[tSlam + 0.05, 18]]}>
            <Layer depth={1}>
              <rect x={-400} y={-400} width={2720} height={1900} fill="#0B0B0D" />
              {/* torre de oficinas a la derecha */}
              <rect x={1060} y={-300} width={1300} height={1200} fill="#1A1A1E" />
              {Array.from({length: 40}, (_, k) => (
                <rect key={k} x={1120 + (k % 8) * 140} y={-260 + Math.floor(k / 8) * 160} width={90} height={110} fill={hash(k * 3) > 0.7 ? '#4A4A50' : '#141418'} />
              ))}
              <rect x={1300} y={640} width={150} height={260} fill="#BDBDBD" />
              <Halo x={1375} y={760} r={260} color="#FFFFFF" opacity={0.18} />
              {/* farola */}
              <rect x={470} y={240} width={12} height={660} fill="#050505" />
              <path d="M476 250 L560 250 L560 262 L476 262 Z" fill="#050505" />
              <Halo x={560} y={280} r={300} color="#F2F2F2" opacity={0.35} />
              <path d="M540 266 L580 266 L700 900 L420 900 Z" fill="#FFFFFF" opacity={0.06} />
              <rect x={-400} y={900} width={2720} height={600} fill="#121214" />
              {/* sombra gigante en la pared */}
              <g opacity={0.85}>
                <Figure x={manX + 260} y={900} s={2.6} face={-1} slump={0.5} armF={[30, 60]} armB={[24, 66]} color="#060607" hold={<rect x={-30} y={-20} width={60} height={44} fill="#060607" />} />
              </g>
              {/* el hombre con la caja */}
              <Figure x={manX} y={900} s={0.82} face={-1} slump={0.5} walk={t < tB + 4.2 ? (t - tB) * 4.5 : undefined} armF={[30, 60]} armB={[24, 66]} color="#020202" hold={<g><rect x={-30} y={-20} width={60} height={44} fill="#8A7A62" /><path d="M-30 -20 L-20 -32 L40 -32 L30 -20 Z" fill="#A89880" /></g>} />
              {/* el mazo */}
              <g transform={`translate(${manX + 320} ${lerp(-300, 520, slam)}) rotate(${lerp(-40, 0, slam)})`}>
                <rect x={-140} y={-80} width={280} height={150} rx={20} fill="#050505" />
                <rect x={-14} y={-560} width={28} height={490} fill="#050505" />
              </g>
              {after ? (
                <g opacity={eo(t, tSlam, 0.2)}>
                  <text x={manX + 320} y={720} textAnchor="middle" fontFamily={SERIF} fontWeight={500} fontSize={92} letterSpacing="0.14em" fill="#C81E2A" transform={`rotate(-3 ${manX + 320} 700)`}>
                    CARÁCTER
                  </text>
                  <rect x={manX + 320 - 300} y={630} width={600} height={120} fill="none" stroke="#C81E2A" strokeWidth={6} transform={`rotate(-3 ${manX + 320} 700)`} />
                </g>
              ) : null}
              {/* la tarjeta en el suelo mojado, reflejando */}
              <Card x={760} y={960} s={2.4} rot={14} glow={0.7} />
              <g opacity={0.35} transform="translate(0 1922) scale(1 -1)">
                <Card x={760} y={960} s={2.4} rot={-14} glow={0.4} />
              </g>
              <Rain t={t} n={190} opacity={0.4} color="#E0E0E0" slant={0.08} speed={1700} />
            </Layer>
          </Cam>
          <Verse x={600} y={250} text="despedido por «mala suerte»" t={t} at={W(41, 'despedido') - 0.3} out={S(42) - 0.1} size={48} w={1000} color="#EDEDED" />
          <Verse x={600} y={250} text="el veredicto sobre tu carácter" t={t} at={W(42, 'veredicto') - 0.3} size={48} w={1000} color="#EDEDED" />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 17: detrás de cada número ─────────
const RainGlass: React.FC<{t: number; n?: number}> = ({t, n = 46}) => (
  <g>
    {Array.from({length: n}, (_, i) => {
      const x = hash(i * 3.7) * 1920;
      const sp = 12 + hash(i * 2.1) * 50;
      const y = ((hash(i * 5.9) * 1200 + t * sp) % 1200) - 60;
      const r = 3 + hash(i * 1.3) * 7;
      return (
        <g key={i}>
          <path d={`M${x} ${y - r * 8} L${x} ${y}`} stroke="#C8D8F0" strokeWidth={r * 0.35} opacity={0.12} />
          <circle cx={x} cy={y} r={r} fill="#AFC4E0" opacity={0.18} />
          <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.3} fill="#FFFFFF" opacity={0.5} />
        </g>
      );
    })}
  </g>
);

const Pane: React.FC<{x: number; on: number; id: string; children: React.ReactNode}> = ({x, on, id, children}) => (
  <g>
    <defs>
      <clipPath id={`pane-${id}`}>
        <rect x={x - 220} y={250} width={440} height={560} />
      </clipPath>
      <radialGradient id={`pg-${id}`} cx="0.5" cy="0.6" r="0.7">
        <stop offset="0" stopColor="#4A3A30" />
        <stop offset="1" stopColor="#0E0C10" />
      </radialGradient>
    </defs>
    <g opacity={on}>
      <rect x={x - 220} y={250} width={440} height={560} fill={`url(#pg-${id})`} />
      <g clipPath={`url(#pane-${id})`}>{children}</g>
      <rect x={x - 220} y={250} width={440} height={560} fill="none" stroke="#06070C" strokeWidth={16} />
    </g>
  </g>
);

export const Behind: React.FC<SceneProps> = ({t, a, b}) => {
  const tB = S(44) - 0.3;
  const tShame = W(44, 'vergüenza');
  const tLie = W(44, 'mienten');
  const tBroken = W(44, 'rotas');
  const line = eio(t, a + 0.6, S(44) - a - 1.2);
  const panes = eio(t, tB, 1.0);
  const gold = eo(t, tBroken + 0.3, 3.5);
  const curve = Array.from({length: 60}, (_, k) => {
    const u = k / 59;
    return `${lerp(260, 1660, u).toFixed(1)} ${(820 - (Math.exp(u * 3.2) - 1) / (Math.exp(3.2) - 1) * 520).toFixed(1)}`;
  });
  const BOKEH = ['#F2B45A', '#E05A6A', '#6AB0E0', '#F2D27A', '#A07AE0'];
  return (
    <g>
      <Cam t={t} keys={[[a, 960, 540, 1.0], [b, 960, 540, 1.06]]}>
        <Layer depth={0.3}>
          <rect x={-200} y={-200} width={2320} height={1480} fill="#070A12" />
          {Array.from({length: 34}, (_, i) => (
            <Halo key={i} x={hash(i * 4.3) * 1920 + Math.sin(t * 0.2 + i) * 10} y={300 + hash(i * 2.9) * 600} r={40 + hash(i * 6.1) * 90} color={BOKEH[i % 5]} opacity={0.22 + hash(i) * 0.2} />
          ))}
        </Layer>
        <Layer depth={1}>
          {/* la línea de luz que sube, sin cifras */}
          <g opacity={1 - panes * 0.85}>
            <path d={`M${curve.join(' L')}`} stroke="#F6E6C8" strokeWidth={10} fill="none" opacity={0.12} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
            <path d={`M${curve.join(' L')}`} stroke="#FFF6E0" strokeWidth={2.5} fill="none" pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - line} />
          </g>
          <Pane x={420} on={panes * eo(t, tShame - 0.6, 0.8)} id="p1">
            <rect x={300} y={700} width={240} height={50} fill="#0A0808" />
            <Figure x={410} y={770} s={0.9} sit face={1} slump={0.9} armF={[24, 150]} armB={[20, 150]} rim={{color: '#FFB878', dx: -1.5, dy: 0, opacity: 0.6}} />
            <Halo x={300} y={360} r={200} color="#FFB878" opacity={0.3} />
          </Pane>
          <Pane x={960} on={panes * eo(t, tLie - 0.6, 0.8)} id="p2">
            <Halo x={960} y={420} r={240} color="#C8B8E0" opacity={0.25} />
            <Figure
              x={930}
              y={790}
              s={1.05}
              face={1}
              armF={[62, 74]}
              rim={{color: '#C8B8E0', dx: 1.2, dy: 0, opacity: 0.6}}
              hold={
                <g>
                  <ellipse cx={4} cy={-18} rx={24} ry={30} fill="#F2EEE6" />
                  <path d="M-8 -26 L0 -26 M10 -26 L18 -26" stroke="#2A2630" strokeWidth={3.5} strokeLinecap="round" />
                  <path d="M-8 -6 C-2 4 10 4 16 -6" stroke="#2A2630" strokeWidth={3} fill="none" strokeLinecap="round" />
                </g>
              }
            />
          </Pane>
          <Pane x={1500} on={panes * eo(t, tBroken - 0.6, 0.8)} id="p3">
            <Halo x={1500} y={520} r={260} color="#FFD27A" opacity={0.15 + gold * 0.35} />
            <Figure x={1480} y={790} s={1.05} face={1} slump={0.3} armF={[16, 20]} color="#E6E0D6" />
            {[
              'M1490 450 L1496 480 L1486 520 L1498 560',
              'M1478 600 L1490 640 L1480 690 L1494 720',
              'M1504 560 L1520 590 L1514 620',
              'M1470 520 L1462 556 L1474 590',
            ].map((d, k) => (
              <g key={k}>
                <path d={d} stroke={mix('#4A4440', '#FFD27A', gold)} strokeWidth={2.5 + gold * 1.5} fill="none" strokeLinejoin="round" />
                {gold > 0 ? <path d={d} stroke="#FFE7A0" strokeWidth={8} fill="none" opacity={gold * 0.25} /> : null}
              </g>
            ))}
          </Pane>
          <RainGlass t={t} />
          <Rain t={t} n={60} opacity={0.12} />
        </Layer>
      </Cam>
      <Verse x={960} y={250} text="detrás de cada estadística, hay personas" t={t} at={W(44, 'estadística') - 0.4} out={tShame - 0.7} size={48} color="#E8EEF8" />
      <Verse x={420} y={890} text="vergüenza" t={t} at={tShame - 0.2} size={36} w={440} color="#F6D8B8" />
      <Verse x={960} y={890} text="aparentar" t={t} at={tLie - 0.2} size={36} w={440} color="#E0D6F0" />
      <Verse x={1500} y={890} text="rotas… y aun así, de oro" t={t} at={tBroken - 0.2} size={36} w={560} color="#FFE6A8" glow="rgba(255,200,90,0.6)" />
    </g>
  );
};

// ───────── Escena 18: la gota ─────────
export const Drop: React.FC<SceneProps> = ({t, a, b}) => {
  const tHit = a + 0.9;
  const dawn = eio(t, tHit, 3.0);
  const fall = clamp((t - (a + 0.1)) / (tHit - a - 0.1));
  return (
    <g>
      <defs>
        <radialGradient id="puddle18" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0" stopColor={mix('#2A3442', '#F6C8A0', dawn)} />
          <stop offset="0.55" stopColor={mix('#141A24', '#9A6A6A', dawn)} />
          <stop offset="1" stopColor={mix('#05070C', '#2A1C26', dawn)} />
        </radialGradient>
      </defs>
      <rect x={0} y={0} width={1920} height={1080} fill="url(#puddle18)" />
      <Halo x={1080} y={480} r={600} color="#FFD8B0" opacity={0.5 * dawn} />
      {Array.from({length: 7}, (_, k) => {
        const d = t - tHit - k * 0.32;
        if (d <= 0) return null;
        const r = d * 260;
        return <ellipse key={k} cx={960} cy={540} rx={r} ry={r * 0.92} fill="none" stroke={mix('#AFC0D8', '#FFE6C8', dawn)} strokeWidth={3 - k * 0.3} opacity={Math.max(0, 0.7 - d * 0.22)} />;
      })}
      {t < tHit ? (
        <g>
          <circle cx={960} cy={540} r={6 + fall * 26} fill="#DCE8F8" opacity={0.25 + fall * 0.6} />
          <circle cx={954} cy={533} r={3 + fall * 8} fill="#FFFFFF" opacity={0.8} />
        </g>
      ) : (
        <g opacity={1 - eo(t, tHit, 0.6)}>
          {Array.from({length: 12}, (_, k) => {
            const ang = (k / 12) * Math.PI * 2;
            const d = eo(t, tHit, 0.5) * 70;
            return <circle key={k} cx={960 + Math.cos(ang) * d} cy={540 + Math.sin(ang) * d} r={4} fill="#EEF4FF" />;
          })}
        </g>
      )}
      <Verse x={960} y={300} text="¿Cómo superarlo?" t={t} at={W(45, 'superarlo') - 0.7} size={76} color="#FFF4E6" glow="rgba(255,200,150,0.75)" />
    </g>
  );
};
