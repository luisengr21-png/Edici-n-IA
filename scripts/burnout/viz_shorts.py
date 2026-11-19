"""Plan de los 3 shorts verticales (1080×1920) de «No es pereza, es burnout», con subtítulos palabra por palabra.

Cada escena arranca en una frase del guion; los tiempos salen de la transcripción real del audio.
Uso: python3 scripts/burnout/viz_shorts.py  → src/burnout/shorts.json
"""
import json, os, re, difflib, unicodedata, subprocess, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
AUD = os.path.join(ROOT, 'audio', 'no-es-pereza-es-burnout')
# reutilizamos los constructores de elementos de viz.py sin ejecutar su salida
src = open(os.path.join(HERE, 'viz.py')).read().split('base = json.load')[0]
ns = {'__file__': os.path.join(HERE, 'viz.py')}
exec(src, ns)
g = lambda *ks: (ns[k] for k in ks)
T, TT, Q, E, P, ST, M, CARD, D3, BAT, LAB, STAIRS, LINE, PROP, VLINE, BRASAS, FOG, EMB, d, PHONE_SCREEN = g('T', 'TT', 'Q', 'E', 'P', 'ST', 'M', 'CARD', 'D3', 'BAT', 'LAB', 'STAIRS', 'LINE', 'PROP', 'VLINE', 'BRASAS', 'FOG', 'EMB', 'd', 'PHONE_SCREEN')

def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    return re.findall(r'[\wáéíóúüñ]+', re.sub(r'\[[^\]]*\]', ' ', s))

def words_of(n):
    script = open(os.path.join(HERE, 'tts', f'short_0{n}.txt')).read()
    disp = re.sub(r'\[[^\]]*\]', ' ', script).split()
    ref, owner = [], []
    for i, w in enumerate(disp):
        for t in norm(w):
            ref.append(t); owner.append(i)
    wj = json.load(open(os.path.join(AUD, f'transcripcion_palabras_short_0{n}.json')))
    hyp, ht = [], []
    for w, s, e in wj:
        for t in norm(w):
            hyp.append(t); ht.append((s, e))
    tm = [None] * len(ref)
    for a, b, size in difflib.SequenceMatcher(None, ref, hyp, autojunk=False).get_matching_blocks():
        for k in range(size):
            tm[a + k] = ht[b + k]
    known = [i for i, v in enumerate(tm) if v]
    for i in range(len(tm)):
        if tm[i] is None:
            p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
            if p is None: tm[i] = (tm[q][0] - 0.3, tm[q][0])
            elif q is None: tm[i] = (tm[p][1], tm[p][1] + 0.3)
            else:
                f = (i - p) / (q - p); s0 = tm[p][1] + (tm[q][0] - tm[p][1]) * f
                tm[i] = (s0, s0 + 0.25)
    out = []
    for i, w in enumerate(disp):
        ks = [k for k, o in enumerate(owner) if o == i]
        if ks:
            out.append(dict(w=w, s=round(tm[ks[0]][0], 2), e=round(tm[ks[-1]][1], 2)))
    return out

def dur_of(audio):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).decode())

def at_phrase(words, phrase):
    p = norm(phrase)
    flat = [(t, i) for i, w in enumerate(words) for t in norm(w['w'])]
    for k in range(len(flat) - len(p) + 1):
        if [t for t, _ in flat[k:k + len(p)]] == p:
            return max(0, words[flat[k][1]]['s'] - 0.1)
    raise SystemExit(f'frase no encontrada: {phrase}')

X = 540
def clip(n):
    """El mismo clip de Envato del video largo, centrado sobre una copia desenfocada."""
    f = os.path.join(ROOT, 'recursos', 'stock', f'escena_{n:03d}.mp4')
    dst = os.path.join(ROOT, 'public', 'burnout', 'stock', os.path.basename(f))
    if not os.path.exists(dst):
        shutil.copy(f, dst)
    return d('live', kw='', src=f'burnout/stock/{os.path.basename(f)}', fit='blurfill', pan=1)

# escalera vertical: escalón k en x = SX0 + (k-1)·SSW, y = SY0 + (k-1)·SSH
SX0, SY0, SSW, SSH = 45, 430, 198, 125
def ST_(**kw): return STAIRS(x=SX0, y=SY0, sw=SSW, sh=SSH, **kw)
def phone(**kw): return D3('celular', x=X, y=700, w=820, glow='red', pulse=5, screen=PHONE_SCREEN, battery={'to': 0.03, 'blink': True}, **kw)
TOP = 260  # texto en el tercio superior

