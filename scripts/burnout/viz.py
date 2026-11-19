"""Plan visual escena por escena de «No es pereza, es burnout».

Lee plan_base.json (tiempos reales alineados con la narración) y escribe src/burnout/plan.json.
Cada escena: S(n, fondo, [elementos], **opciones). Coordenadas en un lienzo de 1920×1080.
Recursos de Envato: public/burnout/{stock,fotos,3d,graficos,fuentes}.
Uso: python3 scripts/burnout/viz.py
"""
import json, os, re, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(os.path.dirname(HERE))

def d(k, **kw):
    kw['k'] = k
    return kw

def T(text, y=540, size=104, **kw): return d('txt', text=text, y=y, size=size, **kw)
def TT(text, y=540, size=150, **kw):  # fuente de Envato (su Ñ no se lee bien: esos textos van en Montserrat)
    return d('txt', text=text, y=y, size=size, font='title' if 'Ñ' not in text.upper() else None, **kw)
def Q(text, y=540, size=110, **kw): return d('txt', text=text, y=y, size=size, font='serif', upper=False, **kw)
def E(ch, x=960, y=540, size=200, **kw): return d('emo', ch=ch, x=x, y=y, size=size, **kw)
def P(pose='stand', x=960, y=620, s=1.0, **kw): return d('person', pose=pose, x=x, y=y, s=s, **kw)
def FR(pose='stand', x=1300, y=620, s=1.0, **kw): return d('person', pose=pose, x=x, y=y, s=s, hood='#7FD8C9', skin='#C98E68', **kw)
def ST(text, x=960, y=540, size=130, **kw): return d('stamp', text=text, x=x, y=y, size=size, **kw)
def M(kind, x=960, y=540, size=260, **kw): return d('mark', kind=kind, x=x, y=y, size=size, **kw)
def AR(x, y, x2, y2, **kw): return d('mark', kind='arrow', x=x, y=y, x2=x2, y2=y2, **kw)
def CARD(text, ch, x=960, y=540, **kw): return d('card', text=text, ch=ch, x=x, y=y, **kw)
def F(kind, x=960, y=540, **kw): return d('frame', kind=kind, x=x, y=y, **kw)
def TH(x=960, y=300, **kw): return d('thought', x=x, y=y, **kw)
def BED(mood='tired', x=960, y=740, s=1.0, **kw): return d('bed', mood=mood, x=x, y=y, s=s, **kw)
def CHK(items, **kw): return d('check', items=items, **kw)
def NOTIFS(texts, **kw): return d('notifs', texts=texts, n=len(texts), **kw)
# Envato: 3D, fotos, íconos, overlays
def D3(name, x=960, y=540, w=760, **kw): return d('img', src=f'burnout/3d/3d_{name}.png', x=x, y=y, w=w, **kw)
def IMG(src, x=960, y=540, w=760, **kw): return d('img', src=src, x=x, y=y, w=w, **kw)
def ICON(name, x=960, y=540, w=200, **kw): return d('icon', name=name, x=x, y=y, w=w, **kw)
def BRASAS(op=0.85, **kw): return d('overlay', src='burnout/graficos/overlay_brasas.webm', len=20, op=op, **kw)
def NIEBLA(op=0.75, **kw): return d('overlay', src='burnout/graficos/overlay_niebla.webm', len=10, op=op, **kw)
def FOG(**kw): return d('fog', **kw)
def EMB(**kw): return d('embers', **kw)
# elementos de este video
def BAT(to, x=960, y=540, w=420, frm=None, **kw):
    e = d('battery', to=to, x=x, y=y, w=w, **kw)
    if frm is not None: e['from'] = frm
    return e
def CANDLE(x=960, y=560, **kw): return d('candle', x=x, y=y, **kw)
def LAB(text='FLOJO', x=960, y=540, size=90, **kw): return d('label', text=text, x=x, y=y, size=size, **kw)
def ENV(x=960, y=480, size=1.8, **kw): return d('envelope', x=x, y=y, size=size, **kw)
def STAIRS(**kw): return d('stairs', **kw)
def BOMB(x=960, y=560, **kw): return d('bomb', x=x, y=y, **kw)
def HG(x=960, y=480, **kw): return d('hourglass', x=x, y=y, **kw)
def CHAT(msgs, x=960, y=540, **kw): return d('chat', msgs=msgs, x=x, y=y, **kw)
def LINE(pts, **kw): return d('line', pts=pts, **kw)
def RADAR(x=960, y=480, **kw): return d('radar', x=x, y=y, **kw)
def CRACK(x=960, y=540, size=300, **kw): return d('crack', x=x, y=y, size=size, **kw)
def PLUG(x, y, x2, y2, **kw): return d('plug', x=x, y=y, x2=x2, y2=y2, **kw)
def GAUGE(x=960, y=540, frm=None, **kw):
    e = d('gauge', x=x, y=y, **kw)
    if frm is not None: e['from'] = frm
    return e
