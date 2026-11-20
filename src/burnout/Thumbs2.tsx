import React from 'react';
import {AbsoluteFill, Img, continueRender, delayRender, staticFile} from 'remotion';

// Miniaturas, versión 2: estilo de la referencia del creador.
// - foto conceptual realista sobre azul marino (fondo generado con IA: public/burnout/thumbs/v2_fondo_N.jpg);
// - texto blanco enorme en tipografía condensada (Anton, licencia OFL) a la derecha;
// - un solo acento de color (naranja fuego) cuando ayuda.
if (typeof document !== 'undefined') {
  const h = delayRender('Anton');
  const f = new FontFace('Anton', `url(${staticFile('canal/fonts/anton-regular.ttf')}) format('truetype')`);
  f.load()
    .then((ff) => document.fonts.add(ff))
    .finally(() => continueRender(h));
}

const FIRE = '#FF8A3D';
const RED = '#EF4444';
const txt = (extra: React.CSSProperties = {}): React.CSSProperties => ({
  position: 'absolute',
  top: 0,
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-end',
  whiteSpace: 'nowrap',
  fontFamily: 'Anton, Impact, sans-serif',
  color: '#fff',
  lineHeight: 0.92,
  letterSpacing: 1,
  textTransform: 'uppercase',
  textShadow: '0 8px 30px rgba(0,0,0,0.55)',
  ...extra,
});
// sombra suave hacia el lado del texto, para que se lea aunque el fondo tenga brillo
const Shade: React.FC = () => <AbsoluteFill style={{background: 'linear-gradient(270deg, rgba(6,14,38,0.55) 0%, rgba(6,14,38,0.2) 40%, transparent 60%)'}} />;

const Strike: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = RED}) => (
  <span style={{position: 'relative', display: 'inline-block'}}>
    {children}
    <span style={{position: 'absolute', left: '-5%', top: '47%', width: '110%', height: '0.11em', background: color, borderRadius: 8, transform: 'rotate(-6deg)', boxShadow: '0 4px 14px rgba(0,0,0,0.5)'}} />
  </span>
);

// 1 · Tres cerillos → «NO ES PEREZA» (PEREZA tachada)
const D1 = () => (
  <div style={txt({right: 64, textAlign: 'right'})}>
    <div style={{fontSize: 118}}>NO ES</div>
    <div style={{fontSize: 176}}>
      <Strike>PEREZA</Strike>
    </div>
  </div>
);
// 2 · El cerillo agachado → «TE QUEMASTE»
const D2 = () => (
  <div style={txt({right: 60, textAlign: 'right'})}>
    <div style={{fontSize: 120}}>TE</div>
    <div style={{fontSize: 168, color: FIRE}}>QUEMASTE</div>
  </div>
);
// 3 · La batería en llamas → «AL 3 %»
const D3 = () => (
  <div style={txt({right: 80, textAlign: 'right'})}>
    <div style={{fontSize: 150}}>AL</div>
    <div style={{fontSize: 290, color: RED, textShadow: `0 0 40px ${RED}88, 0 8px 30px rgba(0,0,0,0.6)`}}>3 %</div>
  </div>
);
// 4 · Las dos velas → «¿FLOJO O QUEMADO?»
const D4 = () => (
  <div style={txt({right: 60, textAlign: 'right'})}>
    <div style={{fontSize: 140}}>¿FLOJO O</div>
    <div style={{fontSize: 156, color: FIRE}}>QUEMADO?</div>
  </div>
);
// 5 · La escalera de cerillos → «5 ETAPAS»
const D5 = () => (
  <div style={txt({right: 90, alignItems: 'center'})}>
    <div style={{fontSize: 300, color: FIRE}}>5</div>
    <div style={{fontSize: 150, marginTop: -10}}>ETAPAS</div>
  </div>
);

const DESIGNS = [D1, D2, D3, D4, D5];
export const Thumb2: React.FC<{n: number}> = ({n}) => {
  // la 3 usa el texto elegido por el creador (opción D: blanco + rojo vivo, centrado en el espacio libre)
  if (n === 3) return <Thumb3Opt v="d" />;
  const D = DESIGNS[n - 1];
  return (
    <AbsoluteFill style={{background: '#0b1a3a'}}>
      <Img src={staticFile(`burnout/thumbs/v2_fondo_${n}.jpg`)} style={{width: 1280, height: 720, objectFit: 'cover'}} />
      <Shade />
      <D />
    </AbsoluteFill>
  );
};

