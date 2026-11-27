"""Rehace el guion técnico (02) y la lista de recursos (06) del video 6 en el estilo collage.
Uso: python3 scripts/subempleo/fase1_collage.py"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'scripts', 'estilo'))
from fase1_collage import generar
generar(os.path.join(ROOT, 'entregas', '06-el-subempleo'), os.path.join(HERE, 'collage_rows.py'),
        os.path.join(ROOT, 'audio', '06-el-subempleo', 'transcripcion_palabras_largo.json'),
        'Tienes trabajo… pero estás subempleado',
        nota_recursos='Esta lista **sustituye** a la anterior: el video ya va en el **estilo collage** (recortes tipo estampa, tarjetas, sellos y notas a mano). La mayoría de las cosas son **recortes en PNG sin fondo**; los videos son pocos.')
