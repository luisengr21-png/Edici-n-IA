#!/usr/bin/env bash
# Mezcla final de la versión cinematográfica: narración + partitura (ducking) + ambientes/efectos, a -14 LUFS.
# Si el MP4 supera 95 MB se recomprime (límite de GitHub). Genera también la vista previa 720p (< 24 MB).
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=out/ansiedad-por-el-estatus-cine.mp4
ffmpeg -y -hide_banner -loglevel error \
  -i out/cine-mudo.mp4 -i estatus/work/narracion.mp3 -i out/cine-music.wav -i out/cine-sfx.wav \
  -filter_complex "\
[1]aresample=48000,aformat=channel_layouts=stereo,asplit=2[voz][llave];\
[2]aresample=48000,volume=-8dB[mus];\
[mus][llave]sidechaincompress=threshold=0.02:ratio=4:attack=60:release=600:makeup=1[musd];\
[3]aresample=48000,volume=-5dB[fx];\
[voz][musd][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest \
  $OUT
SIZE=$(stat -c %s $OUT)
if [ "$SIZE" -gt 99000000 ]; then
  echo "Recomprimiendo ($((SIZE/1000000)) MB)…"
  ffmpeg -y -hide_banner -loglevel error -i $OUT -c:v libx264 -preset slow -crf 24 -tune grain -pix_fmt yuv420p -c:a copy -movflags +faststart out/_cine-tmp.mp4
  mv out/_cine-tmp.mp4 $OUT
fi
P=$(mktemp -d)
ffmpeg -hide_banner -loglevel error -y -i $OUT -vf scale=1280:720 -c:v libx264 -preset slow -b:v 380k -pass 1 -passlogfile $P/p -an -f mp4 /dev/null
ffmpeg -hide_banner -loglevel error -y -i $OUT -vf scale=1280:720 -c:v libx264 -preset slow -b:v 380k -pass 2 -passlogfile $P/p -c:a aac -b:a 128k -movflags +faststart out/ansiedad-por-el-estatus-cine-720p.mp4
rm -rf $P
echo "Listo: $OUT (+ 720p)"
