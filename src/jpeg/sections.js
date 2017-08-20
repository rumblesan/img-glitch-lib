export const STARTBYTE = 0xff;
export const PADBYTE = 0x00;
export const SOF0 = { name: 'SOF0', tag: new Uint8Array([STARTBYTE, 0xc0]) };
export const SOF2 = { name: 'SOF2', tag: new Uint8Array([STARTBYTE, 0xc2]) };
export const DHT = { name: 'DHT', tag: new Uint8Array([STARTBYTE, 0xc4]) };
export const DQT = { name: 'DQT', tag: new Uint8Array([STARTBYTE, 0xdb]) };
export const SOS = { name: 'SOS', tag: new Uint8Array([STARTBYTE, 0xda]) };
export const SOI = { name: 'SOI', tag: new Uint8Array([STARTBYTE, 0xd8]) };
export const EOI = { name: 'EOI', tag: new Uint8Array([STARTBYTE, 0xd9]) };
export const COM = { name: 'COM', tag: new Uint8Array([STARTBYTE, 0xfe]) };
export const APP = {
  name: 'SOS',
  upper: new Uint8Array([STARTBYTE, 0xef]),
  lower: new Uint8Array([STARTBYTE, 0xe0]),
  tag: new Uint8Array([STARTBYTE, 0xe0]),
};

export function Section(section, size, position) {
  return {
    section,
    size,
    position,
  };
}
