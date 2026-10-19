#!/bin/bash
# Regressionsprüfung: Build (Vorschau-Basis), Vollseiten-Screenshots aller Seiten in 3 Breiten, Vergleich mit der Baseline.
# Nutzung (aus meisterwerk/):  tools/checkall.sh            -> vergleicht tools/shots/neu mit tools/shots/basis
#   Baseline anlegen: Stand, der als richtig gilt, bauen und `npx astro preview --port 4600 --base /aa/meisterwerk-preview/`
#   starten, dann `PW=$(npm root -g)/playwright node tools/regall.js tools/shots/basis`.
# Bekanntes Rauschen: nur das Hero-Wort auf / und /meisterwerk-exklusive/ (y≈802 Desktop, 670 Handy, 464 Tablet).
set -e
cd "$(dirname "$0")/.."
touch src/styles/global.css
SITE_URL=https://dmldigital.github.io BASE_PATH=/aa/meisterwerk-preview/ npx astro build | grep -iE "error|page\(s\)" | tail -3
rm -rf tools/shots/neu
PW=$(npm root -g)/playwright node tools/regall.js tools/shots/neu
python3 tools/cmpall.py tools/shots/basis tools/shots/neu
