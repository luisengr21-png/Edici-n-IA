// Exporta las 5 miniaturas (1280×720) a entregas/01-pobreza-de-lujo/miniaturas/
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const NAMES = ['1_la-casa-llavero', '2_la-casa-en-la-vitrina', '3_la-mirada-de-la-vendedora', '4_el-ticket-infinito', '5_atrapado-con-estilo'];
const out = 'entregas/01-pobreza-de-lujo/miniaturas';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for (let n = 1; n <= 5; n++) {
  const composition = await selectComposition({serveUrl, id: `PobrezaDeLujoMiniatura${n}`, puppeteerInstance: browser});
  await renderStill({composition, serveUrl, output: `${out}/miniatura_${NAMES[n - 1]}.jpg`, frame: 0, imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
  console.log(n);
}
await browser.close({silent: true});
