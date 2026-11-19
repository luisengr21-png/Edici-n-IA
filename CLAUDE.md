# Canal de YouTube — reglas permanentes de producción

Estas reglas aplican a **todos** los videos que se produzcan en este repositorio (guion, edición, shorts y miniaturas).

## Canal "sin cara" (qué significa exactamente)
- **El creador nunca aparece**: ni su rostro, ni fotos ni videos suyos, ni avatares que lo representen.
- **El personaje principal ilustrado SÍ lleva rostro**: ojos, cejas, mejillas y boca, con expresiones según la escena (neutral, preocupado, sonriente). Es el personaje 2D "Tú" con sudadera/capucha mostaza (`src/lujo/elements.tsx`, componente `Person`).
- Las imágenes o clips realistas de personas (stock o IA) van sin rostros visibles: manos, siluetas, personas de espaldas, objetos y lugares.

## Automatizar todo
- El creador **no tiene clips de stock propios**. Para las escenas `LIVE`, generar imágenes fotográficas con IA (ElevenLabs, `gpt-image-2.5-sunburst`, una variante por escena), guardarlas en `recursos/stock/escena_NNN.jpg` y animarlas con Ken Burns. En verticales, usar una imagen centrada sobre una versión desenfocada de la misma (`fit: 'blurfill'`).
- Música y efectos: si `recursos/musica` y `recursos/sfx` están vacías, sintetizarlos con código (sin samples ni música con derechos).
- Miniaturas: fondo generado con IA (4 variantes, elegir la mejor) + texto añadido con código usando las tipografías del canal.

## Narración
- Voz: ElevenLabs, voz "BRIAN CM | Young LatAm Spanish Narrator" (`LY1fdYL8QcEDyEkAT4Qq`), modelo `eleven_v4`, salvo que el creador grabe su propio audio.

## Cierre de los videos
- No hacer referencia a otros videos del canal salvo que el creador lo pida en ese video.
