# Audio · La riqueza de otros

**Solo voz en off** (regla del canal desde el 4.º video): sin música ni efectos.

## Narración

Generada con **ElevenLabs** (modelo `eleven_v4`) y la voz de siempre del canal: **«BRIAN CM | Young LatAm Spanish Narrator»** (`LY1fdYL8QcEDyEkAT4Qq`).

Las indicaciones del guion se convirtieron en etiquetas de ElevenLabs:

| Guion | Etiqueta de ElevenLabs |
|---|---|
| `[PAUSA]` | `[pause]` |
| `[PAUSA LARGA]` | `[long pause]` |
| `[SUSURRO]` | `[whispers]` |
| `[TONO IRÓNICO]` | `[sarcastic]` |
| `[MÁS RÁPIDO]` | `[quickly]` |

- Las palabras marcadas con `[ÉNFASIS]` van en MAYÚSCULAS.
- Los `[VERIFICAR]` no se leen.
- Los textos exactos que se enviaron están en `scripts/riqueza/tts/`.

| Archivo | Duración | Nota |
|---|---|---|
| `largo_narracion_completa.wav` | 13:28 | Las 8 partes unidas, con 0.7 s de aire entre secciones. No va al repositorio por su tamaño; el video final ya la trae |
| `short_0N_narracion.wav` | 0:33–0:35 | La toma elegida de cada short |
| `partes/largo_0X_*.mp3` | — | La toma elegida de cada bloque, sin procesar, por si hay que regenerar solo una |
| `transcripcion_palabras_*.json` | — | Transcripción con tiempos por palabra (Whisper small). Sirve para sincronizar las escenas y los subtítulos |
| `capitulos.json` | — | Inicio real de cada sección |

El volumen final se ajusta en `scripts/riqueza/mux.sh`: −14 LUFS con pico real de −1.5 dB, en dos pasadas para que quede parejo.

### Tomas elegidas

Se generaron 2 tomas por bloque y elegí la que más se parecía al guion según la transcripción. Todas coincidieron al 97–100 %. Las diferencias son números que Whisper escribe con cifras («90 %», «2.500»).

| Gancho | Más rico | Villano | Carnegie | Invisibles | Trabajadores | País | Cierre | Short 1 | Short 2 | Short 3 |
|---|---|---|---|---|---|---|---|---|---|---|
| B | A | A | A | A | B | A | B | A | B | A |

Créditos usados: unos 26,200 (las dos tomas de cada bloque). Todas las tomas siguen en el flow «La riqueza de otros — narración» de ElevenLabs.
