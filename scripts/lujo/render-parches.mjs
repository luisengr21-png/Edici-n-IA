// Renderiza solo algunas escenas del video largo (un solo bundle) y las inserta en out/lujo-mudo.mp4.
// Uso: node scripts/lujo/render-parches.mjs 27 28 29 ...   (números de escena)
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition, openBrowser} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const plan = JSON.parse(fs.readFileSync('src/lujo/plan.json'));
const nums = process.argv.slice(2).map(Number);
const FPS = 30;
const ranges = nums.map((n) => {
  const s = plan.scenes.find((x) => x.n === n);
  return [n, Math.round(s.start * FPS), Math.round(s.end * FPS) - 1];
}).sort((a, b) => a[1] - b[1]);
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
const composition = await selectComposition({serveUrl, id: 'PobrezaDeLujo', puppeteerInstance: browser});
fs.mkdirSync('out/parches', {recursive: true});
for (const [n, a, b] of ranges) {
  await renderMedia({composition, serveUrl, codec: 'h264', crf: 16, frameRange: [a, b], outputLocation: `out/parches/p_${a}_${b}.mp4`, puppeteerInstance: browser, concurrency: 4, muted: true});
  console.log('escena', n, a, b);
}
await browser.close({silent: true});
// empalme: tramos del video original + parches, en orden
const inputs = ['-i', 'out/lujo-mudo.mp4'];
let fc = `[0]split=${ranges.length + 1}${ranges.map((_, k) => `[m${k}]`).join('')}[m${ranges.length}];`;
let cur = 0, seq = '';
ranges.forEach(([n, a, b], k) => {
  inputs.push('-i', `out/parches/p_${a}_${b}.mp4`);
  fc += `[m${k}]trim=start_frame=${cur}:end_frame=${a},setpts=PTS-STARTPTS[s${k}];[${k + 1}]setpts=PTS-STARTPTS[p${k}];`;
  seq += `[s${k}][p${k}]`;
  cur = b + 1;
});
fc += `[m${ranges.length}]trim=start_frame=${cur},setpts=PTS-STARTPTS[s${ranges.length}];${seq}[s${ranges.length}]concat=n=${ranges.length * 2 + 1}:v=1:a=0[v]`;
execFileSync('ffmpeg', ['-nostdin', '-hide_banner', '-loglevel', 'error', '-y', ...inputs, '-filter_complex', fc, '-map', '[v]', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', '30', 'out/lujo-mudo-p.mp4'], {stdio: 'inherit'});
fs.renameSync('out/lujo-mudo-p.mp4', 'out/lujo-mudo.mp4');
console.log('empalme listo');
