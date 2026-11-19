import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {L, SANS, TITLE} from './kit';

// Miniaturas: fondo generado con IA (public/burnout/thumbs/fondo_N.jpg) + texto con las tipografías del canal
// (Rhino Rough de Envato para los títulos; Montserrat Black cuando el texto lleva ¿ o Ñ, que Rhino Rough no resuelve bien).
const stroke = (px: number, c = '#11141C') => ({WebkitTextStroke: `${px}px ${c}`, paintOrder: 'stroke fill' as const});
const Shade: React.FC<{side: string}> = ({side}) => {
  const g: Record<string, string> = {
    left: 'linear-gradient(90deg, rgba(10,12,20,0.72) 0%, rgba(10,12,20,0.32) 36%, transparent 58%)',
    'top-left': 'radial-gradient(ellipse at 0% 0%, rgba(10,12,20,0.75) 0%, rgba(10,12,20,0.3) 40%, transparent 65%)',
    'top-right': 'radial-gradient(ellipse at 100% 0%, rgba(10,12,20,0.75) 0%, rgba(10,12,20,0.3) 40%, transparent 65%)',
  };
  return <AbsoluteFill style={{background: g[side]}} />;
};
const big = (extra: React.CSSProperties = {}): React.CSSProperties => ({position: 'absolute', fontFamily: TITLE, lineHeight: 0.95, color: L.white, letterSpacing: 1, textShadow: '0 10px 30px rgba(0,0,0,0.7)', ...stroke(7), ...extra});

const T1 = () => (
  <>
    <Shade side="left" />
    <div style={big({left: 56, top: 150, width: 560, fontSize: 150})}>
      NO ES{' '}
      <span style={{color: L.red, position: 'relative', display: 'inline-block'}}>
        PEREZA
        <span style={{position: 'absolute', left: '-4%', top: '44%', width: '108%', height: 22, background: L.yellow, borderRadius: 10, transform: 'rotate(-5deg)', boxShadow: '0 4px 12px rgba(0,0,0,0.5)'}} />
      </span>
    </div>
    <svg style={{position: 'absolute', left: 640, top: 330, overflow: 'visible'}} width={420} height={160} viewBox="0 0 420 160">
      <path d="M0 150 C120 40 260 30 380 110" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M338 92 L384 112 L352 150" stroke="#fff" strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </>
);
const T2 = () => (
  <>
    <Shade side="left" />
    <div style={big({left: 60, top: 180, width: 520, fontSize: 190})}>
      AL<br />
      <span style={{color: L.red, filter: `drop-shadow(0 0 30px ${L.red})`}}>3 %</span>
    </div>
  </>
);
const T3 = () => (
  <>
    <Shade side="left" />
    <div style={big({left: 60, top: 200, width: 600, fontSize: 116})}>
      TE<br />
      <span style={{color: L.gold}}>QUEMASTE</span>
    </div>
  </>
);
const T4 = () => (
  <>
    <Shade side="top-left" />
    <div style={big({left: 44, top: 36, width: 560, fontSize: 92, fontFamily: SANS, fontWeight: 900, letterSpacing: -3, ...stroke(6)})}>
      ¿FLOJO O <span style={{color: L.gold}}>QUEMADO</span>?
    </div>
  </>
);
const T5 = () => (
  <>
    <Shade side="top-right" />
    <div style={big({right: 50, top: 40, width: 640, textAlign: 'right', fontSize: 100, fontFamily: SANS, fontWeight: 900, letterSpacing: -3, ...stroke(6)})}>
      ¿EN QUÉ <span style={{color: L.yellow}}>ETAPA</span> ESTÁS?
    </div>
  </>
);

const DESIGNS = [T1, T2, T3, T4, T5];
export const Thumb: React.FC<{n: number}> = ({n}) => {
  const D = DESIGNS[n - 1];
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <Img src={staticFile(`burnout/thumbs/fondo_${n}.jpg`)} style={{width: 1280, height: 720, objectFit: 'cover'}} />
      <D />
    </AbsoluteFill>
  );
};
