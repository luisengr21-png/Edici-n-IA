import React from 'react';
import {Img, Loop, OffthreadVideo, staticFile, useVideoConfig} from 'remotion';
import {L, SANS, TITLE, EMOJI, clamp, lerp, eo, eio, spr, wobble, hash, color} from './kit';
import {El, Pos} from './elements';

// ════════════ Elementos propios de «No es pereza, es burnout» ════════════
// Recursos de Envato en public/burnout/{3d,fotos,graficos,fuentes,stock}.

const grayF = (e: El, t: number) => (e.gray != null ? `grayscale(${e.grayAt != null ? eo(t, e.grayAt, e.grayDur ?? 0.8) * e.gray : e.gray})` : '');

// Llamas dibujadas sobre un punto (cerillo, vela, mecha)
const Flame: React.FC<{x: number; y: number; s?: number; t: number; on: number; seed?: number}> = ({x, y, s = 1, t, on, seed = 0}) => {
  if (on <= 0.01) return null;
  const fl = 1 + 0.08 * Math.sin(t * 23 + seed) + 0.05 * Math.sin(t * 37 + seed * 2);
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-92%) scale(${s * on * fl}, ${s * on * (2 - fl)})`, transformOrigin: '50% 92%', pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: -70, top: -70, width: 140, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse at 50% 60%, rgba(255,160,60,0.55), transparent 65%)', filter: 'blur(6px)'}} />
      <svg width={60} height={110} viewBox="-30 -100 60 110" style={{overflow: 'visible', position: 'relative'}}>
        <path d="M0 -96 C22 -60 26 -30 18 -10 C12 4 -12 4 -18 -10 C-26 -30 -20 -60 0 -96 Z" fill="#FF7A3D" />
        <path d="M0 -70 C12 -46 14 -26 9 -12 C5 -3 -5 -3 -9 -12 C-14 -26 -10 -46 0 -70 Z" fill="#FFD27A" />
        <path d="M0 -40 C5 -28 6 -18 3 -10 C1 -6 -1 -6 -3 -10 C-6 -18 -5 -28 0 -40 Z" fill="#fff6d6" />
      </svg>
    </div>
  );
};

const Smoke: React.FC<{x: number; y: number; t: number; at: number; s?: number}> = ({x, y, t, at, s = 1}) => {
  if (t < at) return null;
  return (
    <>
      {Array.from({length: 7}).map((_, k) => {
        const u = ((t - at) * 0.55 + k / 7) % 1;
        const life = clamp((t - at) * 1.5) * (1 - u);
        return <div key={k} style={{position: 'absolute', left: x + Math.sin(u * 6 + k) * 26 * s * u, top: y - u * 260 * s, width: (26 + u * 70) * s, height: (26 + u * 70) * s, transform: 'translate(-50%,-50%)', borderRadius: '50%', background: 'rgba(200,205,215,0.5)', filter: 'blur(10px)', opacity: life * 0.8}} />;
      })}
    </>
  );
};

// Imagen de Envato: objeto 3D (PNG con alfa), foto en marco, ícono o gráfico
const ImgEl: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const w = e.w ?? 700;
  const tilt = e.tilt3d ? Math.sin(t * 0.9 + i) * 9 : 0;
  const kb = 1 + (e.kb ?? 0) * t;
  const shake = e.shake ? Math.sin(t * 47) * e.shake : 0;
  const glow = color(e.glow);
  const pulse = e.pulse ? 0.65 + 0.35 * Math.abs(Math.sin(t * e.pulse)) : 1;
  const filter = [glow ? `drop-shadow(0 0 ${40 * pulse}px ${glow}) drop-shadow(0 0 ${90 * pulse}px ${glow}88)` : 'drop-shadow(0 30px 40px rgba(0,0,0,0.55))', grayF(e, t), e.bright ? `brightness(${e.bright})` : '', e.char != null ? `brightness(${lerp(1, 0.25, eo(t, e.char, 1.2))}) sepia(${0.6 * eo(t, e.char, 1.2)})` : ''].join(' ').trim();
  const frame = e.frame;
  const inner = (
    <div style={{position: 'relative', width: w, transform: `perspective(1400px) rotateY(${tilt}deg) scale(${kb}) translateX(${shake}px) scaleX(${e.flipX ? -1 : 1})`}}>
      <Img src={staticFile(e.src)} style={{width: w, height: e.h ?? 'auto', objectFit: e.h ? 'cover' : undefined, objectPosition: e.pos ?? 'center', display: 'block', filter: frame ? grayF(e, t) || undefined : filter, borderRadius: frame === 'round' ? '50%' : frame === 'card' ? 28 : 0}} />
      {/* llamas sobre puntos normalizados de la imagen (p. ej. la cabeza de un cerillo) */}
      {(e.flames ?? []).map((f: number[], k: number) => {
        const on = e.fireAt != null ? eo(t, e.fireAt + k * 0.05, 0.25) * (e.fireOut != null ? 1 - eo(t, e.fireOut, 0.3) : 1) : 1;
        return <Flame key={k} x={f[0] * w} y={f[1] * w} s={f[2] ?? 1} t={t} on={on} seed={k} />;
      })}
      {e.fireOut != null && (e.flames ?? []).map((f: number[], k: number) => <Smoke key={'s' + k} x={f[0] * w} y={f[1] * w} t={t} at={e.fireOut + 0.1} s={0.8} />)}
      {/* pantalla dibujada encima del celular 3D (tapa la hora y la batería originales) */}
      {e.screen && (
        <div style={{position: 'absolute', left: e.screen[0] * w, top: e.screen[1] * w, width: e.screen[2] * w, height: e.screen[3] * w, borderRadius: w * 0.035, background: 'linear-gradient(180deg,#141824,#0b0d14)', transform: `skewY(${e.screen[4] ?? 0}deg)`, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 0 30px rgba(0,0,0,0.8)'}}>
          {e.battery && <BatteryIcon level={e.battery.from != null ? lerp(e.battery.from, e.battery.to, eio(t, e.battery.at ?? 0.3, e.battery.dur ?? 2)) : e.battery.to} t={t} w={e.screen[2] * w * 0.62} blink={e.battery.blink} charge={e.battery.charge} />}
        </div>
      )}
    </div>
  );
  return (
    <Pos e={e} t={t} i={i} idle={e.idle}>
      {frame === 'polaroid' ? (
        <div style={{background: '#fff', padding: '22px 22px 80px', borderRadius: 6, boxShadow: '0 30px 70px rgba(0,0,0,0.5)', filter: grayF(e, t) || undefined}}>{inner}</div>
      ) : frame === 'card' ? (
        <div style={{borderRadius: 34, padding: 10, background: `linear-gradient(160deg, ${glow ?? L.gold}, ${L.goldD})`, boxShadow: `0 30px 70px rgba(0,0,0,0.55), 0 0 60px ${(glow ?? L.gold) + '55'}`}}>{inner}</div>
      ) : (
        inner
      )}
    </Pos>
  );
};

// Overlay animado con alfa de Envato (brasas, neblina) — webm VP9 con transparencia
const Overlay: React.FC<{e: El; t: number}> = ({e, t}) => {
  const {fps} = useVideoConfig();
  const op = (e.op ?? 0.8) * eo(t, e.at ?? 0, e.fade ?? 0.8) * (e.out != null ? 1 - eo(t, e.out, 0.6) : 1);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: op, mixBlendMode: e.blend ?? 'screen', pointerEvents: 'none', transform: e.flip ? 'scaleX(-1)' : undefined}}>
      <Loop durationInFrames={Math.round((e.len ?? 10) * fps)}>
        <OffthreadVideo src={staticFile(e.src)} transparent muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </Loop>
    </div>
  );
};

// Neblina dibujada (capas que se desplazan); e.clear = momento en que se despeja
const Fog: React.FC<{e: El; t: number}> = ({e, t}) => {
  const op = (e.op ?? 0.7) * eo(t, e.at ?? 0, 1) * (e.clear != null ? 1 - eo(t, e.clear, 1.4) : 1);
  return (
    <div style={{position: 'absolute', inset: 0, opacity: op, pointerEvents: 'none'}}>
      {Array.from({length: 9}).map((_, k) => (
        <div key={k} style={{position: 'absolute', left: ((hash(k) * 2400 + t * (30 + hash(k + 2) * 40) * (k % 2 ? 1 : -1)) % 2600) - 500, top: 200 + hash(k + 5) * 700, width: 900, height: 360, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(170,176,190,0.55), transparent 70%)', filter: 'blur(30px)'}} />
      ))}
    </div>
  );
};

// Partículas de brasa que suben
const Embers: React.FC<{e: El; t: number}> = ({e, t}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', opacity: e.op ?? 1}}>
    {Array.from({length: e.n ?? 36}).map((_, k) => {
      const sp = 60 + hash(k) * 140;
      const y = 1100 - ((t * sp + hash(k + 3) * 1300) % 1300);
      const x = hash(k + 7) * 1920 + Math.sin(t * 1.3 + k) * 30;
      const s = 3 + hash(k + 1) * 6;
      return <div key={k} style={{position: 'absolute', left: x, top: y, width: s, height: s, borderRadius: '50%', background: k % 3 ? '#FF9A4D' : '#FFD27A', boxShadow: `0 0 ${s * 3}px #FF7A3D`, opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + k))}} />;
    })}
  </div>
);

