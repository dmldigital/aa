# Nutzung: python3 sbs.py <referenz.png> <nachbau.png> <ausgabe.png>
# Erzeugt: links Original, Mitte Nachbau, rechts Differenz (rot = Abweichung)
import sys
from PIL import Image, ImageChops
a = Image.open(sys.argv[1]).convert('RGB'); b = Image.open(sys.argv[2]).convert('RGB')
w = max(a.width, b.width); h = max(a.height, b.height)
A = Image.new('RGB', (w, h), 'white'); A.paste(a, (0, 0))
B = Image.new('RGB', (w, h), 'white'); B.paste(b, (0, 0))
d = ImageChops.difference(A, B).convert('L').point(lambda v: 255 if v > 40 else 0)
D = Image.composite(Image.new('RGB', (w, h), (230, 30, 30)), Image.blend(A, B, 0.5).convert('L').convert('RGB'), d)
out = Image.new('RGB', (w * 3 + 20, h), (255, 0, 255)); out.paste(A, (0, 0)); out.paste(B, (w + 10, 0)); out.paste(D, (2 * w + 20, 0))
out.save(sys.argv[3])
print('Original', a.size, 'Nachbau', b.size, 'Abweichende Pixel %.1f%%' % (100 * sum(1 for v in d.getdata() if v) / (w * h)))
