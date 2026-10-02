import React from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// ───────────────────────── Paleta y tipografía ─────────────────────────
export const C = {
  paper: '#f1e6d0',
  cream: '#faf3e4',
  ink: '#3a2a1f',
  inkSoft: '#6b5646',
  ochre: '#d9a441',
  honey: '#e9c27c',
  sage: '#8fa98a',
  sageDark: '#5f7a5c',
  brick: '#b5523b',
  slate: '#4f6475',
  slateLight: '#8da0ad',
  rose: '#e3b2a6',
  roseDeep: '#c98a7e',
  gray: '#a59d90',
  grayDark: '#6f675d',
  night: '#2c3a4f',
  gold: '#c99a3a',
  skin: ['#f2d6bd', '#e3b896', '#c99572', '#9c6b4c'],
};

export const HAND = 'Caveat, cursive';
export const FELL = '"IM Fell English", Georgia, serif';
export const FELLSC = '"IM Fell English SC", Georgia, serif';
export const GOTH = 'UnifrakturMaguntia, serif';

const faces: [string, string, string, string][] = [
  ['Caveat', 'Caveat-500.woff', '500', 'normal'],
  ['Caveat', 'Caveat-700.woff', '700', 'normal'],
  ['IM Fell English', 'IMFell.woff', '400', 'normal'],
  ['IM Fell English', 'IMFell-italic.woff', '400', 'italic'],
  ['IM Fell English SC', 'IMFellSC.woff', '400', 'normal'],
  ['UnifrakturMaguntia', 'Unifraktur.woff', '400', 'normal'],
];
if (typeof document !== 'undefined') {
  const h = delayRender('Tipografías estatus');
  Promise.all(
    faces.map(([fam, file, weight, style]) => {
      const f = new FontFace(fam, `url(${staticFile(`estatus/fonts/${file}`)}) format('woff')`, {weight, style});
      return f.load().then(() => document.fonts.add(f));
    }),
  ).finally(() => continueRender(h));
}

// ───────────────────────── Tiempo y easing ─────────────────────────
export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const easeOutBack = (t: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
};
/** progreso 0..1 entre t0 y t0+dur */
export const pr = (t: number, t0: number, dur = 0.6) => clamp((t - t0) / dur);
export const eo = (t: number, t0: number, dur = 0.6) => easeOut(pr(t, t0, dur));
export const eio = (t: number, t0: number, dur = 0.6) => easeInOut(pr(t, t0, dur));
export const pop = (t: number, t0: number, dur = 0.45) => easeOutBack(pr(t, t0, dur));
/** balanceo amortiguado (péndulo) que arranca en t0 */
export const settle = (t: number, t0: number, amp = 1, freq = 1.4, damp = 2.2) => {
  const x = t - t0;
  if (x < 0) return 0;
  return amp * Math.exp(-x * damp) * Math.cos(x * freq * Math.PI * 2);
};

// ───────────────────────── Contexto de tiempo ─────────────────────────
export const TimeCtx = React.createContext(0);
export const useT = () => React.useContext(TimeCtx);

// ───────────────────────── Primitivas de tinta ─────────────────────────
type InkProps = React.SVGProps<SVGPathElement> & {d: string; draw?: number; w?: number; color?: string};
/** Trazo de tinta; `draw` 0..1 lo dibuja de inicio a fin */
export const Ink: React.FC<InkProps> = ({d, draw = 1, w = 2.6, color = C.ink, fill = 'none', ...rest}) => {
  if (draw <= 0) return null;
  return (
    <path
      d={d}
      fill={fill}
      stroke={color}
      strokeWidth={w}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength={draw < 1 ? 1 : undefined}
      strokeDasharray={draw < 1 ? '1 1' : undefined}
      strokeDashoffset={draw < 1 ? 1 - draw : undefined}
      {...rest}
    />
  );
};

/** Forma rellena con contorno de tinta; aparece con fundido del relleno tras el trazo */
export const Shape: React.FC<{d: string; fill: string; draw?: number; w?: number; color?: string; opacity?: number}> = ({
  d,
  fill,
  draw = 1,
  w = 2.6,
  color = C.ink,
  opacity = 1,
}) => {
  if (draw <= 0) return null;
  return (
    <g opacity={opacity}>
      <path d={d} fill={fill} opacity={clamp((draw - 0.5) * 2)} />
      <Ink d={d} draw={draw} w={w} color={color} />
    </g>
  );
};

