# DNS-Einträge von IONOS für meisterwerk-lb.de

Hier werden **alle** Einträge der DNS-Zone bei IONOS erfasst, so wie sie heute sind (Fotos oder Screenshots abtippen oder der Cloud-Sitzung
schicken, sie füllt die Tabelle). Aus dieser Liste legt die lokale Sitzung die Zone in Cloudflare an. Nichts weglassen, auch Unterdomains.

Stand der Erfassung: ____ (Datum)

## Nameserver und DNSSEC heute
- Nameserver bei IONOS: ____ , ____
- DNSSEC aktiv: ja / nein

## Einträge
| Name (Host) | Typ | Wert | TTL | Priorität (MX) | Cloudflare |
|---|---|---|---|---|---|
| `@` | A |  |  |  | Nur DNS |
| `www` | CNAME / A |  |  |  | Nur DNS |
| `@` | MX |  |  |  | Nur DNS |
| `@` | TXT (SPF, `v=spf1 …`) |  |  |  | Nur DNS |
| `@` | TXT (`MS=…`, Microsoft) |  |  |  | Nur DNS |
| `autodiscover` | CNAME |  |  |  | Nur DNS |
| `selector1._domainkey` | CNAME |  |  |  | Nur DNS |
| `selector2._domainkey` | CNAME |  |  |  | Nur DNS |
| `_dmarc` | TXT |  |  |  | Nur DNS |
|  |  |  |  |  |  |

Regeln: Werte exakt wie bei IONOS, nur **einen** SPF-Eintrag auf `@`, alle Mail-Einträge "Nur DNS" (graue Wolke).
