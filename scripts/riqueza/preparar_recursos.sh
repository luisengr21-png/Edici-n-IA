#!/usr/bin/env bash
# Convierte los recursos del creador (recursos/riqueza/) a un formato uniforme para Remotion (public/riqueza/).
# Videos: 1920×1080, 30 fps, H.264, sin audio, máximo 20 s. Fotos: JPG de 2400 px de ancho como máximo.
set -euo pipefail
cd "$(dirname "$0")/../.."
# Los clips de stock tienen licencia: se usan completos, aunque se vean rostros (indicación del creador).
declare -A CROP=()
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
