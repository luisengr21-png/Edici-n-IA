import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import plan from './plan.json';
import {clamp, easeInOut} from './kit';
import {SCENES_CINE} from './scenes';

export const FPS = plan.fps;
const TR = 1.0;
export const BAR = 138; // bandas de cine 2.39:1

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      {children}
    </svg>
  </AbsoluteFill>
);

export const CineVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scenes = plan.scenes;
  let white = 0;
  const layers = scenes.map((sc, i) => {
    const next = scenes[i + 1];
    const until = next ? sc.end + (next.in === 'cut' ? 0 : TR) : sc.end;
    if (t < sc.start || t >= until) return null;
    const Comp = SCENES_CINE[sc.id];
    const kIn = easeInOut(clamp((t - sc.start) / TR));
    const kOut = next ? clamp((t - sc.end) / TR) : 0;
    let opacity = 1;
    if (i > 0 && kIn < 1) {
      if (sc.in === 'dissolve') opacity = kIn;
      if (sc.in === 'black' || sc.in === 'white') opacity = clamp(kIn * 2 - 1);
    }
    if (next && kOut > 0 && (next.in === 'black' || next.in === 'white')) opacity = Math.min(opacity, 1 - clamp(kOut * 2));
    if (sc.in === 'white' && i > 0 && kIn < 1) white = Math.max(white, Math.sin(kIn * Math.PI) * 0.9);
    return (
      <AbsoluteFill key={sc.id} style={{opacity}}>
        <Frame>
          <Comp t={t} a={sc.start} b={sc.end} />
        </Frame>
      </AbsoluteFill>
    );
  });
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {layers}
      {white > 0 ? <AbsoluteFill style={{background: '#FFF6E6', opacity: white}} /> : null}
      <AbsoluteFill style={{background: 'radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.45) 100%)'}} />
      <Img src={staticFile(`cine/grain${(frame % 6) + 1}.png`)} style={{position: 'absolute', width: 1920, height: 1080, mixBlendMode: 'overlay', opacity: 0.16}} />
      <AbsoluteFill>
        <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: BAR, background: '#000'}} />
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: BAR, background: '#000'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
