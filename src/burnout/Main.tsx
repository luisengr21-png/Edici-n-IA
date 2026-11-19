import React from 'react';
import {AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {L, clamp, eo, hash, lerp, wobble} from './kit';
import {renderEl, El} from './elements';
import {Hud} from './extra';
import plan from './plan.json';

export type SceneT = {n: number; start: number; end: number; bg?: string; cam?: string; els?: El[]; glitch?: number; flash?: boolean; gray?: number; sepia?: boolean; hud?: number; env?: boolean; hudBlink?: boolean; shake?: number; sec: number; red?: number; paper?: number};

const BG: Record<string, string> = {
  slate: 'radial-gradient(ellipse at 50% 35%, #323949 0%, #1B1F2A 60%, #0d0f15 100%)',
  dark: 'radial-gradient(ellipse at 50% 40%, #2a2f3d 0%, #1B1F2A 55%, #0b0d12 100%)',
  black: '#050608',
  ember: 'radial-gradient(ellipse at 50% 75%, #6b2a12 0%, #2a130c 50%, #0b0706 100%)',
  ash: 'radial-gradient(ellipse at 50% 40%, #4a4e58 0%, #2b2e36 60%, #15171c 100%)',
  cream: 'radial-gradient(ellipse at 50% 40%, #FBF7F0 0%, #F5EFE6 60%, #E6DCCB 100%)',
  warm: 'radial-gradient(ellipse at 50% 40%, #7a4a2a 0%, #3b2620 55%, #1B1F2A 100%)',
  green: 'radial-gradient(ellipse at 50% 40%, #1f5a3a 0%, #133826 60%, #08170f 100%)',
  red: 'radial-gradient(ellipse at 50% 40%, #6a1f1f 0%, #351010 60%, #150707 100%)',
  blue: 'radial-gradient(ellipse at 50% 40%, #27406b 0%, #172744 60%, #0a1222 100%)',
  // cuarto de tarde con luz entre la persiana
  afternoon: 'linear-gradient(180deg, #3b2d33 0%, #2a2230 62%, #3a2b2a 62.2%, #4a3630 100%)',
  room: 'linear-gradient(180deg, #2b3040 0%, #20242f 64%, #2f2b33 64.2%, #3b343b 100%)',
  cinema: 'linear-gradient(180deg, #120c14 0%, #0a070c 100%)',
  grid: '#1B1F2A',
};

const Dust: React.FC<{t: number; n?: number; c?: string}> = ({t, n = 24, c = 'rgba(255,200,150,0.5)'}) => (
  <>
    {Array.from({length: n}).map((_, k) => {
      const x = (hash(k) * 1920 + t * (10 + hash(k + 3) * 25)) % 1980;
      const y = (hash(k + 11) * 1080 - t * (6 + hash(k + 5) * 14) + 1080 * 5) % 1080;
      const s = 2 + hash(k + 2) * 5;
      return <div key={k} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: c, opacity: 0.3 + 0.5 * Math.abs(Math.sin(t * 0.8 + k))}} />;
    })}
  </>
);

export const Background: React.FC<{kind: string; t: number; w: number; h: number}> = ({kind, t, w, h}) => (
  <AbsoluteFill style={{background: BG[kind] ?? BG.slate}}>
    {kind === 'grid' && <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)', backgroundSize: '80px 80px'}} />}
    {kind === 'afternoon' && (
      <>
        {/* ventana con persiana y franjas de luz dorada */}
        <div style={{position: 'absolute', left: w * 0.62, top: h * 0.1, width: w * 0.22, height: h * 0.4, background: 'linear-gradient(180deg,#ffcf8a,#f29a4a)', boxShadow: '0 0 120px rgba(255,170,90,0.6)'}} />
        {Array.from({length: 9}).map((_, k) => <div key={k} style={{position: 'absolute', left: w * 0.62, top: h * 0.1 + k * h * 0.045, width: w * 0.22, height: h * 0.022, background: '#5a3b2c'}} />)}
        {Array.from({length: 7}).map((_, k) => (
          <div key={'r' + k} style={{position: 'absolute', left: w * 0.05, top: h * 0.5 + k * 46, width: w * 0.7, height: 18, background: 'rgba(255,190,110,0.12)', transform: 'skewX(-35deg)', filter: 'blur(2px)', opacity: 0.7 + 0.3 * Math.sin(t * 0.5 + k)}} />
        ))}
        <Dust t={t} c="rgba(255,210,150,0.6)" />
      </>
    )}
    {(kind === 'slate' || kind === 'dark' || kind === 'ash') && <Dust t={t} c="rgba(210,215,230,0.35)" />}
    {(kind === 'ember' || kind === 'warm') && <Dust t={t} n={30} c="rgba(255,150,80,0.65)" />}
    {kind === 'room' && <div style={{position: 'absolute', left: w * 0.7, top: h * 0.12, width: 260, height: 320, border: '10px solid #3a4152', background: 'linear-gradient(180deg,#141823,#252b3b)'}} />}
    {kind === 'cinema' && <div style={{position: 'absolute', left: w * 0.5 - 620, top: 90, width: 1240, height: 560, background: 'radial-gradient(ellipse at 50% 50%, rgba(170,190,255,0.35), rgba(60,70,110,0.15) 70%)', boxShadow: '0 0 160px rgba(140,160,255,0.35)'}} />}
  </AbsoluteFill>
);

