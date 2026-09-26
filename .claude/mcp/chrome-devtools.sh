#!/usr/bin/env bash
# Startet Chrome DevTools MCP mit dem vorinstallierten Chromium (headless, über den Container-Proxy).
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
"$DIR/browser-trust.sh" >&2 || true
args=(--headless --isolated --viewport 1440x900 --no-usage-statistics --no-performance-crux --no-page-id-routing
      --chromeArg=--no-sandbox --chromeArg=--disable-setuid-sandbox
      --workspace "${CLAUDE_PROJECT_DIR:-$PWD}")
if chrome="$("$DIR/find-chromium.sh")"; then args+=(--executablePath "$chrome"); fi
if [[ -n "${HTTPS_PROXY:-}" ]]; then args+=(--proxyServer "$HTTPS_PROXY"); fi
exec npx -y chrome-devtools-mcp@1.10.1 "${args[@]}" "$@"
