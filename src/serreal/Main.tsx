import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {C, clamp, DURATION, expoInOut, easeInOut, FPS, SCENES} from './kit';
import {SCENE_COMPONENTS} from './scenes';

const TR: Record<string, number> = {cut: 0, pan: 1.1, down: 1.1, zoom: 0.9, zoomOut: 1.1, fade: 1.0};

const trK = (type: string, t: number, start: number) => {
  const d = TR[type];
  if (!d) return 1;
  const u = clamp((t - start) / d);
  return type === 'fade' ? easeInOut(u) : expoInOut(u);
};

/** Desplazamiento acumulado del lienzo infinito (para la retícula de puntos) */
const canvasCam = (t: number) => {
  let x = 0;
  let y = 0;
  let z = 1;
  for (const sc of SCENES) {
    if (t < sc.start) break;
    const k = trK(sc.in, t, sc.start);
    if (sc.in === 'pan') x += 1920 * k;
    if (sc.in === 'down') y += 1080 * k;
    if (sc.in === 'zoom') z *= 1 + 1.8 * Math.sin(Math.PI * k);
    if (sc.in === 'zoomOut') z /= 1 + 0.7 * Math.sin(Math.PI * k);
  }
  return {x, y, z};
};

const layerStyle = (type: string, k: number, incoming: boolean): React.CSSProperties => {
  if (k >= 1 && incoming) return {};
  switch (type) {
    case 'pan':
      return {transform: `translateX(${incoming ? (1 - k) * 1920 : -k * 1920}px)`};
    case 'down':
      return {transform: `translateY(${incoming ? (1 - k) * 1080 : -k * 1080}px)`};
    case 'zoom':
      return incoming ? {transform: `scale(${0.45 + 0.55 * k})`, opacity: k} : {transform: `scale(${1 + 3 * k})`, opacity: 1 - k};
    case 'zoomOut':
      return incoming ? {transform: `scale(${1.9 - 0.9 * k})`, opacity: k} : {transform: `scale(${1 - 0.6 * k})`, opacity: 1 - k};
    case 'fade':
      return {opacity: incoming ? k : 1 - k};
    default:
      return {};
  }
};

const Grid: React.FC<{t: number}> = ({t}) => {
  const {x, y, z} = canvasCam(t);
  const g = 48;
  return (
    <svg width={1920} height={1080} style={{position: 'absolute'}}>
      <defs>
        <pattern
          id="dots"
          width={g}
          height={g}
          patternUnits="userSpaceOnUse"
          patternTransform={`translate(960 540) scale(${z}) translate(${-960 - (x % g)} ${-540 - (y % g)})`}
        >
          <circle cx={g / 2} cy={g / 2} r={1.6} fill={C.grid} />
        </pattern>
        <radialGradient id="bgLift" cx="50%" cy="45%" r="70%">
          <stop offset="0" stopColor="#1b2130" />
          <stop offset="1" stopColor={C.bg} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#bgLift)" />
      <rect width={1920} height={1080} fill="url(#dots)" opacity={0.9} />
    </svg>
  );
};

export const SerReal: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const fadeIn = clamp(t / 1.4);
  const fadeOut = 1 - clamp((t - (DURATION - 1.8)) / 1.8);
  return (
    <AbsoluteFill style={{background: C.bg, overflow: 'hidden'}}>
      <Grid t={t} />
      {SCENES.map((sc, i) => {
        const next = SCENES[i + 1];
        const until = next ? next.start + TR[next.in] : sc.end;
        if (t < sc.start || t >= until) return null;
        const Comp = SCENE_COMPONENTS[sc.id];
        let style: React.CSSProperties = {};
        if (next && t >= next.start) style = layerStyle(next.in, trK(next.in, t, next.start), false);
        else if (i > 0) style = layerStyle(sc.in, trK(sc.in, t, sc.start), true);
        return (
          <AbsoluteFill key={sc.id} style={{...style, transformOrigin: '50% 50%'}}>
            <Comp t={t} a={sc.start} b={sc.end} />
          </AbsoluteFill>
        );
      })}
      {/* grano de película + viñeta */}
      <Img
        src={staticFile(`cine/grain${(frame % 6) + 1}.png`)}
        style={{position: 'absolute', width: 1920, height: 1080, mixBlendMode: 'overlay', opacity: 0.22, imageRendering: 'pixelated'}}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 75% 70% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'}} />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn * fadeOut}} />
    </AbsoluteFill>
  );
};
