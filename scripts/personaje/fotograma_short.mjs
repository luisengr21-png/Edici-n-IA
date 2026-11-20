// Fotograma de un short de «El personaje que fabricas por miedo» para usarlo como miniatura (1080×1920, sin subtítulos)
// Uso: node scripts/personaje/fotograma_short.mjs <n> <segundo> <salida.jpg>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
const [n, t, out] = process.argv.slice(2);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
const inputProps = {id: `Short${n}`, noCaps: true};
const composition = await selectComposition({serveUrl, id: `PersonajeMiedoShort${n}`, inputProps, puppeteerInstance: browser});
await renderStill({composition, serveUrl, inputProps, output: out, frame: Math.round(Number(t) * 30), imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
await browser.close({silent: true});
console.log('ok');
