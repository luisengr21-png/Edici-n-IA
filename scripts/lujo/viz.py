"""Plan visual escena por escena de «La trampa de la pobreza de lujo».

Lee plan_base.json (tiempos reales alineados con la narración) y escribe src/lujo/plan.json.
Cada escena: S(n, fondo, [elementos], **opciones). Coordenadas en un lienzo de 1920×1080.
Uso: python3 scripts/lujo/viz.py
"""
import json, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))

def d(k, **kw):
    kw['k'] = k
    return kw

def T(text, y=540, size=104, **kw): return d('txt', text=text, y=y, size=size, **kw)
def E(ch, x=960, y=540, size=200, **kw): return d('emo', ch=ch, x=x, y=y, size=size, **kw)
def TAG(text, x=960, y=540, size=70, **kw): return d('tag', text=text, x=x, y=y, size=size, **kw)
def P(pose='stand', x=960, y=600, s=1.0, **kw): return d('person', pose=pose, x=x, y=y, s=s, **kw)
def SEL(mood='look', x=1250, y=600, s=1.0, **kw): return d('seller', mood=mood, x=x, y=y, s=s, **kw)
def H(x=960, y=540, s=1.0, **kw): return d('house', x=x, y=y, s=s, **kw)
def BAG(x=960, y=540, s=1.0, **kw): return d('bag', x=x, y=y, s=s, **kw)
def CAGE(mode='drop', y=560, s=1.0, **kw): return d('cage', mode=mode, y=y, s=s, **kw)
def SC(left, right, tilt=0, ll='', rl='', **kw): return d('scale', left=left, right=right, tilt=tilt, ll=ll, rl=rl, **kw)
def ST(text, x=960, y=540, size=130, **kw): return d('stamp', text=text, x=x, y=y, size=size, **kw)
def M(kind, x=960, y=540, size=260, **kw): return d('mark', kind=kind, x=x, y=y, size=size, **kw)
def AR(x, y, x2, y2, **kw): return d('mark', kind='arrow', x=x, y=y, x2=x2, y2=y2, **kw)
def CARD(text, ch, x=960, y=540, **kw): return d('card', text=text, ch=ch, x=x, y=y, **kw)
def F(kind, x=960, y=540, **kw): return d('frame', kind=kind, x=x, y=y, **kw)
def PH(x=960, y=540, **kw): return d('phone', x=x, y=y, **kw)
def NEON(text, **kw): return d('neon', text=text, **kw)
def PZ(**kw): return d('puzzle', **kw)
def BARS(items, **kw): return d('bars', items=items, **kw)
def CNT(fr, to, **kw): return d('count', **{'from': fr, 'to': to}, **kw)
def RAIN(ch, **kw): return d('rain', ch=ch, **kw)
def LIGHT(x=960, **kw): return d('light', x=x, **kw)
def BAL(ch, x, y, **kw): return d('balloon', ch=ch, x=x, y=y, **kw)
def CHART(series, **kw): return d('chart', series=series, **kw)

base = json.load(open(os.path.join(HERE, 'plan_base.json')))
scenes = {s['n']: s for s in base['scenes']}
SPEC = {}

def S(n, bg, els, **kw):
    SPEC[n] = dict(bg=bg, els=els, **kw)

def kw_of(n):
    m = re.findall(r'`([^`]+)`', scenes[n]['desc'])
    return ' · '.join(m)

def LIVE(n, ch, label=None, tint=None, **kw):
    lab = label if label is not None else scenes[n]['txt']
    els = [d('live', kw='STOCK: ' + kw_of(n), ch=ch, **({'tint': tint} if tint else {}))]
    # si hay un clip en recursos/stock/escena_027.mp4 (o .mov/.jpg/.png), se usa en lugar del marcador
    for ext in ('mp4', 'mov', 'webm', 'jpg', 'jpeg', 'png'):
        f = os.path.join(ROOT, 'recursos', 'stock', f'escena_{n:03d}.{ext}')
        if os.path.exists(f):
            os.makedirs(os.path.join(ROOT, 'public', 'lujo', 'stock'), exist_ok=True)
            dst = os.path.join(ROOT, 'public', 'lujo', 'stock', os.path.basename(f))
            if os.path.islink(dst) or not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(f):
                if os.path.lexists(dst):
                    os.remove(dst)
                shutil.copy(f, dst)
            els[0]['src'] = f'lujo/stock/{os.path.basename(f)}'
            els[0]['pan'] = 1 if n % 2 else -1
            break
    if lab and lab != '—':
        els.append(T(lab, y=900, size=84))
    S(n, 'black', els, **kw)

TITLE = lambda num, name, at=0: [PZ(active=num, y=380, size=170, at=at), T(f'PIEZA {num}', y=620, size=66, color='goldL'), T(name, y=750, size=130, font='serif')]

