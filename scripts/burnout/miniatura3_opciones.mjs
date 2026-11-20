// Exporta las 3 opciones de texto de la miniatura 3 (pila en llamas)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'node:fs';
import path from 'node:path';
const out = 'entregas/no-es-pereza-es-burnout/miniaturas/v2';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for (const v of ['d']) {
  const composition = await selectComposition({serveUrl, id: `NoEsPerezaMiniatura3-${v}`, puppeteerInstance: browser});
  await renderStill({composition, serveUrl, output: `${out}/miniatura_3_al-3_opcion-${v}.jpg`, frame: 0, imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
}
await browser.close({silent: true});
console.log('ok');
