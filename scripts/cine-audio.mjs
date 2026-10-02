// Banda sonora de la versión cinematográfica «Una fábula de sombras y luz».
// Partitura orquestal sintetizada (piano, cuerdas, chelo, coro, órgano, flauta, celesta) con el arco
// emocional del guion de color, más ambientes y efectos por escena con las mismas marcas de tiempo que src/cine.
import fs from 'node:fs';

const cues = JSON.parse(fs.readFileSync(new URL('../src/estatus/cues.json', import.meta.url)));
const plan = JSON.parse(fs.readFileSync(new URL('../src/cine/plan.json', import.meta.url)));
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
const SC = (id) => plan.scenes.find((s) => s.id === id);
const A = (id) => SC(id).start;
const B = (id) => SC(id).end;

let seed = 77;
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
    if (i >= N) break;
    const v = fn(j / SR, j);
    if (i < 0) continue;
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
const STR = mkTable(Array.from({length: 18}, (_, h) => (1 / (h + 1)) * Math.exp(-h * 0.1)));
const CELLO = mkTable(Array.from({length: 14}, (_, h) => (1 / (h + 1)) * (h % 2 ? 0.7 : 1) * Math.exp(-h * 0.05)));
const CHOIR = mkTable([1, 0.55, 0.7, 0.35, 0.18, 0.22, 0.08, 0.05, 0.04]);
const ORGAN = mkTable([1, 0.6, 0.35, 0.3, 0, 0.2, 0, 0.15]);
const FLUTE = mkTable([1, 0.16, 0.06, 0.03]);
const GURDY = mkTable(Array.from({length: 12}, (_, h) => 1 / Math.pow(h + 1, 0.8)));
const osc = (tb, ph) => {
  const x = ph * TAB;
  const i = x | 0;
  return tb[i] + (tb[i + 1] - tb[i]) * (x - i);
};

// ─────────────── instrumentos ───────────────
/** Voz sostenida (cuerdas, coro, órgano…) con vibrato, desafinación coral y paso bajo */
const voice = (b, t0, dur, f, vel, o = {}) => {
  const {tb = STR, att = 1.0, rel = 1.4, pan = 0, vib = 0.004, vibF = 5.2, det = [-0.004, 0, 0.0045], lp = 0.25, trem = 0} = o;
  const ph = det.map(() => rnd());
  let s1 = 0;
  const k = clamp(lp);
  each(b, t0, dur + rel, pan, (t) => {
    const env = Math.min(1, t / att) * (t > dur ? Math.max(0, 1 - (t - dur) / rel) : 1);
    const v = 1 + Math.sin(TAU * vibF * t + ph[0] * 6) * vib * Math.min(1, t / 1.2);
    let s = 0;
    for (let q = 0; q < det.length; q++) {
      ph[q] += (f * (1 + det[q]) * v) / SR;
      ph[q] -= Math.floor(ph[q]);
      s += osc(tb, ph[q]);
    }
    s1 += k * (s / det.length - s1);
    const tr = trem ? 0.75 + 0.25 * Math.sin(TAU * trem * t) : 1;
    return s1 * env * vel * tr;
  });
};
const chord = (b, t0, dur, midis, vel, o = {}) => midis.forEach((m, k) => voice(b, t0, dur, hz(m), vel / Math.sqrt(midis.length), {...o, pan: (o.pan ?? 0) + ((k / Math.max(1, midis.length - 1)) - 0.5) * (o.spread ?? 0.8)}));

/** Piano: cuerda percutida con inarmonicidad; `stop` corta en seco */
const piano = (b, t0, m, vel, pan = 0, len = 5, stop = Infinity) => {
  const f = hz(m);
  const Bi = 0.0004;
  const parts = [];
  for (let n = 1; n <= 10; n++) {
    const fn = f * n * Math.sqrt(1 + Bi * n * n);
    if (fn < 15000) parts.push({w: TAU * fn, a: Math.pow(n, -1.2) * (n === 1 ? 1 : 0.75), d: 0.5 + n * 0.5 + f / 900});
  }
  const L = Math.min(len, stop - t0);
  if (L <= 0) return;
  each(b, t0, L, pan, (t) => {
    let s = 0;
    for (const p of parts) s += Math.sin(p.w * t) * p.a * Math.exp(-t * p.d);
    const cut = stop - t0 - t < 0.04 ? clamp((stop - t0 - t) / 0.04) : 1;
    return s * vel * (1 - Math.exp(-t * 900)) * 0.45 * cut * clamp((L - t) / 0.3);
  });
};
const celesta = (b, t0, m, vel = 0.1, pan = 0, decay = 1.2) => {
  const f = hz(m);
  each(b, t0, decay * 3, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 1], [2.0, 0.3, 1.8], [3.0, 0.12, 2.6], [4.1, 0.08, 4]]) s += Math.sin(TAU * f * r * t) * a * Math.exp((-t * d) / decay);
    return s * vel * (1 - Math.exp(-t * 700));
  });
};
const harp = (b, t0, m, vel = 0.1, pan = 0) => {
  const f = hz(m);
  each(b, t0, 2.4, pan, (t) => {
    let s = 0;
    for (let h = 1; h <= 6; h++) s += (Math.sin(TAU * f * h * t) / (h * h)) * Math.exp(-t * (1.6 + h * 1.4));
    return s * vel * (1 - Math.exp(-t * 400));
  });
};
const flute = (b, t0, dur, m, vel = 0.12, pan = -0.2) => {
  voice(b, t0, dur, hz(m), vel, {tb: FLUTE, att: 0.08, rel: 0.25, vib: 0.006, vibF: 5.6, det: [0], lp: 0.5, pan});
  let s1 = 0;
  each(b, t0, dur, pan, (t) => {
    s1 += 0.2 * (rnd() * 2 - 1 - s1);
    return s1 * vel * 0.25 * Math.exp(-t * 6);
  });
};
const sine = (b, t0, dur, f, vel, att = 1, rel = 1, pan = 0) =>
  each(b, t0, dur, pan, (t) => Math.sin(TAU * f * t) * vel * Math.min(1, t / att) * clamp((dur - t) / rel));

