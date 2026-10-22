#!/usr/bin/env python3
"""Setzt den Hero aus dem Astro-Build in die handbearbeitete Startseite (`index.html`) der Auswahl-Vorschau und legt die
Kopie `startseite-a/index.html` an (gleiche Startseite mit dem Vollbild-Hero, Variante A).

Alles außer dem Hero-Abschnitt bleibt, wie es in der handbearbeiteten Startseite steht (`data-header-lock` am Hero
bleibt erhalten). Das Skript des Heros wird ausgetauscht, nötige JS-Module aus dem Build werden ergänzt (nie überschrieben),
und CSS-Regeln für Klassen, die das Startseiten-CSS noch nicht kennt, kommen als eigener <style>-Block in den <head>.
Die Bildfolge des Videos (`public/hero-flug/`) kopiert das Skript nach `hero-flug/` in die Vorschau.

Zusätzlich bringt es die gemeinsame Hülle der Seite auf den Stand der Quelle (Schritt `shell`): Kopfzeile mit schwebender
Menü-Schaltfläche, Menü, Fuß, deren Skripte (Menü, Fuß, Smart-Header) und die einheitlichen Buttons. Die Zonen mit
`data-header-lock` der handbearbeiteten Startseite bekommen zusätzlich `data-no-header` (dort bleibt die Kopfzeile weg, die
Menü-Schaltfläche springt ein), das alte `HeaderLock.js/css` wird nicht mehr eingebunden. Alles andere bleibt, wie es dort steht.

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
    # Regeln ohne Klassen-Selektor, die zum Hero gehören (Zustand der Bewertung, `data-rating`)
    for wrappers, sel, body in rules:
        if 'data-rating' in sel:
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



def regions(text, tag):
    return list(re.finditer(r'<%s\b[\s\S]*?</%s>' % (tag, tag), text))


def lone(text, pattern):
    m = re.findall(pattern, text)
    assert len(m) == 1, (pattern, len(m))
    return re.search(pattern, text)


def shell(base, built):
    """Hülle (Kopfzeile, Menü, Fuß, Skripte, Buttons) der handbearbeiteten Startseite auf den Stand des Builds bringen"""
    h = base
    parts = []

    # Menü-Flächen und Fuß: Austausch gegen die Fassung aus dem Build
    for tag in ['dialog', 'footer']:
        ro, rn = regions(h, tag), regions(built, tag)
        assert len(ro) == len(rn), (tag, len(ro), len(rn))
        for a, b in reversed(list(zip(ro, rn))):
            h = h[:a.start()] + b.group(0) + h[a.end():]
        parts += [b.group(0) for b in rn]

    # Smart-Kopfzeile samt schwebender Menü-Schaltfläche
    new_head = lone(built, r'<header data-smart-header[\s\S]*?</header>\s*<button[^>]*data-float-menu[\s\S]*?</button>').group(0)
    old_head = lone(h, r'<header data-smart-header[\s\S]*?</header>(?:\s*<button[^>]*data-float-menu[\s\S]*?</button>)?').group(0)
    h = h.replace(old_head, new_head, 1)
    parts.append(new_head)

    # Inline-Skript der Smart-Kopfzeile
    inl = r'<script type="module">((?:(?!</script>)[\s\S])*?data-smart-header(?:(?!</script>)[\s\S])*?)</script>'
    new_js = lone(built, inl).group(1)
    old_js = lone(h, inl).group(1)
    h = h.replace(old_js, new_js, 1)

    # Menü- und Fuß-Skripte (Chunks) auf den Stand des Builds, handbearbeitete Chunks (mit ?v=) bleiben
    for name in ['Menu', 'Footer']:
        pat = r'_astro/%s\.astro_astro_type_script_index_0_lang\.([\w-]+)\.js' % name
        new = re.search(pat, built).group(0)
        h = re.sub(pat + r'(?!\?v=)', new, h)
        copy_modules(new.split('/')[-1])

    # Schaltflächen wie in der Quelle: Großschreibung über die Klasse, kein "↗", eigene Buttons der Startseite ersetzen
    def btn(label, href=None, tag='a', extra=''):
        cls = ('group/ul inline-block cursor-pointer border text-center font-display text-button font-semibold tracking-button uppercase '
               'px-5 py-3.25 md:px-6.25 lg:px-7.5 lg:py-3.75 border-black bg-white text-black')
        inner = '<span class="flex justify-center gap-1.25"><span class="underline-anim [--underline-gap:3px]">%s</span></span>' % label
        if tag == 'a':
            return '<a href="%s" class="%s"%s>%s</a>' % (href, cls, extra, inner)
        return '<button type="submit" class="%s"%s>%s</button>' % (cls, extra, inner)

    lk = '<a class="lk-btn" href="%s/meisterwerk-exklusive/">Zu Meisterwerk Exklusive <span aria-hidden="true">↗</span></a>' % PREFIX
    if lk in h:
        h = h.replace(lk, btn('Zu Meisterwerk Exklusive', PREFIX + '/meisterwerk-exklusive/', extra=' data-lk-stretch'))
    mz = '<button type="submit" class="mz-btn">Nachricht senden</button>'
    if mz in h:
        h = h.replace(mz, btn('Nachricht senden', tag='button'))

    def up(m):
        c = m.group(0)
        return c if 'uppercase' in c else c.replace(' tracking-button', ' tracking-button uppercase', 1)

    h = re.sub(r'class="[^"]*\bborder text-center\b[^"]*"', up, h)
    h = h.replace(' ↗</span></span></a>', '</span></span></a>')

    # Zonen mit Kopfzeilen-Sperre: wie `data-no-header` der Quelle behandeln, altes HeaderLock nicht mehr einbinden
    # Nur dort, wo die Kopfzeile Inhalt verdecken würde (gemessen: Hero, Willkommen-Szene, Fachsektion mit Tabs). In der
    # Leistungs-Szene und den Zonen der FAQ bleibt der obere Rand frei, dort darf die Kopfzeile beim Hochscrollen kommen.
    def lock(m):
        tag = m.group(0)
        if 'data-no-header' in tag or not re.search(r'data-(?:hero|welcome-scene|tb)\b', tag):
            return tag
        return tag.replace('data-header-lock', 'data-header-lock data-no-header', 1)

    h = h.replace('data-header-lock data-no-header', 'data-header-lock')  # frühere Läufe zurücknehmen
    h = re.sub(r'<(?:section|div)\b[^>]*data-header-lock[^>]*>', lock, h)
    h = re.sub(r'<link[^>]*HeaderLock\.css[^>]*>', '', h)
    h = re.sub(r'<script[^>]*HeaderLock\.js[^>]*></script>', '', h)

    # Fehlende Tailwind-Regeln für die ersetzten Teile
    h = re.sub(r'<style data-shell-patch>[\s\S]*?</style>', '', h)
    need, css = missing_rules('\n'.join(parts) + '\n<span class="uppercase px-5 py-3.25 md:px-6.25 lg:px-7.5 lg:py-3.75 border-black bg-white text-black">', h, built)
    extra = '.transition-\\[transform\\,opacity\\,visibility\\]{transition-property:transform,opacity,visibility;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}[data-lk-stretch]::after{content:"";position:absolute;inset:0}'
    assert h.count('</head>') == 1
    h = h.replace('</head>', '<style data-shell-patch>' + css + '\n' + extra + '</style></head>')
    print(f'Hülle: {len(need)} neue Klassen, Kopf, Menü, Fuß und Skripte aktualisiert')
    return h


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


base = re.sub(r'<style data-(?:hero|shell)-patch>[\s\S]*?</style>', '', (D / 'index.html').read_text())
base = shell(base, (B / 'index.html').read_text())
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
