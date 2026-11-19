import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {L, SANS, spr} from './kit';
import {SceneSeq, SceneT} from './Main';
import shorts from './shorts.json';

type W = {w: string; s: number; e: number};
type ShortT = {id: string; duration: number; scenes: SceneT[]; words: W[]};

// Agrupa palabras en "páginas" de hasta 3 palabras; corta en puntuación fuerte.
const pages = (words: W[]) => {
  const out: W[][] = [];
  let cur: W[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[.,:;?!…]$/.test(w.w)) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
};

// Subtítulos: entre el 52 % y el 65 % de la altura (fuera de los botones y del título de YouTube)
const Captions: React.FC<{words: W[]; T: number}> = ({words, T}) => {
  const pg = React.useMemo(() => pages(words), [words]);
  let idx = -1;
  for (let i = 0; i < pg.length; i++) if (pg[i][0].s <= T + 0.05) idx = i;
  if (idx < 0) return null;
  const page = pg[idx];
  const last = page[page.length - 1];
  const next = pg[idx + 1];
  if (T > last.e + 0.6 && (!next || T < next[0].s)) return null;
  const p = spr(T, page[0].s, 3, 0.55);
  return (
    <div style={{position: 'absolute', left: 90, width: 820, top: 1170, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 36px', transform: `scale(${0.85 + 0.15 * p})`, transformOrigin: 'center top'}}>
      {page.map((w, k) => {
        const on = T >= w.s - 0.03 && (T < w.e + 0.1 || k === page.length - 1);
        const active = T >= w.s - 0.03 && (k === page.length - 1 || T < page[k + 1].s - 0.03);
        return (
          <span key={k} style={{fontFamily: SANS, fontWeight: 900, fontSize: 96, lineHeight: 1.15, textTransform: 'uppercase', color: active ? L.gold : L.white, opacity: on || T > w.s ? 1 : 0.92, WebkitTextStroke: '14px #0E1226', paintOrder: 'stroke fill', textShadow: '0 8px 24px rgba(0,0,0,0.6)', transform: `scale(${active ? 1.04 : 1})`, display: 'inline-block'}}>
            {w.w.replace(/[“”"]/g, '')}
          </span>
        );
      })}
    </div>
  );
};

export const ShortVideo: React.FC<{id: string}> = ({id}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const T = frame / fps;
  const sh = (shorts as any[]).find((s) => s.id === id) as ShortT;
  let sc = sh.scenes[0];
  for (const s of sh.scenes) if (s.start <= T) sc = s;
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <SceneSeq key={sc.n} sc={sc} w={width} h={height} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.5) 100%)'}} />
      <Captions words={sh.words} T={T} />
    </AbsoluteFill>
  );
};
