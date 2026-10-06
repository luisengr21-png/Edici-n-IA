import React from 'react';
import {Composition} from 'remotion';
import tl from './timeline.json';
import {Video} from './Video';
import {Estatus} from './estatus/Main';
import {DURATION, FPS} from './estatus/timing';
import {VoxVideo} from './vox/Main';
import {MotionVideo} from './motion/Main';
import {CineVideo} from './cine/Main';
import {SerReal} from './serreal/Main';
import serPlan from './serreal/plan.json';
import {SerRealScrapbook} from './scrapbook/Main';

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
    <Composition
      id="AnsiedadVox"
      component={VoxVideo}
      durationInFrames={Math.round(DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="AnsiedadMotion"
      component={MotionVideo}
      durationInFrames={Math.round(DURATION * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
    <Composition
      id="AnsiedadCine"
      component={CineVideo}
      durationInFrames={Math.round(DURATION * 24)}
      fps={24}
      width={1920}
      height={1080}
    />
    <Composition
      id="SerReal"
      component={SerReal}
      durationInFrames={Math.round(serPlan.duration * serPlan.fps)}
      fps={serPlan.fps}
      width={1920}
      height={1080}
    />
    <Composition
      id="SerRealScrapbook"
      component={SerRealScrapbook}
      durationInFrames={Math.round(serPlan.duration * 24)}
      fps={24}
      width={1920}
      height={1080}
    />
  </>
);
