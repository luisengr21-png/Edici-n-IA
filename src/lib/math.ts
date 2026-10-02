export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
// Rango normalizado 0..1 entre dos fotogramas
export const prog = (f: number, a: number, b: number) => clamp((f - a) / (b - a));
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t * t;
export const TAU = Math.PI * 2;

// Latido "lub-dub": misma curva que usa el sintetizador de audio
export const heartbeat = (t: number, first: number, period: number, until = Infinity) => {
  if (t < first || t > until + 0.6) return 0;
  const x = (t - first) % period;
  const p = (u: number) => (u < 0 ? 0 : Math.exp(-u * 9) * (1 - Math.exp(-u * 80)));
  return p(x) + 0.6 * p(x - 0.22);
};
