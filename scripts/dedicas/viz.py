"""Plan visual de «¿A qué te dedicas?» (video 5, Fase 2).

Lee las escenas de rows.py, las alinea con la narración real y escribe src/dedicas/plan.json.
Cada escena recibe fondo, transición y efectos según las reglas de edición del canal (scripts/dedicas/estilo.py),
que se revisan antes de escribir el plan. Íconos y textos en pantalla los hago yo con código (regla del canal).
Uso: python3 scripts/dedicas/viz.py
"""
import json, os, re, sys, difflib, subprocess

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
AUD = os.path.join(ROOT, 'audio', '05-a-que-te-dedicas')
sys.path.insert(0, HERE)
import estilo

src = open(os.path.join(HERE, 'gen_fase1.py')).read().split('# ── regla del canal')[0]
__file__ = os.path.join(HERE, 'gen_fase1.py')
exec(src)

# ── emoción y velocidad activas en cada palabra del guion (marcas entre corchetes) ──
TAG = {'[TENSO]': ('emo', 'dramatically'), '[TRISTE]': ('emo', 'sad'), '[ALEGRE]': ('emo', 'warmly'), '[ENOJADO]': ('emo', 'angry'),
       '[SORPRENDIDO]': ('emo', 'surprised'), '[TONO IRÓNICO]': ('emo', 'sarcastic'), '[SUSURRO]': ('emo', 'whispers'),
       '[MÁS RÁPIDO]': ('speed', 'quickly'), '[MÁS LENTO]': ('speed', 'slowly')}
gt = open(GUION).read().split('## Conteo')[0]
gparts = re.split(r'\n## (SECCIÓN[^\n]*)\n', gt)
word_emo = []
for i in range(1, len(gparts), 2):
    for line in gparts[i + 1].split('\n'):
        if not line.strip() or line.startswith('>') or line.strip() == '---':
            continue
        line = re.sub(r'\[ÉNFASIS: ([^\]]*)\]', r'\1', line)
        st = {'emo': None, 'speed': None}
        for piece in re.split(r'(\[[^\]]*\])', line):
            if piece.startswith('['):
                if piece in TAG: st[TAG[piece][0]] = TAG[piece][1]
                continue
            for _ in norm(piece):
                word_emo.append((st['emo'], st['speed']))
assert len(word_emo) == len(words), (len(word_emo), len(words))

# ── tiempos reales ──
aw = json.load(open(os.path.join(AUD, 'transcripcion_palabras_largo.json')))
meta = json.load(open(os.path.join(AUD, 'largo_meta.json')))
hyp, ht = [], []
for w, s, e in aw:
    for t in norm(w):
        hyp.append(t); ht.append(s)
sm = difflib.SequenceMatcher(None, words, hyp, autojunk=False)
tw = [None] * len(words)
for a, b, size in sm.get_matching_blocks():
    for k in range(size):
        tw[a + k] = ht[b + k]
known = [i for i, v in enumerate(tw) if v is not None]
cov = len(known) / len(words)
for i in range(len(tw)):
    if tw[i] is None:
        p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
        tw[i] = tw[q] if p is None else tw[p] + 0.35 * (i - p) if q is None else tw[p] + (tw[q] - tw[p]) * (i - p) / (q - p)
AUDIO_END = meta['duration']
END_SCREEN = 12.0

# ── íconos: emoji de color (Noto Color Emoji, licencia Apache 2.0) o dibujo propio ──
EMO = dict(cronometro='⏱️', interrogacion='❓', tormenta='⛈️', etiqueta='🔖', maletin='💼', birrete='🎓', gafete='🪪', etiqueta_precio='🏷️',
           caja_despido='📦', ojos='👀', corazon='❤️', bolsa_compras='🛍️', dinero='💵', auto_lujo='🏎️', ojo='👁️', oreja='👂', aplauso='👏',
           libro_exito='📒', libro_triste='📓', moneda='🪙', podio='🥇', escalera='🪜', balanza='⚖️', rueda_fortuna='🎡', trebol='🍀',
           mazo='🔨', grafica_sube='📈', dado='🎲', lapiz='✏️', trofeo='🏆', tarjeta='📇', x_roja='❌', comentario='💬', like='👍',
           compartir='↗️', campana='🔔')
SVG = {'perdedor'}
def icon(name):
    k = name[len('icono_'):-4]
    if k in SVG: return dict(svg=k)
    assert k in EMO, f'ícono sin dibujo: {k}'
    return dict(e=EMO[k])

