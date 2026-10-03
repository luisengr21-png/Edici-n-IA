import React from 'react';
import {
  C,
  Cam,
  Defs,
  Draw,
  E,
  Fig,
  Icon,
  P,
  PE,
  PO,
  Phone,
  S,
  SceneProps,
  TopFig,
  W,
  clamp,
  easeIn,
  easeInOut,
  easeOutBack,
  figHeadY,
  hash,
  lerp,
  mixHex,
  noise,
} from '../kit';
import world from '../worlddots.json';

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute', ...style}}>
    <Defs />
    {children}
  </svg>
);

// ════════════════════ Escena 1 — Las celdas ════════════════════
export const Scene1: React.FC<SceneProps> = ({t}) => {
  const tAlone = W(0, 'miedo');
  const tWall = W(0, 'aislándonos') - 0.2;
  const tOut = W(0, 'tratando') - 0.3;
  const COLS = 17;
  const ROWS = 11;
  const cs = 150;
  const c0 = (COLS - 1) / 2;
  const r0 = (ROWS - 1) / 2;
  const z = lerp(lerp(2.7, 2.35, PE(t, 0, tWall)), 0.78, PE(t, tOut, 3.6));
  const cells: React.ReactNode[] = [];
  const walls: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c;
      const isMe = c === c0 && r === r0;
      const cx = 960 + (c - c0) * cs;
      const cy = 540 + (r - r0) * cs;
      const dist = Math.hypot(c - c0, r - r0);
      const tw = isMe ? tWall : tOut + 0.35 + dist * 0.16 + hash(id) * 0.25;
      // deambular antes de encerrarse; al acercarse la hora, se asienta en el centro de su celda
      const settle = PE(t, tw - 0.9, 0.9);
      let dx = (hash(id * 3) - 0.5) * 70 + noise(t * 0.35, id) * 38;
      let dy = (hash(id * 7) - 0.5) * 70 + noise(t * 0.35, id + 500) * 38;
      // el miedo: los demás se apartan un poco del protagonista
      if (!isMe && dist < 2.5) {
        const away = PE(t, tAlone, 1.5) * (1 - settle) * 40;
        dx += ((c - c0) / (dist || 1)) * away;
        dy += ((r - r0) / (dist || 1)) * away;
      }
      dx *= 1 - settle;
      dy *= 1 - settle;
      const dir = isMe
        ? 90 + Math.sin((t - tAlone) * 2.2) * 70 * P(t, tAlone, 0.4) * (1 - P(t, tWall - 0.3, 0.4))
        : 90 + noise(t * 0.3, id + 77) * 140;
      const cold = PE(t, tOut + 1, 3);
      cells.push(
        <TopFig
          key={id}
          x={cx + dx}
          y={cy + dy}
          s={1.05}
          color={isMe ? C.amber : mixHex(C.stone, '#4d5970', cold)}
          dir={dir}
          glow={isMe ? 0.6 : 0}
        />,
      );
      const h = 57;
      if (isMe) {
        const seg = [
          `M${cx - h} ${cy - h} L${cx + h} ${cy - h}`,
          `M${cx + h} ${cy - h} L${cx + h} ${cy + h}`,
          `M${cx + h} ${cy + h} L${cx - h} ${cy + h}`,
          `M${cx - h} ${cy + h} L${cx - h} ${cy - h}`,
        ];
        seg.forEach((d, k) => walls.push(<Draw key={`m${k}`} d={d} p={PO(t, tWall + k * 0.3, 0.3)} color={C.cream} w={5} cap="butt" />));
      } else {
        walls.push(
          <Draw
            key={id}
            d={`M${cx - h} ${cy - h} L${cx + h} ${cy - h} L${cx + h} ${cy + h} L${cx - h} ${cy + h} Z`}
            p={PO(t, tw, 0.7)}
            color={C.stoneLight}
            w={3.5}
            cap="butt"
          />,
        );
      }
    }
  }
  return (
    <Svg>
      <Cam z={z}>
        {cells}
        {walls}
      </Cam>
    </Svg>
  );
};