def PROP(kind, x=960, y=700, **kw): return d('prop', kind=kind, x=x, y=y, **kw)
def STUDY(text, x=960, y=540, **kw): return d('study', text=text, x=x, y=y, **kw)
def VLINE(x=960, **kw): return d('vline', x=x, **kw)
def MASK(x=960, y=540, s=1.0, **kw): return d('mask', x=x, y=y, s=s, **kw)
def SIGNAL(n):  # tarjeta de cada señal: el número aparece una sola vez
    return [EMB(n=30), T(f'SEÑAL *{n}*', y=520, size=230, acc='gold', glow=True)]  # Montserrat: la Ñ de Rhino Rough no se lee bien

PHONE_SCREEN = [0.33, 0.1, 0.30, 0.80, 0]

base = json.load(open(os.path.join(HERE, 'plan_base.json')))
scenes = {s['n']: s for s in base['scenes']}
SPEC = {}

def S(n, bg, els, **kw):
    SPEC[n] = dict(bg=bg, els=els, **kw)

def LIVE(n, label=None, **kw):
    """Clip de Envato en recursos/stock/escena_NNN.mp4 (o, si falta, la imagen de IA escena_NNN.jpg)."""
    lab = label if label is not None else scenes[n]['txt']
    els = [d('live', kw='')]
    for ext in ('mp4', 'mov', 'webm', 'jpg', 'jpeg', 'png'):
        f = os.path.join(ROOT, 'recursos', 'stock', f'escena_{n:03d}.{ext}')
        if os.path.exists(f):
            dst_dir = os.path.join(ROOT, 'public', 'burnout', 'stock')
            os.makedirs(dst_dir, exist_ok=True)
            dst = os.path.join(dst_dir, os.path.basename(f))
            if not os.path.exists(dst) or os.path.getmtime(dst) < os.path.getmtime(f):
                shutil.copy(f, dst)
            els[0]['src'] = f'burnout/stock/{os.path.basename(f)}'
            els[0]['pan'] = 1 if n % 2 else -1
            break
    else:
        FALTAN.append(n)
    els[0].update(kw.pop('live', {}))
    if lab and lab != '—':
        els.append(TT(lab, y=920, size=96, color='cream'))
    S(n, 'black', els + kw.pop('extra', []), paper=0.15, **kw)

def FOTO(n, num, label=None, extra=None, **kw):
    """Foto de Envato (recursos/fotos/foto_NNN.jpg) a pantalla completa con Ken Burns."""
    els = [d('live', src=f'burnout/fotos/foto_{num:03d}.jpg', pan=1 if n % 2 else -1, **kw.pop('live', {}))]
    if label:
        els.append(label)
    S(n, 'black', els + (extra or []), paper=0.15, **kw)

FALTAN = []

