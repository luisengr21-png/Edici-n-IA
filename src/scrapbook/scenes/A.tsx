import React from 'react';
import {
  Cam,
  Cut,
  Dot,
  E,
  Fig,
  Hand,
  Icon,
  K,
  P,
  PE,
  PFig,
  PO,
  Page,
  S,
  SceneProps,
  Svg,
  Tape,
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
  tornRect,
  usePose,
} from '../kit';
import world from '../../serreal/worlddots.json';

const ink = (d: string, p: number) => (p <= 0 ? null : <path d={d} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - clamp(p)} fill="none" strokeLinecap="round" strokeLinejoin="round" />);

// ════════════════════ Escena 1 — Las celdas (hoja cuadriculada) ════════════════════
export const Scene1: React.FC<SceneProps> = ({t}) => {
  const tAlone = W(0, 'miedo');
  const tWall = W(0, 'aislándonos') - 0.2;
  const tOut = W(0, 'tratando') - 0.3;
  const COLS = 17;
  const ROWS = 11;
  const cs = 150;
  const c0 = 8;
  const r0 = 5;
  const z = lerp(lerp(2.6, 2.3, PE(t, 0, tWall)), 0.8, PE(t, tOut, 3.6));
  const dots: React.ReactNode[] = [];
  const boxes: React.ReactNode[] = [];
  const mine: React.ReactNode[] = [];
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const id = r * COLS + c;
      const isMe = c === c0 && r === r0;
      const cx = 960 + (c - c0) * cs;
      const cy = 540 + (r - r0) * cs;
      const dist = Math.hypot(c - c0, r - r0);
      const tw = isMe ? tWall : tOut + 0.35 + dist * 0.16 + hash(id) * 0.25;
      const settle = PE(t, tw - 0.9, 0.9);
      let dx = (hash(id * 3) - 0.5) * 70 + noise(t * 0.35, id) * 38;
      let dy = (hash(id * 7) - 0.5) * 70 + noise(t * 0.35, id + 500) * 38;
      if (!isMe && dist < 2.5) {
        const away = PE(t, tAlone, 1.5) * (1 - settle) * 40;
        dx += ((c - c0) / (dist || 1)) * away;
        dy += ((r - r0) / (dist || 1)) * away;
      }
      dx *= 1 - settle;
      dy *= 1 - settle;
      const dir = isMe ? 90 + Math.sin((t - tAlone) * 2.2) * 70 * P(t, tAlone, 0.4) * (1 - P(t, tWall - 0.3, 0.4)) : 90 + noise(t * 0.3, id + 77) * 140;
      dots.push(<Dot key={id} id={id} x={cx + dx} y={cy + dy} s={1.05} color={isMe ? K.mustard : K.news} dir={dir} />);
      const h = 58;
      const wob = (k: number) => (hash(id * 11 + k) - 0.5) * 8;
      if (isMe) {
        const seg = [
          `M${cx - h + wob(1)} ${cy - h} L${cx + h} ${cy - h + wob(2)}`,
          `M${cx + h} ${cy - h + wob(2)} L${cx + h + wob(3)} ${cy + h}`,
          `M${cx + h + wob(3)} ${cy + h} L${cx - h} ${cy + h + wob(4)}`,
          `M${cx - h} ${cy + h + wob(4)} L${cx - h + wob(1)} ${cy - h}`,
        ];
        seg.forEach((d, k) => mine.push(<g key={k}>{ink(d, PO(t, tWall + k * 0.3, 0.3))}</g>));
      } else {
        boxes.push(<g key={id}>{ink(`M${cx - h + wob(1)} ${cy - h} L${cx + h} ${cy - h + wob(2)} L${cx + h + wob(3)} ${cy + h} L${cx - h} ${cy + h + wob(4)} Z`, PO(t, tw, 0.6))}</g>);
      }
    }
  return (
    <>
      <Page kind="grid" />
      <Svg>
        <Cam z={z}>
          {dots}
          <g filter="url(#boil)" stroke={K.graphite} strokeWidth={4}>
            {boxes}
          </g>
          <g filter="url(#boil)" stroke={K.ink} strokeWidth={7}>
            {mine}
          </g>
        </Cam>
        <Tape x={110} y={60} w={240} rot={-32} pat="washiA" />
        <Tape x={1810} y={60} w={240} rot={32} pat="washiB" />
      </Svg>
    </>
  );
};

