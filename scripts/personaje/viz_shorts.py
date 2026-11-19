"""Plan de los 3 shorts verticales (1080×1920) con subtítulos palabra por palabra.

Cada escena arranca en una frase del guion; los tiempos salen de la transcripción real del audio.
Uso: python3 scripts/personaje/viz_shorts.py  → src/personaje/shorts.json
"""
import json, os, re, difflib, unicodedata, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
AUD = os.path.join(ROOT, 'audio', 'el-personaje-del-miedo')
import importlib.util
spec = importlib.util.spec_from_file_location('viz', os.path.join(HERE, 'viz.py'))
# reutilizamos los constructores de elementos de viz.py sin ejecutar su salida
src = open(os.path.join(HERE, 'viz.py')).read().split('base = json.load')[0]
ns = {'__file__': os.path.join(HERE, 'viz.py')}
exec(src, ns)
T, E, TAG, P, FR, ST, M, F, PH, BARS, LIGHT, CLK, MASK, SPOT, BEAR, MET, TH, BED, CARD, d = (ns[k] for k in ['T', 'E', 'TAG', 'P', 'FR', 'ST', 'M', 'F', 'PH', 'BARS', 'LIGHT', 'CLK', 'MASK', 'SPOT', 'BEAR', 'MET', 'TH', 'BED', 'CARD', 'd'])

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

def clip(n):
    # usa el mismo clip de Envato del video largo (recursos/stock/escena_NNN.mp4), centrado sobre su copia desenfocada
    import shutil
    for ext in ('mp4', 'jpg'):
        f = os.path.join(ROOT, 'recursos', 'stock', f'escena_{n:03d}.{ext}')
        if os.path.exists(f):
            d_ = os.path.join(ROOT, 'public', 'personaje', 'stock'); os.makedirs(d_, exist_ok=True)
            if not os.path.exists(os.path.join(d_, os.path.basename(f))):
                shutil.copy(f, os.path.join(d_, os.path.basename(f)))
            return d('live', kw='', src=f'personaje/stock/{os.path.basename(f)}', fit='blurfill', pan=1)
    return d('live', kw='STOCK PENDIENTE', ch='🎬')
