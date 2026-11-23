# Pendientes · No es pereza, es burnout (Fase 2)

## Entregado

| Archivo | Formato | Duración |
|---|---|---|
| `no-es-pereza-es-burnout.mp4` | 1920×1080 · 30 fps · H.264 + AAC · −14 LUFS | 9:00 |
| `short_01_celular-al-3.mp4` | 1080×1920 · 30 fps · subtítulos quemados · −14 LUFS | 0:34 |
| `short_02_te-quemaste.mp4` | 1080×1920 · 30 fps · subtítulos quemados · −14 LUFS | 0:32 |
| `short_03_cinco-escalones.mp4` | 1080×1920 · 30 fps · subtítulos quemados · −14 LUFS | 0:35 |
| `short_0N_miniatura.jpg` | 1080×1920 · fotograma de cada short, sin subtítulos | — |
| `../miniaturas/miniatura_*.jpg` | 1280×720 · 5 diseños listos para subir | — |

El largo dura 9:00: 8:48 de narración más 12 s de pantalla final.

Los capítulos, con sus tiempos reales, ya están en `../05_titulos_y_descripcion.md`.

## Shorts: título, descripción y miniatura

### Short 1 · `short_01_celular-al-3.mp4`
- **Título:** El peor consejo para alguien con burnout 🔋
- **Descripción:** "Échale ganas" no carga una batería al 3 %. Si te sientes así, no es flojera: es agotamiento. #Burnout #SaludMental #Psicologia #Shorts
- **Miniatura:** `short_01_miniatura.jpg`. Es el celular 3D al 3 %, con el número en rojo (0:02).
  - En la Fase 1 había propuesto el megáfono, pero en ese momento ya no hay texto en pantalla. El celular se lee mejor en tamaño chico.

### Short 2 · `short_02_te-quemaste.mp4`
- **Título:** ¿Flojera o burnout? La diferencia en 30 segundos 🔥
- **Descripción:** Si antes tenías ganas, metas y pasión, y hoy no puedes, no te volviste flojo. Te quemaste. #Burnout #Pereza #SaludMental #Shorts
- **Miniatura:** `short_02_miniatura.jpg`. Es el cerillo de Envato encendido, con «NO ES FLOJERA» (0:25).

### Short 3 · `short_03_cinco-escalones.mp4`
- **Título:** Las 5 etapas del burnout: ¿en cuál estás tú? 🪜
- **Descripción:** El burnout no llega de golpe, llega por escalones. Ubícate hoy: también se puede salir. #Burnout #EtapasDelBurnout #SaludMental #Shorts
- **Miniatura:** `short_03_miniatura.jpg`. Es la escalera completa con el marcador y «¿TÚ?» (0:34).

Los textos en pantalla de los shorts cambiaron un poco respecto a la Fase 1, para no repetir lo que ya dicen los subtítulos. La tabla está en `../03_shorts.md`.

## Lo que se cumplió de las reglas del canal

- **Voz:** la de siempre (ElevenLabs, BRIAN CM, `eleven_v4`).
- **Envato, todas las categorías:**
  - 6 clips;
  - 4 fotos con Ken Burns;
  - 6 objetos 3D (cerillo con llamas animadas, manómetro, cabina, velocímetro, celular con pantalla propia y escalera);
  - la fuente Rhino Rough para los títulos;
  - 25 íconos, el mapa y la textura de papel granulado sobre toda la ilustración;
  - los overlays animados de brasas y neblina.

  No hizo falta ninguna imagen de respaldo con IA.
- **Epidemic Sound, diseño sonoro completo:**
  - 12 pistas con varios cambios por sección;
  - stems (Displaced sin batería);
  - 2 versiones hechas con EditRecording: el crescendo que llega a su punto más alto en «y cinco: el burnout», y el cierre que termina exacto con el video;
  - 6 ambientes y 72 efectos, con variantes que se van turnando;
  - un riser antes de cada ⚡;
  - la firma sonora del canal.

  El detalle está en `audio/no-es-pereza-es-burnout/LEEME.md`.
- **Personaje "Tú" con rostro:** cambia entre cansado, preocupado, enojado, en blanco y feliz. Su amigo de sudadera menta también tiene rostro.
  - Las 4 primeras versiones del fondo de la Miniatura 4 salieron con el personaje sin cara, así que las regeneré. Las descartadas están en `../miniaturas/fondos/descartadas/`.
- **Sin rostros reales:**
  - el clip de la escena 81 traía la cara de un hombre, así que lo recorté para que solo se vean sus manos y el celular;
  - en los demás clips se ven manos, pies o un cerillo.
- **Texto en pantalla sin repetir:**
  - `scripts/burnout/viz.py` revisó las 136 escenas y pasó sin `PERMITIR_REPETIDOS`;
  - en los shorts revisé también que ningún título repita lo que dicen los subtítulos al mismo tiempo.
