import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import tl from '../timeline.json';
import {Caption} from '../lib/Caption';
import {HORIZON} from '../lib/City';
import {mix} from '../lib/color';
import {easeInOut, easeOut, heartbeat, lerp, prog, TAU} from '../lib/math';
import {rng} from '../lib/random';

// Escena 1 — «El tercio invisible»: un punto de luz que respira en el vacío.
const r = rng(11);
const DUST = Array.from({length: 170}, () => ({
  x: r() * 1920,
  y: r() * 1080,
  s: 0.4 + r() * 1.7,
  a: 0.12 + r() * 0.55,
  ph: r() * TAU,
  vx: (r() - 0.5) * 0.18,
  vy: -0.05 - r() * 0.12,
  z: 1 + r() * 2.5,
}));

export const Scene1: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / tl.fps;
  const hb = tl.events.heartbeat;
  const beat = heartbeat(t, hb.first, hb.period, hb.until);
  const appear = easeOut(prog(f, 0, 50));
  const push = lerp(1, 1.12, f / 180);
  const stretch = easeInOut(prog(f, 138, 180));
  const cy = lerp(540, HORIZON, stretch);
  const core = (4.5 + 4 * beat) * appear * (1 - stretch * 0.6);
  const halo = (55 + 45 * beat) * appear;
  const warm = mix('#cfe0ff', '#ffc98a', stretch);

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 55%, #070a16 0%, #020208 70%)'}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <radialGradient id="s1halo">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="18%" stopColor={warm} stopOpacity="0.5" />
            <stop offset="55%" stopColor="#3550a0" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#101830" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s1line">
            <stop offset="0%" stopColor="#fff6e8" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffc98a" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ff9a5a" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Polvo cósmico en suspensión: se mueve más que el punto para fingir profundidad */}
        <g transform={`translate(960 540) scale(${1 + (push - 1) * 2.4}) translate(-960 -540)`}>
          {DUST.map((d, i) => {
            const x = d.x + d.vx * f * d.z;
            const y = d.y + d.vy * f * d.z;
            const tw = 0.55 + 0.45 * Math.sin(f * 0.05 + d.ph);
            return <circle key={i} cx={x} cy={y} r={d.s} fill="#dfe8ff" opacity={d.a * tw * appear} />;
          })}
        </g>
        <g transform={`translate(960 ${cy}) scale(${push}) translate(-960 ${-cy})`}>
          <circle cx={960} cy={cy} r={halo * 4.5} fill="url(#s1halo)" opacity={0.18 * appear} />
          <circle cx={960} cy={cy} r={halo} fill="url(#s1halo)" opacity={0.75} />
          {stretch > 0 ? (
            <ellipse cx={960} cy={cy} rx={8 + stretch * 1100} ry={3 + stretch * 26} fill="url(#s1line)" opacity={stretch} />
          ) : null}
          <circle cx={960} cy={cy} r={core} fill="#fffaf0" />
        </g>
      </svg>
      <Caption text="Pasamos un tercio de la vida con los ojos cerrados." from={42} to={176} y={850} size={62} />
    </AbsoluteFill>
  );
};
