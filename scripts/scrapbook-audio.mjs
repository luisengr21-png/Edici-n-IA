// Banda sonora de «Ser real» (versión scrapbook): partitura acústica lo-fi (guitarra punteada Karplus-Strong,
// kalimba, caja de música, contrabajo, escobillas, crujido de vinilo) y efectos de papelería sincronizados con
// src/scrapbook (mismas marcas de tiempo vía src/serreal/cues.json y plan.json).
// Salida: out/scrapbook-music.wav y out/scrapbook-sfx.wav (44.1 kHz, estéreo).
import fs from 'node:fs';

const cues = JSON.parse(fs.readFileSync(new URL('../src/serreal/cues.json', import.meta.url)));
const plan = JSON.parse(fs.readFileSync(new URL('../src/serreal/plan.json', import.meta.url)));
const SR = 44100;
const DUR = plan.duration;
const N = Math.ceil(SR * DUR);
const TAU = Math.PI * 2;
const S = (i) => cues[i].start;
const E = (i) => cues[i].end;
const W = (i, w) => {
  const c = cues[i];
  const k = c.text.toLowerCase().indexOf(w.toLowerCase());
  if (k < 0) throw new Error(`${w} no está en la frase ${i}`);
  return c.start + (c.end - c.start) * (k / c.text.length);
};
const A = (id) => plan.scenes.find((s) => s.id === id).start;
const hash = (n) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
let seed = 909;
const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const bus = () => ({L: new Float32Array(N), R: new Float32Array(N)});
const gains = (pan) => [Math.cos(((pan + 1) * Math.PI) / 4), Math.sin(((pan + 1) * Math.PI) / 4)];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const each = (b, t0, dur, pan, fn) => {
  const [gl, gr] = gains(clamp(pan, -1, 1));
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(dur * SR);
  for (let j = 0; j < n; j++) {
    const i = i0 + j;
    if (i >= N) break;
    if (i < 0) continue;
    const v = fn(j / SR, j);
    b.L[i] += v * gl;
    b.R[i] += v * gr;
  }
};

// ─────────────── instrumentos ───────────────
/** Guitarra / cuerda punteada (Karplus-Strong) */
const guitar = (b, t0, m, vel, pan = 0, len = 3, bright = 0.5) => {
  const f = hz(m);
  const L = Math.max(2, Math.round(SR / f));
  const buf = new Float32Array(L);
  let prev = 0;
  for (let i = 0; i < L; i++) {
    const n = rnd() * 2 - 1;
    prev = prev + bright * (n - prev);
    buf[i] = prev;
  }
  let idx = 0;
  const decay = 0.996 - (m > 70 ? 0.002 : 0);
  each(b, t0, len, pan, (t) => {
    const a = buf[idx];
    const nb = buf[(idx + 1) % L];
    buf[idx] = (a + nb) * 0.5 * decay;
    idx = (idx + 1) % L;
    return a * vel * clamp((len - t) / 0.3);
  });
};
const strum = (b, t0, midis, vel, down = true, pan = 0) =>
  (down ? midis : [...midis].reverse()).forEach((m, k) => guitar(b, t0 + k * 0.018, m, vel * (0.8 + 0.2 * rnd()), pan + (k - midis.length / 2) * 0.08, 2.6, 0.45));
