import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import plan from './plan.json';
import {clamp, easeInOut, V, VoxDefs} from './kit';
import {SCENES_VOX} from './scenes';

export const FPS = plan.fps;
const TR = 0.4; // transiciones rápidas, al estilo explicador

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: V.paper, overflow: 'hidden'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      <VoxDefs />
      {children}
    </svg>
    <Img src={staticFile('estatus/paper.jpg')} style={{position: 'absolute', width: 1920, height: 1080, mixBlendMode: 'multiply', opacity: 0.35}} />
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 85% 80% at 50% 50%, rgba(0,0,0,0) 65%, rgba(0,0,0,0.18) 100%)'}} />
  </AbsoluteFill>
);

export const VoxVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scenes = plan.scenes;
  return (
    <AbsoluteFill style={{background: V.ink}}>
      {scenes.map((sc, i) => {
        const next = scenes[i + 1];
        const until = next ? sc.end + (next.in === 'cut' ? 0 : TR) : sc.end;
        if (t < sc.start || t >= until) return null;
        const Comp = SCENES_VOX[sc.id];
        const kIn = easeInOut(clamp((t - sc.start) / TR));
        const kOut = next ? easeInOut(clamp((t - sc.end) / TR)) : 0;
        let style: React.CSSProperties = {};
        if (i > 0 && kIn < 1) {
          if (sc.in === 'whip') style = {transform: `translateX(${(1 - kIn) * 1920}px)`, filter: `blur(${Math.sin(kIn * Math.PI) * 14}px)`};
          if (sc.in === 'fade') style = {opacity: kIn};
          if (sc.in === 'zoom') style = {transform: `scale(${0.7 + 0.3 * kIn})`, opacity: kIn};
          if (sc.in === 'swipe') style = {clipPath: `inset(0 ${(1 - kIn) * 100}% 0 0)`};
        }
        if (next && kOut > 0) {
          if (next.in === 'whip') style = {transform: `translateX(${-kOut * 1920}px)`, filter: `blur(${Math.sin(kOut * Math.PI) * 14}px)`};
          if (next.in === 'zoom') style = {transform: `scale(${1 + kOut * 1.6})`};
        }
        const swipeBar = i > 0 && sc.in === 'swipe' && kIn < 1;
        return (
          <AbsoluteFill key={sc.id} style={style}>
            <Frame>
              <Comp t={t} a={sc.start} b={sc.end} />
            </Frame>
            {swipeBar ? <div style={{position: 'absolute', top: 0, bottom: 0, width: 90, left: `calc(${kIn * 100}% - 90px)`, background: V.yellow}} /> : null}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
