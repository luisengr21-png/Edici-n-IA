"""Diseño sonoro de «No es pereza, es burnout» (todo de Epidemic Sound).

Lee src/burnout/plan.json (o shorts.json) y arma dos pistas:
  out/burnout-music.wav → varias pistas por sección, stems (Displaced: INSTRUMENTS sin batería ↔ mezcla completa) y una versión amortiguada de «Little Candle» para el piloto automático,
                          las dos versiones hechas con EditRecording, silencios marcados y fundidos.
  out/burnout-sfx.wav   → efectos por escena (con variantes que rotan), risers antes de cada ⚡,
                          whoosh de transición entre secciones, ambientes por lugar y la firma sonora del canal.
La mezcla con la voz (ducking) y el −14 LUFS final se hacen en scripts/burnout/mux.sh.
Uso: python3 scripts/burnout/audio.py [largo|shorts|todo]
"""
import json, os, re, subprocess, sys, wave
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
MUS = os.path.join(ROOT, 'recursos', 'musica', 'burnout')
SFX = os.path.join(ROOT, 'recursos', 'sfx', 'burnout')
OUT = os.path.join(ROOT, 'out')
SR = 44100

_cache = {}
def load(name, folder=SFX):
    path = os.path.join(folder, name + '.mp3')
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

def place(buf, clip, t, gain=1.0, dur=None, fade=0.15, fin=0.0):
    a = int(t * SR)
    if a < 0:
        clip = clip[-a:]; a = 0
    if a >= len(buf): return
    c = clip if dur is None else clip[:int(dur * SR)]
    c = c[:len(buf) - a].copy()
    if len(c) == 0: return
    if fin > 0:
        f = min(len(c), int(fin * SR)); c[:f] *= np.linspace(0, 1, f)[:, None]
    if dur is not None:
        f = min(len(c), int(fade * SR))
        if f > 0: c[-f:] *= np.linspace(1, 0, f)[:, None]
    buf[a:a + len(c)] += c * gain

