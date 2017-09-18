import { getSections } from './index';
import { DQT } from './sections';
import { copy as jpegCopy } from 'jpeg';

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
  const glitchedJpeg = jpegCopy(jpeg);
  getSections(DQT.name, glitchedJpeg).forEach(s =>
    glitchQuantisationTable(glitchedJpeg, s)
  );
  return glitchedJpeg;
}

export function quantGlitch(jpeg, opts) {
  const glitchedJpeg = jpegCopy(jpeg);
  getSections(DQT.name, glitchedJpeg)
    .filter((qt, idx) => {
      if (!opts || !opts.quantTable || opts.quantTable === 'all') {
        return true;
      }
      return idx === opts.quantTable;
    })
    .forEach(s => glitchQuantisationTable(glitchedJpeg, s, opts));
  return glitchedJpeg;
}
