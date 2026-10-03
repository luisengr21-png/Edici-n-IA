// Banda sonora de «Ser real»: música ambiental generativa (pads, piano, chelo, arpegios) y efectos de
// sonido sincronizados con la animación (mismas marcas de tiempo que src/serreal, vía cues.json / plan.json).
// Salida: out/serreal-music.wav y out/serreal-sfx.wav (44.1 kHz, estéreo).
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

let seed = 2024;
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

// ─────────────── tablas de onda ───────────────
const TAB = 4096;
const mkTable = (amps) => {
  const tb = new Float32Array(TAB + 1);
  for (let i = 0; i <= TAB; i++) {
    let s = 0;
    amps.forEach((a, h) => (s += a * Math.sin((TAU * (h + 1) * i) / TAB)));
    tb[i] = s;
  }
  let m = 0;
  for (const v of tb) m = Math.max(m, Math.abs(v));
  for (let i = 0; i <= TAB; i++) tb[i] /= m;
  return tb;
};
const PAD = mkTable([1, 0.35, 0.22, 0.12, 0.06, 0.04, 0.02]);
const CELLO = mkTable(Array.from({length: 14}, (_, h) => (1 / (h + 1)) * (h % 2 ? 0.7 : 1) * Math.exp(-h * 0.05)));
const osc = (tb, ph) => {
  const x = ph * TAB;
  const i = x | 0;
  return tb[i] + (tb[i + 1] - tb[i]) * (x - i);
};

// ─────────────── instrumentos ───────────────
const voice = (b, t0, dur, f, vel, o = {}) => {
  const {tb = PAD, att = 2.5, rel = 3, pan = 0, vib = 0.002, vibF = 4.6, det = [-0.003, 0, 0.0035], lp = 0.12} = o;
  const ph = det.map(() => rnd());
  let s1 = 0;
  each(b, t0, dur + rel, pan, (t) => {
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    const v = 1 + Math.sin(TAU * vibF * t + ph[0] * 6) * vib;
    let s = 0;
    for (let q = 0; q < det.length; q++) {
      ph[q] += (f * (1 + det[q]) * v) / SR;
      ph[q] -= Math.floor(ph[q]);
      s += osc(tb, ph[q]);
    }
    s1 += lp * (s / det.length - s1);
    return s1 * env * vel;
  });
};
const chord = (b, t0, dur, midis, vel, o = {}) =>
  midis.forEach((m, k) => voice(b, t0, dur, hz(m), vel / Math.sqrt(midis.length), {...o, pan: ((k / Math.max(1, midis.length - 1)) - 0.5) * 0.9}));

const piano = (b, t0, m, vel, pan = 0, len = 6) => {
  const f = hz(m);
  const parts = [];
  for (let n = 1; n <= 9; n++) {
    const fn = f * n * Math.sqrt(1 + 0.0004 * n * n);
    if (fn < 14000) parts.push({w: TAU * fn, a: Math.pow(n, -1.3) * (n === 1 ? 1 : 0.7), d: 0.35 + n * 0.45 + f / 1100});
  }
  each(b, t0, len, pan, (t) => {
    let s = 0;
    for (const p of parts) s += Math.sin(p.w * t) * p.a * Math.exp(-t * p.d);
    return s * vel * (1 - Math.exp(-t * 500)) * 0.45 * clamp((len - t) / 0.4);
  });
};
const pluck = (b, t0, m, vel, pan = 0) => {
  const f = hz(m);
  each(b, t0, 2.2, pan, (t) => {
    let s = 0;
    for (let h = 1; h <= 6; h++) s += (Math.sin(TAU * f * h * t) / (h * h)) * Math.exp(-t * (1.8 + h * 1.5));
    return s * vel * (1 - Math.exp(-t * 300));
  });
};
const bell = (b, t0, m, vel = 0.1, pan = 0, decay = 1.4) => {
  const f = hz(m);
  each(b, t0, decay * 3, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 1], [2.0, 0.3, 1.8], [3.0, 0.1, 2.6], [4.16, 0.07, 4]]) s += Math.sin(TAU * f * r * t) * a * Math.exp((-t * d) / decay);
    return s * vel * (1 - Math.exp(-t * 700));
  });
};
const cello = (b, t0, dur, m, vel) => voice(b, t0, dur, hz(m), vel, {tb: CELLO, att: 0.9, rel: 2.2, vib: 0.005, vibF: 5, det: [-0.002, 0.002], lp: 0.08, pan: -0.15});
const sine = (b, t0, dur, f, vel, att = 1, rel = 1, pan = 0) =>
  each(b, t0, dur, pan, (t) => Math.sin(TAU * f * t) * vel * clamp(t / att) * clamp((dur - t) / rel));

