# Audio · No es pereza, es burnout

## Narración

Narración generada con **ElevenLabs** (modelo `eleven_v4`), con la voz de siempre del canal: **«BRIAN CM | Young LatAm Spanish Narrator»** (`LY1fdYL8QcEDyEkAT4Qq`).

Las indicaciones de locución del guion se convirtieron en etiquetas de audio:

| Guion | Etiqueta de ElevenLabs |
|---|---|
| `[PAUSA]` | `[pause]` |
| `[PAUSA LARGA]` | `[long pause]` |
| `[SUSURRO]` | `[whispers]` |
| `[TONO IRÓNICO]` | `[sarcastic]` |
| `[MÁS RÁPIDO]` | `[quickly]` |

Las palabras marcadas con `[ÉNFASIS]` van en MAYÚSCULAS. Los textos exactos que se enviaron están en `scripts/burnout/tts/`.

| Archivo | Duración | Nota |
|---|---|---|
| `largo_narracion_completa.mp3` | 8:48 | Las 6 partes unidas, con 0.8 s de aire entre secciones, normalizadas a −16 LUFS |
| `short_01_celular-al-3.mp3` | 0:33 | −16 LUFS |
| `short_02_te-quemaste.mp3` | 0:31 | −16 LUFS |
| `short_03_cinco-escalones.mp3` | 0:35 | −16 LUFS |
| `partes/largo_0X_*.mp3` | — | La toma elegida de cada bloque, sin procesar, por si hay que regenerar solo una |
| `transcripcion_palabras_*.json` | — | Transcripción con tiempos por palabra (Whisper small). Sirve para sincronizar las escenas y los subtítulos |

### Tomas elegidas

Se generaron 2 tomas por bloque y elegí la que más se parecía al guion según la transcripción.

| Gancho | Señales 1–2 | Señales 3–4 | Señal 5 | Señal 6 | Salida y cierre | Short 1 | Short 2 | Short 3 |
|---|---|---|---|---|---|---|---|---|
| A | B | A | B | B | A | A | A | A |

- **Señales 1–2:** la toma A se saltaba la frase «Número dos. Antes estabas motivado».
- **Señal 6:** la toma B coincide palabra por palabra con el guion.

Todas las tomas siguen en el flow de ElevenLabs.

## Música y efectos (Epidemic Sound)

Todo el audio viene de Epidemic Sound, con la licencia del canal, así que **no está en el repositorio**:
- la música está en `recursos/musica/burnout/`;
- los efectos están en `recursos/sfx/burnout/`;
- la firma sonora está en `recursos/firma/firma_canal.mp3`.

La mezcla la arma `scripts/burnout/audio.py`, y `scripts/burnout/mux.sh` la une con la voz.

### Música: varias pistas por sección

| Tramo | Pista (Epidemic Sound) | Cómo se usa |
|---|---|---|
| Gancho: el cuarto a las 4 p. m. | «Old Toys» – By Lotus | Pad cálido. **Corte seco** justo en «FLOJO» |
| Gancho: la pregunta | «Make No Mistakes» – Bonnie Grace | Pulso de intriga. Baja en «desde afuera se ven iguales» |
| Señal 1: piloto automático | «Little Candle» – Dylan Sitts | Versión **amortiguada** (filtro de graves) mientras habla de la desconexión, con silencio de 1 s en «despersonalización» |
| Señal 2: «antes estabas motivado» | «Little Candle» (mezcla completa) | Entra la batería en el mismo punto del tema. Baja de golpe en «te quemaste», con 1 s de silencio |
| «Nadie se quema…» | «Make No Mistakes» | Vuelve el pulso |
| Señal 3: la pasión | «Bittersweet Skyline» – American Legion | Melancólico y cálido |
| Señal 4: la mecha corta | «Displaced» – Robert Ruth | Mezcla completa; en «el mal humor…» se cambia al **stem INSTRUMENTS** (sin batería) |
| El contraste con la flojera | «Old Toys» | Más ligero |
| Señal 5: la batería en rojo | «Cosmic Slumber» – Valante | Pad grave. Baja 12 dB en «piensa en un celular al 3 %» |
| El cargador | «Love for the Moon» – Autumn Cheek | Cálido y esperanzador |
| Señal 6: las cinco etapas | «The Resistance» – Jo Wandrini | **Versión de 58 s hecha con EditRecording**: el crescendo llega a su punto más alto justo en «y cinco: el burnout». Ahí la música se corta 1 s |
| La etapa 5 | «Cosmic Slumber» | Pad oscuro con la neblina |
| «Se puede salir» | «The Last Horizon» – Aerian | Esperanzador |
| La pregunta del final | «Feeling Minnesota» – Gavin Luke | Piano emotivo |
| Clímax y cierre | «The Last Horizon» | **Versión de 32 s hecha con EditRecording**: termina exacto con el video |

En los shorts va una pista por short:
- **Short 1:** «Cosmic Slumber»;
- **Short 2:** «Little Candle»;
- **Short 3:** «The Resistance».

Nota sobre los stems: el stem INSTRUMENTS de «Little Candle» casi no trae sonido (la melodía va en otro stem que Epidemic no deja descargar). Por eso, para el piloto automático usé la mezcla completa con un filtro que la hace sonar amortiguada, como desde lejos.

### Ambientes por lugar

- el cuarto de tarde, con reloj de pared;
- interior de coche;
- lluvia en la ventana;
- proyector de cine;
- pájaros (la hamaca);
- viento (la neblina).

### Efectos

72 efectos distintos, con varias versiones de whoosh, pop, impacto y riser que se van turnando.

- Antes de cada pico de dopamina (⚡) hay un **riser**.
- Al empezar cada sección hay un **whoosh de transición**.

### Firma sonora del canal

«Musical, Synthesized, Logo, Short, Tonal, Synth, Startup, Warm Chord». Suena en la apertura del video, en la pantalla final y en el último segundo de los shorts 1 y 3 (los que hacen loop). Queda guardada en `recursos/firma/` para reutilizarla en todos los videos.
