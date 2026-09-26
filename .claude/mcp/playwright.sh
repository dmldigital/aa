#!/usr/bin/env bash
# Startet Playwright MCP mit dem vorinstallierten Chromium (headless, über den Container-Proxy).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/browser-trust.sh" >&2 || true
args=(--headless --isolated --no-sandbox --caps vision,devtools
      --viewport-size 1440x900 --output-dir "${CLAUDE_PROJECT_DIR:-$PWD}/.playwright-mcp")
if chrome="$("$DIR/find-chromium.sh")"; then args+=(--executable-path "$chrome"); fi
if [[ -n "${HTTPS_PROXY:-}" ]]; then args+=(--proxy-server "$HTTPS_PROXY"); fi
exec npx -y @playwright/mcp@0.0.82 "${args[@]}" "$@"