const kalimba = (b, t0, m, vel = 0.12, pan = 0) => {
  const f = hz(m);
  each(b, t0, 2.4, pan, (t) => {
    const s = Math.sin(TAU * f * t) * Math.exp(-t * 2.2) + 0.35 * Math.sin(TAU * f * 5.4 * t) * Math.exp(-t * 14) + 0.2 * Math.sin(TAU * f * 2.01 * t) * Math.exp(-t * 6);
    return s * vel * (1 - Math.exp(-t * 900));
  });
};
const musicBox = (b, t0, m, vel = 0.08, pan = 0, decay = 1.6) => {
  const f = hz(m);
  each(b, t0, decay * 3, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 1], [3.0, 0.35, 2.2], [5.9, 0.18, 4], [8.6, 0.08, 6]]) s += Math.sin(TAU * f * r * t) * a * Math.exp((-t * d) / decay);
    return s * vel * (1 - Math.exp(-t * 1200));
  });
};
const bass = (b, t0, m, vel = 0.2, len = 1.4) => {
  const f = hz(m);
  each(b, t0, len, 0, (t) => (Math.sin(TAU * f * t) + 0.25 * Math.sin(TAU * f * 2 * t) * Math.exp(-t * 6)) * Math.exp(-t * 2.2) * vel * (1 - Math.exp(-t * 300)) * clamp((len - t) / 0.2));
};
const kick = (b, t0, vel) => {
  let ph = 0;
  each(b, t0, 0.3, 0, (t) => {
    ph += (TAU * (50 + 70 * Math.exp(-t * 40))) / SR;
    return Math.sin(ph) * Math.exp(-t * 12) * vel;
  });
};
const bandNoise = (b, t0, dur, fc, vel, env, pan = 0, q = 1) => {
  let s1 = 0;
  let s2 = 0;
  const k = 1 - Math.exp((-TAU * fc) / SR);
  each(b, t0, dur, pan, (t) => {
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return (s1 - s2 * q) * 2.2 * env(t) * vel;
  });
};
const brush = (b, t0, vel) => bandNoise(b, t0, 0.32, 3500, vel, (t) => Math.sin(Math.PI * clamp(t / 0.32)) * Math.exp(-t * 4), 0.15);
const voice = (b, t0, dur, f, vel, {att = 1.5, rel = 2, pan = 0, vib = 0.004, h2 = 0.3} = {}) => {
  let ph = rnd();
  each(b, t0, dur + rel, pan, (t) => {
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    ph += (f * (1 + Math.sin(TAU * 5 * t) * vib)) / SR;
    ph -= Math.floor(ph);
    return (Math.sin(TAU * ph) + h2 * Math.sin(2 * TAU * ph) + 0.1 * Math.sin(3 * TAU * ph)) * env * vel;
  });
};

// ─────────────── efectos de papelería ───────────────
const rustle = (b, t0, dur = 0.6, vel = 0.12, pan = 0) => {
  let s1 = 0;
  let s2 = 0;
  each(b, t0, dur, pan, (t) => {
    const fc = 2500 + 3000 * hash(Math.floor(t * 70) + t0 * 13);
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    const am = 0.35 + 0.65 * Math.abs(Math.sin(t * 47 + hash(t0) * 9)) * (hash(Math.floor(t * 40) + t0) > 0.3 ? 1 : 0.25);
    return (s1 - s2) * 2.2 * am * Math.sin(Math.PI * clamp(t / dur)) * vel;
  });
};
const slap = (b, t0, vel = 0.15, pan = 0) => {
  bandNoise(b, t0, 0.08, 1200, vel, (t) => Math.exp(-t * 60), pan);
  each(b, t0, 0.06, pan, (t) => Math.sin(TAU * 180 * t) * Math.exp(-t * 70) * vel * 0.6);
};
const tick = (b, t0, vel = 0.05, pan = 0, f = 3000) =>
  each(b, t0, 0.04, pan, (t) => Math.sin(TAU * f * t) * Math.exp(-t * 220) * vel + (rnd() * 2 - 1) * Math.exp(-t * 500) * vel * 0.4);
const click = (b, t0, vel = 0.2, pan = 0) => {
  bandNoise(b, t0, 0.05, 2600, vel, (t) => Math.exp(-t * 120), pan);
  each(b, t0, 0.06, pan, (t) => Math.sin(TAU * 1000 * t) * Math.exp(-t * 90) * vel * 0.4);
};
const rip = (b, t0, dur = 0.35, vel = 0.14, pan = 0) => {
  for (let k = 0; k < dur * 90; k++) bandNoise(b, t0 + k / 90 + rnd() * 0.004, 0.02, 3000 + rnd() * 2500, vel * (0.5 + rnd() * 0.5), (t) => Math.exp(-t * 200), pan);
};
const scratch = (b, t0, dur = 0.3, vel = 0.1, pan = 0) =>
  bandNoise(b, t0, dur, 3800, vel, (t) => Math.sin(Math.PI * clamp(t / dur)) * (0.5 + 0.5 * Math.sin(t * 90)), pan);
