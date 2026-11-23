# Pendientes · El personaje que fabricas por miedo (Fase 2)

> **Actualización (corrección de los clips):** en la primera entrega, los 12 clips de Envato del video largo y el clip de cada short se veían congelados en su último cuadro; solo se movía el zoom lento. La causa era un error del motor: cada escena no tenía su propio `Sequence`, así que el clip se buscaba en el segundo absoluto del video, que ya pasaba su duración. Ya está corregido en `src/personaje/Main.tsx` y `Shorts.tsx`. Volví a renderizar las 12 escenas con clip (10, 32, 65, 82, 99, 113, 126, 129, 131, 156, 169 y 170) y los 3 shorts, y rehíce la mezcla. Ahora los clips se reproducen desde su inicio. Si ya subiste el video a YouTube, conviene reemplazarlo por este archivo.

## Entregado
| Archivo | Formato | Duración |
|---|---|---|
| `el-personaje-que-fabricas-por-miedo.mp4` | 1920×1080 · 30 fps · H.264 + AAC · −14 LUFS | 14:33 |
| `short_01_oso-blanco.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:37 |
| `short_02_camiseta.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:33 |
| `short_03_dos-de-la-manana.mp4` | 1080×1920 · 30 fps · subtítulos quemados | 0:33 |
| `../miniaturas/miniatura_*.jpg` | 1280×720 · 5 diseños listos para subir | — |

Los capítulos, con sus tiempos reales, ya están en `../05_titulos_y_descripcion.md`.

### Lo que se cumplió de las reglas del canal
- **Voz:** la de siempre (ElevenLabs, BRIAN CM, `eleven_v4`).
- **Música y efectos:** todo de Epidemic Sound: 7 pistas y 19 efectos. El canal ya está vinculado, así que no debería haber reclamos de Content ID.
- **Clips:** los 12 de Envato que descargaste, en las escenas `LIVE`. No hizo falta ninguna imagen de respaldo con IA.
- **Personaje "Tú" con rostro:** cambia de expresión entre preocupado, neutral y feliz. Su amigo de sudadera menta también tiene rostro.
- **Sin rostros reales:**
  - en los clips solo se ven manos, siluetas a contraluz y gente de espaldas;
  - las siluetas ilustradas no tienen cara.
- **Texto en pantalla sin repetir:** `scripts/personaje/viz.py` revisó las 214 escenas y pasó sin la excepción `PERMITIR_REPETIDOS`.
- **Cierre:** no menciona otros videos del canal.

### Revisión que hice
- **Hojas de contacto:** revisé un fotograma de cada una de las 214 escenas y de todas las escenas de los shorts. Corregí lo siguiente:
  - las cejas de «preocupado» le daban al personaje cara de enojado;
  - el oso se veía muy chico;
  - la cara en la cama se veía muy chica;
  - las palomitas y las X tapaban el texto de las tarjetas;
  - la escena 127 (Sócrates) tenía un ícono de la Isla de Pascua y lo cambié por un templo griego;
  - el título del video (escena 24) no alcanzaba a aparecer completo en 0.8 s.
- **Sincronía:** extraje fotogramas en el momento exacto en que la voz dice «Barry Manilow», «Delfos», «cuarenta años» y «vibrante», y en los cuatro aparece el visual correcto. Los cortes de escena salen de la transcripción por palabra, con un 98.9 % de palabras alineadas.
- **Duración y fotogramas:** el largo tiene 26,181 fotogramas (14:33 = 14:21 de narración + 12 s de pantalla final). Pesa 87 MB.
- **Pantallas negras:** `blackdetect` no encontró ninguna.
- **Silencios:** el único silencio largo (2.6 s, en el minuto 6:19) es el de «durante los próximos cinco segundos, no pienses en un oso blanco». Es intencional.
- **Audio:** el largo y los shorts quedaron a −14 LUFS (±0.6). La voz siempre va por encima de la música (ducking).
- **Loop:** en los Shorts 1 y 3, la última escena repite el encuadre de la primera.