# ── textos: palabra de acento (ámbar; con «!» delante, rojo) ──
ACC = {
 '¿Y TÚ A QUÉ TE DEDICAS?': 'A QUÉ TE DEDICAS', '3 SEGUNDOS': '!3', 'CIRUJANO': 'CIRUJANO', 'BUSCANDO TRABAJO': '!BUSCANDO', '3 IDEAS': '3 IDEAS',
 'ENGREÍDOS': '!ENGREÍDOS', '¿CUÁNTO VALES?': '!VALES', 'UN SOLO CUADRO': 'CUADRO', 'TU MAMÁ': 'MAMÁ', 'TÚ, NO TU ESTATUS': 'TÚ', 'JUZGADOS': '!JUZGADOS',
 'LA MISMA HORA': 'MISMA', 'UNA FORMA DE AMOR': 'AMOR', '¿CODICIOSO?': '!CODICIOSO', 'NECESITA QUE LO QUIERAN': 'QUE LO QUIERAN',
 '¡LO QUE QUIERAS!': 'QUIERAS', '¿DE QUIÉN ES LA CULPA?': '!CULPA', 'TRIUNFA EN 15 MINUTOS': '15 MINUTOS', 'MILLONARIO DE LA NOCHE A LA MAÑANA': 'MILLONARIO',
 'CÓMO LIDIAR CON LA BAJA AUTOESTIMA': '!BAJA AUTOESTIMA', 'DOS CARAS': 'DOS', 'INSATISFECHA': '!INSATISFECHA', 'MERITOCRACIA': 'MÉRITO',
 'JUEGO ARREGLADO': '!ARREGLADO', 'LA TRAMPA': '!TRAMPA', '¿MERECIDA?': '!MERECIDA', 'DESAFORTUNADOS': 'DESAFORTUNADOS', 'PERDEDORES': '!PERDEDORES',
 'EL VEREDICTO': '!VEREDICTO', 'ÉMILE DURKHEIM, 1897': '1897', '3 SALIDAS': 'SALIDAS', '1. LA SUERTE CUENTA': 'SUERTE', '2. TU PROPIO ÉXITO': 'ÉXITO',
 '3. NO ERES TU PUESTO': 'NO ERES', 'TU PELÍCULA ES MÁS LARGA': 'MÁS LARGA', '¿CÓMO TE PRESENTARÍAS?': 'PRESENTARÍAS', 'TE LEO EN LOS COMENTARIOS': 'COMENTARIOS',
 'SUSCRÍBETE': 'SUSCRÍBETE',
 'LOS 3 SEGUNDOS': '!3 SEGUNDOS', 'NO ES AVARICIA': 'AVARICIA', '¿TE LO MERECES?': '!MERECES',
}
def tx(text, fondo, tam):
    a = ACC.get(text)
    if a is None:  # palabra de acento por defecto: la última
        a = text.split()[-1]
    red = a.startswith('!'); a = a.lstrip('!')
    if a not in text: a = text.split()[-1]
    return dict(text=text, card=fondo == 'con', size=tam, acc=a, red=red)

def person(desc):
    d = desc.lower()
    p = dict(pose='stand', mood=None)
    rules = [
        (('nervioso', 'sudando'), dict(pose='scratch', mood='worried', sweat=True)), (('pensativo', 'barbilla'), dict(pose='scratch', mood='blank')),
        (('avergonzado', 'nuca'), dict(pose='scratch', mood='worried')), (('esperanzado', 'levanta la mano'), dict(pose='handup', mood='happy')),
        (('estómago',), dict(pose='hips', mood='worried')), (('etiqueta',), dict(pose='reach', mood='worried')),
        (('curioso', 'acercándose'), dict(pose='stand', mood='worried')), (('encogido', 'preocupado'), dict(pose='shrug', mood='worried')),
        (('«espera»', 'espera'), dict(pose='handup')), (('serio',), dict(pose='stand', mood='blank')),
        (('frunce', 'desconfiado'), dict(pose='hips', mood='angry')), (('sorprendido', 'ojos muy abiertos'), dict(pose='shrug', mood='worried')),
        (('tenso', 'reojo'), dict(pose='stand', mood='worried')), (('asustado',), dict(pose='shrug', mood='worried')),
        (('incómodo', 'jalándose'), dict(pose='scratch', mood='worried', sweat=True)), (('esperanza', 'mira hacia arriba'), dict(pose='handup', mood='happy')),
        (('mano en el pecho',), dict(pose='hips', mood='happy')), (('niega',), dict(pose='stand', mood='happy')),
        (('tarjeta',), dict(pose='reach', mood='blank', hold='📇')), (('respira',), dict(pose='hips', mood='happy')),
        (('señala',), dict(pose='reach', mood='happy')), (('escribe',), dict(pose='phone', mood='happy')),
        (('campana',), dict(pose='reach', mood='happy', hold='🔔')), (('saluda',), dict(pose='wave', mood='happy')),
        (('sonr',), dict(pose='stand', mood='happy')),
    ]
    for keys, v in rules:
        if any(k in d for k in keys):
            p.update(v); break
    return {k: v for k, v in p.items() if v is not None}

