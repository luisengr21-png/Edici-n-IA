# Canal de YouTube — reglas permanentes de producción

Estas reglas aplican a **todos** los videos que se produzcan en este repositorio: guion, edición, shorts y miniaturas.

> **Reglas vigentes desde el 4.º video (noviembre 2026).**
> El creador pidió videos menos genéricos, para no arriesgar el canal por «contenido repetitivo». Por eso:
> - todos los recursos visuales los pone él;
> - el video lleva solo la voz en off;
> - no se generan imágenes con ElevenLabs.
>
> Los videos 1 a 3 se hicieron con las reglas anteriores (resumidas al final, solo como historial).

## Canal "sin cara" (qué significa exactamente)
- **El creador nunca aparece**: ni su rostro, ni fotos ni videos suyos, ni avatares que lo representen.
- **El personaje principal ilustrado SÍ lleva rostro**: ojos, cejas, mejillas y boca, con expresiones según la escena (neutral, preocupado, sonriente). Es el personaje 2D "Tú" con sudadera/capucha mostaza (`src/lujo/elements.tsx`, componente `Person`).
- **Rostros en fotos y clips de stock: permitidos.** El creador tiene licencia de todos los recursos que manda, así que se usan completos aunque se vean caras de otras personas. No se recortan ni se le pide cambiarlos por eso. (Decisión del creador, noviembre 2026, en el 4.º video.)
- En `06_recursos.md` ya no hace falta pedir «sin rostro». Solo se describe lo que debe verse.

## Carpetas de entrega: en orden cronológico
- Cada video tiene su carpeta en `entregas/`, con el número del video al inicio para que queden en orden: `01-pobreza-de-lujo`, `02-el-personaje-del-miedo`, `03-no-es-pereza-es-burnout`, `04-la-riqueza-de-otros`…
- **Cada video nuevo toma el siguiente número, con dos dígitos** (`05-…`, `06-…`, `10-…`), para que el orden no se rompa después del 9. Donde estas reglas dicen `entregas/<video>/`, `<video>` es ese nombre con número.

## 1. Recursos: todo lo pone el creador (yo uso lo mínimo)
- **Lo que yo genero se reduce al mínimo.** Las imágenes, fotos, clips, íconos, objetos, ilustraciones, fondos, cuadros de texto decorativos, marcos y overlays de cada escena **se los pido al creador**. No los dibujo por código ni los saco de otro lado.
- **Entregable de la Fase 1: `entregas/<video>/06_recursos.md`.** Es la lista completa de lo que necesito, escena por escena. Para cada recurso indica:
  - escena y tiempo aproximado;
  - qué es, con descripción concreta (ej.: «foto de un perro dormido en un sillón, sin personas», «video de una persona enojada de espaldas golpeando un escritorio»);
  - tipo: `video`, `foto`, `ilustración/ícono` (PNG con fondo transparente si va encima de otra cosa), `3D` o `cuadro de texto/marco`;
  - **nombre exacto del archivo**: `escena_NNN.mp4`, `foto_NNN.jpg`, `grafico_NOMBRE.png`, etc.;
  - la carpeta de `recursos/` donde va;
  - opcional: palabras clave en inglés y un enlace de Envato como sugerencia (el conector de Envato solo busca).
- **El creador sube todo a una carpeta de Google Drive.** Yo lo descargo a `recursos/` y lo integro en la Fase 2.
- **Si falta algún recurso,** no lo invento ni lo genero con IA. La escena queda con una solución sobria (texto sobre fondo liso o el recurso de la escena anterior) y lo aviso en `PENDIENTES.md`, para que me lo mande y vuelva a renderizar solo esa escena.
- **Los recursos con licencia no se suben al repositorio** (están en `.gitignore`).

