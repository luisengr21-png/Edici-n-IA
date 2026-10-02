import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import tl from '../timeline.json';
import {Caption} from '../lib/Caption';
import {clamp, easeIn, easeOut, lerp, prog, smoothstep, TAU} from '../lib/math';
import {rng} from '../lib/random';

// Escena 3 — «El reloj se rinde»: homenaje a La persistencia de la memoria (Dalí).
const CX = 960;
const CY = 520;
const R = 230;
const TICKS = tl.events.clockTicks;
const MELT_A = 100;
const MELT_B = 222;

// Goterones: centro x, ancho, amplitud (en radios)
const DRIPS = [
  {c: -128, s: 26, a: 0.95},
  {c: -40, s: 18, a: 0.5},
  {c: 58, s: 33, a: 1.35},
  {c: 148, s: 21, a: 0.7},
  {c: -190, s: 15, a: 0.35},
  {c: 196, s: 12, a: 0.3},
];

type P = [number, number];

const makeDeform = (p: number, f: number) => (x: number, y: number): P => {
  const w = smoothstep(-0.55 * R, 1.08 * R, y);
  let d = 0.2 * R;
  for (const k of DRIPS) d += k.a * R * Math.exp(-(((x - k.c) / k.s) ** 2)) * (0.35 + 0.65 * w);
  const dy = p * Math.pow(w, 1.7) * d;
  const dx = p * w * x * 0.13 + p * w * Math.sin(y * 0.028 + f * 0.06) * 5;
  return [CX + x + dx, CY + y + dy];
};

const ring = (rad: number, n = 360): P[] =>
  Array.from({length: n}, (_, i) => {
    const a = (i / n) * TAU;
    return [Math.cos(a) * rad, Math.sin(a) * rad];
  });

const toPath = (pts: P[], close = true) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + (close ? ' Z' : '');

const rot = (pts: P[], ang: number): P[] => {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};

// Subdivide un polígono para que la deformación sea suave también en sus aristas
const densify = (pts: P[], step = 6): P[] => {
  const out: P[] = [];
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i];
    const b = pts[(i + 1) % pts.length];
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step));
    for (let k = 0; k < n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)]);
  }
  return out;
};

const HOUR: P[] = [[-7, 18], [-9, -40], [0, -128], [9, -40], [7, 18]];
const MINUTE: P[] = [[-5, 22], [-6, -60], [0, -188], [6, -60], [5, 22]];
const SECOND: P[] = [[-1.4, 44], [-1.4, -200], [1.4, -200], [1.4, 44]];

const r = rng(41);
const MOTES = Array.from({length: 70}, () => ({x: r() * 1920, y: r() * 1080, s: 0.6 + r() * 1.8, ph: r() * TAU, v: 0.1 + r() * 0.3}));

