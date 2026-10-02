import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Caption} from '../lib/Caption';
import {City, HORIZON} from '../lib/City';
import {mix} from '../lib/color';
import {clamp, easeOut, prog, TAU} from '../lib/math';
import {rng} from '../lib/random';

// Escena 2 — «La ciudad que se apaga»: Hopper + Wong Kar-wai, ventanas que se rinden a la noche.
const r = rng(31);
const STARS = Array.from({length: 140}, () => ({
  x: r() * 2100,
  y: r() * 560,
  s: 0.5 + r() * 1.3,
  t: r(),
  ph: r() * TAU,
}));

export const Scene2: React.FC = () => {
  const f = useCurrentFrame();
  const dusk = prog(f, 0, 230); // la luz se va muriendo
  const top = mix('#141a44', '#060818', dusk);
  const mid = mix('#3b2a6e', '#16123a', dusk);
  const low = mix('#8a4a86', '#3a2050', dusk);
  const amber = mix('#ffb070', '#c0603e', dusk);
  const bandOffset = 0.62 + dusk * 0.08;
  const starsOn = easeOut(prog(f, 40, 200));
  const pan = -f * 0.08;

  return (
    <AbsoluteFill>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="s2sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={top} />
            <stop offset="0.38" stopColor={mid} />
            <stop offset={bandOffset - 0.08} stopColor={low} />
            <stop offset={bandOffset} stopColor={amber} />
            <stop offset="1" stopColor={mix(amber, '#2a1430', 0.5)} />
          </linearGradient>
          <radialGradient id="s2sun" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#ffd9a0" stopOpacity="0.65" />
            <stop offset="1" stopColor="#ff8a50" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#s2sky)" />
        {/* resplandor del sol ya escondido: continúa la línea de horizonte de la escena 1 */}
        <ellipse cx={960} cy={HORIZON} rx={1300} ry={150 * (1 - dusk * 0.6)} fill="url(#s2sun)" />
        <g transform={`translate(${pan} 0)`}>
          {STARS.map((s, i) => {
            const on = clamp((starsOn - s.t) * 6);
            const tw = 0.6 + 0.4 * Math.sin(f * 0.08 + s.ph);
            return <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#f2ecff" opacity={on * tw * 0.8} />;
          })}
          {/* luna creciente, finísima */}
          <g transform="translate(1460 190)" opacity={0.25 + starsOn * 0.7}>
            <circle r={34} fill="#fff4dc" />
            <circle r={32} cx={-12} cy={-6} fill={mix(top, mid, 0.35)} />
          </g>
        </g>
        <City
          f={f}
          mode="dusk"
          palette={{layers: [mix('#4a3570', '#2a1f4c', dusk), '#1b1435', '#0b0816'], window: '#ffc777'}}
        />
      </svg>
      <Caption
        text={'¿Y si fuera ahí, en la oscuridad,\ndonde se decide quiénes somos?'}
        from={34}
        to={226}
        y={250}
        size={60}
      />
    </AbsoluteFill>
  );
};
