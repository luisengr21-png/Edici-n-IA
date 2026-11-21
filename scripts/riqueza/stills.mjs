// Fotogramas de prueba: node scripts/riqueza/stills.mjs <composición> <carpeta> <frame> [<frame>...]
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const [id, out, ...frames] = process.argv.slice(2);
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
const composition = await selectComposition({serveUrl, id, puppeteerInstance: browser});
for (const f of frames) {
  await renderStill({composition, serveUrl, output: `${out}/f_${String(f).padStart(5, '0')}.jpg`, frame: Number(f), imageFormat: 'jpeg', jpegQuality: 85, puppeteerInstance: browser, overwrite: true, scale: 0.5});
}
await browser.close({silent: true});
console.log('ok', frames.length);