const camT = (cam: string | undefined, t: number, d: number, n: number) => {
  const u = clamp(t / Math.max(d, 0.5));
  switch (cam) {
    case 'still':
      return '';
    case 'pull':
      return `scale(${lerp(1.08, 1.0, u)})`;
    case 'push':
      return `scale(${lerp(1.0, 1.1, u)})`;
    case 'panl':
      return `scale(1.06) translateX(${lerp(40, -40, u)}px)`;
    case 'panr':
      return `scale(1.06) translateX(${lerp(-40, 40, u)}px)`;
    case 'up':
      return `scale(1.06) translateY(${lerp(40, -40, u)}px)`;
    default:
      return `scale(${lerp(1.0, 1.06, u)}) translate(${(n % 2 ? 1 : -1) * u * 14}px, ${u * -8}px)`;
  }
};

export const SceneView: React.FC<{sc: SceneT; T: number; w: number; h: number; hud?: boolean}> = ({sc, T, w, h, hud = true}) => {
  const t = T - sc.start;
  const d = sc.end - sc.start;
  const punch = 1 + 0.05 * (1 - eo(t, 0, 0.22));
  const sh = sc.shake != null ? wobble(t, sc.shake, 18, 9, 7) : 0;
  const gl = sc.glitch != null && t > sc.glitch && t < sc.glitch + 0.6;
  const filter = [sc.gray ? `grayscale(${clamp((t - sc.gray) / 0.6)})` : '', sc.sepia ? 'sepia(0.85) contrast(1.05)' : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: filter || undefined}}>
      <AbsoluteFill style={{transform: `${camT(sc.cam, t, d, sc.n)} scale(${punch}) translate(${sh}px, ${sh * 0.4}px)`}}>
        <Background kind={sc.bg ?? 'slate'} t={T} w={w} h={h} />
        {(sc.els ?? []).map((e, i) => renderEl(e, t, i))}
      </AbsoluteFill>
      {/* textura de papel granulado de Envato sobre toda la ilustración */}
      <AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'overlay', opacity: sc.paper ?? 0.35}}>
        <Img src={staticFile('burnout/graficos/textura.png')} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `translate(${(Math.floor(T * 8) % 3) * 6}px, ${(Math.floor(T * 8) % 2) * 6}px) scale(1.02)`}} />
      </AbsoluteFill>
      {hud && sc.hud != null && sc.hud >= 0 && <Hud n={sc.hud} t={T} env={sc.env !== false} blinkAll={sc.hudBlink} />}
      {hud && sc.hud == null && sc.env && <Hud n={-1} t={T} env />}
      {gl && (
        <AbsoluteFill style={{mixBlendMode: 'screen'}}>
          {[0, 1, 2].map((k) => (
            <div key={k} style={{position: 'absolute', left: 0, right: 0, top: hash(Math.floor(T * 30) + k) * h, height: 20 + hash(k + Math.floor(T * 30)) * 80, background: ['rgba(255,0,60,0.35)', 'rgba(0,255,220,0.3)', 'rgba(255,255,255,0.25)'][k], transform: `translateX(${(hash(k + Math.floor(T * 60)) - 0.5) * 120}px)`}} />
          ))}
        </AbsoluteFill>
      )}
      {sc.flash && <AbsoluteFill style={{background: '#fff', opacity: 1 - eo(t, 0, 0.35)}} />}
    </AbsoluteFill>
  );
};

const scenes = (plan as any).scenes as SceneT[];
export const findScene = (list: SceneT[], T: number) => {
  let lo = 0, hi = list.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (list[mid].start <= T) lo = mid;
    else hi = mid - 1;
  }
  return list[lo];
};

// Cada escena va en su propio Sequence: así los clips y overlays empiezan desde su primer cuadro.
export const SceneSeq: React.FC<{sc: SceneT; w: number; h: number; hud?: boolean}> = ({sc, w, h, hud}) => {
  const {fps} = useVideoConfig();
  const from = Math.round(sc.start * fps);
  return (
    <Sequence from={from} durationInFrames={Math.max(1, Math.round(sc.end * fps) - from)} layout="none">
      <Inner sc={sc} w={w} h={h} from={from} hud={hud} />
    </Sequence>
  );
};
const Inner: React.FC<{sc: SceneT; w: number; h: number; from: number; hud?: boolean}> = ({sc, w, h, from, hud}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return <SceneView sc={sc} T={(f + from) / fps} w={w} h={h} hud={hud} />;
};

export const BurnoutVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const T = frame / fps;
  const sc = findScene(scenes, T);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneSeq key={sc.n} sc={sc} w={width} h={height} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
export const _L = L;
