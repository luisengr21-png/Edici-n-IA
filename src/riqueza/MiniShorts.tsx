// Miniaturas diseñadas de los shorts de «La riqueza de otros» (1080×1920).
// Estilo del video: azul marino, dorado y rojo vivo, tipografía Anton, recursos del creador, emojis y el personaje «Tú».
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {renderEl} from '../burnout/elements';
import {C} from './Riqueza';

const ANTON = 'Anton, Impact, sans-serif';
const EMOJI = '"Noto Color Emoji", sans-serif';

const Fondo: React.FC<{tint?: string}> = ({tint}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 45%, ${tint ?? C.navy2} 0%, ${C.navy} 55%, ${C.deep} 100%)`}}>
    {Array.from({length: 40}).map((_, k) => {
      const x = (Math.sin(k * 12.9898) * 43758.5453) % 1;
      const y = (Math.sin(k * 78.233) * 12345.678) % 1;
      return <div key={k} style={{position: 'absolute', left: Math.abs(x) * 1080, top: Math.abs(y) * 1920, width: 6, height: 6, borderRadius: 3, background: 'rgba(245,183,0,0.5)'}} />;
    })}
  </AbsoluteFill>
);

// Texto grande en Anton: blanco con contorno oscuro; la parte entre *asteriscos* va en color.
const Titulo: React.FC<{text: string; y: number; size: number; acc?: string; rot?: number; card?: boolean}> = ({text, y, size, acc = C.gold, rot = 0, card}) => {
  const parts = text.split('*');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `rotate(${rot}deg)`}}>
      <div style={{textAlign: 'center', whiteSpace: 'pre-line', fontFamily: ANTON, fontSize: size, lineHeight: 1.02, color: C.white, letterSpacing: 2,
        ...(card ? {background: 'rgba(11,26,58,0.95)', border: `8px solid ${acc}`, borderRadius: 34, padding: '14px 46px', boxShadow: '0 24px 60px rgba(0,0,0,0.6)'} :
          {WebkitTextStroke: `${Math.round(size * 0.08)}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: '0 14px 30px rgba(0,0,0,0.8)'})}}>
        {parts.map((p, i) => <span key={i} style={i % 2 ? {color: acc, textShadow: `0 0 40px ${acc}88, 0 14px 30px rgba(0,0,0,0.8)`} : undefined}>{p}</span>)}
      </div>
    </div>
  );
};

export const Emo: React.FC<{e: string; x: number; y: number; size: number; rot?: number; glow?: string}> = ({e, x, y, size, rot = 0, glow}) => (
  <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, fontFamily: EMOJI, fontSize: size, lineHeight: 1, whiteSpace: 'nowrap',
    filter: `${glow ? `drop-shadow(0 0 40px ${glow}) ` : ''}drop-shadow(0 20px 30px rgba(0,0,0,0.6))`}}>{e}</div>
);

export const Tarjeta: React.FC<{src: string; x: number; y: number; w: number; h: number; rot?: number; border?: string; filter?: string; fit?: 'cover' | 'contain'}> = ({src, x, y, w, h, rot = 0, border = C.gold, filter, fit = 'cover'}) => (
  <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, borderRadius: 34, overflow: 'hidden', border: `10px solid ${border}`, boxShadow: `0 0 70px ${border}66, 0 40px 80px rgba(0,0,0,0.7)`, background: '#fff'}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: fit, filter}} />
  </div>
);

export const Tu: React.FC<{x: number; y: number; s: number; pose: string; mood?: string; hold?: string; holdSize?: number; flip?: boolean}> = (p) => (
  <>{renderEl({k: 'person', at: -1, anim: 'none', ...p}, 2, 0)}</>
);

// Short 1 · «En 1983 esto costaba casi 4,000 dólares (y hoy lo tienes tú)»
const Mini1: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fondo />
    <Titulo text={'SOLO PARA\n*MILLONARIOS*'} y={120} size={190} />
    <div style={{position: 'absolute', left: 540, top: 1010, width: 760, height: 760, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,183,0,0.55) 0%, rgba(245,183,0,0) 65%)'}} />
    <Tarjeta src="riqueza/fotos/foto_003.jpg" x={560} y={1010} w={520} h={760} rot={-6} />
    <Emo e="🏷️" x={860} y={760} size={230} rot={18} glow="rgba(255,26,26,0.6)" />
    <Titulo text="*1983*" y={1420} size={150} card acc={C.red} rot={-4} />
    <Tu x={210} y={1640} s={1.15} pose="shrug" mood="worried" />
    <Emo e="📱" x={880} y={1700} size={200} rot={10} glow="rgba(245,183,0,0.7)" />
  </AbsoluteFill>
);

// Short 2 · «Regaló 2,500 bibliotecas… pero en su fábrica hubo balazos»
const Mini2: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden', background: C.deep}}>
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 960, overflow: 'hidden'}}>
      <Img src={staticFile('riqueza/thumbs/biblioteca.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.85) saturate(1.2)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(245,183,0,0.15), rgba(11,26,58,0.35))'}} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 960, width: 1080, height: 960, overflow: 'hidden'}}>
      <Img src={staticFile('riqueza/fotos/foto_114.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(1) contrast(1.2) brightness(0.7)'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(255,26,26,0.35), rgba(80,0,0,0.55))'}} />
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 952, height: 16, background: `linear-gradient(90deg, ${C.gold}, ${C.red})`}} />
    <Emo e="😇" x={300} y={470} size={280} glow="rgba(255,217,90,0.9)" />
    <Emo e="📚" x={790} y={560} size={230} rot={8} glow="rgba(255,217,90,0.6)" />
    <Emo e="🧔" x={540} y={960} size={330} glow="rgba(255,255,255,0.5)" />
    <Emo e="💂💂💂" x={540} y={1460} size={150} glow="rgba(255,26,26,0.8)" />
    <Titulo text="*¿HÉROE*" y={110} size={200} />
    <Titulo text="*O VILLANO?*" y={1610} size={200} acc={C.red} />
  </AbsoluteFill>
);

// Short 3 · «Ford duplicó sueldos… y le dijeron que iba a quebrar»
const Mini3: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fondo />
    <Titulo text={'SUELDO\n*X2*'} y={90} size={250} />
    <Tarjeta src="riqueza/fotos/foto_178.jpg" x={540} y={960} w={900} h={600} rot={-3} />
    <Emo e="🪙" x={150} y={660} size={190} rot={-15} glow="rgba(245,183,0,0.8)" />
    <Emo e="🪙" x={940} y={1250} size={190} rot={15} glow="rgba(245,183,0,0.8)" />
    <Titulo text="*¿LOCURA?*" y={1300} size={170} card acc={C.red} rot={3} />
    <Tu x={830} y={1730} s={1.05} pose="shrug" mood="worried" flip />
    <Emo e="📉" x={250} y={1720} size={200} rot={-8} glow="rgba(255,26,26,0.6)" />
  </AbsoluteFill>
);

export const MiniShort: React.FC<{n: number}> = ({n}) => (n === 1 ? <Mini1 /> : n === 2 ? <Mini2 /> : <Mini3 />);
