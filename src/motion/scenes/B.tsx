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
  Shock,
  spr,
  Token,
  wobble,
} from '../kit';
import {SceneProps} from './A';

const phase = (t: number, t0: number, t1: number, f = 0.4) => clamp((t - t0) / f) * clamp((t1 - t) / f);

/** Palabra que entra con resorte y luego estalla en letras sueltas */
export const Shatter: React.FC<{x: number; y: number; text: string; t: number; at: number; breakAt: number; size?: number; color?: string; seed?: number}> = ({x, y, text, t, at, breakAt, size = 70, color = M.white, seed = 1}) => {
  if (t < at - 0.05) return null;
  const age = t - breakAt;
  if (age > 1.2) return null;
  const chars = Array.from(text);
  return (
    <foreignObject x={x - 700} y={y - size} width={1400} height={size * 2.4} style={{overflow: 'visible'}}>
      <div style={{fontFamily: FONT, fontWeight: 900, fontSize: size, color, textAlign: 'center', whiteSpace: 'nowrap'}}>
        {chars.map((ch, i) => {
          const s = spr(t, at + i * 0.025, 2.2, 0.45);
          let tr = `translateY(${(1 - s) * -size}px)`;
          let o = clamp(s * 4);
          if (age > 0) {
            const vx = (hash(i * 3 + seed) - 0.5) * 900;
            const vy = -200 - hash(i * 7 + seed) * 400;
            tr = `translate(${vx * age}px, ${vy * age + 900 * age * age}px) rotate(${(hash(i + seed) - 0.5) * 900 * age}deg)`;
            o = 1 - age / 1.2;
          }
          return (
            <span key={i} style={{display: 'inline-block', transform: tr, opacity: o, whiteSpace: 'pre'}}>
              {ch === ' ' ? ' ' : ch}
            </span>
          );
        })}
      </div>
    </foreignObject>
  );
};

// ───────── Escena 7: el teléfono y la batería del amor ─────────
const Post: React.FC<{t: number; likes: number}> = ({t, likes}) => (
  <g>
    <rect x={760} y={170} width={400} height={780} rx={48} fill="#0B0E20" stroke={M.bg3} strokeWidth={6} />
    <rect x={782} y={196} width={356} height={728} rx={32} fill={M.white} />
    <circle cx={826} cy={246} r={22} fill={M.violet} />
    <rect x={862} y={234} width={140} height={14} rx={7} fill="#C9CCDD" />
    <rect x={862} y={256} width={90} height={10} rx={5} fill="#E1E3EE" />
    <defs>
      <linearGradient id="postImg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={M.violet} />
        <stop offset="1" stopColor={M.coral} />
      </linearGradient>
    </defs>
    <rect x={782} y={290} width={356} height={400} fill="url(#postImg)" />
    <circle cx={1060} cy={360} r={36} fill={M.amber} opacity={0.9} />
    <Token x={960} y={660} s={1.5} color={M.amber} shadow={false} />
    {[0, 1, 2].map((i) => (
      <Icon key={i} name="star" x={860 + i * 110} y={340 + (i % 2) * 70} s={0.18 + 0.05 * Math.sin(t * 6 + i)} color={M.white} fill={M.white} sw={6} />
    ))}
    <Icon name="heart" x={826} y={740} s={0.55} color={M.coral} fill={M.coral} sw={7} />
    <text x={866} y={756} fontFamily={FONT} fontWeight={900} fontSize={40} fill={M.bg}>
      {likes.toLocaleString('es-ES')}
    </text>
    <Icon name="comment" x={1096} y={742} s={0.42} color={M.bg} sw={8} />
    <rect x={806} y={800} width={300} height={14} rx={7} fill="#D5D8E6" />
    <rect x={806} y={830} width={220} height={14} rx={7} fill="#E1E3EE" />
  </g>
);

