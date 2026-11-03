#!/usr/bin/env python3
"""Gleicht die Design-Token der handbearbeiteten Startseite (`index.html`) mit dem Astro-Build ab:
- alle `--text-*`-Werte (Schriftgrößen, Zeilenhöhen, Laufweiten) und `--tracking-*` werden aus dem Build übernommen,
- die Gewichts-Variablen des Handys (`@media … { :root { --font-weight-* } }`, Quelle `src/styles/global.css`) kommen als
  `<style data-tokens-patch>` in den <head>.
Die Unterseiten brauchen das nicht, ihr CSS (`PageLayout.*.css`) kommt direkt aus dem Build.

Vorbereitung: Build wie bei hero-patch.py. Aufruf:  python3 tools/meisterwerk-auswahl/tokens-patch.py
"""
import re
from pathlib import Path

D = Path(__file__).resolve().parents[2] / 'website/public/meisterwerk-preview-auswahl'
B = Path('/tmp/studio-dist')

html = (B / 'index.html').read_text()
css = ''
for f in re.findall(r'href="/aa/meisterwerk-preview-auswahl/(_astro/PageLayout\.[^"]+\.css)"', html):
    css += (B / f).read_text()
assert css, 'PageLayout-CSS im Build nicht gefunden'

tokens = dict(re.findall(r'(--(?:text|tracking)-[\w-]+):([^;}]+);', css))
page = (D / 'index.html').read_text()
n = 0
def put(m):
    global n
    name = m.group(1)
    if name in tokens and tokens[name].strip() != m.group(2).strip():
        n += 1
        return f'{name}:{tokens[name].strip()};'
    return m.group(0)
page = re.sub(r'(--(?:text|tracking)-[\w-]+):([^;}]+);', put, page)

page = re.sub(r'<style data-tokens-patch>[\s\S]*?</style>', '', page)
media = re.findall(r'@media[^{]*\{:root\{[^}]*--font-weight[^}]*\}(?:strong,b\{[^}]*\})?\}', css)
space = re.findall(r'(?::root\{--space-section:[^}]*\}|@media[^{]*\{:root\{--space-[^}]*\}\})', css)
assert space, 'Abstands-Variablen im Build nicht gefunden'
assert media, 'Gewichts-Variablen des Handys im Build nicht gefunden'
page = page.replace('</head>', '<style data-tokens-patch>' + ''.join(space) + ''.join(media) + '</style></head>', 1)
(D / 'index.html').write_text(page)
print(f'Token: {n} Werte angeglichen, {len(media)} Medienregel(n) für Gewichte, {len(space)} Abstands-Regeln')
