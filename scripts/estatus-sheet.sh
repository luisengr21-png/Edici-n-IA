#!/usr/bin/env bash
# Uso: scripts/estatus-sheet.sh nombre t1 t2 t3 ...  (segundos) -> out/estatus-stills/nombre.jpg
set -euo pipefail
cd "$(dirname "$0")/.."
name=$1; shift
dir=${DIR:-out/estatus-stills}; mkdir -p $dir
BR=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
inputs=(); i=0
for s in "$@"; do
  fr=$(python3 -c "print(int(round($s*24)))")
  npx remotion still src/index.ts ${COMP:-AnsiedadPorElEstatus} $dir/_$i.jpg --frame=$fr --browser-executable=$BR --log=error --scale=0.5 >/dev/null
  inputs+=(-i $dir/_$i.jpg); i=$((i+1))
done
cols=3; [ $i -lt 3 ] && cols=$i
rows=$(( (i + cols - 1) / cols ))
ffmpeg -loglevel error -y "${inputs[@]}" -filter_complex "$(for k in $(seq 0 $((i-1))); do printf "[$k]"; done)xstack=inputs=$i:layout=$(python3 -c "
c=$cols;n=$i
print('|'.join(f'{(k%c)*960}_{(k//c)*540}' for k in range(n)))")" $dir/$name.jpg
rm -f $dir/_*.jpg
echo $dir/$name.jpg
