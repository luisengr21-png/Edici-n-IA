import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {L, SANS, SERIF} from './kit';

// Miniaturas: fondo generado con IA (public/personaje/thumbs/fondo_N.jpg) + texto con la tipografía del canal.
const stroke = (px: number, c = '#0E1226') => ({WebkitTextStroke: `${px}px ${c}`, paintOrder: 'stroke fill' as const});
const Shade: React.FC<{side: string}> = ({side}) => {
  const g: Record<string, string> = {
    left: 'linear-gradient(90deg, rgba(8,11,24,0.8) 0%, rgba(8,11,24,0.4) 38%, transparent 60%)',
    right: 'linear-gradient(270deg, rgba(8,11,24,0.8) 0%, rgba(8,11,24,0.4) 38%, transparent 60%)',
    top: 'linear-gradient(180deg, rgba(8,11,24,0.8) 0%, rgba(8,11,24,0.35) 32%, transparent 52%)',
    'top-left': 'radial-gradient(ellipse at 0% 0%, rgba(8,11,24,0.85) 0%, rgba(8,11,24,0.35) 40%, transparent 65%)',
    'top-right': 'radial-gradient(ellipse at 100% 0%, rgba(8,11,24,0.85) 0%, rgba(8,11,24,0.35) 40%, transparent 65%)',
    'top-left-light': 'radial-gradient(ellipse at 0% 0%, rgba(245,239,230,0.9) 0%, rgba(245,239,230,0.4) 40%, transparent 65%)',
  };
  return <AbsoluteFill style={{background: g[side]}} />;
};
const big = (extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', fontFamily: SANS, fontWeight: 900, lineHeight: 0.98, color: L.white, letterSpacing: -3, textShadow: '0 10px 30px rgba(0,0,0,0.7)', ...stroke(6), ...extra});

const T1 = () => (
  <>
    <Shade side="left" />
    <div style={big({left: 60, top: 170, width: 520, fontSize: 150})}>
      NO ERES <span style={{color: L.gold}}>TÚ</span>
    </div>
  </>
);
const T2 = () => (
  <>
    <Shade side="left" />
    <div style={big({left: 60, top: 200, width: 560, fontSize: 132})}>
      <span style={{color: L.greenL}}>NADIE</span> TE MIRA
    </div>
  </>
);
const T3 = () => (
  <>
    <Shade side="top-right" />
    <div style={big({right: 50, top: 50, width: 640, textAlign: 'right', fontSize: 104})}>
      ¿POR QUÉ DIJE <span style={{color: L.red}}>ESO</span>?
    </div>
  </>
);
const T4 = () => (
  <>
    <Shade side="top-left-light" />
    <div style={big({left: 50, top: 50, width: 600, fontSize: 112, color: '#141B33', ...stroke(5, '#F5EFE6'), textShadow: '0 6px 20px rgba(255,255,255,0.6)'})}>
      <span style={{color: L.red}}>NO</span> LO PIENSES
    </div>
  </>
);
const T5 = () => (
  <>
    <Shade side="top" />
    <div style={big({left: 0, right: 0, top: 36, textAlign: 'center', fontSize: 112})}>
      LES CAES <span style={{color: L.greenL}}>MEJOR</span>
    </div>
  </>
);

const DESIGNS = [T1, T2, T3, T4, T5];
export const Thumb: React.FC<{n: number}> = ({n}) => {
  const D = DESIGNS[n - 1];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile(`personaje/thumbs/fondo_${n}.jpg`)} style={{width: 1280, height: 720, objectFit: 'cover'}} />
      <D />
    </AbsoluteFill>
  );
};
export const SERIF_ = SERIF;
