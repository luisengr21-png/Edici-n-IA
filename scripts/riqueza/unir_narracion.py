"""Une las tomas elegidas en la narración completa y junta sus transcripciones con los tiempos corridos.
Uso: python3 scripts/riqueza/unir_narracion.py"""
import json, os, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
A = os.path.join(ROOT, 'audio', 'la-riqueza-de-otros'); T = os.path.join(A, 'tomas')
ELEGIDAS = ['largo_00_gancho_B', 'largo_01_mas_rico_A', 'largo_02_villano_A', 'largo_03_carnegie_A',
            'largo_04_invisibles_A', 'largo_05_trabajadores_B', 'largo_06_pais_A', 'largo_07_cierre_B']
SHORTS = {1: 'short_01_A', 2: 'short_02_B', 3: 'short_03_A'}
GAP = 0.7  # aire entre secciones
def dur(f): return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]))
os.makedirs(os.path.join(A, 'partes'), exist_ok=True)
words, t0, parts = [], 0.0, []
for k, n in enumerate(ELEGIDAS):
    f = os.path.join(T, n + '.mp3')
    subprocess.run(['cp', f, os.path.join(A, 'partes', n[:-2] + '.mp3')], check=True)
    for w, s, e in json.load(open(f + '.words.json')):
        words.append([w, round(s + t0, 2), round(e + t0, 2)])
    parts.append((n, round(t0, 2)))
    t0 += dur(f) + (GAP if k < len(ELEGIDAS) - 1 else 0)
# concatena con silencios
inp, fil = [], ''
for k, n in enumerate(ELEGIDAS):
    inp += ['-i', os.path.join(T, n + '.mp3')]
    fil += f'[{k}]aresample=44100,aformat=channel_layouts=mono,apad=pad_dur={GAP if k < len(ELEGIDAS) - 1 else 0}[a{k}];'
fil += ''.join(f'[a{k}]' for k in range(len(ELEGIDAS))) + f'concat=n={len(ELEGIDAS)}:v=0:a=1[o]'
out = os.path.join(A, 'largo_narracion_completa.wav')
subprocess.run(['ffmpeg', '-y', '-v', 'error', *inp, '-filter_complex', fil, '-map', '[o]', out], check=True)
D = dur(out)
json.dump(words, open(os.path.join(A, 'transcripcion_palabras_largo.json'), 'w'), ensure_ascii=False)
json.dump(dict(duration=round(D, 2), partes=parts), open(os.path.join(A, 'largo_meta.json'), 'w'), ensure_ascii=False, indent=1)
print('largo', round(D, 2), 's')
for n, s in SHORTS.items():
    f = os.path.join(T, s + '.mp3')
    o = os.path.join(A, f'short_0{n}_narracion.wav')
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', f, '-ar', '44100', '-ac', '1', o], check=True)
    json.dump(json.load(open(f + '.words.json')), open(os.path.join(A, f'transcripcion_palabras_short_0{n}.json'), 'w'), ensure_ascii=False)
    json.dump(dict(duration=round(dur(o), 2), toma=s), open(os.path.join(A, f'short_0{n}_meta.json'), 'w'))
    print('short', n, round(dur(o), 2))