/** Texto que se escribe de izquierda a derecha, como a pluma */
export const Write: React.FC<{
  x: number;
  y: number;
  children: string;
  p: number;
  size?: number;
  font?: string;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  weight?: number;
  italic?: boolean;
  spacing?: number;
  widthFactor?: number;
  id: string;
}> = ({x, y, children, p, size = 48, font = HAND, color = C.ink, anchor = 'middle', weight = 500, italic, spacing = 0, widthFactor = 0.5, id}) => {
  if (p <= 0) return null;
  const w = children.length * size * widthFactor + size;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x - size * 0.2;
  return (
    <g>
      <defs>
        <clipPath id={`w-${id}`}>
          <rect x={x0 - 4} y={y - size * 1.2} width={(w + 8) * p} height={size * 1.8} />
        </clipPath>
      </defs>
      <text
        x={x}
        y={y}
        clipPath={p < 1 ? `url(#w-${id})` : undefined}
        fontFamily={font}
        fontSize={size}
        fontWeight={weight}
        fontStyle={italic ? 'italic' : 'normal'}
        fill={color}
        textAnchor={anchor}
        letterSpacing={spacing}
      >
        {children}
      </text>
    </g>
  );
};

// ───────────────────────── Bocadillo de diálogo ─────────────────────────
export const Bubble: React.FC<{x: number; y: number; w: number; h: number; tail: [number, number]; p: number; children?: React.ReactNode; fill?: string}> = ({
  x,
  y,
  w,
  h,
  tail,
  p,
  children,
  fill = C.cream,
}) => {
  if (p <= 0) return null;
  const s = easeOutBack(clamp(p));
  const [tx, ty] = tail;
  const r = Math.min(30, h / 2);
  const d = `M${x - w / 2 + r} ${y - h / 2} H${x + w / 2 - r} Q${x + w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2 + r} V${y + h / 2 - r} Q${x + w / 2} ${y + h / 2} ${x + w / 2 - r} ${y + h / 2} H${x + 22} L${tx} ${ty} L${x - 10} ${y + h / 2} H${x - w / 2 + r} Q${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - r} V${y - h / 2 + r} Q${x - w / 2} ${y - h / 2} ${x - w / 2 + r} ${y - h / 2} Z`;
  return (
    <g transform={`translate(${tx} ${ty}) scale(${s}) translate(${-tx} ${-ty})`}>
      <path d={d} fill={fill} stroke={C.ink} strokeWidth={2.6} strokeLinejoin="round" />
      {children}
    </g>
  );
};

// ───────────────────────── Personaje ─────────────────────────
export type Mood = 'smile' | 'neutral' | 'sad' | 'smug' | 'surprised' | 'closed' | 'worried';
export type PersonProps = {
  x: number;
  y: number;
  s?: number;
  flip?: boolean;
  coat?: string;
  legs?: string;
  skin?: string;
  hair?: 'short' | 'bun' | 'bald' | 'long' | 'curly' | 'none';
  hairColor?: string;
  hat?: 'top' | 'crown' | 'cap' | 'none';
  mood?: Mood;
  armBack?: [number, number];
  armFront?: [number, number];
  holdFront?: React.ReactNode;
  holdBack?: React.ReactNode;
  lean?: number;
  headTilt?: number;
  dress?: boolean;
  tie?: string;
  sit?: boolean;
  opacity?: number;
  child?: boolean;
};

const armPts = (sx: number, sy: number, a: number, b: number, l1 = 50, l2 = 48) => {
  const r = Math.PI / 180;
  const ex = sx + Math.sin(a * r) * l1;
  const ey = sy + Math.cos(a * r) * l1;
  const hx = ex + Math.sin((a + b) * r) * l2;
  const hy = ey + Math.cos((a + b) * r) * l2;
  return {ex, ey, hx, hy};
};

const MOUTH: Record<Mood, string> = {
  smile: 'M7 -249 Q12 -244 18 -250',
  neutral: 'M8 -248 L17 -248',
  sad: 'M7 -246 Q12 -251 18 -246',
  smug: 'M7 -248 Q13 -247 19 -252',
  surprised: 'M11 -249 a2.6 3 0 1 0 0.1 0',
  closed: 'M7 -248 Q12 -245 17 -248',
  worried: 'M7 -247 Q10 -249 13 -247 Q15 -245 18 -247',
};