// ════════════════════ Escena 2 — El mundo y el espejo ════════════════════
const proj = (lon: number, lat: number): [number, number] => [80 + (lon + 168) * 4.92, 215 + (76 - lat) * 4.92];
const CITIES: [number, number][] = [
  [-74, 40.7], [-118, 34], [-46.6, -23.5], [-58.4, -34.6], [0, 51.5], [-3.7, 40.4], [3.4, 6.5], [31, 30], [37.6, 55.7],
  [72.8, 19], [116.4, 39.9], [139.7, 35.7], [151.2, -33.9], [-74, 4.7], [28, -26], [106.8, -6.2], [-77, -12], [-123, 49.3],
];
const HOME = proj(-99.1, 19.4);

export const Scene2: React.FC<SceneProps> = ({t, a}) => {
  const tArc = W(1, 'mundo') - 0.5;
  const tMirror = S(2) - 0.45;
  const kz = clamp((t - tMirror) / 0.8);
  const mapZoom = lerp(1, 1.22, PE(t, a, tMirror - a)) * (1 + 7 * easeIn(kz));
  const arrivals = CITIES.filter((_, i) => t > tArc + i * 0.07 + 1.25).length;
  const homeGlow = clamp(arrivals / CITIES.length);
  // espejo
  const km = easeInOut(clamp((t - tMirror - 0.25) / 0.8));
  const tBest = W(2, 'mejor');
  const camX = lerp(880, 1060, PE(t, tMirror, 6));
  return (
    <>
      {kz < 1 && (
        <Svg style={{opacity: 1 - kz}}>
          <Cam cx={lerp(960, HOME[0], PE(t, a, tMirror - a) * 0.35 + kz * 0.65)} cy={lerp(540, HOME[1], PE(t, a, tMirror - a) * 0.35 + kz * 0.65)} z={mapZoom}>
            {world.dots.map(([lon, lat], i) => {
              const [x, y] = proj(lon, lat);
              const o = P(t, a + 0.05 + (x / 1920) * 0.7 + hash(i) * 0.25, 0.35);
              return o > 0 ? <circle key={i} cx={x} cy={y} r={2.7} fill={C.stoneLight} opacity={o * 0.75} /> : null;
            })}
            {CITIES.map(([lon, lat], i) => {
              const [x, y] = proj(lon, lat);
              const ts = tArc + i * 0.07;
              const mx = (x + HOME[0]) / 2;
              const my = (y + HOME[1]) / 2 - Math.hypot(x - HOME[0], y - HOME[1]) * 0.32;
              const u = P(t, ts + 0.15, 1.1);
              const q = (k: number) => [(1 - k) ** 2 * x + 2 * (1 - k) * k * mx + k * k * HOME[0], (1 - k) ** 2 * y + 2 * (1 - k) * k * my + k * k * HOME[1]];
              const [hx, hy] = q(easeInOut(u));
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={5} fill={C.cream} opacity={P(t, ts - 0.2, 0.3)} />
                  <Draw d={`M${x} ${y} Q${mx} ${my} ${HOME[0]} ${HOME[1]}`} p={PO(t, ts, 1.1)} color={C.cream} w={1.8} opacity={0.55} />
                  {u > 0 && u < 1 && <Icon name="heart" x={hx} y={hy} s={0.28} color={C.coral} />}
                </g>
              );
            })}
            <circle cx={HOME[0]} cy={HOME[1]} r={60 + homeGlow * 50} fill="url(#srGlow)" opacity={0.3 + homeGlow * 0.7} />
            <circle cx={HOME[0]} cy={HOME[1]} r={8 + homeGlow * 3} fill={C.amber} />
          </Cam>
        </Svg>
      )}
      {km > 0 && (
        <Svg style={{opacity: km, transform: `scale(${0.6 + 0.4 * km})`}}>
          <Cam cx={camX} cy={560} z={1}>
            {/* contraluz tras el espejo */}
            <circle cx={1180} cy={520} r={520} fill="url(#srWarm)" opacity={0.75} />
            {/* escalera de versiones */}
            {[0, 1, 2, 3, 4].map((i) => {
              const ti = tBest + 0.1 + i * 0.32;
              const o = P(t, ti, 0.5) * (1 - i * 0.16);
              const x = 1420 + i * 150;
              const y = 760 - i * 120;
              return (
                <g key={i} opacity={o}>
                  <path d={`M${x - 90} ${y} L${x + 70} ${y} L${x + 70} ${y - 120}`} stroke={C.creamDim} strokeWidth={2} fill="none" opacity={0.4} />
                  <Fig x={x} y={y} s={1.5 - i * 0.07} color="none" outline={mixHex(C.amberGlow, C.cream, i * 0.2)} shadow={false} glow={0.5} />
                </g>
              );
            })}
            {/* espejo */}
            <ellipse cx={1180} cy={540} rx={165} ry={265} fill="#1f2633" stroke={C.cream} strokeWidth={6} />
            <clipPath id="mirrorClip">
              <ellipse cx={1180} cy={540} rx={160} ry={260} />
            </clipPath>
            <g clipPath="url(#mirrorClip)">
              <rect x={1000} y={260} width={360} height={560} fill="url(#srWarm)" opacity={0.6} />
              <Fig x={1180} y={760} s={2.3 * (1 + 0.04 * P(t, tBest, 0.6))} color={C.amber} outline={C.amberGlow} glow={0.9} shadow={false} />
              <path d="M1080 330 L1120 300 M1240 700 L1280 670" stroke="#ffffff" strokeWidth={6} opacity={0.18} strokeLinecap="round" />
            </g>
            <rect x={1170} y={805} width={20} height={70} fill={C.cream} />
            <rect x={1110} y={870} width={140} height={10} rx={5} fill={C.cream} />
            {/* el original */}
            <Fig x={720} y={880} s={2.3} color={mixHex(C.amber, C.amberMuted, 0.25)} />
            <line x1={300} y1={882} x2={1700} y2={882} stroke={C.line} strokeWidth={2} />
          </Cam>
        </Svg>
      )}
    </>
  );
};