**Decisiones del creador sobre lo que sigo haciendo yo:**
- **El personaje «Tú» lo sigo creando yo**, con código, por el momento.
- **Los subtítulos palabra por palabra de los shorts los sigo poniendo yo**, con código.
- **Los íconos y los textos en pantalla los hago yo, con código, siempre** (decisión del creador, noviembre 2026, desde el 5.º video).
  - El creador solo pone los **videos y las fotos**.
  - **Íconos:** emojis de color (Noto Color Emoji, licencia libre) o dibujos propios en SVG. Nunca siluetas negras de personajes.
  - **Textos en pantalla:** frases clave, cifras, nombres de sección y sellos, en Anton, con los colores de acento del video.
  - En `06_recursos.md` siguen listados para que el creador sepa qué va en cada escena, pero marcados como «los hago yo»; él no tiene que conseguirlos.
  - Sigue vigente la regla de no repetir el mismo texto dos veces en la misma escena.
- **Estas reglas aplican solo a los videos futuros.** Los videos 1 a 3 no se rehacen.

## 2. Audio: solo la voz en off
- **El video lleva únicamente la narración.** Nada de música, efectos de sonido, ambientes, risers ni firma sonora.
- La voz se normaliza a −14 LUFS (pico real −1.5 dB) para que el volumen sea parejo de principio a fin, sin subidas bruscas.
- Aplica al video largo y a los shorts.

## 3. Imágenes: no generar con ElevenLabs
- **No usar ElevenLabs para generar imágenes** (gasta muchos créditos). ElevenLabs se sigue usando **solo para la voz**.
- **Miniaturas del video largo:** entregar **10 ideas** en `entregas/<video>/04_miniaturas.md`, en el repositorio de GitHub. Cada idea lleva:
  - el concepto;
  - la composición;
  - el texto (máximo 3–4 palabras);
  - los colores;
  - el título con el que combina;
  - **el prompt listo para copiar**, en inglés, para cualquier generador de imágenes.

  El creador las genera por su cuenta (con otro generador o con Envato). Si después me pasa la imagen, le pongo el texto con código.
- Estilo que le gusta al creador (referencia del video 3: cerillos y pila en llamas):
  - foto conceptual realista de un solo objeto;
  - fondo liso de color fuerte (azul marino);
  - contraste de color (fuego naranja/rojo contra azul);
  - texto enorme y condensado (Anton), en blanco con un acento en rojo vivo;
  - texto centrado en el espacio libre.

## 4. Títulos: 10 propuestas con palabras clave
- Entregar **10 títulos** en `05_titulos_y_descripcion.md`, cada uno con la miniatura con la que combina.
- **Jugar con las palabras clave de búsqueda**: incluirlas de forma natural y, cuando ayude, escribir alguna en minúsculas para que destaque o se lea como búsqueda (ej.: «burnout: no es pereza, es agotamiento»).
- El título complementa la miniatura, no repite su texto.

## 5. Descripciones: más alegres, con emojis
- Las descripciones del video largo y de los shorts van con **tono alegre y cercano**, con **emojis**, pero **sin saturar**: unos pocos, donde sumen.
- Se mantienen los hashtags, los capítulos (en el largo) y las fuentes.

