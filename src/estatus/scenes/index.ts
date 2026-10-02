import React from 'react';
import {Materialism, Mother, Party, Scale, SceneProps, Snobs, Spotlight} from './A';
import {Anything, Bookstore, Phone7, Pyramid, Race, Tapestry} from './B';
import {Fortune, Government, HowTo, Statistics, Trap, Verdict} from './C';
import {Identity, Luck, Outro, OwnSuccess, PartyReprise, YourView} from './D';

export const SCENE_COMPONENTS: Record<number, React.FC<SceneProps>> = {
  1: Party,
  2: Scale,
  3: Snobs,
  4: Mother,
  5: Materialism,
  6: Spotlight,
  7: Phone7,
  8: Anything,
  9: Race,
  10: Bookstore,
  11: Pyramid,
  12: Tapestry,
  13: Trap,
  14: Government,
  15: Fortune,
  16: Verdict,
  17: Statistics,
  18: HowTo,
  19: Luck,
  20: OwnSuccess,
  21: Identity,
  22: PartyReprise,
  23: YourView,
  24: Outro,
};
