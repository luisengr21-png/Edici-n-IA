"""Plan de los 3 shorts de «La riqueza de otros» → src/riqueza/shorts.json.
Cada escena empieza en una frase del guion del short (se busca en la transcripción real).
Uso: python3 scripts/riqueza/viz_shorts.py"""
import json, os, re, unicodedata, difflib
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
AUD = os.path.join(ROOT, 'audio', 'la-riqueza-de-otros')
exec(open(os.path.join(HERE, 'viz.py')).read().split('# ── plan ──')[0].split('# ── tiempos reales ──')[0])  # parser + íconos/textos
exec('EMO=' + re.search(r'EMO = (dict\(.*?\))\nSVG', open(os.path.join(HERE, 'viz.py')).read(), re.S).group(1))
src = open(os.path.join(HERE, 'viz.py')).read()
exec(src[src.index('SVG = {'):src.index('# ── plan ──')])
exec('NUM=' + re.search(r'NUM = (\{.*?\})\n', src, re.S).group(1))
def nz(s): return re.findall(r'[\wáéíóúüñ]+', unicodedata.normalize('NFC', s.lower()))
V = lambda f, off=0.4: dict(t='v', src=f'riqueza/videos/{f}.mp4', off=off)
def F(f):
    from PIL import Image
    w, h = Image.open(os.path.join(ROOT, 'public', 'riqueza', 'fotos', f + '.jpg')).size
    return dict(t='f', src=f'riqueza/fotos/{f}.jpg', k=0, ar=round(w / h, 3))