# ───────────────────────── SECCIÓN 0 · Gancho ─────────────────────────
S(1, 'afternoon', [BED('tired', x=820, y=780, s=1.1, blanket='#3b5bdb'), E('🕓', x=380, y=240, size=150, idle=False)], cam='push')
S(2, 'afternoon', [BED('tired', x=820, y=780, s=1.1, blanket='#3b5bdb', anim='none'), NOTIFS(['3 correos nuevos', 'Mensaje sin leer', 'Recordatorio: pagar la luz', '¿Ya lo hiciste?', 'Llamada perdida', 'La tarea vence hoy', 'Te estamos esperando', '¿Sigues ahí?'], at=0.2, dur=4.5)])
S(3, 'afternoon', [BED('tired', x=1240, y=930, s=2.0, blanket='#3b5bdb', anim='none', slowBlink=True)], cam='still')
S(4, 'afternoon', [BED('tired', x=820, y=780, s=1.1, blanket='#3b5bdb', anim='none'), LAB('FLOJO', x=820, y=770, size=96, at=3.7)], shake=3.95, sfxAt=3.75)
S(5, 'afternoon', [BED('worried', x=820, y=780, s=1.1, blanket='#3b5bdb', anim='none'), LAB('FLOJO', x=820, y=770, size=96, anim='none', peel=0.5, wobble=0.2), TT('¿EQUIVOCADA?', y=170, size=120, color='goldL', at=0.6)])
S(6, 'slate', [ENV(x=960, y=470, size=1.8, lock=False, float=8), TT('UNA PREGUNTA', y=860, size=120, color='cream', at=0.6)])
S(7, 'slate', [ENV(x=960, y=470, size=1.8, mx=780, my=-400, mAt=3.8, mDur=0.9, out=4.4)], env=True)
S(8, 'black', [BRASAS(op=0.6), D3('cerillo', x=960, y=600, w=900, flames=[[0.53 + k * 0.055, 0.37 + k * 0.02, 0.75] for k in range(7)], fireAt=0.25, fireOut=2.4, char=2.3), TT('BURNOUT', y=170, size=190, color='gold', glow=True, at=2.72)], flash=True, env=True)
S(9, 'ember', [BRASAS(), EMB(), TT('SÍNDROME DE\n*ESTAR QUEMADO*', size=130, acc='gold')], env=True)
S(10, 'slate', [BAT(0.08, x=480, y=470, frm=0.85, dur=2.0), BAT(0.08, x=960, y=470, frm=0.85, lAt=0.5, dur=2.0), BAT(0.08, x=1440, y=470, frm=0.85, lAt=0.7, dur=2.0), T('EMOCIONAL', x=480, y=720, size=64), T('FÍSICO', x=960, y=720, size=64, at=0.3), T('MENTAL', x=1440, y=720, size=64, at=0.5)], env=True)
S(11, 'dark', [D3('manometro', x=960, y=500, w=760, shake=3, glow='red', pulse=4), TT('ESTRÉS', y=950, size=120, color='red', at=0.8)], env=True, shake=2.5)
S(12, 'slate', [d('row', n=7, y=360, gap=30), E('🔍', x=260, y=430, size=220, mx=1400, mAt=0.0, mDur=1.0, anim='none')], env=True)
S(13, 'slate', [IMG('burnout/graficos/mapa.jpg', x=960, y=600, w=1800, h=760, pos='center 75%', op=0.22, anim='fade'), STUDY('ENCUESTA · EE. UU.', y=540, w=900, size=70, ch='📋')], env=True)
S(14, 'slate', [d('row', n=4, y=230, tint=3, at=0.3, step=0.45), T('*3* DE CADA *4*', y=880, size=130, acc='gold', at=0.4)], env=True)
S(15, 'slate', [T('+40 % *GRAVES*', y=380, size=130, acc='red'), d('pct', to=0.42, redAt=0.4, x=960, y=640, w=1300, vAt=0.4)], env=True)
S(16, 'room', [PROP('sofa', x=480, y=760, s=0.7), P('sit', x=460, y=600, s=0.8, mood='tired', anim='none'), PROP('sofa', x=1440, y=760, s=0.7), P('sit', x=1420, y=600, s=0.8, mood='tired', anim='none'), VLINE(x=960), T('¿PEREZA?', x=480, y=170, size=90, color='ash'), T('¿BURNOUT?', x=1440, y=170, size=90, color='gold', at=0.5)], env=True)
LIVE(17, env=True)
S(18, 'ember', [BRASAS(op=0.7), TT('NO ES *PEREZA*,\nES *BURNOUT*', size=170, acc='gold', glow=True, stagger=0.05)], flash=True, shake=0.05, hud=0)