export const Scene3: React.FC = () => {
  const f = useCurrentFrame();
  const p = easeIn(prog(f, MELT_A, MELT_B)) * 1.05;
  const D = makeDeform(p, f);
  const dp = (pts: P[]) => toPath(pts.map(([x, y]) => D(x, y)));

  // Segundero: salta 6° en cada tic, con rebote, y se detiene en el último
  let ticks = 0;
  for (const tk of TICKS) ticks += easeOut(prog(f, tk, tk + 5));
  const secAng = ((150 + ticks * 6) * Math.PI) / 180;
  const minAng = (58 * Math.PI) / 180;
  const hourAng = (-62 * Math.PI) / 180;

  const dolly = lerp(1, 1.16, f / 230);
  const tilt = lerp(0, 5, f / 230);
  const highlight = 1 - clamp(p * 1.6);

  // Gota que se desprende del goterón mayor y cae hacia la escena 4
  const dropT = prog(f, 196, 232);
  const tip = D(58, R * 0.98);
  const dropY = tip[1] + 18 + 900 * dropT * dropT;

  const markers = Array.from({length: 60}, (_, i) => {
    const a = (i / 60) * TAU - Math.PI / 2;
    const major = i % 5 === 0;
    const r1 = R - 16;
    const r2 = R - (major ? 40 : 26);
    const wdt = major ? (i % 15 === 0 ? 4.2 : 2.6) : 1;
    const nx = -Math.sin(a) * wdt;
    const ny = Math.cos(a) * wdt;
    const quad: P[] = [
      [Math.cos(a) * r1 + nx, Math.sin(a) * r1 + ny],
      [Math.cos(a) * r2 + nx, Math.sin(a) * r2 + ny],
      [Math.cos(a) * r2 - nx, Math.sin(a) * r2 - ny],
      [Math.cos(a) * r1 - nx, Math.sin(a) * r1 - ny],
    ];
    return {d: dp(densify(quad, 5)), major};
  });

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #164650 0%, #0a2630 45%, #030f15 100%)'}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <linearGradient id="s3gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fff0c0" />
            <stop offset="0.3" stopColor="#e2b25a" />
            <stop offset="0.65" stopColor="#a8692a" />
            <stop offset="1" stopColor="#5a3214" />
          </linearGradient>
          <linearGradient id="s3face" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fbf3e0" />
            <stop offset="0.6" stopColor="#ead8b2" />
            <stop offset="1" stopColor="#b98f58" />
          </linearGradient>
          <radialGradient id="s3top" cx="0.5" cy="0" r="0.9">
            <stop offset="0" stopColor="#fff8e4" stopOpacity="0.16" />
            <stop offset="1" stopColor="#fff8e4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s3drop" cx="0.35" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#fff6d0" />
            <stop offset="0.45" stopColor="#e8b04e" />
            <stop offset="1" stopColor="#7a4416" />
          </radialGradient>
          <filter id="s3soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        {/* luz cenital tenue */}
        <rect width="1920" height="1080" fill="url(#s3top)" />
        {MOTES.map((m, i) => (
          <circle
            key={i}
            cx={m.x + Math.sin(f * 0.02 + m.ph) * 12}
            cy={m.y - f * m.v}
            r={m.s}
            fill="#f0c878"
            opacity={0.12 + 0.18 * Math.sin(f * 0.07 + m.ph) ** 2}
          />
        ))}
        <g transform={`translate(${CX} ${CY}) rotate(${tilt}) scale(${dolly}) translate(${-CX} ${-CY})`}>
          {/* sombra/halo cálido */}
          <path d={dp(ring(R + 26, 240))} fill="#e0a050" opacity={0.18} filter="url(#s3soft)" />
          <path d={dp(ring(R + 20))} fill="url(#s3gold)" />
          <path d={dp(ring(R + 7))} fill="#6a3f18" opacity={0.5} />
          <path d={dp(ring(R + 2))} fill="url(#s3face)" />
          <path d={dp(ring(R - 10))} fill="none" stroke="#9a6a34" strokeWidth={1.2} opacity={0.6} />
          {markers.map((m, i) => (
            <path key={i} d={m.d} fill={m.major ? '#3a2614' : '#6b4a2a'} />
          ))}
          <path d={dp(densify(rot(HOUR, hourAng), 5))} fill="#2a1a0c" />
          <path d={dp(densify(rot(MINUTE, minAng), 5))} fill="#2a1a0c" />
          <path d={dp(densify(rot(SECOND, secAng), 5))} fill="#b8442a" />
          <path d={dp(ring(11, 48))} fill="url(#s3gold)" />
          <path d={dp(ring(4, 24))} fill="#5a3214" />
          {/* brillo especular del cristal */}
          <ellipse
            cx={CX - 70}
            cy={CY - 110}
            rx={120}
            ry={46}
            transform={`rotate(-28 ${CX - 70} ${CY - 110})`}
            fill="#ffffff"
            opacity={0.18 * highlight}
          />
        </g>
        {dropT > 0 ? (
          <g transform={`translate(${CX} ${CY}) rotate(${tilt}) scale(${dolly}) translate(${-CX} ${-CY})`}>
            <path
              transform={`translate(${tip[0]} ${dropY}) scale(${0.5 + dropT * 0.25})`}
              d="M0 -34 C8 -18 22 -2 22 12 C22 26 12 34 0 34 C-12 34 -22 26 -22 12 C-22 -2 -8 -18 0 -34 Z"
              fill="url(#s3drop)"
            />
          </g>
        ) : null}
      </svg>
      <Caption text={'El tiempo se rinde.\nEl cuerpo, por fin, deja de obedecer.'} from={36} to={214} y={140} size={56} color="#f6e7c8" glow="rgba(240,190,110,0.35)" />
    </AbsoluteFill>
  );
};
