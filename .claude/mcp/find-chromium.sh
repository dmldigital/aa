#!/usr/bin/env bash
# Gibt den Pfad zum vorinstallierten Chromium aus (Cloud-Container: /opt/pw-browsers).
# Überschreibbar mit CHROMIUM_PATH.
if [[ -n "${CHROMIUM_PATH:-}" ]]; then echo "$CHROMIUM_PATH"; exit 0; fi
for c in /opt/pw-browsers/chromium /opt/pw-browsers/chromium-*/chrome-linux/chrome \
         "$(command -v chromium 2>/dev/null)" "$(command -v google-chrome 2>/dev/null)"; do
  [[ -n "$c" && -x "$c" ]] && { echo "$c"; exit 0; }
done
exit 1
