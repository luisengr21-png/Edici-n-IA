import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import tl from '../timeline.json';
import {Caption} from '../lib/Caption';
import {mix} from '../lib/color';
import {clamp, easeInOut, easeOut, lerp, prog, TAU} from '../lib/math';
import {rng} from '../lib/random';

// Escena 5 — «El jardín de la memoria»: Refik Anadol + las luciérnagas de Takahata.
type Branch = {
  d: string;
  len: number;
  depth: number;
  start: number;
  dur: number;
  x2: number;
  y2: number;
  pruned: boolean;
  leaf: boolean;
};

const MAXD = 7;
const R = rng(5);
const BR: Branch[] = [];

const grow = (x: number, y: number, ang: number, len: number, depth: number, start: number, pruned: boolean) => {
  const x2 = x + Math.cos(ang) * len;
  const y2 = y + Math.sin(ang) * len;
  const bend = (R() - 0.5) * len * 0.4;
  const cx = (x + x2) / 2 - Math.sin(ang) * bend;
  const cy = (y + y2) / 2 + Math.cos(ang) * bend;
  const dur = 11 + len * 0.05;
  const isPruned = pruned || (depth >= 5 && R() < 0.22);
  const leaf = depth >= MAXD;
  BR.push({d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, len: len * 1.08, depth, start, dur, x2, y2, pruned: isPruned, leaf});
  if (leaf) return;
  const n = depth >= 2 && R() < 0.2 ? 3 : 2;
  for (let i = 0; i < n; i++) {
    const spread = 0.32 + R() * 0.32;
    const a = n === 2 ? ang + (i === 0 ? -1 : 1) * spread : ang + (i - 1) * spread * 1.15;
    grow(x2, y2, a + (R() - 0.5) * 0.16, len * (0.7 + R() * 0.12), depth + 1, start + dur * 0.72, isPruned);
  }
};
grow(960, 1130, -Math.PI / 2, 232, 0, 4, false);

const LEAVES = BR.filter((b) => b.leaf);
const LIVE = LEAVES.filter((b) => !b.pruned);
const PRUNE_A = 168;
const PRUNE_B = 214;

// Destellos sinápticos sincronizados con la celesta del audio
const FLASHES = tl.events.celesta.map((e, k) => {
  const q = rng(900 + k);
  return {at: e, nodes: [0, 1, 2, 3].map(() => LIVE[Math.floor(q() * LIVE.length)])};
});

const F = rng(77);
const FLIES = Array.from({length: 48}, () => {
  const target = LIVE[Math.floor(F() * LIVE.length)];
  const x0 = 200 + F() * 1520;
  return {
    x0,
    y0: 1150 + F() * 120,
    cx: x0 + (F() - 0.5) * 520,
    cy: 700 + F() * 300,
    target,
    start: 50 + F() * 95,
    dur: 70 + F() * 55,
    ph: F() * TAU,
  };
});

const S = rng(78);
const STARS = Array.from({length: 120}, () => ({x: S() * 2000 - 40, y: S() * 1080, s: 0.4 + S() * 1.1, ph: S() * TAU}));
const BOKEH = Array.from({length: 14}, () => ({x: S() * 2200 - 140, y: S() * 1080, s: 20 + S() * 50, ph: S() * TAU, c: S() < 0.5 ? '#3ce6dc' : '#ffd27a'}));

export const TreeLayer: React.FC<{f: number; wither?: number}> = ({f, wither = 0}) => {
  const pruneP = easeInOut(prog(f, PRUNE_A, PRUNE_B));
  const visible = BR.map((b) => {
    const g = easeOut(prog(f, b.start, b.start + b.dur));
    const alpha = b.pruned ? 1 - pruneP : 1;
    return {b, g, alpha};
  }).filter((o) => o.g > 0 && o.alpha > 0.01);
  const stroke = (b: Branch) => mix('#2bd4d0', '#b6ffe4', b.depth / MAXD);
  const width = (b: Branch) => Math.max(0.7, 7.5 * Math.pow(0.7, b.depth));

  return (
    <g>
      <g filter="url(#s5glow)" opacity={0.9}>
        {visible.map(({b, g, alpha}, i) => (
          <path key={i} d={b.d} stroke={stroke(b)} strokeWidth={width(b) * 3.2} fill="none" strokeLinecap="round" strokeDasharray={b.len} strokeDashoffset={b.len * (1 - g)} opacity={alpha * 0.6} />
        ))}
      </g>
      <g>
        {visible.map(({b, g, alpha}, i) => (
          <path key={i} d={b.d} stroke={stroke(b)} strokeWidth={width(b)} fill="none" strokeLinecap="round" strokeDasharray={b.len} strokeDashoffset={b.len * (1 - g)} opacity={alpha} />
        ))}
      </g>
      {/* sinapsis en las puntas */}
      {LEAVES.map((b, i) => {
        const on = prog(f, b.start + b.dur, b.start + b.dur + 8);
        if (on <= 0) return null;
        const alive = b.pruned ? 1 - pruneP : 1;
        // en la escena del insomnio, las sinapsis se apagan en cascada de abajo hacia arriba
        const dark = wither > 0 ? clamp(wither * 1.6 - (1 - b.y2 / 1100) * 0.6) : 0;
        const pulse = 0.6 + 0.4 * Math.sin(f * 0.12 + i);
        const a = on * alive * pulse * (1 - dark);
        if (a <= 0.01) return null;
        return <circle key={i} cx={b.x2} cy={b.y2} r={2.6} fill="#e8fff6" opacity={a} />;
      })}
    </g>
  );
};

