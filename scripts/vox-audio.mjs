// Banda sonora estilo explicador periodístico para «Ansiedad por el estatus».
// Cama de sintetizador pulsante a 100 bpm (La menor → Do mayor en «¿Cómo superarlo?»),
// más efectos: máquina de escribir, rotulador, subrayador, sellos, barridos y «plinks».
import fs from 'node:fs';

const cues = JSON.parse(fs.readFileSync(new URL('../src/estatus/cues.json', import.meta.url)));
const plan = JSON.parse(fs.readFileSync(new URL('../src/vox/plan.json', import.meta.url)));
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
const sceneStart = (id) => plan.scenes.find((s) => s.id === id).start;

let seed = 23;
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

// ─────────────── instrumentos ───────────────
const pluck = (b, t0, f, vel, pan = 0) =>
  each(b, t0, 0.9, pan, (t) => {
    let s = 0;
    for (let h = 1; h <= 7; h++) s += Math.sin(TAU * f * h * t) / h * Math.exp(-t * (5 + h * 3.5));
    return s * vel * (1 - Math.exp(-t * 400));
  });
const sub = (b, t0, dur, f, vel) =>
  each(b, t0, dur, 0, (t) => Math.sin(TAU * f * t) * vel * clamp(t / 0.05) * clamp((dur - t) / 0.15));
