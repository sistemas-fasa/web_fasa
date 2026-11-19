"""Genera las capas del recorrido de entrada a partir de las fotos originales.

Uso: python scripts/build-entrada.py
Lee referencias/marca/ (excluida de Git) y escribe en public/media/:
  entrada-fachada.webp, entrada-puerta-izq.webp, entrada-puerta-der.webp,
  showroom-panoramica.webp
Imprime las coordenadas de la puerta para src/App.jsx (constante ENTRY).
Requiere Pillow y numpy.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image, ImageOps, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
REF = ROOT / 'referencias' / 'marca'
OUT = ROOT / 'public' / 'media'

FACADE = REF / 'IMG_20250506_144125855.jpg'
INTERIOR = REF / 'DSCN3271.JPG'
PANORAMA = REF / 'DSCN3268.JPG'

# Coordenadas en la foto original (4640 x 2610).
CROP_BOTTOM = 2250
LEFT_LEAF = (2486, 1202, 2698, 1795)
RIGHT_LEAF = (2698, 1200, 2906, 1802)
LEFT_GLASS = (2510, 1232, 2668, 1722)
RIGHT_GLASS = (2724, 1220, 2899, 1733)
HANDLES = [(2628, 1290, 2654, 1680), (2734, 1290, 2764, 1685)]
WINDOWS = [(1068, 1000, 2346, 1690), (3058, 630, 4640, 1792)]
LAMPS = [(1334, 487), (2390, 488), (4092, 104)]
TARGET_WIDTH = 2400


def arr(image):
    return np.asarray(image, dtype=np.float32) / 255


def img(values):
    return Image.fromarray((np.clip(values, 0, 1) * 255).astype(np.uint8))


def feather_rect(shape, box, radius):
    mask = Image.new('L', (shape[1], shape[0]), 0)
    mask.paste(255, box)
    return arr(mask.filter(ImageFilter.GaussianBlur(radius)))[..., None]


def warm_grade(values, strength=1.0):
    r, g, b = values[..., 0], values[..., 1], values[..., 2]
    graded = np.stack([r * (1 + .07 * strength), g * (1 + .015 * strength), b * (1 - .09 * strength)], -1)
    # Contraste suave en curva S.
    return np.clip(graded + .09 * strength * np.sin((graded - .5) * np.pi) * .5, 0, 1)


def build_facade():
    facade = ImageOps.exif_transpose(Image.open(FACADE)).convert('RGB')
    base = arr(facade)
    h, w, _ = base.shape

    # 1. Vidrios de la puerta: interior iluminado y desenfocado, sin carteles.
    interior = ImageOps.exif_transpose(Image.open(INTERIOR)).convert('RGB')
    for glass in (LEFT_GLASS, RIGHT_GLASS):
        gw, gh = glass[2] - glass[0], glass[3] - glass[1]
        view = interior.crop((1500, 900, 1500 + gw * 5, 900 + gh * 5)).resize((gw, gh), Image.LANCZOS)
        view = arr(view.filter(ImageFilter.GaussianBlur(2.2)))
        view = warm_grade(view * 1.05 + .03, 1.4)
        region = base[glass[1]:glass[3], glass[0]:glass[2]]
        reflection = np.mean(region, -1, keepdims=True)
        base[glass[1]:glass[3], glass[0]:glass[2]] = view * .86 + reflection * .14
    original = arr(facade)
    for box in HANDLES:
        base[box[1]:box[3], box[0]:box[2]] = original[box[1]:box[3], box[0]:box[2]]

    # 2. Vidrieras con luz cálida desde adentro (más intensa en zonas oscuras).
    lum = base.mean(-1, keepdims=True)
    for box in WINDOWS:
        rise = np.clip((np.mgrid[0:h, 0:w][0] - box[1]) / (box[3] - box[1]), 0, 1)[..., None]
        mask = feather_rect(base.shape, box, 40) * np.clip((.62 - lum) / .45, 0, 1) * (.35 + .65 * rise)
        glow = np.array([1.0, .74, .42])
        base = base + mask * .24 * glow * (1 - base)

    # 3. Lámparas del alero encendidas.
    yy, xx = np.mgrid[0:h, 0:w]
    for x, y in LAMPS:
        d = np.sqrt((xx - x) ** 2 + ((yy - y) * 1.3) ** 2)
        halo = np.exp(-(d / 150) ** 2)[..., None]
        base = base + halo * .55 * np.array([1, .86, .62]) * (1 - base)

    # 4. Cielo de tarde en las zonas claras de arriba.
    sky = (lum[..., 0] > .8) & (yy < 520) & (xx > 1000)
    sky_mask = np.asarray(Image.fromarray((sky * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(5)), dtype=np.float32)[..., None] / 255
    t = np.clip(yy / 520, 0, 1)[..., None]
    sky_color = np.array([.52, .66, .86]) * (1 - t) + np.array([1, .8, .62]) * t
    base = base * (1 - sky_mask) + sky_color * sky_mask

    # 5. Tono general cálido, piso más oscuro y viñeta.
    base = warm_grade(base, 1.0)
    floor = np.clip((yy - 1820) / (CROP_BOTTOM - 1820), 0, 1)[..., None]
    base = base * (1 - floor * .45)
    cx, cy = 2700, 1350
    vignette = np.sqrt(((xx - cx) / w) ** 2 + ((yy - cy) / h) ** 2)[..., None]
    base = base * (1 - np.clip(vignette - .32, 0, 1) * .55)

    result = img(base).crop((0, 0, w, CROP_BOTTOM))
    scale = TARGET_WIDTH / w
    size = (TARGET_WIDTH, round(CROP_BOTTOM * scale))
    result.resize(size, Image.LANCZOS).save(OUT / 'entrada-fachada.webp', quality=80, method=6)

    def scaled(box):
        return [round(v * scale) for v in box]

    leaves = {}
    for name, box in (('izq', LEFT_LEAF), ('der', RIGHT_LEAF)):
        b = scaled(box)
        leaf = result.resize(size, Image.LANCZOS).crop(b)
        leaf.save(OUT / f'entrada-puerta-{name}.webp', quality=86, method=6)
        leaves[name] = b
    hole = [min(leaves['izq'][0], leaves['der'][0]), min(leaves['izq'][1], leaves['der'][1]),
            max(leaves['izq'][2], leaves['der'][2]), max(leaves['izq'][3], leaves['der'][3])]
    return {'width': size[0], 'height': size[1], 'left': leaves['izq'], 'right': leaves['der'], 'hole': hole}


def build_panorama():
    pano = ImageOps.exif_transpose(Image.open(PANORAMA)).convert('RGB')
    values = warm_grade(arr(pano) * 1.03, .7)
    img(values).save(OUT / 'showroom-panoramica.webp', quality=78, method=6)
    return pano.size


if __name__ == '__main__':
    entry = build_facade()
    entry['panorama'] = build_panorama()
    print(json.dumps(entry))
