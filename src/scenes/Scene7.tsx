import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import tl from '../timeline.json';
import {Caption} from '../lib/Caption';
import {SANS} from '../lib/fonts';
import {clamp, easeIn, easeOut, heartbeat, prog} from '../lib/math';
import {rng} from '../lib/random';
import {PixelatedSvg} from '../lib/PixelatedSvg';
import {RemContent} from './Scene6';
import {TreeDefs, TreeLayer} from './Scene5';

// Escena 7 — «La noche robada»: el insomnio de Fincher con la frialdad de Black Mirror.
const EV = tl.events;
const GLITCH = new Set(EV.glitches);
const PHONE_IN = 50;

const zoomAt = (f: number) => {
  let z = 1;
  for (const [at, s] of EV.cuts) if (f >= at) z = s;
  return z + (f - PHONE_IN) * 0.0006;
};

const Card: React.FC<{i: number; age: number}> = ({i, age}) => {
  const q = rng(300 + i);
  const w1 = 90 + q() * 110;
  const w2 = 140 + q() * 80;
  const hue = ['#5a8dff', '#ff5a7a', '#36d1a6', '#ffb340', '#a57bff'][i % 5];
  const e = easeOut(clamp(age / 6));
  return (
    <div
      style={{
        height: 62,
        marginBottom: 10,
        borderRadius: 16,
        background: 'rgba(255,255,255,0.72)',
        boxShadow: '0 4px 18px rgba(30,60,120,0.18)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 14px',
        gap: 12,
        opacity: e,
        transform: `translateY(${(1 - e) * -26}px) scale(${0.96 + 0.04 * e})`,
      }}
    >
      <div style={{width: 34, height: 34, borderRadius: 10, background: hue, flexShrink: 0}} />
      <div>
        <div style={{width: w1, height: 9, borderRadius: 5, background: 'rgba(20,30,50,0.65)', marginBottom: 8}} />
        <div style={{width: w2, height: 7, borderRadius: 4, background: 'rgba(20,30,50,0.3)'}} />
      </div>
    </div>
  );
};