const thump = (b, t0, vel = 0.3) => {
  let ph = 0;
  each(b, t0, 0.5, 0, (t) => {
    ph += (TAU * (70 + 60 * Math.exp(-t * 30))) / SR;
    return (Math.sin(ph) * Math.exp(-t * 12) + (rnd() * 2 - 1) * Math.exp(-t * 60) * 0.3) * vel;
  });
};
const metal = (b, t0, vel = 0.1, f = 900, pan = 0) =>
  each(b, t0, 1.2, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 5], [2.76, 0.6, 7], [5.4, 0.4, 9]]) s += Math.sin(TAU * f * r * t) * a * Math.exp(-t * d);
    return s * vel;
  });
const snip = (b, t0, vel = 0.2) => {
  metal(b, t0, vel * 0.4, 2400, 0.1);
  click(b, t0, vel, 0.1);
  bandNoise(b, t0 + 0.01, 0.06, 5000, vel * 0.6, (t) => Math.exp(-t * 80), 0.1);
};
const whir = (b, t0, dur = 1.0, vel = 0.08, pan = 0.4) => {
  let ph = 0;
  each(b, t0, dur, pan, (t) => {
    ph += (TAU * (110 + 20 * Math.sin(t * 30))) / SR;
    const saw = (ph / TAU) % 1;
    return ((saw * 2 - 1) * 0.4 + (rnd() * 2 - 1) * 0.3) * vel * Math.sin(Math.PI * clamp(t / dur));
  });
};
const typeKey = (b, t0, vel = 0.2) => {
  click(b, t0, vel, 0);
  thump(b, t0 + 0.005, vel * 0.25);
};
const dymo = (b, t0, vel = 0.2) => {
  click(b, t0, vel, 0.1);
  each(b, t0, 0.08, 0.1, (t) => Math.sin(TAU * 320 * t) * Math.exp(-t * 60) * vel * 0.6);
};
const rewind = (b, t0, dur, vel = 0.08) => {
  let ph = 0;
  each(b, t0, dur, 0.1, (t) => {
    const u = t / dur;
    ph += (TAU * (900 + 2600 * u * u)) / SR;
    return (Math.sin(ph) * 0.3 + (rnd() * 2 - 1) * 0.5) * Math.sin(ph * 0.013) * vel * clamp(t / 0.2) * clamp((dur - t) / 0.3);
  });
};
const hum = (b, t0, dur, vel = 0.05) =>
  each(b, t0, dur, -0.2, (t) => (Math.sin(TAU * 100 * t) * 0.6 + Math.sin(TAU * 200 * t) * 0.3 + (rnd() * 2 - 1) * 0.1) * vel * Math.sin(Math.PI * clamp(t / dur)));
const splash = (b, t0, vel = 0.15) => bandNoise(b, t0, 0.7, 1200, vel, (t) => Math.exp(-t * 6) * (1 - Math.exp(-t * 200)), 0.4);