const SocialCard: React.FC<{x: number; y: number; kind: 0 | 1 | 2; t: number; at: number}> = ({x, y, kind, t, at}) => {
  const s = spr(t, at, 1.8, 0.55);
  if (s <= 0.001) return null;
  const n = Math.floor(clamp((t - at) / 3) * [87, 140, 64][kind]);
  const cols = [M.coral, M.cyan, M.violet];
  return (
    <g transform={`translate(${x + (1 - clamp(s)) * 1300} ${y}) rotate(${(1 - clamp(s)) * 12})`}>
      <rect x={-220} y={-310} width={440} height={620} rx={36} fill={M.white} filter="url(#dropShadow)" />
      <rect x={-196} y={-286} width={392} height={330} rx={22} fill={cols[kind]} />
      {kind === 0 ? <Icon name="car" x={0} y={-130} s={2.6} color={M.white} sw={6} /> : null}
      {kind === 1 ? (
        <g>
          <Icon name="sun" x={90} y={-200} s={1.2} color={M.amber} sw={7} />
          <Icon name="wave" x={-20} y={-60} s={3} color={M.white} sw={5} />
        </g>
      ) : null}
      {kind === 2 ? (
        <g>
          <Icon name="shirt" x={0} y={-140} s={2.4} color={M.white} sw={6} />
          <text y={-60} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} letterSpacing={10} fill={M.amber}>
            LUXE
          </text>
        </g>
      ) : null}
      <circle cx={-160} cy={110} r={30} fill={[M.amber, M.mint, M.rose][kind]} />
      <rect x={-116} y={94} width={180} height={16} rx={8} fill="#C9CCDD" />
      <rect x={-116} y={120} width={120} height={12} rx={6} fill="#E1E3EE" />
      <text y={230} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={44} fill={M.bg}>
        {['EL VECINO', 'EL AMIGO', 'EL COMPAÑERO'][kind]}
      </text>
      {/* globo de notificación */}
      <g transform={`translate(196 -300) scale(${spr(t, at + 0.4, 2.6, 0.45)}) rotate(${wobble(t, at + 0.6, 14, 3, 3)})`}>
        <circle r={46} fill={M.coral} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={M.white}>
          {n}
        </text>
      </g>
    </g>
  );
};