/** Figura humana de cuello largo y cabeza pequeña, mirando a la derecha. Origen: entre los pies. */
export const Person: React.FC<PersonProps> = ({
  x,
  y,
  s = 1,
  flip,
  coat = C.slate,
  legs = C.ink,
  skin = C.skin[0],
  hair = 'short',
  hairColor = C.ink,
  hat = 'none',
  mood = 'neutral',
  armBack = [8, -10],
  armFront = [-6, 12],
  holdFront,
  holdBack,
  lean = 0,
  headTilt = 0,
  dress,
  tie,
  sit,
  opacity = 1,
  child,
}) => {
  const sc = child ? s * 0.62 : s;
  const back = armPts(-18, -206, armBack[0], armBack[1]);
  const front = armPts(16, -206, armFront[0], armFront[1]);
  const body = dress
    ? 'M-20 -214 C-30 -212 -34 -200 -34 -180 L-52 -100 L52 -100 L34 -180 C34 -200 30 -212 20 -214 Z'
    : 'M-20 -214 C-30 -212 -34 -200 -34 -180 L-37 -110 L37 -110 L34 -180 C34 -200 30 -212 20 -214 Z';
  const legPath = sit
    ? 'M-12 -112 L44 -112 L44 -30 M8 -112 L60 -112 L62 -30'
    : 'M-11 -110 L-14 0 M11 -110 L15 0';
  const feet = sit ? 'M44 -30 L58 -30 M62 -30 L76 -30' : 'M-14 0 L2 0 M15 0 L31 0';
  const eyes = mood === 'closed' ? (
    <>
      <Ink d="M0 -266 Q3 -264 6 -266" w={1.8} />
      <Ink d="M11 -266 Q14 -264 17 -266" w={1.8} />
    </>
  ) : (
    <>
      <circle cx={3} cy={-266} r={1.9} fill={C.ink} />
      <circle cx={14} cy={-266} r={1.9} fill={C.ink} />
    </>
  );
  const brows =
    mood === 'smug' ? (
      <Ink d="M0 -274 L7 -276 M11 -276 L18 -273" w={1.6} />
    ) : mood === 'sad' || mood === 'worried' ? (
      <Ink d="M0 -272 L6 -275 M12 -275 L18 -272" w={1.6} />
    ) : mood === 'surprised' ? (
      <Ink d="M0 -276 Q3 -279 7 -277 M11 -277 Q15 -279 18 -276" w={1.6} />
    ) : null;
  const hairEl =
    hair === 'none' || hair === 'bald' ? (
      hair === 'bald' ? <path d="M-17 -262 C-20 -256 -16 -250 -12 -252" fill={hairColor} stroke={C.ink} strokeWidth={1.5} /> : null
    ) : (
      <g>
        {hair === 'long' ? <path d="M-14 -282 C-26 -266 -26 -236 -18 -222 L-4 -226 C-10 -240 -8 -262 -2 -272 Z" fill={hairColor} stroke={C.ink} strokeWidth={2} /> : null}
        {hair === 'bun' ? <circle cx={-14} cy={-288} r={9} fill={hairColor} stroke={C.ink} strokeWidth={2} /> : null}
        {hair === 'curly' ? (
          <g fill={hairColor} stroke={C.ink} strokeWidth={1.8}>
            {[[-14, -280], [-6, -288], [5, -290], [15, -284], [-17, -268]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={8} />
            ))}
          </g>
        ) : null}
        <path d="M-18 -262 C-22 -282 -6 -294 10 -290 C18 -288 23 -280 22 -272 C14 -278 4 -280 -4 -276 C-8 -272 -12 -266 -18 -262 Z" fill={hairColor} stroke={C.ink} strokeWidth={2} />
      </g>
    );
  const hatEl =
    hat === 'top' ? (
      <g>
        <path d="M-22 -282 L26 -282" stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        <path d="M-14 -283 L-14 -322 L18 -322 L18 -283 Z" fill={C.ink} />
      </g>
    ) : hat === 'crown' ? (
      <path d="M-15 -282 L-17 -306 L-7 -294 L2 -310 L10 -294 L20 -306 L18 -282 Z" fill={C.honey} stroke={C.ink} strokeWidth={2} strokeLinejoin="round" />
    ) : hat === 'cap' ? (
      <path d="M-18 -276 C-16 -296 18 -298 22 -278 L36 -276 L22 -272 Z" fill={C.brick} stroke={C.ink} strokeWidth={2} />
    ) : null;

  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -sc : sc} ${sc}) rotate(${lean})`} opacity={opacity}>
      {/* brazo trasero */}
      <Ink d={`M-18 -206 L${back.ex} ${back.ey} L${back.hx} ${back.hy}`} w={7} color={C.ink} />
      <Ink d={`M-18 -206 L${back.ex} ${back.ey} L${back.hx} ${back.hy}`} w={3.5} color={coat} />
      <circle cx={back.hx} cy={back.hy} r={5} fill={skin} stroke={C.ink} strokeWidth={1.6} />
      {holdBack ? <g transform={`translate(${back.hx} ${back.hy})`}>{holdBack}</g> : null}
      {/* piernas */}
      <Ink d={legPath} w={5} color={legs} />
      <Ink d={feet} w={6} color={C.ink} />
      {/* cuerpo */}
      <path d={body} fill={coat} stroke={C.ink} strokeWidth={2.6} strokeLinejoin="round" />
      {tie ? <path d="M0 -212 L5 -196 L0 -168 L-5 -196 Z" fill={tie} stroke={C.ink} strokeWidth={1.4} /> : null}
      {/* cuello y cabeza */}
      <g transform={`rotate(${headTilt} 0 -214)`}>
        <path d="M-4 -214 L-3 -242 L6 -242 L5 -214 Z" fill={skin} stroke={C.ink} strokeWidth={1.8} />
        <ellipse cx={4} cy={-264} rx={18} ry={22} fill={skin} stroke={C.ink} strokeWidth={2.4} />
        <Ink d="M20 -266 L25 -257 L19 -255" w={1.8} />
        {eyes}
        {brows}
        <Ink d={MOUTH[mood]} w={1.8} />
        {hairEl}
        {hatEl}
      </g>
      {/* brazo delantero */}
      <Ink d={`M16 -206 L${front.ex} ${front.ey} L${front.hx} ${front.hy}`} w={7} color={C.ink} />
      <Ink d={`M16 -206 L${front.ex} ${front.ey} L${front.hx} ${front.hy}`} w={3.5} color={coat} />
      {holdFront ? <g transform={`translate(${front.hx} ${front.hy})`}>{holdFront}</g> : null}
      <circle cx={front.hx} cy={front.hy} r={5} fill={skin} stroke={C.ink} strokeWidth={1.6} />
    </g>
  );
};

// ───────────────────────── Objetos ─────────────────────────
export const WineGlass: React.FC<{wine?: string}> = ({wine = C.brick}) => (
  <g transform="translate(0 -6)">
    <path d="M-9 -30 L9 -30 L7 -16 Q0 -8 -7 -16 Z" fill={wine} opacity={0.8} />
    <Ink d="M-10 -32 L10 -32 L7 -14 Q0 -6 -7 -14 Z M0 -8 L0 6 M-7 7 L7 7" w={1.8} />
  </g>
);

export const Briefcase: React.FC<{color?: string}> = ({color = '#7a4b2a'}) => (
  <g>
    <rect x={-22} y={4} width={44} height={32} rx={3} fill={color} stroke={C.ink} strokeWidth={2.2} />
    <path d="M-7 4 L-7 -2 L7 -2 L7 4" fill="none" stroke={C.ink} strokeWidth={2.2} />
  </g>
);

export const Phone: React.FC<{glow?: number}> = ({glow = 0}) => (
  <g transform="rotate(-12)">
    {glow > 0 ? <circle r={34} fill={C.honey} opacity={0.35 * glow} /> : null}
    <rect x={-10} y={-34} width={20} height={36} rx={4} fill="#20252c" stroke={C.ink} strokeWidth={1.8} />
    <rect x={-7} y={-30} width={14} height={27} rx={2} fill="#bcd3e6" />
  </g>
);

export const Coin: React.FC<{x: number; y: number; r?: number}> = ({x, y, r = 14}) => (
  <g>
    <ellipse cx={x} cy={y} rx={r} ry={r * 0.42} fill={C.gold} stroke={C.ink} strokeWidth={1.8} />
    <ellipse cx={x} cy={y - 1} rx={r * 0.62} ry={r * 0.24} fill="none" stroke={C.ink} strokeWidth={1} opacity={0.5} />
  </g>
);

export const Heart: React.FC<{x: number; y: number; s?: number; fill?: string; opacity?: number}> = ({x, y, s = 1, fill = C.brick, opacity = 1}) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0 12 C-18 0 -22 -12 -14 -19 C-8 -24 -2 -21 0 -15 C2 -21 8 -24 14 -19 C22 -12 18 0 0 12 Z"
    fill={fill}
    stroke={C.ink}
    strokeWidth={2}
    strokeLinejoin="round"
    opacity={opacity}
  />
);

/** Sello de goma: cae, golpea y deja tinta */
export const Stamp: React.FC<{x: number; y: number; t: number; at: number; text: string; rot?: number; size?: number; color?: string; font?: string}> = ({
  x,
  y,
  t,
  at,
  text,
  rot = -8,
  size = 64,
  color = C.brick,
  font = FELLSC,
}) => {
  if (t < at - 0.25) return null;
  const k = clamp((t - (at - 0.25)) / 0.25);
  const sc = t < at ? lerp(1.9, 1, easeIn(k)) : 1 + settle(t, at, 0.06, 2.5, 6);
  const op = t < at ? k * 0.6 : 0.92;
  const w = text.length * size * 0.74 + 60;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sc})`} opacity={op}>
      <rect x={-w / 2} y={-size * 0.78} width={w} height={size * 1.3} rx={10} fill="none" stroke={color} strokeWidth={6} />
      <text y={size * 0.28} textAnchor="middle" fontFamily={font} fontSize={size} fill={color} letterSpacing={4}>
        {text}
      </text>
    </g>
  );
};

