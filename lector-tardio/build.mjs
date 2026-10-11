// Genera el logo de «Lector Tardío»: luna-reloj (11:55) asomando tras un libro abierto. Minimalista y retro.
// Uso: node lector-tardio/build.mjs -> escribe lector-tardio/logo.svg y logo-texto.svg
import fs from 'node:fs';

const C = {
  navy: '#1b2440',
  navyLight: '#26335c',
  navyDark: '#121a31',
  mustard: '#f0b53a',
  mustardDark: '#c98f1f',
  cream: '#f6ebd0',
  creamDark: '#dcc9a0',
  tomato: '#d9482b',
  tomatoDark: '#a53219',
  teal: '#2f9a94',
};

// Coordenadas locales: el dibujo se centra en (400, 480)
const art = (sh) => {
  const c = (col) => (sh ? C.navyDark : col);
  let s = '';
  // — luna-reloj
  const mx = 400;
  const my = 468;
  const mr = 168;
  s += `<circle cx="${mx}" cy="${my}" r="${mr}" fill="${c(C.mustard)}"/>`;
  if (!sh) {
    s += `<circle cx="${mx}" cy="${my}" r="${mr - 14}" fill="none" stroke="${C.mustardDark}" stroke-width="3" opacity=".55"/>`;
    // cráteres
    [[-62, -40, 26], [58, -78, 16], [74, 6, 20], [-84, 48, 14]].forEach(([dx, dy, r]) => (s += `<circle cx="${mx + dx}" cy="${my + dy}" r="${r}" fill="${C.mustardDark}" opacity=".28"/>`));
    // marcas de reloj
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const big = i % 3 === 0;
      const r1 = mr - 30;
      const r0 = r1 - (big ? 24 : 12);
      s += `<line x1="${mx + Math.sin(a) * r0}" y1="${my - Math.cos(a) * r0}" x2="${mx + Math.sin(a) * r1}" y2="${my - Math.cos(a) * r1}" stroke="${C.navy}" stroke-width="${big ? 9 : 5}" stroke-linecap="round"/>`;
    }
    // manecillas: 11:55 (ya es tarde)
    const hand = (deg, len, w) => `<line x1="${mx}" y1="${my}" x2="${mx + Math.sin((deg * Math.PI) / 180) * len}" y2="${my - Math.cos((deg * Math.PI) / 180) * len}" stroke="${C.navy}" stroke-width="${w}" stroke-linecap="round"/>`;
    s += hand(-3, 78, 14) + hand(-30, 112, 9);
    s += `<circle cx="${mx}" cy="${my}" r="14" fill="${C.tomato}"/><circle cx="${mx}" cy="${my}" r="5" fill="${C.cream}"/>`;
  }
  // — libro abierto (de frente)
  const page = (side) => {
    const k = side; // -1 izquierda, 1 derecha
    return `M400 612 Q${400 + k * 110} 548 ${400 + k * 240} 566 L${400 + k * 240} 668 Q${400 + k * 110} 650 400 712 Z`;
  };
  const cover = `M400 738 Q${400 - 120} 676 ${400 - 262} 692 L${400 - 262} 600 L${400 - 252} 566 Q${400 - 110} 540 400 596 Q${400 + 110} 540 ${400 + 252} 566 L${400 + 262} 600 L${400 + 262} 692 Q${400 + 120} 676 400 738 Z`;
  s += `<path d="${cover}" fill="${c(C.tomato)}"/>`;
  s += `<path d="${page(-1)}" fill="${c(C.cream)}"/><path d="${page(1)}" fill="${c(C.cream)}"/>`;
  if (!sh) {
    // líneas de texto en las páginas
    for (let i = 0; i < 5; i++) {
      const y = 596 + i * 12;
      s += `<path d="M${400 - 30} ${y + 36 - i * 2} Q${400 - 120} ${y - 6} ${400 - 214} ${y + 6 - i * 0.4}" fill="none" stroke="${C.creamDark}" stroke-width="4" stroke-linecap="round" opacity="${0.9 - i * 0.1}"/>`;
      s += `<path d="M${400 + 30} ${y + 36 - i * 2} Q${400 + 120} ${y - 6} ${400 + 214} ${y + 6 - i * 0.4}" fill="none" stroke="${C.creamDark}" stroke-width="4" stroke-linecap="round" opacity="${0.9 - i * 0.1}"/>`;
    }
    s += `<path d="M400 612 L400 712" stroke="${C.creamDark}" stroke-width="5"/>`;
    s += `<path d="M400 738 Q${400 - 120} 676 ${400 - 262} 692 M400 738 Q${400 + 120} 676 ${400 + 262} 692" fill="none" stroke="${C.tomatoDark}" stroke-width="6" stroke-linecap="round"/>`;
  }
  // — marcapáginas
  s += `<path d="M386 712 L414 712 L414 790 L400 774 L386 790 Z" fill="${c(C.teal)}"/>`;
  return s;
};