// Batería (ícono); level 0..1
export const BatteryIcon: React.FC<{level: number; t: number; w?: number; blink?: boolean; charge?: boolean}> = ({level, t, w = 360, blink, charge}) => {
  const c = level < 0.2 ? L.red : level < 0.5 ? L.amber : L.green;
  const h = w * 0.48;
  const vis = blink && level < 0.2 ? (Math.sin(t * 7) > -0.2 ? 1 : 0.25) : 1;
  return (
    <div style={{position: 'relative', width: w + w * 0.08, height: h}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h, borderRadius: h * 0.2, border: `${w * 0.035}px solid rgba(255,255,255,0.92)`, boxSizing: 'border-box', padding: w * 0.03}}>
        <div style={{width: `${clamp(level) * 100}%`, minWidth: level > 0 ? w * 0.05 : 0, height: '100%', borderRadius: h * 0.1, background: c, boxShadow: `0 0 ${w * 0.1}px ${c}`, opacity: vis}} />
      </div>
      <div style={{position: 'absolute', left: w, top: h * 0.3, width: w * 0.07, height: h * 0.4, borderRadius: `0 ${w * 0.02}px ${w * 0.02}px 0`, background: 'rgba(255,255,255,0.92)'}} />
      {charge && <div style={{position: 'absolute', left: w / 2, top: h / 2, transform: 'translate(-50%,-50%)', fontFamily: EMOJI, fontSize: h * 0.7, opacity: 0.6 + 0.4 * Math.sin(t * 5)}}>⚡</div>}
    </div>
  );
};
const Battery: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const lv = e.from != null ? lerp(e.from, e.to ?? 1, eio(t, e.lAt ?? 0.3, e.dur ?? 1.6)) : e.to ?? 0.5;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{transform: e.vertical ? 'rotate(-90deg)' : undefined}}>
        <BatteryIcon level={lv} t={t} w={e.w ?? 360} blink={e.blink} charge={e.charge} />
      </div>
    </Pos>
  );
};

// Vela: e.never = nunca se encendió; e.outAt = se apaga con humo
const Candle: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const h = e.h ?? 300;
  const on = e.never ? 0 : e.outAt != null ? 1 - eo(t, e.outAt, 0.25) : 1;
  const melt = e.melt ? lerp(1, 0.55, eio(t, 0, e.melt)) : 1;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{position: 'relative', width: 130, height: h + 120}}>
        <div style={{position: 'absolute', left: 15, bottom: 0, width: 100, height: h * melt, borderRadius: '14px 14px 8px 8px', background: e.never ? 'linear-gradient(90deg,#f1ece4,#d9d2c6)' : 'linear-gradient(90deg,#f5e9d6,#d8c3a5)', boxShadow: on > 0.1 ? '0 0 60px rgba(255,160,70,0.35)' : 'none'}} />
        <div style={{position: 'absolute', left: 62, bottom: h * melt, width: 6, height: 26, background: on > 0.5 || e.never ? '#3a2a1e' : '#111', borderRadius: 3}} />
        <Flame x={65} y={120 + (h - h * melt) - 26 + 26} s={1.1} t={t} on={on} />
        {e.outAt != null && <Smoke x={65} y={120 + (h - h * melt) - 10} t={t} at={e.outAt + 0.1} />}
      </div>
    </Pos>
  );
};

