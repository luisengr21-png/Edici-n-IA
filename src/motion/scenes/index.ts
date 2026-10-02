import React from 'react';
import {Equation, Iceberg, Interest, Mother, Opening, Scanner, SceneProps} from './A';
import {Books, Funnel, Merit, PhoneLove, Promise, Race} from './B';
import {Behind, Fortune, HowTitle, Stairs, System, Verdict} from './C';
import {Galton, Mosaic, Outro, Poll, Radar, Reprise} from './D';

export const SCENES_MOTION: Record<number, React.FC<SceneProps>> = {
  1: Opening,
  2: Interest,
  3: Scanner,
  4: Mother,
  5: Equation,
  6: Iceberg,
  7: PhoneLove,
  8: Promise,
  9: Race,
  10: Books,
  11: Funnel,
  12: Merit,
  13: Stairs,
  14: System,
  15: Fortune,
  16: Verdict,
  17: Behind,
  18: HowTitle,
  19: Galton,
  20: Radar,
  21: Mosaic,
  22: Reprise,
  23: Poll,
  24: Outro,
};
