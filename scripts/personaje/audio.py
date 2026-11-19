"""Música y efectos de «El personaje que fabricas por miedo» (todo de Epidemic Sound).

Lee src/personaje/plan.json (o shorts.json) y arma dos pistas:
  out/personaje-music.wav  → una pista por sección, con fundidos entre secciones y silencios marcados
  out/personaje-sfx.wav    → un efecto por escena, elegido por la columna «Efectos de sonido»
La mezcla con la voz (ducking) y el −14 LUFS final se hacen en scripts/personaje/mux.sh.
Uso: python3 scripts/personaje/audio.py [largo|shorts|todo]
"""
import json, os, re, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
MUS = os.path.join(ROOT, 'recursos', 'musica', 'personaje')
SFX = os.path.join(ROOT, 'recursos', 'sfx', 'personaje')
OUT = os.path.join(ROOT, 'out')
SR = 44100

_cache = {}
def load(path):
    if path not in _cache:
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ac', '2', '-ar', str(SR), '-f', 's16le', '-'], capture_output=True, check=True).stdout
        _cache[path] = np.frombuffer(raw, np.int16).reshape(-1, 2).astype(np.float32) / 32768
    return _cache[path]

def write(path, buf):
    buf = np.clip(buf, -1, 1)
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((buf * 32767).astype(np.int16).tobytes())

def db(x): return 10 ** (x / 20)

def place(buf, clip, t, gain=1.0, dur=None, fade=0.15):
    a = int(t * SR)
    if a >= len(buf): return
    c = clip if dur is None else clip[:int(dur * SR)]
    c = c[:len(buf) - a].copy()
    if dur is not None and len(c) > 0:
        f = min(len(c), int(fade * SR))
        if f > 0: c[-f:] *= np.linspace(1, 0, f)[:, None]
    buf[a:a + len(c)] += c * gain

# ── efectos: palabra clave de la columna «Efectos de sonido» → archivo, volumen (dB), largo máximo (s) ──
SFX_MAP = [
    (r'redoble', 'drumroll', -8, 3.0),
    (r'latido', 'heartbeat', -4, 2.8),
    (r'vibraci', 'vibration', -6, 1.6),
    (r'tecleo|teclea', 'typing', -10, 3.0),
    (r'grillo', 'crickets', -14, 5.0),
    (r'tic|reloj|cronómetro', 'tick', -10, 3.0),
    (r'riser|crescendo|sube', 'riser', -9, 2.9),
    (r'sello|stamp', 'stamp', -2, None),
    (r'boing|cómic|resorte|disco rayado', 'boing', -9, 1.2),
    (r'risa|risas|carcajada', 'laugh', -12, 3.0),
    (r'impacto|golpe|portazo|caída|ladrillo|tropiezo|choque|metal', 'impact', -9, 2.2),
    (r'shimmer|mágico|luminoso|brillo|revelación|confeti|crecimiento|ding de revel', 'shimmer', -10, 2.5),
    (r'ding|campan|acorde|notificaci', 'ding', -8, None),
    (r'clic|click|clac|candado|interruptor|lámpara|obturador|reflector', 'switch', -6, 0.6),
    (r'papel|hoja|tela|cartón|caja', 'paper', -10, 1.2),
    (r'viento|olas|agua|respir|susurro|ambiente', 'wind', -16, 4.0),
    (r'whoosh|swish|transici|rebobin|volteo', 'whoosh', -7, None),
    (r'pop|bip|tachón|pasos|tijeras|martillo|dominó|empuje', 'pop', -10, 0.8),
]

def sfx_for(text):
    t = text.lower()
    if t.strip() in ('—', '-', ''):
        return None
    for rx, name, gain, mx in SFX_MAP:
        if re.search(rx, t):
            m = re.search(r'×\s*(\d)', t)
            return name, gain, mx, int(m.group(1)) if m else 1
    return 'pop', -12, 0.8, 1

def build_sfx(scenes, total, path):
    buf = np.zeros((int(total * SR) + SR, 2), np.float32)
    for s in scenes:
        r = sfx_for(s.get('sfx', ''))
        if not r:
            continue
        name, gain, mx, times = r
        clip = load(os.path.join(SFX, name + '.mp3'))
        dur = s['end'] - s['start']
        lim = min(mx, dur) if mx else None
        step = min(0.45, max(0.25, dur / (times + 1)))
        for k in range(times):
            place(buf, clip, s['start'] + 0.06 + k * step, db(gain), lim)
    write(path, buf)

