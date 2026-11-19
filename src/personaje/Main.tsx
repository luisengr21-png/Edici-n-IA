import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {L, clamp, eo, hash, lerp, wobble} from './kit';
import {renderEl, El} from './elements';
import plan from './plan.json';

export type SceneT = {n: number; start: number; end: number; bg?: string; cam?: string; els?: El[]; glitch?: number; flash?: boolean; gray?: number; sepia?: boolean; hud?: boolean | number; shake?: number; sec: number; red?: number};

const BG: Record<string, string> = {
  night: 'radial-gradient(ellipse at 50% 30%, #26315c 0%, #141B33 60%, #080b18 100%)',
  dark: 'radial-gradient(ellipse at 50% 40%, #232b4a 0%, #141B33 55%, #0a0e1f 100%)',
  black: '#000',
  cream: 'radial-gradient(ellipse at 50% 40%, #FBF7F0 0%, #F5EFE6 60%, #E6DccB 100%)',
  warm: 'radial-gradient(ellipse at 50% 45%, #5a3f2a 0%, #2c2033 60%, #141B33 100%)',
  amber: 'radial-gradient(ellipse at 50% 45%, #ffe3b0 0%, #F2A541 55%, #9a5a1c 100%)',
  mint: 'radial-gradient(ellipse at 50% 40%, #2f7f74 0%, #18463f 60%, #0b211e 100%)',
  coral: 'radial-gradient(ellipse at 50% 40%, #6a2330 0%, #34121c 60%, #140710 100%)',
  party: 'radial-gradient(ellipse at 50% 35%, #3b2a5e 0%, #1b1838 60%, #0a0a1a 100%)',
  street: 'linear-gradient(180deg, #2b3560 0%, #1a2142 62%, #39405e 62.2%, #4a5170 100%)',
  room: 'linear-gradient(180deg, #1f2747 0%, #172039 64%, #2a2440 64.2%, #3a3150 100%)',
  stage: 'linear-gradient(180deg, #2a0f1f 0%, #14081a 70%, #3b2a1c 70.2%, #5a4128 100%)',
  snow: 'linear-gradient(180deg, #dce9f2 0%, #a9c1d1 100%)',
  sepia: 'radial-gradient(ellipse at 50% 45%, #5a4128 0%, #2e2113 65%, #150e07 100%)',
  grid: '#141B33',
};

const Dust: React.FC<{t: number; n?: number; c?: string}> = ({t, n = 26, c = 'rgba(245,215,120,0.55)'}) => (
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
  <AbsoluteFill style={{background: BG[kind] ?? BG.dark}}>
    {kind === 'grid' && <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.05) 2px, transparent 2px)', backgroundSize: '80px 80px'}} />}
    {false && (
      <>
        {[0.2, 0.5, 0.8].map((x, k) => (
          <div key={k} style={{position: 'absolute', left: w * x - 260, top: -40, width: 520, height: h * 0.75, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,225,160,0.32), transparent 70%)', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)'}} />
        ))}
        {[0.15, 0.4, 0.65, 0.9].map((x, k) => (
          <div key={k} style={{position: 'absolute', left: w * x - 2, top: h * 0.585, width: 4, height: h * 0.42, background: 'rgba(255,255,255,0.08)', transform: `skewX(${(x - 0.5) * 60}deg)`}} />
        ))}
      </>
    )}
    {(kind === 'dark' || kind === 'night' || kind === 'party' || kind === 'warm' || kind === 'mint') && <Dust t={t} c={kind === 'mint' ? 'rgba(170,255,230,0.5)' : kind === 'night' || kind === 'dark' ? 'rgba(200,215,255,0.45)' : 'rgba(255,208,138,0.55)'} />}
    {kind === 'party' && [0.2, 0.45, 0.7, 0.88].map((x, k) => <div key={k} style={{position: 'absolute', left: w * x - 90, top: h * (0.15 + 0.2 * (k % 2)), width: 180, height: 180, borderRadius: '50%', background: ['#7FD8C9', '#FF8FB1', '#F2A541', '#8fa8ff'][k], filter: 'blur(60px)', opacity: 0.35 + 0.15 * Math.sin(t * 2 + k)}} />)}
    {(kind === 'room' || kind === 'street') && <div style={{position: 'absolute', left: w * 0.72, top: h * 0.12, width: 260, height: 320, border: '10px solid #2f3a66', background: kind === 'room' ? 'linear-gradient(180deg,#0e1430,#1d2a5a)' : 'transparent', opacity: kind === 'room' ? 1 : 0}} />}
    {kind === 'snow' && <Dust t={t * 4} n={60} c="rgba(255,255,255,0.9)" />}
    {kind === 'sepia' && <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(90deg, rgba(0,0,0,0.0) 0px, rgba(0,0,0,0.0) 140px, rgba(255,230,190,0.04) 141px, rgba(0,0,0,0) 143px)'}} />}
  </AbsoluteFill>
);

const camT = (cam: string | undefined, t: number, d: number, n: number) => {
  const u = clamp(t / Math.max(d, 0.5));
  switch (cam) {
    case 'still':
      return '';
    case 'pull':
      return `scale(${lerp(1.08, 1.0, u)})`;
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

export const SceneView: React.FC<{sc: SceneT; T: number; w: number; h: number}> = ({sc, T, w, h}) => {
  const t = T - sc.start;
  const d = sc.end - sc.start;
  const punch = 1 + 0.05 * (1 - eo(t, 0, 0.22));
  const sh = sc.shake ? wobble(t, sc.shake, 18, 9, 7) : 0;
  const gl = sc.glitch != null && t > sc.glitch && t < sc.glitch + 0.6;
  const filter = [sc.gray ? `grayscale(${clamp((t - sc.gray) / 0.6)})` : '', sc.sepia ? 'sepia(0.85) contrast(1.05)' : ''].join(' ').trim();
  return (
    <AbsoluteFill style={{overflow: 'hidden', filter: filter || undefined}}>
      <AbsoluteFill style={{transform: `${camT(sc.cam, t, d, sc.n)} scale(${punch}) translate(${sh}px, ${sh * 0.4}px)`}}>
        <Background kind={sc.bg ?? 'dark'} t={T} w={w} h={h} />
        {(sc.els ?? []).map((e, i) => renderEl(e, t, i))}
      </AbsoluteFill>
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
const findScene = (list: SceneT[], T: number) => {
  let lo = 0, hi = list.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (list[mid].start <= T) lo = mid;
    else hi = mid - 1;
  }
  return list[lo];
};

export const PersonajeVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const T = frame / fps;
  const sc = findScene(scenes, T);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneView sc={sc} T={T} w={width} h={height} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
