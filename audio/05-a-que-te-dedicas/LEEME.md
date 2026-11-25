# Audio · ¿A qué te dedicas?

**Solo voz en off** (regla del canal): sin música ni efectos.

## Narración

Generada con **ElevenLabs** (modelo `eleven_v4`) y la voz de siempre del canal: **«BRIAN CM | Young LatAm Spanish Narrator»** (`LY1fdYL8QcEDyEkAT4Qq`).

**Primer video con ritmo y emociones** (regla nueva desde el 5.º video). Las marcas del guion se convirtieron en etiquetas de ElevenLabs:

| Guion | Etiqueta de ElevenLabs |
|---|---|
| `[TENSO]` | `[dramatically]` |
| `[TRISTE]` | `[sad]` |
| `[ALEGRE]` | `[warmly]` |
| `[ENOJADO]` | `[angry]` |
| `[SORPRENDIDO]` | `[surprised]` |
| `[TONO IRÓNICO]` | `[sarcastic]` |
| `[SUSURRO]` | `[whispers]` |
| `[MÁS RÁPIDO]` | `[quickly]` |
| `[MÁS LENTO]` | `[slowly]` |
| `[PAUSA]` / `[PAUSA LARGA]` | `[pause]` / `[long pause]` |

- Después de una emoción fuerte, si el párrafo siguiente no trae marca, se agrega `[calmly]` para que la voz vuelva a su tono normal y no se quede «pegada».
- Las palabras marcadas con `[ÉNFASIS]` van en MAYÚSCULAS. Los `[VERIFICAR]` no se leen.
- El largo se generó en **9 bloques cortos** (las secciones 4 y 5 partidas en dos), para que cada parte tenga su tono.
- De cada bloque salieron 2 tomas. Elegí la que mejor coincide con el guion y, si empataban, la más expresiva.
- Los textos exactos que se enviaron están en `scripts/dedicas/tts/`.

| Archivo | Duración | Nota |
|---|---|---|
| `largo_narracion_completa.wav` | 6:29 | Los 9 bloques unidos. No va al repositorio por su tamaño; el video final ya la trae |
| `short_0N_narracion.wav` | 0:27–0:32 | La toma elegida de cada short. Tampoco va al repositorio |
| `partes/largo_0X_*.mp3` | — | La toma elegida de cada bloque, sin procesar, por si hay que regenerar solo una |
| `largo_meta.json`, `short_0N_meta.json` | — | Qué toma se eligió y dónde empieza cada bloque |
| `transcripcion_palabras_*.json` | — | Transcripción con tiempos por palabra (Whisper small). Sirve para sincronizar las escenas y los subtítulos |
| `capitulos.json` | — | Inicio real de cada sección |

## Volumen

- Normalización en dos pasadas a **−14 LUFS**, con pico real de −1.5 dB, y un limitador suave para que ningún pico se pase.
- Así el volumen queda parejo de principio a fin. Lo hace `scripts/dedicas/mux.sh` al unir la voz con el video.