export const Scene7: React.FC = () => {
  const f = useCurrentFrame();
  const t = (1290 + f) / tl.fps;

  // Fase A: el sueño se corrompe y se pixela
  if (f < PHONE_IN) {
    const px = Math.round(1 + easeIn(prog(f, 4, PHONE_IN - 4)) * 47);
    const flood = easeIn(prog(f, 26, PHONE_IN));
    return (
      <AbsoluteFill style={{background: '#000'}}>
        {px <= 1 ? (
          <RemContent f={230 + f} />
        ) : (
          <PixelatedSvg block={px} saturation={1 - prog(f, 0, 40)}>
            <RemContent f={230 + f} />
          </PixelatedSvg>
        )}
        <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 50%, #ffffff 0%, #cfe2ff 40%, #9ab8ff 100%)', opacity: flood}} />
      </AbsoluteFill>
    );
  }

  // Fase B: la pantalla que no duerme
  const glitch = GLITCH.has(f);
  const g = rng(1000 + f);
  const shakeX = (g() - 0.5) * (glitch ? 60 : 4);
  const shakeY = (g() - 0.5) * (glitch ? 16 : 3);
  const zoom = zoomAt(f);
  const crt = prog(f, EV.crtOff, EV.crtOff + 6);
  const crt2 = prog(f, EV.crtOff + 6, EV.crtOff + 12);
  const off = f >= EV.crtOff + 14;
  const arrived = EV.notifications.filter((n) => n <= f);
  const beat = heartbeat(t, 43.4, 0.55, 49.3);
  const wither = prog(f, PHONE_IN, 185);
  const hour = f < 120 ? '03:47' : f < 165 ? '04:12' : '04:58';

  if (off) return <AbsoluteFill style={{background: '#000'}} />;

  const bars = glitch
    ? Array.from({length: 9}, () => ({y: g() * 1080, h: 2 + g() * 34, x: g() * 900, w: 300 + g() * 1400, c: ['#00f0ff', '#ff2a6a', '#ffffff', '#7a8cff'][Math.floor(g() * 4)]}))
    : [];

  return (
    <AbsoluteFill style={{background: '#000'}}>
      <AbsoluteFill
        style={{
          transform: `scale(${1 - crt2 * 0.999}, ${1 - crt * 0.996})`,
          filter: `brightness(${1 + crt * 2.5})${glitch && f % 3 === 0 ? ' invert(1) hue-rotate(180deg)' : ''}`,
        }}
      >
        <AbsoluteFill style={{background: 'radial-gradient(ellipse 55% 75% at 50% 50%, #26344e 0%, #0d121c 50%, #05070b 100%)'}} />
        <AbsoluteFill style={{transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoom})`}}>
          {/* el jardín de la memoria, marchitándose detrás */}
          <AbsoluteFill style={{filter: `grayscale(${0.6 + wither * 0.4}) brightness(${0.7 - wither * 0.35})`, opacity: 0.85}}>
            <svg width="1920" height="1080" viewBox="0 0 1920 1080">
              <TreeDefs />
              <g transform="translate(960 540) scale(1.0) translate(-960 -590)">
                <TreeLayer f={240} wither={wither} />
              </g>
            </svg>
          </AbsoluteFill>
          {/* derrame de luz fría */}
          <AbsoluteFill style={{background: 'radial-gradient(ellipse 40% 55% at 50% 50%, rgba(170,205,255,0.5) 0%, rgba(120,160,255,0.12) 45%, rgba(0,0,0,0) 75%)'}} />
          {/* el teléfono */}
          <div
            style={{
              position: 'absolute',
              left: 960 - 170,
              top: 540 - 350,
              width: 340,
              height: 700,
              borderRadius: 52,
              background: '#0a0d14',
              padding: 10,
              boxShadow: `0 0 ${140 + beat * 60}px ${40 + beat * 20}px rgba(170,205,255,0.45)`,
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 42,
                background: 'linear-gradient(180deg, #f4f8ff 0%, #d9e7ff 55%, #b9cff5 100%)',
                overflow: 'hidden',
                position: 'relative',
                fontFamily: SANS,
              }}
            >
              <div style={{textAlign: 'center', marginTop: 54, color: '#0f1a2e', fontWeight: 300, fontSize: 92, letterSpacing: '-0.02em', textShadow: glitch ? '4px 0 #ff2a6a, -4px 0 #00e0ff' : undefined}}>
                {hour}
              </div>
              <div style={{textAlign: 'center', color: 'rgba(15,26,46,0.55)', fontSize: 15, letterSpacing: '0.3em', marginTop: 2}}>AÚN DESPIERTO</div>
              <div style={{position: 'absolute', left: 14, right: 14, top: 210}}>
                {arrived
                  .slice(-6)
                  .reverse()
                  .map((n) => (
                    <Card key={n} i={EV.notifications.indexOf(n)} age={f - n} />
                  ))}
              </div>
              <div style={{position: 'absolute', top: 18, right: 22, minWidth: 26, height: 26, borderRadius: 13, background: '#ff3b5c', color: 'white', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: arrived.length ? 1 : 0}}>
                {arrived.length * 7 + 3}
              </div>
            </div>
          </div>
        </AbsoluteFill>
        {/* barras de glitch y scanlines */}
        {bars.map((b, i) => (
          <div key={i} style={{position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, background: b.c, opacity: 0.55, mixBlendMode: 'screen'}} />
        ))}
        <AbsoluteFill style={{background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)', opacity: 0.6}} />
        <Caption text="Quien le roba horas a la noche, se roba a sí mismo." from={66} to={186} y={985} size={52} color="#eef4ff" glow="rgba(160,200,255,0.5)" glitch={glitch ? 2.5 : 0.6} stagger={2} />
        {/* destello blanco del apagado CRT */}
        <AbsoluteFill style={{background: '#ffffff', opacity: crt * 0.85}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
