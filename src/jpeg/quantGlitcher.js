import { getSections } from './index';
import { DQT } from './sections';

import seedrandom from 'seedrandom';

export function glitchQuantisationTable(jpeg, section, opts = {}) {
  const rng = seedrandom(opts.seed, { entropy: !opts.seed });
  const depth = opts.depth || 0.1;
  for (
    let p = section.position + 2;
    p < section.position + section.size;
    p += 1
  ) {
    if (rng() < depth) {
      jpeg.data[p] = Math.floor(rng() * 253 + 1);
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