/** Tarjeta de visita */
export const Card: React.FC<{text: string; w?: number; h?: number; fill?: string; size?: number}> = ({text, w = 220, h = 120, fill = C.cream, size = 30}) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={fill} stroke={C.ink} strokeWidth={2.4} />
    <text y={size * 0.32} textAnchor="middle" fontFamily={FELLSC} fontSize={size} fill={C.ink} letterSpacing={2}>
      {text}
    </text>
    <path d={`M${-w / 2 + 30} ${h / 2 - 26} L${w / 2 - 30} ${h / 2 - 26}`} stroke={C.inkSoft} strokeWidth={1.4} />
  </g>
);

// ───────────────────────── Filtros: papel, línea viva ─────────────────────────
/** Definiciones globales: el «boil» de la línea cambia de semilla cada 3 fotogramas */
export const BoilDefs: React.FC<{frame: number; scale?: number}> = ({frame, scale = 2.6}) => (
  <defs>
    <filter id="boil" x="-5%" y="-5%" width="110%" height="110%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves={2} seed={Math.floor(frame / 3) % 5} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="14" />
    </filter>
    <filter id="wash" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves={3} seed={7} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={18} xChannelSelector="R" yChannelSelector="G" result="d" />
      <feGaussianBlur in="d" stdDeviation="2.5" />
    </filter>
  </defs>
);

/** Cámara Ken Burns: interpola foco y zoom */
export const Cam: React.FC<{t: number; t0: number; t1: number; from: [number, number, number]; to: [number, number, number]; children: React.ReactNode; ease?: (x: number) => number}> = ({
  t,
  t0,
  t1,
  from,
  to,
  children,
  ease = easeInOut,
}) => {
  const k = ease(clamp((t - t0) / (t1 - t0)));
  const cx = lerp(from[0], to[0], k);
  const cy = lerp(from[1], to[1], k);
  const z = lerp(from[2], to[2], k);
  return <g transform={`translate(960 540) scale(${z}) translate(${-cx} ${-cy})`}>{children}</g>;
};

/** Suelo: línea de tinta a mano alzada */
export const Ground: React.FC<{y: number; x0?: number; x1?: number; draw?: number}> = ({y, x0 = 80, x1 = 1840, draw = 1}) => (
  <Ink d={`M${x0} ${y} C${lerp(x0, x1, 0.3)} ${y - 3} ${lerp(x0, x1, 0.6)} ${y + 3} ${x1} ${y}`} draw={draw} w={2.4} />
);
