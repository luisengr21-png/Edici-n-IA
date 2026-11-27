"""Transcribe las tomas de ElevenLabs (faster-whisper small, tiempos por palabra) y compara cada una con su texto.
Uso: python3 scripts/riqueza/transcribir.py   → escribe <toma>.words.json y muestra el parecido con el guion."""
import glob, json, os, re, difflib, unicodedata, sys, subprocess
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TOMAS = os.path.join(ROOT, 'audio', '05-a-que-te-dedicas', 'tomas')
TTS = os.path.join(ROOT, 'scripts', 'dedicas', 'tts')
def nz(s): return re.findall(r'[\wáéíóúüñ]+', unicodedata.normalize('NFC', s.lower()))
NUM = {'1983': 'mil novecientos ochenta y tres', '1990': 'mil novecientos noventa', '1848': 'mil ochocientos cuarenta y ocho',
       '1892': 'mil ochocientos noventa y dos', '1928': 'mil novecientos veintiocho', '1942': 'mil novecientos cuarenta y dos', '1914': 'mil novecientos catorce'}
model = None
for f in sorted(glob.glob(os.path.join(TOMAS, '*.mp3')) + sys.argv[1:]):
    out = f + '.words.json'
    if not os.path.exists(out):
        model = model or WhisperModel('small', device='cpu', compute_type='int8')
        pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-f', 's16le', '-ac', '1', '-ar', '16000', '-'], capture_output=True, check=True).stdout
        audio = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
        segs, _ = model.transcribe(audio, language='es', word_timestamps=True, beam_size=5, vad_filter=False)
        words = [[w.word.strip(), round(w.start, 2), round(w.end, 2)] for s in segs for w in s.words]
        json.dump(words, open(out, 'w'), ensure_ascii=False)
    words = json.load(open(out))
    base = re.sub(r'_[A-Z]\.mp3$', '', os.path.basename(f))
    txt = open(os.path.join(TTS, base + '.txt')).read()
    txt = re.sub(r'\[[^\]]*\]', ' ', txt)
    for k, v in NUM.items(): txt = txt.replace(k, v)
    ref = nz(txt); hyp = [t for w in words for t in nz(w[0])]
    for k, v in NUM.items():  # whisper a veces escribe el año con cifras
        hyp = ' '.join(hyp).replace(k, v).split()
    sm = difflib.SequenceMatcher(None, ref, hyp, autojunk=False)
    falt = [' '.join(ref[a:b]) for op, a, b, c, d in sm.get_opcodes() if op in ('delete', 'replace') and b - a >= 3]
    print(f"{os.path.basename(f):32} {sm.ratio():.3f}  {words[-1][2] if words else 0:6.1f}s  faltan/cambian: {falt[:4]}")
