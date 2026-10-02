import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Caption} from '../lib/Caption';
import {clamp, easeInOut, lerp, prog, TAU} from '../lib/math';
import {rng} from '../lib/random';

// Escena 6 — «REM, la fábrica de mundos»: Paprika, Magritte, Gondry, Moebius.
const r = rng(61);
const SPARK = Array.from({length: 110}, () => ({x: r() * 1920, y: r() * 1080, s: 0.6 + r() * 2, ph: r() * TAU}));
const CLOUDS = Array.from({length: 7}, (_, i) => ({x: r() * 2200 - 140, y: 180 + r() * 760, w: 220 + r() * 260, v: 0.25 + r() * 0.5, c: i % 2 ? '#f6b3d6' : '#c9b2ff'}));

const Stair: React.FC<{steps: number; color: string; side: string}> = ({steps, color, side}) => (
  <g>
    {Array.from({length: steps}, (_, i) => (
      <g key={i} transform={`translate(${i * 34} ${-i * 24})`}>
        <polygon points="0,0 34,0 48,-12 14,-12" fill={color} />
        <polygon points="0,0 34,0 34,24 0,24" fill={side} />
        <polygon points="34,0 48,-12 48,12 34,24" fill={side} opacity={0.7} />
      </g>
    ))}
  </g>
);

// Ballena: silueta estilizada, la aleta caudal ondula aparte
const WHALE_BODY =
  'M0 42 C8 6 110 -22 250 -16 C380 -10 470 14 548 32 C560 40 560 52 548 56 C462 78 330 98 200 92 C100 88 22 78 0 42 Z';
const WHALE_FIN = 'M150 80 C168 128 200 160 244 172 C222 140 204 110 196 86 Z';
const WHALE_FLUKE = 'M0 0 C18 -10 40 -34 52 -58 C58 -20 50 0 40 8 C60 22 76 46 82 74 C56 56 26 30 0 12 Z';