# ── efectos: palabra clave → [(variantes, dB, largo máx.)]; las variantes rotan para no sonar repetido ──
SFX_MAP = [
    (r'firma sonora', [(['firma'], -3, None)]),
    (r'golpe de señal', [(['impact3', 'impact4'], -7, 2.6), (['shimmer2', 'shimmer1'], -14, 2.0)]),
    (r'riser', [(['riser2', 'riser1'], -10, 2.6)]),
    (r'impacto \+ reverb', [(['impact4'], -6, 3.0)]),
    (r'impacto profundo', [(['impact1'], -4, 3.5)]),
    (r'impacto grande', [(['impact3'], -5, 3.0)]),
    (r'ceniza', [(['impact1'], -8, 2.5), (['sand'], -12, 2.5)]),
    (r'golpe grave', [(['impact1', 'impact2', 'impact4'], -8, 2.4)]),
    (r'golpe cálido|golpe suave', [(['impact2'], -13, 2.0), (['chime'], -16, 2.5)]),
    (r'sello \+ impacto', [(['stamp'], -2, None), (['impact3'], -8, 2.5)]),
    (r'sello', [(['stamp'], -2, None), (['thud'], -10, 0.8)]),
    (r'cerillo encendiéndose', [(['match'], -3, 2.4), (['impact4'], -8, 2.4)]),
    (r'cerillo apagándose', [(['blowout'], -6, None), (['smallfire'], -14, 1.5)]),
    (r'vela apagándose', [(['blowout'], -6, None)]),
    (r'brasas|crepit', [(['embers'], -10, 4.0)]),
    (r'mecha chisporroteando', [(['fuse'], -9, 2.4)]),
    (r'chispa|foco fundiéndose', [(['spark'], -8, 1.8)]),
    (r'batería baja|bip', [(['beep'], -9, None)]),
    (r'silbido de presión', [(['hiss'], -10, 3.5)]),
    (r'notificaciones \+ boing', [(['notif1', 'notif2'], -10, None), (['boing'], -12, 1.4)]),
    (r'notificaci', [(['notif1', 'notif2'], -9, None)]),
    (r'suspiro|respiración', [(['sigh'], -10, 2.6)]),
    (r'papel despegándose', [(['tape'], -4, None), (['whoosh4'], -14, None)]),
    (r'papel rompiéndose|bolsa de papel', [(['tear'], -6, None)]),
    (r'hojas', [(['leaves'], -8, 2.0)]),
    (r'papel|tela', [(['paper'], -10, 1.4)]),
    (r'candado abriéndose|candado', [(['padlock'], -5, 1.4)]),
    (r'whoosh partido', [(['whoosh2', 'whoosh4'], -8, None), (['whoosh1'], -12, None)]),
    (r'whoosh', [(['whoosh1', 'whoosh2', 'whoosh3', 'whoosh4'], -8, None)]),
    (r'palomitas', [(['pops6'], -8, None)]),
    (r'pop ×3 \+ explosión', [(['pop1', 'pop2'], -9, None), (['explosion'], -6, 2.2)]),
    (r'pop', [(['pop1', 'pop2', 'popsup'], -10, None)]),
    (r'enchufe', [(['unplug'], -6, 1.2), (['spark'], -16, 0.8)]),
    (r'conexión|carga ascendente', [(['unplug'], -8, 1.0), (['powerup'], -8, None), (['chime'], -14, 2.5)]),
    (r'cabina', [(['cabin'], -8, 2.5)]),
    (r'ding \+ error', [(['bell'], -10, None), (['error'], -10, None)]),
    (r'error', [(['error'], -9, None)]),
    (r'ding grave', [(['chime'], -10, 2.5)]),
    (r'ding cálido|acorde', [(['chime'], -8, 3.0)]),
    (r'ding|lupa', [(['bell'], -9, None)]),
    (r'reloj rebobinando', [(['rewind'], -6, None)]),
    (r'tic-tac|reloj', [(['clock'], -12, 3.0)]),
    (r'viento', [(['wind'], -12, 3.5)]),
    (r'motor acelerando', [(['rev'], -10, 3.0)]),
    (r'motor', [(['car'], -12, 3.5)]),
    (r'fotocopiadora', [(['copier'], -9, 4.0)]),
    (r'eco', [(['shimmer2'], -18, 2.0), (['impact2'], -18, 2.0)]),
    (r'proyector', [(['projector'], -12, 3.0)]),
    (r'cristal', [(['glass'], -8, None)]),
    (r'clic', [(['check'], -10, None)]),
    (r'cadena', [(['chain'], -8, None)]),
    (r'peso|pesa', [(['thud'], -6, None)]),
    (r'obturador', [(['shutter'], -6, None)]),
    (r'marcador|línea dibujándose|tachón', [(['marker'], -8, 2.0)]),
    (r'fanfarria', [(['fanfare'], -10, 3.0)]),
    (r'flecha', [(['whoosh2'], -10, None), (['impact2'], -12, 1.5)]),
    (r'bajada|picada', [(['fall'], -8, None)]),
    (r'alerta de tablero', [(['beep'], -10, None), (['sonar'], -16, 2.0)]),
    (r'alerta suave', [(['notif1'], -12, None)]),
    (r'grieta', [(['crack'], -7, None)]),
    (r'cuerda de guitarra', [(['guitar'], -8, 3.0)]),
    (r'trueno \+ pajarito', [(['thunder'], -10, 3.0), (['birds'], -16, 3.0)]),
    (r'trueno', [(['thunder'], -9, 3.0)]),
    (r'boing', [(['boing'], -11, 1.4)]),
    (r'tecleo', [(['typing'], -12, 2.5), (['check'], -12, None)]),
    (r'hamaca|pajarito', [(['birds'], -14, 4.0)]),
    (r'vibración', [(['vibrate'], -9, None)]),
    (r'ambiente', [(['amb_room'], -18, 3.5)]),
    (r'megáfono', [(['megaphone'], -12, 2.2), (['impact2'], -16, 1.2)]),
    (r'goteo', [(['drip'], -8, None)]),
    (r'arena', [(['sand'], -9, 3.0)]),
    (r'brillo|shimmer', [(['shimmer1', 'shimmer2'], -10, 3.0)]),
    (r'pasos ascendentes', [(['steps_up'], -10, 3.5), (['chime'], -14, 3.0)]),
    (r'pasos', [(['steps'], -11, 3.5)]),
    (r'despegue', [(['whoosh3'], -6, None)]),
    (r'pedaleo', [(['whoosh2'], -16, None)]),
    (r'ping de radar', [(['sonar'], -10, 3.0)]),
    (r'check', [(['check'], -8, None)]),
    (r'lluvia', [(['rain'], -16, 3.5)]),
]
_rot = {}
def variant(names):
    k = tuple(names)
    i = _rot.get(k, 0); _rot[k] = i + 1
    return names[i % len(names)]

def sfx_layers(text):
    t = text.lower().strip()
    if t in ('—', '-', ''):
        return []
    for rx, layers in SFX_MAP:
        if re.search(rx, t):
            m = re.search(r'×\s*(\d)', t)
            return [(variant(v), g, mx, int(m.group(1)) if m else 1) for v, g, mx in layers]
    return [(variant(['pop1', 'pop2']), -13, None, 1)]

