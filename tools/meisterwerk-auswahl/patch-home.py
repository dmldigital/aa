"""Patcht die handbearbeitete Startseite der Auswahl-Vorschau auf den Stand der Quelle (Buttons, Sticker, Kopf, Menü, Fuß).

Schreibt NUR in die Ausgabedatei, die Startseite selbst wird nicht verändert (sie ist von Hand bearbeitet, siehe
docs/meisterwerk-auswahl.md). Voraussetzung: gebauter Stand in /tmp/studio-dist (siehe add-pages.py).
Aufruf:  python3 tools/meisterwerk-auswahl/patch-home.py /tmp/index.neu.html
Danach prüfen (Testkopie des Ordners, Screenshots) und erst nach Freigabe als index.html einspielen.
"""
import re
import sys
from pathlib import Path

SRC = Path(__file__).resolve().parents[2] / 'website/public/meisterwerk-preview-auswahl/index.html'
OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/index.neu.html'
h = SRC.read_text()
new = open('/tmp/studio-dist/index.html').read()


def regions(s, tag):
    return list(re.finditer(r'<%s\b[\s\S]*?</%s>' % (tag, tag), s))


# 1. Kopf, Menü-Panels (dialog) und Fuß aus dem neuen Build übernehmen (Unterschiede dort sind nur die Button-Änderungen)
for tag in ['header', 'footer', 'dialog']:
    ro, rn = regions(h, tag), regions(new, tag)
    assert len(ro) == len(rn), (tag, len(ro), len(rn))
    for a, b in reversed(list(zip(ro, rn))):
        h = h[:a.start()] + b.group(0) + h[a.end():]

# 2. Hero-Button ohne Pfeil
assert h.count('PROJEKT ANFRAGEN ↗') == 1
h = h.replace('PROJEKT ANFRAGEN ↗', 'Projekt anfragen')


# 3. Standard-Button für die eigenen Buttons der Startseite (lk-btn, mz-btn)
def btn(label, href=None, tag='a', extra=''):
    cls = ('group/ul inline-block cursor-pointer border text-center font-display text-button font-semibold '
           'tracking-button uppercase px-5 py-3.25 md:px-6.25 lg:px-7.5 lg:py-3.75 border-black bg-white text-black')
    inner = '<span class="flex justify-center gap-1.25"><span class="underline-anim [--underline-gap:3px]">%s</span></span>' % label
    if tag == 'a':
        return '<a href="%s" class="%s"%s>%s</a>' % (href, cls, extra, inner)
    return '<button type="submit" class="%s"%s>%s</button>' % (cls, extra, inner)


old_lk = '<a class="lk-btn" href="/aa/meisterwerk-preview-auswahl/meisterwerk-exklusive/">Zu Meisterwerk Exklusive <span aria-hidden="true">↗</span></a>'
assert h.count(old_lk) == 1
h = h.replace(old_lk, btn('Zu Meisterwerk Exklusive', '/aa/meisterwerk-preview-auswahl/meisterwerk-exklusive/', extra=' data-lk-stretch'))
old_mz = '<button type="submit" class="mz-btn">Nachricht senden</button>'
assert h.count(old_mz) == 1
h = h.replace(old_mz, btn('Nachricht senden', tag='button'))


# 4. übrige Buttons: Großschreibung über die Klasse (wie in der Komponente)
def up(m):
    c = m.group(0)
    if 'uppercase' in c:
        return c
    return c.replace(' tracking-button', ' tracking-button uppercase', 1)


h = re.sub(r'class="[^"]*\bborder text-center\b[^"]*"', up, h)

# 5. Sticker-Skript auf den neuen Stand
assert h.count('Footer.astro_astro_type_script_index_0_lang.C1mWPvuM.js') == 1
h = h.replace('Footer.astro_astro_type_script_index_0_lang.C1mWPvuM.js', 'Footer.astro_astro_type_script_index_0_lang.BnCDx_KB.js')

# 6. Regeln, die das Startseiten-CSS für die neuen Klassen noch nicht kennt (Sticker-Übergang, ganze Karte klickbar)
extra = ('<style>.transition-\\[transform\\,opacity\\,visibility\\]{transition-property:transform,opacity,visibility;'
         'transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));'
         'transition-duration:var(--tw-duration,var(--default-transition-duration))}'
         '[data-lk-stretch]::after{content:"";position:absolute;inset:0}</style>')
assert h.count('</head>') == 1
h = h.replace('</head>', extra + '</head>')

open(OUT, 'w').write(h)
print('ok', len(h))
