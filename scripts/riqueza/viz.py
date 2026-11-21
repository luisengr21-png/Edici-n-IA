"""Plan visual de «La riqueza de otros» (Fase 2).

Lee las escenas de rows.py (las mismas del guion técnico), las alinea con la narración real
(audio/la-riqueza-de-otros/transcripcion_palabras_largo.json) y escribe src/riqueza/plan.json.

Reglas del video 4 (excepción acordada con el creador): los videos y fotos son suyos; los íconos,
los textos en pantalla y el personaje «Tú» los hago yo con código.
Uso: python3 scripts/riqueza/viz.py
"""
import json, os, re, sys, difflib, unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))
AUD = os.path.join(ROOT, 'audio', 'la-riqueza-de-otros')
PUB = os.path.join(ROOT, 'public', 'riqueza')

# Reutiliza el parser del generador de la Fase 1 (escenas, archivos y textos), sin volver a escribir los .md
src = open(os.path.join(HERE, 'gen_fase1.py')).read().split('# ── regla del canal')[0]
__file__ = os.path.join(HERE, 'gen_fase1.py')
exec(src)

# ── tiempos reales ──
aw = json.load(open(os.path.join(AUD, 'transcripcion_palabras_largo.json')))
meta = json.load(open(os.path.join(AUD, 'largo_meta.json')))
NUM = {'1983': 'mil novecientos ochenta y tres', '1990': 'mil novecientos noventa', '1848': 'mil ochocientos cuarenta y ocho',
       '1892': 'mil ochocientos noventa y dos', '1928': 'mil novecientos veintiocho', '1942': 'mil novecientos cuarenta y dos',
       '1914': 'mil novecientos catorce'}
ref, ref_of = [], []          # palabras del guion (con los años en letra) → índice de palabra original
for i, w in enumerate(words):
    for t in (NUM[w].split() if w in NUM else [w]):
        ref.append(t); ref_of.append(i)
hyp, ht = [], []
for w, s, e in aw:
    for t in norm(w):
        for u in (NUM[t].split() if t in NUM else [t]):
            hyp.append(u); ht.append(s)
sm = difflib.SequenceMatcher(None, ref, hyp, autojunk=False)
tw = [None] * len(words)
for a, b, size in sm.get_matching_blocks():
    for k in range(size):
        if tw[ref_of[a + k]] is None:
            tw[ref_of[a + k]] = ht[b + k]
known = [i for i, v in enumerate(tw) if v is not None]
cov = len(known) / len(words)
for i in range(len(tw)):
    if tw[i] is None:
        p = max([k for k in known if k < i], default=None); q = min([k for k in known if k > i], default=None)
        tw[i] = tw[q] if p is None else tw[p] + 0.35 * (i - p) if q is None else tw[p] + (tw[q] - tw[p]) * (i - p) / (q - p)
AUDIO_END = meta['duration']
END_SCREEN = 12.0

# ── íconos: emoji (Noto Color Emoji, licencia Apache 2.0) o dibujo propio en SVG ──
EMO = dict(sombrero_copa='🎩', bateria_baja='🪫', reloj='⏰', etiqueta_precio='🏷️', fajo='💵', camara='📷', mapa='📍', banco='🏦',
           tele='📺', libro='📖', quitar='🫳', lupa='🔍', balanza='⚖️', matraz='🧪', moneda='🪙', mapa_latam='🌎', calendario='📅',
           interrogacion='❓', internet='🌐', mensajes='💬', videollamada='📹', palomita='✅', corona='👑', empresa='🏢', empresa_2='🏭',
           regalo='🎁', permiso='📜', apreton='🤝', mazo='🔨', flecha_abajo='⬇️', iman='🧲', x_roja='❌', libro_viejo='📔', cerebro='🧠',
           alcancia='🐷', inversion='🌱', empleo='💼', casa='🏠', escuela='🏫', doctor='🩺', birrete='🎓', microscopio='🔬', paloma='🕊️',
           hospital='🏥', mano_corazon='🫶', tijeras='✂️', foco='💡', frasco='💊', celular='📱', impuestos='🧾', castillo='🏰', riesgo='🎲',
           grafica_baja='📉', mano='✋', dos_empleados='👥', llave_auto='🔑', rompecabezas='🧩', globo='🌍', explosion='💥', tierra_seca='🏜️',
           barril='🛢️', auto='🚗', barco='🚢', mapamundi='🗺️', plato='🍽️', autobus='🚌', piramide='🔺', rayo='⚡', exprimidor='🍋',
           herramientas='🛠️', comentario='🗨️', like='👍', compartir='↗️', campana='🔔')
SVG = {'estrellas', 'pastel_injusto', 'pastel_parejo', 'silueta_1900', 'silueta_nino', 'guardias', 'villano', 'aureola', 'sin_senal', 'bascula', 'poste_luz'}

