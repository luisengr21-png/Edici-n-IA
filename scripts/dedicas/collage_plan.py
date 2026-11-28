"""Plan del video 5 «¿A qué te dedicas?» en el estilo collage → src/collage/dedicas.json
Uso: python3 scripts/dedicas/collage_plan.py"""
import contextlib, io, json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'scripts', 'estilo'))
from fase1_collage import generar
from collage_plan import *

V = lambda n: f'dedicas/videos/escena_{n:03d}.mp4'
FO = lambda n: f'dedicas/fotos/foto_{n}.jpg'
CO = lambda n: f'dedicas/collage/{n}'
SOFT_RED = '#ff6b6b'
CREAM = '#f3ead8'

S = {
 # ── SECCIÓN 0 · Los tres segundos ──
 1: dict(els=[card(V(1), 0.1, x=820, y=500, w=1100, h=620, rot=-3, frm='left'), emo('✨', 1.0, 1520, 200, 120), emo('✨', 1.5, 230, 880, 110),
              card(V(2), '@sonríe', x=1380, y=620, w=760, h=460, rot=4), bubble('¿Y tú a qué te dedicas?', '@tú-0.1', 1220, 190, 78)]),
 2: dict(els=[tu(0.05, x=700, y=600, s=1.4, pose='scratch', mood='worried', sweat=True), doodle('cronometro', '@unos', 1350, 450, 320, run=2.6),
              title('3 SEGUNDOS', '@tres', acc='3', x=1330, y=860, size=110)]),
 3: dict(bg_src=V(5), els=[card(V(5), 0.1, x=900, y=500, w=1200, h=680), emo('👀', '@cara', 1640, 200, 150),
              card(V(6), '@pronto', x=1430, y=660, w=700, h=420, rot=5, frm='bottom'), hand('otra bebida…', '@bebida', 470, 950, 80, color=CREAM)]),
 4: dict(els=[card(FO('007'), 0.1, x=800, y=520, w=880, h=600, rot=-4), stamp('¡INTERESANTE!', '@cirujano+0.3', 830, 860, color='#1fbf7a'),
              doodle('pregunta', '@preguntas', 1480, 330, 240), doodle('pregunta', '@preguntas+0.25', 1660, 600, 200, color='#2b3a67')]),
 5: dict(els=[card(FO('009'), 0.1, x=740, y=500, w=900, h=600, rot=3, frm='left'), stamp('SIGUIENTE…', '@trabajo+0.2', 740, 840),
              card(V(10), '@repente', x=1400, y=560, w=760, h=460, rot=-4)]),
 6: dict(els=[tu(0.05, x=700, y=600, s=1.5, pose='scratch', mood='worried'), marker('¿o fuiste tú el que se fue?', '@has', 1300, 400, 72, rot=-4)]),
 7: dict(cam=0.08, els=[doodle('pregunta', 0.2, 900, 560, 260, color=CREAM, grow=1.6, growDur=4.5), doodle('nube', '@ansiedades', 1480, 300, 420)]),
 8: dict(els=[title('3 IDEAS', '@tres', acc='3', y=220, size=120), doodle('casillas', '@ideas', 880, 580, 700),
              tu('@encoja', x=1580, y=640, s=1.15, pose='hips', mood='happy')]),
 # ── SECCIÓN 1 · Un mundo de engreídos ──
 9: dict(bg_src=CO('pintura_009.jpg'), els=[hand('el problema:', '@nombre', 420, 160, 84, color=CREAM, rot=-4),
              title('ENGREÍDOS', '@engreídos', acc='ENGREÍDOS', y=900, size=130)]),
 10: dict(els=[cut(CO('ilustracion_010.png'), 0.2, x=560, y=560, h=520), hand('tu trabajo', '@trabajo', 1300, 260, 80, rot=-3),
               arrow('@trabajo', 1120, 280, 840, 420), hand('tu título', '@título', 1520, 420, 80, rot=2), hand('tu puesto', '@puesto', 1320, 580, 80, rot=-2),
               marker('¿cuánto vales?', '@cuánto', 1400, 830, 90, rot=-5)]),
 11: dict(els=[card(V(20), 0.1, x=960, y=500, w=1300, h=640), circle('@cuadro', 960, 500, 190, 230), hand('un solo cuadro', '@cuadro+0.2', 960, 960, 80, color=CREAM)]),
 12: dict(els=[doodle('pregunta', 0.2, 960, 470, 300, out='@tu'), card(FO('022'), '@mamá-0.3', x=960, y=480, w=1000, h=640, rot=2, frm='bottom'),
               doodle('corazon', '@mamá+0.3', 1560, 240, 200), title('TU MAMÁ', '@mamá', acc='MAMÁ', y=930, size=110)]),
 13: dict(els=[card(V(24), 0.3, x=1430, y=520, w=760, h=480, rot=4),
               lista(0.1, [dict(text='¿gerente?', at='@gerente', mark='strike', markAt='@despedir'), dict(text='¿comiste?', at='@comiste', mark='check', markAt='@comiste+0.4'),
                           dict(text='¿dormiste?', at='@dormiste', mark='check', markAt='@dormiste+0.4'), dict(text='¿estás bien?', at='@estás', mark='check', markAt='@bien+0.2')], x=640, y=540)]),
 14: dict(bg_src=V(26), els=[card(V(26), 0.1, x=960, y=480, w=1200, h=650), emo('👀', '@juzgados-1.2', 320, 220, 140), emo('👀', '@juzgados-0.8', 1620, 250, 140),
               emo('👀', '@juzgados-0.4', 1660, 820, 140), stamp('JUZGADOS', '@juzgados', 960, 900)]),
 15: dict(els=[hand('pero aguanta…', 0.1, 960, 170, 90, color=CREAM), tu(0.1, x=700, y=620, s=1.2, pose='handup', mood='happy', out='@ferrari-0.6'),
               doodle('velocidad', '@ferrari-0.4', 420, 540, 260, color=CREAM), card(V(29), '@ferrari-0.5', x=1120, y=560, w=1100, h=620, rot=-3)]),
 # ── SECCIÓN 2 · Lo que de verdad compra un Ferrari ──
 16: dict(els=[card(V(30), 0.1, x=960, y=460, w=1100, h=620, rot=2), hand('materialista', '@materialista', 520, 920, 90),
               strike('@triste-1.0', 370, 922, 680, 918), marker('algo más triste', '@triste', 1320, 920, 84)]),
 17: dict(els=[cut(CO('recorte_017.png'), 0.2, x=960, y=540, h=560), doodle('corazon', '@cariño', 1100, 300, 210, rot=12), hand('pegados a las cosas', '@pegados', 960, 950, 80)]),
 18: dict(els=[hand('piénsalo…', 0.1, 960, 200, 90, out='@reloj'), card(FO('033'), '@reloj', x=560, y=500, w=700, h=480, rot=-4, frm='left'),
               card(FO('034'), '@marca#2', x=1360, y=500, w=700, h=480, rot=3), doodle('igual', '@misma', 960, 500, 200), hand('la misma hora', '@misma', 960, 900, 84)]),
 19: dict(els=[cut(CO('recorte_019_a.png'), '@dinero', x=420, y=320, h=230, rot=-6, out='@miren-0.2'), cut(CO('recorte_019_b.png'), '@puesto', x=960, y=330, h=360, rot=4, out='@miren-0.2'),
               cut(CO('recorte_020.png'), '@auto', x=1500, y=340, h=210, out='@miren-0.2'),
               emo('👁️', '@miren', 420, 420, 170, out='@forma-0.2'), hand('que la miren', '@miren', 420, 620, 74, out='@forma-0.2'),
               emo('👂', '@escuchen', 960, 420, 170, out='@forma-0.2'), hand('que la escuchen', '@escuchen', 960, 620, 74, out='@forma-0.2'),
               emo('👏', '@respeten', 1500, 420, 170, out='@forma-0.2'), hand('que la respeten', '@respeten', 1500, 620, 74, out='@forma-0.2'),
               card(FO('039'), '@forma', x=960, y=470, w=900, h=560, rot=-2, frm='bottom'), title('UNA FORMA DE AMOR', '@amor', acc='AMOR', y=930, size=110)]),
 20: dict(bg_src=CO('pintura_020.jpg'), els=[cut(CO('recorte_020.png'), '@ferrari', x=800, y=800, h=330), hand('qué tipo tan codicioso', '@qué', 1380, 190, 84, color=CREAM),
               strike('@codicioso+0.5', 1050, 196, 1710, 190)]),
 21: dict(els=[card(V(42), 0.1, x=960, y=470, w=1000, h=580, frm='bottom'), doodle('corazon', '@necesita', 1520, 240, 170), marker('necesita que lo quieran', '@quieran-0.4', 960, 920, 80, color='#ff8fab')]),
 22: dict(els=[tu(0.05, x=960, y=600, s=1.4, pose='shrug', mood='worried'), doodle('pregunta', '@raro', 1380, 320, 230), doodle('pregunta', '@raro#2', 560, 300, 200, color='#2b3a67')]),
 # ── SECCIÓN 3 · El peso de «puedes ser lo que quieras» ──
 23: dict(els=[card(V(44), 0.1, x=960, y=460, w=1100, h=620, rot=2), title('¡LO QUE QUIERAS!', '@quieras', acc='QUIERAS', y=930, size=110),
               emo('⭐', '@precioso', 300, 220, 120), emo('✨', '@precioso+0.3', 1640, 250, 120)]),
 24: dict(els=[card(V(46), 0.1, x=740, y=460, w=900, h=540, rot=-3, frm='left'), card(FO('049'), '@llegas-1.6', x=1380, y=420, w=680, h=440, rot=4),
               tu('@llegas-1.0', x=1420, y=820, s=0.75, pose='shrug', mood='worried'), marker('¿y si no llegas?', '@llegas', 700, 930, 84, color=SOFT_RED)]),
 25: dict(els=[card(V(48), 0.1, x=820, y=460, w=1000, h=580), emo('👉', '@culpa-1.0', 1560, 460, 190, rot=180), title('¿DE QUIÉN ES LA CULPA?', '@culpa', acc='CULPA', y=930, size=100)]),
 26: dict(els=[card(V(50), 0.1, x=960, y=480, w=1100, h=620, out='@unos'), cut(CO('recorte_026_a.png'), '@triunfa', x=560, y=440, h=520, rot=-5),
               hand('Triunfa en 15 minutos', '@triunfa', 560, 800, 60, color=CREAM), hand('Hazte millonario de la noche a la mañana', '@hazte', 560, 900, 52, color=CREAM, w=620),
               cut(CO('recorte_026_b.png'), '@lidiar', x=1380, y=440, h=520, rot=4), hand('Cómo lidiar con la baja autoestima', '@lidiar', 1380, 840, 54, color=CREAM, w=620)]),
 27: dict(els=[cut(CO('recorte_027.png'), 0.1, x=960, y=470, h=500), hand('dos caras de la misma moneda', '@caras', 960, 900, 80)]),
 28: dict(bg_src=V(56), els=[card(V(56), 0.1, x=960, y=470, w=1150, h=640), stamp('INSATISFECHOS', '@insatisfecha', 960, 860)]),
 29: dict(els=[tu(0.2, x=960, y=660, s=1.2, pose='stand', mood='worried'), hand('la parte más cruel…', '@cruel', 960, 180, 92, color=CREAM), underline('@nadie', 680, 235, 1240, 238)]),
 # ── SECCIÓN 4 · La trampa de la meritocracia ──
 30: dict(els=[card(V(59), 0.1, x=820, y=460, w=1050, h=600, rot=2), doodle('escalera', '@justas', 1600, 500, 380), title('MERITOCRACIA', '@meritocracias', acc='MERITOCRACIA', y=930, size=110)]),
 31: dict(bg_src=FO('062'), els=[stamp('ARREGLADO', '@arreglado', 720, 300), card(FO('063'), '@señor-0.2', x=1420, y=440, w=600, h=440, rot=5),
               hand('no era tu culpa', '@culpa', 560, 920, 80, color=CREAM), hand('ni tu mérito', '@mérito', 1420, 920, 80, color=CREAM)]),
 32: dict(els=[card(FO('045'), 0.1, x=960, y=460, w=820, h=560, rot=-3), marker('su lado oscuro', '@oscuro', 960, 920, 86)]),
 33: dict(els=[cut(CO('ilustracion_033.png'), '@arriba', x=600, y=400, h=560), hand('se lo ganaron', '@ganaron', 1180, 200, 80, color=CREAM),
               card(V(67), '@abajo', x=1360, y=730, w=760, h=440, rot=4, frm='bottom'), arrow('@abajo', 900, 420, 1150, 560, color=SOFT_RED),
               marker('¿también?', '@suyo', 1680, 380, 84, color=SOFT_RED)]),
 34: dict(els=[card(FO('069'), '@pobreza', x=960, y=650, w=800, h=470, frm='bottom'), title('LA TRAMPA', '@trampa', acc='TRAMPA', y=170, size=120),
               stamp('¿MERECIDA?', '@merecida', 1260, 830, color=SOFT_RED)]),
 35: dict(bg_src=FO('072'), els=[hand('desafortunados', '@desafortunados', 1420, 200, 96, color=CREAM), card(FO('diosa_fortuna'), '@diosa', x=1450, y=650, w=700, h=400, rot=4)]),
 36: dict(els=[card(FO('perdedores'), 0.1, x=960, y=470, w=1100, h=640), stamp('PERDEDORES', '@perdedores', 960, 860, size=110)]),
 37: dict(els=[doodle('trebol', 0.2, 380, 340, 260), xmark('@suerte', 380, 340, 110), card(V(77), '@intenta', x=1160, y=470, w=1000, h=580, rot=3),
               marker('¿mala suerte? ajá…', '@ver', 1120, 900, 80)]),
 38: dict(els=[card(FO('095'), 0.1, x=1160, y=540, w=760, h=480, rot=3), cut(CO('recorte_038.png'), '@veredicto-0.3', x=620, y=380, h=300, rot=-15),
               stamp('EL VEREDICTO', '@veredicto+0.2', 960, 880)]),
 39: dict(bg_src=V(80), els=[card(V(80), 0.1, x=960, y=470, w=1100, h=620, out='@émile-0.2'), card(FO('081'), '@émile', x=740, y=480, w=560, h=680, rot=-3, frm='left'),
               hand('Émile Durkheim, 1897', '@durkheim', 1400, 330, 76, color=CREAM),
               chart('@tasas', [[1120, 720], [1270, 700], [1420, 660], [1570, 600], [1720, 530]], color=CREAM)]),
 40: dict(els=[tu(0.1, x=860, y=680, s=1.1, pose='stand', mood='blank'), doodle('puerta', 0.3, 1400, 440, 460)]),
 # ── SECCIÓN 5 · Tres salidas ──
 41: dict(els=[title('3 SALIDAS', '@ideas', acc='SALIDAS', y=220, size=120), doodle('casillas', 0.1, 960, 580, 700)]),
 42: dict(els=[doodle('casillas', 0.0, 960, 190, 360, checks=['@uno', None, None]), card(V(87), '@cuento', x=960, y=560, w=980, h=560, rot=-2),
               marker('1. la suerte cuenta', '@suerte', 960, 950, 84)]),
 43: dict(els=[tu(0.1, x=560, y=620, s=1.3, pose='hips', mood='happy'), card(V(98), '@ti', x=1300, y=520, w=800, h=480, rot=3)]),
 44: dict(els=[doodle('casillas', 0.0, 960, 190, 360, checks=[0.0, '@dos', None]), marker('2. tu propio éxito', '@éxito', 900, 520, 96), emo('✏️', '@crea', 1560, 520, 170),
               hand('ganar ≠ dinero', '@dinero', 900, 820, 80)]),
 45: dict(bg_src=V(90), els=[card(V(90), 0.05, x=620, y=400, w=760, h=460, rot=-4, frm='left'), card(V(91), '@amigo', x=1300, y=430, w=760, h=460, rot=3),
               card(V(92), '@paz', x=960, y=700, w=820, h=480, rot=-1, frm='bottom')]),
 46: dict(els=[card(V(93), 0.1, x=960, y=500, w=1150, h=660, rot=-2), xmark('@familia-0.8', 1250, 430, 90)]),
 47: dict(els=[doodle('casillas', 0.0, 960, 190, 360, checks=[0.0, 0.0, '@tres'], out='@partes'), marker('3. no eres tu puesto', '@importante', 960, 400, 92, out='@partes'),
               hand('tus logros de afuera ≠ quién eres', '@logros', 960, 600, 76, out='@partes'),
               card(FO('095'), '@partes', x=520, y=600, w=520, h=340, rot=-5, frm='left'), card(V(97), '@humor', x=1150, y=420, w=620, h=380, rot=4),
               card(V(98), '@cuidar', x=1460, y=730, w=620, h=380, rot=-3, frm='bottom')]),
 48: dict(els=[tu(0.1, x=680, y=600, s=1.3, pose='reach', mood='worried'), card(FO('095'), 0.3, x=1320, y=500, w=520, h=330, rot=4), stamp('NO CABE', '@cabe', 1320, 800, color=SOFT_RED)]),
 # ── SECCIÓN 6 · La pregunta, otra vez ──
 49: dict(cam=0.06, els=[card(V(2), 0.1, x=960, y=460, w=900, h=520, out='@respira'), bubble('¿a qué te dedicas?', '@qué', 1300, 190, 74, out='@respira'),
               tu('@respira', x=560, y=640, s=1.25, pose='hips', mood='happy'), hand('respira…', '@respira+0.3', 1250, 330, 96, color=CREAM, out='@cuadro'), card(V(20), '@cuadro', x=1360, y=430, w=700, h=420, rot=3, out='@película#2'),
               card(FO('104'), '@película#2', x=1340, y=460, w=820, h=500, rot=2), hand('tu película es mucho más larga', '@larga', 960, 950, 80, color=CREAM)]),
 50: dict(els=[tu(0.1, x=520, y=600, s=1.3, pose='phone', mood='happy'), emo('💬', '@presentarías-0.6', 1100, 260, 160),
               title('¿CÓMO TE PRESENTARÍAS?', '@presentarías', acc='PRESENTARÍAS', x=1240, y=560, size=84)]),
 51: dict(els=[emo('👍', '@like', 300, 300, 150), emo('↗️', '@compártelo', 300, 540, 140), emo('🔔', '@suscríbete', 300, 780, 150),
               marker('suscríbete', '@suscríbete', 620, 780, 84, color='#ffc93c'), tu('@aquí', x=640, y=480, s=0.95, pose='wave', mood='happy')]),
}

if __name__ == '__main__':
    with contextlib.redirect_stdout(io.StringIO()):
        scenes = generar(os.path.join(ROOT, 'entregas', '05-a-que-te-dedicas'), os.path.join(HERE, 'collage_rows.py'),
                         os.path.join(ROOT, 'audio', '05-a-que-te-dedicas', 'transcripcion_palabras_largo.json'), '¿A qué te dedicas?',
                         nota_recursos=open(os.path.join(ROOT, 'entregas', '05-a-que-te-dedicas', '06_recursos.md')).read().split('\n')[2])
    meta = json.load(open(os.path.join(ROOT, 'audio', '05-a-que-te-dedicas', 'largo_meta.json')))
    plan = armar(scenes, S, meta['duration'])
    json.dump(plan, open(os.path.join(ROOT, 'src', 'collage', 'dedicas.json'), 'w'), ensure_ascii=False)
    from collections import Counter
    print('escenas', len(plan['scenes']), '· duración', plan['duration'], 's')
    print('transiciones:', Counter(s['tr']['type'] for s in plan['scenes']).most_common())
    print('elementos:', Counter(e['k'] for s in plan['scenes'] for e in s['els']).most_common())
