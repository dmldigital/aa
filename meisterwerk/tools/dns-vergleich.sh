#!/usr/bin/env bash
# Vergleicht die DNS-Antworten zweier Nameserver für meisterwerk-lb.de, Eintrag für Eintrag.
# Zweck: Vor dem Umstellen der Nameserver von IONOS auf Cloudflare sicherstellen, dass Cloudflare
# exakt dieselben Einträge liefert, vor allem alles, was die Microsoft-Mail braucht.
#
# Aufruf:  meisterwerk/tools/dns-vergleich.sh <IONOS-Nameserver> <Cloudflare-Nameserver> [Domain]
# Beispiel: meisterwerk/tools/dns-vergleich.sh ns1045.ui-dns.de ada.ns.cloudflare.com
# (Die IONOS-Nameserver zeigt: dig NS meisterwerk-lb.de +short; die Cloudflare-Nameserver stehen im Cloudflare-Dashboard.)
# Ergebnis: "GLEICH" oder "ABWEICHUNG" je Name und Typ, am Ende eine Zusammenfassung. Nur umschalten, wenn 0 Abweichungen.
set -u
OLD="${1:?IONOS-Nameserver angeben}"; NEW="${2:?Cloudflare-Nameserver angeben}"; D="${3:-meisterwerk-lb.de}"
command -v dig >/dev/null || { echo "dig fehlt (macOS: vorhanden, Linux: dnsutils, Windows: WSL oder BIND-Tools)"; exit 2; }

# Namen, die bei Microsoft 365, Resend und der Website üblich sind. Weitere Namen aus dem IONOS-Export unten anhängen.
NAMES="@ www autodiscover _dmarc selector1._domainkey selector2._domainkey sip lyncdiscover enterpriseregistration
enterpriseenrollment msoid _sip._tls _sipfederationtls._tcp _autodiscover._tcp mail ftp send resend._domainkey
formular _domainconnect"
NAMES="$NAMES ${EXTRA_NAMES:-}"
TYPES="A AAAA CNAME MX TXT SRV CAA"

diffs=0; same=0
for n in $NAMES; do
  fq=$([ "$n" = "@" ] && echo "$D" || echo "$n.$D")
  for t in $TYPES; do
    a=$(dig +short +norecurse "@$OLD" "$fq" "$t" 2>/dev/null | sort)
    b=$(dig +short +norecurse "@$NEW" "$fq" "$t" 2>/dev/null | sort)
    [ -z "$a" ] && [ -z "$b" ] && continue
    if [ "$a" = "$b" ]; then same=$((same+1)); printf 'GLEICH      %-40s %-5s %s\n' "$fq" "$t" "$(echo "$a" | tr '\n' ' ' | cut -c1-90)"
    else diffs=$((diffs+1)); printf 'ABWEICHUNG  %-40s %-5s\n    IONOS:      %s\n    Cloudflare: %s\n' "$fq" "$t" "$(echo "$a" | tr '\n' ' ')" "$(echo "$b" | tr '\n' ' ')"; fi
  done
done
echo; echo "Gleich: $same, Abweichungen: $diffs"
[ "$diffs" -eq 0 ] && echo "OK: Cloudflare liefert dieselben Einträge." || echo "STOPP: Erst angleichen, dann Nameserver umstellen."
exit $([ "$diffs" -eq 0 ] && echo 0 || echo 1)
