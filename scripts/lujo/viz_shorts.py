"""Plan de los 3 shorts verticales (1080×1920) con subtítulos palabra por palabra.

Cada escena arranca en una frase del guion; los tiempos salen de la transcripción real del audio.
Uso: python3 scripts/lujo/viz_shorts.py  → src/lujo/shorts.json
"""
import json, os, re, difflib, unicodedata, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
AUD = os.path.join(ROOT, 'audio', 'pobreza-de-lujo')
import importlib.util
spec = importlib.util.spec_from_file_location('viz', os.path.join(HERE, 'viz.py'))
# reutilizamos los constructores de elementos de viz.py sin ejecutar su salida
src = open(os.path.join(HERE, 'viz.py')).read().split('base = json.load')[0]
ns = {'__file__': os.path.join(HERE, 'viz.py')}
exec(src, ns)
T, E, TAG, P, SEL, H, BAG, CAGE, ST, M, F, PH, PZ, BARS, LIGHT, d = (ns[k] for k in ['T', 'E', 'TAG', 'P', 'SEL', 'H', 'BAG', 'CAGE', 'ST', 'M', 'F', 'PH', 'PZ', 'BARS', 'LIGHT', 'd'])

def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    return re.findall(r'[\wáéíóúüñ]+', re.sub(r'\[[^\]]*\]', ' ', s))

def words_of(n, audio):
    script = open(os.path.join(HERE, 'tts', f'short_0{n}.txt')).read()
    clean = re.sub(r'\[[^\]]*\]', ' ', script)
    disp = clean.split()  # palabras tal como se escriben (con puntuación)
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
    sm = difflib.SequenceMatcher(None, ref, hyp, autojunk=False)
    for a, b, size in sm.get_matching_blocks():
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
        if not ks:
            continue
        out.append(dict(w=w, s=round(tm[ks[0]][0], 2), e=round(tm[ks[-1]][1], 2)))
    return out, ref, tm, owner, disp

def dur_of(audio):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', audio]).decode())

def at_phrase(words, phrase):
    p = norm(phrase)
    toks = [norm(w['w']) for w in words]
    flat = [(t, i) for i, ts in enumerate(toks) for t in ts]
    for k in range(len(flat) - len(p) + 1):
        if [t for t, _ in flat[k:k + len(p)]] == p:
            return max(0, words[flat[k][1]]['s'] - 0.1)
    raise SystemExit(f'frase no encontrada: {phrase}')

