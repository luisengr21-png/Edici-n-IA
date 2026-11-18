#!/usr/bin/env bash
# Mezcla final de «La trampa de la pobreza de lujo»: narración + música (con ducking) + efectos, a -14 LUFS.
# Video largo: H.264 en dos pasadas con tamaño objetivo ≈ 90 MB (para que entre en GitHub, límite 100 MB).
# Shorts: H.264 CRF 20.
# Uso: bash scripts/lujo-mux.sh [largo|shorts|todo]
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=entregas/pobreza-de-lujo/video
AUD=audio/pobreza-de-lujo
mkdir -p "$OUT"
QUE=${1:-todo}

mixfilter="\
[1]aresample=48000,aformat=channel_layouts=stereo,apad,asplit=2[voz][llave];\
[2]aresample=48000,volume=-9dB[mus];\
[mus][llave]sidechaincompress=threshold=0.015:ratio=6:attack=25:release=450:makeup=1[musd];\
[3]aresample=48000,volume=-3dB[fx];\
[voz][musd][fx]amix=inputs=3:normalize=0:duration=longest,loudnorm=I=-14:TP=-1.5:LRA=11[a]"

dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

if [[ $QUE == largo || $QUE == todo ]]; then
  V=out/lujo-mudo.mp4
  T=$(dur "$V")
  ffmpeg -y -hide_banner -loglevel error -i "$V" -i $AUD/largo_narracion_completa.mp3 -i out/lujo-music.wav -i out/lujo-sfx.wav \
    -filter_complex "$mixfilter" -map "[a]" -t "$T" -c:a aac -b:a 160k -ar 48000 out/lujo-mezcla.m4a
  P=$(mktemp -d)
  # 90 MB · 8 / duración − audio = bitrate de video
  VB=$(python3 -c "print(int(90e6*8/$T/1000 - 165))")
  ffmpeg -y -hide_banner -loglevel error -i "$V" -c:v libx264 -preset slow -tune animation -b:v ${VB}k -maxrate $((VB * 3))k -bufsize $((VB * 4))k -pix_fmt yuv420p -pass 1 -passlogfile $P/p -an -f mp4 /dev/null
  ffmpeg -y -hide_banner -loglevel error -i "$V" -i out/lujo-mezcla.m4a -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -tune animation -b:v ${VB}k -maxrate $((VB * 3))k -bufsize $((VB * 4))k -pix_fmt yuv420p -pass 2 -passlogfile $P/p -c:a copy -movflags +faststart -t "$T" "$OUT/la-trampa-de-la-pobreza-de-lujo.mp4"
  rm -rf $P
  echo "largo: $OUT/la-trampa-de-la-pobreza-de-lujo.mp4 (video ${VB} kbps)"
fi

if [[ $QUE == shorts || $QUE == todo ]]; then
  declare -A NAME=([1]=short_01_si-te-tratan-mal [2]=short_02_bolso-pago-inicial [3]=short_03_parka-antartida)
  for n in 1 2 3; do
    V=out/lujo-short$n-mudo.mp4
    T=$(dur "$V")
    ffmpeg -y -hide_banner -loglevel error -i "$V" -i $AUD/${NAME[$n]}.mp3 -i out/lujo-short$n-music.wav -i out/lujo-short$n-sfx.wav \
      -filter_complex "$mixfilter" -map 0:v:0 -map "[a]" -t "$T" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -movflags +faststart "$OUT/${NAME[$n]}.mp4"
    echo "short $n: $OUT/${NAME[$n]}.mp4"
  done
fi
