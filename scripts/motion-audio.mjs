// Banda sonora de la versión motion graphics de «Ansiedad por el estatus».
// Cama electrónica limpia a 110 bpm (Re menor → Fa mayor en «¿Cómo superarlo?») + efectos de UI
// sincronizados con la animación (mismas marcas de tiempo que src/motion).
import fs from 'node:fs';

const cues = JSON.parse(fs.readFileSync(new URL('../src/estatus/cues.json', import.meta.url)));
const plan = JSON.parse(fs.readFileSync(new URL('../src/motion/plan.json', import.meta.url)));
const SR = 44100;
const DUR = plan.duration;
const N = Math.ceil(SR * DUR);
const TAU = Math.PI * 2;
const S = (i) => cues[i].start;
const W = (i, w) => {
  const c = cues[i];
  const k = c.text.toLowerCase().indexOf(w.toLowerCase());
  if (k < 0) throw new Error(`${w} no está en la frase ${i}`);
  return c.start + (c.end - c.start) * (k / c.text.length);
};
const SC = (id) => plan.scenes.find((s) => s.id === id);

let seed = 31;
const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const bus = () => ({L: new Float32Array(N), R: new Float32Array(N)});
const gains = (pan) => [Math.cos(((pan + 1) * Math.PI) / 4), Math.sin(((pan + 1) * Math.PI) / 4)];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const each = (b, t0, dur, pan, fn) => {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(dur * SR);
  for (let j = 0; j < n; j++) {
    const i = i0 + j;
    if (i < 0 || i >= N) continue;
    const v = fn(j / SR, j);
    b.L[i] += v * gl;
    b.R[i] += v * gr;
  }
};

// ─────────────── síntesis ───────────────
const pluck = (b, t0, f, vel, pan = 0) =>
  each(b, t0, 0.7, pan, (t) => {
    let s = 0;
    for (let h = 1; h <= 8; h++) s += (Math.sin(TAU * f * h * t + h) / h) * Math.exp(-t * (6 + h * 4));
    return s * vel * (1 - Math.exp(-t * 500));
  });
const subPulse = (b, t0, f, vel) => each(b, t0, 0.27, 0, (t) => Math.sin(TAU * f * t) * vel * (1 - Math.exp(-t * 60)) * Math.exp(-t * 6));
const kick = (b, t0, vel) => {
  let ph = 0;
  each(b, t0, 0.3, 0, (t) => {
    ph += (TAU * (48 + 110 * Math.exp(-t * 40))) / SR;
    return Math.sin(ph) * Math.exp(-t * 14) * vel;
  });
};
const noiseHP = (b, t0, dur, vel, decay, pan = 0) => {
  let prev = 0;
  each(b, t0, dur, pan, (t) => {
    const n = rnd() * 2 - 1;
    const v = n - prev;
    prev = n;
    return v * Math.exp(-t * decay) * vel;
  });
};
const bandNoise = (b, t0, dur, fc, vel, decay, pan = 0) => {
  let s1 = 0, s2 = 0;
  const k = 1 - Math.exp((-TAU * fc) / SR);
  each(b, t0, dur, pan, (t) => {
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return (s1 - s2) * 2.2 * Math.exp(-t * decay) * vel;
  });
};
const clap = (b, t0, vel = 0.25, pan = 0) => {
  for (const d of [0, 0.011, 0.023]) bandNoise(b, t0 + d, 0.18, 1500, vel * (d ? 0.7 : 1), 28, pan);
};
const hat = (b, t0, vel) => noiseHP(b, t0, 0.05, vel, 140, 0.25);
const pad = (b, t0, t1, freqs, vel) =>
  freqs.forEach((f, k) => {
    const ph = rnd() * TAU;
    each(b, t0, t1 - t0, k % 2 ? 0.5 : -0.5, (t) => {
      const env = clamp(t / 0.8) * clamp((t1 - t0 - t) / 0.8);
      return (Math.sin(TAU * f * t + ph) + 0.25 * Math.sin(TAU * f * 2.004 * t)) * env * vel / freqs.length;
    });
  });
