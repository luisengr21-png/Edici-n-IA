# Audio · El personaje que fabricas por miedo

Narración generada con **ElevenLabs** (modelo `eleven_v4`), con la voz de siempre del canal: **«BRIAN CM | Young LatAm Spanish Narrator»** (`LY1fdYL8QcEDyEkAT4Qq`).
Las indicaciones de locución del guion se convirtieron en etiquetas de audio:

| Guion | Etiqueta de ElevenLabs |
|---|---|
| `[PAUSA]` | `[pause]` |
| `[PAUSA LARGA]` | `[long pause]` |
| `[SUSURRO]` | `[whispers]` |
| `[TONO IRÓNICO]` | `[sarcastic]` |
| `[MÁS RÁPIDO]` | `[quickly]` |

Las palabras marcadas con `[ÉNFASIS]` van en MAYÚSCULAS. Los textos exactos que se enviaron están en `scripts/personaje/tts/`.

| Archivo | Duración | Nota |
|---|---|---|
| `largo_narracion_completa.mp3` | 14:21 | Las 7 partes unidas, con 0.8 s de aire entre secciones y normalizadas a −16 LUFS |
| `short_01_oso-blanco.mp3` | 0:37 | −16 LUFS |
| `short_02_camiseta.mp3` | 0:32 | −16 LUFS |
| `short_03_dos-de-la-manana.mp3` | 0:32 | −16 LUFS |
| `partes/largo_0X_*.mp3` | — | La toma elegida de cada sección, sin procesar, por si hay que regenerar solo una |
| `transcripcion_palabras_*.json` | — | Transcripción con tiempos por palabra (Whisper small), que se usa para sincronizar escenas y subtítulos |

**Tomas elegidas.** Se generaron 2 tomas por bloque y elegí la que más se parecía al guion según la transcripción:

| Gancho | Sección 1 | Sección 2 | Sección 3 | Sección 4 | Sección 5 | Salida y cierre | Short 1 | Short 2 | Short 3 |
|---|---|---|---|---|---|---|---|---|---|
| A | A | A | A | A | B | B | A | A | A |

En la salida y cierre descarté la toma A porque se saltaba la frase «Oso blanco».
Todas las tomas siguen en el flow de ElevenLabs **«El personaje que fabricas por miedo – narración»**.

## Música y efectos (Epidemic Sound)

Todo viene de Epidemic Sound, con la licencia del canal, así que **no está en el repositorio**:

- la música está en `recursos/musica/personaje/`;
- los efectos están en `recursos/sfx/personaje/`.

| Sección | Pista |
|---|---|
| Gancho · Las dos de la mañana | *Fairy Memoirs* – Rand Aldo |
| 1 · El personaje | *Meet Me on the Moon* – Auxjack |
| 2 · El reflector | *I Have a Plan, Mr Norton* – Arthur Benson |
| 3 · El esfuerzo | *Excuse the Dog* – Stationary Sign |
| 4 · Las dos frases | *How Peculiar* – Peter Sandberg |
| 5 · Para qué socializamos | *Time on Our Side (Instrumental)* – Ten Towers |
| 6–7 · La salida y el cierre | *Renewal* – Aerian |
| Short 1 | *Excuse the Dog* |
| Short 2 | *I Have a Plan, Mr Norton* |
| Short 3 | *Fairy Memoirs* |

**Efectos (19):**
- golpe y transición: whoosh, impacto, sello;
- avisos y brillos: pop, ding, campanita, shimmer;
- ambiente: tic-tac, grillos, viento;
- tensión: riser, redoble, latido;
- humor: boing, risas;
- objetos y teléfono: papel, interruptor, vibración, tecleo.

`scripts/personaje/audio.py` asigna a cada escena el efecto que corresponde a la columna «Efectos de sonido» del guion técnico.
