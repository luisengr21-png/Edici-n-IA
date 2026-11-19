# Pendientes · La trampa de la pobreza de lujo (Fase 2)

## Entregado
| Archivo | Formato | Duración |
|---|---|---|
| `la-trampa-de-la-pobreza-de-lujo.mp4` | 1920×1080 · 30 fps · H.264 + AAC · −14 LUFS | 15:20 |
| `short_01_si-te-tratan-mal.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:31 |
| `short_02_bolso-pago-inicial.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:28 |
| `short_03_parka-antartida.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:33 |
| `../miniaturas/miniatura_*.jpg` | 1280×720 · 5 diseños listos para subir | — |

Los capítulos con sus tiempos reales ya están en `../05_titulos_y_descripcion.md`.

### Revisión que hice
- Revisé el fotograma central de las 216 escenas del largo y de todas las de los shorts (hojas de contacto). Corregí lo que encontré: emojis sin color, la gráfica que se salía del cuadro, el calendario que decía «July 17», la balanza HOY/MAÑANA invertida, la jaula descentrada y los subtítulos con palabras pegadas.
- **Sincronía:** extraje fotogramas en el momento exacto en que la voz dice «Canada Goose», «rendición», «Pretty Woman», «pago inicial» y «enorme», y en todos aparece el visual correcto. Los cortes de escena salen de la transcripción por palabra, con un 97.8 % de las palabras alineadas.
- **Pantallas negras:** `blackdetect` solo encontró las tres pausas negras intencionales (escenas 74, 150 y 178). Les agregué un texto tenue para que no queden 3.6 s en negro total.
- **Subtítulos de los shorts:** comprobé que la palabra resaltada coincide con la que se dice, que el texto no se corta y que queda en la franja del 61 % al 68 % de la altura, fuera de los botones y de la descripción de YouTube.
- **Audio:** largo y shorts a −14 LUFS (±0.7), con la voz siempre por encima de la música (ducking).
- **Loop:** en los Shorts 1 y 2 el último fotograma repite el encuadre del primero.

---

## 1. Escenas «live action» (resuelto, sin clips de stock)
No había clips propios ni clave de un banco de stock, así que **generé con IA (ElevenLabs, modelo `gpt-image-2.5-sunburst`) una imagen fotográfica por escena**, siguiendo las palabras clave del guion técnico. En ninguna se ven rostros, logos ni texto.
- **Video largo:** 18 escenas (27, 28, 29, 30, 37, 64, 65, 66, 85, 89, 90, 91, 101, 145, 151, 189, 190 y 191). La imagen va a pantalla completa con zoom lento y paneo (efecto Ken Burns), un degradado para que se lea el texto y el texto de la escena encima.
- **Short 3:** las 3 primeras escenas. La imagen va centrada sobre una versión desenfocada de sí misma, para llenar el formato vertical.
- Las imágenes están en `recursos/stock/` (`escena_NNN.jpg`, `short3_NN.jpg`) y los prompts en `scripts/lujo/imagenes.json`. Para cambiar una, reemplaza el archivo con el mismo nombre y vuelve a renderizar; también funciona con un clip `.mp4`.

## 2. Música y efectos de sonido
- `recursos/sfx/` y `recursos/musica/` estaban vacías, así que **toda la música y los 212 efectos se sintetizaron con código**: `scripts/lujo-audio.mjs` y `scripts/lujo-shorts-audio.mjs`. Son originales, sin samples ni música con derechos.
- La música sigue la columna «Música» del guion técnico: estilo por sección, silencios totales donde estaban marcados y ducking debajo de la voz. Los efectos salen de la columna «Efectos de sonido».
- **Si prefieres música de una biblioteca** (por ejemplo, la Biblioteca de audio de YouTube), déjala en `recursos/musica/` y la cambio por la sintetizada. La mezcla ya baja la música automáticamente cuando hay voz.

## 3. Narración
- La voz es sintética (ElevenLabs, voz «BRIAN CM», modelo `eleven_v4`). Revisaste la pronunciación de los nombres: está bien.
- YouTube pide marcar como «contenido alterado o sintético» solo lo que parece real y no lo es. Una voz en off generada en un video de motion graphics normalmente no entra ahí, pero revisa la casilla al subirlo.

## 4. Mejoras opcionales (si quieres, las hago yo)
Funcionan bien con ilustración propia y emojis; estas son ideas para subirlas de nivel:
- **Retratos de Adam Smith, Marx, Veblen y Baudrillard** (escenas 42, 47, 57, 72 y 131): hoy son tarjetas con un ícono (sombrero, libro, Torre Eiffel). Lo ideal es un grabado de dominio público de cada uno.
- **Escena 161 (Pretty Woman, 1990):** es una boutique genérica con palmeras. **No uses fotogramas de la película** (tienen derechos).
- **Escena 18 (la mano de titiritero):** quedaría mejor con hilos dibujados hasta la silueta.
- **Escena 205 (la jaula se abre):** la jaula se levanta en lugar de abrir la puerta. Si quieres, animo la puerta.
- **Pantalla final (escenas 215–216):** el botón «Suscríbete» y el espacio libre a la derecha son para colocar los **elementos de pantalla final de YouTube** (12 s). El cierre ya no menciona ningún otro video.

## 5. Datos
Confirmaste los datos; ya quité las marcas `[VERIFICAR]` del guion.

---|---|
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
