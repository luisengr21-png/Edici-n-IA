"""Rehace el guion técnico (02) y la lista de recursos (06) del video 5 en el estilo collage.
Las versiones del estilo anterior quedan como 02_guion_tecnico_estilo_anterior.md y 06_recursos_estilo_anterior.md.
Uso: python3 scripts/dedicas/fase1_collage.py"""
import os, sys
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(ROOT, 'scripts', 'estilo'))
from fase1_collage import generar
generar(os.path.join(ROOT, 'entregas', '05-a-que-te-dedicas'), os.path.join(HERE, 'collage_rows.py'),
        os.path.join(ROOT, 'audio', '05-a-que-te-dedicas', 'transcripcion_palabras_largo.json'),
        '¿A qué te dedicas?',
        nota_recursos='El video 5 se **rehace en el estilo collage**. La voz se queda igual. **Casi todo ya me lo mandaste:** los videos y las fotos de antes se reutilizan dentro de tarjetas (sección 6). Solo te pido algunos **recortes en PNG sin fondo**, un par de **ilustraciones** y dos **pinturas antiguas**.')
