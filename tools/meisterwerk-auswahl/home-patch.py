#!/usr/bin/env python3
"""Setzt die Startseiten-Sektionen nach den Leistungen (Fachsektion, „Jede Oberfläche ist einzigartig“ mit Projekten, FAQ)
aus dem Astro-Build in die handbearbeitete Startseite der Auswahl-Vorschau. Quelle: meisterwerk/src/components/home/
(`Fachsektion.astro`, `OberflaecheProjekte.astro`, `FaqTabs.astro`), Skripte scripts/home/, Gestaltung styles/home/.

Ersetzt den Bereich ab der Fachsektion bis zum Ende von <main> durch die Fassung aus dem Build, bindet die Skripte der
Komponenten ein (Chunks samt Modulen, nie überschreibend), entfernt die früheren Handdateien (TabsFade, CtaReveal,
FaqCover) und ergänzt Tailwind-Regeln für Klassen, die das Startseiten-CSS noch nicht kennt (`<style data-home-patch>`).
Das Layout-Skript (Akkordeons) kommt ebenfalls aus dem Build, damit alles dieselbe GSAP-/ScrollTrigger-Instanz nutzt.

Vorbereitung: Build wie bei hero-patch.py. Aufruf:  python3 tools/meisterwerk-auswahl/home-patch.py
"""
import re
import shutil
from pathlib import Path

src = (Path(__file__).parent / 'hero-patch.py').read_text()
ns = {'__file__': str(Path(__file__).parent / 'hero-patch.py')}
exec(compile(src[:src.index('\nbase = re.sub(')], 'hero-patch.py', 'exec'), ns)
D, B, PREFIX = ns['D'], ns['B'], ns['PREFIX']

built = (B / 'index.html').read_text()
page = (D / 'index.html').read_text()

# Bereich im Build: ab dem ersten Stylesheet der Komponenten (direkt vor der Fachsektion) bis </main>
b0 = built.index('<section data-no-autolink data-tb')
link = built.rfind('<link rel="stylesheet"', 0, b0)
if link >= 0 and built[link:b0].count('<') == 1:
    b0 = link
new = built[b0:built.index('</main>', b0)]
new = re.sub(r'<script[^>]*></script>', '', new)

# Bereich in der Startseite: ab der Fachsektion (alt: `<section data-tb data-header-lock`, neu: schon übernommen) bis </main>
m = re.search(r'(<link rel="stylesheet" href="[^"]*_astro/tabs\.[^"]*">)?<section (data-no-autolink )?data-tb', page)
p0 = m.start()
page = page[:p0] + new + page[page.index('</main>', p0):]

# Willkommen-Szene (WelcomeScroll mit `home`): Abschnitt samt Stylesheet aus dem Build, Skript mit Kette, Zoom und Handy-Wachstum
w0 = built.index('<section data-section="53bda50"')
wl = built.rfind('<link rel="stylesheet"', 0, w0)
if wl >= 0 and built[wl:w0].count('<') == 1:
    w0 = wl
w1 = built.index('</section>', w0) + len('</section>')
wnew = built[w0:w1]
pm = re.search(r'(<link rel="stylesheet" href="[^"]*_astro/welcome\.[^"]*">)?<section data-section="53bda50"[\s\S]*?</section>', page)
page = page[:pm.start()] + wnew + page[pm.end():]
for name in ('WelcomeChain', 'WelcomeZoom'):
    page = re.sub(r'<link[^>]*_astro/%s\.css[^>]*>' % name, '', page)
    page = re.sub(r'<script[^>]*_astro/%s\.js[^>]*></script>' % name, '', page)
page = re.sub(r'<script[^>]*_astro/WelcomeScroll\.astro_astro_type_script[^>]*></script>', '', page)
wchunk = re.search(r'_astro/(WelcomeScroll\.astro_astro_type_script_index_0_lang\.[\w-]+\.js)', built).group(1)
page = page.replace('</body>', '<script type="module" src="%s/_astro/%s"></script></body>' % (PREFIX, wchunk), 1)
ns['copy_modules'](wchunk)
new_w = wnew

# Frühere Handdateien nicht mehr einbinden
for name in ('TabsFade', 'CtaReveal', 'FaqCover'):
    page = re.sub(r'<link[^>]*_astro/%s\.css[^>]*>' % name, '', page)
    page = re.sub(r'<script[^>]*_astro/%s\.js[^>]*></script>' % name, '', page)
page = re.sub(r'<script[^>]*_astro/Projects\.astro_astro_type_script[^>]*></script>', '', page)

# Skripte der Komponenten und Layout aus dem Build
chunks = re.findall(r'_astro/((?:Fachsektion|OberflaecheProjekte|FaqTabs|Layout)\.astro_astro_type_script_index_\d_lang\.[\w-]+\.js)', built)
for c in dict.fromkeys(chunks):
    stem = c.split('_lang.')[0]
    page = re.sub(r'<script[^>]*_astro/%s_lang\.[\w-]+\.js[^>]*></script>' % re.escape(stem), '', page)
    page = page.replace('</body>', '<script type="module" src="%s/_astro/%s"></script></body>' % (PREFIX, c), 1)
    ns['copy_modules'](c)

# Dateien des Bereichs (Bilder, Stylesheets)
n = 0
for f in sorted(set(re.findall(r'%s/(_astro/[\w./@%%-]+)' % re.escape(PREFIX), new + new_w))):
    s, t = B / f, D / f
    if s.is_file() and not t.exists():
        shutil.copy(s, t)
        n += 1

page = re.sub(r'<style data-home-patch>[\s\S]*?</style>', '', page)
need, css = ns['missing_rules'](new + new_w, page, built)
page = page.replace('</head>', '<style data-home-patch>' + css + '</style></head>', 1)
(D / 'index.html').write_text(page)
print(f'Startseite: Bereich ab Fachsektion ersetzt, Skripte {len(set(chunks))}, {len(need)} Klassen ergänzt, {n} Dateien kopiert')
