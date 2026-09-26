#!/usr/bin/env bash
# Lässt Chromium dem TLS-Proxy des Claude-Cloud-Containers vertrauen, indem dessen CA
# in den NSS-Zertifikatsspeicher (~/.pki/nssdb) eingetragen wird. Idempotent.
# Außerhalb des Cloud-Containers (keine Proxy-CA vorhanden) passiert nichts.
set -uo pipefail
CA=/root/.ccr/agent-proxy-ca.crt
[[ -f "$CA" ]] || exit 0
DB="$HOME/.pki/nssdb"
if ! command -v certutil >/dev/null 2>&1; then
  (apt-get install -y -qq libnss3-tools || { apt-get update -qq && apt-get install -y -qq libnss3-tools; }) >/dev/null 2>&1
fi
command -v certutil >/dev/null 2>&1 || { echo "browser-trust: certutil fehlt" >&2; exit 0; }
mkdir -p "$DB"
[[ -f "$DB/cert9.db" ]] || certutil -N -d "sql:$DB" --empty-password
certutil -L -d "sql:$DB" -n ccr-agent-proxy >/dev/null 2>&1 \
  || certutil -A -d "sql:$DB" -n ccr-agent-proxy -t "C,," -i "$CA"