X = 540
SHORTS = {
    1: ('short_01_si-te-tratan-mal.mp3', [
        ('Si una vendedora', 'shop', [SEL('look', x=X, y=900, s=1.9, anim='zoom'), T('TE TRATAN MAL → *GASTAS MÁS*', x=X, y=300, size=78, w=980)], {}),
        ('Y no lo digo yo', 'dark', [E('🤚', x=X, y=820, size=320), T('NO LO DIGO *YO*', x=X, y=300, size=86, w=980)], {}),
        ('En 2014', 'dark', [F('paper', x=X, y=820, w=620, h=760, stamp='2014', text='ESTUDIO', size=56, anim='down'), T('UN ESTUDIO *REAL* · 2014', x=X, y=300, size=76, w=980)], {}),
        ('cuando una tienda de lujo', 'shop', [SEL('frown', x=720, y=880, s=1.2, arms='cross'), P(x=300, y=940, s=0.95), T('…TE HACE SENTIR *MENOS*', x=X, y=300, size=76, w=980)], {}),
        ('¿Lo lógico?', 'shop', [P(x=420, y=860, s=1.3, flip=True), F('sign', x=780, y=560, w=420, h=150, text='SALIDA →', size=56), T('¿LO LÓGICO? *IRTE*', x=X, y=300, size=84, w=980)], {}),
        ('¿Lo que pasa?', 'shop', [P(x=540, y=860, s=1.3, anim='none'), E('⏪', x=X, y=520, size=180, anim='zoom'), T('¿LO QUE PASA…?', x=X, y=300, size=84, w=980)], {'glitch': 0.0}),
        ('Y que estés dispuesto', 'dark', [SEL('frown', x=330, y=900, s=1.05, arms='cross'), BARS([{'label': 'DESEO', 'from': 0.2, 'to': 0.95, 'color': 'pink'}], x=780, y=860, h=480, bw=170), TAG('+ $', x=620, y=560, size=80, at=0.4), T('MÁS *DESEO* · MÁS *$*', x=X, y=300, size=80, w=980, acc='pink')], {}),
        ('Sobre todo si', 'dark', [F('glass', x=X, y=840, w=820, h=860, anim='fade'), E('👜', x=X, y=700, size=220, glow='goldL'), P(x=X, y=1040, s=0.9), T('MARCAS QUE *ADMIRAS*', x=X, y=300, size=80, w=980)], {}),
        ('Efecto Pretty Woman', 'dark', [LIGHT(x=X), T('EFECTO\n*PRETTY WOMAN*', x=X, y=760, size=120, font='serif', glow=True, w=1000)], {}),
        ('Compras para demostrar', 'shop', [P('bags', x=X, y=860, s=1.4, hold='🛍️', holdL='🛍️', walk=True), T('PARA *PERTENECER*', x=X, y=300, size=86, w=980)], {}),
        ('Así que la próxima', 'shop', [SEL('look', x=X, y=900, s=1.9, anim='none')], {}),
    ], True),
    2: ('short_02_bolso-pago-inicial.mp3', [
        ('Ese bolso de', 'black', [LIGHT(x=X), BAG(x=X, y=820, s=1.5), TAG('$2,000', x=640, y=560, size=80, at=0.3)], {}),
        ('Es un pago inicial', 'black', [LIGHT(x=X, at=-1), BAG(x=X, y=820, s=1.5, anim='none'), TAG('PAGO INICIAL', x=560, y=560, size=72, at=0.05)], {}),
        ('Mira la comida', 'dark', [E('🍽️', x=240, y=820, size=170), E('🏠', x=X, y=820, size=170, at=0.3), E('🎓', x=840, y=820, size=170, at=0.6), T('↑ ↑ ↑', x=X, y=600, size=150, color='red', at=0.4), T('COMIDA · CASA · *ESTUDIOS*', x=X, y=300, size=66, w=1000, acc='red')], {}),
        ('Los televisores', 'dark', [E('📺', x=340, y=820, size=200), E('📱', x=740, y=820, size=200, at=0.3), T('↓ ↓', x=X, y=1040, size=150, color='greenL', at=0.4), T('PANTALLAS · *MÁS BARATAS*', x=X, y=300, size=66, w=1000, acc='greenL')], {}),
        ('Lo chico te alcanza', 'dark', [d('card', text='CHICO', ch='📦', x=300, y=860, w=360, h=400, mark='check', markAt=0.5), d('card', text='GRANDE', ch='🏠', x=760, y=820, w=440, h=520, mark='x', markAt=1.1), T('CHICO ✓ · GRANDE ✕', x=X, y=300, size=76, w=1000)], {}),
        ('Y cuando sientes', 'cream', [P(x=330, y=900, s=1.2), H(x=780, y=780, s=0.9, fade=True, fadeAt=0.3, fadeDur=2.4), T('¿CASA? *NUNCA.*', x=X, y=300, size=86, w=1000, color='ink', acc='red')], {}),
        ('te compras la prueba', 'dark', [P('selfie', x=380, y=900, s=1.2, hold='📱', holdL='👜'), F('post', x=790, y=720, w=420, h=500, ch='👜', chSize=180, text='VOY BIEN ✨', size=42, at=0.3), T('"VOY BIEN"', x=X, y=300, size=90, w=1000, font='serif', italic=True)], {}),
        ('Aunque no vayas bien', 'dark', [E('🧾', x=X, y=760, size=320), PH(x=X, y=1060, s=0.35, big='-$', bigSize=200, color='red', at=0.3)], {}),
        ('Se llama pobreza de lujo', 'black', [T('POBREZA', x=X, y=300, size=110, font='serif', w=1000), T('*DE LUJO*', x=X, y=420, size=110, font='serif', w=1000), P(x=X, y=960, s=1.0), CAGE(mode='drop', x=X, y=940, s=1.0, at=0.3)], {'shake': 0.65}),
        ('Y lo más cruel', 'black', [LIGHT(x=X), BAG(x=X, y=820, s=1.5, anim='zoom')], {}),
    ], True),
    3: ('short_03_parka-antartida.mp3', [
        ('Esta parka se hizo', 'black', [d('live', kw='STOCK: antarctica blizzard person parka back view', ch='🥶', tint='linear-gradient(180deg,#c9dbe6,#7d95a6)'), T('HECHA PARA LA *ANTÁRTIDA*', x=X, y=330, size=76, w=1000)], {}),
        ('Hoy se usa en ciudades', 'black', [d('live', kw='STOCK: sunny city street people walking back view', ch='🏙️', tint='radial-gradient(circle at 50% 30%, #fff1b8, #8fb7d6 75%)'), T('…¿Y AQUÍ? 🙃', x=X, y=330, size=90, w=1000)], {}),
        ('Canada Goose empezó', 'black', [d('live', kw='STOCK: vintage sewing machine hands close up', ch='🧵'), T('TORONTO · *1957*', x=X, y=330, size=90, w=1000, font='serif')], {'sepia': True}),
        ('Tan poco glamoroso', 'dark', [F('ticket', x=X, y=820, w=600, h=380), ST('L.L. BEAN', x=440, y=770, size=56, at=0.3, color='gold'), ST('EDDIE BAUER', x=640, y=900, size=56, at=0.8, rot=6, color='gold'), T('FABRICABA *PARA OTROS*', x=X, y=300, size=76, w=1000)], {}),
        ('Hoy sus parkas pasan', 'dark', [E('🧥', x=X, y=860, size=420), TAG('+$1,000', x=640, y=600, size=86, at=0.3)], {'flash': True}),
        ('Qué cambió', 'dark', [E('🧥', x=300, y=780, size=260), E('🧥', x=780, y=780, size=260), d('card', text='ABRIGA = IGUAL', ch='🔥', x=X, y=1010, w=760, h=170, size=40), T('¿QUÉ CAMBIÓ? *EL MENSAJE*', x=X, y=300, size=72, w=1000)], {}),
        ('Baudrillard lo llamó', 'dark', [LIGHT(x=X), TAG('VALOR DE SIGNO', x=X, y=800, size=88), T('YA NO COMPRAS LO QUE HACE…', x=X, y=320, size=58, w=1000, at=1.0)], {}),
        ('Compras lo que dice de ti', 'dark', [E('🪞', x=X, y=800, size=300), E('✨', x=720, y=620, size=120, at=0.3), T('COMPRAS LO QUE *DICE DE TI*', x=X, y=300, size=74, w=1000)], {}),
        ('Y esa es apenas', 'dark', [PZ(x=X, y=800, size=180, active=1), T('PIEZA *1* DE 4', x=X, y=300, size=86, w=1000)], {}),
        ('La cuarta es la que duele', 'dark', [PZ(x=X, y=800, size=180, done=1, red=4), T('LA *4* DUELE ⚠️', x=X, y=300, size=90, w=1000, acc='red')], {}),
    ], False),
}

out = []
for n, (audio, rows, loop) in SHORTS.items():
    words, *_ = words_of(n, os.path.join(AUD, audio))
    dur = dur_of(os.path.join(AUD, audio))
    total = round(dur + (0.15 if loop else 0.8), 2)
    scenes = []
    for k, (ph, bg, els, kw) in enumerate(rows):
        st = 0.0 if k == 0 else at_phrase(words, ph)
        for e in els:
            if 'y' in e and e['k'] not in ('live', 'light') and not (e['k'] == 'txt' and e['y'] <= 430):
                e['y'] -= 120
        scenes.append(dict(n=k + 1, start=round(st, 2), bg=bg, els=els, sec=0, hud=False, **kw))
    for a, b in zip(scenes, scenes[1:] + [None]):
        a['end'] = b['start'] if b else total
    out.append(dict(id=f'Short{n}', audio=audio, duration=total, loop=loop, scenes=scenes, words=words))
    print(f'Short{n}: {total:.2f} s, {len(scenes)} escenas, {len(words)} palabras, cortes en', [s['start'] for s in scenes])
json.dump(out, open(os.path.join(ROOT, 'src', 'lujo', 'shorts.json'), 'w'), ensure_ascii=False, indent=1)
