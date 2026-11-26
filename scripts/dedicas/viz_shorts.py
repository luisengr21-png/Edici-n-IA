"""Plan de los 3 shorts de «¿A qué te dedicas?» → src/dedicas/shorts.json.

Cada escena empieza en una frase del guion del short (se busca en la transcripción real).
Fondos, transiciones y efectos salen de las mismas reglas del video largo (scripts/dedicas/estilo.py), en vertical,
y se revisan antes de escribir el plan. Íconos y textos los hago yo con código.
Uso: python3 scripts/dedicas/viz_shorts.py
"""
import json, os, re, sys, difflib, unicodedata
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, HERE)
import estilo
import viz  # íconos, textos y personaje del video largo (no escribe nada al importarse)

AUD = viz.AUD
def nz(s): return re.findall(r'[\wáéíóúüñ]+', unicodedata.normalize('NFC', s.lower()))
NUM = {'3': 'tres'}
def toks(s): return [u for t in nz(s) for u in NUM.get(t, t).split()]

def V(f, off=0.4): return dict(t='v', src=f'dedicas/videos/{f}.mp4', off=off)
def F(f):
    from PIL import Image
    w, h = Image.open(os.path.join(ROOT, 'public', 'dedicas', 'fotos', f + '.jpg')).size
    return dict(t='f', src=f'dedicas/fotos/{f}.jpg', ar=round(w / h, 3))
def I(*ks): return [viz.icon(f'icono_{k}.png') for k in ks]
def P(desc): return viz.person(desc)

# (frase donde empieza, tipo, medios, íconos, personaje, efectos)
SH = {
 1: ('Los 3 segundos', 'LOS 3 SEGUNDOS', [
   ('Y tú a qué te dedicas', 'VIDEO', [V('escena_002')], [], None, []),
   ('Tienes tres segundos', '2D', [], I('cronometro'), P('nervioso sudando'), []),
   ('Tres segundos para que esa persona decida', 'VIDEO', [V('escena_005')], [], None, []),
   ('Dices soy cirujano', 'FOTO', [F('foto_007')], [], None, []),
   ('Dices estoy buscando trabajo', 'FOTO', [F('foto_009')], [], None, []),
   ('y de repente ve a un amigo', 'VIDEO', [V('escena_010')], [], None, []),
   ('Vivimos rodeados de gente', 'VIDEO', [V('escena_020')], [], None, []),
   ('Sabes quién no lo hace', '2D', [], I('interrogacion'), P('curioso'), []),
   ('Tu mamá', 'FOTO', [F('foto_022')], [], None, []),
   ('Le importas tú', '2D', [], I('corazon'), P('sonríe'), []),
 ]),
 2: ('Lo que de verdad compra un Ferrari', 'NO ES AVARICIA', [
   ('La próxima vez que veas un Ferrari', 'VIDEO', [V('escena_029')], [], None, []),
   ('no pienses qué tipo tan codicioso', '2D', [], [], P('frunce desconfiado'), []),
   ('Piensa ahí va alguien', 'VIDEO', [V('escena_042')], [], None, []),
   ('Lo que la gente busca', 'ÍCONOS', [], I('dinero', 'auto_lujo'), None, []),
   ('Un reloj carísimo', 'FOTO', [F('foto_033')], [], None, []),
   ('la misma hora que tu celular', 'FOTO', [F('foto_034')], [], None, []),
   ('Lo que buscan es que los miren', 'ÍCONOS', [], I('ojo', 'oreja', 'aplauso'), None, []),
   ('Es una forma de amor', 'FOTO', [F('foto_039')], [], None, []),
 ]),
 3: ('La trampa de la meritocracia', '¿TE LO MERECES?', [
   ('Si crees que los que están arriba', 'VIDEO', [V('escena_066')], [], None, []),
   ('entonces también crees que los de abajo', 'VIDEO', [V('escena_067')], [], None, []),
   ('Esa es la trampa de la meritocracia', 'VIDEO', [V('escena_059')], [], None, []),
   ('En la Inglaterra medieval', 'FOTO', [F('foto_072')], [], None, []),
   ('Hoy les decimos perdedores', 'FOTO', [F('foto_perdedores')], [], None, []),
   ('Intenta decir en una entrevista', 'VIDEO', [V('escena_077')], [], None, []),
   ('La suerte sigue contando', 'VIDEO', [V('escena_087')], I('dado'), None, []),
   ('Así que no trates a nadie', '2D', [], [], P('mano en el pecho'), []),
 ]),
}

EMO_OF = {'dramatically', 'sad', 'warmly', 'angry', 'surprised', 'sarcastic', 'whispers'}
SPEED_OF = {'quickly', 'slowly'}

