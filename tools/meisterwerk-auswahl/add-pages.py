#!/usr/bin/env python3
"""Legt gebaute Seiten aus dem Astro-Quellcode zusätzlich in den Auswahl-Ordner (ohne ihn zu überschreiben).

Vorbereitung (Dauer etwa eine Minute, danach genügt ein Aufruf pro Seite):
  cd meisterwerk && SITE_URL=https://dmldigital.github.io BASE_PATH=/aa/meisterwerk-preview-auswahl/ \
      npx astro build --outDir /tmp/studio-dist
Aufruf:  python3 tools/meisterwerk-auswahl/add-pages.py studio leistungen baldassarre-fortino ...

Kopiert je Seite <seite>/index.html sowie alle darin (und in den eingebundenen JS/CSS) genannten Dateien aus `_astro/`.
Vorhandene Dateien werden NIE überschrieben (die von Hand bearbeiteten Dateien der Startseite bleiben so unberührt);
weicht eine gleichnamige Datei im Inhalt ab, wird sie gemeldet. Das Deploy-Skript meisterwerk/tools/deploy-preview.sh
darf dafür nicht verwendet werden, es ersetzt den ganzen Ordner.
"""
import os, re, shutil, sys
from pathlib import Path

D = 'meisterwerk-preview-auswahl'
SRC = Path('/tmp/studio-dist')
DST = Path(__file__).resolve().parents[2] / 'website/public' / D
pages = sys.argv[1:]
if not pages:
    sys.exit('Seiten angeben, z. B.: add-pages.py studio leistungen')

need = set()
def scan(text):
    for m in re.findall(r'/aa/%s/([\w./@%%-]+)' % re.escape(D), text):
        need.add(m.split('?')[0].split('#')[0])

for pg in pages:
    scan((SRC / pg / 'index.html').read_text(errors='ignore'))
need.discard('')
for _ in range(4):
    for n in list(need):
        p = SRC / n
        if n.endswith(('.js', '.css')) and p.is_file():
            t = p.read_text(errors='ignore'); scan(t)
            for m in re.findall(r'["\'(]\.?/?([\w./@%-]+\.(?:woff2?|js|css|avif|webp|png|jpe?g|svg))', t):
                q = Path(os.path.normpath(p.parent / m))
                if q.is_file(): need.add(os.path.relpath(q, SRC))

new = same = diff = 0
for n in sorted(need):
    s, t = SRC / n, DST / n
    if not s.is_file() or n.endswith('/'): continue
    if t.exists():
        if s.read_bytes() == t.read_bytes(): same += 1
        else: diff += 1; print('ANDERS (nicht überschrieben):', n)
        continue
    t.parent.mkdir(parents=True, exist_ok=True); shutil.copy(s, t); new += 1
for pg in pages:
    (DST / pg).mkdir(parents=True, exist_ok=True)
    shutil.copy(SRC / pg / 'index.html', DST / pg / 'index.html')
print('Seiten', len(pages), '| neue Dateien', new, '| schon vorhanden', same, '| abweichend', diff)
