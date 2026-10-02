#!/usr/bin/env bash
# Une imagen + banda sonora, masteriza a -14 LUFS (estándar de plataformas) y optimiza para streaming.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -y -hide_banner -loglevel error \
  -i out/video-mudo.mp4 -i out/audio.wav \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k -ar 48000 \
  -movflags +faststart -shortest \
  out/lo-que-la-noche-sabe.mp4
echo "Listo: out/lo-que-la-noche-sabe.mp4"
