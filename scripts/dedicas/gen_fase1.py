"""Fase 1 de «¿A qué te dedicas?»: genera el guion técnico (02) y la lista de recursos que pone el creador (06).

Reglas del canal (desde el 4.º video): todos los recursos visuales los pone el creador, incluidos los textos
en pantalla como imagen; yo solo dibujo el personaje «Tú» y los subtítulos de los shorts. Audio: solo voz.

Uso: python3 scripts/dedicas/gen_fase1.py
"""
import os, re, sys, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
ENT = os.path.join(ROOT, 'entregas', '05-a-que-te-dedicas')
GUION = os.path.join(ENT, '01_guion_largo.md')

def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    s = re.sub(r'[^\wáéíóúüñ\s]', ' ', s)
    return s.split()

# ── narración con tiempos estimados (150 palabras por minuto) ──
t = open(GUION).read().split('## Conteo')[0]
parts = re.split(r'\n## (SECCIÓN[^\n]*)\n', t)
tokens, clean = [], []
clock = 0.0
WPS = 150 / 60
for i in range(1, len(parts), 2):
    for line in parts[i + 1].split('\n'):
        if not line.strip() or line.startswith('>') or line.strip() == '---':
            continue
        line = re.sub(r'\[ÉNFASIS: ([^\]]*)\]', r'\1', line)
        for piece in re.split(r'(\[[^\]]*\])', line):
            if piece.startswith('['):
                clock += {'[PAUSA]': 0.8, '[PAUSA LARGA]': 2.0}.get(piece, 0)
                continue
            clean.extend(piece.split())
            for w in norm(piece):
                tokens.append((w, clock)); clock += 1 / WPS
END = clock
words = [w for w, _ in tokens]
w2c = []
for ci, c in enumerate(clean):
    w2c.extend([ci] * len(norm(c)))
assert len(w2c) == len(words)

# ── escenas ──
ROWS = []
def S(title): ROWS.append(dict(section=title))
def R(phrase, tipo, desc, rec=(), txt=(), mark=''):
    ROWS.append(dict(phrase=phrase, tipo=tipo, desc=desc, rec=list(rec), txt=list(txt), mark=mark))
exec(open(os.path.join(HERE, 'rows.py')).read())

pos = 0
for r in ROWS:
    if 'section' in r:
        continue
    p = norm(r['phrase'])
    for k in range(pos, len(words) - len(p) + 1):
        if words[k:k + len(p)] == p:
            r['idx'] = k; pos = k + 1; break
    else:
        sys.exit(f"NO ENCONTRADA: {r['phrase']}")
scenes = [r for r in ROWS if 'idx' in r]
for a, b in zip(scenes, scenes[1:] + [None]):
    a['start'] = tokens[a['idx']][1]
    a['end'] = tokens[b['idx']][1] if b else END
    a['end_idx'] = b['idx'] if b else len(words)

def fmt(s): return f"{int(s // 60)}:{int(s % 60):02d}"
def frag(a, b):
    ca = w2c[a]; cb = w2c[b] if b < len(w2c) else len(clean)
    seg = clean[ca:cb]
    s = ' '.join(seg if len(seg) <= 16 else seg[:13] + ['…'])
    return s.replace('|', '/')

# ── nombres de archivo y catálogo de recursos ──
CARPETA = {'video': 'videos', 'foto': 'fotos', 'icono': 'iconos', 'texto': 'textos'}
EXT = {'video': 'mp4', 'foto': 'jpg', 'icono': 'png', 'texto': 'png'}
TAM = {'grande': '1600×450 px', 'mediano': '1200×320 px', 'chico': '800×220 px'}
CAT = {}      # nombre → dict(tipo, desc, kw, escenas, ...)
ALIAS = {}    # '@apodo' → nombre de archivo (para reutilizar sin depender del número de escena)
ORDEN = []
def letra(k, n): return '' if n == 1 else '_' + 'abcdefgh'[k]

