#!/usr/bin/env bash
# Mezcla final de «Ser real» (versión scrapbook): voz (calidez + compresión suave + sala pequeña) + música con ducking + efectos, a -14 LUFS.
# El video se recodifica en dos pasadas (~3 Mbps) para que el entregable quede por debajo de 100 MB; también genera la vista previa en 720p.
set -euo pipefail
cd "$(dirname "$0")/.."
P=$(mktemp -d)
ffmpeg -y -hide_banner -loglevel error \
  -i autenticidad/work/narracion.wav -i out/scrapbook-music.wav -i out/scrapbook-sfx.wav \
  -filter_complex "\
[0]aresample=48000,aformat=channel_layouts=mono,highpass=f=75,equalizer=f=190:t=q:w=1:g=2,equalizer=f=3200:t=q:w=1.2:g=1.5,equalizer=f=7500:t=q:w=1.5:g=-2.5,\
acompressor=threshold=0.1:ratio=2.5:attack=15:release=200:makeup=1.6,aecho=0.85:0.6:38|67:0.13|0.08,\
aformat=channel_layouts=stereo,asplit=2[voz][llave];\
[1]aresample=48000,volume=-3dB[mus];\
[mus][llave]sidechaincompress=threshold=0.03:ratio=3:attack=60:release=700:makeup=1[musd];\
[2]aresample=48000,volume=-2dB[fx];\
[voz][musd][fx]amix=inputs=3:normalize=0:duration=first,loudnorm=I=-14:TP=-2:LRA=11[a]" \
  -map "[a]" -ar 48000 $P/mezcla.wav
enc() { # $1 = escala, $2 = bitrate de video, $3 = bitrate de audio, $4 = salida
  ffmpeg -hide_banner -loglevel error -y -i out/scrapbook-mudo.mp4 -vf "scale=$1" -c:v libx264 -preset slow -b:v $2 -maxrate $((${2%k} * 2))k -bufsize $((${2%k} * 3))k -pix_fmt yuv420p -pass 1 -passlogfile $P/p -an -f mp4 /dev/null
  ffmpeg -hide_banner -loglevel error -y -i out/scrapbook-mudo.mp4 -i $P/mezcla.wav -map 0:v:0 -map 1:a:0 -vf "scale=$1" -c:v libx264 -preset slow -b:v $2 -maxrate $((${2%k} * 2))k -bufsize $((${2%k} * 3))k -pix_fmt yuv420p -pass 2 -passlogfile $P/p -c:a aac -b:a $3 -movflags +faststart -shortest $4
}
enc 1920:1080 3100k 256k out/ser-real-scrapbook.mp4
enc 1280:720 1100k 128k out/ser-real-scrapbook-720p.mp4
rm -rf $P
echo "Listo: out/ser-real-scrapbook.mp4 (+ 720p)"
