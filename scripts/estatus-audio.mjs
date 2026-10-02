// Música y efectos para «Ansiedad por el estatus».
// Piano sobrio en La menor que se abre a Do mayor en «¿Cómo superarlo?», más efectos de papel, sellos y mazo.
// Lee las mismas marcas de tiempo que la animación (src/estatus/*.json).
import fs from 'node:fs';

const cues = JSON.parse(fs.readFileSync(new URL('../src/estatus/cues.json', import.meta.url)));
const plan = JSON.parse(fs.readFileSync(new URL('../src/estatus/plan.json', import.meta.url)));
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

let seed = 11;
const rnd = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const bus = () => ({L: new Float32Array(N), R: new Float32Array(N)});
const gains = (pan) => [Math.cos(((pan + 1) * Math.PI) / 4), Math.sin(((pan + 1) * Math.PI) / 4)];
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);

function piano(b, t0, f, vel, pan = 0, len = 4) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(len * SR);
  for (let h = 1; h <= 9; h++) {
    const fh = h * f * Math.sqrt(1 + 0.0004 * h * h);
    if (fh > SR / 2.3) break;
    const ah = vel / Math.pow(h, 1.5);
    const dh = 0.9 + h * 0.5;
    const w = (TAU * fh) / SR;
    for (let j = 0; j < n; j++) {
      const i = i0 + j;
      if (i >= N) break;
      const t = j / SR;
      const v = Math.sin(w * j) * ah * Math.exp(-t * dh) * (1 - Math.exp(-t * 180));
      b.L[i] += v * gl;
      b.R[i] += v * gr;
    }
  }
}

function pad(b, t0, t1, freqs, amp) {
  const i0 = Math.max(0, Math.floor(t0 * SR));
  const i1 = Math.min(N, Math.floor(t1 * SR));
  freqs.forEach((f, k) => {
    const [gl, gr] = gains(k % 2 ? 0.4 : -0.4);
    let ph = rnd() * TAU;
    const w = (TAU * f) / SR;
    for (let i = i0; i < i1; i++) {
      const t = i / SR;
      const env = clamp((t - t0) / 1.5) * clamp((t1 - t) / 1.5);
      const v = (Math.sin(ph) + 0.2 * Math.sin(2 * ph)) * env * amp / freqs.length;
      b.L[i] += v * gl;
      b.R[i] += v * gr;
      ph += w;
    }
  });
}

function noiseBurst(b, t0, dur, fStart, fEnd, amp, pan = 0) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  const n = Math.floor(dur * SR);
  let s1 = 0, s2 = 0;
  for (let j = 0; j < n; j++) {
    const i = i0 + j;
    if (i < 0 || i >= N) continue;
    const u = j / n;
    const fc = fStart * Math.pow(fEnd / fStart, u);
    const a = 1 - Math.exp((-TAU * fc) / SR);
    s1 += a * (rnd() * 2 - 1 - s1);
    s2 += a * (s1 - s2);
    const env = Math.sin(Math.PI * u) ** 1.5;
    b.L[i] += s2 * env * amp * gl;
    b.R[i] += s2 * env * amp * gr;
  }
}

function thud(b, t0, amp, f0 = 120, f1 = 50) {
  const i0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let j = 0; j < 0.35 * SR; j++) {
    const i = i0 + j;
    if (i >= N) break;
    const t = j / SR;
    ph += (TAU * (f1 + (f0 - f1) * Math.exp(-t * 30))) / SR;
    const v = (Math.sin(ph) * Math.exp(-t * 16) + (rnd() * 2 - 1) * Math.exp(-t * 90) * 0.5) * amp;
    b.L[i] += v * 0.7;
    b.R[i] += v * 0.7;
  }
}

function knock(b, t0, amp) {
  const i0 = Math.floor(t0 * SR);
  for (let j = 0; j < 0.18 * SR; j++) {
    const i = i0 + j;
    if (i >= N) break;
    const t = j / SR;
    const v = (Math.sin(TAU * 420 * t) * 0.6 + Math.sin(TAU * 910 * t) * 0.3 + (rnd() * 2 - 1) * 0.4 * Math.exp(-t * 200)) * Math.exp(-t * 32) * amp;
    b.L[i] += v * 0.7;
    b.R[i] += v * 0.7;
  }
}

function bell(b, t0, f, vel, pan = 0, decay = 2.5) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  for (const [r, a, d] of [[1, 1, 1], [2.0, 0.3, 1.6], [2.76, 0.2, 2.2], [5.4, 0.1, 4]]) {
    const w = (TAU * f * r) / SR;
    for (let j = 0; j < decay * 3 * SR; j++) {
      const i = i0 + j;
      if (i >= N) break;
      const t = j / SR;
      const v = Math.sin(w * j) * a * vel * Math.exp((-t * d) / decay) * (1 - Math.exp(-t * 500));
      b.L[i] += v * gl;
      b.R[i] += v * gr;
    }
  }
}