---

## 1. Revisa estos puntos al verlo
- **Escena 169 («Algunas duran cinco minutos…»):** el clip de la fila es un piso con huellas y la frase «PLEASE STAND HERE». No tiene caras ni logos, pero el letrero está en inglés. Si prefieres otro clip, déjalo como `recursos/stock/escena_169.mp4` y vuelvo a renderizar solo esa escena.
- **Escena 32 (la respiración):** es una silueta a contraluz y en algún momento se ve el perfil oscuro, sin rasgos.
- **Pantalla final (escenas 213–214, 16 s):** el botón «Suscríbete» y el espacio libre a la derecha son para los **elementos de pantalla final de YouTube**.

## 2. Licencias
- **Clips de Envato:** quedaron en `recursos/stock/` (fuera del repositorio). Registra la licencia de cada uno a este proyecto en Envato, si no lo hiciste al descargarlos.
- **Música y efectos de Epidemic Sound:** quedaron en `recursos/musica/personaje/` y `recursos/sfx/personaje/` (también fuera del repositorio). En `audio/el-personaje-del-miedo/LEEME.md` está la lista de pistas por sección.

## 3. Narración
- Es voz sintética. YouTube pide marcar como «contenido alterado o sintético» solo lo que parece real y no lo es. Una voz en off sobre ilustraciones normalmente no entra ahí, pero revisa la casilla al subirlo.
- Las fuentes de los datos están al final de `../05_titulos_y_descripcion.md`, para el comentario fijado.

---

## Cómo editar y volver a renderizar
```bash
npm install
python3 scripts/personaje/viz.py          # plan visual escena por escena → src/personaje/plan.json
python3 scripts/personaje/viz_shorts.py   # plan de los shorts             → src/personaje/shorts.json
python3 scripts/personaje/audio.py        # música y efectos (Epidemic Sound) del largo y los shorts
npx remotion studio src/index.ts          # previsualizar: PersonajeMiedo y PersonajeMiedoShort1–3
npx remotion render src/index.ts PersonajeMiedo out/personaje-mudo.mp4 --concurrency=4
for n in 1 2 3; do npx remotion render src/index.ts PersonajeMiedoShort$n out/personaje-short$n-mudo.mp4; done
bash scripts/personaje/mux.sh             # mezcla y exporta a entregas/02-el-personaje-del-miedo/video/
node scripts/personaje/miniaturas.mjs     # las 5 miniaturas
```
- **Cambiar una escena:** edita su línea `S(n, ...)` en `scripts/personaje/viz.py`. Los elementos están en `src/personaje/elements.tsx`; los propios de este video (reloj, máscara, reflector, oso, isla, medidor, globo de pensamiento y cama) están al final del archivo.
- **Si cambias la narración:** regenera el audio, vuelve a transcribirlo con `scripts/lujo/check_take.py` y realinea con `scripts/personaje/align.py`.
- **En otra máquina:** quita `--browser-executable` y Remotion descarga su propio navegador. Para los clips, la música y los efectos, vuelve a poner los archivos en `recursos/` (no están en el repositorio por licencia).

---

## Miniatura del Short 1 (oso blanco) · agregada a pedido del creador
- `short_01_miniatura.jpg`: fotograma del propio short (0:30), sin subtítulos. Muestra al personaje con el oso blanco y el texto «ES EL OSO BLANCO». Es 1080×1920.
- `short_01_miniatura_con-texto.jpg`: el mismo fotograma con «NO PIENSES EN ÉL» abajo, en blanco y rojo vivo (tipografía Anton), para llenar el espacio que el video deja para los subtítulos. **Es la recomendada para que llame más la atención.**

Para sacar otro fotograma: `node scripts/personaje/fotograma_short.mjs <short> <segundo> <salida.jpg>`.
