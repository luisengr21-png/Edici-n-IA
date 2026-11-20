// Exporta las 5 miniaturas de la versión 2 (estilo de la referencia del creador), 1280×720
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const NAMES = ['1_no-es-pereza', '2_te-quemaste', '3_al-3', '4_flojo-o-quemado', '5_cinco-etapas'];
const out = 'entregas/no-es-pereza-es-burnout/miniaturas/v2';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for (let n = 1; n <= 5; n++) {
  const composition = await selectComposition({serveUrl, id: `NoEsPerezaMiniaturaV2-${n}`, puppeteerInstance: browser});
  await renderStill({composition, serveUrl, output: `${out}/miniatura_${NAMES[n - 1]}.jpg`, frame: 0, imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
}
await browser.close({silent: true});
console.log('ok');