export const PhoneLove: React.FC<SceneProps> = ({t, a, b}) => {
  const tVan = W(11, 'vanidad');
  const tFri = W(11, 'frivolidad');
  const tIn = S(12);
  const tVul = W(12, 'vulnerabilidad');
  const tNeed = W(12, 'necesidad');
  const tCar = S(13);
  const likes = Math.floor(Math.pow(clamp((t - a) / 7), 2.2) * 48210) + 7;
  const inside = phase(t, tIn + 0.8, tCar - 0.1, 0.4);
  const phoneOn = t < tIn + 1.3;
  const blink = Math.floor(t * 3) % 2 === 0;
  return (
    <g>
      {phoneOn ? (
        <Cam t={t} keys={[[a, 960, 560, 1.0], [tIn - 0.3, 960, 560, 1.04], [tIn + 1.2, 960, 520, 7.5]]}>
          <Layer depth={0.3}>
            <Bg t={t} />
          </Layer>
          <Layer depth={1}>
            <g transform={`translate(0 ${(1 - clamp(spr(t, a + 0.1, 1.6, 0.55))) * 900})`}>
              <Post t={t} likes={likes} />
            </g>
            {/* corazones que suben */}
            {Array.from({length: 26}, (_, i) => {
              const born = a + 0.8 + i * 0.22;
              const age = t - born;
              if (age < 0 || age > 1.8) return null;
              return <Icon key={i} name="heart" x={826 + Math.sin(age * 5 + i) * 26 + (hash(i) - 0.5) * 60} y={720 - age * 330} s={0.25 + hash(i + 3) * 0.2} color={M.coral} fill={M.coral} sw={6} opacity={1 - age / 1.8} />;
            })}
            <Shatter x={400} y={430} text="¿VANIDAD?" t={t} at={tVan - 0.1} breakAt={tFri + 1.0} size={76} color={M.white} seed={3} />
            <Shatter x={1520} y={640} text="¿FRIVOLIDAD?" t={t} at={tFri - 0.1} breakAt={tFri + 1.2} size={76} color={M.white} seed={9} />
          </Layer>
        </Cam>
      ) : null}
      {/* dentro de la persona: la batería del amor */}
      {inside > 0 ? (
        <g opacity={inside}>
          <Bg t={t} />
          <g transform={`translate(960 980) scale(${4.2 * (0.9 + 0.1 * spr(t, tIn + 0.8))})`}>
            <rect x={-35} y={-100} width={70} height={100} rx={35} fill={M.violet} opacity={0.22} stroke={M.violet} strokeWidth={1.2} />
            <circle cx={0} cy={-140} r={28} fill={M.violet} opacity={0.22} stroke={M.violet} strokeWidth={1.2} />
          </g>
          <g transform={`translate(960 640) scale(${2.6 * spr(t, tIn + 1.0, 2, 0.5)})`}>
            <Icon name="battery" x={0} y={0} s={1} color={M.white} sw={5} />
            <rect x={-36} y={-18} width={10} height={36} rx={3} fill={blink ? M.red : '#7a2030'} />
          </g>
          <Kin x={960} y={250} text="UNA VULNERABILIDAD INTENSA" t={t} at={tVul - 0.1} size={62} weight={900} stagger={0.015} />
          <Kin x={960} y={890} text="AMOR Y RECONOCIMIENTO" t={t} at={tNeed - 0.1} size={52} weight={900} color={M.coral} stagger={0.015} glow="rgba(255,59,78,0.6)" />
          <Kin x={960} y={990} text="12%" t={t} at={tNeed + 0.3} size={70} weight={900} color={blink ? M.red : M.white} mode="pop" />
        </g>
      ) : null}
      {/* carrusel: el vecino, el amigo, el compañero */}
      {t > tCar - 0.3 ? (
        <g opacity={eo(t, tCar - 0.3, 0.3)}>
          <Bg t={t} />
          <SocialCard x={400} y={560} kind={0} t={t} at={W(13, 'vecino') - 0.4} />
          <SocialCard x={960} y={560} kind={1} t={t} at={W(13, 'amigo') - 0.4} />
          <SocialCard x={1520} y={560} kind={2} t={t} at={W(13, 'compañero') - 0.4} />
          <Kin x={960} y={1010} text="TODOS PIDEN LO MISMO: ¡MÍRAME!" t={t} at={W(13, 'compañero') + 1.2} size={46} weight={900} color={M.amber} stagger={0.012} />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 8: la promesa ─────────
export const Promise: React.FC<SceneProps> = ({t, a, b}) => {
  const tCan = W(14, '¡podemos');
  const boom = tCan + 1.4;
  const tKid = S(15);
  const tNet = S(16);
  const tOpp = W(16, 'oportunidades');
  const tFall = S(17);
  const tFail = W(17, 'fallamos');
  const tTop = W(18, 'cima');
  const kidPhase = phase(t, a - 1, tNet + 0.3);
  const netPhase = phase(t, tNet - 0.3, tFall + 0.2);
  const chartPhase = t > tFall - 0.3 ? eo(t, tFall - 0.3, 0.3) : 0;
  const textOut = eio(t, boom, 0.25);
  // red de caminos
  const nodes: {x: number; y: number; lvl: number; parent: number}[] = [{x: 300, y: 560, lvl: 0, parent: -1}];
  for (let lvl = 1; lvl <= 5; lvl++) {
    const n = 2 ** lvl;
    for (let k = 0; k < n; k++) nodes.push({x: 300 + lvl * 300, y: 560 + (k - (n - 1) / 2) * (860 / n), lvl, parent: 2 ** (lvl - 1) - 1 + Math.floor(k / 2)});
  }
  // gráfica de la cima
  const path = Array.from({length: 80}, (_, i) => {
    const u = i / 79;
    return [180 + u * 1460, 900 - Math.pow(u, 1.25) * 640 + Math.sin(u * 22) * 16] as [number, number];
  });
  const climb = eio(t, tFall, tFail - tFall + 0.1);
  const idx = Math.floor(clamp(climb) * 62);
  const head = path[idx];
  const fall = pr(t, tFail + 0.3, 1.0);
  const glitch = t > tFail && t < tFail + 0.35;
  const fx = head[0] + fall * 160;
  const fy = head[1] + fall * fall * 700;
  return (
    <g>
      <Bg t={t} />
      {kidPhase > 0 ? (
        <g opacity={kidPhase}>
          <g opacity={1 - textOut} transform={`translate(960 450) scale(${1 + textOut * 0.3}) translate(-960 -450)`}>
            <Kin x={960} y={400} text="¡PUEDES SER" t={t} at={tCan - 0.5} size={130} weight={900} stagger={0.03} />
            <Kin x={960} y={560} text="LO QUE QUIERAS!" t={t} at={tCan - 0.2} size={130} weight={900} color={M.amber} stagger={0.03} glow="rgba(255,200,69,0.5)" />
          </g>
          <Burst x={960} y={460} t={t} at={boom} n={70} spread={900} dur={2.2} size={18} />
          <Shock x={960} y={460} t={t} at={boom} color={M.amber} r={700} />
          <Token x={960} y={980 - Math.abs(Math.sin(t * 5)) * 26} s={1.2} color={M.amber} p={spr(t, a + 2.1)}>
            <g transform="translate(0 -170) scale(0.62)">
              <Icon name="gradcap" x={0} y={0} color={M.bg} fill={M.bg} sw={6} />
            </g>
          </Token>
          {[-1, 1].map((sd) => (
            <g key={sd}>
              <Token x={960 + sd * 420} y={980} s={1.7} color={sd < 0 ? M.coral : M.violet} p={spr(t, tKid - 0.2 + (sd > 0 ? 0.15 : 0))} />
              {t > tKid
                ? [0, 1, 2].map((r) => {
                    const k = ((t - tKid) * 2.5 + r / 3) % 1;
                    return (
                      <path
                        key={r}
                        d={`M${960 + sd * 420 + sd * (40 + k * 50)} ${720 - r * 30} l${sd * 30} ${-10 + r * 10}`}
                        stroke={M.amber}
                        strokeWidth={6}
                        strokeLinecap="round"
                        opacity={1 - k}
                      />
                    );
                  })
                : null}
            </g>
          ))}
          <Pill x={960} y={150} text="DESDE LA INFANCIA" t={t} at={tKid + 0.2} bg={M.violet} size={34} />
        </g>
      ) : null}
      {netPhase > 0 ? (
        <g opacity={netPhase}>
          {nodes.slice(1).map((nd, i) => {
            const pa = nodes[nd.parent];
            const at = tNet + 0.2 + nd.lvl * 0.35 + (i % 4) * 0.02;
            const p = eo(t, at, 0.4);
            if (p <= 0) return null;
            return <path key={i} d={`M${pa.x} ${pa.y} C${pa.x + 150} ${pa.y} ${nd.x - 150} ${nd.y} ${nd.x} ${nd.y}`} fill="none" stroke={PALETTE[nd.lvl % PALETTE.length]} strokeWidth={4} opacity={0.75} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - p} />;
          })}
          <Glow>
            {nodes.slice(1).map((nd, i) => {
              const s = spr(t, tNet + 0.5 + nd.lvl * 0.35 + (i % 4) * 0.02, 2.4, 0.45);
              return s > 0.001 ? <circle key={i} cx={nd.x} cy={nd.y} r={Math.max(4, 16 - nd.lvl * 2) * s} fill={PALETTE[nd.lvl % PALETTE.length]} /> : null;
            })}
          </Glow>
          <Token x={300} y={640} s={0.8} color={M.amber} />
          <Kin x={960} y={120} text="TANTAS OPORTUNIDADES" t={t} at={tOpp - 0.3} size={70} weight={900} stagger={0.02} />
        </g>
      ) : null}
      {chartPhase > 0 ? (
        <g opacity={chartPhase}>
          <path d="M160 940 L1760 940" stroke={M.grayLight} strokeWidth={4} opacity={0.5} />
          <path d={path.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={M.white} strokeWidth={3} strokeDasharray="6 12" opacity={0.25} />
          <Glow>
            <path d={path.slice(0, idx + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={M.mint} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
          </Glow>
          <g transform="translate(1640 250)">
            <Icon name="flag" x={0} y={0} s={1.3} color={M.amber} fill={M.amber} sw={7} />
          </g>
          <text x={1640} y={170} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={40} fill={M.amber}>
            LA CIMA
          </text>
          {glitch ? (
            <g>
              <circle cx={head[0] - 10} cy={head[1]} r={22} fill={M.cyan} opacity={0.8} />
              <circle cx={head[0] + 10} cy={head[1]} r={22} fill={M.coral} opacity={0.8} />
            </g>
          ) : null}
          <Glow>
            <circle cx={fall > 0 ? fx : head[0]} cy={fall > 0 ? fy : head[1]} r={22} fill={t > tFail ? M.red : M.mint} />
          </Glow>
          <Kin x={960} y={1030} text="¿Y SI FALLAMOS?" t={t} at={tFail - 0.1} size={64} weight={900} color={M.red} out={tTop - 0.5} />
          <Kin x={960} y={1030} text="¿Y SI NO LLEGAS A LA CIMA?" t={t} at={tTop - 0.3} size={60} weight={900} color={M.white} stagger={0.015} />
          <Disclaimer />
        </g>
      ) : null}
      <ChapterTitle t={t} at={a} num="02" title="LA PROMESA" color={M.amber} />
    </g>
  );
};

// ───────── Escena 9: la carrera desigual ─────────
export const Race: React.FC<SceneProps> = ({t, a, b}) => {
  const tNot = W(19, 'no todos');
  const tEdu = W(20, 'educación');
  const tHealth = W(20, 'salud');
  const tStab = W(20, 'estabilidad');
  const tLack = W(20, 'carencias');
  const tRule = W(21, 'misma regla');
  const tGo = tRule + 1.3;
  const tDes = W(21, 'desigualdades');
  const tilt = eio(t, tDes - 0.4, 1.4);
  const runA = eio(t, tGo, 5.5);
  const runB = clamp((t - tGo) / 9);
  const ax = lerp(760, 1680, runA);
  const bx = lerp(200, 560, runB) + Math.sin(t * 9) * 3 * (runB > 0 ? 1 : 0);
  const hurdles = [520, 880, 1240];
  const ups: [string, string, number, number][] = [
    ['book', M.cyan, 1000, tEdu],
    ['medkit', M.coral, 1220, tHealth],
    ['coin', M.amber, 1440, tStab],
  ];
  return (
    <g>
      <Bg t={t} />
      <Kin x={960} y={130} text="NO TODOS PARTIMOS DEL MISMO LUGAR" t={t} at={tNot - 0.2} size={58} weight={900} stagger={0.012} out={tRule - 0.4} />
      <Pill x={960} y={120} text="MISMAS REGLAS PARA TODOS" t={t} at={tRule - 0.1} bg={M.white} color={M.bg} size={36} icon="flag" />
      <g transform={`rotate(${-tilt * 4.5} 960 620)`}>
        {/* carril privilegiado: cinta transportadora */}
        <rect x={100} y={430} width={1720} height={100} rx={50} fill={M.bg3} />
        <rect x={100} y={430} width={1720} height={100} rx={50} fill="none" stroke={M.mint} strokeWidth={4} opacity={0.6} />
        {Array.from({length: 24}, (_, i) => {
          const x = 140 + ((i * 80 + t * 220) % 1640);
          return <path key={i} d={`M${x} 462 l22 18 l-22 18`} fill="none" stroke={M.mint} strokeWidth={6} strokeLinecap="round" opacity={0.45} />;
        })}
        {/* carril difícil */}
        <rect x={100} y={760} width={1720} height={100} rx={50} fill={M.bg3} />
        <rect x={100} y={760} width={1720} height={100} rx={50} fill="none" stroke={M.coral} strokeWidth={4} opacity={0.5} />
        <path d="M680 400 L680 900" stroke={M.white} strokeWidth={4} strokeDasharray="12 10" opacity={0.6} />
        <text x={680} y={380} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={24} letterSpacing={4} fill={M.white} opacity={0.6}>
          SALIDA
        </text>
        {/* ventajas que flotan sobre el carril de arriba */}
        {ups.map(([n, c, x, at], i) => {
          const taken = ax > x - 20;
          const s = spr(t, at - 0.1, 2.4, 0.45) * (taken ? 1 - eo(t, tGo + ((x - 760) / 920) * 5.5 * 0.55, 0.25) : 1);
          return (
            <g key={n}>
              <IconBadge name={n} x={x} y={330 + Math.sin(t * 3 + i) * 8} r={50} bg={c} color={M.bg} p={s} />
              {taken ? <Burst x={x} y={330} t={t} at={tGo + ((x - 760) / 920) * 5.5 * 0.55} n={14} spread={260} dur={0.8} size={10} colors={[c, M.white]} seed={i * 5} /> : null}
            </g>
          );
        })}
        <Token x={ax} y={470} s={1.1} color={M.mint} p={spr(t, a + 0.3)} lean={runA > 0 && runA < 1 ? 8 : 0} />
        {/* carencias que caen en el carril de abajo */}
        {hurdles.map((x, i) => {
          const s = spr(t, tLack - 0.1 + i * 0.15, 2.2, 0.5);
          if (s <= 0.001) return null;
          return (
            <g key={i} transform={`translate(${x} ${800 - (1 - clamp(s)) * 400})`}>
              <rect x={-8} y={-70} width={16} height={70} rx={6} fill={M.coral} />
              <rect x={-50} y={-76} width={100} height={18} rx={9} fill={M.coral} />
            </g>
          );
        })}
        <Token x={bx} y={800} s={1.1} color={M.coral} p={spr(t, a + 0.5)} sad={runB > 0}>
          {t > tLack + 0.5 ? (
            <g>
              <path d="M10 -10 Q40 20 54 40" stroke={M.grayLight} strokeWidth={4} fill="none" />
              <g transform={`translate(62 52) scale(${0.5 * spr(t, tLack + 0.5)})`}>
                <Icon name="weight" x={0} y={0} color={M.grayLight} fill={M.gray} sw={8} />
              </g>
            </g>
          ) : null}
        </Token>
        <Pill x={330} y={690} text="CARENCIAS" t={t} at={tLack} bg={M.coral} size={26} />
        {/* banderazo */}
        <g transform={`translate(680 330) rotate(${t > tGo - 0.3 ? wobble(t, tGo - 0.3, 25, 2.5, 2) : 0})`} opacity={eo(t, tRule, 0.3)}>
          <Icon name="flag" x={0} y={0} s={0.9} color={M.white} fill={M.white} sw={7} />
        </g>
      </g>
      <Kin x={960} y={1035} text="DESIGUALDADES ESTRUCTURALES" t={t} at={tDes - 0.1} size={66} weight={900} color={M.amber} mode="slam" stagger={0.02} glow="rgba(255,200,69,0.45)" />
    </g>
  );
};

// ───────── Escena 10: la sección de autoayuda ─────────
const BOOKS_L = [M.coral, M.amber, M.mint, M.cyan, M.violet, M.rose];
const Cover: React.FC<{x: number; y: number; t: number; at: number; lines: string[]; bg: string; ink: string; best?: boolean; rot?: number; out?: number}> = ({x, y, t, at, lines, bg, ink, best, rot = 0, out}) => {
  const s = spr(t, at, 1.8, 0.5);
  if (s <= 0.001) return null;
  const o = out !== undefined ? 1 - eio(t, out, 0.4) : 1;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot + (1 - clamp(s)) * -20}) scale(${s * (0.6 + 0.4 * o)})`} opacity={o}>
      <rect x={-170} y={-230} width={340} height={460} rx={18} fill={bg} filter="url(#dropShadow)" />
      <rect x={-170} y={-230} width={26} height={460} rx={8} fill="#000" opacity={0.15} />
      {lines.map((l, i) => (
        <text key={i} x={10} y={-120 + i * 58} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={42} fill={ink}>
          {l}
        </text>
      ))}
      {best ? (
        <g transform={`translate(130 170) rotate(${t * 40})`}>
          <path d={Array.from({length: 24}, (_, i) => {
            const ang = (i / 24) * Math.PI * 2;
            const r = i % 2 ? 54 : 70;
            return `${i ? 'L' : 'M'}${Math.cos(ang) * r} ${Math.sin(ang) * r}`;
          }).join(' ') + ' Z'} fill={M.amber} />
          <g transform={`rotate(${-t * 40})`}>
            <text y={-4} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={17} fill={M.bg}>
              ¡BEST
            </text>
            <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={17} fill={M.bg}>
              SELLER!
            </text>
          </g>
        </g>
      ) : null}
    </g>
  );
};

export const Books: React.FC<SceneProps> = ({t, a, b}) => {
  const tA = S(24);
  const tB = W(24, 'conviértase');
  const tC = S(26);
  const toBars = eio(t, tC + 1.3, 0.6);
  return (
    <g>
      <Bg t={t} />
      <Kin x={960} y={140} text="AUTOAYUDA" t={t} at={a + 0.2} size={84} weight={900} stagger={0.03} />
      {/* pila alta */}
      {BOOKS_L.map((c, i) => {
        const y = 900 - i * 52;
        const s = spr(t, a + 0.4 + i * 0.12, 2.2, 0.5);
        const by = y;
        return <rect key={i} x={380 + (i % 2) * 14} y={by - 46 - (1 - clamp(s)) * 700} width={360 - (i % 3) * 24} height={46} rx={8} fill={c} />;
      })}
      {/* pila baja */}
      {[0, 1].map((i) => {
        const s = spr(t, a + 1.2 + i * 0.12, 2.2, 0.5);
        return <rect key={i} x={1200} y={900 - i * 52 - 46 - (1 - clamp(s)) * 700} width={340} height={46} rx={8} fill={i ? '#6E7493' : '#575D7E'} />;
      })}
      <Pill x={560} y={500} text="TIPO 1 · TRIUNFAR" t={t} at={S(23)} bg={M.coral} size={30} out={tA - 0.2} />
      <Pill x={1370} y={700} text="TIPO 2 · SOBREVIVIR" t={t} at={S(25)} bg={M.gray} size={30} out={tC - 0.2} />
      <Cover x={470} y={470} t={t} at={tA - 0.15} lines={['CÓMO', 'TRIUNFAR', 'EN 15', 'MINUTOS']} bg={M.coral} ink={M.white} best rot={-6} out={tC + 1.2} />
      <Cover x={850} y={450} t={t} at={tB - 0.2} lines={['CONVIÉRTASE', 'EN MILLONARIO', 'DE LA NOCHE', 'A LA MAÑANA']} bg={M.amber} ink={M.bg} best rot={5} out={tC + 1.2} />
      <Cover x={1370} y={540} t={t} at={tC - 0.15} lines={['CÓMO LIDIAR', 'CON UNA BAJA', 'AUTOESTIMA']} bg="#6E7493" ink={M.white} rot={-3} out={tC + 1.2} />
      {toBars > 0 ? (
        <g opacity={toBars}>
          <path d="M300 902 L1640 902" stroke={M.white} strokeWidth={3} opacity={0.6} />
          <text x={560} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} letterSpacing={3} fill={M.white}>
            PARA TRIUNFAR
          </text>
          <text x={1370} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} letterSpacing={3} fill={M.white}>
            PARA LA AUTOESTIMA
          </text>
          <Disclaimer />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 11: el embudo de neón ─────────
const N_DOTS = 120;
const FDOTS = Array.from({length: N_DOTS}, (_, i) => ({x0: 560 + hash(i * 3.1) * 800, start: i * 0.07, pass: i % 12 === 5}));

export const Funnel: React.FC<SceneProps> = ({t, a, b}) => {
  const tF = W(28, 'una sociedad');
  const tAll = W(28, 'tenerlo');
  const tMin = W(28, 'pequeña minoría');
  const tSad = W(28, 'insatisfacción');
  const tAf = W(28, 'aflicción');
  const intro = phase(t, a - 1, tF + 0.1);
  const T = t - tF;
  const top = 300;
  const neck = 660;
  const cx = 960;
  const half = (y: number) => (y < neck ? lerp(440, 36, (y - top) / (neck - top)) : 36);
  let settled = 0;
  return (
    <g>
      <Bg t={t} />
      {intro > 0 ? (
        <g opacity={intro}>
          <rect x={380} y={420} width={360} height={480} rx={20} fill={M.coral} />
          <rect x={1180} y={760} width={360} height={140} rx={20} fill="#6E7493" />
          <g transform={`translate(960 640) scale(${spr(t, a + 0.2)}) rotate(${Math.sin(t * 4) * 8})`}>
            <circle r={80} fill={M.white} />
            <Icon name="link" x={0} y={0} s={1.3} color={M.bg} sw={8} />
          </g>
          <Kin x={960} y={250} text="ESTÁN RELACIONADOS" t={t} at={a + 0.2} size={80} weight={900} stagger={0.02} />
        </g>
      ) : null}
      {t > tF - 0.3 ? (
        <g opacity={eo(t, tF - 0.3, 0.3)}>
          <Kin x={960} y={150} text="«PODRÍAS TENERLO TODO»" t={t} at={tAll - 0.4} size={66} weight={900} stagger={0.015} />
          <Glow>
            <path d={`M${cx - 440} ${top} L${cx - 36} ${neck} L${cx - 36} 800 M${cx + 440} ${top} L${cx + 36} ${neck} L${cx + 36} 800`} stroke={M.cyan} strokeWidth={8} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </Glow>
          {FDOTS.map((d, i) => {
            const age = T - d.start;
            if (age < 0) return null;
            if (d.pass) {
              const y = 220 + 560 * age * age;
              const x = lerp(d.x0, cx, clamp(age * 1.6));
              const yy = Math.min(y, 960);
              const slot = Math.floor(i / 12);
              return (
                <Glow key={i}>
                  <circle cx={yy >= 960 ? cx - 100 + slot * 34 : x} cy={yy} r={14} fill={M.amber} />
                </Glow>
              );
            }
            const sl = settled++;
            const row = Math.floor(Math.sqrt(sl * 1.3));
            const yS = neck - 24 - row * 26;
            const w = half(yS) - 22;
            const xS = cx - w + ((sl * 41) % Math.max(1, Math.round(2 * w)));
            const fk = clamp(age / 0.8);
            const x = lerp(d.x0, xS, fk);
            const y = lerp(220, yS, fk * fk);
            const g = clamp((age - 0.8) / 0.5);
            return <circle key={i} cx={x} cy={y} r={12} fill={g > 0.5 ? M.gray : M.white} opacity={1 - g * 0.3} />;
          })}
          <Pill x={1300} y={970} text="UNA PEQUEÑA MINORÍA" t={t} at={tMin} bg={M.amber} color={M.bg} size={32} anchor="left" />
          <Kin x={90} y={820} text="INSATISFACCIÓN" t={t} at={tSad - 0.1} size={56} weight={900} color={M.grayLight} align="left" w={700} stagger={0.015} />
          <Kin x={90} y={910} text="AFLICCIÓN" t={t} at={tAf - 0.1} size={56} weight={900} color={M.grayLight} align="left" w={700} stagger={0.015} />
          <Disclaimer />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 12: el mito del mérito (línea de tiempo) ─────────
export const Merit: React.FC<SceneProps> = ({t, a, b}) => {
  const tJust = W(29, 'justas');
  const tPast = S(30);
  const tFixed = W(30, 'arreglado');
  const tCul = W(31, 'culpa');
  const tFeu = W(31, 'feudal');
  const tMer = W(32, 'meritocracias');
  const tDes = W(32, 'merecen');
  const tWork = W(32, 'trabajadoras');
  const tSmart = W(32, 'astutas');
  const just = phase(t, a + 1.9, tPast + 0.1);
  const jit = (k: number) => Math.sin(t * 40 + k) * 4;
  return (
    <g>
      <Bg t={t} />
      <Cam t={t} keys={[[a, 900, 540, 1.0], [tPast, 900, 540, 1.0], [tMer - 0.8, 900, 540, 1.0], [tMer + 0.6, 3500, 540, 1.0], [b, 3520, 540, 1.04]]}>
        <Layer depth={1}>
          {just > 0 ? (
            <g opacity={just}>
              <Kin x={900} y={330} text="SOCIEDADES" t={t} at={a + 2.0} size={56} weight={800} color={M.grayLight} />
              <g transform={`translate(900 520)`}>
                <text x={-300 + jit(1)} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={M.coral} opacity={eo(t, tJust - 0.3, 0.2)} transform={`rotate(${jit(2)} -300 0)`}>
                  «
                </text>
                <text x={300 + jit(3)} y={40} textAnchor="middle" fontFamily={FONT} fontWeight={900} fontSize={170} fill={M.coral} opacity={eo(t, tJust - 0.3, 0.2)} transform={`rotate(${jit(4)} 300 0)`}>
                  »
                </text>
              </g>
              <Kin x={900} y={580} text="JUSTAS" t={t} at={tJust - 0.2} size={150} weight={900} />
              <g transform={`translate(900 800) rotate(${Math.sin(t * 3) * 10})`}>
                <Icon name="scale" x={0} y={0} s={1.4} color={M.grayLight} draw={eo(t, tJust, 0.6)} sw={6} />
              </g>
            </g>
          ) : null}
          {/* línea de tiempo */}
          <g opacity={eo(t, tPast - 0.2, 0.4)}>
            <path d="M-300 900 L4400 900" stroke={M.white} strokeWidth={4} opacity={0.35} />
            {[
              [700, 'EDAD MEDIA', M.violet],
              [1700, 'SIGLO XVI', M.grayLight],
              [2600, 'SIGLO XIX', M.grayLight],
              [3500, 'HOY', M.amber],
            ].map(([x, l, c]) => (
              <g key={l as string}>
                <circle cx={x as number} cy={900} r={16} fill={c as string} />
                <text x={x as number} y={960} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing={3} fill={c as string}>
                  {l}
                </text>
              </g>
            ))}
            <Kin x={700} y={150} text="EL SISTEMA ESTABA ARREGLADO" t={t} at={tFixed - 0.3} size={54} weight={900} stagger={0.012} />
            <IconBadge name="castle" x={700} y={420} r={90} bg={M.violet} p={spr(t, tPast + 0.2)} />
            <Token x={420} y={820} s={1.2} color="#C48A4A" p={spr(t, tPast + 0.5)} squash={wobble(t, tCul, 0.12, 3, 4)}>
              <g transform="translate(70 -60) scale(0.7)">
                <Icon name="wheat" x={0} y={0} color={M.amber} sw={6} />
              </g>
            </Token>
            <Token x={980} y={820} s={1.4} color={M.violet} p={spr(t, tPast + 0.7)} squash={wobble(t, tFeu, 0.12, 3, 4)}>
              <g transform="translate(0 -205) scale(0.5)">
                <Icon name="crown" x={0} y={0} color={M.amber} fill={M.amber} sw={8} />
              </g>
            </Token>
            <Pill x={420} y={560} text="NO ERA TU CULPA" t={t} at={tCul - 0.1} bg={M.white} color={M.bg} size={28} />
            <Pill x={980} y={540} text="NI TU MÉRITO" t={t} at={tFeu - 0.1} bg={M.white} color={M.bg} size={28} />
          </g>
          {/* hoy */}
          <Kin x={3500} y={460} text="MERITOCRACIA" t={t} at={tMer} size={150} weight={900} color={M.amber} stagger={0.04} glow="rgba(255,200,69,0.45)" />
          <Kin x={3500} y={640} text="MÉRITO  →  RECOMPENSA" t={t} at={tDes - 0.2} size={70} weight={900} stagger={0.025} />
          <Pill x={3330} y={790} text="TRABAJADORAS" t={t} at={tWork - 0.1} bg={M.mint} color={M.bg} size={34} />
          <Pill x={3680} y={790} text="ASTUTAS" t={t} at={tSmart - 0.1} bg={M.cyan} color={M.bg} size={34} />
        </Layer>
      </Cam>
      <ChapterTitle t={t} at={a} num="03" title="EL MITO DEL MÉRITO" color={M.violet} ink={M.white} />
    </g>
  );
};

export const _b = {Shock, clamp};
