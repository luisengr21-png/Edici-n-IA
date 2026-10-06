import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {clamp, DURATION, easeInOut, easeOut, K, PoseCtx, poseOf, SB_FPS, SCENES} from './kit';
import {SB_SCENES} from './scenes';

// Cada transición del plan original se traduce a un gesto de papelería
const TR: Record<string, number> = {cut: 0, pan: 0.9, down: 0.9, zoom: 0.75, zoomOut: 0.8, fade: 0.9};

const layer = (type: string, k: number, incoming: boolean): React.CSSProperties => {
  if (incoming && k >= 1) return {};
  const e = easeOut(k);
  switch (type) {
    case 'pan': // una hoja nueva se desliza encima desde la derecha, girando hasta asentarse
      return incoming
        ? {transform: `translateX(${(1 - e) * 2050}px) rotate(${(1 - e) * 4}deg)`, boxShadow: '-24px 10px 50px rgba(40,22,8,0.45)'}
        : {filter: `brightness(${1 - 0.25 * k})`};
    case 'down': // la hoja sube desde abajo
      return incoming ? {transform: `translateY(${(1 - e) * 1150}px) rotate(${(1 - e) * -2}deg)`, boxShadow: '0 -24px 50px rgba(40,22,8,0.45)'} : {filter: `brightness(${1 - 0.25 * k})`};
    case 'zoom':
    case 'zoomOut': // una hoja cae sobre la mesa
      return incoming
        ? {transform: `scale(${1.25 - 0.25 * e}) rotate(${(1 - e) * -5}deg)`, opacity: clamp(k * 3), boxShadow: '0 30px 60px rgba(40,22,8,0.5)'}
        : {filter: `brightness(${1 - 0.3 * k})`};
    case 'fade':
      return {opacity: incoming ? easeInOut(k) : 1};
    default:
      return {};
  }
};

export const SerRealScrapbook: React.FC = () => {
  const frame = useCurrentFrame();
  const pose = poseOf(frame);
  const t = (pose * 2) / SB_FPS;
  const fadeIn = clamp(t / 1.2);
  const fadeOut = 1 - clamp((t - (DURATION - 1.6)) / 1.6);
  return (
    <AbsoluteFill style={{background: K.wood, overflow: 'hidden'}}>
      <PoseCtx.Provider value={pose}>
        {SCENES.map((sc, i) => {
          const next = SCENES[i + 1];
          const until = next ? next.start + TR[next.in] : sc.end;
          if (t < sc.start || t >= until) return null;
          const Comp = SB_SCENES[sc.id];
          let style: React.CSSProperties = {};
          if (next && t >= next.start) style = layer(next.in, clamp((t - next.start) / (TR[next.in] || 1)), false);
          else if (i > 0) style = layer(sc.in, clamp((t - sc.start) / (TR[sc.in] || 1)), true);
          return (
            <AbsoluteFill key={sc.id} style={{...style, transformOrigin: '50% 50%', zIndex: i}}>
              <Comp t={t} a={sc.start} b={sc.end} />
            </AbsoluteFill>
          );
        })}
      </PoseCtx.Provider>
      <Img
        src={staticFile(`cine/grain${(pose % 6) + 1}.png`)}
        style={{position: 'absolute', width: 1920, height: 1080, mixBlendMode: 'overlay', opacity: 0.12, zIndex: 100}}
      />
      <AbsoluteFill style={{background: '#000', opacity: 1 - fadeIn * fadeOut, zIndex: 101}} />
    </AbsoluteFill>
  );
};