// ════════════════════ Escena 2 — Mapa en el corcho y espejo de aluminio ════════════════════
const proj = (lon: number, lat: number): [number, number] => [150 + (lon + 168) * 4.55, 230 + (76 - lat) * 4.55];
const CITIES: [number, number][] = [
  [-74, 40.7], [-118, 34], [-46.6, -23.5], [-58.4, -34.6], [0, 51.5], [-3.7, 40.4], [3.4, 6.5], [31, 30], [37.6, 55.7],
  [72.8, 19], [116.4, 39.9], [139.7, 35.7], [151.2, -33.9], [-74, 4.7], [28, -26], [106.8, -6.2], [-77, -12], [-123, 49.3],
];
const HOME = proj(-99.1, 19.4);
const Pin: React.FC<{x: number; y: number; color: string; r?: number}> = ({x, y, color, r = 9}) => (
  <g>
    <ellipse cx={x + 4} cy={y + 6} rx={r} ry={r * 0.7} fill="#2a1c10" opacity={0.3} />
    <circle cx={x} cy={y} r={r} fill={color} />
    <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.35} fill="#ffffff" opacity={0.6} />
  </g>
);

export const Scene2: React.FC<SceneProps> = ({t, a}) => {
  const pose = usePose();
  const tArc = W(1, 'mundo') - 0.5;
  const tMirror = S(2) - 0.45;
  const kz = clamp((t - tMirror) / 0.6);
  const tBest = W(2, 'mejor');
  const map = kz < 1;
  return (
    <>
      {map && (
        <div style={{position: 'absolute', inset: 0, opacity: 1 - kz}}>
          <Page kind="cork" />
          <Svg>
            <Cam cx={lerp(960, HOME[0], PE(t, a, tMirror - a) * 0.3 + easeIn(kz) * 0.7)} cy={lerp(540, HOME[1], PE(t, a, tMirror - a) * 0.3 + easeIn(kz) * 0.7)} z={lerp(1, 1.15, PE(t, a, tMirror - a)) * (1 + 5 * easeIn(kz))}>
              <g filter="url(#pshadow)">
                <polygon points={tornRect(110, 150, 1700, 800, 9, 12)} fill="#eadcbc" />
              </g>
              <polygon points={tornRect(110, 150, 1700, 800, 9, 12)} fill="#c9a26a" opacity={0.12} />
              {world.dots.map(([lon, lat], i) => {
                const [x, y] = proj(lon, lat);
                return <rect key={i} x={x - 4} y={y - 4} width={8.5} height={8.5} fill="#9c7b4c" opacity={0.75 + hash(i) * 0.2} />;
              })}
              {CITIES.map(([lon, lat], i) => {
                const [x, y] = proj(lon, lat);
                const ts = tArc + i * 0.07;
                const p = PO(t, ts, 0.9);
                const u = P(t, ts + 0.2, 1.1);
                const hx = lerp(x, HOME[0], easeInOut(u));
                const hy = lerp(y, HOME[1], easeInOut(u));
                return (
                  <g key={i}>
                    {p > 0 && <line x1={x} y1={y} x2={lerp(x, HOME[0], p)} y2={lerp(y, HOME[1], p)} stroke={K.tomato} strokeWidth={2.4} />}
                    {u > 0 && u < 1 && <Icon name="heart" x={hx} y={hy - 4} s={0.3} color={K.tomato} />}
                    <Pin x={x} y={y} color={[K.tomato, K.blue, K.sage, K.white][i % 4]} r={P(t, ts - 0.3, 0.2) * 8} />
                  </g>
                );
              })}
              <Pin x={HOME[0]} y={HOME[1]} color={K.mustard} r={14} />
            </Cam>
            <Tape x={180} y={170} w={170} rot={-40} pat="washiC" />
            <Tape x={1740} y={930} w={170} rot={-40} pat="washiC" />
          </Svg>
        </div>
      )}
      {kz > 0 && (
        <div style={{position: 'absolute', inset: 0, opacity: kz}}>
          <Page kind="paper" tint="#efe2c9" />
          <Svg>
            <Cam cx={lerp(900, 1040, PE(t, tMirror, 6))} cy={560} z={1}>
              <circle cx={1180} cy={520} r={560} fill="url(#lamp)" />
              {/* suelo de kraft */}
              <g filter="url(#pshadow)">
                <polygon points={tornRect(-100, 880, 2200, 300, 3, 14)} fill={K.kraft} />
              </g>
              {/* escalera de reflejos */}
              {[0, 1, 2, 3, 4].map((i) => {
                const ti = tBest + 0.1 + i * 0.32;
                if (t < ti) return null;
                const x = 1430 + i * 140;
                const y = 780 - i * 115;
                return (
                  <g key={i}>
                    <Cut id={40 + i} x={x} y={y} s={1.4 - i * 0.07} rot={(hash(i) - 0.5) * 8}>
                      <rect x={-34} y={-130} width={68} height={140} rx={6} fill="#d7dce2" />
                      <Fig x={0} y={0} s={1} color={mixHex(K.mustard, '#fff4c9', i * 0.15)} shadow={false} />
                    </Cut>
                    <Icon name="sparkle" x={x + 40} y={y - 150} s={0.5} color={K.white} />
                  </g>
                );
              })}
              {/* espejo de aluminio con marco de kraft */}
              <Cut id={30} x={1180} y={540} plain>
                <ellipse rx={185} ry={285} fill={K.kraftDark} />
                <ellipse rx={160} ry={260} fill="#c8cdd3" />
                <clipPath id="foilFacets">
                  <ellipse rx={158} ry={258} />
                </clipPath>
                <g clipPath="url(#foilFacets)">
                {Array.from({length: 26}).map((_, i) => {
                  const x0 = (hash(i) - 0.5) * 300;
                  const y0 = (hash(i * 3) - 0.5) * 500;
                  return <polygon key={i} points={`${x0},${y0} ${x0 + 40 + hash(i * 5) * 40},${y0 + 20} ${x0 + 10},${y0 + 60 + hash(i * 7) * 40}`} fill={hash(i * 9) > 0.5 ? '#eef1f4' : '#9aa1a9'} opacity={0.3} />;
                })}
                </g>
              </Cut>
              <clipPath id="foilClip">
                <ellipse cx={1180} cy={540} rx={158} ry={258} />
              </clipPath>
              <g clipPath="url(#foilClip)">
                <PFig id={31} x={1180} y={770} s={2.3 * (1 + 0.04 * P(t, tBest, 0.6))} color="#f2c056" />
                {Array.from({length: 22}).map((_, i) => (
                  <circle key={i} cx={1100 + hash(i + pose * 0.37) * 160} cy={400 + hash(i * 3 + pose * 0.11) * 360} r={2 + hash(i) * 3} fill={i % 2 ? K.white : '#ffe08a'} />
                ))}
              </g>
              {/* el original */}
              <PFig id={32} x={720} y={890} s={2.3} color={mixHex(K.mustard, K.sepia, 0.25)} />
            </Cam>
            <Tape x={1180} y={265} w={120} rot={6} pat="washiB" />
          </Svg>
        </div>
      )}
    </>
  );
};