# ───────────────────────── SECCIÓN 1 · Señales 1 y 2 ─────────────────────────
S(19, 'ember', SIGNAL(1), cam='push')
S(20, 'slate', [P(x=760, y=620, s=1.1, mood='blank', gray=0.6), PLUG(790, 560, 1160, 930, offAt=0.7), TT('DESCONECTADO', y=150, size=110, color='ash', at=0.8)])
S(21, 'dark', [D3('cabina', x=960, y=580, w=950, tilt3d=True, glow='blue', pulse=2), TT('PILOTO *AUTOMÁTICO*', y=140, size=110, acc='blue')])
S(22, 'slate', [d('orbit', chs=['⏰', '💼', '🛏️'], r=280, size=160, speed=70)])
S(23, 'slate', [d('calendar', x=960, y=540, blur=7)], cam='push')
LIVE(24)
S(25, 'slate', [d('stack', n=14, gap=0.28), TT('TODOS LOS *DÍAS*', y=150, size=120, acc='gold', at=0.2)])
S(26, 'black', [d('ash', text='DESPERSONALIZACIÓN', size=140, at=1.4, ashAt=2.4)], hud=1, sfxAt=1.45, silAt=1.4)
FOTO(27, 27, label=TT('ENTUMECIMIENTO', y=930, size=110, color='cream', at=0.8), extra=[FOG(op=0.35)], live={'tintc': 'rgba(120,140,170,0.5)'})
S(28, 'dark', [P(x=960, y=620, s=1.35, ghost=True, mood='blank')], cam='still')
S(29, 'cinema', [P(x=960, y=420, s=0.85, mood='blank', anim='fade'), PROP('seats', x=960, y=980), P(x=960, y=900, s=0.55, back=True, anim='none')])
S(30, 'cinema', [F('ticket', x=960, y=520, w=760, h=380, ch='🎟️', chSize=170, crack=True)])
S(31, 'room', [F('glass', x=1260, y=500, w=480, h=680), P(x=1260, y=610, s=0.95, flip=True, gray=1, blur=6, op=0.7, anim='fade'), P(x=600, y=640, s=1.05, mood='worried')])
S(32, 'slate', [CHK(['', '', '', ''], pre=-1, gap=99, x=820), E('🤷', x=1400, y=540, size=220, at=0.8)])
S(33, 'dark', [P('bags', x=960, y=660, s=1.15, mood='tired'), E('⚓', x=1130, y=470, size=240, at=0.3, anim='fall'), TT('IMPOTENCIA', y=140, size=120, color='ash', at=0.6)], shake=0.55)
S(34, 'slate', [d('wheel', x=960, y=520, spinAt=0.6)])
S(35, 'red', [ST('NO ES FLOJERA', size=150, at=0.8)], shake=0.95, sfxAt=0.85)
S(36, 'warm', [PROP('sofa', x=960, y=780, s=1.0, c='#2A9D8F'), FR('sit', x=940, y=600, s=1.0, mood='happy', anim='none'), E('🍿', x=1180, y=560, size=130, at=0.3)])
S(37, 'slate', [HG(x=960, y=470, flip=True, flipAt=0.5), TT('TU *PASADO*', y=930, size=120, acc='gold', at=0.8)])
S(38, 'ember', SIGNAL(2), cam='push')
S(39, 'warm', [F('polaroid', x=960, y=500, w=640, h=560, rot=-3), P('handup', x=960, y=480, s=0.8, mood='happy', anim='pop'), E('🏁', x=1150, y=330, size=110, at=0.4), TT('ANTES', y=950, size=110, color='goldL', at=0.5)])
S(40, 'slate', [d('hl', x=960, y=560, w=1300, h=90, at=0.6), T('LA DIFERENCIA *CLAVE*', y=540, size=110, acc='gold')])
S(41, 'slate', [LINE([[0, 0.22], [1, 0.22]], color='ash', dur=2.2), T('“PEREZA” = *SIEMPRE IGUAL*', y=160, size=88, acc='ash', upper=False)])
S(42, 'slate', [LINE([[0, 0.22], [1, 0.22]], color='ash', at=0, dur=0.01, ticks=[0.1, 0.3, 0.5, 0.7, 0.9]), E('😐', x=1660, y=560, size=120, at=0.4)])
S(43, 'warm', [P('handup', x=760, y=640, s=1.1, mood='happy'), E('🏅', x=760, y=560, size=90, at=0.3, idle=False), E('🏆', x=1260, y=520, size=260, at=0.5, glow='gold')])
S(44, 'slate', [E('🎯', x=960, y=470, size=320, idle=False), AR(240, 470, 860, 470, color='gold', at=0.2), T('METAS', y=880, size=110, color='gold', at=0.5)])
S(45, 'slate', [LINE([[0, 0.78], [0.3, 0.82], [0.55, 0.8], [0.62, 0.84], [0.72, 0.2], [1, 0.12]], color='gold', at=0.1, dur=2.6)])
S(46, 'slate', [P(x=760, y=640, s=1.1, mood='worried'), LAB('FLOJO', x=760, y=610, size=62, anim='none', cross=1.0), E('🤔', x=1300, y=420, size=150, at=1.6)])
LIVE(47, label='TE QUEMASTE')
S(48, 'ember', [BRASAS(op=0.9), EMB(n=24), Q('Nadie se quema sin haber\nestado *encendido*', size=104, acc='gold', glow=True, stagger=0.06)])
S(49, 'dark', [P(x=960, y=680, s=1.1, mood='tired'), d('bulb', x=960, y=260, size=170, offAt=3.2)])
S(50, 'slate', [GAUGE(x=620, y=560, frm=0.5, to=0.0, dur=1.4), CARD('CARÁCTER', '🧱', x=1300, y=500, w=420, h=460, color='ash', mark='x', markAt=2.0), T('SIN *COMBUSTIBLE*', y=950, size=96, acc='red', at=0.6)])

