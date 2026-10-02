// Banda sonora generativa de «Lo que la noche sabe».
// Todo se sintetiza aquí (sin samples): drones, piano, celesta, latidos, tics, glitches y campana.
// Lee src/timeline.json para que cada sonido caiga en el fotograma exacto del video.
import fs from 'node:fs';

const tl = JSON.parse(fs.readFileSync(new URL('../src/timeline.json', import.meta.url)));
const SR = 44100;
const DUR = tl.durationInFrames / tl.fps;
const N = Math.ceil(SR * DUR);
const TAU = Math.PI * 2;
const EV = tl.events;

const seqFrom = (id) => {
  const s = tl.scenes.find((x) => x.id === id);
  return s.start - (s.fadeIn ? tl.overlap : 0);
};
const at = (id, local) => (seqFrom(id) + local) / tl.fps; // fotograma local -> segundos globales

let seed = 7;
const rnd = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
const bus = () => ({L: new Float32Array(N), R: new Float32Array(N)});
const music = bus(); // pads, piano, celesta, campanas -> reverb larga
const fx = bus(); // tics, glitches, notificaciones -> reverb corta
const body = bus(); // latidos, sub-graves -> casi seco

const gains = (pan) => [Math.cos(((pan + 1) * Math.PI) / 4), Math.sin(((pan + 1) * Math.PI) / 4)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// ---------- instrumentos ----------
function pad(b, t0, t1, freqs, amp, {attack = 3, release = 3, bright = 0.3, trem = 0, spread = 0.6} = {}) {
  const i0 = Math.max(0, Math.floor(t0 * SR));
  const i1 = Math.min(N, Math.floor(t1 * SR));
  const norm = amp / Math.sqrt(freqs.length) / 3;
  freqs.forEach((f, k) => {
    const lfoPh = rnd() * TAU;
    for (const det of [-0.0019, 0, 0.0023]) {
      const pan = clamp((k % 2 ? 1 : -1) * spread * (0.3 + rnd() * 0.7) + det * 100, -1, 1);
      const [gl, gr] = gains(pan);
      const w = (TAU * f * (1 + det)) / SR;
      let ph = rnd() * TAU;
      for (let i = i0; i < i1; i++) {
        const t = i / SR;
        const a = clamp((t - t0) / attack);
        const r = clamp((t1 - t) / release);
        const env = a * a * (3 - 2 * a) * r * r * (3 - 2 * r);
        const lfo = 1 + 0.25 * Math.sin(TAU * 0.07 * (k + 1) * t + lfoPh);
        const tr = trem ? 1 - trem * 0.5 * (1 + Math.sin(TAU * 5.5 * t + k)) : 1;
        const s = Math.sin(ph) + bright * 0.5 * Math.sin(2 * ph) + bright * 0.22 * Math.sin(3 * ph);
        const v = s * env * lfo * tr * norm;
        b.L[i] += v * gl;
        b.R[i] += v * gr;
        ph += w;
      }
    }
  });
}

function piano(b, t0, f, vel, pan = 0) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  const len = Math.floor(5 * SR);
  const B = 0.00035;
  for (let n = 1; n <= 10; n++) {
    const fn = n * f * Math.sqrt(1 + B * n * n);
    if (fn > SR / 2.3) break;
    const an = vel / Math.pow(n, 1.35);
    const dn = 0.7 + n * 0.45;
    const w = (TAU * fn) / SR;
    for (let j = 0; j < len; j++) {
      const i = i0 + j;
      if (i >= N) break;
      const t = j / SR;
      const v = Math.sin(w * j) * an * Math.exp(-t * dn) * (1 - Math.exp(-t * 250));
      b.L[i] += v * gl;
      b.R[i] += v * gr;
    }
  }
}