// ─────────────── efectos ───────────────
const kick = (b, t0, vel) => {
  let ph = 0;
  each(b, t0, 0.35, 0, (t) => {
    ph += (TAU * (45 + 90 * Math.exp(-t * 35))) / SR;
    return Math.sin(ph) * Math.exp(-t * 11) * vel;
  });
};
const bandNoise = (b, t0, dur, fc, vel, env, pan = 0) => {
  let s1 = 0;
  let s2 = 0;
  const k = 1 - Math.exp((-TAU * fc) / SR);
  each(b, t0, dur, pan, (t) => {
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return (s1 - s2) * 2.2 * env(t) * vel;
  });
};
const whoosh = (b, t0, dur = 0.9, vel = 0.22, pan = 0) => {
  let s1 = 0;
  let s2 = 0;
  each(b, t0, dur, pan, (t) => {
    const u = t / dur;
    const fc = 300 * Math.pow(18, Math.sin(Math.PI * u));
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return s2 * Math.pow(Math.sin(Math.PI * u), 1.5) * vel;
  });
};
const tick = (b, t0, vel = 0.06, pan = 0, f = 3200) =>
  each(b, t0, 0.04, pan, (t) => Math.sin(TAU * f * t) * Math.exp(-t * 200) * vel + (rnd() * 2 - 1) * Math.exp(-t * 500) * vel * 0.4);
const click = (b, t0, vel = 0.2, pan = 0) => {
  bandNoise(b, t0, 0.05, 2500, vel, (t) => Math.exp(-t * 120), pan);
  each(b, t0, 0.06, pan, (t) => Math.sin(TAU * 1100 * t) * Math.exp(-t * 90) * vel * 0.5);
};
const pop = (b, t0, vel = 0.14, f = 650, pan = 0) => each(b, t0, 0.14, pan, (t) => Math.sin(TAU * (f + f * 1.2 * Math.exp(-t * 40)) * t) * Math.exp(-t * 30) * vel);
const thud = (b, t0, vel = 0.4) => {
  let ph = 0;
  each(b, t0, 0.9, 0, (t) => {
    ph += (TAU * (38 + 50 * Math.exp(-t * 14))) / SR;
    return (Math.sin(ph) * Math.exp(-t * 5) + (rnd() * 2 - 1) * Math.exp(-t * 45) * 0.2) * vel;
  });
};
const metal = (b, t0, vel = 0.12, f = 420, pan = 0) =>
  each(b, t0, 1.6, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 3], [2.76, 0.6, 4], [5.4, 0.4, 6], [8.93, 0.25, 8]]) s += Math.sin(TAU * f * r * t) * a * Math.exp(-t * d);
    return s * vel * (1 - Math.exp(-t * 900));
  });
