import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Caption} from '../lib/Caption';
import {City, HORIZON} from '../lib/City';
import {mix} from '../lib/color';
import {easeInOut, easeOut, lerp, prog} from '../lib/math';

// Escena 8 — «Volver entero»: la hora dorada de Malick con la limpieza de un anuncio de Apple.
export const Scene8: React.FC = () => {
  const f = useCurrentFrame();
  const born = easeOut(prog(f, 12, 40));
  const p = easeInOut(prog(f, 14, 150));
  const sunY = lerp(HORIZON, HORIZON - 170, easeInOut(prog(f, 14, 200)));
  const sunR = lerp(3, 78, easeOut(prog(f, 12, 120)));
  const pull = lerp(1.2, 1.0, easeInOut(prog(f, 0, 200)));
  const top = mix('#05070f', '#93bcdf', p);
  const mid = mix('#0b0a1c', '#ffd8a6', p);
  const low = mix('#120c1a', '#ffae66', p);
  const hor = mix('#1a1020', '#ffe8b8', p);
  const rot = f * 0.06;
  const sunPct = (sunY / 1080) * 100;

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill style={{transform: `scale(${pull})`, transformOrigin: `50% ${sunPct}%`}}>
        <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${mid} 48%, ${low} 64%, ${hor} 72%, ${low} 100%)`}} />
        {/* rayos crepusculares */}
        <AbsoluteFill
          style={{
            background: `repeating-conic-gradient(from ${rot}deg at 50% ${sunPct}%, rgba(255,236,190,0.22) 0deg 3.5deg, rgba(255,236,190,0) 3.5deg 10deg)`,
            WebkitMaskImage: `radial-gradient(circle at 50% ${sunPct}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 62%)`,
            maskImage: `radial-gradient(circle at 50% ${sunPct}%, rgba(0,0,0,1) 0%, rgba(0,0,0,0.4) 30%, rgba(0,0,0,0) 62%)`,
            mixBlendMode: 'screen',
            opacity: p,
          }}
        />
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
          <defs>
            <radialGradient id="s8sun">
              <stop offset="0" stopColor="#fffdf2" />
              <stop offset="0.55" stopColor="#fff2c8" />
              <stop offset="1" stopColor="#ffd890" />
            </radialGradient>
            <radialGradient id="s8bloom">
              <stop offset="0" stopColor="#fff2cc" stopOpacity="0.85" />
              <stop offset="0.3" stopColor="#ffd08a" stopOpacity="0.35" />
              <stop offset="1" stopColor="#ff9a50" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx={960} cy={sunY} r={sunR * 7} fill="url(#s8bloom)" opacity={born} />
          <circle cx={960} cy={sunY} r={sunR} fill="url(#s8sun)" opacity={born} />
          <City
            f={f}
            mode="dawn"
            travel={-0.6}
            blurFar={2.6}
            palette={{
              layers: [mix('#120c1a', '#c79a92', p), mix('#0a0710', '#6a4560', p), mix('#050308', '#2c1d2e', p)],
              window: '#ffd58a',
              rim: mix('#000000', '#ffb870', p),
            }}
          />
          {/* destellos de lente */}
          {[0.35, 0.62, 0.85].map((k, i) => (
            <circle key={i} cx={lerp(960, 1500, k)} cy={lerp(sunY, 980, k)} r={[26, 14, 40][i]} fill="#fff0d0" opacity={0.08 * p} />
          ))}
        </svg>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(20,10,20,0) 70%, rgba(20,10,22,0.6) 100%)', opacity: easeOut(prog(f, 50, 80))}} />
      <Caption text={'Dormir no es rendirse.\nEs regresar completo.'} from={60} to={198} y={930} size={62} color="#fff6e8" glow="rgba(255,190,120,0.55)" />
    </AbsoluteFill>
  );
};
