import { STARTBYTE, PADBYTE, SOI, SOS, APP, EOI, Section } from './sections';

export class JpegSectionParser {
  constructor(section) {
    this.pTag = section.tag;
    this.name = section.name;
    this.pTagSize = section.tag.length;
  }
  parses(firstTagByte, secondTagByte) {
    return this.pTag[0] === firstTagByte && this.pTag[1] === secondTagByte;
  }
  parseData(data, position) {
    // Section size does not include initial tag
    const segmentStart = position + this.pTagSize;
    const segmentSize = data[segmentStart] * 8 + data[segmentStart + 1];
    const size = this.pTagSize + segmentSize;
    return Section(this.name, size, position);
  }
}

export class JpegSOIParser extends JpegSectionParser {
  constructor() {
    super(SOI);
  }
  parseData(data, position) {
    // This is the opening tag so it's only ever 2 bytes
    const size = 2;
    return Section(this.name, size, position);
  }
}

export class JpegEOIParser extends JpegSectionParser {
  constructor() {
    super(EOI);
  }
  parseData(data, position) {
    // This is the closing tag so it's only ever 2 bytes
    const size = 2;
    return Section(this.name, size, position);
  }
}

export class JpegSOSParser extends JpegSectionParser {
  constructor() {
    super(SOS);
  }
  parseData(data, position) {
    // Section size does not include initial tag
    const segmentStart = position + this.pTagSize;
    const segmentSize = data[segmentStart] * 8 + data[segmentStart + 1];
    const segmentHeaderSize = this.pTagSize + segmentSize;
    let i;
    for (i = position + segmentHeaderSize; i < data.length; i += 1) {
      if (data[i] === STARTBYTE && data[i + 1] !== PADBYTE) {
        break;
      }
    }
    const finalSize = i - position;
    return Section(this.name, finalSize, position);
  }
}

export class JpegAPPParser extends JpegSectionParser {
  constructor() {
    super(APP);
    this.pTagUpper = APP.upper;
    this.pTagLower = APP.lower;
  }
  parses(firstTagByte, secondTagByte) {
    return (
      this.pTagLower[0] === firstTagByte &&
      this.pTagLower[1] <= secondTagByte &&
      this.pTagUpper[1] >= secondTagByte
    );
  }
}
