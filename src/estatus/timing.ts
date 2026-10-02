import cues from './cues.json';
import plan from './plan.json';

export const FPS = plan.fps;
export const DURATION = plan.duration;
export const SCENES = plan.scenes;

// Inicio / fin de la frase i de la narración (segundos)
export const S = (i: number) => cues[i].start;
export const E = (i: number) => cues[i].end;

// Momento aproximado en que se pronuncia `word` dentro de la frase i (interpolación por caracteres)
export const W = (i: number, word: string) => {
  const c = cues[i];
  const k = c.text.toLowerCase().indexOf(word.toLowerCase());
  if (k < 0) throw new Error(`Palabra "${word}" no está en la frase ${i}`);
  return c.start + (c.end - c.start) * (k / c.text.length);
};