# ───────────────────────── SECCIÓN 0 · Gancho ─────────────────────────
S(1, 'black', [LIGHT(at=0.2)], hud=False, cam='still')
S(2, 'shop', [P(x=1560, y=650, s=0.95, hood='#3a3a42', dark='#1a1a1f', anim='fade'), T('SÁBADO', y=150, size=72, font='serif', color='goldL')], cam='push')
S(3, 'shop', [P(x=960, y=660, s=1.45, anim='up')])
S(4, 'shop', [SEL('look', x=1260, y=600, s=1.35, anim='up'), P(x=520, y=720, s=0.85, at=0.0)])
S(5, 'shop', [P(x=960, y=600, s=1.55, anim='none'), d('scan', x=960, y1=980, y2=200, dur=1.3)], cam='up')
S(6, 'shop', [SEL('turn', x=1320, y=620, s=1.05), P(x=600, y=720, s=0.75, anim='none')], cam='pull')
S(7, 'shop', [P(x=860, y=650, s=1.1, flip=True), F('sign', x=1520, y=300, w=440, h=150, text='SALIDA →', size=62)])
S(8, 'shop', [P(x=860, y=650, s=1.1, flip=True, anim='none'), F('sign', x=1520, y=300, w=440, h=150, text='SALIDA →', size=62, anim='none'), E('⏪', x=960, y=200, size=150, anim='zoom')], glitch=0.0, shake=0.05)
S(9, 'dark', [F('paper', x=960, y=470, w=620, h=700, stamp='2014', text='ESTUDIO', size=54), T('UN *ESTUDIO* · 2014', y=930, size=80)])
S(10, 'dark', [E('🛍️', y=440, size=320, anim='fall'), F('ticket', x=1340, y=520, w=260, h=420, text='$$$', size=60, anim='down', at=0.5), T('COMPRAS. *Y PAGAS MÁS.*', y=880, size=100, at=0.3)], shake=0.35)
S(11, 'dark', [F('polaroid', x=960, y=470, w=560, h=420, ch='🏬', rot=-4, anim='pop'), E('📌', x=1190, y=270, size=110, anim='fall', at=0.5), T('VOLVEREMOS AQUÍ', y=900, size=80, color='goldL', at=0.4)])
S(12, 'cream', [P(x=960, y=600, s=1.2, walk=True, anim='left')], cam='panr')
S(13, 'cream', [P(x=700, y=600, s=1.2), BAG(x=1220, y=560, s=0.8), TAG('$2,000', x=1360, y=380, size=72, at=0.4)])
S(14, 'cream', [P(x=700, y=600, s=1.2, hold='📱'), E('📱', x=1220, y=520, size=240), TAG('$1,200', x=1330, y=360, size=72, at=0.3)])
S(15, 'cream', [P(x=560, y=620, s=1.1), H(x=1400, y=560, s=0.9, fade=True, fadeAt=0.5, fadeDur=2.5), T('¿CASA? *JAMÁS.*', y=160, size=100, color='ink', acc='red')])
S(16, 'dark', [CARD('¿CASAS IMPOSIBLES?', '🏠', x=960, y=520, w=640, h=620, size=54, anim='pop'), TAG('$$$', x=1220, y=300, size=60, at=0.5)])
S(17, 'dark', [CARD('CASARSE', '💍', x=680, y=470, w=440, h=480, mark='x', markAt=0.9), CARD('HIJOS', '🍼', x=1240, y=470, w=440, h=480, mark='x', markAt=1.2), T('¿YA NO IMPORTA?', y=900, size=88)])
S(18, 'dark', [P(x=960, y=700, s=1.0), E('🫳', x=960, y=170, size=240, anim='down'), T('¿NOS *MANIPULARON*?', y=950, size=84, at=0.4)])
S(19, 'dark', [T('NO ES *POBREZA*', size=160, acc='white', strike=True, strikeAt=0.7)])
S(20, 'dark', [PZ(y=470, size=200, light=[0.3, 0.55, 0.8, 1.05]), T('FÓRMULA: *4 PIEZAS*', y=820, size=90, at=0.2)], hud=False)
S(21, 'night', [LIGHT(x=1700), *[P(x=260 + k * 260, y=650 + (k % 2) * 20, s=0.6, walk=True, anim='right', at=0.05 * k) for k in range(6)], T('GENERACIÓN Z', y=150, size=80, color='goldL')], cam='panr')
S(22, 'black', [T('LA TRAMPA DE LA', y=120, size=64, font='serif', color='goldL'), T('*POBREZA DE LUJO*', y=210, size=110, font='serif'), P(x=960, y=700, s=0.8), CAGE(mode='drop', y=680, s=0.85, at=0.5)], hud=False, shake=0.85)
S(23, 'dark', [PZ(y=470, size=200, red=4), T('PIEZA 4 = ⚠️', y=820, size=100)], hud=False)
S(24, 'dark', [PH(x=960, y=500, notif='Cargo automático · $9.99', faint=True, anim='up'), T('¿YA LA ESTÁS PAGANDO?', y=990, size=64, at=0.6)])