n = 0
for r in scenes:
    n += 1
    r['n'] = n
    r['files'] = []
    nuevos = [x for x in r['rec'] if not (isinstance(x, str) and x.startswith('='))]
    cnt = {}
    for x in r['rec']:
        if isinstance(x, str):
            name = ALIAS.get(x[1:], x[1:])
            assert name in CAT, f'escena {n}: el recurso {name} no existe todavía'
            CAT[name]['escenas'].append(n)
            r['files'].append(name)
            continue
        kind, desc, kw, alias = (list(x) + ['', ''])[:4]
        if kind.startswith('icono:'):
            name = f"icono_{kind.split(':')[1]}.png"; kind = 'icono'
        else:
            same = [y for y in nuevos if not isinstance(y, str) and y[0] == kind]
            k = cnt.get(kind, 0); cnt[kind] = k + 1
            base = 'escena' if kind == 'video' else kind
            name = f"{base}_{n:03d}{letra(k, len(same))}.{EXT[kind]}"
        assert name not in CAT, f'nombre repetido: {name}'
        CAT[name] = dict(tipo=kind, desc=desc, kw=kw, escenas=[n], t=r['start'])
        ORDEN.append(name)
        if alias:
            ALIAS['@' + alias] = name
        r['files'].append(name)
    r['tfiles'] = []
    for k, (texto, fondo, tam) in enumerate(r['txt']):
        name = f"texto_{n:03d}{letra(k, len(r['txt']))}.png"
        CAT[name] = dict(tipo='texto', desc=texto, fondo=fondo, tam=tam, escenas=[n], t=r['start'])
        ORDEN.append(name)
        r['tfiles'].append(name)

# ── regla del canal: ningún texto se repite en la misma escena ──
def clave(s): return ' '.join(re.sub(r'[*"«»“”¿?¡!.,:;…·]', ' ', s.lower()).split())
for r in scenes:
    ks = [clave(t) for t, _, _ in r['txt']]
    nums = [m for t, _, _ in r['txt'] for m in re.findall(r'\d+', t)]
    if len(ks) != len(set(ks)) or len(nums) != len(set(nums)):
        sys.exit(f"Texto repetido en la escena {r['n']}: {r['txt']}")

# ── 02_guion_tecnico.md ──
out = []
for r in ROWS:
    if 'section' in r:
        out.append(f"\n### {r['section']}\n")
        out.append('| # | Tiempo aprox. | Narración (fragmento) | Visual | Descripción | Recursos que me mandas | Texto en pantalla (imagen que me mandas) |')
        out.append('|---|---|---|---|---|---|---|')
        continue
    rec = '<br>'.join(f'`{f}`' for f in r['files']) or '—'
    tx = '<br>'.join(f'`{f}` «{t}»' for f, (t, _, _) in zip(r['tfiles'], r['txt'])) or '—'
    num = f"{r['n']} {r['mark']}".strip()
    out.append(f"| {num} | {fmt(r['start'])}–{fmt(r['end'])} | «{frag(r['idx'], r['end_idx'])}» | `{r['tipo']}` | {r['desc']} | {rec} | {tx} |")
tpl = open(os.path.join(HERE, 'tecnico_tpl.md')).read()
largas = [(r['n'], round(r['end'] - r['start'], 1)) for r in scenes if r['end'] - r['start'] > 8.5]
open(os.path.join(ENT, '02_guion_tecnico.md'), 'w').write(tpl.replace('{{TABLA}}', '\n'.join(out)).replace('{{ESCENAS}}', str(n)).replace('{{DURACION}}', fmt(END)))

# ── 06_recursos.md ──
por_tipo = {k: [x for x in ORDEN if CAT[x]['tipo'] == k] for k in ('video', 'foto', 'icono', 'texto')}
def esc(c): return ', '.join(str(e) for e in c['escenas'])
L = []
L.append('# ¿A qué te dedicas? — Recursos que necesito (los pones tú)\n')
L.append('**Tú pones los videos y las fotos** (secciones 1 y 2). Los **íconos y los textos en pantalla los hago yo** con código (secciones 3, 4 y 5): vienen listados solo para que sepas qué va en cada escena. También dibujo al personaje «Tú» y pongo los subtítulos de los shorts.\n')
L.append('**Cómo pasármelos:**')
L.append('1. Crea una carpeta en Google Drive con dos subcarpetas: `VIDEOS` y `FOTOS`.')
L.append('2. Guarda cada archivo con el **nombre exacto** de la lista (así el editor lo encuentra solo).')
L.append('3. Compárteme el enlace de la carpeta.\n')
L.append('**Reglas para todo:**')
L.append('- Personas: pueden verse rostros (tienes licencia). El personaje «Tú» lo hago yo.')
L.append('- Sin logos ni marcas reconocibles, sin marcas de agua.')
L.append('- Videos: horizontales, 1920×1080 o más, de 5 a 15 s. Fotos: horizontales, 1920 px o más.')
L.append('- Íconos e ilustraciones: PNG con **fondo transparente**, de unos 800 px.')
L.append('- Si algo no te convence o no lo encuentras, mándame algo parecido o avísame; esa escena se resuelve con lo que haya.\n')
L.append(f"**Total:** {len(por_tipo['video'])} videos · {len(por_tipo['foto'])} fotos · {len(por_tipo['icono'])} íconos · {len(por_tipo['texto']) + len(SHORT_TXT)} textos en pantalla ({len(SHORT_TXT)} son de los shorts). Varios se reutilizan en más de una escena y en los shorts.\n")
L.append('---\n')
L.append(f"## 1. Videos → `VIDEOS/` ({len(por_tipo['video'])})\n")
L.append('| ✓ | Archivo | Qué es | Escena(s) | Palabras clave (Envato, inglés) |')
L.append('|---|---|---|---|---|')
for x in por_tipo['video']:
    c = CAT[x]; L.append(f"| ☐ | `{x}` | {c['desc']} | {esc(c)} | `{c['kw']}` |")