// ════════════════════ Escenas 3 y 4 — Infancia ════════════════════
export const ChildhoodSet: React.FC<{t: number; childK: number; adultK: number; beam: number; warm: number; beamAway?: number; color?: string}> = ({
  t,
  childK,
  adultK,
  beam,
  warm,
  beamAway = 0,
  color = K.mustard,
}) => {
  const ax = lerp(-300, 560, easeInOut(adultK));
  const cx = lerp(1180, 1080, childK);
  // sustitución en tres recortes: el tamaño salta, no se interpola
  const ck = Math.round(childK * 3) / 3;
  const s = lerp(2.4, 2.1, ck);
  return (
    <g>
      <rect width={1920} height={1080} fill="#f7d98f" opacity={0.25 * warm} />
      {/* dibujos infantiles pegados */}
      {[
        {x: 1500, y: 240, r: 6, kind: 0},
        {x: 300, y: 200, r: -8, kind: 1},
        {x: 1640, y: 620, r: 4, kind: 2},
      ].map((d, i) => {
        const k = easeOutBack(clamp((warm - 0.4) * 2.5 - i * 0.25));
        if (k <= 0) return null;
        return (
          <g key={i} transform={`translate(${d.x} ${d.y}) rotate(${d.r}) scale(${k})`}>
            <g filter="url(#pshadow)">
              <rect x={-130} y={-100} width={260} height={200} fill={K.white} />
            </g>
            <g filter="url(#boil)" fill="none" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round">
              {d.kind === 0 && (
                <>
                  <path d="M-60 60 L-60 -5 L60 -5 L60 60 Z" stroke={K.tomato} />
                  <path d="M-75 -5 L0 -65 L75 -5" stroke={K.blue} />
                  <path d="M-15 60 L-15 20 L15 20 L15 60" stroke={K.mustard} />
                </>
              )}
              {d.kind === 1 && (
                <>
                  <circle r={34} stroke={K.mustard} fill="#ffd56a" />
                  {Array.from({length: 8}).map((_, k) => {
                    const an = (k / 8) * Math.PI * 2;
                    return <line key={k} x1={Math.cos(an) * 48} y1={Math.sin(an) * 48} x2={Math.cos(an) * 75} y2={Math.sin(an) * 75} stroke={K.mustard} />;
                  })}
                </>
              )}
              {d.kind === 2 && (
                <>
                  <ellipse cx={0} cy={10} rx={60} ry={28} stroke={K.kraftDark} />
                  <circle cx={65} cy={-20} r={22} stroke={K.kraftDark} />
                  <path d="M-40 35 L-45 70 M40 35 L45 70 M-60 0 L-90 -20" stroke={K.kraftDark} />
                </>
              )}
            </g>
            <Tape x={0} y={-100} w={110} h={32} rot={-4} pat={(['washiA', 'washiB', 'washiC'] as const)[i]} />
          </g>
        );
      })}
      {/* suelo */}
      <g filter="url(#pshadow)">
        <polygon points={tornRect(-100, 870, 2200, 300, 11, 14)} fill="#d9c09a" />
      </g>
      {/* haz de atención: papel de seda */}
      <g transform={`translate(${-beamAway * 260} ${-beamAway * 200})`} opacity={beam * (1 - beamAway)}>
        <polygon points={`${ax + 110},${560} ${ax + 160},${590} ${cx + 160},${880} ${cx - 160},${880}`} fill="url(#tissue)" />
        <polyline points={`${ax + 110},${560} ${cx - 160},${880}`} stroke="#e8c45a" strokeWidth={2} opacity={0.6} />
      </g>
      <PFig id={50} x={ax} y={1270} s={7.2} color={K.kraft} />
      <PFig id={51} x={cx} y={865} s={s} child={ck} color={color} />
    </g>
  );
};

