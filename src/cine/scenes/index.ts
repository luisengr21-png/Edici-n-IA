import React from 'react';
import {Giants, Market, MoonPlain, MotherWindow, Ocean, SceneProps, Terrace} from './A';
import {Hourglass, KiteHill, Library, Rooftop, Strings, TwoPaths} from './B';
import {Behind, Drop, Finger, Machinery, Verdict, Wheel} from './C';
import {Constellations, Credits, Crossroads, PaperBoat, Seeds, Windows} from './D';

export const SCENES_CINE: Record<number, React.FC<SceneProps>> = {
  1: MoonPlain,
  2: Terrace,
  3: Giants,
  4: MotherWindow,
  5: Market,
  6: Ocean,
  7: Rooftop,
  8: KiteHill,
  9: TwoPaths,
  10: Library,
  11: Hourglass,
  12: Strings,
  13: Finger,
  14: Machinery,
  15: Wheel,
  16: Verdict,
  17: Behind,
  18: Drop,
  19: Seeds,
  20: Windows,
  21: Constellations,
  22: PaperBoat,
  23: Crossroads,
  24: Credits,
};