# ───────────────────────── SECCIÓN 2 · Señales 3 y 4 ─────────────────────────
S(51, 'ember', SIGNAL(3), cam='push')
S(52, 'warm', [P(x=960, y=660, s=1.1, mood='happy'), E('✨', x=960, y=600, size=120, glow='gold', at=0.3), TT('PASIÓN', y=150, size=130, color='gold', at=0.5)])
ICONOS = ['play_volley', 'listening_to_music_1', 'read', 'paint', 'cycling', 'photo']
S(53, 'slate', [ICON(nm, x=360 + k * 240, y=540 + (k % 2) * 60 - 30, w=170, at=0.3 + k * 0.6, idle=True) for k, nm in enumerate(ICONOS)])
S(54, 'slate', [ICON(nm, x=360 + k * 240, y=540 + (k % 2) * 60 - 30, w=170, anim='none', gray=1, grayAt=0.3 + k * 0.55) for k, nm in enumerate(ICONOS)])
S(55, 'red', [E('⚠️', x=960, y=520, size=320, blink=9, idle=False)], shake=0.3)
S(56, 'warm', [P(x=700, y=650, s=1.1, mood='angry'), E('🏆', x=1260, y=520, size=280, idle=False), CRACK(x=1260, y=500, size=300, at=1.2), TT('RESENTIMIENTO', y=140, size=110, color='red', at=0.6)])
FOTO(57, 57, live={'tintc': 'rgba(40,30,20,0.6)'})
LIVE(58)
S(59, 'dark', [CANDLE(x=640, y=520, never=True), CANDLE(x=1280, y=520, outAt=3.6), T('NUNCA ENCENDIDA', x=640, y=880, size=58, color='ash'), T('APAGÁNDOSE', x=1280, y=880, size=58, color='gold', at=0.8)])
S(60, 'ember', SIGNAL(4), cam='push')
S(61, 'slate', [P(x=960, y=680, s=1.1, mood='angry'), E('⛈️', x=960, y=250, size=210, at=0.3), TT('IRRITABLE', y=960, size=110, color='red', at=0.5)])
S(62, 'slate', [NOTIFS(['¿Ya llegaste?', 'Responde', 'Hay junta', '¡Urgente!', 'Otra vez tú'], at=0, dur=1.4), P(x=960, y=680, s=1.1, mood='angry', anim='none'), E('😤', x=1560, y=300, size=150, at=0.7)], shake=0.4)
S(63, 'slate', [CHAT([{'text': '¿Ya está lo que te pedí?'}, {'text': '¡NO! ¡DÉJAME EN PAZ!', 'me': True, 'at': 0.8}], x=960, y=540, w=900, delAt=2.2, shakeMe=True, **{'del': 1})])
S(64, 'dark', [D3('velocimetro', x=960, y=540, w=800, shake=5, glow='red', pulse=7)], shake=0.6)
S(65, 'dark', [BOMB(x=960, y=500), TT('MECHA *CORTA*', y=940, size=120, acc='red', at=1.2)])
S(66, 'slate', [E('📱', x=480, y=260, size=140), E('🔊', x=960, y=230, size=140, at=0.5), E('❓', x=1440, y=260, size=140, at=1.0), BOMB(x=960, y=640, boom=3.0)], shake=3.0)
S(67, 'slate', [CARD('SEÑAL DE AGOTAMIENTO', '🪫', x=960, y=540, w=700, h=600, size=54)])
S(68, 'slate', [LAB('MAL CARÁCTER', x=900, y=480, size=96, anim='pop', tilt=-4), ST('ERROR', x=1200, y=680, size=120, at=1.1)])
S(69, 'slate', [P(x=960, y=690, s=1.1, mood='tired'), E('⛈️', x=960, y=260, size=220, out=3.2), E('🌬️', x=640, y=380, size=120, at=1.4, out=4.2), E('🌤️', x=960, y=260, size=170, at=3.6)])
S(70, 'green', [PROP('hammock', x=960, y=640), FR('sit', x=960, y=520, s=0.9, mood='happy', anim='none'), E('😌', x=1460, y=240, size=140, at=0.6)])
S(71, 'slate', [PROP('hammock', x=480, y=660, s=0.55), FR('sit', x=480, y=590, s=0.55, mood='happy', anim='none'), VLINE(x=960), P(x=1440, y=690, s=0.9, mood='angry'), E('⛈️', x=1440, y=290, size=170, at=0.3)])
S(72, 'dark', [BAT(0.06, x=960, y=520, w=560, blink=True), MASK(x=960, y=500, s=1.05, at=1.0, anim='down'), T('“NO TENGO GANAS”', y=900, size=90, color='cream', upper=False, at=1.6)])

