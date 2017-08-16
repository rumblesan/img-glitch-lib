class JpegSectionParser {
  constructor(tag, name) {
    this.pTag = tag;
    this.name = name;
  }
  parses(fTag) {
    if (this.pTag.length !== fTag.length) {
      return false;
    }
    return this.pTag[0] === fTag[0] && this.pTag[1] == fTag[1];
  }
  parseData(data) {
    const size = data[0] * 8 + data[1];
    const sectionData = data.subarray(0, size); // include sizeData in this
    const remaining = data.subarray(size);
    return [{ section: this.name, data: sectionData }, remaining];
  }
}

class JpegSOIParser extends JpegSectionParser {
  constructor() {
    super();
    this.pTag = new Uint8Array([0xff, 0xd8]);
    this.name = 'SOI';
  }
  parseData(data) {
    // This is the opening tag so it's only ever 2 bytes
    const sectionData = data.subarray(0, 2);
    const remaining = data.subarray(2);
    return [{ section: this.name, data: sectionData }, remaining];
  }
}
class JpegEOIParser extends JpegSectionParser {
  constructor() {
    super();
    this.pTag = new Uint8Array([0xff, 0xd9]);
    this.name = 'EOI';
  }
  parseData(data) {
    // This is the closing tag so it's only ever 2 bytes
    const sectionData = data.subarray(0, 2);
    const remaining = data.subarray(2);
    return [{ section: this.name, data: sectionData }, remaining];
  }
}
class JpegAPPParser extends JpegSectionParser {
  constructor() {
    super();
    this.pTagLower = new Uint8Array([0xff, 0xe0]);
    this.pTagUpper = new Uint8Array([0xff, 0xef]);
    this.name = 'SOS';
  }
  parses(fTag) {
    if (this.pTagLower.length !== fTag.length) {
      return false;
    }
    return (
      this.pTagLower[0] === fTag[0] &&
      this.pTagLower[1] <= fTag[1] &&
      this.pTagUpper[1] >= fTag[1]
    );
  }
}

const parsers = [
  new JpegSOIParser(),
  new JpegSectionParser(new Uint8Array([0xff, 0xc0]), 'SOF0'),
  new JpegSectionParser(new Uint8Array([0xff, 0xc2]), 'SOF2'),
  new JpegSectionParser(new Uint8Array([0xff, 0xc4]), 'DHT'),
  new JpegSectionParser(new Uint8Array([0xff, 0xdb]), 'DQT'),
  new JpegSectionParser(new Uint8Array([0xff, 0xda]), 'SOS'),
  new JpegAPPParser(),
  new JpegSectionParser(new Uint8Array([0xff, 0xfe]), 'COM'),
  new JpegEOIParser(),
];

function getParser(tag) {
  return parsers.find(p => p.parses(tag));
}

function decodeJpegRecur(sections, imageData) {
  if (imageData.length < 1) {
    return sections;
  }
  const tag = imageData.subarray(0, 2);
  const parser = getParser(tag);
  if (parser == undefined) {
    return sections;
  } else {
    const [section, remainder] = parser.parseData(imageData);
    return decodeJpegRecur(sections.concat([section]), remainder);
  }
}

// imageData should be a Uint8Array
export default function decodeJpeg(imageData) {
  return decodeJpegRecur([], imageData);
}