export const Scene3: React.FC<SceneProps> = ({t, a}) => {
  const tRev = W(3, 'nada') - 0.4;
  const tKid = S(4) - 0.3;
  const fwd = (t - a) * 6;
  const back = easeIn(P(t, tRev, 2.6)) * 1440 + Math.max(0, t - tRev - 2.6) * 600;
  const ang = fwd - back;
  const kid = PE(t, tKid, 1.2);
  const clockO = 1 - PE(t, tKid + 0.2, 0.7);
  const spin = clamp((t - tRev) / 1.2) * clockO;
  return (
    <>
      <Page kind="paper" />
      <Svg>
        <ChildhoodSet t={t} childK={kid} adultK={P(t, tKid + 0.35, 1.3)} beam={PE(t, tKid + 1.1, 0.9)} warm={kid} />
        <g opacity={clockO} transform={`translate(${lerp(640, 420, 1 - clockO)} 470) scale(${lerp(1, 0.7, 1 - clockO)})`}>
          <Cut id={60} plain>
            <circle r={230} fill={K.white} />
          </Cut>
          <g filter="url(#boil)">
            <circle r={214} fill="none" stroke={K.ink} strokeWidth={4} />
            {Array.from({length: 12}).map((_, i) => {
              const th = (i / 12) * Math.PI * 2;
              return <line key={i} x1={Math.sin(th) * 178} y1={-Math.cos(th) * 178} x2={Math.sin(th) * 202} y2={-Math.cos(th) * 202} stroke={K.ink} strokeWidth={i % 3 ? 4 : 8} strokeLinecap="round" />;
            })}
            {spin > 0 &&
              [1, 2, 3].map((k) => (
                <path key={k} d={`M0 ${-150 + k * 14} A${150 - k * 14} ${150 - k * 14} 0 0 1 ${(150 - k * 14) * 0.7} ${-(150 - k * 14) * 0.7}`} fill="none" stroke={K.graphite} strokeWidth={3} opacity={spin * 0.5} transform={`rotate(${ang - 10})`} />
              ))}
          </g>
          <g filter="url(#pshadow)">
            <rect x={-9} y={-120} width={18} height={130} rx={6} fill={K.card} transform={`rotate(${ang / 12})`} />
            <rect x={-6} y={-185} width={12} height={205} rx={5} fill={K.tomato} transform={`rotate(${ang})`} />
          </g>
          <circle r={14} fill="#c9a03a" />
          <circle r={6} fill="#f2d27a" />
        </g>
      </Svg>
    </>
  );
};