# ───────────────────────── SECCIÓN 3 · Señal 5 ─────────────────────────
S(73, 'ember', SIGNAL(5), cam='push')
S(74, 'room', [P(x=760, y=650, s=1.1, mood='tired', dim=0.85), E('🥀', x=1280, y=660, size=220, at=0.4), TT('AUTOCUIDADO', y=150, size=120, color='ash', at=0.5)])
S(75, 'slate', [E('🚨', x=960, y=520, size=320, glow='amber', idle=False)], cam='push')
S(76, 'slate', [E('🕰️', x=960, y=520, size=320, spin=-420, idle=False)])
FOTO(77, 77)
S(78, 'slate', [E('🕛', x=640, y=460, size=260, spin=900, idle=False), E('🕒', x=1280, y=460, size=260, idle=False, at=0.4), T('12 H', x=640, y=820, size=96, color='gold'), T('0 H', x=1280, y=820, size=96, color='red', at=0.4)])
S(79, 'room', [F('glass', x=1260, y=500, w=480, h=680), P(x=1260, y=610, s=0.95, flip=True, mood='tired', blur=2, op=0.8, anim='fade'), P(x=600, y=640, s=1.05, mood='tired')])
S(80, 'slate', [CHAT([{'text': '¿Vienes el sábado?'}, {'text': '¿Sigues vivo? 😅', 'at': 0.5}, {'text': 'Te extrañamos', 'at': 0.9}], x=960, y=540, w=820, title='Amigos 🎉', muted=True, unread=47, unreadFrom=3)])
LIVE(81, live={'zoom': 2.0, 'origin': '52% 100%', 'filter': 'brightness(1.7) contrast(1.05)'})  # recorte: solo manos y celular, sin rostro
S(82, 'slate', [CHK(['BAÑARSE', 'CONTESTAR', 'COCINAR'], pre=-1, gap=99, x=820, size=70)] + [E('🪨', x=1360, y=404 + k * 136, size=110, at=0.6 + k * 0.4, anim='fall', idle=False) for k in range(3)])
S(83, 'black', [D3('celular', x=860, y=540, w=900, glow='red', pulse=5, screen=PHONE_SCREEN, battery={'to': 0.03, 'blink': True}), T('3 %', x=1520, y=540, size=220, color='red', at=0.5)], cam='push')
S(84, 'slate', [E('📢', x=520, y=520, size=280, rot=-12, idle=False), D3('celular', x=1360, y=540, w=640, shake=6, screen=PHONE_SCREEN, battery={'to': 0.03, 'blink': True}, at=0.1), TT('¡ÉCHALE GANAS!', x=800, y=170, size=120, color='gold', at=0.3)], shake=0.4)
S(85, 'slate', [BAT(0.03, x=960, y=520, w=640, blink=True)])
S(86, 'slate', [CARD('VOLUNTAD', '💪', x=640, y=540, w=460, h=500, color='green', mark='check', markAt=0.6), CARD('CARGA', '🪫', x=1280, y=540, w=460, h=500, color='red', mark='x', markAt=1.8, at=1.2)])
S(87, 'slate', [E('☝️', x=960, y=520, size=300, idle=False), M('x', x=960, y=520, size=440, at=0.6)])
S(88, 'red', [ST('EL PEOR CONSEJO', size=140, at=2.5)], shake=2.65, sfxAt=2.55)
S(89, 'slate', [E('🫗', x=820, y=430, size=260, rot=20, idle=False), E('🫙', x=1150, y=680, size=170, idle=False, at=0.3)])
S(90, 'slate', [P('bags', x=880, y=660, s=1.1, mood='tired'), E('🎒', x=1080, y=640, size=200, anim='fall', at=0.3), TT('CULPA', y=150, size=130, color='red', at=0.6)], shake=0.6)
S(91, 'slate', [P('bags', x=960, y=640, s=1.15, mood='worried', hold='🪨', holdL='🪨', holdSize=120)])
S(92, 'warm', [BAT(0.9, x=1060, y=540, w=640, charge=True, frm=0.03, lAt=0.8, dur=3.4), E('🔌', x=480, y=540, size=200, anim='left')])
S(93, 'green', [CARD('DESCANSO', '🛌', x=420, y=540, w=460, h=500, color='green'), CARD('APOYO', '🤝', x=960, y=540, w=460, h=500, color='green', at=1.0), CARD('AYUDA PROFESIONAL', '🩺', x=1500, y=540, w=460, h=500, color='green', at=2.2, size=40)])
S(94, 'ember', [EMB(), Q('Antes no eras *así*', size=140, acc='gold', glow=True)], hudBlink=True)

