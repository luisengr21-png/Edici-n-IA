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
import {Thumb} from './lujo/Thumbs';
import {PersonajeVideo} from './personaje/Main';
import personajePlan from './personaje/plan.json';
import {ShortVideo as PersonajeShort} from './personaje/Shorts';
import personajeShorts from './personaje/shorts.json';
import {Thumb as PersonajeThumb} from './personaje/Thumbs';
import {BurnoutVideo} from './burnout/Main';
import burnoutPlan from './burnout/plan.json';
import {ShortVideo as BurnoutShort} from './burnout/Shorts';
import burnoutShorts from './burnout/shorts.json';
import {Thumb as BurnoutThumb} from './burnout/Thumbs';
import {RiquezaVideo} from './riqueza/Riqueza';
import riquezaPlan from './riqueza/plan.json';
import {RiquezaShort} from './riqueza/Shorts';
import riquezaShorts from './riqueza/shorts.json';
import {MiniShort as RiquezaMiniShort} from './riqueza/MiniShorts';
import {MiniLargo as RiquezaMiniLargo} from './riqueza/MiniLargo';
import {DedicasVideo} from './dedicas/Dedicas';
import dedicasPlan from './dedicas/plan.json';
import {DedicasShort} from './dedicas/Shorts';
import dedicasShorts from './dedicas/shorts.json';
import {Thumb2 as BurnoutThumb2, Thumb3Opt as BurnoutThumb3Opt} from './burnout/Thumbs2';

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
    {[1, 2, 3, 4, 5].map((n) => (
      <Composition key={n} id={`PobrezaDeLujoMiniatura${n}`} component={Thumb} defaultProps={{n}} durationInFrames={1} fps={30} width={1280} height={720} />
    ))}
    <Composition
      id="PersonajeMiedo"
      component={PersonajeVideo}
      durationInFrames={Math.round(personajePlan.duration * 30)}
      fps={30}
      width={1920}
      height={1080}
    />
    {(personajeShorts as any[]).map((s) => (
      <Composition key={s.id} id={`PersonajeMiedo${s.id}`} component={PersonajeShort} defaultProps={{id: s.id}} durationInFrames={Math.round(s.duration * 30)} fps={30} width={1080} height={1920} />
    ))}
    {[1, 2, 3, 4, 5].map((n) => (
      <Composition key={`pm${n}`} id={`PersonajeMiedoMiniatura${n}`} component={PersonajeThumb} defaultProps={{n}} durationInFrames={1} fps={30} width={1280} height={720} />
    ))}
    <Composition id="NoEsPereza" component={BurnoutVideo} durationInFrames={Math.round(burnoutPlan.duration * 30)} fps={30} width={1920} height={1080} />
    {(burnoutShorts as any[]).map((s) => (
      <Composition key={`b${s.id}`} id={`NoEsPereza${s.id}`} component={BurnoutShort} defaultProps={{id: s.id}} durationInFrames={Math.round(s.duration * 30)} fps={30} width={1080} height={1920} />
    ))}
    {[1, 2, 3, 4, 5].map((n) => (
      <Composition key={`bm${n}`} id={`NoEsPerezaMiniatura${n}`} component={BurnoutThumb} defaultProps={{n}} durationInFrames={1} fps={30} width={1280} height={720} />
    ))}
    {[1, 2, 3, 4, 5].map((n) => (
      <Composition key={`bv${n}`} id={`NoEsPerezaMiniaturaV2-${n}`} component={BurnoutThumb2} defaultProps={{n}} durationInFrames={1} fps={30} width={1280} height={720} />
    ))}
    {['a', 'b', 'c', 'd'].map((v) => (
      <Composition key={`b3${v}`} id={`NoEsPerezaMiniatura3-${v}`} component={BurnoutThumb3Opt} defaultProps={{v}} durationInFrames={1} fps={30} width={1280} height={720} />
    ))}
    <Composition id="LaRiquezaDeOtros" component={RiquezaVideo} durationInFrames={Math.round(riquezaPlan.duration * 30)} fps={30} width={1920} height={1080} />
    {(riquezaShorts as any[]).map((s) => (
      <Composition key={`r${s.id}`} id={`LaRiquezaDeOtros${s.id}`} component={RiquezaShort} defaultProps={{id: s.id}} durationInFrames={Math.round(s.duration * 30)} fps={30} width={1080} height={1920} />
    ))}
    {[1, 2, 3].map((n) => (
      <Composition key={`rm${n}`} id={`LaRiquezaDeOtrosMiniaturaShort${n}`} component={RiquezaMiniShort} defaultProps={{n}} durationInFrames={1} fps={30} width={1080} height={1920} />
    ))}
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
      <Composition key={`rl${n}`} id={`LaRiquezaDeOtrosMiniatura${n}`} component={RiquezaMiniLargo} defaultProps={{n}} durationInFrames={1} fps={30} width={1280} height={720} />
    ))}
    <Composition id="AQueTeDedicas" component={DedicasVideo} durationInFrames={Math.max(1, Math.round(dedicasPlan.duration * 30))} fps={30} width={1920} height={1080} />
    {(dedicasShorts as any[]).map((s) => (
      <Composition key={`d${s.id}`} id={`AQueTeDedicas${s.id}`} component={DedicasShort} defaultProps={{id: s.id}} durationInFrames={Math.round(s.duration * 30)} fps={30} width={1080} height={1920} />
    ))}
  </>
);