def icon(name):
    k = name[len('icono_'):-4]
    if k in SVG: return dict(svg=k)
    assert k in EMO, f'ícono sin dibujo: {k}'
    return dict(e=EMO[k])

# ── textos: palabra de acento (dorado; con «!» delante, rojo vivo) ──
ACC = {
 'SOLO MILLONARIOS': 'MILLONARIOS', '1983': '1983', 'CASI 1 KG': '1 KG', '30 MIN': '!30 MIN', '10 HORAS': '!10 HORAS', '$3,995': '$3,995', '+$10,000 DE HOY': '+$10,000',
 'TÚ GANASTE': 'GANASTE', '¿SE LO QUITÓ A OTRO?': '!QUITÓ', '2 TIPOS DE RICOS': '2 TIPOS', 'SE APROVECHAN': '!APROVECHAN', 'LA HACEN AVANZAR': 'AVANZAR',
 'IDÉNTICOS': 'IDÉNTICOS', 'LA PRUEBA': 'PRUEBA', '¿DE QUÉ TIPO ES?': 'TIPO', 'INCOMODA A LOS DOS BANDOS': 'DOS BANDOS', 'EXPERIMENTO': 'EXPERIMENTO',
 '1990': '1990', 'LARGA DISTANCIA': '!LARGA', '$$$ POR MINUTO': '!$$$', 'MESES… O AÑOS': '!AÑOS', '¿CUÁNTO? ¿QUIÉN?': '!¿QUIÉN?', 'HOY': 'HOY',
 'MISMO SUELDO': 'SUELDO', 'OTRA VIDA': 'OTRA VIDA', 'LA TRAMPA': '!TRAMPA', 'SOLO UN PAPEL': 'PAPEL', 'MÁS RICO': 'RICO', 'COMPETENCIA': 'COMPETENCIA',
 'COBRA DE MÁS': '!DE MÁS', 'MÁS BARATO Y MEJOR': 'MEJOR', 'POR TI': 'POR TI', 'EL VILLANO': '!VILLANO', 'UNA SOLA COMPAÑÍA': '!UNA SOLA', '1': '!1',
 'TIPO 1': '!1', 'NADIE MÁS PUEDE JUGAR': '!NADIE', 'LO QUE QUIERE': '!QUIERE', 'TIPO 2': '2', 'MUY RICO': 'MUY', '¿BUENOS O MALOS?': 'BUENOS',
 'PREGUNTA EQUIVOCADA': '!EQUIVOCADA', '¿CÓMO LO CONSIGUIÓ?': 'CÓMO', 'LOS DOS A LA VEZ': 'DOS', 'ESCOCIA, 1848': '1848', 'ANDREW CARNEGIE': 'CARNEGIE',
 '12 HORAS DIARIAS': '!12 HORAS', '$1.20 A LA SEMANA': '!$1.20', '40 AÑOS DESPUÉS': '40 AÑOS', 'BENEFICIO DIRECTO: EMPLEO': 'EMPLEO', '90 %': '90 %',
 '+2,500 BIBLIOTECAS': '+2,500', '¿EL RICO PERFECTO?': 'PERFECTO', '1892': '!1892', 'RECORTE DE SUELDO': '!RECORTE', 'MUEREN TRABAJADORES': '!MUEREN',
 'Y GUARDIAS': '!GUARDIAS', 'NO HIZO NADA': '!NADA', '¿SUMA O SE APROVECHA?': 'SUMA', 'LOS DOS': 'DOS', 'NO POR LO QUE REGALA': '!REGALA',
 'POR CÓMO GANA': 'CÓMO GANA', 'INVISIBLES': 'INVISIBLES', 'DIRECTOS': 'DIRECTOS', 'INDIRECTOS': 'INDIRECTOS', '1. INNOVACIÓN': 'INNOVACIÓN',
 '1928': '1928', '+10 AÑOS': '!+10 AÑOS', '1942': '1942', 'LA MITAD DEL PAÍS': '!LA MITAD', '2. IMPUESTOS': 'IMPUESTOS', 'LO MENOS POSIBLE': '!MENOS',
 '¿TIPO 1 O 2?': '¿TIPO', 'ÉL SOLITO': 'SOLITO', 'MENTIRA': '!MENTIRA', 'MEDIA VERDAD': 'MEDIA', 'UN EDIFICIO VACÍO': '!VACÍO', 'NO FUE EL DUEÑO': 'DUEÑO',
 'DE UN ERROR': 'ERROR', 'EL GIRO': 'GIRO', '1914': '1914', 'SUELDO ×2': '×2', 'NO FUE CARIDAD': '!CARIDAD', 'FUE BUEN NEGOCIO': 'BUEN NEGOCIO',
 'ESFUERZO COMPARTIDO': 'COMPARTIDO', 'COREA DEL SUR': 'COREA', 'TRABAJA · CREA · VENDE AL MUNDO': 'VENDE AL MUNDO', '+500,000 FAMILIAS': '+500,000',
 'RIQUEZA DESDE ABAJO': 'DESDE ABAJO', 'UNOS POCOS': '!POCOS', 'NO DESDE ARRIBA': '!ARRIBA', 'LA PRUEBA DE UNA PREGUNTA': 'UNA PREGUNTA',
 '¿MEJORÓ LA VIDA DE OTROS…': 'MEJORÓ', '…O LES QUITÓ OPCIONES?': '!QUITÓ', 'TE HACE MÁS RICO': 'MÁS RICO', 'TE HACE MÁS POBRE': '!MÁS POBRE',
 'NI VILLANOS NI HÉROES': 'HÉROES', 'ES UN JUEGO': 'JUEGO', 'PIERDES': '!PIERDES', 'SIN EMPLEADOS NO HAY EMPRESAS': 'EMPRESAS',
 'SIN TRABAJADORES NO HAY PROGRESO': 'PROGRESO', 'SE REPARTE MEJOR': 'MEJOR', '¿ES JUSTO EN TU PAÍS?': 'JUSTO', 'TE LEO EN LOS COMENTARIOS': 'COMENTARIOS',
 'SUSCRÍBETE': 'SUSCRÍBETE',
 # shorts
 'EL LADRILLO MÁS CARO': 'MÁS CARO', '¿HÉROE O VILLANO?': '!VILLANO', 'NADIE LE CREYÓ': '!NADIE',
}

