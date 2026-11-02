#!/usr/bin/env python3
"""Setzt die Leistungen-Sektion (`LeistungenStack.astro`) aus dem Astro-Build in die handbearbeitete Startseite der Auswahl-Vorschau.

Vorgehen wie `hero-patch.py`: Nur der Abschnitt `<section data-lk …>` wird gegen die Fassung aus dem Build getauscht, das Skript
der Komponente (Chunk samt importierten Modulen, nie überschreibend) eingebunden, und Tailwind-Regeln für Klassen, die das
Startseiten-CSS noch nicht kennt, kommen als `<style data-lk-patch>` in den <head>. Die früheren, von Hand geschriebenen
Dateien `LeistungenStack.css/js` werden nicht mehr eingebunden. Alles andere der Startseite bleibt unverändert.

Vorbereitung: Build wie bei hero-patch.py (SITE_URL=https://dmldigital.github.io BASE_PATH=/aa/meisterwerk-preview-auswahl/
npx astro build --outDir /tmp/studio-dist im Ordner meisterwerk/).
Aufruf:  python3 tools/meisterwerk-auswahl/lk-patch.py
"""
import re
from pathlib import Path

# Hilfsfunktionen aus hero-patch.py (CSS-Abgleich, Module kopieren), ohne dessen Ablauf auszuführen
src = (Path(__file__).parent / 'hero-patch.py').read_text()
helpers = src[:src.index('\nbase = re.sub(')]
ns = {'__file__': str(Path(__file__).parent / 'hero-patch.py')}
exec(compile(helpers, 'hero-patch.py', 'exec'), ns)
D, B = ns['D'], ns['B']

SECTION = re.compile(r'<section[^>]*\bdata-lk[\s>][\s\S]*?</section>')
CHUNK = re.compile(r'LeistungenStack\.astro_astro_type_script_index_0_lang\.[\w-]+\.js')

built = (B / 'index.html').read_text()
page = (D / 'index.html').read_text()
new = SECTION.search(built).group(0)
assert len(SECTION.findall(page)) == 1, 'Leistungen-Sektion in der Startseite nicht eindeutig'
page = SECTION.sub(lambda m: new, page, count=1)

chunk = CHUNK.search(built).group(0)
ns['copy_modules'](chunk)
tag = '<script type="module" src="%s/_astro/%s"></script>' % (ns['PREFIX'], chunk)
page = re.sub(r'<script[^>]*_astro/LeistungenStack\.astro_astro_type_script[^>]*></script>', '', page)
old_js = re.compile(r'<script[^>]*_astro/LeistungenStack\.js[^>]*></script>')
if old_js.search(page):
    page = old_js.sub(tag, page, count=1)
else:
    page = page.replace('</body>', tag + '</body>', 1)
page = re.sub(r'<link[^>]*_astro/LeistungenStack\.css[^>]*>', '', page)

page = re.sub(r'<style data-lk-patch>[\s\S]*?</style>', '', page)
need, css = ns['missing_rules'](new, page, built)
assert page.count('</head>') == 1
page = page.replace('</head>', '<style data-lk-patch>' + css + '</style></head>')
(D / 'index.html').write_text(page)
print(f'Leistungen: Skript {chunk}, {len(need)} Klassen ergänzt')

# Bilder und Dateien, die der Abschnitt aus dem Build braucht
n = 0
import shutil
for f in sorted(set(re.findall(r'%s/(_astro/[\w./@%%-]+)' % re.escape(ns['PREFIX']), new))):
    s, t = B / f, D / f
    if s.is_file() and not t.exists():
        shutil.copy(s, t)
        n += 1
print(f'Leistungen: {n} Dateien aus dem Build ergänzt')
