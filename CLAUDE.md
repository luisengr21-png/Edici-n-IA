# Canal de YouTube — reglas permanentes de producción

Estas reglas aplican a **todos** los videos que se produzcan en este repositorio (guion, edición, shorts y miniaturas).

## Canal "sin cara" (qué significa exactamente)
- **El creador nunca aparece**: ni su rostro, ni fotos ni videos suyos, ni avatares que lo representen.
- **El personaje principal ilustrado SÍ lleva rostro**: ojos, cejas, mejillas y boca, con expresiones según la escena (neutral, preocupado, sonriente). Es el personaje 2D "Tú" con sudadera/capucha mostaza (`src/lujo/elements.tsx`, componente `Person`).
- Las imágenes o clips realistas de personas (stock o IA) van sin rostros visibles: manos, siluetas, personas de espaldas, objetos y lugares.

## Automatizar todo
- Respaldo para escenas `LIVE` sin clip de Envato: imagen fotográfica generada con IA (ElevenLabs, `gpt-image-2.5-sunburst`, una variante por escena) en `recursos/stock/escena_NNN.jpg`, animada con Ken Burns. En verticales, imagen centrada sobre una versión desenfocada de la misma (`fit: 'blurfill'`).
- **Audio (música y efectos de sonido): usar el conector de Epidemic Sound** para todo lo relacionado con audio: buscar, descargar y, si hace falta, ajustar la duración de las pistas (EditRecording). Guardar lo descargado en `recursos/musica/` y `recursos/sfx/`. La síntesis por código queda solo como respaldo si Epidemic Sound no está disponible.
- **Visuales (escenas `LIVE`): Envato Elements, opción A elegida por el creador.** El conector solo busca, así que:
  1. Al terminar la Fase 1, busco en Envato (`search_stock_video`, y `search_photos` si conviene) el mejor clip para cada escena `LIVE` (sin rostros visibles, sin logos) y entrego `entregas/<video>/06_clips_envato.md`: escena, tiempo, enlace del clip y **nombre exacto del archivo** (`escena_NNN.mp4`).
  2. El creador descarga los clips (licencia registrada a su proyecto) y los deja en `recursos/stock/` con ese nombre.
  3. En la Fase 2 el pipeline los toma solos. Si falta algún clip, se usa una imagen generada con IA para esa escena y se avisa en la lista de pendientes.
- **Epidemic Sound ya está vinculado al canal de YouTube** (sin reclamos de Content ID).
- Miniaturas: fondo generado con IA (4 variantes, elegir la mejor) + texto añadido con código usando las tipografías del canal.

## Narración
- **Siempre la misma voz en todos los videos:** ElevenLabs, voz "BRIAN CM | Young LatAm Spanish Narrator" (`LY1fdYL8QcEDyEkAT4Qq`), modelo `eleven_v4`. No cambiarla salvo que el creador lo pida o grabe su propio audio.

## Cierre de los videos
- No hacer referencia a otros videos del canal salvo que el creador lo pida en ese video.

## Texto en pantalla
- **Nunca repetir el mismo texto o número dos veces en la misma escena al mismo tiempo** (por ejemplo, una etiqueta "$0.01" y debajo otra vez "$0.01", o un título que repite lo que dice una tarjeta). Cada dato aparece una sola vez por escena; si hace falta reforzarlo, se usa un ícono, un color o una animación, no el mismo texto.
- `scripts/lujo/viz.py` revisa esto automáticamente al generar el plan y se detiene si encuentra textos repetidos en una escena.
- La revisión compara textos completos y también números sueltos (precios, años, porcentajes) entre todos los elementos de una escena.
- El primer video («La trampa de la pobreza de lujo») se hizo antes de esta regla y tiene repeticiones en las escenas 45, 50, 123, 140, 200 y 213; para regenerarlo tal cual, ejecutar `PERMITIR_REPETIDOS=1 python3 scripts/lujo/viz.py`. En los videos nuevos, la regla es obligatoria.
