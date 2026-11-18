// Banda sonora y efectos de «La trampa de la pobreza de lujo», sintetizados desde cero (sin samples ni música con derechos).
// Lee src/lujo/plan.json: la columna «Efectos de sonido» del guion técnico dispara los efectos de cada escena
// y la columna «Música» decide el estilo de la cama musical y los silencios.
// Uso: node scripts/lujo-audio.mjs  → out/lujo-music.wav + out/lujo-sfx.wav
import fs from 'node:fs';

const plan = JSON.parse(fs.readFileSync(new URL('../src/lujo/plan.json', import.meta.url)));
const SR = 44100;
const DUR = plan.duration;
const N = Math.ceil(SR * DUR);
const TAU = Math.PI * 2;
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


// ─────────────── efectos extra ───────────────
const kaching = (b, t0, vel = 0.2) => {
  bandNoise(b, t0, 0.12, 3000, vel * 0.8, 30);
  ding(b, t0 + 0.05, 2093, vel * 0.6, 0.2, 0.5);
  ding(b, t0 + 0.12, 2637, vel * 0.6, -0.2, 0.7);
};
const shimmer = (b, t0, vel = 0.1) => {
  for (let k = 0; k < 7; k++) ding(b, t0 + k * 0.045, 2400 + rnd() * 2600, vel * 0.5, rnd() * 1.4 - 0.7, 0.35);
};
const scratch = (b, t0, vel = 0.25) => {
  sweep(b, t0, 0.18, 1800, 300, vel);
  noiseHP(b, t0, 0.22, vel * 0.5, 12);
};
const heartbeat = (b, t0, vel = 0.5) => {
  thump(b, t0, vel);
  thump(b, t0 + 0.22, vel * 0.7);
};
const stampFx = (b, t0, vel = 0.4) => {
  thump(b, t0, vel);
  bandNoise(b, t0, 0.12, 900, vel * 0.5, 30);
};
const bell = (b, t0, vel = 0.12) => {
  ding(b, t0, 1318, vel, 0.3, 0.8);
  ding(b, t0 + 0.09, 1760, vel * 0.8, -0.3, 0.8);
};
const crickets = (b, t0, vel = 0.05) => {
  for (let k = 0; k < 6; k++) for (let j = 0; j < 3; j++) beep(b, t0 + k * 0.38 + j * 0.035, 4200, 0.018, vel);
};
const buzzer = (b, t0, vel = 0.12) => beep(b, t0, 140, 0.35, vel);
const boing = (b, t0, vel = 0.15) => sweep(b, t0, 0.35, 220, 900, vel);
const wind = (b, t0, dur = 2.5, vel = 0.12) => bandNoise(b, t0, dur, 500, vel, 0.6);
const steps = (b, t0, n = 4, vel = 0.12) => {
  for (let k = 0; k < n; k++) bandNoise(b, t0 + k * 0.42, 0.08, 700, vel, 40, k % 2 ? 0.3 : -0.3);
};
const typewriter = (b, t0, n = 8, vel = 0.1) => {
  for (let k = 0; k < n; k++) tick(b, t0 + k * 0.09 + rnd() * 0.03, vel);
  ding(b, t0 + n * 0.1, 3000, vel * 0.5, 0, 0.3);
};
const paper = (b, t0, vel = 0.08) => noiseHP(b, t0, 0.25, vel, 14);
const notifs = (b, t0, n = 14, vel = 0.08) => {
  for (let k = 0; k < n; k++) pop(b, t0 + Math.pow(k / n, 0.7) * 2.6, vel, 900 + rnd() * 500, rnd() * 1.6 - 0.8);
};
const vibrate = (b, t0, vel = 0.12) => {
  for (let k = 0; k < 2; k++) each(b, t0 + k * 0.3, 0.2, 0, (t) => Math.sin(TAU * 150 * t) * Math.sign(Math.sin(TAU * 30 * t)) * vel);
};
const drops = (b, t0, n = 6, vel = 0.08) => {
  for (let k = 0; k < n; k++) pop(b, t0 + k * 0.35 + rnd() * 0.1, vel, 1400 + rnd() * 600);
};
const lock = (b, t0, vel = 0.2) => {
  tick(b, t0, vel);
  thump(b, t0 + 0.04, vel);
  ding(b, t0 + 0.04, 3500, vel * 0.3, 0, 0.15);
};
const chains = (b, t0, vel = 0.1) => {
  for (let k = 0; k < 6; k++) ding(b, t0 + k * 0.07 + rnd() * 0.04, 1800 + rnd() * 1500, vel, rnd() - 0.5, 0.12);
};
const shutter = (b, t0, vel = 0.15) => {
  tick(b, t0, vel);
  noiseHP(b, t0 + 0.05, 0.06, vel, 60);
};
const hum = (b, t0, dur = 1.5, vel = 0.05) => each(b, t0, dur, 0, (t) => (Math.sin(TAU * 120 * t) + 0.4 * Math.sin(TAU * 240 * t)) * vel * clamp(t / 0.2) * clamp((dur - t) / 0.3));
const coins = (b, t0, vel = 0.08) => {
  for (let k = 0; k < 5; k++) ding(b, t0 + k * 0.08, 2600 + rnd() * 800, vel, rnd() - 0.5, 0.25);
};

