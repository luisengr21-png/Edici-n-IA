import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {BoilDefs, C, clamp, easeInOut, TimeCtx} from './kit';
import {FPS, SCENES} from './timing';
import {SCENE_COMPONENTS} from './scenes';

const TR = 0.7; // duración de la transición (s)

// Hoja de papel: cada escena vive en su propia hoja con textura
const Sheet: React.FC<{children: React.ReactNode; frame: number}> = ({children, frame}) => (
  <AbsoluteFill style={{background: C.paper}}>
    <Img src={staticFile('estatus/paper.jpg')} style={{position: 'absolute', width: 1920, height: 1080, mixBlendMode: 'multiply', opacity: 0.55}} />
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      <BoilDefs frame={frame} />
      <g filter="url(#boil)">{children}</g>
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 60%, rgba(70,45,20,0.22) 100%)'}} />
  </AbsoluteFill>
);

export const Estatus: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <TimeCtx.Provider value={t}>
        {SCENES.map((sc, i) => {
          const next = SCENES[i + 1];
          const visibleUntil = next ? sc.end + (next.in === 'cut' ? 0 : TR) : sc.end;
          if (t < sc.start || t >= visibleUntil) return null;
          const Comp = SCENE_COMPONENTS[sc.id];
          const k = easeInOut(clamp((t - sc.start) / TR));
          let style: React.CSSProperties = {};
          if (i > 0 && k < 1) {
            if (sc.in === 'slide') style = {transform: `translateX(${(1 - k) * 1920}px)`, boxShadow: '-30px 0 60px rgba(60,40,20,0.35)'};
            if (sc.in === 'slideUp') style = {transform: `translateY(${(1 - k) * 1080}px)`, boxShadow: '0 -30px 60px rgba(60,40,20,0.35)'};
            if (sc.in === 'fade') style = {opacity: k};
            if (sc.in === 'iris') style = {clipPath: `circle(${k * 120}% at 50% 50%)`};
          }
          return (
            <AbsoluteFill key={sc.id} style={style}>
              <Sheet frame={frame}>
                <Comp t={t} a={sc.start} b={sc.end} />
              </Sheet>
            </AbsoluteFill>
          );
        })}
      </TimeCtx.Provider>
    </AbsoluteFill>
  );
};
