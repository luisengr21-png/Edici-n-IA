import React from 'react';
import {Composition} from 'remotion';
import tl from './timeline.json';
import {Video} from './Video';
import {Estatus} from './estatus/Main';
import {DURATION, FPS} from './estatus/timing';

export const Root: React.FC = () => (
  <>
    <Composition
      id="LoQueLaNocheSabe"
      component={Video}
      durationInFrames={tl.durationInFrames}
      fps={tl.fps}
      width={tl.width}
      height={tl.height}
    />
    <Composition
      id="AnsiedadPorElEstatus"
      component={Estatus}
      durationInFrames={Math.round(DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
  </>
);
