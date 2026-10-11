// Logo «Lector Tardío» (v2): un libro abierto del que brota una planta que florece, con un sol retro de atardecer.
// Idea: florecer tarde (el gusto por la lectura llega a los 30 y tantos). Minimalista y retro.
// Uso: node lector-tardio/build-brote.mjs -> escribe logo-brote.svg y logo-brote-texto.svg
import fs from 'node:fs';

const C = {
  bg: '#1f4a42',
  bgDark: '#143129',
  disc: '#2b5c52',
  cream: '#f6ebd0',
  creamDark: '#dcc9a0',
  mustard: '#f0b53a',
  orange: '#ee8a3c',
  sun: '#f7d98a',
  tomato: '#d9482b',
  tomatoDark: '#a53219',
  leaf: '#5aa85f',
  leafDark: '#3a7d46',
  ink: '#16261f',
};

const art = (sh) => {
  const c = (col) => (sh ? C.bgDark : col);
  let s = '';
  // — sol de atardecer (semicírculos concéntricos) detrás del libro
  s += `<clipPath id="above"><rect x="0" y="0" width="800" height="618"/></clipPath>`;
  s += `<g clip-path="url(#above)">`;
  s += `<circle cx="400" cy="618" r="282" fill="${c(C.mustard)}"/><circle cx="400" cy="618" r="226" fill="${c(C.orange)}"/><circle cx="400" cy="618" r="170" fill="${c(C.sun)}"/>`;
  s += `</g>`;
  // — tallo
  const stem = 'M400 622 C 388 540 412 440 400 340';
  s += `<path d="${stem}" fill="none" stroke="${c(C.leafDark)}" stroke-width="14" stroke-linecap="round"/>`;
  // — hojas (pares alternos, más grandes abajo)
  const leaf = (x, y, deg, L, W, col, dark) =>
    `<g transform="translate(${x} ${y}) rotate(${deg})"><path d="M0 0 Q${L * 0.45} ${-W} ${L} 0 Q${L * 0.45} ${W} 0 0 Z" fill="${c(col)}"/>` +
    (sh ? '' : `<path d="M6 0 L${L * 0.86} 0" stroke="${dark}" stroke-width="4" stroke-linecap="round" opacity=".8"/>`) +
    `</g>`;
  const leaves = [
    [398, 566, -150, 118, 36, C.leaf, C.leafDark],
    [402, 536, -32, 112, 34, C.leafDark, C.leaf],
    [398, 480, -146, 96, 30, C.leafDark, C.leaf],
    [402, 450, -36, 92, 28, C.leaf, C.leafDark],
    [399, 400, -142, 70, 23, C.leaf, C.leafDark],
    [401, 380, -40, 68, 22, C.leafDark, C.leaf],
  ];
  leaves.forEach((l) => (s += leaf(...l)));
  // — flor que acaba de abrir
  const fx = 400;
  const fy = 306;
  for (let i = 0; i < 7; i++) {
    const a = (i / 7) * 360 - 90;
    s += `<g transform="translate(${fx} ${fy}) rotate(${a})"><ellipse cx="42" cy="0" rx="34" ry="24" fill="${c(i % 2 ? C.tomato : '#e4623f')}"/></g>`;
  }
  s += `<circle cx="${fx}" cy="${fy}" r="26" fill="${c(C.mustard)}"/>`;
  if (!sh) s += `<circle cx="${fx}" cy="${fy}" r="12" fill="${C.orange}"/><circle cx="${fx - 22}" cy="${fy - 4}" r="0"/>`;
  // — libro abierto
  const page = (k) => `M400 622 Q${400 + k * 110} 558 ${400 + k * 240} 576 L${400 + k * 240} 678 Q${400 + k * 110} 660 400 722 Z`;
  const cover = `M400 748 Q${400 - 120} 686 ${400 - 262} 702 L${400 - 262} 610 L${400 - 252} 576 Q${400 - 110} 550 400 606 Q${400 + 110} 550 ${400 + 252} 576 L${400 + 262} 610 L${400 + 262} 702 Q${400 + 120} 686 400 748 Z`;
  s += `<path d="${cover}" fill="${c(C.tomato)}"/>`;
  s += `<path d="${page(-1)}" fill="${c(C.cream)}"/><path d="${page(1)}" fill="${c(C.cream)}"/>`;
  if (!sh) {
    for (let i = 0; i < 5; i++) {
      const y = 606 + i * 12;
      s += `<path d="M${400 - 30} ${y + 36 - i * 2} Q${400 - 120} ${y - 6} ${400 - 214} ${y + 6 - i * 0.4}" fill="none" stroke="${C.creamDark}" stroke-width="4" stroke-linecap="round" opacity="${0.9 - i * 0.1}"/>`;
      s += `<path d="M${400 + 30} ${y + 36 - i * 2} Q${400 + 120} ${y - 6} ${400 + 214} ${y + 6 - i * 0.4}" fill="none" stroke="${C.creamDark}" stroke-width="4" stroke-linecap="round" opacity="${0.9 - i * 0.1}"/>`;
    }
    s += `<path d="M400 622 L400 722" stroke="${C.creamDark}" stroke-width="5"/>`;
    s += `<path d="M400 748 Q${400 - 120} 686 ${400 - 262} 702 M400 748 Q${400 + 120} 686 ${400 + 262} 702" fill="none" stroke="${C.tomatoDark}" stroke-width="6" stroke-linecap="round"/>`;
  }
  return s;
};