# ───────────────────────── SECCIÓN 4 · Señal 6 y las cinco etapas ─────────────────────────
X0, Y0, SW, SH = 230, 250, 300, 135  # escalera 2D: escalón k (1..5) en x = X0 + (k-1)·SW, y = Y0 + (k-1)·SH
def step_xy(k): return X0 + (k - 1) * SW + SW / 2, Y0 + (k - 1) * SH
S(95, 'ember', SIGNAL(6), cam='push')
S(96, 'slate', [HG(x=960, y=470, dur=3.0), TT('POCO A *POCO*', y=930, size=120, acc='gold', at=0.4)])
S(97, 'slate', [E('⭐', x=960, y=520, size=320, glow='amber', idle=False)], cam='push')
S(98, 'slate', [E('🌙', x=680, y=520, size=240), AR(830, 520, 1080, 520, color='white', at=0.3), E('☀️', x=1240, y=520, size=240, at=0.5), M('x', x=960, y=520, size=600, at=1.4)])
S(99, 'black', [D3('escalera', x=960, y=560, w=950, flipX=True, tilt3d=True, gray=0.3), d('fog', op=0.45)], cam='push')
S(100, 'slate', [STUDY('MODELO DE 5 ETAPAS', y=520, w=900, size=68, sub='Edelwich y Brodsky, 1980', ch='📖')])
S(101, 'dark', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, litAt=[0.3], active=1), E('🚀', x=step_xy(1)[0], y=step_xy(1)[1] - 110, size=130, at=0.5), T('1 · ENTUSIASMO', x=1320, y=210, size=84, color='green', at=0.4)])
S(102, 'warm', [P('handup', x=760, y=680, s=1.1, mood='happy'), d('rain', ch='📄', n=18, speed=520, size=70), TT('¡SÍ!', x=1400, y=300, size=200, color='green', at=0.2)])
S(103, 'dark', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, lit=[1], litAt=[None, 0.3], active=2), T('2 · ESTANCAMIENTO', x=1320, y=210, size=84, color='yellow', at=0.4)])
S(104, 'slate', [E('⬇️', x=480, y=440, size=200, at=0.2), E('⬇️', x=960, y=440, size=200, at=1.6), E('⬇️', x=1440, y=440, size=200, at=3.0), T('OPTIMISMO', x=480, y=720, size=64, at=0.4), T('INTERÉS', x=960, y=720, size=64, at=1.8), T('RENDIMIENTO', x=1440, y=720, size=64, at=3.2)])
S(105, 'dark', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, lit=[1, 2], active=2), E('🔍', x=step_xy(2)[0] + 700, y=step_xy(2)[1] - 60, size=200, mx=-700, mAt=0.3, mDur=1.2, anim='none'), T('AQUÍ YA HAY *SÍNTOMAS*', x=1300, y=900, size=80, acc='yellow', at=1.4)], cam='push')
S(106, 'dark', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, lit=[1, 2], litAt=[None, None, 0.3], active=3), T('3 · FRUSTRACIÓN', x=1320, y=210, size=84, color='gold', at=0.4)])
S(107, 'slate', [PROP('bike', x=960, y=720), P('sit', x=1000, y=560, s=0.9, mood='worried', sweat=True, walk=True, anim='none')], shake=1.0)
S(108, 'dark', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, lit=[1, 2, 3], litAt=[None, None, None, 0.3], active=4), T('4 · APATÍA', x=1320, y=210, size=84, color='ash', at=0.4)])
S(109, 'slate', [PLUG(360, 300, 1000, 640, offAt=1.2)])
S(110, 'black', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, lit=[1, 2, 3, 4], litAt=[None, None, None, None, 1.45], active=5), FOG(op=0.55, at=1.5), T('5 · BURNOUT', x=1320, y=210, size=96, color='ash', at=1.45)], shake=1.55, sfxAt=1.45, silAt=1.45)
S(111, 'ash', [BED('tired', x=960, y=760, s=1.1, blanket='#4a4e58'), NIEBLA(op=0.85), FOG(op=0.5)])
S(112, 'slate', [E('🛡️', x=960, y=480, size=330, idle=False), CRACK(x=960, y=470, size=380, at=0.6), T('DEPRESIÓN', x=520, y=880, size=80, color='ash', at=0.8), T('ANSIEDAD', x=1400, y=880, size=80, color='ash', at=1.4)])
S(113, 'dark', [STAIRS(x=X0, y=Y0, sw=SW, sh=SH, lit=[1, 2, 3, 4, 5], marker=3, markerAt=0.8), TT('¿TÚ?', x=1500, y=240, size=180, color='gold', at=1.2)])
S(114, 'warm', [STAIRS(x=X0, y=Y0 + 140, sw=SW, sh=SH, lit=[1, 2, 3, 4, 5]), P(x=step_xy(4)[0], y=step_xy(4)[1] + 140 - 150, s=0.6, mood='happy', walk=True, mx=-3 * SW, my=-3 * SH, mAt=0.2, mDur=3.0, anim='none'), d('light', x=step_xy(1)[0], c='rgba(255,200,130,0.45)', at=1.0), TT('SE PUEDE *SALIR*', x=1250, y=180, size=110, acc='green', at=0.5)])
S(115, 'slate', [RADAR(x=960, y=470, r=320, blipAt=0.8), TT('A *TIEMPO*', y=940, size=110, acc='green', at=0.6)])
S(116, 'slate', [LINE([[0, 0.9], [0.5, 0.5], [1, 0.08]], color='green', dur=2.0, xl='ANTES', xr='DESPUÉS'), T('MÁS *FÁCIL*', y=150, size=104, acc='green', at=0.4)])

