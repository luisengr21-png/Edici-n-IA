import React from 'react';
import {Composition} from 'remotion';
import tl from './timeline.json';
import {Video} from './Video';

export const Root: React.FC = () => (
  <Composition
    id="LoQueLaNocheSabe"
    component={Video}
    durationInFrames={tl.durationInFrames}
    fps={tl.fps}
    width={tl.width}
    height={tl.height}
  />
);