const rewind = (b, t0, dur, vel = 0.1) => {
  let ph = 0;
  each(b, t0, dur, 0.1, (t) => {
    const u = t / dur;
    const f = 900 + 2600 * u * u;
    ph += (TAU * f) / SR;
    return (Math.sin(ph) * 0.3 + (rnd() * 2 - 1) * 0.5) * Math.sin(ph * 0.013) * vel * clamp(t / 0.2) * clamp((dur - t) / 0.3);
  });
};
const shutter = (b, t0, vel = 0.2, pan = 0) => {
  click(b, t0, vel, pan);
  bandNoise(b, t0 + 0.03, 0.12, 4500, vel * 0.5, (t) => Math.exp(-t * 35), pan);
  click(b, t0 + 0.09, vel * 0.7, pan);
};
const flutter = (b, t0, dur, vel = 0.1) => {
  for (let k = 0; k < dur * 14; k++) bandNoise(b, t0 + k / 14, 0.05, 1800, vel * (1 - k / (dur * 14)), (t) => Math.exp(-t * 60), 0.2 + k * 0.03);
};
const splash = (b, t0, vel = 0.2) => bandNoise(b, t0, 0.6, 1400, vel, (t) => Math.exp(-t * 7) * (1 - Math.exp(-t * 200)), 0.4);
const drip = (b, t0, vel = 0.08) => each(b, t0, 0.12, 0, (t) => Math.sin(TAU * (900 + 1400 * t * 8) * t) * Math.exp(-t * 40) * vel);
const shimmer = (b, t0, dur, vel = 0.04) => {
  for (let k = 0; k < dur * 10; k++) bell(b, t0 + k / 10 + rnd() * 0.05, 86 + Math.floor(rnd() * 8), vel * (0.5 + rnd() * 0.5), rnd() * 2 - 1, 0.6);
};