// Etiqueta adhesiva roja "FLOJO": cae y se pega (anim), se despega (peel), sale volando (fly), se tacha (cross)
const Label: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const size = e.size ?? 90;
  const peel = e.peel != null ? eio(t, e.peel, 0.6) : 0;
  const flyT = e.fly != null ? Math.max(0, t - e.fly) : 0;
  const cross = e.cross != null ? eo(t, e.cross, 0.35) : 0;
  const wob = e.wobble ? wobble(t, e.wobble, 6, 2.2, 1.2) : 0;
  return (
    <Pos e={{...e, anim: e.anim ?? 'fall'}} t={t} i={i}>
      <div style={{transform: `translate(${flyT * 900}px, ${-flyT * 700 + flyT * flyT * 60}px) rotate(${(e.tilt ?? -6) + wob + peel * 14 + flyT * 220}deg)`, opacity: 1 - clamp(flyT / 1.4), position: 'relative'}}>
        <div style={{position: 'relative', padding: `${size * 0.18}px ${size * 0.42}px`, background: `linear-gradient(160deg, #ff5a5a, ${L.red} 60%, #b91c1c)`, borderRadius: size * 0.14, fontFamily: TITLE, fontSize: size, letterSpacing: 3, color: '#fff', whiteSpace: 'nowrap', boxShadow: `0 ${10 + peel * 30}px ${30 + peel * 30}px rgba(0,0,0,0.5)`, clipPath: peel > 0 ? `polygon(0 0, 100% 0, 100% ${100 - peel * 45}%, ${100 - peel * 30}% 100%, 0 100%)` : undefined, textShadow: '0 3px 0 rgba(0,0,0,0.25)'}}>
          {e.text ?? 'FLOJO'}
          <div style={{position: 'absolute', inset: size * 0.08, border: '3px dashed rgba(255,255,255,0.45)', borderRadius: size * 0.1}} />
        </div>
        {peel > 0 && <div style={{position: 'absolute', right: 0, bottom: 0, width: size * 0.9 * peel, height: size * 0.75 * peel, background: 'linear-gradient(135deg, #f8d7d7, #e9a9a9)', clipPath: 'polygon(100% 0, 0 100%, 100% 100%)', transform: 'scale(-1,-1)', transformOrigin: 'bottom right', boxShadow: '0 0 20px rgba(0,0,0,0.4)'}} />}
        {cross > 0 && <div style={{position: 'absolute', left: '-6%', top: '46%', height: size * 0.16, width: `${cross * 112}%`, background: L.yellow, borderRadius: 10, transform: 'rotate(-6deg)', boxShadow: '0 0 20px rgba(0,0,0,0.4)'}} />}
      </div>
    </Pos>
  );
};

// Sobre con candado (la pregunta guardada para el final); open = momento en que se abre
export const Envelope: React.FC<{s: number; t: number; open?: number; lock?: boolean}> = ({s, t, open, lock = true}) => {
  const op = open != null ? eio(t, open, 0.6) : 0;
  return (
    <div style={{position: 'relative', width: 300 * s, height: 200 * s}}>
      <svg width={300 * s} height={200 * s} viewBox="0 0 300 200" style={{overflow: 'visible'}}>
        <rect x={0} y={0} width={300} height={200} rx={16} fill="#F5EFE6" stroke="#c9bfae" strokeWidth={4} />
        <path d={`M0 ${op > 0 ? 0 : 0} L150 ${lerp(118, -110, op)} L300 0`} fill={op > 0.5 ? '#efe6d6' : 'none'} stroke="#c9bfae" strokeWidth={4} />
        <path d="M0 200 L120 100 M300 200 L180 100" stroke="#ddd3c2" strokeWidth={4} />
        <circle cx={150} cy={lerp(112, -100, op)} r={30} fill={L.red} opacity={1 - op} />
        <text x={150} y={lerp(126, -86, op)} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={40} fill="#fff" opacity={1 - op}>?</text>
      </svg>
      {lock && (
        <div style={{position: 'absolute', right: -40 * s, bottom: -40 * s, fontFamily: EMOJI, fontSize: 110 * s, transform: `rotate(${wobble(t, open ?? 99, 20, 4, 3)}deg)`}}>{op > 0.05 ? '🔓' : '🔒'}</div>
      )}
    </div>
  );
};
const EnvelopeEl: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i} idle={e.idle}>
    <Envelope s={e.size ?? 1.6} t={t} open={e.open} lock={e.lock !== false} />
  </Pos>
);

// Escalera de cinco etapas que baja hacia la oscuridad
const STEP_C = ['#4ADE80', '#FACC15', '#FF7A3D', '#7A7F8C', '#22252e'];
export const Stairs: React.FC<{e: El; t: number}> = ({e, t}) => {
  const x0 = e.x ?? 260, y0 = e.y ?? 260, sw = e.sw ?? 300, sh = e.sh ?? 130;
  const lit: number[] = e.lit ?? [];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {STEP_C.map((c, k) => {
        const on = lit.includes(k + 1) ? 1 : e.litAt && e.litAt[k] != null ? eo(t, e.litAt[k], 0.35) : 0;
        const act = e.active === k + 1;
        const q = spr(t, (e.at ?? 0) + k * 0.1, 2.2, 0.55);
        return (
          <div key={k} style={{position: 'absolute', left: x0 + k * sw, top: y0 + k * sh, width: sw + 4, height: 1080 - (y0 + k * sh), transform: `translateY(${(1 - q) * 300}px)`, opacity: q}}>
            <div style={{position: 'absolute', inset: 0, background: on > 0 ? `linear-gradient(180deg, ${c}, ${c}aa 30%, #10131b 100%)` : 'linear-gradient(180deg,#3a3f4d,#1a1d26 60%)', opacity: on > 0 ? lerp(0.6, 1, on) : 0.85, borderTop: `8px solid ${on > 0 ? c : '#4a5060'}`, boxShadow: act ? `0 -20px 80px ${c}` : 'none'}} />
            {k === 4 && on > 0 && <div style={{position: 'absolute', left: 0, top: -14, width: sw, height: 20, background: 'repeating-linear-gradient(90deg,#9aa0ab 0 6px, transparent 6px 14px)', opacity: 0.6}} />}
          </div>
        );
      })}
      {e.marker != null && (
        <div style={{position: 'absolute', left: x0 + (e.marker - 1) * sw + sw / 2, top: y0 + (e.marker - 1) * sh - 30 + Math.sin(t * 3) * 10, transform: 'translate(-50%,-100%)', fontFamily: EMOJI, fontSize: 120, opacity: eo(t, e.markerAt ?? 0.5, 0.3)}}>📍</div>
      )}
    </div>
  );
};

// HUD: seis casillas (arriba a la izquierda) y el sobre con candado (arriba a la derecha). Sin números, para no repetir texto en pantalla.
export const Hud: React.FC<{n: number; t: number; pulse?: boolean; blinkAll?: boolean; env?: boolean}> = ({n, t, blinkAll, env = true}) => (
  <>
    <div style={{position: 'absolute', left: 46, top: 40, display: 'flex', gap: 14}}>
      {[1, 2, 3, 4, 5, 6].map((k) => {
        const lit = k <= n;
        const cur = k === n;
        const b = blinkAll ? 0.5 + 0.5 * Math.abs(Math.sin(t * 6 + k)) : 1;
        return <div key={k} style={{width: 44, height: 44, borderRadius: 11, border: `4px solid ${lit ? L.gold : 'rgba(255,255,255,0.35)'}`, background: lit ? `rgba(255,122,61,${cur ? 0.9 : 0.55})` : 'rgba(0,0,0,0.25)', boxShadow: cur ? `0 0 ${18 + 10 * Math.sin(t * 5)}px ${L.gold}` : 'none', opacity: b}} />;
      })}
    </div>
    {env && (
      <div style={{position: 'absolute', right: 60, top: 34, transform: `rotate(${Math.sin(t * 1.2) * 3}deg)`}}>
        <Envelope s={0.36} t={t} />
      </div>
    )}
  </>
);

