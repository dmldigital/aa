#!/bin/bash
# Vorschau auf GitHub Pages: baut mit passender Basis und legt NUR den Vorschau-Ordner per temporärem Worktree auf den
# Pages-Branch (website/public/<Ordner>), die Hauptvorschau bleibt unberührt.
#
# Standard (Auswahl): Ordner meisterwerk-preview-auswahl mit nur den genannten Seiten und deren Bildern.
#   meisterwerk/tools/deploy-preview.sh "Commit-Text" [Seite ...]      Seiten als Pfad, Standard: / /leistungen/
# Ganze Seite in die Hauptvorschau (nur auf ausdrücklichen Wunsch):
#   meisterwerk/tools/deploy-preview.sh "Commit-Text" --voll
set -e
MSG="${1:-Vorschau Meisterwerk aktualisiert}"; shift || true
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PAGES=claude/poolbau-koch-website-408frj
if [ "$1" = "--voll" ]; then DIR=meisterwerk-preview; PAGELIST=""; else DIR=meisterwerk-preview-auswahl; PAGELIST="${*:-/ /leistungen/}"; fi
cd "$ROOT/meisterwerk"
SITE_URL=https://dmldigital.github.io BASE_PATH="/aa/$DIR/" npx astro build | grep -iE "error|page\(s\)" | tail -3
OUT=/tmp/preview-out; rm -rf "$OUT"
if [ -z "$PAGELIST" ]; then cp -r dist "$OUT"; else
  mkdir -p "$OUT"
  for p in $PAGELIST; do mkdir -p "$OUT$p"; cp "dist$p/index.html" "$OUT$p/index.html"; done
  # Dateien kopieren, die die gewählten Seiten (HTML) oder Skripte und Styles tatsächlich nennen
  python3 - "$DIR" "$OUT" <<'PY'
import os, re, shutil, sys
d, out = sys.argv[1], sys.argv[2]
src = 'dist'
need = set()
def scan(text):
    for m in re.findall(r'/aa/%s/([\w./@%%-]+)' % re.escape(d), text):
        need.add(m.split('?')[0].split('#')[0])
for r, _, fs in os.walk(out):
    for f in fs:
        if f.endswith('.html'): scan(open(os.path.join(r, f), errors='ignore').read())
for _ in range(3):
    for n in list(need):
        if n.endswith(('.js', '.css')) and os.path.exists(os.path.join(src, n)):
            scan(open(os.path.join(src, n), errors='ignore').read())
            base = os.path.dirname(os.path.join(src, n))
            for m in re.findall(r'["\'(]\.?/?([\w./@%-]+\.(?:woff2?|js|css|avif|webp|png|jpe?g|svg))', open(os.path.join(src, n), errors='ignore').read()):
                p = os.path.normpath(os.path.join(base, m))
                if os.path.exists(p): need.add(os.path.relpath(p, src))
for n in need:
    s = os.path.join(src, n)
    if os.path.isfile(s):
        t = os.path.join(out, n); os.makedirs(os.path.dirname(t), exist_ok=True); shutil.copy(s, t)
for extra in ('favicon.png',):
    if os.path.exists(os.path.join(src, extra)): shutil.copy(os.path.join(src, extra), out)
print('Dateien:', sum(len(f) for _, _, f in os.walk(out)))
PY
fi
cd "$ROOT"
git fetch -q origin "$PAGES"
rm -rf /tmp/pages-wt && git worktree add -q -B deploy-tmp /tmp/pages-wt "origin/$PAGES"
rm -rf "/tmp/pages-wt/website/public/$DIR"
cp -r "$OUT" "/tmp/pages-wt/website/public/$DIR"
cd /tmp/pages-wt
git add -A "website/public/$DIR"
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "$MSG"
git push -q origin "deploy-tmp:$PAGES"
cd "$ROOT" && git worktree remove --force /tmp/pages-wt && git branch -D deploy-tmp -q
echo "Vorschau hochgeladen: https://dmldigital.github.io/aa/$DIR/"
