import React from 'react';
import {Catalog, Courtesy, Iceberg, Mother, Question, SceneProps, Snobs} from './A';
import {Board, Books, Funnel, PhoneScene, Promise, Timeline} from './B';
import {Behind, Fortune, HowCard, Syllogism, System, Verdict} from './C';
import {Galton, Mosaic, Outro, Poll, QuestionAgain, Radar} from './D';

export const SCENES_VOX: Record<number, React.FC<SceneProps>> = {
  1: Question,
  2: Courtesy,
  3: Snobs,
  4: Mother,
  5: Catalog,
  6: Iceberg,
  7: PhoneScene,
  8: Promise,
  9: Board,
  10: Books,
  11: Funnel,
  12: Timeline,
  13: Syllogism,
  14: System,
  15: Fortune,
  16: Verdict,
  17: Behind,
  18: HowCard,
  19: Galton,
  20: Radar,
  21: Mosaic,
  22: QuestionAgain,
  23: Poll,
  24: Outro,
};
