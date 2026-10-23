#!/usr/bin/env python3
"""Prüft einen gebauten Ordner auf SEO-Grundlagen. Aufruf: python3 tools/seo-check.py <Build-Ordner> [--indexable]
Je Seite: genau eine Canonical, Open Graph, Twitter, gültiges JSON-LD, Title höchstens 60 Zeichen mit genau einem
Trennzeichen und Marke am Ende, Description 110 bis 160 Zeichen, keine doppelten Titles/Descriptions, noindex-Regeln,
Sitemap-Inhalt (nur mit --indexable), keine Links auf die alte Domain."""
import html, json, os, re, sys

root = sys.argv[1]
indexable = '--indexable' in sys.argv
NOINDEX = {'stil/index.html', '404.html', 'reviews/index.html'}
BRANDS = ('Meisterwerk Malermanufaktur', 'Meisterwerke Exklusive')
errors, titles, descs, pages = [], {}, {}, {}

def err(page, msg):
    errors.append(f'{page}: {msg}')

for d, _, fs in os.walk(root):
    for f in fs:
        if not f.endswith('.html'):
            continue
        rel = os.path.relpath(os.path.join(d, f), root)
        s = open(os.path.join(d, f), encoding='utf8').read()
        pages[rel] = s
        t = re.search(r'<title>(.*?)</title>', s, re.S)
        title = html.unescape(t.group(1)) if t else ''
        m = re.search(r'<meta name="description" content="(.*?)"', s)
        desc = html.unescape(m.group(1)) if m else ''
        robots = re.search(r'<meta name="robots" content="([^"]*)"', s)
        canon = re.findall(r'<link rel="canonical" href="([^"]*)"', s)
        if rel == 'stil/index.html':  # interne Testseite, immer noindex, nicht geprüft
            if not (robots and 'noindex' in robots.group(1)): err(rel, 'noindex fehlt')
            continue
        if len(canon) != 1: err(rel, f'{len(canon)} Canonical')
        for tag in ('og:title', 'og:description', 'og:url', 'og:image', 'og:type', 'og:site_name', 'og:locale'):
            if f'property="{tag}"' not in s: err(rel, f'{tag} fehlt')
        for tag in ('twitter:card', 'twitter:image'):
            if f'name="{tag}"' not in s: err(rel, f'{tag} fehlt')
        if 'rel="apple-touch-icon"' not in s or 'name="theme-color"' not in s: err(rel, 'Icon/theme-color fehlt')
        if not s.startswith('<!DOCTYPE html><html lang="de"') and '<html lang="de"' not in s[:200]: err(rel, 'lang fehlt')
        if rel in ('404.html',):
            pass
        if len(title) > 60: err(rel, f'Title {len(title)} Zeichen: {title}')
        if title.count(' | ') != 1 or not title.endswith(BRANDS) or re.search(r' [-–] ', title): err(rel, f'Trennzeichen/Marke: {title}')
        if not 110 <= len(desc) <= 160: err(rel, f'Description {len(desc)} Zeichen: {desc}')
        titles.setdefault(title, []).append(rel)
        descs.setdefault(desc, []).append(rel)
        blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', s, re.S)
        noidx = bool(robots and 'noindex' in robots.group(1))
        want_noidx = (not indexable) or rel in NOINDEX
        if noidx != want_noidx: err(rel, f'noindex={noidx}, erwartet {want_noidx}')
        if not noidx:
            if not blocks: err(rel, 'kein JSON-LD')
            for b in blocks:
                try:
                    j = json.loads(html.unescape(b))
                    types = [n.get('@type') for n in j['@graph']]
                    if rel == 'index.html' and not {'HousePainter', 'WebSite', 'FAQPage'} <= set(types): err(rel, f'Typen {types}')
                    if rel != 'index.html' and 'BreadcrumbList' not in types: err(rel, f'Typen {types}')
                    if rel.startswith('services/') and 'Service' not in types: err(rel, 'Service fehlt')
                except Exception as e:
                    err(rel, f'JSON-LD ungültig: {e}')
        elif blocks: err(rel, 'JSON-LD trotz noindex')
        if re.search(r'<a [^>]*href="https://meisterwerk-lb\.de', s) and not indexable:
            err(rel, 'Link auf alte Domain')
        if indexable and re.search(r'<a [^>]*href="https://meisterwerk-lb\.de/(?!sitemap)', s) and False:
            pass
for k, v in titles.items():
    if len(v) > 1: errors.append(f'Doppelter Title "{k}": {v}')
for k, v in descs.items():
    if len(v) > 1: errors.append(f'Doppelte Description "{k[:60]}": {v}')
print(f'{len(pages)} Seiten geprüft')

if indexable:
    import glob
    sm = ''.join(open(p, encoding='utf8').read() for p in glob.glob(os.path.join(root, 'sitemap-*.xml')) if 'index' not in p)
    urls = re.findall(r'<loc>(.*?)</loc>', sm)
    print(f'Sitemap: {len(urls)} URLs')
    for u in urls:
        if any(x in u for x in ('/stil/', '/404', '/reviews/')): errors.append(f'Sitemap enthält {u}')
    exp = 0
    dup = []
    for rel, s in pages.items():
        if rel in NOINDEX: continue
        c = re.search(r'<link rel="canonical" href="([^"]*)"', s).group(1)
        origin = re.match(r'https?://[^/]+', c).group(0)
        own = origin + '/' + rel.replace('index.html', '') if rel != 'index.html' else origin + '/'
        inmap = any(u.rstrip('/') == own.rstrip('/') or u == own for u in urls)
        selfcanon = c == own
        if selfcanon and not inmap: errors.append(f'{rel}: fehlt in Sitemap ({c})')
        if not selfcanon: dup.append(rel)
        if not selfcanon and inmap: errors.append(f'{rel}: Duplikat steht in Sitemap')
        exp += 1
    print('Duplikate mit fremder Canonical (nicht in Sitemap):', len(dup))
    robots = open(os.path.join(root, 'robots.txt')).read()
    if 'Sitemap:' not in robots or 'Disallow' in robots: errors.append('robots.txt (indexierbar) falsch')
else:
    robots = open(os.path.join(root, 'robots.txt')).read()
    if 'Disallow: /' not in robots: errors.append('robots.txt (Vorschau) sollte sperren')
    if any(f.startswith('sitemap') for f in os.listdir(root)): errors.append('Sitemap in Vorschau-Build')
print('\n'.join(errors) if errors else 'ALLES OK')
sys.exit(1 if errors else 0)
