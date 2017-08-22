import { Jpeg } from 'jpeg';

export const fileToUint8 = cb => event => {
  cb(Jpeg(new Uint8Array(event.target.result)));
};

export function jpegFromCanvas(canvasElem, cb, quality = 0.95) {
  canvasElem.toBlob(
    blob => {
      var r = new FileReader();
      r.onload = fileToUint8(cb);
      r.readAsArrayBuffer(blob);
    },
    'image/jpeg',
    quality
  );
}

export function imageFromJpeg(jpeg, cb) {
  console.log('loading image from jpeg');
  const objurl = URL.createObjectURL(new Blob([jpeg.data]), {
    type: 'image/jpeg',
  });
  const img = new Image();
  img.onload = () => {
    console.log('image loaded');
    cb(img);
  };
  img.src = objurl;
}