def tx(text, fondo, tam):
    a = ACC.get(text)
    assert a is not None, f'texto sin acento definido: {text}'
    red = a.startswith('!')
    a = a.lstrip('!')
    assert a in text, (text, a)
    return dict(text=text, card=fondo == 'con', size=tam, acc=a, red=red)

# ── personaje «Tú»: pose y gesto según la descripción de la escena ──
def person(desc):
    d = desc.lower()
    p = dict(pose='stand', mood=None)
    rules = [
        (('puño',), dict(pose='handup', mood='happy')), (('aplaude', 'feliz'), dict(pose='handup', mood='happy')),
        (('encoge de hombros', 'encoge'), dict(pose='shrug')), (('rasca', 'confundido'), dict(pose='scratch')),
        (('pensativo', 'barbilla', 'sien'), dict(pose='scratch', mood='blank')), (('lupa',), dict(pose='reach', hold='🔍')),
        (('señala',), dict(pose='reach', mood='happy')), (('saluda',), dict(pose='wave', mood='happy')),
        (('alto', 'levanta un dedo', 'levanta la mano'), dict(pose='handup')), (('dedo en la boca', 'shhh'), dict(pose='phone', mood='blank')),
        (('incómodo', 'jalándose'), dict(pose='scratch', mood='worried', sweat=True)), (('serio',), dict(pose='stand', mood='blank')),
        (('asusta', 'alerta', 'frena'), dict(pose='shrug', mood='worried')), (('enojado',), dict(pose='hips', mood='angry')),
        (('asiente', 'pulgar'), dict(pose='hips', mood='happy')), (('dormido',), dict(pose='sit', mood='tired')),
        (('sienta', 'sentado'), dict(pose='sit')), (('regalo',), dict(pose='reach', mood='worried', hold='🎁')),
        (('globo terráqueo',), dict(pose='reach', mood='happy', hold='🌍')), (('explotando',), dict(pose='shrug', mood='worried')),
        (('matraz',), dict(pose='reach', hold='🧪')), (('auricular',), dict(pose='phone', mood='worried', sweat=True)),
        (('celular', 'escribe'), dict(pose='phone', mood='happy')), (('campana',), dict(pose='reach', mood='happy', hold='🔔')),
        (('corona',), dict(pose='hips', mood='happy')), (('libro',), dict(pose='reach', hold='📔')),
        (('niega',), dict(pose='stand', mood='happy')), (('ceja', 'irónico', 'picardía'), dict(pose='hips', mood='happy')),
        (('voltea', 'expectante', 'atento', 'curioso', 'intrigado', 'acerca', 'secreto', 'boca abierta', 'sorprend'), dict(pose='stand', mood='worried')),
        (('camina',), dict(pose='stand', walk=True)), (('sonr',), dict(pose='stand', mood='happy')),
    ]
    for keys, v in rules:
        if any(k in d for k in keys):
            p.update(v); break
    return {k: v for k, v in p.items() if v is not None}