// Bomba de caricatura con mecha corta; explota en e.boom
const Bomb: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const boom = e.boom != null && t > e.boom;
  const bp = boom ? eo(t, e.boom, 0.4) : 0;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{position: 'relative', width: 360, height: 400}}>
        {!boom || bp < 0.3 ? (
          <svg width={360} height={400} viewBox="-180 -220 360 400" style={{overflow: 'visible', transform: `scale(${1 + Math.sin(t * 30) * 0.02})`}}>
            <circle cx={0} cy={40} r={140} fill="#1d2030" stroke="#3b4058" strokeWidth={8} />
            <ellipse cx={-50} cy={-10} rx={34} ry={22} fill="rgba(255,255,255,0.18)" />
            <rect x={-34} y={-120} width={68} height={40} rx={8} fill="#3b4058" />
            <path d="M0 -120 Q20 -160 40 -150" stroke="#c9a47a" strokeWidth={10} fill="none" strokeLinecap="round" />
          </svg>
        ) : null}
        {!boom && Array.from({length: 8}).map((_, k) => <div key={k} style={{position: 'absolute', left: 220 + Math.cos(k + t * 20) * 24 * hash(k + Math.floor(t * 20)), top: 70 + Math.sin(k + t * 20) * 24 * hash(k + 3 + Math.floor(t * 20)), width: 8, height: 8, borderRadius: '50%', background: '#FFD27A', boxShadow: '0 0 12px #FF7A3D'}} />)}
        {boom && <div style={{position: 'absolute', left: 180, top: 220, transform: `translate(-50%,-50%) scale(${lerp(0.3, 1.6, bp)})`, fontFamily: EMOJI, fontSize: 300, opacity: 1 - clamp((t - e.boom - 0.6) / 0.6)}}>💥</div>}
      </div>
    </Pos>
  );
};

// Reloj de arena; e.flip = gira hacia atrás
const Hourglass: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const rot = e.flip ? -eio(t, e.flipAt ?? 0.3, 1.2) * 540 : 0;
  const sand = clamp(t / (e.dur ?? 6));
  return (
    <Pos e={e} t={t} i={i}>
      <svg width={300} height={440} viewBox="-150 -220 300 440" style={{overflow: 'visible', transform: `rotate(${rot}deg)`}}>
        <rect x={-130} y={-220} width={260} height={26} rx={10} fill="#8a5a3c" />
        <rect x={-130} y={194} width={260} height={26} rx={10} fill="#8a5a3c" />
        <path d="M-100 -194 L100 -194 L14 0 L100 194 L-100 194 L-14 0 Z" fill="rgba(200,225,255,0.18)" stroke="rgba(255,255,255,0.7)" strokeWidth={6} />
        <path d={`M${-80 * (1 - sand)} ${-194 + 160 * sand} L${80 * (1 - sand)} ${-194 + 160 * sand} L8 -6 L-8 -6 Z`} fill="#F2C27B" />
        <path d={`M-90 192 L90 192 L${60 * (1 - sand * 0.6)} ${192 - 120 * sand} L${-60 * (1 - sand * 0.6)} ${192 - 120 * sand} Z`} fill="#F2C27B" />
        <rect x={-3} y={-6} width={6} height={198 - 120 * sand} fill="#F2C27B" opacity={0.85} />
      </svg>
    </Pos>
  );
};

// Chat: burbujas; e.del = índice de la burbuja que se cambia por "Mensaje eliminado" en e.delAt; e.muted = chat silenciado con globo de no leídos
const Chat: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const msgs: {text: string; me?: boolean; at?: number}[] = e.msgs ?? [];
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{width: e.w ?? 760, padding: 34, borderRadius: 44, background: 'linear-gradient(180deg,#232838,#171a24)', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', border: '3px solid #343a4e', display: 'flex', flexDirection: 'column', gap: 20, position: 'relative'}}>
        {e.title && <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 34, color: 'rgba(255,255,255,0.65)', display: 'flex', alignItems: 'center', gap: 14}}>{e.title}{e.muted && <span style={{fontFamily: EMOJI}}>🔕</span>}</div>}
        {msgs.map((m, k) => {
          const q = eo(t, m.at ?? 0.2 + k * 0.35, 0.3);
          const deleted = e.del === k && e.delAt != null && t > e.delAt;
          return (
            <div key={k} style={{alignSelf: m.me ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '18px 26px', borderRadius: 26, background: deleted ? 'rgba(255,255,255,0.08)' : m.me ? L.gold : '#2f3547', color: deleted ? 'rgba(255,255,255,0.5)' : m.me ? L.ink : L.white, fontFamily: SANS, fontWeight: deleted ? 600 : 900, fontStyle: deleted ? 'italic' : 'normal', fontSize: e.size ?? 40, opacity: q, transform: `translateY(${(1 - q) * 30}px) translateX(${deleted ? 0 : e.shakeMe && m.me ? Math.sin(t * 50) * 4 : 0}px)`}}>
              {deleted ? '🚫 Mensaje eliminado' : m.text}
            </div>
          );
        })}
        {e.unread != null && (
          <div style={{position: 'absolute', right: -26, top: -26, minWidth: 90, height: 90, borderRadius: 45, background: L.red, color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 20px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
            {Math.round(lerp(e.unreadFrom ?? 1, e.unread, eio(t, 0.3, e.dur ?? 2.5)))}
          </div>
        )}
      </div>
    </Pos>
  );
};