# ambientes por lugar: (escena desde, escena hasta, archivo, dB)
AMB = [(1, 5, 'amb_room', -20), (1, 3, 'clock', -22), (16, 17, 'amb_room', -22), (24, 24, 'car', -16), (27, 27, 'rain', -22),
       (29, 30, 'projector', -24), (57, 58, 'amb_room', -22), (70, 71, 'birds', -22), (74, 79, 'amb_room', -24), (81, 81, 'amb_room', -18),
       (111, 111, 'wind', -20), (124, 124, 'amb_room', -24), (129, 129, 'rain', -16), (131, 132, 'amb_room', -24), (134, 134, 'wind', -24)]

def build_sfx(scenes, total, path, short=False):
    buf = np.zeros((int(total * SR) + SR, 2), np.float32)
    by_n = {s['n']: s for s in scenes}
    for s in scenes:
        dur = s['end'] - s['start']
        for name, gain, mx, times in sfx_layers(s.get('sfx', '')):
            clip = load(name)
            lim = min(mx, dur + 0.6) if mx else None
            step = min(0.45, max(0.22, dur / (times + 1)))
            for k in range(times):
                place(buf, clip, s['start'] + 0.06 + k * step, db(gain), lim)
        # riser que desemboca en cada pico de dopamina ⚡
        if '⚡' in (s.get('mark') or '') and s['start'] > 3:
            r = load(variant(['riser2', 'riser1']))
            L = min(len(r) / SR, 2.6)
            place(buf, r[-int(L * SR):], s['start'] - L + 0.05, db(-15), None, fin=0.4)
    if not short:
        # whoosh de transición al empezar cada sección
        secs = {}
        for s in scenes:
            secs.setdefault(s['sec'], s['start'])
        for sec, t0 in secs.items():
            if sec > 0:
                place(buf, load(variant(['whoosh1', 'whoosh4', 'whoosh3'])), t0 - 0.35, db(-10))
        # ambientes
        for a, b, name, g in AMB:
            if a in by_n and b in by_n:
                t0, t1 = by_n[a]['start'], by_n[b]['end']
                clip = load(name)
                n = int((t1 - t0 + 1.0) * SR)
                seg = np.concatenate([clip] * (n // len(clip) + 1))[:n].copy()
                f = min(len(seg) // 3, int(0.8 * SR))
                seg[:f] *= np.linspace(0, 1, f)[:, None]; seg[-f:] *= np.linspace(1, 0, f)[:, None]
                place(buf, seg, t0, db(g))
        # firma sonora del canal en la apertura (bajo el pad)
        place(buf, load('firma'), 0.0, db(-10))
    write(path, buf)

# ── música: cues por escena → (pista, dB, offset en s, grupo para continuidad entre stems) ──
CUES = {
    1: ('m_old_toys', -5, 0, None),
    4: (None, 0, 0, None),                       # corte seco en «FLOJO»
    5: ('m_make_no_mistakes', -6, 0, None),      # pulso de intriga
    16: ('m_make_no_mistakes', -10, None, None),  # baja
    18: ('m_little_candle_amortiguada', -4, 0, 'candle'),  # tema principal (sin batería: piloto automático)
    27: ('m_little_candle_amortiguada', -8, None, 'candle'),
    35: ('m_little_candle_amortiguada', -4, None, 'candle'),
    38: ('m_little_candle', -4, None, 'candle'),  # señal 2: entra la batería (mezcla completa, mismo punto del tema)
    43: ('m_little_candle', -3, None, 'candle'),
    45: ('m_little_candle_amortiguada', -10, None, 'candle'),  # baja de golpe
    48: ('m_make_no_mistakes', -7, 40, None),     # vuelve el pulso
    51: ('m_bittersweet', -5, 0, None),           # melancólico-cálido
    54: ('m_bittersweet', -8, None, None),
    60: ('m_displaced', -6, 0, 'displaced'),       # tensión rítmica
    67: ('m_displaced_inst', -8, None, 'displaced'),  # baja: se va la batería
    70: ('m_old_toys', -7, 70, None),             # más ligero (la flojera)
    72: ('m_displaced_inst', -9, None, 'displaced'),
    73: ('m_cosmic_slumber', -4, 0, None),        # pad grave
    92: ('m_love_for_the_moon', -5, 0, None),     # cálido y esperanzador
    95: ('m_resistance_edit58', -3, 0, 'edit'),   # crescendo hecho con EditRecording: el pico cae en la etapa 5
    111: ('m_cosmic_slumber', -6, 80, None),      # pad oscuro
    114: ('m_last_horizon', -6, 20, None),        # esperanzador
    118: ('m_feeling_minnesota', -4, 0, None),    # piano emotivo
    121: ('m_feeling_minnesota', -3, None, None),
    132: ('m_last_horizon_edit32', -3, 0, 'edit'),  # clímax emotivo + outro (EditRecording a la duración exacta)
}

def silences(scenes):
    out = []
    for s in scenes:
        m = s.get('mus', '').lower()
        a, b = s['start'], s['end']
        if 'silencio de 1 s' in m:
            out.append((a, min(b, a + 1.2), 0.0))
        elif 'silencio parcial' in m:
            out.append((a, b, db(-12)))
    return out

def build_music(scenes, total, path, cues=CUES, start_at=0.0, tail=4.0):
    buf = np.zeros((int(total * SR) + SR, 2), np.float32)
    by_n = {s['n']: s for s in scenes}
    keys = sorted(k for k in cues if k in by_n)
    pos = {}   # posición de reproducción por pista o por grupo de stems
    for i, k in enumerate(keys):
        name, gain, off, grp = cues[k]
        a = max(by_n[k]['start'], start_at if i == 0 else 0)
        b = by_n[keys[i + 1]]['start'] if i + 1 < len(keys) else total
        if name is None:
            continue
        tr = load(name, MUS)
        key = grp or name
        o = pos.get(key, 0.0) if off is None else off
        seg_len = (b - a) + 1.5
        i0 = int(o * SR); n = int(seg_len * SR)
        if grp == 'edit':
            seg = tr[i0:i0 + n].copy()
        else:
            seg = (np.concatenate([tr[i0:], tr] * 3)[:n] if i0 + n > len(tr) else tr[i0:i0 + n]).copy()
        fi, fo = int(0.9 * SR), int(1.4 * SR)
        prev = cues[keys[i - 1]] if i > 0 else None
        same = prev is not None and (prev[3] or prev[0]) == key
        if not same:
            seg[:min(fi, len(seg))] *= np.linspace(0, 1, min(fi, len(seg)))[:, None]
        else:
            f2 = min(int(0.25 * SR), len(seg)); seg[:f2] *= np.linspace(0.6, 1, f2)[:, None]
        if len(seg) > fo:
            seg[-fo:] *= np.linspace(1, 0, fo)[:, None]
        place(buf, seg, a, db(gain))
        pos[key] = o + (b - a)
    f = int(tail * SR); e = int(total * SR)
    buf[max(0, e - f):e] *= np.linspace(1, 0, min(f, e))[:, None]
    buf[e:] = 0
    env = np.ones(len(buf), np.float32)
    r = int(0.2 * SR)
    for a, b, lvl in silences(scenes):
        ia, ib = int(a * SR), int(b * SR)
        env[ia:ib] = np.minimum(env[ia:ib], lvl)
        env[max(0, ia - r):ia] = np.minimum(env[max(0, ia - r):ia], np.linspace(1, lvl, ia - max(0, ia - r)))
        env[ib:ib + r] = np.minimum(env[ib:ib + r], np.linspace(lvl, 1, len(env[ib:ib + r])))
    buf *= env[:, None]
    write(path, buf)

if __name__ == '__main__':
    que = sys.argv[1] if len(sys.argv) > 1 else 'todo'
    os.makedirs(OUT, exist_ok=True)
    if que in ('largo', 'todo'):
        plan = json.load(open(os.path.join(ROOT, 'src', 'burnout', 'plan.json')))
        build_music(plan['scenes'], plan['duration'], os.path.join(OUT, 'burnout-music.wav'))
        build_sfx(plan['scenes'], plan['duration'], os.path.join(OUT, 'burnout-sfx.wav'))
        print('largo listo')
    if que in ('shorts', 'todo'):
        SH = {'Short1': ('m_cosmic_slumber', -5, 10), 'Short2': ('m_little_candle', -5, 30), 'Short3': ('m_resistance_full', -6, 40)}
        for sh in json.load(open(os.path.join(ROOT, 'src', 'burnout', 'shorts.json'))):
            n = sh['id'][-1]
            nm, g, off = SH[sh['id']]
            first = sh['scenes'][0]['n']
            build_music(sh['scenes'], sh['duration'], os.path.join(OUT, f'burnout-short{n}-music.wav'), cues={first: (nm, g, off, None)}, tail=1.5)
            build_sfx(sh['scenes'], sh['duration'], os.path.join(OUT, f'burnout-short{n}-sfx.wav'), short=True)
            print('short', n, 'listo')
