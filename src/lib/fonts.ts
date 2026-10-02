import {continueRender, delayRender, staticFile} from 'remotion';

export const SERIF = '"Cormorant Garamond", Georgia, serif';
export const SANS = 'Inter, "DejaVu Sans", sans-serif';

const faces: [string, string, string, string][] = [
  ['Cormorant Garamond', 'CormorantGaramond-300-normal.woff', '300', 'normal'],
  ['Cormorant Garamond', 'CormorantGaramond-500-normal.woff', '500', 'normal'],
  ['Cormorant Garamond', 'CormorantGaramond-300-italic.woff', '300', 'italic'],
  ['Cormorant Garamond', 'CormorantGaramond-400-italic.woff', '400', 'italic'],
  ['Inter', 'Inter-300-normal.woff', '300', 'normal'],
  ['Inter', 'Inter-500-normal.woff', '500', 'normal'],
];

if (typeof document !== 'undefined') {
  const handle = delayRender('Cargando tipografías');
  Promise.all(
    faces.map(([family, file, weight, style]) => {
      const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff')`, {weight, style});
      return face.load().then(() => document.fonts.add(face));
    }),
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