// ─────────────── reverb y utilidades ───────────────
function reverb(b, {room = 0.8, damp = 0.45, wet = 0.25}) {
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const mk = (n) => ({buf: new Float32Array(n), i: 0, store: 0});
  const cL = combT.map(mk);
  const cR = combT.map((t) => mk(t + 23));
  const aL = apT.map(mk);
  const aR = apT.map((t) => mk(t + 23));
  const fb = room * 0.28 + 0.7;
  const d1 = damp * 0.4;
  const d2 = 1 - d1;
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
function automate(b, pts) {
  let k = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    while (k < pts.length - 2 && t > pts[k + 1][0]) k++;
    const [t0, g0] = pts[k];
    const [t1, g1] = pts[k + 1];
    const g = t <= t0 ? g0 : t >= t1 ? g1 : lerp(g0, g1, (t - t0) / (t1 - t0));
    b.L[i] *= g;
    b.R[i] *= g;
  }
}
/** Filtro paso bajo suave (calidez lo-fi) */
function lowpass(b, fc) {
  const k = 1 - Math.exp((-TAU * fc) / SR);
  let l = 0;
  let r = 0;
  for (let i = 0; i < N; i++) {
    l += k * (b.L[i] - l);
    r += k * (b.R[i] - r);
    b.L[i] = l;
    b.R[i] = r;
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

// ════════════════════════ MÚSICA ════════════════════════
const M = bus();
const BEAT = 60 / 78;
const BAR = BEAT * 4;
const tSilence = A(8);
const tMajor = A(8) + 0.8;
const tTense = A(11);
const tRelease = A(12);
const tMonster = A(15);
const tLightOn = W(29, 'no existen') - 0.15;
const tHush = A(16) + 0.2;
const tOnly = S(31);
const tFinale = A(17);

const MINOR = [
  {bass: 38, ch: [50, 57, 62, 65, 69], mel: [62, 65, 67, 69, 72, 74]},
  {bass: 34, ch: [46, 53, 58, 62, 65], mel: [62, 65, 69, 70, 74]},
  {bass: 31, ch: [43, 50, 55, 58, 62], mel: [62, 65, 67, 70, 74]},
  {bass: 33, ch: [45, 52, 57, 60, 64], mel: [64, 67, 69, 72, 76]},
];
const MAJOR = [
  {bass: 38, ch: [50, 57, 62, 66, 69], mel: [66, 69, 71, 74, 76, 78]},
  {bass: 31, ch: [43, 50, 55, 59, 62], mel: [66, 67, 71, 74, 78]},
  {bass: 35, ch: [47, 54, 59, 62, 66], mel: [66, 69, 71, 73, 74, 78]},
  {bass: 33, ch: [45, 52, 57, 61, 64], mel: [64, 66, 69, 73, 76]},
];
/** Sección: 2 compases por acorde; arpegio de guitarra, bajo, kalimba y (opcional) escobillas */
const section = (t0, t1, prog, {gtr = 0.12, kal = 0.1, kit = 0, strumIt = false, box = 0} = {}) => {
  let bar = 0;
  for (let t = t0; t < t1 - BEAT; t += BAR, bar++) {
    const c = prog[Math.floor(bar / 2) % prog.length];
    const fade = clamp((t1 - t) / BAR);
    bass(M, t, c.bass, 0.16 * fade, BEAT * 2.4);
    if (bar % 2) bass(M, t + BEAT * 2.5, c.bass + 7, 0.1 * fade, BEAT * 1.4);
    if (strumIt) {
      [0, 1.5, 2, 3].forEach((b, k) => t + b * BEAT < t1 && strum(M, t + b * BEAT, c.ch, gtr * (k === 0 ? 1 : 0.7) * fade, k % 2 === 0));
    } else {
      const pat = [0, 2, 3, 4, 1, 3, 2, 4];
      pat.forEach((ni, k) => t + k * BEAT * 0.5 < t1 && guitar(M, t + k * BEAT * 0.5, c.ch[ni], gtr * (k === 0 ? 1 : 0.75) * fade, (k % 2 ? 0.25 : -0.25), 2.2));
    }
    // kalimba: dos o tres notas por compás
    for (let k = 0; k < 4; k++) if (rnd() < 0.55) kalimba(M, t + k * BEAT + (rnd() < 0.3 ? BEAT / 2 : 0), c.mel[Math.floor(rnd() * c.mel.length)], kal * (0.6 + 0.4 * rnd()) * fade, rnd() - 0.5);
    if (box && rnd() < 0.5) musicBox(M, t + BEAT * 2, c.mel[Math.floor(rnd() * c.mel.length)] + 12, box * fade, 0.3);
    if (kit) {
      for (let k = 0; k < 4; k++) {
        if (k === 0 || k === 2) kick(M, t + k * BEAT, kit * 0.9 * fade);
        if (k === 1 || k === 3) brush(M, t + k * BEAT, kit * 0.5 * fade);
        brush(M, t + k * BEAT + BEAT / 2, kit * 0.15 * fade);
      }
    }
  }
};

// Actos I–IV: re menor — guitarra y kalimba; escobillas desde las redes sociales
section(0.5, A(5), MINOR, {gtr: 0.1, kal: 0.08});
section(A(5), tSilence - 0.4, MINOR, {gtr: 0.11, kal: 0.09, kit: 0.35, box: 0.03});
// Actos V–VI: re mayor
section(tMajor, tTense, MAJOR, {gtr: 0.12, kal: 0.11, kit: 0.25, box: 0.04});
// Escena 11: el cordel tenso — zumbido y caja de música obsesiva
voice(M, tTense + 1.5, tRelease - tTense - 1.5, 220, 0.05, {att: 4, rel: 0.05, vib: 0.01});
for (let t = W(21, 'esfuerzas'); t < tRelease - 0.1; t += lerp(0.3, 0.12, clamp((t - W(21, 'esfuerzas')) / 6))) musicBox(M, t, 81 + (Math.floor(t * 7) % 2), 0.04, 0.3, 0.5);
// Escena 12 en adelante: se resuelve
section(tRelease, A(14), MAJOR, {gtr: 0.11, kal: 0.1, kit: 0.2});
section(A(14), tMonster, MAJOR, {gtr: 0.1, kal: 0.08, kit: 0});
[[0.3, 38, 3.2], [3.6, 45, 3], [6.8, 47, 2.6], [9.4, 43, 2.5]].forEach(([d, m, l]) => voice(M, A(14) + d, l, hz(m), 0.06, {att: 0.8, rel: 1.6, h2: 0.5}));
// Escena 15: oscuridad — dron y reloj
voice(M, tMonster, tLightOn - tMonster, hz(26), 0.12, {att: 2, rel: 0.3, h2: 0.6});
for (let t = tMonster + 0.5; t < tLightOn; t += 0.5) {
  const g = clamp((t - tMonster) / 2);
  tick(M, t, 0.04 * g, -0.3, 2200);
}
[50, 57, 62, 66, 69].forEach((m, k) => guitar(M, tLightOn + 0.1 + k * 0.03, m, 0.1, (k - 2) * 0.1, 4));
section(tLightOn + 1.2, tHush, MAJOR, {gtr: 0.08, kal: 0.06});
// Escena 16: silencio y una sola nota de caja de música
musicBox(M, tOnly, 86, 0.14, 0, 2.6);
kalimba(M, tOnly + 0.02, 74, 0.1, 0);
// Final
section(tFinale, A(18), MAJOR, {gtr: 0.12, kal: 0.12, kit: 0.3, strumIt: true, box: 0.05});
// Cierre
strum(M, A(18) + 0.2, [50, 57, 62, 66, 69, 74], 0.14, true, 0);
bass(M, A(18) + 0.2, 38, 0.18, 4);
[86, 90, 93].forEach((m, k) => musicBox(M, A(18) + 1 + k * 0.45, m, 0.07, (k - 1) * 0.4, 2.5));

lowpass(M, 7500);
// crujido de vinilo + siseo
{
  let s1 = 0;
  for (let i = 0; i < N; i++) {
    s1 += 0.05 * (rnd() * 2 - 1 - s1);
    const c = rnd() < 0.0004 ? (rnd() * 2 - 1) * 0.5 : 0;
    M.L[i] += s1 * 0.04 + c * 0.25;
    M.R[i] += s1 * 0.04 + c * 0.25;
  }
}
reverb(M, {room: 0.75, damp: 0.5, wet: 0.22});
automate(M, [
  [0, 0],
  [1.2, 1],
  [tSilence - 0.5, 1],
  [tSilence, 0.08],
  [tMajor, 0.08],
  [tMajor + 1.2, 1],
  [tHush - 0.4, 1],
  [tHush + 0.4, 0.05],
  [tOnly - 0.05, 0.05],
  [tOnly, 1],
  [tFinale + 4, 1.1],
  [W(33, 'todo se vuelve'), 1.25],
  [A(18) + 1, 1],
  [DUR - 2.5, 0.8],
  [DUR, 0],
]);
writeWav(M, '../out/scrapbook-music.wav', 0.8);
console.log('música lista');

// ════════════════════════ EFECTOS ════════════════════════
const X = bus();
for (const sc of plan.scenes) {
  if (sc.in === 'pan' || sc.in === 'down') rustle(X, sc.start - 0.05, 0.8, 0.14, sc.in === 'pan' ? 0.4 : 0);
  if (sc.in === 'zoom' || sc.in === 'zoomOut') {
    rustle(X, sc.start - 0.1, 0.5, 0.1);
    thump(X, sc.start + 0.55, 0.2);
  }
  if (sc.in === 'fade') rustle(X, sc.start, 0.9, 0.05);
}
// 1 — rotulador
{
  const tWall = W(0, 'aislándonos') - 0.2;
  const tOut = W(0, 'tratando') - 0.3;
  for (let k = 0; k < 4; k++) scratch(X, tWall + k * 0.3, 0.28, 0.16);
  for (let r = 0; r < 11; r++)
    for (let c = 0; c < 17; c++) {
      if (c === 8 && r === 5) continue;
      const id = r * 17 + c;
      if (hash(id) < 0.6) continue;
      scratch(X, tOut + 0.35 + Math.hypot(c - 8, r - 5) * 0.16 + hash(id) * 0.25, 0.25, 0.025, (c - 8) / 9);
    }
}
// 2 — chinchetas, hilo, pegatinas
{
  const tArc = W(1, 'mundo') - 0.5;
  for (let i = 0; i < 18; i++) click(X, tArc + i * 0.07 - 0.3, 0.05, (i % 3) - 1);
  click(X, A(2) + 0.6, 0.15);
  rustle(X, S(2) - 0.45, 0.5, 0.08);
  const tBest = W(2, 'mejor');
  for (let i = 0; i < 5; i++) slap(X, tBest + 0.1 + i * 0.32, 0.08, 0.3 + i * 0.12);
}
// 3 — rebobinado y dibujos pegados
{
  rewind(X, W(3, 'nada') - 0.4, 2.8, 0.07);
  const tKid = S(4) - 0.3;
  [0, 0.25, 0.5].forEach((d) => slap(X, tKid + d, 0.06, 0.2));
  for (let i = 0; i < 3; i++) rip(X, tKid + 0.45 + i * 0.12, 0.2, 0.06, [0.5, -0.6, 0.7][i]);
  [86, 81, 83, 79].forEach((m, k) => musicBox(X, tKid + 0.3 + k * 0.3, m, 0.04, 0.2, 0.9));
}
// 4 — pegatinas, interruptor, acuarela, cinta, fotocopiadora
{
  slap(X, W(4, 'amor'), 0.12, 0.1);
  slap(X, W(4, 'aprobación'), 0.12, 0.3);
  click(X, W(4, 'depender') + 0.9, 0.25, 0.4);
  rustle(X, S(5) - 0.45, 0.6, 0.12);
  const tGood = W(5, 'buenos') - 0.5;
  for (let i = 0; i < 3; i++) slap(X, tGood + i * 0.22 + 0.3, 0.12, -0.5);
  slap(X, W(5, 'quieren') + 0.5, 0.1, -0.4);
  splash(X, W(5, 'si no'), 0.14);
  rip(X, W(5, 'retiran'), 0.4, 0.1, 0.5);
  click(X, W(5, 'retiran'), 0.2, 0.5);
  [W(6, 'crecemos'), W(6, 'ganarnos'), W(6, 'aceptación')].forEach((g) => {
    slap(X, g, 0.16);
    rip(X, g + 0.05, 0.3, 0.09);
  });
  hum(X, W(6, 'autenticidad') - 0.5, 1.4, 0.06);
  rustle(X, W(6, 'autenticidad') + 0.4, 0.4, 0.08);
}
// 5 — copias que salen disparadas
{
  const tMul = W(7, 'multiplica') - 0.25;
  for (let i = 0; i < 26; i++) rustle(X, tMul + 0.1 + Math.pow(i / 26, 0.8) * 2.4, 0.18, 0.05, rnd() * 2 - 1);
  slap(X, S(8) - 0.4 + 0.35, 0.2);
  click(X, W(8, 'paradójicamente') - 0.2 + (E(8) - W(8, 'paradójicamente') + 0.4) * 0.46, 0.15);
}
// 6 — Dymo, notas, rotulador, polaroids, barrotes, pájaro
{
  const tLikes = W(9, 'likes');
  for (let k = 0; k < 28; k++) dymo(X, tLikes + Math.pow(k / 28, 0.75) * 8.5, 0.05);
  const tVal = W(9, 'validación');
  for (let i = 0; i < 5; i++) slap(X, tVal + i * 0.18, 0.1, 0.5);
  scratch(X, W(9, 'sonrientes') - 0.1, 0.6, 0.1);
  slap(X, W(9, 'exitosas'), 0.12, 0.2);
  [W(9, 'sonrientes'), W(9, 'exitosas'), W(9, 'perfectas')].forEach((t0) => {
    click(X, t0 + 0.3, 0.15, 0.5);
    whir(X, t0 + 0.35, 0.9, 0.06);
  });
  for (let i = 0; i < 7; i++) slap(X, W(10, 'perdemos') - 0.2 + i * 0.09 + 0.2, 0.08, (i - 3) / 5);
  rustle(X, W(10, 'libertad') - 0.2, 1.4, 0.1, 0.5);
}
// 7 — periódico, confeti, goteo, rotulador
{
  rustle(X, A(7) + 0.1, 0.7, 0.1);
  const tGlass = S(12) - 0.35;
  rustle(X, tGlass, 0.5, 0.15);
  const tMore = W(12, 'cuanto');
  let ti = tGlass + 0.4;
  while (ti < A(8)) {
    tick(X, ti + 0.55, 0.05, rnd() - 0.5, 1800 + rnd() * 800);
    ti += lerp(0.7, 0.16, clamp((ti - tMore + 1) / 4));
  }
  for (let t = tGlass + 0.5; t < A(8) - 0.3; t += 0.7) scratch(X, t, 0.35, 0.04, 0.3);
}
// 8 — costura, cartulina rasgada, letras, pasos
{
  const tFree = W(13, 'libre') - 0.25;
  for (let i = 0; i < 11; i++) tick(X, tFree - 0.6 + (i / 11) * 1.4, 0.06, 0, 1600);
  rip(X, W(13, 'aceptas') - 0.2, 0.9, 0.12);
  const tText = S(14) - 0.35;
  for (let i = 0; i < 33; i++) slap(X, tText + (i / 33) * 2.1, 0.05, rnd() - 0.5);
  const tAct = W(15, 'dejar de actuar');
  for (let k = 0; k < 6; k++) tick(X, tAct + 0.15 + k * 0.33, 0.04, -0.2 + k * 0.06, 700);
  const tLive = W(15, 'vivir para ti') - 0.3;
  for (let k = 0; k < 7; k++) tick(X, tLive + 0.15 + k * 0.35, 0.035, 0.1 + k * 0.05, 700);
}
// 9 — notas adhesivas y tapa de frasco
{
  const tThink = S(17) - 0.3;
  for (let i = 0; i < 16; i++) slap(X, tThink + i * 0.13, 0.04, (hash(i) - 0.5) * 1.4);
  const tLess = W(17, 'menos');
  for (let k = 0; k < 14; k++) tick(X, tLess + k * 0.1, 0.05, 0.7, 1300);
  for (let i = 0; i < 16; i++) rustle(X, tLess + 0.2 + hash(i) * 1.0, 0.25, 0.03, (hash(i * 5) - 0.5) * 1.4);
  slap(X, W(17, 'tú piensas') - 0.2, 0.14, 0);
}
// 10 — fichas que se voltean, arandelas
{
  const t0 = S(18);
  const r = (() => {
    let s = 1234 >>> 0;
    return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
  })();
  const pts = [];
  while (pts.length < 95) {
    const x = 60 + r() * 1800;
    const y = 40 + r() * 1000;
    if (Math.hypot(x - 960, y - 540) < 130) continue;
    if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 92)) continue;
    pts.push({x, y, d: r() * 360});
  }
  const pent = [74, 76, 78, 81, 83, 86];
  pts.forEach((p, i) => {
    if (i % 3) return;
    const tr = t0 + 0.2 + Math.hypot(p.x - 960, p.y - 540) / 380 + hash(i) * 0.5 + 0.45;
    if (tr < S(19) - 0.4) kalimba(X, tr, pent[i % pent.length], 0.035, (p.x - 960) / 960);
  });
  const tLight = W(19, 'liviana') - 0.2;
  metal(X, tLight, 0.07, 1300, -0.3);
  metal(X, tLight + 0.04, 0.07, 1450, 0.3);
  thump(X, tLight + 0.3, 0.3);
  metal(X, tLight + 0.32, 0.04, 1100, 0);
}
// 11 — pegatinas que se apilan
{
  const tTense = W(21, 'tenso') - 0.2;
  [W(21, 'interesante'), W(21, 'gracioso'), W(21, 'inteligente')].forEach((t0) => slap(X, t0, 0.1, -0.4));
  for (let i = 0; i < 7; i++) slap(X, tTense + i * 0.2, 0.07, -0.4);
}
// 12 — cordel que se suelta, sello de goma
{
  guitar(X, A(12), 45, 0.3, 0, 2, 0.8);
  slap(X, W(23, 'Escuchas'), 0.08, 0.4);
  for (let i = 0; i < 10; i++) rustle(X, S(24) - 0.05 + i * 0.25, 0.15, 0.03, 0.3);
  thump(X, W(24, 'sientes') - 0.4, 0.3);
}
// 13 — letras recortadas, cinta, pegatinas
{
  for (let i = 0; i < 7; i++) slap(X, W(25, 'agradar') - 0.2 + (i / 7) * 0.85, 0.06, -0.5);
  for (let i = 0; i < 8; i++) slap(X, W(25, 'conectar') - 0.2 + (i / 8) * 0.85, 0.06, 0.5);
  [0, 0.15, 0.3].forEach((d) => rip(X, E(25) - 0.2 + d, 0.15, 0.07));
  [W(26, 'aprobación') - 0.4, W(26, 'comprensión') - 0.4, W(27, 'actuar') - 0.3, W(27, 'abrirte') - 0.3].forEach((t0, k) => {
    slap(X, t0, 0.1, k % 2 ? 0.5 : -0.5);
    slap(X, t0 + 0.25, 0.1, k % 2 ? 0.6 : -0.6);
  });
}
// 14 — hilo que atraviesa el papel
for (let t = W(28, 'relaciones') - 0.3; t < A(15) - 0.5; t += 0.32) bandNoise(X, t, 0.18, 2000, 0.035, (u) => Math.sin(Math.PI * clamp(u / 0.18)), rnd() - 0.5);
// 15 — interruptor y cajas de cerillas
{
  click(X, W(29, 'no existen') - 0.15, 0.35, -0.6);
  ['divertido', 'sabio', 'atractivo'].forEach((w, i) => {
    thump(X, W(30, w) + 0.35, 0.25);
    slap(X, W(30, w) + 0.4, 0.12, (i - 1) * 0.4);
  });
}
// 16 — máquina de escribir
{
  const phrase = 'Solo tienes que ser tú';
  const t0 = S(31) - 0.05;
  const d = E(31) - S(31) + 0.1;
  for (let i = 0; i < phrase.length; i++) if (phrase[i] !== ' ') typeKey(X, t0 + (d * (i + 0.5)) / phrase.length, 0.12);
  musicBox(X, E(31) + 0.3, 96, 0.04, 0.3, 1.2);
}
// 17 — hojas, tijeras, máscara, álbum
{
  for (let i = 0; i < 4; i++) for (let k = 0; k < 6; k++) slap(X, S(32) + i * 0.5 + [0.18, 0.32, 0.46, 0.6, 0.74, 0.86][k] * 2.6, 0.035, (i - 1.5) / 2);
  const tCut = W(33, 'controlar') - 0.3;
  for (let i = 0; i < 3; i++) snip(X, tCut + i * 0.4, 0.2);
  thump(X, W(33, 'visto') - 0.4 + 0.5, 0.12);
  rustle(X, W(33, 'todo se vuelve') - 0.3, 1.2, 0.12);
}
// 18 — etiquetadora y goma elástica
{
  const a = A(18);
  for (let i = 0; i < 8; i++) if ('SER REAL'[i] !== ' ') dymo(X, a + 0.9 + (i / 8) * 1.4, 0.14);
  each(X, a + 3.0, 0.4, 0, (t) => Math.sin(TAU * (180 - 120 * t) * t) * Math.exp(-t * 9) * 0.25);
  slap(X, a + 3.05, 0.15);
}
reverb(X, {room: 0.5, damp: 0.5, wet: 0.14});
writeWav(X, '../out/scrapbook-sfx.wav', 0.7);
console.log('efectos listos');