function bell(b, t0, f, vel, pan = 0, decay = 1.6) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  const parts = [[1, 1, 1], [2.0, 0.22, 1.4], [3.01, 0.1, 2], [4.16, 0.16, 4.5], [5.43, 0.06, 6]];
  const len = Math.floor(decay * 4 * SR);
  for (const [ratio, a, dk] of parts) {
    const w = (TAU * f * ratio) / SR;
    for (let j = 0; j < len; j++) {
      const i = i0 + j;
      if (i >= N) break;
      const t = j / SR;
      const v = Math.sin(w * j) * a * vel * Math.exp((-t * dk) / decay) * (1 - Math.exp(-t * 600));
      b.L[i] += v * gl;
      b.R[i] += v * gr;
    }
  }
}

function fmBell(b, t0, fc, vel, pan = 0, decay = 3.5) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  const len = Math.floor(decay * 3 * SR);
  for (let j = 0; j < len; j++) {
    const i = i0 + j;
    if (i >= N) break;
    const t = j / SR;
    const idx = 5 * Math.exp(-t * 2.2);
    const v = Math.sin(TAU * fc * t + idx * Math.sin(TAU * fc * 1.4 * t)) * vel * Math.exp(-t / decay) * (1 - Math.exp(-t * 400));
    b.L[i] += v * gl;
    b.R[i] += v * gr;
  }
}

function thump(b, t0, amp) {
  const i0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let j = 0; j < 0.4 * SR; j++) {
    const i = i0 + j;
    if (i < 0 || i >= N) continue;
    const t = j / SR;
    ph += (TAU * (38 + 48 * Math.exp(-t * 26))) / SR;
    const v = Math.sin(ph) * (1 - Math.exp(-t * 300)) * Math.exp(-t * 13) * amp;
    b.L[i] += v * 0.707;
    b.R[i] += v * 0.707;
  }
}
const heart = (b, t0, amp) => {
  thump(b, t0, amp);
  thump(b, t0 + 0.22, amp * 0.62);
};

function tick(b, t0, amp, pitch, pan = 0) {
  const [gl, gr] = gains(pan);
  const i0 = Math.floor(t0 * SR);
  let prev = 0;
  for (let j = 0; j < 0.12 * SR; j++) {
    const i = i0 + j;
    if (i >= N) break;
    const t = j / SR;
    const nz = rnd() * 2 - 1;
    const hp = nz - prev;
    prev = nz;
    const v = (hp * 0.5 * Math.exp(-t * 700) + Math.sin(TAU * pitch * t) * 0.6 * Math.exp(-t * 90) + Math.sin(TAU * pitch * 1.51 * t) * 0.25 * Math.exp(-t * 150)) * amp;
    b.L[i] += v * gl;
    b.R[i] += v * gr;
  }
}

function noiseSweep(b, t0, t1, fStart, fEnd, amp) {
  const i0 = Math.floor(t0 * SR);
  const i1 = Math.min(N, Math.floor(t1 * SR));
  const st = [0, 0, 0, 0];
  for (let i = i0; i < i1; i++) {
    const u = (i - i0) / (i1 - i0);
    const fc = fStart * Math.pow(fEnd / fStart, u);
    const a = 1 - Math.exp((-TAU * fc) / SR);
    const env = Math.pow(Math.sin(Math.PI * u), 0.8) * amp;
    const nl = rnd() * 2 - 1;
    const nr = rnd() * 2 - 1;
    st[0] += a * (nl - st[0]);
    st[1] += a * (st[0] - st[1]);
    st[2] += a * (nr - st[2]);
    st[3] += a * (st[2] - st[3]);
    b.L[i] += st[1] * env;
    b.R[i] += st[3] * env;
  }
}

function sweepTone(b, t0, dur, f0, f1, amp, vib = 0) {
  const i0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let j = 0; j < dur * SR; j++) {
    const i = i0 + j;
    if (i >= N) break;
    const u = j / (dur * SR);
    const f = f0 * Math.pow(f1 / f0, u) * (1 + vib * Math.sin(TAU * 0.8 * (j / SR)));
    ph += (TAU * f) / SR;
    const env = Math.sin(Math.PI * u) ** 1.5 * amp;
    const v = (Math.sin(ph) + 0.3 * Math.sin(2 * ph)) * env;
    b.L[i] += v * 0.707;
    b.R[i] += v * 0.707;
  }
}

