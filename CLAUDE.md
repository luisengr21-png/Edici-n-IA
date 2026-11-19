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
- **Los clips, la música y los efectos con licencia no se suben al repositorio** (están en `.gitignore`). El creador los pasa por una carpeta compartida de Google Drive y yo los descargo a `recursos/`.

## Sacarle el máximo jugo a Envato y Epidemic Sound (a partir del 3.er video)
El creador pidió aprovechar a fondo las dos suscripciones para que los videos no se vean ni suenen genéricos.

**Envato Elements: no solo clips `LIVE`.** En la Fase 1 hay que buscar y proponer recursos de todas las categorías útiles:
- `search_stock_video`: clips reales sin rostros ni logos;
- `search_photos`: fotos para fondos, texturas, objetos y lugares, con Ken Burns, recortes o fotos dentro de marcos;
- `search_graphics`: ilustraciones, íconos, texturas, papel, grano y formas vectoriales que enriquezcan las escenas 2D y de motion;
- `search_3d`: objetos o personajes 3D para los picos de dopamina o los momentos clave;
- `search_fonts`: una tipografía con personalidad para los títulos de ese video, además de Montserrat y Playfair;
- `search_graphic_templates` y `search_video_templates`: overlays, transiciones, texturas de luz o marcos, cuando sumen.

El entregable `06_clips_envato.md` pasa a llamarse **`06_recursos_envato.md`**. Va organizado por tipo de recurso y, para cada uno, indica:
- escena y tiempo;
- enlace principal y una alternativa;
- **nombre exacto del archivo**: `escena_NNN.mp4`, `foto_NNN.jpg`, `grafico_NOMBRE.svg/png`, `3d_NOMBRE.glb/png` o `fuente_NOMBRE.ttf`;
- la carpeta de `recursos/` donde va: `stock/`, `fotos/`, `graficos/`, `3d/` o `fuentes/`.

El conector solo busca. El creador descarga los recursos y yo los integro en la Fase 2. Si falta alguno, la escena se resuelve como antes y lo aviso en la lista de pendientes.

**Epidemic Sound: diseño sonoro completo, no solo una pista por sección.** Se usa para:
- **varias pistas por sección** cuando cambie la energía, y **stems** (DRUMS, BASS, INSTRUMENTS) para quitar o sumar capas en los momentos tensos o en los clímax;
- **EditRecording** para ajustar cada pista a la duración exacta de su sección y hacer que el golpe musical caiga en los picos marcados con ⚡;
- **ambientes de fondo** según el lugar de la escena (noche, ciudad, café, salón, naturaleza);
- **más variedad de efectos**, con varias versiones de cada uno (whoosh, pop, impacto) para que no suene repetido, más risers antes de los picos y transiciones sonoras entre secciones;
- una **firma sonora** corta del canal para la apertura y el cierre, que se reutiliza en todos los videos.

## Shorts: entregables extra (a partir del 3.er video)
Para cada short, además del video, entregar:
- **un fotograma para usar como miniatura** (1080×1920, JPG), elegido del propio short, en `entregas/<video>/video/short_0N_miniatura.jpg`;
- **un título** para el short (máximo 60–70 caracteres, con gancho);
- **una descripción breve** (1–2 líneas + 3–5 hashtags, incluido #Shorts).

El título y la descripción van en `03_shorts.md`, en la Fase 1, y se confirman en `PENDIENTES.md`, en la Fase 2.

## Narración
- **Siempre la misma voz en todos los videos:** ElevenLabs, voz "BRIAN CM | Young LatAm Spanish Narrator" (`LY1fdYL8QcEDyEkAT4Qq`), modelo `eleven_v4`. No cambiarla salvo que el creador lo pida o grabe su propio audio.

## Cierre de los videos
- No hacer referencia a otros videos del canal salvo que el creador lo pida en ese video.

## Texto en pantalla
- **Nunca repetir el mismo texto o número dos veces en la misma escena al mismo tiempo** (por ejemplo, una etiqueta "$0.01" y debajo otra vez "$0.01", o un título que repite lo que dice una tarjeta). Cada dato aparece una sola vez por escena; si hace falta reforzarlo, se usa un ícono, un color o una animación, no el mismo texto.
- `scripts/lujo/viz.py` revisa esto automáticamente al generar el plan y se detiene si encuentra textos repetidos en una escena.
- La revisión compara textos completos y también números sueltos (precios, años, porcentajes) entre todos los elementos de una escena.
- El primer video («La trampa de la pobreza de lujo») se hizo antes de esta regla y tiene repeticiones en las escenas 45, 50, 123, 140, 200 y 213; para regenerarlo tal cual, ejecutar `PERMITIR_REPETIDOS=1 python3 scripts/lujo/viz.py`. En los videos nuevos, la regla es obligatoria.