const sweep = (b, t0, dur, f0, f1, vel, pan = 0) => {
  let ph = 0;
  each(b, t0, dur, pan, (t) => {
    const u = t / dur;
    ph += (TAU * f0 * Math.pow(f1 / f0, u)) / SR;
    return Math.sin(ph) * Math.sin(Math.PI * u) * vel;
  });
};
const whoosh = (b, t0, dur = 0.45, vel = 0.3, up = true, pan = 0) => {
  let s1 = 0, s2 = 0;
  each(b, t0, dur, pan, (t) => {
    const u = t / dur;
    const fc = up ? 500 * Math.pow(14, u) : 7000 * Math.pow(1 / 14, u);
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return s2 * Math.sin(Math.PI * u) ** 1.3 * vel;
  });
};
const pop = (b, t0, vel = 0.18, f = 700, pan = 0) => each(b, t0, 0.13, pan, (t) => Math.sin(TAU * (f + f * 1.3 * Math.exp(-t * 45)) * t) * Math.exp(-t * 32) * vel);
const tick = (b, t0, vel = 0.08, pan = 0) => each(b, t0, 0.03, pan, (t) => Math.sin(TAU * 3200 * t) * Math.exp(-t * 220) * vel + (rnd() * 2 - 1) * Math.exp(-t * 400) * vel * 0.5);
const ding = (b, t0, f, vel = 0.12, pan = 0, decay = 1.2) =>
  each(b, t0, decay * 3, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 1], [2.0, 0.35, 1.6], [2.76, 0.22, 2.4], [5.4, 0.1, 4]]) s += Math.sin(TAU * f * r * t) * a * Math.exp((-t * d) / decay);
    return s * vel * (1 - Math.exp(-t * 600));
  });
const boom = (b, t0, vel = 0.5) => {
  let ph = 0;
  each(b, t0, 1.4, 0, (t) => {
    ph += (TAU * (36 + 60 * Math.exp(-t * 10))) / SR;
    return (Math.sin(ph) * Math.exp(-t * 3) + (rnd() * 2 - 1) * Math.exp(-t * 30) * 0.25) * vel;
  });
};
const slam = (b, t0, vel = 0.5) => {
  kick(b, t0, vel);
  bandNoise(b, t0, 0.25, 2200, vel * 0.6, 20);
  boom(b, t0, vel * 0.5);
};
const riser = (b, t0, dur = 1.0, vel = 0.22) => {
  whoosh(b, t0, dur, vel, true);
  sweep(b, t0, dur, 200, 1200, vel * 0.3);
};
const glitch = (b, t0, dur = 0.3, vel = 0.25) => {
  let hold = 0, val = 0;
  each(b, t0, dur, 0, (t, j) => {
    if (hold-- <= 0) {
      hold = 4 + Math.floor(rnd() * 60);
      val = Math.round((rnd() * 2 - 1) * 3) / 3;
    }
    return (val * 0.7 + Math.sin(TAU * 1800 * t) * 0.3) * vel * clamp(j / 30) * clamp((dur * SR - j) / 60);
  });
};
const shatter = (b, t0, vel = 0.25) => {
  noiseHP(b, t0, 0.5, vel, 9);
  for (let k = 0; k < 8; k++) ding(b, t0 + rnd() * 0.15, 2500 + rnd() * 3000, vel * 0.25, rnd() * 1.6 - 0.8, 0.12);
};
const thump = (b, t0, vel) => {
  let ph = 0;
  each(b, t0, 0.3, 0, (t) => {
    ph += (TAU * (40 + 40 * Math.exp(-t * 30))) / SR;
    return Math.sin(ph) * (1 - Math.exp(-t * 300)) * Math.exp(-t * 14) * vel;
  });
};
const beep = (b, t0, f, dur, vel) => each(b, t0, dur, 0, (t) => Math.sign(Math.sin(TAU * f * t)) * 0.3 * vel * clamp(t / 0.005) * clamp((dur - t) / 0.01));
const crackle = (b, t0, dur, vel) => {
  for (let k = 0; k < dur * 60; k++) tick(b, t0 + rnd() * dur, vel * (0.4 + rnd()), rnd() * 1.6 - 0.8);
};

