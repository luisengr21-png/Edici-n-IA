import re, sys, unicodedata

GUION = sys.argv[1]
OUT = sys.argv[2]

def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    s = re.sub(r'[^\wáéíóúüñ\s]', ' ', s)
    return s.split()

# ---- tokens de narración con tiempos ----
t = open(GUION).read().split('## Conteo')[0]
parts = re.split(r'\n## (SECCIÓN[^\n]*)\n', t)
tokens = []  # (word, start_time)
clock = 0.0
WPS = 150 / 60
for i in range(1, len(parts), 2):
    for line in parts[i + 1].split('\n'):
        if not line.strip() or line.startswith('>') or line.strip() == '---':
            continue
        line = re.sub(r'\[ÉNFASIS: ([^\]]*)\]', r'\1', line)
        for piece in re.split(r'(\[[^\]]*\])', line):
            if piece.startswith('['):
                if piece == '[PAUSA]': clock += 0.8
                elif piece == '[PAUSA LARGA]': clock += 2.0
                continue
            for w in norm(piece.replace('*', '')):
                tokens.append((w, clock)); clock += 1 / WPS
END = clock
words = [w for w, _ in tokens]

# ---- filas ----
ROWS = []
def R(phrase, tipo, desc, txt='—', sfx='—', mus='↳', mark=''):
    ROWS.append(dict(phrase=phrase, tipo=tipo, desc=desc, txt=txt, sfx=sfx, mus=mus, mark=mark))

S = lambda title: ROWS.append(dict(section=title))

exec(open(sys.argv[3]).read())

# ---- ubicar frases ----
pos = 0
located = []
for r in ROWS:
    if 'section' in r:
        located.append(r); continue
    p = norm(r['phrase'])
    found = None
    for k in range(pos, len(words) - len(p) + 1):
        if words[k:k + len(p)] == p:
            found = k; break
    if found is None:
        sys.exit(f"NO ENCONTRADA: {r['phrase']}")
    r['idx'] = found; pos = found + 1
    located.append(r)

scenes = [r for r in located if 'idx' in r]
for a, b in zip(scenes, scenes[1:] + [None]):
    a['start'] = tokens[a['idx']][1]
    a['end'] = tokens[b['idx']][1] if b else END
    a['end_idx'] = b['idx'] if b else len(words)

def fmt(s):
    return f"{int(s // 60)}:{int(s % 60):02d}"

# fragmento con el texto original (no normalizado): reconstruimos desde el guion limpio
clean = []
for i in range(1, len(parts), 2):
    for line in parts[i + 1].split('\n'):
        if not line.strip() or line.startswith('>') or line.strip() == '---':
            continue
        l = re.sub(r'\[ÉNFASIS: ([^\]]*)\]', r'\1', line)
        l = re.sub(r'\[[^\]]*\]', ' ', l).replace('*', '')
        clean.extend(l.split())
# clean y words deben tener la misma longitud salvo tokens que son solo puntuación
w2c = []
for ci, c in enumerate(clean):
    w2c.extend([ci] * len(norm(c)))
assert len(w2c) == len(words), (len(w2c), len(words))

def frag(a, b):
    ca = w2c[a]; cb = w2c[b] if b < len(w2c) else len(clean)
    seg = clean[ca:cb]
    s = ' '.join(seg)
    if len(seg) > 16:
        s = ' '.join(seg[:13]) + ' …'
    return s.replace('|', '/')

out = []
n = 0
long_rows = []
for r in located:
    if 'section' in r:
        out.append(f"\n### {r['section']}\n")
        out.append('| # | Tiempo aprox. | Narración (fragmento) | Tipo de visual | Descripción del visual | Texto en pantalla | Efectos de sonido | Música |')
        out.append('|---|---|---|---|---|---|---|---|')
        continue
    n += 1
    dur = r['end'] - r['start']
    if dur > 8.5: long_rows.append((n, round(dur, 1)))
    num = f"{n} {r['mark']}".strip()
    out.append(f"| {num} | {fmt(r['start'])}–{fmt(r['end'])} | «{frag(r['idx'], r['end_idx'])}» | `{r['tipo']}` | {r['desc']} | {r['txt']} | {r['sfx']} | {r['mus']} |")

body = open(sys.argv[4]).read()
body = body.replace('{{TABLA}}', '\n'.join(out)).replace('{{ESCENAS}}', str(n)).replace('{{DURACION}}', fmt(END))
open(OUT, 'w').write(body)
print('escenas', n, 'duración', fmt(END), 'promedio', round(END / n, 1), 's')
print('filas > 8.5 s:', long_rows)