const sparkle = (x, y, r, col, op = 1) => `<path transform="translate(${x} ${y})" d="M0 ${-r} C${r * 0.12} ${-r * 0.12} ${r * 0.12} ${-r * 0.12} ${r} 0 C${r * 0.12} ${r * 0.12} ${r * 0.12} ${r * 0.12} 0 ${r} C${-r * 0.12} ${r * 0.12} ${-r * 0.12} ${r * 0.12} ${-r} 0 C${-r * 0.12} ${-r * 0.12} ${-r * 0.12} ${-r * 0.12} 0 ${-r} Z" fill="${col}" opacity="${op}"/>`;

const svg = ({text}) => {
  const sc = text ? 0.6 : 0.9;
  const cy = text ? 330 : 420;
  const tr = `translate(400 ${cy}) scale(${sc}) translate(-400 -500)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<defs>
  <style>@font-face{font-family:Anton;src:url(anton.woff2) format('woff2')}</style>
  <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".26"/></radialGradient>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="2.6" fill="${C.bgDark}"/></pattern>
  <clipPath id="disc"><circle cx="400" cy="400" r="352"/></clipPath>
</defs>
<rect width="800" height="800" fill="${C.bgDark}"/>
<rect width="800" height="800" fill="url(#dots)" opacity=".7"/>
<circle cx="400" cy="400" r="352" fill="${C.disc}"/>
<g clip-path="url(#disc)">
  ${Array.from({length: 18})
    .map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const a2 = ((i + 0.5) / 18) * Math.PI * 2;
      return i % 2 ? '' : `<path d="M400 ${text ? 330 : 420} L${400 + Math.cos(a) * 700} ${(text ? 330 : 420) + Math.sin(a) * 700} L${400 + Math.cos(a2) * 700} ${(text ? 330 : 420) + Math.sin(a2) * 700} Z" fill="${C.bg}" opacity=".5"/>`;
    })
    .join('')}
  ${sparkle(150, 200, 18, C.cream, 0.9)}${sparkle(660, 170, 14, C.cream, 0.8)}${sparkle(700, 360, 10, C.mustard)}${sparkle(104, 380, 10, C.mustard)}
</g>
<circle cx="400" cy="400" r="352" fill="none" stroke="${C.cream}" stroke-width="10"/>
<circle cx="400" cy="400" r="326" fill="none" stroke="${C.mustard}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".7"/>
<g transform="translate(14 16)"><g transform="${tr}">${art(true)}</g></g>
<g transform="${tr}">${art(false)}</g>
${
  text
    ? `<g transform="translate(400 0)"><text x="0" y="598" text-anchor="middle" font-family="Anton" font-size="104" letter-spacing="6" fill="${C.bgDark}" opacity=".6" transform="translate(5 6)">LECTOR</text>
<text x="0" y="598" text-anchor="middle" font-family="Anton" font-size="104" letter-spacing="6" fill="${C.cream}">LECTOR</text>
<rect x="-150" y="616" width="300" height="62" rx="10" fill="${C.tomato}"/><text x="0" y="662" text-anchor="middle" font-family="Anton" font-size="46" letter-spacing="14" fill="${C.cream}">TARDÍO</text></g>`
    : ''
}
<rect width="800" height="800" fill="url(#vig)"/>
</svg>`;
};

fs.writeFileSync(new URL('./logo-brote.svg', import.meta.url), svg({text: false}));
fs.writeFileSync(new URL('./logo-brote-texto.svg', import.meta.url), svg({text: true}));
console.log('SVG listos');