function reverb(b, {room = 0.8, damp = 0.4, wet = 0.25}) {
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const mk = (n) => ({buf: new Float32Array(n), i: 0, store: 0});
  const cL = combT.map(mk), cR = combT.map((t) => mk(t + 23));
  const aL = apT.map(mk), aR = apT.map((t) => mk(t + 23));
  const fb = room * 0.28 + 0.7, d1 = damp * 0.4, d2 = 1 - d1;
  const run = (combs, aps, x) => {
    let o = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.store = y * d2 + c.store * d1;
      c.buf[c.i] = x + c.store * fb;
      if (++c.i >= c.buf.length) c.i = 0;
      o += y;
    }
    for (const a of aps) {
      const bo = a.buf[a.i];
      const y = -o + bo;
      a.buf[a.i] = o + bo * 0.5;
      if (++a.i >= a.buf.length) a.i = 0;
      o = y;
    }
    return o;
  };
  for (let i = 0; i < N; i++) {
    const x = (b.L[i] + b.R[i]) * 0.015;
    b.L[i] += run(cL, aL, x) * wet;
    b.R[i] += run(cR, aR, x) * wet;
  }
}
function writeWav(b, path, peakTarget) {
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(b.L[i]), Math.abs(b.R[i]));
  const g = peakTarget / (peak || 1);
  const out = Buffer.alloc(44 + N * 4);
  out.write('RIFF', 0);
  out.writeUInt32LE(36 + N * 4, 4);
  out.write('WAVEfmt ', 8);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SR, 24);
  out.writeUInt32LE(SR * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write('data', 36);
  out.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    out.writeInt16LE(Math.round(clamp(b.L[i] * g, -1, 1) * 32767), 44 + i * 4);
    out.writeInt16LE(Math.round(clamp(b.R[i] * g, -1, 1) * 32767), 46 + i * 4);
  }
  fs.writeFileSync(new URL(path, import.meta.url), out);
}

// ─────────────── música ───────────────
const music = bus();
const BEAT = 60 / 110;
const HOPE = SC(18).start;
const QUIET = [SC(17).start, HOPE];
const DRUMS_IN = SC(2).start;
const CHAPTERS = [3, 8, 12, 18].map((id) => SC(id).start);
const DARK = [[38, [50, 53, 57, 62]], [34, [50, 53, 58, 62]], [41, [48, 53, 57, 60]], [36, [48, 52, 55, 60]]]; // Dm Bb F C
const BRIGHT = [[41, [53, 57, 60, 65]], [36, [52, 55, 60, 64]], [38, [53, 57, 62, 65]], [34, [53, 58, 62, 65]]]; // F C Dm Bb
const ARP = [0, 2, 3, 1, 2, 3, 1, 2];
const nearChapter = (t) => CHAPTERS.some((c) => t > c - 1.1 && t < c + 0.15);
for (let beat = 0, t = 0.15; t < DUR - 1.2; beat++, t += BEAT) {
  const hope = t >= HOPE;
  const quiet = t >= QUIET[0] && t < QUIET[1];
  const [root, notes] = (hope ? BRIGHT : DARK)[Math.floor(beat / 8) % 4];
  if (beat % 8 === 0) pad(music, t, t + BEAT * 8 + 0.4, notes.map((n) => hz(n)), quiet ? 0.06 : 0.08);
  if (quiet) continue;
  const brk = nearChapter(t);
  // pluck en corcheas
  for (let e = 0; e < 2; e++) {
    const k = ARP[(beat * 2 + e) % 8];
    pluck(music, t + e * (BEAT / 2), hz(notes[k] + 12 + (hope && e ? 12 : 0)), e ? 0.06 : 0.09, (k - 1.5) * 0.35);
  }
  if (t < DRUMS_IN || brk) continue;
  kick(music, t, 0.3);
  subPulse(music, t + BEAT / 2, hz(root - 12), 0.22);
  if (beat % 2 === 1) clap(music, t, 0.12, 0.1);
  hat(music, t + BEAT / 2, 0.06);
}
for (const c of CHAPTERS) {
  riser(music, c - 1.0, 1.0, 0.2);
  boom(music, c, 0.55);
}
// acorde final
pad(music, DUR - 6, DUR, BRIGHT[0][1].map((n) => hz(n)), 0.12);
ding(music, DUR - 6.2, hz(77), 0.08, 0, 2.5);
reverb(music, {room: 0.7, wet: 0.2});
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = clamp(t / 0.4) * clamp((DUR - t) / 2.5);
  music.L[i] *= g;
  music.R[i] *= g;
}
writeWav(music, '../out/motion-music.wav', 0.8);