// palabra clave → efecto (en el orden en que aparecen en la columna)
const RULES = [
  [/impacto grande/, (t) => { slam(fx, t, 0.6); boom(fx, t, 0.3); }],
  [/impacto grave|golpe/, (t) => slam(fx, t, 0.45)],
  [/impacto/, (t) => slam(fx, t, 0.35)],
  [/ka-?ching|caja registradora/, (t) => kaching(fx, t)],
  [/whoosh invertido/, (t) => whoosh(fx, t, 0.45, 0.25, false)],
  [/whoosh grave/, (t) => whoosh(fx, t, 0.6, 0.3, false)],
  [/whoosh/, (t) => whoosh(fx, t, 0.4, 0.25, true)],
  [/riser/, (t) => riser(fx, t, 0.9, 0.18)],
  [/glitch/, (t) => glitch(fx, t, 0.35, 0.22)],
  [/record scratch|rewind|rebobin|vinyl stop/, (t) => scratch(fx, t)],
  [/ding grave/, (t) => ding(fx, t, 392, 0.22, 0, 2.2)],
  [/ding de revelación|"ding"/, (t) => ding(fx, t, 784, 0.18, 0, 1.8)],
  [/ding positivo/, (t) => { ding(fx, t, 1047, 0.14); ding(fx, t + 0.12, 1568, 0.12); }],
  [/dings? suaves?|ding/, (t) => ding(fx, t, 1568, 0.11)],
  [/sparkle|shimmer|brillo/, (t) => shimmer(fx, t)],
  [/latido/, (t) => heartbeat(fx, t)],
  [/sello/, (t) => stampFx(fx, t)],
  [/vidrio|shatter/, (t) => shatter(fx, t, 0.28)],
  [/crack/, (t) => shatter(fx, t, 0.15)],
  [/campanita|campana/, (t) => bell(fx, t)],
  [/grillos/, (t) => crickets(fx, t)],
  [/buzzer|error/, (t) => buzzer(fx, t)],
  [/boing/, (t) => boing(fx, t)],
  [/viento|ventisca/, (t) => wind(fx, t)],
  [/pasos/, (t) => steps(fx, t)],
  [/máquina de escribir/, (t) => typewriter(fx, t)],
  [/máquina de coser/, (t) => typewriter(fx, t, 14, 0.06)],
  [/papel|página|pluma|hoja/, (t) => paper(fx, t)],
  [/notificaciones/, (t) => notifs(fx, t)],
  [/vibración/, (t) => vibrate(fx, t)],
  [/goteo/, (t) => drops(fx, t)],
  [/candado/, (t) => lock(fx, t)],
  [/cadenas|bisagra/, (t) => chains(fx, t)],
  [/obturador|clic de cámara/, (t) => shutter(fx, t)],
  [/zumbido|neón/, (t) => hum(fx, t)],
  [/monedas/, (t) => coins(fx, t)],
  [/números rodando|ticks rápidos/, (t) => { for (let k = 0; k < 16; k++) tick(fx, t + k * 0.12, 0.07); }],
  [/tic-tac|tick|"tic"|tic de reloj/, (t) => { tick(fx, t, 0.1); tick(fx, t + 0.5, 0.08); }],
  [/clicks?|clic/, (t) => { tick(fx, t, 0.12); pop(fx, t, 0.08, 1200); }],
  [/pop/, (t) => pop(fx, t, 0.16)],
  [/beep/, (t) => beep(fx, t, 880, 0.12, 0.06)],
  [/sizzle/, (t) => noiseHP(fx, t, 0.8, 0.06, 2)],
  [/murmull|abuche/, (t) => bandNoise(fx, t, 1.5, 300, 0.1, 1)],
  [/burbujas|olas|ambiente|motor|eco/, (t) => bandNoise(fx, t, 2.0, 400, 0.06, 0.5)],
  [/swap|intercambio|gulp|squeak|hmph|risita|caída|caer/, (t) => pop(fx, t, 0.12, 500)],
];

