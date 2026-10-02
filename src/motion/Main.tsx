import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import plan from './plan.json';
import {clamp, easeInOut, M, MotionDefs} from './kit';
import {SCENES_MOTION} from './scenes';

export const FPS = plan.fps;
const TR = 0.6;
const BAR_COLORS = [M.coral, M.amber, M.mint, M.violet];

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{background: M.bg, overflow: 'hidden'}}>
    <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{position: 'absolute'}}>
      <MotionDefs />
      {children}
    </svg>
    <AbsoluteFill style={{background: 'radial-gradient(ellipse 90% 85% at 50% 50%, rgba(0,0,0,0) 62%, rgba(0,0,0,0.28) 100%)', pointerEvents: 'none'}} />
  </AbsoluteFill>
);

export const MotionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const scenes = plan.scenes;
  return (
    <AbsoluteFill style={{background: M.bg}}>
      {scenes.map((sc, i) => {
        const next = scenes[i + 1];
        const until = next ? sc.end + (next.in === 'cut' ? 0 : TR) : sc.end;
        if (t < sc.start || t >= until) return null;
        const Comp = SCENES_MOTION[sc.id];
        const kIn = easeInOut(clamp((t - sc.start) / TR));
        const kOut = next ? easeInOut(clamp((t - sc.end) / TR)) : 0;
        let style: React.CSSProperties = {};
        let overlay: React.ReactNode = null;
        if (i > 0 && kIn < 1) {
          if (sc.in === 'circle') {
            style = {clipPath: `circle(${kIn * 118}% at 50% 50%)`};
            overlay = (
              <div
                style={{
                  position: 'absolute',
                  left: 960 - kIn * 1300,
                  top: 540 - kIn * 1300,
                  width: kIn * 2600,
                  height: kIn * 2600,
                  borderRadius: '50%',
                  border: `${26 * (1 - kIn) + 4}px solid ${M.coral}`,
                  boxSizing: 'border-box',
                }}
              />
            );
          }
          if (sc.in === 'push') style = {transform: `translateX(${(1 - kIn) * 1920}px)`, filter: `blur(${Math.sin(kIn * Math.PI) * 10}px)`};
          if (sc.in === 'fade') style = {opacity: kIn};
          if (sc.in === 'zoom') style = {transform: `scale(${1.3 - 0.3 * kIn})`, opacity: clamp(kIn * 1.4)};
          if (sc.in === 'bars') {
            const xt = -700 + kIn * 3300;
            style = {clipPath: `polygon(0 0, ${xt + 380}px 0, ${xt}px 1080px, 0 1080px)`};
            overlay = (
              <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
                {BAR_COLORS.map((c, k) => (
                  <polygon key={k} points={`${xt + 380 + k * 150},0 ${xt + 380 + k * 150 + 150},0 ${xt + k * 150 + 150},1080 ${xt + k * 150},1080`} fill={c} />
                ))}
              </svg>
            );
          }
        }
        if (next && kOut > 0) {
          if (next.in === 'push') style = {transform: `translateX(${-kOut * 1920}px)`, filter: `blur(${Math.sin(kOut * Math.PI) * 10}px)`};
          if (next.in === 'zoom') style = {transform: `scale(${1 + kOut * 1.8})`, opacity: 1 - kOut};
        }
        return (
          <AbsoluteFill key={sc.id}>
            <AbsoluteFill style={style}>
              <Frame>
                <Comp t={t} a={sc.start} b={sc.end} />
              </Frame>
            </AbsoluteFill>
            {overlay}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};