// ════════════════════ Escena 3 — Rebobinar ════════════════════
const crayon = (pts: [number, number][], seed: number) => {
  let d = '';
  pts.forEach(([x, y], i) => {
    const jx = (hash(seed + i) - 0.5) * 18;
    const jy = (hash(seed + i * 3) - 0.5) * 18;
    d += i === 0 ? `M${x + jx} ${y + jy}` : ` L${x + jx} ${y + jy}`;
  });
  return d;
};
const zig = (x0: number, y0: number, x1: number, y1: number, n: number, amp: number) => {
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const k = i / n;
    const nx = -(y1 - y0);
    const ny = x1 - x0;
    const l = Math.hypot(nx, ny);
    const o = (i % 2 ? 1 : -1) * amp;
    pts.push([lerp(x0, x1, k) + (nx / l) * o, lerp(y0, y1, k) + (ny / l) * o]);
  }
  return pts;
};

/** Escenario de la infancia: niño, adulto gigante, haz de atención. Compartido por las escenas 3 y 4. */
export const ChildhoodSet: React.FC<{t: number; childK: number; adultK: number; beam: number; warm: number; childColor?: string; beamDim?: number}> = ({
  t,
  childK,
  adultK,
  beam,
  warm,
  childColor = C.amber,
  beamDim = 0,
}) => {
  const ax = lerp(-260, 560, easeInOut(adultK));
  const cx = lerp(1180, 1080, childK);
  const s = lerp(2.4, 2.1, childK);
  const headY = 860 + figHeadY(childK) * s;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2a2018" opacity={0.55 * warm} />
      {/* trazos de crayón en los bordes */}
      {[
        {pts: zig(40, 120, 300, 40, 9, 16), c: C.amber},
        {pts: zig(1620, 1040, 1890, 900, 9, 16), c: C.teal},
        {pts: zig(30, 980, 210, 1060, 7, 14), c: C.coral},
        {pts: zig(1700, 60, 1900, 200, 7, 14), c: C.coral},
      ].map((o, i) => (
        <Draw key={i} d={crayon(o.pts, i * 31)} p={warm * 1.05} color={o.c} w={7} opacity={0.4} />
      ))}
      {/* haz de atención */}
      <polygon
        points={`${ax + 120},${560} ${ax + 150},${600} ${cx + 150},${880} ${cx - 150},${880}`}
        fill="url(#srBeam)"
        opacity={beam * (1 - beamDim) * (0.85 + 0.15 * Math.sin(t * 3))}
      />
      <ellipse cx={cx} cy={872} rx={170} ry={20} fill="#ffd890" opacity={beam * (1 - beamDim) * 0.25} />
      <line x1={0} y1={862} x2={1920} y2={862} stroke={C.line} strokeWidth={2} opacity={0.6} />
      <Fig x={ax} y={1260} s={7.2} color={mixHex(C.stoneDark, C.stone, 0.4)} shadow={false} />
      <Fig x={cx} y={860} s={s} child={childK} color={childColor} glow={beam * (1 - beamDim) * 0.7} />
      <circle cx={cx} cy={headY} r={0} />
    </g>
  );
};