function digitalBurst(b, t0, dur, amp) {
  const i0 = Math.floor(t0 * SR);
  let hold = 0;
  let val = 0;
  for (let j = 0; j < dur * SR; j++) {
    const i = i0 + j;
    if (i >= N) break;
    if (hold-- <= 0) {
      hold = 3 + Math.floor(rnd() * 40);
      val = Math.round((rnd() * 2 - 1) * 4) / 4;
    }
    const env = Math.min(1, j / 40) * Math.min(1, (dur * SR - j) / 80);
    const v = (val * 0.8 + Math.sin(TAU * 3200 * (j / SR)) * 0.2) * env * amp;
    b.L[i] += v * (0.6 + rnd() * 0.4);
    b.R[i] += v * (0.6 + rnd() * 0.4);
  }
}

function hum(b, t0, t1, amp) {
  const i0 = Math.floor(t0 * SR);
  const i1 = Math.min(N, Math.floor(t1 * SR));
  for (let i = i0; i < i1; i++) {
    const t = i / SR;
    const env = clamp((t - t0) / 0.05) * clamp((t1 - t) / 0.05);
    let s = 0;
    for (const [h, a] of [[1, 1], [2, 0.5], [3, 0.45], [5, 0.25], [7, 0.15], [9, 0.08]]) s += a * Math.sin(TAU * 50 * h * t);
    const v = s * amp * env * (0.85 + 0.15 * Math.sin(TAU * 0.5 * t));
    b.L[i] += v * 0.707;
    b.R[i] += v * 0.707;
  }
}

function reverseSwell(b, t0, t1, amp) {
  // ruido filtrado + campanas, invertido en el tiempo: inhala hacia el sueño REM
  const len = Math.floor((t1 - t0) * SR);
  const tmp = new Float32Array(len);
  let lp = 0;
  for (let j = 0; j < len; j++) {
    const t = j / SR;
    lp += 0.08 * (rnd() * 2 - 1 - lp);
    tmp[j] = (lp * 0.8 + 0.25 * Math.sin(TAU * 1760 * t) + 0.18 * Math.sin(TAU * 2637 * t)) * Math.exp(-t * 2.4);
  }
  const i0 = Math.floor(t0 * SR);
  for (let j = 0; j < len; j++) {
    const i = i0 + j;
    if (i >= N) break;
    const v = tmp[len - 1 - j] * amp;
    b.L[i] += v;
    b.R[i] += v;
  }
}

// filtro paso bajo biquad (niebla sobre el piano)
function lowpass(arr, fc, q = 0.707) {
  const w0 = (TAU * fc) / SR;
  const al = Math.sin(w0) / (2 * q);
  const c = Math.cos(w0);
  const a0 = 1 + al;
  const b0 = (1 - c) / 2 / a0;
  const b1 = (1 - c) / a0;
  const a1 = (-2 * c) / a0;
  const a2 = (1 - al) / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < arr.length; i++) {
    const x = arr[i];
    const y = b0 * x + b1 * x1 + b0 * x2 - a1 * y1 - a2 * y2;
    x2 = x1; x1 = x; y2 = y1; y1 = y;
    arr[i] = y;
  }
}

