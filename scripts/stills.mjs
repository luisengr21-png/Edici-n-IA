// Uso: node scripts/stills.mjs COMP fps dir nombre t1 t2 ... -> dir/nombre.jpg (hoja de contacto, 1 bundle)
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [comp, fpsS, dir, name, ...times] = process.argv.slice(2);
const fps = Number(fpsS);
fs.mkdirSync(dir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell'});
const composition = await selectComposition({serveUrl, id: comp, puppeteerInstance: browser});
const files = [];
for (let i = 0; i < times.length; i++) {
  const out = path.join(dir, `_${i}.jpg`);
  await renderStill({composition, serveUrl, output: out, frame: Math.round(Number(times[i]) * fps), scale: 0.5, imageFormat: 'jpeg', puppeteerInstance: browser, overwrite: true});
  files.push(out);
}
await browser.close({silent: true});
const n = files.length, c = Math.min(3, n);
const layout = files.map((_, k) => `${(k % c) * 960}_${Math.floor(k / c) * 540}`).join('|');
const args = ['-loglevel', 'error', '-y', ...files.flatMap((f) => ['-i', f])];
if (n > 1) args.push('-filter_complex', files.map((_, k) => `[${k}]`).join('') + `xstack=inputs=${n}:layout=${layout}`);
args.push(path.join(dir, `${name}.jpg`));
execFileSync('ffmpeg', args);
files.forEach((f) => fs.unlinkSync(f));
console.log(path.join(dir, `${name}.jpg`));
