#!/usr/bin/env python3
"""Baut die Ideen-Vorschau „drei Kreise im Hintergrund“: eine Kopie der Startseite der Auswahl-Vorschau mit zusätzlicher
Kreis-Ebene (kreise-demo.js) unter `kreise/index.html`. Die echte Startseite bleibt unverändert.
Aufruf:  python3 tools/meisterwerk-auswahl/kreise-demo.py   (nach jeder Änderung an der Startseite oder am Skript neu)
Links: .../kreise/#a  #b  #c  #d  (Idee direkt aufrufen), #aus (ohne Kreise)
"""
from pathlib import Path

HERE = Path(__file__).resolve().parent
D = HERE.parents[1] / 'website/public/meisterwerk-preview-auswahl'
html = (D / 'index.html').read_text()
js = (HERE / 'kreise-demo.js').read_text()
assert html.count('</body>') == 1
out = html.replace('</body>', '<script data-kreise-demo>' + js + '</script></body>')
(D / 'kreise').mkdir(exist_ok=True)
(D / 'kreise/index.html').write_text(out)
print('kreise/index.html', len(out))