// Reverb tipo Freeverb (8 combs + 4 allpass por canal)
function reverb(b, {room = 0.85, damp = 0.35, wet = 0.35, dry = 1, width = 1}) {
  const combT = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617];
  const apT = [556, 441, 341, 225];
  const mk = (n) => ({buf: new Float32Array(n), i: 0, store: 0});
  const cL = combT.map((t) => mk(t)), cR = combT.map((t) => mk(t + 23));
  const aL = apT.map((t) => mk(t)), aR = apT.map((t) => mk(t + 23));
  const fb = room * 0.28 + 0.7;
  const d1 = damp * 0.4, d2 = 1 - d1;
  const wet1 = wet * (width / 2 + 0.5), wet2 = wet * ((1 - width) / 2);
  const outL = new Float32Array(N), outR = new Float32Array(N);
  const run = (combs, aps, input) => {
    let o = 0;
    for (const c of combs) {
      const y = c.buf[c.i];
      c.store = y * d2 + c.store * d1;
      c.buf[c.i] = input + c.store * fb;
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
    const input = (b.L[i] + b.R[i]) * 0.015;
    const oL = run(cL, aL, input);
    const oR = run(cR, aR, input);
    outL[i] = oL * wet1 + oR * wet2 + b.L[i] * dry;
    outR[i] = oR * wet1 + oL * wet2 + b.R[i] * dry;
  }
  return {L: outL, R: outR};
}

// ---------- partitura ----------
const hz = (m) => 440 * Math.pow(2, (m - 69) / 12);
const D2 = hz(38), A2 = hz(45), D3 = hz(50), F3 = hz(53), A3 = hz(57), D1 = hz(26);

// Escena 1-2: drone en Re menor, latido en reposo
pad(music, 0, 17.2, [D2, A2, D3, F3], 0.2, {attack: 4, release: 2.6, bright: 0.25});
for (let t = EV.heartbeat.first; t <= EV.heartbeat.until; t += EV.heartbeat.period) heart(body, t, 0.55 * clamp(0.4 + t / 4));

// Escena 2: piano lejano, entre niebla
const pianoBus = bus();
const S2 = at(2, 20);
[[0, 69, 0.5], [0, 50, 0.35], [0.9, 65, 0.42], [1.7, 74, 0.38], [2.9, 72, 0.4], [3.7, 69, 0.36], [4.8, 64, 0.34], [5.6, 65, 0.4], [5.6, 53, 0.25]].forEach(
  ([dt, m, v]) => piano(pianoBus, S2 + 0.3 + dt, hz(m), v, (rnd() - 0.5) * 0.8),
);
lowpass(pianoBus.L, 1900);
lowpass(pianoBus.R, 1900);
for (let i = 0; i < N; i++) {
  music.L[i] += pianoBus.L[i] * 0.55;
  music.R[i] += pianoBus.R[i] * 0.55;
}

// Escena 3: tics que se alargan hasta el silencio; el metal se derrite (glissando)
EV.clockTicks.forEach((tk, k) => tick(fx, at(3, tk), 0.32 + k * 0.03, 2800 * Math.pow(0.86, k), k % 2 ? 0.15 : -0.15));
sweepTone(music, at(3, 100), at(3, 222) - at(3, 100), 330, 98, 0.07, 0.015);

// Escena 4: inmersión — barrido de ruido, sub-grave descendente, latidos que se ralentizan
pad(music, 16.6, 28.6, [D2, A2, D3], 0.14, {attack: 3, release: 2.5, bright: 0.1});
noiseSweep(fx, at(4, 4), at(4, 250), 3200, 160, 0.55);
sweepTone(body, at(4, 10), 8, 72, 31, 0.22);
[20.6, 22.2, 24.1, 26.4].forEach((t, k) => heart(body, t, 0.5 - k * 0.07));

// Escena 5: Re menor 9 aéreo + celesta sincronizada con los destellos sinápticos
pad(music, 27.4, 37.2, [D3, A3, hz(64), hz(65), hz(72)], 0.11, {attack: 2.5, release: 2, bright: 0.15, spread: 0.9});
const CEL = [74, 77, 79, 81, 84, 86, 89, 81, 77, 84, 86, 89, 93];
EV.celesta.forEach((e, k) => bell(music, at(5, e), hz(CEL[k % CEL.length]), 0.16, (rnd() - 0.5) * 1.4, 1.3));