# ───────────────────────── SECCIÓN 1 · Pieza 1 ─────────────────────────
S(25, 'dark', TITLE(1, 'EL *SIGNIFICADO*'), hud=False)
S(26, 'sepia', [E('🍁', x=760, y=500, size=340), E('📍', x=980, y=380, size=150, anim='fall', at=0.4), T('TORONTO · *1957*', y=880, size=100, font='serif')])
LIVE(27, '🧵', sepia=True)
LIVE(28, '🧶', sepia=True)
LIVE(29, '🥶', tint='linear-gradient(180deg,#c9dbe6,#7d95a6)')
LIVE(30, '🐧', tint='linear-gradient(180deg,#dfeaf1,#9fb6c5)')
S(31, 'dark', [E('🧥', x=760, y=520, size=360), F('ticket', x=1260, y=520, w=380, h=260, anim='right', at=0.4), T('SIN NOMBRE PROPIO', y=920, size=80, at=0.5)])
S(32, 'dark', [F('ticket', x=960, y=470, w=560, h=340), ST('L.L. BEAN', x=850, y=420, size=60, at=0.3, color='gold'), ST('EDDIE BAUER', x=1080, y=540, size=60, at=0.9, rot=6, color='gold'), T('FABRICABA PARA OTROS', y=900, size=80)])
S(33, 'dark', [LIGHT(), T('*CANADA GOOSE*', size=170, font='serif', glow=True)], flash=True)
S(34, 'dark', [E('🧥', x=820, y=540, size=400), TAG('+$1,000', x=1150, y=380, size=84, at=0.3)])
S(35, 'dark', [d('timeline', **{'from': 1957, 'to': 2001}, y=600, dur=1.3), T('DANI REISS · CEO', y=860, size=72, color='goldL', at=1.0)])
S(36, 'dark', [E('🧥', x=700, y=540, size=320), T('→', x=960, y=540, size=160, color='gold', at=0.5), E('👑', x=1240, y=520, size=320, at=0.8, glow='goldL'), T('NO UN ABRIGO: *UN SÍMBOLO*', y=910, size=84, at=0.3)])
LIVE(37, '🌃')
S(38, 'beach', [E('☀️', x=1650, y=190, size=200), E('🌴', x=280, y=520, size=320), E('🧥', x=980, y=640, size=320), T('28 °C 🙃', x=880, y=170, size=110, color='ink')])
S(39, 'dark', [P('scratch', x=700, y=600, s=1.1), E('🧥', x=1260, y=520, size=280), TAG('$1,000', x=1390, y=350, size=62, at=0.3)])
S(40, 'dark', [T('¿DE DÓNDE SALE\nEL *VALOR*?', size=130, font='serif'), E('❓', x=1640, y=230, size=180, at=0.5)])
S(41, 'dark', [E('📦', x=900, y=560, size=260), TAG('$99', x=1050, y=400, size=64, at=0.2), E('🦗', x=1520, y=860, size=90, at=0.8), E('🦗', x=360, y=880, size=70, at=1.1)], cam='still')
S(42, 'sepia', [F('paper', x=720, y=520, w=480, h=640, ch='🎩', chSize=200, text='ADAM SMITH', font='serif', size=48), T('1776', x=1350, y=520, size=160, font='serif', color='goldL', at=0.4)])
S(43, 'dark', [SC('💧', '💎', tilt=0, ll='UTILIDAD 💯', rl='UTILIDAD 0', y=560), T('EL ACERTIJO DEL *AGUA* Y EL *DIAMANTE*', y=120, size=60)])
S(44, 'dark', [SC('💧', '💎', tilt=0, ll='$0.01', rl='', y=560, anim='none'), TAG('CASI GRATIS', x=380, y=230, size=50, at=0.2)])
S(45, 'dark', [SC('💧', '💎', tilt=14, ll='$0.01', rl='$$$$$', y=560, anim='none'), TAG('$$$$$', x=1360, y=220, size=70, at=0.3)], shake=0.9)
S(46, 'dark', [E('💧', x=560, y=500, size=260), E('💎', x=1360, y=500, size=260), E('❓', x=960, y=440, size=200, at=0.3), T('¿POR QUÉ?', y=860, size=140, color='goldL', at=0.2)])
S(47, 'sepia', [F('paper', x=700, y=520, w=480, h=640, ch='📕', chSize=200, text='EL CAPITAL', font='serif', size=48), T('KARL MARX', x=1340, y=470, size=110, font='serif', w=800), T('1867', x=1340, y=610, size=80, color='goldL', at=0.5)])
S(48, 'snow', [P(x=760, y=620, s=1.1), E('🌡️', x=1260, y=540, size=260, at=0.3), T('VALOR DE USO = *LO QUE HACE POR TI*', y=150, size=68, color='ink', acc='red')])
S(49, 'dark', [BARS([{'label': 'IMPORTANCIA', 'to': 0.85, 'color': 'gold'}, {'label': 'VALOR', 'to': 0.85, 'color': 'green'}])])
S(50, 'dark', [SC('🧥', '💵', tilt=0, ll='ABRIGO', rl='$200', y=580), T('VALOR DE CAMBIO = *$200*', y=130, size=80)])
S(51, 'dark', [E('🧥', x=640, size=300, anim='left'), T('⇄', size=220, color='gold', at=0.3), E('👞', x=1280, size=300, anim='right')])
S(52, 'dark', [E('🧥', x=820, y=520, size=360), E('❄️', x=1180, y=330, size=140), M('x', x=1180, y=330, size=190, at=0.6), TAG('$200', x=1220, y=600, size=70, at=0.2), T('LO QUE ALGUIEN PAGUE', y=930, size=76)])
S(53, 'dark', [CARD('USO', '🔥', x=480, y=500, w=380, h=440, anim='none'), CARD('CAMBIO', '💵', x=960, y=500, w=380, h=440, anim='none'), CARD('FUNCIONAL', '⚙️', x=1440, y=500, w=380, h=440, anim='fall', at=0.3)])
S(54, 'dark', [E('🧥', x=600, y=470, size=260), E('🧥', x=1320, y=470, size=200, gray=True), T('VS', y=470, size=150, color='red', at=0.3), M('check', x=600, y=730, size=170, at=1.0), T('MÁS CALOR = *MÁS VALOR*', y=920, size=80)])
S(55, 'dark', [CARD('USO', '🔥', x=480, y=500, w=380, h=440, mark='check', markAt=0.4), CARD('CAMBIO', '💵', x=960, y=500, w=380, h=440, mark='check', markAt=0.7), CARD('FUNCIONAL', '⚙️', x=1440, y=500, w=380, h=440, mark='check', markAt=1.0), T('TODO TIENE LÓGICA', y=920, size=70, at=0.5)])
S(56, 'dark', [CARD('USO', '🔥', x=480, y=500, w=380, h=440, anim='none', out=0.12), CARD('CAMBIO', '💵', x=960, y=500, w=380, h=440, anim='none', out=0.12), CARD('FUNCIONAL', '⚙️', x=1440, y=500, w=380, h=440, anim='none', out=0.12), d('shards', x=960, y=500, at=0.12), E('💥', size=320, at=0.12)], shake=0.12)
S(57, 'dark', [F('paper', x=700, y=520, w=480, h=640, ch='🗼', chSize=200, text='J. BAUDRILLARD', font='serif', size=46), T('AÑOS *70*', x=1340, y=520, size=130, font='serif', w=800, at=0.4)])
S(58, 'dark', [F('dark', x=960, y=540, w=1100, h=720, anim='fade'), E('👗', x=640, y=540, size=220, at=0.3, glow='goldL'), E('👜', x=960, y=540, size=220, at=0.7, glow='goldL'), E('👟', x=1280, y=540, size=220, at=1.1, glow='goldL')])
S(59, 'dark', [E('🧥', x=960, y=580, size=360), TAG('USO', x=640, y=330, size=60, out=0.9), TAG('CAMBIO', x=1160, y=330, size=60, out=1.1), T('USO ✕  CAMBIO ✕', y=940, size=72, color='red', at=0.9)])
S(60, 'dark', [LIGHT(), TAG('VALOR DE SIGNO', x=560, y=540, size=110)])
S(61, 'dark', [SC('💧', '💎', tilt=14, y=600, anim='none'), E('👑', x=1290, y=200, size=130, at=0.5), E('👀', x=1600, y=260, size=110, at=0.8), E('👀', x=1000, y=230, size=90, at=1.0), T('EL DIAMANTE = *UN MENSAJE*', y=960, size=72)])
S(62, 'dark', [E('🧥', x=700, y=520, size=360), CARD('ABRIGA', '🔥', x=1320, y=360, w=460, h=220, size=40, mark='x', markAt=0.6), CARD('LO QUE DICE DE TI', '✨', x=1320, y=680, w=460, h=220, size=36, color='goldL', at=0.9), T('NO ES POR EL FRÍO', y=960, size=68)])
S(63, 'dark', [P(x=960, y=620, s=1.2), E('👀', x=380, y=380, size=120), E('👀', x=1540, y=360, size=120, at=0.2), AR(480, 430, 780, 520, at=0.4, color='goldL'), AR(1440, 420, 1140, 520, at=0.5, color='goldL'), T('ESTATUS', y=150, size=110, color='goldL', font='serif')])
LIVE(64, '⌚')
LIVE(65, '🧳')
LIVE(66, '🏋️')
S(67, 'dark', [SC('🏋️', '🏋️', tilt=0, ll='LUJO', rl='BARRIO', y=580), T('MISMO PESO 😐', y=130, size=80)])
S(68, 'dark', [T('*FUNCIÓN*', y=400, size=150, acc='white', strike=True, strikeAt=0.4), T('*IDENTIDAD*', y=650, size=170, font='serif', at=0.8, glow=True)])
S(69, 'dark', [P(x=620, y=600, s=1.1), F('glass', x=1260, y=540, w=480, h=780, anim='fade'), P(x=1260, y=600, s=1.0, hood='gold', anim='fade', at=0.4), E('✨', x=1260, y=230, size=100, at=0.8)])
S(70, 'dark', [P(x=620, y=600, s=1.1, anim='none'), F('glass', x=1260, y=540, w=480, h=780, anim='none', crack=True), P(x=1260, y=600, s=1.0, hood='gold', anim='none')], shake=0.3)
S(71, 'sepia', [CNT(2026, 1899, size=240, color='goldL', dur=1.2, sep=False), E('⏪', y=220, size=120)])
S(72, 'sepia', [F('paper', x=700, y=520, w=480, h=640, ch='🎩', chSize=200, text='T. VEBLEN', font='serif', size=50), T('1899', x=1340, y=520, size=160, font='serif', color='goldL', at=0.4)])
S(73, 'sepia', [E('🎩', x=560, y=470, size=220), E('💍', x=960, y=500, size=170, at=0.3), E('🐎', x=1360, y=480, size=230, at=0.6), T('"CONSUMO CONSPICUO"', y=860, size=90, font='serif', italic=True)])
S(74, 'black', [T('LA PREGUNTA DE VERDAD…', size=70, color='#8a8590', at=0.4)], hud=False, cam='push')
S(75, 'black', [T('¿POR QUÉ *AHORA*?', size=150, color='red', acc='white')], cam='push')

