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
  GOTH,
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
import {MoneyStack, PhotoCar, SceneProps} from './A';

const phase = (t: number, t0: number, t1: number, f = 0.35) => clamp((t - t0) / f) * clamp((t1 - t) / f);

// ───────── Escena 7: detrás del teléfono ─────────
const Hand: React.FC = () => (
  <g>
    <path d="M-150 420 C-170 300 -160 160 -110 60 L-60 -30 L150 -30 L170 80 C180 200 160 320 120 420 Z" fill="#a8a8a8" />
    <path d="M-150 420 C-170 300 -160 160 -110 60 L-90 30 C-110 140 -120 280 -100 420 Z" fill="#c8c8c8" />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M150 ${-10 + i * 62} C220 ${-20 + i * 62} 240 ${30 + i * 62} 160 ${40 + i * 62}`} stroke="#8a8a8a" strokeWidth={46} strokeLinecap="round" fill="none" />
    ))}
    <path d="M-100 140 C-170 60 -170 -40 -120 -90" stroke="#9a9a9a" strokeWidth={50} strokeLinecap="round" fill="none" />
  </g>
);

const Post: React.FC<{w: number; h: number; likes: number; children: React.ReactNode; name: string; id: string}> = ({w, h, likes, children, name, id}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill="#ffffff" stroke="#d8d8d8" strokeWidth={2} />
    <circle cx={-w / 2 + 40} cy={-h / 2 + 40} r={20} fill={V.grayLight} />
    <text x={-w / 2 + 72} y={-h / 2 + 48} fontFamily={SANS} fontWeight={700} fontSize={22} fill={V.ink}>
      {name}
    </text>
    <defs>
      <clipPath id={`post-${id}`}>
        <rect x={-w / 2} y={-h / 2 + 76} width={w} height={h - 160} />
      </clipPath>
    </defs>
    <g clipPath={`url(#post-${id})`}>{children}</g>
    <path transform={`translate(${-w / 2 + 44} ${h / 2 - 44}) scale(1.1)`} d="M0 12 C-18 0 -22 -12 -14 -19 C-8 -24 -2 -21 0 -15 C2 -21 8 -24 14 -19 C22 -12 18 0 0 12 Z" fill={V.red} />
    <text x={-w / 2 + 76} y={h / 2 - 34} fontFamily={SANS} fontWeight={700} fontSize={28} fill={V.ink}>
      {likes.toLocaleString('es-ES')}
    </text>
  </g>
);

export const PhoneScene: React.FC<SceneProps> = ({t, a, b}) => {
  const tVan = W(11, 'vanidad');
  const tFri = W(11, 'frivolidad');
  const tNeed = W(12, 'necesidad');
  const tWall = S(13);
  const likes = Math.round(Math.pow(clamp((t - a) / 9), 2) * 48210 + 12);
  const phone = phase(t, a - 1, tWall + 0.2);
  const posts: [string, number, React.ReactNode, string][] = [
    ['vecino', W(13, 'vecino'), <g key="c" transform="translate(0 40) scale(0.62)"><Cutout noBorder><rect x={-400} y={-300} width={800} height={600} fill="#bdbdbd" /><PhotoCar /></Cutout></g>, 'el vecino'],
    ['amigo', W(13, 'amigo'), <g key="b"><rect x={-260} y={-160} width={520} height={200} fill="#7fc3d6" /><rect x={-260} y={40} width={520} height={200} fill="#f0d79a" /><circle cx={140} cy={-90} r={40} fill="#ffd34d" /><g transform="translate(-40 210) scale(0.5)"><Cutout noBorder><PhotoPerson x={0} y={0} suit={200} shirt={230} hair="curly" hairTone={40} tie={false} smile armR={[150, 10]} /></Cutout></g></g>, 'el amigo'],
    ['compañero', W(13, 'compañero'), <g key="r"><rect x={-260} y={-200} width={520} height={460} fill="#d9d9d9" /><g transform="translate(0 240) scale(0.62)"><Cutout noBorder><PhotoPerson x={0} y={0} suit={30} hair="short" hairTone={30} tie={false} look={0.4} /></Cutout></g><text x={0} y={-120} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={64} fill={V.ink} letterSpacing={10}>LUXE</text></g>, 'el compañero'],
  ];
  return (
    <g>
      {phone > 0 ? (
        <g opacity={phone}>
          <Cam t={t} keys={[[a, 960, 560, 1.0], [tVan - 0.5, 960, 560, 1.0], [tVan, 940, 470, 1.25], [tNeed - 0.3, 940, 470, 1.25], [tNeed + 0.6, 960, 540, 1.0]]}>
            <Layer depth={0.3}>
              <Bg kind="grid" />
            </Layer>
            <Layer depth={0.9}>
              <g transform="translate(960 620) rotate(-6)">
                <Cutout>
                  <Hand />
                </Cutout>
                <rect x={-150} y={-330} width={300} height={600} rx={36} fill="#1d1d1f" />
                <g transform="translate(0 -30)">
                  <Post w={270} h={540} likes={likes} name="@yo_mismo" id="p0">
                    <rect x={-135} y={-200} width={270} height={300} fill="#e8d3b0" />
                    <g transform="translate(0 110) scale(0.5)">
                      <Cutout noBorder>
                        <PhotoPerson x={0} y={0} suit={70} hair="long" hairTone={30} dress smile armR={[160, 0]} />
                      </Cutout>
                    </g>
                  </Post>
                </g>
              </g>
            </Layer>
            <Layer depth={1.25}>
              <text x={440} y={380} fontFamily={MARK} fontSize={60} fill={V.red} opacity={eo(t, tVan - 0.2, 0.3)} transform="rotate(-6 440 380)">
                ¿vanidad?
              </text>
              <text x={1300} y={330} fontFamily={MARK} fontSize={60} fill={V.red} opacity={eo(t, tFri - 0.2, 0.3)} transform="rotate(5 1300 330)">
                ¿frivolidad?
              </text>
              <Marker d="M430 362 L720 330" p={pr(t, tFri + 0.9, 0.3)} w={9} color={V.ink} />
              <Marker d="M1290 300 L1650 330" p={pr(t, tFri + 1.2, 0.3)} w={9} color={V.ink} />
              <g opacity={eo(t, tNeed - 0.2, 0.3)}>
                <Sheet x={960} y={960} w={1120} h={100} rot={-1}>
                  <Highlight x={-520} y={-34} w={1040} h={62} p={pr(t, tNeed + 0.4, 0.8)} />
                  <Typed x={0} y={14} text="necesidad de amor y reconocimiento" p={pr(t, tNeed - 0.1, 1.0)} size={46} anchor="middle" />
                </Sheet>
              </g>
            </Layer>
          </Cam>
        </g>
      ) : null}
      {t > tWall - 0.3 ? (
        <g opacity={eo(t, tWall - 0.3, 0.3)}>
          <Bg kind="grid" />
          {posts.map(([id, at, el, label], i) => {
            const p = eio(t, at - 0.5, 0.5);
            const x = 360 + i * 600;
            const n = Math.round(clamp((t - at) / 4) * [2310, 5870, 1460][i]);
            return (
              <g key={id} transform={`translate(${x} ${lerp(1500, 540, p)}) rotate(${[-2, 1.5, -1][i]})`}>
                <Post w={520} h={760} likes={n} name={`@${id}`} id={id}>
                  {el}
                </Post>
                <MarkerCircle cx={0} cy={-40} rx={250} ry={300} p={pr(t, at + 0.6, 0.7)} w={7} />
                <text x={130} y={-330} fontFamily={MARK} fontSize={52} fill={V.red} opacity={eo(t, at + 1.2, 0.3)} transform="rotate(-8 130 -330)">
                  ¡mírame!
                </text>
                <text x={0} y={440} textAnchor="middle" fontFamily={TYPE} fontSize={34} fill={V.ink}>
                  {label}
                </text>
              </g>
            );
          })}
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 8: la promesa ─────────
const Cap = () => (
  <g transform="translate(0 -400)">
    <path d="M-60 0 L0 -26 L60 0 L0 26 Z" fill="#2a2a2a" />
    <path d="M-30 10 L-30 34 Q0 46 30 34 L30 10" fill="#3a3a3a" />
    <path d="M50 4 L56 50" stroke="#2a2a2a" strokeWidth={4} />
  </g>
);

export const Promise: React.FC<SceneProps> = ({t, a, b}) => {
  const tPoster = W(14, '¡podemos');
  const tKid = S(15);
  const tOpp = W(16, 'oportunidades');
  const tFail = W(17, 'fallamos');
  const tTop = W(18, 'cima');
  // árbol de caminos posibles
  const branches: {d: string; depth: number; k: number}[] = [];
  const grow = (x: number, y: number, ang: number, len: number, depth: number, k: number) => {
    if (depth > 6) return;
    const x2 = x + Math.cos(ang) * len;
    const y2 = y + Math.sin(ang) * len;
    branches.push({d: `M${x} ${y} L${x2} ${y2}`, depth, k});
    grow(x2, y2, ang - 0.42 + Math.sin(k * 3.1) * 0.08, len * 0.82, depth + 1, k * 2 + 1);
    grow(x2, y2, ang + 0.42 + Math.cos(k * 2.3) * 0.08, len * 0.82, depth + 1, k * 2 + 2);
  };
  grow(560, 620, 0, 240, 0, 0);
  const tree = eo(t, tOpp - 1.6, 2.4);
  const poster = phase(t, a + 1.7, S(16) + 0.2);
  const treeOn = phase(t, S(16) - 0.4, S(17) + 0.3);
  const chartOn = t > S(17) - 0.3;
  const climb = eio(t, S(17) - 0.2, tFail + 0.2 - S(17));
  const fall = eio(t, tFail + 0.3, 1.0);
  const path = Array.from({length: 60}, (_, i) => {
    const u = i / 59;
    const y = 860 - Math.pow(u, 1.3) * 620 + Math.sin(u * 30) * 14;
    return [200 + u * 1400, y] as [number, number];
  });
  const shownN = Math.floor(clamp(climb * 0.86) * 59);
  const head = path[shownN];
  const fx = head[0] + fall * 140;
  const fy = head[1] + fall * fall * 520;
  return (
    <g>
      {poster > 0 ? (
        <g opacity={poster}>
          <Cam t={t} keys={[[a, 960, 540, 1.05], [S(16), 960, 520, 1.12]]}>
            <Layer depth={0.3}>
              <Bg kind="paper" />
            </Layer>
            <Layer depth={0.8}>
              <Sheet x={960} y={520} w={1100} h={860} fill="#f3e4c4" rot={-1}>
                <rect x={-520} y={-400} width={1040} height={800} fill="none" stroke={V.red} strokeWidth={8} />
                <text x={0} y={-250} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={118} fill={V.red}>
                  ¡PUEDES SER
                </text>
                <text x={0} y={-130} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={118} fill="#24477a">
                  LO QUE QUIERAS!
                </text>
                <Highlight x={-420} y={-232} w={840} h={130} p={pr(t, tPoster, 0.5)} />
                <g transform="translate(0 395) scale(1.25)">
                  <Cutout>
                    <PhotoPerson x={0} y={0} child s={1.4} suit={120} hair="short" hairTone={40} tie={false} smile armR={[165, 10]} />
                    <g transform="scale(0.868)">
                      <Cap />
                    </g>
                  </Cutout>
                </g>
              </Sheet>
              <Tape x={450} y={110} rot={-20} />
              <Tape x={1480} y={120} rot={18} />
            </Layer>
            <Layer depth={1.2}>
              <text x={1180} y={990} fontFamily={MARK} fontSize={46} fill={V.ink} opacity={eo(t, tKid, 0.4)} transform="rotate(-5 1180 990)">
                desde la infancia
              </text>
              <MarkerArrow x0={1170} y0={950} x1={1060} y1={820} p={pr(t, tKid + 0.4, 0.5)} />
            </Layer>
          </Cam>
        </g>
      ) : null}
      {treeOn > 0 ? (
        <g opacity={treeOn}>
          <Bg kind="grid" />
          <g transform="translate(380 820) scale(0.36)">
            <Cutout>
              <PhotoPerson x={0} y={0} child s={1.4} suit={120} hair="short" hairTone={40} tie={false} smile />
            </Cutout>
          </g>
          {branches.map((br, i) => (
            <Marker key={i} d={br.d} p={clamp(tree * 7 - br.depth)} color={V.ink} w={Math.max(1.5, 6 - br.depth * 0.7)} opacity={0.85} />
          ))}
          <Typed x={960} y={140} text="tantas oportunidades…" p={pr(t, tOpp - 0.2, 0.8)} size={58} anchor="middle" />
        </g>
      ) : null}
      {chartOn ? (
        <g opacity={eo(t, S(17) - 0.3, 0.3)}>
          <Bg kind="grid" />
          <Marker d="M200 900 L1700 900" p={1} color={V.ink} w={3} />
          <path d={path.slice(0, shownN + 1).map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={V.ink} strokeWidth={6} strokeLinejoin="round" />
          <path d={path.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ')} fill="none" stroke={V.ink} strokeWidth={2} strokeDasharray="6 10" opacity={0.3} />
          <text x={1600} y={210} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={54} fill={V.ink}>
            LA CIMA
          </text>
          <path d="M1600 230 L1600 250" stroke={V.ink} strokeWidth={3} />
          {fall > 0 ? <path d={`M${head[0]} ${head[1]} Q${head[0] + 100} ${head[1] - 30} ${fx} ${fy}`} fill="none" stroke={V.red} strokeWidth={6} strokeDasharray="10 8" /> : null}
          <circle cx={fall > 0 ? fx : head[0]} cy={fall > 0 ? fy : head[1]} r={18} fill={fall > 0 ? V.red : V.yellow} stroke={V.ink} strokeWidth={3} />
          <Marker d={`M${head[0] - 30} ${head[1] - 30} L${head[0] + 30} ${head[1] + 30} M${head[0] + 30} ${head[1] - 30} L${head[0] - 30} ${head[1] + 30}`} p={pr(t, tFail + 0.2, 0.4)} w={9} />
          <g opacity={eo(t, tTop - 0.3, 0.4)}>
            <Sheet x={700} y={200} w={820} h={100} rot={-1.5}>
              <Highlight x={-380} y={-34} w={760} h={62} p={pr(t, tTop + 0.2, 0.5)} />
              <Typed x={0} y={14} text="¿y si no llegaste a la cima?" p={pr(t, tTop - 0.3, 0.8)} size={46} anchor="middle" />
            </Sheet>
          </g>
          <Tag x={1700} y={1010} text="Gráfico ilustrativo" anchor="end" />
        </g>
      ) : null}
      <ChapterCard t={t} at={a} num="2." title="LA PROMESA" />
    </g>
  );
};

// ───────── Escena 9: el tablero inclinado ─────────
const SQ = 128;
const boardPath = (n: number): [number, number][] => {
  // camino en serpiente de 3 filas x 7
  const out: [number, number][] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) out.push([r % 2 === 0 ? c : 6 - c, r]);
  return out.slice(0, n);
};
const CELLS = boardPath(21);

export const Board: React.FC<SceneProps> = ({t, a, b}) => {
  const tEdu = W(20, 'educación');
  const tHealth = W(20, 'salud');
  const tStab = W(20, 'estabilidad');
  const tLack = W(20, 'carencias');
  const tRule = W(21, 'misma regla');
  const tDes = W(21, 'desigualdades');
  const tilt = eio(t, tDes - 0.6, 1.6);
  const oblique = eio(t, a + 0.2, 1.4);
  const cell = (i: number) => {
    const [c, r] = CELLS[i];
    return [c * SQ - 3.5 * SQ + SQ / 2, r * SQ - 1.5 * SQ + SQ / 2] as [number, number];
  };
  const icons: [number, string, number][] = [
    [16, '📘', tEdu],
    [17, '✚', tHealth],
    [18, '$', tStab],
  ];
  const lacks = [2, 3, 5, 6, 8, 10];
  return (
    <Cam t={t} keys={[[a, 960, 560, 1.0], [tDes - 0.6, 960, 560, 1.0], [tDes + 1.2, 960, 600, 0.9]]}>
      <Layer depth={0.3}>
        <Bg kind="paper" />
      </Layer>
      <Layer depth={1}>
        <g transform={`translate(960 ${lerp(560, 600, oblique)}) scale(1.3) rotate(${-tilt * 7}) matrix(1 0 ${-0.3 * oblique} ${1 - 0.42 * oblique} 0 0)`}>
          <rect x={-3.5 * SQ - 40} y={-1.5 * SQ - 40} width={7 * SQ + 80} height={3 * SQ + 80} rx={20} fill="#e9dcc0" stroke={V.ink} strokeWidth={4} filter="url(#paperShadow)" />
          {CELLS.map((_, i) => {
            const [x, y] = cell(i);
            const lack = lacks.includes(i) && t > tLack + lacks.indexOf(i) * 0.12;
            const good = i >= 16 && i <= 18;
            return (
              <g key={i}>
                <rect x={x - SQ / 2 + 4} y={y - SQ / 2 + 4} width={SQ - 8} height={SQ - 8} fill={lack ? '#e7a59c' : good ? '#f7e7a0' : '#fbfaf5'} stroke={V.ink} strokeWidth={2} />
                <text x={x - SQ / 2 + 14} y={y - SQ / 2 + 30} fontFamily={SANS} fontWeight={700} fontSize={18} fill={V.inkSoft}>
                  {i + 1}
                </text>
                {lack ? (
                  <text x={x} y={y + 14} textAnchor="middle" fontFamily={MARK} fontSize={26} fill={V.red}>
                    {['deuda', 'sin médico', 'sin escuela', 'turnos', 'desalojo', 'hambre'][lacks.indexOf(i)]}
                  </text>
                ) : null}
              </g>
            );
          })}
          {icons.map(([i, ch, at]) => {
            const [x, y] = cell(i);
            const p = pop(t, at - 0.1, 0.4);
            return (
              <g key={i} transform={`translate(${x} ${y + 10}) scale(${p})`}>
                <text textAnchor="middle" y={10} fontFamily={HEAD} fontWeight={800} fontSize={54} fill={i === 17 ? V.red : V.green}>
                  {ch === '📘' ? '✎' : ch}
                </text>
                <text textAnchor="middle" y={44} fontFamily={SANS} fontWeight={700} fontSize={14} fill={V.ink}>
                  {['EDUCACIÓN', 'SALUD', 'ESTABILIDAD'][i - 16]}
                </text>
              </g>
            );
          })}
          {(() => {
            const [gx, gy] = cell(20);
            return (
              <text x={gx} y={gy + 16} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={44} fill={V.ink}>
                META
              </text>
            );
          })()}
          {/* fichas */}
          {[
            [15, V.yellow, a + 0.6],
            [0, V.grayLight, a + 0.9],
          ].map(([i, col, at], k) => {
            const [x, y] = cell(i as number);
            const p = pop(t, at as number, 0.4);
            return (
              <g key={k} transform={`translate(${x} ${y - 10 - (1 - p) * 120})`}>
                <ellipse cx={0} cy={26} rx={30} ry={12} fill="#000" opacity={0.2} />
                <path d="M-24 24 L-16 -18 Q0 -40 16 -18 L24 24 Z" fill={col as string} stroke={V.ink} strokeWidth={3} />
                <circle cx={0} cy={-34} r={16} fill={col as string} stroke={V.ink} strokeWidth={3} />
              </g>
            );
          })}
        </g>
        <Typed x={960} y={130} text="no todos partimos del mismo lugar" p={pr(t, W(19, 'mismo lugar') - 0.4, 0.9)} size={52} anchor="middle" />
        {/* tarjeta de reglas */}
        <g transform={`translate(${lerp(2300, 1560, eio(t, tRule - 0.6, 0.6))} 860) rotate(6)`}>
          <Sheet x={0} y={0} w={420} h={240} fill="#fff7d6">
            <text x={0} y={-60} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={44} fill={V.ink}>
              REGLAS
            </text>
            <Typed x={0} y={10} text="Mismas reglas" p={pr(t, tRule - 0.1, 0.5)} size={34} anchor="middle" />
            <Typed x={0} y={56} text="para todos." p={pr(t, tRule + 0.3, 0.5)} size={34} anchor="middle" />
          </Sheet>
        </g>
        <g opacity={eo(t, tDes - 0.2, 0.3)}>
          <Highlight x={380} y={905} w={700} h={70} p={pr(t, tDes, 0.6)} />
          <text x={400} y={958} fontFamily={HEAD} fontWeight={800} fontSize={60} fill={V.ink}>
            DESIGUALDADES ESTRUCTURALES
          </text>
          <text x={1180} y={300} fontFamily={MARK} fontSize={46} fill={V.red} opacity={eo(t, tDes + 0.8, 0.4)} transform="rotate(-8 1180 300)">
            ¡el tablero está inclinado!
          </text>
        </g>
      </Layer>
    </Cam>
  );
};

// ───────── Escena 10: la sección de autoayuda ─────────
const Cover: React.FC<{w?: number; h?: number; fill: string; ink: string; lines: string[]; hl?: number; sticker?: boolean; t: number; at: number}> = ({w = 300, h = 420, fill, ink, lines, hl = 0, sticker, t, at}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={fill} filter="url(#paperShadow)" />
    <rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28} fill="none" stroke={ink} strokeWidth={2} />
    {hl > 0 ? <Highlight x={-w / 2 + 20} y={-h / 2 + 50} w={w - 40} h={lines.length * 44 + 20} p={hl} /> : null}
    {lines.map((l, i) => (
      <text key={i} x={0} y={-h / 2 + 100 + i * 44} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={40} fill={ink}>
        {l}
      </text>
    ))}
    {sticker ? (
      <g transform={`translate(${w / 2 - 40} ${h / 2 - 50}) rotate(-14) scale(${pop(t, at + 0.5, 0.4)})`}>
        <circle r={58} fill={V.red} />
        <text y={-4} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={24} fill="#fff">
          ¡BEST
        </text>
        <text y={22} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={24} fill="#fff">
          SELLER!
        </text>
      </g>
    ) : null}
  </g>
);

export const Books: React.FC<SceneProps> = ({t, a, b}) => {
  const tA = S(24);
  const tB = W(24, 'conviértase');
  const tC = S(26);
  const drop = (at: number) => eio(t, at - 0.4, 0.45);
  const bars = eo(t, tC + 0.9, 0.9);
  return (
    <Cam t={t} keys={[[a, 960, 540, 1.0], [tC + 0.6, 960, 560, 1.0], [b, 960, 600, 0.92]]}>
      <Layer depth={0.3}>
        <Bg kind="dark" />
        <text x={960} y={140} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={72} fill="#fbfaf5" letterSpacing={8} opacity={eo(t, a + 0.2, 0.4)}>
          AUTOAYUDA
        </text>
        <rect x={810} y={160} width={300} height={6} fill={V.yellow} opacity={eo(t, a + 0.4, 0.4)} />
      </Layer>
      <Layer depth={1}>
        {/* pila alta: triunfar */}
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={360} y={820 - i * 34} width={420} height={30} fill={[V.red, V.yellow, '#24477a', V.green][i]} stroke="#000" strokeWidth={2} opacity={eo(t, a + 0.4 + i * 0.15, 0.3)} />
        ))}
        <g transform={`translate(${520} ${lerp(-400, 520, drop(tA))}) rotate(-4)`}>
          <Cover fill={V.red} ink="#fff6d0" lines={['CÓMO', 'TRIUNFAR EN', '15 MINUTOS']} hl={pr(t, tA + 0.3, 0.5)} sticker t={t} at={tA} />
        </g>
        <g transform={`translate(${780} ${lerp(-400, 480, drop(tB))}) rotate(5)`}>
          <Cover fill={V.yellow} ink={V.ink} lines={['CONVIÉRTASE', 'EN MILLONARIO', 'DE LA NOCHE', 'A LA MAÑANA']} hl={pr(t, tB + 0.6, 0.5)} sticker t={t} at={tB} />
        </g>
        {/* pila baja: autoestima */}
        {[0, 1].map((i) => (
          <rect key={i} x={1180} y={820 - i * 34} width={420} height={30} fill={['#6b7d86', '#8a8f93'][i]} stroke="#000" strokeWidth={2} opacity={eo(t, a + 0.7 + i * 0.15, 0.3)} />
        ))}
        <g transform={`translate(${1390} ${lerp(-400, 560, drop(tC))}) rotate(-2)`}>
          <Cover fill="#9aa9b0" ink="#14262c" lines={['CÓMO LIDIAR', 'CON UNA BAJA', 'AUTOESTIMA']} hl={pr(t, tC + 0.4, 0.5)} t={t} at={tC} />
        </g>
        {bars > 0 ? (
          <g opacity={bars}>
            <path d="M300 980 L1660 980" stroke="#fbfaf5" strokeWidth={3} />
            <text x={570} y={1030} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={22} fill="#fbfaf5" letterSpacing={2}>
              PARA TRIUNFAR
            </text>
            <text x={1390} y={1030} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={22} fill="#fbfaf5" letterSpacing={2}>
              PARA SOBREVIVIR A NO TRIUNFAR
            </text>
          </g>
        ) : null}
        <Tag x={1660} y={230} text="Ilustrativo" anchor="end" p={bars} />
      </Layer>
    </Cam>
  );
};

// ───────── Escena 11: el embudo ─────────
const N_DOTS = 110;
const DOTS = Array.from({length: N_DOTS}, (_, i) => {
  const r = (k: number) => Math.sin(i * 91.7 + k * 13.1) * 0.5 + 0.5;
  return {x0: 560 + r(1) * 800, start: i * 0.075, pass: i % 11 === 3, r1: r(2), r2: r(3)};
});

export const Funnel: React.FC<SceneProps> = ({t, a, b}) => {
  const tF = W(28, 'una sociedad');
  const tMin = W(28, 'pequeña minoría');
  const tSad = W(28, 'insatisfacción');
  const books = phase(t, a - 1, tF + 0.1);
  const T = t - tF;
  // forma del embudo
  const top = 300, neck = 640, cx = 960;
  const half = (y: number) => (y < neck ? lerp(420, 34, (y - top) / (neck - top)) : 34);
  let settled = 0;
  return (
    <g>
      {books > 0 ? (
        <g opacity={books}>
          <Bg kind="dark" />
          <rect x={360} y={420} width={420} height={260} fill={V.red} opacity={0.85} />
          <rect x={1140} y={500} width={420} height={180} fill="#8a8f93" opacity={0.85} />
          <Marker d="M380 380 C380 320 520 330 960 300 C1400 330 1540 320 1540 380" p={pr(t, a + 0.1, 0.8)} color={V.yellow} w={8} />
          <text x={960} y={250} textAnchor="middle" fontFamily={MARK} fontSize={56} fill={V.yellow} opacity={eo(t, a + 0.5, 0.4)}>
            ambos géneros están relacionados
          </text>
        </g>
      ) : null}
      {t > tF - 0.3 ? (
        <g opacity={eo(t, tF - 0.3, 0.3)}>
          <Bg kind="grid" />
          <Typed x={960} y={150} text="«podrías tenerlo todo»" p={pr(t, tF, 0.9)} size={56} anchor="middle" />
          <path d={`M${cx - 420} ${top} L${cx - 34} ${neck} L${cx - 34} 760 M${cx + 420} ${top} L${cx + 34} ${neck} L${cx + 34} 760`} stroke={V.ink} strokeWidth={8} fill="none" strokeLinejoin="round" />
          {DOTS.map((d, i) => {
            const age = T - d.start;
            if (age < 0) return null;
            if (d.pass) {
              // cae recto por el cuello y llega abajo
              const y = 220 + 520 * age * age;
              const x = lerp(d.x0, cx, clamp(age * 1.6));
              const yy = Math.min(y, 940 - (i % 3) * 6);
              return <circle key={i} cx={x + (yy > 900 ? (i % 5) * 26 - 52 : 0)} cy={yy} r={13} fill={V.yellow} stroke={V.ink} strokeWidth={2} />;
            }
            // se queda atascado en el embudo: se apila y se vuelve gris
            const slot = settled++;
            const row = Math.floor(Math.sqrt(slot * 1.4));
            const yS = neck - 20 - row * 24;
            const w = half(yS) - 20;
            const xS = cx - w + ((slot * 37) % Math.max(1, Math.round(2 * w)));
            const fallT = clamp(age / 0.8);
            const x = lerp(d.x0, xS, fallT);
            const y = lerp(220, yS, fallT * fallT);
            const gray = clamp((age - 0.8) / 0.5);
            return <circle key={i} cx={x} cy={y} r={12} fill={gray > 0.5 ? V.gray : V.ink} opacity={1 - gray * 0.2} />;
          })}
          <g opacity={eo(t, tMin - 0.2, 0.4)}>
            <MarkerArrow x0={1300} y0={980} x1={1030} y1={930} p={pr(t, tMin, 0.5)} />
            <text x={1320} y={995} fontFamily={MARK} fontSize={44} fill={V.red}>
              una pequeña minoría
            </text>
          </g>
          <g opacity={eo(t, tSad - 0.2, 0.4)}>
            <Highlight x={180} y={470} w={330} h={60} p={pr(t, tSad, 0.5)} />
            <text x={190} y={515} fontFamily={HEAD} fontWeight={800} fontSize={50} fill={V.ink}>
              INSATISFACCIÓN
            </text>
            <text x={190} y={580} fontFamily={HEAD} fontWeight={800} fontSize={50} fill={V.inkSoft}>
              Y AFLICCIÓN
            </text>
          </g>
          <Tag x={1760} y={1010} text="Ilustrativo" anchor="end" />
        </g>
      ) : null}
    </g>
  );
};

// ───────── Escena 12: el mito del mérito — línea de tiempo ─────────
const Horse: React.FC = () => (
  <g>
    <path d="M-110 -60 L-116 60 M-80 -60 L-74 60 M70 -60 L76 60 M100 -60 L94 60" stroke="#4a4a4a" strokeWidth={14} strokeLinecap="round" />
    <path d="M-140 -130 C-150 -70 -120 -40 -70 -40 L90 -40 C140 -40 150 -100 130 -130 C100 -160 -110 -160 -140 -130 Z" fill="#6a6a6a" />
    <path d="M100 -130 L170 -250 C180 -270 220 -266 226 -240 L232 -206 L196 -196 L160 -130 Z" fill="#6a6a6a" />
    <path d="M168 -250 C150 -216 136 -180 120 -150" stroke="#2a2a2a" strokeWidth={12} fill="none" />
    <path d="M-140 -126 C-180 -110 -184 -60 -166 -30" stroke="#2a2a2a" strokeWidth={12} fill="none" />
  </g>
);

export const Timeline: React.FC<SceneProps> = ({t, a, b}) => {
  const tJust = W(29, 'justas');
  const tPast = S(30);
  const tCul = W(31, 'culpa');
  const tFeu = W(31, 'feudal');
  const tNow = W(32, 'meritocracias');
  const tDeserve = W(32, 'merecen');
  const camX = t < tNow - 0.6 ? 700 : lerp(700, 3100, eio(t, tNow - 0.6, 1.6));
  return (
    <g>
      <Cam t={t} keys={[[a, 700, 540, 1.0], [tPast, 700, 540, 1.0], [tNow - 0.6, 700, 540, 1.0], [tNow + 1.0, 3100, 540, 1.0], [b, 3150, 520, 1.06]]}>
        <Layer depth={0.3}>
          <Bg kind="news" />
        </Layer>
        <Layer depth={1}>
          <path d="M-200 800 L3800 800" stroke={V.ink} strokeWidth={5} />
          {[
            [300, 'SIGLO XII'],
            [1300, 'SIGLO XVI'],
            [2200, 'SIGLO XIX'],
            [3100, 'HOY'],
          ].map(([x, l]) => (
            <g key={l as string}>
              <circle cx={x as number} cy={800} r={14} fill={l === 'HOY' ? V.yellow : V.ink} stroke={V.ink} strokeWidth={3} />
              <text x={x as number} y={870} textAnchor="middle" fontFamily={HEAD} fontWeight={800} fontSize={44} fill={V.ink}>
                {l}
              </text>
            </g>
          ))}
          {/* «justas» */}
          <g opacity={phase(t, a + 1.6, tPast + 0.2)}>
            <text x={700} y={380} textAnchor="middle" fontFamily={SERIF} fontStyle="italic" fontSize={110} fill={V.ink}>
              sociedades «justas»
            </text>
            <MarkerCircle cx={830} cy={350} rx={200} ry={80} p={pr(t, tJust, 0.6)} />
            <text x={1100} y={500} fontFamily={MARK} fontSize={46} fill={V.red} opacity={eo(t, tJust + 0.6, 0.3)}>
              ¿de verdad?
            </text>
          </g>
          {/* la Edad Media: grabado sobre pergamino */}
          <g opacity={eo(t, tPast - 0.2, 0.5)}>
            <Sheet x={620} y={440} w={1000} h={600} fill="#ece0bf" rot={-1.5}>
              <text x={0} y={-200} textAnchor="middle" fontFamily={GOTH} fontSize={64} fill="#4a2a1a">
                el sistema estaba arreglado
              </text>
              <g transform="translate(-250 270) scale(1.0)">
                <Cutout noBorder>
                  <PhotoPerson x={0} y={0} suit={110} hair="short" hairTone={50} tie={false} hat sad armR={[60, 30]} armL={[50, 40]} />
                  <path d="M60 -170 L220 -10" stroke="#3a3a3a" strokeWidth={10} />
                </Cutout>
              </g>
              <g transform="translate(230 250) scale(1.05)">
                <Cutout noBorder>
                  <Horse />
                  <PhotoPerson x={20} y={-120} s={0.62} suit={60} hair="short" hairTone={30} tie={false} sit armR={[70, 20]} />
                </Cutout>
              </g>
            </Sheet>
            <text x={360} y={1000} textAnchor="middle" fontFamily={MARK} fontSize={44} fill={V.red} opacity={eo(t, tCul - 0.2, 0.3)}>
              no era tu culpa
            </text>
            <text x={880} y={1000} textAnchor="middle" fontFamily={MARK} fontSize={44} fill={V.red} opacity={eo(t, tFeu - 0.2, 0.3)}>
              ni tu mérito
            </text>
          </g>
          {/* hoy: la ficha de diccionario */}
          <g opacity={eo(t, tNow, 0.5)}>
            <Sheet x={3120} y={430} w={1100} h={480} fill="#fbfaf5" rot={1}>
              <text x={-490} y={-140} fontFamily={SERIF} fontSize={78} fill={V.ink}>
                meritocracia
              </text>
              <text x={-490} y={-80} fontFamily={SERIF} fontStyle="italic" fontSize={34} fill={V.inkSoft}>
                sustantivo femenino
              </text>
              <path d="M-490 -50 L490 -50" stroke={V.grayLight} strokeWidth={2} />
              <Highlight x={-110} y={30} w={380} h={56} p={pr(t, tDeserve, 0.5)} />
              <text x={-490} y={20} fontFamily={SERIF} fontSize={40} fill={V.ink}>
                Sistema en el que las recompensas
              </text>
              <text x={-490} y={74} fontFamily={SERIF} fontSize={40} fill={V.ink}>
                las ganan quienes <tspan fontWeight={700}>las merecen</tspan>:
              </text>
              <text x={-490} y={128} fontFamily={SERIF} fontSize={40} fill={V.ink}>
                personas trabajadoras y astutas.
              </text>
            </Sheet>
          </g>
        </Layer>
      </Cam>
      <ChapterCard t={t} at={a} num="3." title="EL MITO DEL MÉRITO" />
      <rect x={0} y={0} width={0} height={0} opacity={camX ? 0 : 0} />
    </g>
  );
};

export const _b = {MoneyStack, settle, TYPE, Tape};
