import React from 'react';
import {rng} from './random';
import {clamp} from './math';

// Ciudad en capas de papel recortado: tres planos de profundidad con parallax.
export const HORIZON = 720;

type Win = {x: number; y: number; w: number; h: number; lit: boolean; toggle: number};
type Building = {x: number; w: number; h: number; roof: number; wins: Win[]};

type LayerCfg = {
  seed: number;
  hMin: number;
  hMax: number;
  wMin: number;
  wMax: number;
  gap: number;
  win?: {w: number; h: number; sx: number; sy: number};
  speed: number;
};

const LAYERS: LayerCfg[] = [
  {seed: 21, hMin: 150, hMax: 330, wMin: 50, wMax: 130, gap: 4, speed: 0.12},
  {seed: 22, hMin: 210, hMax: 470, wMin: 80, wMax: 170, gap: 14, speed: 0.4, win: {w: 7, h: 10, sx: 19, sy: 27}},
  {seed: 23, hMin: 150, hMax: 430, wMin: 150, wMax: 270, gap: 60, speed: 0.85, win: {w: 11, h: 16, sx: 30, sy: 40}},
];

const build = (cfg: LayerCfg): Building[] => {
  const r = rng(cfg.seed);
  const out: Building[] = [];
  let x = -320;
  while (x < 1920 + 420) {
    const w = cfg.wMin + r() * (cfg.wMax - cfg.wMin);
    const h = cfg.hMin + r() * (cfg.hMax - cfg.hMin);
    const wins: Win[] = [];
    if (cfg.win) {
      const {w: ww, h: wh, sx, sy} = cfg.win;
      const cols = Math.floor((w - 16) / sx);
      const rows = Math.floor((h - 30) / sy);
      const ox = x + (w - cols * sx) / 2 + (sx - ww) / 2;
      for (let cy = 0; cy < rows; cy++) {
        for (let cx = 0; cx < cols; cx++) {
          wins.push({
            x: ox + cx * sx,
            y: 1080 - h + 22 + cy * sy,
            w: ww,
            h: wh,
            lit: r() < 0.5,
            toggle: r(),
          });
        }
      }
    }
    out.push({x, w, h, roof: Math.floor(r() * 4), wins});
    x += w + cfg.gap * (0.3 + r());
  }
  return out;
};

const DATA = LAYERS.map(build);

export type CityPalette = {layers: [string, string, string]; window: string; rim?: string};

type Props = {
  f: number;
  mode: 'dusk' | 'dawn';
  palette: CityPalette;
  blurFar?: number;
  travel?: number; // multiplicador del travelling lateral
};

const Roof: React.FC<{b: Building; color: string}> = ({b, color}) => {
  const top = 1080 - b.h;
  if (b.roof === 1)
    return <rect x={b.x + b.w * 0.5 - 1.5} y={top - 46} width={3} height={46} fill={color} />;
  if (b.roof === 2)
    return <rect x={b.x + b.w * 0.2} y={top - 22} width={b.w * 0.6} height={22} fill={color} />;
  if (b.roof === 3)
    return (
      <g fill={color}>
        <rect x={b.x + b.w * 0.62} y={top - 30} width={b.w * 0.2} height={18} />
        <rect x={b.x + b.w * 0.64} y={top - 12} width={2} height={12} />
        <rect x={b.x + b.w * 0.78} y={top - 12} width={2} height={12} />
      </g>
    );
  return null;
};

export const City: React.FC<Props> = ({f, mode, palette, blurFar = 2.2, travel = 1}) => {
  // Ventanas: al anochecer se apagan una a una; al amanecer se encienden.
  const winAlpha = (w: Win) => {
    if (mode === 'dusk') {
      if (!w.lit) return 0;
      if (w.toggle > 0.85) return 1; // algunos insomnes resisten
      const tOff = 20 + w.toggle * 210;
      return 1 - clamp((f - tOff) / 5);
    }
    if (w.toggle > 0.5) return 0;
    const tOn = 40 + w.toggle * 2 * 130;
    return clamp((f - tOn) / 6);
  };

  return (
    <g>
      <defs>
        <filter id="cityFar" x="-5%" y="-5%" width="110%" height="110%">
          <feGaussianBlur stdDeviation={blurFar} />
        </filter>
        <filter id="winGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation={5} />
        </filter>
      </defs>
      {DATA.map((layer, li) => {
        const dx = -f * LAYERS[li].speed * travel;
        const color = palette.layers[li];
        const lit = layer.flatMap((b) => b.wins.map((w) => ({w, a: winAlpha(w)}))).filter((o) => o.a > 0.01);
        return (
          <g key={li} transform={`translate(${dx} 0)`} filter={li === 0 ? 'url(#cityFar)' : undefined}>
            {layer.map((b, bi) => (
              <g key={bi}>
                <rect x={b.x} y={1080 - b.h} width={b.w} height={b.h} fill={color} />
                <Roof b={b} color={color} />
                {palette.rim && li > 0 ? (
                  <rect x={b.x} y={1080 - b.h} width={b.w} height={2} fill={palette.rim} opacity={0.55} />
                ) : null}
              </g>
            ))}
            {lit.length > 0 ? (
              <>
                <g filter="url(#winGlow)" opacity={0.85}>
                  {lit.map(({w, a}, i) => (
                    <rect key={i} x={w.x - 2} y={w.y - 2} width={w.w + 4} height={w.h + 4} fill={palette.window} opacity={a} />
                  ))}
                </g>
                <g>
                  {lit.map(({w, a}, i) => (
                    <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} fill={palette.window} opacity={a} />
                  ))}
                </g>
              </>
            ) : null}
          </g>
        );
      })}
    </g>
  );
};