// ─────────────── ruido, ambientes y efectos ───────────────
const noiseLP = (b, t0, dur, fc, vel, ampFn = () => 1, pan = 0) => {
  let s1 = 0, s2 = 0;
  const k = 1 - Math.exp((-TAU * fc) / SR);
  each(b, t0, dur, pan, (t) => {
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return s2 * vel * ampFn(t) * 3;
  });
};
const noiseBP = (b, t0, dur, fc, vel, ampFn = () => 1, pan = 0) => {
  let s1 = 0, s2 = 0;
  const k = 1 - Math.exp((-TAU * fc) / SR);
  each(b, t0, dur, pan, (t) => {
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return (s1 - s2) * 2.2 * vel * ampFn(t);
  });
};
const edge = (t, dur, f = 1.5) => clamp(t / f) * clamp((dur - t) / f);
const wind = (b, t0, dur, vel, pan = 0) => {
  let s1 = 0;
  each(b, t0, dur, pan, (t) => {
    const fc = 300 + 500 * (0.5 + 0.5 * Math.sin(t * 0.37 + pan * 3));
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    return s1 * vel * 2.2 * (0.55 + 0.45 * Math.sin(t * 0.23 + 1 + pan)) * edge(t, dur, 2);
  });
};
const rain = (b, t0, dur, vel, pan = 0) => {
  noiseBP(b, t0, dur, 4200, vel, (t) => edge(t, dur, 1.2), pan);
  for (let k = 0; k < dur * 14; k++) tick(b, t0 + rnd() * dur, vel * 0.5 * (0.3 + rnd()), rnd() * 1.6 - 0.8);
};
const sea = (b, t0, dur, vel) => {
  noiseLP(b, t0, dur, 500, vel, (t) => (0.35 + 0.65 * Math.pow(0.5 + 0.5 * Math.sin(t * 1.0), 2)) * edge(t, dur, 1.5), -0.3);
  noiseLP(b, t0, dur, 900, vel * 0.6, (t) => (0.3 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(t * 0.8 + 2), 3)) * edge(t, dur, 1.5), 0.3);
};
const river = (b, t0, dur, vel) => {
  noiseLP(b, t0, dur, 1200, vel, (t) => (0.7 + 0.3 * Math.sin(t * 3.1)) * edge(t, dur, 1), -0.2);
  for (let k = 0; k < dur * 5; k++) {
    const at = t0 + rnd() * dur;
    const f0 = 300 + rnd() * 600;
    each(b, at, 0.06, rnd() - 0.5, (t) => Math.sin(TAU * f0 * (1 + t * 8) * t) * Math.exp(-t * 60) * vel * 0.8);
  }
};
const murmur = (b, t0, dur, vel, fadeAt = Infinity) => {
  for (let v = 0; v < 5; v++) {
    const fc = 350 + rnd() * 500;
    const sy = 3.5 + rnd() * 2.5;
    const ph = rnd() * 10;
    noiseBP(b, t0, dur, fc, vel, (t) => Math.max(0, Math.sin(t * sy + ph) * Math.sin(t * 0.7 + ph)) * edge(t, dur, 1) * (t0 + t > fadeAt ? clamp(1 - (t0 + t - fadeAt) / 1.5) : 1), v / 2 - 1);
  }
};
const crickets = (b, t0, dur, vel) => {
  for (let c = 0; c < 4; c++) {
    const f = 4000 + rnd() * 1200;
    const pan = rnd() * 1.6 - 0.8;
    const per = 0.7 + rnd() * 0.5;
    for (let at = t0 + rnd() * per; at < t0 + dur - 0.2; at += per * (0.9 + rnd() * 0.2))
      for (let p = 0; p < 3; p++) each(b, at + p * 0.035, 0.025, pan, (t) => Math.sin(TAU * f * t) * Math.sin((Math.PI * t) / 0.025) * vel);
  }
};
const birds = (b, t0, dur, vel) => {
  for (let at = t0 + rnd(); at < t0 + dur - 0.5; at += 0.6 + rnd() * 1.6) {
    const n = 2 + Math.floor(rnd() * 4);
    const f0 = 2400 + rnd() * 2200;
    const pan = rnd() * 1.6 - 0.8;
    for (let k = 0; k < n; k++) {
      let ph = 0;
      each(b, at + k * 0.1, 0.07, pan, (t) => {
        ph += (TAU * f0 * (1 + Math.sin((t / 0.07) * Math.PI) * 0.25)) / SR;
        return Math.sin(ph) * Math.sin((Math.PI * t) / 0.07) * vel;
      });
    }
  }
};
const tick = (b, t0, vel = 0.08, pan = 0) => each(b, t0, 0.03, pan, (t) => Math.sin(TAU * 3200 * t) * Math.exp(-t * 220) * vel + (rnd() * 2 - 1) * Math.exp(-t * 400) * vel * 0.5);
const ding = (b, t0, f, vel = 0.12, pan = 0, decay = 1.2) =>
  each(b, t0, decay * 3, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[1, 1, 1], [2.0, 0.35, 1.6], [2.76, 0.22, 2.4], [5.4, 0.1, 4]]) s += Math.sin(TAU * f * r * t) * a * Math.exp((-t * d) / decay);
    return s * vel * (1 - Math.exp(-t * 600));
  });
const bell = (b, t0, f, vel = 0.15, pan = 0) =>
  each(b, t0, 6, pan, (t) => {
    let s = 0;
    for (const [r, a, d] of [[0.5, 0.6, 0.35], [1, 1, 0.5], [1.19, 0.5, 0.7], [1.5, 0.4, 0.8], [2.0, 0.35, 1.1], [2.74, 0.25, 1.6], [3.76, 0.15, 2.2]]) s += Math.sin(TAU * f * r * t) * a * Math.exp(-t * d);
    return s * vel * (1 - Math.exp(-t * 500)) * 0.5;
  });