# ── plan ──
uses = {}
out = []
sec = None
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
            media.append(dict(t='v', src=f'riqueza/videos/{f[:-4]}.mp4', off=[0.4, 6.0, 11.0, 3.0, 8.5][k % 5]))
        elif f.startswith('foto_'):
            k = uses.get(f, 0); uses[f] = k + 1
            from PIL import Image
            fp = os.path.join(ROOT, 'public', 'riqueza', 'fotos', f[:-4] + '.jpg')
            ar = round(Image.open(fp).size[0] / Image.open(fp).size[1], 3) if os.path.exists(fp) else 1.78
            media.append(dict(t='f', src=f'riqueza/fotos/{f[:-4]}.jpg', k=k, ar=ar))
        else:
            icons.append(icon(f))
    for m in media:
        assert os.path.exists(os.path.join(ROOT, 'public', m['src'])) or not os.path.isdir(os.path.join(PUB, 'videos')), f"falta {m['src']}"
    d = r['desc'].lower()
    fx = []
    if 'x roja' in d or 'tacha' in d: fx.append('cross')
    if 'se inclina' in d or 'tambalea' in d or 'se mueve de un lado' in d: fx.append('tilt')
    if 'pantalla dividida' in d: fx.append('split')
    if 'oscurece' in d or 'fondo negro' in d: fx.append('dark')
    if 'sube' in d and any('etiqueta' in str(i) or i.get('e') == '🏷️' for i in icons): fx.append('rise')
    if 'cae' in d or 'caen' in d or 'cayendo' in d: fx.append('drop')
    sc = dict(n=n, start=round(st, 2), tipo=r['tipo'], sec=sec.split('·')[0].strip(), media=media, icons=icons,
              txt=[tx(*t) for t in r['txt']], fx=fx, hit=('⚡' in r['mark']))
    if r['tipo'] == '2D':
        sc['person'] = person(r['desc'])
    out.append(sc)
for a, b in zip(out, out[1:]):
    a['end'] = b['start']
out[-1]['end'] = round(AUDIO_END + END_SCREEN, 2)
out[-1]['endscreen'] = True

# Desde dónde arranca cada clip: que nunca se acabe antes que la escena; algunos con ajuste propio.
import subprocess
LEN = {}
def clip_len(src):
    if src not in LEN:
        LEN[src] = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', os.path.join(ROOT, 'public', src)]))
    return LEN[src]
FIRST = {'riqueza/videos/escena_100.mp4': (4.0, 1.0),   # el letrero voltea de «cerrado» a «abierto» en el segundo 5
         'riqueza/videos/escena_111.mp4': (0.0, 0.6)}   # el niño voltea a la cámara en el segundo 2.7: más lento y solo el inicio
for s in out:
    d = (s['end'] - s['start']) / (2 if len([m for m in s['media'] if m['t'] == 'v']) >= 2 and 'split' not in s['fx'] else 1)
    for m in s['media']:
        if m['t'] != 'v': continue
        if m['src'] in FIRST and m['off'] == 0.4:
            m['off'], m['rate'] = FIRST[m['src']]
        m['off'] = round(max(0.0, min(m['off'], clip_len(m['src']) - d * m.get('rate', 1) - 0.3)), 2)

# Capítulos: inicio de cada sección
CAP = {'SECCIÓN 0': 'Dos tipos de ricos', 'SECCIÓN 1': 'Más rico sin un peso más', 'SECCIÓN 2': 'El villano: el rico que no quiere competir',
       'SECCIÓN 3': 'El hombre que fue los dos', 'SECCIÓN 4': 'Lo que usas sin ver', 'SECCIÓN 5': 'La parte que casi nadie dice',
       'SECCIÓN 6': 'Por qué un país es rico', 'SECCIÓN 7': 'La prueba de una sola pregunta'}
chapters, seen = [], set()
for s in out:
    if s['sec'] not in seen:
        seen.add(s['sec']); chapters.append((s['start'] if s['n'] > 1 else 0.0, CAP[s['sec']]))

os.makedirs(os.path.join(ROOT, 'src', 'riqueza'), exist_ok=True)
json.dump(dict(audioEnd=AUDIO_END, duration=round(AUDIO_END + END_SCREEN, 2), scenes=out),
          open(os.path.join(ROOT, 'src', 'riqueza', 'plan.json'), 'w'), ensure_ascii=False, indent=0)
json.dump(chapters, open(os.path.join(AUD, 'capitulos.json'), 'w'), ensure_ascii=False)
dd = [s['end'] - s['start'] for s in out]
print('cobertura de la alineación', round(cov, 3), '· escenas', len(out), '· duración', fmt(AUDIO_END + END_SCREEN))
print('más largas:', sorted([(round(x, 1), s['n']) for x, s in zip(dd, out)], reverse=True)[:6])
print('más cortas:', sorted([(round(x, 2), s['n']) for x, s in zip(dd, out)])[:6])
for t0, c in chapters:
    print(f'{fmt(t0)} {c}')