// Gráfica de línea: pts = [[u, v], …] normalizados (u: 0..1 izquierda→derecha, v: 0..1 abajo→arriba)
const Line: React.FC<{e: El; t: number}> = ({e, t}) => {
  const x0 = e.x0 ?? 300, x1 = e.x1 ?? 1620, yb = e.yb ?? 860, yt = e.yt ?? 260;
  const pts: number[][] = e.pts ?? [[0, 0.2], [1, 0.2]];
  const p = eio(t, e.at ?? 0.2, e.dur ?? 1.6);
  const c = color(e.color) ?? L.gold;
  const P = (q: number[]) => [lerp(x0, x1, q[0]), lerp(yb, yt, q[1])];
  // recorre la polilínea hasta la fracción p
  const seg: number[][] = [];
  const total = pts.length - 1;
  const lim = p * total;
  for (let k = 0; k < pts.length; k++) {
    if (k <= lim) seg.push(P(pts[k]));
    else {
      const f = lim - (k - 1);
      const a = P(pts[k - 1]), b = P(pts[k]);
      seg.push([lerp(a[0], b[0], f), lerp(a[1], b[1], f)]);
      break;
    }
  }
  const last = seg[seg.length - 1];
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <line x1={x0} y1={yb} x2={x1} y2={yb} stroke="rgba(255,255,255,0.45)" strokeWidth={5} />
      <line x1={x0} y1={yb} x2={x0} y2={yt - 40} stroke="rgba(255,255,255,0.45)" strokeWidth={5} />
      {e.ticks && e.ticks.map((u: number, k: number) => <text key={k} x={lerp(x0, x1, u)} y={yb + 70} textAnchor="middle" fontFamily={EMOJI} fontSize={54} opacity={eo(t, (e.at ?? 0.2) + u * (e.dur ?? 1.6), 0.3)}>{e.tickCh ?? '📅'}</text>)}
      <polyline points={seg.map((q) => q.join(',')).join(' ')} fill="none" stroke={c} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" style={{filter: `drop-shadow(0 0 16px ${c})`}} />
      {last && <circle cx={last[0]} cy={last[1]} r={16} fill={c} />}
      {e.xl && <text x={x0} y={yb + 66} fontFamily={SANS} fontWeight={800} fontSize={40} fill="rgba(255,255,255,0.7)">{e.xl}</text>}
      {e.xr && <text x={x1} y={yb + 66} textAnchor="end" fontFamily={SANS} fontWeight={800} fontSize={40} fill="rgba(255,255,255,0.7)">{e.xr}</text>}
    </svg>
  );
};

// Radar que detecta un punto temprano
const Radar: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const r = e.r ?? 330;
  const ang = t * 140;
  const blip = e.blipAt != null ? eo(t, e.blipAt, 0.2) : 0;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{position: 'relative', width: r * 2, height: r * 2, borderRadius: '50%', background: 'radial-gradient(circle, #0f2a1c, #08140e 70%)', border: `6px solid ${L.green}`, overflow: 'hidden', boxShadow: `0 0 60px ${L.green}55`}}>
        {[0.33, 0.66].map((f, k) => <div key={k} style={{position: 'absolute', left: r - r * f, top: r - r * f, width: r * 2 * f, height: r * 2 * f, borderRadius: '50%', border: `3px solid ${L.green}55`}} />)}
        <div style={{position: 'absolute', inset: 0, background: `conic-gradient(from ${ang}deg, ${L.green}aa, transparent 22%)`, borderRadius: '50%'}} />
        {blip > 0 && <div style={{position: 'absolute', left: r * 1.35, top: r * 0.6, width: 34, height: 34, marginLeft: -17, marginTop: -17, borderRadius: '50%', background: L.amber, boxShadow: `0 0 ${30 + 20 * Math.sin(t * 8)}px ${L.amber}`, transform: `scale(${blip})`}} />}
      </div>
    </Pos>
  );
};

// Grietas sobre un área
const Crack: React.FC<{e: El; t: number}> = ({e, t}) => {
  const x = e.x ?? 960, y = e.y ?? 540, s = e.size ?? 300;
  const p = eo(t, e.at ?? 0.3, 0.5);
  const c = e.color ?? 'rgba(255,255,255,0.92)';
  return (
    <svg style={{position: 'absolute', left: x - s / 2, top: y - s / 2, overflow: 'visible'}} width={s} height={s} viewBox="0 0 100 100">
      <path d="M50 0 L44 22 L56 36 L40 58 L54 76 L46 100" stroke={c} strokeWidth={2.4} fill="none" strokeDasharray={140} strokeDashoffset={140 * (1 - p)} />
      <path d="M44 22 L20 30 M40 58 L76 66 M56 36 L80 26" stroke={c} strokeWidth={1.6} fill="none" strokeDasharray={60} strokeDashoffset={60 * (1 - eo(t, (e.at ?? 0.3) + 0.2, 0.4))} />
    </svg>
  );
};

// Enchufe que se desconecta (cable desde el pecho del personaje)
const Plug: React.FC<{e: El; t: number}> = ({e, t}) => {
  const x = e.x ?? 960, y = e.y ?? 600, x2 = e.x2 ?? 1300, y2 = e.y2 ?? 960;
  const off = e.offAt != null ? eio(t, e.offAt, 0.5) : 1;
  const px = lerp(x2 + 140, x2 - 90, off), py = y2;
  const spark = e.offAt != null && t > e.offAt && t < e.offAt + 0.35;
  return (
    <svg style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}} width={1920} height={1080}>
      <path d={`M${x} ${y} C${x + 60} ${y + 260} ${px - 300} ${py + 40} ${px - 70} ${py}`} stroke="#8a90a0" strokeWidth={14} fill="none" strokeLinecap="round" />
      <g transform={`translate(${px - 70} ${py - 34})`}>
        <rect x={0} y={0} width={80} height={68} rx={14} fill="#e8e3da" />
        <rect x={80} y={14} width={34} height={10} rx={3} fill="#c9c2b5" />
        <rect x={80} y={44} width={34} height={10} rx={3} fill="#c9c2b5" />
      </g>
      <rect x={x2 + 150} y={py - 80} width={110} height={160} rx={22} fill="#f3eee6" stroke="#c9c2b5" strokeWidth={5} />
      <rect x={x2 + 185} y={py - 40} width={12} height={26} rx={4} fill="#333" />
      <rect x={x2 + 215} y={py - 40} width={12} height={26} rx={4} fill="#333" />
      {spark && <text x={x2 + 60} y={py + 20} fontFamily="Noto Color Emoji" fontSize={70}>⚡</text>}
    </svg>
  );
};