const fx = bus();
let nfx = 0;
for (const sc of plan.scenes) {
  const txt = (sc.sfx || '').toLowerCase();
  if (!txt || txt === '—') continue;
  const ats = [...new Set((sc.els || []).map((e) => e.at).filter((a) => typeof a === 'number' && a >= 0))].sort((a, b) => a - b);
  const tokens = txt.split(/\s\+\s|·|→|,/).map((s) => s.trim()).filter(Boolean);
  tokens.forEach((tok, i) => {
    const rep = Number((tok.match(/[×x]\s?(\d)/) || [])[1] || 1);
    for (const [re, fn] of RULES) {
      if (re.test(tok)) {
        const base = sc.start + (ats[i] ?? ats[0] ?? 0) + (ats[i] == null && i > 0 ? i * 0.22 : 0.02);
        for (let r = 0; r < rep; r++) fn(Math.min(base + r * 0.3, sc.end - 0.05));
        nfx++;
        break;
      }
    }
  });
}

// ─────────────── música ───────────────
const STYLE = (n) => {
  if (n <= 24) return 'tension';
  if (n <= 75) return 'curious';
  if (n >= 110 && n <= 115) return 'emotional';
  if (n <= 115) return 'tense';
  if (n <= 133) return 'fast';
  if (n <= 149) return 'minimal';
  if (n <= 158) return 'piano';
  if (n <= 173) return 'tension';
  if (n <= 177) return 'emotional';
  if (n <= 187) return 'piano';
  if (n <= 192) return 'hopeful';
  if (n <= 212) return 'bright';
  return 'outro';
};
const BPM = {tension: 80, curious: 100, tense: 96, emotional: 70, fast: 120, minimal: 90, piano: 70, hopeful: 84, bright: 104, outro: 104, lounge: 84};
const DARK = [[38, [50, 53, 57, 62]], [34, [50, 53, 58, 62]], [41, [48, 53, 57, 60]], [36, [48, 52, 55, 60]]];
const BRIGHT = [[41, [53, 57, 60, 65]], [36, [52, 55, 60, 64]], [38, [53, 57, 62, 65]], [34, [53, 58, 62, 65]]];
const LOUNGE = [[41, [52, 57, 60, 64]], [40, [50, 55, 59, 62]], [38, [53, 57, 60, 64]], [43, [53, 57, 59, 62]]];

// estado por escena a partir de la columna «Música»: lounge / silencio / cama
const mode = [];
let cur = 'bed';
for (const sc of plan.scenes) {
  const m = (sc.mus || '').toLowerCase();
  let silFirst = 0;
  if (/lounge/.test(m) && !/se corta/.test(m)) cur = 'lounge';
  else if (/silencio|stop|corte a negro/.test(m)) {
    if (/silencio\s*→/.test(m) || /silencio de 1 s/.test(m)) { silFirst = 1.4; cur = 'bed'; }
    else cur = 'silent';
  } else if (m && m !== '↳' && m !== '—') cur = 'bed';
  mode.push({cur, silFirst});
}
const sceneAt = (t) => {
  let lo = 0, hi = plan.scenes.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (plan.scenes[mid].start <= t) lo = mid;
    else hi = mid - 1;
  }
  return lo;
};

