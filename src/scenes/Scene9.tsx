import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {mix} from '../lib/color';
import {SERIF} from '../lib/fonts';
import {easeInOut, easeOut, lerp, prog} from '../lib/math';

// Escena 9 — Créditos: simetría absoluta a lo Wes Anderson; del día a la noche, y al negro.
export const Scene9: React.FC = () => {
  const f = useCurrentFrame();
  const night = easeInOut(prog(f, 50, 115));
  const bg = mix('#f4ecdc', '#0b1532', night);
  const ink = mix('#2a2030', '#f4ecdc', night);
  const title = easeOut(prog(f, 22, 60));
  const track = lerp(0.62, 0.34, easeOut(prog(f, 22, 90)));
  const sub = easeOut(prog(f, 48, 80));
  const line = easeInOut(prog(f, 30, 85));
  const black = prog(f, 120, 140);

  return (
    <AbsoluteFill style={{background: bg}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
        <line x1={960 - 520 * line} y1={600} x2={960 + 520 * line} y2={600} stroke={ink} strokeWidth={1} opacity={0.5} />
        <g opacity={line}>
          <circle cx={960 - 600} cy={600} r={16} fill="#e9a94a" />
          <g transform={`translate(${960 + 600} 600)`}>
            <circle r={16} fill={mix('#c9cfdc', '#f4ecdc', night)} />
            <circle r={15} cx={-7} cy={-4} fill={bg} />
          </g>
        </g>
      </svg>
      <div
        style={{
          position: 'absolute',
          top: 470,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: SERIF,
          fontWeight: 500,
          fontSize: 84,
          letterSpacing: `${track}em`,
          paddingLeft: `${track}em`,
          color: ink,
          opacity: title,
          filter: title < 1 ? `blur(${(1 - title) * 12}px)` : undefined,
        }}
      >
        LO QUE LA NOCHE SABE
      </div>
      <div
        style={{
          position: 'absolute',
          top: 640,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 44,
          color: ink,
          opacity: sub * 0.9,
          transform: `translateY(${(1 - sub) * 12}px)`,
        }}
      >
        Duerme. El mundo puede esperar.
      </div>
      <AbsoluteFill style={{background: '#000', opacity: black}} />
    </AbsoluteFill>
  );
};