L.append(f"\n## 2. Fotos → `FOTOS/` ({len(por_tipo['foto'])})\n")
L.append('| ✓ | Archivo | Qué es | Escena(s) | Palabras clave (Envato, inglés) |')
L.append('|---|---|---|---|---|')
for x in por_tipo['foto']:
    c = CAT[x]; L.append(f"| ☐ | `{x}` | {c['desc']} | {esc(c)} | `{c['kw']}` |")
L.append(f"\n## 3. Íconos e ilustraciones — los hago yo ({len(por_tipo['icono'])})\n")
L.append('PNG con fondo transparente. Que todos tengan **el mismo estilo** (por ejemplo, íconos planos a color de un mismo paquete de Envato), para que el video se vea unido.\n')
L.append('| ✓ | Archivo | Qué es | Escena(s) | Palabras clave (Envato, inglés) |')
L.append('|---|---|---|---|---|')
for x in por_tipo['icono']:
    c = CAT[x]; L.append(f"| ☐ | `{x}` | {c['desc']} | {esc(c)} | `{c['kw']}` |")
L.append(f"\n## 4. Textos en pantalla — los hago yo ({len(por_tipo['texto'])})\n")
L.append('Cada texto va como **imagen PNG**. Te sugiero un solo estilo para todo el video:')
L.append('- **tipografía condensada y gruesa** (Anton, la misma de los videos anteriores) en mayúsculas;')
L.append('- **blanco** con contorno oscuro; la palabra clave en **ámbar** `#FFB547` (lo humano, lo valioso) o en **rojo vivo** `#FF2E2E` cuando es juicio o algo negativo;')
L.append('- **sin fondo** = PNG transparente (va encima de un video o una foto); **con fondo** = tarjeta de color azul noche `#121633` con bordes redondeados.\n')
L.append('| ✓ | Archivo | Texto exacto | Fondo | Tamaño sugerido | Escena |')
L.append('|---|---|---|---|---|---|')
for x in por_tipo['texto']:
    c = CAT[x]; L.append(f"| ☐ | `{x}` | {c['desc']} | {'sin fondo' if c['fondo'] == 'sin' else 'con fondo'} | {TAM[c['tam']]} | {esc(c)} |")
L.append(f"\n## 5. Textos de los shorts — los hago yo ({len(SHORT_TXT)})\n")
L.append('Van en el tercio de arriba del short vertical. Mismo estilo que los demás, tamaño 900×260 px.\n')
L.append('| ✓ | Archivo | Texto exacto | Fondo | Dónde va |')
L.append('|---|---|---|---|---|')
for f, tx, fo, donde in SHORT_TXT:
    L.append(f"| ☐ | `{f}` | {tx} | {fo} | {donde} |")
L.append('\n---\n')
L.append('## Lo que hago yo (no tienes que mandarlo)')
L.append('- El personaje «Tú» (sudadera mostaza, con rostro), en las escenas marcadas como `2D`.')
L.append('- La animación: entradas, zoom lento (Ken Burns) en fotos, cortes y el orden de los elementos.')
L.append('- La voz (ElevenLabs, la de siempre) y los subtítulos de los shorts.')
open(os.path.join(ENT, '06_recursos.md'), 'w').write('\n'.join(L) + '\n')

print('escenas', n, 'duración', fmt(END), 'promedio', round(END / n, 1), 's')
print('recursos:', {k: len(v) for k, v in por_tipo.items()})
print('escenas > 8.5 s:', largas)
