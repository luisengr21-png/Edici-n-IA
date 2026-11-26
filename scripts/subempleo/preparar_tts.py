"""Convierte el guion (con marcas de ritmo y emoción) en los bloques de texto para ElevenLabs eleven_v4.
Uso: python3 scripts/subempleo/preparar_tts.py"""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
ENT = os.path.join(ROOT, 'entregas', '06-el-subempleo')
TAGS = {'[PAUSA LARGA]': '[long pause]', '[PAUSA]': '[pause]', '[MÁS RÁPIDO]': '[quickly]', '[MÁS LENTO]': '[slowly]',
        '[ALEGRE]': '[warmly]', '[TENSO]': '[dramatically]', '[TRISTE]': '[sad]', '[ENOJADO]': '[angry]',
        '[SORPRENDIDO]': '[surprised]', '[TONO IRÓNICO]': '[sarcastic]', '[SUSURRO]': '[whispers]'}
def conv(s):
    s = re.sub(r'\s*\[VERIFICAR\]', '', s)
    s = re.sub(r'\[ÉNFASIS: ([^\]]*)\]', lambda m: m[1].upper(), s)
    for a, b in TAGS.items(): s = s.replace(a, b)
    left = re.sub(r'\[(pause|long pause|quickly|slowly|warmly|dramatically|sad|angry|surprised|sarcastic|whispers|calmly)\]', '', s)
    assert '[' not in left, left
    return s
t = open(os.path.join(ENT, '01_guion_largo.md')).read().split('## Conteo')[0]
parts = re.split(r'\n## (SECCIÓN[^\n]*)\n', t)
secs = []
for i in range(1, len(parts), 2):
    paras = [l.strip() for l in parts[i + 1].split('\n') if l.strip() and l.strip() != '---' and not l.startswith('>')]
    secs.append(paras)
# bloques cortos donde cambia mucho la emoción: la sección 2 (la más larga) se parte en dos
CORTES = {2: 'El hombre de los volantes está justo ahí'}
NOMBRES = ['gancho', 'titular', 'palabra', 'fondo', 'truco', 'indice']
bloques = []
for k, paras in enumerate(secs):
    if k in CORTES:
        j = next(i for i, p in enumerate(paras) if CORTES[k] in p)
        bloques += [(f'{NOMBRES[k]}_a', paras[:j]), (f'{NOMBRES[k]}_b', paras[j:])]
    else:
        bloques.append((NOMBRES[k], paras))
os.makedirs(os.path.join(HERE, 'tts'), exist_ok=True)
tot = 0
for n, (name, paras) in enumerate(bloques):
    # Una emoción fuerte no se arrastra al párrafo siguiente: si el párrafo no trae su propia marca, vuelve a tono neutral.
    out, last = [], None
    for p_ in paras:
        c = conv(p_)
        if last in ('sarcastic', 'angry', 'surprised', 'whispers', 'quickly') and not c.startswith('['):
            c = '[calmly] ' + c
        tags = re.findall(r'\[(quickly|slowly|warmly|dramatically|sad|angry|surprised|sarcastic|whispers|calmly)\]', c)
        if tags: last = tags[-1]
        out.append(c)
    body = '\n\n'.join(out)
    open(os.path.join(HERE, 'tts', f'largo_{n:02d}_{name}.txt'), 'w').write(body + '\n'); tot += len(body)
    print(f'largo_{n:02d}_{name}', len(body))
s = open(os.path.join(ENT, '03_shorts.md')).read()
for n, blk in enumerate(re.findall(r'### Guion\n((?:>.*\n)+)', s), 1):
    b = conv(' '.join(l[1:].strip() for l in blk.strip().split('\n')))
    open(os.path.join(HERE, 'tts', f'short_0{n}.txt'), 'w').write(b + '\n'); tot += len(b); print('short', n, len(b))
print('total', tot)
