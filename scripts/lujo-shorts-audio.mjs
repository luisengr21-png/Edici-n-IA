// Música y efectos de los 3 shorts (sintetizados). Uso: node scripts/lujo-shorts-audio.mjs  → out/lujo-short{1,2,3}-{music,sfx}.wav
import fs from 'node:fs';
const SHORTS = JSON.parse(fs.readFileSync(new URL('../src/lujo/shorts.json', import.meta.url)));
const SR = 44100;
const TAU = Math.PI * 2;
let DUR = 0, N = 0;
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


const STY = {Short1: {bpm: 96, prog: [[38, [50, 53, 57, 62]], [34, [50, 53, 58, 62]], [41, [48, 53, 57, 60]], [36, [48, 52, 55, 60]]], drums: true},
  Short2: {bpm: 76, prog: [[38, [50, 53, 57, 62]], [34, [50, 53, 58, 62]], [41, [48, 53, 57, 60]], [36, [48, 52, 55, 60]]], drums: false},
  Short3: {bpm: 104, prog: [[41, [53, 57, 60, 65]], [36, [52, 55, 60, 64]], [38, [53, 57, 62, 65]], [34, [53, 58, 62, 65]]], drums: true}};
for (const sh of SHORTS) {
  DUR = sh.duration;
  N = Math.ceil(SR * DUR);
  const fx = bus(), music = bus();
  sh.scenes.forEach((sc, i) => {
    if (i > 0) whoosh(fx, sc.start - 0.12, 0.3, 0.22, true);
    for (const e of sc.els) {
      const t = sc.start + Math.max(0, e.at ?? 0.05);
      if (e.k === 'tag') { bandNoise(fx, t, 0.12, 3000, 0.16, 30); ding(fx, t + 0.05, 2093, 0.12, 0.2, 0.5); ding(fx, t + 0.12, 2637, 0.12, -0.2, 0.7); }
      if (e.k === 'stamp') { thump(fx, t, 0.4); bandNoise(fx, t, 0.12, 900, 0.2, 30); }
      if (e.k === 'cage') slam(fx, t + 0.35, 0.5);
      if (e.k === 'mark' && e.kind === 'x') beep(fx, t, 140, 0.3, 0.1);
      if (e.k === 'card' && e.mark === 'check') ding(fx, sc.start + (e.markAt ?? 0.8), 1568, 0.1);
      if (e.k === 'card' && e.mark === 'x') beep(fx, sc.start + (e.markAt ?? 0.8), 140, 0.3, 0.1);
      if (e.k === 'txt' && e.glow) ding(fx, t, 784, 0.16, 0, 1.8);
      if (e.k === 'emo' && e.anim === 'zoom') { sweep(fx, t, 0.18, 1800, 300, 0.2); }
      if (e.k === 'bag') { for (let k = 0; k < 6; k++) ding(fx, t + k * 0.05, 2400 + rnd() * 2400, 0.05, rnd() - 0.5, 0.3); }
      if (e.k === 'live') bandNoise(fx, sc.start, 2.5, 500, 0.08, 0.6);
    }
    if (sc.glitch != null) glitch(fx, sc.start + sc.glitch, 0.35, 0.2);
    if (sc.flash) slam(fx, sc.start, 0.35);
  });
  const st = STY[sh.id];
  const s16 = 60 / st.bpm / 4;
  for (let step = 0, t = 0; t < DUR; step++, t += s16) {
    const k = step % 16, bar = Math.floor(step / 16);
    const [root, ch] = st.prog[bar % 4];
    if (k === 0) pad(music, t, t + s16 * 16 + 0.3, ch.map(hz), 0.2);
    if (k % 4 === 0) subPulse(music, t, hz(root), 0.28);
    if (k % 2 === 0) pluck(music, t, hz(ch[[0, 2, 1, 3, 2, 1, 3, 0][(k / 2) % 8]] + 12), st.drums ? 0.1 : 0.07, k % 4 ? 0.4 : -0.4);
    if (st.drums) {
      if (k % 4 === 0) kick(music, t, 0.34);
      if (k === 4 || k === 12) clap(music, t, 0.12);
      if (k % 2 === 1) hat(music, t, 0.03);
    }
  }
  // entrada inmediata (el short arranca con todo) y salida muy corta para que el loop no se note
  for (let n = 0; n < N; n++) {
    const g = clamp(n / (0.05 * SR)) * clamp((N - n) / (0.25 * SR));
    music.L[n] *= g; music.R[n] *= g;
  }
  reverb(music, {room: 0.7, damp: 0.5, wet: 0.2});
  writeWav(music, `../out/lujo-${sh.id.toLowerCase()}-music.wav`, 0.85);
  writeWav(fx, `../out/lujo-${sh.id.toLowerCase()}-sfx.wav`, 0.9);
  console.log(sh.id, DUR);
}
