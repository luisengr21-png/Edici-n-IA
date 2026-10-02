import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SERIF} from './fonts';
import {easeOut, prog} from './math';

type Props = {
  text: string;
  from: number;
  to: number;
  y?: number;
  size?: number;
  color?: string;
  glow?: string;
  glitch?: number; // intensidad de aberración cromática 0..1
  stagger?: number;
};

// Verso en pantalla: cada palabra emerge del desenfoque, como un pensamiento que se aclara
export const Caption: React.FC<Props> = ({
  text,
  from,
  to,
  y = 880,
  size = 60,
  color = '#f3ead8',
  glow = 'rgba(255,240,215,0.35)',
  glitch = 0,
  stagger = 3,
}) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f > to + 1) return null;
  const out = prog(f, to - 18, to);
  let idx = 0;
  const lines = text.split('\n');
  const gx = glitch * (3 + 4 * Math.sin(f * 1.7));
  const shadow =
    glitch > 0
      ? `${gx}px 0 rgba(255,40,80,0.75), ${-gx}px 0 rgba(40,220,255,0.75), 0 0 24px ${glow}`
      : `0 0 28px ${glow}, 0 2px 22px rgba(0,0,0,0.55)`;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: y,
        transform: 'translateY(-50%)',
        textAlign: 'center',
        fontFamily: SERIF,
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: size,
        lineHeight: 1.22,
        letterSpacing: '0.01em',
        color,
        textShadow: shadow,
        opacity: 1 - out,
        filter: out > 0 ? `blur(${out * 8}px)` : undefined,
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.split(' ').map((w, wi) => {
            const start = from + idx++ * stagger;
            const t = easeOut(prog(f, start, start + 20));
            return (
              <span
                key={wi}
                style={{
                  display: 'inline-block',
                  marginRight: '0.26em',
                  opacity: t,
                  transform: `translateY(${(1 - t) * 14}px)`,
                  filter: t < 1 ? `blur(${(1 - t) * 10}px)` : undefined,
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};