const Collage: React.FC<{y: number; r: number; plates: number}> = ({y, r, plates}) => (
  <g>
    <clipPath id="sbCore">
      <circle cx={0} cy={y} r={r} />
    </clipPath>
    <circle cx={0} cy={y} r={r} fill={K.white} />
    <g clipPath="url(#sbCore)">
      {[K.tomato, K.sage, K.blue, '#c58cf0', K.mustard, '#7fc8a8', K.tomato].map((c, i) => (
        <rect key={i} x={(hash(i * 3) - 0.6) * r * 2} y={y + (hash(i * 5) - 0.6) * r * 2} width={r * (0.6 + hash(i) * 0.6)} height={r * (0.5 + hash(i * 9) * 0.5)} fill={c} transform={`rotate(${(hash(i * 7) - 0.5) * 60} 0 ${y})`} />
      ))}
    </g>
    {[0, 1, 2].map((i) => {
      const k = clamp(plates - i);
      if (k <= 0) return null;
      return <rect key={i} x={-r * 1.25} y={y - r + i * r * 0.68 - 2} width={r * 2.5} height={r * 0.78} fill="#e3d6b5" opacity={0.96} transform={`rotate(${[-8, 6, -4][i]} 0 ${y})`} stroke="#cdbf9c" strokeWidth={0.6} />;
    })}
  </g>
);

