"""Arma el plan (JSON) del motor collage (src/collage/Collage.tsx) a partir de las escenas de collage_rows.py
y de una descripción por escena de sus elementos.

Tiempos de los elementos ('at', 'out', 'markAt', 'checks'):
  número       → segundos desde que empieza la escena
  '@palabra'   → cuando la voz dice esa palabra (la primera vez dentro de la escena); '@palabra#2' la segunda vez
  '@palabra+0.3' / '@palabra-0.5' → con un ajuste en segundos
Revisa las reglas del canal: fondos distintos en escenas seguidas, transiciones que no se repiten, textos sin repetir.
"""
import json, re, sys, unicodedata

LIGHT = {'papel crema', 'papel arrugado', 'cuadriculado', 'rayado'}
TR_DUR = {'slide': 0.55, 'whip': 0.35, 'up': 0.5, 'page': 0.6, 'zoom': 0.45, 'flash': 0.35, 'dissolve': 0.75}
TR_CYCLE = ['slide', 'whip', 'up', 'page', 'zoom', 'flash']
SLOW_BG = {'espacio'}


def nz(s):
    return re.findall(r'[\wáéíóúüñ]+', unicodedata.normalize('NFC', s.lower()))


def armar(scenes, spec, audio_end, end_screen=12.0, src_bg=None):
    """scenes: salida de fase1_collage.generar; spec: {n: dict(els=[...], bg_src=..., tr=..., cam=...)}"""
    out, prev_tr, k = [], None, 0
    errs = []
    for s in scenes:
        n = s['n']; sp = spec.get(n)
        if sp is None:
            errs.append(f'escena {n}: falta su descripción'); continue
        start = s['start']; end = s['end'] if n < len(scenes) else audio_end + end_screen
        wt = s['wt']

        def when(v, field=''):
            if v is None: return None
            if isinstance(v, (int, float)): return round(start + v, 2)
            m = re.match(r'@([^#+\-]+)(?:#(\d+))?([+\-][\d.]+)?$', v)
            if not m: errs.append(f'escena {n}: tiempo raro {v}'); return start
            w, occ, adj = nz(m.group(1))[0], int(m.group(2) or 1), float(m.group(3) or 0)
            hits = [t for tok, t in wt if tok.startswith(w)]
            if len(hits) < occ:
                errs.append(f'escena {n}: la palabra «{m.group(1)}» no está en la escena ({field})'); return start
            return round(max(start, hits[occ - 1] + adj), 2)

        els = []
        for e in sp['els']:
            e = dict(e)
            e['at'] = when(e.get('at', 0), e.get('k'))
            if 'out' in e: e['out'] = when(e['out'], 'out')
            if e.get('k') == 'list':
                e['rows'] = [dict(r, at=when(r.get('at', 0)), **({'markAt': when(r['markAt'])} if 'markAt' in r else {})) for r in e['rows']]
            if e.get('k') == 'doodle' and 'checks' in e:
                e['checks'] = [when(c) if c is not None else None for c in e['checks']]
            els.append(e)
        # transición de entrada: lenta hacia el espacio; nunca la misma que la anterior
        if n == 1:
            tr = 'dissolve'
        elif sp.get('tr'):
            tr = sp['tr']
        elif s['fondo'] in SLOW_BG and prev_tr != 'dissolve':
            tr = 'dissolve'
        else:
            opts = TR_CYCLE[k % len(TR_CYCLE):] + TR_CYCLE[:k % len(TR_CYCLE)]
            tr = next(o for o in opts if o != prev_tr); k += 1
        if tr == prev_tr: errs.append(f'escena {n}: misma transición que la anterior ({tr})')
        prev_tr = tr
        bg = {'type': s['fondo']}
        if s['fondo'] in ('pintura', 'desenfocado'):
            if not sp.get('bg_src'): errs.append(f'escena {n}: el fondo «{s["fondo"]}» necesita imagen')
            bg['src'] = sp.get('bg_src'); bg['video'] = str(sp.get('bg_src', '')).endswith('.mp4'); bg['off'] = sp.get('bg_off', 0.4)
        # textos sin repetir dentro de la escena (regla del canal)
        texts = [e['text'] for e in els if 'text' in e] + [r['text'] for e in els if e.get('k') == 'list' for r in e['rows']]
        def clave(x): return ' '.join(re.sub(r'[*"«»“”¿?¡!.,:;…·]', ' ', x.lower()).split())
        ks = [clave(x) for x in texts]
        if len(ks) != len(set(ks)): errs.append(f'escena {n}: texto repetido {texts}')
        out.append(dict(n=n, start=round(start, 2), end=round(end, 2), bg=bg, tr=dict(type=tr, dur=TR_DUR[tr]),
                        els=els, light=s['fondo'] in LIGHT, cam=sp.get('cam', 0.03)))
    for a, b in zip(out, out[1:]):
        if a['bg']['type'] == b['bg']['type']: errs.append(f"escenas {a['n']}→{b['n']}: mismo fondo")
    if errs:
        sys.exit('Plan con problemas:\n  ' + '\n  '.join(errs))
    return dict(duration=round(audio_end + end_screen, 2), audioEnd=round(audio_end, 2), scenes=out)


