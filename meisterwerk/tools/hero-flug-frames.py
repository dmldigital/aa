"""Desktop-Bildfolge des Hero-Flugs (public/hero-flug/d) aus den Einzelbildern des Higgsfield-Videos erzeugen.
Spaeterer Start (die ersten SKIP Bilder entfallen) und ein mitlaufender 16:9-Ausschnitt: am Anfang das ganze Haus mit
etwas Himmel, die Nachbarhaeuser rechts bleiben draussen, beim Anflug weitet sich der Ausschnitt zum vollen Bild.
Einzelbilder aus dem Video: ffmpeg -vsync 0 -i video.mp4 <Ordner>/%03d.png (193 Bilder, 1920x1080, ab 001.png).
Aufruf: python3 hero-flug-frames.py <Ordner mit 001.png..193.png> <Ausgabeordner> [SKIP=16] [webp|jpg]
Die Handy-Bildfolge (m/) ist ein eigener Hochformat-Ausschnitt mit Schwenk; sie wird nur um dieselben SKIP Bilder gekuerzt.
Ausschnitt je Originalbild (Werte in Prozent der Originalbreite/-hoehe, Hoehe = Breite, weil 16:9):
  f = Nummer des Originalbildes (0 bis 192), x0 = linke Kante, w = Breite, y0 = obere Kante
"""
import sys, os
import numpy as np
from PIL import Image, ImageFilter
from scipy.interpolate import PchipInterpolator

src, out = sys.argv[1], sys.argv[2]
SKIP = int(sys.argv[3]) if len(sys.argv) > 3 else 16
FMT = sys.argv[4] if len(sys.argv) > 4 else 'webp'
os.makedirs(out, exist_ok=True)

# Schluesselbilder (Originalbild-Nummer 0..192)
K = np.array([
    # f,   x0,   w,    y0
    [0,     5.0, 68.0,  9.0],
    [16,    5.0, 68.0,  9.0],
    [20,    5.5, 68.0,  9.0],
    [40,    8.0, 67.0,  8.0],
    [60,    6.5, 71.0,  4.5],
    [75,    2.5, 72.0,  3.0],
    [90,    0.0, 76.0,  1.5],
    [105,   0.0, 83.0,  1.0],
    [120,   0.0, 94.5,  0.0],
    [135,   0.0, 100.0, 0.0],
    [192,   0.0, 100.0, 0.0],
])
fx = PchipInterpolator(K[:, 0], K[:, 1])
fw = PchipInterpolator(K[:, 0], K[:, 2])
fy = PchipInterpolator(K[:, 0], K[:, 3])

OW, OH = 1600, 900
n = 0
for i in range(SKIP, 193):
    im = Image.open(f'{src}/{i+1:03d}.png').convert('RGB')
    W, H = im.size
    w = float(fw(i)); x0 = float(fx(i)); y0 = float(fy(i))
    x0 = max(0.0, min(x0, 100 - w)); y0 = max(0.0, min(y0, 100 - w))
    box = (x0 / 100 * W, y0 / 100 * H, (x0 + w) / 100 * W, (y0 + w) / 100 * H)
    fr = im.resize((OW, OH), Image.LANCZOS, box=box)
    up = OW / (w / 100 * W)
    if up > 1.05:
        fr = fr.filter(ImageFilter.UnsharpMask(radius=1.4, percent=int(45 * (up - 1)), threshold=2))
    p = f'{out}/{n:03d}.{FMT}'
    if FMT == 'webp':
        fr.save(p, 'WEBP', quality=82, method=4)
    else:
        fr.save(p, quality=88)
    n += 1
print(n, 'Bilder')