export const Scene3: React.FC<SceneProps> = ({t, a}) => {
  const tRev = W(3, 'nada') - 0.4;
  const tKid = S(4) - 0.3;
  // reloj: avanza suave y luego gira hacia atrás acelerando
  const fwd = (t - a) * 6;
  const back = easeIn(P(t, tRev, 2.6)) * 1440 + Math.max(0, t - tRev - 2.6) * 600;
  const ang = fwd - back;
  const kidK = PE(t, tKid, 1.2);
  const clockO = 1 - PE(t, tKid + 0.2, 0.7);
  const blur = clamp((t - tRev) / 1.2) * clockO;
  return (
    <Svg>
      <ChildhoodSet t={t} childK={kidK} adultK={P(t, tKid + 0.35, 1.3)} beam={PE(t, tKid + 1.1, 0.9)} warm={kidK} />
      <g opacity={clockO} transform={`translate(${lerp(620, 420, 1 - clockO)} 470) scale(${lerp(1, 0.7, 1 - clockO)})`}>
        <circle r={230} fill="none" stroke={C.cream} strokeWidth={4} />
        <circle r={214} fill="none" stroke={C.line} strokeWidth={1.5} />
        {Array.from({length: 60}).map((_, i) => {
          const big = i % 5 === 0;
          const r1 = big ? 186 : 198;
          const th = (i / 60) * Math.PI * 2;
          return <line key={i} x1={Math.sin(th) * r1} y1={-Math.cos(th) * r1} x2={Math.sin(th) * 210} y2={-Math.cos(th) * 210} stroke={C.cream} strokeWidth={big ? 4 : 1.5} opacity={big ? 0.9 : 0.5} />;
        })}
        {[0.12, 0.08, 0.05].map((g, k) => (
          <g key={k} opacity={blur * g * 2.5}>
            <line x1={0} y1={0} x2={0} y2={-170} stroke={C.amber} strokeWidth={5} transform={`rotate(${ang + (k + 1) * 9 * blur * 3})`} />
          </g>
        ))}
        <line x1={0} y1={0} x2={0} y2={-120} stroke={C.cream} strokeWidth={9} strokeLinecap="round" transform={`rotate(${ang / 12})`} />
        <line x1={0} y1={22} x2={0} y2={-175} stroke={C.amber} strokeWidth={5} strokeLinecap="round" transform={`rotate(${ang})`} />
        <circle r={11} fill={C.cream} />
      </g>
    </Svg>
  );
};

