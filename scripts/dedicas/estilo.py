"""Reglas de edición del canal (desde el video 5): fondos, transiciones y efectos por escena.

assign(scenes, emociones) completa cada escena con:
  layout  'full' (imagen a pantalla completa) o 'card' (imagen en tarjeta sobre un fondo diseñado)
  bg      {type, c1, c2, c3, light}
  tr      {type, dur}   transición de entrada
  acc     colores de acento con buen contraste para ese fondo
  efectos de cada imagen e ícono: entrada, permanencia, tratamientos (máx. 2) y especial ocasional
check(scenes) se detiene si algo rompe las reglas (fondo o transición repetidos en escenas seguidas,
contraste insuficiente, imagen sin efectos, azul marino como fondo).
"""
import sys

# ── paletas: (c1 dominante, c2, c3) ── nada de azul marino ni azul oscuro
LIGHT = {
    'durazno': ('#FFD6A5', '#FFADAD', '#FDFFB6'), 'menta': ('#CAFFBF', '#9BF6FF', '#FDFFB6'), 'lavanda': ('#E4D9FF', '#BDB2FF', '#FFC6FF'),
    'limon': ('#FFF3B0', '#FFD166', '#F4A261'), 'crema': ('#FFF8EC', '#FFE8CC', '#FFD6A5'), 'cielo': ('#D7F1FF', '#A0E7E5', '#B4F8C8'),
    'rubor': ('#FFE5EC', '#FFC2D1', '#FFB3C6'), 'arena': ('#F4EDE4', '#E9DCC9', '#D4C1A1'), 'salvia': ('#E3F0D6', '#C5DEB0', '#F1E3B6'),
    'coral_claro': ('#FFDDD2', '#FFB4A2', '#E5989B'),
}
DARK = {
    'bosque': ('#1B4332', '#2D6A4F', '#52B788'), 'ciruela': ('#4A1942', '#893168', '#C4A5DE'), 'terracota': ('#7A2E1B', '#A8442A', '#F4A261'),
    'magenta': ('#6A1650', '#A0157F', '#F72585'), 'violeta': ('#4C1D95', '#6D28D9', '#C084FC'), 'petroleo': ('#0B525B', '#14706B', '#7AE7C7'),
    'carbon': ('#2B2522', '#4A3D37', '#E07A5F'), 'vino': ('#5E0B15', '#7D2531', '#D9A6A1'), 'oliva': ('#33420D', '#4F5E16', '#C9D46C'),
    'oxido': ('#8A2D00', '#A83A00', '#FFBE0B'),
}
NAVY = ['#0a1128', '#0f172a', '#1a1a40', '#0b1a3a', '#121633', '#050d20', '#16306a']

# Preferencias según la emoción del momento (sin obligar: solo el orden en que se prueban)
MOOD = {
    'tenso': ['magenta', 'vino', 'carbon', 'oxido', 'ciruela', 'limon', 'coral_claro'],
    'triste': ['arena', 'carbon', 'salvia', 'ciruela', 'crema', 'petroleo', 'lavanda'],
    'alegre': ['durazno', 'menta', 'limon', 'cielo', 'rubor', 'coral_claro', 'oxido', 'bosque'],
    'ironico': ['limon', 'violeta', 'coral_claro', 'magenta', 'menta', 'oxido'],
    'sorpresa': ['cielo', 'violeta', 'durazno', 'oxido', 'lavanda', 'menta'],
    'enojo': ['vino', 'oxido', 'carbon', 'magenta', 'coral_claro'],
    'neutro': ['crema', 'bosque', 'lavanda', 'petroleo', 'menta', 'terracota', 'salvia', 'violeta', 'durazno', 'oliva', 'rubor', 'arena'],
}
BG_TYPES = {
    'tenso': ['halftone', 'lines', 'grain', 'conic', 'radial'],
    'triste': ['paper', 'grain', 'warm', 'radial', 'linear'],
    'alegre': ['blobs', 'mesh', 'circles', 'conic', 'solid', 'linear'],
    'ironico': ['halftone', 'grid', 'solid', 'lines', 'blobs'],
    'sorpresa': ['conic', 'radial', 'circles', 'mesh'],
    'enojo': ['lines', 'grain', 'halftone', 'solid'],
    'neutro': ['mesh', 'linear', 'grid', 'blobs', 'paper', 'solid', 'radial', 'circles', 'warm'],
}
# Transiciones por energía del corte, con su duración (0.3–0.8 s)
TRANS = {
    'rapido': (['whip', 'glitch', 'push', 'zoom', 'flash', 'slide', 'blocks'], 0.35),
    'medio': (['slide', 'wipe', 'iris', 'blinds', 'cube', 'page', 'ink', 'push', 'blocks', 'wipev', 'zoom'], 0.5),
    'lento': (['dissolve', 'blur', 'dip', 'leak', 'iris', 'ink', 'page'], 0.72),
}
ENTRY = ['mask', 'zoomPoint', 'slideBounce', 'blurSharp', 'blocks', 'polaroid', 'shapeOpen']
KEEP = ['kenburns', 'parallax', 'float', 'rotate', 'breathe']
TREAT_FULL = [['grain', 'vignette'], ['duotone'], ['vignette'], ['halftone'], ['grain'], ['bwaccent', 'vignette'], ['glow'], []]
TREAT_CARD = [['shadowBorder'], ['chroma'], ['grain', 'shadowBorder'], ['duotone'], ['glow'], ['halftone', 'shadowBorder'], ['bwaccent']]
SHAPES = ['rounded', 'circle', 'arch', 'blob']
SPECIAL = ['shine', 'particles', 'leak', 'flare', 'frame', 'speedlines', 'stickers']
ICON_IN = ['pop', 'drop', 'spin', 'slide', 'blur']
ICON_KEEP = ['float', 'breathe', 'rotate']

