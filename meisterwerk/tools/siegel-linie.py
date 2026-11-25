"""Siegel „Handwerksratgeber: Maler in Ludwigsburg“ als Linienzeichnung: Die dunkle Scheibe wird durchsichtig, Lorbeer, Ring und
Schrift (im Original hellgrün und weiß) bekommen einen dunklen, warmen Grauton. So wirkt das Siegel leicht und passt neben das
Google-Badge im Fuß und im Menü.
Aufruf: python tools/siegel-linie.py <Original.png> [Ausgabe.png]
Original: https://handwerksratgeber.de/wp-content/uploads/ostend-siegel/maler-ludwigsburg-meisterwerk-lb.png (bei neuem Stand neu laden).
Ausgabe (Standard): src/assets/img/siegel/handwerksratgeber-maler-ludwigsburg-linie.png"""
import sys
from PIL import Image

INK = (74, 68, 62)  # warmes Dunkelgrau, ähnlich dem gedämpften Schwarz des Google-Badges
LO, HI = 80, 175    # Helligkeit, ab der etwas zur Zeichnung zählt (Scheibe ~40, Zeichnung 210 bis 255)

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else 'src/assets/img/siegel/handwerksratgeber-maler-ludwigsburg-linie.png'
im = Image.open(src).convert('RGBA')
px = im.load()
w, h = im.size
res = Image.new('RGBA', (w, h), INK + (0,))
rp = res.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = px[x, y]
        lum = 0.299 * r + 0.587 * g + 0.114 * b
        t = min(1.0, max(0.0, (lum - LO) / (HI - LO)))
        t = t * t * (3 - 2 * t)  # weicher Übergang, die Kanten bleiben ruhig
        rp[x, y] = INK + (int(round(a * t)),)
res.save(out, optimize=True)
print(out, res.size)