# ── atajos para describir elementos ──
def card(src, at=0.1, x=960, y=500, w=1100, h=620, rot=-2, frm='right', out=None, off=0.4):
    e = dict(k='card', src=src, video=src.endswith('.mp4'), off=off, at=at, x=x, y=y, w=w, h=h, rot=rot, **{'from': frm})
    if out is not None: e['out'] = out
    return e

def cut(src, at=0.1, x=960, y=520, h=420, rot=0, out=None, flip=False):
    e = dict(k='cut', src=src, at=at, x=x, y=y, h=h, rot=rot, flip=flip)
    if out is not None: e['out'] = out
    return e

def tu(at=0.1, x=700, y=600, s=1.3, pose='stand', mood=None, out=None, **kw):
    e = dict(k='tu', at=at, x=x, y=y, s=s, pose=pose, mood=mood, **kw)
    if out is not None: e['out'] = out
    return e

def txt(kind, text, at, x=960, y=930, size=None, out=None, **kw):
    e = dict(k=kind, text=text, at=at, x=x, y=y, **kw)
    if size: e['size'] = size
    if out is not None: e['out'] = out
    return e

def hand(text, at, x=960, y=930, size=76, out=None, **kw): return txt('hand', text, at, x, y, size, out, **kw)
def marker(text, at, x=960, y=930, size=80, out=None, **kw): return txt('marker', text, at, x, y, size, out, **kw)
def title(text, at, acc='', x=960, y=930, size=120, out=None, **kw): return txt('title', text, at, x, y, size, out, acc=acc, **kw)
def stamp(text, at, x=960, y=860, color='#e63b2e', rot=-8, size=90, out=None): return txt('stamp', text, at, x, y, size, out, color=color, rot=rot)

def emo(e, at, x, y, size=160, rot=0, out=None):
    d = dict(k='emo', e=e, at=at, x=x, y=y, size=size, rot=rot)
    if out is not None: d['out'] = out
    return d

def doodle(name, at, x, y, size=220, out=None, **kw):
    d = dict(k='doodle', name=name, at=at, x=x, y=y, size=size, **kw)
    if out is not None: d['out'] = out
    return d

def arrow(at, x1, y1, x2, y2, color='#e63b2e', bend=0.25, out=None):
    d = dict(k='arrow', at=at, x1=x1, y1=y1, x2=x2, y2=y2, color=color, bend=bend)
    if out is not None: d['out'] = out
    return d

def strike(at, x1, y1, x2, y2, color='#e63b2e', w=10): return dict(k='strike', at=at, x1=x1, y1=y1, x2=x2, y2=y2, color=color, w=w)
def underline(at, x1, y1, x2, y2, color='#e63b2e', w=8): return dict(k='underline', at=at, x1=x1, y1=y1, x2=x2, y2=y2, color=color, w=w)
def circle(at, x, y, rx, ry, color='#e63b2e'): return dict(k='circle', at=at, x=x, y=y, rx=rx, ry=ry, color=color, w=9)
def xmark(at, x, y, size=110): return dict(k='x', at=at, x=x, y=y, size=size)
def bubble(text, at, x, y, size=80, out=None):
    d = dict(k='bubble', text=text, at=at, x=x, y=y, size=size)
    if out is not None: d['out'] = out
    return d
def chart(at, pts, color='#ffffff', dur=1.4): return dict(k='chart', at=at, pts=pts, color=color, dur=dur)
def lista(at, rows, x=640, y=540, w=820, title=None, rot=-2): return dict(k='list', at=at, rows=rows, x=x, y=y, w=w, title=title, rot=rot)
