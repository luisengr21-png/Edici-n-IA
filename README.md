# Ser real

Ensayo animado sobre autenticidad, validación y conexión, en el estilo de *How Money Works*: lienzo oscuro infinito, figuras planas sin rostro, gráficas que se dibujan solas y casi nada de texto.

**Video final:** [`out/ser-real.mp4`](out/ser-real.mp4) · 1920×1080 · 30 FPS · 3:37 · H.264 + AAC (-14 LUFS) · vista previa: [`out/ser-real-720p.mp4`](out/ser-real-720p.mp4)

- Guion: [`autenticidad/guion.txt`](autenticidad/guion.txt) · Storyboard (ES/EN): [`autenticidad/storyboard.md`](autenticidad/storyboard.md)
- **Voz:** Piper `es_AR-daniela-high` (sherpa-onnx, sin conexión), generada frase por frase con pausas medidas (`autenticidad/work/voz.py`), que también escribe `src/serreal/cues.json` y `plan.json`; la animación se sincroniza a esos tiempos.
- **Imagen:** Remotion (`src/serreal/`), 18 escenas en `scenes/A–D.tsx` sobre un kit común (`kit.tsx`).
- **Música y efectos:** `scripts/serreal-audio.mjs` (síntesis propia, sin samples). **Mezcla:** `scripts/serreal-mux.sh`.

```bash
npm run serreal:voz -- <dir-del-modelo-vits-piper-es_AR-daniela-high>   # solo si cambia el guion
npm run serreal      # audio + video + mezcla
```

---

# Lo que la noche sabe

Ensayo visual de 60 segundos sobre la importancia del sueño, producido íntegramente con código.

**Video final:** [`out/lo-que-la-noche-sabe.mp4`](out/lo-que-la-noche-sabe.mp4) · 1920×1080 · 30 FPS · 60 s · H.264 + AAC (-14 LUFS)

## Escenas

| # | Tiempo | Escena | Verso |
|---|--------|--------|-------|
| 1 | 0–6 s | El tercio invisible | *Pasamos un tercio de la vida con los ojos cerrados.* |
| 2 | 6–13 s | La ciudad que se apaga | *¿Y si fuera ahí, en la oscuridad, donde se decide quiénes somos?* |
| 3 | 13–20 s | El reloj se rinde | *El tiempo se rinde. El cuerpo, por fin, deja de obedecer.* |
| 4 | 20–28 s | El descenso | *Descendemos. Capa tras capa, el cerebro lava el polvo del día.* |
| 5 | 28–36 s | El jardín de la memoria | *Mientras duermes, la memoria elige qué recuerdos merecen quedarse.* |
| 6 | 36–43 s | REM, la fábrica de mundos | *Y en el sueño, la mente ensaya la vida con otras reglas.* |
| 7 | 43–50 s | La noche robada | *Quien le roba horas a la noche, se roba a sí mismo.* |
| 8 | 50–56 s | Volver entero | *Dormir no es rendirse. Es regresar completo.* |
| 9 | 56–60 s | Créditos | **LO QUE LA NOCHE SABE** — *Duerme. El mundo puede esperar.* |

## Herramientas

- **Remotion (React + TypeScript):** motion graphics, tipografía y animación procedural (ciudad, reloj que se derrite, ondas cerebrales, árbol neuronal, ballena onírica).
- **Sintetizador propio en Node** (`scripts/synth-audio.mjs`): drones, piano, celesta, latidos, tics, glitches y campana, sin samples. Lee `src/timeline.json`, así que cada sonido cae en su fotograma.
- **FFmpeg:** mezcla, masterización con loudnorm y codificación final.

## Reproducir el render

```bash
npm install
npm run build        # audio + video + mezcla final
# o por partes:
npm run audio        # out/audio.wav
npm run render:video # out/video-mudo.mp4
npm run mux          # out/lo-que-la-noche-sabe.mp4
npm run studio       # previsualizar y editar en Remotion Studio
```

`render:video` apunta al Chromium preinstalado en `/opt/pw-browsers`. En otra máquina, quita el flag `--browser-executable` y Remotion descargará el suyo.
