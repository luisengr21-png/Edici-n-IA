"""Plan visual escena por escena de «El personaje que fabricas por miedo».

Lee plan_base.json (tiempos reales alineados con la narración) y escribe src/personaje/plan.json.
Cada escena: S(n, fondo, [elementos], **opciones). Coordenadas en un lienzo de 1920×1080.
Uso: python3 scripts/personaje/viz.py
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
def FR(pose='stand', x=1300, y=600, s=1.0, **kw): return d('person', pose=pose, x=x, y=y, s=s, hood='#7FD8C9', skin='#C98E68', **kw)
def SIL(x=960, y=620, s=0.9, **kw): return d('person', pose='stand', x=x, y=y, s=s, hood='#2a3157', dark='#1a1f3a', ghost=False, sil=True, **kw)
def ST(text, x=960, y=540, size=130, **kw): return d('stamp', text=text, x=x, y=y, size=size, **kw)
def M(kind, x=960, y=540, size=260, **kw): return d('mark', kind=kind, x=x, y=y, size=size, **kw)
def AR(x, y, x2, y2, **kw): return d('mark', kind='arrow', x=x, y=y, x2=x2, y2=y2, **kw)
def CARD(text, ch, x=960, y=540, **kw): return d('card', text=text, ch=ch, x=x, y=y, **kw)
def F(kind, x=960, y=540, **kw): return d('frame', kind=kind, x=x, y=y, **kw)
def PH(x=960, y=540, **kw): return d('phone', x=x, y=y, **kw)
def BARS(items, **kw): return d('bars', items=items, **kw)
def RAIN(ch, **kw): return d('rain', ch=ch, **kw)
def LIGHT(x=960, **kw): return d('light', x=x, **kw)
def CHK(items, **kw): return d('check', items=items, **kw)
def TL(fr, to, **kw): return d('timeline', **{'from': fr, 'to': to}, **kw)
# elementos propios de este video
def CLK(x=960, y=540, s=1.0, **kw): return d('clock', x=x, y=y, s=s, **kw)
def MASK(x=960, y=540, s=1.0, **kw): return d('mask', x=x, y=y, s=s, **kw)
def SPOT(x=960, y=900, **kw): return d('spot', x=x, y=y, **kw)
def BEAR(x=960, y=560, s=1.0, **kw): return d('bear', x=x, y=y, s=s, **kw)
def ISL(**kw): return d('island', **kw)
def MET(value, x=960, y=540, color='greenL', **kw): return d('meter', value=value, x=x, y=y, color=color, **kw)
def TH(x=960, y=300, **kw): return d('thought', x=x, y=y, **kw)
def BED(mood='worried', x=960, y=700, s=1.0, **kw): return d('bed', mood=mood, x=x, y=y, s=s, **kw)

base = json.load(open(os.path.join(HERE, 'plan_base.json')))
scenes = {s['n']: s for s in base['scenes']}
SPEC = {}

def S(n, bg, els, **kw):
    SPEC[n] = dict(bg=bg, els=els, **kw)

def kw_of(n):
    m = re.findall(r'`([^`]+)`', scenes[n]['desc'])
    return ' · '.join(m)

def LIVE(n, ch, label=None, **kw):
    lab = label if label is not None else scenes[n]['txt']
    els = [d('live', kw='STOCK: ' + kw_of(n), ch=ch)]
    # el clip de Envato en recursos/stock/escena_NNN.mp4 (o una imagen .jpg de respaldo)
    for ext in ('mp4', 'mov', 'webm', 'jpg', 'jpeg', 'png'):
        f = os.path.join(ROOT, 'recursos', 'stock', f'escena_{n:03d}.{ext}')
        if os.path.exists(f):
            os.makedirs(os.path.join(ROOT, 'public', 'personaje', 'stock'), exist_ok=True)
            dst = os.path.join(ROOT, 'public', 'personaje', 'stock', os.path.basename(f))
            if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(f):
                shutil.copy(f, dst)
            els[0]['src'] = f'personaje/stock/{os.path.basename(f)}'
            els[0]['pan'] = 1 if n % 2 else -1
            break
    if lab and lab != '—':
        els.append(T(lab, y=900, size=84))
    S(n, 'black', els, **kw)

Q = lambda text, **kw: T(f'“{text}”', font='serif', upper=False, **kw)  # cita en serif

# ───────────────────────── SECCIÓN 0 · Gancho ─────────────────────────
S(1, 'black', [CLK(s=1.25, at=0.3)], cam='still')
S(2, 'night', [BED('worried', y=720, s=1.2, phone=True)], cam='push')
S(3, 'night', [BED('worried', y=820, s=0.95, phone=True, anim='none'), TH(x=820, y=330, w=640, h=280, scribble=True, loop=True, at=0.3)])
S(4, 'night', [TH(x=960, y=470, w=1100, h=480, scribble=True, s=1.15, blur=6, blurAt=0.8), T('UNA FRASE', y=900, size=96, color='goldL')], cam='push')
S(5, 'night', [TH(x=820, y=430, w=900, h=420, scribble=True, anim='none', at=0), E('⏱️', x=1560, y=760, size=110, at=0.3), T('2 MINUTOS', x=1560, y=900, size=56, color='greenL', at=0.5)])
S(6, 'night', [P(x=960, y=700, s=1.05, mood='worried', sweat=True), TH(x=420, y=250, w=560, h=200, text='¿Por qué dije eso?', size=44, upper=False, at=0.2), TH(x=1000, y=170, w=560, h=200, text='¿Habrá sonado raro?', size=44, at=1.4), TH(x=1500, y=330, w=620, h=220, text='Seguro piensa que soy rarísimo', size=42, at=2.6)])
S(7, 'dark', [F('dark', x=960, y=440, w=1200, h=300, ch='💬', chSize=120), E('⏪', x=960, y=820, size=150, at=0.3)])
S(8, 'dark', [F('paper', x=960, y=500, w=1100, h=360, nolines=True, text='Dije eso ✗ → Quise decir…', size=60), E('✏️', x=1440, y=620, size=140, at=0.4), T('EDITAR', y=900, size=80, color='goldL', at=0.6)])
S(9, 'night', [PH(x=960, y=540, s=0.95, big='🎉', bigSize=170, sub='¿Vienes hoy?', screen='linear-gradient(180deg,#1d2650,#10152e)')], shake=0.4)
LIVE(10, '📱')
S(11, 'room', [P(x=760, y=640, s=1.05, flip=True, mood='worried'), F('glass', x=1460, y=380, w=360, h=300, ch='🏠🎉', chSize=110)])
S(12, 'dark', [E('❤️', x=960, y=480, size=300, anim='pop'), E('🩹', x=1010, y=430, size=170, at=0.8)])
S(13, 'night', [T('¿TE *SUENA*?', size=170, acc='goldL')])
S(14, 'dark', [E('🤨', x=960, y=420, size=230), T('LO *IRÓNICO*', y=760, size=120, acc='coral')])
S(15, 'night', [ISL(y=720), P(x=960, y=600, s=0.75, mood='worried'), T('MIEDO A ESTAR *SOLO*', y=150, size=84, acc='coral')])
S(16, 'night', [ISL(y=720, walls=0.2), P(x=960, y=600, s=0.75, mood='worried', anim='none'), T('*AISLARSE*', y=150, size=120, acc='coral', at=1.2)], shake=1.5)
S(17, 'party', [P(x=900, y=640, s=0.95, walk=True, anim='left', flip=True, mood='worried'), F('glass', x=1520, y=520, w=300, h=420, ch='🚪', chSize=150), T('*SOLEDAD*', y=140, size=100, acc='greenL', at=0.6)])
S(18, 'dark', [CARD('EXPERIMENTO 1', '👕', x=960, y=520, w=520, h=560, color='gold')])
S(19, 'dark', [CARD('', '👕', x=560, y=520, w=420, h=460, color='gold', anim='none'), CARD('EXPERIMENTO 2', '❤️', x=1300, y=520, w=520, h=560, color='greenL')])
S(20, 'dark', [MET(0.98, x=960, y=500, h=560, over=True, at=0.1, dur=1.0), E('⬆️', x=1300, y=400, size=140, at=0.6)])
S(21, 'dark', [CARD('', '👕', x=760, y=540, w=380, h=440, color='gold', anim='left'), CARD('', '❤️', x=1160, y=540, w=380, h=440, color='greenL', anim='right'), E('🧩', x=960, y=860, size=110, at=0.6)])
S(22, 'night', [P(x=960, y=640, s=1.25, mood='worried'), MASK(x=960, y=380, s=0.62, at=0.3, anim='up')])
S(23, 'night', [P(x=960, y=640, s=1.25, mood='worried', anim='none'), MASK(x=960, y=380, s=0.62, anim='none', tremble=True, tilt=True, tiltTo=-14, tiltAt=0.3)], cam='push')
S(24, 'night', [MASK(x=960, y=330, s=0.8, op=0.35, anim='fade'), T('EL PERSONAJE QUE\n*FABRICAS POR MIEDO*', y=760, size=104, font='serif', acc='goldL', at=0.0, stagger=0.02)], flash=True, shake=0.05)
S(25, 'warm', [MASK(x=960, y=560, s=0.8, anim='zoom'), E('✂️', x=620, y=700, size=140, at=0.3), E('🩹', x=1320, y=430, size=120, at=0.5), T('EL PERSONAJE QUE *FABRICAS POR MIEDO*', y=150, size=72, font='serif', acc='goldL', at=0)])

# ───────────────────────── SECCIÓN 1 · El personaje ─────────────────────────
S(26, 'dark', [E('🌍', x=1100, y=480, size=330), P(x=620, y=640, s=1.0, mood='happy'), E('❤️', x=1300, y=230, size=90, at=0.4), E('❤️', x=880, y=200, size=70, at=0.6), E('❤️', x=1420, y=560, size=80, at=0.8)])
S(27, 'dark', [P(x=520, y=720, s=0.6), P(x=960, y=620, s=0.8, at=0.4, mood='happy'), P(x=1400, y=520, s=1.0, at=0.8, mood='happy', hood='goldL'), T('TU *MEJOR VERSIÓN*', y=130, size=84, acc='goldL', at=1.0)])
S(28, 'dark', [M('check', x=960, y=430, size=360, color='greenL', at=0.1), T('OBJETIVO *NOBLE*', y=800, size=104, acc='greenL', at=0.4)])
S(29, 'dark', [F('glass', x=960, y=480, w=360, h=480, ch='💧', chSize=150), E('🩸', x=960, y=250, size=110, anim='fall', at=0.2), T('*MIEDO*', y=880, size=110, acc='coral', at=0.6)])
S(30, 'party', [P(x=520, y=660, s=1.0, mood='worried'), SIL(x=1150, y=640), SIL(x=1360, y=620, s=0.95), SIL(x=1560, y=650)])
S(31, 'dark', [P('reach', x=560, y=660, s=1.0, mood='worried', sweat=True), F('dark', x=1240, y=560, w=620, h=440, ch='🪨', chSize=210, sub='NATURALIDAD')], shake=0.6)
LIVE(32, '🌬️')
S(33, 'dark', [E('🫁', x=760, y=500, size=300), E('🎵', x=1240, y=460, size=160, spin=40), T('INHALA… *¿EXHALA?*', y=860, size=92, acc='coral', upper=False, at=0.4)])
S(34, 'warm', [P(x=620, y=640, s=1.0, mood='worried'), d('person', pose='stand', x=1240, y=640, s=1.0, hood='#C9A47A', dark='#8B6B45', anim='up', at=0.3), MASK(x=1240, y=420, s=0.42, anim='none', at=0.3), E('🔨', x=900, y=420, size=110, at=0.5)])
S(35, 'warm', [d('person', pose='wave', x=1240, y=640, s=1.0, hood='#C9A47A', dark='#8B6B45'), MASK(x=1240, y=420, s=0.42, anim='none'), P(x=620, y=640, s=1.0), E('😂', x=1240, y=170, size=120, at=0.3)])
S(36, 'warm', [d('person', pose='stand', x=520, y=660, s=0.9, hood='#C9A47A', dark='#8B6B45'), MASK(x=520, y=460, s=0.38, anim='none'), F('post', x=1200, y=440, w=860, h=260, text='¡A MÍ TAMBIÉN ME ENCANTA!', size=58, at=0.2), E('🤥', x=1200, y=760, size=130, at=0.7)])
S(37, 'dark', [E('💣', x=960, y=460, size=300, idle=False), d('mark', kind='arrow', x=760, y=780, x2=900, y2=600, color='#4d8dff', at=0.3), d('mark', kind='arrow', x=1160, y=780, x2=1020, y2=600, color='coral', at=0.5), T('¿CORTO EL *AZUL*?', y=900, size=84, acc='#7fb2ff', at=0.7)], shake=2.0)
S(38, 'warm', [P('reach', x=460, y=660, s=0.95), d('person', pose='stand', x=1460, y=660, s=0.95, hood='#C9A47A', dark='#8B6B45', flip=True), MASK(x=1460, y=460, s=0.36, anim='none'), CARD('CONFIANZA', '🛡️', x=760, y=380, w=300, h=300, size=36, at=0.2), CARD('HUMOR', '😄', x=1080, y=300, w=300, h=300, size=36, at=1.0), CARD('OPINIONES', '💬', x=1000, y=620, w=300, h=300, size=36, at=1.8)])
S(39, 'warm', [d('person', pose='stand', x=1360, y=660, s=1.0, hood='#C9A47A', dark='#8B6B45', flip=True), MASK(x=1360, y=450, s=0.4, anim='none'), P(x=520, y=660, s=1.0, ghost=True, mood='worried'), CARD('PERSONALIDAD', '📦', x=960, y=420, w=460, h=420, size=44, color='coral', anim='right')], gray=0.9)
S(40, 'warm', [d('person', pose='stand', x=960, y=660, s=1.2, hood='#C9A47A', dark='#8B6B45', flip=True), F('paper', x=1420, y=360, w=420, h=200, nolines=True, text='INGREDIENTES', size=46, rot=6, at=0.3)])
S(41, 'dark', [F('glass', x=700, y=480, w=320, h=420, ch='😨', chSize=150, sub='MIEDO'), F('glass', x=1220, y=480, w=320, h=420, ch='🫣', chSize=150, sub='INSEGURIDAD', at=0.5)])
S(42, 'dark', [E('🧠', x=960, y=480, size=320), E('❓', x=1260, y=260, size=140, at=0.4)])
S(43, 'sepia', [E('🧠', x=960, y=470, size=300), E('🦴', x=1180, y=560, size=150, rot=-30, at=0.3), T('MODO *PREHISTORIA*', y=860, size=96, acc='goldL', at=0.5)], shake=0.4)
S(44, 'sepia', [E('🔥', x=760, y=680, size=200), SIL(x=600, y=640, s=0.7), SIL(x=900, y=640, s=0.7), SIL(x=1000, y=640, s=0.7, flip=True), P(x=1600, y=700, s=0.6, mood='worried', at=0.6)], cam='panl')
S(45, 'sepia', [CARD('', '🍖', x=560, y=520, w=320, h=320, mark='x', markAt=0.6), CARD('', '🛡️', x=960, y=520, w=320, h=320, mark='x', markAt=1.0), CARD('', '❤️', x=1360, y=520, w=320, h=320, mark='x', markAt=1.4)])
S(46, 'dark', [T('ACEPTACIÓN', y=360, size=120, color='goldL'), T('=', y=520, size=120), T('SUPERVIVENCIA', y=690, size=120, color='greenL', at=0.5)])
S(47, 'sepia', [E('👣', x=960, y=520, size=420, anim='slam')], shake=0.1)
S(48, 'dark', [F('paper', x=960, y=520, w=900, h=480, text='EISENBERGER · 2003', size=70, sub='Science'), E('🔬', x=1360, y=320, size=110, at=0.4)])
S(49, 'grid', [E('🙂', x=640, y=360, size=150), E('🙂', x=1280, y=360, size=150), P(x=960, y=720, s=0.75), E('⚽', x=960, y=300, size=90, idle=False, at=0.2)])
S(50, 'grid', [E('🙂', x=640, y=360, size=150), E('🙂', x=1280, y=360, size=150), P(x=960, y=720, s=0.75, mood='worried'), d('mark', kind='arrow', x=760, y=330, x2=1160, y2=330, color='goldL', at=0.3), d('mark', kind='arrow', x=1160, y=420, x2=760, y2=420, color='goldL', at=1.0)])
S(51, 'grid', [d('neon', text='GAME OVER', size=170, color='coral', y=480), P(x=960, y=820, s=0.6, mood='worried', anim='none')])
S(52, 'dark', [E('🧠', x=960, y=500, size=360, gray=True), d('scan', x=960, y1=760, y2=260, dur=1.2)])
S(53, 'dark', [E('🧠', x=960, y=440, size=340, glow='coral'), TAG('RECHAZO', x=520, y=330, size=56, color='coral', at=0.4), TAG('DOLOR FÍSICO', x=1260, y=620, size=56, color='coral', at=0.9)], shake=0.4)
S(54, 'coral', [ST('DUELE.', size=230, color='coral')], shake=0.12)
S(55, 'dark', [P(x=960, y=640, s=1.1, mood='worried', hold='🛡️', holdSize=220, pose='reach')])
S(56, 'party', [d('person', pose='stand', x=560, y=660, s=0.9, hood='#C9A47A', dark='#8B6B45', walk=True), MASK(x=560, y=470, s=0.34, anim='none'), SIL(x=1260, y=640, anim='right', at=0.6), SIL(x=1460, y=630, anim='right', at=0.7), SIL(x=1660, y=650, anim='right', at=0.8)])
S(57, 'dark', [E('🔄', x=960, y=440, size=320, spin=90), T('*INSEGURIDAD Y MIEDO*', y=820, size=92, acc='coral', at=0.4)])
S(58, 'dark', [E('🔄', x=960, y=440, size=320, spin=30), T('¿A DÓNDE *REGRESA*?', y=820, size=92, acc='goldL', at=0.3)])
S(59, 'dark', [E('🔁', x=960, y=480, size=340), M('circle', x=960, y=480, size=620, color='coral', at=0.1)])
S(60, 'party', [d('person', pose='wave', x=960, y=640, s=1.0, hood='#C9A47A', dark='#8B6B45'), MASK(x=960, y=440, s=0.4, anim='none'), SIL(x=560, y=650, flip=True), SIL(x=1360, y=650)])
S(61, 'party', [MASK(x=960, y=360, s=0.5, idle=True), SIL(x=700, y=640), SIL(x=1220, y=640, flip=True), E('🤗', x=960, y=640, size=110, at=0.3), P(x=1650, y=700, s=0.75, mood='worried', at=0.6)])
S(62, 'night', [P(x=960, y=640, s=1.6, mood='worried', anim='none')], cam='push')
S(63, 'warm', [LIGHT(x=960), E('💡', x=960, y=480, size=280)])
S(64, 'dark', [F('paper', x=960, y=500, w=900, h=420, nolines=True, ch='💭', chSize=160, stamp='EQUIVOCADA'), T('UNA IDEA…', y=880, size=80, color='goldL', at=0.3)])

# ───────────────────────── SECCIÓN 2 · El reflector ─────────────────────────
LIVE(65, '🏫')
S(66, 'room', [P('reach', x=760, y=640, s=1.0, hold='👕', holdSize=120), d('person', pose='stand', x=1260, y=640, s=1.0, hood='#e8e8ef', dark='#333a55', flip=True, back=True)])
S(67, 'dark', [F('post', x=960, y=500, w=520, h=600, ch='🎤', chSize=200, sub='✨ 💖 ✨'), T('*BARRY MANILOW*', y=920, size=84, acc='pink', at=0.3)])
S(68, 'snow', [F('dark', x=960, y=480, w=360, h=560, ch='🌡️', chSize=220), T('NADA *COOL*', y=900, size=96, color='ink', acc='#2a6fd6', at=0.3)])
S(69, 'room', [P(x=960, y=640, s=1.25, mood='worried', sweat=True), E('👰', x=960, y=640, size=110, at=0.1), E('😳', x=1340, y=300, size=140, at=0.4), d('rain', ch='😂', n=8, size=50, op=0.5)])
S(70, 'room', [P(x=480, y=660, s=0.9, mood='worried', walk=True, anim='left'), SIL(x=1000, y=700, s=0.7), SIL(x=1250, y=700, s=0.7), SIL(x=1500, y=700, s=0.7)])
S(71, 'dark', [T('¿CUÁNTOS *SE FIJARON*?', size=120, acc='goldL'), E('👀', x=960, y=800, size=140, at=0.4)])
S(72, 'dark', [BARS([{'label': 'CREÍAN', 'to': 0.5, 'color': 'coral'}], h=600, x=760), T('50 %', x=1300, y=540, size=170, color='coral', at=1.0)])
S(73, 'dark', [BARS([{'label': 'CREÍAN', 'from': 0.5, 'to': 0.5, 'color': 'coral'}, {'label': 'VERDAD', 'to': 0.1, 'color': 'greenL'}], h=600, dur=3.0)], cam='still')
S(74, 'dark', [BARS([{'label': 'CREÍAN', 'from': 0.5, 'to': 0.5, 'color': 'coral'}, {'label': 'VERDAD', 'from': 0.1, 'to': 0.23, 'color': 'greenL'}], h=600, dur=0.5, x=760), T('~23 %', x=1440, y=700, size=170, color='greenL', at=0.4)], shake=0.4)
S(75, 'night', [SPOT(x=960, y=900, at=0.1), T('EFECTO *REFLECTOR*', y=200, size=110, acc='goldL', at=0.3)])
S(76, 'street', [SPOT(x=900, y=930, follow=120), P(x=900, y=700, s=0.95, walk=True, mood='worried')], cam='panr')
S(77, 'street', [SPOT(x=900, y=930, off=0.6), P(x=900, y=700, s=0.95, mood='worried', anim='none')], cam='still')
S(78, 'street', [SPOT(x=400, y=930, w=320, dim=0.2, lamp=False), SPOT(x=960, y=930, w=320, dim=False, lamp=False, at=0.2), SPOT(x=1520, y=930, w=320, dim=False, lamp=False, at=0.4), SIL(x=400, y=720, s=0.8), P(x=960, y=720, s=0.8), SIL(x=1520, y=720, s=0.8, flip=True)])
S(79, 'night', [BED('worried', y=760, s=0.95, skin='#C98E68', blanket='#3FB8A4'), TH(x=1100, y=300, w=700, h=240, text='¿Habré sonado raro?', size=52, at=0.4)])
S(80, 'dark', [CARD('', '👕', x=560, y=520, w=380, h=420, color='gold', anim='none', op=0.5), CARD('', '❤️', x=1260, y=520, w=520, h=560, color='greenL'), T('EL *SEGUNDO* EXPERIMENTO', y=930, size=72, acc='greenL', at=0.3)])
S(81, 'dark', [F('paper', x=960, y=500, w=980, h=460, text='BOOTHBY Y COLEGAS · 2018', size=60, sub='Psychological Science'), E('🎓', x=1400, y=300, size=110, at=0.4)])
LIVE(82, '☕')
S(83, 'dark', [F('post', x=560, y=520, w=640, h=300, text='¿TE CAYÓ BIEN?', size=58), F('post', x=1360, y=520, w=640, h=300, text='¿LE CAÍSTE BIEN?', size=58, at=1.4)])
S(84, 'dark', [E('🥁', x=960, y=480, size=320, idle=False)], shake=0.2)
S(85, 'dark', [MET(0.3, x=640, y=480, h=520, color='coral', label='LO QUE CREÍAS', labelSize=46), MET(0.8, x=1280, y=480, h=520, color='greenL', label='LO QUE SINTIÓ', labelSize=46, at=0.8)])
S(86, 'dark', [MET(0.3, x=640, y=480, h=520, color='coral', anim='none', **{'from': 0.3}), MET(0.8, x=1280, y=480, h=520, color='greenL', anim='none', **{'from': 0.8}), AR(960, 480, 960, 300, color='goldL', at=0.2), T('BRECHA DE *AGRADO*', y=930, size=96, acc='goldL', at=0.3)])
S(87, 'room', [P(x=740, y=660, s=0.95, mood='happy'), FR(x=1180, y=660, s=0.95, flip=True), F('paper', x=1560, y=330, w=300, h=260, nolines=True, ch='🗓️', chSize=130), T('MESES *DESPUÉS*', y=130, size=76, acc='greenL', at=0.4)])
S(88, 'dark', [CARD('', '👕', x=760, y=540, w=380, h=440, color='gold', anim='left'), CARD('', '❤️', x=1160, y=540, w=380, h=440, color='greenL', anim='right')])
S(89, 'night', [SPOT(x=960, y=820, off=0.4, dim=0.3), E('🔦', x=960, y=480, size=200, gray=True, at=0.2), T('1 · NADIE *TE VIGILA*', y=880, size=84, acc='goldL', at=0.3)])
S(90, 'dark', [E('❤️', x=960, y=440, size=260, glow='coral'), T('2 · LES CAES *MEJOR*', y=820, size=84, acc='greenL', at=0.3)])
S(91, 'night', [BED('worried', y=820, s=0.9), E('🥊', x=700, y=280, size=130, at=0.2), E('👻', x=1200, y=230, size=130, at=0.4), E('👻', x=1450, y=360, size=100, at=0.6)], shake=0.8)
S(92, 'stage', [E('🎭', x=960, y=360, size=200), F('dark', x=960, y=760, w=1400, h=200, ch='🪑🪑🪑🪑🪑🪑', chSize=90)])
S(93, 'dark', [T('NO DEJES QUE TU IMAGINACIÓN\n*INVENTE PROBLEMAS*', size=96, font='serif', acc='goldL')])
S(94, 'coral', [E('⚠️', x=960, y=480, size=330)], shake=0.2)
S(95, 'dark', [E('🁢', x=600, y=540, size=160), E('🁢', x=800, y=540, size=160, at=0.2, rot=20), E('🁢', x=1000, y=540, size=160, at=0.35, rot=45), E('🁢', x=1200, y=560, size=160, at=0.5, rot=80)])

# ───────────────────────── SECCIÓN 3 · La trampa del esfuerzo ─────────────────────────
S(96, 'cream', [E('🫵', x=960, y=440, size=280), T('HAZ ESTO *CONMIGO*', y=820, size=96, color='ink', acc='#c0662a', at=0.3)])
S(97, 'cream', [BEAR(x=960, y=440, s=0.75, op=0.9), M('x', x=960, y=440, size=480, color='coral', at=0.2), d('count', **{'from': 5, 'to': 0}, x=960, y=900, size=120, dur=4.5, color='ink', at=0.3)], cam='still')
S(98, 'cream', [T('¿…?', size=260, color='ink')], cam='still')
LIVE(99, '🐻‍❄️')
S(100, 'dark', [E('🎩', x=960, y=480, size=300), M('x', x=960, y=480, size=380, at=0.3)])
S(101, 'dark', [F('paper', x=960, y=500, w=980, h=460, text='DANIEL WEGNER · 1987', size=64, sub='Journal of Personality and Social Psychology', subSize=28), E('🧪', x=1400, y=300, size=110, at=0.4)])
S(102, 'cream', [P('reach', x=560, y=640, s=1.0, mood='worried', sweat=True), F('dark', x=1180, y=560, w=220, h=520, text='', ch='🚪', chSize=150), BEAR(x=1460, y=520, s=0.6, peek=True, anim='right', at=0.3), T('PROCESOS *IRÓNICOS*', y=130, size=84, color='ink', acc='#c0662a', at=0.5)])
S(103, 'dark', [E('🧠', x=960, y=520, size=420, op=0.5), E('👮', x=820, y=520, size=150, at=0.2), E('🔦', x=1000, y=480, size=110, at=0.3), T('EL *VIGILANTE*', y=920, size=84, acc='goldL', at=0.4)])
S(104, 'cream', [BEAR(x=620, y=520, s=0.6), AR(860, 520, 1100, 520, color='#c0662a', at=0.3), E('💬', x=1320, y=520, size=260, at=0.6)])
S(105, 'room', [P(x=960, y=640, s=1.0, mood='worried', walk=True), E('🏺', x=640, y=800, size=110, rot=70, at=0.6), E('🪴', x=1300, y=800, size=110, rot=-70, at=0.9)], shake=0.9)
S(106, 'room', [P('reach', x=960, y=640, s=1.0, mood='worried', sweat=True, hold='📄'), E('📄', x=760, y=860, size=90, rot=30, at=0.4), E('📄', x=1180, y=880, size=90, rot=-40, at=0.6)])
S(107, 'dark', [E('🍀', x=960, y=480, size=300), M('x', x=960, y=480, size=380, at=0.3)])
S(108, 'cream', [P(x=760, y=640, s=1.0, mood='worried'), BEAR(x=1220, y=560, s=0.75, wave=True, anim='right', at=0.2)])
S(109, 'party', [P(x=760, y=640, s=1.0, mood='worried', rot=0), FR(x=1240, y=640, s=1.0, flip=True), E('🤖', x=760, y=250, size=130, at=0.3)])
S(110, 'party', [P(x=760, y=640, s=1.0, mood='happy'), FR(x=1240, y=640, s=1.0, flip=True), E('😅', x=760, y=250, size=110, at=1.0), T('+1 SEG', y=140, size=80, color='coral', at=0.6)])
S(111, 'party', [P(x=760, y=640, s=1.0, mood='worried'), FR(x=1240, y=640, s=1.0, flip=True), F('post', x=760, y=230, w=580, h=170, text='¿Y… de dónde eres? 🔁', size=44, at=0.2)])
S(112, 'party', [P(x=760, y=640, s=1.0, mood='worried', anim='none'), FR(x=1240, y=640, s=1.0, flip=True, anim='none'), E('🦗', x=980, y=860, size=110, at=0.4)], cam='still')
LIVE(113, '👟')
S(114, 'cream', [P(x=960, y=600, s=1.0, mood='worried', rot=0, anim='none'), E('🪜', x=960, y=760, size=260, at=0), E('💥', x=1130, y=860, size=140, at=0.9)], shake=1.0)
S(115, 'dark', [F('paper', x=960, y=500, w=900, h=420, text='ANSIEDAD SOCIAL', size=70, sub='Alden y colegas'), E('📊', x=1360, y=300, size=110, at=0.4)])
S(116, 'dark', [CARD('ENSAYAR', '📝', x=520, y=520, w=360, h=380, size=40, at=0.2), CARD('EVITAR LA MIRADA', '🙈', x=960, y=520, w=360, h=380, size=34, at=0.8), CARD('VIGILARTE', '🔍', x=1400, y=520, w=360, h=380, size=40, at=1.4)])
S(117, 'snow', [P(x=760, y=640, s=1.0, mood='worried'), FR(x=1240, y=640, s=1.0, flip=True, mood='worried'), E('🥶', x=1000, y=230, size=130, at=0.3), T('*FRÍO*', y=120, size=80, color='ink', acc='#2a6fd6', at=0.5)])
S(118, 'warm', [P(x=760, y=640, s=1.0, mood='happy'), FR(x=1240, y=640, s=1.0, flip=True, mood='happy'), E('🛡️', x=700, y=860, size=110, rot=80, at=0.3)])
S(119, 'warm', [MET(0.9, x=960, y=480, h=560, color='greenL', over=True), E('⬆️', x=1260, y=340, size=130, at=0.6)])
S(120, 'dark', [T('PROTEGERTE\n*TE ALEJA*', size=130, font='serif', acc='coral')])
S(121, 'warm', [LIGHT(x=960), P('hips', x=960, y=640, s=1.1, mood='happy')])
S(122, 'warm', [T('TRANQUILA', y=330, size=110, color='goldL'), T('SEGURA', y=520, size=110, color='greenL', at=0.6), T('CÓMODA', y=710, size=110, color='cream', at=1.2)])
S(123, 'warm', [P(x=960, y=640, s=1.0, mood='happy'), SIL(x=520, y=660, s=0.85), SIL(x=1400, y=660, s=0.85, flip=True), M('circle', x=960, y=560, size=820, color='goldL', at=0.3), E('😊', x=520, y=330, size=90, at=0.8), E('😊', x=1400, y=330, size=90, at=1.0)])
S(124, 'dark', [T('¿QUÉ *SÍ* FUNCIONA?', size=140, acc='goldL')])
S(125, 'sepia', [E('🏛️', x=420, y=480, size=180), E('🖋️', x=1500, y=480, size=180, at=0.5), AR(620, 480, 1300, 480, color='goldL', at=0.3), T('SIGLO V a. C. · · · 1841', y=800, size=72, color='goldL', upper=False, at=0.6)])

# ───────────────────────── SECCIÓN 4 · Las dos frases ─────────────────────────
LIVE(126, '🏛️')
S(127, 'sepia', [E('🏛️', x=960, y=360, size=260), Q('Conócete a ti mismo', y=760, size=110, color='goldL', at=0.4)])
S(128, 'sepia', [ST('DATO CURIOSO', size=110, color='goldL')], shake=0.1)
LIVE(129, '🏛️')
S(130, 'sepia', [E('⏩', x=960, y=380, size=200), T('1841', y=720, size=200, color='goldL', at=0.3)])
LIVE(131, '🕯️')
S(132, 'sepia', [F('paper', x=960, y=480, w=1100, h=420, nolines=True, text='“CONFÍA EN TI MISMO”', size=80, font='serif'), E('🖋️', x=1420, y=720, size=120, at=0.4)])
S(133, 'cream', [CARD('CONÓCETE', '🔍', x=640, y=520, w=440, h=440, color='gold', ink='#14183a', bg='#fff'), CARD('CONFÍA', '🤝', x=1280, y=520, w=440, h=440, color='greenL', ink='#14183a', bg='#fff', at=0.5)])
S(134, 'cream', [E('🔒', x=960, y=480, size=280), E('🔑', x=700, y=480, size=200, anim='left', at=0.2), E('🔓', x=960, y=480, size=280, at=1.2)])
S(135, 'warm', [P(x=960, y=600, s=1.0, mood='happy'), E('🔍', x=600, y=360, size=130, at=0.2), E('🤝', x=1320, y=360, size=130, at=0.4), T('*TÚ MISMO*', y=900, size=110, font='serif', acc='goldL', at=0.6)])
S(136, 'dark', [E('🎲', x=860, y=480, size=200), E('🎲', x=1080, y=520, size=200, rot=30), M('x', x=960, y=500, size=420, at=0.4)])
S(137, 'cream', [P(x=960, y=880, s=0.7, mood='happy'), CARD('', '💬', x=700, y=520, w=240, h=240, at=0.2), CARD('', '🤝', x=960, y=460, w=240, h=240, at=0.4), CARD('', '🌹', x=1220, y=520, w=240, h=240, at=0.6)])
S(138, 'cream', [E('💬', x=600, y=480, size=170), E('🤝', x=960, y=480, size=170, at=0.3), E('🌹', x=1320, y=480, size=170, at=0.6), M('circle', x=960, y=480, size=1100, color='#c0662a', at=0.9)])
S(139, 'cream', [P(x=960, y=640, s=1.0), E('🪞', x=560, y=420, size=150, at=0.2), E('⚖️', x=1360, y=380, size=150, at=0.5), E('🔓', x=1360, y=720, size=130, at=0.8)])
S(140, 'night', [E('🤫', x=960, y=480, size=320)])
S(141, 'warm', [P(x=960, y=640, s=1.05, hold='📚', holdL='🎒', mood='happy')])
S(142, 'warm', [P(x=960, y=640, s=1.2, mood='happy'), E('🕶️', x=960, y=420, size=120, at=0.3), T('TU FORMA *DE VER*', y=130, size=84, acc='goldL', at=0.5)])
S(143, 'dark', [E('🎸', x=520, y=420, size=150), E('🌮', x=820, y=620, size=150, at=0.2), E('🦖', x=1100, y=400, size=150, at=0.4), E('📼', x=1400, y=620, size=150, at=0.6)])
S(144, 'dark', [E('☝️', x=960, y=440, size=320, glow='goldL'), T('*ÚNICA*', y=820, size=140, acc='goldL', at=0.4)])
S(145, 'warm', [P('reach', x=760, y=640, s=1.0, mood='happy'), F('ticket', x=1260, y=640, w=360, h=260, ch='📦', chSize=150), MASK(x=1260, y=420, s=0.35, anim='fall', at=0.2)])
S(146, 'amber', [F('post', x=960, y=500, w=1100, h=520, ch='🌅', chSize=200, text='SÉ TÚ MISMO ✨', size=80), E('😇', x=1440, y=240, size=110, at=0.4)])
S(147, 'dark', [P('shrug', x=960, y=640, s=1.15, mood='worried'), E('🤷', x=1300, y=280, size=130, at=0.3)])
S(148, 'dark', [F('post', x=960, y=460, w=960, h=240, text='“ASÍ SOY YO, ACÉPTAME”', size=58), ST('EXCUSA', x=1240, y=640, size=110, color='coral', at=0.8)])
S(149, 'cream', [M('x', x=600, y=480, size=300), E('🌱', x=1200, y=520, size=260, at=0.5)])
S(150, 'stage', [LIGHT(x=960), P(x=960, y=640, s=1.1, mood='happy'), MASK(x=1300, y=820, s=0.4, rot=-20, anim='fall', at=0.3), T('DEJAR *DE ACTUAR*', y=130, size=92, acc='goldL', at=0.5)])
S(151, 'warm', [P(x=520, y=720, s=0.65), P(x=960, y=620, s=0.85, at=0.3), P(x=1400, y=520, s=1.05, at=0.6, mood='happy'), E('🧭', x=1400, y=180, size=110, at=0.8), T('DESDE *TI*', y=940, size=80, acc='goldL', at=0.9)])
S(152, 'dark', [E('🪤', x=960, y=480, size=300), T('OTRA *TRAMPA*', y=840, size=100, acc='coral', at=0.3)])
S(153, 'dark', [P(x=620, y=640, s=0.95, hold='🎧'), M('x', x=620, y=560, size=400, at=0.5), P(x=1280, y=640, s=0.95, mood='happy', at=0.8), FR(x=1600, y=640, s=0.85, flip=True, at=0.9)])
S(154, 'dark', [F('post', x=520, y=520, w=640, h=260, text='¿CÓMO ME VEO?', size=54), AR(880, 520, 1060, 520, color='goldL', at=0.5), F('post', x=1420, y=520, w=640, h=260, text='¿CÓMO ESTÁ EL OTRO?', size=50, at=0.7)])
S(155, 'dark', [F('paper', x=960, y=500, w=900, h=420, text='HARVARD · 2017', size=74, sub='Huang y colegas'), E('🎓', x=1360, y=300, size=110, at=0.4)])
LIVE(156, '🍽️')
S(157, 'dark', [F('post', x=960, y=500, w=1000, h=260, text='¿Y LUEGO QUÉ PASÓ?', size=70), E('👂', x=1420, y=760, size=130, at=0.4)])
S(158, 'warm', [MET(0.95, x=960, y=480, h=560, color='greenL', over=True), E('⏫', x=1260, y=340, size=130, at=0.6)])
S(159, 'dark', [CARD('INGENIOSOS', '🃏', x=640, y=520, w=420, h=440, mark='x', markAt=0.6, color='coral'), CARD('CURIOSOS', '🔍', x=1280, y=520, w=420, h=440, mark='check', markAt=1.2, color='greenL', at=0.4), E('🏆', x=1280, y=220, size=120, at=1.4)])
S(160, 'dark', [E('🧩', x=860, y=500, size=220), E('🧩', x=1080, y=500, size=220, rot=90, anim='right', at=0.3)])
S(161, 'night', [SPOT(x=1240, y=900, dim=0.35), P(x=720, y=640, s=1.0, mood='happy'), FR(x=1240, y=640, s=1.0, flip=True, mood='happy')])
S(162, 'warm', [F('polaroid', x=960, y=480, w=560, h=480, ch='🧑‍🤝‍🧑', chSize=220, rot=-4), E('📸', x=1380, y=260, size=120, at=0.3)], flash=True)

# ───────────────────────── SECCIÓN 5 · Para qué socializamos ─────────────────────────
S(163, 'warm', [T('¿PARA QUÉ\n*SOCIALIZAMOS*?', size=140, acc='goldL')])
S(164, 'cream', [F('paper', x=960, y=480, w=720, h=520, ch='📝', chSize=140, text='7/10', size=120), M('x', x=1240, y=300, size=200, at=0.6)])
S(165, 'warm', [CARD('APRENDER', '📚', x=380, y=540, w=330, h=360, size=38, at=0.2), CARD('ENSEÑAR', '🧑‍🏫', x=760, y=540, w=330, h=360, size=38, at=0.5), CARD('CONECTAR', '🤝', x=1140, y=540, w=330, h=360, size=38, at=0.8), CARD('DIVERTIRTE', '🎉', x=1520, y=540, w=330, h=360, size=36, at=1.1)])
S(166, 'warm', [CARD('', '🤝', x=960, y=440, w=420, h=420, color='greenL', mark='check', markAt=0.3), T('*ÉXITO*', y=840, size=110, acc='greenL', at=0.5)])
S(167, 'warm', [P('shrug', x=960, y=640, s=1.1, mood='happy')])
S(168, 'cream', [E('🪴', x=760, y=480, size=240), E('💬', x=1160, y=480, size=240, at=0.3), T('VIDA *PROPIA*', y=840, size=110, color='ink', acc='#2e8f7f', at=0.5)])
LIVE(169, '🏦')
LIVE(170, '👴👵')
S(171, 'mint', [E('🌊', x=700, y=520, size=240), E('🪨', x=1240, y=560, size=200, idle=False)], cam='panr')
S(172, 'warm', [P('reach', x=960, y=640, s=1.05, mood='happy'), E('🎮', x=1180, y=860, size=110, rot=40, anim='fall', at=0.3), M('x', x=1180, y=860, size=200, at=0.8)])
S(173, 'night', [E('🌀', x=960, y=440, size=320, spin=60), T('LA IDEA *MÁS PROFUNDA*', y=840, size=92, acc='goldL', at=0.4)], cam='push')
S(174, 'dark', [P(x=960, y=640, s=1.1, mood='worried'), E('🪞', x=960, y=400, size=140, at=0.3), SIL(x=520, y=660, s=0.8), SIL(x=1400, y=660, s=0.8, flip=True)])
S(175, 'dark', [P(x=960, y=660, s=1.05, mood='worried'), E('🌧️', x=960, y=260, size=200, at=0.2), T('“SOY UN *DESASTRE*”', y=130, size=72, acc='coral', upper=False, at=0.6)])
S(176, 'dark', [PH(x=760, y=540, s=0.85, big='✓✓', bigSize=120, color='#58a6ff', sub='Visto'), F('post', x=1380, y=520, w=640, h=240, text='“ALGO ESTÁ MAL CONMIGO”', size=46, at=0.6)])
S(177, 'dark', [MET(0.5, x=960, y=480, h=520, color='goldL', icon='⭐', label='VALOR', at=0.1, dur=0.4), E('📉', x=1300, y=340, size=120, at=0.5), E('📈', x=620, y=340, size=120, at=1.0)], shake=0.6)
S(178, 'warm', [E('🔄', x=960, y=440, size=300, spin=180), T('AL *REVÉS*', y=820, size=120, acc='goldL', at=0.3)])
S(179, 'warm', [P('reach', x=480, y=660, s=0.9, mood='happy'), F('post', x=1000, y=380, w=380, h=200, ch='💬', chSize=110, stamp='😊', at=0.2), F('post', x=1440, y=620, w=380, h=200, ch='💬', chSize=110, stamp='😊', at=0.6)])
S(180, 'warm', [E('😄', x=560, y=500, size=200), E('🔍', x=960, y=500, size=200, at=0.3), E('🤫', x=1360, y=500, size=200, at=0.6)])
S(181, 'party', [d('rain', ch='🎊', n=26, size=60), T('*VIBRANTE*', size=170, acc='goldL', glow=True, at=0.3)])
S(182, 'warm', [LIGHT(x=960), P('sit', x=960, y=640, s=1.1, mood='happy'), T('ES.', y=150, size=110, font='serif', color='goldL', at=0.6)])
S(183, 'warm', [P('wave', x=760, y=640, s=1.0), FR('wave', x=1160, y=640, s=1.0, flip=True), P(x=1500, y=660, s=0.9, hood='#FF8FB1', skin='#E8B79A', mood='happy')])
S(184, 'warm', [LIGHT(x=960, c='rgba(255,208,138,0.45)'), P(x=960, y=640, s=1.2, mood='happy'), M('circle', x=960, y=560, size=700, color='goldL', at=0.2)])
S(185, 'warm', [T('HONESTA', y=330, size=110, color='goldL'), T('AUTÉNTICA', y=520, size=110, color='greenL', at=0.6), T('CONTAGIOSA', y=710, size=110, color='pink', at=1.2)])
S(186, 'warm', [P(x=760, y=640, s=1.05, mood='happy'), FR(x=1160, y=640, s=1.05, flip=True, mood='happy')])
S(187, 'amber', [P(x=960, y=640, s=1.3, mood='happy', op=0.95)], flash=True)

# ───────────────────────── SECCIÓN 6 · La salida ─────────────────────────
S(188, 'night', [BED('worried', y=720, s=1.15)], cam='push')
S(189, 'black', [CLK(s=1.25, at=0.1)], cam='still')
S(190, 'dark', [CARD('', '1', x=560, y=520, w=320, h=320, anim='pop', color='gold'), CARD('', '2', x=960, y=520, w=320, h=320, at=0.2, color='gold'), CARD('', '3', x=1360, y=520, w=320, h=320, at=0.4, color='gold'), T('TRES *COSAS*', y=860, size=90, acc='goldL', at=0.5)])
S(191, 'dark', [CARD('', '🔦', x=560, y=520, w=320, h=320, anim='none', mark='x', markAt=0.6), CARD('', '', x=960, y=520, w=320, h=320, anim='none', op=0.4), CARD('', '', x=1360, y=520, w=320, h=320, anim='none', op=0.4)])
S(192, 'dark', [CARD('', '🔦', x=560, y=520, w=320, h=320, anim='none', mark='x', markAt=-1), CARD('', '❤️', x=960, y=520, w=320, h=320, color='greenL'), CARD('', '', x=1360, y=520, w=320, h=320, anim='none', op=0.4)])
S(193, 'dark', [CARD('', '🔦', x=560, y=520, w=320, h=320, anim='none', mark='x', markAt=-1), CARD('', '❤️', x=960, y=520, w=320, h=320, color='greenL', anim='none'), CARD('', '🐻‍❄️', x=1360, y=520, w=320, h=320, color='cream')])
S(194, 'dark', [F('post', x=960, y=500, w=820, h=260, ch='💬', chSize=120, rot=-3), BEAR(x=1260, y=420, s=0.55, peek=True, anim='up', at=0.6)], shake=1.2)
S(195, 'cream', [BEAR(x=960, y=520, s=1.1, wink=True, winkAt=0.4)])
S(196, 'night', [ISL(y=720, wallsUp=True), P(x=960, y=600, s=0.75, mood='worried')])
S(197, 'night', [ISL(y=720, wallsUp=True), P(x=960, y=600, s=0.75, mood='worried', anim='none')], cam='push')
S(198, 'night', [ISL(y=720, wallsUp=True, crack=0.2), P(x=960, y=600, s=0.75, anim='none'), T('LA *SALIDA*', y=140, size=110, acc='goldL', at=0.5)], shake=0.2)
S(199, 'warm', [P(x=700, y=640, s=1.1, mood='happy'), d('person', pose='stand', x=1220, y=640, s=1.1, flip=True, mood='happy', op=0.75), F('glass', x=1220, y=560, w=420, h=640, op=0.35), E('🙌', x=960, y=380, size=120, at=0.6), T('CAERTE BIEN *A TI*', y=950, size=84, acc='goldL', at=0.8)])
S(200, 'warm', [P('sit', x=960, y=640, s=1.1, mood='happy', hold='📖'), E('☕', x=1260, y=720, size=110, at=0.3)])
S(201, 'warm', [d('scale', left='👥', right='🙂', tilt=-14, ll='LO QUE PIENSAN', rl='LO QUE PIENSAS', y=520)])
S(202, 'warm', [P(x=960, y=640, s=1.0, mood='happy'), FR(x=560, y=660, s=0.9, anim='right', at=0.3, mood='happy'), P(x=1380, y=660, s=0.9, hood='#FF8FB1', skin='#E8B79A', mood='happy', anim='left', at=0.5, flip=True)])
S(203, 'dark', [ST('EL RETO', size=150, color='goldL')])
CH = ['NO ENSAYES', 'UNA PREGUNTA DE SEGUIMIENTO', 'EL REFLECTOR ESTÁ APAGADO']
S(204, 'dark', [CHK(CH, pre=0, gap=99, at=0.1, x=960, y=540, size=58)])
S(205, 'dark', [CHK(CH, pre=1, gap=99, at=-0.3, x=960, y=540, size=58)], cam='still')
S(206, 'dark', [CHK(CH, pre=2, gap=0.5, at=-0.3, x=960, y=540, size=58), SPOT(x=1500, y=980, w=300, off=1.4, dim=False, lamp=False)], cam='still')
S(207, 'night', [BED('worried', y=780, s=1.0), TH(x=1000, y=290, w=560, h=230, scribble=True, at=0.3)])
S(208, 'night', [BED('happy', y=780, s=1.0, anim='none'), TH(x=1000, y=290, w=560, h=230, scribble=True, anim='none', at=0, release=0.3)])
S(209, 'night', [F('dark', x=960, y=760, w=600, h=120), MASK(x=960, y=560, s=0.7, anim='fade')])
S(210, 'night', [MASK(x=960, y=520, s=0.95, anim='none')], cam='push')
S(211, 'night', [BED('sleep', y=780, s=1.0), MASK(x=1460, y=400, s=0.45, sleep=True, at=0.2)], cam='still')

# ───────────────────────── SECCIÓN 7 · Cierre ─────────────────────────
S(212, 'warm', [P('wave', x=620, y=640, s=1.0, mood='happy'), E('✈️', x=1260, y=460, size=180, anim='right', at=0.2), T('*COMPÁRTELO*', x=1260, y=760, size=84, acc='goldL', at=0.5)])
S(213, 'warm', [P('wave', x=600, y=620, s=1.1), F('mag', x=1300, y=560, w=520, h=150, text='SUSCRÍBETE', size=64, at=0.1)])
S(214, 'warm', [P('wave', x=600, y=620, s=1.1, anim='none'), F('mag', x=1300, y=560, w=520, h=150, text='SUSCRÍBETE', size=64, anim='none'), CLK(x=1300, y=820, s=0.4, at=0.3), E('😉', x=1580, y=820, size=90, at=0.8)], cam='still')

# ── regla del canal: el mismo texto o número no puede aparecer dos veces en la misma escena ──
def textos(el):
    for key in ('text', 'll', 'rl', 'sub', 'label', 'big', 'txt', 'time'):
        v_ = el.get(key)
        if isinstance(v_, str) and v_.strip():
            yield v_
    for it in el.get('items', []) or []:
        if isinstance(it, dict) and it.get('label'):
            yield it['label']
        elif isinstance(it, str):
            yield it
def clave(s_):
    s_ = re.sub(r'[*"«»“”¿?¡!.,:;…·✕✓☑]', ' ', s_.lower())
    return ' '.join(s_.split())
def repetidos(n_, sp):
    vistos, rep = {}, []
    for el in sp['els']:
        if el.get('out') is not None:
            continue
        claves = set()
        for tx in textos(el):
            k = clave(tx)
            if k:
                claves.add(k)
            for num in re.findall(r'[$+~]?\d[\d,.]*\s?%?', tx):
                claves.add('#' + num.strip().strip('.,~'))
        for k in claves:
            if k in vistos:
                rep.append(k.lstrip('#'))
            vistos[k] = True
    return rep
REPETIDOS = {n_: r for n_, sp in SPEC.items() if (r := repetidos(n_, sp))}
if REPETIDOS and os.environ.get('PERMITIR_REPETIDOS') != '1':
    raise SystemExit('Texto repetido en la misma escena (regla del canal): ' + '; '.join(f'escena {k}: {v_}' for k, v_ in sorted(REPETIDOS.items())))

missing = [n for n in scenes if n not in SPEC]
assert not missing, f'faltan escenas: {missing}'
extra = [n for n in SPEC if n not in scenes]
assert not extra, f'escenas de más: {extra}'
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
plan = dict(duration=base['duration'], audioEnd=base['audioEnd'], sections=SECS, scenes=out)
dst = os.path.join(ROOT, 'src', 'personaje', 'plan.json')
json.dump(plan, open(dst, 'w'), ensure_ascii=False, indent=1)
print('escenas', len(out), '→', dst)