export const RemContent: React.FC<{f: number}> = ({f}) => {
  const t = f / 30;
  const camX = Math.sin(t * 0.6) * 22;
  const camY = Math.cos(t * 0.45) * 16;
  const camR = Math.sin(t * 0.35) * 1.6;
  const whaleX = lerp(1560, 360, easeInOut(clamp(f / 300)));
  const whaleY = 330 + Math.sin(t * 0.9) * 22;
  const tail = Math.sin(t * 2.2) * 12;
  const door = easeInOut(prog(f, 40, 150));
  const theta = door * 1.25;
  const hx = 520;
  const dw = 120;
  const fx = hx + dw * Math.cos(theta);
  const k = 26 * Math.sin(theta);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        <linearGradient id="s6sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#24164f" />
          <stop offset="0.35" stopColor="#6b2a7e" />
          <stop offset="0.68" stopColor="#c6377d" />
          <stop offset="1" stopColor="#ff8a6e" />
        </linearGradient>
        <radialGradient id="s6moon" cx="0.4" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#fff6fa" />
          <stop offset="1" stopColor="#ffd2e6" />
        </radialGradient>
        <radialGradient id="s6moonGlow">
          <stop offset="0" stopColor="#ffd8ec" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ff9ad0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="s6whale" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#123e5c" />
          <stop offset="0.6" stopColor="#1d7186" />
          <stop offset="1" stopColor="#7fe0d2" />
        </linearGradient>
        <radialGradient id="s6doorLight" cx="0.5" cy="0.5" r="0.6">
          <stop offset="0" stopColor="#fffbea" />
          <stop offset="1" stopColor="#ffd9a6" />
        </radialGradient>
        <linearGradient id="s6beam" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff2d0" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff2d0" stopOpacity="0" />
        </linearGradient>
        <filter id="s6cloud" x="-30%" y="-60%" width="160%" height="220%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>
      <g>
        <rect width="1920" height="1080" fill="url(#s6sky)" />
        <g transform={`translate(${960 + camX} ${540 + camY}) rotate(${camR}) scale(1.06) translate(-960 -540)`}>
          {SPARK.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#ffe6f6" opacity={0.2 + 0.5 * Math.sin(f * 0.09 + s.ph) ** 2} />
          ))}
          {/* luna gigante */}
          <g transform={`translate(1420 ${300 - f * 0.15})`}>
            <circle r={420} fill="url(#s6moonGlow)" />
            <circle r={210} fill="url(#s6moon)" />
            <circle cx={-60} cy={-40} r={34} fill="#f3bcd6" opacity={0.45} />
            <circle cx={50} cy={60} r={52} fill="#f3bcd6" opacity={0.35} />
            <circle cx={80} cy={-80} r={18} fill="#f3bcd6" opacity={0.4} />
          </g>
          {CLOUDS.map((c, i) => (
            <ellipse key={i} cx={((c.x - f * c.v + 2400) % 2400) - 240} cy={c.y} rx={c.w} ry={c.w * 0.28} fill={c.c} opacity={0.32} filter="url(#s6cloud)" />
          ))}
          {/* escaleras imposibles a la deriva (Escher) */}
          <g transform={`translate(1180 ${860 + Math.sin(t) * 14}) rotate(${-8 + t * 4})`} opacity={0.9}>
            <Stair steps={6} color="#e7c6ff" side="#8a5fc8" />
          </g>
          <g transform={`translate(240 ${300 + Math.cos(t * 0.8) * 16}) rotate(${150 - t * 5}) scale(0.7)`} opacity={0.75}>
            <Stair steps={5} color="#9ff5e0" side="#3c9a9a" />
          </g>
          <g transform={`translate(1660 ${700 + Math.sin(t * 1.2) * 10}) rotate(${70 + t * 3}) scale(0.55)`} opacity={0.7}>
            <Stair steps={4} color="#ffd0e0" side="#c86a8e" />
          </g>
          {/* la ballena que nada en el cielo */}
          <g transform={`translate(${whaleX} ${whaleY}) scale(1.05) rotate(${Math.sin(t * 0.9 + 1) * 2.5})`}>
            <path d={WHALE_BODY} fill="url(#s6whale)" />
            <g transform={`translate(548 44) rotate(${tail})`}>
              <path d={WHALE_FLUKE} fill="#174e6c" transform="translate(0 -14)" />
            </g>
            <path d={WHALE_FIN} fill="#165472" />
            {[0, 1, 2, 3].map((i) => (
              <path key={i} d={`M${60 + i * 18} ${70 + i * 3} C${140 + i * 20} ${84 + i * 3} ${220} ${88 + i * 2} ${300} ${84 + i}`} stroke="#a8f0e4" strokeWidth={1.4} fill="none" opacity={0.45} />
            ))}
            <circle cx={64} cy={34} r={4.5} fill="#06202e" />
          </g>
          {/* la puerta solitaria sobre una isla flotante */}
          <g transform={`translate(0 ${Math.sin(t * 0.7) * 10})`}>
            <polygon points={`${hx},868 ${fx + 120},868 ${fx + 420},1020 ${hx - 60},1020`} fill="url(#s6beam)" opacity={door} />
            <ellipse cx={hx + 60} cy={880} rx={170} ry={26} fill="#4a2a6a" />
            <path d={`M${hx - 110} 880 Q${hx + 60} 1000 ${hx + 230} 880 Z`} fill="#33204e" />
            <rect x={hx - 12} y={600} width={dw + 24} height={272} fill="#3a1d52" />
            <rect x={hx} y={612} width={dw} height={256} fill="url(#s6doorLight)" opacity={0.4 + door * 0.6} />
            <polygon points={`${hx},612 ${fx},${612 - k} ${fx},${868 + k} ${hx},868`} fill="#5a2d78" />
            <circle cx={lerp(hx + dw - 16, fx - 8 * Math.cos(theta), 1)} cy={740} r={4} fill="#ffd27a" opacity={Math.cos(theta) > 0.1 ? 1 : 0} />
          </g>
        </g>
      </g>
    </svg>
  );
};

export const Scene6: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <RemContent f={f} />
      <Caption text={'Y en el sueño, la mente\nensaya la vida con otras reglas.'} from={36} to={222} y={975} size={58} color="#fff1f8" glow="rgba(255,150,210,0.5)" />
    </AbsoluteFill>
  );
};