function reverb(b, {room = 0.85, damp = 0.4, wet = 0.3}) {
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
    const l = run(cL, aL, x), r = run(cR, aR, x);
    b.L[i] += l * wet;
    b.R[i] += r * wet;
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

// ─────────────── Música ───────────────
const music = bus();
const BAR = 3.2; // 75 bpm, 4/4
const HOPE = S(45) - 0.1; // «¿Cómo superarlo?»
const SOMBER_A = S(43) - 0.3; // las estadísticas: casi silencio
// acordes: [raíz grave, notas del arpegio]
const DARK = [
  [45, [57, 60, 64, 69]], // Am
  [41, [57, 60, 65, 69]], // F
  [38, [57, 62, 65, 69]], // Dm
  [40, [56, 59, 64, 68]], // E
];
const BRIGHT = [
  [48, [60, 64, 67, 72]], // C
  [43, [59, 62, 67, 71]], // G
  [45, [60, 64, 69, 72]], // Am
  [41, [60, 65, 69, 72]], // F
];
const pattern = [0, 1, 2, 3, 2, 1, 2, 3]; // corcheas sueltas, respirando
for (let bar = 0, t = 0.6; t < DUR - 2; bar++, t += BAR) {
  const hope = t >= HOPE;
  const somber = t >= SOMBER_A && t < HOPE;
  const prog = hope ? BRIGHT : DARK;
  const [root, notes] = prog[Math.floor(bar / 2) % 4];
  const vel = hope ? 0.16 : 0.13;
  piano(music, t, hz(root), vel * 1.3, 0, 5);
  if (bar % 2 === 0) piano(music, t, hz(root + 12), vel * 0.6, -0.2, 4);
  if (somber) {
    // solo una nota aguda, espaciada
    if (bar % 2 === 0) piano(music, t + 1.6, hz(notes[3] + 12), 0.07, 0.4, 5);
    continue;
  }
  pattern.forEach((k, j) => {
    if (j % 2 === 1 && rnd() < 0.45) return; // dejar aire
    piano(music, t + j * (BAR / 8) + (rnd() - 0.5) * 0.02, hz(notes[k] + (hope && j === 4 ? 12 : 0)), vel * (0.55 + rnd() * 0.25), (k - 1.5) * 0.25, 3.5);
  });
}
pad(music, 0, HOPE + 1, [hz(45), hz(52), hz(57)], 0.05);
pad(music, HOPE - 0.5, DUR, [hz(48), hz(55), hz(60), hz(64)], 0.05);
// «¿Cómo superarlo?»: campana luminosa
bell(music, HOPE + 0.2, hz(84), 0.12, 0.2, 3);
bell(music, HOPE + 0.25, hz(76), 0.1, -0.2, 3);
reverb(music, {room: 0.85, wet: 0.45});
// fundidos de entrada y salida
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const g = clamp(t / 2.5) * clamp((DUR - t) / 3);
  music.L[i] *= g;
  music.R[i] *= g;
}
writeWav(music, '../out/estatus-music.wav', 0.8);

// ─────────────── Efectos ───────────────
const fx = bus();
// papel que se desliza en cada transición
for (const sc of plan.scenes.slice(1)) {
  if (sc.in === 'slide' || sc.in === 'slideUp') noiseBurst(fx, sc.start - 0.05, 0.6, 5000, 1200, 0.22, 0.5);
  if (sc.in === 'iris' || sc.in === 'fade') noiseBurst(fx, sc.start, 0.8, 2500, 900, 0.1, 0);
}
// sellos de goma
for (const t of [W(3, 'veredicto') + 0.05, W(21, 'misma regla'), W(36, 'sistemas') + 0.4, W(37, 'merece'), W(39, 'perdedores'), W(42, 'veredicto')]) thud(fx, t, 0.5);
knock(fx, W(3, 'veredicto') - 0.02, 0.5);
thud(fx, W(21, 'ignorar'), 0.35, 400, 120); // pistola de salida (pop de papel)
noiseBurst(fx, W(21, 'ignorar'), 0.12, 6000, 3000, 0.4);
// aplauso lejano
for (let k = 0; k < 60; k++) {
  const t = W(10, 'rara vez') + 0.4 + rnd() * 3.2;
  noiseBurst(fx, t, 0.03, 3000, 2500, 0.12, rnd() * 1.6 - 0.8);
}
// bocadillos que aparecen: pequeño «plop»
for (const t of [S(1) - 0.15, W(54, '¿a') - 0.7, W(35, 'repetir') - 0.1, W(41, 'mala suerte') - 0.4]) bell(fx, t, 880, 0.05, 0.2, 0.15);
// engranajes: tic-tac mecánico
for (let t = W(35, 'no se corrigen'); t < S(37) - 0.3; t += 0.25) knock(fx, t, 0.06);
// iconos finales
bell(fx, W(57, 'suscribirte') + 0.3, hz(88), 0.12, 0.3, 1.5);
bell(fx, W(57, 'suscribirte') + 0.45, hz(84), 0.1, 0.3, 1.5);
reverb(fx, {room: 0.5, wet: 0.2});
writeWav(fx, '../out/estatus-sfx.wav', 0.7);
console.log('estatus-music.wav y estatus-sfx.wav listos');
