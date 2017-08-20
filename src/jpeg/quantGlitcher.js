import { DQT } from './sections';

export function randomQuantGlitch(imageData, sections) {
  sections.forEach(s => {
    if (s.section === DQT.name) {
      let p;
      let g;
      for (p = s.position + 2; p < s.position + s.size; p += 1) {
        if (Math.random() < 0.1) {
          g = Math.floor(Math.random() * 253 + 1);
          console.log(imageData[p], g);
          imageData[p] = g;
        }
      }
    }
  });
}
