import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Caption} from '../lib/Caption';
import {ramp, rgba} from '../lib/color';
import {SANS} from '../lib/fonts';
import {clamp, easeInOut, easeOut, prog, smoothstep, TAU} from '../lib/math';
import {rng} from '../lib/random';

// Escena 4 — «El descenso»: los niveles de sueño de Origen, dibujados con la geometría de Saul Bass.
const LAYER_H = 1100;
const DEPTH = 3 * LAYER_H;

const STRATA = [
  {tag: 'FASE N1', sub: 'ondas alfa  ·  el umbral', lambda: 44, amp: 15, speed: 0.55, color: '#a6f4ff'},
  {tag: 'FASE N2', sub: 'ondas theta  ·  husos del sueño', lambda: 118, amp: 36, speed: 0.3, color: '#7cc6ff', spindles: true},
  {tag: 'FASE N3', sub: 'ondas delta  ·  sueño profundo', lambda: 380, amp: 105, speed: 0.13, color: '#6a8cff'},
  {tag: 'EL FONDO', sub: 'el sistema glinfático lava el cerebro', lambda: 800, amp: 150, speed: 0.06, color: '#8f7bff'},
];

const camAt = (f: number) => easeInOut(prog(f, 8, 246)) * DEPTH;
const dropAt = (f: number): [number, number] => [960 + 16 * Math.sin(f * 0.07), 410 + 26 * Math.sin(f * 0.033)];

const r = rng(51);
const SNOW = Array.from({length: 260}, () => {
  const z = r() < 0.25 ? 1.45 : r() < 0.5 ? 0.6 : 1;
  return {x: r() * 1920, y: -200 + r() * (DEPTH * z + 1500), z, s: (0.5 + r() * 1.4) * z, ph: r() * TAU};
});
const SPARKS = Array.from({length: 95}, (_, k) => ({born: 6 + k * 2.5, ox: (r() - 0.5) * 22, vx: (r() - 0.5) * 0.5, s: 1 + r() * 2}));
const SPARK_ORIGIN = SPARKS.map((s) => {
  const [dx, dy] = dropAt(s.born);
  return {x: dx + s.ox, y: camAt(s.born) + dy - 10};
});

const wavePath = (i: number, y0: number, f: number, ampMul = 1, phase = 0) => {
  const s = STRATA[i];
  const pts: string[] = [];
  const ph = f * s.speed + phase;
  for (let x = -10; x <= 1930; x += 6) {
    const env = smoothstep(0, 260, x) * smoothstep(1920, 1660, x);
    let v = Math.sin((TAU * x) / s.lambda + ph) + 0.35 * Math.sin((TAU * x) / (s.lambda * 0.53) + ph * 1.7 + 1.3);
    v += 0.12 * Math.sin((TAU * x) / (s.lambda * 0.21) + ph * 3.1);
    if (s.spindles) {
      const c = ((f * 11) % 2600) - 340;
      v += 0.9 * Math.exp(-(((x - c) / 110) ** 2)) * Math.sin((TAU * x) / 21 + f * 1.4);
    }
    pts.push(`${x === -10 ? 'M' : 'L'}${x} ${(y0 + s.amp * ampMul * env * v).toFixed(1)}`);
  }
  return pts.join(' ');
};