def lum(hexc):
    h = hexc.lstrip('#'); r, g, b = (int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))
    f = lambda c: c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)

def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)

INK = '#1C1A27'
ACC_LIGHT = {'amber': '#8A4100', 'red': '#B0101C'}
ACC_DARK = {'amber': '#FFB547', 'red': '#FF6B6B'}

def mood_of(emo):
    return {'dramatically': 'tenso', 'nervous': 'tenso', 'sad': 'triste', 'warmly': 'alegre', 'happy': 'alegre', 'excited': 'alegre',
            'sarcastic': 'ironico', 'surprised': 'sorpresa', 'angry': 'enojo'}.get(emo, 'neutro')

def energy(emo, speed, hit):
    if speed == 'slowly' or emo in ('sad', 'whispers'): return 'lento'
    if speed == 'quickly' or hit or emo in ('angry', 'surprised', 'dramatically'): return 'rapido'
    return 'medio'

def assign(scenes, emos, vertical=False):
    """emos[i] = (emoción, velocidad) activas al empezar la escena i."""
    prev_c1 = prev_type = prev_tr = prev_in = None
    recent_type, recent_c1 = [], []
    full_run = 0
    k_pal = k_bg = k_entry = k_keep = k_treat = k_shape = k_sp = k_icon = 0
    media_scenes = 0
    for i, s in enumerate(scenes):
        emo, speed = emos[i]
        mood = mood_of(emo)
        # 1) layout: a pantalla completa o en tarjeta (nunca más de 2 pantallas completas seguidas)
        if s['tipo'] in ('VIDEO', 'FOTO') and s['media']:
            media_scenes += 1
            portrait = any((m.get('ar') or 1.78) < 1.2 for m in s['media'])
            card = portrait or full_run >= 2 or media_scenes % 3 == 0 or 'split' in s['fx'] and False
            s['layout'] = 'card' if card and 'split' not in s['fx'] else 'full'
        else:
            s['layout'] = 'none'
        full_run = full_run + 1 if s['layout'] == 'full' else 0
        # 2) fondo
        if s['layout'] == 'full':
            src = s['media'][0]['src']
            s['bg'] = dict(type='media', c1='#000000', c2='#000000', c3='#000000', light=False)
            dominant = 'media:' + src
            s['acc'] = dict(ACC_DARK)
        else:
            # color: el que toca según la emoción, sin repetir ninguno de los últimos 3 fondos
            pool = MOOD[mood]
            names = pool[k_pal % len(pool):] + pool[:k_pal % len(pool)] + [n for n in list(LIGHT) + list(DARK) if n not in pool]
            name = next(n for n in names if (LIGHT.get(n) or DARK.get(n))[0] not in recent_c1)
            k_pal += 1
            c1, c2, c3 = LIGHT.get(name) or DARK.get(name)
            light = name in LIGHT
            # tipo de fondo: rota por todo el catálogo y no repite ninguno de los últimos 4
            ALL = ['mesh', 'linear', 'grid', 'blobs', 'paper', 'solid', 'radial', 'circles', 'warm', 'halftone', 'lines', 'grain', 'conic']
            pref = BG_TYPES[mood]
            types = pref[k_bg % len(pref):] + pref[:k_bg % len(pref)] + ALL[k_bg % len(ALL):] + ALL[:k_bg % len(ALL)]
            if s['media'] and s['layout'] == 'card' and 'blurmedia' not in recent_type:
                types = ['blurmedia'] + types
            btype = next(t for t in types if t not in recent_type)
            k_bg += 1
            recent_type = (recent_type + [btype])[-4:]
            recent_c1 = (recent_c1 + [c1])[-3:]
            s['bg'] = dict(type=btype, c1=c1, c2=c2, c3=c3, light=light)
            dominant = c1
            s['acc'] = dict(ACC_LIGHT if light else ACC_DARK)
        prev_c1, prev_type = dominant, s['bg']['type']
        # 3) transición de entrada (la primera escena no tiene)
        en = energy(emo, speed, s.get('hit'))
        opts, dur = TRANS[en]
        cand = [t for t in opts[i % len(opts):] + opts[:i % len(opts)] if t != prev_tr]
        s['tr'] = dict(type=cand[0] if i else 'dissolve', dur=0.3 if i == 0 else dur)
        prev_tr = s['tr']['type']
        # 4) efectos de cada imagen
        for m in s['media']:
            entry = ENTRY[k_entry % len(ENTRY)]
            if entry == prev_in: k_entry += 1; entry = ENTRY[k_entry % len(ENTRY)]
            if s['layout'] == 'full' and entry == 'polaroid': k_entry += 1; entry = ENTRY[k_entry % len(ENTRY)]
            k_entry += 1; prev_in = entry
            treat = (TREAT_FULL if s['layout'] == 'full' else TREAT_CARD)[k_treat % 7]; k_treat += 1
            fx = dict(**{'in': entry}, keep=KEEP[k_keep % len(KEEP)], treat=treat[:2], shape=SHAPES[k_shape % len(SHAPES)])
            k_keep += 1; k_shape += 1
            if media_scenes % 5 == 0:
                fx['special'] = SPECIAL[k_sp % len(SPECIAL)]; k_sp += 1
            m['fx'] = fx
        for ic in s['icons']:
            ic['fx'] = {'in': ICON_IN[k_icon % len(ICON_IN)], 'keep': ICON_KEEP[k_icon % len(ICON_KEEP)]}
            k_icon += 1
    return scenes

