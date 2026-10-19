#!/usr/bin/env bash
# Startet einen lokalen Server unter http://localhost:4399/aa/meisterwerk-preview-auswahl/ (Pfad wie auf GitHub Pages).
# Stoppen:  kill $(lsof -ti:4399)      (nicht pkill -f verwenden)
set -e
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
DIR="${TMPDIR:-/tmp}/meisterwerk-serve"
mkdir -p "$DIR"
ln -sfn "$ROOT/website/public" "$DIR/aa"
cd "$DIR"
nohup python3 -m http.server 4399 >/dev/null 2>&1 &
sleep 1
curl -s -o /dev/null -w "Server: HTTP %{http_code}\n" http://localhost:4399/aa/meisterwerk-preview-auswahl/
