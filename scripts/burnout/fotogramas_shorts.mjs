// Fotograma de cada short para usarlo como miniatura (1080×1920, JPG, sin subtítulos)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
const PICKS = [[1, 2.6], [2, 25.15], [3, 34.4]]; // segundo elegido de cada short
const out = 'entregas/no-es-pereza-es-burnout/video';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for (const [n, t] of PICKS) {
  const inputProps = {id: `Short${n}`, noCaps: true};
  const composition = await selectComposition({serveUrl, id: `NoEsPerezaShort${n}`, inputProps, puppeteerInstance: browser});
  await renderStill({composition, serveUrl, inputProps, output: `${out}/short_0${n}_miniatura.jpg`, frame: Math.round(t * 30), imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
  console.log(n);
}
await browser.close({silent: true});
