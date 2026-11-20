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
  const D = DESIGNS[n - 1];
  return (
    <AbsoluteFill style={{background: '#0b1a3a'}}>
      <Img src={staticFile(`burnout/thumbs/v2_fondo_${n}.jpg`)} style={{width: 1280, height: 720, objectFit: 'cover'}} />
      <Shade />
      <D />
    </AbsoluteFill>
  );
};