SHORTS = {
    1: ('short_01_oso-blanco.mp3', [
        ('Durante cinco segundos', 'cream', [BEAR(x=X, y=820, s=0.8), M('x', x=X, y=820, size=520, color='coral', at=0.2), d('count', **{'from': 5, 'to': 0}, x=X, y=300, size=150, dur=5.0, color='ink', at=0.3)], 'Tic-tac'),
        ('¿En qué pensaste?', 'black', [clip(99), T('¿EN QUÉ *PENSASTE*?', x=X, y=320, size=84, w=1000)], 'Viento + ding cómico'),
        ('En 1987', 'dark', [F('paper', x=X, y=820, w=820, h=560, text='WEGNER · 1987', size=64), T('UN ESTUDIO *REAL*', x=X, y=300, size=84, w=1000)], 'Papel + whoosh'),
        ('entre más intentas', 'cream', [P('reach', x=300, y=900, s=1.1, mood='worried', sweat=True), BEAR(x=760, y=820, s=0.6, peek=True, anim='right', at=0.3), T('PROCESOS *IRÓNICOS*', x=X, y=300, size=80, w=1000, color='ink', acc='#c0662a')], 'Empuje + boing'),
        ('Y en una plática', 'party', [P(x=330, y=900, s=1.1, mood='worried'), FR(x=760, y=900, s=1.1, flip=True), E('💬', x=X, y=560, size=180, at=0.3)], 'Whoosh'),
        ('Quien intenta con todas', 'room', [P(x=X, y=900, s=1.3, mood='worried', walk=True), E('🏺', x=250, y=1080, size=120, rot=70, at=0.6), T('EVITAR LO *INCÓMODO*', x=X, y=300, size=80, w=1000)], 'Cosas cayendo, golpe'),
        ('Quien tiene terror', 'room', [P('reach', x=X, y=900, s=1.3, mood='worried', sweat=True, hold='📄'), E('📄', x=300, y=1120, size=100, rot=30, at=0.4)], 'Hojas cayendo, papel'),
        ('No es mala suerte', 'cream', [P(x=330, y=900, s=1.1, mood='worried'), BEAR(x=760, y=820, s=0.75, wave=True, anim='right', at=0.3), T('ES EL *OSO BLANCO*', x=X, y=300, size=84, w=1000, color='ink', acc='#c0662a')], 'Ding cómico boing'),
        ('Así que en tu próxima', 'cream', [BEAR(x=X, y=820, s=0.8, wink=True, winkAt=0.8), M('x', x=X, y=820, size=520, color='coral', at=0.1)], 'Tic-tac'),
    ], True),
    2: ('short_02_camiseta.mp3', [
        ('Imagina entrar', 'room', [P(x=X, y=900, s=1.5, mood='worried', sweat=True, anim='zoom'), E('👕', x=X, y=900, size=120, at=0.2), E('😳', x=820, y=520, size=150, at=0.5)], 'Impacto + risas'),
        ('Eso hicieron', 'black', [clip(65), T('*CORNELL*', x=X, y=320, size=100, w=1000)], 'Ambiente de campus, viento'),
        ('Calcularon que la mitad', 'dark', [BARS([{'label': 'CREYERON', 'to': 0.5, 'color': 'coral'}], x=X, y=860, h=520), T('50 %', x=X, y=300, size=130, color='coral', at=0.8)], 'Riser corto'),
        ('¿Sabes cuántos', 'dark', [BARS([{'label': 'CREYERON', 'from': 0.5, 'to': 0.5, 'color': 'coral'}, {'label': 'REALIDAD', 'to': 0.1, 'color': 'greenL'}], x=X, y=860, h=520, dur=3.0), T('¿CUÁNTOS DE *VERDAD*?', x=X, y=300, size=80, w=1000)], 'Redoble'),
        ('Menos de una cuarta', 'dark', [BARS([{'label': 'CREYERON', 'from': 0.5, 'to': 0.5, 'color': 'coral'}, {'label': 'REALIDAD', 'from': 0.1, 'to': 0.23, 'color': 'greenL'}], x=X, y=860, h=520, dur=0.4), T('~23 %', x=X, y=300, size=130, color='greenL', at=0.3)], 'Impacto + ding'),
        ('Se llama efecto reflector', 'street', [SPOT(x=X, y=1180, w=560, follow=60), P(x=X, y=960, s=1.2, mood='worried', walk=True), T('EFECTO *REFLECTOR*', x=X, y=300, size=86, w=1000)], 'Zumbido de luz, riser'),
        ('Pero esa luz', 'street', [SPOT(x=X, y=1180, w=560, off=1.0), P(x=X, y=960, s=1.2, mood='worried', anim='none')], 'Clic + silencio'),
        ('Porque los demás', 'street', [SPOT(x=240, y=1180, w=300, dim=0.2, lamp=False), SPOT(x=X, y=1180, w=300, dim=False, lamp=False), SPOT(x=840, y=1180, w=300, dim=False, lamp=False), d('person', pose='stand', x=240, y=960, s=0.8, hood='#2a3157', dark='#1a1f3a', sil=True), P(x=X, y=960, s=0.8, mood='happy'), d('person', pose='stand', x=840, y=960, s=0.8, hood='#2a3157', dark='#1a1f3a', sil=True, flip=True), T('¿Y TÚ, *A QUIÉN* VIGILAS?', x=X, y=300, size=76, w=1000)], 'Zumbidos + acorde cálido, ding'),
    ], False),
    3: ('short_03_dos-de-la-manana.mp3', [
        ('Son las dos de la mañana', 'night', [CLK(x=X, y=330, s=0.9), BED('worried', x=X, y=900, s=0.85, phone=True)], 'Zumbido + grillos'),
        ('Te tengo una noticia', 'night', [BED('worried', x=X, y=900, s=0.85, anim='none'), E('📩', x=X, y=520, size=200, anim='pop')], 'Notificación ding'),
        ('En 2018', 'black', [clip(82), T('UN ESTUDIO DE *2018*', x=X, y=320, size=80, w=1000)], 'Ambiente de café'),
        ('y luego les preguntaron', 'dark', [F('post', x=X, y=700, w=860, h=230, text='¿TE CAYÓ BIEN?', size=62), F('post', x=X, y=1000, w=860, h=230, text='¿LE CAÍSTE BIEN?', size=62, at=1.6)], 'Pop ×2'),
        ('Casi todos creyeron', 'dark', [MET(0.3, x=330, y=820, h=520, color='coral', label='LO QUE CREÍAS', labelSize=40), MET(0.8, x=750, y=820, h=520, color='greenL', label='LO QUE SINTIÓ', labelSize=40, at=0.8)], 'Riser + ding'),
        ('Se llama brecha de agrado', 'dark', [MET(0.3, x=330, y=820, h=520, color='coral', anim='none', **{'from': 0.3}), MET(0.8, x=750, y=820, h=520, color='greenL', anim='none', **{'from': 0.8}), T('BRECHA DE *AGRADO*', x=X, y=300, size=86, w=1000)], 'Shimmer'),
        ('Así que esa frase rara', 'night', [BED('happy', x=X, y=900, s=0.85), TH(x=X, y=560, w=560, h=230, scribble=True, release=0.8)], 'Viento suave'),
        ('Ya duérmete', 'night', [CLK(x=X, y=330, s=0.9, anim='none'), BED('sleep', x=X, y=900, s=0.85, anim='none')], 'Clic de lámpara'),
    ], True),
}

out = []
for n, (audio, rows, loop) in SHORTS.items():
    words, *_ = words_of(n, os.path.join(AUD, audio))
    dur = dur_of(os.path.join(AUD, audio))
    total = round(dur + (0.15 if loop else 0.8), 2)
    scenes = []
    for k, (ph, bg, els, sfx) in enumerate(rows):
        kw = {}
        st = 0.0 if k == 0 else at_phrase(words, ph)
        for e in els:
            if 'y' in e and e['k'] not in ('live', 'light', 'spot') and not (e['k'] == 'txt' and e['y'] <= 430):
                e['y'] -= 120
            if e['k'] == 'spot':
                e['y'] -= 120
        scenes.append(dict(n=k + 1, start=round(st, 2), bg=bg, els=els, sec=0, hud=False, sfx=sfx, mus='↳', **kw))
    for a, b in zip(scenes, scenes[1:] + [None]):
        a['end'] = b['start'] if b else total
    out.append(dict(id=f'Short{n}', audio=audio, duration=total, loop=loop, scenes=scenes, words=words))
    print(f'Short{n}: {total:.2f} s, {len(scenes)} escenas, {len(words)} palabras, cortes en', [s['start'] for s in scenes])
json.dump(out, open(os.path.join(ROOT, 'src', 'personaje', 'shorts.json'), 'w'), ensure_ascii=False, indent=1)