SHORTS = {
    1: ('short_01_celular-al-3.mp3', [
        ('Piensa en un celular', 'black', [phone(), T('3 %', x=X, y=TOP, size=170, color='red', at=0.3)], 'Bip de batería baja'),
        ('Le puedes gritar', 'slate', [E('📢', x=290, y=820, size=230, rot=-12, idle=False), D3('celular', x=770, y=780, w=520, shake=6, screen=PHONE_SCREEN, battery={'to': 0.03, 'blink': True}), d('rain', ch='❗', n=10, speed=300, size=60)], 'Megáfono'),
        ('pero la batería no sube', 'slate', [BAT(0.03, x=X, y=720, w=640, blink=True)], 'Bip de batería baja'),
        ('Al celular no le falta', 'slate', [CARD('', '💪', x=290, y=740, w=420, h=460, color='green', mark='check', markAt=0.5), CARD('', '🪫', x=790, y=740, w=420, h=460, color='red', mark='x', markAt=1.6, at=1.0)], 'Ding + error'),
        ('Por eso', 'red', [ST('NO AYUDA', x=X, y=720, size=110)], 'Sello + impacto'),
        ('le pide más energía', 'slate', [E('🫗', x=420, y=640, size=240, rot=20, idle=False), E('🫙', x=720, y=880, size=170, idle=False, at=0.3)], 'Goteo vacío'),
        ('Y encima le agrega culpa', 'slate', [P('bags', x=470, y=820, s=1.1, mood='tired'), E('🎒', x=680, y=800, size=200, anim='fall', at=0.2), TT('+ PESO', x=X, y=TOP, size=140, color='red')], 'Peso cayendo'),
        ('Lo que necesita alguien', 'warm', [BAT(0.9, x=620, y=720, w=560, charge=True, frm=0.03, lAt=0.6, dur=3.0), E('🔌', x=170, y=720, size=170, anim='left')], 'Conexión + carga ascendente'),
        ('descanso de verdad', 'green', [CARD('', '🛌', x=200, y=740, w=310, h=380, color='green', size=30), CARD('', '🤝', x=X, y=740, w=310, h=380, color='green', size=30, at=0.6), CARD('', '🩺', x=880, y=740, w=310, h=380, color='green', size=26, at=1.4)], 'Ding ×3'),
        ('No un regaño', 'black', [phone(anim='none'), T('3 %', x=X, y=TOP, size=170, color='red', anim='none')], 'Firma sonora del canal'),
    ], True),
    2: ('short_02_te-quemaste.mp3', [
        ('¿Flojera o burnout?', 'room', [PROP('sofa', x=270, y=920, s=0.45), P('sit', x=262, y=820, s=0.62, mood='tired', anim='none'), PROP('sofa', x=810, y=920, s=0.45), P('sit', x=802, y=820, s=0.62, mood='tired', anim='none'), VLINE(x=X), T('¿CUÁL ES *CUÁL*?', x=X, y=TOP, size=96, w=1000, acc='gold')], 'Whoosh partido'),
        ('Lo que solemos llamar flojera', 'slate', [LINE([[0, 0.22], [1, 0.22]], color='ash', dur=2.2, x0=110, x1=970, yb=1060, yt=520), T('SIEMPRE *IGUAL*', x=X, y=TOP, size=96, w=1000, acc='ash')], 'Línea dibujándose'),
        ('alguien así casi nunca', 'slate', [LINE([[0, 0.22], [1, 0.22]], color='ash', at=0, dur=0.01, x0=110, x1=970, yb=1060, yt=520, ticks=[0.15, 0.5, 0.85]), E('😐', x=X, y=TOP + 40, size=150, at=0.3)], 'Tic-tac lento'),
        ('Pero si tú eras', 'warm', [P('handup', x=380, y=820, s=1.1, mood='happy'), E('🏅', x=380, y=740, size=80, at=0.3, idle=False), E('🎯', x=800, y=700, size=200, at=0.6), TT('ANTES', x=X, y=TOP, size=140, color='goldL')], 'Fanfarria corta'),
        ('y solo últimamente', 'slate', [LINE([[0, 0.8], [0.45, 0.84], [0.62, 0.8], [0.75, 0.15], [1, 0.1]], color='gold', dur=2.0, x0=110, x1=970, yb=1060, yt=520)], 'Bajada en picada'),
        ('no te volviste flojo', 'slate', [P(x=X, y=820, s=1.25, mood='worried'), LAB('PEREZOSO', x=X, y=790, size=60, anim='none', cross=0.6)], 'Tachón'),
        ('Te quemaste', 'black', [clip(47), TT('NO ES FLOJERA', x=X, y=TOP, size=110, w=1000, color='gold')], 'Cerillo apagándose + humo'),
        ('Porque nadie llega', 'ember', [BRASAS(op=0.9), EMB(n=20), Q('Antes\n*brillabas*', x=X, y=640, size=130, w=1000, acc='gold', glow=True)], 'Golpe cálido'),
    ], False),
    3: ('short_03_cinco-escalones.mp3', [
        ('El burnout no llega', 'black', [D3('escalera', x=X, y=760, w=900, flipX=True, tilt3d=True, gray=0.3), FOG(op=0.4)], 'Pasos descendentes'),
        ('Uno: entusiasmo', 'dark', [ST_(litAt=[0.2], active=1), E('🚀', x=SX0 + SSW / 2, y=SY0 - 90, size=110, at=0.4), T('ETAPA 1', x=X, y=TOP, size=80, w=1000, color='green')], 'Despegue corto'),
        ('Dos: estancamiento', 'dark', [ST_(lit=[1], litAt=[None, 0.2], active=2), E('🔍', x=SX0 + SSW * 1.5 + 500, y=SY0 + SSH - 60, size=170, mx=-500, mAt=1.2, mDur=1.0, anim='none'), T('ETAPA 2', x=X, y=TOP, size=80, w=1000, color='yellow')], 'Golpe grave + lupa'),
        ('Tres: frustración', 'slate', [PROP('bike', x=X, y=880, s=0.9), P('sit', x=576, y=740, s=0.8, mood='worried', sweat=True, walk=True, anim='none'), T('ETAPA 3', x=X, y=TOP, size=80, w=1000, color='gold')], 'Pedaleo'),
        ('Cuatro: apatía', 'dark', [ST_(lit=[1, 2, 3], litAt=[None, None, None, 0.2], active=4), T('ETAPA 4', x=X, y=TOP, size=80, w=1000, color='ash')], 'Enchufe'),
        ('Y cinco: burnout', 'black', [ST_(lit=[1, 2, 3, 4], litAt=[None, None, None, None, 0.2], active=5), FOG(op=0.55, at=0.3), T('ETAPA 5', x=X, y=TOP, size=90, w=1000, color='ash')], 'Impacto profundo'),
        ('Lo bueno de una escalera', 'warm', [ST_(lit=[1, 2, 3, 4, 5]), P(x=SX0 + 3.5 * SSW, y=SY0 + 3 * SSH - 120, s=0.48, mood='happy', walk=True, mx=-3 * SSW, my=-3 * SSH, mAt=0.2, mDur=2.6, anim='none'), TT('HAY *SALIDA*', x=X, y=150, size=110, w=1000, acc='green')], 'Pasos ascendentes + acorde'),
        ('¿En qué escalón estás tú?', 'dark', [ST_(lit=[1, 2, 3, 4, 5], marker=3, markerAt=0.3), TT('¿TÚ?', x=X, y=TOP, size=170, color='gold')], 'Firma sonora del canal'),
    ], True),
}