export const Scene4: React.FC = () => {
  const f = useCurrentFrame();
  const cam = camAt(f);
  const depth = cam / DEPTH;
  const [dx, dy] = dropAt(f);
  const dropFade = 1 - prog(f, 226, 256);
  const bgTop = ramp([[0, '#137a96'], [0.33, '#0d4a92'], [0.66, '#0a245e'], [1, '#050a26']], depth);
  const bgBot = ramp([[0, '#0b4a6a'], [0.33, '#082c66'], [0.66, '#05123a'], [1, '#020414']], depth);
  const rays = clamp(1 - depth * 2.2);
  const current = Math.min(3, Math.round(depth * 3));
  const bloom = easeOut(prog(f, 215, 260));

  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${bgTop} 0%, ${bgBot} 100%)`}}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <defs>
          <filter id="s4glow" x="-5%" y="-50%" width="110%" height="200%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <radialGradient id="s4drop" cx="0.35" cy="0.35" r="0.7">
            <stop offset="0" stopColor="#fff6d0" />
            <stop offset="0.45" stopColor="#e8b04e" />
            <stop offset="1" stopColor="#7a4416" />
          </radialGradient>
          <radialGradient id="s4halo">
            <stop offset="0" stopColor="#ffd690" stopOpacity="0.55" />
            <stop offset="1" stopColor="#ffb050" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="s4seed" cx="0.5" cy="1" r="0.8">
            <stop offset="0" stopColor="#40f0e0" stopOpacity="0.55" />
            <stop offset="1" stopColor="#40f0e0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="s4ray" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#e8fbff" stopOpacity="0.22" />
            <stop offset="1" stopColor="#e8fbff" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* rayos de luz filtrados desde la superficie de la vigilia */}
        <g opacity={rays}>
          {[0, 1, 2, 3, 4].map((i) => {
            const x = 260 + i * 360 + Math.sin(f * 0.02 + i) * 40;
            return <polygon key={i} points={`${x},-50 ${x + 90},-50 ${x + 340},1000 ${x + 150},1000`} fill="url(#s4ray)" />;
          })}
        </g>
        {/* nieve marina: el polvo del día arrastrado hacia arriba */}
        {SNOW.map((p, i) => {
          const y = p.y - cam * p.z + Math.sin(f * 0.03 + p.ph) * 6;
          if (y < -10 || y > 1090) return null;
          return <circle key={i} cx={p.x + Math.sin(f * 0.02 + p.ph) * 10} cy={y} r={p.s} fill="#cfefff" opacity={0.18 + 0.3 * (p.z - 0.5)} />;
        })}
        {/* fronteras entre estratos */}
        {[1, 2, 3].map((k) => {
          const y = 540 + (k - 0.5) * LAYER_H - cam;
          if (y < -100 || y > 1180) return null;
          return (
            <g key={k}>
              <rect x={0} y={y - 40} width={1920} height={80} fill="#9fdcff" opacity={0.05} />
              <rect x={0} y={y} width={1920} height={1} fill="#bfe9ff" opacity={0.3} />
            </g>
          );
        })}
        {/* ondas cerebrales: cada capa más lenta y amplia */}
        {STRATA.map((s, i) => {
          const y0 = 540 + i * LAYER_H - cam;
          if (y0 < -300 || y0 > 1380) return null;
          const main = wavePath(i, y0, f);
          return (
            <g key={i}>
              <path d={wavePath(i, y0 - 70, f, 0.45, 2.1)} stroke={s.color} strokeWidth={1} fill="none" opacity={0.22} />
              <path d={wavePath(i, y0 + 70, f, 0.45, 4.3)} stroke={s.color} strokeWidth={1} fill="none" opacity={0.22} />
              <path d={main} stroke={s.color} strokeWidth={9} fill="none" opacity={0.45} filter="url(#s4glow)" />
              <path d={main} stroke="#effcff" strokeWidth={2} fill="none" opacity={0.95} />
            </g>
          );
        })}
        {/* estela de chispas doradas */}
        {SPARKS.map((s, k) => {
          const age = f - s.born;
          if (age < 0 || age > 60) return null;
          const o = SPARK_ORIGIN[k];
          const y = o.y - cam + age * 0.25;
          return <circle key={k} cx={o.x + s.vx * age} cy={y} r={s.s * (1 - age / 60)} fill="#ffd27a" opacity={(1 - age / 60) * 0.85 * dropFade} />;
        })}
        {/* la gota de oro del reloj, cayendo hacia el fondo */}
        <g opacity={dropFade}>
          <circle cx={dx} cy={dy} r={80} fill="url(#s4halo)" />
          <path
            transform={`translate(${dx} ${dy}) scale(0.62)`}
            d="M0 -34 C8 -18 22 -2 22 12 C22 26 12 34 0 34 C-12 34 -22 26 -22 12 C-22 -2 -8 -18 0 -34 Z"
            fill="url(#s4drop)"
          />
        </g>
        {/* el fondo empieza a brillar: semilla del jardín de la escena 5 */}
        <rect x={0} y={560} width={1920} height={520} fill="url(#s4seed)" opacity={bloom} />
      </svg>
      {/* indicador de profundidad */}
      <div style={{position: 'absolute', right: 120, top: 300, height: 480, width: 120, fontFamily: SANS}}>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: 1, background: 'rgba(200,235,255,0.35)'}} />
        {['N1', 'N2', 'N3', '∞'].map((l, i) => (
          <div
            key={l}
            style={{
              position: 'absolute',
              right: 14,
              top: i * 160 - 9,
              fontSize: 14,
              fontWeight: 300,
              letterSpacing: '0.2em',
              color: rgba('#d8f2ff', i === current ? 0.95 : 0.35),
            }}
          >
            {l}
          </div>
        ))}
        <div
          style={{
            position: 'absolute',
            right: -5,
            top: depth * 480 - 5,
            width: 11,
            height: 11,
            borderRadius: 6,
            background: '#ffd27a',
            boxShadow: '0 0 14px 4px rgba(255,210,122,0.7)',
          }}
        />
      </div>
      {/* rótulos de cada estrato, adheridos a su onda */}
      {STRATA.map((s, i) => {
        const y0 = 540 + i * LAYER_H - cam;
        const vis = clamp(1 - Math.abs(y0 - 520) / 420);
        if (vis <= 0) return null;
        return (
          <div key={i} style={{position: 'absolute', left: 130, top: y0 - 150, fontFamily: SANS, opacity: vis, color: '#e2f6ff'}}>
            <div style={{fontSize: 15, fontWeight: 500, letterSpacing: '0.45em'}}>{s.tag}</div>
            <div style={{fontSize: 19, fontWeight: 300, letterSpacing: '0.12em', marginTop: 8, opacity: 0.75}}>{s.sub}</div>
          </div>
        );
      })}
      <Caption text={'Descendemos. Capa tras capa,\nel cerebro lava el polvo del día.'} from={40} to={244} y={905} size={58} color="#eef9ff" glow="rgba(140,210,255,0.4)" />
    </AbsoluteFill>
  );
};
