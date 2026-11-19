# Pendientes · La trampa de la pobreza de lujo (Fase 2)

## Entregado
| Archivo | Formato | Duración |
|---|---|---|
| `la-trampa-de-la-pobreza-de-lujo.mp4` | 1920×1080 · 30 fps · H.264 + AAC · −14 LUFS | 15:23 |
| `short_01_si-te-tratan-mal.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:31 |
| `short_02_bolso-pago-inicial.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:28 |
| `short_03_parka-antartida.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:33 |

Los capítulos con sus tiempos reales ya están en `../05_titulos_y_descripcion.md`.

### Revisión que hice
- Revisé el fotograma central de las 216 escenas del largo y de todas las de los shorts (hojas de contacto). Corregí lo que encontré: emojis sin color, la gráfica que se salía del cuadro, el calendario que decía «July 17», la balanza HOY/MAÑANA invertida, la jaula descentrada y los subtítulos con palabras pegadas.
- **Sincronía:** extraje fotogramas en el momento exacto en que la voz dice «Canada Goose», «rendición», «Pretty Woman», «pago inicial» y «enorme», y en todos aparece el visual correcto. Los cortes de escena salen de la transcripción por palabra, con un 97.8 % de las palabras alineadas.
- **Pantallas negras:** `blackdetect` solo encontró las tres pausas negras intencionales (escenas 74, 150 y 178). Les agregué un texto tenue para que no queden 3.6 s en negro total.
- **Subtítulos de los shorts:** comprobé que la palabra resaltada coincide con la que se dice, que el texto no se corta y que queda en la franja del 61 % al 68 % de la altura, fuera de los botones y de la descripción de YouTube.
- **Audio:** largo y shorts a −14 LUFS (±0.7), con la voz siempre por encima de la música (ducking).
- **Loop:** en los Shorts 1 y 2 el último fotograma repite el encuadre del primero.

---

## 1. Clips de stock que faltan (marcador visible «CLIP DE STOCK PENDIENTE»)
No había clave de Pexels ni de Pixabay ni clips en `recursos/stock/`, así que estas escenas llevan un marcador con un ícono y las palabras clave.

**Para reemplazarlos:** guarda cada clip en `recursos/stock/` con el nombre de la tabla (vale `.mp4`, `.mov`, `.webm`, `.jpg` o `.png`). Luego ejecuta `python3 scripts/lujo/viz.py` y vuelve a renderizar. El clip entra solo, recortado a pantalla completa y con un zoom lento. El texto de la escena se mantiene encima.

### Video largo (18)
| Escena | Tiempo | Archivo | Palabras clave (inglés) |
|---|---|---|---|
| 27 | 1:27 | `escena_027.mp4` | `vintage sewing machine hands close up`, `old garment workshop` |
| 28 | 1:33 | `escena_028.mp4` | `fabric rolls workshop`, `workwear jacket stitching close up` |
| 29 | 1:37 | `escena_029.mp4` | `arctic blizzard person parka back view`, `snowstorm worker back view` |
| 30 | 1:43 | `escena_030.mp4` | `antarctica research station`, `scientist snow expedition back view` |
| 37 | 2:13 | `escena_037.mp4` | `luxury shopping street night bokeh`, `people walking winter coats city back view` |
| 64 | 4:14 | `escena_064.mp4` | `scuba diver underwater vintage`, `luxury wristwatch macro close up` |
| 65 | 4:19 | `escena_065.mp4` | `vintage airplane aluminum fuselage rivets`, `aluminum suitcase airport` |
| 66 | 4:24 | `escena_066.mp4` | `luxury gym interior empty`, `dumbbells rack close up` |
| 85 | 5:47 | `escena_085.mp4` | `latin american city aerial apartment buildings`, `mexico city aerial`, `bogota buildings aerial`, `lima skyline` |
| 89 | 6:03 | `escena_089.mp4` | `hands counting money close up`, `empty wallet hands` |
| 90 | 6:08 | `escena_090.mp4` | `latte art barista hands close up` |
| 91 | 6:11 | `escena_091.mp4` | `manicure hands close up`, `concert crowd lights`, `contactless phone payment` |
| 101 | 6:47 | `escena_101.mp4` | `hammock beach feet relaxing`, `airplane window view clouds` |
| 145 | 10:17 | `escena_145.mp4` | `credit card payment terminal close up`, `tap to pay card hands` |
| 151 | 10:43 | `escena_151.mp4` | `businessman walking city back view`, `office worker laptop hands` |
| 189 | 13:20 | `escena_189.mp4` | `person walking out office building back view sunlight` |
| 190 | 13:23 | `escena_190.mp4` | `backpacker hiking mountain back view` |
| 191 | 13:27 | `escena_191.mp4` | `holding elderly hands close up`, `family dinner table hands` |

### Short 3 (3)
Las tres primeras escenas del Short 3 también son marcadores: `antarctica blizzard person parka back view`, `sunny city street people walking back view` y `vintage sewing machine hands close up`. Ahí los clips se ponen en el plan de los shorts, `scripts/lujo/viz_shorts.py`, con `src=`. Si me pasas los clips, lo hago yo.

> Otra opción: si agregas una clave de **Pexels** (o Pixabay), descargo los clips con estas palabras clave y vuelvo a renderizar.

---

## 2. Música y efectos de sonido
- `recursos/sfx/` y `recursos/musica/` estaban vacías, así que **toda la música y los 212 efectos se sintetizaron con código**: `scripts/lujo-audio.mjs` y `scripts/lujo-shorts-audio.mjs`. Son originales, sin samples ni música con derechos.
- La música sigue la columna «Música» del guion técnico: estilo por sección, silencios totales donde estaban marcados y ducking debajo de la voz. Los efectos salen de la columna «Efectos de sonido».
- **Si prefieres música de una biblioteca** (por ejemplo, la Biblioteca de audio de YouTube), déjala en `recursos/musica/` y la cambio por la sintetizada. La mezcla ya baja la música automáticamente cuando hay voz.

## 3. Narración
- La voz es sintética (ElevenLabs, voz «BRIAN CM», modelo `eleven_v4`), no grabada por ti como decía el plan original.
- Conviene revisar de oído los nombres en inglés: Sam Tick, Dani Reiss, L.L. Bean, Eddie Bauer, Equinox, Baudrillard, Pretty Woman y High Earners, Not Rich Yet. También la frase «herramienta para buzos y pilotos», hacia el minuto 4:14: la transcripción automática entendió «abusos». Si algo suena mal, se regenera solo ese bloque y se vuelve a mezclar.
- YouTube pide marcar como «contenido alterado o sintético» solo lo que parece real y no lo es. Una voz en off generada en un video de motion graphics normalmente no entra ahí, pero revisa la casilla al subirlo. En la descripción dejé una nota opcional al respecto.

## 4. Escenas que conviene mejorar a mano
Están resueltas con ilustración propia y emojis, y funcionan, pero un ilustrador o un clip las subiría de nivel:
- **Retratos de Adam Smith, Marx, Veblen y Baudrillard** (escenas 42, 47, 57, 72 y 131): hoy son tarjetas con un ícono (sombrero, libro, Torre Eiffel). Lo ideal es un grabado de dominio público de cada uno.
- **Escena 161 (Pretty Woman, 1990):** es una boutique genérica con palmeras. **No uses fotogramas de la película** (tienen derechos).
- **Escena 18 (la mano de titiritero):** quedaría mejor con hilos dibujados hasta la silueta.
- **Escena 205 (la jaula se abre):** la jaula se levanta en lugar de abrir la puerta. Si quieres, animo la puerta.
- **Pantalla final (escenas 214–216):** el espacio de la tarjeta «Ansiedad por el estatus» y el botón «Suscríbete» es para colocar ahí los **elementos de pantalla final de YouTube**, que duran 12 s.
- **Miniaturas:** en la Fase 1 quedaron los prompts. No las generé como imagen; dime si las quieres.

## 5. Datos marcados con [VERIFICAR] antes de publicar
| Dato | Dónde aparece |
|---|---|
| Canada Goose: fundación en 1957 como Metro Sportswear (Sam Tick), fabricaba para L.L. Bean y Eddie Bauer, Dani Reiss CEO desde 2001 | 1:24–2:10 |
| Fecha del «valor funcional»: tu guion dice años 60; la referencia más citada es Sheth, Newman y Gross (1991) | ≈3:22 |
| Orígenes del Rolex (Submariner 1953, GMT-Master para Pan Am) y del aluminio de Rimowa | ≈4:14 |
| Membresías de Equinox «de cientos de dólares al mes» | ≈4:24 |
| Gráfica de precios (Mark J. Perry/AEI, datos de la BLS): qué categorías pasan del +100 % | 5:05–6:00 |
| Tim Gurner y el «pan con aguacate» (60 Minutes Australia, 2017) | ≈7:13 |
| La cifra de 4,000–10,000 anuncios al día (el guion ya dice que es dudosa) | 8:04 |
| Uso de «compra ahora, paga después» para comprar comida (encuestas de EE. UU.) | ≈10:20 |
| El término HENRY (Shawn Tully, Fortune, 2003) | ≈10:50 |
| Ward y Dahl, 2014, «Should the Devil Sell Prada?», Journal of Consumer Research | ≈11:39 |

---

## Cómo editar y volver a renderizar
```bash
npm install
python3 scripts/lujo/viz.py          # plan visual escena por escena  → src/lujo/plan.json
python3 scripts/lujo/viz_shorts.py   # plan de los shorts             → src/lujo/shorts.json
node scripts/lujo-audio.mjs          # música + efectos del largo
node scripts/lujo-shorts-audio.mjs   # música + efectos de los shorts
npx remotion studio src/index.ts     # previsualizar: composiciones PobrezaDeLujo y PobrezaDeLujoShort1–3
npx remotion render src/index.ts PobrezaDeLujo out/lujo-mudo.mp4 --concurrency=4
for n in 1 2 3; do npx remotion render src/index.ts PobrezaDeLujoShort$n out/lujo-short$n-mudo.mp4; done
bash scripts/lujo-mux.sh             # mezcla y exporta a entregas/pobreza-de-lujo/video/
```
- **Cambiar una escena:** edita su línea `S(n, ...)` en `scripts/lujo/viz.py`. Los elementos disponibles (texto, etiqueta, persona, vendedora, casa, bolso, jaula, balanza, sello, gráfica, teléfono, marco, neón, contador de piezas…) están en `src/lujo/elements.tsx`.
- **Si cambias la narración:** regenera el audio, vuelve a transcribirlo con `scripts/lujo/check_take.py` y realinea con `scripts/lujo/align.py`, que escribe `scripts/lujo/plan_base.json`.
- En otra máquina, quita `--browser-executable` y Remotion descarga su propio navegador.