const boom = (b, t0, vel = 0.5, len = 2.2) => {
  let ph = 0;
  each(b, t0, len, 0, (t) => {
    ph += (TAU * (34 + 50 * Math.exp(-t * 9))) / SR;
    return (Math.sin(ph) * Math.exp(-t * 2.2) + (rnd() * 2 - 1) * Math.exp(-t * 24) * 0.2) * vel;
  });
};
const thunder = (b, t0, vel = 0.4) => {
  boom(b, t0, vel * 0.8, 3);
  noiseLP(b, t0, 4.5, 220, vel, (t) => (1 - Math.exp(-t * 20)) * Math.exp(-t * 0.9) * (0.6 + 0.4 * Math.sin(t * 9) * Math.sin(t * 2.3)));
  noiseBP(b, t0, 0.5, 2500, vel * 0.5, (t) => Math.exp(-t * 8));
};
const whoosh = (b, t0, dur = 0.6, vel = 0.25, up = true, pan = 0) => {
  let s1 = 0, s2 = 0;
  each(b, t0, dur, pan, (t) => {
    const u = t / dur;
    const fc = up ? 400 * Math.pow(14, u) : 6000 * Math.pow(1 / 14, u);
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return s2 * Math.sin(Math.PI * u) ** 1.3 * vel;
  });
};
const riser = (b, t0, dur, vel) => {
  whoosh(b, t0, dur, vel, true);
  let ph = 0;
  each(b, t0, dur, 0, (t) => {
    ph += (TAU * 180 * Math.pow(5, t / dur)) / SR;
    return Math.sin(ph) * Math.pow(t / dur, 2) * vel * 0.25;
  });
};
const slam = (b, t0, vel = 0.5) => {
  boom(b, t0, vel, 1.6);
  noiseBP(b, t0, 0.3, 1800, vel * 0.7, (t) => Math.exp(-t * 18));
};
const clank = (b, t0, vel = 0.12, pan = 0) => {
  ding(b, t0, 900 + rnd() * 300, vel, pan, 0.15);
  noiseBP(b, t0, 0.08, 3000, vel * 0.8, (t) => Math.exp(-t * 60), pan);
};
const hum = (b, t0, dur, vel, flick = () => 1) =>
  each(b, t0, dur, 0.3, (t) => {
    let s = 0;
    for (let h = 1; h <= 6; h++) s += Math.sin(TAU * 60 * h * t) / h;
    return s * vel * flick(t0 + t) * edge(t, dur, 0.3);
  });