# ───────────────────────── SECCIÓN 5 · La salida ─────────────────────────
S(117, 'slate', [ENV(x=960, y=470, size=2.0, open=1.4)], env=False)
S(118, 'ember', [BRASAS(op=0.5), TT('¿SIEMPRE FUISTE *ASÍ*?', size=170, acc='gold', glow=True, stagger=0.25)], flash=True)
S(119, 'slate', [CARD('SÍ', '✅', x=600, y=540, w=440, h=480, color='green'), AR(860, 540, 1060, 540, color='white', at=0.8), CARD('HÁBITOS', '📋', x=1320, y=540, w=440, h=480, color='gold', at=1.2)])
POLA = [('happy', 'stand', None), ('happy', 'stand', None), ('happy', 'reach', '🎸')]
S(120, 'warm', [F('polaroid', x=420 + k * 540, y=500, w=440, h=440, rot=(-4, 3, -2)[k], at=0.2 + k * 1.6) for k in range(3)] + [P(pose, x=420 + k * 540, y=490, s=0.6, mood=m, walk=(k == 1), hold=h, holdSize=90, colorAt=0.8 + k * 1.6, at=0.3 + k * 1.6) for k, (m, pose, h) in enumerate(POLA)])
S(121, 'afternoon', [P(x=760, y=650, s=1.1, mood='happy'), LAB('FLOJO', x=760, y=610, size=62, anim='none', fly=0.6), E('✨', x=1240, y=420, size=130, at=0.8)])
S(122, 'slate', [d('roadsign', x=640, y=560, onAt=0.2), TT('UNA *SEÑAL*', x=1320, y=540, size=130, acc='amber', at=0.3)])
S(123, 'slate', [E('☝️', x=960, y=520, size=300, out=1.4, idle=False), E('🤲', x=960, y=520, size=300, at=1.5)])
FOTO(124, 124, label=T('HABLA CON UN *PROFESIONAL*', y=930, size=84, acc='gold', at=0.6))
S(125, 'slate', [T('*EXAGERAR*', y=400, size=130, acc='white', strike=True, strikeAt=0.5), T('*DÉBIL*', y=650, size=130, acc='white', strike=True, strikeAt=1.4, at=0.9)])
S(126, 'slate', [D3('celular', x=1100, y=540, w=760, screen=PHONE_SCREEN, battery={'from': 0.12, 'to': 0.95, 'charge': True, 'at': 0.4, 'dur': 2.4}, glow='green'), E('🔌', x=520, y=560, size=180, anim='left')])
PASOS = ['CUÉNTASELO A ALGUIEN', 'REVISA QUÉ TE DRENA', 'DESCANSA SIN CULPA']
S(127, 'warm', [CHK(PASOS, gap=99, x=960, size=66)])
S(128, 'warm', [CHK(PASOS, pre=1, gap=99, x=960, size=66, at=0)])
LIVE(129, label='DESCANSA SIN CULPA')
S(130, 'warm', [d('sticky', x=960, y=470, w=420, ch='❤️'), TT('PRIMER *PASO*', y=900, size=120, acc='gold', at=0.5)])
S(131, 'afternoon', [BED('tired', x=1180, y=780, s=1.0, blanket='#3b5bdb', hood='#7FD8C9', skin='#C98E68'), LAB('FLOJO', x=1080, y=790, size=60, anim='none'), P(x=300, y=640, s=1.0, mood='happy', walk=True, hold='☕', holdSize=80, mx=260, mAt=0.2, mDur=2.0, anim='none')])
S(132, 'warm', [BED('happy', x=1180, y=780, s=1.0, blanket='#3b5bdb', hood='#7FD8C9', skin='#C98E68', anim='none'), P(x=560, y=640, s=1.0, mood='happy', hold='☕', holdSize=80), TH(x=760, y=240, w=820, h=230, text='“¿Cómo estás de verdad?”', size=54, at=0.5)])

# ───────────────────────── SECCIÓN 6 · Cierre ─────────────────────────
S(133, 'slate', [E('👍', x=680, y=470, size=260), E('💬', x=1240, y=470, size=260, at=0.4), T('¿QUÉ SEÑAL TE *PEGÓ MÁS*?', y=860, size=90, acc='gold', at=0.6)])
S(134, 'ash', [FOG(op=0.8, clear=0.4), d('plane', y=480, at=0.6, dur=2.2), TT('COMPÁRTELO', y=900, size=120, color='cream', at=1.0)])
S(135, 'warm', [P('wave', x=560, y=640, s=1.1, mood='happy'), d('subbtn', x=1300, y=540, size=76, at=0.3)])
S(136, 'warm', [P('wave', x=560, y=640, s=1.1, mood='happy', anim='none'), d('subbtn', x=1300, y=540, size=76, anim='none', pressAt=0.6, text='SUSCRITO ✓', done=True), LAB('FLOJO', x=1300, y=780, size=56, anim='pop', cross=0.9, at=0.4), E('😉', x=1640, y=780, size=110, at=1.4)], cam='still')

# HUD: casillas de las señales y sobre con candado (del 7 al 116)
for n_, sp in SPEC.items():
    if 19 <= n_ <= 116:
        sig = 1 if n_ < 38 else 2 if n_ < 51 else 3 if n_ < 60 else 4 if n_ < 73 else 5 if n_ < 95 else 6
        sp.setdefault('hud', sig)
    if 7 <= n_ <= 116:
        sp.setdefault('env', True)

# ── regla del canal: el mismo texto o número no puede aparecer dos veces en la misma escena ──
def textos(el):
    for key in ('text', 'll', 'rl', 'sub', 'label', 'big', 'txt', 'time', 'title', 'xl', 'xr'):
        v_ = el.get(key)
        if isinstance(v_, str) and v_.strip():
            yield v_
    for it in el.get('items', []) or []:
        if isinstance(it, dict) and it.get('label'):
            yield it['label']
        elif isinstance(it, str):
            yield it
    for m_ in el.get('msgs', []) or []:
        yield m_.get('text', '')
    for tx in el.get('texts', []) or []:
        yield tx
    if el.get('unread') is not None:
        yield str(el['unread'])
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
dst = os.path.join(ROOT, 'src', 'burnout', 'plan.json')
json.dump(plan, open(dst, 'w'), ensure_ascii=False, indent=1)
print('escenas', len(out), '→', dst)
if FALTAN:
    print('AVISO: faltan clips de Envato para las escenas', FALTAN)
