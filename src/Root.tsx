import React from 'react';
import {Composition} from 'remotion';
import tl from './timeline.json';
import {Video} from './Video';
import {Estatus} from './estatus/Main';
import {DURATION, FPS} from './estatus/timing';
import {VoxVideo} from './vox/Main';
import {MotionVideo} from './motion/Main';
import {CineVideo} from './cine/Main';
import {LujoVideo} from './lujo/Main';
import lujoPlan from './lujo/plan.json';
import {ShortVideo} from './lujo/Shorts';
import lujoShorts from './lujo/shorts.json';

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
      id="PobrezaDeLujo"
      component={LujoVideo}
      durationInFrames={Math.round(lujoPlan.duration * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
    {lujoShorts.map((s) => (
      <Composition key={s.id} id={`PobrezaDeLujo${s.id}`} component={ShortVideo} defaultProps={{id: s.id}} durationInFrames={Math.round(s.duration * 30)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