// Escena 6: inhalación invertida y acorde suspendido con brillo trémulo
reverseSwell(music, at(6, 20) - 1.6, at(6, 20), 0.35);
pad(music, at(6, 14), 43.0, [D3, hz(55), A3, hz(64), hz(69), hz(74)], 0.21, {attack: 2, release: 0.02, bright: 0.2, spread: 1});
pad(music, at(6, 30), 43.0, [hz(81), hz(86), hz(88)], 0.06, {attack: 3, release: 0.02, trem: 0.8, spread: 1});
[[1.4, 86], [2.6, 81], [3.9, 88], [5.2, 79]].forEach(([dt, m]) => bell(music, at(6, 20) + dt, hz(m), 0.12, (rnd() - 0.5) * 1.6, 2.2));

// Escena 7: el insomnio — zumbido eléctrico, glitches, notificaciones y corazón acelerado
const S7 = at(7, 0);
hum(fx, S7, at(7, EV.crtOff + 12), 0.05);
EV.glitches.forEach((g) => digitalBurst(fx, at(7, g), 1 / 30 + 0.02, 0.28));
EV.notifications.forEach((n, k) => {
  const pan = (k % 3) * 0.4 - 0.4;
  bell(fx, at(7, n), hz(91), 0.09, pan, 0.25);
  bell(fx, at(7, n) + 0.07, hz(96), 0.08, pan, 0.3);
});
for (let t = 43.4; t < 49.3; t += 0.55) heart(body, t, 0.42 + (t - 43.4) * 0.04);
sweepTone(fx, at(7, EV.crtOff), 0.4, 1400, 55, 0.22);

// Escena 8: amanecer en Re mayor
const S8 = at(8, 12);
pad(music, S8, 60, [D2, A2, D3, hz(54), A3, hz(62), hz(66)], 0.16, {attack: 3.5, release: 2.2, bright: 0.3, spread: 0.8});
[[0.8, 62, 0.3], [1.6, 66, 0.28], [2.4, 69, 0.3], [3.6, 74, 0.32], [4.8, 76, 0.28], [5.6, 78, 0.3]].forEach(([dt, m, v]) =>
  piano(music, S8 + dt, hz(m), v, (rnd() - 0.5) * 0.6),
);

// Escena 9: campana final
const S9 = at(9, EV.titleChime);
fmBell(music, S9, hz(74), 0.16, -0.3, 3.2);
fmBell(music, S9 + 0.04, hz(81), 0.11, 0.3, 3.0);
piano(music, S9, hz(38), 0.3, 0);

// ---------- mezcla ----------
const mWet = reverb(music, {room: 0.9, damp: 0.3, wet: 0.5, dry: 0.85});
const fWet = reverb(fx, {room: 0.6, damp: 0.5, wet: 0.22, dry: 1});
const bWet = reverb(body, {room: 0.5, damp: 0.6, wet: 0.12, dry: 1});

const cutA = 43.0; // corte seco del sueño REM
const cutB = at(8, 10);
const L = new Float32Array(N);
const R = new Float32Array(N);
let peak = 0;
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const gate = t < cutA ? 1 : t < cutB ? 0 : 1;
  const master = clamp((DUR - t) / 1.8) * clamp(t / 0.2);
  const silence = t > at(7, EV.crtOff + 13) && t < cutB ? 0 : 1;
  L[i] = (mWet.L[i] * gate + fWet.L[i] + bWet.L[i]) * master * silence;
  R[i] = (mWet.R[i] * gate + fWet.R[i] + bWet.R[i]) * master * silence;
  L[i] = Math.tanh(L[i] * 1.1);
  R[i] = Math.tanh(R[i] * 1.1);
  peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
}
const norm = 0.89 / peak;

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
  out.writeInt16LE(Math.round(clamp(L[i] * norm, -1, 1) * 32767), 44 + i * 4);
  out.writeInt16LE(Math.round(clamp(R[i] * norm, -1, 1) * 32767), 46 + i * 4);
}
fs.mkdirSync(new URL('../out/', import.meta.url), {recursive: true});
fs.writeFileSync(new URL('../out/audio.wav', import.meta.url), out);
console.log(`audio.wav: ${DUR.toFixed(2)} s, pico previo ${peak.toFixed(3)}`);