- **Cierre:** no menciona otros videos del canal.

## Revisión que hice

- **Hojas de contacto:** revisé un fotograma de cada una de las 136 escenas y de todas las escenas de los shorts. Corregí lo siguiente:
  - la etiqueta «FLOJO» tapaba la cara;
  - el mapa de Envato traía la marca de agua «WorldMap» (lo recorté);
  - la Ñ de Rhino Rough no se lee bien, así que esos textos van en Montserrat;
  - una lista se palomeaba sola;
  - el enchufe no se veía desconectarse;
  - la mochila tapaba la cara;
  - el personaje que sube la escalera se salía del cuadro;
  - algunos textos chocaban con el HUD.
- **Sincronía de los picos:** puse a tiempo, con la palabra exacta de la transcripción, «FLOJO», «BURNOUT», «DESPERSONALIZACIÓN», «NO ES FLOJERA», «MECHA CORTA», «EL PEOR CONSEJO», «5 · BURNOUT» y «¿SIEMPRE FUISTE ASÍ?». Los efectos y el corte de la música en la etapa 5 se movieron con ellos. Los cortes de escena salen de la transcripción por palabra (97.9 % de palabras alineadas).
- **Duración y fotogramas:**
  - el largo tiene 16,196 fotogramas;
  - los shorts tienen 1,007, 957 y 1,050.
- **Pantallas negras:** `blackdetect` no encontró ninguna.
- **Audio:**
  - el largo y los shorts quedaron a −14 LUFS;
  - la voz siempre va por encima de la música (ducking);
  - los únicos huecos de música son los marcados en el guion:
    - el corte seco en «FLOJO»;
    - 1 s de silencio en «despersonalización», «te quemaste», la etapa 5 y «la pregunta que te prometí».
- **Loop:** en los Shorts 1 y 3, la última escena repite el encuadre de la primera.

---

## 1. Revisa estos puntos al verlo

- **Escena 81 (el cuarto oscuro):** el clip quedó recortado a las manos con el celular, así que se ve muy oscuro y cerrado. Si prefieres otro clip sin persona (por ejemplo, solo un sillón y la luz de un celular), déjalo como `recursos/stock/escena_081.mp4` y vuelvo a renderizar solo esa escena.
- **Escena 17:** el clip de Envato son unos pies bajo la cobija, no una persona de espaldas. Funciona para «alguien en la cama», pero lo menciono por si querías otro encuadre.
- **Pantalla final (escena 136, 14 s):** el botón «Suscrito ✓» y el espacio libre a la derecha son para los **elementos de pantalla final de YouTube**.

## 2. Licencias

- **Envato:** los clips, fotos, 3D, gráficos, overlays y la fuente quedaron en `recursos/` (fuera del repositorio). Registra la licencia de cada uno a este proyecto en Envato, si no lo hiciste al descargarlos.
- **Epidemic Sound:** la música, los efectos y la firma sonora están en `recursos/musica/burnout/`, `recursos/sfx/burnout/` y `recursos/firma/`, también fuera del repositorio.

## 3. Narración y tema

- **Voz sintética:** YouTube pide marcar como «contenido alterado o sintético» solo lo que parece real y no lo es. Una voz en off sobre ilustraciones normalmente no entra ahí, pero revisa la casilla al subirlo.
- **Fuentes:** están al final de `../05_titulos_y_descripcion.md`, para el comentario fijado.
- **Aviso de salud:** el video y la descripción ya recomiendan hablar con un profesional, y la descripción aclara que el video no reemplaza la atención profesional.

---

## Cómo editar y volver a renderizar

```bash
npm install
python3 scripts/burnout/align.py          # (desde scripts/burnout/) tiempos reales → plan_base.json
python3 scripts/burnout/viz.py            # plan visual escena por escena → src/burnout/plan.json
python3 scripts/burnout/viz_shorts.py     # shorts → src/burnout/shorts.json
python3 scripts/burnout/audio.py todo     # música, stems, ambientes y efectos → out/
npx remotion render src/index.ts NoEsPereza out/burnout-mudo.mp4 --muted
npx remotion render src/index.ts NoEsPerezaShort1 out/burnout-short1-mudo.mp4 --muted   # 2 y 3 igual
bash scripts/burnout/mux.sh todo          # mezcla final a −14 LUFS → entregas/03-no-es-pereza-es-burnout/video/
node scripts/burnout/miniaturas.mjs       # 5 miniaturas
node scripts/burnout/fotogramas_shorts.mjs  # fotogramas de los shorts
```

Para ver o retocar cualquier escena: `npx remotion studio` y abre `NoEsPereza`.