const kick = (b, t0, vel) => {
  let ph = 0;
  each(b, t0, 0.35, 0, (t) => {
    ph += (TAU * (45 + 90 * Math.exp(-t * 35))) / SR;
    return Math.sin(ph) * Math.exp(-t * 12) * vel;
  });
};
const hat = (b, t0, vel, pan = 0.2) => {
  let prev = 0;
  each(b, t0, 0.04, pan, (t) => {
    const n = rnd() * 2 - 1;
    const hp = n - prev;
    prev = n;
    return hp * Math.exp(-t * 160) * vel;
  });
};
const padChord = (b, t0, t1, freqs, vel) => {
  freqs.forEach((f, k) => {
    const ph0 = rnd() * TAU;
    each(b, t0, t1 - t0, k % 2 ? 0.5 : -0.5, (t) => {
      const env = clamp(t / 1.2) * clamp((t1 - t0 - t) / 1.2);
      return (Math.sin(TAU * f * t + ph0) + 0.3 * Math.sin(TAU * f * 2.003 * t)) * env * vel / freqs.length;
    });
  });
};
const noiseSweep = (b, t0, dur, f0, f1, vel, pan = 0) => {
  let s1 = 0, s2 = 0;
  each(b, t0, dur, pan, (t) => {
    const u = t / dur;
    const fc = f0 * Math.pow(f1 / f0, u);
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    s2 += k * (s1 - s2);
    return s2 * Math.sin(Math.PI * u) ** 1.4 * vel;
  });
};
const boom = (b, t0, vel) => {
  let ph = 0;
  each(b, t0, 1.6, 0, (t) => {
    ph += (TAU * (38 + 50 * Math.exp(-t * 8))) / SR;
    return (Math.sin(ph) * Math.exp(-t * 2.6) + (rnd() * 2 - 1) * Math.exp(-t * 30) * 0.3) * vel;
  });
};
const typeClick = (b, t0, vel) => {
  let prev = 0;
  const f = 1800 + rnd() * 900;
  each(b, t0, 0.05, (rnd() - 0.5) * 0.4, (t) => {
    const n = rnd() * 2 - 1;
    const hp = n - prev * 0.6;
    prev = n;
    return (hp * Math.exp(-t * 260) * 0.8 + Math.sin(TAU * f * t) * Math.exp(-t * 300) * 0.4 + Math.sin(TAU * 140 * t) * Math.exp(-t * 60) * 0.5) * vel;
  });
};
const typing = (b, t0, dur, n, vel = 0.22) => {
  for (let k = 0; k < n; k++) typeClick(b, t0 + (dur * k) / n + (rnd() - 0.5) * 0.012, vel * (0.7 + rnd() * 0.5));
};
const marker = (b, t0, dur, vel = 0.12) => {
  let s1 = 0;
  each(b, t0, dur, 0.1, (t) => {
    const fc = 2600 + 900 * Math.sin(t * 38) + 500 * Math.sin(t * 91);
    const k = 1 - Math.exp((-TAU * fc) / SR);
    s1 += k * (rnd() * 2 - 1 - s1);
    return s1 * clamp(t / 0.02) * clamp((dur - t) / 0.04) * vel * (0.7 + 0.3 * Math.sin(t * 70));
  });
};
const highlighter = (b, t0, dur = 0.45, vel = 0.08) => noiseSweep(b, t0, dur, 1400, 2600, vel, -0.1);
const stamp = (b, t0) => {
  kick(b, t0, 0.55);
  noiseSweep(b, t0, 0.06, 4000, 1500, 0.35);
};
const pop = (b, t0, vel = 0.14) => each(b, t0, 0.12, 0, (t) => Math.sin(TAU * (520 + 900 * Math.exp(-t * 40)) * t) * Math.exp(-t * 34) * vel);
const plink = (b, t0, vel = 0.06) => each(b, t0, 0.2, (rnd() - 0.5) * 0.8, (t) => Math.sin(TAU * (1900 + rnd() * 20) * t) * Math.exp(-t * 40) * vel);

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
const BEAT = 0.6;
const HOPE = sceneStart(18);
const QUIET_A = sceneStart(17);
const DRUMS_IN = sceneStart(2);
const DARK = [[45, [57, 60, 64, 67]], [41, [57, 60, 65, 69]], [48, [60, 64, 67, 71]], [43, [59, 62, 67, 71]]]; // Am7 F C G
const BRIGHT = [[48, [60, 64, 67, 72]], [43, [59, 62, 67, 74]], [45, [60, 64, 69, 72]], [41, [60, 65, 69, 72]]]; // C G Am F
const ARP = [0, 2, 1, 3, 2, 1, 3, 2];
for (let beat = 0, t = 0.2; t < DUR - 1.5; beat++, t += BEAT) {
  const bar = Math.floor(beat / 4);
  const hope = t >= HOPE;
  const quiet = t >= QUIET_A && t < HOPE;
  const [root, notes] = (hope ? BRIGHT : DARK)[Math.floor(bar / 2) % 4];
  if (beat % 8 === 0) {
    padChord(music, t, t + BEAT * 8 + 0.6, notes.map((n) => hz(n - 12)), quiet ? 0.07 : 0.1);
    sub(music, t, BEAT * 8, hz(root - 12), quiet ? 0.12 : 0.22);
  }
  if (quiet) {
    // estadísticas: solo un tic de reloj, muy respetuoso
    hat(music, t, 0.06, 0);
    continue;
  }
  for (let e = 0; e < 2; e++) {
    const k = ARP[(beat * 2 + e) % 8];
    const tt = t + e * (BEAT / 2);
    pluck(music, tt, hz(notes[k] + (hope && e === 1 ? 12 : 0)), (e === 0 ? 0.11 : 0.08) * (hope ? 1.1 : 1), (k - 1.5) * 0.3);
  }
  if (t >= DRUMS_IN) {
    if (beat % 2 === 0) kick(music, t, 0.32);
    for (let s = 0; s < 4; s++) hat(music, t + s * (BEAT / 4), s === 2 ? 0.11 : 0.05);
  }
}
// cartelas de capítulo: subida + impacto
for (const id of [3, 8, 12, 18]) {
  const t0 = sceneStart(id);
  noiseSweep(music, t0 - 1.0, 1.0, 300, 6000, 0.22);
  boom(music, t0, 0.6);
}
reverb(music, {room: 0.75, wet: 0.22});
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = clamp(t / 0.6) * clamp((DUR - t) / 3);
  music.L[i] *= g;
  music.R[i] *= g;
}
writeWav(music, '../out/vox-music.wav', 0.8);