# ───────────────────────── SECCIÓN 2 · Pieza 2 ─────────────────────────
DOWN = [{'ch': '📺', 'to': -80, 'color': 'greenL', 'at': 0.2}, {'ch': '🧸', 'to': -55, 'color': 'greenL', 'at': 0.45}, {'ch': '💻', 'to': -68, 'color': 'greenL', 'at': 0.7}]
UP = [{'ch': '🍽️', 'to': 105, 'color': 'red', 'at': 0.2}, {'ch': '🏠', 'to': 125, 'color': 'red', 'at': 0.45}, {'ch': '🎓', 'to': 145, 'color': 'red', 'at': 0.7}]
WAGE = {'label': 'SALARIOS', 'to': 60, 'color': '#B8B3BF', 'at': 0.2}
full = lambda ser: [dict(s, at=-1) for s in ser]
S(76, 'grid', TITLE(2, 'LA *RENDICIÓN*'), hud=False)
S(77, 'grid', [CHART([]), T('PRECIOS EN EE. UU. · *20 AÑOS*', y=150, size=72)])
S(78, 'grid', [CHART(DOWN), T('LO QUE *BAJÓ*', y=150, size=72, acc='greenL')])
S(79, 'grid', [CHART(full(DOWN)), T('↓↓↓', y=170, size=150, color='greenL')], cam='still')
S(80, 'grid', [CHART(full(DOWN) + UP), T('LO QUE *SUBIÓ*', y=150, size=72, acc='red')])
S(81, 'grid', [CHART(full(DOWN) + full(UP), marker=0.1), T('+100%', x=1500, y=170, size=140, color='red')], shake=0.1)
S(82, 'grid', [CHART(full(DOWN) + full(UP) + [WAGE], marker=-1), T('Y LOS *SALARIOS*…', y=150, size=72, acc='#B8B3BF')])
S(83, 'grid', [CHART(full(DOWN) + full(UP) + [dict(WAGE, at=-1)], marker=-1), T('¿VES EL PATRÓN?', y=150, size=80)], cam='push')
S(84, 'dark', [T('LO QUE TE ENTRETIENE', x=480, y=330, w=820, size=66, color='greenL'), T('↓', x=480, y=530, size=220, color='greenL', at=0.3), E('📺', x=480, y=820, size=150, at=0.4), T('LO QUE CONSTRUYE UNA VIDA', x=1440, y=330, w=820, size=66, color='red', at=1.2), T('↑', x=1440, y=530, size=220, color='red', at=1.5), E('🏠', x=1440, y=820, size=150, at=1.6)])
LIVE(85, '🏙️')
S(86, 'dark', [P(x=640, y=600, s=1.1, pose='phone', hold='🧮'), CNT(0, 25, x=1320, y=500, size=170, suffix=' AÑOS', dur=2.4), T('¿CUÁNTOS AÑOS?', y=130, size=80)])
S(87, 'dark', [P(x=900, y=620, s=1.3, sweat=True), E('💬', x=1260, y=280, size=180, at=0.4)])
S(88, 'cream', [F('paper', x=960, y=540, w=1400, h=560, nolines=True, text='pobreza de lujo', font='serif', size=96, sub='(s.) Cuando te alcanza lo chico… pero nunca lo grande.', subSize=48)])
LIVE(89, '👛')
LIVE(90, '☕')
LIVE(91, '💅')
S(92, 'dark', [CARD('CHICO', '📦', x=600, y=560, w=380, h=420, mark='check', markAt=0.5), CARD('GRANDE', '🏠', x=1300, y=500, w=560, h=640, mark='x', markAt=0.9)])
S(93, 'night', [BAL('🏠', 640, 380, color='red', hx=960, hy=900), BAL('🍼', 960, 300, color='pink', hx=960, hy=900, at=0.2), BAL('🐷', 1280, 380, color='green', hx=960, hy=900, at=0.4), E('✊', x=960, y=930, size=150)])
S(94, 'night', [BAL('🏠', 640, 380, color='red', hx=960, hy=900, release=0.3), BAL('🍼', 960, 300, color='pink', hx=960, hy=900, release=0.5), BAL('🐷', 1280, 380, color='green', hx=960, hy=900, release=0.7), E('🖐️', x=960, y=930, size=150, anim='none')], cam='up')
S(95, 'dark', [P(x=960, y=640, s=1.35), E('⚙️', x=920, y=330, size=120, spin=90), E('⚙️', x=1020, y=290, size=80, spin=-140)])
S(96, 'cream', [P(x=400, y=520, s=0.85), E('💭', x=1180, y=340, size=320), T('"Si nunca voy a tener casa,\npor lo menos voy a disfrutar ahora"', y=860, size=64, font='serif', italic=True, color='ink', upper=False)])
S(97, 'purple', [NEON('#VIVIRELMOMENTO', size=140, color='pink')], cam='push')
S(98, 'dark', [F('dark', x=960, y=420, w=980, h=500, text='✨ HECHO PARA TI ✨', size=60), P(x=960, y=930, s=0.7)])
S(99, 'dark', [F('dark', x=960, y=420, w=980, h=500, text='✨ HECHO PARA TI ✨', size=60, anim='none'), P(x=960, y=930, s=0.7, anim='none'), ST('PERMISO', y=430, size=170, at=0.15, color='goldL')], shake=0.33)
S(100, 'dark', [F('post', x=560, y=330, w=600, h=200, text='DATE UN GUSTO', size=58, rot=-4, at=0.05), F('post', x=1320, y=560, w=600, h=200, text='TE LO MERECES', size=58, rot=3, at=0.6), F('post', x=760, y=800, w=600, h=200, text='VIVE HOY', size=58, rot=-2, at=1.1)])
LIVE(101, '🏖️')
S(102, 'beach', [E('☀️', x=1650, y=190, size=200), E('💳', x=960, y=560, size=300), E('🫠', x=1220, y=470, size=150, at=0.8), T('"TE LO MERECES"', x=760, y=170, size=84, color='ink')])
S(103, 'black', [T('OPINIÓN *IMPOPULAR*', size=120, acc='red')])
S(104, 'dark', [F('dark', x=960, y=560, w=1400, h=620, anim='fade'), E('🥊', x=520, y=560, size=210, anim='left', rot=20), E('🥊', x=1400, y=560, size=210, anim='right', rot=-20), T('VS', y=560, size=150, color='red', at=0.4)])
S(105, 'dark', [E('🥑', x=660, y=500, size=260), E('☕', x=960, y=540, size=220, at=0.2), E('🥊', x=1260, y=500, size=180, at=0.4), T('BANDO 1: *"ES EL AGUACATE"*', y=900, size=78)])
S(106, 'dark', [F('tv', x=960, y=460, w=760, h=480, text='2017', size=110, sub='TV · AUSTRALIA'), RAIN('👎', n=16, speed=320, size=70)])
S(107, 'dark', [T('☕ × 1000 = 🏠 ?', y=430, size=130), M('x', x=960, y=740, size=220, at=0.9), T('LAS CUENTAS NO DAN', y=960, size=60, color='red', at=1.1)])
S(108, 'dark', [TAG('$$$', x=640, y=500, size=150), E('🥊', x=1360, y=520, size=200, at=0.3), T('BANDO 2: *"SON LOS PRECIOS"*', y=900, size=78)])
S(109, 'dark', [E('🥑', x=600, y=470, size=240, anim='none'), TAG('$$$', x=1130, y=470, size=110, anim='none'), M('x', x=600, y=470, size=320, at=0.15), M('x', x=1320, y=470, size=320, at=0.45)])
S(110, 'black', [T('LOS PRECIOS SON REALES.', y=420, size=92, w=1800), T('*LA RENDICIÓN ES UNA DECISIÓN.*', y=600, size=84, w=1800, at=1.6, glow=True)], hud=False, cam='still')
S(111, 'dark', [P(x=760, y=640, s=1.0), P(x=1300, y=600, s=1.15, hood='#B8B3BF', op=0.35, anim='fade', out=1.5)])
S(112, 'dark', [F('polaroid', x=480, y=480, w=360, h=300, ch='🧓', sub='TU YO FUTURO'), F('polaroid', x=960, y=480, w=360, h=300, ch='👨‍👩‍👧', sub='TU FAMILIA', at=0.3), F('polaroid', x=1440, y=480, w=360, h=300, ch='🏛️', sub='TU LEGADO', at=0.6)], gray=0.9)
S(113, 'dark', [SC('🍭', '⏳', tilt=-14, ll='AHORA', rl='FUTURO', y=600), T('AHORA *>* FUTURO', y=130, size=80, acc='red')])
S(114, 'dark', [E('♟️', x=560, y=620, size=200), E('♟️♟️♟️♟️', x=1300, y=620, size=140, at=0.3), E('🫳', x=1300, y=360, size=200, at=0.5), T('DISCIPLINA vs. *UN RIVAL CON VENTAJA*', y=160, size=64)])
S(115, 'dark', [d('notifs', n=46, dur=2.8)])

