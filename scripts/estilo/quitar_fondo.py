"""Quita el fondo de fotos de objetos o personas y guarda un PNG transparente, recortado a su contenido.

Modelo: BiRefNet (licencia MIT) en formato ONNX, de Hugging Face (onnx-community/BiRefNet-ONNX).
Uso: python3 scripts/estilo/quitar_fondo.py <modelo.onnx> <salida_dir> <imagen> [<imagen> ...]
"""
import os, sys
import numpy as np
import onnxruntime as ort
from PIL import Image

MEAN = np.array([0.485, 0.456, 0.406], np.float32)
STD = np.array([0.229, 0.224, 0.225], np.float32)


def mascara(sess, im):
    x = np.asarray(im.convert('RGB').resize((1024, 1024), Image.BILINEAR), np.float32) / 255.0
    x = ((x - MEAN) / STD).transpose(2, 0, 1)[None]
    y = sess.run(None, {sess.get_inputs()[0].name: x})[0][0, 0]
    if y.min() < 0 or y.max() > 1:  # el modelo puede dar valores sin normalizar
        y = 1 / (1 + np.exp(-y))
    m = Image.fromarray((np.clip(y, 0, 1) * 255).astype(np.uint8)).resize(im.size, Image.BILINEAR)
    return m


def main():
    modelo, salida, *imgs = sys.argv[1:]
    os.makedirs(salida, exist_ok=True)
    so = ort.SessionOptions(); so.enable_cpu_mem_arena = False; so.intra_op_num_threads = 3
    sess = ort.InferenceSession(modelo, so, providers=['CPUExecutionProvider'])
    for f in imgs:
        im = Image.open(f).convert('RGB')
        im.thumbnail((2400, 2400))  # más que suficiente para un recorte en 1080p
        m = mascara(sess, im)
        out = im.convert('RGBA'); out.putalpha(m)
        a = np.asarray(m)
        ys, xs = np.where(a > 20)
        pad = 12
        box = (max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad))
        out = out.crop(box)
        out.thumbnail((1600, 1600))
        name = os.path.splitext(os.path.basename(f))[0] + '.png'
        out.save(os.path.join(salida, name))
        print(name, out.size, f'opaco {round((a > 128).mean() * 100)} %')


if __name__ == '__main__':
    main()
