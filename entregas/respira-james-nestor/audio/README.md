# Respira – Audio

- **Voz:** Pablo (ElevenLabs, `eleven_v4`); los detalles están en `config_voz.json`, en la raíz del repo.
- **Texto exacto enviado a la voz:** `textos_tts.json` (guion + etiquetas de emoción + ajustes de pronunciación).
- **Subtítulos:** un `.srt` junto a cada audio, con el texto del guion alineado a la voz por transcripción automática. Los tiempos son buenos para editar, pero conviene revisar los cortes al montar.
- **Volumen:** el largo está a unos −22 LUFS (voz sin masterizar). Súbelo/normalízalo en la edición final (YouTube usa ~−14 LUFS).

## Duraciones

| Archivo | Duración |
|---|---|
| `largo/largo_completo.mp3` | 14:37.2 |
| `largo/parte_01_gancho.mp3` | 0:42.8 |
| `largo/parte_02_presentacion.mp3` | 0:43.5 |
| `largo/parte_03_boca.mp3` | 1:42.7 |
| `largo/parte_04_masticar.mp3` | 2:34.6 |
| `largo/parte_05_nariz.mp3` | 2:03.6 |
| `largo/parte_06_giro.mp3` | 2:01.9 |
| `largo/parte_07_exhalar.mp3` | 1:48.2 |
| `largo/parte_08_aguantarla.mp3` | 1:08.0 |
| `largo/parte_09_cierre.mp3` | 1:46.7 |
| `shorts/short_01_15s.mp3` | 0:15.4 |
| `shorts/short_02_15s.mp3` | 0:14.6 |
| `shorts/short_03_15s.mp3` | 0:16.0 |
| `shorts/short_04_35s.mp3` | 0:36.5 |
| `shorts/short_05_35s.mp3` | 0:37.4 |
| `shorts/short_06_35s.mp3` | 0:36.4 |
| `shorts/short_07_1min.mp3` | 1:10.7 |
| `shorts/short_08_1min.mp3` | 1:06.0 |
| `shorts/short_09_1min.mp3` | 1:06.0 |

## Revisión automática (transcripción contra el guion)

Coincidencia de palabras: largo 97 %, shorts entre 92 % y 99 %. Casi todas las diferencias son del transcriptor (números escritos con cifras, acentos, nombres en inglés). No hay frases cortadas, repetidas ni silencios raros; el único silencio largo (2.3 s) es la pausa intencional antes de "…Exacto." en la parte 08.

Para revisar con el oído:
- **05:26 del largo** – "maniobra de *Cottle*": el transcriptor oyó "Coral".
- **"Carl Stough"** (parte 07): el transcriptor oyó "Stowe"; revisa si te suena bien.
- **Respiración guiada (13:15–13:27):** la inhalación dura unos 6.7 s y la exhalación unos 5.2 s, cerca de los 5.5 s del guion.
