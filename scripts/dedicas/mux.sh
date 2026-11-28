#!/usr/bin/env bash
# Une el video mudo con la narración de «¿A qué te dedicas?». Solo voz (regla del canal), a −14 LUFS y pico real −1.5 dB.
# Largo: H.264 en dos pasadas con tamaño objetivo ≈ 90 MB (para que entre en GitHub, límite 100 MB). Shorts: CRF 20.
# Uso: bash scripts/dedicas/mux.sh [largo|shorts|todo|audio]
#   alta: versión del largo en calidad alta (CRF 18) en out/, para entregar fuera de GitHub.
#   audio: rehace solo el audio de los videos ya entregados (copia la imagen sin recodificar).
set -euo pipefail
cd "$(dirname "$0")/../.."
OUT=entregas/05-a-que-te-dedicas/video
AUD=audio/05-a-que-te-dedicas
mkdir -p "$OUT"
QUE=${1:-todo}
dur() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

# Normalización en dos pasadas (mide y luego corrige), para que el volumen quede parejo.
voz() { # voz <entrada> <duración> <salida.m4a>
  local J
  J=$(ffmpeg -hide_banner -i "$1" -af "apad,atrim=0:$2,loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
  local mi mtp mlra mth off
  mi=$(echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['input_i'])")
  mtp=$(echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['input_tp'])")
  mlra=$(echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['input_lra'])")
  mth=$(echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['input_thresh'])")
  off=$(echo "$J" | python3 -c "import sys,json;print(json.load(sys.stdin)['target_offset'])")
  ffmpeg -y -hide_banner -loglevel error -i "$1" -af "apad,atrim=0:$2,aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$mi:measured_TP=$mtp:measured_LRA=$mlra:measured_thresh=$mth:offset=$off:linear=true,aresample=192000,alimiter=limit=0.55:level=false:attack=1:release=60,aresample=48000" -c:a aac -b:a 160k -ar 48000 "$3"
}

if [[ $QUE == audio ]]; then
  declare -A SRC=([a-que-te-dedicas]=largo_narracion_completa [short_01_los-3-segundos]=short_01_narracion [short_02_ferrari]=short_02_narracion [short_03_meritocracia]=short_03_narracion)
  for b in "${!SRC[@]}"; do
    F=$OUT/$b.mp4; T=$(dur "$F")
    voz $AUD/${SRC[$b]}.wav "$T" out/dedicas-tmp-voz.m4a
    ffmpeg -y -hide_banner -loglevel error -i "$F" -i out/dedicas-tmp-voz.m4a -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart -t "$T" out/dedicas-tmp.mp4
    mv out/dedicas-tmp.mp4 "$F"; echo "audio: $F"
  done
  exit 0
fi

# collage: la versión nueva del video en el estilo collage (GitHub ≈ 90 MB y copia en alta calidad en out/).
if [[ $QUE == collage ]]; then
  V=out/dedicas-collage-mudo.mp4; T=$(dur "$V")
  voz $AUD/largo_narracion_completa.wav "$T" out/dedicas-collage-voz.m4a
  P=$(mktemp -d)
  VB=$(python3 -c "print(int(90e6*8/$T/1000 - 165))")
  ffmpeg -y -hide_banner -loglevel error -i "$V" -c:v libx264 -preset slow -tune film -b:v ${VB}k -maxrate $((VB * 3))k -bufsize $((VB * 4))k -pix_fmt yuv420p -pass 1 -passlogfile $P/p -an -f mp4 /dev/null
  ffmpeg -y -hide_banner -loglevel error -i "$V" -i out/dedicas-collage-voz.m4a -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -tune film -b:v ${VB}k -maxrate $((VB * 3))k -bufsize $((VB * 4))k -pix_fmt yuv420p -pass 2 -passlogfile $P/p -c:a copy -movflags +faststart -t "$T" "$OUT/a-que-te-dedicas.mp4"
  rm -rf $P
  ffmpeg -y -hide_banner -loglevel error -i "$V" -i out/dedicas-collage-voz.m4a -map 0:v:0 -map 1:a:0 -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart -t "$T" out/a-que-te-dedicas_collage_alta-calidad.mp4
  echo "collage: $OUT/a-que-te-dedicas.mp4 (video ${VB} kbps) y out/a-que-te-dedicas_collage_alta-calidad.mp4"
  exit 0
fi

if [[ $QUE == alta ]]; then
  V=out/dedicas-mudo.mp4; T=$(dur "$V")
  [ -s out/dedicas-voz.m4a ] || voz $AUD/largo_narracion_completa.wav "$T" out/dedicas-voz.m4a
  ffmpeg -y -hide_banner -loglevel error -i "$V" -i out/dedicas-voz.m4a -map 0:v:0 -map 1:a:0 -c:v libx264 -preset faster -crf 18 -pix_fmt yuv420p -c:a copy -movflags +faststart -t "$T" out/a-que-te-dedicas_alta-calidad.mp4
  echo "alta: out/a-que-te-dedicas_alta-calidad.mp4"
  exit 0
fi

if [[ $QUE == largo || $QUE == todo ]]; then
  V=out/dedicas-mudo.mp4
  T=$(dur "$V")
  voz $AUD/largo_narracion_completa.wav "$T" out/dedicas-voz.m4a
  P=$(mktemp -d)
  VB=$(python3 -c "print(int(90e6*8/$T/1000 - 165))")
  ffmpeg -y -hide_banner -loglevel error -i "$V" -c:v libx264 -preset slow -tune film -b:v ${VB}k -maxrate $((VB * 3))k -bufsize $((VB * 4))k -pix_fmt yuv420p -pass 1 -passlogfile $P/p -an -f mp4 /dev/null
  ffmpeg -y -hide_banner -loglevel error -i "$V" -i out/dedicas-voz.m4a -map 0:v:0 -map 1:a:0 -c:v libx264 -preset slow -tune film -b:v ${VB}k -maxrate $((VB * 3))k -bufsize $((VB * 4))k -pix_fmt yuv420p -pass 2 -passlogfile $P/p -c:a copy -movflags +faststart -t "$T" "$OUT/a-que-te-dedicas.mp4"
  rm -rf $P
  echo "largo: $OUT/a-que-te-dedicas.mp4 (video ${VB} kbps)"
fi

if [[ $QUE == shorts || $QUE == todo ]]; then
  declare -A NAME=([1]=short_01_los-3-segundos [2]=short_02_ferrari [3]=short_03_meritocracia)
  for n in 1 2 3; do
    V=out/dedicas-short$n-mudo.mp4
    T=$(dur "$V")
    voz $AUD/short_0${n}_narracion.wav "$T" out/dedicas-short$n-voz.m4a
    ffmpeg -y -hide_banner -loglevel error -i "$V" -i out/dedicas-short$n-voz.m4a -map 0:v:0 -map 1:a:0 -t "$T" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -c:a copy -movflags +faststart "$OUT/${NAME[$n]}.mp4"
    echo "short $n: $OUT/${NAME[$n]}.mp4"
  done
fi