def build(n):
    title, hook, rows = SH[n]
    meta = json.load(open(os.path.join(AUD, f'short_0{n}_meta.json')))
    aw = json.load(open(os.path.join(AUD, f'transcripcion_palabras_short_0{n}.json')))
    hyp, ht, he = [], [], []
    for w, s, e in aw:
        for u in toks(w): hyp.append(u); ht.append(s); he.append((s, e))
    # emoción y velocidad activas en cada palabra del texto que se mandó a ElevenLabs
    raw = open(os.path.join(HERE, 'tts', f'short_0{n}.txt')).read()
    st = {'emo': None, 'speed': None}; ref, ref_emo = [], []
    for piece in re.split(r'(\[[^\]]*\])', raw):
        if piece.startswith('['):
            tag = piece[1:-1]
            if tag in EMO_OF: st['emo'] = tag
            elif tag in SPEED_OF: st['speed'] = tag
            elif tag == 'calmly': st = {'emo': None, 'speed': None}
            continue
        for u in toks(piece): ref.append(u); ref_emo.append((st['emo'], st['speed']))
    scenes, emos, pos = [], [], 0
    for k, (ph, tipo, media, icons, per, fx) in enumerate(rows):
        p = toks(ph)
        best, bi = 0, None
        for i in range(pos, len(hyp) - len(p) + 1):
            r = difflib.SequenceMatcher(None, p, hyp[i:i + len(p)]).ratio()
            if r > best: best, bi = r, i
        assert best >= 0.75, (n, ph, best)
        pos = bi + 1
        rb = max(range(len(ref) - len(p) + 1), key=lambda i: difflib.SequenceMatcher(None, p, ref[i:i + len(p)]).ratio())
        emos.append(ref_emo[rb])
        start = 0.0 if k == 0 else max(0.0, ht[bi] - 0.1)
        txt = [dict(viz.tx(hook, 'con', 'mediano'), y=300)] if k == 0 else []
        sc = dict(n=k + 1, start=round(start, 2), tipo=tipo, sec='SHORT', media=[dict(m) for m in media],
                  icons=[dict(i) for i in icons], txt=txt, fx=list(fx), vertical=True, hit=False)
        if per:
            sc['person'] = per
        scenes.append(sc)
    dur = round(meta['duration'] + 0.6, 2)
    for a, b in zip(scenes, scenes[1:]): a['end'] = b['start']
    scenes[-1]['end'] = dur
    for s in scenes:  # que ningún clip se acabe antes que su escena
        for m in s['media']:
            if m['t'] == 'v':
                m['off'] = round(max(0.0, min(m['off'], viz.clip_len(m['src']) - (s['end'] - s['start']) - 0.3)), 2)
    estilo.assign(scenes, emos, vertical=True)
    for s in scenes:
        s['tr']['dur'] = round(min(s['tr']['dur'], max(0.3, (s['end'] - s['start']) * 0.45)), 2)
    estilo.ajustar(scenes)  # cambios que pidió el creador al revisar el video 5
    estilo.check(scenes)
    # Subtítulos: las palabras exactas del guion del short con los tiempos de la transcripción
    script = re.sub(r'\[[^\]]*\]', ' ', raw).split()
    sref, sof = [], []
    for i, w in enumerate(script):
        for u in toks(w): sref.append(u); sof.append(i)
    m2 = difflib.SequenceMatcher(None, sref, hyp, autojunk=False)
    ts = [None] * len(script); te = [None] * len(script)
    for a, b, size in m2.get_matching_blocks():
        for j in range(size):
            i = sof[a + j]
            if ts[i] is None: ts[i] = he[b + j][0]
            te[i] = he[b + j][1]
    kn = [i for i in range(len(script)) if ts[i] is not None]
    for i in range(len(script)):  # huecos: se reparten parejo entre las palabras conocidas
        if ts[i] is None:
            p_ = max([q for q in kn if q < i], default=None); q_ = min([q for q in kn if q > i], default=None)
            a0 = te[p_] if p_ is not None else 0.0
            a1 = ts[q_] if q_ is not None else a0 + 0.4 * (i + 1)
            gap = (q_ if q_ is not None else len(script)) - (p_ if p_ is not None else -1)
            j = i - (p_ if p_ is not None else -1)
            ts[i] = a0 + (a1 - a0) * (j - 1) / (gap - 1); te[i] = a0 + (a1 - a0) * j / (gap - 1)
    words = [[w, round(ts[i], 2), round(max(te[i], ts[i] + 0.05), 2)] for i, w in enumerate(script)]
    print(f'Short{n}', title, dur, 's · subtítulos', round(len(kn) / len(script), 2),
          '·', [(round(s['end'] - s['start'], 1), s['layout'], s['bg']['type'], s['tr']['type']) for s in scenes])
    return dict(id=f'Short{n}', title=title, duration=dur, scenes=scenes, words=words)

if __name__ == '__main__':
    out = [build(n) for n in SH]
    json.dump(out, open(os.path.join(ROOT, 'src', 'dedicas', 'shorts.json'), 'w'), ensure_ascii=False, indent=0)
