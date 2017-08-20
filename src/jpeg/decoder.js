import {
  JpegSectionParser,
  JpegSOIParser,
  JpegSOSParser,
  JpegEOIParser,
  JpegAPPParser,
} from './parsers';

import { STARTBYTE, SOF0, SOF2, DHT, DQT, COM } from './sections';

const parsers = [
  new JpegSOIParser(),
  new JpegSectionParser(SOF0),
  new JpegSectionParser(SOF2),
  new JpegSectionParser(DHT),
  new JpegSectionParser(DQT),
  new JpegSOSParser(),
  new JpegAPPParser(),
  new JpegSectionParser(COM),
  new JpegEOIParser(),
];

function getParser(firstTagByte, secondTagByte) {
  return parsers.find(p => p.parses(firstTagByte, secondTagByte));
}

function decodeJpegRecur(imageData, sections, position) {
  if (position >= imageData.length) {
    return sections;
  }
  const firstTagByte = imageData[position];
  const secondTagByte = imageData[position + 1];
  if (firstTagByte !== STARTBYTE) {
    throw new Error(`Invalid initial tag value: ${firstTagByte.toString(16)}`);
  }
  const parser = getParser(firstTagByte, secondTagByte);
  if (parser === undefined) {
    throw new Error(`Could not find parser for ${secondTagByte.toString(16)}`);
  }
  const section = parser.parseData(imageData, position);
  const newPosition = position + section.size;
  return decodeJpegRecur(imageData, sections.concat([section]), newPosition);
}

// imageData should be a Uint8Array
export default function decodeJpeg(imageData) {
  return decodeJpegRecur(imageData, [], 0);
}