const music = bus();
let t = 0, step = 0;
while (t < DUR) {
  const i = sceneAt(t);
  const sc = plan.scenes[i];
  const md = mode[i];
  const style = md.cur === 'lounge' ? 'lounge' : STYLE(sc.n);
  const beat = 60 / BPM[style];
  const s16 = beat / 4;
  const silent = md.cur === 'silent' || t - sc.start < md.silFirst;
  const k = step % 16; // posición en el compás (16 semicorcheas)
  const bar = Math.floor(step / 16);
  const prog = ['bright', 'hopeful', 'outro'].includes(style) ? BRIGHT : style === 'lounge' ? LOUNGE : DARK;
  const [root, ch] = prog[bar % 4];
  if (!silent) {
    if (k === 0) {
      const padVel = {tension: 0.22, curious: 0.12, tense: 0.2, emotional: 0.3, fast: 0.14, minimal: 0.18, piano: 0.2, hopeful: 0.26, bright: 0.2, outro: 0.18, lounge: 0.12}[style];
      pad(music, t, t + beat * 4 + 0.4, ch.map((m) => hz(m - (style === 'tension' ? 12 : 0))), padVel);
    }
    if (style === 'tension') {
      if (k % 4 === 0) subPulse(music, t, hz(root), 0.35);
      if (k === 8) thump(music, t, 0.2);
      if (k % 4 === 2) hat(music, t, 0.03);
    } else if (style === 'curious') {
      if (k % 2 === 0) pluck(music, t, hz(ch[[0, 2, 1, 3, 2, 1, 3, 0][(k / 2) % 8]] + 12), 0.12, (k % 4 ? 0.4 : -0.4));
      if (k === 0 || k === 8) kick(music, t, 0.28);
      if (k % 4 === 0) subPulse(music, t, hz(root), 0.25);
    } else if (style === 'tense') {
      if (k === 0 || k === 8 || k === 10) kick(music, t, 0.4);
      if (k === 4 || k === 12) clap(music, t, 0.12);
      if (k % 2 === 0) hat(music, t, 0.04);
      if (k % 4 === 0) subPulse(music, t, hz(root), 0.3);
    } else if (style === 'fast') {
      if (k % 4 === 0) kick(music, t, 0.32);
      hat(music, t, k % 2 ? 0.025 : 0.045);
      if (k === 6 || k === 14) pluck(music, t, hz(ch[3] + 12), 0.1, 0.3);
      if (k % 4 === 0) subPulse(music, t, hz(root), 0.25);
    } else if (style === 'minimal') {
      if (k % 4 === 0) tick(music, t, k % 8 === 0 ? 0.08 : 0.05);
      if (k === 0) subPulse(music, t, hz(root), 0.22);
    } else if (style === 'piano' || style === 'emotional') {
      if (k % 4 === 0) ding(music, t, hz(ch[(k / 4 + bar) % 4] + 12), style === 'piano' ? 0.1 : 0.07, 0, 1.6);
      if (k === 0) ding(music, t, hz(root + 12), 0.08, 0, 2.4);
    } else if (style === 'hopeful') {
      if (k % 2 === 0) ding(music, t, hz(ch[[0, 1, 2, 3, 2, 1, 2, 3][(k / 2) % 8]] + 12), 0.08, (k % 4 ? 0.3 : -0.3), 1.2);
      if (k === 0) ding(music, t, hz(root + 12), 0.08, 0, 2.4);
    } else if (style === 'bright' || style === 'outro') {
      if (k % 4 === 0) kick(music, t, 0.36);
      if (k === 4 || k === 12) clap(music, t, 0.13);
      if (k % 2 === 1) hat(music, t, 0.035);
      if (k % 2 === 0) pluck(music, t, hz(ch[[0, 2, 3, 1, 2, 3, 1, 2][(k / 2) % 8]] + 12), 0.1, (k % 4 ? 0.4 : -0.4));
      if (k % 4 === 0) subPulse(music, t, hz(root), 0.28);
    } else if (style === 'lounge') {
      if (k === 0 || k === 6 || k === 10) ch.forEach((m, j) => ding(music, t + j * 0.012, hz(m), 0.035, j % 2 ? 0.3 : -0.3, 0.7));
      if (k % 4 === 2) noiseHP(music, t, 0.08, 0.02, 60, 0.4);
      if (k === 0 || k === 8) subPulse(music, t, hz(root), 0.18);
    }
  }
  t += s16;
  step++;
}
// envolvente: silencios marcados, entradas suaves y fade final
const env = new Float32Array(N);
let g = 0;
for (let n = 0; n < N; n++) {
  const tt = n / SR;
  const i = sceneAt(tt);
  const sc = plan.scenes[i];
  const md = mode[i];
  const silent = md.cur === 'silent' || tt - sc.start < md.silFirst;
  const lounge = md.cur === 'lounge';
  let target = silent ? 0 : lounge ? 0.7 : 1;
  target *= clamp((DUR - tt) / 6);
  const rate = target < g ? 1 / (0.04 * SR) : 1 / (0.5 * SR);
  g += clamp(target - g, -rate, rate);
  env[n] = g;
}
for (let n = 0; n < N; n++) {
  music.L[n] *= env[n];
  music.R[n] *= env[n];
}
reverb(music, {room: 0.75, damp: 0.5, wet: 0.22});
reverb(fx, {room: 0.6, damp: 0.5, wet: 0.12});
writeWav(music, '../out/lujo-music.wav', 0.85);
writeWav(fx, '../out/lujo-sfx.wav', 0.9);
console.log(`listo: ${nfx} efectos, ${DUR.toFixed(1)} s`);
