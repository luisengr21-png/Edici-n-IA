// 10 miniaturas del video largo de «La riqueza de otros» (1280×720), hechas con código y sin gastar créditos.
// Mismo estilo que las de los shorts: azul marino, dorado y rojo vivo, Anton, recursos del video, emojis y «Tú».
// Objeto a la izquierda, texto en el espacio libre de la derecha; la esquina inferior derecha queda libre (duración del video).
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from './Riqueza';
import {Emo, Tarjeta, Tu} from './MiniShorts';

const ANTON = 'Anton, Impact, sans-serif';

const Fondo: React.FC = () => (
  <AbsoluteFill style={{background: `radial-gradient(ellipse at 28% 50%, ${C.navy2} 0%, ${C.navy} 50%, ${C.deep} 100%)`}}>
    {Array.from({length: 30}).map((_, k) => {
      const x = Math.abs((Math.sin(k * 12.9898) * 43758.5453) % 1);
      const y = Math.abs((Math.sin(k * 78.233) * 12345.678) % 1);
      return <div key={k} style={{position: 'absolute', left: x * 1280, top: y * 720, width: 4, height: 4, borderRadius: 2, background: 'rgba(245,183,0,0.5)'}} />;
    })}
  </AbsoluteFill>
);

const Glow: React.FC<{x: number; y: number; r: number; c?: string}> = ({x, y, r, c = 'rgba(245,183,0,0.5)'}) => (
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0%, rgba(0,0,0,0) 68%)`}} />
);

// Texto del lado derecho; la parte entre *asteriscos* va en color de acento.
const Texto: React.FC<{text: string; size?: number; acc?: string; y?: number}> = ({text, size = 128, acc = C.gold, y = 330}) => {
  const parts = text.split('*');
  return (
    <div style={{position: 'absolute', left: 650, width: 600, top: y, transform: 'translateY(-50%)', display: 'flex', justifyContent: 'center'}}>
      <div style={{textAlign: 'center', whiteSpace: 'pre-line', fontFamily: ANTON, fontSize: size, lineHeight: 1.02, color: C.white, letterSpacing: 1,
        WebkitTextStroke: `${Math.round(size * 0.07)}px ${C.ink}`, paintOrder: 'stroke fill', textShadow: '0 10px 24px rgba(0,0,0,0.8)'}}>
        {parts.map((p, i) => <span key={i} style={i % 2 ? {color: acc, textShadow: `0 0 34px ${acc}99, 0 10px 24px rgba(0,0,0,0.8)`} : undefined}>{p}</span>)}
      </div>
    </div>
  );
};

// Moneda de oro partida: una mitad brillante y otra oxidada
const MonedaPartida: React.FC = () => (
  <svg width={560} height={560} viewBox="-280 -280 560 560" style={{position: 'absolute', left: 50, top: 80, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))'}}>
    <defs>
      <radialGradient id="oro" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#FFF1A8" /><stop offset="0.45" stopColor="#F5B700" /><stop offset="1" stopColor="#9A6A00" /></radialGradient>
      <radialGradient id="oxido" cx="0.6" cy="0.4" r="0.8"><stop offset="0" stopColor="#8a5a3a" /><stop offset="0.6" stopColor="#5a3522" /><stop offset="1" stopColor="#2c1a10" /></radialGradient>
    </defs>
    <g transform="translate(-26,0) rotate(-6)">
      <path d="M0 -220 A220 220 0 0 0 0 220 L18 120 L-14 40 L22 -40 L-10 -130 Z" fill="url(#oro)" stroke="#FFE27A" strokeWidth={6} />
      <path d="M-30 -150 A150 150 0 0 0 -30 150" fill="none" stroke="#B88400" strokeWidth={8} />
      <text x={-120} y={36} fontFamily={ANTON} fontSize={120} fill="#B88400">$</text>
    </g>
    <g transform="translate(34,14) rotate(8)">
      <path d="M0 -220 A220 220 0 0 1 0 220 L18 120 L-14 40 L22 -40 L-10 -130 Z" fill="url(#oxido)" stroke="#3a2416" strokeWidth={6} />
      <path d="M80 -120 L120 -40 L90 30 M60 90 L120 140" stroke="#1d110a" strokeWidth={7} fill="none" />
      <circle cx={130} cy={-140} r={16} fill="#3b6b4a" opacity={0.7} /><circle cx={60} cy={170} r={22} fill="#3b6b4a" opacity={0.6} />
    </g>
  </svg>
);

const Pastel: React.FC = () => {
  const parts = [0.72, 0.07, 0.07, 0.07, 0.07];
  let a0 = -Math.PI / 2;
  return (
    <svg width={560} height={560} viewBox="-280 -280 560 560" style={{position: 'absolute', left: 50, top: 80, filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.6))'}}>
      {parts.map((f, i) => {
        const a1 = a0 + f * Math.PI * 2; const mid = (a0 + a1) / 2; const off = i === 0 ? 34 : 6;
        const dx = Math.cos(mid) * off, dy = Math.sin(mid) * off;
        const d = `M${dx} ${dy} L${dx + 220 * Math.cos(a0)} ${dy + 220 * Math.sin(a0)} A220 220 0 ${f > 0.5 ? 1 : 0} 1 ${dx + 220 * Math.cos(a1)} ${dy + 220 * Math.sin(a1)} Z`;
        a0 = a1;
        return <path key={i} d={d} fill={i === 0 ? C.red : ['#F5B700', '#FFD95A', '#E0A526', '#FFC93C'][i - 1]} stroke={C.navy} strokeWidth={6} />;
      })}
    </svg>
  );
};

const Casco: React.FC<{x: number; y: number; w: number}> = ({x, y, w}) => (
  <svg width={w} height={w * 0.6} viewBox="-100 -60 200 120" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.3, transform: 'rotate(-8deg)', filter: 'drop-shadow(0 12px 16px rgba(0,0,0,0.5))'}}>
    <path d="M-80 30 Q-78 -50 0 -54 Q78 -50 80 30 Z" fill="#FFC21A" stroke="#C78A00" strokeWidth={5} />
    <rect x={-98} y={24} width={196} height={18} rx={9} fill="#FFB000" stroke="#C78A00" strokeWidth={4} />
    <rect x={-10} y={-54} width={20} height={80} rx={8} fill="#FFD95A" />
  </svg>
);

const M: Record<number, React.FC> = {
  1: () => (<><Glow x={330} y={380} r={300} /><Emo e="⚖️" x={330} y={390} size={400} glow="rgba(245,183,0,0.6)" /><Emo e="💵" x={170} y={250} size={140} rot={-10} /><Emo e="👷" x={495} y={240} size={140} rot={8} /><Texto text={'¿QUIÉN\nPESA *MÁS*?'} /></>),
  2: () => (<><Glow x={330} y={360} r={320} /><Tarjeta src="riqueza/fotos/foto_003.jpg" x={320} y={370} w={330} h={480} rot={-7} /><Emo e="🏷️" x={510} y={170} size={160} rot={20} glow="rgba(255,26,26,0.6)" /><Texto text={'SOLO PARA\n*MILLONARIOS*'} size={118} /></>),
  3: () => (<><Glow x={330} y={360} r={320} /><MonedaPartida /><Texto text={'¿CUÁL\n*AYUDA*?'} size={150} /></>),
  4: () => (<><Glow x={330} y={400} r={300} /><Emo e="🐷" x={330} y={430} size={360} glow="rgba(255,150,180,0.5)" /><Casco x={330} y={225} w={260} /><Emo e="🪙" x={120} y={560} size={110} rot={-15} /><Emo e="🪙" x={560} y={590} size={90} rot={20} /><Texto text={'¿QUIÉN LA\n*LLENA*?'} /></>),
  5: () => (<><Glow x={330} y={360} r={320} c="rgba(255,26,26,0.35)" /><Pastel /><Texto text={'UNOS\n*POCOS*'} size={150} acc={C.red} /></>),
  6: () => (<><Tarjeta src="riqueza/thumbs/ajedrez.jpg" x={320} y={380} w={560} h={420} rot={-4} /><Emo e="👑" x={470} y={150} size={160} rot={14} glow="rgba(245,183,0,0.8)" /><Texto text={'¿SABES\n*JUGAR*?'} size={140} /></>),
  7: () => (<><Glow x={330} y={360} r={320} /><Tu x={210} y={470} s={1.05} pose="reach" mood="happy" hold="🔑" holdSize={150} /><Emo e="🔒" x={560} y={250} size={170} glow="rgba(245,183,0,0.7)" /><Texto text={'¿LA\n*CLAVE*?'} size={150} /></>),
  8: () => (<><Glow x={330} y={360} r={320} /><Emo e="⚙️" x={250} y={320} size={330} glow="rgba(245,183,0,0.6)" /><Emo e="⚙️" x={480} y={500} size={220} rot={20} glow="rgba(245,183,0,0.6)" /><Emo e="🧤" x={490} y={200} size={170} rot={-20} /><Texto text={'SIN ELLOS\n*NADA*'} acc={C.red} /></>),
  9: () => (<><Glow x={330} y={300} r={300} /><Emo e="🏢" x={330} y={250} size={300} glow="rgba(245,183,0,0.8)" /><Emo e="🙌🙌🙌" x={330} y={530} size={130} /><Texto text={'DESDE\n*ABAJO*'} size={150} /></>),
  10: () => (<><Glow x={330} y={330} r={320} c="rgba(255,120,30,0.45)" /><Emo e="🚀" x={330} y={330} size={330} rot={-10} glow="rgba(255,120,30,0.8)" /><Emo e="💵" x={150} y={520} size={140} rot={-25} /><Emo e="💵" x={520} y={170} size={120} rot={25} /><Emo e="🪙" x={520} y={560} size={110} /><Texto text={'TE HACE\n*MÁS RICO*'} /></>),
};

export const MiniLargo: React.FC<{n: number}> = ({n}) => {
  const Body = M[n];
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Fondo />
      <Body />
    </AbsoluteFill>
  );
};
