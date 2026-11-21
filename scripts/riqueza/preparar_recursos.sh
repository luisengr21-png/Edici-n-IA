#!/usr/bin/env bash
# Convierte los recursos del creador (recursos/riqueza/) a un formato uniforme para Remotion (public/riqueza/).
# Videos: 1920×1080, 30 fps, H.264, sin audio, máximo 20 s. Fotos: JPG de 2400 px de ancho como máximo.
set -euo pipefail
cd "$(dirname "$0")/../.."
# Regla del canal: sin rostros visibles. Estos clips traen una cara, así que se recortan a la zona de manos y objetos
# (x, y, ancho, alto como fracción del cuadro original; siempre en 16:9).
declare -A CROP=(
  [escena_037]="0.45 0.35 0.55 0.55"   # taxi: solo la calle y el taxi
  [escena_043]="0.25 0.50 0.50 0.50"   # manos con el celular
  [escena_100]="0.55 0.22 0.43 0.43"   # el letrero de cerrado a abierto
  [escena_130]="0.45 0.45 0.55 0.55"   # la mesa: café y celular
  [escena_167]="0.50 0.40 0.50 0.50"   # manos con guantes en la máquina
  [escena_198]="0.25 0.58 0.42 0.42"   # las cajas
)
for f in recursos/riqueza/VIDEOS/*; do
  b=$(basename "${f%.*}"); o=public/riqueza/videos/$b.mp4
  [ -s "$o" ] && continue
  vf="scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080"
  if [ -n "${CROP[$b]:-}" ]; then read -r cx cy cw ch <<< "${CROP[$b]}"; vf="$vf,crop=iw*$cw:ih*$ch:iw*$cx:ih*$cy,scale=1920:1080"; fi
  ffmpeg -y -v error -i "$f" -t 20 -an -vf "$vf,fps=30,format=yuv420p" -c:v libx264 -preset veryfast -crf 20 -g 30 "$o"
  echo "$o"
done
for f in recursos/riqueza/FOTOS/*; do
  b=$(basename "${f%.*}"); o=public/riqueza/fotos/$b.jpg
  [ -s "$o" ] && continue
  convert "$f[0]" -auto-orient -resize '2400x2400>' -quality 90 "$o"
  echo "$o"
done
