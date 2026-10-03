"""Locución de «Ser real»: voz neuronal Piper es_AR-daniela-high (sherpa-onnx), frase por frase.

Genera:
  autenticidad/work/narracion.wav   voz seca, 22.05 kHz
  src/serreal/cues.json              inicio/fin de cada frase (s)
  src/serreal/plan.json              escenas (inicio/fin/transición) derivadas de las frases
Uso: python3 autenticidad/work/voz.py <dir-del-modelo>
"""
import json, re, sys
from pathlib import Path
import numpy as np, soundfile as sf, sherpa_onnx

ROOT = Path(__file__).resolve().parents[2]
MODEL = Path(sys.argv[1] if len(sys.argv) > 1 else 'vits-piper-es_AR-daniela-high')
SPEED = 0.70
CLAUSE_GAP = 0.32  # micropausa en «;» y «:»
LEAD, TAIL, OUTRO = 2.2, 1.6, 7.0
FPS = 30

paras = [p.strip() for p in (ROOT / 'autenticidad/guion.txt').read_text().splitlines() if p.strip()]
sents, para_of = [], []
for pi, p in enumerate(paras):
    for s in re.split(r'(?<=[.])\s+', p):
        sents.append(s)
        para_of.append(pi)

def speakable(s):
    s = s.replace('“', '').replace('”', '').replace('likes', 'laiks')
    s = re.sub(r'\s*—\s*', ', ', s).replace(', ,', ',')
    return s

# Pausa (s) antes de cada frase
def pause_before(i):
    if i == 0: return LEAD
    if sents[i].startswith('Solo tienes'): return 1.7
    if sents[i - 1].startswith('Solo tienes'): return 1.7
    if sents[i].startswith('En cambio, cuando te aceptas'): return 1.1
    if sents[i].startswith('La autenticidad es'): return 0.8
    if para_of[i] != para_of[i - 1]: return 1.6
    return 0.7

cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=str(MODEL / f'{MODEL.name.removeprefix("vits-piper-")}.onnx'),
                                               tokens=str(MODEL / 'tokens.txt'), data_dir=str(MODEL / 'espeak-ng-data')),
    num_threads=4))
tts = sherpa_onnx.OfflineTts(cfg)

def trim(x, sr, thr=0.012):
    env = np.convolve(np.abs(x), np.ones(int(sr * 0.01)) / int(sr * 0.01), mode='same')
    idx = np.where(env > thr)[0]
    a, b = max(0, idx[0] - int(sr * 0.03)), min(len(x), idx[-1] + int(sr * 0.08))
    y = x[a:b].copy()
    f = int(sr * 0.012)
    y[:f] *= np.linspace(0, 1, f); y[-f:] *= np.linspace(1, 0, f)
    return y

out, cues, t, sr = [], [], 0.0, None
for i, s in enumerate(sents):
    parts = []
    for chunk in re.split(r'(?<=[;:])\s+', speakable(s)):
        a = tts.generate(chunk, sid=0, speed=SPEED)
        sr = a.sample_rate
        if parts: parts.append(np.zeros(int(CLAUSE_GAP * sr), np.float32))
        parts.append(trim(np.array(a.samples, dtype=np.float32), sr))
    x = np.concatenate(parts)
    gap = pause_before(i)
    out.append(np.zeros(int(round(gap * sr)), np.float32)); t += gap
    cues.append({'start': round(t, 3), 'end': round(t + len(x) / sr, 3), 'text': s})
    out.append(x); t += len(x) / sr
    print(f'{i:2d} {cues[-1]["start"]:7.2f}–{cues[-1]["end"]:7.2f}  {s[:70]}')

duration = round(t + TAIL + OUTRO, 2)
out.append(np.zeros(int(round((duration - t) * sr)), np.float32))
y = np.concatenate(out)
y = y / np.max(np.abs(y)) * 0.89
sf.write(ROOT / 'autenticidad/work/narracion.wav', y, sr)
(ROOT / 'src/serreal/cues.json').write_text(json.dumps(cues, ensure_ascii=False, indent=1))

def find(prefix):
    return next(i for i, s in enumerate(sents) if s.startswith(prefix))
def word_t(i, w):
    c = cues[i]; k = c['text'].lower().index(w.lower())
    return c['start'] + (c['end'] - c['start']) * k / len(c['text'])
def before(i):
    return round(cues[i]['start'] - min(0.35, pause_before(i) / 2), 2)

# (escena, inicio, transición de entrada)
bounds = [
    (1, 0.0, 'cut'),
    (2, before(find('Todos queremos que')), 'zoom'),
    (3, before(find('Pero ese miedo')), 'pan'),
    (4, round(word_t(find('Lo aprendemos'), 'cuando entendemos') - 0.2, 2), 'cut'),
    (5, before(find('Y hoy')), 'zoomOut'),
    (6, before(find('La búsqueda')), 'pan'),
    (7, before(find('La cultura')), 'pan'),
    (8, before(find('En cambio, cuando te aceptas')), 'fade'),
    (9, before(find('Si realmente')), 'pan'),
    (10, before(find('La gente percibe')), 'zoomOut'),
    (11, before(find('En las conversaciones')), 'pan'),
    (12, before(find('En cambio, cuando simplemente')), 'cut'),
    (13, before(find('También es')), 'pan'),
    (14, before(find('Cuando dejas de tratar')), 'down'),
    (15, before(find('No dejes')), 'fade'),
    (16, round(cues[find('Solo tienes')]['start'] - 1.2, 2), 'fade'),
    (17, before(find('Las conversaciones y')), 'fade'),
    (18, round(cues[-1]['end'] + 1.0, 2), 'fade'),
]
scenes = [{'id': sid, 'start': st, 'end': (bounds[k + 1][1] if k + 1 < len(bounds) else duration), 'in': tr}
          for k, (sid, st, tr) in enumerate(bounds)]
(ROOT / 'src/serreal/plan.json').write_text(json.dumps({'fps': FPS, 'duration': duration, 'scenes': scenes}, indent=1))
print('duración', duration, 's')
for s in scenes: print(s)