## 6. Shorts: título, descripción y miniatura por cada uno
Para cada short, además del video, entregar:
- **un título** recomendado (máximo 60–70 caracteres, con gancho y palabra clave);
- **una descripción** breve y alegre (1–2 líneas con algún emoji y 3–5 hashtags, incluido #Shorts);
- **una miniatura diseñada** (1080×1920, JPG) en `entregas/<video>/video/short_0N_miniatura.jpg`. Vigente desde el 4.º video (noviembre 2026):
  - no es un simple fotograma: es una portada pensada para atraer clics;
  - lleva el estilo del video (sus colores, su tipografía, sus recursos, el personaje «Tú» si aplica);
  - un elemento principal fuerte y un texto corto de 2 a 4 palabras, grande y con acento de color;
  - el texto complementa el título del short, no lo repite;
  - se arma con código, con los recursos del video (fotos, cuadros de los clips, íconos y textos); no se genera con ElevenLabs.

El título y la descripción de cada short van en `03_shorts.md`, en la Fase 1, y se confirman en `PENDIENTES.md`, en la Fase 2. La miniatura de cada short se entrega en la Fase 2.
- **Además, siempre en `05_titulos_y_descripcion.md` del mismo video**, en una sección al final llamada «Shorts: título y descripción». Ahí van los 3 shorts con:
  - el nombre del archivo;
  - el título y la descripción, cada uno en su propio bloque listo para copiar.

  Ahí es donde el creador los busca para subirlos. Si cambian en la Fase 2, se actualizan también ahí.

## Narración
- **Siempre la misma voz en todos los videos:** ElevenLabs, voz "BRIAN CM | Young LatAm Spanish Narrator" (`LY1fdYL8QcEDyEkAT4Qq`), modelo `eleven_v4`. No cambiarla salvo que el creador lo pida o grabe su propio audio.
- **Ritmo y emoción (desde el 5.º video):** la narración no debe sonar lineal.
  - **Velocidad variable según lo que pide cada momento:** más rápida en enumeraciones, tensión creciente o momentos divertidos; más lenta en revelaciones, datos fuertes y momentos tristes o reflexivos; pausas antes de los giros.
  - **Emociones que se noten en la voz:** alegría, tensión, tristeza, enojo, sorpresa, ironía o susurro, según la escena.
  - **En el guion:** marcar estas indicaciones en cada frase o párrafo que lo amerite. Se agregan a las de siempre, por ejemplo `[MÁS RÁPIDO]`, `[MÁS LENTO]`, `[ALEGRE]`, `[TENSO]`, `[TRISTE]`, `[ENOJADO]`, `[SORPRENDIDO]`, `[TONO IRÓNICO]` y `[SUSURRO]`.
  - **Al generar la voz:** convertir esas marcas en las etiquetas de audio de `eleven_v4` (por ejemplo `[quickly]`, `[slowly]`, `[excited]`, `[happy]`, `[nervous]`, `[sad]`, `[angry]`, `[surprised]`, `[sarcastic]`, `[whispers]`), consultando antes la guía del modelo.
  - **Generar por bloques cortos** cuando cambie mucho la emoción, para que cada parte tenga su tono.
  - **Revisar al escuchar** que no suene exagerado.

## Edición: fondos, transiciones y efectos (obligatorio, desde el 5.º video)
Aplica al video largo y a los shorts. Antes de programar un video, se define en `scripts/<video>/viz.py` un plan por escena con su fondo, su transición de entrada y los efectos de cada imagen. Se revisa automáticamente que no se repitan en escenas seguidas, igual que la regla de los textos.

**No aplica a las miniaturas del video largo:** esas siguen con el estilo de la sección 3 (fondo liso azul marino, un objeto y texto en Anton).

### Fondos
1. **No usar azul marino ni azul oscuro como fondo por defecto** (`#0a1128`, `#0f172a`, `#1a1a40`, `#0B1A3A`, `#121633` y similares). No es la preferencia del creador y se usaba demasiado.
2. **Cada escena con un fondo distinto de la anterior.** Antes de programar, se define una paleta por escena y no se repite el color dominante en dos escenas seguidas.
3. **Variar el tipo de fondo, no solo el color.** Alternar entre:
   - color sólido vibrante o pastel;
   - degradados lineales, radiales o cónicos;
   - degradados animados o «mesh gradient» en movimiento;
   - texturas (papel, grano de película, ruido, cuadrícula, puntos de semitono);
   - patrones geométricos animados (líneas, círculos, formas orgánicas flotantes);
   - imagen o video desenfocado, con una capa de color encima;
   - fondos claros o blancos cálidos (no todo debe ser oscuro).
4. **Buen contraste entre texto y fondo siempre** (mínimo WCAG AA).
5. **Coherencia:** 1 o 2 colores de acento recurrentes, para que el video se sienta una sola pieza aunque cambien los fondos.
6. **Detrás de «Tú», nunca fondos amarillos ni naranjas** (limón, óxido, durazno o cualquier tono parecido), porque se confunden con su sudadera mostaza. Se usan colores que contrasten con ella: azul cielo, lila, morado, azul petróleo, verde bosque o ciruela. (Decisión del creador, noviembre 2026, en el 5.º video.)

### Transiciones
1. **Nunca la misma transición en dos cortes seguidos.** Que no todo sea fade o corte simple.
2. **Catálogo variado**, según el ritmo y la emoción de cada corte:
   - movimiento: slide, push, wipe (horizontal, vertical, diagonal), zoom in/out, whip pan con desenfoque de movimiento;
   - formas: círculo que se expande (iris), barras o persianas, mosaico o píxeles, cortina con forma;
   - estilo digital: glitch, separación RGB, distorsión de ondas, desplazamiento por líneas de escaneo;
   - cinematográficas: cross-dissolve, fundido a color, flash blanco, light leak, desenfoque progresivo;
   - creativas: pasar página, rotación 3D o cubo, formas que se transforman, «líquido» o tinta, match cut con un elemento compartido.
3. **Duración de cada transición: 0.3–0.8 s.** Más rápidas en escenas enérgicas y más lentas en las emotivas. Siempre con easing (ease-in-out, spring), nunca con movimiento lineal.
4. **Solapar escenas:** cuando se pueda, elementos de la escena que sale se solapan con la que entra.

### Efectos en imágenes
Ninguna imagen aparece estática. Cada imagen (foto, clip, ícono o ilustración) lleva al menos 1 efecto de entrada y 1 de permanencia, y si aplica, 1 de salida. Los efectos varían entre imágenes:
- **Entrada:** revelado con máscara, zoom desde un punto, deslizamiento con rebote, de desenfocado a nítido, cortina por bloques, «polaroid» que cae, apertura con forma (círculo, rectángulo redondeado).
- **Permanencia:** Ken Burns (zoom y paneo lento), parallax por capas, flotación suave, rotación sutil, respiración (escala 1.00→1.04).
- **Tratamientos visuales:** grano de película, viñeta, glow o bloom, aberración cromática, semitono (halftone), bordes con sombra, recorte con forma (círculo, blob, arco).
  - **El color debe verse parejo en toda la imagen.** No usar duotono ni blanco y negro con acento de color, ni ningún efecto que cambie el color solo en una parte de la imagen. (Decisión del creador, noviembre 2026, en el 5.º video.)
- **Efectos especiales, de vez en cuando:** partículas, destellos (lens flare), light leaks, líneas de velocidad, brillo que barre la imagen (shine sweep), marcos animados, stickers o formas decorativas alrededor.
- **Dosificación:**
  - máximo 2 tratamientos visuales por imagen, sin perder legibilidad;
  - el efecto apoya el mensaje, no distrae.

## Cierre de los videos
- No hacer referencia a otros videos del canal salvo que el creador lo pida en ese video.

## Texto en pantalla
- **Nunca repetir el mismo texto o número dos veces en la misma escena al mismo tiempo.** Por ejemplo:
  - una etiqueta "$0.01" y debajo otra vez "$0.01";
  - un título que repite lo que dice una tarjeta.

  Cada dato aparece una sola vez por escena. Si hace falta reforzarlo, se usa un ícono, un color o una animación, no el mismo texto. En los shorts, el texto en pantalla tampoco repite lo que ya dicen los subtítulos en ese momento.
- `scripts/<video>/viz.py` revisa esto automáticamente al generar el plan y se detiene si encuentra textos repetidos en una escena.
- La revisión compara textos completos y también números sueltos (precios, años, porcentajes) entre todos los elementos de una escena.
- El primer video («La trampa de la pobreza de lujo») se hizo antes de esta regla y tiene repeticiones en las escenas 45, 50, 123, 140 y 200–213. Para regenerarlo tal cual, ejecutar `PERMITIR_REPETIDOS=1 python3 scripts/lujo/viz.py`. En los videos nuevos, la regla es obligatoria.

---

## Historial: reglas anteriores (videos 1 a 3, ya no se aplican)
- **Recursos:**
  - Envato Elements para clips, fotos, gráficos, 3D, fuentes y overlays, propuestos por mí en `06_recursos_envato.md`;
  - respaldo con imágenes generadas con IA (ElevenLabs, `gpt-image-2.5-sunburst`) en `recursos/stock/escena_NNN.jpg`.
- **Audio:** diseño sonoro completo con Epidemic Sound (varias pistas por sección, stems, EditRecording, ambientes, efectos variados y firma sonora del canal en `recursos/firma/`). Epidemic Sound sigue vinculado al canal, sin reclamos de Content ID.
- **Miniaturas:** 5 diseños con fondo generado con IA (4 variantes) más texto añadido con código.
