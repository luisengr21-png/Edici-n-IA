// Miniaturas diseñadas de los 3 shorts (1080×1920, JPG) → entregas/04-la-riqueza-de-otros/video/short_0N_miniatura.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
const out = process.argv[2] ?? 'entregas/04-la-riqueza-de-otros/video';
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for (const n of [1, 2, 3]) {
  const composition = await selectComposition({serveUrl, id: `LaRiquezaDeOtrosMiniaturaShort${n}`, puppeteerInstance: browser});
  await renderStill({composition, serveUrl, output: `${out}/short_0${n}_miniatura.jpg`, frame: 0, imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
  console.log(n);
}
await browser.close({silent: true});