const whale = (b, t0, dur, f0, f1, vel, pan = 0) => {
  let ph = 0;
  each(b, t0, dur, pan, (t) => {
    const u = t / dur;
    ph += (TAU * (f0 * Math.pow(f1 / f0, Math.sin((u * Math.PI) / 2)) * (1 + Math.sin(t * 7) * 0.01))) / SR;
    return (Math.sin(ph) + 0.3 * Math.sin(ph * 2)) * Math.sin(Math.PI * u) * vel;
  });
};
const flutter = (b, t0, dur, vel, pan = 0) => noiseBP(b, t0, dur, 2500, vel, (t) => Math.max(0, Math.sin(t * TAU * 18)) * edge(t, dur, 0.1), pan);
const crackle = (b, t0, dur, vel) => {
  for (let k = 0; k < dur * 20; k++) tick(b, t0 + rnd() * dur, vel * (0.3 + rnd()), rnd() * 1.4 - 0.7);
};
const plink = (b, t0, vel = 0.3) => {
  let ph = 0;
  each(b, t0, 0.25, 0, (t) => {
    ph += (TAU * (2200 * Math.exp(-t * 14) + 700)) / SR;
    return Math.sin(ph) * Math.exp(-t * 18) * vel;
  });
  noiseBP(b, t0 + 0.01, 0.4, 3000, vel * 0.3, (t) => Math.exp(-t * 10));
};
const snap = (b, t0, vel = 0.3) => {
  noiseBP(b, t0, 0.15, 3500, vel, (t) => Math.exp(-t * 40));
  each(b, t0, 0.6, 0.2, (t) => Math.sin(TAU * 880 * (1 - t * 0.3) * t) * Math.exp(-t * 9) * vel * 0.5);
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

// ═══════════════ MÚSICA ═══════════════
const M = bus();
const pads = (t0, t1, prog, vel, o = {}) => {
  const step = (t1 - t0) / prog.length;
  prog.forEach((ch, k) => chord(M, t0 + k * step, step + 0.3, ch, vel, {att: 0.9, rel: 1.2, ...o}));
};
const arps = (t0, t1, prog, stepT, vel, pattern = [0, 1, 2, 3, 2, 1], stop = Infinity, oct = 12) => {
  const per = (t1 - t0) / prog.length;
  prog.forEach((ch, k) => {
    let j = 0;
    for (let t = t0 + k * per; t < t0 + (k + 1) * per - 0.05; t += stepT, j++) {
      const n = ch[pattern[j % pattern.length] % ch.length] + oct;
      piano(M, t, n, vel * (j % pattern.length === 0 ? 1 : 0.75), (pattern[j % pattern.length] - 1.5) * 0.25, 4, stop);
    }
  });
};
// acordes (MIDI)
const Dm = [50, 53, 57, 62], Bb = [46, 50, 53, 58], Gm = [43, 50, 55, 58], A7 = [45, 52, 55, 61], F = [41, 48, 53, 57], C = [48, 52, 55, 60];
const Dmaj = [50, 54, 57, 62], Amaj = [45, 52, 57, 61], Bm = [47, 54, 59, 62], G = [43, 50, 55, 59], Em = [40, 52, 55, 59];
const Cm = [48, 51, 55, 60], Ab = [44, 51, 56, 60], Fm = [41, 48, 53, 56], Gmaj = [43, 50, 55, 59], Eb = [43, 51, 55, 58];

// Acto I · la noche del juicio
sine(M, 0, A(2) + 2, hz(26), 0.22, 2.5, 2);
sine(M, 0, A(2) + 2, hz(38), 0.12, 3, 2);
voice(M, 0.5, A(2) + 1, hz(81), 0.025, {att: 3, rel: 2, det: [0], vib: 0.002});
piano(M, S(1) - 0.12, 69, 0.22, 0.2, 7);
piano(M, S(1) - 0.12, 38, 0.18, -0.2, 7);
{
  const a = A(2);
  pads(a, W(2, 'dejarte') - 0.2, [Dm, [50, 53, 57, 60]], 0.09);
  chord(M, W(2, 'dejarte') - 0.2, B(2) - W(2, 'dejarte') + 0.6, Bb, 0.09, {att: 0.6});
  [[0.5, 69], [1.7, 65], [2.9, 64], [4.1, 62], [5.9, 60], [6.6, 58]].forEach(([d, n]) => piano(M, a + d, n, 0.16, 0.1, 5));
}
{
  // gigantes: ostinato grave + timbales, eco de catedral
  const a = A(3), b = B(3);
  const tVer = W(3, 'veredicto');
  pads(a, tVer, [Dm, Bb, Gm, A7], 0.1, {tb: CELLO, lp: 0.12});
  const seq = [38, 38, 38, 38, 34, 34, 33, 33];
  for (let t = a + 0.2, k = 0; t < tVer - 0.1; t += 0.42, k++) voice(M, t, 0.32, hz(seq[k % 8]), 0.13, {tb: CELLO, att: 0.03, rel: 0.12, det: [-0.003, 0.003], lp: 0.2});
  for (const at of [W(3, 'engreídos'), W(3, 'pequeña parte'), W(3, 'identidades')]) boom(M, at, 0.18, 1.4);
  boom(M, tVer, 0.55, 3);
  chord(M, tVer, b - tVer + 0.5, [26, 38, 50, 51, 57], 0.16, {tb: CHOIR, att: 0.05, rel: 2, lp: 0.15});
}
{
  // ventana de mamá: piano tierno que se corta en seco
  const a = A(4) + 0.4, cut = S(6) - 0.02;
  arps(a, cut + 1.6, [F, Bb, [45, 48, 53, 57], C], 0.38, 0.12, [0, 2, 3, 1, 2, 3], cut);
  piano(M, a + 1.1, 72, 0.12, 0.2, 4, cut);
  piano(M, a + 2.6, 74, 0.12, 0.2, 4, cut);
  piano(M, a + 4.2, 77, 0.12, 0.2, 4, cut);
  // la calle: armónicos fríos
  chord(M, cut + 0.05, B(4) - cut + 0.6, [81, 82, 88], 0.05, {att: 1.2, trem: 7, lp: 0.6});
  sine(M, cut + 0.05, B(4) - cut + 1, hz(38), 0.12, 0.5, 1);
}
{
  // mercado: celesta en 3/4
  const a = A(5), b = B(5);
  const prog = [Dm, Gm, C, F];
  const per = (b - a) / 4;
  prog.forEach((ch, k) => {
    chord(M, a + k * per, per + 0.3, ch.map((n) => n - 12), 0.07, {att: 0.8});
    for (let j = 0; j < Math.floor(per / 0.55); j++) celesta(M, a + k * per + j * 0.55, ch[[0, 2, 3][j % 3]] + 24, j % 3 ? 0.035 : 0.05, (j % 3 - 1) * 0.4, 0.8);
  });
  chord(M, W(9, 'recompensas') - 0.3, 4, [53, 57, 60, 64], 0.08, {tb: CHOIR, att: 1.4, lp: 0.2});
}
{
  // mar y profundidad
  const a = A(6), b = B(6);
  const tDive = W(10, 'rara vez');
  chord(M, a, tDive - a + 0.5, [50, 53, 57, 64], 0.07, {att: 1.5});
  piano(M, a + 1, 74, 0.1, 0.3, 5);
  piano(M, a + 3.4, 69, 0.1, -0.2, 5);
  chord(M, tDive, b - tDive, [26, 38, 45], 0.12, {tb: CELLO, att: 1.5, lp: 0.05});
  chord(M, W(10, 'atención') - 0.2, 3, [46, 50, 53, 57], 0.08, {tb: CHOIR, att: 0.6, lp: 0.15});
  chord(M, W(10, 'respeto') - 0.2, 3, [48, 52, 55, 62], 0.08, {tb: CHOIR, att: 0.6, lp: 0.15});
  chord(M, W(10, 'amor') - 0.2, b - W(10, 'amor') + 1, [41, 53, 57, 60, 67, 69], 0.13, {tb: CHOIR, att: 0.8, lp: 0.2});
  celesta(M, W(10, 'amor'), 81, 0.06, 0.2, 2);
}
{
  // la niña de la vela: caja de música
  const a = A(7), b = B(7);
  pads(a, b, [Dm, Bb, F, C], 0.06, {lp: 0.15});
  const mel = [81, 77, 76, 74, 72, 74, 76, 77, 76, 74, 72, 69, 72, 74];
  mel.forEach((n, k) => celesta(M, S(12) + 0.6 + k * 0.48, n, 0.06, 0.1, 1.0));
  for (const w of ['vecino', 'amigo', 'compañero']) piano(M, W(13, w) - 0.15, w === 'amigo' ? 77 : w === 'vecino' ? 74 : 81, 0.12, 0.2, 4);
}

// Acto II · la promesa
{
  const a = A(8);
  const tB = S(17) - 0.4;
  const tSnap = W(18, 'cima');
  riser(M, a - 1.2, 1.3, 0.12);
  chord(M, a, 3, [41, 53, 60, 65, 69], 0.12, {tb: CHOIR, att: 0.2, rel: 2});
  pads(a + 0.3, tB, [F, [40, 48, 52, 55], Dm, Bb, F, [40, 48, 52, 55]], 0.1);
  arps(a + 0.3, tB, [F, [40, 48, 52, 55], Dm, Bb, F, [40, 48, 52, 55]], 0.32, 0.09, [0, 1, 2, 3, 2, 3]);
  chord(M, S(16) - 0.3, tB - S(16) + 0.6, [65, 69, 72, 77], 0.06, {tb: CHOIR, att: 1.5});
  pads(tB, tSnap, [Dm, Gm], 0.08, {lp: 0.12});
  voice(M, tB + 0.5, tSnap - tB - 0.5, hz(81), 0.03, {att: 2, det: [0], vib: 0.006});
  chord(M, tSnap, B(8) - tSnap + 0.8, [38, 50, 51], 0.1, {tb: CELLO, att: 0.05, lp: 0.08});
}
{
  // dos caminos: ostinato de piano y chelo
  const a = A(9), b = B(9);
  const tDes = W(21, 'desigualdades');
  const prog = [Dm, Bb, F, C];
  let k = 0;
  for (let t = a + 0.3; t < tDes - 0.1; t += 0.36, k++) {
    const ch = prog[Math.floor(k / 8) % 4];
    piano(M, t, ch[[0, 3, 2, 3, 1, 3, 2, 3][k % 8]] + 12, k % 8 === 0 ? 0.09 : 0.06, 0.15, 2.5, tDes + 0.3);
    if (k % 8 === 0) chord(M, t, 2.9, ch.map((n) => n - 12).slice(0, 2), 0.09, {tb: CELLO, att: 0.4, lp: 0.12});
  }
  const cello = [[0, 62, 2.6], [3, 65, 2.6], [6, 64, 2.6], [9, 60, 2.6], [12, 62, 4.5]];
  for (const [d, n, l] of cello) voice(M, S(20) + d, l, hz(n - 12), 0.08, {tb: CELLO, att: 0.4, rel: 0.8, vib: 0.007, lp: 0.2});
  chord(M, tDes - 0.2, b - tDes + 0.8, [34, 46, 52, 58, 64], 0.12, {att: 0.8, lp: 0.15});
  boom(M, tDes, 0.4, 2.5);
}
{
  // biblioteca: arpa dorada que vuela y luego cae
  const a = A(10), b = B(10);
  const tFly = S(24) - 1.6, tFall = S(25) - 0.3;
  chord(M, a, tFly - a, [46, 53, 58, 62], 0.06, {att: 1.5});
  const up = [[46, 50, 53, 58], [51, 55, 58, 63], [53, 57, 60, 65], [46, 50, 53, 58]];
  let j = 0;
  for (let t = tFly; t < tFall; t += 0.16, j++) harp(M, t, up[Math.floor(j / 8) % 4][j % 4] + 12 + (j % 8 >= 4 ? 12 : 0), 0.08, (j % 4 - 1.5) * 0.4);
  chord(M, tFly, tFall - tFly, [58, 62, 65, 70], 0.06, {tb: CHOIR, att: 1});
  const down = [Gm, Eb, Cm, [50, 54, 57, 62]];
  pads(tFall, b, down, 0.07, {lp: 0.1});
  for (let t = tFall, q = 0; t < S(26); t += 0.45, q++) harp(M, t, 82 - q * 2, 0.05, 0.3);
  piano(M, W(26, 'lidiar') - 0.2, 50, 0.14, -0.2, 6);
  piano(M, W(26, 'lidiar') + 0.4, 81, 0.07, 0.3, 6);
}
{
  // reloj de arena
  const a = A(11), b = B(11);
  chord(M, a, b - a, [50, 52, 57, 64], 0.07, {att: 2, lp: 0.12});
  chord(M, W(28, 'insatisfacción') - 0.5, b - W(28, 'insatisfacción') + 1, [51, 63], 0.05, {att: 1.5, trem: 5});
}

// Acto III · el mito
{
  const a = A(12), b = B(12);
  const tSnip = W(32, 'meritocracias') + 0.2;
  boom(M, a + 0.6, 0.35, 3);
  chord(M, a + 0.6, tSnip - a - 0.6, [38, 45], 0.1, {tb: GURDY, att: 1.2, rel: 0.3, lp: 0.1});
  const tune = [[74, 0.6], [76, 0.6], [77, 1.2], [79, 0.6], [81, 1.2], [79, 0.6], [77, 0.6], [76, 1.2], [74, 0.6], [72, 0.6], [74, 1.8]];
  let t = a + 2.2;
  while (t < tSnip - 1) {
    for (const [n, d] of tune) {
      if (t + d > tSnip - 0.1) break;
      flute(M, t, d * 0.92, n, 0.1);
      t += d;
    }
    t += 0.6;
  }
  // la escalera dorada: coro glorioso que crece
  const pr = [[46, 53, 58, 62], [45, 53, 57, 60], [43, 50, 55, 58], [51, 55, 58, 63]];
  const step = (b - tSnip - 0.5) / 4;
  pr.forEach((ch, k) => {
    chord(M, tSnip + 0.5 + k * step, step + 0.4, ch, 0.08 + k * 0.025, {tb: CHOIR, att: 1, lp: 0.2});
    chord(M, tSnip + 0.5 + k * step, step + 0.4, ch.map((n) => n - 12), 0.06 + k * 0.02, {att: 1, lp: 0.15});
  });
}
{
  // el dedo
  const a = A(13), b = B(13);
  const tTurn = W(33, 'cima') + 0.6;
  const tResp = W(33, 'responsables');
  chord(M, a, tTurn - a, [51, 55, 58, 63, 67], 0.14, {tb: CHOIR, att: 0.6, lp: 0.2});
  chord(M, tTurn, tResp - tTurn, [43, 50, 55, 58], 0.1, {tb: CELLO, att: 1, lp: 0.1});
  chord(M, tResp, b - tResp + 1, [26, 38, 39, 50], 0.14, {tb: CELLO, att: 0.05, lp: 0.08});
}
{
  // la maquinaria: ostinato mecánico
  const a = A(14), b = B(14);
  const prog = [Cm, Ab, Fm, [43, 50, 55, 59]];
  let k = 0;
  for (let t = a + 0.4; t < b - 0.3; t += 0.3, k++) {
    const ch = prog[Math.floor(k / 8) % 4];
    voice(M, t, 0.18, hz(ch[0] - 12 + (k % 2 ? 12 : 0)), 0.09, {tb: CELLO, att: 0.02, rel: 0.1, det: [-0.003, 0.003], lp: 0.25});
    if (k % 8 === 0) chord(M, t, 2.5, ch, 0.06, {att: 0.6, lp: 0.12});
  }
  chord(M, W(36, 'sistemas') - 0.4, b - W(36, 'sistemas') + 0.6, [36, 48, 51, 55], 0.1, {tb: CHOIR, att: 1.2, lp: 0.12});
}
{
  // la rueda: tormenta, campana, y el silencio seco del corte
  const a = A(15), b = B(15);
  const tNow = S(39) - 0.05;
  pads(a, tNow, [Dm, Bb, Gm, A7], 0.1, {tb: CELLO, lp: 0.1, rel: 0.05});
  for (let t = a + 0.6; t < tNow - 0.5; t += 2.4) bell(M, t, hz(50), 0.14, -0.3);
  chord(M, W(38, 'desafortunados') - 0.2, tNow - W(38, 'desafortunados') + 0.15, [38, 50, 53, 57, 62], 0.14, {tb: CHOIR, att: 0.3, rel: 0.05, lp: 0.2});
  boom(M, W(38, 'desafortunados') - 0.2, 0.3, 2);
  piano(M, W(39, 'perdedores') - 0.05, 37, 0.2, 0, 6);
  piano(M, W(39, 'perdedores') - 0.05, 50, 0.14, 0, 6);
  boom(M, W(39, 'perdedores') - 0.05, 0.3, 2);
}
{
  // noir
  const a = A(16), b = B(16);
  const walk = [38, 36, 34, 33, 31, 33, 34, 36];
  for (let t = a + 0.4, k = 0; t < b - 0.4; t += 0.7, k++) harp(M, t, walk[k % 8], 0.14, -0.2);
  piano(M, a + 1.0, 62, 0.08, 0.3, 4);
  piano(M, a + 3.8, 65, 0.08, 0.3, 4);
  const tSlam = W(42, 'veredicto') - 0.1;
  voice(M, tSlam, b - tSlam + 0.8, hz(38), 0.12, {tb: CELLO, att: 0.1, lp: 0.12});
}
{
  // detrás de cada número: piano espaciado bajo la lluvia
  const a = A(17), b = B(17);
  const notes = [57, 62, 64, 65, 69, 64, 62, 60, 62];
  notes.forEach((n, k) => piano(M, a + 0.8 + k * 2.4, n, 0.09, (k % 3 - 1) * 0.3, 5));
  chord(M, S(44), b - S(44), [62, 69, 74, 76], 0.035, {att: 3, lp: 0.15});
  for (let k = 0; k < 6; k++) celesta(M, W(44, 'rotas') + 0.6 + k * 0.28, [74, 76, 78, 81, 83, 86][k], 0.04, 0.4, 1.2);
}
// escena 18: silencio… y el primer acorde mayor
{
  const a = A(18);
  chord(M, a + 2.9, 5, [50, 54, 57, 62], 0.08, {att: 1.6, lp: 0.15});
  piano(M, a + 3.0, 66, 0.1, 0.2, 6);
}

// Acto IV · el amanecer
{
  const a = A(19), b = B(19);
  const tMe = S(47);
  pads(a, tMe, [Dmaj, Amaj.map((n) => (n === 45 ? 49 : n)), Bm, G], 0.1, {lp: 0.18});
  arps(a + 0.2, tMe, [Dmaj, [49, 52, 57, 61], Bm, G], 0.34, 0.08, [0, 1, 2, 3, 2, 1]);
  voice(M, a + 2, tMe - a - 2, hz(74), 0.04, {att: 3, vib: 0.006});
  chord(M, tMe, b - tMe + 0.6, G, 0.07, {att: 0.6});
  piano(M, tMe + 0.2, 71, 0.12, 0.2, 4);
  piano(M, tMe + 1.0, 74, 0.12, 0.2, 4);
  piano(M, tMe + 1.8, 78, 0.12, 0.2, 4);
}
{
  const a = A(20), b = B(20);
  const tB = S(50) - 0.4;
  pads(a, tB, [G, [42, 50, 54, 57], Em, C], 0.09, {lp: 0.18});
  arps(a + 0.2, tB, [G, [42, 50, 54, 57], Em, C], 0.4, 0.07, [0, 2, 1, 3, 2, 1]);
  chord(M, tB, b - tB, [64, 71, 76], 0.05, {att: 1.5, trem: 6, lp: 0.5});
  sine(M, tB, b - tB, hz(40), 0.1, 1, 1);
  piano(M, W(50, 'empatía') - 0.1, 76, 0.1, 0.3, 4);
  piano(M, W(50, 'familiar') - 0.1, 71, 0.1, 0.3, 4);
}
{
  // constelaciones: el gran crescendo
  const a = A(21), b = B(21);
  const tCv = W(52, 'currículum');
  const prog = [Dmaj, Bm, G, [45, 52, 57, 61], Dmaj, Bm];
  const step = (tCv - 0.3 - a) / prog.length;
  prog.forEach((ch, k) => {
    const v = 0.07 + k * 0.025;
    chord(M, a + k * step, step + 0.4, ch, v, {att: 0.9, lp: 0.2});
    if (k >= 2) chord(M, a + k * step, step + 0.4, ch.map((n) => n + 12), v * 0.8, {tb: CHOIR, att: 0.9, lp: 0.22});
  });
  arps(a + 0.2, tCv - 0.3, prog, 0.27, 0.07, [0, 1, 2, 3, 2, 3]);
  // redoble de timbal
  for (let t = tCv - 2.6, k = 0; t < tCv - 0.3; t += 0.07, k++) boom(M, t, 0.03 + (k / 33) * 0.1, 0.25);
  const top = [38, 50, 54, 57, 62, 66, 69, 74];
  chord(M, tCv - 0.3, b - tCv + 1.2, top, 0.26, {tb: ORGAN, att: 0.15, rel: 2.5, lp: 0.2});
  chord(M, tCv - 0.3, b - tCv + 1.2, top.slice(2), 0.22, {tb: CHOIR, att: 0.2, rel: 2.5, lp: 0.25});
  boom(M, tCv - 0.3, 0.5, 3.5);
  celesta(M, tCv, 86, 0.06, 0.3, 2);
}
{
  // barco de papel: piano solo que resuelve
  const a = A(22), b = B(22);
  const mel = [[0.3, 78], [1.0, 76], [1.7, 74], [2.6, 69], [3.6, 71], [4.3, 74]];
  mel.forEach(([d, n]) => piano(M, a + d, n, 0.13, 0.15, 5));
  piano(M, a + 0.3, 50, 0.1, -0.2, 6);
  piano(M, a + 2.6, 43, 0.1, -0.2, 6);
  chord(M, S(54) - 0.1, 1.6, [43, 50, 57, 59, 62], 0.06, {att: 0.4, lp: 0.15});
  chord(M, S(54) + 1.3, b - S(54) + 0.5, [50, 57, 62, 66], 0.07, {att: 0.5, lp: 0.2});
  celesta(M, S(54) + 1.35, 86, 0.06, 0.2, 2);
  celesta(M, S(54) + 1.55, 90, 0.05, 0.4, 2);
}
{
  // encrucijada: sin resolver
  const a = A(23), b = B(23);
  chord(M, a, 3.5, [50, 52, 57, 62], 0.06, {att: 1});
  chord(M, a + 3.5, b - a - 3.5, [43, 45, 50, 55, 59], 0.06, {att: 1});
  piano(M, W(56, 'piensas') - 0.1, 71, 0.11, 0.2, 5);
  piano(M, W(56, 'humano') - 0.1, 74, 0.11, 0.2, 5);
}
{
  // créditos: el acorde final
  const a = A(24), b = B(24);
  chord(M, a, b - a - 0.4, [38, 50, 54, 57, 62, 66], 0.12, {att: 2, rel: 1.2, lp: 0.2});
  chord(M, a + 1.5, b - a - 1.9, [62, 66, 69, 74], 0.08, {tb: CHOIR, att: 2.5, rel: 1.2, lp: 0.2});
  [[0.4, 69], [1.2, 66], [2.0, 62], [3.4, 74], [5.0, 78]].forEach(([d, n]) => piano(M, a + d, n, 0.11, 0.1, 5));
}
reverb(M, {room: 0.9, damp: 0.35, wet: 0.32});
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = clamp(t / 0.2) * clamp((DUR - t) / 1.8);
  M.L[i] *= g;
  M.R[i] *= g;
}
writeWav(M, '../out/cine-music.wav', 0.8);
console.log('música lista');