# ───────────────────────── SECCIÓN 3 · Pieza 3 ─────────────────────────
S(116, 'dark', [PZ(active=3, y=380, size=170, out=1.5), T('PIEZA 3', y=620, size=66, color='goldL', out=1.5), T('EL *BOMBARDEO*', y=750, size=130, font='serif', out=1.5), CNT(4000, 10000, size=260, at=1.7, dur=2.2), T('ANUNCIOS AL DÍA', y=760, size=70, at=2.0)], hud=False)
S(117, 'dark', [CNT(10000, 10000, size=260, dur=0.1, anim='none'), ST('¿MITO?', size=150, at=0.2)], shake=0.2)
S(118, 'dark', [T('÷ 10', y=360, size=160, color='goldL'), T('*CIENTOS*', y=620, size=220, glow=True, at=0.5)])
S(119, 'night', [P(x=960, y=640, s=1.1, pose='phone', hold='📱'), T('00:00', x=1560, y=200, size=100, color='red'), T('PARA TI. *LITERAL.*', y=960, size=76, at=0.4)])
S(120, 'dark', [PH(x=600, y=520, s=0.85, big='👟', bigSize=220, sub='TÚ'), T('≠', y=520, size=220, color='red', at=0.4), PH(x=1320, y=520, s=0.85, big='🍳', bigSize=220, sub='TU MAMÁ', at=0.3)])
S(121, 'dark', [P(x=960, y=660, s=1.0), E('🔍', x=520, y=330, size=120), T('BÚSQUEDAS', x=520, y=450, size=44), E('👁️', x=1400, y=320, size=120, at=0.4), T('2 SEGUNDOS', x=1400, y=440, size=44, at=0.4), E('🕐', x=1480, y=700, size=110, at=0.8), T('00:47', x=1480, y=810, size=50, at=0.8)])
S(122, 'dark', [P(x=960, y=680, s=1.1), E('🪫', x=900, y=230, size=150, at=0.2), T('5%', x=1080, y=230, size=100, color='red', at=0.3)])
S(123, 'dark', [T('LUJO', x=330 + (k % 4) * 420, y=230 + (k // 4) * 300, size=130, font='serif', color='gold', at=0.05 + k * 0.08, w=500) for k in range(12)])
ITEMS = [('👕', 'PREMIUM'), ('☕', 'DE ESPECIALIDAD'), ('🏢', 'DE LUJO · 30 m²'), ('💧', 'AGUA PREMIUM')]
def items(at0=0.1, anim='pop'):
    out = []
    for k, (ch, lab) in enumerate(ITEMS):
        x = 300 + k * 440
        out += [E(ch, x=x, y=600, size=210, anim=anim, at=-1 if anim == 'none' else at0 + k * 0.35), TAG(lab, x=x - 40, y=380, size=36, anim=anim, at=-1 if anim == 'none' else at0 + 0.15 + k * 0.35)]
    return out
S(124, 'dark', items())
S(125, 'dark', items(anim='none'), cam='still')
S(126, 'dark', items(anim='none') + [T('SI TODO ES LUJO… *¿ALGO LO ES?*', y=900, size=84, at=0.4)], gray=0.1)
S(127, 'dark', [TAG('LUJO', x=640, y=520, size=120, color='#8a8590'), E('🔍', x=1300, y=500, size=280, at=0.3)])
S(128, 'dark', [BARS([{'label': 'CALIDAD', 'from': 0.8, 'to': 0.22, 'color': '#8a8590'}, {'label': 'PERCEPCIÓN', 'from': 0.2, 'to': 0.95, 'color': 'gold'}], dur=1.8)])
S(129, 'dark', [F('glass', x=960, y=540, w=700, h=860, anim='fade'), P('selfie', x=960, y=620, s=1.15, hold='📱'), T('"¿CÓMO ME VEO?"', y=110, size=72, font='serif', italic=True)])
S(130, 'dark', [E('👕', x=620, y=560, size=300), E('👕', x=1300, y=560, size=300), T('★', x=1300, y=540, size=110, color='gold', at=0.6), TAG('$10', x=680, y=280, size=64, at=0.2), TAG('$100', x=1360, y=280, size=80, at=0.9)])
S(131, 'dark', [F('paper', x=680, y=520, w=440, h=580, ch='🗼', chSize=180, text='BAUDRILLARD', font='serif', size=44), E('💸', x=1320, y=520, size=280, at=0.4), T('TE COBRA *EN EFECTIVO*', x=1320, y=850, size=56, w=800, at=0.6)])
S(132, 'dark', [P('handup', x=960, y=640, s=1.2), T('TODAVÍA PUEDES DECIR *"NO"*', y=140, size=80)])
S(133, 'dark', [P(x=960, y=640, s=1.2), E('💤', x=1120, y=300, size=130, at=0.5)], red=4)

# ───────────────────────── SECCIÓN 4 · Pieza 4 ─────────────────────────
S(134, 'dark', [PZ(active=4, y=380, size=170, out=1.6), T('PIEZA 4', y=620, size=66, color='goldL', out=1.6), T('LA *ANESTESIA*', y=750, size=130, font='serif', out=1.6), E('⏱️', y=520, size=280, at=1.8)], hud=False)
SUBS = ['🎵  MÚSICA · $9.99', '🎬  SERIES · $14.99', '☁️  LA NUBE · $2.99', '🏋️  GIMNASIO · $39.99', '📲  ESA APP · $4.99']
S(135, 'dark', [T(s, x=960, y=220 + k * 160, size=64, at=0.1 + k * 0.45, anim='down') for k, s in enumerate(SUBS)])
S(136, 'dark', [T('TU NÚMERO:', y=420, size=100), T('_____ / MES', y=620, size=140, color='goldL', at=0.3)])
S(137, 'dark', [ST('× 12', size=260, color='red', at=0.15)], shake=0.3)
S(138, 'dark', [P(x=760, y=620, s=1.1), E('👛', x=1260, y=600, size=220), E('🩹', x=1300, y=560, size=120, at=0.5), E('😬', x=1520, y=300, size=150, at=0.8)])
S(139, 'dark', [T('RENTAR', y=330, size=110, at=0.1), E('🔒', x=1400, y=330, size=90, at=0.3), T('SUSCRIBIR', y=520, size=110, at=0.55), E('🔒', x=1460, y=520, size=90, at=0.75), T('FINANCIAR', y=710, size=110, at=1.0), E('🔒', x=1460, y=710, size=90, at=1.2)])
S(140, 'dark', [x for k, ch in enumerate(['🚗', '🎵', '🍔', '📱']) for x in (E(ch, x=360 + k * 400, y=480, size=180, at=0.1 + k * 0.25), T('/MES', x=360 + k * 400, y=660, size=60, color='goldL', at=0.2 + k * 0.25, w=400))])
S(141, 'dark', [E('🪙', x=360 + (k % 6) * 240, y=330 + (k // 6) * 220, size=110, at=0.05 + k * 0.07) for k in range(12)] + [T('CUOTA ✓', x=560, y=820, size=80, color='greenL', w=700, at=0.9), T('TOTAL ❓', x=1360, y=820, size=80, color='red', w=700, at=1.2)])
S(142, 'dark', [E('📱', x=760, y=540, size=360), TAG('$1,200 😱', x=1060, y=430, size=100, color='red', ink='#fff')], shake=0.1)
S(143, 'dark', [E('📱', x=760, y=540, size=360, anim='none'), TAG('$50/mes 🙂', x=1060, y=430, size=60, color='green', ink='#fff')])
S(144, 'dark', [T('$50 × 24 = *$1,200*', y=420, size=120), TAG('+ INTERESES', x=760, y=680, size=72, color='red', ink='#fff', at=1.1)])
LIVE(145, '💳')
S(146, 'dark', [E('🛒', x=960, y=440, size=320), T('¼  ¼  ¼  ¼', y=760, size=110, color='goldL', at=0.4), T('¿EL SÚPER?', y=920, size=70, at=1.0)])
S(147, 'dark', [RAIN('💧', n=26, speed=520, size=50), E('🪣', x=960, y=790, size=260)])
S(148, 'dark', [BARS([{'label': 'SUELDO', 'from': 1.0, 'to': 0.12, 'color': 'green'}], dur=3.2, bw=260), RAIN('💧', n=10, speed=400, size=40)])
S(149, 'dark', [PH(x=600, y=520, s=0.9, notif='Cargo automático · $9.99', faint=True, anim='none'), T('*ANESTESIA*', x=1300, y=520, size=130, font='serif', glow=True, w=900, at=0.3)])
S(150, 'black', [T('LA PARTE MÁS *DOLOROSA*', size=70, color='#8a8590', acc='red', at=0.4)], cam='push', hud=False)
LIVE(151, '💼')
S(152, 'dark', [PH(x=960, y=520, big='$0.00', bigSize=110, color='red', sub='SALDO DISPONIBLE')])
S(153, 'dark', [F('mag', x=960, y=520, w=520, h=700, text='FORTUNE', font='serif', size=96, sub='2003')])
S(154, 'dark', [T('H · E · N · R · Y', y=360, size=150, color='goldL', stagger=0.15), T('High Earners, Not Rich Yet', y=560, size=76, font='serif', italic=True, upper=False, at=0.8), T('"Ganan mucho, pero *todavía* no son ricos"', y=720, size=54, upper=False, at=1.6)])
S(155, 'dark', [T('LIBRE', x=1480, y=240, size=96, color='greenL', w=600), T('POBRE', x=440, y=880, size=96, color='red', w=600), AR(560, 820, 1360, 300, color='rgba(255,255,255,0.25)', at=0.1), P(x=960, y=600, s=0.8, at=0.4), T('NI POBRE · NI LIBRE', x=820, y=150, size=56, w=1000, at=0.8)])
S(156, 'dark', [T('*TODAVÍA*', y=420, size=170, font='serif', glow=True), E('🔒', y=720, size=200, at=0.8)])
S(157, 'dark', [P('bags', x=960, y=660, s=1.0), E('🚗', x=740, y=230, size=150, at=0.2), E('🏢', x=960, y=160, size=150, at=0.4), E('🛍️', x=1180, y=230, size=150, at=0.6), E('⛓️', x=1110, y=420, size=110, at=0.8), E('⛓️', x=810, y=420, size=110, at=0.9)])
S(158, 'dark', [F('post', x=740, y=480, w=560, h=600, ch='📸', chSize=200, text='✨ TODO BIEN ✨', size=44, rot=-3), E('🧾', x=1300, y=520, size=280, at=0.6), T('LA FOTO · *LA DEUDA*', y=960, size=70, acc='red')])
S(159, 'dark', [P(x=960, y=700, s=0.9), E('👁️', x=480, y=300, size=130, at=0.2), E('👁️', x=960, y=200, size=130, at=0.4), E('👁️', x=1440, y=300, size=130, at=0.6)])
S(160, 'shop', [F('polaroid', x=960, y=520, w=560, h=420, ch='🏬', rot=-4, anim='zoom'), E('📌', x=1190, y=300, size=100, anim='none')])
S(161, 'red', [E('🌴', x=260, y=560, size=320), E('🌴', x=1660, y=560, size=320), F('dark', x=960, y=600, w=760, h=560, text='BOUTIQUE', font='serif', size=90, sub='✦ RODEO DRIVE ✦'), T('1990', y=150, size=110, font='serif', color='goldL')])
S(162, 'shop', [P(x=640, y=660, s=1.0, walk=True, anim='left'), SEL('frown', x=1200, y=600, s=0.9, arms='cross', at=0.3), SEL('look', x=1540, y=600, s=0.9, arms='cross', at=0.5)])
S(163, 'dark', [F('paper', x=960, y=520, w=1100, h=600, nolines=True, text='WARD & DAHL · 2014', font='serif', size=74, sub='Journal of Consumer Research')])
S(164, 'dark', [F('dark', x=1240, y=560, w=620, h=640, anim='fade'), SEL('look', x=1240, y=580, s=0.75, arms='cross'), P(x=640, y=640, s=0.85), E('📋', x=1700, y=820, size=140, at=0.4), T('EXPERIMENTO', y=130, size=80, color='goldL')])
S(165, 'dark', [F('paper', x=960, y=520, w=1100, h=600, nolines=True, text='WARD & DAHL · 2014', font='serif', size=74, sub='Journal of Consumer Research', anim='none')], cam='push')
S(166, 'dark', [SEL('frown', x=600, y=600, s=0.9, arms='cross'), BARS([{'label': 'DESEO', 'from': 0.2, 'to': 0.95, 'color': 'pink'}], x=1300, y=560, bw=220), T('DESPRECIO → *MÁS DESEO*', y=120, size=68, acc='pink')])
S(167, 'dark', [TAG('+ $', x=800, y=560, size=150), T('↑', x=1360, y=480, size=240, color='red', at=0.3)])
S(168, 'dark', [F('glass', x=960, y=520, w=1100, h=700, anim='fade'), E('👜', x=960, y=440, size=220, glow='goldL', at=0.3), P(x=960, y=820, s=0.85), T('MARCAS ASPIRACIONALES', y=110, size=62)])
S(169, 'dark', [T('*TODAVÍA*', size=190, font='serif', glow=True)], cam='push')
S(170, 'dark', [E('🔒', size=320, glow='goldL')])
S(171, 'dark', [LIGHT(), T('EFECTO\n*PRETTY WOMAN*', size=150, font='serif', glow=True)])
S(172, 'shop', [P('bags', x=960, y=620, s=1.1, hold='🛍️', holdL='🛍️', walk=True), T('PARA *PERTENECER*', y=140, size=84)])
S(173, 'dark', [H(x=1320, y=520, s=0.9, op=0.2, anim='fade'), *[E('🧱', x=620 + (k % 3) * 120, y=820 - (k // 3) * 90, size=110, at=0.1 + k * 0.15) for k in range(5)], T('PROBAR *≠* CONSTRUIR', y=140, size=84, acc='red')])

# ───────────────────────── SECCIÓN 5 · La salida ─────────────────────────
ICONS = ['🏷️', '🏳️', '📢', '💧']
LABS = ['SIGNIFICADO', 'RENDICIÓN', 'BOMBARDEO', 'ANESTESIA']
S(174, 'dark', [PZ(y=460, size=200, done=4, icons=ICONS), T('4 / 4', y=780, size=110, color='goldL', at=0.4)], hud=False)
S(175, 'cream', [BAG(x=760, y=520, s=0.9), H(x=1440, y=560, s=0.55, op=0.6), M('check', x=760, y=860, size=150, at=0.6), M('x', x=1440, y=860, size=150, at=1.0)])
S(176, 'dark', [PZ(y=500, size=230, icons=ICONS, labels=LABS, light=[0.2, 2.3, 99, 99])], hud=False)
S(177, 'dark', [PZ(y=500, size=230, icons=ICONS, labels=LABS, light=[-1, -1, 0.2, 1.6])], hud=False)
S(178, 'black', [T('…MÁS INCÓMODA', size=64, color='#6f6a75', at=0.2), LIGHT(at=2.6, c='rgba(255,230,160,0.18)')], hud=False, cam='push')
S(179, 'black', [LIGHT(), BAG(x=960, y=560, s=1.1)], hud=False)
S(180, 'black', [LIGHT(at=-1), BAG(x=960, y=560, s=1.1, anim='none'), TAG('PAGO INICIAL', x=1080, y=360, size=72, at=0.1)], hud=False)
S(181, 'black', [LIGHT(at=-1), BAG(x=960, y=520, s=1.1, anim='none', house=True), T('…DE UNA VIDA *QUE NO LLEGA*', y=930, size=74, at=0.6)], hud=False)
S(182, 'dark', [P('selfie', x=720, y=620, s=1.1, hold='📱', holdL='👜'), F('post', x=1360, y=500, w=480, h=560, ch='👜', chSize=200, text='VOY BIEN ✨', size=48, at=0.4)])
S(183, 'dark', [P(x=720, y=620, s=1.1, anim='none'), E('🧾', x=1360, y=440, size=260), PH(x=1360, y=760, s=0.35, big='-$', bigSize=200, color='red', at=0.4)], cam='still')
S(184, 'purple', [NEON('LIBERTAD', size=210, color='gold', font='serif')])
S(185, 'dark', [x for k, c in enumerate(['gold', 'pink', 'greenL']) for x in (F('glass', x=480 + k * 480, y=520, w=400, h=640, anim='fade', at=k * 0.2), P(x=480 + k * 480, y=560, s=0.8, hood=c, at=0.2 + k * 0.2))] + [T('EXPRÉSATE', y=960, size=80, color='goldL')])
S(186, 'dark', [F('ticket', x=960, y=540, w=820, h=880, text='LIBERTAD*', font='serif', size=120, sub='*con compra', subSize=50)], cam='pull')
S(187, 'dark', [SC('☀️', '🌙', tilt=14, ll='HOY', rl='MAÑANA', y=600), d('shards', x=1290, y=700, at=1.3)])
S(188, 'green', [T('RIQUEZA = *LIBERTADES*', size=130, font='serif', acc='greenL')], flash=True)
LIVE(189, '🚪', tint='radial-gradient(circle at 60% 30%, #f6e7b0, #2f7f74 75%)')
LIVE(190, '🏔️', tint='radial-gradient(circle at 60% 30%, #cfe7ff, #3b5f7a 75%)')
LIVE(191, '🤝', tint='radial-gradient(circle at 50% 40%, #f3d9b4, #6b4b2e 75%)')
S(192, 'green', [F('post', x=960, y=470, w=560, h=640, ch='🖼️', chSize=180, chOp=0.25), T('NO SALE EN LA FOTO', y=950, size=76)])
S(193, 'green', [LIGHT(c='rgba(255,255,255,0.45)'), T('LA *BUENA* NOTICIA', size=140, acc='goldL')], flash=True)
S(194, 'green', [P(x=500, y=620, s=0.85, hood='#9a948a', label='ABUELOS'), P(x=960, y=620, s=0.9, hood='#c08a5a', label='PAPÁS', at=0.3), P(x=1420, y=620, s=0.95, label='TÚ', at=0.6)])
S(195, 'green', [E('📱', x=960, y=520, size=340, glow='goldL'), E('✨', x=1160, y=320, size=120, at=0.4)])
S(196, 'green', [E('📚', x=480, y=470, size=220), T('APRENDER', x=480, y=730, size=70, w=500), E('🌎', x=960, y=470, size=220, at=0.7), T('VENDER', x=960, y=730, size=70, w=500, at=0.7), E('💻', x=1440, y=470, size=220, at=1.4), T('CREAR', x=1440, y=730, size=70, w=500, at=1.4)])
COUNTER = F('dark', x=960, y=830, w=1600, h=110, anim='none')
S(197, 'green', [P(x=620, y=560, s=1.0), P(x=1320, y=560, s=1.0, hood='greenL', flip=True, at=0.3), COUNTER, T('¿DE QUÉ LADO?', y=130, size=84)])
S(198, 'green', [T('DISEÑA', x=400, y=540, size=84, w=500), AR(600, 540, 760, 540, at=0.5, color='goldL'), T('VENDE', x=960, y=540, size=84, w=500, at=0.7), AR(1160, 540, 1320, 540, at=1.1, color='goldL'), T('GANA', x=1520, y=540, size=96, w=500, color='goldL', at=1.3), E('💰', x=1520, y=340, size=130, at=1.4)])
S(199, 'green', [P(x=1180, y=560, s=1.0, anim='left'), P(x=1420, y=560, s=1.0, hood='greenL', flip=True, anim='none'), COUNTER, T('CONSUMIDOR → *PRODUCTOR*', y=130, size=84, acc='goldL')])
S(200, 'green', [F('paper', x=960, y=440, w=420, h=460, nolines=True, text='90', size=220, sub='DÍAS', subSize=60), T('90 DÍAS · TÚ CONTRA LA TRAMPA', y=860, size=70, color='goldL', at=0.5)])
S(201, 'dark', [E('🚪', x=380, y=520, size=280), P('sit', x=900, y=620, s=1.0), E('💻', x=1200, y=560, size=170, at=0.3), T('MODO ENCIERRO', y=130, size=90, color='goldL')])
CHECK = ['GASTA SOLO LO NECESARIO', 'CANCELA LO QUE NO USAS', 'UNA HABILIDAD NUEVA', 'UNA FUENTE DE INGRESO NUEVA']
S(202, 'dark', [d('check', items=CHECK, pre=0, gap=1.4, at=0.1)])
S(203, 'dark', [d('check', items=CHECK, pre=2, gap=1.6, at=-0.3)], cam='still')
S(204, 'dark', [T('NO ES MAGIA.', size=96, color='#d8d3dc')])
S(205, 'black', [P(x=960, y=660, s=0.8, anim='none'), CAGE(mode='open', y=640, s=0.85)])
S(206, 'green', [LIGHT(x=1260), P(x=720, y=620, s=1.0), P(x=1260, y=600, s=1.1, hood='gold', anim='fade', at=0.3)])
S(207, 'green', [T('*TODAVÍA*', y=380, size=140, acc='white', strike=True, strikeAt=0.5), T('LIBERTAD *FINANCIERA*', y=640, size=130, font='serif', acc='goldL', glow=True, at=1.0), E('🔓', x=1680, y=300, size=150, at=1.4)])
S(208, 'shop', [SEL('look', x=1260, y=600, s=1.1), P(x=620, y=660, s=0.95)])
S(209, 'shop', [SEL('look', x=1260, y=600, s=1.1, anim='none'), P('wave', x=620, y=660, s=0.95, anim='none')])
S(210, 'shop', [P(x=700, y=660, s=0.95, walk=True, anim='right', flip=True), PH(x=1460, y=520, s=0.7, big='+$', bigSize=150, color='greenL', sub='CUENTA LLENA', at=0.4), T('MANOS VACÍAS · *CUENTA LLENA*', y=130, size=72, acc='greenL')])
S(211, 'shop', [SEL('shock', x=960, y=620, s=1.35)], shake=0.05)
S(212, 'dark', [ST('ENORME.', size=210, color='goldL', at=0.1)], shake=0.25)

# ───────────────────────── SECCIÓN 6 · Cierre ─────────────────────────
CLOSET = lambda an: [BAG(x=960, y=460, s=0.85, anim=an), TAG('PAGO INICIAL', x=1060, y=270, size=50, anim=an, at=0.3), E('👗', x=470, y=520, size=160, anim=an, at=0.5), TAG('PAGO INICIAL', x=520, y=370, size=32, anim=an, at=0.6), E('👟', x=1450, y=560, size=160, anim=an, at=0.8), TAG('PAGO INICIAL', x=1500, y=420, size=32, anim=an, at=0.9)]
S(213, 'dark', CLOSET('pop') + [T('¿CUÁNTOS *"PAGOS INICIALES"* HAY EN TU CLÓSET?', y=900, size=64, w=1800, at=0.4)])
S(214, 'dark', [F('post', x=820, y=470, w=980, h=320, ch='💬', chSize=110, text='TE LEO EN LOS COMENTARIOS', size=56), P(x=1520, y=640, s=1.0, mood='happy', at=0.3)])
S(215, 'dark', [P('wave', x=600, y=620, s=1.1), F('mag', x=1300, y=560, w=520, h=150, text='SUSCRÍBETE', size=64, at=0.1)], hud=False)
S(216, 'dark', [P('wave', x=600, y=620, s=1.1, anim='none'), F('mag', x=1300, y=560, w=520, h=150, text='SUSCRÍBETE', size=64, anim='none'), TAG('$0 / MES', x=1420, y=700, size=56, at=0.6)], hud=False, cam='still')

# ───────────────────────── salida ─────────────────────────
missing = [n for n in scenes if n not in SPEC]
assert not missing, f'faltan escenas: {missing}'
SECS = {}
out = []
for n, s in scenes.items():
    m = re.match(r'SECCIÓN (\d)', s['section'])
    sec = int(m.group(1))
    sp = SPEC[n]
    row = dict(n=n, start=s['start'], end=s['end'], sec=sec, mark=s['mark'], sfx=s['sfx'], mus=s['mus'])
    row.update(sp)
    out.append(row)
    SECS.setdefault(sec, s['start'])
plan = dict(duration=base['duration'], audioEnd=base['audioEnd'], hudFrom=scenes[20]['start'], sections=SECS, scenes=out)
dst = os.path.join(ROOT, 'src', 'lujo', 'plan.json')
json.dump(plan, open(dst, 'w'), ensure_ascii=False, indent=1)
print('escenas', len(out), '→', dst)
