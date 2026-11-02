#!/usr/bin/env python3
"""Bringt reine Build-Seiten der Auswahl-Vorschau (alles außer der handbearbeiteten Startseite `index.html`) auf den Stand
des Astro-Quellcodes: <seite>/index.html wird durch die Fassung aus dem Build ersetzt.

Vorher prüfen, dass die Seite keine Handarbeit enthält (Vergleich mit dem Build, Abweichungen nur aus dem Quellcode).
Zwei Dinge der Vorschau bleiben erhalten:
- Schriften: Der Build in der Cloud-Umgebung kann Google Fonts nicht laden (Proxy 403), dann fehlen im Build die
  @font-face-Regeln. Die Schrift-Blöcke (`<style>@font-face…`, Preload) der bisherigen Seite werden übernommen.
- Ein vorhandener Verweis auf `_astro/Clean.css` bleibt.
Dateien aus `_astro/` kopiert vorher `add-pages.py` (Dateien nie überschreibend, die Seite selbst kopiert es aber mit;
fehlen dann die Schrift-Blöcke, nimmt dieses Skript sie aus dem letzten Commit).

Vorbereitung: Build wie bei add-pages.py, dann  python3 tools/meisterwerk-auswahl/add-pages.py <seiten…>
Aufruf:  python3 tools/meisterwerk-auswahl/refresh-pages.py <seiten…>   (oder --alle für alle Unterseiten des Builds)
"""
import re
import subprocess
import sys
from pathlib import Path

D = Path(__file__).resolve().parents[2] / 'website/public/meisterwerk-preview-auswahl'
B = Path('/tmp/studio-dist')

args = sys.argv[1:]
if args == ['--alle']:
    args = sorted(str(p.parent.relative_to(B)) for p in B.rglob('index.html')
                  if p.parent != B and (D / p.relative_to(B)).is_file())
if not args:
    sys.exit('Seiten angeben, z. B.: refresh-pages.py studio baldassarre-fortino  (oder --alle)')

for pg in args:
    old_p, new_p = D / pg / 'index.html', B / pg / 'index.html'
    old, new = old_p.read_text(), new_p.read_text()
    if '<style>@font-face' not in old:
        # add-pages.py kopiert die Seite selbst immer mit; dann die Schrift-Blöcke aus dem letzten Commit nehmen
        rel = old_p.relative_to(D.parents[2]).as_posix()
        old = subprocess.run(['git', 'show', f'HEAD:{rel}'], cwd=D.parents[2], capture_output=True, text=True).stdout
    # Schriften: Platzhalter des Builds durch die vollständigen Blöcke der bisherigen Seite ersetzen
    for var in ('--font-urbanist', '--font-dm-sans'):
        ph = re.search(r'<style>:root\{%s:[^}]*\}</style>' % re.escape(var), new)
        full = re.search(r'<style>@font-face[^<]*%s[^<]*</style>' % re.escape(var), old)
        if ph and full:
            new = new.replace(ph.group(0), full.group(0), 1)
    for link in re.findall(r'<link rel="preload"[^>]*/fonts/[^>]*>', old):
        if link not in new:
            new = new.replace('</head>', link + '</head>', 1)
    clean = re.search(r'<link[^>]*_astro/Clean\.css[^>]*>', old)
    if clean and 'Clean.css' not in new:
        new = new.replace('</head>', clean.group(0) + '</head>', 1)
    assert not re.search(r'<style>:root\{--font-(urbanist|dm-sans):', new), f'{pg}: Schrift-Blöcke fehlen (Seite schon aktualisiert? Stand aus git wiederherstellen)'
    old_p.write_text(new)
    print(f'{pg}: aktualisiert')
