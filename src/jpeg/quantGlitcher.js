import { getSections } from './index';
import { DQT } from './sections';

export function glitchQuantisationTable(jpeg, section) {
  let p;
  let g;
  for (p = section.position + 2; p < section.position + section.size; p += 1) {
    if (Math.random() < 0.1) {
      g = Math.floor(Math.random() * 253 + 1);
      jpeg.data[p] = g;
    }
  }
}

export function randomQuantGlitch(jpeg) {
  getSections(DQT.name, jpeg).map(s => glitchQuantisationTable(jpeg, s));
}