const Gauge: React.FC<{x: number; y: number; v: number; o: number}> = ({x, y, v, o}) => (
  <g transform={`translate(${x} ${y})`} opacity={o}>
    <Cut id={70} plain>
      <path d="M-130 20 A130 130 0 0 1 130 20 Z" fill={K.white} />
    </Cut>
    <g filter="url(#boil)">
      <path d="M-100 10 A100 100 0 0 1 0 -90" stroke={K.tomato} strokeWidth={14} fill="none" />
      <path d="M0 -90 A100 100 0 0 1 100 10" stroke={K.sage} strokeWidth={14} fill="none" />
    </g>
    <g filter="url(#pshadow)">
      <rect x={-5} y={-92} width={10} height={100} rx={4} fill={K.card} transform={`rotate(${lerp(-80, 80, v)})`} />
    </g>
    <circle r={10} fill="#c9a03a" />
    <Icon name="heart" y={-30} s={0.42} color={K.tomato} />
  </g>
);

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
  const split = t >= tSplit ? 1 : 0; // la doble página se abre de golpe (stop-motion)
  const grow = PE(t, tGrow, 0.4);
  const tGood = W(5, 'buenos') - 0.5;
  const tLove = W(5, 'quieren');
  const tBad = W(5, 'si no');
  const tOff = W(5, 'retiran');
  const needle = 0.5 + 0.45 * PE(t, tLove - 0.2, 0.6) - 0.9 * PE(t, tOff, 0.35);
  const step = (t >= g1 ? 1 : 0) + (t >= g2 ? 1 : 0) + (t >= g3 ? 1 : 0);
  const copy = PE(t, gEnd - 0.2, 1.0);
  const scan = P(t, gEnd - 0.4, 0.9);
  const s3 = [3.0, 3.6, 4.2, 4.8][step];
  return (
    <>
      <Page kind="paper" />
      {split === 0 && (
        <Svg>
          <ChildhoodSet t={t} childK={1} adultK={1} beam={1} warm={1} />
          <Cut id={80} x={1010} y={lerp(560, 520, PO(t, tHeart, 0.5))} s={easeOutBack(P(t, tHeart, 0.4)) * 1.1} rot={-8}>
            <Icon name="heart" color={K.tomato} />
          </Cut>
          <Cut id={81} x={1150} y={lerp(560, 520, PO(t, tStar, 0.5))} s={easeOutBack(P(t, tStar, 0.4)) * 1.1} rot={10}>
            <Icon name="star" color="#e9b53c" />
          </Cut>
          <g opacity={P(t, tLink, 0.3)}>
            <Hand d="M1080 860 C 1300 860 1400 700 1400 480" p={PO(t, tLink, 0.8)} color={K.tomato} w={3} />
            <Hand d="M1400 470 C 1400 330 1000 300 680 560" p={PO(t, tLink + 0.6, 0.8)} color={K.tomato} w={3} />
            <Cut id={82} x={1400} y={440} plain>
              <rect x={-60} y={-34} width={120} height={68} rx={12} fill={K.kraft} />
              <rect x={-40} y={-18} width={80} height={36} rx={18} fill={K.white} />
              <circle cx={lerp(-20, 20, PE(t, tLink + 0.9, 0.2))} r={15} fill={t > tLink + 0.95 ? K.sage : K.newsDark} />
            </Cut>
          </g>
        </Svg>
      )}
      {split === 1 && grow < 1 && (
        <Svg style={{opacity: 1 - grow}}>
          {/* doble página: sombra del pliegue */}
          <defs>
            <linearGradient id="gutter" x1="0" x2="1">
              <stop offset="0" stopColor="#3a2410" stopOpacity={0} />
              <stop offset="0.5" stopColor="#3a2410" stopOpacity={0.35} />
              <stop offset="1" stopColor="#3a2410" stopOpacity={0} />
            </linearGradient>
          </defs>
          {[0, 1].map((side) => {
            const ox = side * 960;
            const good = side === 0;
            const away = good ? 0 : PE(t, tOff, 0.5);
            const adultX = 280 + ox - (good ? 0 : 120 * PE(t, tOff, 0.9));
            const kidX = 640 + ox;
            return (
              <g key={side}>
                <clipPath id={`sbHalf${side}`}>
                  <rect x={ox} y={0} width={960} height={1080} />
                </clipPath>
                <g clipPath={`url(#sbHalf${side})`}>
                  <rect x={ox} width={960} height={1080} fill="#f7d98f" opacity={0.22 * (1 - away)} />
                  <polygon points={tornRect(ox - 40, 870, 1040, 300, 20 + side, 12)} fill="#d9c09a" />
                  <g transform={`translate(${-away * 300} ${-away * 260})`} opacity={1 - away}>
                    <polygon points={`${adultX + 60},560 ${adultX + 90},590 ${kidX + 120},880 ${kidX - 120},880`} fill="url(#tissue)" />
                  </g>
                  <PFig id={90 + side} x={adultX} y={1240} s={5.2} color={K.kraft} />
                  <PFig id={92 + side} x={kidX} y={865} s={1.8} child={1} color={K.mustard} />
                  {good &&
                    [0, 1, 2].map((i) => {
                      const k = PO(t, tGood + i * 0.22, 0.3);
                      if (k <= 0) return null;
                      return (
                        <Cut key={i} id={95 + i} x={kidX + 95} y={lerp(300, 838 - i * 54, k)} rot={(hash(i) - 0.5) * 10}>
                          <rect x={-25} y={-25} width={50} height={50} fill={[K.sage, K.mustard, K.tomato][i]} />
                        </Cut>
                      );
                    })}
                  {good && t > tLove && (
                    <Cut id={99} x={kidX} y={lerp(300, 610, easeOutBack(P(t, tLove, 0.5)))} rot={-10} s={1.1}>
                      <Icon name="star" color="#e9b53c" />
                    </Cut>
                  )}
                  {!good &&
                    [K.tomato, K.sage, K.mustard, '#a77bd6', K.blue].map((c, i) => {
                      const k = PO(t, tBad + i * 0.08, 0.6);
                      return <ellipse key={i} cx={kidX + 40 + (i - 2) * 50 * k} cy={872} rx={k * (50 + hash(i) * 30)} ry={k * 16} fill={c} opacity={0.75} filter="url(#watercolor)" />;
                    })}
                </g>
              </g>
            );
          })}
          <rect x={900} width={120} height={1080} fill="url(#gutter)" />
          <Gauge x={960} y={300} v={clamp(needle)} o={1} />
        </Svg>
      )}
      {grow > 0 && (
        <Svg style={{opacity: grow}}>
          <polygon points={tornRect(-100, 900, 2200, 300, 33, 14)} fill="#d9c09a" />
          <g transform={`translate(960 905)`}>
            <PFig id={100 + step} x={0} y={0} s={s3} child={1 - step / 3} color={mixHex(K.mustard, '#b8ab95', copy)}>
              <Collage y={lerp(-36, -26, 1 - step / 3)} r={14} plates={step} />
            </PFig>
          </g>
          {/* fotocopiadora: barra de luz que barre */}
          {scan > 0 && scan < 1 && <rect x={0} y={lerp(-80, 1080, scan)} width={1920} height={70} fill="#eaf6ff" opacity={0.55} />}
          {copy > 0 && <rect width={1920} height={1080} fill="#b8ab95" opacity={0.12 * copy} style={{mixBlendMode: 'multiply'}} />}
        </Svg>
      )}
    </>
  );
};