const sparkle = (x, y, r, col, op = 1) => `<path transform="translate(${x} ${y})" d="M0 ${-r} C${r * 0.12} ${-r * 0.12} ${r * 0.12} ${-r * 0.12} ${r} 0 C${r * 0.12} ${r * 0.12} ${r * 0.12} ${r * 0.12} 0 ${r} C${-r * 0.12} ${r * 0.12} ${-r * 0.12} ${r * 0.12} ${-r} 0 C${-r * 0.12} ${-r * 0.12} ${-r * 0.12} ${-r * 0.12} 0 ${-r} Z" fill="${col}" opacity="${op}"/>`;

const svg = ({text}) => {
  const sc = text ? 0.62 : 0.98;
  const cy = text ? 350 : 404;
  const tr = `translate(400 ${cy}) scale(${sc}) translate(-400 -546)`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<defs>
  <style>@font-face{font-family:Anton;src:url(anton.woff2) format('woff2')}</style>
  <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></radialGradient>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="2.6" fill="${C.navyDark}"/></pattern>
  <clipPath id="disc"><circle cx="400" cy="400" r="352"/></clipPath>
</defs>
<rect width="800" height="800" fill="${C.navyDark}"/>
<rect width="800" height="800" fill="url(#dots)" opacity=".7"/>
<circle cx="400" cy="400" r="352" fill="${C.navyLight}"/>
<g clip-path="url(#disc)">
  <circle cx="400" cy="${text ? 320 : 400}" r="${text ? 250 : 300}" fill="${C.navy}" opacity=".55"/>
  ${sparkle(150, 190, 22, C.cream)}${sparkle(640, 150, 16, C.cream, 0.9)}${sparkle(690, 330, 12, C.mustard)}${sparkle(112, 380, 12, C.mustard)}${sparkle(560, 96, 9, C.cream, 0.7)}${sparkle(236, 112, 9, C.cream, 0.7)}${sparkle(94, 262, 8, C.cream, 0.6)}${sparkle(712, 236, 8, C.cream, 0.6)}
</g>
<circle cx="400" cy="400" r="352" fill="none" stroke="${C.cream}" stroke-width="10"/>
<circle cx="400" cy="400" r="326" fill="none" stroke="${C.mustard}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round" opacity=".7"/>
<g transform="translate(14 16)"><g transform="${tr}">${art(true)}</g></g>
<g transform="${tr}">${art(false)}</g>
${
  text
    ? `<g transform="translate(400 0)"><text x="0" y="598" text-anchor="middle" font-family="Anton" font-size="104" letter-spacing="6" fill="${C.navyDark}" opacity=".5" transform="translate(5 6)">LECTOR</text>
<text x="0" y="598" text-anchor="middle" font-family="Anton" font-size="104" letter-spacing="6" fill="${C.cream}">LECTOR</text>
<rect x="-150" y="616" width="300" height="62" rx="10" fill="${C.tomato}"/><text x="0" y="662" text-anchor="middle" font-family="Anton" font-size="46" letter-spacing="14" fill="${C.cream}">TARDÍO</text></g>`
    : ''
}
<rect width="800" height="800" fill="url(#vig)"/>
</svg>`;
};

fs.writeFileSync(new URL('./logo.svg', import.meta.url), svg({text: false}));
fs.writeFileSync(new URL('./logo-texto.svg', import.meta.url), svg({text: true}));
console.log('SVG listos');