// ─────────────── efectos de interfaz ───────────────
const fx = bus();
// transiciones
for (const sc of plan.scenes.slice(1)) {
  if (sc.in === 'push') whoosh(fx, sc.start - 0.05, 0.5, 0.3, true, 0.3);
  if (sc.in === 'circle') {
    whoosh(fx, sc.start - 0.05, 0.55, 0.25, true);
    boom(fx, sc.start + 0.05, 0.15);
  }
  if (sc.in === 'bars') whoosh(fx, sc.start - 0.05, 0.6, 0.32, true, -0.3);
  if (sc.in === 'zoom') whoosh(fx, sc.start - 0.1, 0.55, 0.3, false);
}
// escena 1
{
  const q = S(1);
  pop(fx, W(0, 'tu valor') - 0.1, 0.16, 500);
  pop(fx, W(0, 'depender'), 0.14, 900);
  pop(fx, W(0, 'una sola') - 0.05, 0.16, 650);
  whoosh(fx, q - 0.55, 0.35, 0.22, false);
  beep(fx, q - 0.45, 880, 0.05, 0.05);
  pop(fx, q - 0.12, 0.22, 400);
  boom(fx, q - 0.12, 0.2);
  for (let k = 0; k < 18; k++) tick(fx, q + k * 0.035, 0.05, (k / 18 - 0.5) * 0.6);
}
// escena 2
{
  const a = SC(2).start;
  const tImp = W(2, 'impresionante');
  const tAside = W(2, 'dejarte');
  pop(fx, a + 0.15, 0.15, 520);
  pop(fx, a + 0.3, 0.15, 620);
  pop(fx, a + 0.6, 0.14, 800);
  whoosh(fx, tImp - 0.3, 0.45, 0.18, true, 0.4);
  sweep(fx, tImp + 0.1, 1.1, 400, 1200, 0.06);
  ding(fx, tImp + 1.1, hz(84), 0.07, -0.3, 0.6);
  whoosh(fx, tAside - 0.7, 0.45, 0.18, true, 0.4);
  sweep(fx, tAside - 0.3, 0.7, 900, 250, 0.06);
  whoosh(fx, tAside + 0.15, 0.7, 0.25, false, -0.6);
}
// escena 3
{
  const a = SC(3).start;
  const build = a + 2.1;
  const tPart = W(3, 'pequeña parte');
  const tId = W(3, 'identidades');
  const tVer = W(3, 'veredicto');
  pop(fx, build, 0.18, 400);
  for (let i = 0; i < 5; i++) pop(fx, build + 0.4 + i * 0.12, 0.1, 700 + i * 120, (i - 2) * 0.3);
  pop(fx, build + 0.9, 0.12, 600);
  const scanA = tPart - 0.3;
  sweep(fx, scanA, 1.3, 300, 2400, 0.07);
  whoosh(fx, scanA, 1.3, 0.12, true);
  sweep(fx, scanA + 0.9, 0.6, 600, 120, 0.08);
  ding(fx, scanA + 1.2, hz(81), 0.08, 0.3, 0.8);
  pop(fx, tId, 0.12, 750);
  for (let t0 = tVer - 0.25; t0 < tVer + 0.7; t0 += 0.033) tick(fx, t0, 0.05);
  slam(fx, tVer, 0.55);
  beep(fx, tVer + 0.7, 220, 0.25, 0.08);
}
// escena 4
{
  const a = SC(4).start;
  const tHeart = S(5);
  const tCold = S(6);
  pop(fx, a + 0.2, 0.14, 480);
  pop(fx, a + 0.4, 0.14, 640);
  pop(fx, tHeart - 0.05, 0.2, 380);
  for (let t0 = tHeart + 0.3; t0 < tCold + 1.6; t0 += 0.84) {
    thump(fx, t0, 0.3);
    thump(fx, t0 + 0.2, 0.2);
  }
  whoosh(fx, tCold - 0.2, 0.8, 0.2, false);
  for (let i = 0; i < 22; i++) pop(fx, tCold + 0.3 + i * 0.05, 0.05, 900 + (i % 5) * 100, Math.cos((i / 22) * TAU) * 0.8);
  slam(fx, W(7, 'juicio') - 0.05, 0.45);
  slam(fx, W(7, 'humillación') - 0.05, 0.5);
}
// escena 5
{
  const a = SC(5).start;
  const tEmo = W(9, 'recompensas');
  for (let i = 0; i < 4; i++) {
    whoosh(fx, a + 0.4 + i * 0.3, 0.2, 0.1, false);
    pop(fx, a + 0.55 + i * 0.3, 0.16, 450 + i * 90, (i - 1.5) * 0.4);
    pop(fx, tEmo + 0.1 + i * 0.2, 0.1, 1100 + i * 150, (i - 1.5) * 0.4);
  }
  pop(fx, tEmo - 0.1, 0.12, 600);
  pop(fx, W(9, 'vinculan'), 0.14, 900);
  pop(fx, W(9, 'bienes') - 0.1, 0.12, 700);
}
// escena 6
{
  const a = SC(6).start;
  const tDive = W(10, 'rara vez');
  for (let i = 0; i < 3; i++) pop(fx, a + 0.5 + i * 0.25, 0.12, 600 + i * 100, (i - 1) * 0.5);
  whoosh(fx, tDive - 0.2, 1.8, 0.25, false);
  for (let k = 0; k < 26; k++) pop(fx, tDive + 0.2 + rnd() * 2.2, 0.035, 500 + rnd() * 900, rnd() * 1.4 - 0.7);
  boom(fx, W(10, 'atención') - 0.1, 0.18);
  boom(fx, W(10, 'respeto') - 0.1, 0.18);
  slam(fx, W(10, 'amor') - 0.1, 0.35);
  ding(fx, W(10, 'amor'), hz(88), 0.07, 0, 1.2);
  pop(fx, W(10, 'aquellos') - 0.3, 0.12, 700);
}
// escena 7
{
  const a = SC(7).start;
  const tFri = W(11, 'frivolidad');
  const tIn = S(12);
  const tNeed = W(12, 'necesidad');
  whoosh(fx, a + 0.05, 0.5, 0.2, true);
  for (let i = 0; i < 26; i++) pop(fx, a + 0.8 + i * 0.22, 0.03, 1400 + (i % 4) * 200, -0.3);
  pop(fx, W(11, 'vanidad') - 0.1, 0.12, 700, -0.5);
  pop(fx, tFri - 0.1, 0.12, 800, 0.5);
  shatter(fx, tFri + 1.0, 0.22);
  shatter(fx, tFri + 1.2, 0.22);
  whoosh(fx, tIn - 0.3, 1.4, 0.3, true);
  for (let k = 0; k < 5; k++) {
    beep(fx, tIn + 1.2 + k * 0.67, 660, 0.08, 0.035);
    beep(fx, tIn + 1.32 + k * 0.67, 440, 0.12, 0.035);
  }
  pop(fx, W(12, 'vulnerabilidad') - 0.1, 0.1, 500);
  pop(fx, tNeed - 0.1, 0.1, 650);
  for (const w of ['vecino', 'amigo', 'compañero']) {
    const at = W(13, w) - 0.4;
    whoosh(fx, at, 0.4, 0.18, true, 0.5);
    ding(fx, at + 0.4, hz(91), 0.09, 0.4, 0.5);
  }
}
// escena 8
{
  const a = SC(8).start;
  const tCan = W(14, '¡podemos');
  const boomT = tCan + 1.4;
  const tKid = S(15);
  const tNet = S(16);
  const tFall = S(17);
  const tFail = W(17, 'fallamos');
  for (let k = 0; k < 11; k++) tick(fx, tCan - 0.5 + k * 0.03, 0.05);
  for (let k = 0; k < 15; k++) tick(fx, tCan - 0.2 + k * 0.03, 0.05);
  boom(fx, boomT, 0.4);
  noiseHP(fx, boomT, 0.3, 0.3, 12);
  crackle(fx, boomT + 0.05, 1.2, 0.06);
  pop(fx, a + 2.1, 0.12, 700);
  for (let k = 0; k < 8; k++) {
    clap(fx, tKid + 0.1 + k * 0.25, 0.1, -0.5);
    clap(fx, tKid + 0.22 + k * 0.25, 0.1, 0.5);
  }
  for (let lvl = 1; lvl <= 5; lvl++) ding(fx, tNet + 0.5 + lvl * 0.35, hz(72 + [0, 2, 4, 7, 9][lvl - 1]), 0.05, (lvl - 3) * 0.3, 0.4);
  sweep(fx, tFall, tFail - tFall + 0.1, 300, 900, 0.04);
  glitch(fx, tFail, 0.35, 0.22);
  sweep(fx, tFail + 0.3, 1.0, 900, 120, 0.08);
}
// escena 9
{
  const a = SC(9).start;
  const tRule = W(21, 'misma regla');
  const tGo = tRule + 1.3;
  pop(fx, a + 0.3, 0.12, 600);
  pop(fx, a + 0.5, 0.12, 500);
  for (const w of ['educación', 'salud', 'estabilidad']) pop(fx, W(20, w) - 0.1, 0.14, 1000);
  for (let i = 0; i < 3; i++) thump(fx, W(20, 'carencias') + 0.1 + i * 0.15, 0.3);
  pop(fx, tRule - 0.1, 0.12, 700);
  beep(fx, tGo - 0.3, 1200, 0.25, 0.05);
  slam(fx, tGo, 0.25);
  [1000, 1220, 1440].forEach((x) => {
    const at = tGo + ((x - 760) / 920) * 5.5 * 0.55;
    ding(fx, at, hz(96), 0.06, 0.4, 0.3);
  });
  slam(fx, W(21, 'desigualdades') - 0.1, 0.45);
}
// escena 10
{
  const a = SC(10).start;
  for (let i = 0; i < 6; i++) thump(fx, a + 0.6 + i * 0.12, 0.2);
  for (let i = 0; i < 2; i++) thump(fx, a + 1.4 + i * 0.12, 0.2);
  for (const at of [S(24) - 0.15, W(24, 'conviértase') - 0.2, S(26) - 0.15]) {
    whoosh(fx, at - 0.1, 0.35, 0.15, true);
    pop(fx, at + 0.15, 0.12, 550);
  }
  pop(fx, S(23), 0.08, 900);
  pop(fx, S(25), 0.08, 700);
}
// escena 11
{
  const a = SC(11).start;
  const tF = W(28, 'una sociedad');
  pop(fx, a + 0.2, 0.15, 650);
  for (let i = 0; i < 120; i++) if (i % 4 === 0) tick(fx, tF + i * 0.07 + 0.8, 0.025, rnd() - 0.5);
  for (let i = 0; i < 10; i++) ding(fx, tF + (i * 12 + 5) * 0.07 + 0.65, hz(93), 0.03, 0, 0.2);
  pop(fx, W(28, 'pequeña minoría'), 0.1, 900);
}
// escena 12
{
  const tPast = S(30);
  const tMer = W(32, 'meritocracias');
  pop(fx, tPast + 0.2, 0.12, 500);
  pop(fx, tPast + 0.5, 0.1, 600);
  pop(fx, tPast + 0.7, 0.1, 700);
  sweep(fx, W(31, 'culpa'), 0.25, 300, 600, 0.06);
  sweep(fx, W(31, 'feudal'), 0.25, 300, 600, 0.06);
  whoosh(fx, tMer - 0.8, 1.3, 0.25, true);
  for (let k = 0; k < 12; k++) tick(fx, tMer + k * 0.04, 0.05);
  pop(fx, W(32, 'trabajadoras') - 0.1, 0.1, 800);
  pop(fx, W(32, 'astutas') - 0.1, 0.1, 950);
}
// escena 13
{
  const a = SC(13).start;
  for (let i = 0; i < 3; i++) pop(fx, W(33, 'adorables') + i * 0.12, 0.08, 1200 + i * 200);
  pop(fx, W(33, 'problema') - 0.1, 0.12, 500);
  for (let i = 0; i < 6; i++) thump(fx, a + 0.4 + i * 0.08, 0.12);
  ding(fx, W(33, 'cima') + 0.1, hz(88), 0.07, 0.4, 0.6);
  ding(fx, W(33, 'cima') + 0.3, hz(93), 0.07, 0.5, 0.6);
  whoosh(fx, W(33, 'fondo') - 0.2, 0.7, 0.25, false);
  slam(fx, W(33, 'responsables'), 0.45);
}
// escena 14
{
  const a = SC(14).start;
  const tSys = W(36, 'sistemas');
  pop(fx, a + 0.2, 0.15, 400);
  pop(fx, W(35, 'repetir') - 0.2, 0.14, 700);
  whoosh(fx, W(35, 'no se corrigen') + 0.2, 0.3, 0.15, true);
  pop(fx, W(36, 'esforzarse'), 0.12, 800);
  pop(fx, W(36, 'listo'), 0.12, 900);
  whoosh(fx, W(36, 'reconocer'), 0.8, 0.18, false);
  whoosh(fx, tSys - 0.6, 1.0, 0.25, true);
  bandNoise(fx, tSys + 1.3, 6, 900, 0.03, 0.2);
}
// escena 15: ruleta
{
  const tMed = S(38);
  const tNow = S(39);
  slam(fx, W(37, 'merece'), 0.45);
  const T1 = tNow + 0.6;
  let lastSeg = -1;
  for (let t0 = tMed; t0 < T1; t0 += 0.004) {
    const T = clamp((t0 - tMed) / (T1 - tMed));
    const seg = Math.floor((900 * (1 - Math.pow(1 - T, 3))) / 45);
    if (seg !== lastSeg) {
      tick(fx, t0, 0.1, 0.1);
      lastSeg = seg;
    }
  }
  ding(fx, W(38, 'desafortunados') - 0.2, hz(74), 0.08, 0, 1.6);
  pop(fx, W(38, 'diosa') - 0.2, 0.1, 700);
  whoosh(fx, W(39, 'estados unidos') - 0.8, 0.5, 0.2, true);
  slam(fx, W(39, 'perdedores'), 0.55);
}
// escena 16
{
  const a = SC(16).start;
  for (let k = 0; k < 14; k++) tick(fx, a + 0.1 + k * 0.09 * (1 + k * 0.05), 0.12, rnd() - 0.5);
  crackle(fx, a + 2.6, 1.0, 0.08);
  ding(fx, S(41) - 0.1, hz(84), 0.1, 0, 0.5);
  ding(fx, S(41) + 0.1, hz(88), 0.08, 0, 0.5);
  slam(fx, W(41, 'mala suerte') + 0.7, 0.35);
  pop(fx, S(42), 0.14, 500);
  ding(fx, W(42, 'posición') - 0.1, hz(91), 0.06, 0.3, 0.4);
  pop(fx, W(42, 'carácter') - 0.1, 0.14, 650);
  slam(fx, W(42, 'veredicto'), 0.5);
  glitch(fx, W(42, 'veredicto'), 0.3, 0.2);
}
// escena 17: muy sutil
{
  ding(fx, W(44, 'vergüenza') - 0.5, hz(69), 0.03, -0.4, 1.5);
  ding(fx, W(44, 'mienten') - 0.5, hz(72), 0.03, 0, 1.5);
  ding(fx, W(44, 'rotas') - 0.5, hz(76), 0.03, 0.4, 1.5);
  for (let k = 0; k < 6; k++) ding(fx, W(44, 'rotas') + 0.5 + k * 0.2, hz(84 + k * 2), 0.02, 0.4, 0.6);
}
// escena 18
{
  const a = SC(18).start;
  noiseHP(fx, a + 0.6, 0.3, 0.25, 12);
  crackle(fx, a + 0.65, 1.2, 0.05);
}
// escena 19: Galton
{
  const a = SC(19).start;
  const start = a + 0.9;
  bandNoise(fx, start, 70 * 0.13 + 1, 3000, 0.025, 0.05);
  for (let i = 0; i < 70; i++) tick(fx, start + i * 0.13 + 10 * 0.1, 0.035, rnd() - 0.5);
  ding(fx, start + 47 * 0.13 + 1.0, hz(88), 0.08, 0, 0.6);
  pop(fx, start + 47 * 0.13 + 1.4, 0.12, 800);
}
// escena 20
{
  whoosh(fx, W(48, 'sociedad') - 0.2, 0.6, 0.15, true);
  whoosh(fx, W(49, 'muchas formas') - 0.2, 0.6, 0.15, true);
  ding(fx, W(49, 'muchas formas') + 0.3, hz(84), 0.06, 0, 0.8);
  for (const w of ['empatía', 'familiar']) for (let k = 0; k < 3; k++) beep(fx, W(50, w) + k * 0.8, 520, 0.07, 0.03);
}
// escena 21
{
  const a = SC(21).start;
  crackle(fx, a + 0.5, 1.4, 0.03);
  whoosh(fx, a + 0.9, W(52, 'currículum') - 0.7 - (a + 0.9), 0.2, false);
  pop(fx, W(52, 'currículum') + 0.2, 0.12, 800);
  pop(fx, S(52) + 0.1, 0.12, 600);
}
// escena 22
{
  const a = SC(22).start;
  const tTired = W(53, 'agotadora');
  const q = S(54);
  const morph = q + 0.95;
  pop(fx, a + 0.3, 0.18, 420);
  for (let t0 = a + 0.6; t0 < tTired - 0.2; t0 += 0.18) tick(fx, t0, 0.03);
  sweep(fx, tTired - 0.2, 0.6, 500, 180, 0.06);
  for (let k = 0; k < 18; k++) tick(fx, tTired - 0.1 + k * 0.025, 0.04);
  shatter(fx, morph, 0.25);
  ding(fx, morph + 0.15, hz(84), 0.1, 0, 1.0);
  ding(fx, morph + 0.25, hz(91), 0.08, 0, 1.0);
  noiseHP(fx, morph + 0.1, 0.25, 0.2, 14);
}
// escena 23
{
  const a = SC(23).start;
  whoosh(fx, a + 0.1, 0.4, 0.18, true);
  pop(fx, W(56, 'dinero') - 0.1, 0.14, 600, -0.3);
  pop(fx, W(56, 'humano') - 0.2, 0.14, 800, 0.3);
}
// escena 24
{
  const a = SC(24).start;
  const b = SC(24).end;
  for (let k = 0; k < 23; k++) tick(fx, a + 0.25 + k * 0.025, 0.04);
  [W(57, 'comentarios'), W(57, 'like'), W(57, 'suscribirte')].forEach((t0, i) => {
    pop(fx, t0 - 0.15, 0.2, 500 + i * 150);
    noiseHP(fx, t0, 0.2, 0.12, 18);
  });
  ding(fx, W(57, 'suscribirte') + 0.1, hz(84), 0.12, 0.2, 1.2);
  ding(fx, W(57, 'suscribirte') + 0.25, hz(88), 0.1, 0.2, 1.2);
  whoosh(fx, b - 1.1, 1.0, 0.25, false);
}
reverb(fx, {room: 0.5, wet: 0.14});
writeWav(fx, '../out/motion-sfx.wav', 0.7);
console.log('motion-music.wav y motion-sfx.wav listos');