out = []
for n, (audio, rows, loop) in SHORTS.items():
    words = words_of(n)
    dur = dur_of(os.path.join(AUD, audio))
    total = round(dur + (0.15 if loop else 0.9), 2)
    scenes = []
    for k, (ph, bg, els, sfx) in enumerate(rows):
        st = 0.0 if k == 0 else at_phrase(words, ph)
        scenes.append(dict(n=k + 1, start=round(st, 2), bg=bg, els=els, sec=0, sfx=sfx, mus='↳', paper=0.25))
    for a, b in zip(scenes, scenes[1:] + [None]):
        a['end'] = b['start'] if b else total
    out.append(dict(id=f'Short{n}', audio=audio, duration=total, loop=loop, scenes=scenes, words=words))
    print(f'Short{n}: {total:.2f} s, {len(scenes)} escenas, {len(words)} palabras, cortes en', [s['start'] for s in scenes])

# regla del canal también en los shorts
exec('#' + open(os.path.join(HERE, 'viz.py')).read().split('# ── regla del canal')[1].split('REPETIDOS =')[0], ns)
bad = [(sh['id'], sc['n'], r) for sh in out for sc in sh['scenes'] if (r := ns['repetidos'](sc['n'], sc))]
if bad:
    raise SystemExit(f'Texto repetido en un short: {bad}')
json.dump(out, open(os.path.join(ROOT, 'src', 'burnout', 'shorts.json'), 'w'), ensure_ascii=False, indent=1)