def check(scenes):
    errs = []
    for a, b in zip(scenes, scenes[1:]):
        if a['tr']['type'] == b['tr']['type']:
            errs.append(f"escenas {a['n']}→{b['n']}: misma transición «{b['tr']['type']}»")
        if a['layout'] != 'full' and b['layout'] != 'full':
            if a['bg']['c1'] == b['bg']['c1']: errs.append(f"escenas {a['n']}→{b['n']}: mismo color de fondo {b['bg']['c1']}")
            if a['bg']['type'] == b['bg']['type']: errs.append(f"escenas {a['n']}→{b['n']}: mismo tipo de fondo «{b['bg']['type']}»")
        if a['layout'] == 'full' and b['layout'] == 'full' and a['media'][0]['src'] == b['media'][0]['src']:
            errs.append(f"escenas {a['n']}→{b['n']}: la misma imagen de fondo")
    for s in scenes:
        if not (0.3 <= s['tr']['dur'] <= 0.8): errs.append(f"escena {s['n']}: transición de {s['tr']['dur']} s")
        if s['bg']['c1'].lower() in NAVY: errs.append(f"escena {s['n']}: fondo azul marino")
        for m in s['media']:
            fx = m.get('fx') or {}
            if not fx.get('in') or not fx.get('keep'): errs.append(f"escena {s['n']}: imagen sin efecto de entrada o permanencia")
            if len(fx.get('treat', [])) > 2: errs.append(f"escena {s['n']}: más de 2 tratamientos")
        if s['layout'] != 'full' and s['txt']:
            bg = s['bg']
            if bg['light']:
                for c in (bg['c1'], bg['c2']):
                    if contrast(INK, c) < 4.5: errs.append(f"escena {s['n']}: poco contraste texto/fondo ({c})")
                    for a in s['acc'].values():
                        if contrast(a, c) < 3: errs.append(f"escena {s['n']}: poco contraste del acento {a} sobre {c}")
            else:
                if contrast('#FFFFFF', bg['c1']) < 4.5: errs.append(f"escena {s['n']}: poco contraste texto/fondo ({bg['c1']})")
                if contrast('#FFFFFF', bg['c2']) < 3: errs.append(f"escena {s['n']}: poco contraste texto/fondo ({bg['c2']})")
    if errs:
        sys.exit('Reglas de edición rotas:\n  ' + '\n  '.join(errs))