// ── Miniatura 3, texto reacomodado: centrado en el espacio libre a la derecha de la pila (x 470–1260) y con colores de fuego ──
const FIRE_GRAD = 'linear-gradient(180deg, #FFF27A 0%, #FFC21A 28%, #FF7A1A 62%, #FF2E1F 100%)';
const fireText = (size: number): React.CSSProperties => ({
  fontSize: size,
  backgroundImage: FIRE_GRAD,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextStroke: `${Math.round(size * 0.025)}px #1a0a05`,
  filter: `drop-shadow(0 0 ${Math.round(size * 0.12)}px rgba(255,90,20,0.75)) drop-shadow(0 10px 18px rgba(0,0,0,0.6))`,
  textShadow: 'none',
});
const AREA: React.CSSProperties = {position: 'absolute', left: 470, right: 20, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Anton, Impact, sans-serif', lineHeight: 0.9, whiteSpace: 'nowrap'};
const NB = '\u202F'; // espacio fino entre 3 y %

// A · «AL» blanco arriba y «3 %» gigante con degradado de fuego
const O3A = () => (
  <div style={AREA}>
    <div style={{fontSize: 150, color: '#fff', letterSpacing: 4, textShadow: '0 6px 24px rgba(0,0,0,0.6)', WebkitTextStroke: '4px #0a1430'}}>AL</div>
    <div style={fireText(360)}>{`3${NB}%`}</div>
  </div>
);
// B · «AL» en una etiqueta amarilla inclinada y «3 %» con degradado de fuego
const O3B = () => (
  <div style={AREA}>
    <div style={{fontSize: 120, color: '#0a1430', background: '#FFD21A', padding: '6px 34px 0', borderRadius: 14, transform: 'rotate(-5deg)', boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 40px rgba(255,210,26,0.5)', marginBottom: 6}}>AL</div>
    <div style={fireText(350)}>{`3${NB}%`}</div>
  </div>
);
// C · todo en una línea: «AL» amarillo + «3 %» rojo fuego, con una barra de batería vacía debajo
const O3C = () => (
  <div style={AREA}>
    <div style={{display: 'flex', alignItems: 'baseline', gap: 26}}>
      <span style={{fontSize: 200, color: '#FFD21A', WebkitTextStroke: '5px #1a0a05', filter: 'drop-shadow(0 0 22px rgba(255,200,30,0.6)) drop-shadow(0 8px 16px rgba(0,0,0,0.6))'}}>AL</span>
      <span style={fireText(300)}>{`3${NB}%`}</span>
    </div>
    <div style={{marginTop: 26, width: 520, height: 46, borderRadius: 12, border: '6px solid #fff', padding: 5, boxSizing: 'border-box', position: 'relative', boxShadow: '0 8px 24px rgba(0,0,0,0.5)'}}>
      <div style={{width: '6%', height: '100%', borderRadius: 5, background: '#FF2E1F', boxShadow: '0 0 18px #FF2E1F'}} />
      <div style={{position: 'absolute', right: -20, top: 9, width: 12, height: 16, borderRadius: '0 4px 4px 0', background: '#fff'}} />
    </div>
  </div>
);
// D · formato de la primera versión (blanco + rojo), centrado y con colores más vivos (elegida por el creador)
const VIVID_RED = '#FF1A1A';
const O3D = () => (
  <div style={AREA}>
    <div style={{position: 'relative', zIndex: 2, marginBottom: 34, fontSize: 160, color: '#FFFFFF', letterSpacing: 4, paintOrder: 'stroke fill', WebkitTextStroke: '10px #050b1f', textShadow: '0 8px 22px rgba(0,0,0,0.75)'}}>AL</div>
    <div style={{fontSize: 360, color: VIVID_RED, WebkitTextStroke: '8px #2a0000', filter: `drop-shadow(0 0 28px ${VIVID_RED}) drop-shadow(0 0 60px rgba(255,26,26,0.6)) drop-shadow(0 10px 20px rgba(0,0,0,0.7))`}}>{`3${NB}%`}</div>
  </div>
);
const OPTS: Record<string, React.FC> = {a: O3A, b: O3B, c: O3C, d: O3D};
export const Thumb3Opt: React.FC<{v: string}> = ({v}) => {
  const D = OPTS[v];
  return (
    <AbsoluteFill style={{background: '#0b1a3a'}}>
      <Img src={staticFile('burnout/thumbs/v2_fondo_3.jpg')} style={{width: 1280, height: 720, objectFit: 'cover'}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 45% 60% at 68% 50%, rgba(4,10,30,0.45), transparent 70%)'}} />
      <D />
    </AbsoluteFill>
  );
};