LEN = {}
def clip_len(src):
    if src not in LEN:
        LEN[src] = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(ROOT, 'public', src)]))
    return LEN[src]

def build():
    from PIL import Image
    uses, out, emos, sec = {}, [], [], None
    for r in ROWS:
        if 'section' in r:
            sec = r['section']; continue
        if 'idx' not in r:
            continue
        n = r['n']
        st = 0.0 if n == 1 else max(0.0, tw[r['idx']] - 0.12)
        media, icons = [], []
        for f in r['files']:
            if f.startswith('escena_'):
                k = uses.get(f, 0); uses[f] = k + 1
                media.append(dict(t='v', src=f'dedicas/videos/{f[:-4]}.mp4', off=[0.4, 6.0, 11.0, 3.0][k % 4]))
            elif f.startswith('foto_'):
                fp = os.path.join(ROOT, 'public', 'dedicas', 'fotos', f[:-4] + '.jpg')
                w_, h_ = Image.open(fp).size
                media.append(dict(t='f', src=f'dedicas/fotos/{f[:-4]}.jpg', ar=round(w_ / h_, 3)))
            else:
                icons.append(icon(f))
        d = r['desc'].lower()
        fx = []
        if 'x roja' in d: fx.append('cross')
        if 'oscurece' in d: fx.append('dark')
        sc = dict(n=n, start=round(st, 2), tipo=r['tipo'], sec=sec.split('·')[0].strip(), media=media, icons=icons,
                  txt=[tx(*t) for t in r['txt']], fx=fx, hit=('⚡' in r['mark']))
        if r['tipo'] == '2D':
            sc['person'] = person(r['desc'])
            h = sc['person'].get('hold')
            if h: sc['icons'] = [i for i in icons if i.get('e') != h]
        out.append(sc)
        emos.append(word_emo[r['idx']])
    for a, b in zip(out, out[1:]):
        a['end'] = b['start']
    out[-1]['end'] = round(AUDIO_END + END_SCREEN, 2)
    out[-1]['endscreen'] = True
    for s in out:  # que ningún clip se acabe antes que su escena
        dd = (s['end'] - s['start']) / (2 if len([m for m in s['media'] if m['t'] == 'v']) >= 2 else 1)
        for m in s['media']:
            if m['t'] == 'v':
                m['off'] = round(max(0.0, min(m['off'], clip_len(m['src']) - dd - 0.3)), 2)
    estilo.assign(out, emos)
    for s in out:  # la transición no puede durar más de la mitad de las escenas que une
        s['tr']['dur'] = round(min(s['tr']['dur'], max(0.3, (s['end'] - s['start']) * 0.45)), 2)
    estilo.check(out)
    return out

if __name__ == '__main__':
    out = build()
    CAP = {'SECCIÓN 0': 'Los tres segundos', 'SECCIÓN 1': 'Un mundo de engreídos', 'SECCIÓN 2': 'Lo que de verdad compra un Ferrari',
           'SECCIÓN 3': 'El peso de «puedes ser lo que quieras»', 'SECCIÓN 4': 'La trampa de la meritocracia', 'SECCIÓN 5': 'Tres salidas',
           'SECCIÓN 6': 'La pregunta, otra vez'}
    chapters, seen = [], set()
    for s in out:
        if s['sec'] not in seen:
            seen.add(s['sec']); chapters.append((s['start'] if s['n'] > 1 else 0.0, CAP[s['sec']]))
    os.makedirs(os.path.join(ROOT, 'src', 'dedicas'), exist_ok=True)
    json.dump(dict(audioEnd=AUDIO_END, duration=round(AUDIO_END + END_SCREEN, 2), scenes=out),
              open(os.path.join(ROOT, 'src', 'dedicas', 'plan.json'), 'w'), ensure_ascii=False, indent=0)
    json.dump(chapters, open(os.path.join(AUD, 'capitulos.json'), 'w'), ensure_ascii=False)
    from collections import Counter
    print('cobertura', round(cov, 3), '· escenas', len(out), '· duración', fmt(AUDIO_END + END_SCREEN))
    print('fondos:', Counter(s['bg']['type'] for s in out).most_common())
    print('transiciones:', Counter(s['tr']['type'] for s in out).most_common())
    print('layout:', Counter(s['layout'] for s in out))
    for t0, c in chapters: print(f'{fmt(t0)} {c}')