// Indicador de gasolina; value 0..1 (0 = vacío)
const Gauge: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const v = lerp(e.from ?? 0.6, e.to ?? 0, eio(t, e.vAt ?? 0.3, e.dur ?? 1.2));
  const a = lerp(-70, 70, v) + (v < 0.05 ? Math.sin(t * 20) * 2 : 0);
  return (
    <Pos e={e} t={t} i={i}>
      <svg width={420} height={300} viewBox="-210 -230 420 300" style={{overflow: 'visible'}}>
        <path d="M-180 0 A180 180 0 0 1 180 0" fill="#1a1d26" stroke="#3a3f4d" strokeWidth={14} />
        <path d="M-160 -10 A160 160 0 0 1 -110 -118" stroke={L.red} strokeWidth={16} fill="none" />
        <text x={-150} y={44} fontFamily="Montserrat" fontWeight={900} fontSize={50} fill={L.red}>E</text>
        <text x={150} y={44} textAnchor="end" fontFamily="Montserrat" fontWeight={900} fontSize={50} fill="#fff">F</text>
        <g transform={`rotate(${a})`}>
          <path d="M-8 0 L0 -150 L8 0 Z" fill={L.gold} />
        </g>
        <circle cx={0} cy={0} r={20} fill="#fff" />
        <text x={0} y={-70} textAnchor="middle" fontFamily="Noto Color Emoji" fontSize={60}>⛽</text>
      </svg>
    </Pos>
  );
};

// Íconos que giran en un círculo, cada vez más rápido
const Orbit: React.FC<{e: El; t: number}> = ({e, t}) => {
  const chs: string[] = e.chs ?? ['⏰', '💼', '🛏️'];
  const r = e.r ?? 260;
  const ang = Math.pow(t, 1.7) * (e.speed ?? 60);
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540}}>
      <div style={{position: 'absolute', left: -r, top: -r, width: r * 2, height: r * 2, borderRadius: '50%', border: '6px dashed rgba(255,255,255,0.25)'}} />
      {chs.map((c, k) => {
        const a = ((ang + (k * 360) / chs.length) * Math.PI) / 180;
        return <div key={k} style={{position: 'absolute', left: Math.cos(a) * r, top: Math.sin(a) * r, transform: 'translate(-50%,-50%)', fontFamily: EMOJI, fontSize: e.size ?? 150, filter: 'drop-shadow(0 14px 20px rgba(0,0,0,0.5))'}}>{c}</div>;
      })}
    </div>
  );
};

// El mismo día copiado y apilado (fotocopiadora)
const Stack: React.FC<{e: El; t: number}> = ({e, t}) => {
  const n = e.n ?? 12;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      {Array.from({length: n}).map((_, k) => {
        const at = (e.at ?? 0.1) + k * (e.gap ?? 0.22);
        if (t < at) return null;
        const q = eo(t, at, 0.25);
        return (
          <div key={k} style={{position: 'absolute', left: (e.x ?? 960) - 260 + (hash(k) - 0.5) * 120 + k * 10, top: (e.y ?? 560) - 200 - k * 16, width: 520, height: 380, borderRadius: 18, background: '#F5EFE6', boxShadow: '0 20px 40px rgba(0,0,0,0.45)', transform: `rotate(${(hash(k + 4) - 0.5) * 14}deg) translateX(${(1 - q) * 600}px)`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 30, fontFamily: EMOJI, fontSize: 90, filter: `grayscale(${Math.min(1, k / n)})`}}>
            {e.chs ?? '⏰💼🛏️'}
          </div>
        );
      })}
    </div>
  );
};

// Texto que se desvanece como ceniza, letra por letra
const AshTxt: React.FC<{e: El; t: number}> = ({e, t}) => {
  const txt = String(e.text);
  const at = e.ashAt ?? 1.0;
  return (
    <div style={{position: 'absolute', left: e.x ?? 960, top: e.y ?? 540, transform: 'translate(-50%,-50%)', whiteSpace: 'nowrap', fontFamily: TITLE, fontSize: e.size ?? 150, color: color(e.color) ?? L.cream, letterSpacing: 4, textShadow: '0 8px 30px rgba(0,0,0,0.6)'}}>
      {txt.split('').map((ch, k) => {
        const d0 = at + hash(k) * 1.2;
        const u = clamp((t - d0) / 1.2);
        const inQ = eo(t, (e.at ?? 0.05) + k * 0.03, 0.3);
        return <span key={k} style={{display: 'inline-block', opacity: inQ * (1 - u), transform: `translate(${u * (hash(k + 9) - 0.3) * 120}px, ${-u * 160 - u * u * 60}px) rotate(${u * 90 * (hash(k + 2) - 0.5)}deg)`, color: u > 0.05 ? L.ash : undefined, filter: u > 0 ? `blur(${u * 4}px)` : undefined}}>{ch === ' ' ? ' ' : ch}</span>;
      })}
    </div>
  );
};

// Foco sobre la cabeza que parpadea y se apaga en e.offAt
const Bulb: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const off = e.offAt ?? 99;
  const fl = t < off - 0.8 ? 1 : t < off ? (Math.sin(t * 50) > 0 ? 1 : 0.2) : 0;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{position: 'relative', fontFamily: EMOJI, fontSize: e.size ?? 160, filter: fl > 0.5 ? `drop-shadow(0 0 40px ${L.amber}) drop-shadow(0 0 90px ${L.amber})` : 'grayscale(1) brightness(0.5)'}}>💡</div>
    </Pos>
  );
};

// Señal de camino ámbar (rombo) que se enciende
const RoadSign: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const on = eo(t, e.onAt ?? 0.4, 0.3);
  const b = 0.75 + 0.25 * Math.abs(Math.sin(t * 4));
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{position: 'relative', width: 380, height: 640}}>
        <div style={{position: 'absolute', left: 180, top: 300, width: 22, height: 340, background: '#6b7280'}} />
        <div style={{position: 'absolute', left: 50, top: 40, width: 280, height: 280, transform: 'rotate(45deg)', borderRadius: 26, background: on > 0 ? L.amber : '#5a5f6b', border: '14px solid #1b1f2a', boxShadow: on > 0 ? `0 0 ${90 * on * b}px ${L.amber}` : 'none'}} />
        <div style={{position: 'absolute', left: 190, top: 180, transform: 'translate(-50%,-50%)', fontFamily: SANS, fontWeight: 900, fontSize: 170, color: '#1b1f2a'}}>!</div>
      </div>
    </Pos>
  );
};

