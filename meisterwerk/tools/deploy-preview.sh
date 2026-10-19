#!/bin/bash
# Vorschau auf GitHub Pages aktualisieren: baut mit Basis /aa/meisterwerk-preview/, legt nur diesen Ordner per
# temporärem Worktree auf den Pages-Branch (website/public/meisterwerk-preview) und pusht ihn.
# Nutzung (aus dem Repo-Wurzelordner oder meisterwerk/):  meisterwerk/tools/deploy-preview.sh "Commit-Text"
set -e
MSG="${1:-Vorschau Meisterwerk aktualisiert}"
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
PAGES=claude/poolbau-koch-website-408frj
cd "$ROOT/meisterwerk"
SITE_URL=https://dmldigital.github.io BASE_PATH=/aa/meisterwerk-preview/ npx astro build | grep -iE "error|page\(s\)" | tail -3
cd "$ROOT"
git fetch -q origin "$PAGES"
rm -rf /tmp/pages-wt && git worktree add -q -B deploy-tmp /tmp/pages-wt "origin/$PAGES"
rm -rf /tmp/pages-wt/website/public/meisterwerk-preview
cp -r meisterwerk/dist /tmp/pages-wt/website/public/meisterwerk-preview
cd /tmp/pages-wt
git add -A website/public/meisterwerk-preview
git -c user.name="Claude" -c user.email="noreply@anthropic.com" commit -q -m "$MSG"
git push -q origin "deploy-tmp:$PAGES"
cd "$ROOT" && git worktree remove --force /tmp/pages-wt && git branch -D deploy-tmp -q
echo "Vorschau hochgeladen: https://dmldigital.github.io/aa/meisterwerk-preview/"