// ═══════════════ AMBIENTES Y EFECTOS ═══════════════
const X = bus();
// 1 · llanura
wind(X, 0, B(1) + 1, 0.12);
for (let k = 0; k < 20; k++) tick(X, S(1) + rnd() * 1.6, 0.025, rnd() - 0.5);
// 2 · terraza
murmur(X, A(2) - 0.5, B(2) - A(2) + 1, 0.05, W(2, 'dejarte'));
for (let k = 0; k < 4; k++) ding(X, A(2) + 0.6 + k * 1.3, 2200 + rnd() * 800, 0.02, rnd() - 0.5, 0.3);
whoosh(X, W(2, 'impresionante') - 0.1, 1.2, 0.08, true, 0.3);
// 3 · gigantes
wind(X, A(3), B(3) - A(3) + 1, 0.1, -0.3);
for (const at of [W(3, 'engreídos'), W(3, 'pequeña parte')]) noiseLP(X, at, 1.2, 300, 0.12, (t) => Math.exp(-t * 3));
slam(X, W(3, 'veredicto'), 0.5);
noiseBP(X, W(3, 'veredicto') + 0.05, 1.2, 800, 0.15, (t) => Math.exp(-t * 3));
// 4 · ventana / calle
noiseLP(X, A(4), S(6) - A(4), 200, 0.03, (t) => edge(t, S(6) - A(4), 1));
wind(X, S(6), B(4) - S(6) + 0.8, 0.1, 0.4);
whoosh(X, W(7, 'juicio') - 0.25, 0.8, 0.12, false, -0.3);
whoosh(X, W(7, 'humillación') - 0.25, 0.8, 0.12, false, 0.3);
// 5 · mercado
murmur(X, A(5), B(5) - A(5) + 0.8, 0.04);
for (let t = A(5) + 0.3; t < B(5); t += 0.5 + rnd() * 0.9) ding(X, t, 2600 + rnd() * 1800, 0.018, rnd() * 1.6 - 0.8, 0.5);
// 6 · mar y ballenas
{
  const tDive = W(10, 'rara vez');
  sea(X, A(6) - 0.5, tDive - A(6) + 2, 0.07);
  whoosh(X, tDive + 0.1, 1.6, 0.18, false);
  noiseLP(X, tDive + 0.8, B(6) - tDive + 0.4, 160, 0.09, (t) => edge(t, B(6) - tDive + 0.4, 1));
  whale(X, tDive + 2.0, 3.2, 260, 520, 0.05, -0.4);
  whale(X, W(10, 'respeto') + 0.6, 3.0, 380, 200, 0.045, 0.4);
  whale(X, W(10, 'amor') + 1.2, 3.6, 300, 600, 0.05, 0);
  for (let k = 0; k < 30; k++) each(X, tDive + 0.6 + rnd() * 7, 0.08, rnd() - 0.5, (t) => Math.sin(TAU * (500 + rnd() * 10 + t * 4000) * t) * Math.exp(-t * 40) * 0.02);
}
// 7 · azotea / vela / ventanas
noiseLP(X, A(7), S(12) + 1.8 - A(7), 140, 0.05, (t) => edge(t, S(12) + 1.8 - A(7), 1));
whoosh(X, S(12) + 0.2, 2.0, 0.12, true);
crackle(X, S(12) + 2, S(13) - S(12) - 2, 0.012);
noiseLP(X, S(13) - 0.3, B(7) - S(13) + 1, 160, 0.04, (t) => edge(t, B(7) - S(13) + 1, 1));
// 8 · colina, cometa, montaña
{
  const tB = S(17) - 0.4;
  wind(X, A(8), B(8) - A(8) + 0.8, 0.07, 0.3);
  birds(X, A(8) + 1, tB - A(8) - 1, 0.012);
  riser(X, A(8) - 1.0, 1.0, 0.08);
  for (let k = 0; k < 10; k++) ding(X, W(16, 'oportunidades') - 0.8 + k * 0.16, 1800 + k * 120, 0.012, (k / 10 - 0.5) * 1.4, 0.5);
  snap(X, W(18, 'cima'), 0.28);
  whoosh(X, W(18, 'cima') - 0.2, 0.5, 0.12, false, -0.2);
}
// 9 · dos caminos
{
  const a = A(9), b = B(9);
  wind(X, a, b - a + 0.8, 0.05, -0.6);
  rain(X, a, b - a + 0.8, 0.035, 0.6);
  for (const w of ['educación', 'salud', 'estabilidad']) ding(X, W(20, w) - 0.15, 1700, 0.03, -0.5, 0.6);
  noiseLP(X, W(20, 'carencias'), 1.2, 260, 0.08, (t) => Math.exp(-t * 2), 0.6);
  // silbato
  each(X, W(21, 'misma regla') - 0.9, 0.5, 0, (t) => Math.sin(TAU * (2600 + Math.sin(t * TAU * 30) * 120) * t) * 0.05 * edge(t, 0.5, 0.03));
  slam(X, W(21, 'misma regla') - 0.3, 0.35);
  // la piedra que rueda
  const t0 = W(21, 'desigualdades') + 0.4;
  noiseLP(X, t0, 2.2, 140, 0.15, (t) => Math.exp(-t * 0.8) * (0.6 + 0.4 * Math.sin(t * 18)), 0.6);
  for (let k = 0; k < 6; k++) tick(X, t0 + k * 0.3 * (1 - k * 0.08), 0.06, 0.6);
}
// 10 · biblioteca
{
  const a = A(10), b = B(10);
  noiseLP(X, a, b - a + 0.5, 180, 0.03, (t) => edge(t, b - a + 0.5, 1));
  crackle(X, a, b - a, 0.006);
  for (let t = S(24) - 1.6; t < S(25) - 0.3; t += 0.25 + rnd() * 0.3) flutter(X, t, 0.3, 0.05, rnd() * 1.6 - 0.8);
  for (let k = 0; k < 14; k++) flutter(X, S(25) - 0.3 + rnd() * 2.6, 0.25, 0.03, rnd() - 0.5);
  flutter(X, W(26, 'lidiar') - 0.5, 0.5, 0.05, 0);
}
// 11 · reloj de arena
{
  const a = A(11), b = B(11);
  noiseBP(X, a, b - a + 0.5, 6000, 0.03, (t) => edge(t, b - a + 0.5, 1.2) * (0.4 + 0.6 * clamp((a + t - W(28, 'insatisfacción') + 1.2) / 1.5)));
  wind(X, W(28, 'insatisfacción') - 1.2, b - W(28, 'insatisfacción') + 1.8, 0.1, 0.2);
  for (let t = a + 0.8; t < b; t += 1.3) tick(X, t + 0.45, 0.04, 0);
}
// 12 · teatro de sombras / tijeras / escalera
{
  const a = A(12);
  const tSnip = W(32, 'meritocracias') + 0.2;
  crackle(X, a, tSnip - a, 0.01);
  noiseLP(X, a, tSnip - a, 300, 0.02, (t) => edge(t, tSnip - a, 1));
  // tijeras: dos chasquidos metálicos
  ding(X, tSnip - 0.25, 3200, 0.06, 0.3, 0.12);
  ding(X, tSnip, 2800, 0.08, 0.3, 0.2);
  noiseBP(X, tSnip, 0.12, 5000, 0.12, (t) => Math.exp(-t * 40));
  for (let k = 0; k < 6; k++) snap(X, tSnip + 0.02 + k * 0.03, 0.05);
  for (let k = 0; k < 4; k++) noiseLP(X, tSnip + 0.5 + k * 0.12, 0.3, 200, 0.08, (t) => Math.exp(-t * 10));
  riser(X, tSnip + 0.3, 1.5, 0.08);
}
// 13 · el dedo
{
  const a = A(13);
  for (let k = 0; k < 40; k++) noiseBP(X, a + rnd() * 3.5, 0.08, 1800 + rnd() * 600, 0.02, (t) => Math.exp(-t * 30), rnd() * 1.4 - 0.7);
  noiseLP(X, W(33, 'fondo') - 0.6, 2, 120, 0.12, (t) => edge(t, 2, 0.6));
  thunder(X, W(33, 'responsables') - 0.05, 0.5);
}
// 14 · maquinaria
{
  const a = A(14), b = B(14);
  noiseLP(X, a, b - a + 0.5, 120, 0.05, (t) => edge(t, b - a + 0.5, 1));
  for (let t = W(35, 'desigualdades'); t < b; t += 0.6) {
    clank(X, t, 0.05, 0.3);
    clank(X, t + 0.3, 0.03, -0.3);
  }
  for (let t = W(35, 'desigualdades') + 1; t < b; t += 3.1) noiseBP(X, t, 0.9, 5000, 0.03, (u) => Math.exp(-u * 3));
  for (const w of ['esforzarse', 'listo']) whoosh(X, W(36, w) - 0.3, 0.6, 0.08, true, 0);
}
// 15 · rueda
{
  const a = A(15), b = B(15);
  const tNow = S(39) - 0.05;
  rain(X, a, b - a + 0.6, 0.04);
  wind(X, a, tNow - a + 0.1, 0.08, -0.4);
  for (const at of [a + 1.2, a + 4.6, W(38, 'desafortunados') - 0.3, a + 9.8, W(38, 'diosa') + 0.4, a + 13.4]) thunder(X, at + 0.25, 0.22);
  // crujido de la rueda que se detiene
  let ph = 0;
  each(X, tNow - 0.6, 1.0, 0, (t) => {
    ph += (TAU * (90 - t * 50)) / SR;
    return (((ph / TAU) % 1) * 2 - 1) * 0.04 * edge(t, 1.0, 0.1) * (0.6 + 0.4 * Math.sin(t * 60));
  });
  hum(X, tNow + 0.8, b - tNow, 0.02, (t) => (Math.sin(t * 37) * Math.sin(t * 5.3) > -0.2 ? 1 : 0.15));
  slam(X, W(39, 'perdedores') - 0.05, 0.3);
}
// 16 · noir
{
  const a = A(16), b = B(16);
  for (let k = 0; k < 16; k++) tick(X, a + 0.3 + k * 0.13 * (1 + k * 0.06), 0.12 * (1 - k / 20), rnd() * 0.8 - 0.4);
  noiseBP(X, W(40, 'suerte') + 1.4, 1.2, 4000, 0.06, (t) => Math.exp(-t * 2.5));
  rain(X, S(41) - 0.2, b - S(41) + 0.8, 0.05);
  whoosh(X, W(42, 'veredicto') - 0.6, 0.5, 0.1, false);
  slam(X, W(42, 'veredicto') - 0.1, 0.55);
  boom(X, W(42, 'veredicto') - 0.1, 0.25, 3);
}
// 17 · lluvia en el cristal
rain(X, A(17), B(17) - A(17) + 0.4, 0.04);
noiseLP(X, A(17), B(17) - A(17), 250, 0.03, (t) => edge(t, B(17) - A(17), 2));
// 18 · la gota (silencio absoluto)
plink(X, A(18) + 0.9, 0.3);
for (let k = 0; k < 3; k++) plink(X, A(18) + 1.5 + k * 0.6, 0.05 / (k + 1));
// 19 · amanecer
birds(X, A(19), B(19) - A(19), 0.02);
wind(X, A(19), B(19) - A(19) + 0.5, 0.05, -0.2);
for (let k = 0; k < 18; k++) noiseBP(X, A(19) + 1.0 + rnd() * 2.4, 0.4, 4500, 0.012, (t) => Math.sin((Math.PI * t) / 0.4), rnd() - 0.5);
// 20 · pueblo y castillo
crickets(X, A(20), S(50) - 0.4 - A(20), 0.008);
birds(X, A(20), 6, 0.01);
wind(X, S(50) - 0.4, B(20) - S(50) + 1, 0.09, 0.3);
// 21 · noche de estrellas
crickets(X, A(21), B(21) - A(21), 0.01);
wind(X, A(21), B(21) - A(21), 0.03, -0.3);
// 22 · río
river(X, A(22) - 0.4, B(22) - A(22) + 1, 0.05);
for (let k = 0; k < 3; k++) noiseBP(X, A(22) + 1.4 + k * 0.4, 0.25, 2200, 0.03, (t) => Math.sin((Math.PI * t) / 0.25));
noiseLP(X, A(22) + 3.3, 0.6, 600, 0.05, (t) => Math.exp(-t * 4));
for (let k = 0; k < 24; k++) tick(X, S(54) - 0.1 + rnd() * 1.2, 0.02, rnd() - 0.5);
whoosh(X, S(54) + 1.1, 0.8, 0.1, true);
// 23 · encrucijada
wind(X, A(23), B(23) - A(23) + 0.5, 0.06, 0);
birds(X, A(23) + 0.5, B(23) - A(23), 0.01);
whoosh(X, W(56, 'piensas') - 0.3, 0.8, 0.06, true);
// 24 · créditos
birds(X, A(24), B(24) - A(24) - 1, 0.015);
for (const w of ['comentarios', 'like', 'suscribirte']) {
  ding(X, W(57, w) - 0.15, 1760, 0.03, 0, 0.8);
  ding(X, W(57, w) - 0.05, 2637, 0.02, 0, 0.8);
}
// transiciones a negro / blanco
for (const sc of plan.scenes.slice(1)) {
  if (sc.in === 'white') riser(X, sc.start - 1.0, 1.1, 0.06);
  if (sc.in === 'black') whoosh(X, sc.start - 0.4, 0.8, 0.05, false);
}
reverb(X, {room: 0.6, wet: 0.16});
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = clamp(t / 0.3) * clamp((DUR - t) / 1.5);
  X.L[i] *= g;
  X.R[i] *= g;
}
writeWav(X, '../out/cine-sfx.wav', 0.7);
console.log('cine-music.wav y cine-sfx.wav listos');
void E;