// ════════════════════ Escena 5 — Fotocopias y gráfica de lana ════════════════════
export const Scene5: React.FC<SceneProps> = ({t}) => {
  const tMul = W(7, 'multiplica') - 0.25;
  const tChart = S(8) - 0.4;
  const tUp = W(8, 'Nunca');
  const tDown = W(8, 'paradójicamente') - 0.2;
  const tEnd = E(8);
  const zk = PE(t, tMul, 3.0);
  const z = lerp(1, 0.22, Math.pow(zk, 0.7));
  const sheets: React.ReactNode[] = [];
  for (let r = -6; r <= 6; r++)
    for (let c = -13; c <= 13; c++) {
      const ring = Math.max(Math.abs(c), Math.abs(r * 1.6));
      const id = (r + 6) * 31 + c + 13;
      const show = c === 0 && r === 0 ? 1 : t > tMul + 0.15 + ring * 0.13 + hash(id) * 0.1 ? 1 : 0;
      if (!show) continue;
      const x = 960 + c * 330 + (hash(id * 3) - 0.5) * 60;
      const y = 540 + r * 430 + (hash(id * 5) - 0.5) * 60;
      sheets.push(
        <g key={id} transform={`translate(${x} ${y}) rotate(${c === 0 && r === 0 ? 0 : (hash(id * 7) - 0.5) * 14})`}>
          <rect x={-134} y={-177} width={280} height={370} fill="#2a1c10" opacity={0.25} />
          <rect x={-140} y={-185} width={280} height={370} fill="#f4f2ec" />
          <rect x={-140} y={-185} width={280} height={370} fill="#b8ab95" opacity={0.15} />
          <Fig x={0} y={150} s={2.0} color="#a99c86" shadow={false} />
        </g>,
      );
    }
  // gráfica de lana
  const ox = 380;
  const oy = 830;
  const Wd = 1160;
  const up = (k: number): [number, number] => [ox + k * Wd, oy - 70 - 480 * Math.pow(k, 1.8)];
  const down = (k: number): [number, number] => [ox + k * Wd, oy - 520 + 430 * Math.pow(k, 1.3)];
  const pu = PE(t, tUp, tDown - tUp + 0.6);
  const pd = PE(t, tDown, tEnd - tDown + 0.2);
  const pts = (f: (k: number) => [number, number], p: number) => Array.from({length: 41}).map((_, i) => f((p * i) / 40).join(',')).join(' ');
  let kx = 0.5;
  for (let i = 0; i <= 200; i++) {
    const k = i / 200;
    if (up(k)[1] < down(k)[1]) {
      kx = k;
      break;
    }
  }
  const cross = up(kx);
  const crossed = pd >= kx && pu >= kx;
  const push = PE(t, tEnd - 0.3, 3);
  const chartIn = t >= tChart;
  const yarn = (p: string, col: string, light: string) => (
    <g>
      <polyline points={p} fill="none" stroke={col} strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" filter="url(#pshadow)" />
      <polyline points={p} fill="none" stroke={light} strokeWidth={4} strokeDasharray="5 9" strokeLinecap="round" opacity={0.7} />
    </g>
  );
  return (
    <>
      <Page kind="kraft" />
      <Svg>
        <Cam z={z}>{sheets}</Cam>
        {chartIn && (
          <Cam cx={lerp(960, cross[0], push)} cy={lerp(540, cross[1], push)} z={lerp(1, 1.5, push)}>
            <g transform={`translate(0 ${(1 - PO(t, tChart, 0.4)) * -1100}) rotate(${(1 - PO(t, tChart, 0.4)) * 4} 960 540)`}>
              <g filter="url(#pshadow)">
                <polygon points={tornRect(250, 180, 1420, 760, 61, 10)} fill="#f7f4ea" />
              </g>
              <clipPath id="sbChartPaper">
                <polygon points={tornRect(250, 180, 1420, 760, 61, 10)} />
              </clipPath>
              <rect x={250} y={180} width={1420} height={760} fill="url(#gridPat)" clipPath="url(#sbChartPaper)" />
              <Hand d={`M${ox} ${oy - 580} L${ox} ${oy} L${ox + Wd + 40} ${oy}`} p={PO(t, tChart, 0.6)} color={K.graphite} w={4} />
              {pu > 0 && yarn(pts(up, pu), K.sage, K.sageLight)}
              {pd > 0 && yarn(pts(down, pd), K.tomato, K.tomatoLight)}
              {pu > 0 && (
                <g transform={`translate(${up(pu)[0]} ${up(pu)[1]}) rotate(-35)`}>
                  <path d="M-22 0 L22 0 A10 10 0 0 1 22 20 L-14 20 A6 6 0 0 1 -14 8 L16 8" fill="none" stroke="#9aa3ab" strokeWidth={4} strokeLinecap="round" filter="url(#pshadow)" />
                </g>
              )}
              {pd > 0 && (
                <Cut id={120} x={down(pd)[0]} y={down(pd)[1]} s={0.85} rot={-10}>
                  <Icon name="heart" color={K.tomato} />
                </Cut>
              )}
              {crossed && <Pin x={cross[0]} y={cross[1]} color={K.ink} r={13} />}
              <Tape x={300} y={200} w={160} rot={-35} pat="washiA" />
              <Tape x={1620} y={200} w={160} rot={35} pat="washiA" />
            </g>
          </Cam>
        )}
      </Svg>
    </>
  );
};

export {Pin};