// Nota adhesiva (con emoji)
const Sticky: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i}>
    <div style={{width: e.w ?? 420, height: e.w ?? 420, background: 'linear-gradient(160deg,#FFE58A,#F8C94A)', boxShadow: '0 30px 60px rgba(0,0,0,0.45)', transform: `rotate(${e.tilt ?? -4}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: EMOJI, fontSize: (e.w ?? 420) * 0.45, position: 'relative'}}>
      <div style={{position: 'absolute', top: -20, left: '35%', width: '30%', height: 44, background: 'rgba(255,255,255,0.45)'}} />
      {e.ch ?? '❤️'}
    </div>
  </Pos>
);

// Avión de papel que cruza la pantalla
const Plane: React.FC<{e: El; t: number}> = ({e, t}) => {
  const u = eio(t, e.at ?? 0.3, e.dur ?? 2.2);
  const x = lerp(-200, 2120, u), y = (e.y ?? 520) - Math.sin(u * Math.PI) * 220;
  return (
    <svg style={{position: 'absolute', left: x - 120, top: y - 80, overflow: 'visible'}} width={240} height={160} viewBox="0 0 240 160">
      <path d="M0 80 L240 10 L90 100 Z" fill="#fff" />
      <path d="M90 100 L240 10 L120 150 Z" fill="#dfe3ea" />
      <path d="M90 100 L110 140 L120 150" fill="#c3c9d4" />
    </svg>
  );
};

// Botón de suscribirse (pantalla final)
const SubBtn: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const press = e.pressAt != null && t > e.pressAt ? 1 - Math.min(1, (t - e.pressAt) * 4) * 0.1 : 1;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{padding: '30px 64px', borderRadius: 24, background: e.done ? '#3a3f4d' : '#E62117', color: '#fff', fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 70, letterSpacing: 2, boxShadow: '0 20px 50px rgba(0,0,0,0.5)', transform: `scale(${press})`, whiteSpace: 'nowrap'}}>{e.text ?? 'SUSCRÍBETE'}</div>
    </Pos>
  );
};

// Sillón / hamaca / bici fija simples
const Prop: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const kind = e.kind;
  return (
    <Pos e={{...e, anim: e.anim ?? 'fade'}} t={t} i={i}>
      {kind === 'sofa' && (
        <svg width={620} height={320} viewBox="-310 -200 620 320" style={{overflow: 'visible'}}>
          <rect x={-300} y={-150} width={600} height={170} rx={50} fill={e.c ?? '#2A9D8F'} />
          <rect x={-310} y={-40} width={120} height={150} rx={40} fill={e.c2 ?? '#23867a'} />
          <rect x={190} y={-40} width={120} height={150} rx={40} fill={e.c2 ?? '#23867a'} />
          <rect x={-200} y={0} width={400} height={100} rx={30} fill={e.c ?? '#2A9D8F'} />
          <rect x={-270} y={100} width={24} height={30} fill="#3a2a1e" />
          <rect x={246} y={100} width={24} height={30} fill="#3a2a1e" />
        </svg>
      )}
      {kind === 'hammock' && (
        <svg width={900} height={420} viewBox="-450 -250 900 420" style={{overflow: 'visible'}}>
          <path d="M-400 -240 L-400 170 M400 -240 L400 170" stroke="#7c5a3a" strokeWidth={26} strokeLinecap="round" />
          <path d={`M-400 -150 Q0 ${60 + Math.sin(t * 1.6) * 16} 400 -150`} stroke="#e9c46a" strokeWidth={50} fill="none" strokeLinecap="round" />
          <path d={`M-400 -150 Q0 ${60 + Math.sin(t * 1.6) * 16} 400 -150`} stroke="#f4a261" strokeWidth={14} fill="none" strokeDasharray="30 30" />
        </svg>
      )}
      {kind === 'bike' && (
        <svg width={520} height={360} viewBox="-260 -200 520 360" style={{overflow: 'visible'}}>
          <rect x={-200} y={120} width={400} height={26} rx={12} fill="#3a3f4d" />
          <circle cx={-110} cy={40} r={80} fill="none" stroke="#9aa0ab" strokeWidth={14} />
          <g transform={`translate(-110 40) rotate(${t * 520})`}><path d="M-70 0 L70 0 M0 -70 L0 70" stroke="#9aa0ab" strokeWidth={6} /></g>
          <path d="M-110 40 L40 -100 L120 40 Z" fill="none" stroke={L.gold} strokeWidth={16} strokeLinejoin="round" />
          <path d="M120 40 L120 120 M-110 120 L-110 120" stroke="#3a3f4d" strokeWidth={16} />
          <rect x={10} y={-130} width={80} height={22} rx={10} fill="#222" />
        </svg>
      )}
      {kind === 'seats' && (
        <svg width={1920} height={300} viewBox="-960 -150 1920 300" style={{overflow: 'visible'}}>
          {Array.from({length: 9}).map((_, k) => <rect key={k} x={-900 + k * 205} y={-60} width={170} height={210} rx={40} fill="#5b1e2b" />)}
        </svg>
      )}
    </Pos>
  );
};

// Ícono de la colección de Envato (public/burnout/graficos/iconos)
const Icon: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i} idle={e.idle}>
    <div style={{width: (e.w ?? 220) + 60, height: (e.w ?? 220) + 60, borderRadius: 40, background: e.bg ?? 'rgba(245,239,230,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 24px 50px rgba(0,0,0,0.45)', filter: grayF(e, t) || undefined, opacity: e.grayAt != null ? lerp(1, 0.55, eo(t, e.grayAt, 0.8)) : 1}}>
      <Img src={staticFile(`burnout/graficos/iconos/${e.name}.png`)} style={{width: e.w ?? 220, height: e.w ?? 220}} />
    </div>
  </Pos>
);

// Ficha de estudio
const Study: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i}>
    <div style={{width: e.w ?? 820, padding: '44px 54px', borderRadius: 22, background: '#F5EFE6', boxShadow: '0 30px 70px rgba(0,0,0,0.5)', color: L.ink, position: 'relative'}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 18, borderRadius: '22px 0 0 22px', background: L.gold}} />
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: e.size ?? 60, lineHeight: 1.1}}>{e.text}</div>
      {e.sub && <div style={{fontFamily: SANS, fontWeight: 700, fontSize: e.subSize ?? 36, opacity: 0.7, marginTop: 14}}>{e.sub}</div>}
      {[0, 1, 2].map((k) => <div key={k} style={{height: 12, borderRadius: 6, background: 'rgba(0,0,0,0.12)', marginTop: 22, width: `${90 - k * 18}%`}} />)}
      {e.ch && <div style={{position: 'absolute', right: 36, top: -60, fontFamily: EMOJI, fontSize: 120}}>{e.ch}</div>}
    </div>
  </Pos>
);

// Calendario con días en blanco y desenfocados
const Calendar: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i}>
    <div style={{width: 820, padding: 30, borderRadius: 30, background: '#F5EFE6', boxShadow: '0 30px 70px rgba(0,0,0,0.5)'}}>
      <div style={{height: 70, borderRadius: 16, background: L.gold, marginBottom: 20}} />
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 14, filter: `blur(${lerp(0, e.blur ?? 5, eo(t, 0.6, 1.2))}px)`}}>
        {Array.from({length: 28}).map((_, k) => <div key={k} style={{height: 80, borderRadius: 12, background: 'rgba(0,0,0,0.08)'}} />)}
      </div>
    </div>
  </Pos>
);

// Barras simples con porcentaje (sin repetir el número: lo muestra solo la barra)
const Pct: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => {
  const v = lerp(0, e.to ?? 0.4, eio(t, e.vAt ?? 0.2, e.dur ?? 1.4));
  const c = v >= (e.redAt ?? 9) ? L.red : color(e.color) ?? L.gold;
  return (
    <Pos e={e} t={t} i={i}>
      <div style={{width: e.w ?? 1200, height: 110, borderRadius: 55, background: 'rgba(255,255,255,0.1)', border: '5px solid rgba(255,255,255,0.4)', overflow: 'hidden'}}>
        <div style={{width: `${v * 100}%`, height: '100%', background: c, boxShadow: `0 0 40px ${c}`, borderRadius: 55}} />
      </div>
    </Pos>
  );
};

// Escudo que se agrieta, siluetas en fila, etc. se arman con emoji + crack.
// Siluetas en fila; e.tint = cuántas se tiñen de naranja ceniza
const Row: React.FC<{e: El; t: number}> = ({e, t}) => {
  const n = e.n ?? 4;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: e.y ?? 420, display: 'flex', justifyContent: 'center', gap: e.gap ?? 90}}>
      {Array.from({length: n}).map((_, k) => {
        const on = k < (e.tint ?? 0) ? eo(t, (e.at ?? 0.4) + k * (e.step ?? 0.35), 0.3) : 0;
        const c = on > 0 ? `rgb(${Math.round(lerp(90, 255, on))},${Math.round(lerp(96, 122, on))},${Math.round(lerp(110, 61, on))})` : '#5a6070';
        return (
          <svg key={k} width={220} height={420} viewBox="-110 -230 220 420">
            <circle cx={0} cy={-160} r={58} fill={c} />
            <path d="M-80 -80 Q0 -110 80 -80 L92 180 L-92 180 Z" fill={c} />
          </svg>
        );
      })}
    </div>
  );
};


// Línea divisoria vertical (pantalla dividida)
const VLine: React.FC<{e: El; t: number}> = ({e, t}) => <div style={{position: 'absolute', left: (e.x ?? 960) - 4, top: 60, width: 8, height: 960 * eo(t, e.at ?? 0, 0.5), borderRadius: 4, background: 'rgba(255,255,255,0.7)'}} />;

// Volante que se suelta y gira solo
const Wheel: React.FC<{e: El; t: number; i: number}> = ({e, t, i}) => (
  <Pos e={e} t={t} i={i}>
    <svg width={520} height={520} viewBox="-260 -260 520 520" style={{overflow: 'visible', transform: `rotate(${Math.pow(Math.max(0, t - (e.spinAt ?? 0.6)), 1.6) * 260 + Math.sin(t * 2) * 8}deg)`}}>
      <circle cx={0} cy={0} r={220} fill="none" stroke="#2b2f3a" strokeWidth={44} />
      <circle cx={0} cy={0} r={220} fill="none" stroke="#4a5060" strokeWidth={10} />
      <circle cx={0} cy={0} r={60} fill="#2b2f3a" />
      <path d="M-210 0 L-60 0 M60 0 L210 0 M0 60 L0 210" stroke="#2b2f3a" strokeWidth={38} strokeLinecap="round" />
      <circle cx={0} cy={0} r={26} fill={L.gold} />
    </svg>
  </Pos>
);

// Marcador fosforescente que subraya
const Hl: React.FC<{e: El; t: number}> = ({e, t}) => (
  <div style={{position: 'absolute', left: (e.x ?? 960) - (e.w ?? 1200) / 2, top: (e.y ?? 560) - (e.h ?? 60) / 2, width: (e.w ?? 1200) * eio(t, e.at ?? 0.4, e.dur ?? 0.7), height: e.h ?? 60, background: color(e.color) ?? 'rgba(250,204,21,0.55)', borderRadius: 14, transform: 'skewX(-12deg)', mixBlendMode: 'screen'}} />
);

export const renderExtra = (e: El, t: number, i: number): React.ReactNode | undefined => {
  switch (e.k) {
    case 'img':
      return <ImgEl key={i} e={e} t={t} i={i} />;
    case 'overlay':
      return <Overlay key={i} e={e} t={t} />;
    case 'fog':
      return <Fog key={i} e={e} t={t} />;
    case 'embers':
      return <Embers key={i} e={e} t={t} />;
    case 'battery':
      return <Battery key={i} e={e} t={t} i={i} />;
    case 'candle':
      return <Candle key={i} e={e} t={t} i={i} />;
    case 'label':
      return <Label key={i} e={e} t={t} i={i} />;
    case 'envelope':
      return <EnvelopeEl key={i} e={e} t={t} i={i} />;
    case 'stairs':
      return <Stairs key={i} e={e} t={t} />;
    case 'bomb':
      return <Bomb key={i} e={e} t={t} i={i} />;
    case 'hourglass':
      return <Hourglass key={i} e={e} t={t} i={i} />;
    case 'chat':
      return <Chat key={i} e={e} t={t} i={i} />;
    case 'line':
      return <Line key={i} e={e} t={t} />;
    case 'radar':
      return <Radar key={i} e={e} t={t} i={i} />;
    case 'crack':
      return <Crack key={i} e={e} t={t} />;
    case 'plug':
      return <Plug key={i} e={e} t={t} />;
    case 'gauge':
      return <Gauge key={i} e={e} t={t} i={i} />;
    case 'orbit':
      return <Orbit key={i} e={e} t={t} />;
    case 'stack':
      return <Stack key={i} e={e} t={t} />;
    case 'ash':
      return <AshTxt key={i} e={e} t={t} />;
    case 'bulb':
      return <Bulb key={i} e={e} t={t} i={i} />;
    case 'roadsign':
      return <RoadSign key={i} e={e} t={t} i={i} />;
    case 'sticky':
      return <Sticky key={i} e={e} t={t} i={i} />;
    case 'plane':
      return <Plane key={i} e={e} t={t} />;
    case 'subbtn':
      return <SubBtn key={i} e={e} t={t} i={i} />;
    case 'prop':
      return <Prop key={i} e={e} t={t} i={i} />;
    case 'icon':
      return <Icon key={i} e={e} t={t} i={i} />;
    case 'study':
      return <Study key={i} e={e} t={t} i={i} />;
    case 'calendar':
      return <Calendar key={i} e={e} t={t} i={i} />;
    case 'pct':
      return <Pct key={i} e={e} t={t} i={i} />;
    case 'row':
      return <Row key={i} e={e} t={t} />;
    case 'vline':
      return <VLine key={i} e={e} t={t} />;
    case 'wheel':
      return <Wheel key={i} e={e} t={t} i={i} />;
    case 'hl':
      return <Hl key={i} e={e} t={t} />;
    default:
      return undefined;
  }
};

