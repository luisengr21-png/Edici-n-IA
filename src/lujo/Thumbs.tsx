import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {L, SANS, SERIF} from './kit';

// Miniaturas: fondo generado con IA (public/lujo/thumbs/fondo_N.jpg) + texto y símbolos con la tipografía del canal.
const stroke = (px: number, c = '#000') => ({WebkitTextStroke: `${px}px ${c}`, paintOrder: 'stroke fill' as const});

const Shade: React.FC<{side: 'left' | 'right' | 'top-left' | 'top-right'}> = ({side}) => {
  const g: Record<string, string> = {
    left: 'linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 38%, transparent 60%)',
    right: 'linear-gradient(270deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.35) 38%, transparent 60%)',
    'top-left': 'radial-gradient(ellipse at 0% 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 40%, transparent 65%)',
    'top-right': 'radial-gradient(ellipse at 100% 0%, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.35) 40%, transparent 65%)',
  };
  return <AbsoluteFill style={{background: g[side]}} />;
};

const T1 = () => (
  <>
    <Shade side="left" />
    <div style={{position: 'absolute', left: 60, top: 190, width: 520, fontFamily: SANS, fontWeight: 900, fontSize: 132, lineHeight: 0.98, color: L.white, letterSpacing: -3, textShadow: '0 10px 30px rgba(0,0,0,0.7)', ...stroke(6)}}>
      ¿Y LA <span style={{color: L.red}}>CASA</span>?
    </div>
    <svg style={{position: 'absolute', inset: 0}} width={1280} height={720}>
      <ellipse cx={690} cy={372} rx={88} ry={80} fill="none" stroke={L.red} strokeWidth={9} transform="rotate(-8 690 372)" />
      <path d="M470 470 Q560 520 610 430" fill="none" stroke={L.red} strokeWidth={10} strokeLinecap="round" />
      <path d="M592 420 L616 422 L612 446" fill="none" stroke={L.red} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
);
const T2 = () => (
  <>
    <Shade side="top-right" />
    <div style={{position: 'absolute', right: 50, top: 46, width: 620, textAlign: 'right', fontFamily: SERIF, fontWeight: 900, fontSize: 104, lineHeight: 1.0, color: L.goldL, textShadow: '0 8px 30px rgba(0,0,0,0.8)', ...stroke(5)}}>
      SOLO PARA VER
    </div>
  </>
);
const T3 = () => (
  <>
    <Shade side="top-left" />
    <div style={{position: 'absolute', left: 50, top: 40, width: 560, fontFamily: SANS, fontWeight: 900, fontSize: 104, lineHeight: 1.0, color: L.white, letterSpacing: -2, textShadow: '0 8px 30px rgba(0,0,0,0.8)', ...stroke(6)}}>
      ¿TE HA PASADO?
      <div style={{height: 14, width: 360, background: L.gold, borderRadius: 7, marginTop: 14}} />
    </div>
  </>
);
const T4 = () => (
  <>
    <Shade side="top-right" />
    <div style={{position: 'absolute', right: 50, top: 50, width: 600, textAlign: 'right', fontFamily: SANS, fontWeight: 900, fontSize: 104, lineHeight: 1.0, color: '#FFD23F', letterSpacing: -2, textShadow: '0 8px 30px rgba(0,0,0,0.8)', ...stroke(7)}}>
      SOLO $50 AL MES…
    </div>
  </>
);
const T5 = () => (
  <>
    <Shade side="left" />
    <div style={{position: 'absolute', left: 50, top: 210, width: 500, fontFamily: SERIF, fontWeight: 900, fontSize: 96, lineHeight: 1.0, color: L.white, textShadow: '0 10px 30px rgba(0,0,0,0.8)', ...stroke(4)}}>
      ATRAPADO CON <span style={{color: L.goldL}}>ESTILO</span>
    </div>
  </>
);

const DESIGNS = [T1, T2, T3, T4, T5];
export const Thumb: React.FC<{n: number}> = ({n}) => {
  const D = DESIGNS[n - 1];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile(`lujo/thumbs/fondo_${n}.jpg`)} style={{width: 1280, height: 720, objectFit: 'cover'}} />
      <D />
    </AbsoluteFill>
  );
};
