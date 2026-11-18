import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {L, clamp, eo, hash, lerp, wobble} from './kit';
import {renderEl, Puzzle, El} from './elements';
import plan from './plan.json';

export type SceneT = {n: number; start: number; end: number; bg?: string; cam?: string; els?: El[]; glitch?: number; flash?: boolean; gray?: number; sepia?: boolean; hud?: boolean | number; shake?: number; sec: number; red?: number};

const BG: Record<string, string> = {
  dark: 'radial-gradient(ellipse at 50% 40%, #2c2633 0%, #17151c 55%, #0c0b0f 100%)',
  black: '#000',
  cream: 'radial-gradient(ellipse at 50% 40%, #FBF6EC 0%, #EFE5D2 60%, #DDCFB6 100%)',
  shop: 'linear-gradient(180deg, #2b2019 0%, #1a130e 58%, #3a3029 58.2%, #6b5c50 100%)',
  sepia: 'radial-gradient(ellipse at 50% 45%, #5a4128 0%, #2e2113 65%, #150e07 100%)',
  grid: '#141318',
  night: 'radial-gradient(ellipse at 50% 30%, #2a3766 0%, #121a36 60%, #070a17 100%)',
  green: 'radial-gradient(ellipse at 50% 40%, #2f7f74 0%, #18463f 60%, #0b211e 100%)',
  red: 'radial-gradient(ellipse at 50% 40%, #5a1419 0%, #2a080b 60%, #110406 100%)',
  snow: 'linear-gradient(180deg, #dce9f2 0%, #a9c1d1 100%)',
  beach: 'linear-gradient(180deg, #7fc8f8 0%, #bfe6ff 55%, #f2d49b 55.2%, #e9c27c 100%)',
  purple: 'radial-gradient(ellipse at 50% 40%, #3b1e4a 0%, #1a0d22 65%, #0b0510 100%)',
  gold: 'radial-gradient(ellipse at 50% 45%, #fff3c4 0%, #e8c65a 45%, #8c6d12 100%)',
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
    {kind === 'shop' && (
      <>
        {[0.2, 0.5, 0.8].map((x, k) => (
          <div key={k} style={{position: 'absolute', left: w * x - 260, top: -40, width: 520, height: h * 0.75, background: 'radial-gradient(ellipse at 50% 0%, rgba(255,225,160,0.32), transparent 70%)', clipPath: 'polygon(40% 0, 60% 0, 100% 100%, 0 100%)'}} />
        ))}
        {[0.15, 0.4, 0.65, 0.9].map((x, k) => (
          <div key={k} style={{position: 'absolute', left: w * x - 2, top: h * 0.585, width: 4, height: h * 0.42, background: 'rgba(255,255,255,0.08)', transform: `skewX(${(x - 0.5) * 60}deg)`}} />
        ))}
      </>
    )}
    {(kind === 'dark' || kind === 'purple' || kind === 'green' || kind === 'night') && <Dust t={t} c={kind === 'green' ? 'rgba(170,255,230,0.5)' : undefined} />}
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

// Contador de piezas en la esquina: aparece desde que se anuncia la fórmula
const Hud: React.FC<{sc: SceneT; T: number}> = ({sc, T}) => {
  if (sc.hud === false || sc.n < 20) return null;
  const done = sc.sec >= 5 ? 4 : Math.max(0, sc.sec - 1);
  const active = sc.sec >= 1 && sc.sec <= 4 ? sc.sec : 0;
  return (
    <div style={{opacity: clamp((T - (plan as any).hudFrom) / 0.6)}}>
      <Puzzle x={1770} y={74} size={42} active={active} done={done} red={sc.red ?? 0} t={99} />
    </div>
  );
};

export const LujoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const T = frame / fps;
  const sc = findScene(scenes, T);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneView sc={sc} T={T} w={width} h={height} />
      <Hud sc={sc} T={T} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 60%, rgba(0,0,0,0.45) 100%)', pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
