import decodeJpeg from './decoder';

export function Jpeg(data) {
  return {
    type: 'jpeg',
    data,
    sections: decodeJpeg(data),
  };
}

export function copy({ data }) {
  // results in reparsing the new jpeg
  // may or may not be a bad idea
  return Jpeg(data.slice());
}

export function getSections(sectionName, jpeg) {
  return jpeg.sections.filter(({ section }) => section === sectionName);
}
