import { getSections } from './index';
import { DQT } from './sections';

export function glitchQuantisationTable(jpeg, section, opts = {}) {
  let p;
  let g;
  const depth = opts.depth || 0.1;
  for (p = section.position + 2; p < section.position + section.size; p += 1) {
    if (Math.random() < depth) {
      g = Math.floor(Math.random() * 253 + 1);
      jpeg.data[p] = g;
    }
  }
}

export function randomQuantGlitch(jpeg) {
  getSections(DQT.name, jpeg).map(s => glitchQuantisationTable(jpeg, s));
}

export function quantGlitch(jpeg, opts) {
  getSections(DQT.name, jpeg)
    .filter((qt, idx) => {
      if (!opts || !opts.quantTable) {
        return true;
      }
      return idx === opts.quantTable;
    })
    .map(s => glitchQuantisationTable(jpeg, s, opts));
}