// ─────────────── reverb (Freeverb simplificado) ───────────────
function reverb(b, {room = 0.85, damp = 0.4, wet = 0.3}) {
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
/** Curva de ganancia por tramos [[t, g], …] aplicada a un bus */
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
const tSilence = A(8); // respiración antes de «luces y sombras»
const tMajor = A(8) + 0.8;
const tTense = A(11);
const tRelease = A(12);
const tMonster = A(15);
const tLightOn = W(29, 'no existen') - 0.15;
const tHush = A(16) + 0.2;
const tOnly = S(31);
const tFinale = A(17);
const tEnd = DUR;

// Re menor: Dm9 · B♭maj7 · Gm9 · A7sus4 (8 s cada uno)
const MINOR = [
  {bass: 38, pad: [50, 53, 57, 64], scale: [62, 65, 67, 69, 72, 74, 77]},
  {bass: 34, pad: [46, 53, 57, 62], scale: [62, 65, 69, 70, 72, 74, 77]},
  {bass: 31, pad: [43, 50, 53, 57], scale: [62, 65, 67, 70, 74, 77, 79]},
  {bass: 33, pad: [45, 50, 52, 55], scale: [62, 64, 67, 69, 72, 74, 76]},
];
// Re mayor: Dmaj9 · Gmaj7 · Bm9 · A6sus
const MAJOR = [
  {bass: 38, pad: [50, 54, 57, 61, 64], scale: [62, 64, 66, 69, 71, 74, 76, 78]},
  {bass: 31, pad: [43, 55, 59, 62, 66], scale: [62, 66, 67, 69, 71, 74, 78, 79]},
  {bass: 35, pad: [47, 54, 57, 61, 62], scale: [61, 62, 66, 69, 71, 73, 74, 78]},
  {bass: 33, pad: [45, 52, 57, 61, 64], scale: [61, 64, 66, 69, 71, 73, 76, 78]},
];
const section = (t0, t1, prog, {padVel = 0.11, bassVel = 0.07, pianoVel = 0.1, density = 1, len = 8} = {}) => {
  let k = 0;
  for (let t = t0; t < t1 - 0.5; t += len, k++) {
    const c = prog[k % prog.length];
    const d = Math.min(len, t1 - t);
    chord(M, t, d + 0.5, c.pad, padVel, {att: 2.2, rel: 2.5});
    voice(M, t, d + 0.3, hz(c.bass), bassVel, {att: 1.5, rel: 2, lp: 0.05, det: [0]});
    // piano disperso, como gotas
    let pt = t + 0.4 + rnd() * 0.8;
    while (pt < t + d - 0.3) {
      piano(M, pt, c.scale[Math.floor(rnd() * c.scale.length)], pianoVel * (0.6 + rnd() * 0.4), rnd() * 1.2 - 0.6, 6);
      if (rnd() < 0.3) piano(M, pt + 0.18, c.scale[Math.floor(rnd() * c.scale.length)] + 12, pianoVel * 0.4, rnd() - 0.5, 4);
      pt += (1.4 + rnd() * 1.6) / density;
    }
  }
};

// Actos I–IV (re menor)
section(0.6, tSilence, MINOR, {padVel: 0.1, pianoVel: 0.09, density: 0.9});
// pulso suave en la parte de redes y validación
const tPulse0 = A(5);
const tPulse1 = tSilence - 0.6;
for (let t = tPulse0 + 0.4; t < tPulse1; t += 0.8) {
  const g = clamp((t - tPulse0) / 4) * clamp((tPulse1 - t) / 2);
  kick(M, t, 0.11 * g);
  tick(M, t + 0.4, 0.018 * g, 0.3, 6000);
}
// tensión que sube en «la bolsa de valores del yo»
sine(M, A(7), tSilence - A(7), hz(81), 0.018, 6, 0.4, 0.2);
sine(M, A(7) + 3, tSilence - A(7) - 3, hz(80), 0.012, 6, 0.4, -0.2);

// Actos V–VI (re mayor)
section(tMajor, tTense, MAJOR, {padVel: 0.12, pianoVel: 0.11, density: 1.1});
// Escena 11: la cuerda tensa — acorde disonante y tono agudo que crece hasta cortar en seco
chord(M, tTense, tRelease - tTense, [47, 54, 59, 60], 0.1, {att: 2, rel: 0.05});
each(M, tTense + 2, tRelease - tTense - 2, 0, (t) => Math.sin(TAU * 1760 * t) * 0.03 * Math.pow(t / (tRelease - tTense - 2), 1.6));
// Escena 12: se resuelve; arpegios que fluyen
section(tRelease, tMonster, MAJOR, {padVel: 0.11, pianoVel: 0.07, density: 0.7});
{
  const arp = [62, 66, 69, 73, 74, 73, 69, 66];
  const tFlow = W(22, 'palabras') - 0.4;
  for (let t = tFlow, k = 0; t < A(13) - 0.5; t += 0.36, k++) pluck(M, t, arp[k % arp.length] + (Math.floor(k / 16) % 2 ? -5 : 0), 0.08 * clamp((t - tFlow) / 2), (k % 2 ? 0.4 : -0.4));
}
// Escena 14: chelo grave bajo las raíces
[[0, 38, 3.2], [3.4, 45, 3], [6.6, 47, 2.6], [9.2, 43, 3.5]].forEach(([d, m, l]) => cello(M, A(14) + 0.3 + d, l, m, 0.09));
// Escena 15: el monstruo — dron oscuro hasta que se enciende la luz
voice(M, tMonster, tLightOn - tMonster, hz(26), 0.16, {att: 2, rel: 0.4, det: [0, 0.01], lp: 0.04});
voice(M, tMonster + 1, tLightOn - tMonster - 1, hz(32), 0.06, {att: 2, rel: 0.4, det: [0, -0.01], lp: 0.06});
chord(M, tLightOn, tHush - tLightOn, [43, 55, 59, 62, 66], 0.1, {att: 0.8, rel: 1});
// Escena 16: silencio total y una sola nota
piano(M, tOnly, 74, 0.16, 0, 7);
piano(M, tOnly + 0.02, 62, 0.08, -0.1, 7);
// Final: re mayor en plenitud
section(tFinale, A(18), MAJOR, {padVel: 0.15, pianoVel: 0.12, density: 1.3});
[[0, 38, 4], [4, 43, 4], [8, 47, 4], [12, 45, 4.5]].forEach(([d, m, l]) => cello(M, tFinale + 0.5 + d, l, m, 0.1));
// Cierre: acorde final
chord(M, A(18), tEnd - A(18), [50, 54, 57, 61, 64, 69], 0.14, {att: 1.5, rel: 3});
voice(M, A(18), tEnd - A(18), hz(38), 0.08, {att: 1.5, rel: 3, det: [0], lp: 0.05});
[74, 78, 81].forEach((m, k) => piano(M, A(18) + 0.4 + k * 0.5, m, 0.1, (k - 1) * 0.4, 8));

reverb(M, {room: 0.92, damp: 0.35, wet: 0.34});
automate(M, [
  [0, 0],
  [1.5, 1],
  [tSilence - 0.6, 1],
  [tSilence, 0.05],
  [tMajor, 0.05],
  [tMajor + 1.5, 1],
  [tMonster, 1],
  [tHush - 0.4, 1],
  [tHush + 0.4, 0],
  [tOnly - 0.05, 0],
  [tOnly, 1],
  [tFinale + 6, 1.15],
  [W(33, 'todo se vuelve'), 1.3],
  [A(18) + 1, 1.0],
  [tEnd - 2.5, 0.8],
  [tEnd, 0],
]);
writeWav(M, '../out/serreal-music.wav', 0.8);
console.log('música lista');

// ════════════════════════ EFECTOS ════════════════════════
const X = bus();
// transiciones
for (const sc of plan.scenes) {
  if (sc.in === 'pan' || sc.in === 'down') whoosh(X, sc.start - 0.05, 1.1, 0.2, sc.in === 'pan' ? 0.3 : 0);
  if (sc.in === 'zoom') whoosh(X, sc.start - 0.1, 0.9, 0.24);
  if (sc.in === 'zoomOut') whoosh(X, sc.start - 0.05, 1.1, 0.18, -0.2);
}
// 1 — muros
{
  const tWall = W(0, 'aislándonos') - 0.2;
  const tOut = W(0, 'tratando') - 0.3;
  for (let k = 0; k < 4; k++) click(X, tWall + k * 0.3 + 0.25, 0.22);
  for (let r = 0; r < 11; r++)
    for (let c = 0; c < 17; c++) {
      if (c === 8 && r === 5) continue;
      const id = r * 17 + c;
      const dist = Math.hypot(c - 8, r - 5);
      tick(X, tOut + 0.35 + dist * 0.16 + hash(id) * 0.25 + 0.5, 0.025, (c - 8) / 9, 2200 + hash(id) * 1500);
    }
}
// 2 — mapa y espejo
{
  const tArc = W(1, 'mundo') - 0.5;
  for (let i = 0; i < 18; i++) bell(X, tArc + i * 0.07 + 1.25, 81 + [0, 2, 4, 7, 9][i % 5], 0.025, (i % 3) - 1, 0.5);
  const tBest = W(2, 'mejor');
  for (let i = 0; i < 5; i++) bell(X, tBest + 0.1 + i * 0.32, 74 + [0, 4, 7, 11, 14][i], 0.04, 0.3 + i * 0.12, 1);
}
// 3 — rebobinado y caja de música
{
  const tRev = W(3, 'nada') - 0.4;
  rewind(X, tRev, 2.8, 0.09);
  const tKid = S(4) - 0.3;
  [86, 81, 83, 79, 81].forEach((m, k) => bell(X, tKid + 0.3 + k * 0.28, m, 0.05, 0.2, 0.9));
}
// 4 — el interruptor del cariño
{
  pop(X, W(4, 'amor'), 0.14, 700);
  bell(X, W(4, 'aprobación'), 88, 0.05, 0.3);
  click(X, W(4, 'depender') + 0.9, 0.25, 0.4);
  const tGood = W(5, 'buenos') - 0.5;
  for (let i = 0; i < 3; i++) pop(X, tGood + i * 0.22 + 0.3, 0.12, 500 + i * 120, -0.5);
  bell(X, W(5, 'quieren') + 0.5, 86, 0.06, -0.4);
  splash(X, W(5, 'si no'), 0.18);
  click(X, W(5, 'retiran'), 0.35, 0.5);
  thud(X, W(5, 'retiran') + 0.02, 0.25);
  [W(6, 'crecemos'), W(6, 'ganarnos'), W(6, 'aceptación')].forEach((g) => thud(X, g, 0.3));
  for (let t = S(6) - 0.35; t < W(6, 'autenticidad'); t += 0.5) tick(X, t, 0.03, 0.6, 2400);
}
// 5 — se multiplica
{
  const tMul = W(7, 'multiplica') - 0.25;
  for (let ring = 0; ring < 16; ring++) for (let k = 0; k < Math.min(6, 1 + ring); k++) pop(X, tMul + 0.15 + ring * 0.13 + rnd() * 0.1, 0.03, 900 + ring * 40, rnd() * 2 - 1);
  const tUp = W(8, 'Nunca');
  sine(X, tUp, 3.5, 660, 0.012, 0.4, 0.8, 0.3);
  // destello del cruce (mismo cálculo que la escena: ~ mitad de la línea coral)
  const tDown = W(8, 'paradójicamente') - 0.2;
  bell(X, tDown + (E(8) - tDown + 0.2) * 0.46, 93, 0.06, 0, 1.6);
}
// 6 — el estudio de edición
{
  const tLikes = W(9, 'likes');
  for (let k = 0; k < 60; k++) tick(X, tLikes + Math.pow(k / 60, 0.7) * 9, 0.025, -0.4, 4200);
  const tVal = W(9, 'validación');
  for (let i = 0; i < 5; i++) pop(X, tVal + i * 0.18, 0.08, 1000 + i * 90, 0.5);
  [W(9, 'sonrientes'), W(9, 'exitosas'), W(9, 'perfectas')].forEach((t0, i) => {
    sine(X, t0 - 0.1, 0.6, 500 + i * 150, 0.02, 0.05, 0.3, 0.5);
    shutter(X, t0 + 0.35, 0.22, 0.5);
  });
  const tBars = W(10, 'perdemos');
  for (let i = 0; i < 8; i++) metal(X, tBars - 0.2 + i * 0.07, 0.03, 300 + i * 13, (i - 4) / 5);
  flutter(X, W(10, 'libertad') - 0.2, 1.6, 0.08);
}
// 7 — la bolsa y el vaso
{
  const a = A(7);
  for (let i = 0; i < 46; i++) tick(X, a + 0.3 + i * 0.105, 0.02, -0.6 + i * 0.03, 2600);
  const tGlass = S(12) - 0.35;
  whoosh(X, tGlass, 0.6, 0.3);
  const tMore = W(12, 'cuanto');
  let ti = tGlass + 0.5;
  while (ti < A(8)) {
    pop(X, ti + 0.55, 0.06, 520 + rnd() * 120, rnd() - 0.5);
    ti += lerp(0.75, 0.16, clamp((ti - tMore + 1) / 4));
  }
  for (let i = 0; i < 40; i++) {
    const t0 = tGlass + 0.9 + i * lerp(0.35, 0.12, clamp(i / 25));
    if (t0 < A(8)) drip(X, t0 + 0.6, 0.05);
  }
}
// 8 — luces y sombras, título, escenario
{
  shimmer(X, W(13, 'aceptas') - 0.2, 2.4, 0.03);
  bell(X, W(13, 'libre') - 0.25, 74, 0.08, 0, 2.5);
  thud(X, S(14) - 0.35, 0.22);
  const tAct = W(15, 'dejar de actuar');
  for (let k = 0; k < 6; k++) tick(X, tAct + 0.15 + k * 0.33, 0.03, -0.2 + k * 0.06, 900);
  const tLive = W(15, 'vivir para ti') - 0.3;
  for (let k = 0; k < 7; k++) tick(X, tLive + 0.15 + k * 0.35, 0.025, 0.1 + k * 0.05, 900);
}
// 9 — mesa para uno
{
  const tThink = S(17) - 0.3;
  for (let i = 0; i < 18; i++) pop(X, tThink + i * 0.12, 0.03, 380 + hash(i) * 120, (hash(i * 5) - 0.5) * 1.6);
  const tLess = W(17, 'menos');
  for (let k = 0; k < 12; k++) tick(X, tLess + k * 0.11, 0.05, 0.7, 1500);
  bell(X, W(17, 'tú piensas') - 0.2, 81, 0.07, -0.1, 1.6);
}
// 10 — contagio
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
  const pent = [86, 88, 90, 93, 95, 98];
  pts.forEach((p, i) => {
    if (i % 3) return;
    const tr = t0 + 0.2 + Math.hypot(p.x - 960, p.y - 540) / 380 + hash(i) * 0.5 + 0.4;
    if (tr < S(19) - 0.4) bell(X, tr, pent[i % pent.length], 0.022, (p.x - 960) / 960, 0.7);
  });
  const tLight = W(19, 'liviana') - 0.2;
  metal(X, tLight, 0.06, 760, -0.3);
  metal(X, tLight + 0.03, 0.06, 820, 0.3);
  thud(X, tLight + 0.3, 0.35);
  shimmer(X, W(19, 'contagiosa') - 0.3, 1.8, 0.025);
}
// 11 — iconos que se apilan
{
  const tTense = W(21, 'tenso') - 0.2;
  [W(21, 'interesante'), W(21, 'gracioso'), W(21, 'inteligente')].forEach((t0, i) => pop(X, t0, 0.1, 600 + i * 150, -0.4));
  for (let i = 0; i < 7; i++) pop(X, tTense + i * 0.2, 0.06, 700 + i * 80, -0.4 + rnd() * 0.3);
}
// 12 — la cuerda se suelta
{
  pluck(X, A(12), 50, 0.25, 0);
  pop(X, W(23, 'Escuchas'), 0.08, 800, 0.4);
  bell(X, W(23, 'conectas'), 81, 0.06, 0, 1.6);
  bell(X, W(24, 'sientes') - 0.4, 78, 0.07, 0.3, 2);
}
// 13 — agradar ≠ conectar
{
  thud(X, W(25, 'agradar'), 0.22);
  thud(X, W(25, 'conectar'), 0.22);
  pop(X, E(25) - 0.2, 0.1, 900);
  [W(26, 'aprobación') - 0.4, W(26, 'comprensión') - 0.4, W(27, 'actuar') - 0.3, W(27, 'abrirte') - 0.3].forEach((t0, k) => {
    pop(X, t0, 0.07, 600 + k * 60, k % 2 ? 0.5 : -0.5);
    pop(X, t0 + 0.25, 0.07, 680 + k * 60, k % 2 ? 0.6 : -0.6);
  });
}
// 15 — el monstruo y el podio
{
  const tClick = W(29, 'no existen') - 0.15;
  click(X, tClick, 0.4, -0.6);
  tick(X, tClick + 0.7, 0.05, 0.1, 700);
  ['divertido', 'sabio', 'atractivo'].forEach((w) => thud(X, W(30, w) + 0.35, 0.4));
}
// 17 — enredaderas, hilos, máscara
{
  for (let i = 0; i < 4; i++) for (let k = 0; k < 5; k++) pluck(X, S(32) + i * 0.5 + (0.2 + k * 0.15) * 2.6, [74, 76, 78, 81, 83][k], 0.03, (i - 1.5) / 2);
  const tCut = W(33, 'controlar') - 0.3;
  for (let i = 0; i < 3; i++) metal(X, tCut + i * 0.4, 0.05, 1500 + i * 120, (i - 1) * 0.5);
  thud(X, W(33, 'visto') - 0.4 + 0.45, 0.15);
}
reverb(X, {room: 0.6, damp: 0.5, wet: 0.18});
writeWav(X, '../out/serreal-sfx.wav', 0.7);
console.log('efectos listos');
