"""Guion técnico (02) y lista de recursos (06) en el estilo «collage» (ver CLAUDE.md).

Cada video define sus escenas en scripts/<video>/collage_rows.py y llama a generar(...).
Tiempos: los reales de la narración (transcripción de la voz alineada con el guion).

Escenas:
  S('SECCIÓN …')
  R(frase con la que empieza, fondo, qué se ve, rec=[recursos que pone el creador], yo=[lo que hago yo], txt=[(texto, tipo)], mark='⚡'|'🪝')
Recursos que pone el creador:
  ('recorte', qué es, palabras clave[, apodo])  → recorte_NNN.png  (PNG sin fondo)
  ('ilustracion', …)                             → ilustracion_NNN.png
  ('pintura', …)                                 → pintura_NNN.jpg  (dominio público)
  ('foto', …)                                    → foto_NNN.jpg     (va en tarjeta)
  ('video', …)                                   → escena_NNN.mp4   (va en tarjeta, pocos)
  ('ya', 'archivo_que_ya_mandó', qué es)         → se reutiliza, no hay que conseguirlo
  '=@apodo' o '=archivo'                         → reutiliza uno pedido antes en este mismo video
Tipos de texto: 'mano' (escrito a mano), 'marcador', 'titular' (Anton), 'sello'.
"""
import json, os, re, sys, difflib, unicodedata

FONDOS = {
    'papel oscuro': 'Papel oscuro (carbón) con textura',
    'papel crema': 'Papel crema con textura',
    'papel arrugado': 'Papel arrugado',
    'cuadriculado': 'Papel cuadriculado',
    'rayado': 'Papel de cuaderno (rayado)',
    'pizarrón azul': 'Pizarrón azul marino con cuadrícula',
    'espacio': 'Espacio con estrellas',
    'pintura': 'Pintura antigua de fondo',
    'desenfocado': 'Imagen desenfocada con color encima',
}
NAVY = {'pizarrón azul'}
EXT = {'recorte': 'png', 'ilustracion': 'png', 'pintura': 'jpg', 'foto': 'jpg', 'video': 'mp4'}
BASE = {'recorte': 'recorte', 'ilustracion': 'ilustracion', 'pintura': 'pintura', 'foto': 'foto', 'video': 'escena'}
TIPO_TXT = {'mano': 'escrito a mano', 'marcador': 'marcador', 'titular': 'titular (Anton)', 'sello': 'sello'}


def norm(s):
    s = unicodedata.normalize('NFC', s.lower())
    s = re.sub(r'[^\wáéíóúüñ\s]', ' ', s)
    return s.split()


