// Genera el logo de «Divulga Books»: un libro-megáfono minimalista y retro.
// Uso: node divulga-books/build.mjs  -> escribe divulga-books/logo.svg y logo-texto.svg
import fs from 'node:fs';

const C = {
  teal: '#1f6f6b',
  tealDark: '#17524f',
  mustard: '#f0b53a',
  mustardDark: '#d99a24',
  cream: '#f6ebd0',
  creamDark: '#dcc9a0',
  tomato: '#d9482b',
  tomatoDark: '#a53219',
  ink: '#2b2118',
};

/** Todo el dibujo. `sh` = true pinta una sola silueta (sombra desplazada, estilo serigrafía). */
const art = (sh) => {
  const c = (col) => (sh ? C.mustardDark : col);
  const arc = (r, a) => {
    const rad = (a * Math.PI) / 180;
    return `M${170 + 70 + r * Math.cos(-rad)} ${r * Math.sin(-rad)} A${r} ${r} 0 0 1 ${170 + 70 + r * Math.cos(rad)} ${r * Math.sin(rad)}`;
  };
  const star = (x, y, s, rot = 0) =>
    `<path transform="translate(${x} ${y}) rotate(${rot}) scale(${s})" d="M0 -30 L8.8 -12 L28.5 -9.3 L14.3 4.6 L17.6 24.3 L0 15 L-17.6 24.3 L-14.3 4.6 L-28.5 -9.3 L-8.8 -12 Z" fill="${c(C.cream)}"/>`;
  const page = (x, y, rot, s = 1) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><rect x="-19" y="-25" width="38" height="50" rx="4" fill="${c(C.cream)}"/>` +
    (sh ? '' : `<rect x="-11" y="-14" width="22" height="5" rx="2.5" fill="${C.tomato}"/><rect x="-11" y="-3" width="22" height="5" rx="2.5" fill="${C.tomato}" opacity=".7"/><rect x="-11" y="8" width="14" height="5" rx="2.5" fill="${C.tomato}" opacity=".5"/>`) +
    `</g>`;

  let s = '';
  // — ondas de sonido
  [80, 128, 176].forEach((r, i) => {
    s += `<path d="${arc(r, 36)}" fill="none" stroke="${c(i === 1 ? C.cream : C.tomato)}" stroke-width="20" stroke-linecap="round"/>`;
  });
  // — mango y marcapáginas
  s += `<rect x="-240" y="84" width="46" height="116" rx="14" fill="${c(C.tomatoDark)}"/>`;
  s += `<path d="M-168 84 L-146 84 L-146 184 L-157 170 L-168 184 Z" fill="${c(C.teal)}"/>`;
  // — tapa del libro (cuerpo trasero del megáfono)
  s += `<rect x="-322" y="-100" width="200" height="200" rx="18" fill="${c(C.tomato)}"/>`;
  if (!sh) {
    s += `<rect x="-322" y="-100" width="42" height="200" rx="18" fill="${C.tomatoDark}"/><rect x="-298" y="-100" width="18" height="200" fill="${C.tomatoDark}"/>`;
    [-62, -10, 42].forEach((y) => (s += `<rect x="-322" y="${y}" width="42" height="8" fill="${C.mustard}"/>`));
    s += `<rect x="-274" y="-84" width="4" height="168" fill="${C.ink}" opacity=".18"/>`;
    s += `<path transform="translate(-208 -20) scale(1.45)" d="M0 -30 L8.8 -12 L28.5 -9.3 L14.3 4.6 L17.6 24.3 L0 15 L-17.6 24.3 L-14.3 4.6 L-28.5 -9.3 L-8.8 -12 Z" fill="${C.mustard}"/>`;
    s += `<rect x="-246" y="42" width="92" height="9" rx="4.5" fill="${C.cream}"/><rect x="-246" y="60" width="62" height="9" rx="4.5" fill="${C.cream}" opacity=".75"/>`;
  }
  // — bloque de páginas (cuello del megáfono)
  s += `<rect x="-140" y="-70" width="46" height="140" rx="6" fill="${c(C.cream)}"/>`;
  if (!sh) [-52, -34, -16, 2, 20, 38, 56].forEach((y) => (s += `<line x1="-140" x2="-94" y1="${y}" y2="${y}" stroke="${C.creamDark}" stroke-width="3"/>`));
  // — cono: páginas abiertas en abanico
  s += `<path d="M-100 -70 L170 -172 L170 172 L-100 70 Z" fill="${c(C.cream)}"/>`;
  if (!sh) {
    for (let i = 1; i <= 6; i++) {
      const k = i / 7;
      const y0 = -70 + 140 * k;
      const y1 = -172 + 344 * k;
      s += `<path d="M-100 ${y0} Q40 ${(y0 + y1) / 2 + (k - 0.5) * 12} 170 ${y1}" fill="none" stroke="${C.creamDark}" stroke-width="3.5" stroke-linecap="round"/>`;
    }
    s += `<path d="M-100 -70 L170 -172" stroke="${C.tomato}" stroke-width="12" stroke-linecap="round"/><path d="M-100 70 L170 172" stroke="${C.tomato}" stroke-width="12" stroke-linecap="round"/>`;
  }
  // — boca: borde de páginas apiladas
  s += `<ellipse cx="170" cy="0" rx="48" ry="172" fill="${c(C.tomatoDark)}"/>`;
  if (!sh) {
    s += `<ellipse cx="172" cy="0" rx="40" ry="160" fill="${C.cream}"/>`;
    s += `<ellipse cx="180" cy="0" rx="34" ry="146" fill="${C.creamDark}"/>`;
    s += `<ellipse cx="190" cy="0" rx="26" ry="128" fill="${C.cream}"/>`;
    s += `<ellipse cx="200" cy="0" rx="18" ry="104" fill="${C.tomatoDark}"/>`;
  }
  // — letras y páginas que salen volando
  const pol = (r, deg) => [240 + r * Math.cos((deg * Math.PI) / 180), r * Math.sin((deg * Math.PI) / 180)];
  const [p1x, p1y] = pol(226, -46);
  const [p2x, p2y] = pol(226, 24);
  const [s1x, s1y] = pol(228, -12);
  const [s2x, s2y] = pol(214, 54);
  const [d1x, d1y] = pol(246, -26);
  const [d2x, d2y] = pol(248, 6);
  const [d3x, d3y] = pol(240, 40);
  s += page(p1x, p1y, -14, 0.9);
  s += page(p2x, p2y, 16, 0.85);
  s += star(s1x, s1y, 0.5, -10);
  s += star(s2x, s2y, 0.42, 12);
  s += `<circle cx="${d1x}" cy="${d1y}" r="7" fill="${c(C.cream)}"/><circle cx="${d2x}" cy="${d2y}" r="5" fill="${c(C.cream)}"/><circle cx="${d3x}" cy="${d3y}" r="6" fill="${c(C.cream)}"/>`;
  return s;
};

const svg = ({text}) => {
  const scale = text ? 0.64 : 0.76;
  const ty = text ? 322 : 440;
  const tx = text ? 372 : 372;
  const tr = `translate(${tx} ${ty}) rotate(-17) scale(${scale})`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
<defs>
  <style>@font-face{font-family:Anton;src:url(anton.woff2) format('woff2')}</style>
  <radialGradient id="vig" cx="50%" cy="50%" r="70%"><stop offset="0.6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></radialGradient>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="11" cy="11" r="2.6" fill="${C.tealDark}"/></pattern>
</defs>
<rect width="800" height="800" fill="${C.teal}"/>
<rect width="800" height="800" fill="url(#dots)" opacity=".55"/>
<circle cx="400" cy="400" r="352" fill="${C.mustard}"/>
<circle cx="400" cy="400" r="352" fill="none" stroke="${C.cream}" stroke-width="10"/>
<circle cx="400" cy="400" r="326" fill="none" stroke="${C.mustardDark}" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>
<g transform="translate(14 16)"><g transform="${tr}">${art(true)}</g></g>
<g transform="${tr}">${art(false)}</g>
${
  text
    ? `<g transform="translate(400 0)"><text x="0" y="618" text-anchor="middle" font-family="Anton" font-size="104" letter-spacing="6" fill="${C.ink}" opacity=".18" transform="translate(5 6)">DIVULGA</text>
<text x="0" y="618" text-anchor="middle" font-family="Anton" font-size="104" letter-spacing="6" fill="${C.cream}">DIVULGA</text>
<rect x="-132" y="636" width="264" height="58" rx="10" fill="${C.tomato}"/><text x="0" y="680" text-anchor="middle" font-family="Anton" font-size="44" letter-spacing="14" fill="${C.cream}">BOOKS</text></g>`
    : ''
}
<rect width="800" height="800" fill="url(#vig)"/>
</svg>`;
};

fs.writeFileSync(new URL('./logo.svg', import.meta.url), svg({text: false}));
fs.writeFileSync(new URL('./logo-texto.svg', import.meta.url), svg({text: true}));
console.log('SVG listos');