# ── música por sección ──
TRACKS = {0: 's0_fairy_memoirs', 1: 's1_meet_me_on_the_moon', 2: 's2_mr_norton', 3: 's3_excuse_the_dog', 4: 's4_how_peculiar', 5: 's5_time_on_our_side', 6: 's6_renewal', 7: 's6_renewal'}
GAIN = {0: -3, 1: -4, 2: -5, 3: -5, 4: -3, 5: -5, 6: -3, 7: -3}

def silences(scenes):
    """Escenas con «Silencio» o «Corte» en la columna Música: la música baja a cero ahí."""
    out = []
    for s in scenes:
        m = s.get('mus', '').lower()
        if 'silencio' in m or m.startswith('corte') or 'pausa' in m:
            a, b = s['start'], s['end']
            if 'silencio de 1 s' in m or 'golpe y silencio' in m:
                b = min(b, a + 1.2)
            out.append((a, b))
    return out

def build_music(scenes, sections, total, path, start_at=0.0, tracks=TRACKS, offsets=None):
    buf = np.zeros((int(total * SR) + SR, 2), np.float32)
    keys = sorted(sections)
    played = {}
    for i, sec in enumerate(keys):
        a = max(sections[sec], start_at if i == 0 else 0)
        b = sections[keys[i + 1]] if i + 1 < len(keys) else total
        name = tracks[sec]
        tr = load(os.path.join(MUS, name + '.mp3'))
        off = played.get(name, (offsets or {}).get(sec, 0.0))
        seg_len = (b - a) + 1.5
        i0 = int(off * SR); n = int(seg_len * SR)
        seg = np.concatenate([tr[i0:], tr] * 3)[:n] if i0 + n > len(tr) else tr[i0:i0 + n]
        seg = seg.copy()
        fi, fo = int(1.2 * SR), int(1.5 * SR)
        seg[:fi] *= np.linspace(0, 1, fi)[:, None]
        seg[-fo:] *= np.linspace(1, 0, fo)[:, None]
        place(buf, seg, a, db(GAIN.get(sec, -4)))
        played[name] = off + (b - a)
    # final: fundido de 4 s
    f = int(4 * SR); e = int(total * SR)
    buf[e - f:e] *= np.linspace(1, 0, f)[:, None]
    buf[e:] = 0
    # silencios marcados (con rampas cortas)
    env = np.ones(len(buf), np.float32)
    r = int(0.25 * SR)
    for a, b in silences(scenes):
        ia, ib = int(a * SR), int(b * SR)
        env[ia:ib] = 0
        env[max(0, ia - r):ia] = np.minimum(env[max(0, ia - r):ia], np.linspace(1, 0, ia - max(0, ia - r)))
        env[ib:ib + r] = np.minimum(env[ib:ib + r], np.linspace(0, 1, len(env[ib:ib + r])))
    buf *= env[:, None]
    write(path, buf)

if __name__ == '__main__':
    que = sys.argv[1] if len(sys.argv) > 1 else 'todo'
    os.makedirs(OUT, exist_ok=True)
    if que in ('largo', 'todo'):
        plan = json.load(open(os.path.join(ROOT, 'src', 'personaje', 'plan.json')))
        secs = {int(k): v for k, v in plan['sections'].items()}
        build_music(plan['scenes'], secs, plan['duration'], os.path.join(OUT, 'personaje-music.wav'), start_at=plan['scenes'][1]['start'])
        build_sfx(plan['scenes'], plan['duration'], os.path.join(OUT, 'personaje-sfx.wav'))
        print('largo listo')
    if que in ('shorts', 'todo'):
        SH = {'Short1': 's3_excuse_the_dog', 'Short2': 's2_mr_norton', 'Short3': 's0_fairy_memoirs'}
        for sh in json.load(open(os.path.join(ROOT, 'src', 'personaje', 'shorts.json'))):
            n = sh['id'][-1]
            build_music(sh['scenes'], {0: 0.0}, sh['duration'], os.path.join(OUT, f'personaje-short{n}-music.wav'), tracks={0: SH[sh['id']]}, offsets={0: 8.0})
            build_sfx(sh['scenes'], sh['duration'], os.path.join(OUT, f'personaje-short{n}-sfx.wav'))
            print('short', n, 'listo')