def generar(ent, rows_file, transcript, titulo, nota_recursos='', reutilizables=None):
    # ── narración del guion (sin marcas) ──
    t = open(os.path.join(ent, '01_guion_largo.md')).read().split('## Conteo')[0]
    parts = re.split(r'\n## (SECCIÓN[^\n]*)\n', t)
    clean, words = [], []
    for i in range(1, len(parts), 2):
        for line in parts[i + 1].split('\n'):
            if not line.strip() or line.startswith('>') or line.strip() == '---':
                continue
            line = re.sub(r'\[ÉNFASIS: ([^\]]*)\]', r'\1', line)
            line = re.sub(r'\[[^\]]*\]', ' ', line)
            clean.extend(line.split())
            words.extend(norm(line))
    w2c = []
    for ci, c in enumerate(clean):
        w2c.extend([ci] * len(norm(c)))
    # ── tiempos reales: guion alineado con la transcripción de la voz ──
    aw = json.load(open(transcript))
    hyp, ht = [], []
    for w, s, e in aw:
        for tk in norm(w):
            hyp.append(tk); ht.append(s)
    END = aw[-1][2]
    tw = [None] * len(words)
    for a, b, size in difflib.SequenceMatcher(None, words, hyp, autojunk=False).get_matching_blocks():
        for k in range(size):
            tw[a + k] = ht[b + k]
    known = [i for i, v in enumerate(tw) if v is not None]
    for i in range(len(tw)):
        if tw[i] is None:
            p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
            tw[i] = tw[q] if p is None else (tw[p] + 0.35 * (i - p) if q is None else tw[p] + (tw[q] - tw[p]) * (i - p) / (q - p))

    # ── escenas ──
    ROWS = []
    def S(title): ROWS.append(dict(section=title))
    def R(phrase, fondo, desc, rec=(), yo=(), txt=(), mark=''):
        assert fondo in FONDOS, f'fondo desconocido: {fondo}'
        ROWS.append(dict(phrase=phrase, fondo=fondo, desc=desc, rec=list(rec), yo=list(yo), txt=list(txt), mark=mark))
    exec(open(rows_file).read(), dict(S=S, R=R))
    pos = 0
    for r in ROWS:
        if 'section' in r: continue
        p = norm(r['phrase'])
        for k in range(pos, len(words) - len(p) + 1):
            if words[k:k + len(p)] == p:
                r['idx'] = k; pos = k + 1; break
        else:
            sys.exit(f"NO ENCONTRADA en el guion: {r['phrase']}")
    scenes = [r for r in ROWS if 'idx' in r]
    for a, b in zip(scenes, scenes[1:] + [None]):
        a['start'] = 0.0 if a is scenes[0] else max(0.0, tw[a['idx']] - 0.12)
        a['end'] = (tw[b['idx']] - 0.12) if b else END
        a['end_idx'] = b['idx'] if b else len(words)

    def fmt(s): return f"{int(s // 60)}:{int(s % 60):02d}"
    def frag(a, b):
        ca = w2c[a]; cb = w2c[b] if b < len(w2c) else len(clean)
        seg = clean[ca:cb]
        return ' '.join(seg if len(seg) <= 18 else seg[:15] + ['…']).replace('|', '/')

    # ── reglas del estilo (se detiene si algo no se cumple) ──
    errs = []
    for a, b in zip(scenes, scenes[1:]):
        if a['fondo'] == b['fondo']:
            errs.append(f"escenas seguidas con el mismo fondo «{a['fondo']}»: {a['phrase']} → {b['phrase']}")
    nav = [s for s in scenes if s['fondo'] in NAVY]
    if len(nav) * 6 > len(scenes) + 5:
        errs.append(f'demasiado azul marino: {len(nav)} de {len(scenes)} escenas (máximo 1 de cada 6)')
    def clave(s): return ' '.join(re.sub(r'[*"«»“”¿?¡!.,:;…·]', ' ', s.lower()).split())
    for s in scenes:
        ks = [clave(x) for x, _ in s['txt']]
        nums = [m for x, _ in s['txt'] for m in re.findall(r'\d+', x)]
        if len(ks) != len(set(ks)) or len(nums) != len(set(nums)):
            errs.append(f"texto repetido en la escena «{s['phrase']}»")
    if errs:
        sys.exit('Reglas del estilo rotas:\n  ' + '\n  '.join(errs))

    # ── nombres de archivo ──
    CAT, ALIAS, ORDEN, YA = {}, {}, [], {}
    for n, r in enumerate(scenes, 1):
        r['n'] = n; r['files'] = []
        cnt = {}
        nuevos = [x for x in r['rec'] if not isinstance(x, str) and x[0] != 'ya']
        for x in r['rec']:
            if isinstance(x, str):
                name = ALIAS.get(x[1:], x[1:])
                assert name in CAT or name in YA, f'escena {n}: el recurso {name} no existe todavía'
                (CAT.get(name) or YA[name])['escenas'].append(n)
                r['files'].append(name); continue
            if x[0] == 'ya':
                name = x[1]
                YA.setdefault(name, dict(desc=x[2], escenas=[]))['escenas'].append(n)
                r['files'].append(name); continue
            kind, desc, kw, alias = (list(x) + ['', ''])[:4]
            same = [y for y in nuevos if y[0] == kind]
            k = cnt.get(kind, 0); cnt[kind] = k + 1
            suf = '' if len(same) == 1 else '_' + 'abcdefgh'[k]
            name = f"{BASE[kind]}_{n:03d}{suf}.{EXT[kind]}"
            CAT[name] = dict(tipo=kind, desc=desc, kw=kw, escenas=[n])
            ORDEN.append(name)
            if alias: ALIAS['@' + alias] = name
            r['files'].append(name)

    # ── 02_guion_tecnico.md ──
    L = [f'# {titulo} — Guion técnico de edición (estilo collage)\n']
    L.append(f'**Formato:** 1920×1080 · 30 fps · **{len(scenes)} escenas** · narración real **{fmt(END)}** (más 10–15 s de pantalla final)')
    L.append('**Tiempos:** son los reales de la voz ya grabada.')
    L.append('**Audio:** solo la voz en off (regla del canal).')
    L.append('**Estilo:** collage (ver CLAUDE.md, «Estilo de edición collage»). Cada escena se arma por capas sobre su fondo; dentro de ella cambia algo cada 2 a 4 s. El fondo nunca se repite en dos escenas seguidas.\n')
    L.append('## Leyenda')
    L.append('- **Fondo:** lo hago yo con código (papel, cuadrícula, pizarrón, espacio), salvo «pintura» y «desenfocado», que usan un recurso tuyo.')
    L.append('- **Recursos que me mandas:**')
    L.append('  - `recorte_NNN.png`: PNG sin fondo; yo le pongo el borde blanco tipo estampa;')
    L.append('  - `ilustracion_NNN.png`: en el estilo de la miniatura;')
    L.append('  - `pintura_NNN.jpg`: pintura antigua de dominio público;')
    L.append('  - `foto_NNN.jpg` y `escena_NNN.mp4`: van en tarjetas con marco blanco.')
    L.append('- **Lo hago yo:** sellos, flechas, círculos, tachones, dibujitos, gráficas, notas a mano y textos.')
    L.append('- ⚡ = pico de dopamina · 🪝 = minigancho.\n')
    L.append('---')
    for r in ROWS:
        if 'section' in r:
            L.append(f"\n### {r['section']}\n")
            L.append('| # | Tiempo | Narración (fragmento) | Fondo | Qué se ve | Recursos que me mandas | Lo hago yo | Texto en pantalla |')
            L.append('|---|---|---|---|---|---|---|---|')
            continue
        rec = '<br>'.join(f'`{f}`' + (' *(ya lo tienes)*' if f in YA else '') for f in r['files']) or '—'
        yo = '<br>'.join(r['yo']) or '—'
        tx = '<br>'.join(f'«{x}» ({TIPO_TXT[k]})' for x, k in r['txt']) or '—'
        num = f"{r['n']} {r['mark']}".strip()
        L.append(f"| {num} | {fmt(r['start'])}–{fmt(r['end'])} | «{frag(r['idx'], r['end_idx'])}» | {r['fondo']} | {r['desc']} | {rec} | {yo} | {tx} |")
    open(os.path.join(ent, '02_guion_tecnico.md'), 'w').write('\n'.join(L) + '\n')

    # ── 06_recursos.md ──
    por = {k: [x for x in ORDEN if CAT[x]['tipo'] == k] for k in EXT}
    def esc(c): return ', '.join(str(e) for e in c['escenas'])
    def tabla(kind, titulo_sec, intro):
        if not por[kind]: return []
        out = [f"\n## {titulo_sec} ({len(por[kind])})\n", intro, '', '| ✓ | Archivo | Qué es | Escena(s) | Palabras clave (Envato, inglés) |', '|---|---|---|---|---|']
        for x in por[kind]:
            c = CAT[x]; out.append(f"| ☐ | `{x}` | {c['desc']} | {esc(c)} | `{c['kw']}` |")
        return out
    M = [f'# {titulo} — Recursos que necesito (estilo collage)\n']
    if nota_recursos: M.append(nota_recursos + '\n')
    M.append('**Cómo pasármelos:**')
    M.append('1. Crea una carpeta en Google Drive con estas subcarpetas: `RECORTES`, `ILUSTRACIONES`, `PINTURAS`, `FOTOS` y `VIDEOS`.')
    M.append('2. Guarda cada archivo con el **nombre exacto** de la lista.')
    M.append('3. Compártela como «Cualquier persona con el enlace» y pásame el enlace.\n')
    M.append('**Reglas para todo:**')
    M.append('- **Recortes:** PNG **sin fondo** (transparente), de buena calidad (1000 px o más del lado largo). El borde blanco tipo estampa se lo pongo yo.')
    M.append('- **Ilustraciones:** en el estilo de tu miniatura «Tu valor no está arriba»: planas, retro, con textura y pocos colores.')
    M.append('- **Pinturas:** antiguas y de **dominio público** (de autores que murieron hace más de 70 años), por ejemplo de Wikimedia Commons o de Envato. Horizontales, 1920 px o más.')
    M.append('- **Fotos y videos:** horizontales, 1920×1080 o más; los videos de 5 a 15 s. Van dentro de tarjetas, así que no tienen que ser perfectos.')
    M.append('- **Sin logos ni marcas** reales, sin personajes de películas o caricaturas y sin caras de famosos. Personas comunes sí (tienes licencia).')
    M.append('- Si algo no lo encuentras, mándame algo parecido o avísame.\n')
    tot = {k: len(v) for k, v in por.items()}
    M.append(f"**Total nuevo:** {tot['recorte']} recortes · {tot['ilustracion']} ilustraciones · {tot['pintura']} pinturas · {tot['foto']} fotos · {tot['video']} videos." + (f" Además se reutilizan {len(YA)} archivos que ya me mandaste." if YA else ''))
    M.append('\n---')
    M += tabla('recorte', '1. Recortes PNG sin fondo → `RECORTES/`', 'Personas y objetos recortados. Son la base del estilo: entran como estampas con borde blanco.')
    M += tabla('ilustracion', '2. Ilustraciones → `ILUSTRACIONES/`', 'En el estilo de tu miniatura (retro, plana, con textura). PNG sin fondo si es un objeto suelto; JPG si es una escena completa.')
    M += tabla('pintura', '3. Pinturas antiguas (dominio público) → `PINTURAS/`', 'Van de fondo o como recorte, para el humor visual.')
    M += tabla('foto', '4. Fotos → `FOTOS/`', 'Van dentro de tarjetas con marco blanco.')
    M += tabla('video', '5. Videos (pocos) → `VIDEOS/`', 'Solo para momentos humanos. También van dentro de tarjetas.')
    if YA:
        M.append(f"\n## 6. Lo que ya me mandaste y se reutiliza ({len(YA)})\n")
        M.append('No tienes que hacer nada con estos: ya los tengo.\n')
        M.append('| Archivo | Qué es | Escena(s) |')
        M.append('|---|---|---|')
        for x, c in sorted(YA.items()):
            M.append(f"| `{x}` | {c['desc']} | {esc(c)} |")
    M.append('\n---\n')
    M.append('## Lo que hago yo (no tienes que mandarlo)')
    M.append('- Los fondos de papel (oscuro, crema, arrugado, cuadriculado, rayado), el pizarrón y el espacio con estrellas.')
    M.append('- Los sellos, las X rojas, las flechas, los círculos, los subrayados, los tachones y los dibujitos.')
    M.append('- Las gráficas y los mapas sencillos, dibujados con línea.')
    M.append('- Las notas escritas a mano, los titulares y todos los textos.')
    M.append('- El borde blanco tipo estampa de los recortes, las tarjetas con marco y toda la animación.')
    M.append('- La voz (ya está lista) y los subtítulos de los shorts.')
    open(os.path.join(ent, '06_recursos.md'), 'w').write('\n'.join(M) + '\n')

    from collections import Counter
    print('escenas', len(scenes), '· duración', fmt(END), '· promedio', round(END / len(scenes), 1), 's')
    print('recursos nuevos:', tot, '· reutilizados:', len(YA))
    print('fondos:', Counter(s['fondo'] for s in scenes).most_common())
    print('escenas de más de 13 s:', [(s['n'], round(s['end'] - s['start'], 1)) for s in scenes if s['end'] - s['start'] > 13])
    print('escenas de menos de 3 s:', [(s['n'], round(s['end'] - s['start'], 1)) for s in scenes if s['end'] - s['start'] < 3])
    return scenes