I = lambda *ks: [icon(f'icono_{k}.png') for k in ks]
SH = {
 1: ('El ladrillo de 4,000 dólares', 'texto_short1', [
   ('En 1983 solo lo podía', 'FOTO', [F('foto_003')], I('sombrero_copa'), None, []),
   ('El primer celular', 'ÍCONOS', [], I('bascula', 'bateria_baja', 'etiqueta_precio'), None, []),
   ('Hoy traes algo mil veces mejor', 'VIDEO', [V('escena_010')], [], None, []),
   ('Y no eres millonario', '2D', [], [], dict(pose='shrug', mood='happy'), []),
   ('Qué pasó', '2D', [], [], dict(pose='scratch'), []),
   ('Competencia', 'VIDEO', [V('escena_056')], [], None, []),
   ('Cuando una empresa cobra de más', 'ÍCONOS', [], I('empresa', 'etiqueta_precio', 'empresa_2'), None, []),
   ('Alguien se hizo muy rico', 'VIDEO', [V('escena_013', 3)], [], None, []),
   ('Y aun así tú saliste ganando', '2D', [], [], dict(pose='handup', mood='happy'), []),
   ('Porque tener cosas mejores', 'VIDEO', [V('escena_001')], [], None, []),
   ('aunque tu cuenta no lo diga', '2D', [], I('corona'), dict(pose='hips', mood='happy'), []),
 ]),
 2: ('El millonario que fue héroe y villano', 'texto_short2', [
   ('Este hombre regaló', 'ÍCONOS', [], I('silueta_1900', 'regalo'), None, []),
   ('Más de 2 500 bibliotecas', 'VIDEO', [V('escena_106')], I('birrete', 'microscopio'), None, []),
   ('El rico perfecto', 'ÍCONOS', [], I('silueta_1900', 'aureola'), None, []),
   ('Pues aguanta', '2D', [], [], dict(pose='handup', mood='worried'), ['dark']),
   ('En 1892 sus obreros', 'FOTO', [F('foto_114')], I('tijeras'), None, []),
   ('La empresa los dejó afuera', 'VIDEO', [V('escena_069')], I('guardias'), None, []),
   ('Hubo balazos', 'VIDEO', [V('escena_118')], [], None, []),
   ('Andrew Carnegie fue los dos', 'ÍCONOS', [], I('silueta_1900', 'balanza'), None, ['tilt']),
   ('Por eso a un rico no se le juzga', 'VIDEO', [V('escena_018')], [], None, []),
   ('Tú qué opinas', 'ÍCONOS', [], I('balanza', 'comentario'), None, ['tilt']),
 ]),
 3: ('Ford duplicó el sueldo', 'texto_short3', [
   ('En 1914 Henry Ford', 'FOTO', [F('foto_178')], [], None, []),
   ('duplicó el sueldo', 'ÍCONOS', [], I('moneda', 'moneda'), None, []),
   ('Le dijeron que iba a quebrar', 'ÍCONOS', [], I('grafica_baja'), None, []),
   ('Y qué pasó', '2D', [], [], dict(pose='stand', mood='worried'), []),
   ('Sus trabajadores dejaron de renunciar', 'FOTO', [F('foto_182')], [], None, []),
   ('y con ese sueldo empezaron', 'FOTO', [dict(F('foto_178'), k=1)], I('llave_auto'), None, []),
   ('Ford se hizo todavía más rico', 'VIDEO', [V('escena_013', 8)], [], None, []),
   ('O sea pagarle bien', 'ÍCONOS', [], I('apreton'), None, []),
   ('Porque sin empleados', 'VIDEO', [V('escena_163')], [], None, []),
   ('y sin trabajadores no hay progreso', 'VIDEO', [V('escena_186')], [], None, []),
 ]),
}
HOOK = {t[0][:-4]: t[1] for t in SHORT_TXT}
out = []
for n, (title, hook, rows) in SH.items():
    meta = json.load(open(os.path.join(AUD, f'short_0{n}_meta.json')))
    aw = json.load(open(os.path.join(AUD, f'transcripcion_palabras_short_0{n}.json')))
    hyp, ht = [], []
    for w, s, e in aw:
        for t in nz(w):
            for u in (NUM[t].split() if t in NUM else [t]): hyp.append(u); ht.append(s)
    scenes, pos = [], 0
    for k, (ph, tipo, media, icons, per, fx) in enumerate(rows):
        p = [u for t in nz(ph) for u in (NUM[t].split() if t in NUM else [t])]
        best, bi = 0, None
        for i in range(pos, len(hyp) - len(p) + 1):
            r = difflib.SequenceMatcher(None, p, hyp[i:i + len(p)]).ratio()
            if r > best: best, bi = r, i
        assert best >= 0.75, (n, ph, best)
        pos = bi + 1
        st = 0.0 if k == 0 else max(0.0, ht[bi] - 0.1)
        txt = [dict(tx(HOOK[hook], 'con', 'mediano'), y=300)] if k == 0 else []
        sc = dict(n=k + 1, start=round(st, 2), tipo=tipo, media=media, icons=icons, txt=txt, fx=fx, vertical=True, hit=False)
        if per: sc['person'] = per
        scenes.append(sc)
    dur = round(meta['duration'] + 0.6, 2)
    for a, b in zip(scenes, scenes[1:]): a['end'] = b['start']
    scenes[-1]['end'] = dur
    # Subtítulos con las palabras exactas del guion del short y los tiempos de la transcripción
    script = re.sub(r'\[[^\]]*\]', ' ', open(os.path.join(HERE, 'tts', f'short_0{n}.txt')).read()).split()
    sref, sof = [], []
    for i, w in enumerate(script):
        for tkn in nz(w):
            for u in (NUM[tkn].split() if tkn in NUM else [tkn]): sref.append(u); sof.append(i)
    he = []
    for w, s, e in aw:
        for tkn in nz(w):
            for u in (NUM[tkn].split() if tkn in NUM else [tkn]): he.append((s, e))
    m2 = difflib.SequenceMatcher(None, sref, hyp, autojunk=False)
    ts = [None] * len(script); te = [None] * len(script)
    for a, b, size in m2.get_matching_blocks():
        for k in range(size):
            i = sof[a + k]
            if ts[i] is None: ts[i] = he[b + k][0]
            te[i] = he[b + k][1]
    kn = [i for i in range(len(script)) if ts[i] is not None]
    for i in range(len(script)):  # huecos (números que Whisper escribe con cifras): se reparten parejo
        if ts[i] is None:
            p_ = max([k for k in kn if k < i], default=None); q_ = min([k for k in kn if k > i], default=None)
            a0 = te[p_] if p_ is not None else 0.0
            a1 = ts[q_] if q_ is not None else a0 + 0.4 * (i + 1)
            gap = (q_ if q_ is not None else len(script)) - (p_ if p_ is not None else -1)
            j = i - (p_ if p_ is not None else -1)
            ts[i] = a0 + (a1 - a0) * (j - 1) / (gap - 1); te[i] = a0 + (a1 - a0) * j / (gap - 1)
    words = [[w, round(ts[i], 2), round(max(te[i], ts[i] + 0.05), 2)] for i, w in enumerate(script)]
    print('  cobertura subtítulos', round(len(kn) / len(script), 2))
    out.append(dict(id=f'Short{n}', title=title, duration=dur, scenes=scenes, words=words))
    print(n, title, dur, [round(s['end'] - s['start'], 1) for s in scenes])
json.dump(out, open(os.path.join(ROOT, 'src', 'riqueza', 'shorts.json'), 'w'), ensure_ascii=False, indent=0)
