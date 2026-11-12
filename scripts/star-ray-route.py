#!/usr/bin/env python3
"""Genera la ruta de los rayos del hero (constante MOB de src/components/StarField.astro).

El logo (public/brand/star.svg) es una cinta doblada 5 veces: 5 bandas que saltan de punta en
punta como un pentagrama. Los 2 bordes largos de cada banda se encadenan por las esquinas de las
puntas en un único lazo cerrado de 10 tramos (el borde de una cinta de Möbius). Este script:

  1. Extrae los 2 bordes largos de cada banda desde los <path> del SVG.
  2. Los encadena por esquinas compartidas (10 tramos, 2 vueltas).
  3. Asigna el nivel de profundidad de forma continua: centro del tramo = nivel de su banda
     (orden de dibujo del SVG: navy al fondo ... verde al frente), cada punta = nivel medio entre
     las dos bandas que une; interpolación cúbica monótona periódica.
  4. Imprime `const MOB = [...]` con [x, y, nivel] por punto, en las coordenadas base del hero
     (mismo lienzo 305x300 centrado que usa sampleStar(); nivel en -2..2).

Uso:  pip install svgpathtools && python3 scripts/star-ray-route.py
      (pega la salida en el bloque "RAYOS" de StarField.astro)
"""
import math
import re
from pathlib import Path

from svgpathtools import Line, parse_path

SVG = Path(__file__).resolve().parent.parent / 'public/brand/star.svg'
RW, RH = 305.0, 300.0      # lienzo de sampleStar(): alto 300, ancho = round(300 * aspecto)
PTS_PER_EDGE = 25          # puntos por tramo en la salida

svg = SVG.read_text(encoding='utf-8')
ma, mb, mc, md, me, mf = [float(x) for x in re.search(r'matrix\(([-0-9.,]+)\)', svg).group(1).split(',')]
VW, VH = [float(x) for x in re.search(r'viewBox="([-0-9. ]+)"', svg).group(1).split()[2:]]


def to_base(z, tx, ty):
    x, y = z.real + tx, z.imag + ty
    ux, uy = ma * x + mc * y + me, mb * x + md * y + mf
    return (ux * RW / VW - RW / 2, uy * RH / VH - RH / 2)


# 1) bordes largos por banda (las líneas largas del path son los extremos cortos = dobleces)
edges = []   # (banda, puntos)
for band, g in enumerate(re.finditer(
        r'transform="translate\(([-0-9.]+),([-0-9.]+)\)"[^>]*>\s*<path id="path\d+"[^>]*\bd="([^"]+)"', svg)):
    tx, ty = float(g.group(1)), float(g.group(2))
    cur, found = [], []
    for seg in parse_path(g.group(3)):
        if isinstance(seg, Line):
            if seg.length() < 0.5:
                continue
            if cur:
                found.append(cur); cur = []
        else:
            cur.append(seg)
    if cur:
        found.append(cur)
    assert len(found) == 2, f'banda {band}: se esperaban 2 bordes largos, hay {len(found)}'
    for segs in found:
        pts = []
        for s in segs:
            pts += [to_base(s.point(i / 24), tx, ty) for i in range(25)]
        pts = pts[:25] + pts[26:]                       # quita el punto duplicado entre curvas
        edges.append((band, pts))
assert len(edges) == 10, 'el SVG debe tener 5 bandas'

# 2) encadenar por esquinas compartidas, empezando por la banda verde de abajo hacia arriba
d2 = lambda a, b: (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
start = next(i for i, e in enumerate(edges) if e[0] == 4)
first = edges[start][1] if edges[start][1][0][1] > edges[start][1][-1][1] else edges[start][1][::-1]
route, used = [(edges[start][0], first)], {start}
while len(used) < 10:
    end, kcur = route[-1][1][-1], route[-1][0]
    _, i, rev = min((d2(pts[-1] if rev else pts[0], end), i, rev)
                    for i, (k, pts) in enumerate(edges) if i not in used and k != kcur for rev in (False, True))
    used.add(i)
    route.append((edges[i][0], edges[i][1][::-1] if rev else edges[i][1]))
gap = max(math.sqrt(d2(route[i][1][-1], route[(i + 1) % 10][1][0])) for i in range(10))
assert gap < 3, f'los bordes no cierran un lazo (separación {gap:.1f})'

# 3) nivel continuo (cúbico monótono periódico sobre la longitud de arco)
lev = lambda k: float(k - 2)
seglen = [sum(math.dist(p[i], p[i + 1]) for i in range(len(p) - 1)) for _, p in route]
cum = [0.0]
for L in seglen:
    cum.append(cum[-1] + L)
LT = cum[-1]
ks, kz = [], []
for n in range(10):
    k, kp = route[n][0], route[n - 1][0]
    ks += [cum[n], cum[n] + seglen[n] / 2]
    kz += [(lev(k) + lev(kp)) / 2, lev(k)]
NK = len(ks)
hs = [(ks[(i + 1) % NK] - ks[i]) % LT for i in range(NK)]
ds = [(kz[(i + 1) % NK] - kz[i]) / hs[i] for i in range(NK)]
ms = []
for i in range(NK):
    d0, d1, h0, h1 = ds[i - 1], ds[i], hs[i - 1], hs[i]
    ms.append(0.0 if d0 * d1 <= 0 else (3 * (h0 + h1)) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1))


def level_at(s):
    s %= LT
    for i in range(NK):
        t = ((s - ks[i]) % LT) / hs[i]
        if t <= 1.0:
            h, z0, z1, m0, m1 = hs[i], kz[i], kz[(i + 1) % NK], ms[i], ms[(i + 1) % NK]
            return ((2 * t ** 3 - 3 * t ** 2 + 1) * z0 + (t ** 3 - 2 * t ** 2 + t) * h * m0
                    + (-2 * t ** 3 + 3 * t ** 2) * z1 + (t ** 3 - t ** 2) * h * m1)
    return kz[0]


# 4) salida
rows = []
for n, (k, pts) in enumerate(route):
    acc, out = cum[n], []
    for i, p in enumerate(pts):
        if i:
            acc += math.dist(pts[i - 1], p)
        out.append((round(p[0], 1), round(p[1], 1), round(level_at(acc), 2)))
    sel = [out[round(i * (len(out) - 1) / (PTS_PER_EDGE - 1))] for i in range(PTS_PER_EDGE)]
    rows.append('[' + ','.join('%g,%g,%g' % q for q in sel) + ']')
print('const MOB = [' + ',\n        '.join(rows) + '];')
