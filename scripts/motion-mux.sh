#!/usr/bin/env bash
# Mezcla final de la versión motion graphics: narración + cama electrónica (ducking) + efectos de UI, a -14 LUFS.
# Genera también la vista previa en 720p (< 24 MB) para compartir.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -hide_banner -loglevel error \
  -i out/motion-mudo.mp4 -i estatus/work/narracion.mp3 -i out/motion-music.wav -i out/motion-sfx.wav \
  -filter_complex "\
[1]aresample=48000,aformat=channel_layouts=stereo,asplit=2[voz][llave];\
[2]aresample=48000,volume=-9.5dB[mus];\
[mus][llave]sidechaincompress=threshold=0.02:ratio=4:attack=40:release=450:makeup=1[musd];\
[3]aresample=48000,volume=-2dB[fx];\
[voz][musd][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11[a]" \
  -map 0:v:0 -map "[a]" -c:v copy -c:a aac -b:a 256k -ar 48000 -movflags +faststart -shortest \
  out/ansiedad-por-el-estatus-motion.mp4
P=$(mktemp -d)
ffmpeg -hide_banner -loglevel error -y -i out/ansiedad-por-el-estatus-motion.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -b:v 380k -pass 1 -passlogfile $P/p -an -f mp4 /dev/null
ffmpeg -hide_banner -loglevel error -y -i out/ansiedad-por-el-estatus-motion.mp4 -vf scale=1280:720 -c:v libx264 -preset slow -b:v 380k -pass 2 -passlogfile $P/p -c:a aac -b:a 128k -movflags +faststart out/ansiedad-por-el-estatus-motion-720p.mp4
rm -rf $P
echo "Listo: out/ansiedad-por-el-estatus-motion.mp4 (+ 720p)"
