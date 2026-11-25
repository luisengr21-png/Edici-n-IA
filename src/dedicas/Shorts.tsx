import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {spr} from '../burnout/kit';
import {SceneT, Track} from './Dedicas';
import shorts from './shorts.json';

type W = [string, number, number];
type ShortT = {id: string; duration: number; scenes: SceneT[]; words: W[]};

const pages = (words: W[]) => {
  const out: W[][] = [];
  let cur: W[] = [];
  words.forEach((w) => {
    cur.push(w);
    if (cur.length >= 3 || /[.,:;?!…]$/.test(w[0])) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
};

// Subtítulos palabra por palabra, entre el 61 % y el 68 % de la altura (fuera de los botones de YouTube).
const Captions: React.FC<{words: W[]; T: number}> = ({words, T}) => {
  const pg = React.useMemo(() => pages(words), [words]);
  let idx = -1;
  for (let i = 0; i < pg.length; i++) if (pg[i][0][1] <= T + 0.05) idx = i;
  if (idx < 0) return null;
  const page = pg[idx];
  const last = page[page.length - 1];
  const next = pg[idx + 1];
  if (T > last[2] + 0.6 && (!next || T < next[0][1])) return null;
  const p = spr(T, page[0][1], 3, 0.55);
  return (
    <div style={{position: 'absolute', left: 60, width: 960, top: 1172, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0 30px', transform: `scale(${0.86 + 0.14 * p})`, transformOrigin: 'center top'}}>
      {page.map((w, k) => {
        const active = T >= w[1] - 0.03 && (k === page.length - 1 || T < page[k + 1][1] - 0.03);
        return (
          <span key={k} style={{fontFamily: 'Anton, sans-serif', fontSize: 112, lineHeight: 1.12, textTransform: 'uppercase', color: active ? '#FFB547' : '#FFFFFF', WebkitTextStroke: '14px #14121c', paintOrder: 'stroke fill', textShadow: '0 8px 24px rgba(0,0,0,0.6)', transform: `scale(${active ? 1.05 : 1})`, display: 'inline-block'}}>
            {w[0].replace(/[“”"«»]/g, '')}
          </span>
        );
      })}
    </div>
  );
};

export const DedicasShort: React.FC<{id: string; noCaps?: boolean}> = ({id, noCaps}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sh = (shorts as any[]).find((s) => s.id === id) as ShortT;
  return (
    <AbsoluteFill>
      <Track scenes={sh.scenes} />
      {!noCaps && <Captions words={sh.words} T={frame / fps} />}
    </AbsoluteFill>
  );
};
