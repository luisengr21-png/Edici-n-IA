// 10 miniaturas del video largo (1280×720, JPG) → entregas/la-riqueza-de-otros/miniaturas/miniatura_NN_nombre.jpg
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';
const NOMBRES = ['la-balanza', 'el-ladrillo-de-oro', 'la-moneda-partida', 'la-alcancia-con-casco', 'el-pastel-de-monedas', 'el-rey-del-ajedrez', 'la-llave-dorada', 'los-engranajes', 'el-edificio-sostenido', 'el-billete-cohete'];
const out = process.argv[2] ?? 'entregas/la-riqueza-de-otros/miniaturas';
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell'});
for (let n = 1; n <= 10; n++) {
  const composition = await selectComposition({serveUrl, id: `LaRiquezaDeOtrosMiniatura${n}`, puppeteerInstance: browser});
  await renderStill({composition, serveUrl, output: `${out}/miniatura_${String(n).padStart(2, '0')}_${NOMBRES[n - 1]}.jpg`, frame: 0, imageFormat: 'jpeg', jpegQuality: 92, puppeteerInstance: browser, overwrite: true});
}
await browser.close({silent: true});
console.log('ok');
