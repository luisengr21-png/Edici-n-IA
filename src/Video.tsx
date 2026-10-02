import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame} from 'remotion';
import tl from './timeline.json';
import './lib/fonts';
import {Grain, Vignette} from './lib/Overlays';
import {prog} from './lib/math';
import {Scene1} from './scenes/Scene1';
import {Scene2} from './scenes/Scene2';
import {Scene3} from './scenes/Scene3';
import {Scene4} from './scenes/Scene4';
import {Scene5} from './scenes/Scene5';
import {Scene6} from './scenes/Scene6';
import {Scene7} from './scenes/Scene7';
import {Scene8} from './scenes/Scene8';
import {Scene9} from './scenes/Scene9';

const SCENES: Record<number, React.FC> = {1: Scene1, 2: Scene2, 3: Scene3, 4: Scene4, 5: Scene5, 6: Scene6, 7: Scene7, 8: Scene8, 9: Scene9};

// Fundido cruzado: la escena entrante se superpone a la saliente durante `overlap` fotogramas
const FadeIn: React.FC<{enabled: boolean; children: React.ReactNode}> = ({enabled, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: enabled ? prog(f, 0, tl.overlap) : 1}}>{children}</AbsoluteFill>;
};

export const Video: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    {tl.scenes.map((s) => {
      const from = s.start - (s.fadeIn ? tl.overlap : 0);
      const Comp = SCENES[s.id];
      return (
        <Sequence key={s.id} from={from} durationInFrames={s.end - from} name={`${s.id}. ${s.name}`}>
          <FadeIn enabled={s.fadeIn}>
            <Comp />
          </FadeIn>
        </Sequence>
      );
    })}
    <Vignette strength={0.55} />
    <Grain opacity={0.08} />
  </AbsoluteFill>
);
