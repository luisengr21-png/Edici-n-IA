// node sheets.mjs COMP fps dir prefijo per t1 t2 ... -> hojas de 12 fotogramas
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const [comp, fpsS, dir, name, perS, ...times] = process.argv.slice(2);
const fps = Number(fpsS), per = Number(perS);
fs.mkdirSync(dir, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
const composition = await selectComposition({serveUrl, id: comp, puppeteerInstance: browser});
const W = composition.width / 2, H = composition.height / 2;
for (let s = 0; s * per < times.length; s++) {
  const files = [];
  for (const tt of times.slice(s * per, s * per + per)) {
    const out = path.join(dir, `_${files.length}.jpg`);
    await renderStill({composition, serveUrl, output: out, frame: Math.round(Number(tt) * fps), scale: 0.5, imageFormat: 'jpeg', puppeteerInstance: browser, overwrite: true});
    files.push(out);
  }
  const n = files.length, c = composition.width > composition.height ? 3 : 5;
  const layout = files.map((_, k) => `${(k % c) * W}_${Math.floor(k / c) * H}`).join('|');
  const args = ['-loglevel', 'error', '-y', ...files.flatMap((f) => ['-i', f])];
  if (n > 1) args.push('-filter_complex', files.map((_, k) => `[${k}]`).join('') + `xstack=inputs=${n}:layout=${layout}:fill=black`);
  args.push(path.join(dir, `${name}_${String(s + 1).padStart(2, '0')}.jpg`));
  execFileSync('ffmpeg', args);
  files.forEach((f) => fs.unlinkSync(f));
}
await browser.close({silent: true});
console.log('ok');
