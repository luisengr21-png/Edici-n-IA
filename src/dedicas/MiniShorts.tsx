// Miniaturas diseñadas de los shorts de «¿A qué te dedicas?» (1080×1920).
// Estilo del video: fondos de su paleta (magenta, terracota, petróleo), acentos ámbar #FFB547 y rojo #FF2E2E,
// tipografía Anton, recursos del creador, emojis de color y el personaje «Tú».
import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Emo, Tu} from '../riqueza/MiniShorts';

const ANTON = 'Anton, Impact, sans-serif';
const AMBER = '#FFB547';
const RED = '#FF2E2E';
const INK = '#14121c';

// Fondo con degradado radial y semitono (puntos), como los fondos del video.
const Fondo: React.FC<{c1: string; c2: string; c3: string; dots?: string}> = ({c1, c2, c3, dots = 'rgba(255,255,255,0.10)'}) => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 50% 42%, ${c2} 0%, ${c1} 62%, ${c3} 100%)`}}>
    <AbsoluteFill style={{backgroundImage: `radial-gradient(${dots} 3px, transparent 3.5px)`, backgroundSize: '34px 34px', maskImage: 'linear-gradient(180deg, black 0%, transparent 45%, transparent 70%, black 100%)', WebkitMaskImage: 'linear-gradient(180deg, black 0%, transparent 45%, transparent 70%, black 100%)'}} />
  </AbsoluteFill>
);

// Texto grande en Anton: blanco con contorno oscuro; la parte entre *asteriscos* va en color.
const Titulo: React.FC<{text: string; y: number; size: number; acc?: string; rot?: number; card?: string}> = ({text, y, size, acc = AMBER, rot = 0, card}) => {
  const parts = text.split('*');
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `rotate(${rot}deg)`}}>
      <div style={{textAlign: 'center', whiteSpace: 'pre-line', fontFamily: ANTON, fontSize: size, lineHeight: 1.02, color: '#fff', letterSpacing: 2,
        ...(card ? {background: card, borderRadius: 30, padding: '12px 44px', boxShadow: '0 24px 60px rgba(0,0,0,0.55)'} :
          {WebkitTextStroke: `${Math.round(size * 0.08)}px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 14px 30px rgba(0,0,0,0.75)'})}}>
        {parts.map((p, i) => <span key={i} style={i % 2 ? {color: acc, textShadow: card ? undefined : `0 0 40px ${acc}88, 0 14px 30px rgba(0,0,0,0.75)`} : undefined}>{p}</span>)}
      </div>
    </div>
  );
};

// Foto o cuadro de un clip con forma (círculo, blob o rectángulo redondeado) y marco de color.
const Recorte: React.FC<{src: string; x: number; y: number; w: number; h: number; shape: 'circle' | 'blob' | 'round'; rot?: number; border?: string; filter?: string}> = ({src, x, y, w, h, shape, rot = 0, border = AMBER, filter}) => {
  const radius = shape === 'circle' ? '50%' : shape === 'blob' ? '58% 42% 55% 45% / 45% 55% 45% 55%' : 40;
  return (
    <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `rotate(${rot}deg)`, borderRadius: radius, overflow: 'hidden', border: `12px solid ${border}`, boxShadow: `0 0 80px ${border}77, 0 40px 80px rgba(0,0,0,0.6)`}}>
      <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', filter}} />
    </div>
  );
};

// Short 1 · «¿A qué te dedicas?» y por qué te pone tan nervioso → «3 SEGUNDOS PARA JUZGARTE»
const Mini1: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fondo c1="#6A1650" c2="#A0157F" c3="#3a0b2c" />
    <Titulo text="*3 SEGUNDOS*" y={120} size={200} />
    <Titulo text="PARA JUZGARTE" y={400} size={120} card={RED} rot={-3} />
    <Recorte src="dedicas/thumbs/escena_002.jpg" x={560} y={930} w={760} h={760} shape="circle" />
    <Emo e="⏱️" x={850} y={700} size={260} rot={14} glow="rgba(255,181,71,0.85)" />
    <Emo e="👀" x={230} y={1240} size={170} rot={-10} glow="rgba(255,46,46,0.6)" />
    <Tu x={540} y={1700} s={1.35} pose="scratch" mood="worried" {...({sweat: true} as any)} />
  </AbsoluteFill>
);

// Short 2 · Lo que de verdad compra alguien con un Ferrari → «NO ES EL AUTO»
const Mini2: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fondo c1="#7A2E1B" c2="#A8442A" c3="#3d1408" dots="rgba(255,190,11,0.14)" />
    <Titulo text={'NO ES\n*EL AUTO*'} y={90} size={230} />
    <Recorte src="dedicas/thumbs/escena_029.jpg" x={540} y={1060} w={940} h={600} shape="round" rot={-4} filter="saturate(1.25) contrast(1.05)" />
    <div style={{position: 'absolute', left: 120, right: 120, top: 1040, height: 40, background: RED, transform: 'rotate(-13deg)', borderRadius: 20, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}} />
    <Emo e="❤️" x={820} y={1480} size={300} rot={10} glow="rgba(255,46,46,0.9)" />
    <Tu x={260} y={1700} s={1.2} pose="shrug" mood="happy" />
  </AbsoluteFill>
);

// Short 3 · meritocracia: la trampa que te hace sentir culpable → «¿PERDEDOR O SIN SUERTE?»
const Mini3: React.FC = () => (
  <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fondo c1="#0B525B" c2="#14706B" c3="#05292e" dots="rgba(122,231,199,0.16)" />
    <Titulo text="¿PERDEDOR..." y={100} size={190} acc={RED} />
    <Recorte src="dedicas/fotos/foto_072.jpg" x={540} y={790} w={780} h={780} shape="blob" rot={3} />
    <Emo e="🎲" x={190} y={560} size={210} rot={-18} glow="rgba(255,181,71,0.8)" />
    <Emo e="🍀" x={900} y={1100} size={190} rot={14} glow="rgba(122,231,199,0.8)" />
    <Titulo text="...O SIN *SUERTE*?" y={1230} size={160} />
    <Tu x={540} y={1790} s={1.15} pose="shrug" mood="worried" />
  </AbsoluteFill>
);

export const DedicasMiniShort: React.FC<{n: number}> = ({n}) => (n === 1 ? <Mini1 /> : n === 2 ? <Mini2 /> : <Mini3 />);
