#!/usr/bin/env python3
"""Setzt den Hero aus dem Astro-Build in die handbearbeitete Startseite (`index.html`) der Auswahl-Vorschau und legt die
Kopie `startseite-a/index.html` an (gleiche Startseite mit dem Vollbild-Hero, Variante A).

Alles außer dem Hero-Abschnitt bleibt, wie es in der handbearbeiteten Startseite steht (`data-header-lock` am Hero
bleibt erhalten). Das Skript des Heros wird ausgetauscht, nötige JS-Module aus dem Build werden ergänzt (nie überschrieben),
und CSS-Regeln für Klassen, die das Startseiten-CSS noch nicht kennt, kommen als eigener <style>-Block in den <head>.
Die Bildfolge des Videos (`public/hero-flug/`) kopiert das Skript nach `hero-flug/` in die Vorschau.

Vorbereitung: Build wie bei add-pages.py (SITE_URL=... BASE_PATH=/aa/meisterwerk-preview-auswahl/ astro build --outDir /tmp/studio-dist).
Aufruf:  python3 tools/meisterwerk-auswahl/hero-patch.py
"""
import re
import shutil
from pathlib import Path

D = Path(__file__).resolve().parents[2] / 'website/public/meisterwerk-preview-auswahl'
B = Path('/tmp/studio-dist')
PREFIX = '/aa/meisterwerk-preview-auswahl'

SECTION = re.compile(r'<section[^>]*\bdata-hero[\s>][\s\S]*?</section>')
SCRIPT = re.compile(r'(Hero(?:Full)?\.astro_astro_type_script_index_0_lang\.[\w-]+\.js)')


def esc(token):
    return re.sub(r'([^a-zA-Z0-9_-])', r'\\\1', token)


def parse_css(css):
    """Flache Liste (Umbruch-Regeln, Selektor, Inhalt) aller Regeln, @layer wird aufgelöst"""
    out = []

    def walk(text, wrappers):
        i = 0
        while i < len(text):
            j = text.find('{', i)
            if j < 0:
                break
            head = text[i:j].strip()
            depth, k = 1, j + 1
            while depth and k < len(text):
                depth += (text[k] == '{') - (text[k] == '}')
                k += 1
            body = text[j + 1:k - 1]
            if head.startswith('@layer'):
                walk(body, wrappers)
            elif head.startswith(('@media', '@supports')):
                walk(body, wrappers + [head])
            elif head.startswith('@'):
                pass
            else:
                out.append((wrappers, head, body))
            i = k

    walk(css, [])
    return out


def inline_css(html):
    return ''.join(re.findall(r'<style[^>]*>([\s\S]*?)</style>', html))


def build_css(html):
    css = inline_css(html)
    for f in re.findall(r'href="' + PREFIX + r'/(_astro/[^"?]+\.css)', html):
        p = B / f
        if p.is_file():
            css += p.read_text()
    return css


def missing_rules(section, base_html, built_html):
    have = inline_css(base_html)
    tokens = set()
    for c in re.findall(r'class="([^"]*)"', section):
        tokens.update(c.split())
    def known(css, t):
        # exakte Klasse: nach dem Namen darf kein weiteres Namens- oder Escape-Zeichen folgen (.bottom-7 ist nicht .bottom-7\.5)
        return re.search(re.escape('.' + esc(t)) + r'(?![\w\\-])', css) is not None

    need = [t for t in sorted(tokens) if not known(have, t) and not t.startswith(('astro-', 'js'))]
    rules = parse_css(build_css(built_html))
    css = []
    for t in need:
        key = '.' + esc(t)
        for wrappers, sel, body in rules:
            if re.search(re.escape(key) + r'(?![\w\\-])', sel):
                css.append((len(wrappers), ''.join(w + '{' for w in wrappers) + sel + '{' + body + '}' + '}' * len(wrappers)))
    # Reihenfolge wie bei Tailwind: Regeln ohne Medienabfrage zuerst, die Varianten (Breite, Bewegung) danach,
    # sonst überschreibt die allgemeine Regel die breitenabhängige
    css.sort(key=lambda r: r[0])
    return need, '\n'.join(dict.fromkeys(r[1] for r in css))


def copy_modules(chunk):
    """JS-Chunk samt aller importierten Module aus dem Build in die Vorschau (nie überschreiben)"""
    todo, seen = [chunk], set()
    while todo:
        n = todo.pop()
        if n in seen:
            continue
        seen.add(n)
        src = B / '_astro' / n
        if not src.is_file():
            continue
        dst = D / '_astro' / n
        if not dst.exists():
            shutil.copy(src, dst)
        todo += re.findall(r'["\']\./([\w.@-]+\.js)["\']', src.read_text())


def patch(base, built, target):
    sec = SECTION.search(built).group(0)
    assert 'data-header-lock' not in sec
    sec = sec.replace('<section data-hero', '<section data-header-lock data-hero', 1)
    assert len(SECTION.findall(base)) == 1
    out = SECTION.sub(lambda m: sec, base, count=1)
    chunk = SCRIPT.search(built).group(1)
    assert len(SCRIPT.findall(out)) == 1, 'Hero-Skript in der Startseite nicht eindeutig'
    out = SCRIPT.sub(chunk, out)
    copy_modules(chunk)
    need, css = missing_rules(sec, base, built)
    out = re.sub(r'<style data-hero-patch>[\s\S]*?</style>', '', out)
    if css:
        assert out.count('</head>') == 1
        out = out.replace('</head>', '<style data-hero-patch>' + css + '</style></head>')
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(out)
    print(f'{target.relative_to(D)}: Skript {chunk}, {len(need)} neue Klassen')


base = re.sub(r'<style data-hero-patch>[\s\S]*?</style>', '', (D / 'index.html').read_text())
patch(base, (B / 'index.html').read_text(), D / 'index.html')
patch(base, (B / 'startseite-a/index.html').read_text(), D / 'startseite-a/index.html')
# Bildfolge des Videos (alle Dateien des Builds, vorhandene gleichnamige werden ersetzt, die Bilder sind eine Einheit)
src, dst = B / 'hero-flug', D / 'hero-flug'
n = 0
for f in sorted(src.rglob('*.webp')):
    t = dst / f.relative_to(src)
    t.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy(f, t)
    n += 1
print(f'hero-flug: {n} Bilder')