// ─────────────── efectos ───────────────
const fx = bus();
for (const sc of plan.scenes.slice(1)) {
  if (sc.in === 'whip') noiseSweep(fx, sc.start - 0.08, 0.42, 900, 7000, 0.35, 0.3);
  if (sc.in === 'zoom') noiseSweep(fx, sc.start - 0.1, 0.5, 4000, 400, 0.3);
  if (sc.in === 'swipe') noiseSweep(fx, sc.start - 0.05, 0.4, 1500, 5000, 0.25, -0.3);
}
// máquina de escribir
[
  [0.6, 1.2, 18],
  [W(12, 'necesidad') - 0.1, 1.0, 34],
  [W(16, 'oportunidades') - 0.2, 0.8, 21],
  [W(18, 'cima') - 0.3, 0.8, 28],
  [W(19, 'mismo lugar') - 0.4, 0.9, 33],
  [W(21, 'misma regla') - 0.1, 0.5, 13],
  [W(21, 'misma regla') + 0.3, 0.5, 11],
  [W(28, 'una sociedad'), 0.9, 22],
  [W(35, 'repetir'), 0.8, 24],
  [W(35, 'repetir') + 0.7, 0.6, 18],
  [sceneStart(15) + 0.2, 0.6, 10],
  [sceneStart(16) + 0.6, 0.6, 9],
  [W(41, 'mala suerte') - 0.6, 0.5, 13],
  [W(41, 'mala suerte') - 0.1, 0.5, 13],
  [S(47) - 0.2, 1.4, 60],
  [S(52) + 0.2, 1.0, 22],
  [S(53) + 0.5, 0.9, 18],
  [sceneStart(19) + 0.15, 0.8, 16],
  [sceneStart(20) + 0.15, 0.8, 29],
  [sceneStart(21) + 0.15, 0.8, 18],
].forEach(([t0, d, n]) => typing(fx, t0, d, n));
// rotulador
[
  [W(3, 'veredicto') + 0.05, 0.35],
  [W(3, 'veredicto') + 0.9, 0.6],
  [S(5), 1.0],
  [W(11, 'frivolidad') + 0.9, 0.3],
  [W(11, 'frivolidad') + 1.2, 0.3],
  [W(13, 'vecino') + 0.6, 0.7],
  [W(13, 'amigo') + 0.6, 0.7],
  [W(13, 'compañero') + 0.6, 0.7],
  [W(17, 'fallamos') + 0.2, 0.4],
  [W(29, 'justas'), 0.6],
  [W(33, 'responsables') + 0.4, 0.6],
  [W(35, 'no se corrigen') + 0.2, 0.5],
  [sceneStart(16) + 2.2, 0.4],
  [W(42, 'posición'), 0.6],
  [W(42, 'carácter') - 0.6, 0.5],
  [W(50, 'empatía'), 0.5],
  [W(50, 'familiar'), 0.5],
  [W(52, 'currículum'), 0.5],
  [W(54, '¿a') + 0.5, 0.4],
].forEach(([t0, d]) => marker(fx, t0, d));
// subrayador
[S(1), W(2, 'conocerte'), W(7, 'juicio'), W(7, 'humillación'), W(10, 'amor') + 0.3, W(12, 'necesidad') + 0.4, W(14, '¡podemos'), W(21, 'desigualdades'), W(28, 'insatisfacción'), W(32, 'merecen'), W(33, 'responsables') - 0.2, W(36, 'privilegios'), W(38, 'desafortunados') + 0.3, S(47) + 0.4].forEach((t0) => highlighter(fx, t0));
// sellos
[W(37, 'merece'), W(39, 'perdedores'), W(42, 'veredicto')].forEach((t0) => stamp(fx, t0));
// notas adhesivas e iconos
[0, 1, 2].forEach((i) => pop(fx, W(9, 'recompensas') + 0.1 + i * 0.4));
[W(36, 'esforzarse'), W(36, 'listo'), W(20, 'educación') - 0.1, W(20, 'salud') - 0.1, W(20, 'estabilidad') - 0.1].forEach((t0) => pop(fx, t0));
[W(57, 'comentarios'), W(57, 'like'), W(57, 'suscribirte')].forEach((t0) => pop(fx, t0 - 0.15, 0.2));
// máquina de Galton: cada bola que cae en su casillero
const g0 = sceneStart(19) + 0.9;
for (let i = 0; i < 64; i++) plink(fx, g0 + i * 0.14 + 10 * 0.11, 0.05);
reverb(fx, {room: 0.45, wet: 0.15});
writeWav(fx, '../out/vox-sfx.wav', 0.7);
console.log('vox-music.wav y vox-sfx.wav listos');