// ════════════════════ Escena 4 — El interruptor del cariño ════════════════════
const Core: React.FC<{y: number; r: number; plates: number; seed?: number}> = ({y, r, plates}) => {
  const cols = [C.amber, C.coral, C.teal, '#c58cf0', '#7fc8f8', C.cream];
  return (
    <g>
      <clipPath id="coreClip">
        <circle cx={0} cy={y} r={r} />
      </clipPath>
      <circle cx={0} cy={y} r={r} fill="#241c1a" />
      <g clipPath="url(#coreClip)">
        {cols.map((c, i) => {
          const pts = Array.from({length: 8}).map((_, k) => [(hash(i * 13 + k) - 0.5) * r * 2.2, y + (hash(i * 7 + k * 5) - 0.5) * r * 2.2]);
          return <polyline key={i} points={pts.map((p) => p.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={r * 0.18} strokeLinejoin="round" strokeLinecap="round" />;
        })}
      </g>
      {/* placas que lo tapan */}
      {[
        {x: -r * 1.1, w: r * 1.15},
        {x: 0, w: r * 1.15},
        {x: -r * 0.55, w: r * 1.1},
      ].map((pl, i) => {
        const k = clamp(plates - i);
        if (k <= 0) return null;
        return (
          <rect
            key={i}
            x={pl.x + (1 - easeOutBack(k)) * (i === 1 ? 40 : -40)}
            y={y - r * 1.05}
            width={pl.w}
            height={r * 2.1}
            rx={3}
            fill={mixHex(C.amberMuted, C.stone, 0.35)}
            stroke={C.bg}
            strokeWidth={1.2}
            opacity={k}
          />
        );
      })}
    </g>
  );
};

const Gauge: React.FC<{x: number; y: number; v: number; o: number}> = ({x, y, v, o}) => {
  const th = lerp(-80, 80, v);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <circle r={118} fill={C.bg2} stroke={C.cream} strokeWidth={4} />
      <path d="M-90 0 A90 90 0 0 1 0 -90" stroke={C.coral} strokeWidth={12} fill="none" />
      <path d="M0 -90 A90 90 0 0 1 90 0" stroke={C.teal} strokeWidth={12} fill="none" />
      {Array.from({length: 9}).map((_, i) => {
        const a = ((-80 + i * 20) * Math.PI) / 180;
        return <line key={i} x1={Math.sin(a) * 70} y1={-Math.cos(a) * 70} x2={Math.sin(a) * 80} y2={-Math.cos(a) * 80} stroke={C.cream} strokeWidth={2} />;
      })}
      <line x1={0} y1={0} x2={0} y2={-84} stroke={C.cream} strokeWidth={5} strokeLinecap="round" transform={`rotate(${th})`} />
      <circle r={10} fill={C.cream} />
      <Icon name="heart" y={46} s={0.6} color={C.coral} />
    </g>
  );
};

export const Scene4: React.FC<SceneProps> = ({t}) => {
  const tHeart = W(4, 'amor');
  const tStar = W(4, 'aprobación');
  const tLink = W(4, 'depender');
  const tSplit = S(5) - 0.45;
  const tGrow = S(6) - 0.35;
  const g1 = W(6, 'crecemos');
  const g2 = W(6, 'ganarnos');
  const g3 = W(6, 'aceptación');
  const gEnd = W(6, 'autenticidad');
  const split = PE(t, tSplit, 0.6);
  const grow = PE(t, tGrow, 0.5);
  // ---- parte 1: el haz y sus condiciones
  const part1 = 1 - split;
  // ---- parte 2: pantalla dividida
  const tGood = W(5, 'buenos') - 0.5;
  const tLove = W(5, 'quieren');
  const tBad = W(5, 'si no');
  const tOff = W(5, 'retiran');
  const needle = 0.5 + 0.45 * PE(t, tLove - 0.2, 0.6) - 0.9 * PE(t, tOff, 0.35) + 0.03 * Math.sin(t * 9) * P(t, tOff, 0.2);
  // ---- parte 3: crecer
  const step = (P(t, g1, 0.12) + P(t, g2, 0.12) + P(t, g3, 0.12)) as number;
  const childK = 1 - step / 3;
  const stepT = [g1, g2, g3].reduce((acc, g) => (t >= g ? g : acc), g1);
  const bounce = Math.exp(-(t - stepT) * 9) * Math.sin((t - stepT) * 30) * (t >= g1 ? 1 : 0);
  const muted = PE(t, gEnd - 0.2, 1.4);
  const s3 = lerp(3.0, 4.8, step / 3);
  return (
    <>
      {part1 > 0 && (
        <Svg style={{opacity: part1}}>
          <ChildhoodSet t={t} childK={1} adultK={1} beam={1} warm={1} />
          <g transform="translate(1080 560)">
            <Icon name="heart" x={-70} y={-40 * PO(t, tHeart, 0.6)} s={easeOutBack(P(t, tHeart, 0.5)) * 1.1} color={C.coral} />
            <Icon name="star" x={70} y={-40 * PO(t, tStar, 0.6)} s={easeOutBack(P(t, tStar, 0.5)) * 1.1} color={C.amber} />
          </g>
          {/* interruptor: la atención depende del comportamiento */}
          <g opacity={P(t, tLink, 0.4)}>
            <Draw d="M1080 860 C 1300 860 1400 700 1400 470" p={PO(t, tLink, 0.8)} color={C.cream} w={3} opacity={0.7} />
            <Draw d="M1400 470 C 1400 330 1000 300 790 520" p={PO(t, tLink + 0.6, 0.8)} color={C.cream} w={3} opacity={0.7} />
            <g transform="translate(1400 440)">
              <rect x={-55} y={-30} width={110} height={60} rx={30} fill={C.bg2} stroke={C.cream} strokeWidth={4} />
              <circle cx={lerp(-25, 25, PE(t, tLink + 0.9, 0.3))} r={21} fill={mixHex(C.stone, C.teal, PE(t, tLink + 0.9, 0.3))} />
            </g>
          </g>
        </Svg>
      )}
      {split > 0 && grow < 1 && (
        <Svg style={{opacity: split * (1 - grow)}}>
          {[0, 1].map((side) => {
            const ox = side * 960;
            const good = side === 0;
            const dim = good ? 0 : PE(t, tOff, 0.35);
            const adultX = 300 + ox + (good ? 0 : -140 * PE(t, tOff, 0.9));
            const kidX = 640 + ox;
            return (
              <g key={side}>
                <clipPath id={`half${side}`}>
                  <rect x={ox} y={0} width={960} height={1080} />
                </clipPath>
                <g clipPath={`url(#half${side})`}>
                  <rect x={ox} width={960} height={1080} fill="#2a2018" opacity={0.5 * (1 - dim * 0.6)} />
                  <polygon points={`${adultX + 60},560 ${adultX + 80},590 ${kidX + 120},880 ${kidX - 120},880`} fill="url(#srBeam)" opacity={1 - dim * 0.95} />
                  <line x1={ox} y1={862} x2={ox + 960} y2={862} stroke={C.line} strokeWidth={2} />
                  <Fig x={adultX} y={1240} s={5.2} color={mixHex(mixHex(C.stoneDark, C.stone, 0.4), C.bg, dim * 0.5)} shadow={false} />
                  <Fig x={kidX} y={860} s={1.8} child={1} color={C.amber} glow={1 - dim} />
                  {good &&
                    [0, 1, 2].map((i) => {
                      const k = PO(t, tGood + i * 0.22, 0.35);
                      return <rect key={i} x={kidX + 70} y={lerp(300, 812 - i * 52, k)} width={50} height={50} rx={4} fill={[C.teal, C.amber, C.coral][i]} opacity={P(t, tGood + i * 0.22, 0.1)} />;
                    })}
                  {good && <Icon name="star" x={kidX} y={lerp(120, 610, easeOutBack(P(t, tLove, 0.7)))} s={1.1} color={C.amber} opacity={P(t, tLove, 0.2)} />}
                  {!good &&
                    [C.coral, C.teal, C.amber, '#c58cf0', '#7fc8f8'].map((c, i) => {
                      const k = PO(t, tBad + i * 0.07, 0.5);
                      return <ellipse key={i} cx={kidX + 40 + (i - 2) * 46 * k} cy={866} rx={k * (40 + hash(i) * 30)} ry={k * 12} fill={c} opacity={0.9} />;
                    })}
                </g>
              </g>
            );
          })}
          <Draw d="M960 0 L960 1080" p={PE(t, tSplit, 0.5)} color={C.cream} w={4} cap="butt" />
          <Gauge x={960} y={300} v={clamp(needle)} o={P(t, tSplit + 0.3, 0.4)} />
        </Svg>
      )}
      {grow > 0 && (
        <Svg style={{opacity: grow}}>
          <rect width={1920} height={1080} fill="#2a2018" opacity={0.45 * (1 - PE(t, g2, 3))} />
          <line x1={0} y1={902} x2={1920} y2={902} stroke={C.line} strokeWidth={2} />
          <g transform={`translate(960 900) scale(${s3 * (1 + bounce * 0.05)} ${s3 * (1 - bounce * 0.05)})`}>
            <Fig x={0} y={0} s={1} child={childK} color={mixHex(C.amber, C.amberMuted, muted)} glow={0.4 * (1 - muted)}>
              <Core y={lerp(-36, -26, childK)} r={14} plates={step} />
            </Fig>
          </g>
        </Svg>
      )}
    </>
  );
};

// ════════════════════ Escena 5 — El efecto multiplicador ════════════════════
const PH_W = 340;
const PH_H = 620;
export const Scene5: React.FC<SceneProps> = ({t, a}) => {
  const tMul = W(7, 'multiplica') - 0.25;
  const tChart = S(8) - 0.4;
  const tUp = W(8, 'Nunca');
  const tDown = W(8, 'paradójicamente') - 0.2;
  const tEnd = E(8);
  const zk = PE(t, tMul, 3.2);
  const z = lerp(1, 0.2, Math.pow(zk, 0.7));
  const phonesO = 1 - 0.85 * PE(t, tChart, 0.8);
  const phones: React.ReactNode[] = [];
  const NC = 15;
  const NR = 7;
  for (let r = -NR; r <= NR; r++) {
    for (let c = -NC; c <= NC; c++) {
      const ring = Math.max(Math.abs(c), Math.abs(r * 1.8));
      const o = c === 0 && r === 0 ? 1 : P(t, tMul + 0.15 + ring * 0.13 + hash(c * 31 + r) * 0.1, 0.25);
      if (o <= 0) continue;
      const x = 960 + c * (PH_W + 60);
      const y = 540 + r * (PH_H + 60);
      const badge = P(t, tMul + 0.4 + ring * 0.13 + hash(c + r * 17) * 1.5, 0.2);
      phones.push(
        <Phone key={`${c}:${r}`} x={x} y={y} w={PH_W} h={PH_H} sw={6} color={C.creamDim} screen="#161b25" opacity={o}>
          <rect x={-PH_W / 2 + 12} y={-PH_H / 2 + 40} width={PH_W - 24} height={PH_H - 80} rx={20} fill="url(#srCold)" />
          <Fig x={0} y={150} s={2.1} color={C.amberMuted} shadow={false} />
          <g opacity={badge}>
            <circle cx={PH_W / 2 - 50} cy={-PH_H / 2 + 80} r={26} fill={C.coral} />
            <Icon name="heart" x={PH_W / 2 - 50} y={-PH_H / 2 + 80} s={0.42} color={C.cream} />
          </g>
        </Phone>,
      );
    }
  }
  // gráfica
  const N = 90;
  const ox = 360;
  const oy = 860;
  const W_ = 1180;
  const up = (k: number): [number, number] => [ox + k * W_, oy - 70 - 520 * Math.pow(k, 1.8) - Math.sin(k * 23) * 8 * k];
  const down = (k: number): [number, number] => [ox + k * W_, oy - 560 + 470 * Math.pow(k, 1.3) + Math.sin(k * 19 + 1) * 10 * k];
  const pu = PE(t, tUp, tDown - tUp + 0.6);
  const pd = PE(t, tDown, tEnd - tDown + 0.2);
  const path = (f: (k: number) => [number, number], p: number) => {
    const n = Math.max(1, Math.round(N * p));
    return Array.from({length: n + 1}).map((_, i) => f((p * i) / n).join(',')).join(' ');
  };
  const tipU = up(pu);
  const tipD = down(pd);
  // cruce aproximado
  let kx = 0;
  for (let i = 0; i <= 200; i++) {
    const k = i / 200;
    if (up(k)[1] < down(k)[1]) {
      kx = k;
      break;
    }
  }
  const cross = up(kx);
  const crossed = pd >= kx && pu >= kx;
  const tCross = tDown + (tEnd - tDown + 0.2) * kx;
  const push = PE(t, tEnd - 0.3, 3);
  const chartO = PE(t, tChart, 0.8);
  return (
    <Svg>
      <Cam z={z}>{phones}</Cam>
      <g opacity={phonesO}>
        {Array.from({length: 40}).map((_, i) => {
          const sp = 140 + hash(i) * 160;
          const y = ((t - a) * sp + hash(i * 3) * 1200) % 1300 - 110;
          return <rect key={i} x={hash(i * 7) * 1920} y={y} width={44} height={14} rx={7} fill="#9fc7ff" opacity={0.1 * P(t, tMul, 1)} />;
        })}
      </g>
      {chartO > 0 && (
        <g opacity={chartO}>
          <rect width={1920} height={1080} fill={C.bg} opacity={0.82} />
          <Cam cx={lerp(960, cross[0], push)} cy={lerp(540, cross[1], push)} z={lerp(1, 1.55, push)}>
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={ox} x2={ox + W_} y1={oy - i * 140} y2={oy - i * 140} stroke={C.grid} strokeWidth={1.5} />
            ))}
            <Draw d={`M${ox} ${oy - 640} L${ox} ${oy} L${ox + W_ + 40} ${oy}`} p={PO(t, tChart, 0.9)} color={C.creamDim} w={3} />
            {pu > 0 && <polyline points={path(up, pu)} fill="none" stroke={C.teal} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />}
            {pd > 0 && <polyline points={path(down, pd)} fill="none" stroke={C.coral} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />}
            {pu > 0 && (
              <g transform={`translate(${tipU[0]} ${tipU[1]})`}>
                <circle r={34} fill={C.bg} stroke={C.teal} strokeWidth={4} />
                <Icon name="chain" s={0.62} color={C.teal} sw={6} />
              </g>
            )}
            {pd > 0 && (
              <g transform={`translate(${tipD[0]} ${tipD[1]})`}>
                <circle r={34} fill={C.bg} stroke={C.coral} strokeWidth={4} />
                <Icon name="heart" s={0.7} color={C.coral} />
              </g>
            )}
            {crossed && (
              <g opacity={1 - P(t, tCross + 0.6, 1.5) * 0.6}>
                <circle cx={cross[0]} cy={cross[1]} r={20 + 120 * PO(t, tCross, 0.7)} fill="none" stroke={C.cream} strokeWidth={3} opacity={1 - P(t, tCross, 0.7)} />
                <circle cx={cross[0]} cy={cross[1]} r={9} fill={C.cream} />
              </g>
            )}
          </Cam>
        </g>
      )}
    </Svg>
  );
};
