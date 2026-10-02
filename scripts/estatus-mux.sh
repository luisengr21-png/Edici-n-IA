#!/usr/bin/env bash
# Mezcla final: narración + piano (con ducking bajo la voz) + efectos, masterizado a -14 LUFS.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -hide_banner -loglevel error \
  -i out/estatus-mudo.mp4 -i estatus/work/narracion.mp3 -i out/estatus-music.wav -i out/estatus-sfx.wav \
  -filter_complex "\
[1]aresample=48000,aformat=channel_layouts=stereo,asplit=2[voz][llave];\
[2]aresample=48000,volume=-11.5dB[mus];\
[mus][llave]sidechaincompress=threshold=0.02:ratio=4:attack=60:release=700:makeup=1[musd];\
[3]aresample=48000,volume=-4dB[fx];\
[voz][musd][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest \
  out/ansiedad-por-el-estatus.mp4
echo "Listo: out/ansiedad-por-el-estatus.mp4"