export const TreeDefs: React.FC = () => (
  <defs>
    <filter id="s5glow" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
    <filter id="s5bokeh" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="10" />
    </filter>
    <radialGradient id="s5fly">
      <stop offset="0" stopColor="#fff2c0" stopOpacity="0.9" />
      <stop offset="0.35" stopColor="#ffd27a" stopOpacity="0.35" />
      <stop offset="1" stopColor="#ffb040" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="s5haze" cx="0.5" cy="1" r="0.75">
      <stop offset="0" stopColor="#1fb5b0" stopOpacity="0.45" />
      <stop offset="0.6" stopColor="#0c4a6a" stopOpacity="0.15" />
      <stop offset="1" stopColor="#031326" stopOpacity="0" />
    </radialGradient>
  </defs>
);

export const Scene5: React.FC = () => {
  const f = useCurrentFrame();
  const t = easeInOut(prog(f, 0, 250));
  const scale = lerp(1.28, 1.0, t);
  const viewY = lerp(860, 590, t);
  const orbit = Math.sin(f * 0.012) * 36;

  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 80%, #0a3550 0%, #04182e 45%, #020a18 100%)'}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <TreeDefs />
        <rect width="1920" height="1080" fill="url(#s5haze)" />
        <g transform={`translate(${-orbit * 0.3} 0)`}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#bdfcff" opacity={0.25 + 0.25 * Math.sin(f * 0.06 + s.ph)} />
          ))}
        </g>
        <g transform={`translate(${960 + orbit} 540) scale(${scale}) translate(-960 ${-viewY})`}>
          <TreeLayer f={f} />
          {/* destellos sinápticos */}
          {FLASHES.map((fl, k) =>
            fl.nodes.map((n, j) => {
              const age = f - fl.at - j * 2;
              if (age < 0 || age > 30) return null;
              const a = Math.exp(-age / 9);
              return (
                <g key={`${k}-${j}`}>
                  <circle cx={n.x2} cy={n.y2} r={5 + age * 1.6} fill="none" stroke="#b6ffe4" strokeWidth={1.2} opacity={a * 0.8} />
                  <circle cx={n.x2} cy={n.y2} r={26} fill="url(#s5fly)" opacity={a} />
                </g>
              );
            }),
          )}
          {/* recuerdos-luciérnaga que suben a posarse en las ramas */}
          {FLIES.map((fl, i) => {
            const p = prog(f, fl.start, fl.start + fl.dur);
            if (p <= 0) return null;
            const e = easeInOut(p);
            const tx = fl.target.x2;
            const ty = fl.target.y2;
            const x = (1 - e) * (1 - e) * fl.x0 + 2 * (1 - e) * e * fl.cx + e * e * tx + Math.sin(f * 0.09 + fl.ph) * 14 * (1 - e);
            const y = (1 - e) * (1 - e) * fl.y0 + 2 * (1 - e) * e * fl.cy + e * e * ty;
            const tw = p < 1 ? 0.75 + 0.25 * Math.sin(f * 0.3 + fl.ph) : 0.7 + 0.3 * Math.sin(f * 0.08 + fl.ph);
            return (
              <g key={i} opacity={tw * clamp(p * 5)}>
                <circle cx={x} cy={y} r={16} fill="url(#s5fly)" />
                <circle cx={x} cy={y} r={2.2} fill="#fff6d8" />
              </g>
            );
          })}
        </g>
        {/* bokeh en primer plano, se mueve más rápido: paralaje de cámara orbital */}
        <g filter="url(#s5bokeh)">
          {BOKEH.map((b, i) => (
            <circle key={i} cx={b.x + orbit * 2.2} cy={b.y - f * 0.4} r={b.s} fill={b.c} opacity={0.07 + 0.05 * Math.sin(f * 0.05 + b.ph)} />
          ))}
        </g>
      </svg>
      <Caption text={'Mientras duermes, la memoria elige\nqué recuerdos merecen quedarse.'} from={38} to={244} y={935} size={56} color="#ecfff8" glow="rgba(90,240,210,0.4)" />
    </AbsoluteFill>
  );
};
